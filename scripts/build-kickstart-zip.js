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
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

// Paths
const kickstartDir = join(rootDir, 'public/kickstart');
const distDir = join(rootDir, 'public/dist');

// Generate timestamp for filename
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}_${month}_${day}_${hours}_${minutes}`;
}

const buildTimestamp = getTimestamp();

console.log('[Kickstart Archives] Building kickstart variants...');
console.log(`Build timestamp: ${buildTimestamp}\n`);

/**
 * Build a kickstart archive for a specific preset
 */
function buildKickstartVariant(presetKey, preset) {
  console.log(`\nBuilding kickstart-${presetKey}_${buildTimestamp}.tar.gz...`);

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

    // 6. Create info.json with build metadata
    console.log('  → Creating info.json...');
    const buildInfoPath = join(rootDir, 'public/dist/build-info.json');
    let buildInfo = {
      preset: presetKey,
      version: metadata.version || pkg.version,
      built: new Date().toISOString(),
      timestamp: buildTimestamp
    };

    // Read existing build-info.json if available
    if (existsSync(buildInfoPath)) {
      try {
        const existingInfo = JSON.parse(readFileSync(buildInfoPath, 'utf8'));
        buildInfo = {
          ...buildInfo,
          ...existingInfo,
          preset: presetKey,
          timestamp: buildTimestamp
        };
      } catch (err) {
        console.warn('  ⚠ Could not read build-info.json, using minimal info');
      }
    }

    writeFileSync(join(tempContentDir, 'info.json'), JSON.stringify(buildInfo, null, 2));

    // 7. Update index.html to reference correct CSS files
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

    // 8. Create tar.gz archive
    console.log('  → Creating archive...');

    const outputZip = join(distDir, `kickstart-${presetKey}_${buildTimestamp}.tar.gz`);

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

    console.log(`  ✓ Created kickstart-${presetKey}_${buildTimestamp}.tar.gz (${zipSizeKB}KB)`);

    // 9. Cleanup temp directory
    rmSync(tempDir, {recursive: true, force: true});

    // 10. Create alias for full build (backward compatibility)
    if (presetKey === 'full') {
      const aliasPath = join(distDir, `kickstart_${buildTimestamp}.tar.gz`);
      if (existsSync(aliasPath)) {
        rmSync(aliasPath);
      }
      cpSync(outputZip, aliasPath);
      console.log(`  ✓ Created kickstart_${buildTimestamp}.tar.gz (alias for full)`);
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

// Write metadata file for download page
const metadataPath = join(distDir, 'kickstart-latest.json');
const kickstartMetadata = {
  timestamp: buildTimestamp,
  buildDate: new Date().toISOString(),
  files: {
    minimal: `kickstart-minimal_${buildTimestamp}.tar.gz`,
    essentials: `kickstart-essentials_${buildTimestamp}.tar.gz`,
    full: `kickstart-full_${buildTimestamp}.tar.gz`,
    dataFocused: `kickstart-data-focused_${buildTimestamp}.tar.gz`,
    alias: `kickstart_${buildTimestamp}.tar.gz`
  }
};
writeFileSync(metadataPath, JSON.stringify(kickstartMetadata, null, 2));
console.log('  ✓ Created kickstart-latest.json metadata file');

console.log('\n✓ Kickstart archive build complete');
console.log('\nGenerated archives:');
console.log(`  • kickstart-minimal_${buildTimestamp}.tar.gz`);
console.log(`  • kickstart-essentials_${buildTimestamp}.tar.gz`);
console.log(`  • kickstart-full_${buildTimestamp}.tar.gz (also aliased as kickstart_${buildTimestamp}.tar.gz)`);
console.log(`  • kickstart-data-focused_${buildTimestamp}.tar.gz`);
console.log('');
