/**
 * CSS Build Script
 * Concatenates theme CSS files and prepends version banner
 */

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read version from package.json
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

// Get git commit hash
const getGitCommit = () => {
    try {
        return execSync('git rev-parse --short HEAD', {cwd: rootDir}).toString().trim();
    } catch {
        return 'unknown';
    }
};

// Theme CSS files in order
const themeFiles = [
    'assets/themes/_base.css',
    'assets/themes/light.css',
    'assets/themes/dark.css',
    'assets/themes/ocean.css',
    'assets/themes/forest.css',
    'assets/themes/sunset.css',
    'assets/themes/royal.css',
    'assets/themes/lemon.css',
    'assets/themes/silver.css',
    'assets/themes/charcoal.css'
];

// Build banner
const banner = `/*!
 * Domma Themes v${pkg.version}
 * Dynamic Object Manipulation & Modeling API
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 */

`;

// Concatenate CSS files
let css = banner;

for (const file of themeFiles) {
    const filePath = join(rootDir, file);
    if (existsSync(filePath)) {
        css += readFileSync(filePath, 'utf8') + '\n';
    } else {
        console.warn(`Warning: ${file} not found`);
    }
}

// Ensure output directory exists
const outputDir = join(rootDir, 'dist/themes');
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, {recursive: true});
}

// Write output
const outputPath = join(outputDir, 'domma-themes.css');
writeFileSync(outputPath, css);

console.log(`✓ Built ${outputPath}`);
console.log(`  Version: ${pkg.version}`);
console.log(`  Commit: ${getGitCommit()}`);
console.log(`  Size: ${(css.length / 1024).toFixed(1)}KB`);
