#!/usr/bin/env node

import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'fs';
import {dirname, join, relative} from 'path';
import {fileURLToPath} from 'url';
import * as readline from 'readline/promises';
import {stdin as input, stdout as output} from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const THEMES = [
  'charcoal-dark',
  'ocean-dark',
  'forest-dark',
  'sunset-light',
  'silver-light',
  'ocean-light',
  'forest-light',
  'sunset-dark',
  'royal-dark',
  'lemon-light'
];

// Parse command-line arguments
const args = process.argv.slice(2);
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

async function main() {
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

  console.log(`\n  ✓ Done! Your project "${projectName}" is ready.\n`);
  console.log(`  Next steps:`);
  console.log(`    1. Open index.html in your browser`);
  console.log(`    2. Edit domma.config.json to customise`);
  console.log(`    3. Read the docs: https://github.com/dcbw-it/domma\n`);
}

/**
 * Recursively copy templates with variable substitution
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

main().catch((error) => {
  console.error(`\n  ✗ Error: ${error.message}`);
  process.exit(1);
});
