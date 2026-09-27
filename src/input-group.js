/**
 * Domma InputGroup Component
 *
 * Joins an icon or a little text to the start and/or end of an input that is
 * already on the page - a search box with a magnifier, a price with "£", a
 * weight with "kg" - Bootstrap-style: the addon and the input share one border
 * and one rounded outline.
 *
 * It produces exactly the markup Forma writes for `formConfig.prefix` /
 * `formConfig.suffix`, so a hand-written input and a blueprint field look and
 * behave the same, and binding it to an input Forma already wrapped just
 * updates that wrapper.
 *
 *   E.inputGroup('#price', {prefix: '£', suffix: '.00'});
 *   E.inputGroup('#q', {prefix: {icon: 'search'}});
 *
 * A slot is `{icon: 'name'}`, `{text: '£'}`, or a string (text). Text is set
 * as text, never parsed as HTML. Addons are decoration: clicks pass through to
 * the input.
 *
 * Four extras are real buttons (or a live counter) joined in the same style,
 * and take the same names as Forma's `formConfig` keys:
 *
 *   reveal:  true          a show / hide toggle on a password input
 *   clear:   true          a clear button, shown only while there is a value
 *   stepper: true          - and + around a number input (min / max / step)
 *   counter: true | 200    "12 / 200" under the control; true reads maxLength
 */

import Component from './component.js';

const WRAPPER = 'input-group-icon';
const ICON_NAME = /^[a-z0-9-]+$/i;
const CLEARABLE = /^(text|search|email|url|tel|password|number|date|datetime-local|time|month|week)$/;
const COUNTABLE = /^(text|search|email|url|tel|password)$/;
const REPEAT_DELAY = 400;
const REPEAT_EVERY = 70;
const WARN_AT = 0.9;

let uid = 0;

/** A slot descriptor in its one canonical form, or null for "no addon". */
function normaliseSlot(slot) {
    if (slot == null || slot === false || slot === '') return null;
    if (typeof slot === 'string' || typeof slot === 'number') return {text: String(slot)};
    if (typeof slot !== 'object') return null;
    if (slot.icon && ICON_NAME.test(slot.icon)) return {icon: slot.icon};
    if (slot.text != null && slot.text !== '') return {text: String(slot.text)};
    return null;
}

function iconSystem() {
    return (typeof window !== 'undefined' && (window.Domma?.icons || window.I)) || null;
}

function setIcon(el, name) {
    el.textContent = '';
    const icon = document.createElement('span');
    icon.setAttribute('data-icon', name);
    icon.setAttribute('aria-hidden', 'true');
    el.appendChild(icon);
    iconSystem()?.scan?.(el);
}

function buildAddon(slot, side) {
    const addon = document.createElement('span');
    addon.className = `input-group-addon input-group-addon-${side}`;
    addon.setAttribute('aria-hidden', 'true');
    if (slot.icon) {
        const icon = document.createElement('span');
        icon.setAttribute('data-icon', slot.icon);
        addon.appendChild(icon);
    } else {
        addon.textContent = slot.text;
    }
    return addon;
}

function buildButton(kind, side, label, icon) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `input-group-btn input-group-btn-${side} input-group-${kind}`;
    btn.setAttribute('aria-label', label);
    setIcon(btn, icon);
    return btn;
}

/** Number of decimal places in a numeric string or number (1e-3 aware). */
function decimals(n) {
    const s = String(n);
    const e = s.match(/e-(\d+)$/i);
    if (e) return Number(e[1]);
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
}

function numAttr(input, name) {
    const raw = input.getAttribute(name);
    if (raw == null || raw === '' || raw === 'any') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

class InputGroup extends Component {
    static defaults = {
        prefix: null,
        suffix: null,
        reveal: false,
        clear: false,
        stepper: false,
        counter: false,
        labels: {
            reveal: 'Show password',
            clear: 'Clear',
            decrease: 'Decrease',
            increase: 'Increase'
        }
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this.options.labels = {...InputGroup.defaults.labels, ...(options.labels || {})};
        this.input = this.element;
        this._extraHandlers = [];
        this._timers = {};
        this.extras = {};
        if (!this.input) return;

        // Already inside a group (Forma rendered it, or bound before): reuse it.
        const parent = this.input.parentElement;
        this._ownsWrapper = !(parent && parent.classList.contains(WRAPPER));
        if (this._ownsWrapper) {
            this.wrapper = document.createElement('div');
            this.wrapper.className = WRAPPER;
            this.input.before(this.wrapper);
            this.wrapper.appendChild(this.input);
        } else {
            this.wrapper = parent;
        }
        // Addons an existing group already has (Forma's, including its {html}
        // slots) are left alone unless this call says what they should be.
        this._manageAddons = this._ownsWrapper || 'prefix' in options || 'suffix' in options;
        this._render();
        this._buildExtras();
    }

    /**
     * Change the addons or the extras; `null` removes an addon, `false` an
     * extra. Returns the instance.
     */
    update(opts = {}) {
        const {prefix, suffix} = opts;
        let addons = false;
        if (prefix !== undefined) { this.options.prefix = prefix; addons = true; }
        if (suffix !== undefined) { this.options.suffix = suffix; addons = true; }
        if (addons) {
            this._manageAddons = true;
            this._render();
        }
        const extras = ['reveal', 'clear', 'stepper', 'counter'].filter((k) => opts[k] !== undefined);
        if (extras.length || opts.labels) {
            extras.forEach((k) => { this.options[k] = opts[k]; });
            if (opts.labels) this.options.labels = {...this.options.labels, ...opts.labels};
            this._teardownExtras();
            this._buildExtras();
        } else {
            this._syncEdges();
        }
        return this;
    }

    /**
     * Re-read the input: clear-button visibility, stepper limits, counter.
     * Call it after setting `input.value` from code without an input event.
     */
    refresh() {
        const x = this.extras;
        if (!x || !this.input) return this;
        const input = this.input;
        const off = input.disabled || input.readOnly;

        if (x.clear) x.clear.hidden = off || input.value === '';

        if (x.reveal) x.reveal.disabled = input.disabled;

        if (x.decrease) {
            const {min, max} = this._limits();
            const v = input.value === '' ? null : Number(input.value);
            const known = v != null && Number.isFinite(v);
            x.decrease.disabled = off || (known && min != null && v <= min);
            x.increase.disabled = off || (known && max != null && v >= max);
            [x.decrease, x.increase].forEach((b) => {
                if (b.disabled && document.activeElement === b) input.focus();
            });
            if (x.decrease.disabled && x.increase.disabled) this._stopRepeat();
        }

        if (x.counter) {
            const limit = this._counterLimit();
            const count = input.value.length;
            x.counter.textContent = limit ? `${count} / ${limit}` : String(count);
            x.counter.classList.toggle('is-warning', !!limit && count >= Math.ceil(limit * WARN_AT) && count <= limit);
            x.counter.classList.toggle('is-over', !!limit && count > limit);
        }

        this._syncEdges();
        return this;
    }

    _applyOptions() {
        this.options.labels = {...InputGroup.defaults.labels, ...(this.options.labels || {})};
        this._render();
        this._teardownExtras();
        this._buildExtras();
    }

    _render() {
        const w = this.wrapper;
        if (!w) return;
        if (this._manageAddons) {
            w.querySelectorAll(':scope > .input-group-addon').forEach((a) => a.remove());
            const prefix = normaliseSlot(this.options.prefix);
            const suffix = normaliseSlot(this.options.suffix);
            // Outermost: extras (stepper, clear, reveal) sit between addon and input.
            if (prefix) w.prepend(buildAddon(prefix, 'left'));
            if (suffix) w.append(buildAddon(suffix, 'right'));
            if ((prefix && prefix.icon) || (suffix && suffix.icon)) {
                // Icons are drawn by the icon system; scan only this group.
                iconSystem()?.scan?.(w);
            }
        }
        this._syncEdges();
    }

    /**
     * The input loses its rounded corner on a side where anything visible
     * joins it; a hidden clear button leaves that corner round.
     */
    _syncEdges() {
        const w = this.wrapper;
        if (!w || !this.input) return;
        const visible = (el) => el && !el.hidden;
        let left = false;
        let right = false;
        for (let el = this.input.previousElementSibling; el; el = el.previousElementSibling) {
            if (visible(el)) { left = true; break; }
        }
        for (let el = this.input.nextElementSibling; el; el = el.nextElementSibling) {
            if (visible(el)) { right = true; break; }
        }
        w.classList.toggle('has-addon-left', left);
        w.classList.toggle('has-addon-right', right);
    }

    _listen(el, event, handler, opts) {
        el.addEventListener(event, handler, opts);
        this._extraHandlers.push({el, event, handler, opts});
    }

    _limits() {
        return {min: numAttr(this.input, 'min'), max: numAttr(this.input, 'max'), step: numAttr(this.input, 'step')};
    }

    _counterLimit() {
        const c = this.options.counter;
        if (typeof c === 'number' && c > 0) return c;
        const ml = this.input.maxLength;
        return ml > 0 ? ml : null;
    }

    _buildExtras() {
        const input = this.input;
        const w = this.wrapper;
        if (!input || !w) return;
        const o = this.options;
        const L = o.labels;
        const tag = input.tagName.toLowerCase();
        const type = tag === 'textarea' ? 'textarea' : (input.getAttribute('type') || 'text').toLowerCase();
        const isPassword = type === 'password';
        const x = {};
        const after = [];

        if (o.stepper && type === 'number') {
            x.decrease = buildButton('decrease', 'left', L.decrease, 'minus');
            x.increase = buildButton('increase', 'right', L.increase, 'plus');
            input.before(x.decrease);
            this._bindStep(x.decrease, -1);
            this._bindStep(x.increase, 1);
        }

        if (o.clear && (tag === 'textarea' || CLEARABLE.test(type))) {
            x.clear = buildButton('clear', 'right', L.clear, 'x');
            after.push(x.clear);
            this._listen(x.clear, 'mousedown', (e) => e.preventDefault());
            this._listen(x.clear, 'click', () => {
                input.value = '';
                this._emit();
                input.focus();
                this.refresh();
            });
        }

        if (o.reveal && isPassword) {
            x.reveal = buildButton('reveal', 'right', L.reveal, 'eye');
            x.reveal.setAttribute('aria-pressed', 'false');
            after.push(x.reveal);
            this._listen(x.reveal, 'mousedown', (e) => e.preventDefault());
            this._listen(x.reveal, 'click', () => this._setRevealed(x.reveal.getAttribute('aria-pressed') !== 'true'));
        }

        if (x.increase) after.push(x.increase);
        if (after.length) input.after(...after);

        if (input.id) {
            Object.values(x).forEach((b) => b.setAttribute('aria-controls', input.id));
        }

        if (o.counter && (tag === 'textarea' || COUNTABLE.test(type))) {
            x.counter = document.createElement('div');
            x.counter.className = 'form-counter';
            x.counter.id = `${input.id || 'input'}-counter-${++uid}`;
            x.counter.setAttribute('aria-live', 'polite');
            w.after(x.counter);
            const described = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
            this._describedBy = input.getAttribute('aria-describedby');
            input.setAttribute('aria-describedby', [...described, x.counter.id].join(' '));
        }

        this.extras = x;
        if (Object.keys(x).length) {
            this._listen(input, 'input', () => this.refresh());
            this._listen(input, 'change', () => this.refresh());
            if (input.form) {
                this._listen(input.form, 'reset', () => {
                    if (x.reveal) this._setRevealed(false);
                    this._timers.reset = setTimeout(() => this.refresh(), 0);
                });
            }
        }
        this.refresh();
    }

    _setRevealed(on) {
        const btn = this.extras?.reveal;
        if (!btn) return;
        this.input.type = on ? 'text' : 'password';
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        setIcon(btn, on ? 'eye-off' : 'eye');
    }

    /** Dispatch input and change so Forma's model and any listener see it. */
    _emit() {
        this.input.dispatchEvent(new Event('input', {bubbles: true}));
        this.input.dispatchEvent(new Event('change', {bubbles: true}));
    }

    /** One step in `dir` (-1 / 1), honouring min, max and step. */
    step(dir) {
        const input = this.input;
        if (!input || input.disabled || input.readOnly) return this;
        const {min, max, step: rawStep} = this._limits();
        const step = rawStep && rawStep > 0 ? rawStep : 1;
        const base = min != null ? min : 0;
        const places = Math.max(decimals(step), decimals(base));
        const current = input.value === '' || !Number.isFinite(Number(input.value)) ? null : Number(input.value);
        // An empty field steps from 0, as the browser's own spinner does.
        const n = ((current ?? 0) - base) / step;
        const k = dir > 0 ? Math.floor(n + 1e-9) + 1 : Math.ceil(n - 1e-9) - 1;
        let next = base + k * step;
        if (min != null && next < min) next = min;
        if (max != null && next > max) next = max;
        next = Number(next.toFixed(places));
        if (current !== next) {
            input.value = String(next);
            this._emit();
        }
        this.refresh();
        return this;
    }

    _bindStep(btn, dir) {
        this._listen(btn, 'pointerdown', (e) => {
            if (e.button !== 0 || btn.disabled) return;
            e.preventDefault();
            this._pointerStepped = true;
            this.step(dir);
            this._stopRepeat();
            this._timers.delay = setTimeout(() => {
                this._timers.repeat = setInterval(() => {
                    if (btn.disabled) this._stopRepeat();
                    else this.step(dir);
                }, REPEAT_EVERY);
            }, REPEAT_DELAY);
        });
        ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach((ev) => {
            this._listen(btn, ev, () => this._stopRepeat());
        });
        // Keyboard (Enter / Space) arrives as a click with detail 0; a pointer
        // press has already stepped on pointerdown.
        this._listen(btn, 'click', (e) => {
            if (e.detail > 0 && this._pointerStepped) {
                this._pointerStepped = false;
                return;
            }
            this.step(dir);
        });
    }

    _stopRepeat() {
        clearTimeout(this._timers.delay);
        clearInterval(this._timers.repeat);
        this._timers.delay = this._timers.repeat = null;
    }

    _teardownExtras() {
        this._stopRepeat();
        clearTimeout(this._timers.reset);
        for (const {el, event, handler, opts} of this._extraHandlers) {
            el.removeEventListener(event, handler, opts);
        }
        this._extraHandlers = [];
        const x = this.extras || {};
        if (x.reveal && this.input) this.input.type = 'password';
        if (x.counter && this.input) {
            if (this._describedBy) this.input.setAttribute('aria-describedby', this._describedBy);
            else this.input.removeAttribute('aria-describedby');
        }
        Object.values(x).forEach((el) => el.remove());
        this.extras = {};
        this._syncEdges();
    }

    /** Remove the addons and extras, and the wrapper too if this instance made it. */
    destroy() {
        this._teardownExtras();
        if (this.wrapper) {
            if (this._manageAddons) {
                this.wrapper.querySelectorAll(':scope > .input-group-addon').forEach((a) => a.remove());
            }
            this._syncEdges();
            if (this._ownsWrapper && this.wrapper.parentNode) {
                this.wrapper.before(this.input);
                this.wrapper.remove();
            }
        }
        this.wrapper = null;
        super.destroy();
    }
}

export default InputGroup;
