#!/usr/bin/env node

/**
 * Build miniapps with environment-based configuration
 *
 * Usage:
 *   node scripts/build-miniapp.js              # All miniapps
 *   node scripts/build-miniapp.js garage       # Specific miniapp
 *   NODE_ENV=production node scripts/build-miniapp.js
 */

import {rollup} from 'rollup';
import {createMiniAppConfig} from '../rollup.miniapps.config.js';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colours = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

const miniAppsDir = path.join(__dirname, '../public/miniapps');

/**
 * Get list of available miniapps
 * @returns {string[]} Array of miniapp names
 */
function getAvailableMiniApps() {
  const entries = fs.readdirSync(miniAppsDir, {withFileTypes: true});
  return entries
    .filter(entry => entry.isDirectory() && entry.name !== 'shared')
    .map(entry => entry.name);
}

/**
 * Check if miniapp has source files
 * @param {string} miniAppName - Name of the miniapp
 * @returns {boolean} True if src directory exists
 */
function hasSourceFiles(miniAppName) {
  const srcDir = path.join(miniAppsDir, miniAppName, 'src');
  return fs.existsSync(srcDir);
}

/**
 * Build a single miniapp
 * @param {string} name - Name of the miniapp
 * @returns {Promise<boolean>} True if successful
 */
async function buildMiniApp(name) {
  console.log(`${colours.blue}→ Building ${name}...${colours.reset}`);

  const srcFile = path.join(miniAppsDir, name, 'src/app.js');
  if (!fs.existsSync(srcFile)) {
    console.log(`  ${colours.yellow}⚠ No source file: ${srcFile}${colours.reset}`);
    return false;
  }

  try {
    const config = createMiniAppConfig(name);
    const bundle = await rollup(config);
    await bundle.write(config.output);
    await bundle.close();

    console.log(`  ${colours.green}✓ Built successfully${colours.reset}`);
    return true;
  } catch (error) {
    console.error(`  ${colours.red}✗ Build failed: ${error.message}${colours.reset}`);
    if (error.stack) {
      console.error(`  ${colours.red}${error.stack}${colours.reset}`);
    }
    return false;
  }
}

/**
 * Main build orchestrator
 */
async function main() {
  const targetApp = process.argv[2];
  const NODE_ENV = process.env.NODE_ENV || 'development';

  console.log(`${colours.blue}🔨 Building MiniApps (${NODE_ENV})${colours.reset}\n`);

  let appsToBuild = [];

  if (targetApp) {
    // Build specific app
    const available = getAvailableMiniApps();
    if (!available.includes(targetApp)) {
      console.error(`${colours.red}✗ MiniApp not found: ${targetApp}${colours.reset}`);
      console.log(`\nAvailable miniapps: ${available.join(', ')}`);
      process.exit(1);
    }
    appsToBuild = [targetApp];
  } else {
    // Build all apps with source files
    appsToBuild = getAvailableMiniApps().filter(hasSourceFiles);
  }

  if (appsToBuild.length === 0) {
    console.log(`${colours.yellow}⚠ No miniapps with source files found${colours.reset}`);
    process.exit(0);
  }

  let successCount = 0;
  let failCount = 0;

  for (const app of appsToBuild) {
    const success = await buildMiniApp(app);
    if (success) successCount++;
    else failCount++;
  }

  console.log(`\n${colours.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colours.reset}`);
  if (failCount === 0) {
    console.log(`${colours.green}✓ Successfully built ${successCount} miniapp(s)${colours.reset}`);
  } else {
    console.log(`${colours.yellow}⚠ Built ${successCount}, failed ${failCount}${colours.reset}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colours.red}Fatal error: ${error.message}${colours.reset}`);
  process.exit(1);
});
