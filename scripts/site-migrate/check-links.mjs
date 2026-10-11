#!/usr/bin/env node
/**
 * Phase 8's check: every link, image, script and stylesheet on every page of the
 * site (its sitemap) resolves. Same-site addresses must answer 200 (or one
 * redirect to a 200); off-site links are only reported when they answer 4xx/5xx.
 * Pages are read as the server sends them - links a script draws later (the
 * navbar, the footer) come from the menus, which the sitemap pages share.
 *
 * Usage: node scripts/site-migrate/check-links.mjs [--base=https://dommajs.sites.dommajs.org] [--external]
 */
const BASE = (process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'https://dommajs.sites.dommajs.org').replace(/\/$/, '');
const EXTERNAL = process.argv.includes('--external');
const origin = new URL(BASE).origin;

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(new URL(m[1]).pathname, BASE).href);

const seen = new Map();      // url -> status
const usedOn = new Map();    // url -> first page that uses it
async function status(url) {
    if (seen.has(url)) return seen.get(url);
    const p = (async () => {
        try {
            let res = await fetch(url, {redirect: 'manual', method: 'GET', headers: {'User-Agent': 'dommajs-link-check'}});
            if ([301, 302, 307, 308].includes(res.status) && res.headers.get('location')) {
                res = await fetch(new URL(res.headers.get('location'), url), {redirect: 'manual', headers: {'User-Agent': 'dommajs-link-check'}});
                return res.status === 200 ? 200 : `redirect then ${res.status}`;
            }
            return res.status;
        } catch (err) {
            return err.message;
        }
    })();
    seen.set(url, p);
    return p;
}

const pageQueue = [...pages];
const linkQueue = [];
async function readPages() {
    for (let page; (page = pageQueue.shift());) {
        // Code samples, scripts and textareas hold addresses as text, not links; preconnect,
        // canonical and alternate hints are not pages to visit.
        const html = (await (await fetch(page)).text())
            .replace(/<(pre|code|textarea|template)\b[\s\S]*?<\/\1>/gi, '')
            .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, '<script$1></script>')
            .replace(/<link\b[^>]*\brel="(?:preconnect|dns-prefetch|canonical|alternate)"[^>]*>/gi, '')
            .replace(/<meta\b[^>]*>/gi, '');
        for (const m of html.matchAll(/\s(?:href|src)="([^"#][^"]*)"/g)) {
            const raw = m[1].replace(/&amp;/g, '&');
            if (/^(mailto:|tel:|javascript:|data:|\{\{)/.test(raw)) continue;
            let url;
            try { url = new URL(raw, page); } catch { continue; }
            url.hash = '';
            const same = url.origin === origin;
            if (!same && !EXTERNAL) continue;
            const key = url.href;
            if (!usedOn.has(key)) { usedOn.set(key, page.slice(origin.length)); linkQueue.push(key); }
        }
    }
}
await Promise.all(Array.from({length: 4}, readPages));
const problems = [];
async function checkLinks() {
    for (let url; (url = linkQueue.shift());) {
        const s = await status(url);
        const same = url.startsWith(origin);
        if (s !== 200 && (same || typeof s !== 'number' || s >= 400)) problems.push(`${s}  ${url.replace(origin, '')}  (on ${usedOn.get(url)})`);
    }
}
await Promise.all(Array.from({length: 8}, checkLinks));
console.log(`${pages.length} pages, ${usedOn.size} distinct ${EXTERNAL ? '' : 'same-site '}links: ${problems.length ? `${problems.length} problems` : 'all resolve'}`);
for (const p of problems.sort()) console.log(`  ${p}`);
process.exitCode = problems.length ? 1 : 0;
