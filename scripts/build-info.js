/**
 * Build Info Generator
 * Creates build-info.json with version, timestamp, commit hash, and bundle size
 */

import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read version from package.json
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

// Get git commit hash
const getGitCommit = () => {
    try {
        return execSync('git rev-parse --short HEAD', {cwd: rootDir}).toString().trim();
    } catch {
        return 'unknown';
    }
};

// Format date as dd/mm/YYYY hh:mm
const formatDate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Get bundle size in KB
const getBundleSize = () => {
    const bundlePath = join(rootDir, 'public/dist/domma.min.js');
    try {
        const stats = statSync(bundlePath);
        const sizeKB = Math.round(stats.size / 1024);
        return `${sizeKB}KB`;
    } catch {
        return 'unknown';
    }
};

// Ensure dist directory exists
const distDir = join(rootDir, 'public/dist');
if (!existsSync(distDir)) {
    mkdirSync(distDir, {recursive: true});
}

// Build info object
const buildInfo = {
    version: pkg.version,
    built: formatDate(new Date()),
    commit: getGitCommit(),
    size: getBundleSize()
};

// Write build-info.json
const outputPath = join(distDir, 'build-info.json');
writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log(`✓ Generated ${outputPath}`);
console.log(`  Version: ${buildInfo.version}`);
console.log(`  Built: ${buildInfo.built}`);
console.log(`  Commit: ${buildInfo.commit}`);
console.log(`  Size: ${buildInfo.size}`);
