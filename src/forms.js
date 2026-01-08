/**
 * Domma Forms Module
 * Schema-driven form generation with automatic validation and binding
 */

import {utils} from './utils.js';
import {models} from './models.js';

/**
 * Utility function to extract data from form element
 */
function getFormData(formElement) {
  const formData = new FormData(formElement);
  const data = {};

  for (const [key, value] of formData.entries()) {
    // Handle multiple values (checkboxes)
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  // Handle unchecked checkboxes and radio buttons
  const inputs = formElement.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.type === 'checkbox' && !input.checked) {
      if (!data.hasOwnProperty(input.name)) {
        data[input.name] = false;
      }
    } else if (input.type === 'checkbox' && input.checked) {
      data[input.name] = input.value === 'on' ? true : input.value;
    }
  });

  return data;
}

/**
 * Forma Class - Generates forms from Model schemas
 */
class Forma {
  static defaults = {
    layout: 'stacked',     // 'stacked', 'grid', 'inline'
    columns: 2,            // For grid layout
    labelPosition: 'top',  // 'top', 'left', 'floating'
    showLabels: true,
    showHelperText: true,
    showHints: true,
    validationMode: 'blur', // 'blur', 'change', 'submit'
    cssFramework: 'domma',  // 'domma', 'bootstrap', 'tailwind'
    className: 'domma-form',
    fieldClassName: 'domma-form-field',
    labelClassName: 'form-label',
    inputClassName: 'form-input',
    errorClassName: 'form-error',
    helperClassName: 'form-helper-text',
    hintClassName: 'form-hint',
    cardWrapper: false      // Wrap form in a card container
  };

  // Type-to-input mapping
  static inputTypes = {
    string: 'text',
    email: 'email',
    password: 'password',
    number: 'number',
    integer: 'number',
    float: 'number',
    boolean: 'checkbox',
    date: 'date',
    datetime: 'datetime-local',
    time: 'time',
    url: 'url',
    tel: 'tel',
    color: 'color',
    range: 'range',
    file: 'file',
    hidden: 'hidden'
  };

  constructor(schema, data = {}, options = {}) {
    this.schema = schema;
    this.data = {...data};
    this.options = {...Forma.defaults, ...options};
    this.model = null;
    this.errors = {};
    this.touched = new Set();

    // Set up runtime references
    this.utils = window.Domma?.utils || utils;
    this.models = window.Domma?.models || models;

    // Create model from schema and data
    if (schema && typeof schema === 'object') {
      this.model = this.models.create(schema, data, {
        persist: options.persist,
        autoSave: options.autoSave
      });
    }
  }

  /**
   * Generate form HTML
   */
  render() {
    if (!this.schema) {
      throw new Error('Schema is required to render form');
    }

    const formHTML = this._buildForm();
    return formHTML;
  }

  /**
   * Render form into DOM element
   */
  renderTo(selector) {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!element) {
      throw new Error(`Form container not found: ${selector}`);
    }

    element.innerHTML = this.render();
    this.formElement = element.querySelector('form');
    this._bindEvents(element);
    return element;
  }

  /**
   * Build the complete form structure
   */
  _buildForm() {
    const {className, layout, columns, cardWrapper} = this.options;

    let formClass = className;
    if (layout === 'grid') {
      // Support 2 or 3 columns
      const columnClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-2';
      formClass += ` grid ${columnClass} gap-4`;
    } else if (layout === 'inline') {
      formClass += ' domma-form-inline';
    }

    let html = '';

    // Add card wrapper if enabled
    if (cardWrapper) {
      html += '<div class="card"><div class="card-body">';
    }

    html += `<form class="${formClass}" novalidate>`;

    // Process sections if defined
    if (this.options.sections && Array.isArray(this.options.sections)) {
      for (const section of this.options.sections) {
        html += this._buildSection(section);
      }
    } else {
      // Render all fields without sections
      for (const fieldName in this.schema) {
        html += this._buildField(fieldName, this.schema[fieldName]);
      }
    }

    // Add submit button if not disabled
    if (this.options.showSubmitButton !== false) {
      const submitText = this.options.submitText || 'Submit';
      const resetText = this.options.resetText;
      const buttonAlignment = this.options.buttonAlignment || 'right';

      const alignmentClass = buttonAlignment === 'left' ? 'text-left' :
        buttonAlignment === 'center' ? 'text-center' : 'text-right';

      html += `<div class="form-group form-buttons mt-4 ${alignmentClass}">`;

      if (resetText) {
        html += `<button type="button" class="btn btn-secondary mr-2" data-action="reset">${resetText}</button>`;
      }

      html += `<button type="submit" class="btn btn-primary">${submitText}</button>`;
      html += '</div>';
    }

    html += '</form>';

    // Close card wrapper if enabled
    if (cardWrapper) {
      html += '</div></div>';
    }
    
    return html;
  }

  /**
   * Build a form section
   */
  _buildSection(section) {
    let html = '';

    if (section.title) {
      html += `<fieldset class="domma-form-section">`;
      html += `<legend class="domma-form-section-title">${section.title}</legend>`;
    }

    // Handle section layout
    const sectionClass = section.layout === 'grid'
      ? `grid grid-cols-${section.columns || 2}`
      : 'domma-form-section-content';

    html += `<div class="${sectionClass}">`;

    for (const fieldName of section.fields || []) {
      if (this.schema[fieldName]) {
        html += this._buildField(fieldName, this.schema[fieldName]);
      }
    }

    html += `</div>`;

    if (section.title) {
      html += `</fieldset>`;
    }

    return html;
  }

  /**
   * Build individual field
   */
  _buildField(fieldName, fieldDef) {
    const {
      fieldClassName,
      showLabels,
      showHelperText,
      showHints,
      labelPosition
    } = this.options;

    // Get field configuration
    const formConfig = fieldDef.formConfig || {};
    const type = fieldDef.type || 'string';
    const label = fieldDef.label || this.utils.capitalize(fieldName);
    const value = this.data[fieldName] || fieldDef.default || '';
    const required = fieldDef.required || false;
    const disabled = formConfig.disabled || fieldDef.readonly || false;
    const placeholder = formConfig.placeholder || '';
    const hint = formConfig.hint || '';
    const helperText = formConfig.helperText || '';

    // Handle column spanning for grid layouts
    const columnSpan = formConfig.span || 1;
    let spanClass = '';
    if (this.options.layout === 'grid' && columnSpan > 1) {
      const columns = this.options.columns || 2;
      if (columnSpan === 2) {
        spanClass = ' col-span-2';
      } else if (columnSpan === 3 && columns === 3) {
        spanClass = ' col-span-3';
      } else if (columnSpan >= columns) {
        spanClass = columns === 3 ? ' col-span-3' : ' col-span-2';
      }
    }

    let html = `<div class="${fieldClassName}${spanClass}" data-field="${fieldName}">`;

    // Label (skip for boolean types as they have inline labels)
    if (showLabels && label && type !== 'hidden' && type !== 'boolean') {
      const labelClass = this.options.labelClassName;
      const requiredMark = required ? ' <span class="text-danger">*</span>' : '';
      html += `<label for="field-${fieldName}" class="${labelClass}">${label}${requiredMark}`;

      // Hint next to label
      if (showHints && hint) {
        html += ` <small class="${this.options.hintClassName}">${hint}</small>`;
      }

      html += '</label>';
    }

    // Input element
    html += this._buildInput(fieldName, fieldDef, {
      type,
      value,
      required,
      disabled,
      placeholder
    });

    // Helper text
    if (showHelperText && helperText) {
      html += `<small class="${this.options.helperClassName}">${helperText}</small>`;
    }

    // Error container
    html += `<div class="${this.options.errorClassName}" data-error-for="${fieldName}" style="display: none;"></div>`;

    html += '</div>';
    return html;
  }

  /**
   * Builds an HTML input element based on the provided field definition and options.
   *
   * @param {string} fieldName - The name of the field, used as the 'name' attribute for the input.
   * @param {Object} fieldDef - The field definition containing configuration details such as min, max, pattern, etc.
   * @param {Object} inputOptions - Options to customize the input element including type, value, required, disabled, placeholder, etc.
   *
   * @return {string} A string representing the HTML input element with appropriate attributes and content based on the specified type.
   */
  _buildInput(fieldName, fieldDef, inputOptions) {
    const {type, value, required, disabled, placeholder} = inputOptions;
    const formConfig = fieldDef.formConfig || {};
    const inputClass = this.options.inputClassName;
    const id = `field-${fieldName}`;

    // Common attributes
    const attrs = {
      id,
      name: fieldName,
      class: inputClass,
      ...(required && {required: true}),
      ...(disabled && {disabled: true}),
      ...(placeholder && {placeholder}),
      ...(fieldDef.min !== undefined && {min: fieldDef.min}),
      ...(fieldDef.max !== undefined && {max: fieldDef.max}),
      ...(fieldDef.pattern && {pattern: fieldDef.pattern}),
      ...(formConfig.autocomplete && {autocomplete: formConfig.autocomplete})
    };

    const attrString = Object.entries(attrs)
      .map(([key, val]) => val === true ? key : `${key}="${val}"`)
      .join(' ');

    // Handle different input types
    switch (type) {
      case 'select':
        return this._buildSelect(fieldName, fieldDef, attrs, value);

      case 'multiselect':
        attrs.multiple = true;
        return this._buildSelect(fieldName, fieldDef, attrs, value);

      case 'textarea':
        const rows = formConfig.rows || 3;
        return `<textarea ${attrString} rows="${rows}">${this.utils.escapeHtml(value)}</textarea>`;

      case 'radio':
        return this._buildRadioGroup(fieldName, fieldDef, attrs, value);

      case 'checkbox-group':
        return this._buildCheckboxGroup(fieldName, fieldDef, attrs, value);

      case 'boolean':
        const checked = value ? 'checked' : '';
        const labelText = fieldDef.label || this.utils.capitalize(fieldName);
        const requiredMark = fieldDef.required ? ' <span class="text-danger">*</span>' : '';
        const hintText = formConfig.hint ? ` <small class="form-text text-muted">${formConfig.hint}</small>` : '';
        return `<div class="form-check">
                    <input type="checkbox" class="form-check-input" ${attrString} ${checked}>
                    <label class="form-check-label" for="${attrs.id}">${labelText}${requiredMark}</label>
                    ${hintText}
                </div>`;

      case 'file':
        const accept = formConfig.accept || '';
        const multiple = formConfig.multiple ? 'multiple' : '';
        return `<input type="file" ${attrString} accept="${accept}" ${multiple}>`;

      default:
        const inputType = Forma.inputTypes[type] || 'text';
        const escapedValue = this.utils.escapeHtml(value);
        return `<input type="${inputType}" ${attrString} value="${escapedValue}">`;
    }
  }

  /**
   * Constructs the HTML select element based on field definition and current value.
   *
   * @param fieldName
   * @param {Object} fieldDef - The field definition containing options, required status, and other attributes.
   * @param attrs
   * @param currentValue
   * @return {string} A string representing the generated HTML `<select>` element with appropriate options.
   */
  _buildSelect(fieldName, fieldDef, attrs, currentValue) {
    const attrString = Object.entries(attrs)
      .map(([key, val]) => val === true ? key : `${key}="${val}"`)
      .join(' ');

    let html = `<select ${attrString}>`;

    // Add empty option if not required
    if (!fieldDef.required) {
      html += `<option value="">-- Select --</option>`;
    }

    const options = fieldDef.options || [];
    const selectedValues = Array.isArray(currentValue) ? currentValue : [currentValue];

    for (const option of options) {
      if (typeof option === 'string') {
        const selected = selectedValues.includes(option) ? 'selected' : '';
        html += `<option value="${option}" ${selected}>${this.utils.capitalize(option)}</option>`;
      } else if (typeof option === 'object') {
        const selected = selectedValues.includes(option.value) ? 'selected' : '';
        html += `<option value="${option.value}" ${selected}>${option.label}</option>`;
      }
    }

    html += '</select>';
    return html;
  }

  /**
   * Constructs the HTML structure for a radio group based on provided field definitions and attributes.
   *
   * @return {string} A string containing the generated HTML markup for the radio group with proper styling classes.
   * @param fieldName
   * @param fieldDef
   * @param attrs
   * @param currentValue
   */
  _buildRadioGroup(fieldName, fieldDef, attrs, currentValue) {
    const options = fieldDef.options || [];
    let html = '<div class="domma-radio-group">';

    for (const option of options) {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? this.utils.capitalize(option) : option.label;
      const id = `${attrs.id}-${value}`;
      const checked = value === currentValue ? 'checked' : '';

      html += `
                <div class="domma-radio-option">
                    <input type="radio" id="${id}" name="${fieldName}" value="${value}" ${checked} ${attrs.disabled ? 'disabled' : ''}>
                    <label for="${id}">${label}</label>
                </div>
            `;
    }

    html += '</div>';
    return html;
  }

  /**
   * Build checkbox group
   */
  _buildCheckboxGroup(fieldName, fieldDef, attrs, currentValue) {
    const options = fieldDef.options || [];
    const values = Array.isArray(currentValue) ? currentValue : [];
    let html = '<div class="domma-checkbox-group">';

    for (const option of options) {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? this.utils.capitalize(option) : option.label;
      const id = `${attrs.id}-${value}`;
      const checked = values.includes(value) ? 'checked' : '';

      html += `
                <div class="domma-checkbox-option">
                    <input type="checkbox" id="${id}" name="${fieldName}[]" value="${value}" ${checked} ${attrs.disabled ? 'disabled' : ''}>
                    <label for="${id}">${label}</label>
                </div>
            `;
    }

    html += '</div>';
    return html;
  }

  /**
   * Bind events to form
   */
  _bindEvents(formElement) {
    // Form submission
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Field validation on blur/change
    formElement.addEventListener('blur', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.validateField(e.target.name);
        this.touched.add(e.target.name);
      }
    }, true);

    formElement.addEventListener('change', (e) => {
      if (e.target.matches('input, select, textarea')) {
        // Update model if it exists
        if (this.model) {
          const value = this._getFieldValue(e.target);
          try {
            this.model.set(e.target.name, value);
          } catch (err) {
            this.setFieldError(e.target.name, err.message);
          }
        }
      }
    });

    // Reset button handling
    formElement.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="reset"]')) {
        e.preventDefault();
        this.reset();
      }
    });
  }

  /**
   * Get form data
   */
  getData() {
    if (this.model) {
      return this.model.get();
    }
    return this.data;
  }

  /**
   * Set form data
   */
  setData(data) {
    this.data = {...this.data, ...data};
    if (this.model) {
      this.model.set(data);
    }
  }

  /**
   * Validate entire form
   */
  validate() {
    this.errors = {};
    let isValid = true;

    for (const fieldName in this.schema) {
      const fieldValid = this.validateField(fieldName);
      if (!fieldValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Validate single field
   */
  validateField(fieldName) {
    const fieldDef = this.schema[fieldName];
    if (!fieldDef) return true;

    const value = this._getFieldValueByName(fieldName);

    try {
      // Schema-based validation
      const validationResult = this._validateFieldValue(fieldName, value, fieldDef);
      if (!validationResult.valid) {
        this.setFieldError(fieldName, validationResult.error);
        return false;
      }

      // Use model validation if available
      if (this.model && this.model._validateField) {
        const result = this.model._validateField(fieldName, value);
        if (!result.valid) {
          this.setFieldError(fieldName, result.error);
          return false;
        }
      }

      this.clearFieldError(fieldName);
      return true;
    } catch (error) {
      this.setFieldError(fieldName, error.message);
      return false;
    }
  }

  /**
   * Set field error
   */
  setFieldError(fieldName, message) {
    this.errors[fieldName] = message;
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      errorEl.parentElement.classList.add('has-error');
    }
  }

  /**
   * Clear field error
   */
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      errorEl.parentElement.classList.remove('has-error');
    }
  }

  /**
   * Handle form submission
   */
  handleSubmit() {
    const isValid = this.validate();
    const data = this.getData();

    if (isValid && this.options.onSubmit) {
      this.options.onSubmit(data, this);
    } else if (!isValid && this.options.onValidationError) {
      this.options.onValidationError(this.errors, this);
    }

    return {isValid, data, errors: this.errors};
  }

  /**
   * Get value from form field element
   */
  _getFieldValue(element) {
    const {type, name} = element;

    if (type === 'checkbox') {
      // Handle checkbox groups
      if (name.endsWith('[]')) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
      }
      return element.checked;
    }

    if (type === 'radio') {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : null;
    }

    if (type === 'number' || type === 'range') {
      return element.value === '' ? null : Number(element.value);
    }

    return element.value;
  }

  /**
   * Get field value by field name
   */
  _getFieldValueByName(fieldName) {
    if (this.formElement) {
      const element = this.formElement.querySelector(`[name="${fieldName}"]`);
      if (element) {
        return this._getFieldValue(element);
      }
    }

    // Fallback to data/model
    return this.model ? this.model.get(fieldName) : this.data[fieldName];
  }

  /**
   * Validate field value against schema definition
   */
  _validateFieldValue(fieldName, value, fieldDef) {
    // Required check
    if (fieldDef.required && (value === null || value === undefined || value === '')) {
      return {valid: false, error: `${fieldDef.label || fieldName} is required`};
    }

    // Skip further validation if value is empty and not required
    if (value === null || value === undefined || value === '') {
      return {valid: true};
    }

    // Type validation
    if (fieldDef.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {valid: false, error: 'Please enter a valid email address'};
      }
    }

    if (fieldDef.type === 'number' && value !== null) {
      const num = Number(value);
      if (isNaN(num)) {
        return {valid: false, error: 'Please enter a valid number'};
      }

      if (fieldDef.min !== undefined && num < fieldDef.min) {
        return {valid: false, error: `Value must be at least ${fieldDef.min}`};
      }

      if (fieldDef.max !== undefined && num > fieldDef.max) {
        return {valid: false, error: `Value must be no more than ${fieldDef.max}`};
      }
    }

    // String length validation
    if (typeof value === 'string') {
      if (fieldDef.minLength && value.length < fieldDef.minLength) {
        return {valid: false, error: `Must be at least ${fieldDef.minLength} characters`};
      }

      if (fieldDef.maxLength && value.length > fieldDef.maxLength) {
        return {valid: false, error: `Must be no more than ${fieldDef.maxLength} characters`};
      }
    }

    // Pattern validation
    if (fieldDef.pattern && typeof value === 'string') {
      if (!fieldDef.pattern.test(value)) {
        return {valid: false, error: fieldDef.formConfig?.hint || 'Invalid format'};
      }
    }

    // Custom validation function
    if (fieldDef.validate && typeof fieldDef.validate === 'function') {
      try {
        // Get current form data for cross-field validation
        const currentFormData = this.formElement ? getFormData(this.formElement) : this.data;
        const result = fieldDef.validate(value, currentFormData);
        if (result !== true) {
          return {valid: false, error: result || 'Validation failed'};
        }
      } catch (error) {
        return {valid: false, error: error.message || 'Validation error'};
      }
    }

    return {valid: true};
  }
}

/**
 * Forms module
 */
export const forms = {
  /**
   * Create a new form builder instance
   */
  create(schema, data = {}, options = {}) {
    return new Forma(schema, data, options);
  },

  /**
   * Render form into element
   */
  render(selector, schema, data = {}, options = {}) {
    const form = new Forma(schema, data, options);
    return form.renderTo(selector);
  },

  /**
   * Create wizard form (multi-step form)
   */
  wizard(selector, options = {}) {
    if (!options.schema) {
      throw new Error('Wizard options must include a schema with steps array');
    }

    const {schema: {steps = []}, data = {}, ...wizardOptions} = options;
    const wizardId = `wizard-${Date.now()}`;
    let currentStep = 0;
    let stepData = {...data};
    let wizardElement = null;

    // Get target element
    const targetElement = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!targetElement) {
      throw new Error(`Wizard target element not found: ${selector}`);
    }

    // Validate steps
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('Wizard schema must contain a non-empty steps array');
    }

    // Ensure each step has required properties
    steps.forEach((step, index) => {
      if (!step.title) step.title = `Step ${index + 1}`;
      if (!step.fields) throw new Error(`Step ${index} is missing fields array`);
    });

    // Helper function to extract form data
    function getFormData(formElement) {
      const formData = {};
      const inputs = formElement.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        const {name, type, value, checked} = input;
        if (!name) return;

        if (type === 'checkbox') {
          if (name.endsWith('[]')) {
            const fieldName = name.slice(0, -2);
            if (!formData[fieldName]) formData[fieldName] = [];
            if (checked) formData[fieldName].push(value);
          } else {
            formData[name] = checked;
          }
        } else if (type === 'radio') {
          if (checked) formData[name] = value;
        } else if (type === 'number' || type === 'range') {
          formData[name] = value === '' ? null : Number(value);
        } else if (input.tagName === 'SELECT' && input.hasAttribute('multiple')) {
          // Handle multiselect - collect all selected options as array
          formData[name] = Array.from(input.selectedOptions).map(option => option.value).filter(val => val);
        } else {
          formData[name] = value;
        }
      });

      return formData;
    }

    function renderStep(stepIndex) {
      const step = steps[stepIndex];
      const form = new Forma(step.fields, stepData, {
        ...wizardOptions,
        layout: step.layout || wizardOptions.layout || 'stacked',
        showSubmitButton: false // Wizard has its own buttons
      });

      const isFirstStep = stepIndex === 0;
      const isLastStep = stepIndex === steps.length - 1;

      return `
                <div id="${wizardId}" class="wizard">
                    <div class="wizard-step active card" data-step="${stepIndex}">
                        <div class="card-header wizard-header">
                            <div class="wizard-progress mb-3">
                                <div class="wizard-progress-bar" style="width: ${((stepIndex + 1) / steps.length) * 100}%"></div>
                            </div>
                            <div class="wizard-step-info">
                                <h5 class="wizard-step-title card-title mb-2">${step.title}</h5>
                                ${step.description ? `<p class="wizard-step-description card-subtitle text-muted mb-2">${step.description}</p>` : ''}
                                <small class="text-muted">Step ${stepIndex + 1} of ${steps.length}</small>
                            </div>
                        </div>
                        <div class="card-body wizard-content">
                            ${form.render()}
                        </div>
                        <div class="card-footer wizard-nav d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary wizard-prev" ${isFirstStep ? 'style="visibility: hidden;"' : ''}>
                                ${wizardOptions.prevText || 'Previous'}
                            </button>
                            <button type="button" class="btn btn-primary wizard-${isLastStep ? 'submit' : 'next'}">
                                ${isLastStep ? (wizardOptions.finishText || 'Finish') : (wizardOptions.nextText || 'Next')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }

    function updateWizard() {
      // Clear existing wizard content
      targetElement.innerHTML = renderStep(currentStep);
      wizardElement = targetElement.querySelector(`#${wizardId}`);
      if (!wizardElement) return;

      // Bind form events for current step
      const formElement = wizardElement.querySelector('form');
      if (formElement) {
        const currentForm = new Forma(steps[currentStep].fields, stepData, {
          ...wizardOptions,
          showSubmitButton: false // Wizard has its own buttons
        });
        currentForm._bindEvents(formElement);
      }

      // Bind wizard navigation
      const prevBtn = wizardElement.querySelector('.wizard-prev');
      const nextBtn = wizardElement.querySelector('.wizard-next');
      const submitBtn = wizardElement.querySelector('.wizard-submit');

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (currentStep > 0) {
            if (wizardOptions.onStepChange) {
              wizardOptions.onStepChange(currentStep - 1, stepData);
            }
            currentStep--;
            updateWizard();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();

          // Get current form data
          const formData = getFormData(formElement);

          // Merge current form data
          Object.assign(stepData, formData);

          // Validate current step with proper form element
          const currentForm = new Forma(steps[currentStep].fields, stepData, {
            ...wizardOptions,
            showSubmitButton: false // Wizard has its own buttons
          });
          currentForm.formElement = formElement; // Set form element for proper validation
          currentForm.setData(stepData);

          const isValid = currentForm.validate();

          if (wizardOptions.onValidation) {
            wizardOptions.onValidation(isValid, currentForm.errors || [], currentStep);
          }

          if (!isValid) {
            return; // Stay on current step if validation fails
          }

          if (currentStep < steps.length - 1) {
            if (wizardOptions.onStepChange) {
              wizardOptions.onStepChange(currentStep + 1, stepData);
            }
            currentStep++;
            updateWizard();
          }
        });
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
          e.preventDefault();

          // Get final form data
          const formData = getFormData(formElement);

          // Merge final form data
          Object.assign(stepData, formData);

          // Validate final step with proper form element
          const currentForm = new Forma(steps[currentStep].fields, stepData, {
            ...wizardOptions,
            showSubmitButton: false // Wizard has its own buttons
          });
          currentForm.formElement = formElement; // Set form element for proper validation
          currentForm.setData(stepData);

          const isValid = currentForm.validate();

          if (wizardOptions.onValidation) {
            wizardOptions.onValidation(isValid, currentForm.errors || [], currentStep);
          }

          if (!isValid) {
            return; // Stay on current step if validation fails
          }

          // Call onSubmit callback
          if (wizardOptions.onSubmit) {
            try {
              await wizardOptions.onSubmit(stepData, currentForm);
            } catch (error) {
              if (wizardOptions.onError) {
                wizardOptions.onError(error, stepData, currentForm);
              }
            }
          }
        });
      }
    }

    // Initialize wizard
    updateWizard();

    // Return wizard control object
    return {
      nextStep: () => {
        if (currentStep < steps.length - 1) {
          if (wizardOptions.onStepChange) {
            wizardOptions.onStepChange(currentStep + 1, stepData);
          }
          currentStep++;
          updateWizard();
        }
      },
      prevStep: () => {
        if (currentStep > 0) {
          if (wizardOptions.onStepChange) {
            wizardOptions.onStepChange(currentStep - 1, stepData);
          }
          currentStep--;
          updateWizard();
        }
      },
      goToStep: (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
          if (wizardOptions.onStepChange) {
            wizardOptions.onStepChange(stepIndex, stepData);
          }
          currentStep = stepIndex;
          updateWizard();
        }
      },
      getCurrentStep: () => currentStep,
      getStepData: () => ({...stepData}),
      setStepData: (data) => {
        Object.assign(stepData, data);
        updateWizard();
      },
      validate: () => {
        const formElement = wizardElement?.querySelector('form');
        if (formElement) {
          const currentForm = new Forma(steps[currentStep].fields, stepData, {
            ...wizardOptions,
            showSubmitButton: false
          });
          currentForm.formElement = formElement;
          currentForm.setData(stepData);
          return currentForm.validate();
        }
        return true;
      },
      getElement: () => wizardElement
    };
  },

  /**
   * Create modal form (integration with existing modal system)
   */
  modal(schema, data = {}, options = {}) {
    const formId = `form-${Date.now()}`;
    let modal = null;

    const form = new Forma(schema, data, {
      ...options,
      showSubmitButton: false, // Modal has its own buttons
      onSubmit: async (formData, formInstance) => {
        if (options.onSave) {
          try {
            await options.onSave(formData, formInstance);
            if (options.closeOnSave !== false && modal) {
              modal.close();
            }
          } catch (error) {
            if (options.onError) {
              options.onError(error, formData, formInstance);
            }
          }
        }
      }
    });

    // Create a simple modal HTML structure
    const modalHTML = `
            <div class="modal" id="modal-${formId}" style="display: none;">
                <div class="modal-header">
                    <h3 class="modal-title">${options.title || 'Form'}</h3>
                    <button type="button" class="modal-close" data-action="close">&times;</button>
                </div>
                <div class="modal-body">
                    ${form.render()}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-action="close">Cancel</button>
                    <button type="button" class="btn btn-primary" data-action="save">${options.saveText || 'Save'}</button>
                </div>
            </div>
        `;

    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.display = 'none';

    // Add modal to page
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    const modalDiv = modalElement.firstElementChild;

    document.body.appendChild(backdrop);
    document.body.appendChild(modalDiv);

    // Create modal control object
    modal = {
      open() {
        backdrop.style.display = 'block';
        modalDiv.style.display = 'block';
        setTimeout(() => {
          backdrop.classList.add('active');
          modalDiv.classList.add('active');
        }, 10);

        // Bind form events
        const formElement = modalDiv.querySelector('form');
        if (formElement) {
          form._bindEvents(formElement);
        }

        // Handle modal buttons
        modalDiv.querySelectorAll('[data-action="close"]').forEach(btn => {
          btn.addEventListener('click', () => this.close());
        });

        modalDiv.querySelector('[data-action="save"]').addEventListener('click', () => {
          const formElement = modalDiv.querySelector('form');
          if (formElement) {
            const submitEvent = new Event('submit', {cancelable: true});
            formElement.dispatchEvent(submitEvent);
          }
        });

        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.close();
          }
        });
      },

      close() {
        backdrop.classList.remove('active');
        modalDiv.classList.remove('active');
        setTimeout(() => {
          backdrop.style.display = 'none';
          modalDiv.style.display = 'none';
          // Clean up
          document.body.removeChild(backdrop);
          document.body.removeChild(modalDiv);
        }, 300);
      },

      isOpen() {
        return modalDiv.style.display !== 'none';
      }
    };

    return modal;
  },

  /**
   * CRUD Helper - Complete Create, Read, Update, Delete functionality
   */
  crud(config) {
    if (!config.schema) {
      throw new Error('CRUD config must include a schema');
    }

    if (!config.endpoint) {
      throw new Error('CRUD config must include an API endpoint');
    }

    const {
      schema,
      endpoint,
      tableSelector,
      title = 'Manage Items',
      primaryKey = 'id',
      displayField = 'name',
      headers = {},
      onError = (error) => console.error('CRUD Error:', error),
      onSuccess = (message) => console.log('CRUD Success:', message)
    } = config;

    let table = null;
    let data = [];

    const crud = {
      // Initialize CRUD interface
      async init() {
        await this.loadData();
        this.createTable();
        this.bindEvents();
      },

      // Load data from API
      async loadData() {
        try {
          const apiUrl = window.Domma?.auth?.getApiUrl?.() || '';
          const token = window.Domma?.auth?.token;
          const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

          const response = await window.Domma.http.get(endpoint, {
            headers: {...headers, ...authHeaders}
          });

          if (response.success) {
            data = response.data || [];
          } else {
            throw new Error(response.message || 'Failed to load data');
          }
        } catch (error) {
          onError(error);
          throw error;
        }
      },

      // Create data table
      createTable() {
        if (!tableSelector) return;

        // Generate columns from schema
        const columns = Object.entries(schema).map(([key, def]) => ({
          key,
          title: def.label || (window.Domma?.utils || utils).capitalize(key),
          sortable: true,
          render: def.tableRender
        }));

        // Add actions column
        columns.push({
          key: 'actions',
          title: 'Actions',
          sortable: false,
          render: (value, row) => {
            const editIcon = window.Domma.icons.html('edit', {
              size: 16,
              class: 'inline-icon',
              colour: '#a5d8ff',
              attrs: {style: 'margin-right: 4px;'}
            });
            const trashIcon = window.Domma.icons.html('trash', {
              size: 16,
              class: 'inline-icon',
              colour: '#ffacac',
              attrs: {style: 'margin-right: 4px;'}
            });
            return `
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-primary crud-edit-btn" data-id="${row[primaryKey]}">
                                ${editIcon}
                                Edit
                            </button>
                            <button class="btn btn-danger crud-delete-btn" data-id="${row[primaryKey]}">
                                ${trashIcon}
                                Delete
                            </button>
                        </div>
                    `
          }
        });

        table = window.Domma.tables.create(tableSelector, {
          data,
          columns,
          pagination: true,
          pageSize: 25,
          striped: true,
          selectable: true,
          selectionMode: 'multiple',
          exportPanel: true,
          exportOptions: ['text', 'csv', 'excel', 'json'],
          columnToggle: true,
          regexSearch: true,
          persistSettings: true,
          storageKey: `domma-crud-${title.toLowerCase().replace(/\s+/g, '-')}`
        });

        // Initialize icons in the action buttons
        this.initializeTableIcons();
      },

      // Initialize icons in table action buttons
      initializeTableIcons() {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          const iconElements = document.querySelectorAll('[data-icon]');
          iconElements.forEach(element => {
            const iconName = element.getAttribute('data-icon');
            if (window.Domma && window.Domma.icons && window.Domma.icons.render) {
              const svgIcon = window.Domma.icons.render(iconName, {
                size: 16,
                class: 'inline-icon'
              });
              if (svgIcon) {
                element.innerHTML = ''; // Clear existing content
                element.appendChild(svgIcon);
              }
            }
          });
        }, 100);
      },

      // Bind event handlers
      bindEvents() {
        // Add button
        const addBtn = document.querySelector('.crud-add-btn');
        if (addBtn) {
          addBtn.addEventListener('click', () => this.create());
        }

        // Edit buttons (event delegation)
        document.addEventListener('click', (e) => {
          if (e.target.matches('.crud-edit-btn')) {
            const id = e.target.getAttribute('data-id');
            this.edit(id);
          }
        });

        // Delete buttons (event delegation)
        document.addEventListener('click', (e) => {
          if (e.target.matches('.crud-delete-btn')) {
            const id = e.target.getAttribute('data-id');
            this.delete(id);
          }
        });

        // Refresh button
        const refreshBtn = document.querySelector('.crud-refresh-btn');
        if (refreshBtn) {
          refreshBtn.addEventListener('click', () => this.refresh());
        }
      },

      // Create new item
      async create() {
        const modal = forms.modal(schema, {}, {
          title: `Create New ${title.slice(7)}`, // Remove "Manage " prefix
          size: 'xl',
          saveText: 'Create',
          showSubmitButton: false, // Modal has its own buttons
          onSave: async (formData) => {
            try {
              const apiUrl = window.Domma?.auth?.getApiUrl?.() || '';
              const token = window.Domma?.auth?.token;
              const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

              const response = await window.Domma.http.post(endpoint, formData, {
                headers: {...headers, ...authHeaders}
              });

              if (!response.success) {
                throw new Error(response.message || 'Failed to create item');
              }

              onSuccess('Item created successfully');
              await this.refresh();
            } catch (error) {
              onError(error);
              throw error;
            }
          }
        });

        modal.open();
      },

      // Edit existing item
      async edit(id) {
        const item = data.find(d => d[primaryKey] == id);
        if (!item) {
          onError(new Error('Item not found'));
          return;
        }

        const modal = forms.modal(schema, item, {
          title: `Edit ${item[displayField] || 'Item'}`,
          size: 'xl',
          saveText: 'Update',
          showSubmitButton: false, // Modal has its own buttons
          onSave: async (formData) => {
            try {
              const apiUrl = window.Domma?.auth?.getApiUrl?.() || '';
              const token = window.Domma?.auth?.token;
              const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

              const response = await window.Domma.http.put(`${endpoint}/${id}`, formData, {
                headers: {...headers, ...authHeaders}
              });

              if (!response.success) {
                throw new Error(response.message || 'Failed to update item');
              }

              onSuccess('Item updated successfully');
              await this.refresh();
            } catch (error) {
              onError(error);
              throw error;
            }
          }
        });

        modal.open();
      },

      // Delete item with confirmation
      async delete(id) {
        const item = data.find(d => d[primaryKey] == id);
        if (!item) {
          onError(new Error('Item not found'));
          return;
        }

        const confirmed = await window.Domma.elements.confirm(
          `Are you sure you want to delete "${item[displayField] || 'this item'}"?\n\nThis action cannot be undone.`,
          {
            title: 'Confirm Delete',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'warning'
          }
        );

        if (!confirmed) return;

        try {
          const apiUrl = window.Domma?.auth?.getApiUrl?.() || '';
          const token = window.Domma?.auth?.token;
          const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

          const response = await window.Domma.http.delete(`${endpoint}/${id}`, {
            headers: {...headers, ...authHeaders}
          });

          if (!response.success) {
            throw new Error(response.message || 'Failed to delete item');
          }

          onSuccess('Item deleted successfully');
          await this.refresh();
        } catch (error) {
          onError(error);
        }
      },

      // Refresh table data
      async refresh() {
        try {
          await this.loadData();
          if (table) {
            table.setData(data);
            // Re-initialize icons after data update
            this.initializeTableIcons();
          }
        } catch (error) {
          // Error already handled in loadData
        }
      },

      // Get current data
      getData: () => [...data],

      // Get table instance
      getTable: () => table,

      // Add item to local data (for real-time updates)
      addItem: (item) => {
        data.push(item);
        if (table) table.setData(data);
      },

      // Update item in local data
      updateItem: (id, updates) => {
        const index = data.findIndex(d => d[primaryKey] == id);
        if (index !== -1) {
          data[index] = {...data[index], ...updates};
          if (table) table.setData(data);
        }
      },

      // Remove item from local data
      removeItem: (id) => {
        const index = data.findIndex(d => d[primaryKey] == id);
        if (index !== -1) {
          data.splice(index, 1);
          if (table) table.setData(data);
        }
      }
    };

    return crud;
  }
};