/**
 * Range slider - E.rangeSlider(target, options), alias E.slider.
 *
 * The value always lives in real `<input type="range">` elements, so a form submits it,
 * FormData reads it and anything listening for native `input` / `change` hears it. The
 * inputs are hidden (`hidden` still submits) and a drawn track with `role="slider"` thumbs
 * stands in front of them - native range inputs cannot do two thumbs, marks or a tooltip,
 * and cannot be styled the same way in every engine.
 *
 * - Target an `<input type="range">` and it stays `.element`: min / max / step / value /
 *   name / disabled are read from it, the drawn slider goes in after it.
 * - Target a container and the input(s) are made inside it.
 * - `range: true` gives two thumbs and TWO inputs. Both carry the same `name` by default,
 *   so a form submits `price=10&price=50` (FormData.getAll and Domma's getFormData give
 *   both); `names: ['min_price', 'max_price']` names them separately instead. Two inputs
 *   beat one "10,50" string: each stays a number, each validates against min / max, and a
 *   server needs no parsing.
 *
 * Events: input (while dragging or on each key), change (on commit), beforechange
 * (cancelable) - as onX options, `.on()` and `dm:range-slider:<event>`.
 */

import Component, {instanceOf} from '../component.js';
import {flag, num, uniqueId} from './shared.js';

const KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];

// The most ticks drawn for `ticks: true`; a 0-1000 slider in steps of 1 would otherwise
// draw a solid bar of a thousand lines.
const MAX_TICKS = 100;

function decimals(n) {
    const s = String(n);
    if (s.includes('e-')) return Number(s.split('e-')[1]) || 0;
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
}

/** Read the value an <input> really holds, past the `value` property we put on it. */
const nativeValue = (() => {
    let desc = null;
    return (input) => {
        if (desc === null) {
            desc = (typeof HTMLInputElement !== 'undefined'
                && Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')) || undefined;
        }
        return desc ? desc.get.call(input) : input.value;
    };
})();

/** A number, or [low, high] with `range: true`. @typedef {number|[number, number]} RangeSliderValue */

/**
 * @typedef {object} RangeSliderMark
 * @property {number} value
 * @property {string} [label]
 */

/**
 * @typedef {object} RangeSliderOptions
 * @property {number} [min] Default: the input's min, else 0
 * @property {number} [max] Default: the input's max, else 100
 * @property {number|'any'} [step] Default: the input's step, else 1
 * @property {RangeSliderValue|string|null} [value] A number, or [low, high] / "low,high" with range: true
 * @property {boolean} [range] Two thumbs; two inputs, sharing `name` unless `names` is given
 * @property {'horizontal'|'vertical'} [orientation]
 * @property {boolean|number|number[]} [ticks] true = every step, n = every n units, or the values to draw at
 * @property {boolean} [tickLabels] Label the ticks (always on for an array)
 * @property {((value: number, where: 'tick'|'mark'|'tooltip'|'aria') => string)|null} [labels] Formats the value for ticks, marks, the tooltip and aria-valuetext
 * @property {((value: number, where: 'tick'|'mark'|'tooltip'|'aria') => string)|null} [format] Read when `labels` is not set
 * @property {'always'|'hover'|'never'} [tooltip] Default 'hover' (also shown on focus and while dragging)
 * @property {RangeSliderMark[]|null} [marks]
 * @property {boolean} [disabled]
 * @property {string|null} [name]
 * @property {[string, string]|null} [names] [lowName, highName] for range: true
 * @property {number} [minDistance] range: true - the closest the thumbs may come
 * @property {boolean|null} [rtl] null = follow the page's direction
 * @property {string|null} [ariaLabel]
 * @property {[string, string]|null} [ariaLabels]
 * @property {string} [className]
 * @property {((value: RangeSliderValue) => void)|null} [onInput] While dragging, and on each key press
 * @property {((value: RangeSliderValue) => void)|null} [onChange] When the value is committed
 * @property {((next: RangeSliderValue, current: RangeSliderValue) => boolean|void)|null} [onBeforeChange] Return false to refuse a move
 */

/** @typedef {RangeSlider} RangeSliderInstance */

export class RangeSlider extends Component {
    static componentName = 'range-slider';

    /** @type {RangeSliderOptions} */
    static defaults = {
        min: 0,
        max: 100,
        step: 1,                    // a number, or 'any'
        value: null,                // a number, or [low, high] with range: true
        range: false,               // two thumbs
        orientation: 'horizontal',  // 'horizontal' | 'vertical'
        ticks: false,               // true (every step) | n (every n units) | [values]
        tickLabels: false,          // label the ticks (always on for an array of ticks)
        labels: null,               // format(value, where) -> text, for ticks, marks, tooltip and aria-valuetext
        tooltip: 'hover',           // 'always' | 'hover' | 'never'
        marks: null,                // [{value, label}]
        disabled: false,
        name: null,
        names: null,                // [lowName, highName] for range: true
        minDistance: 0,             // range: true - the closest the thumbs may come
        rtl: null,                  // null = follow the page's direction
        ariaLabel: null,            // the thumb's name (or the base of both names)
        ariaLabels: null,           // [lowLabel, highLabel] for range: true
        className: '',
        onInput: null,
        onChange: null,
        onBeforeChange: null
    };

    /**
     * @param {string|Element|null} element - an <input type="range"> or a container
     * @param {RangeSliderOptions} [options]
     */
    constructor(element, options = {}) {
        super(element, RangeSlider.fromInput(element, options));
        if (!this.element) return;
        this._isInput = this.element.tagName === 'INPUT';
        this._made = [];            // inputs this component created
        this._hooked = [];          // inputs whose `value` property we hooked
        this._dispatching = false;
        this._drag = null;
        this._timers = [];
        this._setupInputs();
        this._values = this._initialValues();
        this._render();
        this._writeInputs();
        this._setDefaults();
        this._bindInputs();
    }

    /**
     * Options not given are read from the input's own attributes, as a plain range input would.
     * @param {*} element
     * @param {RangeSliderOptions} [options]
     * @returns {RangeSliderOptions}
     */
    static fromInput(element, options = {}) {
        const o = {...options};
        if (!element || element.tagName !== 'INPUT') return o;
        const attr = (n) => element.getAttribute(n);
        if (o.min === undefined && attr('min') !== null) o.min = num(attr('min'), 0);
        if (o.max === undefined && attr('max') !== null) o.max = num(attr('max'), 100);
        if (o.step === undefined && attr('step') !== null) o.step = attr('step') === 'any' ? 'any' : num(attr('step'), 1);
        if (o.value === undefined && attr('value') !== null && !o.range) o.value = num(attr('value'), null);
        if (o.name === undefined && element.name) o.name = element.name;
        if (o.disabled === undefined && element.disabled) o.disabled = true;
        return o;
    }

    // ---- numbers ----------------------------------------------------------

    get _min() { return num(this.options.min, 0); }

    get _max() {
        const max = num(this.options.max, 100);
        return max > this._min ? max : this._min + 1;
    }

    /** The step used to snap values; null for step 'any'. */
    get _step() {
        if (this.options.step === 'any') return null;
        const s = num(this.options.step, 1);
        return s > 0 ? s : 1;
    }

    /** The step the arrow keys move by. */
    get _keyStep() {
        return this._step ?? (this._max - this._min) / 100;
    }

    /** Snap to the step grid (counted from min, as a native range input does) and clamp. */
    _snap(v) {
        const min = this._min;
        const max = this._max;
        let n = num(v, min);
        const step = this._step;
        if (step) {
            n = min + Math.round((n - min) / step) * step;
            // The top of the grid may sit below max (0-10 in steps of 3 ends at 9)
            const top = min + Math.floor((max - min) / step + 1e-9) * step;
            n = Math.min(n, top);
            n = Number(n.toFixed(Math.max(decimals(step), decimals(min))));
        }
        return Math.min(Math.max(n, min), max);
    }

    get _minDistance() {
        return this.options.range ? Math.max(0, num(this.options.minDistance, 0)) : 0;
    }

    /** Snap, order and space a candidate value (a number, [a, b] or "a,b"). */
    _normalise(value) {
        if (!this.options.range) {
            const v = Array.isArray(value) ? value[0] : value;
            return [this._snap(v)];
        }
        let pair = value;
        if (typeof pair === 'string') pair = pair.split(',');
        if (!Array.isArray(pair)) pair = [pair, this._values ? this._values[1] : this._max];
        let a = this._snap(pair[0] ?? this._min);
        let b = this._snap(pair[1] ?? this._max);
        if (a > b) [a, b] = [b, a];
        const gap = this._minDistance;
        if (b - a < gap) {
            b = this._snap(a + gap);
            if (b - a < gap) a = this._snap(b - gap);
        }
        return [a, b];
    }

    _initialValues() {
        const o = this.options;
        if (o.value !== null && o.value !== undefined && o.value !== '') return this._normalise(o.value);
        if (o.range) {
            const a = this._inputs[0].getAttribute('value');
            const b = this._inputs[1].getAttribute('value');
            return this._normalise([a !== null ? a : this._min, b !== null ? b : this._max]);
        }
        // A native range input with no value starts in the middle
        return this._normalise(this._min + (this._max - this._min) / 2);
    }

    _format(value, where) {
        const f = this.options.labels || this.options.format;
        if (typeof f === 'function') {
            try {
                const out = f(value, where);
                if (out !== undefined && out !== null) return String(out);
            } catch { /* a broken formatter shows the number */ }
        }
        return String(value);
    }

    _pct(v) {
        return ((v - this._min) / (this._max - this._min)) * 100;
    }

    get _vertical() {
        return this.options.orientation === 'vertical';
    }

    get _rtl() {
        if (this.options.rtl !== null && this.options.rtl !== undefined) return flag(this.options.rtl);
        try {
            return typeof getComputedStyle === 'function' && getComputedStyle(this.element).direction === 'rtl';
        } catch {
            return false;
        }
    }

    // ---- the real inputs ----------------------------------------------------

    _setupInputs() {
        const o = this.options;
        const make = (after) => {
            const input = document.createElement('input');
            input.type = 'range';
            if (after) after.after(input);
            else this.element.appendChild(input);
            this._made.push(input);
            return input;
        };
        const first = this._isInput ? this.element : make(null);
        this._inputs = [first];
        if (o.range) this._inputs.push(make(first));

        // Remember what the caller's input looked like, to give it back on destroy()
        if (this._isInput) {
            const el = this.element;
            this._restore = {
                name: el.getAttribute('name'),
                hidden: el.hidden,
                tabindex: el.getAttribute('tabindex'),
                ariaHidden: el.getAttribute('aria-hidden'),
                // _syncInputAttrs writes these; the attribute (or its absence) is what came in
                min: el.getAttribute('min'),
                max: el.getAttribute('max'),
                step: el.getAttribute('step'),
                disabled: el.getAttribute('disabled'),
                value: el.getAttribute('value')
            };
        }
        const names = Array.isArray(o.names) ? o.names : [];
        this._inputs.forEach((input, i) => {
            // `names` wins; otherwise `name` fills an input that has none
            const name = names[i] || (input.name ? null : o.name);
            if (name) input.name = name;
            input.hidden = true;
            input.tabIndex = -1;
            input.setAttribute('aria-hidden', 'true');
        });
        this._syncInputAttrs();
        this._hookValues();
    }

    _syncInputAttrs() {
        for (const input of this._inputs) {
            input.min = String(this._min);
            input.max = String(this._max);
            input.step = this._step ? String(this._step) : 'any';
            input.disabled = flag(this.options.disabled);
        }
    }

    /**
     * Code (or M.bind, which writes `input.value`) setting a value programmatically fires
     * no event, so the drawn slider would never move. The instance gets its own `value`
     * property that writes through to the native one and then redraws. Removed on destroy.
     */
    _hookValues() {
        const proto = typeof HTMLInputElement !== 'undefined' ? HTMLInputElement.prototype : null;
        const desc = proto && Object.getOwnPropertyDescriptor(proto, 'value');
        if (!desc || !desc.set) return;
        const self = this;
        this._inputs.forEach((input, i) => {
            try {
                Object.defineProperty(input, 'value', {
                    configurable: true,
                    enumerable: true,
                    get() { return desc.get.call(this); },
                    set(v) {
                        desc.set.call(this, v);
                        if (!self._writing) self._fromInputs(i);
                    }
                });
                this._hooked.push(input);
            } catch { /* a frozen input keeps native behaviour */ }
        });
    }

    /** Push the current values into the real inputs. */
    _writeInputs() {
        this._writing = true;
        try {
            this._inputs.forEach((input, i) => { input.value = String(this._values[i]); });
        } finally {
            this._writing = false;
        }
    }

    /**
     * A form reset returns each input to its value attribute. Inputs this component made,
     * and a caller's input without one, would reset to the midpoint - give them the
     * starting value.
     */
    _setDefaults() {
        this._inputs.forEach((input, i) => {
            if (!input.hasAttribute('value')) input.setAttribute('value', String(this._values[i]));
        });
    }

    /** Read the inputs back after something outside changed them. */
    _fromInputs() {
        if (!this._inputs) return;
        const raw = this._inputs.map(input => Number(nativeValue(input)));
        const next = this._normalise(this.options.range ? raw : raw[0]);
        this._values = next;
        this._writeInputs();
        this._paint();
    }

    _bindInputs() {
        for (const input of this._inputs) {
            const sync = () => { if (!this._dispatching) this._fromInputs(); };
            this._addEventListener(input, 'input', sync);
            this._addEventListener(input, 'change', sync);
        }
        // A form reset puts the inputs back to their value attributes without an event;
        // read them once the reset has happened.
        const form = this._inputs[0].form;
        if (form) {
            this._addEventListener(form, 'reset', () => {
                this._timers.push(setTimeout(() => {
                    if (!this._inputs) return;
                    this._fromInputs();
                }, 0));
            });
        }
        // A <label for> the hidden input moves focus to the first thumb instead
        const labels = this._inputs[0].labels ? Array.from(this._inputs[0].labels) : [];
        for (const label of labels) {
            this._addEventListener(label, 'click', (e) => {
                if (this._thumbs?.[0]?.contains(e.target)) return;
                e.preventDefault();
                if (!flag(this.options.disabled)) this._thumbs[0].focus();
            });
        }
        this._labels = labels;
    }

    _labelText() {
        if (this.options.ariaLabel) return String(this.options.ariaLabel);
        const label = this._labels?.[0] || (this._inputs[0].labels && this._inputs[0].labels[0]);
        if (label) return label.textContent.replace(/\s+/g, ' ').trim();
        return this.element.getAttribute('aria-label') || '';
    }

    // ---- drawing ----------------------------------------------------------

    _render() {
        if (this._root) {
            this._unbindRoot();
            this._root.remove();
        }
        const o = this.options;
        const root = document.createElement('div');
        root.className = `dm-range-slider${o.className ? ' ' + o.className : ''}`;
        root.dataset.orientation = this._vertical ? 'vertical' : 'horizontal';
        root.dataset.tooltipMode = ['always', 'never'].includes(o.tooltip) ? o.tooltip : 'hover';
        if (o.range) root.classList.add('is-range');
        if (this._rtl) root.setAttribute('dir', 'rtl');

        const track = document.createElement('div');
        track.className = 'dm-range-track';
        const fill = document.createElement('div');
        fill.className = 'dm-range-fill';
        track.appendChild(fill);
        root.appendChild(track);

        this._ticksEl = this._renderTicks(root);
        this._marksEl = this._renderMarks(root);

        const base = this._labelText();
        const ariaLabels = Array.isArray(o.ariaLabels) ? o.ariaLabels : [];
        this._thumbs = this._values.map((v, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'dm-range-thumb';
            thumb.id = uniqueId('dm-range-thumb');
            thumb.setAttribute('role', 'slider');
            thumb.dataset.index = String(i);
            if (this._vertical) thumb.setAttribute('aria-orientation', 'vertical');
            let name = ariaLabels[i];
            if (!name && o.range) name = [base, i === 0 ? 'minimum' : 'maximum'].filter(Boolean).join(' ');
            if (!name) name = base;
            if (name) thumb.setAttribute('aria-label', name);
            if (root.dataset.tooltipMode !== 'never') {
                const tip = document.createElement('span');
                tip.className = 'dm-range-tooltip';
                tip.setAttribute('aria-hidden', 'true');
                thumb.appendChild(tip);
            }
            root.appendChild(thumb);
            return thumb;
        });
        this._fillEl = fill;
        this._track = track;
        this._root = root;

        const last = this._inputs[this._inputs.length - 1];
        if (this._isInput) last.after(root);
        else this.element.appendChild(root);

        this._bindRoot();
        this._applyDisabled();
        this._paint();
    }

    /** Values a tick is drawn at. */
    _tickValues() {
        const t = this.options.ticks;
        if (!t) return [];
        const min = this._min;
        const max = this._max;
        if (Array.isArray(t)) {
            return t.map(Number).filter(v => Number.isFinite(v) && v >= min && v <= max);
        }
        let every = t === true || t === 'true' ? this._keyStep : num(t, 0);
        if (!(every > 0)) return [];
        // Thin out to at most MAX_TICKS, keeping whole multiples of the interval
        const count = Math.floor((max - min) / every + 1e-9);
        if (count > MAX_TICKS) every *= Math.ceil(count / MAX_TICKS);
        const out = [];
        const d = Math.max(decimals(every), decimals(min));
        for (let v = min; v <= max + 1e-9; v += every) out.push(Number(v.toFixed(d)));
        if (out[out.length - 1] !== max) out.push(max);
        return out;
    }

    _place(el, pct) {
        if (this._vertical) el.style.bottom = `${pct}%`;
        else el.style[this._rtl ? 'right' : 'left'] = `${pct}%`;
    }

    _renderTicks(root) {
        const values = this._tickValues();
        if (!values.length) return null;
        const withLabels = Array.isArray(this.options.ticks) || flag(this.options.tickLabels);
        const wrap = document.createElement('div');
        wrap.className = 'dm-range-ticks';
        wrap.setAttribute('aria-hidden', 'true');
        for (const v of values) {
            const tick = document.createElement('span');
            tick.className = 'dm-range-tick';
            tick.dataset.value = String(v);
            this._place(tick, this._pct(v));
            if (withLabels) {
                const label = document.createElement('span');
                label.className = 'dm-range-tick-label';
                label.textContent = this._format(v, 'tick');
                tick.appendChild(label);
            }
            wrap.appendChild(tick);
        }
        if (withLabels) root.classList.add('has-tick-labels');
        root.appendChild(wrap);
        return wrap;
    }

    _renderMarks(root) {
        const marks = Array.isArray(this.options.marks) ? this.options.marks : [];
        const list = marks
            .map(m => (m && typeof m === 'object' ? m : {value: m}))
            .filter(m => Number.isFinite(Number(m.value)) && Number(m.value) >= this._min && Number(m.value) <= this._max);
        if (!list.length) return null;
        const wrap = document.createElement('div');
        wrap.className = 'dm-range-marks';
        // Marks repeat what the keyboard can reach, so screen readers skip them; a pointer
        // can still press one to jump to it.
        wrap.setAttribute('aria-hidden', 'true');
        for (const m of list) {
            const v = this._snap(m.value);
            const mark = document.createElement('span');
            mark.className = 'dm-range-mark';
            mark.dataset.value = String(v);
            this._place(mark, this._pct(v));
            const label = document.createElement('span');
            label.className = 'dm-range-mark-label';
            label.textContent = m.label !== undefined && m.label !== null ? String(m.label) : this._format(v, 'mark');
            mark.appendChild(label);
            wrap.appendChild(mark);
        }
        root.classList.add('has-marks');
        root.appendChild(wrap);
        return wrap;
    }

    /** Move the thumbs and fill to the current values and update the ARIA. */
    _paint() {
        if (!this._root) return;
        const vals = this._values;
        const pcts = vals.map(v => this._pct(v));
        const startProp = this._vertical ? 'bottom' : (this._rtl ? 'right' : 'left');
        const sizeProp = this._vertical ? 'height' : 'width';
        const fill = this._fillEl;
        fill.style.left = fill.style.right = fill.style.bottom = '';
        const [from, to] = this.options.range ? pcts : [0, pcts[0]];
        fill.style[startProp] = `${from}%`;
        fill.style[sizeProp] = `${to - from}%`;
        const gap = this._minDistance;
        this._thumbs.forEach((thumb, i) => {
            thumb.style.left = thumb.style.right = thumb.style.bottom = '';
            thumb.style[startProp] = `${pcts[i]}%`;
            const v = vals[i];
            // A thumb's limits are the other thumb's position (WAI-ARIA multi-thumb slider)
            let lo = this._min;
            let hi = this._max;
            if (this.options.range) {
                if (i === 0) hi = this._snap(vals[1] - gap);
                else lo = this._snap(vals[0] + gap);
            }
            thumb.setAttribute('aria-valuemin', String(lo));
            thumb.setAttribute('aria-valuemax', String(hi));
            thumb.setAttribute('aria-valuenow', String(v));
            if (this.options.labels || this.options.format) thumb.setAttribute('aria-valuetext', this._format(v, 'aria'));
            else thumb.removeAttribute('aria-valuetext');
            const tip = thumb.querySelector('.dm-range-tooltip');
            if (tip) tip.textContent = this._format(v, 'tooltip');
        });
        for (const tick of this._ticksEl ? this._ticksEl.children : []) {
            const v = Number(tick.dataset.value);
            tick.classList.toggle('is-in-range', this.options.range ? v >= vals[0] && v <= vals[1] : v <= vals[0]);
        }
    }

    _applyDisabled() {
        const off = flag(this.options.disabled);
        this._root.classList.toggle('is-disabled', off);
        for (const thumb of this._thumbs) {
            thumb.tabIndex = off ? -1 : 0;
            if (off) thumb.setAttribute('aria-disabled', 'true');
            else thumb.removeAttribute('aria-disabled');
        }
        for (const input of this._inputs) input.disabled = off;
    }

    // ---- interaction --------------------------------------------------------

    _bindRoot() {
        const root = this._root;
        this._rootHandlers = [
            [root, 'pointerdown', (e) => this._onPointerDown(e)],
            [root, 'pointermove', (e) => this._onPointerMove(e)],
            [root, 'pointerup', (e) => this._onPointerUp(e)],
            [root, 'pointercancel', (e) => this._onPointerUp(e, true)],
            [root, 'lostpointercapture', (e) => this._onPointerUp(e)],
            [root, 'keydown', (e) => this._onKeyDown(e)]
        ];
        for (const [el, ev, fn] of this._rootHandlers) el.addEventListener(ev, fn);
    }

    _unbindRoot() {
        for (const [el, ev, fn] of this._rootHandlers || []) el.removeEventListener(ev, fn);
        this._rootHandlers = [];
    }

    /** The value under a pointer. */
    _valueAt(e) {
        const r = this._track.getBoundingClientRect();
        let ratio;
        if (this._vertical) ratio = r.height ? (r.bottom - e.clientY) / r.height : 0;
        else {
            ratio = r.width ? (e.clientX - r.left) / r.width : 0;
            if (this._rtl) ratio = 1 - ratio;
        }
        ratio = Math.min(Math.max(ratio, 0), 1);
        return this._snap(this._min + ratio * (this._max - this._min));
    }

    /** Which thumb a press at `value` moves: the one pressed, else the nearer. */
    _pickThumb(e, value) {
        const pressed = e.target?.closest?.('.dm-range-thumb');
        if (pressed && this._root.contains(pressed)) return Number(pressed.dataset.index);
        if (!this.options.range) return 0;
        const [a, b] = this._values;
        const da = Math.abs(value - a);
        const db = Math.abs(value - b);
        if (da === db) return value < a ? 0 : 1;   // stacked thumbs: the direction decides
        return da < db ? 0 : 1;
    }

    _onPointerDown(e) {
        if (flag(this.options.disabled)) return;
        if (e.button !== undefined && e.button !== 0) return;
        const markEl = e.target?.closest?.('.dm-range-mark');
        const value = markEl ? Number(markEl.dataset.value) : this._valueAt(e);
        const index = this._pickThumb(e, value);
        const thumb = this._thumbs[index];
        // No text selection or native drag while sliding; focus is moved by hand
        e.preventDefault();
        thumb.focus({preventScroll: true});
        try { this._root.setPointerCapture(e.pointerId); } catch { /* synthetic events have no capture */ }
        this._drag = {index, pointerId: e.pointerId, start: this._values.slice()};
        this._root.classList.add('is-dragging');
        thumb.classList.add('is-active');
        // Pressing on the thumb itself does not make it jump to the pointer's centre
        if (!e.target?.closest?.('.dm-range-thumb')) this._propose(index, value);
    }

    _onPointerMove(e) {
        if (!this._drag || (e.pointerId !== undefined && e.pointerId !== this._drag.pointerId)) return;
        this._propose(this._drag.index, this._valueAt(e));
    }

    _onPointerUp(e, cancelled = false) {
        const drag = this._drag;
        if (!drag || (e.pointerId !== undefined && drag.pointerId !== undefined && e.pointerId !== drag.pointerId)) return;
        this._drag = null;
        this._root.classList.remove('is-dragging');
        this._thumbs[drag.index]?.classList.remove('is-active');
        try { this._root.releasePointerCapture?.(drag.pointerId); } catch { /* already released */ }
        if (cancelled) {
            if (!this._same(drag.start)) this._apply(drag.start, drag.index, 'input');
            return;
        }
        if (!this._same(drag.start)) this._commit(drag.index);
    }

    _onKeyDown(e) {
        const thumb = e.target?.closest?.('.dm-range-thumb');
        if (!thumb || !KEYS.includes(e.key) || flag(this.options.disabled)) return;
        e.preventDefault();
        const i = Number(thumb.dataset.index);
        const v = this._values[i];
        const step = this._keyStep;
        const back = this._rtl && !this._vertical ? -1 : 1;
        let next = v;
        switch (e.key) {
            case 'ArrowRight': next = v + step * back; break;
            case 'ArrowLeft': next = v - step * back; break;
            case 'ArrowUp': next = v + step; break;
            case 'ArrowDown': next = v - step; break;
            case 'PageUp': next = v + step * 10; break;
            case 'PageDown': next = v - step * 10; break;
            case 'Home': next = this._min; break;
            case 'End': next = this._max; break;
        }
        if (this._propose(i, next)) this._commit(i);
    }

    _same(values) {
        return values.length === this._values.length && values.every((v, i) => v === this._values[i]);
    }

    /** The public value shape for an array of values. */
    _shape(values) {
        return this.options.range ? values.slice() : values[0];
    }

    /**
     * Move one thumb towards `value`, held off the other thumb by minDistance.
     * @returns {boolean} whether the value changed
     */
    _propose(index, value) {
        let v = this._snap(value);
        if (this.options.range) {
            const gap = this._minDistance;
            if (index === 0) v = Math.min(v, this._snap(this._values[1] - gap));
            else v = Math.max(v, this._snap(this._values[0] + gap));
            // snapping the limit can step past it; never cross
            if (index === 0 && v > this._values[1]) v = this._values[1];
            if (index === 1 && v < this._values[0]) v = this._values[0];
        }
        if (v === this._values[index]) return false;
        const next = this._values.slice();
        next[index] = v;
        if (this._fire('beforechange', this._shape(next), this._shape(this._values)) === false) return false;
        this._apply(next, index, 'input');
        return true;
    }

    /** Set values, redraw, and tell the input and listeners about it. */
    _apply(values, index, phase) {
        this._values = values;
        this._writeInputs();
        this._paint();
        this._dispatch(this._inputs[index] || this._inputs[0], 'input');
        if (phase === 'input') this._fire('input', this.getValue());
    }

    _commit(index) {
        this._dispatch(this._inputs[index] || this._inputs[0], 'change');
        this._fire('change', this.getValue());
    }

    /**
     * A native event on a real input, flagged so our own sync listener ignores it. The DOM
     * event goes first: a form listening on change sees the input, then the component's
     * own change (which Forma uses to store the [low, high] pair) has the last word.
     */
    _dispatch(input, type) {
        this._dispatching = true;
        try {
            input.dispatchEvent(new Event(type, {bubbles: true}));
        } finally {
            this._dispatching = false;
        }
    }

    // ---- public API -----------------------------------------------------

    /**
     * The value: a number, or [low, high] with `range: true`.
     * @returns {RangeSliderValue}
     */
    getValue() {
        return this._shape(this._values || []);
    }

    /**
     * Set the value. Fires beforechange (cancelable), the inputs' native input and change
     * events, then input and change - unless `{silent: true}`, which only moves it.
     * @param {RangeSliderValue|number[]|string} value - a number, [low, high] or "low,high"
     * @param {{silent?: boolean}} [opts]
     * @returns {this}
     */
    setValue(value, opts = {}) {
        if (!this._values) return this;
        const next = this._normalise(value);
        if (this._same(next)) return this;
        if (!opts.silent && this._fire('beforechange', this._shape(next), this.getValue()) === false) return this;
        const changed = next.findIndex((v, i) => v !== this._values[i]);
        if (opts.silent) {
            this._values = next;
            this._writeInputs();
            this._paint();
            return this;
        }
        this._apply(next, changed, 'input');
        this._commit(changed);
        return this;
    }

    /**
     * Change the bounds. The value is pulled inside them; if that moves it, input and
     * change fire (without beforechange - the bounds are not the user's to refuse).
     * @param {number} min
     * @param {number} max
     * @returns {this}
     */
    setRange(min, max) {
        if (!this._values) return this;
        this.options.min = num(min, this._min);
        this.options.max = num(max, this._max);
        this._syncInputAttrs();
        const before = this._values.slice();
        this._values = this._normalise(this.options.range ? before : before[0]);
        this._writeInputs();
        this._render();
        if (!this._same(before)) {
            this._apply(this._values, 0, 'input');
            this._commit(0);
        }
        return this;
    }

    /** @returns {this} */
    enable() {
        return this.setOptions({disabled: false});
    }

    /** @returns {this} */
    disable() {
        return this.setOptions({disabled: true});
    }

    /** @returns {boolean} */
    isDisabled() {
        return flag(this.options.disabled);
    }

    _applyOptions() {
        if (!this._values) return;
        // One thumb or two is fixed when the inputs are made
        this.options.range = this._inputs.length === 2;
        this._syncInputAttrs();
        this._values = this._normalise(this.options.range ? this._values : this._values[0]);
        this._writeInputs();
        this._render();
    }

    /**
     * Remove the drawn slider and inputs it made; the caller's input is shown again.
     * @returns {void}
     */
    destroy() {
        if (!this.element) return super.destroy();
        this._timers.forEach(clearTimeout);
        this._timers = [];
        this._unbindRoot();
        this._root?.remove();
        this._root = null;
        for (const input of this._hooked) delete input.value;
        this._hooked = [];
        for (const input of this._made) input.remove();
        this._made = [];
        if (this._isInput && this._restore) {
            const el = this.element;
            el.hidden = this._restore.hidden;
            if (this._restore.name === null) el.removeAttribute('name');
            else el.setAttribute('name', this._restore.name);
            if (this._restore.tabindex === null) el.removeAttribute('tabindex');
            else el.setAttribute('tabindex', this._restore.tabindex);
            for (const attr of ['aria-hidden', 'min', 'max', 'step', 'disabled', 'value']) {
                const value = this._restore[attr === 'aria-hidden' ? 'ariaHidden' : attr];
                if (value === null) el.removeAttribute(attr);
                else el.setAttribute(attr, value);
            }
        }
        this._inputs = null;
        this._values = null;
        this._thumbs = [];
        super.destroy();
        this._onDestroy?.();
    }
}

/**
 * E.rangeSlider: one instance per element; a second call updates it.
 * @param {Element} el
 * @param {RangeSliderOptions} [options]
 * @returns {RangeSlider}
 */
export function rangeSliderFor(el, options = {}) {
    const existing = instanceOf(el, 'range-slider');
    if (existing) return Object.keys(options).length ? existing.setOptions(options) : existing;
    return new RangeSlider(el, options);
}

export default RangeSlider;
