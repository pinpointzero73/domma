#!/usr/bin/env node
/** Stamp the showcase's asset dependency chain, so changed helpers cannot stay cached. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PUBLIC = path.join(ROOT, 'site/plugins/domma-showcase/public');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(PUBLIC, file))).digest('hex').slice(0, 12);
function write(file, text) {
    const target = path.join(PUBLIC, file);
    if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === text) return;
    fs.writeFileSync(target, text);
}
const presentation = fs.readFileSync(path.join(PUBLIC, 'presentation.js'), 'utf8')
    .replace(/(\.\/reference-catalogue\.js)(?:\?[^']*)?'/, `$1?v=${hash('reference-catalogue.js')}'`);
write('presentation.js', presentation);
const showcase = fs.readFileSync(path.join(PUBLIC, 'showcase.js'), 'utf8')
    .replace(/(\.\/presentation\.js)(?:\?[^']*)?'/, `$1?v=${hash('presentation.js')}'`);
write('showcase.js', showcase);
write('inject-head.html', ['showcase.css', 'presentation.css'].map(file => `<link rel="stylesheet" href="/plugins/domma-showcase/public/${file}?v=${hash(file)}">`).join('\n') + '\n');
write('inject-body.html', `<script type="module" src="/plugins/domma-showcase/public/showcase.js?v=${hash('showcase.js')}"></script>\n`);
console.log('Stamped showcase styles, script and reference dependencies.');
