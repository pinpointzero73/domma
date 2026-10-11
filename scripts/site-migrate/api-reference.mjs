#!/usr/bin/env node
/**
 * Phase 4: the API reference collection, from the IDE declarations in
 * public/assets/ide/phpstorm/*.d.ts - the one place every public method is
 * written down with its signature and a line about it (they are kept current
 * with the code; see CLAUDE.md). Examples come from docs/API.md where it has
 * one for the same call.
 *
 * Each public interface is mapped to how a reader calls it ($(el).find,
 * E.modal, modal.open...); interfaces not mapped (options, events, records)
 * are types, not calls, and are left out. Overloads become one entry.
 *
 * Writes scripts/site-migrate/collections/api-reference/data.json; apply-site.mjs
 * installs it on a site that has none yet (or with --reseed).
 *
 * Usage: node scripts/site-migrate/api-reference.mjs
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const IDE = path.join(ROOT, 'public', 'assets', 'ide', 'phpstorm');
const API_MD = path.join(ROOT, 'docs', 'API.md');
const OUT = path.join(ROOT, 'scripts', 'site-migrate', 'collections', 'api-reference', 'data.json');

/** interface -> [module, how it is called, showcase page]. Anything else is a type, not a call. */
const OWNERS = {
    'dom.d.ts': {DommaCollection: ['DOM', '$(el).', '/showcase/dom']},
    'utils.d.ts': {Utils: ['Utils', '_.', '/showcase/utils'], DebouncedFunction: ['Utils', 'debounced.', '/showcase/utils']},
    'dates.d.ts': {Dates: ['Dates', 'D.', '/showcase/dates'], DommaDate: ['Dates', 'D().', '/showcase/dates']},
    'models.d.ts': {
        Models: ['Models', 'M.', '/showcase/models'], Model: ['Models', 'model.', '/showcase/models'],
        Observable: ['Reactivity', 'observable.', '/showcase/models/reactivity'], ObservableArray: ['Reactivity', 'list.', '/showcase/models/reactivity'],
        ComputedRef: ['Reactivity', 'computed.', '/showcase/models/reactivity'], BindingHandle: ['Bindings', 'bindings.', '/showcase/models/bindings'],
        Store: ['Models', 'store.', '/showcase/models']
    },
    'elements.d.ts': {Elements: ['Elements', 'E.', '/showcase/elements']},
    'effects.d.ts': {Effects: ['Effects', 'Domma.effects.', '/showcase/effects'], EffectControl: ['Effects', 'effect.', '/showcase/effects']},
    'config.d.ts': {ConfigEngine: ['Config', '$.', '/showcase/config']},
    'http.d.ts': {Http: ['HTTP', 'H.', '/showcase/http']},
    'storage.d.ts': {Storage: ['Storage', 'S.', '/showcase/storage']},
    'icons.d.ts': {Icons: ['Icons', 'I.', '/showcase/icons']},
    'flags.d.ts': {Flags: ['Flags', 'FL.', '/showcase/flags']},
    'theme.d.ts': {Theme: ['Themes', 'Domma.theme.', '/showcase/themes']},
    'tables.d.ts': {Tables: ['Tables', 'T.', '/showcase/tables'], TableInstance: ['Tables', 'table.', '/showcase/tables']},
    'components.d.ts': {Components: ['Components', 'Domma.components.', '/showcase/components']},
    'schema-builder.d.ts': {SchemaBuilderInstance: ['Schema Builder', 'builder.', '/showcase/schema-builder'], SchemaTemplateManager: ['Schema Builder', 'templates.', '/showcase/schema-builder']},
    'index.d.ts': {DommaStatic: ['Core', 'Domma.', '/showcase']}
};
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

/** A line for the few undocumented families, from the section they sit in. */
function fallback(owner, name, section) {
    if (owner[1] === '$(el).' && /event shortcuts/i.test(section)) return `Bind a ${name} handler - shorthand for .on('${name}', handler); with no handler, trigger ${name}`;
    if (owner[1] === 'list.') return `Array ${name}(), then notify the list's subscribers`;
    return '';
}

/** The methods of every mapped interface in a .d.ts file. */
function readDeclarations(file) {
    const lines = fs.readFileSync(path.join(IDE, file), 'utf8').split('\n');
    const out = [];
    let owner = null;
    let depth = 0;
    let doc = '';
    let section = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const head = /^(?:export\s+)?(?:declare\s+)?(?:interface|class)\s+([A-Za-z]+)/.exec(line);
        if (head && depth === 0) {
            const name = head[1];
            owner = OWNERS[file]?.[name] || (file === 'elements.d.ts' ? elementOwner(name) : null);
            depth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            doc = '';
            section = '';
            continue;
        }
        if (depth > 0) {
            // A JSDoc block: keep its first sentence-ish lines (no @tags).
            if (/^\s{4}\/\*\*/.test(line) && depth === 1) {
                let text = '';
                for (; i < lines.length; i++) {
                    const l = lines[i].replace(/^\s*\/\*\*\s?|\s*\*\/\s*$|^\s*\*\s?/g, '');
                    if (/^@/.test(l.trim())) { while (i < lines.length && !/\*\//.test(lines[i])) i++; break; }
                    text += ` ${l.trim()}`;
                    if (/\*\//.test(lines[i])) break;
                }
                doc = text.trim();
                continue;
            }
            const member = depth === 1 && /^\s{4}(?:static\s+|readonly\s+)?([a-zA-Z_$][\w$]*)\??(<.*?>)?\(/.exec(line);
            if (member && owner && !['constructor'].includes(member[1])) {
                // Gather a signature that runs over several lines, up to its closing ';'.
                let sig = line.trim();
                let j = i;
                let balance = (sig.match(/[({]/g) || []).length - (sig.match(/[)}]/g) || []).length;
                while ((balance > 0 || !/;\s*$/.test(sig)) && j + 1 < lines.length && j - i < 30) {
                    j++;
                    sig += ` ${lines[j].trim()}`;
                    balance = (sig.match(/[({]/g) || []).length - (sig.match(/[)}]/g) || []).length;
                }
                i = j;
                sig = sig.replace(/\s+/g, ' ').replace(/;$/, '').replace(/^(static|readonly) /, '');
                out.push({owner, name: member[1], signature: owner[1] + sig, description: doc || fallback(owner, member[1], section)});
                doc = '';
                // Depth is unchanged by a balanced signature.
                continue;
            }
            const heading = /^\s{4}\/\/\s*([A-Za-z].*)$/.exec(line);
            if (heading) section = heading[1].trim();
            if (!/^\s*(\/\/|\*|$)/.test(line)) doc = '';
            depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            if (depth <= 0) { depth = 0; owner = null; }
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
for (const file of Object.keys(OWNERS)) {
    for (const d of readDeclarations(file)) {
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
