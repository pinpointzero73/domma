/**
 * Domma i18n Module
 * Translations, plurals and locale-aware formatting - `Domma.i18n`, with `Domma.t()` as a shortcut.
 *
 * Messages are plain JSON: nested objects are flattened to dot keys, `{name}` placeholders are
 * filled from params, and a plural (or select) is an OBJECT of forms rather than an ICU string:
 *
 *     i18n.add('en', {cart: {items: {'=0': 'Your cart is empty', one: '{count} item', other: '{count} items'}}});
 *     i18n.t('cart.items', {count: 3});   // "3 items"
 *
 * Why objects and not ICU MessageFormat: they are already JSON, so translators and tools edit them
 * without learning a grammar; nothing has to be parsed at run time (no parser to ship or get
 * wrong); and each form is an ordinary string with ordinary `{name}` placeholders. The cost is
 * that a plural cannot sit in the middle of a sentence - write the whole sentence in each form.
 *
 * All the locale knowledge (plural categories, number/date/list shapes, text direction) comes
 * from `Intl`, so the module carries no data tables.
 *
 * Messages are never evaluated: a placeholder is looked up in params and replaced with its text,
 * and that is all. `t()` returns plain text (put it in textContent); `html()` keeps the message's
 * own markup and escapes every param; `translate()` sanitises `data-i18n-html` before it lands.
 *
 * Node-safe: nothing touches window/document at import; `translate()` does nothing without a DOM.
 */

import {http} from './http.js';
import {storage} from './storage.js';
import {escapeHtml} from './escape.js';
import {sanitise} from './sanitize.js';
import {loadOption} from './globals.js';

const PLURAL_KEYS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
const FORM_FLAGS = new Set(['ordinal', 'select']);
const EXACT_KEY = /^=-?\d+(\.\d+)?$/;
const PLACEHOLDER = /\{([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\}/g;

// Languages written right to left, for engines without Intl.Locale textInfo. Scripts are
// checked too, so `pa-Arab` or `az-Arab` are rtl although their language usually is not.
const RTL_LANGUAGES = new Set(['ar', 'arc', 'ckb', 'dv', 'fa', 'he', 'iw', 'ks', 'ps', 'sd', 'syr', 'ug', 'ur', 'yi', 'ji']);
const RTL_SCRIPTS = new Set(['Arab', 'Hebr', 'Thaa', 'Syrc', 'Nkoo', 'Adlm', 'Rohg', 'Mand', 'Samr']);

// ============================================
// State
// ============================================

/** @type {Map<string, Map<string, string|Object>>} locale -> flat key -> message */
const messages = new Map();
const loads = new Map();          // `${locale}|${url}` -> Promise
const loaderLoads = new Map();    // locale -> Map<loader function, Promise>
const formatters = new Map();     // cached Intl instances
const listeners = new Map();      // event -> Set<fn>
const warned = new Set();         // missing keys already warned about
const originals = new WeakMap();  // element -> {text, html, attrs} as first authored

let current = 'en';
let fallbacks = [];
let missingHook = null;
let storageKey = null;

// ============================================
// Helpers
// ============================================

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
    && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);

/**
 * A message whose value is an object of forms (plural or select) rather than a namespace.
 * A select names its param (`{select: 'gender', male: ..., other: ...}`); a plural has an
 * `other` form and nothing but plural categories, `=N` exact keys and the `ordinal` flag.
 */
function isForms(value) {
    if (!isPlainObject(value)) return false;
    if (typeof value.select === 'string') return true;
    if (typeof value.other !== 'string') return false;
    return Object.keys(value).every(k => PLURAL_KEYS.has(k) || FORM_FLAGS.has(k) || EXACT_KEY.test(k));
}

function flatten(source, prefix, out) {
    for (const key of Object.keys(source)) {
        const value = source[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (value == null) continue;
        if (typeof value === 'string') out.set(path, value);
        else if (typeof value === 'number' || typeof value === 'boolean') out.set(path, String(value));
        else if (isForms(value)) {
            // A null-prototype copy: a `__proto__` key from JSON stays a plain key.
            const forms = Object.create(null);
            for (const k of Object.keys(value)) forms[k] = value[k];
            out.set(path, forms);
        } else if (isPlainObject(value)) flatten(value, path, out);
    }
    return out;
}

/** Canonical BCP 47 code, or throws RangeError for nonsense. */
function canonical(code) {
    if (typeof code !== 'string' || !code.trim()) throw new RangeError(`Domma i18n: invalid locale "${code}"`);
    const tag = code.trim().replace(/_/g, '-');
    if (typeof Intl !== 'undefined' && typeof Intl.getCanonicalLocales === 'function') {
        return Intl.getCanonicalLocales(tag)[0];
    }
    return tag;
}

/** `fr-CA` -> ['fr-CA', 'fr'] */
function withParents(code) {
    const out = [];
    const parts = code.split('-');
    for (let i = parts.length; i > 0; i--) out.push(parts.slice(0, i).join('-'));
    return out;
}

/** The locales searched for a message, most specific first, without repeats. */
function chain(locale) {
    const seen = new Set();
    for (const code of [locale, ...fallbacks]) {
        for (const c of withParents(code)) seen.add(c);
    }
    return [...seen];
}

function lookup(key, locale) {
    for (const code of chain(locale)) {
        const table = messages.get(code);
        if (table && table.has(key)) return {message: table.get(key), locale: code};
    }
    return null;
}

function param(params, path) {
    if (!params) return undefined;
    let value = params;
    for (const part of path.split('.')) {
        if (value == null || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, part)) return undefined;
        value = value[part];
    }
    return value;
}

/** Replace `{name}` with params; an unknown placeholder is left as written so the gap shows. */
function interpolate(text, params, encode) {
    if (!params || typeof text !== 'string' || text.indexOf('{') === -1) return text;
    return text.replace(PLACEHOLDER, (whole, path) => {
        const value = param(params, path);
        if (value === undefined) return whole;
        return encode(value == null ? '' : String(value));
    });
}

function pluralRules(locale, type) {
    return cached('plural', locale, {type}, () => new Intl.PluralRules(locale, {type}));
}

/** Pick the string out of a forms object for these params. */
function chooseForm(forms, params, locale, options) {
    if (typeof forms.select === 'string') {
        const value = param(params, forms.select);
        const pick = value != null && value !== 'select' && typeof forms[String(value)] === 'string' ? forms[String(value)] : forms.other;
        return typeof pick === 'string' ? pick : '';
    }
    const count = Number(param(params, 'count'));
    if (!Number.isFinite(count)) return forms.other;
    if (typeof forms[`=${count}`] === 'string') return forms[`=${count}`];
    // `zero` reads as "exactly none" even in languages (English) whose rules have no zero category.
    if (count === 0 && typeof forms.zero === 'string') return forms.zero;
    const type = (options && options.ordinal) || forms.ordinal === true ? 'ordinal' : 'cardinal';
    let category = 'other';
    try {
        category = pluralRules(locale, type).select(count);
    } catch {
        // Unknown locale to this engine: `other` is always present
    }
    return typeof forms[category] === 'string' ? forms[category] : forms.other;
}

function emit(event, detail) {
    const set = listeners.get(event);
    if (set) {
        for (const fn of [...set]) {
            try {
                fn(detail);
            } catch (e) {
                console.error(`Domma i18n: error in "${event}" listener`, e);
            }
        }
    }
    if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
        document.dispatchEvent(new CustomEvent(`dm:i18n:${event}`, {detail}));
    }
}

function reportMissing(key, locale) {
    emit('missing', {key, locale});
    let result;
    if (missingHook) {
        try {
            result = missingHook(key, locale);
        } catch (e) {
            console.error('Domma i18n: error in onMissing hook', e);
        }
    }
    const id = `${locale}|${key}`;
    if (!warned.has(id) && loadOption('i18nWarnings', true) !== false && typeof console !== 'undefined') {
        warned.add(id);
        console.warn(`Domma i18n: missing translation "${key}" for locale "${locale}" (window.DommaOptions = {i18nWarnings: false} silences this)`);
    }
    return typeof result === 'string' ? result : undefined;
}

/** Split `{locale, ...rest}` off formatter options. */
function splitLocale(opts) {
    if (!opts || typeof opts !== 'object') return [current, undefined];
    const {locale, ...rest} = opts;
    return [locale ? canonical(locale) : current, rest];
}

function cached(type, locale, opts, make) {
    const id = `${type}|${locale}|${opts ? JSON.stringify(opts) : ''}`;
    let instance = formatters.get(id);
    if (!instance) {
        instance = make();
        formatters.set(id, instance);
    }
    return instance;
}

/** Date, number, string or a Domma D() wrapper -> Date (possibly invalid). */
function toDate(value) {
    if (value instanceof Date) return value;
    if (value && typeof value.toDate === 'function') return value.toDate();
    if (value == null) return new Date();
    return new Date(value);
}

function resolveRoots(root) {
    if (root == null) return [document];
    if (typeof root === 'string') return [...document.querySelectorAll(root)];
    if (typeof root.get === 'function' && typeof root.length === 'number' && !root.nodeType) return root.get();
    if (typeof root.length === 'number' && !root.nodeType) return [...root];
    return [root];
}

function readParams(el) {
    const raw = el.getAttribute('data-i18n-params');
    if (!raw) return undefined;
    try {
        const parsed = JSON.parse(raw);
        return isPlainObject(parsed) ? parsed : undefined;
    } catch {
        console.warn('Domma i18n: data-i18n-params is not valid JSON', el);
        return undefined;
    }
}

function parseAttrList(spec) {
    return spec.split(';').map(part => {
        const at = part.indexOf(':');
        if (at === -1) return null;
        const attr = part.slice(0, at).trim();
        const key = part.slice(at + 1).trim();
        return attr && key ? [attr, key] : null;
    }).filter(Boolean);
}

// ============================================
// Public API
// ============================================

export const i18n = {
    /**
     * Add messages for a locale. Nested objects become dot keys; later calls merge (a key
     * already there is replaced, everything else is kept).
     * @param {string} locale
     * @param {Object} source
     * @returns {Object} i18n
     */
    add(locale, source) {
        const code = canonical(locale);
        if (!isPlainObject(source)) return i18n;
        let table = messages.get(code);
        if (!table) {
            table = new Map();
            messages.set(code, table);
        }
        for (const [k, v] of flatten(source, '', new Map())) table.set(k, v);
        return i18n;
    },

    /**
     * Load a locale's messages from a JSON URL (via H.get) or a loader function returning a
     * Promise of messages. The result is cached, and a load already under way is shared, so
     * calling this from three places makes one request. A failed load is not cached.
     * `{locale}` in the URL is replaced with the code.
     * @param {string} locale
     * @param {string|Function} source - URL, or () => Promise<Object>
     * @param {{reload?: boolean}} [options]
     * @returns {Promise<Object>} The messages loaded
     */
    load(locale, source, options = {}) {
        const code = canonical(locale);
        const byFn = typeof source === 'function';
        // URLs are cached by locale + URL; loader functions by locale + the function itself.
        let store = loads;
        let id = `${code}|${byFn ? '' : String(source).replace('{locale}', code)}`;
        if (byFn) {
            if (!loaderLoads.has(code)) loaderLoads.set(code, new Map());
            store = loaderLoads.get(code);
            id = source;
        }
        if (store.has(id) && !options.reload) return store.get(id);

        const pending = byFn
            ? Promise.resolve().then(() => source(code))
            : http.get(String(source).replace('{locale}', code));

        const promise = pending.then(data => {
            const loaded = isPlainObject(data) ? data : {};
            i18n.add(code, loaded);
            emit('loaded', {locale: code, messages: loaded});
            // Messages for the locale on screen just arrived: show them.
            if (chain(current).includes(code)) i18n.translate();
            return loaded;
        }, error => {
            if (store.get(id) === promise) store.delete(id);
            throw error;
        });
        store.set(id, promise);
        return promise;
    },

    /**
     * Get the current locale, or set it. Setting fires `change`, sets `<html lang dir>`,
     * re-translates the document and (after `detect({storageKey})`) remembers the choice.
     * @param {string} [code]
     * @returns {string} The current locale
     */
    locale(code) {
        if (code === undefined) return current;
        const next = canonical(code);
        if (next === current) return current;
        const previous = current;
        current = next;
        if (storageKey) storage.set(storageKey, next);
        markDocument(next);
        emit('change', {locale: next, previous});
        i18n.translate();
        return current;
    },

    /**
     * Set the fallback locale(s) searched after the current one (and its parent language).
     * With no argument, returns them.
     * @param {string|string[]} [codes]
     * @returns {string[]}
     */
    fallback(codes) {
        if (codes === undefined) return [...fallbacks];
        fallbacks = (Array.isArray(codes) ? codes : [codes]).filter(Boolean).map(canonical);
        return [...fallbacks];
    },

    /**
     * Whether a key has a message in the current locale or its fallbacks.
     * @param {string} key
     * @param {{locale?: string}} [options]
     * @returns {boolean}
     */
    has(key, options = {}) {
        return lookup(key, options.locale ? canonical(options.locale) : current) !== null;
    },

    /**
     * Translate a key to plain text. Params fill `{name}` placeholders (not escaped - this is
     * text, not HTML); `count` chooses a plural form. A missing key returns `default` (itself
     * interpolated) or the key.
     * @param {string} key
     * @param {Object} [params]
     * @param {{locale?: string, default?: string, ordinal?: boolean}} [options]
     * @returns {string}
     */
    t(key, params, options = {}) {
        return render(key, params, options, String);
    },

    /**
     * Translate a key to HTML: the message's own markup is kept and every param is escaped.
     * The message itself is trusted (it is yours); `translate()` sanitises before inserting.
     * @param {string} key
     * @param {Object} [params]
     * @param {Object} [options] - As for t()
     * @returns {string}
     */
    html(key, params, options = {}) {
        return render(key, params, options, escapeHtml);
    },

    /**
     * Register the hook for a missing key: fn(key, locale). A string it returns is used as the
     * translation. Pass null to remove it.
     * @param {Function|null} fn
     * @returns {Object} i18n
     */
    onMissing(fn) {
        missingHook = typeof fn === 'function' ? fn : null;
        return i18n;
    },

    /**
     * Subscribe to 'change' | 'missing' | 'loaded'. Also dispatched on document as dm:i18n:<event>.
     * @param {string} event
     * @param {Function} fn
     * @returns {Function} Unsubscribe
     */
    on(event, fn) {
        if (typeof fn !== 'function') return () => {};
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(fn);
        return () => i18n.off(event, fn);
    },

    /**
     * Unsubscribe (with no fn, every listener for that event).
     * @param {string} event
     * @param {Function} [fn]
     * @returns {Object} i18n
     */
    off(event, fn) {
        if (!fn) listeners.delete(event);
        else listeners.get(event)?.delete(fn);
        return i18n;
    },

    /** @returns {string[]} Locales that have messages */
    locales() {
        return [...messages.keys()];
    },

    /**
     * Text direction of a locale: 'rtl' or 'ltr'.
     * @param {string} [code] - Defaults to the current locale
     * @returns {'rtl'|'ltr'}
     */
    dir(code = current) {
        const tag = canonical(code);
        try {
            const loc = new Intl.Locale(tag);
            const info = typeof loc.getTextInfo === 'function' ? loc.getTextInfo() : loc.textInfo;
            if (info && info.direction) return info.direction === 'rtl' ? 'rtl' : 'ltr';
            if (loc.script) return RTL_SCRIPTS.has(loc.script) ? 'rtl' : 'ltr';
        } catch {
            // No Intl.Locale: use the lists
        }
        const parts = tag.split('-');
        const script = parts.find(p => p.length === 4);
        if (script) return RTL_SCRIPTS.has(script[0].toUpperCase() + script.slice(1).toLowerCase()) ? 'rtl' : 'ltr';
        return RTL_LANGUAGES.has(parts[0].toLowerCase()) ? 'rtl' : 'ltr';
    },

    /**
     * Fill translations in the DOM: `[data-i18n]` (textContent), `[data-i18n-html]` (sanitised
     * HTML), `[data-i18n-attr="placeholder:key; title:key2"]`, each taking params from
     * `data-i18n-params` (JSON). What the page first said is kept and shown when a key is
     * missing, so authored text doubles as the default. Call it on content you add later.
     * @param {Element|Document|string|Object} [root=document] - Element, selector or Domma collection
     * @returns {number} Elements translated
     */
    translate(root) {
        if (typeof document === 'undefined') return 0;
        const sel = '[data-i18n],[data-i18n-html],[data-i18n-attr]';
        const els = new Set();
        for (const r of resolveRoots(root)) {
            if (!r) continue;
            if (r.nodeType === 1 && r.matches(sel)) els.add(r);
            if (typeof r.querySelectorAll === 'function') r.querySelectorAll(sel).forEach(el => els.add(el));
        }
        for (const el of els) translateElement(el);
        return els.size;
    },

    /**
     * Pick a locale from storage, the browser and/or `<html lang>`, in the order given, set
     * it, and return it. With `storageKey`, the choice (and every later `locale(code)`) is
     * kept in S under that key. With `supported`, only those (or their base language) count.
     * @param {{from?: string[], storageKey?: string, supported?: string[], fallback?: string, apply?: boolean}} [options]
     * @returns {string}
     */
    detect(options = {}) {
        const {from = ['storage', 'navigator', 'html'], supported, fallback, apply = true} = options;
        if (options.storageKey) storageKey = options.storageKey;
        const allowed = Array.isArray(supported) && supported.length ? supported.map(canonical) : null;
        const accept = (code) => {
            let tag;
            try {
                tag = canonical(code);
            } catch {
                return null;
            }
            if (!allowed) return tag;
            if (allowed.includes(tag)) return tag;
            const base = tag.split('-')[0];
            return allowed.find(a => a === base) || allowed.find(a => a.split('-')[0] === base) || null;
        };
        let found = null;
        for (const source of from) {
            let candidates = [];
            if (source === 'storage' && storageKey) candidates = [storage.get(storageKey)];
            else if (source === 'navigator' && typeof navigator !== 'undefined') {
                candidates = navigator.languages && navigator.languages.length ? [...navigator.languages] : [navigator.language];
            } else if (source === 'html' && typeof document !== 'undefined' && document.documentElement) {
                candidates = [document.documentElement.getAttribute('lang')];
            }
            for (const c of candidates) {
                if (typeof c === 'string' && c && (found = accept(c))) break;
            }
            if (found) break;
        }
        const chosen = found || (fallback ? canonical(fallback) : current);
        if (apply) {
            if (chosen === current) {
                // No change to announce, but the page should still say what it is.
                if (storageKey) storage.set(storageKey, chosen);
                markDocument(chosen);
            } else {
                i18n.locale(chosen);
            }
        }
        return chosen;
    },

    // ----- Formatting (Intl, in the current locale; `{locale}` in options overrides) -----

    /**
     * @param {number} n
     * @param {Intl.NumberFormatOptions & {locale?: string}} [opts]
     * @returns {string}
     */
    number(n, opts) {
        const [locale, rest] = splitLocale(opts);
        return cached('number', locale, rest, () => new Intl.NumberFormat(locale, rest)).format(n);
    },

    /**
     * @param {number} n
     * @param {string} code - ISO 4217 currency, e.g. 'GBP'
     * @param {Intl.NumberFormatOptions & {locale?: string}} [opts]
     * @returns {string}
     */
    currency(n, code, opts) {
        const [locale, rest] = splitLocale(opts);
        const o = {...rest, style: 'currency', currency: code};
        return cached('number', locale, o, () => new Intl.NumberFormat(locale, o)).format(n);
    },

    /**
     * Format a date. Accepts a Date, timestamp, date string or a D() wrapper.
     * An invalid date formats as ''.
     * @param {Date|number|string|Object} d
     * @param {Intl.DateTimeFormatOptions & {locale?: string}} [opts]
     * @returns {string}
     */
    date(d, opts) {
        const date = toDate(d);
        if (Number.isNaN(date.getTime())) return '';
        const [locale, rest] = splitLocale(opts);
        return cached('date', locale, rest, () => new Intl.DateTimeFormat(locale, rest)).format(date);
    },

    /**
     * "in 3 days", "2 hours ago" - Intl.RelativeTimeFormat.
     * @param {number} value - Negative for the past
     * @param {string} unit - 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
     * @param {Intl.RelativeTimeFormatOptions & {locale?: string}} [opts]
     * @returns {string}
     */
    relative(value, unit, opts) {
        const [locale, rest] = splitLocale(opts);
        return cached('relative', locale, rest, () => new Intl.RelativeTimeFormat(locale, rest)).format(value, unit);
    },

    /**
     * "a, b and c" - Intl.ListFormat.
     * @param {Iterable<string>} items
     * @param {Object} [opts] - Intl.ListFormat options plus `locale`
     * @returns {string}
     */
    list(items, opts) {
        const [locale, rest] = splitLocale(opts);
        return cached('list', locale, rest, () => new Intl.ListFormat(locale, rest)).format([...items].map(String));
    },

    /**
     * Forget every message, load, listener, hook and setting (tests, or a full reload).
     * @returns {Object} i18n
     */
    reset() {
        messages.clear();
        loads.clear();
        loaderLoads.clear();
        formatters.clear();
        listeners.clear();
        warned.clear();
        current = 'en';
        fallbacks = [];
        missingHook = null;
        storageKey = null;
        return i18n;
    }
};

/**
 * The message for a key, interpolated - or null when there is none (after reporting the miss).
 * A string from the onMissing hook counts as the message.
 */
function resolve(key, params, options, encode) {
    const locale = options && options.locale ? canonical(options.locale) : current;
    const found = lookup(key, locale);
    let text;
    if (found) {
        text = typeof found.message === 'string' ? found.message : chooseForm(found.message, params, found.locale, options);
    } else {
        text = reportMissing(key, locale);
        if (text === undefined) return null;
    }
    return interpolate(text, params, encode);
}

function render(key, params, options, encode) {
    const text = resolve(key, params, options, encode);
    if (text !== null) return text;
    if (options && typeof options.default === 'string') return interpolate(options.default, params, encode);
    // A key is not a message: give it back as it is, never interpolated.
    return encode === String ? key : escapeHtml(key);
}

function markDocument(code) {
    if (typeof document === 'undefined' || !document.documentElement) return;
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', i18n.dir(code));
}

function translateElement(el) {
    let orig = originals.get(el);
    if (!orig) {
        orig = {text: el.textContent, html: el.innerHTML, attrs: Object.create(null)};
        originals.set(el, orig);
    }
    const params = readParams(el);
    const htmlKey = el.getAttribute('data-i18n-html');
    const textKey = el.getAttribute('data-i18n');

    if (htmlKey) {
        const html = resolve(htmlKey, params, null, escapeHtml);
        el.innerHTML = html === null ? orig.html : sanitise(html);
    } else if (textKey) {
        const text = resolve(textKey, params, null, String);
        el.textContent = text === null ? orig.text : text;
    }

    const spec = el.getAttribute('data-i18n-attr');
    if (spec) {
        for (const [attr, key] of parseAttrList(spec)) {
            if (!(attr in orig.attrs)) orig.attrs[attr] = el.getAttribute(attr);
            const text = resolve(key, params, null, String);
            if (text !== null) el.setAttribute(attr, text);
            else if (orig.attrs[attr] == null) el.removeAttribute(attr);
            else el.setAttribute(attr, orig.attrs[attr]);
        }
    }
}

export default i18n;
