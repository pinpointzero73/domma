// src/component.test.js - the conventions every component shares
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import Component, {instanceOf, register} from './component.js';

const E = Domma.elements;

class Widget extends Component {
    static componentName = 'widget';
    static defaults = {onChange: null, onBeforeClose: null};
}

afterEach(() => { document.body.innerHTML = ''; });

describe('Component events', () => {
    it('_fire calls the option, .on() listeners and dm:<component>:<event> with the same arguments', () => {
        document.body.innerHTML = '<div id="w"></div>';
        const onChange = vi.fn();
        const w = new Widget('#w', {onChange});
        const listener = vi.fn();
        const dom = vi.fn();
        w.on('change', listener);
        w.element.addEventListener('dm:widget:change', dom);

        w._fire('change', 'a', 2);

        expect(onChange).toHaveBeenCalledWith('a', 2);
        expect(listener).toHaveBeenCalledWith('a', 2);
        expect(dom).toHaveBeenCalledTimes(1);
        expect(dom.mock.calls[0][0].detail).toEqual({instance: w, args: ['a', 2]});
    });

    it('keeps the option called with this = options, as before', () => {
        document.body.innerHTML = '<div id="w"></div>';
        let seen;
        const w = new Widget('#w', {onChange() { seen = this; }});
        w._fire('change');
        expect(seen).toBe(w.options);
    });

    it('a before-event is cancelled by the option, a listener or preventDefault', () => {
        document.body.innerHTML = '<div id="w"></div>';
        const w = new Widget('#w', {onBeforeClose: () => false});
        expect(w._fire('beforeClose')).toBe(false);

        const w2 = new Widget(document.createElement('div'));
        w2.on('beforeclose', () => false);
        expect(w2._fire('beforeclose')).toBe(false);

        document.body.innerHTML = '<div id="w3"></div>';
        const w3 = new Widget('#w3');
        w3.element.addEventListener('dm:widget:beforeclose', e => e.preventDefault());
        expect(w3._fire('beforeclose')).toBe(false);
    });

    it('once() fires once and off() removes it by the original handler', () => {
        const w = new Widget(document.createElement('div'));
        const h = vi.fn();
        w.once('change', h);
        w._fire('change');
        w._fire('change');
        expect(h).toHaveBeenCalledTimes(1);

        const h2 = vi.fn();
        w.once('change', h2);
        w.off('change', h2);
        w._fire('change');
        expect(h2).not.toHaveBeenCalled();
    });
});

describe('E.get', () => {
    it('finds factory-made slideovers, which never pass through E', () => {
        const so = E.slideover({title: 'Factory', content: '<p>x</p>'});
        expect(E.get(so.element)).toBe(so);
        expect(E.get(so.element, 'slideover')).toBe(so);
        so.destroy();
        expect(E.get(so.element, 'slideover')).toBeUndefined();
    });

    it('tells two components on one element apart by name', () => {
        document.body.innerHTML = '<div id="both"></div>';
        const el = document.getElementById('both');
        const a = new Widget(el);
        const other = {constructor: {componentName: 'other'}};
        register(el, other);
        expect(instanceOf(el, 'widget')).toBe(a);
        expect(instanceOf(el, 'other')).toBe(other);
        expect(instanceOf(el)).toBe(other);
    });

    it('popover listeners: .on() and dm:popover:show fire; the old popover:show does not', () => {
        document.body.innerHTML = '<button id="pb">Go</button>';
        const pop = E.popover('#pb', {content: 'Hi'});
        const viaOn = vi.fn();
        const viaDm = vi.fn();
        const viaOld = vi.fn();
        pop.on('show', viaOn);
        pop.element.addEventListener('dm:popover:show', viaDm);
        pop.element.addEventListener('popover:show', viaOld);
        pop.show();
        expect([viaOn, viaDm, viaOld].map(f => f.mock.calls.length)).toEqual([1, 1, 0]);
    });
});
