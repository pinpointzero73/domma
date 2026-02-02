#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const miniappsDir = path.join(__dirname, '../public/miniapps');
const debounceDelay = 300; // ms

const watchers = new Map();

// Get list of miniapp directories
const miniapps = fs.readdirSync(miniappsDir).filter(name => {
  const fullPath = path.join(miniappsDir, name);
  return fs.statSync(fullPath).isDirectory() &&
         fs.existsSync(path.join(fullPath, 'src')) &&
         name !== 'shared';
});

console.log(`\n🔍 Watching miniapps: ${miniapps.join(', ')}\n`);

miniapps.forEach(appName => {
  const srcDir = path.join(miniappsDir, appName, 'src');

  // Debounced rebuild function
  let rebuildTimeout;
  const rebuild = async (filename) => {
    clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(async () => {
      console.log(`\n📝 Change detected in ${appName}/${filename}`);
      console.log(`⚙️  Rebuilding ${appName}...`);

      try {
        const { stdout, stderr } = await execFileAsync('node', ['scripts/build-miniapp.js', appName]);
        if (stderr) {
          console.error(stderr);
        }
        console.log(stdout);
        console.log(`✓ ${appName} rebuilt at ${new Date().toLocaleTimeString()}\n`);
      } catch (error) {
        console.error(`❌ Build failed for ${appName}:`, error.message);
      }
    }, debounceDelay);
  };

  // Watch the src directory
  try {
    const watcher = fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.js')) {
        rebuild(filename);
      }
    });

    watchers.set(appName, watcher);
    console.log(`✓ Watching ${appName}/src/`);
  } catch (error) {
    console.error(`❌ Failed to watch ${appName}:`, error.message);
  }
});

console.log('\n👀 Watch mode active. Press Ctrl+C to stop.\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping watchers...');
  watchers.forEach((watcher, name) => {
    watcher.close();
    console.log(`✓ Stopped watching ${name}`);
  });
  console.log('\n👋 Watch mode stopped.\n');
  process.exit(0);
});
