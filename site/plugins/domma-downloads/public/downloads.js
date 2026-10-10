/**
 * Domma Downloads - the page's state, on domma-reactive bindings (template.html).
 *
 * Everything comes from /info - the latest release, its modules, presets, files
 * and themes - so nothing here names a version or a size. The Kickstart
 * builder zips its project in the browser (JSZip, loaded when first needed),
 * from the release's own Kickstart files and manifest; the custom bundle is
 * built on the server and downloaded as a zip.
 */
const API = '/api/plugins/domma-downloads';
const fileUrl = (p, download = true) => `${API}/file?p=${encodeURIComponent(p)}${download ? '&download=1' : ''}`;
const kb = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const ABOUT = {
    'domma.min.js': 'The whole library for a <script> tag - UMD, so AMD and CommonJS loaders take it too.',
    'domma.esm.js': 'The whole library as an ES module: import Domma from \'./domma.esm.js\'.',
    'domma.css': 'Base styles: tokens, typography, utilities, form controls',
    'grid.css': 'The 12-column grid and CSS Grid utilities',
    'elements.css': 'Styles for every UI element',
    'themes/domma-themes.css': 'Every theme, light and dark',
    'domma-tools.min.js': 'Developer tools: Theme Roller, Page Roller, Editor, Print to PDF',
    'domma-tools.css': 'Styles for the developer tools',
    'domma-flags.min.js': 'Nation flags (FL) - an opt-in module',
    'domma-syntax.min.js': 'Syntax highlighting for code blocks',
    'syntax.css': 'Colours for highlighted code'
};
const PAGE_LABELS = {home: 'Home', about: 'About', contact: 'Contact', blog: 'Blog', docs: 'Docs', privacy: 'Privacy policy',
    terms: 'Terms of service', cookies: 'Cookie policy', '404': '404 page'};
const ALWAYS = new Set(['home', '404', 'core', 'config', 'dist']);
const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|eot)$/i;

const root = document.getElementById('djs-downloads');
if (root && window.M) start(root);

async function start(root) {
    const ready = M.observable(false);
    const problem = M.observable('');
    const version = M.observable('');
    const core = M.observable([]);
    const presets = M.observable([]);
    const extras = M.observable([]);
    const themes = M.observable(['charcoal-dark']);

    // Kickstart
    const ksMode = M.observable('spa');
    const ksName = M.observable('my-app');
    const ksTheme = M.observable('charcoal-dark');
    const ksAi = M.observable(true);
    const ksSelector = M.observable(false);
    const ksGroups = M.observable([]);
    const ksStatus = M.observable('');
    const ksBusy = M.observable(false);
    const projectName = () => (ksName.value || 'my-app').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-') || 'my-app';
    const ksFile = M.computed(() => `${projectName()}.zip`);
    let manifest = null;

    // Custom bundle
    let meta = null;
    const modules = M.observable([]);
    const picked = M.computed(() => resolve(modules.value.filter(m => m.checked.value).map(m => m.key)));
    const pickedText = M.computed(() => picked.value.map(k => meta?.modules[k]?.name || k).join(', ') || 'none yet');
    const cssText = M.computed(() => {
        const css = [...new Set(picked.value.flatMap(k => meta?.modules[k]?.cssRequired || []))];
        return css.map(c => meta?.css[c]?.file || c).join(', ') || 'none needed';
    });
    const building = M.observable(false);
    const buildStatus = M.observable('');

    function resolve(keys) {
        if (!meta) return [];
        const want = new Set();
        const add = (k) => { if (!meta.modules[k] || want.has(k)) return; want.add(k); (meta.modules[k].dependencies || []).forEach(add); };
        keys.forEach(add);
        return Object.keys(meta.modules).filter(k => want.has(k));
    }

    function groupsFor(mode) {
        const seen = new Map();
        for (const f of manifest?.[mode] || []) {
            if (['ai', 'core', 'config', 'dist'].includes(f.group) || seen.has(f.group)) continue;
            seen.set(f.group, {group: f.group, label: PAGE_LABELS[f.group] || f.group, required: !!f.required || ALWAYS.has(f.group), on: true});
        }
        return [...seen.values()];
    }

    const state = {
        ready, problem, version, core, presets, extras, themes,
        ksMode, ksName, ksTheme, ksAi, ksSelector, ksGroups, ksStatus, ksBusy, ksFile,
        modules, picked, pickedText, cssText, building, buildStatus,

        setMode(mode) {
            ksMode.value = mode;
            ksGroups.value = groupsFor(mode);
        },
        toggleGroup(row, event) {
            ksGroups.value = ksGroups.value.map(g => (g.group === row.group ? {...g, on: event.target.checked} : g));
        },
        async kickstart() {
            if (!manifest) return;
            ksBusy.value = true;
            const name = projectName();
            try {
                const on = new Set(ksGroups.value.filter(g => g.required || g.on).map(g => g.group));
                const files = [
                    ...(manifest[ksMode.value] || []).filter(f => (f.category === 'ai' ? ksAi.value : f.required || ALWAYS.has(f.group) || on.has(f.group))),
                    ...(manifest.dist || [])
                ];
                ksStatus.value = `Fetching ${files.length} files…`;
                const JSZip = await loadJSZip();
                const vars = {'{{projectName}}': name, '{{year}}': String(new Date().getFullYear()),
                    '{{theme}}': ksTheme.value, '{{includeThemeSelector}}': String(ksSelector.value)};
                const zip = new JSZip();
                await Promise.all(files.map(async (f) => {
                    const res = await fetch(fileUrl(`download/${f.source}`, false));
                    if (!res.ok) throw new Error(`${res.status} for ${f.path}`);
                    if (BINARY.test(f.path)) { zip.file(`${name}/${f.path}`, await res.arrayBuffer()); return; }
                    let text = await res.text();
                    for (const [k, v] of Object.entries(vars)) text = text.split(k).join(v);
                    zip.file(`${name}/${f.path}`, text);
                }));
                ksStatus.value = 'Zipping…';
                save(await zip.generateAsync({type: 'blob', compression: 'DEFLATE', compressionOptions: {level: 6}}), `${name}.zip`);
                ksStatus.value = `${name}.zip is downloading.`;
            } catch (err) {
                ksStatus.value = `That did not work: ${err.message}`;
            } finally {
                ksBusy.value = false;
            }
        },

        toggleModule(row, event) {
            row.checked.value = event.target.checked;
            buildStatus.value = '';
        },
        startFrom(preset) {
            const keys = new Set(meta?.presets[preset.key]?.modules || []);
            modules.value.forEach(m => { m.checked.value = keys.has(m.key); });
            buildStatus.value = '';
            document.getElementById('custom-bundle')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
        clearModules() {
            modules.value.forEach(m => { m.checked.value = false; });
            buildStatus.value = '';
        },
        async buildBundle() {
            if (!picked.value.length) return;
            building.value = true;
            buildStatus.value = 'Building - a few seconds the first time anyone asks for these modules…';
            try {
                const res = await fetch(`${API}/build`, {method: 'POST', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({modules: picked.value})});
                const body = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(body.error || `The server answered ${res.status}`);
                window.location.assign(body.url);
                const size = body.sizes ? ` - domma-custom.min.js is ${kb(body.sizes.min)}` : '';
                buildStatus.value = (body.cached ? 'Downloading (built before, straight from the shelf)' : 'Built - downloading') + `${size}.`;
            } catch (err) {
                buildStatus.value = err.message;
            } finally {
                building.value = false;
            }
        }
    };

    const handle = M.applyBindings(state, root);
    if (window.Domma?.icons) Domma.icons.scan(root);

    try {
        const res = await fetch(`${API}/info`);
        const info = await res.json();
        if (!res.ok) throw new Error(info.error || `The server answered ${res.status}`);
        meta = {modules: info.modules, css: info.css, presets: info.presets};
        version.value = info.version;
        themes.value = info.themes;
        if (!info.themes.includes(ksTheme.value)) ksTheme.value = info.themes[0];
        core.value = info.files.core.map(f => ({...f, about: ABOUT[f.file] || '', sizeText: `${kb(f.size)} minified`, url: fileUrl(f.path)}));
        extras.value = [...info.files.css, ...info.files.extras].map(f => ({...f, about: ABOUT[f.file] || '', sizeText: kb(f.size), url: fileUrl(f.path)}));
        const archive = (key) => info.files.archives.find(a => a.file === `archives/domma-${key}.tar.gz`);
        // "Full" is the whole library - domma.min.js itself.
        const presetJs = (key) => info.files.presets.find(p => p.preset === key)
            || (key === 'full' ? info.files.core.find(f => f.file === 'domma.min.js') : null);
        presets.value = Object.entries(info.presets).map(([key, p]) => ({
            key, name: p.name, description: p.useCase || p.description || '',
            modulesText: p.modules.map(m => info.modules[m]?.name || m).join(', '),
            sizeText: presetJs(key) ? `${kb(presetJs(key).size)} minified` : `about ${p.estimatedSize} KB`,
            jsUrl: presetJs(key) ? fileUrl(presetJs(key).path) : '',
            archiveUrl: archive(key) ? fileUrl(archive(key).path) : ''
        }));
        // A row per module; `needed` is on when something chosen depends on it.
        modules.value = Object.entries(info.modules)
            .sort(([, a], [, b]) => (a.tier || 0) - (b.tier || 0))
            .map(([key, m]) => {
                const row = {key, name: m.name, description: m.description, checked: M.observable(false)};
                row.needed = M.computed(() => picked.value.includes(key));
                return row;
            });
        ready.value = true;

        const mres = await fetch(fileUrl('download/kickstart-manifest.json', false));
        if (mres.ok) { manifest = await mres.json(); ksGroups.value = groupsFor(ksMode.value); }
        // Icons inside data-if blocks are drawn once the blocks exist.
        requestAnimationFrame(() => window.Domma?.icons && Domma.icons.scan(root));
    } catch (err) {
        problem.value = `The downloads are not available just now: ${err.message}`;
    }
    window.addEventListener('pagehide', () => handle?.dispose?.(), {once: true});
}

let jszip = null;
function loadJSZip() {
    jszip ??= new Promise((resolveIt, reject) => {
        if (window.JSZip) return resolveIt(window.JSZip);
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js';
        s.onload = () => resolveIt(window.JSZip);
        s.onerror = () => reject(new Error('the zip library did not load'));
        document.head.appendChild(s);
    });
    return jszip;
}

function save(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href: url, download: name});
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}
