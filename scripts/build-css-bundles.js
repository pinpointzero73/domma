/**
 * CSS Bundle Builder
 * Creates preset CSS bundles matching JavaScript presets
 * Reads bundle-metadata.json and concatenates CSS files in correct order
 */

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read metadata and package info
const metadata = JSON.parse(readFileSync(join(rootDir, 'src/bundle-metadata.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

// Output directory for bundled CSS
const bundlesDir = join(rootDir, 'public/dist/bundles');
if (!existsSync(bundlesDir)) {
  mkdirSync(bundlesDir, {recursive: true});
}

// Build banner
const createBanner = (presetName) => `/*!
 * Domma ${presetName} CSS Bundle v${pkg.version}
 * Dynamic Object Manipulation & Modeling API
 * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT
 * Built: ${new Date().toISOString()}
 */

`;

// CSS Load Order (critical for overrides to work correctly)
const cssLoadOrder = ['domma', 'grid', 'elements', 'themes'];

/**
 * Build a CSS bundle for a preset
 */
function buildCSSBundle(presetKey, preset) {
  if (!preset.cssFiles || preset.cssFiles.length === 0) {
    console.log(`⊘ Skipping ${presetKey} (no CSS files)`);
    return;
  }

  let cssContent = createBanner(preset.name);

  // Sort CSS files according to load order
  const sortedFiles = preset.cssFiles.sort((a, b) => {
    return cssLoadOrder.indexOf(a) - cssLoadOrder.indexOf(b);
  });

  // Concatenate CSS files
  sortedFiles.forEach(cssKey => {
    const cssInfo = metadata.css[cssKey];
    if (!cssInfo) {
      console.error(`✗ CSS key "${cssKey}" not found in metadata`);
      return;
    }

    const cssPath = join(rootDir, 'public/dist', cssInfo.file);

    if (!existsSync(cssPath)) {
      console.error(`✗ CSS file not found: ${cssPath}`);
      return;
    }

    const fileContent = readFileSync(cssPath, 'utf8');

    // Add section comment
    cssContent += `/* ============================================\n`;
    cssContent += `   ${cssInfo.name.toUpperCase()}\n`;
    cssContent += `   ${cssInfo.description}\n`;
    cssContent += `   ============================================ */\n\n`;
    cssContent += fileContent;
    cssContent += '\n\n';
  });

  // Write bundle
  const outputPath = join(bundlesDir, `domma-${presetKey}.css`);
  writeFileSync(outputPath, cssContent, 'utf8');

  // Calculate actual size
  const sizeKB = (Buffer.byteLength(cssContent, 'utf8') / 1024).toFixed(1);
  console.log(`✓ Built domma-${presetKey}.css (${sizeKB}KB)`);
}

/**
 * Build complete CSS bundle (all CSS files)
 */
function buildCompleteBundle() {
  let cssContent = createBanner('Complete');

  // All CSS files in load order
  cssLoadOrder.forEach(cssKey => {
    const cssInfo = metadata.css[cssKey];
    if (!cssInfo) return;

    const cssPath = join(rootDir, 'public/dist', cssInfo.file);
    if (!existsSync(cssPath)) {
      console.warn(`⚠ CSS file not found: ${cssPath}`);
      return;
    }

    const fileContent = readFileSync(cssPath, 'utf8');

    cssContent += `/* ============================================\n`;
    cssContent += `   ${cssInfo.name.toUpperCase()}\n`;
    cssContent += `   ${cssInfo.description}\n`;
    cssContent += `   ============================================ */\n\n`;
    cssContent += fileContent;
    cssContent += '\n\n';
  });

  const outputPath = join(bundlesDir, 'domma-complete.css');
  writeFileSync(outputPath, cssContent, 'utf8');

  const sizeKB = (Buffer.byteLength(cssContent, 'utf8') / 1024).toFixed(1);
  console.log(`✓ Built domma-complete.css (${sizeKB}KB - all CSS)`);
}

// Main build process
console.log('Building CSS preset bundles...\n');

// Build preset bundles
Object.entries(metadata.presets).forEach(([key, preset]) => {
  buildCSSBundle(key, preset);
});

// Build complete bundle
buildCompleteBundle();

console.log('\n✓ CSS bundle build complete');
