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

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/domma.min.js',
            format: 'umd',
            name: 'Domma',
            sourcemap: false,
            banner
        },
        {
            file: 'dist/domma.esm.js',
            format: 'es',
            sourcemap: false,
            banner
        }
    ],
    plugins: [
        resolve(),
        replace({
            preventAssignment: true,
            __BUILD_VERSION__: JSON.stringify(pkg.version),
            __BUILD_DATE__: JSON.stringify(formatDate(new Date())),
            __BUILD_COMMIT__: JSON.stringify(getGitCommit())
        }),
        terser()
        // obfuscator({ options: obfuscatorOptions })  // Disabled - can cause issues
    ]
};
