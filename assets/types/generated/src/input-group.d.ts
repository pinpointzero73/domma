export default InputGroup;
/**
 * One addon slot: an icon (a plain icon name), text (set as text, never
 * parsed as HTML), or a string, which is shorthand for `{text}`.
 * `null`, `false` or `''` means no addon.
 */
export type InputGroupSlot = {
    icon: string;
} | {
    text: string | number;
} | string | number | null | false;
export type InputGroupOptions = {
    /**
     * - Addon joined to the start of the input
     */
    prefix?: InputGroupSlot | undefined;
    /**
     * - Addon joined to the end of the input
     */
    suffix?: InputGroupSlot | undefined;
    /**
     * - Password inputs: show / hide toggle button (aria-pressed, eye / eye-off)
     */
    reveal?: boolean | undefined;
    /**
     * - Text-like inputs and textareas: clear button shown while there is a
     * value; clearing fires input + change and refocuses the input
     */
    clear?: boolean | undefined;
    /**
     * - Number inputs: - and + buttons honouring min / max / step, disabled at
     * the limits, input + change per step, hold to repeat
     */
    stepper?: boolean | undefined;
    /**
     * - Text-like inputs and textareas: live "12 / 200" counter after the group
     * (aria-live polite, added to aria-describedby). `true` reads maxLength;
     * a number is the limit. `.is-warning` from 90%, `.is-over` past it
     */
    counter?: number | boolean | undefined;
    /**
     * - Accessible names for the buttons
     */
    labels?: {
        reveal?: string;
        clear?: string;
        decrease?: string;
        increase?: string;
    } | undefined;
};
/**
 * The extras' elements, present only for the extras in use.
 */
export type InputGroupExtras = {
    reveal?: HTMLButtonElement | undefined;
    clear?: HTMLButtonElement | undefined;
    decrease?: HTMLButtonElement | undefined;
    increase?: HTMLButtonElement | undefined;
    counter?: HTMLElement | undefined;
};
export type InputGroupInstance = InputGroup;
declare class InputGroup extends Component {
    static defaults: {
        prefix: null;
        suffix: null;
        reveal: boolean;
        clear: boolean;
        stepper: boolean;
        counter: boolean;
        labels: {
            reveal: string;
            clear: string;
            decrease: string;
            increase: string;
        };
    };
    /**
     * @param {string|HTMLElement} selector - The input (or textarea / select), or a selector for it
     * @param {InputGroupOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: InputGroupOptions);
    /** The bound input (or textarea / select). @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} */
    input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    _extraHandlers: any[];
    _timers: {};
    /** The extras' elements (reveal, clear, decrease, increase, counter). @type {InputGroupExtras} */
    extras: InputGroupExtras;
    _ownsWrapper: boolean | undefined;
    /** The `.input-group-icon` wrapper; null after destroy(). @type {HTMLElement|null} */
    wrapper: HTMLElement | null;
    _manageAddons: boolean | undefined;
    /**
     * Change the addons or the extras; `null` removes an addon, `false` an
     * extra; a key left out is kept. Returns the instance.
     * @param {InputGroupOptions} [opts]
     * @returns {this}
     */
    update(opts?: InputGroupOptions): this;
    /**
     * Re-read the input: clear-button visibility, stepper limits, counter.
     * Call it after setting `input.value` from code without an input event.
     * @returns {this}
     */
    refresh(): this;
    _applyOptions(): void;
    _render(): void;
    /**
     * The input loses its rounded corner on a side where anything visible
     * joins it; a hidden clear button leaves that corner round.
     */
    _syncEdges(): void;
    _listen(el: any, event: any, handler: any, opts: any): void;
    _limits(): {
        min: number | null;
        max: number | null;
        step: number | null;
    };
    _counterLimit(): any;
    _buildExtras(): void;
    _describedBy: string | null | undefined;
    _setRevealed(on: any): void;
    /** Dispatch input and change so Forma's model and any listener see it. */
    _fireInput(): void;
    /**
     * One step in `dir` (-1 / 1), honouring min, max and step (fires input + change).
     * @param {1|-1|number} dir - 1 up, -1 down
     * @returns {this}
     */
    step(dir: 1 | -1 | number): this;
    _bindStep(btn: any, dir: any): void;
    _pointerStepped: boolean | undefined;
    _stopRepeat(): void;
    _teardownExtras(): void;
}
import Component from './component.js';
