#!/usr/bin/env node
/**
 * Phase 3's check, in a real browser: every page of the new site loads, every
 * showcase demo mounts, and nothing is logged as an error. With --reset it
 * also resets every demo through its right-click menu and checks that it
 * tears down and mounts again cleanly.
 *
 * The pages are every page under scripts/site-migrate/pages/ (or the ones
 * named), so a page added there is checked without anything to update.
 * Passing is: status 200, no "Demo not found", no demo that failed to load,
 * no console error. The one 404 the avatar demos ask for on purpose (a
 * missing picture, to show the fallback) is ignored.
 *
 * Usage: node scripts/site-migrate/check-site.cjs [page…] [--reset] [--base=https://…]
 *   page   a site path without the leading slash: showcase/elements/card
 *   BASE defaults to the preview, https://dommajs.sites.dommajs.org
 *   CHROME (env) a Chrome / headless shell to use; puppeteer-core needs one
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const args = process.argv.slice(2);
const BASE = (args.find(a => a.startsWith('--base=')) || '--base=https://dommajs.sites.dommajs.org').slice(7).replace(/\/$/, '');
const RESET = args.includes('--reset');
const CHROME = process.env.CHROME
    || path.join(process.env.HOME, '.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell');

const PAGES_DIR = path.join(__dirname, 'pages');
const walk = (d) => fs.readdirSync(d, {withFileTypes: true}).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const named = args.filter(a => !a.startsWith('--'));
const pages = named.length ? named : walk(PAGES_DIR).filter(f => f.endsWith('.md'))
    .map(f => path.relative(PAGES_DIR, f).replace(/\.md$/, '').replace(/(^|\/)index$/, '')).sort();

const NOISE = /Content Security Policy directive 'upgrade-insecure-requests'|favicon/;

(async () => {
    const browser = await puppeteer.launch({headless: 'shell', args: ['--no-sandbox'], executablePath: CHROME});
    const results = [];
    for (const pg of pages) {
        const p = await browser.newPage();
        await p.setViewport({width: 1400, height: 900});
        const errors = [];
        p.on('pageerror', e => errors.push('pageerror: ' + e.message.slice(0, 160)));
        p.on('console', m => {
            if (m.text().includes('404') && /does-not-exist/.test(m.location()?.url || '')) return;
            const warn = ['warn', 'warning'].includes(m.type()) && /showcase|Domma Reactive|did not|teardown/.test(m.text());
            if (m.type() === 'error' || warn) errors.push(m.type() + ': ' + m.text().slice(0, 260));
        });
        let status = 0;
        try {
            status = (await p.goto(`${BASE}/${pg}`, {waitUntil: 'networkidle2', timeout: 45000})).status();
        } catch (e) { errors.push('goto: ' + e.message.slice(0, 80)); }
        await new Promise(r => setTimeout(r, 1200));
        const info = await p.evaluate(() => ({
            demos: document.querySelectorAll('figure.showcase-demo').length,
            missing: document.querySelectorAll('.showcase-demo--missing').length,
            failed: [...document.querySelectorAll('.showcase-demo-error')].map(e => e.closest('figure')?.dataset.demo.split('/').pop())
        })).catch(() => ({demos: 0, missing: 0, failed: []}));

        let resets = '';
        if (RESET && info.demos) {
            const figs = await p.$$('figure.showcase-demo[data-module]');
            let done = 0;
            for (const fig of figs) {
                await fig.evaluate(f => f.scrollIntoView({block: 'center'}));
                const box = await fig.boundingBox();
                if (!box) continue;
                let clicked = false;
                for (let attempt = 0; attempt < 3 && !clicked; attempt++) {
                    await p.mouse.click(box.x + 6, box.y + 6, {button: 'right'});
                    await new Promise(r => setTimeout(r, 250));
                    clicked = await p.evaluate(() => {
                        const item = [...document.querySelectorAll('.dm-context-menu.is-open .dm-context-menu-label')].find(e => /Reset demo/.test(e.textContent));
                        if (item) (item.closest('button, [role=menuitem], li') || item).click();
                        return !!item;
                    });
                }
                if (clicked) done++;
                await new Promise(r => setTimeout(r, 200));
            }
            info.failed = await p.$$eval('.showcase-demo-error', a => a.map(e => e.closest('figure')?.dataset.demo.split('/').pop()));
            resets = ` reset=${done}/${figs.length}`;
        }
        results.push({pg, status, ...info, resets, errors: [...new Set(errors)].filter(e => !NOISE.test(e))});
        await p.close();
    }
    await browser.close();

    const bad = results.filter(r => r.status !== 200 || r.missing || r.failed.length || r.errors.length);
    console.log(`${results.length} pages, ${results.reduce((n, r) => n + r.demos, 0)} demos; ${bad.length} with problems`);
    for (const r of bad) console.log(`  ${r.pg} [${r.status}] demos=${r.demos}${r.resets} failed=${r.failed.join(',')} | ${r.errors.slice(0, 2).join(' || ')}`);
    process.exit(bad.length ? 1 : 0);
})();
