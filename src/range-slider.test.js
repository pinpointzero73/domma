// src/range-slider.test.js
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import {forms} from './forms.js';
import {instanceOf} from './component.js';

const E = Domma.elements;
const $1 = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true}));

/** jsdom has no layout: give the track a box so pointer maths works. */
function giveBox(slider, {left = 0, width = 100, top = 0, height = 100} = {}) {
    slider._track.getBoundingClientRect = () => ({
        left, width, top, height, right: left + width, bottom: top + height, x: left, y: top
    });
}

function pointer(el, type, props = {}) {
    const PE = typeof PointerEvent === 'function' ? PointerEvent : MouseEvent;
    const e = new PE(type, {bubbles: true, cancelable: true, button: 0, ...props});
    if (e.pointerId === undefined) Object.defineProperty(e, 'pointerId', {value: 1});
    el.dispatchEvent(e);
    return e;
}

afterEach(() => {
    E.destroyAll();
    document.body.innerHTML = '';
});

describe('E.rangeSlider - building', () => {
    it('returns null for a selector that matches nothing', () => {
        expect(E.rangeSlider('#nope')).toBeNull();
        expect(E.slider('#nope')).toBeNull();
    });

    it('keeps the caller\'s <input type=range> as .element, reads its attributes and hides it', () => {
        document.body.innerHTML = '<input id="r" type="range" name="vol" min="10" max="50" step="5" value="25">';
        const s = E.rangeSlider('#r');
        const input = $1('#r');
        expect(s.element).toBe(input);
        expect(s.getValue()).toBe(25);
        expect(input.hidden).toBe(true);
        expect(input.name).toBe('vol');
        const thumb = $1('.dm-range-thumb');
        expect(thumb.getAttribute('role')).toBe('slider');
        expect(thumb.getAttribute('aria-valuemin')).toBe('10');
        expect(thumb.getAttribute('aria-valuemax')).toBe('50');
        expect(thumb.getAttribute('aria-valuenow')).toBe('25');
        expect(thumb.tabIndex).toBe(0);
        expect(E.get(input)).toBe(s);
    });

    it('makes the input inside a container, and starts in the middle like a native range', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {min: 0, max: 10, name: 'n'});
        const inputs = $$('#c input[type="range"]');
        expect(inputs).toHaveLength(1);
        expect(inputs[0].name).toBe('n');
        expect(s.getValue()).toBe(5);
        expect(s.element).toBe($1('#c'));
    });

    it('E.slider is the same factory, and a second call updates rather than doubles', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const a = E.slider('#c', {value: 3});
        const b = E.rangeSlider('#c', {max: 50});
        expect(b).toBe(a);
        expect($$('.dm-range-slider')).toHaveLength(1);
    });

    it('snaps to the step grid counted from min and clamps', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {min: 0, max: 10, step: 3, value: 7});
        expect(s.getValue()).toBe(6);
        s.setValue(100, {silent: true});
        expect(s.getValue()).toBe(9); // the top of the grid is below max
        s.setValue(-5, {silent: true});
        expect(s.getValue()).toBe(0);
    });

    it('keeps decimals clean', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {min: 0, max: 1, step: 0.1, value: 0.30000000000000004});
        expect(s.getValue()).toBe(0.3);
        key($1('.dm-range-thumb'), 'ArrowRight');
        expect(s.getValue()).toBe(0.4);
    });
});

describe('E.rangeSlider - dual thumbs', () => {
    it('makes two inputs with the same name and two sliders, value [low, high]', () => {
        document.body.innerHTML = '<form id="f"><div id="c"></div></form>';
        const s = E.rangeSlider('#c', {range: true, min: 0, max: 100, value: [20, 60], name: 'price'});
        expect(s.getValue()).toEqual([20, 60]);
        const inputs = $$('#c input[type="range"]');
        expect(inputs.map(i => i.name)).toEqual(['price', 'price']);
        expect(new FormData($1('#f')).getAll('price')).toEqual(['20', '60']);
        const thumbs = $$('.dm-range-thumb');
        expect(thumbs).toHaveLength(2);
        // each thumb is bounded by the other
        expect(thumbs[0].getAttribute('aria-valuemax')).toBe('60');
        expect(thumbs[1].getAttribute('aria-valuemin')).toBe('20');
        expect(thumbs[0].getAttribute('aria-label')).toBe('minimum');
    });

    it('names: [a, b] names the two inputs separately', () => {
        document.body.innerHTML = '<form id="f"><div id="c"></div></form>';
        E.rangeSlider('#c', {range: true, value: [1, 9], names: ['lo', 'hi']});
        const fd = new FormData($1('#f'));
        expect([fd.get('lo'), fd.get('hi')]).toEqual(['1', '9']);
    });

    it('accepts "a,b", sorts a reversed pair and keeps minDistance', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {range: true, minDistance: 10, value: '70,30'});
        expect(s.getValue()).toEqual([30, 70]);
        s.setValue([50, 52], {silent: true});
        expect(s.getValue()).toEqual([50, 60]);
        const [lo] = $$('.dm-range-thumb');
        key(lo, 'End');
        expect(s.getValue()).toEqual([50, 60]); // already at its limit
        s.setValue([0, 100], {silent: true});
        key(lo, 'End');
        expect(s.getValue()).toEqual([90, 100]);
    });

    it('the thumbs never cross', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {range: true, value: [40, 41]});
        const [lo, hi] = $$('.dm-range-thumb');
        key(lo, 'ArrowRight');
        key(lo, 'ArrowRight');
        expect(s.getValue()).toEqual([41, 41]);
        key(hi, 'ArrowLeft');
        expect(s.getValue()).toEqual([41, 41]);
    });
});

describe('E.rangeSlider - keyboard', () => {
    it('arrows step, PageUp/PageDown move ten steps, Home/End go to the ends', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {min: 0, max: 100, step: 2, value: 50});
        const t = $1('.dm-range-thumb');
        key(t, 'ArrowRight'); expect(s.getValue()).toBe(52);
        key(t, 'ArrowUp'); expect(s.getValue()).toBe(54);
        key(t, 'ArrowLeft'); expect(s.getValue()).toBe(52);
        key(t, 'ArrowDown'); expect(s.getValue()).toBe(50);
        key(t, 'PageUp'); expect(s.getValue()).toBe(70);
        key(t, 'PageDown'); expect(s.getValue()).toBe(50);
        key(t, 'End'); expect(s.getValue()).toBe(100);
        key(t, 'Home'); expect(s.getValue()).toBe(0);
        expect(t.getAttribute('aria-valuenow')).toBe('0');
    });

    it('in RTL the right arrow lowers the value, and the page direction is followed', () => {
        document.body.innerHTML = '<div id="c" dir="rtl"></div>';
        const s = E.rangeSlider('#c', {value: 50, rtl: true});
        const t = $1('.dm-range-thumb');
        key(t, 'ArrowRight');
        expect(s.getValue()).toBe(49);
        key(t, 'ArrowLeft');
        expect(s.getValue()).toBe(50);
        expect($1('.dm-range-slider').getAttribute('dir')).toBe('rtl');
        expect(t.style.right).toBe('50%');
    });

    it('vertical: aria-orientation, positioned from the bottom', () => {
        document.body.innerHTML = '<div id="c"></div>';
        E.rangeSlider('#c', {orientation: 'vertical', value: 25});
        const t = $1('.dm-range-thumb');
        expect(t.getAttribute('aria-orientation')).toBe('vertical');
        expect(t.style.bottom).toBe('25%');
    });
});

describe('E.rangeSlider - events', () => {
    it('a key fires input then change via option, .on() and dm:range-slider:*, plus native events', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const onInput = vi.fn();
        const onChange = vi.fn();
        const s = E.rangeSlider('#c', {value: 10, onInput, onChange});
        const viaOn = vi.fn();
        const viaDom = vi.fn();
        const nativeInput = vi.fn();
        const nativeChange = vi.fn();
        s.on('change', viaOn);
        s.element.addEventListener('dm:range-slider:change', viaDom);
        const input = $1('#c input');
        input.addEventListener('input', nativeInput);
        input.addEventListener('change', nativeChange);
        key($1('.dm-range-thumb'), 'ArrowRight');
        expect(onInput).toHaveBeenCalledWith(11);
        expect(onChange).toHaveBeenCalledWith(11);
        expect(viaOn).toHaveBeenCalledWith(11);
        expect(viaDom.mock.calls[0][0].detail.args).toEqual([11]);
        expect(nativeInput).toHaveBeenCalledTimes(1);
        expect(nativeChange).toHaveBeenCalledTimes(1);
        expect(input.value).toBe('11');
    });

    it('beforechange can refuse - by option, .on() or preventDefault', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {value: 10, onBeforeChange: (next) => next <= 12});
        const t = $1('.dm-range-thumb');
        key(t, 'ArrowRight');
        key(t, 'ArrowRight');
        key(t, 'ArrowRight');
        expect(s.getValue()).toBe(12);
        s.element.addEventListener('dm:range-slider:beforechange', e => e.preventDefault());
        s.setValue(5);
        expect(s.getValue()).toBe(12);
    });

    it('setValue fires change; {silent: true} fires nothing', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const onChange = vi.fn();
        const s = E.rangeSlider('#c', {value: 10, onChange});
        s.setValue(20, {silent: true});
        expect(onChange).not.toHaveBeenCalled();
        expect($1('#c input').value).toBe('20');
        s.setValue(30);
        expect(onChange).toHaveBeenCalledWith(30);
    });

    it('a drag fires input while moving and one change on release', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const onInput = vi.fn();
        const onChange = vi.fn();
        const s = E.rangeSlider('#c', {value: 0, onInput, onChange});
        giveBox(s);
        const root = $1('.dm-range-slider');
        pointer(root, 'pointerdown', {clientX: 30});
        pointer(root, 'pointermove', {clientX: 40});
        pointer(root, 'pointermove', {clientX: 45});
        expect(onChange).not.toHaveBeenCalled();
        pointer(root, 'pointerup', {clientX: 45});
        expect(onInput.mock.calls.map(c => c[0])).toEqual([30, 40, 45]);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(45);
        expect(document.activeElement).toBe($1('.dm-range-thumb'));
    });

    it('a press moves the nearer thumb; RTL measures from the right', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {range: true, value: [20, 80], rtl: true});
        giveBox(s);
        const root = $1('.dm-range-slider');
        pointer(root, 'pointerdown', {clientX: 10}); // 90 in RTL
        pointer(root, 'pointerup', {clientX: 10});
        expect(s.getValue()).toEqual([20, 90]);
    });

    it('pointercancel puts the value back', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const onChange = vi.fn();
        const s = E.rangeSlider('#c', {value: 0, onChange});
        giveBox(s);
        const root = $1('.dm-range-slider');
        pointer(root, 'pointerdown', {clientX: 60});
        pointer(root, 'pointercancel', {clientX: 60});
        expect(s.getValue()).toBe(0);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('pressing a mark jumps to its value', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {value: 0, marks: [{value: 37, label: 'Sweet spot'}]});
        giveBox(s);
        const mark = $1('.dm-range-mark');
        expect(mark.textContent).toBe('Sweet spot');
        pointer(mark, 'pointerdown', {clientX: 90});
        pointer($1('.dm-range-slider'), 'pointerup');
        expect(s.getValue()).toBe(37);
    });
});

describe('E.rangeSlider - labels, ticks, tooltip', () => {
    it('the formatter drives aria-valuetext, the tooltip and tick labels', () => {
        document.body.innerHTML = '<div id="c"></div>';
        E.rangeSlider('#c', {value: 20, ticks: [0, 50, 100], labels: v => `£${v}`});
        const t = $1('.dm-range-thumb');
        expect(t.getAttribute('aria-valuetext')).toBe('£20');
        expect($1('.dm-range-tooltip').textContent).toBe('£20');
        expect($$('.dm-range-tick-label').map(l => l.textContent)).toEqual(['£0', '£50', '£100']);
    });

    it('no formatter = no aria-valuetext; tooltip: never draws none', () => {
        document.body.innerHTML = '<div id="c"></div>';
        E.rangeSlider('#c', {tooltip: 'never'});
        expect($1('.dm-range-thumb').hasAttribute('aria-valuetext')).toBe(false);
        expect($1('.dm-range-tooltip')).toBeNull();
    });

    it('ticks: true is every step (thinned past 100); a number is every n units', () => {
        document.body.innerHTML = '<div id="a"></div><div id="b"></div><div id="d"></div>';
        E.rangeSlider('#a', {min: 0, max: 10, ticks: true});
        expect($$('#a .dm-range-tick')).toHaveLength(11);
        E.rangeSlider('#b', {min: 0, max: 100, ticks: 25});
        expect($$('#b .dm-range-tick').map(t => t.dataset.value)).toEqual(['0', '25', '50', '75', '100']);
        E.rangeSlider('#d', {min: 0, max: 1000, ticks: true});
        expect($$('#d .dm-range-tick').length).toBeLessThanOrEqual(101);
    });

    it('takes its name from a <label for>, and the label focuses the thumb', () => {
        document.body.innerHTML = '<label for="v">Volume</label><input id="v" type="range">';
        E.rangeSlider('#v');
        const t = $1('.dm-range-thumb');
        expect(t.getAttribute('aria-label')).toBe('Volume');
        $1('label').click();
        expect(document.activeElement).toBe(t);
    });
});

describe('E.rangeSlider - state and forms', () => {
    it('disable() takes the thumbs out of the tab order and ignores keys', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {value: 10});
        s.disable();
        const t = $1('.dm-range-thumb');
        expect(t.tabIndex).toBe(-1);
        expect(t.getAttribute('aria-disabled')).toBe('true');
        expect($1('#c input').disabled).toBe(true);
        key(t, 'ArrowRight');
        expect(s.getValue()).toBe(10);
        s.enable();
        expect($1('.dm-range-thumb').tabIndex).toBe(0);
    });

    it('setRange() clamps the value and fires change when it moved', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const onChange = vi.fn();
        const s = E.rangeSlider('#c', {value: 80, onChange});
        s.setRange(0, 50);
        expect(s.getValue()).toBe(50);
        expect(onChange).toHaveBeenCalledWith(50);
        expect($1('#c input').max).toBe('50');
        expect($1('.dm-range-thumb').getAttribute('aria-valuemax')).toBe('50');
    });

    it('follows input.value set from code (as M.bind does) and a form reset', async () => {
        document.body.innerHTML = '<form id="f"><input id="r" type="range" value="30"></form>';
        const s = E.rangeSlider('#r');
        $1('#r').value = '70';
        expect(s.getValue()).toBe(70);
        expect($1('.dm-range-thumb').getAttribute('aria-valuenow')).toBe('70');
        $1('#f').reset();
        await new Promise(r => setTimeout(r, 5));
        expect(s.getValue()).toBe(30);
    });

    it('a form reset returns made inputs and a value given as an option to the start', async () => {
        document.body.innerHTML = '<form id="f"><div id="c"></div><input id="r" type="range"></form>';
        const range = E.rangeSlider('#c', {range: true, min: 0, max: 2000, value: [200, 800]});
        const single = E.rangeSlider('#r', {min: 0, max: 100, value: 10});
        range.setValue([500, 1500]);
        single.setValue(90);
        $1('#f').reset();
        await new Promise(r => setTimeout(r, 5));
        expect(range.getValue()).toEqual([200, 800]);
        expect(single.getValue()).toBe(10);
        single.destroy();
        expect($1('#r').hasAttribute('value')).toBe(false);
    });

    it('a model bound to the input moves the slider and hears it', () => {
        document.body.innerHTML = '<input id="r" type="range">';
        const s = E.rangeSlider('#r', {value: 10});
        const model = Domma.models.create({vol: {type: 'number', default: 10}});
        Domma.models.bind(model, 'vol', '#r', {twoWay: true});
        model.set('vol', 42);
        expect(s.getValue()).toBe(42);
        key($1('.dm-range-thumb'), 'ArrowRight');
        expect(model.get('vol')).toBe(43);
    });

    it('destroy() removes the slider and listeners and gives the input back', () => {
        document.body.innerHTML = '<label for="r">Vol</label><input id="r" type="range" value="5">';
        const onChange = vi.fn();
        const s = E.rangeSlider('#r', {onChange});
        const input = $1('#r');
        s.destroy();
        expect($1('.dm-range-slider')).toBeNull();
        expect(input.hidden).toBe(false);
        expect(input.hasAttribute('aria-hidden')).toBe(false);
        expect(input.hasAttribute('tabindex')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(input, 'value')).toBe(false);
        input.value = '9';
        input.dispatchEvent(new Event('change', {bubbles: true}));
        expect(onChange).not.toHaveBeenCalled();
        expect(instanceOf(input, 'range-slider')).toBeNull();
    });

    it('destroy() leaves E.get and E._instances, so a destroyed slider is never handed back', () => {
        document.body.innerHTML = '<input id="r" type="range">';
        const s = E.rangeSlider('#r');
        expect(E.get('#r')).toBe(s);
        s.destroy();
        expect(E._instances.has($1('#r'))).toBe(false);
        expect(E.get('#r')).toBeUndefined();
    });

    it('destroy() restores min, max, step and disabled on the caller\'s input', () => {
        document.body.innerHTML = '<input id="a" type="range"><input id="b" type="range" min="2" max="8" step="2" disabled>';
        E.rangeSlider('#a', {min: 10, max: 50, step: 5, disabled: true}).destroy();
        const a = $1('#a');
        for (const attr of ['min', 'max', 'step', 'disabled']) expect(a.hasAttribute(attr)).toBe(false);
        expect(a.disabled).toBe(false);
        E.rangeSlider('#b', {min: 0, max: 100, step: 0}).destroy();
        const b = $1('#b');
        expect([b.getAttribute('min'), b.getAttribute('max'), b.getAttribute('step')]).toEqual(['2', '8', '2']);
        expect(b.disabled).toBe(true);
    });

    it('destroy() removes inputs it made in a container', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const s = E.rangeSlider('#c', {range: true});
        s.destroy();
        expect($1('#c').children).toHaveLength(0);
    });
});

describe('F blueprint: type slider', () => {
    it('renders a slider, and the value (a pair for range) reaches the model and getData()', () => {
        document.body.innerHTML = '<div id="host"></div>';
        const form = forms.create({
            volume: {type: 'slider', label: 'Volume', min: 0, max: 10, default: 4},
            price: {type: 'slider', label: 'Price', min: 0, max: 100, default: [10, 90], formConfig: {range: true}}
        });
        form.renderTo('#host');
        const thumbs = $$('#host .dm-range-thumb');
        expect(thumbs).toHaveLength(3);
        expect(thumbs[0].getAttribute('aria-label')).toBe('Volume');
        key(thumbs[0], 'ArrowRight');
        key(thumbs[2], 'ArrowLeft');
        expect(form.getData().volume).toBe(5);
        expect(form.getData().price).toEqual([10, 89]);
        expect(form._getFieldValueByName('price')).toEqual([10, 89]);
        form.destroy();
        expect($1('#host .dm-range-slider')).toBeNull();
    });

    it('plain type: range stays a native input unless formConfig.slider', () => {
        document.body.innerHTML = '<div id="host"></div>';
        forms.create({a: {type: 'range'}, b: {type: 'range', formConfig: {slider: true}}}).renderTo('#host');
        expect($1('#field-a').hidden).toBe(false);
        expect($$('#host .dm-range-slider')).toHaveLength(1);
    });
});
