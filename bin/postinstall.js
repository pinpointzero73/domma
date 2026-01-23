#!/usr/bin/env node

/**
 * Domma Postinstall Script
 * Offers to copy AI assistance files to the project root
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m'
};

/**
 * Check if we're in a valid installation context
 * - Should be installed as dependency (in node_modules)
 * - Should not be in development mode (inside domma repo itself)
 */
function shouldRunPostinstall() {
  const cwd = process.cwd();

  // Don't run during development in domma repo
  if (existsSync(join(cwd, 'templates', 'kickstart'))) {
    return false;
  }

  // Don't run in CI environments
  if (process.env.CI || process.env.CONTINUOUS_INTEGRATION) {
    return false;
  }

  // Check if we're in node_modules (normal install)
  const isInNodeModules = cwd.includes('node_modules');

  return isInNodeModules;
}

/**
 * Find project root (directory with package.json, above node_modules)
 */
function findProjectRoot() {
  let currentDir = process.cwd();

  // Navigate up to find the project root (outside node_modules)
  while (currentDir.includes('node_modules')) {
    currentDir = dirname(currentDir);
  }

  // Go up one more level to get to the actual project root
  const projectRoot = dirname(currentDir);

  // Verify it has package.json
  if (existsSync(join(projectRoot, 'package.json'))) {
    return projectRoot;
  }

  return null;
}

/**
 * Get path to kickstart template in installed package
 */
function getTemplatePath() {
  // When installed via npm, templates are in node_modules/domma-js/templates/
  const cwd = process.cwd();
  return join(cwd, 'templates', 'kickstart');
}

/**
 * Copy file recursively
 */
function copyRecursive(src, dest) {
  const stat = statSync(src);

  if (stat.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    const items = readdirSync(src);
    for (const item of items) {
      copyRecursive(join(src, item), join(dest, item));
    }
  } else {
    copyFileSync(src, dest);
  }
}

/**
 * Prompt user for input
 */
function prompt(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Main postinstall function
 */
async function main() {
  // Check if we should run
  if (!shouldRunPostinstall()) {
    return;
  }

  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    return;
  }

  const templatePath = getTemplatePath();
  if (!existsSync(templatePath)) {
    return;
  }

  console.log(`\n${colors.cyan}${colors.bright}╭───────────────────────────────────────────╮${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}│${colors.reset}  ${colors.bright}Domma AI Assistance Available${colors.reset}         ${colors.cyan}${colors.bright}│${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╰───────────────────────────────────────────╯${colors.reset}\n`);

  console.log(`${colors.gray}Domma includes AI assistance files for Claude Code:${colors.reset}`);
  console.log(`${colors.gray}  • CLAUDE.md - Framework reference guide${colors.reset}`);
  console.log(`${colors.gray}  • .claude/ - Settings & code snippets${colors.reset}`);
  console.log(`${colors.gray}  • blueprints/ - Reusable schemas (8 files)${colors.reset}`);
  console.log(`${colors.gray}  • types/ - TypeScript definitions${colors.reset}\n`);

  const answer = await prompt(`${colors.bright}Copy AI assistance files to your project? (Y/n): ${colors.reset}`);

  if (answer === 'n' || answer === 'no') {
    console.log(`${colors.gray}Skipped. Run ${colors.bright}npx domma setup-ai${colors.gray} later to add these files.${colors.reset}\n`);
    return;
  }

  console.log(`\n${colors.cyan}Copying AI assistance files...${colors.reset}\n`);

  try {
    let copied = 0;

    // Copy CLAUDE.md
    const claudeMd = join(templatePath, 'CLAUDE.md');
    const destClaudeMd = join(projectRoot, 'CLAUDE.md');
    if (existsSync(claudeMd) && !existsSync(destClaudeMd)) {
      copyFileSync(claudeMd, destClaudeMd);
      console.log(`  ${colors.green}✓${colors.reset} Created CLAUDE.md`);
      copied++;
    }

    // Copy .claude/ directory
    const claudeDir = join(templatePath, '.claude');
    const destClaudeDir = join(projectRoot, '.claude');
    if (existsSync(claudeDir) && !existsSync(destClaudeDir)) {
      copyRecursive(claudeDir, destClaudeDir);
      console.log(`  ${colors.green}✓${colors.reset} Created .claude/ directory`);
      copied++;
    }

    // Copy blueprints/ directory
    const blueprintsDir = join(templatePath, 'blueprints');
    const destBlueprintsDir = join(projectRoot, 'blueprints');
    if (existsSync(blueprintsDir) && !existsSync(destBlueprintsDir)) {
      copyRecursive(blueprintsDir, destBlueprintsDir);
      console.log(`  ${colors.green}✓${colors.reset} Created blueprints/ directory`);
      copied++;
    }

    // Copy types/ directory
    const typesDir = join(templatePath, 'frontend', 'types');
    const destTypesDir = join(projectRoot, 'types');
    if (existsSync(typesDir) && !existsSync(destTypesDir)) {
      copyRecursive(typesDir, destTypesDir);
      console.log(`  ${colors.green}✓${colors.reset} Created types/ directory`);
      copied++;
    }

    if (copied > 0) {
      console.log(`\n${colors.green}${colors.bright}✓ Successfully added AI assistance files!${colors.reset}`);
      console.log(`${colors.gray}Claude Code will now have full context for your Domma project.${colors.reset}\n`);
    } else {
      console.log(`\n${colors.yellow}AI assistance files already exist. Skipped copying.${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`\n${colors.yellow}Warning: Could not copy AI assistance files${colors.reset}`);
    console.error(`${colors.gray}You can manually copy them from node_modules/domma-js/templates/kickstart/${colors.reset}\n`);
  }
}

// Run postinstall
main().catch(() => {
  // Silent failure - don't break installation
  process.exit(0);
});
