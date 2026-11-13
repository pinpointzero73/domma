import {describe, it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const chrome = process.env.DOMMA_CHROME;
const css = readFileSync(path.resolve('public/dist/domma.css'), 'utf8');
const themes = readFileSync(path.resolve('public/dist/themes/domma-themes.css'), 'utf8');

describe('themed native list markers', () => {
    it.skipIf(!chrome)('renders markers, preserves nesting and semantics, and follows theme/RTL changes', async () => {
        const browser = await puppeteer.launch({executablePath: chrome, headless: true,
            args: ['--no-sandbox', '--disable-dev-shm-usage']});
        try {
            const page = await browser.newPage();
            await page.setViewport({width: 1000, height: 800});
            await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}\n${themes}</style></head>
                <body class="dm-theme-charcoal-light"><main class="container" style="max-width:900px;margin:2rem auto">
                <h1>Choose your list style</h1><div class="grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem">
                <section><h2>Ticks</h2><ul class="list-check" id="check"><li>Quick to set up</li><li>Longer content wraps naturally and stays aligned with its own text.<ul id="nested"><li>Nested default</li></ul></li><li>Follows your theme</li></ul></section>
                <section><h2>Chevrons</h2><ul class="list-chevron" id="chevron"><li>Explore features</li><li>Read the documentation</li><li>Start a project</li></ul></section>
                <section><h2>Dashes</h2><ul class="list-dash" id="dash"><li>A quieter marker</li><li>Native HTML lists</li><li>Your content in focus</li></ul></section></div>
                <ul id="plain"><li>Normal bullet</li><li class="list-check" id="single">One styled item</li></ul><ol id="ordered"><li>Numbered item</li></ol>
                <ul class="list-chevron" dir="rtl" id="rtl"><li>Right to left</li></ul></main></body></html>`);
            const marker = selector => page.$eval(selector, el => ({content:getComputedStyle(el,'::marker').content,
                color:getComputedStyle(el,'::marker').color, textColor:getComputedStyle(el).color,
                display:getComputedStyle(el).display, type:getComputedStyle(el).listStyleType}));
            expect((await marker('#check > li')).content).toContain('✓');
            expect((await marker('#chevron > li')).content).toContain('›');
            expect((await marker('#dash > li')).content).toContain('-');
            expect((await marker('#rtl > li')).content).toContain('‹');
            expect((await marker('#single')).content).toContain('✓');
            expect((await marker('#nested > li')).content).toBe('normal');
            expect((await marker('#plain > li')).content).toBe('normal');
            expect((await marker('#ordered > li')).type).toBe('decimal');
            expect((await marker('#check > li')).display).toBe('list-item');
            const colours = new Set();
            for (const theme of ['charcoal-light','charcoal-dark','ocean-light','forest-dark']) {
                await page.evaluate(theme => { document.body.className=`dm-theme-${theme}`; }, theme);
                const shown = await marker('#check > li');
                const primary = await page.evaluate(() => {
                    const probe=document.createElement('span');probe.style.color='var(--dm-primary)';document.body.appendChild(probe);
                    const colour=getComputedStyle(probe).color;probe.remove();return colour;
                });
                expect(shown.color).toBe(primary);colours.add(shown.color);
                const normal = await marker('#plain > li');
                expect(shown.textColor).toBe(normal.textColor);
            }
            expect(colours.size).toBeGreaterThan(1);
            await page.$eval('#check',el=>el.style.setProperty('--dm-list-marker-color','var(--dm-success)'));
            expect((await marker('#check > li')).color).not.toBe((await marker('#chevron > li')).color);
            const ax = await (await page.createCDPSession()).send('Accessibility.getFullAXTree');
            expect(ax.nodes.filter(node => node.role?.value === 'list').length).toBeGreaterThanOrEqual(7);
            expect(ax.nodes.filter(node => node.role?.value === 'listitem').length).toBeGreaterThan(10);
            await page.evaluate(() => {document.body.className='dm-theme-charcoal-light';});
            if (process.env.DOMMA_LIST_SCREENSHOT) await page.screenshot({path:process.env.DOMMA_LIST_SCREENSHOT,fullPage:true});
            await page.setViewport({width:390,height:1000});
            // Exercise narrow layout without changing any list styling.
            await page.$eval('main > div',el=>el.style.gridTemplateColumns='1fr');
            expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
        } finally { await browser.close(); }
    }, 30000);
});
