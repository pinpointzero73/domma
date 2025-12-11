/**
 * Kickstart Archive Builder
 * Creates kickstart.zip with complete starter kit
 *
 * Generates a ready-to-use package containing:
 * - Kickstart template (index.html with adjusted paths)
 * - JavaScript file (index.js)
 * - Domma core library
 * - Themes and CSS
 * - Logo assets
 *
 * Note: Uses tar.gz format for better cross-platform compatibility
 */

import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Paths
const kickstartDir = join(rootDir, 'public/kickstart');
const tempDir = join(rootDir, 'temp-kickstart');
const tempContentDir = join(tempDir, 'kickstart-starter');
const outputZip = join(rootDir, 'public/dist/kickstart.tar.gz');

console.log('[Kickstart Archive] Building kickstart.tar.gz...\n');

// Cleanup and create temp directory
if (existsSync(tempDir)) {
    rmSync(tempDir, {recursive: true});
}
mkdirSync(tempContentDir, {recursive: true});

// 1. Copy and modify index.html
console.log('  → Processing index.html...');
const indexHtml = readFileSync(join(kickstartDir, 'index.html'), 'utf8')
    .replace(/\.\.\/dist\//g, 'dist/')
    .replace(/\.\.\/showcase\/css\//g, 'css/')
    .replace(/\.\.\/assets\//g, 'assets/')
    .replace(/src="index\.js"/g, 'src="js/index.js"');

writeFileSync(join(tempContentDir, 'index.html'), indexHtml);

// 2. Copy index.js
console.log('  → Copying index.js...');
mkdirSync(join(tempContentDir, 'js'), {recursive: true});
cpSync(
    join(kickstartDir, 'index.js'),
    join(tempContentDir, 'js/index.js')
);

// 3. Copy Domma dist files
console.log('  → Copying Domma core files...');
mkdirSync(join(tempContentDir, 'dist/themes'), {recursive: true});
cpSync(
    join(rootDir, 'public/dist/domma.min.js'),
    join(tempContentDir, 'dist/domma.min.js')
);
cpSync(
    join(rootDir, 'public/dist/themes/domma-themes.css'),
    join(tempContentDir, 'dist/themes/domma-themes.css')
);

// 4. Copy CSS
console.log('  → Copying CSS files...');
mkdirSync(join(tempContentDir, 'css'), {recursive: true});
cpSync(
    join(rootDir, 'public/showcase/css/domma.css'),
    join(tempContentDir, 'css/domma.css')
);
cpSync(
    join(rootDir, 'public/showcase/css/grid.css'),
    join(tempContentDir, 'css/grid.css')
);
cpSync(
    join(rootDir, 'public/showcase/css/elements.css'),
    join(tempContentDir, 'css/elements.css')
);

// 5. Copy logos
console.log('  → Copying logo assets...');
mkdirSync(join(tempContentDir, 'assets/logo'), {recursive: true});
cpSync(
    join(rootDir, 'public/assets/logo/domma-icon.svg'),
    join(tempContentDir, 'assets/logo/domma-icon.svg')
);
cpSync(
    join(rootDir, 'public/assets/logo/dcbw-it-icon.svg'),
    join(tempContentDir, 'assets/logo/dcbw-it-icon.svg')
);

// 6. Create tar.gz archive using system tar command
console.log('  → Creating archive...');

// Ensure dist directory exists
const distDir = join(rootDir, 'public/dist');
if (!existsSync(distDir)) {
    mkdirSync(distDir, {recursive: true});
}

// Remove old archive if it exists
if (existsSync(outputZip)) {
    rmSync(outputZip);
}

// Create tar.gz (cd into temp dir to avoid including temp dir in paths)
try {
    execSync(`tar -czf "${outputZip}" kickstart-starter`, {
        cwd: tempDir,
        stdio: 'pipe'
    });
} catch (err) {
    console.error('  ✗ Failed to create archive:', err.message);
    process.exit(1);
}

// Get archive size
const zipStats = statSync(outputZip);
const zipSizeKB = Math.round(zipStats.size / 1024);

// 7. Cleanup temp directory
rmSync(tempDir, {recursive: true});

console.log('\n✓ Generated kickstart.tar.gz');
console.log(`  Location: public/dist/kickstart.tar.gz`);
console.log(`  Size: ${zipSizeKB} KB`);
console.log('\n  Contents:');
console.log('    kickstart-starter/');
console.log('    ├── index.html');
console.log('    ├── js/index.js');
console.log('    ├── dist/domma.min.js');
console.log('    ├── dist/themes/domma-themes.css');
console.log('    ├── css/domma.css');
console.log('    ├── css/grid.css');
console.log('    ├── css/elements.css');
console.log('    └── assets/logo/ (2 SVG files)');
console.log('');
