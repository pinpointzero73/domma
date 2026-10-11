/**
 * dommajs.org - the site's own touches, as the old site had them:
 *
 *   - a page's opening hero runs the full width of the page: out of the body
 *     column and above the contents list, up to the menu rail;
 *   - every hero gets the ambient blobs, and the page the twinkling stars;
 *   - the home page's hero types its tagline, and a module tile's summary
 *     while it is hovered; the CMS band types its headline, counts its
 *     figures up, throws a ticker-tape burst and pulses its second button.
 *
 * Motion is skipped when the visitor asked for less of it (the footer's
 * Reduce motion switch, or the system setting): the text and figures are
 * shown as they end up. A classic script at the end of the body, after
 * domma.min.js, so the hero moves before the first paint.
 */
(function () {
    'use strict';

    const reduced = document.documentElement.classList.contains('dm-reduced-motion')
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fx = window.Domma && Domma.effects;

    // ---- The opening hero, full width ------------------------------------------
    // The first block in the body (stylesheet links ahead of it aside).
    const first = [...document.querySelectorAll('.page-body > *')].find(el => el.tagName !== 'LINK' && el.tagName !== 'STYLE');
    const main = document.querySelector('.site-main');
    if (first && main && (first.classList.contains('hero') || first.classList.contains('djs-hero'))) {
        first.classList.add('site-hero');
        main.prepend(first);
    }

    // The home page's CMS band runs the full width too.
    const cmsBand = document.querySelector('.page-body > .djs-cms-band');
    if (cmsBand && main) main.appendChild(cmsBand);

    // ---- Blobs on every hero, stars on the page ---------------------------------
    document.querySelectorAll('.hero').forEach(h => h.classList.add('bg-ambient-float-blobs'));
    if (!reduced && fx && fx.twinkle) {
        fx.twinkle(null, {count: 150, minSize: 1, maxSize: 3, twinkleSpeed: 0.003, colour: 'rgba(255, 240, 200, 1)', zIndex: 1});
    }

    // ---- The current Domma version: under the brand in the menu, and in the footer -----
    // From the downloads plugin, which follows the Domma releases itself. The navbar and
    // footer are drawn by the CMS's site.js (a module, so after this script) - hence
    // DOMContentLoaded, by which time both exist.
    document.addEventListener('DOMContentLoaded', () => {
        fetch('/api/plugins/domma-downloads/version').then(r => (r.ok ? r.json() : null)).then(v => {
            if (!v?.version) return;
            const link = (cls) => Object.assign(document.createElement('a'), {
                className: cls, href: v.notes, textContent: `v${v.version}`, target: '_blank', rel: 'noopener',
                title: `Domma ${v.version} - what is new`
            });
            const brand = document.querySelector('#site-navbar .navbar-brand');
            if (brand && !brand.querySelector('.djs-version')) brand.appendChild(link('djs-version'));
            // The columns footer's bottom bar, else the one-row footer.
            const footer = document.querySelector('#site-footer .cms-footer-bottom') || document.querySelector('#site-footer .footer-inner');
            if (footer && !footer.querySelector('.djs-version-footer')) {
                const p = document.createElement('p');
                p.className = 'djs-version-footer';
                p.append('Domma ', link('djs-version'));
                footer.appendChild(p);
            }
        }).catch(() => {});
    });

    // ---- Seasonal celebrations -----------------------------------------------------
    // In season (Halloween, Christmas, the patron saints' days...), a sparkle disc turns the
    // celebration on and off and picks how much of it; the choice is remembered. Out of season
    // there is no disc. The domma-celebrate build is in public/vendor/celebrate.
    import('/plugins/dommajs-site/public/vendor/celebrate/domma-celebrate.esm.js').then(({Celebrations, isCelebrationSeason}) => {
        if (!isCelebrationSeason()) return;
        const store = window.Domma && Domma.storage;
        const get = (k, d) => (store ? store.get(k, d) : d);
        const set = (k, v) => store && store.set(k, v);
        const wrap = document.createElement('div');
        wrap.className = 'djs-celebrate';
        wrap.innerHTML = `<button type="button" class="djs-celebrate-toggle" aria-pressed="false" aria-label="Celebration effects" data-tooltip="Celebration effects"><span data-icon="sparkles"></span></button>
<div class="djs-celebrate-levels" role="group" aria-label="How much">${['light', 'medium', 'heavy'].map(l => `<button type="button" data-intensity="${l}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div>`;
        document.body.appendChild(wrap);
        if (window.Domma && Domma.icons) Domma.icons.scan(wrap);
        const toggle = wrap.querySelector('.djs-celebrate-toggle');
        let effect = null;
        const markLevel = () => wrap.querySelectorAll('[data-intensity]').forEach(b => b.classList.toggle('active', b.dataset.intensity === get('celebrations-intensity', 'medium')));
        const on = () => {
            effect = new Celebrations({theme: 'auto', intensity: get('celebrations-intensity', 'medium'), enabled: false, traits: get('celebrations-traits', {})});
            effect.init().then(started => {
                if (!started) return;
                effect.start();
                toggle.classList.add('active');
                toggle.setAttribute('aria-pressed', 'true');
                set('celebrations-enabled', true);
            });
        };
        const off = () => {
            if (effect) { effect.pause(); effect.destroy(); effect = null; }
            toggle.classList.remove('active');
            toggle.setAttribute('aria-pressed', 'false');
            set('celebrations-enabled', false);
        };
        toggle.addEventListener('click', () => (toggle.classList.contains('active') ? off() : on()));
        wrap.querySelectorAll('[data-intensity]').forEach(b => b.addEventListener('click', () => {
            set('celebrations-intensity', b.dataset.intensity);
            if (effect) effect.setIntensity(b.dataset.intensity);
            markLevel();
        }));
        markLevel();
        if (get('celebrations-enabled', false) && !reduced) on();
    }).catch(err => console.warn('[dommajs] celebrations did not load:', err?.message || err));

    // ---- Home: the hero's tagline ------------------------------------------------
    const tagline = document.getElementById('djs-tagline');
    if (tagline) {
        if (window.Domma && Domma.icons) Domma.icons.scan(tagline.closest('.djs-hero'));
        const LINES = [
            'A lightweight, zero-dependency JavaScript framework.',
            'jQuery-style DOM. Lodash utilities. Modern UI components.',
            '30 UI components. 120+ utilities. Zero dependencies.',
            'Build reactive applications with a single, powerful framework.'
        ];
        let typing = null;
        let leaveTimer = null;
        const stop = () => { if (typing) { typing.destroy ? typing.destroy() : typing.stop?.(); typing = null; } };
        const cycle = () => {
            stop();
            tagline.textContent = '';
            typing = fx.scribe(tagline, {
                speed: 40, deleteSpeed: 20, cursor: true, cursorChar: '|', loop: true, respectMotionPreference: false,
                actions: LINES.flatMap(l => [{render: l, effect: 'fade'}, {wait: '3s'}, {undoRender: true}])
            });
        };
        const say = (text) => {
            stop();
            tagline.textContent = '';
            typing = fx.scribe(tagline, {speed: 25, cursor: true, cursorChar: '|', loop: false, respectMotionPreference: false,
                actions: [{render: text, effect: 'fade'}]});
        };
        if (!reduced && fx && fx.scribe) {
            cycle();
            document.querySelectorAll('.djs-feature[data-tagline]').forEach(tile => {
                tile.addEventListener('mouseenter', () => { clearTimeout(leaveTimer); if (tile.dataset.tagline) say(tile.dataset.tagline); });
                tile.addEventListener('mouseleave', () => { clearTimeout(leaveTimer); leaveTimer = setTimeout(cycle, 600); });
            });
        }
        if (!reduced && fx && fx.reveal) fx.reveal('.djs-feature', {animation: 'zoom', duration: 400, stagger: 40, once: true});
    }

    // ---- Home: the CMS band --------------------------------------------------------
    const band = document.getElementById('djs-cms-band');
    if (band && !reduced && fx) {
        const headline = band.querySelector('.djs-cms-band-headline');
        const stats = [...band.querySelectorAll('.djs-cms-stat-number')];
        stats.forEach(el => { el.textContent = el.dataset.from; });
        let started = false;
        const run = () => {
            if (started) return;
            started = true;
            if (fx.scribe) {
                headline.textContent = '';
                fx.scribe(headline, {
                    mode: 'typewriter', speed: 42, deleteSpeed: 22, loop: 999, loopDelay: 300, respectMotionPreference: false,
                    actions: [
                        {render: 'Want Domma JS power in a CMS?'}, {wait: 2600}, {undoRender: 'all'}, {wait: 300},
                        {render: 'Meet Domma CMS.'}, {wait: 2200}, {undoRender: 'all'}, {wait: 300},
                        {render: 'Markdown-first. Zero build step.'}, {wait: 2400}, {undoRender: 'all'}, {wait: 300},
                        {render: 'Self-hosted. Open. Ridiculously fast.'}, {wait: 2600}, {undoRender: 'all'}, {wait: 300}
                    ]
                });
            }
            stats.forEach((el, i) => setTimeout(() => {
                if (fx.counter) fx.counter(el, {from: +el.dataset.from, to: +el.dataset.target, duration: 1400, easing: 'ease-out', respectMotionPreference: false});
                else el.textContent = el.dataset.target;
            }, 700 + i * 100));
            if (fx.tickerTape) setTimeout(() => fx.tickerTape('#djs-cms-band', {palette: 'pastel', burst: true, burstCount: 40, zIndex: 1, respectMotionPreference: false}), 1100);
            if (fx.pulse) setTimeout(() => fx.pulse('#djs-cms-band-cta-secondary', {scale: 1.08, duration: 1500, iterations: 'infinite', pauseOnHover: true, respectMotionPreference: false}), 1300);
        };
        // When the band comes into view.
        const io = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) { io.disconnect(); run(); }
        }, {threshold: 0.25});
        io.observe(band);
    }
})();
