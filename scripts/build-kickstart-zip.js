/**
 * Kickstart Archive Builder
 * Creates kickstart archives with complete starter kits for each preset
 *
 * Generates ready-to-use packages containing:
 * - Kickstart template (index.html with adjusted paths)
 * - JavaScript file (index.js)
 * - Preset-specific Domma library
 * - Required CSS files for the preset
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

// Read metadata
const metadata = JSON.parse(readFileSync(join(rootDir, 'src/bundle-metadata.json'), 'utf8'));

// Paths
const kickstartDir = join(rootDir, 'public/kickstart');
const distDir = join(rootDir, 'public/dist');

console.log('[Kickstart Archives] Building kickstart variants...\n');

/**
 * Build a kickstart archive for a specific preset
 */
function buildKickstartVariant(presetKey, preset) {
  console.log(`\nBuilding kickstart-${presetKey}.tar.gz...`);

  const tempDir = join(rootDir, `temp-kickstart-${presetKey}`);
  const tempContentDir = join(tempDir, 'kickstart-starter');

  try {
    // 1. Cleanup and create temp directory
    if (existsSync(tempDir)) {
      rmSync(tempDir, {recursive: true, force: true});
    }
    mkdirSync(tempContentDir, {recursive: true});

    // 2. Copy entire kickstart directory structure
    console.log('  → Copying kickstart template...');
    cpSync(kickstartDir, tempContentDir, {
      recursive: true,
      filter: (src) => {
        const name = src.split('/').pop();
        return !name.startsWith('.');
      }
    });

    // 3. Create dist directory in temp content
    const tempDistDir = join(tempContentDir, 'dist');
    const tempThemesDir = join(tempDistDir, 'themes');
    mkdirSync(tempThemesDir, {recursive: true});

    // 4. Copy JavaScript bundle
    const jsFile = presetKey === 'full' ? 'domma.min.js' : `domma-${presetKey}.min.js`;
    const jsSource = join(distDir, jsFile);

    if (!existsSync(jsSource)) {
      console.error(`  ✗ JavaScript file not found: ${jsSource}`);
      return;
    }

    console.log(`  → Copying ${jsFile}...`);
    cpSync(jsSource, join(tempDistDir, 'domma.min.js'));

    // 5. Copy CSS files based on preset
    console.log('  → Copying CSS files...');
    if (preset.cssFiles && preset.cssFiles.length > 0) {
      preset.cssFiles.forEach(cssKey => {
        const cssInfo = metadata.css[cssKey];
        const cssSource = join(distDir, cssInfo.file);

        if (existsSync(cssSource)) {
          const cssTarget = cssInfo.file.includes('/')
            ? join(tempDistDir, cssInfo.file)
            : join(tempDistDir, cssInfo.file);

          // Create subdirectories if needed (e.g., themes/)
          const cssTargetDir = dirname(cssTarget);
          if (!existsSync(cssTargetDir)) {
            mkdirSync(cssTargetDir, {recursive: true});
          }

          cpSync(cssSource, cssTarget);
        } else {
          console.warn(`  ⚠ CSS file not found: ${cssSource}`);
        }
      });
    }

    // 6. Update index.html to reference correct CSS files
    const indexPath = join(tempContentDir, 'index.html');
    let indexHtml = readFileSync(indexPath, 'utf8');

    // Comment out all CSS links first
    indexHtml = indexHtml.replace(
      /<link rel="stylesheet" href="\/dist\/(.*?)\.css">/g,
      '<!-- <link rel="stylesheet" href="/dist/$1.css"> -->'
    );

    // Uncomment only the CSS files needed for this preset
    if (preset.cssFiles && preset.cssFiles.length > 0) {
      preset.cssFiles.forEach(cssKey => {
        const cssInfo = metadata.css[cssKey];
        const cssFileName = cssInfo.file.replace('themes/', 'themes/');
        const regex = new RegExp(`<!-- <link rel="stylesheet" href="/dist/${cssFileName.replace('.', '\\.')}"> -->`);
        indexHtml = indexHtml.replace(regex, `<link rel="stylesheet" href="/dist/${cssFileName}">`);
      });
    }

    writeFileSync(indexPath, indexHtml, 'utf8');

    // 7. Create tar.gz archive
    console.log('  → Creating archive...');

    const outputZip = join(distDir, `kickstart-${presetKey}.tar.gz`);

    // Remove old archive if it exists
    if (existsSync(outputZip)) {
      rmSync(outputZip);
    }

    // Create tar.gz
    execSync(`tar -czf "${outputZip}" kickstart-starter`, {
      cwd: tempDir,
      stdio: 'pipe'
    });

    // Get archive size
    const zipStats = statSync(outputZip);
    const zipSizeKB = Math.round(zipStats.size / 1024);

    console.log(`  ✓ Created kickstart-${presetKey}.tar.gz (${zipSizeKB}KB)`);

    // 8. Cleanup temp directory
    rmSync(tempDir, {recursive: true, force: true});

    // 9. Create alias for full build (backward compatibility)
    if (presetKey === 'full') {
      const aliasPath = join(distDir, 'kickstart.tar.gz');
      if (existsSync(aliasPath)) {
        rmSync(aliasPath);
      }
      cpSync(outputZip, aliasPath);
      console.log('  ✓ Created kickstart.tar.gz (alias for full)');
    }

  } catch (error) {
    console.error(`  ✗ Failed to build kickstart-${presetKey}:`, error.message);

    // Cleanup on error
    if (existsSync(tempDir)) {
      rmSync(tempDir, {recursive: true, force: true});
    }
  }
}

// Build kickstart variants for selected presets
const kickstartPresets = ['minimal', 'essentials', 'full', 'data-focused'];

kickstartPresets.forEach(presetKey => {
  const preset = metadata.presets[presetKey];
  if (preset) {
    buildKickstartVariant(presetKey, preset);
  }
});

console.log('\n✓ Kickstart archive build complete');
console.log('\nGenerated archives:');
console.log('  • kickstart-minimal.tar.gz');
console.log('  • kickstart-essentials.tar.gz');
console.log('  • kickstart-full.tar.gz (also aliased as kickstart.tar.gz)');
console.log('  • kickstart-data-focused.tar.gz');
console.log('');
