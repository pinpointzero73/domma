/**
 * Rollup Plugin - .domma Single-File Components
 *
 * Transforms .domma files (Vue SFC-style) into Domma.component() registrations.
 *
 * .domma file format:
 *
 *   <template>
 *     <div class="card">
 *       <h2>{{name}}</h2>
 *     </div>
 *   </template>
 *
 *   <script>
 *   export default {
 *     data() { return { name: 'World' }; },
 *     onMount() { console.log('mounted'); }
 *   };
 *   </script>
 *
 *   <style>
 *   .card { padding: var(--spacing-md); }
 *   </style>
 *
 * The file name (without extension) becomes the component tag name.
 * e.g. components/user-card.domma  →  Domma.component('user-card', …)
 *
 * Usage in rollup.config.js:
 *
 *   import { dommaPlugin } from './src/plugins/rollup-plugin-domma.js';
 *
 *   export default {
 *     plugins: [ dommaPlugin() ]
 *   };
 */

/**
 * Extract a named section from a .domma file.
 * Returns the inner content of <section>…</section> or null if absent.
 *
 * @param {string} source   Full file content
 * @param {string} section  Tag name: 'template' | 'script' | 'style'
 * @returns {string|null}
 */
function extractSection(source, section) {
    const pattern = new RegExp(
        `<${section}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${section}>`,
        'i'
    );
    const match = source.match(pattern);
    return match ? match[1].trim() : null;
}

/**
 * Derive a component tag name from a file path.
 * e.g. '/src/components/user-card.domma' → 'user-card'
 *
 * @param {string} id  File path
 * @returns {string}
 */
function tagNameFromPath(id) {
    return id
        .split('/')
        .pop()
        .replace(/\.domma$/i, '')
        .toLowerCase();
}

/**
 * Escape a string for safe embedding inside a template literal.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeTemplateLiteral(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');
}

/**
 * The Rollup plugin factory.
 *
 * @returns {import('rollup').Plugin}
 */
export function dommaPlugin() {
    return {
        name: 'domma-sfc',

        /**
         * Transform .domma files into JS modules.
         *
         * @param {string} code  Source file content
         * @param {string} id    Absolute file path
         */
        transform(code, id) {
            if (!id.endsWith('.domma')) return null;

            const tagName = tagNameFromPath(id);

            const templateContent = extractSection(code, 'template') ?? '';
            const scriptContent   = extractSection(code, 'script')
                ?? 'export default {};';
            const styleContent    = extractSection(code, 'style') ?? '';

            // Replace "export default {" with a variable declaration so we can
            // merge the template and style into the definition before registering.
            const transformedScript = scriptContent.replace(
                /export\s+default\s*\{/,
                'const __dmDefinition = {'
            );

            const output = `
${transformedScript}

if (typeof Domma !== 'undefined' && typeof Domma.component === 'function') {
    Domma.component(${JSON.stringify(tagName)}, {
        ...__dmDefinition,
        template: \`${escapeTemplateLiteral(templateContent)}\`,
        ${styleContent ? `style: \`${escapeTemplateLiteral(styleContent)}\`,` : ''}
    });
}

export default __dmDefinition;
`.trim();

            return {
                code:    output,
                map:     { mappings: '' }
            };
        }
    };
}
