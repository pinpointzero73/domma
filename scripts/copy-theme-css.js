import {copyFileSync, existsSync, mkdirSync, readFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const metadataPath = join(rootDir, 'src/bundle-metadata.json');
const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));

const themesDirSrc = join(rootDir, 'src/css/themes');
const themesDirDest = join(rootDir, 'public/dist/themes');

if (!existsSync(themesDirDest)) {
  mkdirSync(themesDirDest, {recursive: true});
}

console.log('Copying CSS theme files...');

// Iterate through CSS entries in metadata to find theme files
Object.entries(metadata.css).forEach(([key, cssInfo]) => {
  if (cssInfo.file.startsWith('themes/') && !cssInfo.file.includes('domma-themes.css')) { // Only copy custom themes
    const sourcePath = join(themesDirSrc, cssInfo.file.split('/')[1]);
    const destPath = join(themesDirDest, cssInfo.file.split('/')[1]);

    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied ${cssInfo.file.split('/')[1]} to ${destPath}`);
    } else {
      console.warn(`✗ Source file not found for theme ${key}: ${sourcePath}`);
    }
  }
});

console.log('CSS theme file copying complete.');
