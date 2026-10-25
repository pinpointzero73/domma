/**
 * E.rangeSlider: one instance per element; a second call updates it.
 * @param {Element} el
 * @param {RangeSliderOptions} [options]
 * @returns {RangeSlider}
 */
export function rangeSliderFor(el: Element, options?: RangeSliderOptions): RangeSlider;
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
    /** @type {RangeSliderOptions} */
    static defaults: RangeSliderOptions;
    /**
     * Options not given are read from the input's own attributes, as a plain range input would.
     * @param {*} element
     * @param {RangeSliderOptions} [options]
     * @returns {RangeSliderOptions}
     */
    static fromInput(element: any, options?: RangeSliderOptions): RangeSliderOptions;
    /**
     * @param {string|Element|null} element - an <input type="range"> or a container
     * @param {RangeSliderOptions} [options]
     */
    constructor(element: string | Element | null, options?: RangeSliderOptions);
    _isInput: boolean;
    _made: any[];
    _hooked: any[];
    _dispatching: boolean;
    _drag: {
        index: number;
        pointerId: any;
        start: number[];
    };
    _timers: any[];
    _values: number[];
    get _min(): number;
    get _max(): number;
    /** The step used to snap values; null for step 'any'. */
    get _step(): number;
    /** The step the arrow keys move by. */
    get _keyStep(): number;
    /** Snap to the step grid (counted from min, as a native range input does) and clamp. */
    _snap(v: any): number;
    get _minDistance(): number;
    /** Snap, order and space a candidate value (a number, [a, b] or "a,b"). */
    _normalise(value: any): number[];
    _initialValues(): number[];
    _format(value: any, where: any): string;
    _pct(v: any): number;
    get _vertical(): boolean;
    get _rtl(): boolean;
    _setupInputs(): void;
    _inputs: HTMLElement[];
    _restore: {
        name: string;
        hidden: boolean;
        tabindex: string;
        ariaHidden: string;
        min: string;
        max: string;
        step: string;
        disabled: string;
        value: string;
    };
    _syncInputAttrs(): void;
    /**
     * Code (or M.bind, which writes `input.value`) setting a value programmatically fires
     * no event, so the drawn slider would never move. The instance gets its own `value`
     * property that writes through to the native one and then redraws. Removed on destroy.
     */
    _hookValues(): void;
    /** Push the current values into the real inputs. */
    _writeInputs(): void;
    _writing: boolean;
    /**
     * A form reset returns each input to its value attribute. Inputs this component made,
     * and a caller's input without one, would reset to the midpoint - give them the
     * starting value.
     */
    _setDefaults(): void;
    /** Read the inputs back after something outside changed them. */
    _fromInputs(): void;
    _bindInputs(): void;
    _labels: any[];
    _labelText(): any;
    _render(): void;
    _ticksEl: HTMLDivElement;
    _marksEl: HTMLDivElement;
    _thumbs: any[] | HTMLDivElement[];
    _fillEl: HTMLDivElement;
    _track: HTMLDivElement;
    _root: HTMLDivElement;
    /** Values a tick is drawn at. */
    _tickValues(): number[];
    _place(el: any, pct: any): void;
    _renderTicks(root: any): HTMLDivElement;
    _renderMarks(root: any): HTMLDivElement;
    /** Move the thumbs and fill to the current values and update the ARIA. */
    _paint(): void;
    _applyDisabled(): void;
    _bindRoot(): void;
    _rootHandlers: any[] | (string | HTMLDivElement | ((e: any) => void))[][];
    _unbindRoot(): void;
    /** The value under a pointer. */
    _valueAt(e: any): number;
    /** Which thumb a press at `value` moves: the one pressed, else the nearer. */
    _pickThumb(e: any, value: any): number;
    _onPointerDown(e: any): void;
    _onPointerMove(e: any): void;
    _onPointerUp(e: any, cancelled?: boolean): void;
    _onKeyDown(e: any): void;
    _same(values: any): any;
    /** The public value shape for an array of values. */
    _shape(values: any): any;
    /**
     * Move one thumb towards `value`, held off the other thumb by minDistance.
     * @returns {boolean} whether the value changed
     */
    _propose(index: any, value: any): boolean;
    /** Set values, redraw, and tell the input and listeners about it. */
    _apply(values: any, index: any, phase: any): void;
    _commit(index: any): void;
    /**
     * A native event on a real input, flagged so our own sync listener ignores it. The DOM
     * event goes first: a form listening on change sees the input, then the component's
     * own change (which Forma uses to store the [low, high] pair) has the last word.
     */
    _dispatch(input: any, type: any): void;
    /**
     * The value: a number, or [low, high] with `range: true`.
     * @returns {RangeSliderValue}
     */
    getValue(): RangeSliderValue;
    /**
     * Set the value. Fires beforechange (cancelable), the inputs' native input and change
     * events, then input and change - unless `{silent: true}`, which only moves it.
     * @param {RangeSliderValue|number[]|string} value - a number, [low, high] or "low,high"
     * @param {{silent?: boolean}} [opts]
     * @returns {this}
     */
    setValue(value: RangeSliderValue | number[] | string, opts?: {
        silent?: boolean;
    }): this;
    /**
     * Change the bounds. The value is pulled inside them; if that moves it, input and
     * change fire (without beforechange - the bounds are not the user's to refuse).
     * @param {number} min
     * @param {number} max
     * @returns {this}
     */
    setRange(min: number, max: number): this;
    /** @returns {this} */
    enable(): this;
    /** @returns {this} */
    disable(): this;
    /** @returns {boolean} */
    isDisabled(): boolean;
    _applyOptions(): void;
}
export default RangeSlider;
/**
 * A number, or [low, high] with `range: true`.
 */
export type RangeSliderValue = number | [number, number];
export type RangeSliderMark = {
    value: number;
    label?: string;
};
export type RangeSliderOptions = {
    /**
     * Default: the input's min, else 0
     */
    min?: number;
    /**
     * Default: the input's max, else 100
     */
    max?: number;
    /**
     * Default: the input's step, else 1
     */
    step?: number | "any";
    /**
     * A number, or [low, high] / "low,high" with range: true
     */
    value?: RangeSliderValue | string | null;
    /**
     * Two thumbs; two inputs, sharing `name` unless `names` is given
     */
    range?: boolean;
    orientation?: "horizontal" | "vertical";
    /**
     * true = every step, n = every n units, or the values to draw at
     */
    ticks?: boolean | number | number[];
    /**
     * Label the ticks (always on for an array)
     */
    tickLabels?: boolean;
    /**
     * Formats the value for ticks, marks, the tooltip and aria-valuetext
     */
    labels?: ((value: number, where: "tick" | "mark" | "tooltip" | "aria") => string) | null;
    /**
     * Read when `labels` is not set
     */
    format?: ((value: number, where: "tick" | "mark" | "tooltip" | "aria") => string) | null;
    /**
     * Default 'hover' (also shown on focus and while dragging)
     */
    tooltip?: "always" | "hover" | "never";
    marks?: RangeSliderMark[] | null;
    disabled?: boolean;
    name?: string | null;
    /**
     * [lowName, highName] for range: true
     */
    names?: [string, string] | null;
    /**
     * range: true - the closest the thumbs may come
     */
    minDistance?: number;
    /**
     * null = follow the page's direction
     */
    rtl?: boolean | null;
    ariaLabel?: string | null;
    ariaLabels?: [string, string] | null;
    className?: string;
    /**
     * While dragging, and on each key press
     */
    onInput?: ((value: RangeSliderValue) => void) | null;
    /**
     * When the value is committed
     */
    onChange?: ((value: RangeSliderValue) => void) | null;
    /**
     * Return false to refuse a move
     */
    onBeforeChange?: ((next: RangeSliderValue, current: RangeSliderValue) => boolean | void) | null;
};
export type RangeSliderInstance = RangeSlider;
import Component from '../component.js';
