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

import {cpSync, existsSync, mkdirSync, rmSync, statSync} from 'fs';
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

// 1. Copy entire kickstart directory structure
console.log('  → Copying kickstart directory...');
cpSync(kickstartDir, tempContentDir, {
    recursive: true,
    filter: (src) => {
        // Exclude any potential temp or hidden files
        const name = src.split('/').pop();
        return !name.startsWith('.');
    }
});

// 2. Create dist directory in temp content
const tempDistDir = join(tempContentDir, 'dist');
const tempThemesDir = join(tempDistDir, 'themes');
mkdirSync(tempThemesDir, {recursive: true});

// 3. Copy Domma core library
console.log('  → Copying domma.min.js...');
const distDir = join(rootDir, 'public/dist');
cpSync(join(distDir, 'domma.min.js'), join(tempDistDir, 'domma.min.js'));

// 4. Copy CSS files
console.log('  → Copying CSS files...');
cpSync(join(distDir, 'domma.css'), join(tempDistDir, 'domma.css'));
cpSync(join(distDir, 'grid.css'), join(tempDistDir, 'grid.css'));
cpSync(join(distDir, 'elements.css'), join(tempDistDir, 'elements.css'));

// 5. Copy themes
console.log('  → Copying themes...');
cpSync(join(distDir, 'themes/domma-themes.css'), join(tempThemesDir, 'domma-themes.css'));

// 6. Create tar.gz archive using system tar command
console.log('  → Creating archive...');

// Ensure dist directory exists
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
console.log('    ├── includes/index.js');
console.log('    ├── css/custom.css');
console.log('    ├── dist/');
console.log('    │   ├── domma.min.js');
console.log('    │   ├── domma.css');
console.log('    │   ├── grid.css');
console.log('    │   ├── elements.css');
console.log('    │   └── themes/domma-themes.css');
console.log('    └── assets/logo/ (2 SVG files)');
console.log('');
