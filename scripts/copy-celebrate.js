/**
 * Copy the built `domma-celebrate` package into `public/dist/celebrate/`.
 *
 * The seasonal celebrations used to live in this repository, at
 * `public/layouts/js/modules/celebrations/`. They are now their own package so
 * a site that has never heard of Domma can use them, and this repository is
 * simply one of its consumers.
 *
 * The whole `dist/` tree is copied rather than a single file because the
 * package is deliberately code-split: `domma-celebrate.esm.js` is the engine,
 * and each theme is a chunk under `chunks/` that the browser fetches only when
 * that celebration is actually in season. Copy the entry without the chunks and
 * every celebration 404s on the day it matters.
 */

import {cpSync, existsSync, readFileSync, rmSync} from 'fs';
import {createRequire} from 'module';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const require = createRequire(import.meta.url);

const destDir = join(rootDir, 'public/dist/celebrate');

/**
 * Resolve the package's own directory through Node rather than assuming
 * `node_modules/domma-celebrate`. It is installed here as a `file:` link while
 * it is unpublished, and will be a plain npm dependency later; `require.resolve`
 * gives the right answer either way.
 */
function resolvePackageDir() {
  try {
    return dirname(require.resolve('domma-celebrate/package.json'));
  } catch {
    return null;
  }
}

const packageDir = resolvePackageDir();

if (!packageDir) {
  console.error('✗ domma-celebrate is not installed. Run `npm install` first.');
  process.exit(1);
}

const sourceDir = join(packageDir, 'dist');

if (!existsSync(sourceDir)) {
  console.error(`✗ ${sourceDir} does not exist. Build the package first:`);
  console.error('    npm --prefix ../domma-celebrate run build');
  process.exit(1);
}

// Removed first so a renamed theme chunk cannot linger from an earlier version.
// The chunk filenames carry a content hash, so stale ones would otherwise
// accumulate here forever without ever being loaded.
rmSync(destDir, {recursive: true, force: true});
cpSync(sourceDir, destDir, {recursive: true});

const {version} = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
console.log(`✓ Copied domma-celebrate v${version} to public/dist/celebrate/`);
