/**
 * Field types a form can render. Anything not listed renders as a text input.
 * `boolean`/`checkbox` are one checkbox; `select`/`radio`/`checkbox-group`/`multiselect`/`chooser` take `options`;
 * `slider` is an E.rangeSlider (as is `range` with `formConfig.slider`); `dropzone` is an E.dropzone (value: File[]);
 * `signature` is an E.signature pad (value: base64 PNG).
 * @typedef {'string'|'email'|'password'|'number'|'integer'|'float'|'boolean'|'checkbox'|'date'|'datetime'|'time'|'url'|'tel'|'color'|'range'|'file'|'hidden'|'signature'|'select'|'multiselect'|'textarea'|'radio'|'checkbox-group'|'chooser'|'slider'|'dropzone'|(string & {})} FormFieldType
 */
/**
 * A choice for select / radio / checkbox-group / multiselect / chooser fields. A plain string is both the
 * value and (capitalised) the label. Chooser options also read icon, description, badge, tooltip, etc.
 * @typedef {string|{value: any, label: string, [key: string]: any}} FormOption
 */
/**
 * An input-group addon for `formConfig.prefix` / `formConfig.suffix`: `{icon}` draws a Domma icon,
 * `{text}` escaped text, `{html}` raw HTML (the caller's responsibility); a string is shorthand for `{text}`.
 * @typedef {string|{icon: string}|{text: string|number}|{html: string}} FormAddon
 */
/**
 * How a field is presented (`fieldDef.formConfig`). Slider fields pass range/ticks/tickLabels/labels/format/
 * tooltip/marks/minDistance/orientation/rtl/names/ariaLabels/className to E.rangeSlider; dropzone fields pass
 * accept/multiple/maxFiles/maxSize/minSize/previews/upload/autoUpload/retry/labels/list/className to E.dropzone.
 * @typedef {object} FormFieldConfig
 * @property {string} [placeholder]
 * @property {string} [hint] - Small text beside the label; also the message when `pattern` fails
 * @property {string} [helperText] - Text under the control (HTML)
 * @property {string} [tooltip] - Tooltip on the label (a slider field also passes it to E.rangeSlider)
 * @property {number} [span] - Columns the field spans in a grid layout
 * @property {boolean} [disabled]
 * @property {number} [rows] - textarea rows (default 3)
 * @property {number|'any'} [step] - Used when the field definition has no `step`
 * @property {string} [autocomplete]
 * @property {FormAddon} [prefix]
 * @property {FormAddon} [suffix]
 * @property {boolean} [reveal] - password: show / hide toggle
 * @property {boolean} [clear] - text-like inputs and textareas: a clear button
 * @property {boolean} [stepper] - number / integer / float: - and + buttons
 * @property {boolean|number} [counter] - text-like inputs and textareas: a character counter; true reads `maxLength`
 * @property {Record<string, string>|((value: number, where: 'tick'|'mark'|'tooltip'|'aria') => string)} [labels] - Text for the input extras or the dropzone; a slider's value formatter
 * @property {string|string[]} [accept] - file / dropzone
 * @property {boolean} [multiple] - file / dropzone (a dropzone allows several unless false)
 * @property {boolean} [slider] - Render a `range` field as E.rangeSlider
 * @property {boolean} [range] - slider: two thumbs, value [low, high]
 * @property {import('./components/range-slider.js').RangeSliderOptions['ticks']} [ticks]
 * @property {boolean} [tickLabels]
 * @property {import('./components/range-slider.js').RangeSliderOptions['format']} [format]
 * @property {import('./components/range-slider.js').RangeSliderOptions['marks']} [marks]
 * @property {number} [minDistance]
 * @property {'horizontal'|'vertical'} [orientation]
 * @property {boolean|null} [rtl]
 * @property {[string, string]|null} [names]
 * @property {[string, string]|null} [ariaLabels]
 * @property {string} [className]
 * @property {number|null} [maxFiles]
 * @property {number|null} [maxSize] - Bytes
 * @property {number|null} [minSize] - Bytes
 * @property {boolean} [previews]
 * @property {import('./components/dropzone.js').DropzoneOptions['upload']} [upload]
 * @property {boolean} [autoUpload]
 * @property {number} [retry]
 * @property {boolean|string|HTMLElement} [list]
 */
/**
 * One field of a form blueprint. The same object also feeds `M.create` (the form builds its model from the
 * blueprint), so model keys such as `default`, `required` and `validate` apply to both.
 * @typedef {object} FormFieldDefinition
 * @property {FormFieldType} [type] - default 'string'
 * @property {string} [label] - default: the capitalised field name
 * @property {any} [default]
 * @property {boolean} [required]
 * @property {boolean} [readonly] - Renders the control disabled
 * @property {number} [min]
 * @property {number} [max]
 * @property {number|'any'} [step]
 * @property {number} [minLength]
 * @property {number} [maxLength]
 * @property {RegExp} [pattern]
 * @property {(value: any, data: Record<string, any>) => boolean|string} [validate] - true passes; a string (or anything else) fails with that message
 * @property {FormOption[]} [options] - Choices for select / radio / checkbox-group / multiselect / chooser
 * @property {FormFieldConfig} [formConfig]
 * @property {(value: any, row: Record<string, any>, index: number) => string} [tableRender] - `F.crud` table cell renderer
 * @property {'card'|'chip'} [variant] - chooser (default 'card')
 * @property {boolean} [multiple] - chooser: several choices (value is an array)
 * @property {'comfortable'|'compact'} [density] - chooser
 * @property {number} [columns] - chooser (default 3)
 * @property {string} [accent] - chooser: semantic name or CSS colour (default 'primary')
 * @property {'border'|'solid'|'glow'|'overlay'|'underline'} [accentStyle] - chooser
 * @property {boolean} [glow] - chooser
 * @property {string|null} [glowColour] - chooser
 * @property {string} [shadow] - chooser (default 'none')
 * @property {string|null} [shadowColour] - chooser
 */
/**
 * A form blueprint: field name -> definition. Fields render in key order unless `options.sections` says otherwise.
 * @typedef {{[field: string]: FormFieldDefinition}} FormBlueprint
 */
/**
 * A group of fields (`options.sections`); with a title it is a fieldset with a legend.
 * @typedef {object} FormSection
 * @property {string} [title]
 * @property {string[]} [fields] - Blueprint keys, in order
 * @property {'grid'|'stacked'} [layout]
 * @property {number} [columns] - grid columns (default 2)
 */
/**
 * @typedef {object} FormOptions
 * @property {'stacked'|'grid'|'inline'} [layout] - default 'stacked'
 * @property {2|3|number} [columns] - grid layout columns (2 or 3, default 2)
 * @property {'top'|'left'|'floating'} [labelPosition] - default 'top'
 * @property {boolean} [showLabels] - default true
 * @property {boolean} [showHelperText] - default true
 * @property {boolean} [showHints] - default true
 * @property {'blur'|'change'|'submit'} [validationMode] - default 'blur'
 * @property {'domma'|'bootstrap'|'tailwind'} [cssFramework] - default 'domma'
 * @property {string} [className] - default 'domma-form'
 * @property {string} [fieldClassName] - default 'domma-form-field'
 * @property {string} [labelClassName] - default 'form-label'
 * @property {string} [inputClassName] - default 'form-input'
 * @property {string} [errorClassName] - default 'form-error'
 * @property {string} [helperClassName] - default 'form-helper-text'
 * @property {string} [hintClassName] - default 'form-hint'
 * @property {boolean} [cardWrapper] - Wrap the form in a card (default false)
 * @property {FormSection[]} [sections]
 * @property {boolean} [showSubmitButton] - default true
 * @property {string} [submitText] - default 'Submit'
 * @property {string} [resetText] - Adds a reset button with this text
 * @property {'left'|'center'|'right'} [buttonAlignment] - default 'right'
 * @property {(data: Record<string, any>, form: FormInstance) => void} [onSubmit] - A valid submit
 * @property {(errors: Record<string, string>, form: FormInstance) => void} [onValidationError] - An invalid submit
 * @property {string} [persist] - Passed to the model: a storage key to keep the values under
 * @property {boolean} [autoSave] - Passed to the model
 */
/**
 * What `handleSubmit()` returns.
 * @typedef {object} FormSubmitResult
 * @property {boolean} isValid
 * @property {Record<string, any>} data
 * @property {Record<string, string>} errors - field name -> message
 */
/**
 * One step of `F.wizard`.
 * @typedef {object} FormWizardStep
 * @property {string} [title] - default 'Step <n>'
 * @property {string} [description]
 * @property {FormBlueprint} fields - The step's blueprint
 * @property {'stacked'|'grid'|'inline'} [layout]
 */
/**
 * `F.wizard` options; the rest are FormOptions applied to every step.
 * @typedef {FormOptions & {
 *   schema: {steps: FormWizardStep[]},
 *   data?: Record<string, any>,
 *   prevText?: string,
 *   nextText?: string,
 *   finishText?: string,
 *   onStepChange?: (stepIndex: number, data: Record<string, any>) => void,
 *   onValidation?: (isValid: boolean, errors: Record<string, string>, stepIndex: number) => void,
 *   onSubmit?: (data: Record<string, any>, form: FormInstance) => void|Promise<void>,
 *   onError?: (error: any, data: Record<string, any>, form: FormInstance) => void
 * }} FormWizardOptions
 */
/**
 * The control object `F.wizard` returns.
 * @typedef {object} FormWizard
 * @property {() => void} nextStep
 * @property {() => void} prevStep
 * @property {(stepIndex: number) => void} goToStep
 * @property {() => number} getCurrentStep - 0-based
 * @property {() => Record<string, any>} getStepData - The values gathered so far (a copy)
 * @property {(data: Record<string, any>) => void} setStepData - Merge values in and re-render the step
 * @property {() => boolean} validate - Validate the current step
 * @property {() => HTMLElement|null} getElement
 * @property {() => void} destroy - Tear down the current step's controls and remove the wizard
 */
/**
 * `F.modal` options; the rest are FormOptions (`onSubmit` and `showSubmitButton` are set by the modal).
 * @typedef {FormOptions & {
 *   title?: string,
 *   saveText?: string,
 *   closeOnSave?: boolean,
 *   size?: string,
 *   onSave?: (data: Record<string, any>, form: FormInstance) => void|Promise<void>,
 *   onError?: (error: any, data: Record<string, any>, form: FormInstance) => void
 * }} FormModalOptions
 */
/**
 * The control object `F.modal` returns. `close()` removes the modal from the page.
 * @typedef {object} FormModal
 * @property {() => void} open
 * @property {() => void} close
 * @property {() => boolean} isOpen
 */
/**
 * `F.crud` configuration.
 * @typedef {object} FormCrudConfig
 * @property {FormBlueprint} schema
 * @property {string} endpoint - REST endpoint (GET list, POST create, PUT/DELETE `<endpoint>/<id>`); responses are `{success, data, message}`
 * @property {string|HTMLElement} [tableSelector] - Where the table goes
 * @property {string} [title] - default 'Manage Items'
 * @property {string} [primaryKey] - default 'id'
 * @property {string} [displayField] - default 'name'
 * @property {Record<string, string>} [headers]
 * @property {(error: any) => void} [onError]
 * @property {(message: string) => void} [onSuccess]
 */
/**
 * The object `F.crud` returns. Call `init()` to load the data and build the table.
 * @typedef {object} FormCrud
 * @property {() => Promise<void>} init
 * @property {() => Promise<void>} loadData
 * @property {() => void} createTable
 * @property {() => void} initializeTableIcons
 * @property {() => void} bindEvents
 * @property {() => Promise<void>} create - Open the create modal
 * @property {(id: string|number) => Promise<void>} edit - Open the edit modal for an item
 * @property {(id: string|number) => Promise<void>} delete - Confirm, then delete an item
 * @property {() => Promise<void>} refresh
 * @property {() => Record<string, any>[]} getData
 * @property {() => import('./tables.js').TableInstance|null} getTable
 * @property {(item: Record<string, any>) => void} addItem
 * @property {(id: string|number, updates: Record<string, any>) => void} updateItem
 * @property {(id: string|number) => void} removeItem
 */
/** @typedef {Forma} FormInstance */
/**
 * Forma Class - Generates forms from Model schemas
 */
export class Forma {
    static defaults: {
        layout: string;
        columns: number;
        labelPosition: string;
        showLabels: boolean;
        showHelperText: boolean;
        showHints: boolean;
        validationMode: string;
        cssFramework: string;
        className: string;
        fieldClassName: string;
        labelClassName: string;
        inputClassName: string;
        errorClassName: string;
        helperClassName: string;
        hintClassName: string;
        cardWrapper: boolean;
    };
    static inputTypes: {
        string: string;
        email: string;
        password: string;
        number: string;
        integer: string;
        float: string;
        boolean: string;
        date: string;
        datetime: string;
        time: string;
        url: string;
        tel: string;
        color: string;
        range: string;
        file: string;
        hidden: string;
        signature: string;
    };
    /**
     * @param {FormBlueprint} schema
     * @param {Record<string, any>} [data] - Initial values
     * @param {FormOptions} [options]
     */
    constructor(schema: FormBlueprint, data?: Record<string, any>, options?: FormOptions);
    /** @type {FormBlueprint} */
    schema: FormBlueprint;
    /** @type {Record<string, any>} */
    data: Record<string, any>;
    /** @private */
    private _startData;
    /** @type {FormOptions} */
    options: FormOptions;
    /** @type {import('./models.js').Model|null} The model built from the blueprint */
    model: import("./models.js").Model | null;
    /** @type {Record<string, string>} field name -> error message */
    errors: Record<string, string>;
    /** @type {Set<string>} Fields that have lost focus at least once */
    touched: Set<string>;
    /** @type {typeof utils} */
    utils: typeof utils;
    /** @type {typeof models} */
    models: typeof models;
    /**
     * Generate form HTML
     * @returns {string}
     */
    render(): string;
    /**
     * Render form into DOM element
     * @param {string|HTMLElement} selector - Container (its content is replaced)
     * @returns {HTMLElement} The container
     */
    renderTo(selector: string | HTMLElement): HTMLElement;
    /** @type {HTMLFormElement|null} The rendered <form> */
    formElement: HTMLFormElement | null;
    /**
     * Build the complete form structure
     * @private
     */
    private _buildForm;
    /**
     * Build a form section
     * @private
     */
    private _buildSection;
    /**
     * Build individual field
     * @private
     */
    private _buildField;
    /**
     * Builds an HTML input element based on the provided field definition and options.
     *
     * @param {string} fieldName - The name of the field, used as the 'name' attribute for the input.
     * @param {Object} fieldDef - The field definition containing configuration details such as min, max, pattern, etc.
     * @param {Object} inputOptions - Options to customize the input element including type, value, required, disabled, placeholder, etc.
     *
     * @return {string} A string representing the HTML input element with appropriate attributes and content based on the specified type.
     * @private
     */
    private _buildInput;
    /**
     * The interactive extras a field asks for through formConfig, reduced to
     * those its type can take, or null:
     *   reveal: true         password - show / hide toggle
     *   clear: true          single-line text-like inputs and textareas
     *   stepper: true        number / integer / float - the - and + buttons
     *   counter: true | n    text-like inputs and textareas; true reads the
     *                        field's maxLength
     *
     * @param {string} type
     * @param {Object} fieldDef
     * @return {Object|null}
     * @private
     */
    private _inputExtras;
    /**
     * Joins formConfig.prefix / formConfig.suffix addons to a control's markup.
     * Used for single-line inputs, selects and textareas; a control with neither
     * is returned untouched.
     *
     * @param {string} controlHtml
     * @param {Object} formConfig
     * @return {string}
     * @private
     */
    private _wrapAddons;
    /**
     * Builds an input-group addon (prefix or suffix) for decoration inside a form input.
     *
     * Accepts a slot descriptor object from formConfig.prefix / formConfig.suffix:
     *   { icon: 'search' }   → renders a Domma icon
     *   { text: '$' }        → renders escaped plain text (currency, units, etc.)
     *   { html: '<kbd>K</kbd>' } → renders raw HTML (caller takes responsibility)
     *   '£'                  → shorthand for { text: '£' }
     *
     * @param {Object|undefined} slot  The prefix/suffix descriptor, or falsy to skip.
     * @param {'left'|'right'} side    Which side the addon renders on.
     * @return {string} The addon HTML, or '' if no addon should be rendered.
     * @private
     */
    private _buildAddon;
    /**
     * Constructs the HTML select element based on field definition and current value.
     *
     * @param fieldName
     * @param {Object} fieldDef - The field definition containing options, required status, and other attributes.
     * @param attrs
     * @param currentValue
     * @return {string} A string representing the generated HTML `<select>` element with appropriate options.
     * @private
     */
    private _buildSelect;
    /**
     * Constructs the HTML structure for a radio group based on provided field definitions and attributes.
     *
     * @return {string} A string containing the generated HTML markup for the radio group with proper styling classes.
     * @param fieldName
     * @param fieldDef
     * @param attrs
     * @param currentValue
     * @private
     */
    private _buildRadioGroup;
    /**
     * Build checkbox group
     * @private
     */
    private _buildCheckboxGroup;
    /**
     * Build a placeholder element for a chooser field. The element is
     * hydrated post-render by `_initChooserFields`, which instantiates
     * `Domma.elements.chooser()` inside it. The configuration is round-tripped
     * via a dataset attribute (JSON, attribute-quoted) so the form pipeline
     * stays string-based until hydration time.
     *
     * @param {string} fieldName  blueprint key
     * @param {Object} fieldDef   blueprint definition
     * @param {Object} attrs      attribute object built by _buildField
     * @param {*} currentValue    current model value (string or array)
     * @returns {string} HTML string
     * @private
     */
    private _buildChooser;
    /**
     * Bind events to form
     * @param {HTMLElement} formElement
     * @returns {void}
     */
    _bindEvents(formElement: HTMLElement): void;
    /**
     * The current value of a field from the model, the data, or its default.
     * @private
     */
    private _initialValue;
    /** Store a value a component reported, as the chooser fields do. @private */
    private _storeFieldValue;
    /**
     * Turn every `[data-slider-field]` input into an E.rangeSlider. Slider options come from
     * the field definition (min / max / step) and formConfig (range, ticks, tickLabels,
     * labels, tooltip, marks, minDistance, orientation, rtl, names). With `range: true` the
     * value is [low, high].
     * @param {HTMLElement} formElement
     * @private
     */
    private _initSliderFields;
    /**
     * Turn every `[data-dropzone-field]` placeholder into an E.dropzone over its file input.
     * formConfig passes accept, multiple, maxFiles, maxSize, minSize, previews, upload,
     * autoUpload, retry and labels through. The value is the array of File objects.
     * @param {HTMLElement} formElement
     * @private
     */
    private _initDropzoneFields;
    /** @private */
    private _destroyFieldControls;
    /**
     * Bind E.inputGroup to every control that carries `data-input-extras`,
     * reusing the addon group _wrapAddons may already have written. Instances
     * live on `this._inputGroups` keyed by field name; a re-render or
     * destroy() tears the previous ones down.
     *
     * @param {HTMLElement} formElement
     * @private
     */
    private _initInputExtras;
    /** @private */
    private _destroyInputExtras;
    _inputGroups: {};
    /**
     * Put every field back to the value the form started with (its data, else the schema
     * default): the model, the native inputs, and the slider / dropzone / chooser controls.
     * A `[data-action="reset"]` button inside the form calls it.
     * @returns {this}
     */
    reset(): this;
    /**
     * Remove the listeners and controls the form's input extras added.
     * @returns {void}
     */
    destroy(): void;
    /**
     * Locate every `[data-chooser-field]` placeholder in the rendered form
     * and instantiate `Domma.elements.chooser()` inside it. Stores each
     * control instance on `this._choosers` keyed by field name so
     * `_getFieldValueByName` and `validateField` can read its current value.
     *
     * @param {HTMLElement} formElement
     * @private
     */
    private _initChooserFields;
    _choosers: {};
    /**
     * Initialise any signature fields inside a rendered form.
     * @param {HTMLElement} formElement
     * @private
     */
    private _initSignatureFields;
    /**
     * Initialize tooltips on form labels
     * @private
     */
    private _initTooltips;
    /**
     * Get form data
     * @returns {Record<string, any>}
     */
    getData(): Record<string, any>;
    /**
     * Set form data (merged into the current values)
     * @param {Record<string, any>} data
     * @returns {void}
     */
    setData(data: Record<string, any>): void;
    /**
     * Validate entire form
     * @returns {boolean}
     */
    validate(): boolean;
    /**
     * Validate single field
     * @param {string} fieldName
     * @returns {boolean}
     */
    validateField(fieldName: string): boolean;
    /**
     * Set field error
     * @param {string} fieldName
     * @param {string} message
     * @returns {void}
     */
    setFieldError(fieldName: string, message: string): void;
    /**
     * Clear field error
     * @param {string} fieldName
     * @returns {void}
     */
    clearFieldError(fieldName: string): void;
    /**
     * Handle form submission: validate, then call `onSubmit` or `onValidationError`.
     * @returns {FormSubmitResult}
     */
    handleSubmit(): FormSubmitResult;
    /**
     * Get value from form field element
     * @private
     */
    private _getFieldValue;
    /**
     * Get field value by field name
     * @param {string} fieldName
     * @returns {any}
     */
    _getFieldValueByName(fieldName: string): any;
    /**
     * Validate field value against schema definition
     * @private
     */
    private _validateFieldValue;
}
export namespace forms {
    /**
     * Create a new form builder instance (call `renderTo()` to put it on the page)
     * @param {FormBlueprint} schema
     * @param {Record<string, any>} [data] - Initial values
     * @param {FormOptions} [options]
     * @returns {FormInstance}
     */
    function create(schema: FormBlueprint, data?: Record<string, any>, options?: FormOptions): FormInstance;
    /**
     * Render form into element
     * @param {string|HTMLElement} selector - Container (its content is replaced)
     * @param {FormBlueprint} schema
     * @param {Record<string, any>} [data] - Initial values
     * @param {FormOptions} [options]
     * @returns {HTMLElement} The container
     */
    function render(selector: string | HTMLElement, schema: FormBlueprint, data?: Record<string, any>, options?: FormOptions): HTMLElement;
    /**
     * Create wizard form (multi-step form)
     * @param {string|HTMLElement} selector - Container
     * @param {FormWizardOptions} options
     * @returns {FormWizard}
     */
    function wizard(selector: string | HTMLElement, options?: FormWizardOptions): FormWizard;
    /**
     * Create modal form (integration with existing modal system). The modal is added to the page
     * at once, hidden; call `open()`.
     * @param {FormBlueprint} schema
     * @param {Record<string, any>} [data] - Initial values
     * @param {FormModalOptions} [options]
     * @returns {FormModal}
     */
    function modal(schema: FormBlueprint, data?: Record<string, any>, options?: FormModalOptions): FormModal;
    /**
     * CRUD Helper - Complete Create, Read, Update, Delete functionality
     * @param {FormCrudConfig} config
     * @returns {FormCrud}
     */
    function crud(config: FormCrudConfig): FormCrud;
}
/**
 * Field types a form can render. Anything not listed renders as a text input.
 * `boolean`/`checkbox` are one checkbox; `select`/`radio`/`checkbox-group`/`multiselect`/`chooser` take `options`;
 * `slider` is an E.rangeSlider (as is `range` with `formConfig.slider`); `dropzone` is an E.dropzone (value: File[]);
 * `signature` is an E.signature pad (value: base64 PNG).
 */
export type FormFieldType = "string" | "email" | "password" | "number" | "integer" | "float" | "boolean" | "checkbox" | "date" | "datetime" | "time" | "url" | "tel" | "color" | "range" | "file" | "hidden" | "signature" | "select" | "multiselect" | "textarea" | "radio" | "checkbox-group" | "chooser" | "slider" | "dropzone" | (string & {});
/**
 * A choice for select / radio / checkbox-group / multiselect / chooser fields. A plain string is both the
 * value and (capitalised) the label. Chooser options also read icon, description, badge, tooltip, etc.
 */
export type FormOption = string | {
    value: any;
    label: string;
    [key: string]: any;
};
/**
 * An input-group addon for `formConfig.prefix` / `formConfig.suffix`: `{icon}` draws a Domma icon,
 * `{text}` escaped text, `{html}` raw HTML (the caller's responsibility); a string is shorthand for `{text}`.
 */
export type FormAddon = string | {
    icon: string;
} | {
    text: string | number;
} | {
    html: string;
};
/**
 * How a field is presented (`fieldDef.formConfig`). Slider fields pass range/ticks/tickLabels/labels/format/
 * tooltip/marks/minDistance/orientation/rtl/names/ariaLabels/className to E.rangeSlider; dropzone fields pass
 * accept/multiple/maxFiles/maxSize/minSize/previews/upload/autoUpload/retry/labels/list/className to E.dropzone.
 */
export type FormFieldConfig = {
    placeholder?: string;
    /**
     * - Small text beside the label; also the message when `pattern` fails
     */
    hint?: string;
    /**
     * - Text under the control (HTML)
     */
    helperText?: string;
    /**
     * - Tooltip on the label (a slider field also passes it to E.rangeSlider)
     */
    tooltip?: string;
    /**
     * - Columns the field spans in a grid layout
     */
    span?: number;
    disabled?: boolean;
    /**
     * - textarea rows (default 3)
     */
    rows?: number;
    /**
     * - Used when the field definition has no `step`
     */
    step?: number | "any";
    autocomplete?: string;
    prefix?: FormAddon;
    suffix?: FormAddon;
    /**
     * - password: show / hide toggle
     */
    reveal?: boolean;
    /**
     * - text-like inputs and textareas: a clear button
     */
    clear?: boolean;
    /**
     * - number / integer / float: - and + buttons
     */
    stepper?: boolean;
    /**
     * - text-like inputs and textareas: a character counter; true reads `maxLength`
     */
    counter?: boolean | number;
    /**
     * - Text for the input extras or the dropzone; a slider's value formatter
     */
    labels?: Record<string, string> | ((value: number, where: "tick" | "mark" | "tooltip" | "aria") => string);
    /**
     * - file / dropzone
     */
    accept?: string | string[];
    /**
     * - file / dropzone (a dropzone allows several unless false)
     */
    multiple?: boolean;
    /**
     * - Render a `range` field as E.rangeSlider
     */
    slider?: boolean;
    /**
     * - slider: two thumbs, value [low, high]
     */
    range?: boolean;
    ticks?: import("./components/range-slider.js").RangeSliderOptions["ticks"];
    tickLabels?: boolean;
    format?: import("./components/range-slider.js").RangeSliderOptions["format"];
    marks?: import("./components/range-slider.js").RangeSliderOptions["marks"];
    minDistance?: number;
    orientation?: "horizontal" | "vertical";
    rtl?: boolean | null;
    names?: [string, string] | null;
    ariaLabels?: [string, string] | null;
    className?: string;
    maxFiles?: number | null;
    /**
     * - Bytes
     */
    maxSize?: number | null;
    /**
     * - Bytes
     */
    minSize?: number | null;
    previews?: boolean;
    upload?: import("./components/dropzone.js").DropzoneOptions["upload"];
    autoUpload?: boolean;
    retry?: number;
    list?: boolean | string | HTMLElement;
};
/**
 * One field of a form blueprint. The same object also feeds `M.create` (the form builds its model from the
 * blueprint), so model keys such as `default`, `required` and `validate` apply to both.
 */
export type FormFieldDefinition = {
    /**
     * - default 'string'
     */
    type?: FormFieldType;
    /**
     * - default: the capitalised field name
     */
    label?: string;
    default?: any;
    required?: boolean;
    /**
     * - Renders the control disabled
     */
    readonly?: boolean;
    min?: number;
    max?: number;
    step?: number | "any";
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    /**
     * - true passes; a string (or anything else) fails with that message
     */
    validate?: (value: any, data: Record<string, any>) => boolean | string;
    /**
     * - Choices for select / radio / checkbox-group / multiselect / chooser
     */
    options?: FormOption[];
    formConfig?: FormFieldConfig;
    /**
     * - `F.crud` table cell renderer
     */
    tableRender?: (value: any, row: Record<string, any>, index: number) => string;
    /**
     * - chooser (default 'card')
     */
    variant?: "card" | "chip";
    /**
     * - chooser: several choices (value is an array)
     */
    multiple?: boolean;
    /**
     * - chooser
     */
    density?: "comfortable" | "compact";
    /**
     * - chooser (default 3)
     */
    columns?: number;
    /**
     * - chooser: semantic name or CSS colour (default 'primary')
     */
    accent?: string;
    /**
     * - chooser
     */
    accentStyle?: "border" | "solid" | "glow" | "overlay" | "underline";
    /**
     * - chooser
     */
    glow?: boolean;
    /**
     * - chooser
     */
    glowColour?: string | null;
    /**
     * - chooser (default 'none')
     */
    shadow?: string;
    /**
     * - chooser
     */
    shadowColour?: string | null;
};
/**
 * A form blueprint: field name -> definition. Fields render in key order unless `options.sections` says otherwise.
 */
export type FormBlueprint = {
    [field: string]: FormFieldDefinition;
};
/**
 * A group of fields (`options.sections`); with a title it is a fieldset with a legend.
 */
export type FormSection = {
    title?: string;
    /**
     * - Blueprint keys, in order
     */
    fields?: string[];
    layout?: "grid" | "stacked";
    /**
     * - grid columns (default 2)
     */
    columns?: number;
};
export type FormOptions = {
    /**
     * - default 'stacked'
     */
    layout?: "stacked" | "grid" | "inline";
    /**
     * - grid layout columns (2 or 3, default 2)
     */
    columns?: 2 | 3 | number;
    /**
     * - default 'top'
     */
    labelPosition?: "top" | "left" | "floating";
    /**
     * - default true
     */
    showLabels?: boolean;
    /**
     * - default true
     */
    showHelperText?: boolean;
    /**
     * - default true
     */
    showHints?: boolean;
    /**
     * - default 'blur'
     */
    validationMode?: "blur" | "change" | "submit";
    /**
     * - default 'domma'
     */
    cssFramework?: "domma" | "bootstrap" | "tailwind";
    /**
     * - default 'domma-form'
     */
    className?: string;
    /**
     * - default 'domma-form-field'
     */
    fieldClassName?: string;
    /**
     * - default 'form-label'
     */
    labelClassName?: string;
    /**
     * - default 'form-input'
     */
    inputClassName?: string;
    /**
     * - default 'form-error'
     */
    errorClassName?: string;
    /**
     * - default 'form-helper-text'
     */
    helperClassName?: string;
    /**
     * - default 'form-hint'
     */
    hintClassName?: string;
    /**
     * - Wrap the form in a card (default false)
     */
    cardWrapper?: boolean;
    sections?: FormSection[];
    /**
     * - default true
     */
    showSubmitButton?: boolean;
    /**
     * - default 'Submit'
     */
    submitText?: string;
    /**
     * - Adds a reset button with this text
     */
    resetText?: string;
    /**
     * - default 'right'
     */
    buttonAlignment?: "left" | "center" | "right";
    /**
     * - A valid submit
     */
    onSubmit?: (data: Record<string, any>, form: FormInstance) => void;
    /**
     * - An invalid submit
     */
    onValidationError?: (errors: Record<string, string>, form: FormInstance) => void;
    /**
     * - Passed to the model: a storage key to keep the values under
     */
    persist?: string;
    /**
     * - Passed to the model
     */
    autoSave?: boolean;
};
/**
 * What `handleSubmit()` returns.
 */
export type FormSubmitResult = {
    isValid: boolean;
    data: Record<string, any>;
    /**
     * - field name -> message
     */
    errors: Record<string, string>;
};
/**
 * One step of `F.wizard`.
 */
export type FormWizardStep = {
    /**
     * - default 'Step <n>'
     */
    title?: string;
    description?: string;
    /**
     * - The step's blueprint
     */
    fields: FormBlueprint;
    layout?: "stacked" | "grid" | "inline";
};
/**
 * `F.wizard` options; the rest are FormOptions applied to every step.
 */
export type FormWizardOptions = FormOptions & {
    schema: {
        steps: FormWizardStep[];
    };
    data?: Record<string, any>;
    prevText?: string;
    nextText?: string;
    finishText?: string;
    onStepChange?: (stepIndex: number, data: Record<string, any>) => void;
    onValidation?: (isValid: boolean, errors: Record<string, string>, stepIndex: number) => void;
    onSubmit?: (data: Record<string, any>, form: FormInstance) => void | Promise<void>;
    onError?: (error: any, data: Record<string, any>, form: FormInstance) => void;
};
/**
 * The control object `F.wizard` returns.
 */
export type FormWizard = {
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (stepIndex: number) => void;
    /**
     * - 0-based
     */
    getCurrentStep: () => number;
    /**
     * - The values gathered so far (a copy)
     */
    getStepData: () => Record<string, any>;
    /**
     * - Merge values in and re-render the step
     */
    setStepData: (data: Record<string, any>) => void;
    /**
     * - Validate the current step
     */
    validate: () => boolean;
    getElement: () => HTMLElement | null;
    /**
     * - Tear down the current step's controls and remove the wizard
     */
    destroy: () => void;
};
/**
 * `F.modal` options; the rest are FormOptions (`onSubmit` and `showSubmitButton` are set by the modal).
 */
export type FormModalOptions = FormOptions & {
    title?: string;
    saveText?: string;
    closeOnSave?: boolean;
    size?: string;
    onSave?: (data: Record<string, any>, form: FormInstance) => void | Promise<void>;
    onError?: (error: any, data: Record<string, any>, form: FormInstance) => void;
};
/**
 * The control object `F.modal` returns. `close()` removes the modal from the page.
 */
export type FormModal = {
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
};
/**
 * `F.crud` configuration.
 */
export type FormCrudConfig = {
    schema: FormBlueprint;
    /**
     * - REST endpoint (GET list, POST create, PUT/DELETE `<endpoint>/<id>`); responses are `{success, data, message}`
     */
    endpoint: string;
    /**
     * - Where the table goes
     */
    tableSelector?: string | HTMLElement;
    /**
     * - default 'Manage Items'
     */
    title?: string;
    /**
     * - default 'id'
     */
    primaryKey?: string;
    /**
     * - default 'name'
     */
    displayField?: string;
    headers?: Record<string, string>;
    onError?: (error: any) => void;
    onSuccess?: (message: string) => void;
};
/**
 * The object `F.crud` returns. Call `init()` to load the data and build the table.
 */
export type FormCrud = {
    init: () => Promise<void>;
    loadData: () => Promise<void>;
    createTable: () => void;
    initializeTableIcons: () => void;
    bindEvents: () => void;
    /**
     * - Open the create modal
     */
    create: () => Promise<void>;
    /**
     * - Open the edit modal for an item
     */
    edit: (id: string | number) => Promise<void>;
    /**
     * - Confirm, then delete an item
     */
    delete: (id: string | number) => Promise<void>;
    refresh: () => Promise<void>;
    getData: () => Record<string, any>[];
    getTable: () => import("./tables.js").TableInstance | null;
    addItem: (item: Record<string, any>) => void;
    updateItem: (id: string | number, updates: Record<string, any>) => void;
    removeItem: (id: string | number) => void;
};
export type FormInstance = Forma;
export type Forms = typeof forms;
import { utils } from './utils.js';
import { models } from './models.js';
