// src/forms.test.js
//
// The form layout contract, which is the part of Forma that fails silently.
//
// A form whose grid is not applied still renders: every field is present, every
// label is right, every value round-trips. It just stacks. There is no error to
// see and no assertion that a normal test would trip, which is how Domma CMS
// shipped three renderers that forwarded `layout` and `columns` to F.render for
// a single-step form and to nothing at all for a wizard - a multi-step form
// quietly ignored the grid it was configured with, in the admin preview as well
// as on the page, so the preview agreed with the bug.
//
// F.wizard spreads its options into the Forma it builds per step, so the route
// was always there. These tests are what says so out loud.

import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';

const F = Domma.forms;
const T = Domma.models.types;

let host;

beforeEach(() => {
    document.body.replaceChildren();
    host = document.createElement('div');
    document.body.appendChild(host);
});

/** The rendered <form>, whatever wrapped it. */
const form = () => host.querySelector('form');

/** A field's wrapper, which is what carries the span class. */
const wrapper = (name) => form().querySelector(`[name="${name}"]`).closest('[data-field]');

// Mirrors the shape a CMS form arrives in: two single-column fields followed by
// ones the author marked full-width. `span` is already resolved to a number by
// the time it reaches Forma - 'full' is a CMS spelling, not one of Forma's.
const STEP_FIELDS = {
    forename: {type: T.string, label: 'Forename'},
    surname: {type: T.string, label: 'Surname'},
    email: {type: T.string, label: 'Email', formConfig: {span: 2}}
};

describe('grid layout on a single-step form', () => {
    it('puts the grid classes on the form and spans the fields that asked', () => {
        F.render(host, STEP_FIELDS, {}, {layout: 'grid', columns: 2});

        expect(form().className).toContain('grid');
        expect(form().className).toContain('grid-cols-2');
        expect(wrapper('email').className).toContain('col-span-2');
        expect(wrapper('forename').className).not.toContain('col-span-2');
    });

    it('stacks when no layout is asked for', () => {
        F.render(host, STEP_FIELDS, {}, {});
        expect(form().className).not.toContain('grid-cols-2');
    });
});

describe('grid layout through a wizard', () => {
    const steps = [{title: 'Step 1', fields: STEP_FIELDS}];

    // The regression. A wizard builds a Forma per step, and the step has to be
    // told what the form was configured with or it falls back to 'stacked'.
    it('reaches the step, exactly as it reaches a single-step form', () => {
        F.wizard(host, {schema: {steps}, layout: 'grid', columns: 2});

        expect(form().className).toContain('grid');
        expect(form().className).toContain('grid-cols-2');
        expect(wrapper('email').className).toContain('col-span-2');
        expect(wrapper('forename').className).not.toContain('col-span-2');
    });

    it('still stacks when the caller passes nothing, as it always did', () => {
        F.wizard(host, {schema: {steps}});
        expect(form().className).not.toContain('grid-cols-2');
    });

    // Documented on the option and worth pinning: a step can override the
    // wizard, so one step of a grid form can be a stacked one.
    it('lets a step override the wizard-wide layout', () => {
        F.wizard(host, {
            schema: {steps: [{title: 'Only', fields: STEP_FIELDS, layout: 'stacked'}]},
            layout: 'grid',
            columns: 2
        });

        expect(form().className).not.toContain('grid-cols-2');
    });
});

// ── A form with a date in it can be submitted ────────────────────────────────
//
// The regression this file exists to stop repeating: `{type: 'date'}` renders
// <input type="date">, which writes a STRING, while the model's type check
// accepted only a real Date. validate() therefore returned false on every
// submit with "Expected type date", and because the only symptom was a field
// error nobody had asked for, the button simply appeared to do nothing.

describe('a date field', () => {
    const FIELDS = {
        title: {type: 'string', label: 'Title', required: true},
        when:  {type: 'date',   label: 'Date received', required: true},
        until: {type: 'date',   label: 'Until'}
    };

    /** Type into a field the way a user does, so the model sees the write. */
    const type = (name, value) => {
        const el = form().querySelector(`[name="${name}"]`);
        el.value = value;
        el.dispatchEvent(new Event('change', {bubbles: true}));
    };

    it('renders as a date input', () => {
        F.render(host, FIELDS, {}, {});
        expect(form().querySelector('[name="when"]').type).toBe('date');
    });

    it('validates what that input writes back', () => {
        const instance = F.create(FIELDS, {}, {});
        instance.renderTo(host);

        type('title', 'Deposit');
        type('when', '2026-09-20');

        expect(instance.validate()).toBe(true);
        expect(instance.getData().when).toBe('2026-09-20');
    });

    it('lets an OPTIONAL date be left blank', () => {
        const instance = F.create(FIELDS, {}, {});
        instance.renderTo(host);

        type('title', 'Deposit');
        type('when', '2026-09-20');
        type('until', '');          // cleared, which writes '' and not null

        expect(instance.validate()).toBe(true);
    });

    it('still refuses a required date left blank', () => {
        const instance = F.create(FIELDS, {}, {});
        instance.renderTo(host);

        type('title', 'Deposit');

        expect(instance.validate()).toBe(false);
    });

    it('reaches onSubmit with the date in it', () => {
        let submitted = null;
        const instance = F.create(FIELDS, {}, {onSubmit: (data) => { submitted = data; }});
        instance.renderTo(host);

        type('title', 'Deposit');
        type('when', '2026-09-20');
        form().dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));

        expect(submitted).not.toBeNull();
        expect(submitted.when).toBe('2026-09-20');
    });
});

describe('required select with no value', () => {
    const SCHEMA = {
        status: {type: 'select', label: 'Status', required: true, options: [{value: 'a', label: 'A'}, {value: 'b', label: 'B'}]}
    };

    it('starts on a placeholder, not the first option', () => {
        F.render(host, SCHEMA, {}, {});
        const select = form().querySelector('[name="status"]');
        expect(select.value).toBe('');
        const first = select.options[0];
        expect(first.value).toBe('');
        expect(first.disabled).toBe(true);
    });

    it('is refused until something is picked', () => {
        const f = F.create(SCHEMA, {}, {});
        f.renderTo(host);
        expect(f.validate()).toBe(false);
    });

    it('shows a value it was given, with no placeholder', () => {
        F.render(host, SCHEMA, {status: 'b'}, {});
        const select = form().querySelector('[name="status"]');
        expect(select.value).toBe('b');
        expect([...select.options].some(o => o.value === '')).toBe(false);
    });
});

// ── The wizard and the component field types ─────────────────────────────────
//
// A wizard step used to read its values off the raw inputs, so a two-thumb
// slider collapsed to its last input and a dropzone's files became "" - and the
// step's Forma (and its components) was never destroyed, so each step left a
// dropzone's document drag guard behind.

describe('wizard with slider and dropzone fields', () => {
    const steps = () => [
        {title: 'One', fields: {
            p: {type: 'slider', min: 0, max: 100, default: [10, 90], formConfig: {range: true}},
            f: {type: 'dropzone'}
        }},
        {title: 'Two', fields: {note: {type: T.string, label: 'Note'}}}
    ];
    const E = Domma.elements;

    it('submits the pair and the files the components hold', async () => {
        let submitted = null;
        F.wizard(host, {schema: {steps: [steps()[0]]}, onSubmit: (data) => { submitted = data; }});
        const zone = host.querySelector('[data-dropzone-field="f"]');
        const pdf = new File(['x'], 'a.pdf');
        E.get(zone, 'dropzone').addFiles([pdf]);
        host.querySelector('.wizard-submit').click();
        await Promise.resolve();
        expect(submitted.p).toEqual([10, 90]);
        expect(submitted.f).toEqual([pdf]);
    });

    it('destroys a step\'s components when the step is left and when the wizard is destroyed', async () => {
        const {_guardState} = await import('./components/dropzone.js');
        const before = _guardState().zones;
        const wiz = F.wizard(host, {schema: {steps: steps()}});
        const zone = host.querySelector('[data-dropzone-field="f"]');
        const dz = E.get(zone, 'dropzone');
        expect(_guardState().zones).toBe(before + 1);
        host.querySelector('.wizard-next').click();
        expect(wiz.getCurrentStep()).toBe(1);
        expect(_guardState().zones).toBe(before);
        expect(E._instances.has(zone)).toBe(false);
        expect(dz._entries).toBeNull();
        expect(wiz.getStepData().p).toEqual([10, 90]);
        wiz.prevStep();
        expect(_guardState().zones).toBe(before + 1);
        wiz.destroy();
        expect(_guardState().zones).toBe(before);
        expect(host.querySelector('.wizard')).toBeNull();
    });
});

describe('Forma reset()', () => {
    it('a [data-action="reset"] button puts the fields back to their starting values', () => {
        const f = F.create({
            name: {type: T.string, label: 'Name', default: 'Ann'},
            vol: {type: 'slider', min: 0, max: 10, default: 4}
        }, {}, {});
        f.renderTo(host);
        const input = form().querySelector('[name="name"]');
        input.value = 'Bob';
        input.dispatchEvent(new Event('change', {bubbles: true}));
        Domma.elements.get(form().querySelector('[data-slider-field="vol"]'), 'range-slider').setValue(9);
        expect(f.getData()).toMatchObject({name: 'Bob', vol: 9});
        const btn = document.createElement('button');
        btn.setAttribute('data-action', 'reset');
        form().appendChild(btn);
        expect(() => btn.click()).not.toThrow();
        expect(f.getData()).toMatchObject({name: 'Ann', vol: 4});
        expect(input.value).toBe('Ann');
        expect(f._getFieldValueByName('vol')).toBe(4);
    });
});
