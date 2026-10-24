export namespace i18n {
    /**
     * Add messages for a locale. Nested objects become dot keys; later calls merge (a key
     * already there is replaced, everything else is kept).
     * @param {string} locale
     * @param {I18nMessages} source
     * @returns {I18n} i18n
     */
    function add(locale: string, source: I18nMessages): I18n;
    /**
     * Load a locale's messages from a JSON URL (via H.get) or a loader function returning a
     * Promise of messages. The result is cached, and a load already under way is shared, so
     * calling this from three places makes one request. A failed load is not cached.
     * `{locale}` in the URL is replaced with the code.
     * @param {string} locale
     * @param {string|((locale: string) => Promise<I18nMessages>|I18nMessages)} source - URL, or () => Promise<Object>
     * @param {{reload?: boolean}} [options]
     * @returns {Promise<I18nMessages>} The messages loaded
     */
    function load(locale: string, source: string | ((locale: string) => Promise<I18nMessages> | I18nMessages), options?: {
        reload?: boolean;
    }): Promise<I18nMessages>;
    /**
     * Get the current locale.
     * @overload
     * @returns {string} The current locale
     */
    function locale(): string;
    /**
     * Set the locale: fires change, sets <html lang dir>, re-translates the document.
     * @overload
     * @param {string} code
     * @returns {string} The current locale
     */
    function locale(code: string): string;
    /**
     * Set the fallback locale(s) searched after the current one (and its parent language).
     * With no argument, returns them.
     * @param {string|string[]} [codes]
     * @returns {string[]}
     */
    function fallback(codes?: string | string[]): string[];
    /**
     * Whether a key has a message in the current locale or its fallbacks.
     * @param {string} key
     * @param {{locale?: string}} [options]
     * @returns {boolean}
     */
    function has(key: string, options?: {
        locale?: string;
    }): boolean;
    /**
     * Translate a key to plain text. Params fill `{name}` placeholders (not escaped - this is
     * text, not HTML); `count` chooses a plural form. A missing key returns `default` (itself
     * interpolated) or the key.
     * @param {string} key
     * @param {Record<string, any>|null} [params]
     * @param {I18nTranslateOptions} [options]
     * @returns {string}
     */
    function t(key: string, params?: Record<string, any> | null, options?: I18nTranslateOptions): string;
    /**
     * Translate a key to HTML: the message's own markup is kept and every param is escaped.
     * The message itself is trusted (it is yours); `translate()` sanitises before inserting.
     * @param {string} key
     * @param {Record<string, any>|null} [params]
     * @param {I18nTranslateOptions} [options] - As for t()
     * @returns {string}
     */
    function html(key: string, params?: Record<string, any> | null, options?: I18nTranslateOptions): string;
    /**
     * Register the hook for a missing key: fn(key, locale). A string it returns is used as the
     * translation. Pass null to remove it.
     * @param {((key: string, locale: string) => string|void)|null} fn
     * @returns {I18n} i18n
     */
    function onMissing(fn: ((key: string, locale: string) => string | void) | null): I18n;
    /**
     * @overload
     * @param {'change'} event
     * @param {(detail: I18nChangeDetail) => void} fn
     * @returns {() => void} Unsubscribe
     */
    function on(event: "change", fn: (detail: I18nChangeDetail) => void): () => void;
    /**
     * @overload
     * @param {'missing'} event
     * @param {(detail: I18nMissingDetail) => void} fn
     * @returns {() => void} Unsubscribe
     */
    function on(event: "missing", fn: (detail: I18nMissingDetail) => void): () => void;
    /**
     * @overload
     * @param {'loaded'} event
     * @param {(detail: I18nLoadedDetail) => void} fn
     * @returns {() => void} Unsubscribe
     */
    function on(event: "loaded", fn: (detail: I18nLoadedDetail) => void): () => void;
    /**
     * Unsubscribe (with no fn, every listener for that event).
     * @param {'change'|'missing'|'loaded'} event
     * @param {(...args: any[]) => void} [fn]
     * @returns {I18n} i18n
     */
    function off(event: "change" | "missing" | "loaded", fn?: (...args: any[]) => void): I18n;
    /** @returns {string[]} Locales that have messages */
    function locales(): string[];
    /**
     * Text direction of a locale: 'rtl' or 'ltr'.
     * @param {string} [code] - Defaults to the current locale
     * @returns {'rtl'|'ltr'}
     */
    function dir(code?: string): "rtl" | "ltr";
    /**
     * Fill translations in the DOM: `[data-i18n]` (textContent), `[data-i18n-html]` (sanitised
     * HTML), `[data-i18n-attr="placeholder:key; title:key2"]`, each taking params from
     * `data-i18n-params` (JSON). What the page first said is kept and shown when a key is
     * missing, so authored text doubles as the default. Call it on content you add later.
     * @param {Element|Document|string|ArrayLike<Element>} [root=document] - Element, selector or Domma collection
     * @returns {number} Elements translated
     */
    function translate(root?: Element | Document | string | ArrayLike<Element>): number;
    /**
     * Pick a locale from storage, the browser and/or `<html lang>`, in the order given, set
     * it, and return it. With `storageKey`, the choice (and every later `locale(code)`) is
     * kept in S under that key. With `supported`, only those (or their base language) count.
     * @param {I18nDetectOptions} [options]
     * @returns {string}
     */
    function detect(options?: I18nDetectOptions): string;
    /**
     * @param {number|bigint} n
     * @param {WithLocale<Intl.NumberFormatOptions>} [opts]
     * @returns {string}
     */
    function number(n: number | bigint, opts?: WithLocale<Intl.NumberFormatOptions>): string;
    /**
     * @param {number|bigint} n
     * @param {string} code - ISO 4217 currency, e.g. 'GBP'
     * @param {WithLocale<Intl.NumberFormatOptions>} [opts]
     * @returns {string}
     */
    function currency(n: number | bigint, code: string, opts?: WithLocale<Intl.NumberFormatOptions>): string;
    /**
     * Format a date. Accepts a Date, timestamp, date string or a D() wrapper.
     * An invalid date formats as ''.
     * @param {Date|number|string|{toDate(): Date}} d
     * @param {WithLocale<Intl.DateTimeFormatOptions>} [opts]
     * @returns {string}
     */
    function date(d: Date | number | string | {
        toDate(): Date;
    }, opts?: WithLocale<Intl.DateTimeFormatOptions>): string;
    /**
     * "in 3 days", "2 hours ago" - Intl.RelativeTimeFormat.
     * @param {number} value - Negative for the past
     * @param {Intl.RelativeTimeFormatUnit} unit - 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
     * @param {WithLocale<Intl.RelativeTimeFormatOptions>} [opts]
     * @returns {string}
     */
    function relative(value: number, unit: Intl.RelativeTimeFormatUnit, opts?: WithLocale<Intl.RelativeTimeFormatOptions>): string;
    /**
     * "a, b and c" - Intl.ListFormat.
     * @param {Iterable<string>} items
     * @param {WithLocale<{type?: 'conjunction'|'disjunction'|'unit', style?: 'long'|'short'|'narrow'}>} [opts] - Intl.ListFormat options plus `locale`
     * @returns {string}
     */
    function list(items: Iterable<string>, opts?: WithLocale<{
        type?: "conjunction" | "disjunction" | "unit";
        style?: "long" | "short" | "narrow";
    }>): string;
    /**
     * Forget every message, load, listener, hook and setting (tests, or a full reload).
     * @returns {I18n} i18n
     */
    function reset(): I18n;
}
export default i18n;
/**
 * A plural message: chosen by `params.count`; `=N` keys match exactly, `zero` matches 0.
 * `ordinal: true` uses ordinal rules (1st, 2nd, 3rd...).
 */
export type I18nPluralForms = {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
    ordinal?: boolean;
    [exact: `=${number}`]: string;
};
/**
 * A select message: `select` names the param whose value picks the form; `other` otherwise.
 */
export type I18nSelectForms = {
    select: string;
    other: string;
    [value: string]: string;
};
/**
 * Nested message tree; nesting becomes dot keys.
 */
export type I18nMessages = {
    [key: string]: string | number | boolean | I18nPluralForms | I18nSelectForms | I18nMessages;
};
export type I18nTranslateOptions = {
    /**
     * Translate in this locale instead of the current one
     */
    locale?: string;
    /**
     * Returned (interpolated) when the key is missing, instead of the key
     */
    default?: string;
    /**
     * Choose plural forms by ordinal rules
     */
    ordinal?: boolean;
};
export type I18nDetectOptions = {
    /**
     * Sources in order. Default ['storage', 'navigator', 'html']
     */
    from?: Array<"storage" | "navigator" | "html">;
    /**
     * S key: read in 'storage', and every later locale(code) is saved there
     */
    storageKey?: string;
    /**
     * Only these locales (or their base language) are accepted
     */
    supported?: string[];
    /**
     * Used when nothing matches (else the current locale stays)
     */
    fallback?: string;
    /**
     * Set the found locale (default true)
     */
    apply?: boolean;
};
export type I18nChangeDetail = {
    locale: string;
    previous: string;
};
export type I18nMissingDetail = {
    key: string;
    locale: string;
};
export type I18nLoadedDetail = {
    locale: string;
    messages: I18nMessages;
};
/**
 * Formatter options plus an optional `locale` override.
 */
export type WithLocale<T> = T & {
    locale?: string;
};
export type I18n = typeof i18n;
