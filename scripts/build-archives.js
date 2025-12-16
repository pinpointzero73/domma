/**
 * Archive Builder
 * Creates downloadable preset archives (tar.gz) with JS + CSS + HTML template + README
 */

import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read metadata and package info
const metadata = JSON.parse(readFileSync(join(rootDir, 'src/bundle-metadata.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

// Output directory for archives
const archivesDir = join(rootDir, 'public/dist/archives');
if (!existsSync(archivesDir)) {
  mkdirSync(archivesDir, {recursive: true});
}

/**
 * Generate HTML template for a preset
 */
function generateHTMLTemplate(presetKey, preset) {
  const cssLinks = preset.cssFiles && preset.cssFiles.length > 0
    ? preset.cssFiles.map(cssKey => {
      const cssInfo = metadata.css[cssKey];
      return `    <link rel="stylesheet" href="css/${cssInfo.file.split('/').pop()}">`;
    }).join('\n')
    : '    <!-- No CSS files required for this preset -->';

  const hasBundledCSS = preset.cssFiles && preset.cssFiles.length > 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domma ${preset.name} - Quick Start</title>

    <!-- Option 1: Individual CSS files (granular control) -->
${cssLinks}

    <!-- Option 2: Single bundle (faster loading, simpler) -->
    <!-- <link rel="stylesheet" href="css/domma-bundle.css"> -->

    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .success-message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="success-message">
        <h1>✓ Domma ${preset.name} is ready!</h1>
        <p><strong>Version:</strong> ${pkg.version}</p>
        <p><strong>Preset:</strong> ${preset.name}</p>
        <p><strong>Use Case:</strong> ${preset.useCase}</p>
    </div>

    <h2>What's included?</h2>
    <ul>
        <li><strong>JavaScript:</strong> domma.min.js (~${preset.estimatedSize}KB)</li>${hasBundledCSS ? `
        <li><strong>CSS:</strong> ${preset.cssFiles.length} files (~${preset.cssSize}KB total)</li>` : ''}
        <li><strong>Modules:</strong> ${preset.modules.join(', ')}</li>
    </ul>

    <h2>Quick Start</h2>
    <p>Open your browser console (F12) and try:</p>
    <pre><code>// DOM manipulation
$('h1').css('color', 'blue');

// Utilities
const grouped = _.groupBy([{type: 'a'}, {type: 'b'}, {type: 'a'}], 'type');
console.log(grouped);

// Check version
console.log('Domma version:', Domma.version);</code></pre>

    <h2>Next Steps</h2>
    <ul>
        <li>Read the <a href="https://github.com/yourusername/domma">documentation</a></li>
        <li>Check out the <a href="https://domma.dev/showcase">showcase</a> for examples</li>
        <li>Start building your application!</li>
    </ul>

    <script src="dist/domma.min.js"></script>
    <script>
        // Verify Domma loaded
        if (typeof Domma !== 'undefined') {
            console.log('%cDomma ${preset.name} loaded successfully!', 'color: green; font-size: 16px; font-weight: bold');
            console.log('Version:', Domma.version);
            console.log('Build info:', Domma.buildInfo);
        } else {
            console.error('Domma failed to load');
        }
    </script>
</body>
</html>`;
}

/**
 * Generate README for a preset
 */
function generateREADME(presetKey, preset) {
  const modules = preset.modules.map(m => {
    const mod = metadata.modules[m];
    return `- **${mod.name}**: ${mod.description}`;
  }).join('\n');

  const cssFiles = preset.cssFiles && preset.cssFiles.length > 0
    ? preset.cssFiles.map(cssKey => {
      const css = metadata.css[cssKey];
      return `- **${css.name}** (${css.size}KB): ${css.description}`;
    }).join('\n')
    : 'No CSS files required';

  return `# Domma ${preset.name} - v${pkg.version}

${preset.description}

## What's Included

### JavaScript (~${preset.estimatedSize}KB)
${modules}

### CSS ${preset.cssSize ? `(~${preset.cssSize}KB)` : ''}
${cssFiles}

## Quick Start

1. **Open index.html** in your browser
2. **Open the console** (F12) to see Domma loaded
3. **Start coding!**

## Using the Bundle

### Option 1: Individual CSS Files (Recommended for customization)
\`\`\`html
<link rel="stylesheet" href="css/domma.css">
<link rel="stylesheet" href="css/grid.css">
<link rel="stylesheet" href="css/elements.css">
<link rel="stylesheet" href="css/domma-themes.css">
\`\`\`

### Option 2: Bundled CSS (Recommended for simplicity)
\`\`\`html
<link rel="stylesheet" href="css/domma-bundle.css">
\`\`\`

### JavaScript
\`\`\`html
<script src="dist/domma.min.js"></script>
\`\`\`

## Examples

### DOM Manipulation
\`\`\`javascript
$('button').on('click', function() {
    $(this).addClass('active');
});
\`\`\`

### Utilities
\`\`\`javascript
const users = [{name: 'Alice', age: 30}, {name: 'Bob', age: 25}];
const sorted = _.sortBy(users, 'age');
const grouped = _.groupBy(users, user => user.age > 27 ? 'senior' : 'junior');
\`\`\`

${preset.modules.includes('elements') ? `### UI Components
\`\`\`javascript
// Modal
const modal = Domma.elements.modal('#myModal');
modal.open();

// Tabs
Domma.elements.tabs('#myTabs');

// Tooltip
Domma.elements.tooltip('[data-tooltip]');
\`\`\`` : ''}

${preset.modules.includes('models') ? `### Reactive Models
\`\`\`javascript
const user = M.create({
    name: {type: 'string', required: true},
    age: {type: 'number', min: 0}
}, {name: 'Alice', age: 30});

user.onChange('name', (newVal, oldVal) => {
    console.log(\`Name changed from \${oldVal} to \${newVal}\`);
});
\`\`\`` : ''}

${preset.modules.includes('tables') ? `### Data Tables
\`\`\`javascript
const table = Domma.tables.create('#myTable', {
    data: users,
    columns: [
        {key: 'name', label: 'Name', sortable: true},
        {key: 'age', label: 'Age', sortable: true}
    ],
    pagination: true,
    pageSize: 10
});
\`\`\`` : ''}

## Use Case

${preset.useCase}

## Documentation

- **Full API Docs**: https://domma.dev/docs
- **Showcase**: https://domma.dev/showcase
- **GitHub**: https://github.com/yourusername/domma

## License

Copyright © ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT

---

Built with ❤️ using Domma ${pkg.version}
`;
}

/**
 * Build archive for a preset
 */
function buildArchive(presetKey, preset) {
  console.log(`\nBuilding archive for ${presetKey}...`);

  const tempDir = join(rootDir, `temp-${presetKey}`);
  const contentDir = join(tempDir, `domma-${presetKey}`);

  try {
    // Clean up existing temp directory
    if (existsSync(tempDir)) {
      rmSync(tempDir, {recursive: true, force: true});
    }

    // Create directory structure
    mkdirSync(join(contentDir, 'dist'), {recursive: true});
    mkdirSync(join(contentDir, 'css'), {recursive: true});

    // Copy JavaScript bundle
    const jsFile = presetKey === 'full' ? 'domma.min.js' : `domma-${presetKey}.min.js`;
    const jsSource = join(rootDir, 'public/dist', jsFile);

    if (!existsSync(jsSource)) {
      console.error(`  ✗ JavaScript file not found: ${jsSource}`);
      return;
    }

    cpSync(jsSource, join(contentDir, 'dist/domma.min.js'));
    console.log(`  ✓ Copied ${jsFile}`);

    // Copy CSS files (individual files)
    if (preset.cssFiles && preset.cssFiles.length > 0) {
      preset.cssFiles.forEach(cssKey => {
        const cssInfo = metadata.css[cssKey];
        const cssSource = join(rootDir, 'public/dist', cssInfo.file);
        const cssFileName = cssInfo.file.split('/').pop();
        const cssTarget = join(contentDir, 'css', cssFileName);

        if (existsSync(cssSource)) {
          cpSync(cssSource, cssTarget);
        } else {
          console.warn(`  ⚠ CSS file not found: ${cssSource}`);
        }
      });

      // Copy bundled CSS
      const bundleSource = join(rootDir, 'public/dist/bundles', `domma-${presetKey}.css`);
      if (existsSync(bundleSource)) {
        cpSync(bundleSource, join(contentDir, 'css/domma-bundle.css'));
        console.log(`  ✓ Copied CSS files (${preset.cssFiles.length} individual + 1 bundle)`);
      } else {
        console.warn(`  ⚠ CSS bundle not found: ${bundleSource}`);
      }
    }

    // Generate HTML template
    const html = generateHTMLTemplate(presetKey, preset);
    writeFileSync(join(contentDir, 'index.html'), html, 'utf8');
    console.log(`  ✓ Generated index.html`);

    // Generate README
    const readme = generateREADME(presetKey, preset);
    writeFileSync(join(contentDir, 'README.md'), readme, 'utf8');
    console.log(`  ✓ Generated README.md`);

    // Create tar.gz archive
    const archiveName = `domma-${presetKey}.tar.gz`;
    const archivePath = join(archivesDir, archiveName);

    execSync(`tar -czf "${archivePath}" -C "${tempDir}" .`, {
      stdio: 'pipe'
    });

    // Get archive size
    const stats = statSync(archivePath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log(`  ✓ Created ${archiveName} (${sizeKB}KB)`);

    // Cleanup
    rmSync(tempDir, {recursive: true, force: true});

  } catch (error) {
    console.error(`  ✗ Failed to build archive for ${presetKey}:`, error.message);

    // Cleanup on error
    if (existsSync(tempDir)) {
      rmSync(tempDir, {recursive: true, force: true});
    }
  }
}

// Main build process
console.log('Building preset archives...');

// Build archives for presets that have modules
const presetsWithModules = ['minimal', 'essentials', 'full', 'data-focused'];

presetsWithModules.forEach(presetKey => {
  const preset = metadata.presets[presetKey];
  if (preset) {
    buildArchive(presetKey, preset);
  }
});

console.log('\n✓ Archive build complete');
