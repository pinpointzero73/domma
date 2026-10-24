/**
 * Saved templates and the auto-saved active schema, in localStorage. Every method swallows storage
 * errors (a failed read gives an empty list / null, a failed write gives false).
 */
export class SchemaTemplateManager {
    /** @type {string} */
    static STORAGE_KEY: string;
    /** @type {string} */
    static ACTIVE_KEY: string;
    /**
     * List all saved template names.
     * @returns {string[]}
     */
    static list(): string[];
    /**
     * Load a template by name.
     * @param {string} name
     * @returns {SchemaTemplate|null}
     */
    static load(name: string): SchemaTemplate | null;
    /**
     * Save a template (stamps `updatedAt`).
     * @param {string} name
     * @param {{name: string, fields: FieldDefinition[]}} schema
     * @returns {boolean} false when storage failed
     */
    static save(name: string, schema: {
        name: string;
        fields: FieldDefinition[];
    }): boolean;
    /**
     * Delete a template.
     * @param {string} name
     * @returns {boolean} false when there was nothing stored or storage failed
     */
    static delete(name: string): boolean;
    /**
     * Save the active schema (auto-save).
     * @param {FieldDefinition[]} fields
     * @returns {boolean} false when storage failed
     */
    static saveActive(fields: FieldDefinition[]): boolean;
    /**
     * Load the active (auto-saved) schema.
     * @returns {FieldDefinition[]|null}
     */
    static loadActive(): FieldDefinition[] | null;
}
/**
 * A field type in the Field Library (a key of the field type registry).
 */
export type FieldType = "string" | "number" | "boolean" | "email" | "password" | "url" | "tel" | "color" | "range" | "hidden" | "date" | "datetime" | "time" | "select" | "multiselect" | "radio" | "checkbox-group" | "textarea" | "file" | "array" | "object";
/**
 * Export format passed to `onExport`.
 */
export type ExportFormat = "js" | "json" | "typescript";
/**
 * Live preview form layout. `grid-N` renders a grid form with N columns.
 */
export type PreviewLayout = "stacked" | "inline" | "grid-2" | "grid-3" | "grid-4" | "grid-6" | "grid-12";
/**
 * A choice for select / radio / checkbox-group / multiselect fields.
 */
export type FieldOption = {
    value: string | number;
    label: string;
};
/**
 * An addon for `formConfig.prefix` / `formConfig.suffix`: `{icon}`, `{text}`, `{html}` (raw, the caller's
 * responsibility) or a string (shorthand for `{text}`).
 */
export type FormAddon = import("./forms.js").FormAddon;
/**
 * Accessible names for the input extras' buttons.
 */
export type InputExtrasLabels = {
    /**
     * - Default 'Show password'
     */
    reveal?: string;
    /**
     * - Default 'Clear'
     */
    clear?: string;
    /**
     * - Default 'Decrease'
     */
    decrease?: string;
    /**
     * - Default 'Increase'
     */
    increase?: string;
};
/**
 * How a field is presented (`field.formConfig`). The preview hands the blueprint to `F.create`, so every
 * form field option applies; `columns` is the column span the builder's Properties panel edits (1-12).
 */
export type FormConfig = Omit<import("./forms.js").FormFieldConfig, "labels"> & {
    columns?: number;
    labels?: InputExtrasLabels | import("./forms.js").FormFieldConfig["labels"];
};
/**
 * One field as the builder holds it. `getFields()` entries carry `name`; in a blueprint the name is the key.
 */
export type FieldDefinition = {
    /**
     * - Field data type (date fields store 'string', datetime 'datetime-local')
     */
    type: FieldType | "datetime-local" | (string & {});
    /**
     * - Field name (getFields() / templates; not present in blueprints)
     */
    name?: string;
    /**
     * - Is field required?
     */
    required?: boolean;
    /**
     * - Default value
     */
    default?: any;
    /**
     * - Minimum string length
     */
    minLength?: number | null;
    /**
     * - Maximum string length
     */
    maxLength?: number | null;
    /**
     * - Regex pattern for validation
     */
    pattern?: RegExp | string;
    /**
     * - Minimum numeric value
     */
    min?: number | null;
    /**
     * - Maximum numeric value
     */
    max?: number | null;
    /**
     * - Step increment for number / range inputs
     */
    step?: number;
    /**
     * - Options for select, multiselect, radio, checkbox-group
     */
    options?: FieldOption[] | string[];
    /**
     * - Custom validation: true passes, a string is the error
     */
    validate?: (value: any) => boolean | string;
    /**
     * - file: accepted types
     */
    accept?: string;
    /**
     * - file: allow several files
     */
    multiple?: boolean;
    /**
     * - Display label
     */
    label?: string;
    /**
     * - Input placeholder
     */
    placeholder?: string;
    /**
     * - Help text displayed below the field
     */
    help?: string;
    /**
     * - Disable the field
     */
    disabled?: boolean;
    /**
     * - Form configuration
     */
    formConfig?: FormConfig;
};
/**
 * A blueprint: field name -> definition.
 */
export type Blueprint = {
    [fieldName: string]: FieldDefinition;
};
/**
 * An entry of the field type registry (the Field Library).
 */
export type FieldTypeInfo = {
    /**
     * - Display name
     */
    name: string;
    /**
     * - Icon name
     */
    icon: string;
    /**
     * - Category (basic, inputs, selection, datetime, advanced)
     */
    category: string;
    /**
     * - Field description
     */
    description: string;
    /**
     * - Default field definition
     */
    defaults: FieldDefinition;
};
/**
 * A saved template (localStorage, `domma:schema-builder-templates`).
 */
export type SchemaTemplate = {
    name: string;
    fields: FieldDefinition[];
    /**
     * - Date.now() of the last save
     */
    updatedAt: number;
};
/**
 * Schema Builder options.
 */
export type SchemaBuilderOptions = {
    /**
     * - Theme variant (default 'light')
     */
    theme?: "light" | "dark";
    /**
     * - Auto-save the active schema to localStorage (default true)
     */
    autoSave?: boolean;
    /**
     * - Auto-save interval in milliseconds (default 30000)
     */
    autoSaveInterval?: number;
    /**
     * - Show the live preview panel on start (default true)
     */
    showPreview?: boolean;
    /**
     * - Preview form layout (default 'stacked')
     */
    previewLayout?: PreviewLayout;
    /**
     * - Called when the schema changes
     */
    onChange?: ((fields: FieldDefinition[]) => void) | null;
    /**
     * - Called when a template is saved
     */
    onSave?: ((name: string, schema: {
        name: string;
        fields: FieldDefinition[];
    }) => void) | null;
    /**
     * - Called on every export
     */
    onExport?: ((format: ExportFormat, data: string) => void) | null;
};
/**
 * Options for `exportJS()`. None are read at present.
 */
export type ExportJSOptions = Record<string, unknown>;
/**
 * Options for `exportJSON()`. None are read at present.
 */
export type ExportJSONOptions = Record<string, unknown>;
/**
 * Options for `exportTypeScript()`.
 */
export type ExportTypeScriptOptions = {
    /**
     * - TypeScript interface name (default 'FormData')
     */
    interfaceName?: string;
};
/**
 * Create a Schema Builder instance (`E.schemaBuilder`).
 */
export type SchemaBuilderFactory = (selector: string | HTMLElement, options?: SchemaBuilderOptions) => SchemaBuilderInstance;
export type SchemaBuilderInstance = SchemaBuilder;
/**
 * Visual drag-and-drop blueprint designer.
 */
export class SchemaBuilder extends Component {
    /** @type {Required<SchemaBuilderOptions>} */
    static defaults: Required<SchemaBuilderOptions>;
    /**
     * @param {string|HTMLElement} selector - CSS selector or HTMLElement
     * @param {SchemaBuilderOptions} [options] - Configuration options
     */
    constructor(selector: string | HTMLElement, options?: SchemaBuilderOptions);
    /** @type {FieldDefinition[]} */
    _fields: FieldDefinition[];
    _selectedIndex: number;
    _schemaName: string;
    _isDirty: boolean;
    _dragSource: string;
    _autoSaveTimer: number;
    _previewForm: any;
    _refs: {};
    _init(): void;
    _render(): void;
    _renderLibrary(): void;
    _renderCanvas(): void;
    _renderEditor(fieldIndex: any): void;
    _renderFieldSpecificProperties(field: any): string;
    _attachOptionsEditor(): void;
    _renderPreview(): void;
    _attachEvents(): void;
    /**
     * Utility for event delegation with cleanup tracking
     * @private
     */
    private _on;
    _handlePropertyChange(e: any): void;
    _selectField(index: any): void;
    /**
     * Add a field to the schema and select it. An unknown type does nothing.
     * @param {FieldType} type - Field type
     * @param {number} position - Position to insert (0-based index)
     * @returns {this}
     */
    addField(type: FieldType, position: number): this;
    /**
     * Remove a field from the schema.
     * @param {number} index - Field index to remove
     * @returns {this}
     */
    removeField(index: number): this;
    /**
     * Duplicate a field (the copy's name gets `_copy`) and select the copy.
     * @param {number} index - Field index to duplicate
     * @returns {this}
     */
    duplicateField(index: number): this;
    /**
     * Update field properties (shallow merge).
     * @param {number} index - Field index to update
     * @param {Partial<FieldDefinition>} updates - Property updates
     * @returns {this}
     */
    updateField(index: number, updates: Partial<FieldDefinition>): this;
    /**
     * Get all fields (a deep copy).
     * @returns {FieldDefinition[]}
     */
    getFields(): FieldDefinition[];
    /**
     * Get the blueprint object (field names as keys; unnamed fields are left out).
     * @returns {Blueprint}
     */
    getBlueprint(): Blueprint;
    /**
     * Export to a JavaScript object literal (`const blueprint = {...};`). Calls `onExport('js', output)`.
     * @param {ExportJSOptions} [options] - Not read at present
     * @returns {string}
     */
    exportJS(options?: ExportJSOptions): string;
    /**
     * Export to JSON. Calls `onExport('json', output)`.
     * @param {ExportJSONOptions} [options] - Not read at present
     * @returns {string}
     */
    exportJSON(options?: ExportJSONOptions): string;
    /**
     * Export to a TypeScript interface. Calls `onExport('typescript', output)`.
     * @param {ExportTypeScriptOptions} [options] - Export options
     * @returns {string}
     */
    exportTypeScript(options?: ExportTypeScriptOptions): string;
    /**
     * Import an existing blueprint, replacing the current fields.
     * @param {Blueprint} blueprint - Blueprint object to import
     * @param {string} [name] - Optional name for the schema
     * @returns {this}
     */
    importBlueprint(blueprint: Blueprint, name?: string): this;
    /**
     * Save the current schema as a template. Calls `onSave(name, schema)`.
     * @param {string} name - Template name
     * @returns {this}
     */
    saveTemplate(name: string): this;
    /**
     * Load a saved template. An unknown name does nothing.
     * @param {string} name - Template name
     * @returns {this}
     */
    loadTemplate(name: string): this;
    /**
     * Create a new schema (clear all fields).
     * @param {string} [name] - Optional schema name
     * @returns {this}
     */
    newSchema(name?: string): this;
    /**
     * Set the preview layout.
     * @param {PreviewLayout} layout - Layout mode
     * @returns {this}
     */
    setPreviewLayout(layout: PreviewLayout): this;
    _togglePreview(): this;
    _toBlueprint(): {};
    _mapToTSType(type: any): any;
    _showSaveModal(): void;
    _showLoadModal(): void;
    _showExportModal(): void;
    _createModal(title: any, content: any): HTMLDivElement;
    _startAutoSave(): void;
    _markDirty(): void;
    _capitalize(str: any): any;
    _escapeHtml(str: any): string;
}
import Component from './component.js';
