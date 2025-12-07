/**
 * Generate Preset Bundle Entry Points
 * Creates bundle entry files from bundle-metadata.json
 */

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Load metadata
const metadataPath = join(rootDir, 'src/bundle-metadata.json');
const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));

// Ensure bundles directory exists
const bundlesDir = join(rootDir, 'src/bundles');
if (!existsSync(bundlesDir)) {
    mkdirSync(bundlesDir, {recursive: true});
}

/**
 * Generate entry point code for a preset
 */
function generateEntryPoint(presetKey, preset) {
    const modules = preset.modules;

    // Module name mapping (metadata key -> actual export name)
    const moduleNameMap = {
        'config': 'configEngine'
    };

    // Generate imports
    const imports = modules.map(key => {
        const exportName = moduleNameMap[key] || key;
        const importStatement = exportName === key
            ? `import {${key}} from '../${key}.js';`
            : `import {${exportName} as ${key}} from '../${key}.js';`;
        return importStatement;
    }).join('\n');

    // Determine if dom module is included
    const hasDom = modules.includes('dom');
    const hasConfig = modules.includes('config');

    // Generate Domma attachments
    const attachments = modules.map(key => {
        return `Domma.${key} = ${key};`;
    }).join('\n');

    // Generate config methods if config module is included
    const configMethods = hasConfig ? `
// Configuration methods (from config module)
Domma.setup = (config) => {
    // Handle theme configuration
    if (config.noStyles && Domma.theme) {
        Domma.theme.init({disabled: true});
    } else if ((config.theme || config.themeVariant || config.autoDetectTheme) && Domma.theme) {
        Domma.theme.init({
            theme: config.theme,
            variant: config.themeVariant,
            autoDetect: config.autoDetectTheme,
            persist: config.persistTheme !== false
        });
    }

    // Scan for icons if enabled
    if (config.scanIcons && Domma.icons) {
        Domma.icons.scan();
    }

    // Process component configuration
    return config.process(config);
};

Domma.update = (selector, changes) => config.update(selector, changes);
Domma.config = (selector) => config.config(selector);
Domma.reset = (selector) => config.reset(selector);
` : '';

    // Generate aliases
    const aliases = [];
    const aliasExports = [];
    const windowExports = [];
    const dommaAliasAttachments = [];

    modules.forEach(key => {
        const module = metadata.modules[key];
        if (module.aliases && module.aliases.length > 0) {
            module.aliases.forEach(alias => {
                aliases.push(`const ${alias} = ${key};`);
                aliasExports.push(alias);
                windowExports.push(`    window.${alias} = ${alias};`);
                dommaAliasAttachments.push(`Domma.${alias} = ${alias};`);
            });
        }
    });

    const code = `/**
 * Domma ${preset.name} Bundle
 * ${preset.description}
 *
 * Modules: ${modules.join(', ')}
 * Estimated Size: ~${preset.estimatedSize}KB
 * Use Case: ${preset.useCase}
 */

${imports}

const Domma = (selector) => ${hasDom ? 'dom(selector)' : 'null'};

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: '${presetKey}'
};
/* eslint-enable no-undef */

// Attach modules
${attachments}
${configMethods}
${aliases.length > 0 ? '// Short aliases\n' + aliases.join('\n') : ''}
${dommaAliasAttachments.length > 0 ? '\n// Attach aliases to Domma\n' + dommaAliasAttachments.join('\n') : ''}

// Expose globally if needed
if (typeof window !== 'undefined') {
    window.Domma = Domma;
${windowExports.join('\n')}
}

export default Domma;
export {Domma${aliasExports.length > 0 ? ', ' + aliasExports.join(', ') : ''}};
`;

    return code;
}

// Generate entry points for each preset (except 'full' which uses index.js)
console.log('Generating preset bundle entry points...\n');

Object.entries(metadata.presets).forEach(([key, preset]) => {
    if (key === 'full') {
        console.log(`⊘ Skipping '${key}' (uses src/index.js)`);
        return; // Skip full bundle - it uses index.js
    }

    const code = generateEntryPoint(key, preset);
    const filename = join(bundlesDir, `${key}.js`);

    writeFileSync(filename, code);
    console.log(`✓ Generated ${key}.js (${preset.modules.length} modules)`);
});

console.log('\n✓ Bundle entry points generated successfully!');
