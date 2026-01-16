#!/usr/bin/env node

import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, cpSync} from 'fs';
import {dirname, join, relative} from 'path';
import {fileURLToPath} from 'url';
import * as readline from 'readline/promises';
import {stdin as input, stdout as output} from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const THEMES = [
  'charcoal-dark', 'ocean-dark', 'forest-dark', 'sunset-light',
  'silver-light', 'ocean-light', 'forest-light', 'sunset-dark',
  'royal-dark', 'lemon-light'
];

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];

// Command routing
// Check if first arg is a flag (starts with --)
if (command && command.startsWith('--')) {
  // Treat flags as init command
  handleInit();
} else {
  switch (command) {
    case 'init':
    case undefined:
      handleInit();
      break;
    case 'add':
      handleAdd();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
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

  // ASCII Art Banner
  console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║       Welcome to Domma CLI!           ║
║                                       ║
╚═══════════════════════════════════════╝

  Let's set up your project.
`);

  let projectName = 'my-app';
  let theme = 'charcoal-dark';
  let includeThemeSelector = false;

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

  // Find templates directory
  const templatesDir = join(__dirname, '..', 'templates', 'kickstart');
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

  console.log(`\n  ✓ Done! Your project "${projectName}" is ready.\n`);
  console.log(`  Next steps:`);
  console.log(`    1. Open frontend/pages/index.html in your browser`);
  console.log(`    2. Edit domma.config.json to customise`);
  console.log(`    3. Add new pages: npx domma-js add page <name>`);
  console.log(`    4. Read the docs: https://github.com/dcbw-it/domma\n`);
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
    default:
      console.error(`Unknown add command: ${subCommand}`);
      console.log('Usage: npx domma-js add page <name>');
      process.exit(1);
  }
}

/**
 * Handle adding a new page
 */
async function handleAddPage() {
  const quickMode = args.includes('--quick');
  let pageName = args[2];

  // Check if we're in a Domma project
  const configPath = join(process.cwd(), 'domma.config.json');
  if (!existsSync(configPath)) {
    console.error('\n  ✗ Error: Not in a Domma project directory');
    console.error('  Run this command from your project root (where domma.config.json is located)\n');
    process.exit(1);
  }

  if (!pageName && quickMode) {
    console.error('Page name required with --quick flag');
    console.log('Usage: npx domma-js add page <name> --quick');
    process.exit(1);
  }

  if (!quickMode) {
    const rl = readline.createInterface({input, output});

    if (!pageName) {
      const nameAnswer = await rl.question('  Page name: ');
      pageName = nameAnswer.trim();
    }

    if (!pageName) {
      console.error('  ✗ Page name is required');
      rl.close();
      process.exit(1);
    }

    rl.close();
  }

  // Validate and sanitize page name
  pageName = pageName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  // Create page
  createPage(pageName);
}

/**
 * Create a new page from template
 */
function createPage(pageName) {
  const pagesDir = join(process.cwd(), 'pages', pageName);

  if (existsSync(pagesDir)) {
    console.error(`\n  ✗ Page "${pageName}" already exists`);
    process.exit(1);
  }

  // Create directory
  mkdirSync(pagesDir, {recursive: true});

  // Get templates
  const pageTemplateDir = join(__dirname, '..', 'templates', 'page-template');

  if (!existsSync(pageTemplateDir)) {
    console.error(`\n  ✗ Error: Page template not found at ${pageTemplateDir}`);
    process.exit(1);
  }

  // Read templates
  const htmlTemplate = readFileSync(join(pageTemplateDir, 'page.html'), 'utf-8');
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
  writeFileSync(join(pagesDir, 'index.html'), html);
  writeFileSync(join(pagesDir, `${pageName}.js`), js);

  console.log(`\n  ✓ Page created: pages/${pageName}/`);
  console.log(`    - index.html`);
  console.log(`    - ${pageName}.js\n`);
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
 * Show help information
 */
function showHelp() {
  console.log(`
Domma CLI - Project scaffolding and management

Commands:
  npx domma-js              Initialize a new Domma project
  npx domma-js init         Initialize a new Domma project
  npx domma-js add page <name>  Add a new page
    --quick                 Skip interactive prompts

Options:
  --help, -h               Show this help message

Examples:
  npx domma-js                     # Interactive project setup
  npx domma-js --quick             # Quick project setup with defaults
  npx domma-js add page dashboard  # Add a dashboard page (interactive)
  npx domma-js add page faq --quick  # Add FAQ page (non-interactive)
`);
}
