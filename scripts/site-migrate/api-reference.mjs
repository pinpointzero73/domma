#!/usr/bin/env node
/**
 * Phase 4: the API reference collection, from Domma's TypeScript declarations
 * (assets/types/, generated from the JSDoc in src/ by `npm run build:types`),
 * read through the TypeScript compiler - every public method with its
 * signature and the first paragraph of its JSDoc. Examples come from
 * docs/API.md where it has one for the same call.
 *
 * Each public type below is mapped to how a reader calls it ($(el).find,
 * E.modal, modal.open...); types not mapped (options, events, records)
 * are types, not calls, and are left out. Overloads become one entry.
 *
 * Writes scripts/site-migrate/collections/api-reference/data.json (or --out FILE);
 * apply-site.mjs installs it on a site that has none yet (or with --reseed).
 *
 * Usage: node scripts/site-migrate/api-reference.mjs [--out FILE]
 * (needs typescript from devDependencies: npm ci)
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TYPES = path.join(ROOT, 'assets', 'types');
const API_MD = path.join(ROOT, 'docs', 'API.md');
const outAt = process.argv.indexOf('--out');
const OUT = outAt > 0 ? path.resolve(process.argv[outAt + 1])
    : path.join(ROOT, 'scripts', 'site-migrate', 'collections', 'api-reference', 'data.json');
const ts = createRequire(import.meta.url)('typescript');

/** type -> [module, how it is called, showcase page]. Anything else is a type, not a call. */
const OWNERS = {
    'index.d.ts': {
        DommaCollection: ['DOM', '$(el).', '/showcase/dom'],
        Utils: ['Utils', '_.', '/showcase/utils'], DebouncedFunction: ['Utils', 'debounced.', '/showcase/utils'],
        Dates: ['Dates', 'D.', '/showcase/dates'], DommaDate: ['Dates', 'D().', '/showcase/dates'],
        Models: ['Models', 'M.', '/showcase/models'], Model: ['Models', 'model.', '/showcase/models'],
        Observable: ['Reactivity', 'observable.', '/showcase/models/reactivity'], ObservableArray: ['Reactivity', 'list.', '/showcase/models/reactivity'],
        ComputedRef: ['Reactivity', 'computed.', '/showcase/models/reactivity'], BindingHandle: ['Bindings', 'bindings.', '/showcase/models/bindings'],
        Store: ['Models', 'store.', '/showcase/models'],
        Elements: ['Elements', 'E.', '/showcase/elements'],
        Effects: ['Effects', 'Domma.effects.', '/showcase/effects'], EffectControl: ['Effects', 'effect.', '/showcase/effects'],
        ConfigEngine: ['Config', '$.', '/showcase/config'],
        Http: ['HTTP', 'H.', '/showcase/http'],
        Storage: ['Storage', 'S.', '/showcase/storage'],
        Icons: ['Icons', 'I.', '/showcase/icons'],
        Flags: ['Flags', 'FL.', '/showcase/flags'],
        Theme: ['Themes', 'Domma.theme.', '/showcase/themes'],
        Tables: ['Tables', 'T.', '/showcase/tables'], TableInstance: ['Tables', 'table.', '/showcase/tables'],
        Components: ['Components', 'Domma.components.', '/showcase/components'],
        DommaStatic: ['Core', 'Domma.', '/showcase']
    },
    'generated/src/schema-builder.d.ts': {
        SchemaBuilderInstance: ['Schema Builder', 'builder.', '/showcase/schema-builder'],
        SchemaTemplateManager: ['Schema Builder', 'templates.', '/showcase/schema-builder']
    }
};
/** Where the component types are declared: their XInstance / XHandle / XStatic types are calls too. */
const ELEMENT_FILES = /\/generated\/src\/(elements|component|popover|context-menu|sortable|skeleton|avatar|input-group|treeview|components\/[\w-]+)\.d\.ts$/;
// Element instances and static helpers: ModalInstance -> modal.open, ToastStatic -> E.toast.success.
const elementOwner = (name) => {
    const m = /^([A-Z][A-Za-z]*?)(Instance|Handle|Static)$/.exec(name);
    if (!m || m[1] === 'Component') return null;
    const base = m[1][0].toLowerCase() + m[1].slice(1);
    // Two live on another component's page.
    const PAGES = {AvatarGroup: '/showcase/elements/avatar', InputGroup: '/showcase/forms/input-addons'};
    const page = PAGES[m[1]] || `/showcase/elements/${m[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
    return ['Elements', m[2] === 'Static' ? `E.${base}.` : `${base}.`, page];
};

const EVENT_SHORTCUTS = new Set(['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave',
    'mouseover', 'mouseout', 'keydown', 'keyup', 'keypress', 'focus', 'blur', 'focusin', 'focusout', 'change', 'input',
    'submit', 'select', 'scroll', 'resize', 'contextmenu', 'touchstart', 'touchend', 'touchmove']);

/** A line for the few undocumented families. */
function fallback(owner, name) {
    if (owner[1] === '$(el).' && EVENT_SHORTCUTS.has(name)) return `Bind a ${name} handler - shorthand for .on('${name}', handler); with no handler, trigger ${name}`;
    if (owner[1] === 'list.') return `Array ${name}(), then notify the list's subscribers`;
    return '';
}

/** The first paragraph of a JSDoc comment, on one line, without a trailing full stop. */
const firstParagraph = (text) => text.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim().replace(/\.$/, '');

/** Every public method of every mapped type, in the order of OWNERS. */
function readDeclarations() {
    const files = Object.keys(OWNERS).map(f => path.join(TYPES, f));
    const program = ts.createProgram(files, {
        target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
        lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'], types: [], strict: true, noEmit: true
    });
    const checker = program.getTypeChecker();
    const out = [];
    for (const [file, owners] of Object.entries(OWNERS)) {
        const source = program.getSourceFile(path.join(TYPES, file));
        if (!source) throw new Error(`assets/types/${file} is missing - run npm run build:types`);
        const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(source));
        const typed = [];
        for (let symbol of exports) {
            const name = symbol.name;
            if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
            if (!(symbol.flags & (ts.SymbolFlags.Type))) continue;
            const where = symbol.declarations?.[0]?.getSourceFile().fileName || '';
            const owner = owners[name] || (file === 'index.d.ts' && ELEMENT_FILES.test(where) ? elementOwner(name) : null);
            if (owner) typed.push({owner, type: checker.getDeclaredTypeOfSymbol(symbol), order: owners[name] ? Object.keys(owners).indexOf(name) : 1e6});
        }
        typed.sort((a, b) => a.order - b.order);
        for (const {owner, type} of typed) {
            for (const prop of checker.getPropertiesOfType(type)) {
                if (prop.name.startsWith('_') || prop.name.startsWith('__@') || prop.name === 'constructor') continue;
                // An instance's inherited Component methods are listed once, not on every component
                const from = prop.declarations?.[0]?.getSourceFile().fileName || '';
                if (owner[0] === 'Elements' && owner[1] !== 'E.' && /\/generated\/src\/component\.d\.ts$/.test(from)) continue;
                const propType = checker.getTypeOfSymbolAtLocation(prop, source);
                const signatures = propType.getCallSignatures();
                if (!signatures.length) continue;
                const description = firstParagraph(ts.displayPartsToString(prop.getDocumentationComment(checker)));
                for (const sig of signatures) {
                    const text = checker.signatureToString(sig, undefined, ts.TypeFormatFlags.NoTruncation);
                    out.push({owner, name: prop.name, signature: `${owner[1]}${prop.name}${text}`, description: description || fallback(owner, prop.name)});
                }
            }
        }
    }
    return out;
}

/** docs/API.md: the first code example under each `### \`call(...)\`` heading, by method name. */
function readExamples() {
    const md = fs.readFileSync(API_MD, 'utf8');
    const examples = new Map();
    const re = /^#{3,4} (`[^\n]+`)\n([\s\S]*?)(?=^#{2,4} |(?![\s\S]))/gm;
    for (const m of md.matchAll(re)) {
        const code = /```(?:javascript|js)\n([\s\S]*?)```/.exec(m[2]);
        if (!code) continue;
        for (const call of m[1].matchAll(/`(?:[\w.]+\.)?([a-zA-Z_$][\w$]*)\(/g)) {
            if (!examples.has(call[1])) examples.set(call[1], code[1].trim().split('\n').slice(0, 8).join('\n'));
        }
    }
    return examples;
}

const examples = readExamples();
const entries = new Map();
for (const d of readDeclarations()) {
    const [module, prefix, page] = d.owner;
    const key = `${prefix}${d.name}`;
    const have = entries.get(key);
    if (have) {
        // An overload: one entry, every signature.
        if (!have.signature.split('\n').includes(d.signature)) have.signature += `\n${d.signature}`;
        if (!have.description && d.description) have.description = d.description;
        continue;
    }
    // Only the examples written for this very call: E.modal's, not a model's, under "modal".
    const example = ['E.', '$(el).', 'Domma.effects.', 'H.', 'M.', 'Domma.'].includes(prefix) ? examples.get(d.name) || '' : '';
    entries.set(key, {module, name: key, signature: d.signature, description: d.description, example, page});
}

const rows = [...entries.values()].map((e, i) => {
    const id = crypto.createHash('sha1').update(`domma-api:${e.name}`).digest('hex');
    return {
        id: `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20, 32)}`,
        data: {...e, order: i + 1},
        meta: {createdAt: '2026-10-11T00:00:00.000Z', updatedAt: '2026-10-11T00:00:00.000Z', createdBy: null, source: 'admin'}
    };
});
fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, `${JSON.stringify(rows, null, 2)}\n`);
const by = rows.reduce((m, r) => ({...m, [r.data.module]: (m[r.data.module] || 0) + 1}), {});
console.log(`${rows.length} entries -> ${path.relative(ROOT, OUT)}`);
console.log(Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', '));
console.log(`with an example: ${rows.filter(r => r.data.example).length}; without a description: ${rows.filter(r => !r.data.description).length}`);
