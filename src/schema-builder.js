/**
 * Schema Builder - Visual Blueprint Designer
 * Drag-and-drop interface for building Domma Blueprints
 */

import Component from './component.js';

// ============================================
// Field Type Registry
// ============================================

const FIELD_TYPE_REGISTRY = {
    string: {
        name: 'Text',
        icon: 'type',
        category: 'basic',
        description: 'Single-line text input',
        defaults: { type: 'string', required: false, minLength: null, maxLength: null, default: '', label: '', placeholder: '', help: '' }
    },
    number: {
        name: 'Number',
        icon: 'hash',
        category: 'basic',
        description: 'Numeric input',
        defaults: { type: 'number', required: false, min: null, max: null, default: 0, label: '', placeholder: '', help: '' }
    },
    boolean: {
        name: 'Checkbox',
        icon: 'check-square',
        category: 'basic',
        description: 'True/false checkbox',
        defaults: { type: 'boolean', required: false, default: false, label: '', help: '' }
    },
    email: {
        name: 'Email',
        icon: 'mail',
        category: 'inputs',
        description: 'Email input with validation',
        defaults: { type: 'email', required: false, default: '', label: '', placeholder: '', help: '' }
    },
    password: {
        name: 'Password',
        icon: 'lock',
        category: 'inputs',
        description: 'Password input',
        defaults: { type: 'password', required: false, minLength: null, default: '', label: '', placeholder: '', help: '' }
    },
    textarea: {
        name: 'Textarea',
        icon: 'file-text',
        category: 'basic',
        description: 'Multi-line text',
        defaults: { type: 'textarea', required: false, default: '', label: '', placeholder: '', help: '', formConfig: { rows: 3 } }
    },
    select: {
        name: 'Select',
        icon: 'chevron-down',
        category: 'selection',
        description: 'Dropdown select',
        defaults: { type: 'select', required: false, options: [], default: '', label: '', help: '' }
    },
    multiselect: {
        name: 'Multi-select',
        icon: 'list',
        category: 'selection',
        description: 'Multiple selection dropdown',
        defaults: { type: 'multiselect', required: false, options: [], default: [], label: '', help: '' }
    },
    radio: {
        name: 'Radio Group',
        icon: 'circle',
        category: 'selection',
        description: 'Radio button group',
        defaults: { type: 'radio', required: false, options: [], default: '', label: '', help: '' }
    },
    'checkbox-group': {
        name: 'Checkbox Group',
        icon: 'check-square',
        category: 'selection',
        description: 'Multiple checkboxes',
        defaults: { type: 'checkbox-group', required: false, options: [], default: [], label: '', help: '' }
    },
    url: {
        name: 'URL',
        icon: 'link',
        category: 'inputs',
        description: 'URL input with validation',
        defaults: { type: 'url', required: false, default: '', label: '', placeholder: 'https://example.com', help: '' }
    },
    tel: {
        name: 'Phone',
        icon: 'phone',
        category: 'inputs',
        description: 'Telephone number input',
        defaults: { type: 'tel', required: false, default: '', label: '', placeholder: '', help: '' }
    },
    color: {
        name: 'Color',
        icon: 'droplet',
        category: 'inputs',
        description: 'Color picker',
        defaults: { type: 'color', required: false, default: '#000000', label: '', help: '' }
    },
    range: {
        name: 'Range',
        icon: 'sliders',
        category: 'inputs',
        description: 'Slider input',
        defaults: { type: 'range', required: false, min: 0, max: 100, step: 1, default: 50, label: '', help: '' }
    },
    hidden: {
        name: 'Hidden',
        icon: 'eye-off',
        category: 'inputs',
        description: 'Hidden field',
        defaults: { type: 'hidden', required: false, default: '', label: '', help: '' }
    },
    file: {
        name: 'File',
        icon: 'paperclip',
        category: 'advanced',
        description: 'File upload',
        defaults: { type: 'file', required: false, accept: '', multiple: false, label: '', help: '' }
    },
    date: {
        name: 'Date',
        icon: 'calendar',
        category: 'datetime',
        description: 'Date picker',
        defaults: {
            type: 'string',
            required: false,
            default: '',
            label: '',
            help: '',
            validate: (val) => {
                // Accept empty values for optional fields
                if (!val || val === '') return true;
                // Accept Date objects
                if (val instanceof Date && !isNaN(val.getTime())) return true;
                // Accept valid date strings (YYYY-MM-DD format from date input)
                if (typeof val === 'string') {
                    const parsed = new Date(val);
                    if (!isNaN(parsed.getTime())) return true;
                }
                return 'Invalid date format';
            }
        }
    },
    datetime: {
        name: 'Date & Time',
        icon: 'calendar',
        category: 'datetime',
        description: 'Date and time picker',
        defaults: { type: 'datetime-local', required: false, default: '', label: '', help: '' }
    },
    time: {
        name: 'Time',
        icon: 'clock',
        category: 'datetime',
        description: 'Time picker',
        defaults: { type: 'time', required: false, default: '', label: '', help: '' }
    },
    array: {
        name: 'Array',
        icon: 'layers',
        category: 'advanced',
        description: 'Array field type',
        defaults: { type: 'array', required: false, default: [], label: '', help: '' }
    },
    object: {
        name: 'Object',
        icon: 'box',
        category: 'advanced',
        description: 'Object field type',
        defaults: { type: 'object', required: false, default: {}, label: '', help: '' }
    }
};

// ============================================
// Template Manager
// ============================================

class SchemaTemplateManager {
    static STORAGE_KEY = 'domma:schema-builder-templates';
    static ACTIVE_KEY = 'domma:schema-builder-active';

    static list() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? Object.keys(JSON.parse(stored)) : [];
        } catch (e) {
            return [];
        }
    }

    static load(name) {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return null;
            const templates = JSON.parse(stored);
            return templates[name] || null;
        } catch (e) {
            return null;
        }
    }

    static save(name, schema) {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            const templates = stored ? JSON.parse(stored) : {};
            templates[name] = { ...schema, updatedAt: Date.now() };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
            return true;
        } catch (e) {
            return false;
        }
    }

    static delete(name) {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return false;
            const templates = JSON.parse(stored);
            delete templates[name];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
            return true;
        } catch (e) {
            return false;
        }
    }

    static saveActive(fields) {
        try {
            localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(fields));
            return true;
        } catch (e) {
            return false;
        }
    }

    static loadActive() {
        try {
            const stored = localStorage.getItem(this.ACTIVE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }
}

// Export for showcase
if (typeof window !== 'undefined') {
    window.SchemaTemplateManager = SchemaTemplateManager;
}

// ============================================
// Schema Builder Class
// ============================================

class SchemaBuilder extends Component {
    static defaults = {
        theme: 'light',
        autoSave: true,
        autoSaveInterval: 30000,
        showPreview: true,
        previewLayout: 'stacked',
        onChange: null,
        onSave: null,
        onExport: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this.options = { ...SchemaBuilder.defaults, ...options };

        this._fields = [];
        this._selectedIndex = -1;
        this._schemaName = '';
        this._isDirty = false;
        this._dragSource = null;
        this._autoSaveTimer = null;
        this._previewForm = null;
        this._refs = {};

        if (this.element) {
            this._init();
        }
    }

    _init() {
        this._render();
        this._attachEvents();

        // Set initial preview layout dropdown value
        const dropdown = this.element.querySelector('.sb-preview-layout');
        if (dropdown) {
            dropdown.value = this.options.previewLayout;
        }

        if (this.options.autoSave) {
            this._startAutoSave();
        }

        const active = SchemaTemplateManager.loadActive();
        if (active && active.length > 0) {
            this._fields = active;
            this._renderCanvas();
            this._renderPreview();
        }
    }

    _render() {
        this.element.innerHTML = `
            <div class="sb-container">
                <div class="sb-header">
                    <div class="sb-header-left">
                        <button class="btn btn-primary btn-sm" data-action="new"><span data-icon="plus-circle"></span> New</button>
                        <button class="btn btn-sm" data-action="save"><span data-icon="save"></span> Save</button>
                        <button class="btn btn-sm" data-action="load"><span data-icon="folder-open"></span> Load</button>
                        <input type="text" class="sb-schema-name" placeholder="Schema Name" value="">
                    </div>
                    <div class="sb-header-center">
                        <h2 class="sb-title">Schema Builder</h2>
                    </div>
                    <div class="sb-header-right">
                        <button class="btn btn-sm" data-action="toggle-preview"><span data-icon="eye"></span> Preview</button>
                        <button class="btn btn-sm" data-action="import"><span data-icon="upload"></span> Import</button>
                        <button class="btn btn-primary btn-sm" data-action="export"><span data-icon="download"></span> Export</button>
                    </div>
                </div>
                <div class="sb-body">
                    <div class="sb-sidebar sb-library">
                        <div class="sb-library-header">
                            <h3 style="text-align: center;">Field Library</h3>
                            <input type="text" class="sb-search form-input" placeholder="Search fields..." />
                        </div>
                        <div class="sb-library-content"></div>
                    </div>
                    <div class="sb-main">
                        <div class="sb-canvas"></div>
                    </div>
                    <div class="sb-sidebar sb-editor">
                        <h3 style="text-align: center;">Properties</h3>
                        <div class="sb-editor-content">
                            <p class="text-muted">Select a field to edit properties</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Floating Preview Panel -->
            <div class="sb-preview-panel" style="display: none;">
                <div class="sb-preview-header">
                    <h3>Live Preview</h3>
                    <div class="sb-preview-controls">
                        <label style="font-size: 0.875rem; margin-right: 0.5rem;">Layout:</label>
                        <select class="sb-preview-layout form-select" style="display: inline-block; width: auto;">
                            <option value="stacked">Stacked</option>
                            <option value="inline">Inline</option>
                            <option value="grid-2">Grid (2 cols)</option>
                            <option value="grid-3">Grid (3 cols)</option>
                            <option value="grid-4">Grid (4 cols)</option>
                            <option value="grid-6">Grid (6 cols)</option>
                            <option value="grid-12">Grid (12 cols)</option>
                        </select>
                        <button class="btn btn-sm" data-action="close-preview"><span data-icon="x"></span></button>
                    </div>
                </div>
                <div class="sb-preview-body">
                    <div class="sb-preview-split">
                        <div class="sb-preview-form-container">
                            <h4>Form</h4>
                            <div class="sb-preview-form"></div>
                        </div>
                        <div class="sb-preview-state-container">
                            <h4>Model State</h4>
                            <pre class="sb-state-display">{}</pre>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._refs = {
            library: this.element.querySelector('.sb-library-content'),
            canvas: this.element.querySelector('.sb-canvas'),
            editor: this.element.querySelector('.sb-editor-content'),
            previewPanel: this.element.querySelector('.sb-preview-panel'),
            previewForm: this.element.querySelector('.sb-preview-form'),
            previewState: this.element.querySelector('.sb-state-display'),
            schemaName: this.element.querySelector('.sb-schema-name')
        };

        this._renderLibrary();

        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(this.element);
        }
    }

    _renderLibrary() {
        const categories = { basic: [], inputs: [], selection: [], datetime: [] };

        for (const [type, info] of Object.entries(FIELD_TYPE_REGISTRY)) {
            if (categories[info.category]) {
                categories[info.category].push({ type, ...info });
            }
        }

        let html = '';
        for (const [category, fields] of Object.entries(categories)) {
            if (fields.length === 0) continue;
            html += `<div class="sb-library-category"><h4 class="sb-category-title">${this._capitalize(category)}</h4><div class="sb-category-items">`;
            for (const field of fields) {
                html += `<div class="sb-library-item" draggable="true" data-type="${field.type}" title="${this._escapeHtml(field.description)}"><span data-icon="${field.icon}"></span><span class="sb-item-name">${this._escapeHtml(field.name)}</span></div>`;
            }
            html += '</div></div>';
        }

        this._refs.library.innerHTML = html;

        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(this._refs.library);
        }
    }

    _renderCanvas() {
        let html = '<div class="sb-drop-zone" data-position="0"></div>';

        this._fields.forEach((field, index) => {
            const isSelected = index === this._selectedIndex;
            const typeInfo = FIELD_TYPE_REGISTRY[field.type] || { name: field.type, icon: 'help-circle' };

            html += `
                <div class="sb-field-card ${isSelected ? 'sb-selected' : ''}" draggable="true" data-index="${index}">
                    <div class="sb-field-header">
                        <span data-icon="${typeInfo.icon}"></span>
                        <span class="sb-field-name">${this._escapeHtml(field.name || 'field' + index)}</span>
                        <span class="sb-field-type">[${typeInfo.name}]</span>
                    </div>
                    <div class="sb-field-meta">
                        ${field.required ? '<span class="sb-badge sb-badge-required">Required</span>' : ''}
                        ${field.label ? '<span class="sb-field-label">' + this._escapeHtml(field.label) + '</span>' : ''}
                    </div>
                    <div class="sb-field-actions">
                        <button class="btn btn-sm" data-action="duplicate" data-index="${index}"><span data-icon="copy"></span></button>
                        <button class="btn btn-danger btn-sm" data-action="remove" data-index="${index}"><span data-icon="trash"></span></button>
                    </div>
                </div>
                <div class="sb-drop-zone" data-position="${index + 1}"></div>
            `;
        });

        if (this._fields.length === 0) {
            html = `
                <div class="sb-empty-state">
                    <span data-icon="inbox" data-icon-size="48"></span>
                    <h3>No fields yet</h3>
                    <p>Drag fields from the library or click to add</p>
                </div>
                <div class="sb-drop-zone" data-position="0"></div>
            `;
        }

        this._refs.canvas.innerHTML = html;

        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(this._refs.canvas);
        }
    }

    _renderEditor(fieldIndex) {
        if (fieldIndex < 0 || fieldIndex >= this._fields.length) {
            this._refs.editor.innerHTML = '<p class="text-muted">Select a field to edit properties</p>';
            return;
        }

        const field = this._fields[fieldIndex];

        let html = `
            <div class="sb-editor-section">
                <h4>Core Properties</h4>
                <div class="sb-editor-field">
                    <label>Field Name</label>
                    <input type="text" class="form-input" data-prop="name" value="${this._escapeHtml(field.name || '')}" placeholder="fieldName" />
                </div>
                <div class="sb-editor-field">
                    <label>Type</label>
                    <select class="form-select" data-prop="type">
                        ${Object.entries(FIELD_TYPE_REGISTRY).map(([type, info]) =>
                            `<option value="${type}" ${field.type === type ? 'selected' : ''}>${this._escapeHtml(info.name)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="sb-editor-field">
                    <label><input type="checkbox" data-prop="required" ${field.required ? 'checked' : ''} /> Required</label>
                </div>
            </div>
            <div class="sb-editor-section">
                <h4>Form Display</h4>
                <div class="sb-editor-field">
                    <label>Label</label>
                    <input type="text" class="form-input" data-prop="label" value="${this._escapeHtml(field.label || '')}" />
                </div>
                <div class="sb-editor-field">
                    <label>Placeholder</label>
                    <input type="text" class="form-input" data-prop="placeholder" value="${this._escapeHtml(field.placeholder || '')}" />
                </div>
                <div class="sb-editor-field">
                    <label>Help Text</label>
                    <input type="text" class="form-input" data-prop="help" value="${this._escapeHtml(field.help || '')}" />
                </div>
                <div class="sb-editor-field">
                    <label>Column Span (Grid Layout)</label>
                    <select class="form-select" data-prop="formConfig.columns">
                        ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n =>
                            `<option value="${n}" ${(field.formConfig?.columns || 12) === n ? 'selected' : ''}>${n} ${n === 12 ? '(Full Width)' : 'col' + (n > 1 ? 's' : '')}</option>`
                        ).join('')}
                    </select>
                    <small class="text-muted">Width in grid layouts (1-12 columns)</small>
                </div>
            </div>
        `;

        // Add field-type-specific properties
        html += this._renderFieldSpecificProperties(field);

        this._refs.editor.innerHTML = html;

        // Attach options editor events if applicable
        if (['select', 'multiselect', 'radio', 'checkbox-group'].includes(field.type)) {
            this._attachOptionsEditor();
        }
    }

    _renderFieldSpecificProperties(field) {
        let html = '';

        // String/Textarea validation
        if (['string', 'textarea', 'email', 'url', 'tel', 'password'].includes(field.type)) {
            html += `
                <div class="sb-editor-section">
                    <h4>Validation</h4>
                    <div class="sb-editor-field">
                        <label>Min Length</label>
                        <input type="number" class="form-input" data-prop="minLength" value="${field.minLength || ''}" min="0" />
                    </div>
                    <div class="sb-editor-field">
                        <label>Max Length</label>
                        <input type="number" class="form-input" data-prop="maxLength" value="${field.maxLength || ''}" min="0" />
                    </div>
                    <div class="sb-editor-field">
                        <label>Pattern (Regex)</label>
                        <input type="text" class="form-input" data-prop="pattern" value="${this._escapeHtml(field.pattern || '')}" placeholder="^[A-Za-z]+$" />
                    </div>
                </div>
            `;
        }

        // Number validation
        if (field.type === 'number' || field.type === 'range') {
            html += `
                <div class="sb-editor-section">
                    <h4>Validation</h4>
                    <div class="sb-editor-field">
                        <label>Min Value</label>
                        <input type="number" class="form-input" data-prop="min" value="${field.min !== undefined ? field.min : ''}" />
                    </div>
                    <div class="sb-editor-field">
                        <label>Max Value</label>
                        <input type="number" class="form-input" data-prop="max" value="${field.max !== undefined ? field.max : ''}" />
                    </div>
                    <div class="sb-editor-field">
                        <label>Step</label>
                        <input type="number" class="form-input" data-prop="step" value="${field.step || ''}" min="0" step="0.01" />
                    </div>
                </div>
            `;
        }

        // Date/Time validation
        if (['date', 'datetime', 'time'].includes(field.type)) {
            html += `
                <div class="sb-editor-section">
                    <h4>Validation</h4>
                    <div class="sb-editor-field">
                        <label>Min ${field.type === 'time' ? 'Time' : 'Date'}</label>
                        <input type="${field.type}" class="form-input" data-prop="min" value="${field.min || ''}" />
                    </div>
                    <div class="sb-editor-field">
                        <label>Max ${field.type === 'time' ? 'Time' : 'Date'}</label>
                        <input type="${field.type}" class="form-input" data-prop="max" value="${field.max || ''}" />
                    </div>
                </div>
            `;
        }

        // File accept
        if (field.type === 'file') {
            html += `
                <div class="sb-editor-section">
                    <h4>File Options</h4>
                    <div class="sb-editor-field">
                        <label>Accept (file types)</label>
                        <input type="text" class="form-input" data-prop="accept" value="${this._escapeHtml(field.accept || '')}" placeholder=".jpg,.png,.pdf" />
                    </div>
                    <div class="sb-editor-field">
                        <label><input type="checkbox" data-prop="multiple" ${field.multiple ? 'checked' : ''} /> Allow Multiple Files</label>
                    </div>
                </div>
            `;
        }

        // Select/Radio/Checkbox-group/Multiselect options
        if (['select', 'multiselect', 'radio', 'checkbox-group'].includes(field.type)) {
            const options = field.options || [];
            html += `
                <div class="sb-editor-section">
                    <h4>Options</h4>
                    <div class="sb-options-editor">
                        <div class="sb-options-list" data-options-list>
                            ${options.map((opt, i) => `
                                <div class="sb-option-item" data-option-index="${i}">
                                    <div class="sb-option-inputs">
                                        <input type="text" class="form-input sb-option-value" placeholder="value" value="${this._escapeHtml(opt.value || '')}" data-option-part="value" />
                                        <input type="text" class="form-input sb-option-label" placeholder="Label" value="${this._escapeHtml(opt.label || '')}" data-option-part="label" />
                                    </div>
                                    <div class="sb-option-actions">
                                        <button class="btn btn-sm" data-action="move-up" ${i === 0 ? 'disabled' : ''}><span data-icon="chevron-up"></span></button>
                                        <button class="btn btn-sm" data-action="move-down" ${i === options.length - 1 ? 'disabled' : ''}><span data-icon="chevron-down"></span></button>
                                        <button class="btn btn-danger btn-sm" data-action="remove-option"><span data-icon="trash"></span></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-primary btn-sm" data-action="add-option"><span data-icon="plus"></span> Add Option</button>
                    </div>
                </div>
            `;
        }

        return html;
    }

    _attachOptionsEditor() {
        const list = this._refs.editor.querySelector('[data-options-list]');
        if (!list) return;

        // Add option
        this._on(this._refs.editor, 'click', '[data-action="add-option"]', () => {
            const field = this._fields[this._selectedIndex];
            if (!field.options) field.options = [];
            field.options.push({ value: '', label: '' });
            this.updateField(this._selectedIndex, { options: field.options });
            this._renderEditor(this._selectedIndex);
        });

        // Remove option
        this._on(this._refs.editor, 'click', '[data-action="remove-option"]', (e) => {
            const item = e.target.closest('.sb-option-item');
            const index = parseInt(item.dataset.optionIndex);
            const field = this._fields[this._selectedIndex];
            field.options.splice(index, 1);
            this.updateField(this._selectedIndex, { options: field.options });
            this._renderEditor(this._selectedIndex);
        });

        // Move option up
        this._on(this._refs.editor, 'click', '[data-action="move-up"]', (e) => {
            const item = e.target.closest('.sb-option-item');
            const index = parseInt(item.dataset.optionIndex);
            if (index === 0) return;
            const field = this._fields[this._selectedIndex];
            const temp = field.options[index];
            field.options[index] = field.options[index - 1];
            field.options[index - 1] = temp;
            this.updateField(this._selectedIndex, { options: field.options });
            this._renderEditor(this._selectedIndex);
        });

        // Move option down
        this._on(this._refs.editor, 'click', '[data-action="move-down"]', (e) => {
            const item = e.target.closest('.sb-option-item');
            const index = parseInt(item.dataset.optionIndex);
            const field = this._fields[this._selectedIndex];
            if (index === field.options.length - 1) return;
            const temp = field.options[index];
            field.options[index] = field.options[index + 1];
            field.options[index + 1] = temp;
            this.updateField(this._selectedIndex, { options: field.options });
            this._renderEditor(this._selectedIndex);
        });

        // Update option value/label
        this._on(this._refs.editor, 'input', '[data-option-part]', (e) => {
            const item = e.target.closest('.sb-option-item');
            const index = parseInt(item.dataset.optionIndex);
            const part = e.target.dataset.optionPart;
            const field = this._fields[this._selectedIndex];
            field.options[index][part] = e.target.value;
            this.updateField(this._selectedIndex, { options: field.options });
        });
    }

    _renderPreview() {
        if (!this.options.showPreview || !this._refs.previewForm) return;

        if (this._previewForm && this._previewForm.destroy) {
            this._previewForm.destroy();
        }

        const blueprint = this._toBlueprint();

        if (Object.keys(blueprint).length === 0) {
            this._refs.previewForm.innerHTML = '<p class="text-muted">No fields to preview</p>';
            this._refs.previewState.textContent = '{}';
            return;
        }

        if (typeof Domma !== 'undefined' && Domma.forms) {
            try {
                // Render form directly into the preview container
                this._refs.previewForm.innerHTML = '';

                // Parse layout option
                let layout = this.options.previewLayout;
                let columns = 2;

                if (layout === 'grid-2') {
                    layout = 'grid';
                    columns = 2;
                } else if (layout === 'grid-3') {
                    layout = 'grid';
                    columns = 3;
                } else if (layout === 'grid-4') {
                    layout = 'grid';
                    columns = 4;
                } else if (layout === 'grid-6') {
                    layout = 'grid';
                    columns = 6;
                } else if (layout === 'grid-12') {
                    layout = 'grid';
                    columns = 12;
                }

                this._previewForm = Domma.forms.create(blueprint, {}, {
                    layout: layout,
                    columns: columns,
                    submitText: 'Test Submit',
                    showReset: false
                });

                // Render form to the preview element
                this._previewForm.renderTo(this._refs.previewForm);

                const updateState = () => {
                    if (this._previewForm && this._previewForm.model) {
                        this._refs.previewState.textContent = JSON.stringify(this._previewForm.model.toJSON(), null, 2);
                    }
                };

                const inputs = this._refs.previewForm.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.addEventListener('input', updateState);
                    input.addEventListener('change', updateState);
                });

                updateState();
            } catch (error) {
                console.error('Preview error:', error);
                this._refs.previewForm.innerHTML = '<p class="text-danger">Preview error: ' + error.message + '</p>';
            }
        }
    }

    _attachEvents() {
        this._on(this.element, 'click', '[data-action="new"]', () => this.newSchema());
        this._on(this.element, 'click', '[data-action="save"]', () => this._showSaveModal());
        this._on(this.element, 'click', '[data-action="load"]', () => this._showLoadModal());
        this._on(this.element, 'click', '[data-action="export"]', () => this._showExportModal());
        this._on(this.element, 'click', '[data-action="toggle-preview"]', () => this._togglePreview());
        this._on(this.element, 'click', '[data-action="close-preview"]', () => this._togglePreview());

        this._on(this.element, 'click', '.sb-library-item', (e) => {
            const type = e.target.closest('.sb-library-item').dataset.type;
            this.addField(type, this._fields.length);
        });

        this._on(this.element, 'dragstart', '.sb-library-item', (e) => {
            e.dataTransfer.setData('field-type', e.target.closest('.sb-library-item').dataset.type);
            this._dragSource = 'library';
        });

        this._on(this.element, 'dragover', '.sb-drop-zone', (e) => {
            e.preventDefault();
            e.target.closest('.sb-drop-zone').classList.add('sb-drop-active');
        });

        this._on(this.element, 'dragleave', '.sb-drop-zone', (e) => {
            e.target.closest('.sb-drop-zone').classList.remove('sb-drop-active');
        });

        this._on(this.element, 'drop', '.sb-drop-zone', (e) => {
            e.preventDefault();
            const zone = e.target.closest('.sb-drop-zone');
            zone.classList.remove('sb-drop-active');
            const position = parseInt(zone.dataset.position);

            if (this._dragSource === 'library') {
                const type = e.dataTransfer.getData('field-type');
                this.addField(type, position);
            }
        });

        this._on(this.element, 'click', '.sb-field-card', (e) => {
            if (e.target.closest('.sb-field-actions')) return;
            const index = parseInt(e.target.closest('.sb-field-card').dataset.index);
            this._selectField(index);
        });

        this._on(this.element, 'click', '[data-action="remove"]', (e) => {
            e.stopPropagation();
            this.removeField(parseInt(e.target.closest('[data-action="remove"]').dataset.index));
        });

        this._on(this.element, 'click', '[data-action="duplicate"]', (e) => {
            e.stopPropagation();
            this.duplicateField(parseInt(e.target.closest('[data-action="duplicate"]').dataset.index));
        });

        this._on(this.element, 'input', '.sb-editor [data-prop]', (e) => this._handlePropertyChange(e));
        this._on(this.element, 'change', '.sb-editor [data-prop]', (e) => this._handlePropertyChange(e));

        // Preview layout selector
        this._on(this.element, 'change', '.sb-preview-layout', (e) => {
            this.setPreviewLayout(e.target.value);
        });

        // Keyboard shortcut: Escape to close preview
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._refs.previewPanel && this._refs.previewPanel.style.display === 'flex') {
                this._togglePreview();
            }
        });
    }

    /**
     * Utility for event delegation with cleanup tracking
     * @private
     */
    _on(element, event, selector, handler) {
        const wrapper = (e) => {
            if (selector) {
                const target = e.target.closest(selector);
                if (target && element.contains(target)) {
                    handler.call(target, e);
                }
            } else {
                handler.call(element, e);
            }
        };

        element.addEventListener(event, wrapper);
        this._eventHandlers.push({ element, event, handler: wrapper });
    }

    _handlePropertyChange(e) {
        if (this._selectedIndex < 0) return;

        const prop = e.target.dataset.prop;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        // Handle nested properties (e.g., formConfig.columns)
        if (prop.includes('.')) {
            const parts = prop.split('.');
            const field = this._fields[this._selectedIndex];

            // Ensure nested object exists
            if (!field[parts[0]]) {
                field[parts[0]] = {};
            }

            // Set nested property (convert to number if applicable)
            field[parts[0]][parts[1]] = isNaN(value) ? value : parseInt(value);

            this.updateField(this._selectedIndex, { [parts[0]]: field[parts[0]] });
        } else {
            this.updateField(this._selectedIndex, { [prop]: value });
        }
    }

    _selectField(index) {
        this._selectedIndex = index;
        this._renderCanvas();
        this._renderEditor(index);
    }

    // Public API
    addField(type, position) {
        const typeInfo = FIELD_TYPE_REGISTRY[type];
        if (!typeInfo) return this;

        const fieldDef = {
            name: `field${this._fields.length}`,
            ...JSON.parse(JSON.stringify(typeInfo.defaults)),
            formConfig: { columns: 12 } // Default to full width in grid layouts
        };

        this._fields.splice(position, 0, fieldDef);
        this._markDirty();
        this._renderCanvas();
        this._renderPreview();
        this._selectField(position);

        return this;
    }

    removeField(index) {
        if (index < 0 || index >= this._fields.length) return this;

        this._fields.splice(index, 1);
        this._markDirty();

        if (this._selectedIndex === index) this._selectedIndex = -1;
        else if (this._selectedIndex > index) this._selectedIndex--;

        this._renderCanvas();
        this._renderEditor(this._selectedIndex);
        this._renderPreview();

        return this;
    }

    duplicateField(index) {
        if (index < 0 || index >= this._fields.length) return this;

        const clone = JSON.parse(JSON.stringify(this._fields[index]));
        clone.name = clone.name + '_copy';

        this._fields.splice(index + 1, 0, clone);
        this._markDirty();
        this._renderCanvas();
        this._renderPreview();
        this._selectField(index + 1);

        return this;
    }

    updateField(index, updates) {
        if (index < 0 || index >= this._fields.length) return this;

        Object.assign(this._fields[index], updates);
        this._markDirty();
        this._renderCanvas();
        // Don't re-render editor during property changes to preserve focus
        // Editor is rendered only when selecting a different field via _selectField()
        this._renderPreview();

        return this;
    }

    getFields() {
        return JSON.parse(JSON.stringify(this._fields));
    }

    getBlueprint() {
        return this._toBlueprint();
    }

    exportJS(options = {}) {
        const blueprint = this._toBlueprint();
        let output = 'const blueprint = ';
        output += JSON.stringify(blueprint, null, 4);
        output += ';\n';

        if (this.options.onExport) {
            this.options.onExport('js', output);
        }

        return output;
    }

    exportJSON(options = {}) {
        const blueprint = this._toBlueprint();
        const output = JSON.stringify(blueprint, null, 2);

        if (this.options.onExport) {
            this.options.onExport('json', output);
        }

        return output;
    }

    exportTypeScript(options = {}) {
        const { interfaceName = 'FormData' } = options;
        const blueprint = this._toBlueprint();

        let output = `interface ${interfaceName} {\n`;
        for (const [fieldName, fieldDef] of Object.entries(blueprint)) {
            const tsType = this._mapToTSType(fieldDef.type);
            const optional = fieldDef.required ? '' : '?';
            output += `    ${fieldName}${optional}: ${tsType};\n`;
        }
        output += '}\n';

        if (this.options.onExport) {
            this.options.onExport('typescript', output);
        }

        return output;
    }

    importBlueprint(blueprint, name) {
        const fields = [];
        for (const [fieldName, fieldDef] of Object.entries(blueprint)) {
            fields.push({ name: fieldName, ...fieldDef });
        }

        this._fields = fields;
        this._schemaName = name || '';
        this._selectedIndex = -1;

        if (this._refs.schemaName) {
            this._refs.schemaName.value = this._schemaName;
        }

        this._renderCanvas();
        this._renderEditor(-1);
        this._renderPreview();

        return this;
    }

    saveTemplate(name) {
        const schema = { name: this._schemaName, fields: this.getFields() };
        SchemaTemplateManager.save(name, schema);
        this._isDirty = false;

        if (this.options.onSave) {
            this.options.onSave(name, schema);
        }

        return this;
    }

    loadTemplate(name) {
        const schema = SchemaTemplateManager.load(name);
        if (!schema) return this;

        this._fields = schema.fields || [];
        this._schemaName = schema.name || name;
        this._selectedIndex = -1;

        if (this._refs.schemaName) {
            this._refs.schemaName.value = this._schemaName;
        }

        this._renderCanvas();
        this._renderEditor(-1);
        this._renderPreview();

        return this;
    }

    newSchema(name = '') {
        this._fields = [];
        this._schemaName = name;
        this._selectedIndex = -1;

        if (this._refs.schemaName) {
            this._refs.schemaName.value = this._schemaName;
        }

        this._renderCanvas();
        this._renderEditor(-1);
        this._renderPreview();

        return this;
    }

    setPreviewLayout(layout) {
        this.options.previewLayout = layout;

        // Update dropdown if it exists
        const dropdown = this.element.querySelector('.sb-preview-layout');
        if (dropdown) {
            dropdown.value = layout;
        }

        this._renderPreview();
        return this;
    }

    _togglePreview() {
        if (!this._refs.previewPanel) return;

        const isVisible = this._refs.previewPanel.style.display !== 'none';

        if (isVisible) {
            // Slide out then hide
            this._refs.previewPanel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                this._refs.previewPanel.style.display = 'none';
            }, 300);
        } else {
            // Show then slide in
            this._refs.previewPanel.style.display = 'flex';
            setTimeout(() => {
                this._refs.previewPanel.style.transform = 'translateX(0)';
            }, 10);
            this._renderPreview();
        }

        return this;
    }

    // Internal helpers
    _toBlueprint() {
        const blueprint = {};
        for (const field of this._fields) {
            if (!field.name) continue;
            const { name, ...fieldDef } = field;
            blueprint[name] = fieldDef;
        }
        return blueprint;
    }

    _mapToTSType(type) {
        const map = {
            'string': 'string', 'email': 'string', 'password': 'string',
            'number': 'number', 'boolean': 'boolean', 'date': 'Date | string',
            'select': 'string', 'textarea': 'string'
        };
        return map[type] || 'any';
    }

    _showSaveModal() {
        const modal = this._createModal('Save Template', `
            <div class="sb-modal-body">
                <div class="form-group">
                    <label class="form-label">Template Name</label>
                    <input type="text" class="form-input sb-modal-input" placeholder="My Template" value="${this._escapeHtml(this._schemaName)}" />
                </div>
            </div>
            <div class="sb-modal-footer">
                <button class="btn" data-modal-action="cancel">Cancel</button>
                <button class="btn btn-primary" data-modal-action="save">Save</button>
            </div>
        `);

        this._on(modal, 'click', '[data-modal-action="save"]', () => {
            const name = modal.querySelector('.sb-modal-input').value.trim();
            if (name) {
                this.saveTemplate(name);
                modal.remove();
            }
        });

        this._on(modal, 'click', '[data-modal-action="cancel"]', () => modal.remove());
    }

    _showLoadModal() {
        const templates = SchemaTemplateManager.list();
        if (templates.length === 0) {
            alert('No saved templates');
            return;
        }

        const modal = this._createModal('Load Template', `
            <div class="sb-modal-body">
                <div class="form-group">
                    <label class="form-label">Select Template</label>
                    <select class="form-select sb-modal-select">
                        ${templates.map(name => `<option value="${this._escapeHtml(name)}">${this._escapeHtml(name)}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="sb-modal-footer">
                <button class="btn" data-modal-action="cancel">Cancel</button>
                <button class="btn btn-primary" data-modal-action="load">Load</button>
            </div>
        `);

        this._on(modal, 'click', '[data-modal-action="load"]', () => {
            this.loadTemplate(modal.querySelector('.sb-modal-select').value);
            modal.remove();
        });

        this._on(modal, 'click', '[data-modal-action="cancel"]', () => modal.remove());
    }

    _showExportModal() {
        const modal = this._createModal('Export Blueprint', `
            <div class="sb-modal-body sb-export-modal">
                <div class="sb-export-tabs">
                    <button class="sb-tab-btn active" data-format="js">JavaScript</button>
                    <button class="sb-tab-btn" data-format="json">JSON</button>
                    <button class="sb-tab-btn" data-format="typescript">TypeScript</button>
                </div>
                <div class="sb-export-content">
                    <textarea class="form-input sb-export-output" readonly rows="15"></textarea>
                </div>
            </div>
            <div class="sb-modal-footer">
                <button class="btn" data-modal-action="close">Close</button>
                <button class="btn btn-primary" data-modal-action="copy">Copy</button>
            </div>
        `);

        const output = modal.querySelector('.sb-export-output');
        output.value = this.exportJS();

        this._on(modal, 'click', '.sb-tab-btn', (e) => {
            const format = e.target.dataset.format;
            modal.querySelectorAll('.sb-tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.format === format));

            if (format === 'js') output.value = this.exportJS();
            else if (format === 'json') output.value = this.exportJSON();
            else if (format === 'typescript') output.value = this.exportTypeScript();
        });

        this._on(modal, 'click', '[data-modal-action="copy"]', async () => {
            try {
                await navigator.clipboard.writeText(output.value);
                alert('Copied to clipboard!');
            } catch (e) {
                alert('Failed to copy');
            }
        });

        this._on(modal, 'click', '[data-modal-action="close"]', () => modal.remove());
    }

    _createModal(title, content) {
        const overlay = document.createElement('div');
        overlay.className = 'sb-modal-overlay';
        overlay.innerHTML = `<div class="sb-modal"><div class="sb-modal-header"><h3>${this._escapeHtml(title)}</h3></div>${content}</div>`;
        document.body.appendChild(overlay);
        return overlay;
    }

    _startAutoSave() {
        if (this._autoSaveTimer) clearInterval(this._autoSaveTimer);
        this._autoSaveTimer = setInterval(() => {
            if (this._isDirty) SchemaTemplateManager.saveActive(this._fields);
        }, this.options.autoSaveInterval);
    }

    _markDirty() {
        this._isDirty = true;
        if (this.options.onChange) {
            this.options.onChange(this.getFields());
        }
    }

    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str.toString();
        return div.innerHTML;
    }

    destroy() {
        if (this._autoSaveTimer) clearInterval(this._autoSaveTimer);
        if (this._previewForm && this._previewForm.destroy) this._previewForm.destroy();
        super.destroy();
    }
}

export { SchemaBuilder };
