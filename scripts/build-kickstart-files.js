#!/usr/bin/env node
/**
 * Build script: prepare Kickstart template files for browser access.
 *
 * Copies template files to public/download/kickstart-files/ and generates
 * kickstart-manifest.json describing every file with its category, group,
 * and whether it's required.
 *
 * Run via: node scripts/build-kickstart-files.js
 * Or as part of: npm run build
 */

import { existsSync, mkdirSync, cpSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');

const SRC_MPA  = join(root, 'templates', 'kickstart');
const SRC_SPA  = join(root, 'templates', 'kickstart-spa');
const SRC_DIST = join(root, 'public', 'dist');
const OUT_BASE = join(root, 'public', 'download', 'kickstart-files');

const MANIFEST_PATH = join(root, 'public', 'download', 'kickstart-manifest.json');

// Dist files to bundle with each kickstart project
const DIST_FILES = [
  'domma.min.js',
  'domma.css',
  'grid.css',
  'elements.css',
  'syntax.css',
  'domma-syntax.min.js',
];

// ─── Category / group detection ────────────────────────────────────────────

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Classify an MPA template file into category/group/required.
 * @param {string} relPath  Path relative to templates/kickstart/
 */
function classifyMpa(relPath) {
  // AI / blueprint files
  if (
    relPath === 'CLAUDE.md' ||
    relPath.startsWith('.claude/') ||
    relPath.startsWith('blueprints/')
  ) {
    return { category: 'ai', required: false, group: 'ai' };
  }

  // Project config
  if (relPath === 'domma.config.json') {
    return { category: 'config', required: true, group: 'core' };
  }

  // Pages - extract the page directory name
  const pageMatch = relPath.match(/^frontend\/pages\/([a-z0-9-]+)\//);
  if (pageMatch) {
    const page = pageMatch[1];
    const required = false; // home handled below via index files
    return { category: 'page', required, group: page, label: capitalize(page) };
  }

  // Home page (index files sit directly under pages/)
  if (relPath.startsWith('frontend/pages/index.')) {
    return { category: 'page', required: true, group: 'home', label: 'Home' };
  }

  return { category: 'core', required: true, group: 'core' };
}

/**
 * Classify an SPA template file into category/group/required.
 * @param {string} relPath  Path relative to templates/kickstart-spa/
 */
function classifySpa(relPath) {
  // AI / blueprint files
  if (
    relPath === 'CLAUDE.md' ||
    relPath.startsWith('.claude/') ||
    relPath.startsWith('blueprints/')
  ) {
    return { category: 'ai', required: false, group: 'ai' };
  }

  // Project config
  if (relPath === 'frontend/domma.config.json') {
    return { category: 'config', required: true, group: 'core' };
  }

  // Views - match both the .js file and its template HTML
  const viewMatch = relPath.match(/^frontend\/js\/views\/(?:templates\/)?([a-z0-9-]+)\./);
  if (viewMatch && relPath !== 'frontend/js/views/index.js') {
    const view = viewMatch[1];
    const required = view === 'home' || view === '404';
    const label = view === '404' ? '404 Page' : capitalize(view);
    return { category: 'view', required, group: view, label };
  }

  return { category: 'core', required: true, group: 'core' };
}

// ─── File walking ───────────────────────────────────────────────────────────

function walkDir(dir, base = dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const relPath  = relative(base, fullPath).replace(/\\/g, '/');
    if (statSync(fullPath).isDirectory()) {
      entries.push(...walkDir(fullPath, base));
    } else {
      entries.push({ fullPath, relPath });
    }
  }
  return entries;
}

// ─── Copy + manifest builder ────────────────────────────────────────────────

function processTemplates(srcDir, outDir, mode, classifyFn) {
  mkdirSync(outDir, { recursive: true });
  const files    = walkDir(srcDir);
  const manifest = [];

  for (const { fullPath, relPath } of files) {
    const destPath = join(outDir, relPath);
    mkdirSync(dirname(destPath), { recursive: true });
    cpSync(fullPath, destPath);

    const info = classifyFn(relPath);
    const entry = {
      source:   `kickstart-files/${mode}/${relPath}`,
      path:     relPath,
      category: info.category,
      required: info.required,
      group:    info.group,
      mode,
    };
    if (info.label) entry.label = info.label;
    manifest.push(entry);
  }

  return manifest;
}

function copyDist(outDir) {
  mkdirSync(outDir, { recursive: true });
  const entries = [];

  for (const file of DIST_FILES) {
    const src = join(SRC_DIST, file);
    if (!existsSync(src)) {
      console.warn(`  ⚠ Dist file not found: ${file}`);
      continue;
    }
    cpSync(src, join(outDir, file));
    entries.push({
      source:   `kickstart-files/dist/${file}`,
      path:     `frontend/dist/domma/${file}`,
      category: 'dist',
      required: true,
      group:    'dist',
      mode:     'both',
    });
  }

  // Themes directory
  const themesDir = join(SRC_DIST, 'themes');
  if (existsSync(themesDir)) {
    const destThemes = join(outDir, 'themes');
    cpSync(themesDir, destThemes, { recursive: true });
    for (const name of readdirSync(themesDir)) {
      entries.push({
        source:   `kickstart-files/dist/themes/${name}`,
        path:     `frontend/dist/domma/themes/${name}`,
        category: 'dist',
        required: true,
        group:    'dist',
        mode:     'both',
      });
    }
  }

  return entries;
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log('\nBuilding kickstart files for browser...\n');

if (!existsSync(SRC_MPA)) {
  console.error(`✗ MPA template directory not found: ${SRC_MPA}`);
  process.exit(1);
}
if (!existsSync(SRC_SPA)) {
  console.error(`✗ SPA template directory not found: ${SRC_SPA}`);
  process.exit(1);
}

const mpaFiles  = processTemplates(SRC_MPA, join(OUT_BASE, 'mpa'), 'mpa', classifyMpa);
const spaFiles  = processTemplates(SRC_SPA, join(OUT_BASE, 'spa'), 'spa', classifySpa);
const distFiles = copyDist(join(OUT_BASE, 'dist'));

console.log(`  ✓ MPA template files: ${mpaFiles.length}`);
console.log(`  ✓ SPA template files: ${spaFiles.length}`);
console.log(`  ✓ Dist files:         ${distFiles.length}`);

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));

const manifest = {
  version:   pkg.version,
  generated: new Date().toISOString(),
  spa:       spaFiles,
  mpa:       mpaFiles,
  dist:      distFiles,
};

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log('  ✓ kickstart-manifest.json written\n');
console.log('Done.\n');
