/**
 * Domma Showcase - mounts the live demos on a page.
 *
 * Each <figure class="showcase-demo"> holds a demo's markup in
 * .showcase-demo-stage and, when it has behaviour, data-module pointing at its
 * demo.js (an ES module exporting mount(root) -> teardown). Every demo mounts
 * on its own: one that fails logs a warning and says so, and the rest of the
 * page carries on. Right-click a demo for copy, reset and open-on-its-own.
 */
import {presentPage, enhanceCode, codeText} from './presentation.js?v=f22c36496ea3';

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

if (typeof $ !== 'undefined' && (figures.length || /^\/showcase(?:\/|$)/.test(location.pathname))) {
    const host = $('.page-body').get(0) || document.body;
    const codeHost = document.body;
    presentPage(host);
    const state = new Map();   // figure -> {html, teardown}

    const syntaxReady = import('/dist/domma/domma-syntax.min.js').then(() => {
        const syntax = Domma.syntax;
        // Samples get one visible toolbar from enhanceCode, including dynamic outputs.
        syntax.configure({selector: ':not(*)'});
        syntax.register('json', [
            {type: 'string', pattern: /"(?:\\.|[^"\\])*"/g},
            {type: 'boolean', pattern: /\b(true|false|null)\b/g},
            {type: 'number', pattern: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g},
            {type: 'punctuation', pattern: /[{}[\]:,]/g}
        ]);
        syntax.register('bash', [
            {type: 'comment', pattern: /#.*/g},
            {type: 'string', pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g},
            {type: 'keyword', pattern: /\b(npm|npx|node|make|git|curl|cd|export|echo|sudo)\b/g},
            {type: 'attr-name', pattern: /--?[a-z][\w-]*/gi},
            {type: 'number', pattern: /\b\d+\b/g}
        ]);
        syntax.register('markdown', [
            {type: 'keyword', pattern: /^#{1,6}\s+.*$/gm},
            {type: 'tag-open', pattern: /\[\/?[a-z][\w-]*/gi},
            {type: 'string', pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g},
            {type: 'property', pattern: /[\w-]+(?==)/g},
            {type: 'punctuation', pattern: /[\[\]]/g}
        ]);
        return syntax;
    }).catch(err => {
        console.warn('[showcase] syntax highlighting did not load:', err);
        return {isLanguageSupported: () => false};
    });
    syntaxReady.then(syntax => {
        let queued = false;
        const scan = () => { queued = false; enhanceCode(codeHost, syntax, copy); };
        scan();
        new MutationObserver(() => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(scan);
        }).observe(codeHost, {childList: true, characterData: true, subtree: true});
    }).catch(err => console.warn('[showcase] syntax highlighting did not load:', err));

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
            syntaxReady.then(syntax => enhanceCode(codeHost, syntax, copy));
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
            return true;
        } catch {
            E.toast(`Could not copy the ${what}.`, {type: 'error'});
            return false;
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

    E.contextMenu(codeHost, {
        match: 'pre, figure.showcase-demo[data-demo]',
        exclude: '[contenteditable="true"],.CodeMirror,.monaco-editor',
        cursor: 'glyph',
        items: (fig) => fig.tagName === 'PRE' ? [
            {header: 'Code sample'},
            {label: 'Copy code', icon: 'copy', action: () => copy(codeText(fig), 'Code')},
            {label: 'Select all code', icon: 'code', action: () => {
                const range = document.createRange();
                range.selectNodeContents($(fig).children('code').get(0) || fig);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }},
            {label: fig.classList.contains('sx-code-wrap') ? 'Disable line wrapping' : 'Wrap long lines', icon: 'list', action: () => $(fig).toggleClass('sx-code-wrap')},
            {label: fig.classList.contains('sx-code-expanded') ? 'Collapse code' : 'Expand code', icon: 'code', action: () => $(fig).toggleClass('sx-code-expanded')}
        ] : [
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
