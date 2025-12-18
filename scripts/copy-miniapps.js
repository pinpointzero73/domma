#!/usr/bin/env node

/**
 * Copy Domma distribution files to miniApps vendor directories
 * This script runs as part of the main build process to ensure
 * miniApps always have the latest Domma files
 *
 * NOTE: MiniApps are now built first by build-miniapp.js, then this script
 * copies Domma framework files to their vendor directories
 */

import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colours for console output
const colours = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

console.log(`${colours.blue}📦 Building and deploying MiniApps...${colours.reset}\n`);

// Step 1: Build miniapps first
console.log(`${colours.blue}Step 1: Building miniapps...${colours.reset}`);
try {
  execSync('node scripts/build-miniapp.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log(`${colours.green}✓ MiniApps built${colours.reset}\n`);
} catch (error) {
  console.error(`${colours.red}✗ Build failed${colours.reset}`);
  process.exit(1);
}

// Step 2: Copy Domma files
console.log(`${colours.blue}Step 2: Copying Domma files...${colours.reset}\n`);

// Define source and destination paths
const distDir = path.join(__dirname, '../public/dist');
const miniAppsDir = path.join(__dirname, '../public/miniapps');

// MiniApps that need Domma files
const miniApps = ['garage'];

// Files to copy
const filesToCopy = [
  {src: 'domma.css', dest: 'domma.css'},
  {src: 'grid.css', dest: 'grid.css'},
  {src: 'elements.css', dest: 'elements.css'},
  {src: 'domma.min.js', dest: 'domma.min.js'},
  {src: 'themes/domma-themes.css', dest: 'themes/domma-themes.css'}
];

/**
 * Create directory recursively if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {recursive: true});
  }
}

/**
 * Copy a single file
 */
function copyFile(srcPath, destPath) {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    ensureDirectoryExists(destDir);

    // Copy file
    fs.copyFileSync(srcPath, destPath);
    return true;
  } catch (error) {
    console.error(`${colours.red}✗ Failed to copy ${srcPath}: ${error.message}${colours.reset}`);
    return false;
  }
}

/**
 * Copy files to a single miniApp
 */
function copyToMiniApp(miniAppName) {
  const vendorDir = path.join(miniAppsDir, miniAppName, 'vendor/domma');
  let copiedCount = 0;

  console.log(`${colours.blue}→ ${miniAppName}${colours.reset}`);

  for (const file of filesToCopy) {
    const srcPath = path.join(distDir, file.src);
    const destPath = path.join(vendorDir, file.dest);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ${colours.red}✗ Source not found: ${file.src}${colours.reset}`);
      continue;
    }

    if (copyFile(srcPath, destPath)) {
      console.log(`  ${colours.green}✓ ${file.dest}${colours.reset}`);
      copiedCount++;
    }
  }

  return copiedCount;
}

// Main execution
let totalCopied = 0;
let errors = 0;

for (const miniApp of miniApps) {
  const miniAppPath = path.join(miniAppsDir, miniApp);

  // Check if miniApp directory exists
  if (!fs.existsSync(miniAppPath)) {
    console.log(`${colours.red}✗ MiniApp directory not found: ${miniApp}${colours.reset}`);
    errors++;
    continue;
  }

  const copied = copyToMiniApp(miniApp);
  totalCopied += copied;
}

// Summary
console.log(`\n${colours.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colours.reset}`);
if (errors === 0 && totalCopied > 0) {
  console.log(`${colours.green}✓ Successfully copied ${totalCopied} files to ${miniApps.length} miniApp(s)${colours.reset}`);
} else if (errors > 0) {
  console.log(`${colours.red}✗ Completed with ${errors} error(s)${colours.reset}`);
  process.exit(1);
} else {
  console.log(`${colours.blue}ℹ No files copied${colours.reset}`);
}
