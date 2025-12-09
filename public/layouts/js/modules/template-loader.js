/**
 * Template Loader Module
 * Handles loading, compiling, and caching of layout templates
 */
export const TemplateLoader = {
    cache: new Map(),
    baseUrl: null,

    /**
     * Initialize with base URL
     * @param {string} baseUrl - Base URL for templates
     */
    init(baseUrl = '/layouts/templates/') {
        this.baseUrl = baseUrl;
    },

    /**
     * Load and compile template
     * @param {string} name - Template name (without .html)
     * @returns {Promise<Function>} Compiled template function
     */
    async load(name) {
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        try {
            const url = this.baseUrl + name + '.html';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Template ${name} not found`);
            }

            const template = await response.text();
            // Use Domma's template engine if available
            const compiled = typeof _ !== 'undefined' && _.template ?
                _.template(template) :
                () => template; // Fallback to plain text

            this.cache.set(name, compiled);
            return compiled;
        } catch (error) {
            console.error(`Failed to load template ${name}:`, error);
            return () => ''; // Return empty template on error
        }
    },

    /**
     * Load multiple templates in parallel
     * @param {string[]} names - Array of template names
     * @returns {Promise<Map>} Map of name -> compiled template
     */
    async loadMany(names) {
        const promises = names.map(async name => {
            const template = await this.load(name);
            return [name, template];
        });

        const results = await Promise.all(promises);
        return new Map(results);
    },

    /**
     * Register partial templates for use in other templates
     * @param {Object} partials - Map of partial name -> template string
     */
    registerPartials(partials) {
        // Domma's template system handles partials via {{> name}}
        // Store partials in a special namespace
        Object.entries(partials).forEach(([name, template]) => {
            const compiled = typeof _ !== 'undefined' && _.template ?
                _.template(template) :
                () => template;
            this.cache.set('partial:' + name, compiled);
        });
    },

    /**
     * Clear template cache (useful for hot reload)
     */
    clearCache() {
        this.cache.clear();
    }
};
