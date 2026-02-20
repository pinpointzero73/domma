/**
 * Template Binding Compiler for Domma Components
 *
 * Provides surgical DOM binding for reactive component templates.
 * Analyses Mustache templates to separate "text-only" bindings (surgically
 * updatable via textContent) from "structural" bindings (if/each blocks and
 * attribute-value bindings that require a full re-render on change).
 */

/**
 * Parse a Mustache template and classify every binding expression as either
 * "structural" (needs full re-render) or "text-only" (can be surgically updated).
 *
 * @param {string} template
 * @returns {{ structural: Set<string>, text: Set<string> }}
 */
export function parseBindings(template) {
    const structural = new Set();
    const text       = new Set();

    // Block conditions / iterables
    const blockRe = /\{\{#(?:if|unless|each|with)\s+([\w.]+)/g;
    let m;
    while ((m = blockRe.exec(template)) !== null) {
        structural.add(m[1].split('.')[0]);
    }

    // Attribute-value bindings:  class="{{x}}"  data-id="prefix-{{x}}"
    const attrRe = /\s[\w:-]+\s*=\s*["'][^"']*\{\{([^#/>!{}][^}]*)\}\}[^"']*["']/g;
    while ((m = attrRe.exec(template)) !== null) {
        const root = m[1].trim().split('.')[0];
        if (/^\w+$/.test(root)) structural.add(root);
    }

    // Text-only bindings: remaining {{field}} / {{field.nested}} expressions
    const textRe = /\{\{([^#/>!{}][^}]*)\}\}/g;
    while ((m = textRe.exec(template)) !== null) {
        const expr = m[1].trim();
        const root = expr.split('.')[0];
        if (/^\w+$/.test(root) && !structural.has(root)) {
            text.add(root);
        }
    }

    return { structural, text };
}

/**
 * Annotate a template: wrap text-only {{field}} expressions with
 * <span data-dm-b="field"> anchors that survive the Mustache render pass.
 *
 * @param {string}      template
 * @param {Set<string>} textFields  Set of text-only root field names
 * @returns {string} Annotated template
 */
export function annotateTemplate(template, textFields) {
    if (textFields.size === 0) return template;

    return template.replace(
        /\{\{([^#/>!{}][^}]*)\}\}/g,
        (match, expr) => {
            const root = expr.trim().split('.')[0];
            if (/^\w+$/.test(root) && textFields.has(root)) {
                return `<span data-dm-b="${expr.trim()}">${match}</span>`;
            }
            return match;
        }
    );
}

/**
 * Scan a rendered container for [data-dm-b] anchor spans and build a registry.
 *
 * @param {Element} container
 * @returns {Map<string, HTMLElement[]>}
 */
function buildRegistry(container) {
    const registry = new Map();
    container.querySelectorAll('[data-dm-b]').forEach(span => {
        const field = span.getAttribute('data-dm-b');
        if (!registry.has(field)) registry.set(field, []);
        registry.get(field).push(span);
    });
    return registry;
}

/**
 * Compile a template into a DOM container and return a BindingController.
 *
 * @param {string}   rawTemplate       Mustache template string
 * @param {Object}   data              Initial merged data context
 * @param {Element}  contentContainer  DOM element to render into (NOT shadowRoot)
 * @param {Function} renderFn          (template, data) => string
 * @returns {BindingController}
 */
export function compile(rawTemplate, data, contentContainer, renderFn) {
    const { structural, text } = parseBindings(rawTemplate);
    const annotated             = annotateTemplate(rawTemplate, text);

    contentContainer.innerHTML = renderFn(annotated, data);

    let registry = buildRegistry(contentContainer);

    const controller = {
        structural,
        text,

        /**
         * Surgically update a text-only field in the DOM.
         * Handles direct bindings ("name") and nested-path bindings ("name.first").
         *
         * @param {string} rootField
         * @param {*}      newValue
         * @returns {boolean}
         */
        update(rootField, newValue) {
            let updated = false;

            const direct = registry.get(rootField);
            if (direct && direct.length > 0) {
                const str = newValue != null ? String(newValue) : '';
                direct.forEach(span => { span.textContent = str; });
                updated = true;
            }

            // Nested paths: data-dm-b="rootField.sub"
            const prefix = rootField + '.';
            for (const [path, spans] of registry.entries()) {
                if (path.startsWith(prefix)) {
                    const subPath = path.slice(prefix.length);
                    const nestedVal = subPath.split('.').reduce(
                        (obj, key) => (obj != null && typeof obj === 'object' ? obj[key] : null),
                        newValue
                    );
                    const str = nestedVal != null ? String(nestedVal) : '';
                    spans.forEach(span => { span.textContent = str; });
                    updated = true;
                }
            }

            return updated;
        },

        /**
         * Full re-render: replace container content and rebuild the registry.
         * Use for structural field changes (if/each conditions).
         *
         * @param {Object} newData  Full merged data context
         */
        rerender(newData) {
            contentContainer.innerHTML = renderFn(annotated, newData);
            registry = buildRegistry(contentContainer);
        },

        /** Returns true if the field requires a full re-render on change. */
        isStructural(field) {
            return structural.has(field);
        }
    };

    return controller;
}

export const TemplateCompiler = { parseBindings, annotateTemplate, compile };
