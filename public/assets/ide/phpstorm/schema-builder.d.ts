/**
 * Domma Schema Builder - TypeScript Declarations
 * Visual drag-and-drop blueprint designer
 */

// ============================================
// Types and Enums
// ============================================

export type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'email'
    | 'password'
    | 'url'
    | 'tel'
    | 'color'
    | 'range'
    | 'hidden'
    | 'date'
    | 'datetime'
    | 'time'
    | 'select'
    | 'multiselect'
    | 'radio'
    | 'checkbox-group'
    | 'textarea'
    | 'file'
    | 'array'
    | 'object';

export type ExportFormat = 'js' | 'json' | 'typescript';

export type PreviewLayout = 'stacked' | 'grid-2' | 'grid-3' | 'inline';

// ============================================
// Field Definitions
// ============================================

export interface FieldOption {
    value: string | number;
    label: string;
}

export interface FormConfig {
    /** Column span for grid layouts (1-12) */
    columns?: number;
    /** Number of rows for textarea */
    rows?: number;
    /** Custom CSS class */
    class?: string;
}

export interface FieldDefinition {
    /** Field data type (required) */
    type: FieldType;

    /** Is field required? */
    required?: boolean;

    /** Default value */
    default?: any;

    // Validation (strings)
    /** Minimum string length */
    minLength?: number;
    /** Maximum string length */
    maxLength?: number;
    /** Regex pattern for validation */
    pattern?: RegExp | string;

    // Validation (numbers)
    /** Minimum numeric value */
    min?: number;
    /** Maximum numeric value */
    max?: number;
    /** Step increment for number inputs */
    step?: number;

    // Selection fields
    /** Options for select, radio, checkbox-group */
    options?: FieldOption[] | string[];

    // Custom validation
    /** Custom validation function */
    validate?: (value: any) => boolean | string;

    // Form display
    /** Display label */
    label?: string;
    /** Input placeholder */
    placeholder?: string;
    /** Help text displayed below field */
    help?: string;
    /** Disable the field */
    disabled?: boolean;
    /** Form configuration */
    formConfig?: FormConfig;
}

export interface Blueprint {
    [fieldName: string]: FieldDefinition;
}

// ============================================
// Field Type Registry
// ============================================

export interface FieldTypeInfo {
    /** Display name */
    name: string;
    /** Icon name */
    icon: string;
    /** Category (basic, inputs, selection, advanced, etc.) */
    category: string;
    /** Field description */
    description: string;
    /** Default field definition */
    defaults: FieldDefinition;
}

// ============================================
// Template Management
// ============================================

export interface SchemaTemplate {
    name: string;
    fields: FieldDefinition[];
    createdAt: number;
    updatedAt: number;
}

export interface SchemaTemplateManager {
    /** List all saved templates */
    list(): string[];

    /** Load a template by name */
    load(name: string): FieldDefinition[] | null;

    /** Save a template */
    save(name: string, schema: { name: string; fields: FieldDefinition[] }): void;

    /** Delete a template */
    delete(name: string): void;

    /** Save active schema (auto-save) */
    saveActive(fields: FieldDefinition[]): void;

    /** Load active schema */
    loadActive(): FieldDefinition[] | null;
}

// ============================================
// Schema Builder Options
// ============================================

export interface SchemaBuilderOptions {
    /** Theme variant: 'light' or 'dark' */
    theme?: 'light' | 'dark';

    /** Enable auto-save to localStorage */
    autoSave?: boolean;

    /** Auto-save interval in milliseconds */
    autoSaveInterval?: number;

    /** Show live preview panel */
    showPreview?: boolean;

    /** Preview form layout */
    previewLayout?: PreviewLayout;

    /** Callback when schema changes */
    onChange?: (fields: FieldDefinition[]) => void;

    /** Callback when template is saved */
    onSave?: (name: string, schema: { name: string; fields: FieldDefinition[] }) => void;

    /** Callback when exporting */
    onExport?: (format: ExportFormat, data: string) => void;
}

// ============================================
// Export Options
// ============================================

export interface ExportJSOptions {
    /** Include field descriptions as comments */
    comments?: boolean;
    /** Omit properties with default values */
    includeDefaults?: boolean;
}

export interface ExportJSONOptions {
    /** Pretty-print JSON with indentation */
    pretty?: boolean;
    /** Omit properties with default values */
    includeDefaults?: boolean;
}

export interface ExportTypeScriptOptions {
    /** TypeScript interface name */
    interfaceName?: string;
    /** Include field labels as comments */
    comments?: boolean;
}

// ============================================
// Schema Builder Instance
// ============================================

export interface SchemaBuilderInstance {
    /** The DOM element this component is attached to */
    element: HTMLElement | null;

    /** Component options */
    options: SchemaBuilderOptions;

    // ============================================
    // Field Management
    // ============================================

    /**
     * Add a field to the schema
     * @param type - Field type
     * @param position - Position to insert (0-based index)
     * @returns The instance for chaining
     */
    addField(type: FieldType, position: number): this;

    /**
     * Remove a field from the schema
     * @param index - Field index to remove
     * @returns The instance for chaining
     */
    removeField(index: number): this;

    /**
     * Move a field to a new position
     * @param fromIndex - Current index
     * @param toIndex - New index
     * @returns The instance for chaining
     */
    moveField(fromIndex: number, toIndex: number): this;

    /**
     * Duplicate a field
     * @param index - Field index to duplicate
     * @returns The instance for chaining
     */
    duplicateField(index: number): this;

    /**
     * Update field properties
     * @param index - Field index to update
     * @param updates - Property updates
     * @returns The instance for chaining
     */
    updateField(index: number, updates: Partial<FieldDefinition>): this;

    /**
     * Get all fields
     * @returns Array of field definitions
     */
    getFields(): FieldDefinition[];

    /**
     * Get blueprint object
     * @returns Blueprint object with field names as keys
     */
    getBlueprint(): Blueprint;

    // ============================================
    // Export Methods
    // ============================================

    /**
     * Export to JavaScript object literal
     * @param options - Export options
     * @returns JavaScript code as string
     */
    exportJS(options?: ExportJSOptions): string;

    /**
     * Export to JSON format
     * @param options - Export options
     * @returns JSON string
     */
    exportJSON(options?: ExportJSONOptions): string;

    /**
     * Export to TypeScript interface
     * @param options - Export options
     * @returns TypeScript code as string
     */
    exportTypeScript(options?: ExportTypeScriptOptions): string;

    // ============================================
    // Blueprint Composition
    // ============================================

    /**
     * Import an existing blueprint
     * @param blueprint - Blueprint object to import
     * @param name - Optional name for the blueprint
     * @returns The instance for chaining
     */
    importBlueprint(blueprint: Blueprint, name?: string): this;

    // ============================================
    // Template Management
    // ============================================

    /**
     * Save current schema as template
     * @param name - Template name
     * @returns The instance for chaining
     */
    saveTemplate(name: string): this;

    /**
     * Load a saved template
     * @param name - Template name
     * @returns The instance for chaining
     */
    loadTemplate(name: string): this;

    /**
     * Create new schema (clear all fields)
     * @param name - Optional schema name
     * @returns The instance for chaining
     */
    newSchema(name?: string): this;

    // ============================================
    // Preview Control
    // ============================================

    /**
     * Set preview layout
     * @param layout - Layout mode
     * @returns The instance for chaining
     */
    setPreviewLayout(layout: PreviewLayout): this;

    // ============================================
    // Lifecycle
    // ============================================

    /**
     * Destroy the component and cleanup
     */
    destroy(): void;
}

// ============================================
// Factory Function
// ============================================

export interface SchemaBuilderFactory {
    /**
     * Create a Schema Builder instance
     * @param selector - CSS selector or HTMLElement
     * @param options - Configuration options
     * @returns Schema Builder instance
     */
    (selector: string | HTMLElement, options?: SchemaBuilderOptions): SchemaBuilderInstance;
}

// ============================================
// Module Augmentation (Domma.elements)
// ============================================

declare module 'domma' {
    interface DommaElements {
        /**
         * Create a Schema Builder instance
         * @param selector - CSS selector or HTMLElement
         * @param options - Configuration options
         * @returns Schema Builder instance
         */
        schemaBuilder: SchemaBuilderFactory;
    }
}

// ============================================
// Global Export
// ============================================

export class SchemaBuilder implements SchemaBuilderInstance {
    element: HTMLElement | null;
    options: SchemaBuilderOptions;

    constructor(selector: string | HTMLElement, options?: SchemaBuilderOptions);

    // Field Management
    addField(type: FieldType, position: number): this;
    removeField(index: number): this;
    moveField(fromIndex: number, toIndex: number): this;
    duplicateField(index: number): this;
    updateField(index: number, updates: Partial<FieldDefinition>): this;
    getFields(): FieldDefinition[];
    getBlueprint(): Blueprint;

    // Export Methods
    exportJS(options?: ExportJSOptions): string;
    exportJSON(options?: ExportJSONOptions): string;
    exportTypeScript(options?: ExportTypeScriptOptions): string;

    // Blueprint Composition
    importBlueprint(blueprint: Blueprint, name?: string): this;

    // Template Management
    saveTemplate(name: string): this;
    loadTemplate(name: string): this;
    newSchema(name?: string): this;

    // Preview Control
    setPreviewLayout(layout: PreviewLayout): this;

    // Lifecycle
    destroy(): void;

    // Static defaults
    static defaults: Required<SchemaBuilderOptions>;
}

export default SchemaBuilder;
