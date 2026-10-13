#!/usr/bin/env node
/** Restore controls and output panes that the original migration separated. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEMOS = path.join(ROOT, 'site/plugins/domma-showcase/public/demos/showcase');
const PAGES = path.join(ROOT, 'scripts/site-migrate/pages/showcase');
const LIVE = process.argv.find(a => a.startsWith('--site='))?.slice(7);
const updated = new Set();
const demoFile = (id, name = 'demo.html') => path.join(DEMOS, id, name);
function writeDemo(id, content, name = 'demo.html') {
    fs.writeFileSync(demoFile(id, name), content);
    updated.add(`showcase/${id}`);
}
function oldDoc(page) {
    const root = path.join(ROOT, 'public/showcase');
    const file = fs.existsSync(path.join(root, page, 'index.html')) ? path.join(root, page, 'index.html') : path.join(root, `${page}.html`);
    return new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
}
function removePlacement(page, id) {
    for (const root of [PAGES, ...(LIVE ? [path.join(LIVE, 'content/pages/showcase')] : [])]) {
        const file = path.join(root, `${page}.md`);
        const text = fs.readFileSync(file, 'utf8').split('\n').filter(line => !line.includes(`[showcase-demo id="showcase/${id}"`)).join('\n').replace(/\n{3,}/g, '\n\n');
        fs.writeFileSync(file, text);
    }
}
function merge(owner, peer, page) {
    const current = fs.readFileSync(demoFile(owner), 'utf8');
    const extra = fs.readFileSync(demoFile(peer), 'utf8');
    const peerIds = [...new JSDOM(extra).window.document.querySelectorAll('[id]')].map(e => e.id);
    if (!peerIds.every(id => current.includes(`id="${id}"`))) writeDemo(owner, current.trimEnd() + '\n' + extra);
    removePlacement(page, peer);
}

merge('dom/try-it', 'dom/try-it-2', 'dom');
{
    const id = 'dom/try-it';
    let html = fs.readFileSync(demoFile(id), 'utf8');
    if (!html.includes('class="demo-item')) {
        const items = oldDoc('dom').querySelector('.demo-item').parentElement.cloneNode(true);
        items.className = 'flex gap-2 flex-wrap p-3 mb-3';
        html = html.replace('<div class="mt-3', items.outerHTML + '\n<div class="mt-3');
        writeDemo(id, html);
    }
    for (const root of [PAGES, ...(LIVE ? [path.join(LIVE, 'content/pages/showcase')] : [])]) {
        const file = path.join(root, 'dom.md');
        let text = fs.readFileSync(file, 'utf8').replace(/\nItem [1-4]\n/g, '\n');
        text = text.replace("$('Content')", "$('<div class=\"new\">Content</div>')");
        fs.writeFileSync(file, text.replace(/\n{3,}/g, '\n\n'));
    }
}
merge('effects/strobe/demo-build-your-own', 'effects/strobe/demo-build-your-own-2', 'effects/strobe');
merge('print-to-pdf/basic-print-example', 'print-to-pdf/sample-document', 'print-to-pdf');

for (const [page, id, selector] of [
    ['icons', 'icons/domma-icons', '.icons-controls-inner'],
    ['flags', 'flags/one-flag-four-shapes-2', '.flag-controls-inner']
]) {
    let html = fs.readFileSync(demoFile(id), 'utf8');
    if (!html.includes('id="search"')) {
        const controls = oldDoc(page).querySelector(selector).cloneNode(true);
        controls.className = 'flex flex-wrap items-center gap-3 mb-4 sx-gallery-controls';
        controls.querySelectorAll('[class]').forEach(el => {
            el.className = el.className.replace(/\bd-flex\b/g, 'flex').replace(/\balign-items-center\b/g, 'items-center').replace(/\bdm-select\b/g, 'form-select');
        });
        controls.querySelectorAll('button').forEach(el => el.setAttribute('type', 'button'));
        controls.querySelectorAll('input').forEach(el => { el.classList.add('form-input'); el.setAttribute('aria-label', page === 'icons' ? 'Search icons' : 'Search flags'); });
        controls.querySelectorAll('select').forEach(el => el.setAttribute('aria-label', el.id === 'shape' ? 'Flag shape' : 'Flag size'));
        writeDemo(id, controls.outerHTML + '\n' + html);
    }
}
// The old icon script tried to update counters that were absent from its markup.
{
    const id = 'icons/domma-icons';
    let html = fs.readFileSync(demoFile(id), 'utf8');
    if (!html.includes('id="total-icons"')) writeDemo(id, '<p class="text-sm text-muted"><strong id="total-icons">0</strong> icons in <strong id="total-categories">0</strong> categories</p>\n' + html);
}
{
    const id = 'forms/input-addons/e-inputgroup-on-an-input-already-on-the-page';
    let html = fs.readFileSync(demoFile(id), 'utf8');
    if (!html.includes('id="ig-markup"')) writeDemo(id, html + '\n<pre class="code-block language-html" id="ig-markup"></pre>\n');
}
{
    const id = 'elements/tabs/complete-working-demo';
    const html = fs.readFileSync(demoFile(id), 'utf8').replace('class="demo-result flex-1 tutorial-result-tabs"', 'class="demo-result flex-1 tutorial-result-tabs" id="tutorial-result"');
    if (!fs.readFileSync(demoFile(id), 'utf8').includes('id="tutorial-result"')) writeDemo(id, html);
    const js = fs.readFileSync(demoFile(id, 'demo.js'), 'utf8').replace('onChange: (index) =>', 'onChange: ({index}) =>');
    writeDemo(id, js, 'demo.js');
}
// Shared setup statements target other demonstrations on the same page.
for (const id of ['config/all-components/supported-2-modal', 'storage/try-it', 'storage/persistent-settings']) {
    let js = fs.readFileSync(demoFile(id, 'demo.js'), 'utf8');
    const own = new Set([...new JSDOM(fs.readFileSync(demoFile(id), 'utf8')).window.document.querySelectorAll('[id]')].map(el => el.id));
    let changed = false;
    js = js.replace(/\$\(root\)\.find\('#([\w-]+)'\)/g, (match, target) => {
        if (own.has(target)) return match;
        changed = true;
        return `$(pageRoot).find('#${target}')`;
    }).replace(/root\.querySelector\('#([\w-]+)'\)/g, (match, target) => {
        if (own.has(target)) return match;
        changed = true;
        return `$(pageRoot).find('#${target}').get(0)`;
    });
    if (changed && !js.includes('const pageRoot =')) js = js.replace('export function mount(root) {', "export function mount(root) {\n    const pageRoot = $(root).closest('.sx-showcase').get(0) || root;");
    if (changed) writeDemo(id, js, 'demo.js');
}

const protectedFile = path.join(ROOT, 'scripts/site-migrate/hand-upgraded.txt');
const protectedText = fs.readFileSync(protectedFile, 'utf8');
const additions = [...updated].filter(id => !protectedText.split('\n').includes(id));
if (additions.length) fs.appendFileSync(protectedFile, '\n# Restored showcase controls and outputs\n' + additions.join('\n') + '\n');
console.log(`Recovered content in ${updated.size} demos; scripts and Markdown placements now agree.`);
