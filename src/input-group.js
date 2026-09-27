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
 */

import Component from './component.js';

const WRAPPER = 'input-group-icon';
const ICON_NAME = /^[a-z0-9-]+$/i;

/** A slot descriptor in its one canonical form, or null for "no addon". */
function normaliseSlot(slot) {
    if (slot == null || slot === false || slot === '') return null;
    if (typeof slot === 'string' || typeof slot === 'number') return {text: String(slot)};
    if (typeof slot !== 'object') return null;
    if (slot.icon && ICON_NAME.test(slot.icon)) return {icon: slot.icon};
    if (slot.text != null && slot.text !== '') return {text: String(slot.text)};
    return null;
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

class InputGroup extends Component {
    static defaults = {
        prefix: null,
        suffix: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this.input = this.element;
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
        this._render();
    }

    /** Change either addon; `null` removes one. Returns the instance. */
    update({prefix, suffix} = {}) {
        if (prefix !== undefined) this.options.prefix = prefix;
        if (suffix !== undefined) this.options.suffix = suffix;
        this._render();
        return this;
    }

    _applyOptions() {
        this._render();
    }

    _render() {
        const w = this.wrapper;
        if (!w) return;
        w.querySelectorAll(':scope > .input-group-addon').forEach((a) => a.remove());
        const prefix = normaliseSlot(this.options.prefix);
        const suffix = normaliseSlot(this.options.suffix);
        if (prefix) this.input.before(buildAddon(prefix, 'left'));
        if (suffix) this.input.after(buildAddon(suffix, 'right'));
        w.classList.toggle('has-addon-left', !!prefix);
        w.classList.toggle('has-addon-right', !!suffix);
        if ((prefix && prefix.icon) || (suffix && suffix.icon)) {
            // Icons are drawn by the icon system; scan only this group.
            const icons = (typeof window !== 'undefined' && (window.Domma?.icons || window.I)) || null;
            icons?.scan?.(w);
        }
    }

    /** Remove the addons, and the wrapper too if this instance made it. */
    destroy() {
        if (this.wrapper) {
            this.wrapper.querySelectorAll(':scope > .input-group-addon').forEach((a) => a.remove());
            this.wrapper.classList.remove('has-addon-left', 'has-addon-right');
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
