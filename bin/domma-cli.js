#!/usr/bin/env node

import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, cpSync} from 'fs';
import {dirname, join, relative} from 'path';
import {fileURLToPath} from 'url';
import {spawnSync} from 'child_process';
import * as readline from 'readline/promises';
import {stdin as input, stdout as output} from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const VERSION = packageJson.version;

const THEMES = [
  'charcoal-dark', 'ocean-dark', 'forest-dark', 'sunset-light',
  'silver-light', 'ocean-light', 'forest-light', 'sunset-dark',
  'royal-dark', 'lemon-light'
];

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];

// Command routing
switch (command) {
  case 'init':
  case undefined:
    handleInit();
    break;
  case 'add':
    handleAdd();
    break;
  case 'setup-ai':
    handleSetupAI();
    break;
  case 'serve':
    handleServe();
    break;
  case 'version':
  case '--version':
  case '-v':
    showVersion();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    // Check if it's a --flag for init
    if (command && command.startsWith('--')) {
      handleInit();
    } else {
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
    }
}

/**
 * Handle project initialisation
 */
async function handleInit() {
  const quickMode = args.includes('--quick');
  const spaFlag = args.includes('--spa');
  const mpaFlag = args.includes('--mpa');

  // ASCII Art Banner
  console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║       Welcome to Domma CLI!           ║
║            v${VERSION.padEnd(24)}║
║                                       ║
╚═══════════════════════════════════════╝

  Let's set up your project.
`);

  let projectName = 'my-app';
  let theme = 'charcoal-dark';
  let includeThemeSelector = false;
  let projectMode = 'mpa'; // Default to multi-page

  // Determine project mode
  if (spaFlag) {
    projectMode = 'spa';
  } else if (mpaFlag) {
    projectMode = 'mpa';
  } else if (!quickMode) {
    // Prompt user to choose mode
    const rl = readline.createInterface({input, output});

    console.log(`\n  Choose project type:`);
    console.log(`    ❯ Multi-Page Application (MPA) - Traditional multi-page website (default)`);
    console.log(`      Single Page Application (SPA) - Client-side routing with view switching`);

    const modeAnswer = await rl.question(`\n  Enter choice (mpa/spa): `);
    const modeInput = modeAnswer.trim().toLowerCase();

    if (modeInput === 'spa' || modeInput === 's') {
      projectMode = 'spa';
    }

    rl.close();
    console.log('');
  }

  if (!quickMode) {
    const rl = readline.createInterface({input, output});

    // Prompt for project name
    const nameAnswer = await rl.question(`  Project name: (${projectName}) `);
    if (nameAnswer.trim()) projectName = nameAnswer.trim();

    // Prompt for theme
    console.log(`\n  Choose a theme:`);
    THEMES.forEach((t, i) => {
      const marker = i === 0 ? '❯' : ' ';
      const tag = i === 0 ? '(default)' : '';
      console.log(`    ${marker} ${t} ${tag}`);
    });

    const themeAnswer = await rl.question(`\n  Enter theme name or number (1-${THEMES.length}): `);
    const themeInput = themeAnswer.trim();
    if (themeInput) {
      const themeIndex = parseInt(themeInput) - 1;
      if (Number.isInteger(themeIndex) && themeIndex >= 0 && themeIndex < THEMES.length) {
        theme = THEMES[themeIndex];
      } else if (THEMES.includes(themeInput)) {
        theme = themeInput;
      }
    }

    // Prompt for theme selector
    const selectorAnswer = await rl.question(`\n  Include theme selector? (y/N): `);
    includeThemeSelector = selectorAnswer.trim().toLowerCase() === 'y';

    rl.close();
    console.log('');
  }

  // Find templates directory based on mode
  const templateName = projectMode === 'spa' ? 'kickstart-spa' : 'kickstart';
  const templatesDir = join(__dirname, '..', 'templates', templateName);
  const distDir = join(__dirname, '..', 'public', 'dist');

  if (!existsSync(templatesDir)) {
    console.error(`\n  ✗ Error: Templates directory not found at ${templatesDir}`);
    process.exit(1);
  }

  // Create project structure
  console.log(`  Creating project structure...\n`);

  const currentYear = new Date().getFullYear();
  const vars = {
    '{{projectName}}': projectName,
    '{{year}}': currentYear.toString(),
    '{{theme}}': theme,
    '{{includeThemeSelector}}': includeThemeSelector.toString()
  };

  // Copy all templates with variable substitution
  copyTemplatesRecursive(templatesDir, process.cwd(), vars);

  // Copy Domma dist files to frontend/dist/domma
  const frontendDistDir = join(process.cwd(), 'frontend', 'dist', 'domma');
  console.log(`\n  Copying Domma distribution files...\n`);

  if (!existsSync(frontendDistDir)) {
    mkdirSync(frontendDistDir, {recursive: true});
  }

  // Copy required dist files
  const distFiles = [
    'domma.min.js',
    'domma.css',
    'grid.css',
    'elements.css',
    'syntax.css',
    'domma-syntax.min.js'
  ];

  for (const file of distFiles) {
    const srcPath = join(distDir, file);
    const destPath = join(frontendDistDir, file);
    if (existsSync(srcPath)) {
      cpSync(srcPath, destPath);
      console.log(`  ✓ Copied ${file}`);
    }
  }

  // Copy themes folder
  const themesDir = join(distDir, 'themes');
  const destThemesDir = join(frontendDistDir, 'themes');
  if (existsSync(themesDir)) {
    cpSync(themesDir, destThemesDir, {recursive: true});
    console.log(`  ✓ Copied themes/`);
  }

  // Create or update package.json with scripts
  const packageJsonPath = join(process.cwd(), 'package.json');
  let packageJson;

  if (existsSync(packageJsonPath)) {
    // Update existing package.json
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    console.log(`\n  Updating package.json with serve scripts...`);
  } else {
    // Create new package.json
    packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `${projectName} - Powered by Domma`,
      main: 'index.js',
      type: 'module'
    };
    console.log(`\n  Creating package.json...`);
  }

  // Add/update scripts
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts.start = 'domma serve';
  packageJson.scripts.serve = 'domma serve';
  packageJson.scripts['serve:3096'] = 'domma serve --port 3096';

  // Ensure domma-js is in dependencies
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  if (!packageJson.dependencies['domma-js']) {
    packageJson.dependencies['domma-js'] = `^${VERSION}`;
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log(`  ✓ Added npm scripts: start, serve`);

  console.log(`\n  ✓ Done! Your ${projectMode.toUpperCase()} project "${projectName}" is ready.\n`);

  // Prompt to start development server
  const rl2 = readline.createInterface({input, output});
  const startServer = await rl2.question(`  Start development server now? (Y/n): `);
  rl2.close();

  if (startServer.toLowerCase() !== 'n' && startServer.toLowerCase() !== 'no') {
    console.log('');
    await handleServe();
  } else {
    console.log(`\n  Next steps:`);

    if (projectMode === 'spa') {
      console.log(`    1. Start server: npm start  (or: npm run serve)`);
      console.log(`    2. Edit domma.config.json to customise routes and navbar`);
      console.log(`    3. Add new views: npx domma add view <name>`);
      console.log(`    4. Edit views in frontend/js/views/`);
    } else {
      console.log(`    1. Start server: npm start  (or: npm run serve)`);
      console.log(`    2. Edit domma.config.json to customise`);
      console.log(`    3. Add new pages: npx domma add page <name>`);
    }

    console.log(`    ${projectMode === 'spa' ? '5' : '4'}. Read the docs: https://github.com/dcbw-it/domma\n`);
  }
}

/**
 * Handle 'add' sub-commands
 */
async function handleAdd() {
  const subCommand = args[1];

  switch (subCommand) {
    case 'page':
      await handleAddPage();
      break;
    case 'view':
      await handleAddView();
      break;
    default:
      console.error(`Unknown add command: ${subCommand}`);
      console.log('Usage:');
      console.log('  npx domma-js add page <path>  # For Multi-Page Applications');
      console.log('  npx domma-js add view <name>  # For Single Page Applications');
      process.exit(1);
  }
}

/**
 * Handle adding a new page
 */
async function handleAddPage() {
  const quickMode = args.includes('--quick');
  let pagePath = args[2];

  // Check if we're in a Domma project
  const configPath = join(process.cwd(), 'domma.config.json');
  if (!existsSync(configPath)) {
    console.error('\n  ✗ Error: Not in a Domma project directory');
    console.error('  Run this command from your project root (where domma.config.json is located)\n');
    process.exit(1);
  }

  if (!pagePath && quickMode) {
    console.error('Page path required with --quick flag');
    console.log('Usage: npx domma-js add page <path> --quick');
    console.log('Example: npx domma-js add page frontend/pages/dashboard --quick');
    process.exit(1);
  }

  if (!quickMode) {
    const rl = readline.createInterface({input, output});

    if (!pagePath) {
      const pathAnswer = await rl.question('  Page path (e.g., frontend/pages/dashboard): ');
      pagePath = pathAnswer.trim();
    }

    if (!pagePath) {
      console.error('  ✗ Page path is required');
      rl.close();
      process.exit(1);
    }

    rl.close();
  }

  // Parse the path to extract directory and page name
  const pathParts = pagePath.split('/').filter(p => p.length > 0);
  const pageName = pathParts[pathParts.length - 1].toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const pageDir = pathParts.slice(0, -1).join('/');

  // Create page
  createPage(pageDir, pageName);
}

/**
 * Handle adding a new view (SPA only)
 */
async function handleAddView() {
  const quickMode = args.includes('--quick');
  let viewName = args[2];

  // Check if we're in a Domma project
  const configPath = join(process.cwd(), 'domma.config.json');
  if (!existsSync(configPath)) {
    console.error('\n  ✗ Error: Not in a Domma project directory');
    console.error('  Run this command from your project root (where domma.config.json is located)\n');
    process.exit(1);
  }

  // Check if it's an SPA project
  let config;
  try {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (e) {
    console.error('\n  ✗ Error: Could not read domma.config.json');
    process.exit(1);
  }

  if (!config.spa || !config.spa.enabled) {
    console.error('\n  ✗ Error: This command is only for Single Page Applications');
    console.error('  For Multi-Page Applications, use: npx domma-js add page <path>\n');
    process.exit(1);
  }

  if (!viewName && quickMode) {
    console.error('View name required with --quick flag');
    console.log('Usage: npx domma-js add view <name> --quick');
    console.log('Example: npx domma-js add view settings --quick');
    process.exit(1);
  }

  if (!quickMode) {
    const rl = readline.createInterface({input, output});

    if (!viewName) {
      const nameAnswer = await rl.question('  View name (e.g., settings, profile, dashboard): ');
      viewName = nameAnswer.trim();
    }

    if (!viewName) {
      console.error('  ✗ View name is required');
      rl.close();
      process.exit(1);
    }

    rl.close();
  }

  // Sanitize view name
  viewName = viewName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  // Check if view already exists
  const viewPath = join(process.cwd(), 'frontend', 'js', 'views', `${viewName}.js`);
  if (existsSync(viewPath)) {
    console.error(`\n  ✗ View "${viewName}" already exists`);
    process.exit(1);
  }

  // Read view template
  const viewTemplateDir = join(__dirname, '..', 'templates', 'view-template');
  const viewTemplatePath = join(viewTemplateDir, 'view.js');

  if (!existsSync(viewTemplatePath)) {
    console.error(`\n  ✗ Error: View template not found at ${viewTemplatePath}`);
    process.exit(1);
  }

  let viewTemplate = readFileSync(viewTemplatePath, 'utf-8');

  // Create title case name
  const titleCase = viewName.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');

  // Variable substitution
  const vars = {
    '{{viewName}}': viewName,
    '{{viewTitle}}': titleCase
  };

  for (const [key, value] of Object.entries(vars)) {
    viewTemplate = viewTemplate.replaceAll(key, value);
  }

  // Write view file
  writeFileSync(viewPath, viewTemplate, 'utf-8');
  console.log(`\n  ✓ Created view: frontend/js/views/${viewName}.js`);

  // Update views/index.js
  const viewsIndexPath = join(process.cwd(), 'frontend', 'js', 'views', 'index.js');
  if (existsSync(viewsIndexPath)) {
    let viewsIndex = readFileSync(viewsIndexPath, 'utf-8');

    // Add import
    const importStatement = `import {${viewName}View} from './${viewName}.js';\n`;
    viewsIndex = viewsIndex.replace(/(import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];\n)+/, `$&${importStatement}`);

    // Add to exports
    const exportPattern = /export const views = \{([^}]*)\};/s;
    const match = viewsIndex.match(exportPattern);
    if (match) {
      const currentExports = match[1].trim();
      const newExport = currentExports.endsWith(',')
        ? `\n    ${viewName}: ${viewName}View`
        : `,\n    ${viewName}: ${viewName}View`;
      viewsIndex = viewsIndex.replace(exportPattern, `export const views = {${currentExports}${newExport}\n};`);
    }

    writeFileSync(viewsIndexPath, viewsIndex, 'utf-8');
    console.log(`  ✓ Updated views/index.js`);
  }

  // Update domma.config.json - add route
  const routePath = `/${viewName}`;
  const newRoute = {
    path: routePath,
    view: viewName,
    title: `${config.project?.name || 'App'} - ${titleCase}`
  };

  if (!config.routes) {
    config.routes = [];
  }

  config.routes.push(newRoute);
  console.log(`  ✓ Added route: ${routePath}`);

  // Update navbar items
  if (config.navbar && config.navbar.items) {
    const newNavItem = {
      text: titleCase,
      url: `#${routePath}`
    };
    config.navbar.items.push(newNavItem);
    console.log(`  ✓ Added navbar item: ${titleCase}`);
  }

  // Write updated config
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`  ✓ Updated domma.config.json\n`);

  console.log(`  View "${titleCase}" is ready!`);
  console.log(`  Navigate to it at: #${routePath}\n`);
}

/**
 * Create a new page from template
 */
function createPage(pageDir, pageName) {
  // Build full path
  const fullPath = pageDir ? join(process.cwd(), pageDir, pageName) : join(process.cwd(), pageName);

  if (existsSync(fullPath)) {
    console.error(`\n  ✗ Page "${pageName}" already exists at this location`);
    process.exit(1);
  }

  // Create directory
  mkdirSync(fullPath, {recursive: true});

  // Calculate depth for relative paths
  // Count how many folders deep we are from project root
  const pathSegments = pageDir ? pageDir.split('/').filter(p => p.length > 0) : [];
  const depth = pathSegments.length + 1; // +1 for the page folder itself
  const parentPath = '../'.repeat(depth);

  // Get templates
  const pageTemplateDir = join(__dirname, '..', 'templates', 'page-template');

  if (!existsSync(pageTemplateDir)) {
    console.error(`\n  ✗ Error: Page template not found at ${pageTemplateDir}`);
    process.exit(1);
  }

  // Read templates
  let htmlTemplate = readFileSync(join(pageTemplateDir, 'page.html'), 'utf-8');
  const jsTemplate = readFileSync(join(pageTemplateDir, 'page.js'), 'utf-8');

  // Get project config for theme
  let theme = 'charcoal-dark';
  const configPath = join(process.cwd(), 'domma.config.json');
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      theme = config.theme?.default || theme;
    } catch (e) {
      // Use default theme
    }
  }

  // Adjust paths in template based on depth
  // Template has ../../ by default (depth 2)
  // We need to replace with the correct depth
  htmlTemplate = htmlTemplate.replaceAll('../../dist/domma/', `${parentPath}dist/domma/`);
  htmlTemplate = htmlTemplate.replaceAll('../../css/', `${parentPath}css/`);
  htmlTemplate = htmlTemplate.replaceAll('../../js/', `${parentPath}js/`);

  // Variable substitution
  const titleCase = pageName.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');

  const vars = {
    '{{pageName}}': pageName,
    '{{pageTitle}}': titleCase,
    '{{theme}}': theme
  };

  let html = htmlTemplate;
  let js = jsTemplate;

  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(key, value);
    js = js.replaceAll(key, value);
  }

  // Write files
  writeFileSync(join(fullPath, 'index.html'), html);
  writeFileSync(join(fullPath, `${pageName}.js`), js);

  const displayPath = pageDir ? `${pageDir}/${pageName}` : pageName;
  console.log(`\n  ✓ Page created: ${displayPath}/`);
  console.log(`    - index.html`);
  console.log(`    - ${pageName}.js`);
  console.log(`    Depth: ${depth} (using ${parentPath})\n`);
  console.log(`  Don't forget to add it to your navbar in domma.config.json!\n`);
}

/**
 * Copy templates recursively with variable substitution
 */
function copyTemplatesRecursive(srcDir, destDir, vars) {
  const items = readdirSync(srcDir);

  for (const item of items) {
    const srcPath = join(srcDir, item);
    const destPath = join(destDir, item);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      // Create directory if it doesn't exist
      if (!existsSync(destPath)) {
        mkdirSync(destPath, {recursive: true});
      }
      copyTemplatesRecursive(srcPath, destPath, vars);
    } else {
      // Copy file with variable substitution
      let content = readFileSync(srcPath, 'utf-8');

      // Replace all variables
      for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(key, value);
      }

      writeFileSync(destPath, content, 'utf-8');
      const relPath = relative(process.cwd(), destPath);
      console.log(`  ✓ Created ${relPath}`);
    }
  }
}

/**
 * Handle serve command
 */
async function handleServe() {
  // Check for domma.config.json at root (MPA) or in frontend/ (SPA)
  let configPath = join(process.cwd(), 'domma.config.json');

  if (!existsSync(configPath)) {
    configPath = join(process.cwd(), 'frontend', 'domma.config.json');
  }

  if (!existsSync(configPath)) {
    console.error('\n  ✗ Not in a Domma project directory');
    console.error('  Run "npx domma init" first to create a project.\n');
    process.exit(1);
  }

  // Check if live-server is available
  let liveServer;
  try {
    liveServer = await import('live-server');
  } catch (e) {
    console.log('\n  live-server is not installed.');
    const rl = readline.createInterface({input, output});
    const answer = await rl.question('  Install it now? (Y/n): ');
    rl.close();

    if (answer.toLowerCase() === 'n') {
      console.log('\n  To install manually: npm install live-server');
      console.log('  Then run: npx domma serve\n');
      process.exit(0);
    }

    console.log('\n  Installing live-server...');
    // Use spawnSync with explicit arguments array (safe)
    const result = spawnSync('npm', ['install', 'live-server'], {
      stdio: 'inherit',
      shell: true  // Needed for Windows compatibility
    });

    if (result.status !== 0) {
      console.error('  ✗ Failed to install live-server');
      console.error('  Try: npm install live-server\n');
      process.exit(1);
    }

    // Try importing again after installation
    try {
      liveServer = await import('live-server');
    } catch (importError) {
      console.error('  ✗ Failed to load live-server after installation');
      console.error('  Please try again or install manually\n');
      process.exit(1);
    }
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const isSpa = config.spa?.enabled === true;
  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 ? parseInt(args[portIndex + 1]) : 3096;

  console.log(`
╔═══════════════════════════════════════╗
║      Domma Development Server         ║
╚═══════════════════════════════════════╝
`);
  console.log(`  Project type: ${isSpa ? 'SPA' : 'MPA'}`);
  console.log(`  Serving: frontend/`);
  console.log(`  URL: http://localhost:${port}${isSpa ? '' : '/pages/'}\n`);

  liveServer.default.start({
    port,
    root: 'frontend',
    file: isSpa ? 'index.html' : 'pages/index.html',
    open: true,
    logLevel: 1
  });
}

/**
 * Show version information
 */
function showVersion() {
  console.log(`domma-js v${VERSION}`);
}

/**
 * Show help information
 */
/**
 * Handle AI assistance setup
 */
async function handleSetupAI() {
  const templatesDir = join(__dirname, '..', 'templates', 'kickstart');
  const projectRoot = process.cwd();

  console.log(`
╔═══════════════════════════════════════╗
║   Domma AI Assistance Setup           ║
╚═══════════════════════════════════════╝

This will copy AI assistance files to your project:
  • CLAUDE.md - Framework reference guide
  • .claude/ - Settings & code snippets
  • blueprints/ - Reusable schemas (8 files)
  • types/ - TypeScript definitions
`);

  const rl = readline.createInterface({input, output});
  const answer = await rl.question('Continue? (Y/n): ');
  rl.close();

  if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
    console.log('\nSetup cancelled.');
    return;
  }

  console.log('\nCopying files...\n');

  try {
    let copied = 0;

    // Copy CLAUDE.md
    const claudeMd = join(templatesDir, 'CLAUDE.md');
    const destClaudeMd = join(projectRoot, 'CLAUDE.md');
    if (existsSync(claudeMd) && !existsSync(destClaudeMd)) {
      cpSync(claudeMd, destClaudeMd);
      console.log('  ✓ Created CLAUDE.md');
      copied++;
    } else if (existsSync(destClaudeMd)) {
      console.log('  ⊘ CLAUDE.md already exists');
    }

    // Copy .claude/ directory
    const claudeDir = join(templatesDir, '.claude');
    const destClaudeDir = join(projectRoot, '.claude');
    if (existsSync(claudeDir) && !existsSync(destClaudeDir)) {
      cpSync(claudeDir, destClaudeDir, { recursive: true });
      console.log('  ✓ Created .claude/ directory');
      copied++;
    } else if (existsSync(destClaudeDir)) {
      console.log('  ⊘ .claude/ already exists');
    }

    // Copy blueprints/ directory
    const blueprintsDir = join(templatesDir, 'blueprints');
    const destBlueprintsDir = join(projectRoot, 'blueprints');
    if (existsSync(blueprintsDir) && !existsSync(destBlueprintsDir)) {
      cpSync(blueprintsDir, destBlueprintsDir, { recursive: true });
      console.log('  ✓ Created blueprints/ directory');
      copied++;
    } else if (existsSync(destBlueprintsDir)) {
      console.log('  ⊘ blueprints/ already exists');
    }

    // Copy types/ directory
    const typesDir = join(templatesDir, 'frontend', 'types');
    const destTypesDir = join(projectRoot, 'types');
    if (existsSync(typesDir) && !existsSync(destTypesDir)) {
      cpSync(typesDir, destTypesDir, { recursive: true });
      console.log('  ✓ Created types/ directory');
      copied++;
    } else if (existsSync(destTypesDir)) {
      console.log('  ⊘ types/ already exists');
    }

    if (copied > 0) {
      console.log(`\n✓ Successfully added ${copied} AI assistance ${copied === 1 ? 'file' : 'files'}!`);
      console.log('Claude Code will now have full context for your Domma project.\n');
    } else {
      console.log('\nAll AI assistance files already exist. Nothing to copy.\n');
    }

  } catch (error) {
    console.error('\n✗ Error copying AI assistance files:', error.message);
    console.error('You can manually copy them from node_modules/domma-js/templates/kickstart/\n');
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Domma CLI v${VERSION} - Project scaffolding and management

Commands:
  npx domma-js              Initialize a new Domma project (interactive)
  npx domma-js init         Initialize a new Domma project
    --spa                   Create Single Page Application
    --mpa                   Create Multi-Page Application (default)
    --quick                 Skip interactive prompts

  npx domma-js add page <path>  Add a new page (MPA only)
  npx domma-js add view <name>  Add a new view (SPA only)
  npx domma-js setup-ai         Add AI assistance files to existing project
  npx domma-js serve            Start development server with live reload
    --port <number>             Custom port (default: 3096)

Options:
  --help, -h               Show this help message
  --version, -v            Show version number

Examples:
  # Initialize projects:
  npx domma-js                     # Interactive setup (choose MPA or SPA)
  npx domma-js --spa               # Create SPA with prompts
  npx domma-js --mpa --quick       # Create MPA with defaults
  npx domma-js setup-ai            # Add AI assistance to existing project

  # Add pages (MPA only):
  npx domma-js add page admin                      # Root level (admin/)
  npx domma-js add page pages/dashboard            # One level deep (pages/dashboard/)
  npx domma-js add page frontend/pages/profile     # Two levels deep (frontend/pages/profile/)

  # Add views (SPA only):
  npx domma-js add view settings   # Creates settings view with route
  npx domma-js add view profile    # Creates profile view with route

  # Development server:
  npm start                        # Start server (uses scripts from package.json)
  npm run serve                    # Same as npm start
  npm run serve:3096               # Start on port 3096 (explicit)
  npx domma-js serve               # Direct CLI usage
  npx domma-js serve --port 3096   # Custom port

Note: After 'npx domma init', use 'npm start' to run the server.
      Paths are automatically calculated based on folder depth.
`);
}
