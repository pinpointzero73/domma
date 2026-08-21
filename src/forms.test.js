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
