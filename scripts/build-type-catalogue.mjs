#!/usr/bin/env node
/**
 * Write assets/types/catalogue.json - the option names, kinds and doc lines of every component
 * `$.setup()` can create, read from the generated declarations (never from src/ directly, so the
 * catalogue says exactly what the .d.ts files say).
 *
 *   node scripts/build-type-catalogue.mjs              -> assets/types/catalogue.json
 *   node scripts/build-type-catalogue.mjs --out FILE   -> FILE (used by check-types.mjs)
 *
 * It is for tools that cannot run TypeScript - an editor checking `{"component": "carousel",
 * "options": {...}}` in a page's config, say. Shape:
 *
 *   {components: {carousel: {factory: 'E.carousel', options: 'CarouselOptions'}, ...},
 *    types: {CarouselOptions: {interval: {kind: 'number', doc: 'Autoplay interval in ms'}, ...}, ...}}
 *
 * A property's `kind` is boolean | number | string | enum (with `values`) | function | array | object
 * | any; `kinds` lists them when a property takes more than one, `nullable` when null is allowed.
 * An object property whose type is a named type found here carries `type` (its name in `types`), and a
 * record (`Record<string, X>`) carries `each`, the description of one of its values.
 */
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT = path.join(ROOT, 'assets', 'types', 'catalogue.json');
const ENTRY = path.join(ROOT, 'assets', 'types', 'index.d.ts');
const PROBE = path.join(ROOT, 'assets', 'types', '__catalogue_probe.ts');

/** Where `$.setup()` finds each component (src/config.js initComponent): the namespace it lives on. */
const SOURCES = {form: ['F', 'create'], breathe: ['Domma.effects', 'breathe'], pulse: ['Domma.effects', 'pulse'],
    scribe: ['Domma.effects', 'scribe']};

/** The `$.setup()` config types, described alongside the component options. */
const SETUP_TYPES = ['SelectorConfig', 'InitialProperties', 'EventAction'];

function loadTypeScript() {
    const require = createRequire(path.join(ROOT, 'package.json'));
    try {
        return require('typescript');
    } catch {
        throw new Error('The type catalogue needs typescript in node_modules - run npm ci first.');
    }
}

export function buildCatalogue() {
    const ts = loadTypeScript();
    const probe = [
        `/// <reference path="./index.d.ts" />`,
        `import type {ComponentType, ${SETUP_TYPES.join(', ')}} from './index.js';`,
        `export declare const componentType: ComponentType;`,
        `export const namespaces = {E, F, 'Domma.effects': Domma.effects};`,
        ...SETUP_TYPES.map(t => `export declare const setup_${t}: ${t};`)
    ].join('\n');
    const options = {strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler, lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'], skipLibCheck: true};
    const host = ts.createCompilerHost(options);
    const getSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (file, lang, ...rest) => path.resolve(file) === PROBE
        ? ts.createSourceFile(file, probe, lang)
        : getSourceFile(file, lang, ...rest);
    const fileExists = host.fileExists.bind(host);
    host.fileExists = (file) => path.resolve(file) === PROBE || fileExists(file);
    const program = ts.createProgram([ENTRY, PROBE], options, host);
    const errors = ts.getPreEmitDiagnostics(program, program.getSourceFile(PROBE));
    if (errors.length) {
        throw new Error(`The catalogue probe does not type-check:\n${errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n')}`);
    }
    const checker = program.getTypeChecker();
    const probeFile = program.getSourceFile(PROBE);
    const exportsOf = checker.getExportsOfModule(checker.getSymbolAtLocation(probeFile));
    const exported = (name) => {
        const sym = exportsOf.find(s => s.name === name);
        return checker.getTypeOfSymbolAtLocation(sym, probeFile);
    };

    const types = {};
    const nameOf = (type) => {
        const alias = type.aliasSymbol?.name;
        if (alias) return alias;
        const sym = type.getSymbol();
        return sym && !['__type', '__object'].includes(sym.name) ? sym.name : null;
    };
    // Only Domma's own types are described - not the DOM's (HTMLElement, CSSStyleDeclaration, ...)
    const TYPES_DIR = path.join(ROOT, 'assets', 'types') + path.sep;
    const ours = (type) => {
        const sym = type.aliasSymbol || type.getSymbol();
        return !!sym?.declarations?.some(d => path.resolve(d.getSourceFile().fileName).startsWith(TYPES_DIR));
    };
    const doc = (sym) => ts.displayPartsToString(sym.getDocumentationComment(checker)).replace(/^\s*-\s*/, '').trim();

    function kindOf(type) {
        const flags = type.flags;
        if (flags & ts.TypeFlags.Any || flags & ts.TypeFlags.Unknown) return {kind: 'any'};
        if (flags & ts.TypeFlags.BooleanLike) return {kind: 'boolean'};
        if (flags & ts.TypeFlags.NumberLike) return {kind: 'number'};
        if (flags & ts.TypeFlags.StringLiteral) return {kind: 'enum', values: [type.value]};
        if (flags & ts.TypeFlags.StringLike) return {kind: 'string'};
        if (type.getCallSignatures().length) return {kind: 'function'};
        if (checker.isArrayType(type) || checker.isTupleType(type)) return {kind: 'array'};
        if (flags & ts.TypeFlags.Object) {
            const name = nameOf(type);
            if (name && ours(type) && type.getProperties().length) {
                describe(name, type);
                return {kind: 'object', type: name};
            }
            // Record<string, X>: say what each value is
            const index = checker.getIndexInfosOfType(type)[0];
            if (index) {
                const each = describeType(index.type);
                return each.kind === 'any' && !each.kinds ? {kind: 'object'} : {kind: 'object', each};
            }
            return {kind: 'object'};
        }
        return {kind: 'any'};
    }

    /** {kind, kinds?, values?, type?, each?, nullable?} for a type, unions included. */
    function describeType(type) {
        const parts = type.isUnion() ? type.types : [type];
        let nullable = false;
        const kinds = [];
        const values = [];
        let objectType = null;
        let each = null;
        for (const part of parts) {
            if (part.flags & ts.TypeFlags.Null) { nullable = true; continue; }
            if (part.flags & ts.TypeFlags.Undefined) continue;
            // An array of X (EventActions allows one action or a list): describe X
            const k = checker.isArrayType(part) ? {kind: 'array', of: describeType(checker.getTypeArguments(part)[0])} : kindOf(part);
            if (k.kind === 'enum') values.push(...k.values);
            if (k.type) objectType = k.type;
            if (k.each) each = k.each;
            if (k.of) {
                if (k.of.type && !objectType) objectType = k.of.type;
            }
            if (!kinds.includes(k.kind)) kinds.push(k.kind);
        }
        // `boolean` is the union true | false - one kind
        const out = {};
        if (kinds.length === 1) out.kind = kinds[0];
        else if (kinds.length === 0) out.kind = 'any';
        else { out.kind = kinds.includes('any') ? 'any' : kinds[0]; out.kinds = kinds; }
        if (values.length) out.values = values;
        if (objectType) out.type = objectType;
        if (each) out.each = each;
        if (nullable) out.nullable = true;
        return out;
    }

    function describeProperty(sym, at) {
        const out = describeType(checker.getTypeOfSymbolAtLocation(sym, at));
        const text = doc(sym);
        if (text) out.doc = text;
        return out;
    }

    function describe(name, type) {
        if (types[name]) return;
        types[name] = {};
        const props = {};
        for (const sym of type.getApparentProperties()) {
            const decl = sym.valueDeclaration || sym.declarations?.[0];
            if (!decl) continue;
            props[sym.name] = describeProperty(sym, decl);
        }
        types[name] = props;
    }

    const componentType = exported('componentType');
    const names = (componentType.isUnion() ? componentType.types : [componentType]).map(t => t.value).sort();
    const namespaces = exported('namespaces');
    const components = {};
    for (const name of names) {
        const [ns, member] = SOURCES[name] || ['E', name];
        const nsType = checker.getTypeOfSymbolAtLocation(namespaces.getProperty(ns), probeFile);
        const fn = nsType.getProperty(member);
        if (!fn) throw new Error(`${ns}.${member} (component "${name}") is not in the declarations`);
        const sig = checker.getTypeOfSymbolAtLocation(fn, probeFile).getCallSignatures()[0];
        const entry = {factory: `${ns}.${member}`};
        const param = sig?.parameters.find(p => p.name === 'options') || sig?.parameters[1];
        if (param) {
            const ptype = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(param, probeFile));
            const tname = nameOf(ptype);
            if (tname && ptype.getProperties().length) {
                describe(tname, ptype);
                entry.options = tname;
            }
        }
        components[name] = entry;
    }
    for (const t of SETUP_TYPES) describe(t, exported(`setup_${t}`));

    const sorted = Object.fromEntries(Object.keys(types).sort().map(k => [k, types[k]]));
    return {components, setup: SETUP_TYPES, types: sorted};
}

/** The catalogue as written to disk (stable key order, trailing newline). */
export function catalogueText(catalogue = buildCatalogue()) {
    return `${JSON.stringify(catalogue, null, 2)}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const i = process.argv.indexOf('--out');
    const out = i > 0 ? path.resolve(process.argv[i + 1]) : DEFAULT_OUT;
    try {
        fs.writeFileSync(out, catalogueText());
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    console.log(`Type catalogue written to ${path.relative(ROOT, out) || out}`);
}
