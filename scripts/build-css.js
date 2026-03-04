/**
 * CSS Build Script
 * Builds all CSS files to dist/ with version banners
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

// Theme CSS files in order (16 total: 8 colors × 2 modes)
const themeFiles = [
    'public/assets/themes/_base.css',
  // Ocean themes
  'public/assets/themes/ocean-light.css',
  'public/assets/themes/ocean-dark.css',
  // Forest themes
  'public/assets/themes/forest-light.css',
  'public/assets/themes/forest-dark.css',
  // Sunset themes
  'public/assets/themes/sunset-light.css',
  'public/assets/themes/sunset-dark.css',
  // Royal themes
  'public/assets/themes/royal-light.css',
  'public/assets/themes/royal-dark.css',
  // Lemon themes
  'public/assets/themes/lemon-light.css',
  'public/assets/themes/lemon-dark.css',
  // Silver themes
  'public/assets/themes/silver-light.css',
  'public/assets/themes/silver-dark.css',
  // Charcoal themes
  'public/assets/themes/charcoal-light.css',
  'public/assets/themes/charcoal-dark.css',
  // Christmas themes
  'public/assets/themes/christmas-light.css',
  'public/assets/themes/christmas-dark.css',
  // Unicorn themes
  'public/assets/themes/unicorn-light.css',
  'public/assets/themes/unicorn-dark.css',
  // Dreamy themes
  'public/assets/themes/dreamy-light.css',
  'public/assets/themes/dreamy-dark.css',
  // Grayve themes
  'public/assets/themes/grayve-light.css',
  'public/assets/themes/grayve-dark.css'
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
const outputDir = join(rootDir, 'public/dist/themes');
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, {recursive: true});
}

// Write themes output
const themesOutputPath = join(outputDir, 'domma-themes.css');
writeFileSync(themesOutputPath, css);

console.log(`✓ Built ${themesOutputPath}`);
console.log(`  Version: ${pkg.version}`);
console.log(`  Commit: ${getGitCommit()}`);
console.log(`  Size: ${(css.length / 1024).toFixed(1)}KB`);

// Build core CSS files to dist/
const coreCSSFiles = [
    {src: 'src/css/domma.css', dest: 'public/dist/domma.css', name: 'Domma Core CSS'},
    {src: 'src/css/grid.css', dest: 'public/dist/grid.css', name: 'Domma Grid CSS'},
    {src: 'src/css/elements.css', dest: 'public/dist/elements.css', name: 'Domma Elements CSS'},
    {src: 'src/css/syntax.css', dest: 'public/dist/syntax.css', name: 'Domma Syntax Highlighting CSS'},
    {src: 'src/css/domma-tools.css', dest: 'public/dist/domma-tools.css', name: 'Domma Tools CSS'}
];

const cssBanner = (name) => `/*!
 * ${name} v${pkg.version}
 * Dynamic Object Manipulation & Modeling API
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 * Commit: ${getGitCommit()}
 */

`;

for (const {src, dest, name} of coreCSSFiles) {
    const srcPath = join(rootDir, src);
    const destPath = join(rootDir, dest);

    if (existsSync(srcPath)) {
        const content = readFileSync(srcPath, 'utf8');
        const withBanner = cssBanner(name) + content;
        writeFileSync(destPath, withBanner);

        console.log(`✓ Built ${destPath}`);
        console.log(`  Size: ${(withBanner.length / 1024).toFixed(1)}KB`);
    } else {
        console.warn(`Warning: ${src} not found`);
    }
}
