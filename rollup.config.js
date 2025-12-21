import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import {execSync} from 'child_process';
import {readFileSync} from 'fs';

// Read version from package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Get git commit hash
const getGitCommit = () => {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch {
        return 'unknown';
    }
};

// Format date as dd/mm/YYYY hh:mm
const formatDate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Build banner with version metadata
const banner = `/*!
 * Domma v${pkg.version}
 * Dynamic Object Manipulation & Modeling API
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 */`;

const toolsBanner = `/*!
 * Domma Tools v${pkg.version}
 * Developer tools: Theme Roller & Page Roller
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 *
 * Requires: domma.min.js
 */`;

const syntaxBanner = `/*!
 * Domma Syntax Highlighter v${pkg.version}
 * Lightweight code syntax highlighting for JavaScript, HTML, and CSS
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 */`;

const extensionsBanner = `/*!
 * Domma Editor Extensions v${pkg.version}
 * Optional enhancements for Domma editor
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 *
 * Requires: domma.min.js
 */`;

const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    stringArray: true,
    stringArrayThreshold: 0.75
};

const commonPlugins = [
    resolve(),
    replace({
        preventAssignment: true,
        __BUILD_VERSION__: JSON.stringify(pkg.version),
        __BUILD_DATE__: JSON.stringify(formatDate(new Date())),
        __BUILD_COMMIT__: JSON.stringify(getGitCommit())
    }),
    terser()
];

// Preset bundles configuration
const presetBundles = [
    {name: 'minimal', description: 'Minimal Bundle'},
    {name: 'essentials', description: 'Essentials Bundle'},
    {name: 'data-focused', description: 'Data-Focused Bundle'},
    {name: 'no-ui', description: 'No-UI Bundle'}
];

// Generate bundle configurations for each preset
const bundleConfigs = presetBundles.map(preset => ({
    input: `src/bundles/${preset.name}.js`,
    output: [
        {
            file: `public/dist/domma-${preset.name}.min.js`,
            format: 'umd',
            name: 'Domma',
            sourcemap: false,
            banner: `/*!
 * Domma ${preset.description} v${pkg.version}
 * Dynamic Object Manipulation & Modeling API
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 */`
        },
        {
            file: `public/dist/domma-${preset.name}.esm.js`,
            format: 'es',
            sourcemap: false,
            banner: `/*!
 * Domma ${preset.description} v${pkg.version}
 * Dynamic Object Manipulation & Modeling API
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 */`
        }
    ],
    plugins: commonPlugins
}));

export default [
    // Main Domma bundle (Full)
    {
        input: 'src/index.js',
        output: [
            {
                file: 'public/dist/domma.min.js',
                format: 'umd',
                name: 'Domma',
                sourcemap: false,
                banner
            },
            {
                file: 'public/dist/domma.esm.js',
                format: 'es',
                sourcemap: false,
                banner
            }
        ],
        plugins: commonPlugins
    },
    // Tools bundle (Theme Roller + Page Roller)
    {
        input: 'src/tools.js',
        output: [
            {
                file: 'public/dist/domma-tools.min.js',
                format: 'umd',
                name: 'DommaTools',
                sourcemap: false,
                banner: toolsBanner
            },
            {
                file: 'public/dist/domma-tools.esm.js',
                format: 'es',
                sourcemap: false,
                banner: toolsBanner
            }
        ],
        plugins: commonPlugins
    },
    // Syntax highlighter bundle
    {
        input: 'src/syntax.js',
        output: [
            {
                file: 'public/dist/domma-syntax.min.js',
                format: 'umd',
                name: 'DommaSyntax',
                sourcemap: false,
                banner: syntaxBanner
            },
            {
                file: 'public/dist/domma-syntax.esm.js',
                format: 'es',
                sourcemap: false,
                banner: syntaxBanner
            }
        ],
        plugins: commonPlugins
    },
    // Editor Extensions bundle
    {
        input: 'src/editor-extensions.js',
        output: [
            {
                file: 'public/dist/domma-editor-extensions.min.js',
                format: 'umd',
                name: 'DommaEditorExtensions',
                sourcemap: false,
                banner: extensionsBanner
            },
            {
                file: 'public/dist/domma-editor-extensions.esm.js',
                format: 'es',
                sourcemap: false,
                banner: extensionsBanner
            }
        ],
        plugins: commonPlugins
    },
    // Preset bundles (Minimal, Essentials, Data-Focused, No-UI)
    ...bundleConfigs
];
