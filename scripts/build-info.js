/**
 * Build Info Generator
 * Creates build-info.json with version, timestamp, and commit hash
 */

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
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

// Build info object
const buildInfo = {
    version: pkg.version,
    built: formatDate(new Date()),
    commit: getGitCommit()
};

// Ensure dist directory exists
const distDir = join(rootDir, 'dist');
if (!existsSync(distDir)) {
    mkdirSync(distDir, {recursive: true});
}

// Write build-info.json
const outputPath = join(distDir, 'build-info.json');
writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log(`✓ Generated ${outputPath}`);
console.log(`  Version: ${buildInfo.version}`);
console.log(`  Built: ${buildInfo.built}`);
console.log(`  Commit: ${buildInfo.commit}`);
