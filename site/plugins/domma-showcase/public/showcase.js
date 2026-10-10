/**
 * Domma Showcase - mounts the live demos on a page.
 *
 * Each <figure class="showcase-demo"> holds a demo's markup in
 * .showcase-demo-stage and, when it has behaviour, data-module pointing at its
 * demo.js (an ES module exporting mount(root) -> teardown). Every demo mounts
 * on its own: one that fails logs a warning and says so, and the rest of the
 * page carries on. Right-click a demo for copy, reset and open-on-its-own.
 */
const figures = [...document.querySelectorAll('figure.showcase-demo[data-demo]')];

// A demo that registers a component registers it again when it is reset, and the browser
// refuses a second definition of a custom element. The first one stays, so a repeat is
// skipped here rather than in every demo's code. (A Domma follow-up: Domma.component
// could do this itself.)
if (window.Domma && typeof Domma.component === 'function' && !Domma.component.__showcaseOnce) {
    const register = Domma.component;
    Domma.component = function (name, definition) {
        const tag = String(name).includes('-') ? name : `domma-${name}`;
        if (customElements.get(tag)) return undefined;
        return register.call(this, name, definition);
    };
    Object.assign(Domma.component, register, {__showcaseOnce: true});
}

if (figures.length && typeof $ !== 'undefined') {
    const state = new Map();   // figure -> {html, teardown}

    async function mount(fig) {
        const stage = fig.querySelector('.showcase-demo-stage');
        if (!stage) return;
        const s = state.get(fig) || {html: stage.innerHTML, teardown: null};
        state.set(fig, s);
        if (typeof I !== 'undefined') I.scan(stage);
        if (!fig.dataset.module) return;
        try {
            const mod = await import(fig.dataset.module);
            const teardown = await mod.mount?.(stage, {figure: fig});
            s.teardown = typeof teardown === 'function' ? teardown : null;
        } catch (err) {
            console.warn(`[showcase] demo "${fig.dataset.demo}" did not load: ${err?.message || err}`, err);
            $(stage).append('<p class="showcase-demo-error" role="alert">This demo did not load.</p>');
        }
    }

    function reset(fig) {
        const s = state.get(fig);
        if (!s) return;
        try { s.teardown?.(); } catch (err) { console.warn(`[showcase] teardown of "${fig.dataset.demo}" failed:`, err); }
        s.teardown = null;
        fig.querySelector('.showcase-demo-stage').innerHTML = s.html;
        mount(fig);
    }

    const source = (fig, lang) => fig.querySelector(`.showcase-demo-code code.language-${lang}`)?.textContent || '';
    async function copy(text, what) {
        try {
            await _.copyToClipboard(text);
            E.toast(`${what} copied.`, {type: 'success'});
        } catch {
            E.toast(`Could not copy the ${what}.`, {type: 'error'});
        }
    }

    // Opt-in bundles some demos need (data-needs): loaded once, before any demo mounts.
    const BUNDLES = {
        tools: {js: '/plugins/domma-showcase/public/vendor/domma-tools.min.js', css: '/plugins/domma-showcase/public/vendor/domma-tools.css'},
        flags: {js: '/dist/domma/domma-flags.min.js'},
    };
    const load = (b) => new Promise((resolve) => {
        if (b.css) $('head').append(`<link rel="stylesheet" href="${b.css}">`);
        const s = document.createElement('script');
        s.src = b.js;
        s.onload = resolve;
        s.onerror = () => { console.warn(`[showcase] could not load ${b.js}`); resolve(); };
        document.head.appendChild(s);
    });
    const wanted = new Set(figures.flatMap(f => (f.dataset.needs || '').split(' ').filter(n => BUNDLES[n])));
    const ready = Promise.all([...wanted].map(n => load(BUNDLES[n])));

    for (const fig of figures) {
        const code = fig.querySelector('.showcase-demo-code');
        if (code) E.tabs(code);
        ready.then(() => mount(fig));
    }

    const host = document.querySelector('.page-body') || document.body;
    E.contextMenu(host, {
        match: 'figure.showcase-demo[data-demo]',
        cursor: 'glyph',
        items: (fig) => [
            {header: `Demo: ${fig.dataset.demo}`},
            {label: 'Copy HTML', icon: 'copy', action: () => copy(source(fig, 'html'), 'HTML'), disabled: !source(fig, 'html')},
            {label: 'Copy JS', icon: 'copy', action: () => copy(source(fig, 'javascript'), 'JS'), disabled: !source(fig, 'javascript')},
            {type: 'divider'},
            {label: 'Reset demo', icon: 'refresh', action: () => reset(fig)},
            {label: 'Open on its own', icon: 'external-link',
                action: () => window.open(`/api/plugins/domma-showcase/demo?id=${encodeURIComponent(fig.dataset.demo)}`, '_blank', 'noopener')}
        ]
    });
}
