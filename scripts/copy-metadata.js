/**
 * Copy bundle-metadata.json to public/dist/
 * Makes it available for the Bundle Builder UI
 */

import {copyFileSync, existsSync, mkdirSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const source = join(rootDir, 'src/bundle-metadata.json');
const destDir = join(rootDir, 'public/dist');
const dest = join(destDir, 'bundle-metadata.json');

// Ensure dist directory exists
if (!existsSync(destDir)) {
    mkdirSync(destDir, {recursive: true});
}

// Copy metadata file
copyFileSync(source, dest);
console.log(`✓ Copied bundle-metadata.json to ${dest}`);
