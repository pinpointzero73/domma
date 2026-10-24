/**
 * Domma i18n Module - TypeScript Declarations
 * Translations, plurals and Intl formatting: `Domma.i18n`, plus `Domma.t()`.
 */

/** A plural message: chosen by `params.count`; `=N` keys match exactly, `zero` matches 0. */
export interface I18nPluralForms {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
    /** Use ordinal rules (1st, 2nd, 3rd...) */
    ordinal?: boolean;
    [exact: `=${number}`]: string;
}

/** A select message: `select` names the param whose value picks the form; `other` otherwise. */
export interface I18nSelectForms {
    select: string;
    other: string;
    [value: string]: string;
}

/** Nested message tree; nesting becomes dot keys. */
export interface I18nMessages {
    [key: string]: string | number | boolean | I18nPluralForms | I18nSelectForms | I18nMessages;
}

export interface I18nTranslateOptions {
    /** Translate in this locale instead of the current one */
    locale?: string;
    /** Returned (interpolated) when the key is missing, instead of the key */
    default?: string;
    /** Choose plural forms by ordinal rules */
    ordinal?: boolean;
}

export interface I18nDetectOptions {
    /** Sources in order. Default ['storage', 'navigator', 'html'] */
    from?: Array<'storage' | 'navigator' | 'html'>;
    /** S key: read in 'storage', and every later locale(code) is saved there */
    storageKey?: string;
    /** Only these locales (or their base language) are accepted */
    supported?: string[];
    /** Used when nothing matches (else the current locale stays) */
    fallback?: string;
    /** Set the found locale (default true) */
    apply?: boolean;
}

export interface I18nChangeDetail { locale: string; previous: string; }
export interface I18nMissingDetail { key: string; locale: string; }
export interface I18nLoadedDetail { locale: string; messages: I18nMessages; }

type WithLocale<T> = T & { locale?: string };

export interface I18n {
    /** Add (merge) messages for a locale */
    add(locale: string, messages: I18nMessages): I18n;
    /** Load JSON via H.get (`{locale}` in the URL is replaced) or a loader. Cached and deduped. */
    load(locale: string, source: string | ((locale: string) => Promise<I18nMessages> | I18nMessages), options?: { reload?: boolean }): Promise<I18nMessages>;
    /** Current locale */
    locale(): string;
    /** Set the locale: fires change, sets <html lang dir>, re-translates the document */
    locale(code: string): string;
    /** Fallback locales searched after the current one */
    fallback(codes?: string | string[]): string[];
    has(key: string, options?: { locale?: string }): boolean;
    /** Plain text: params are not escaped */
    t(key: string, params?: Record<string, any> | null, options?: I18nTranslateOptions): string;
    /** HTML: the message's markup is kept, params are escaped */
    html(key: string, params?: Record<string, any> | null, options?: I18nTranslateOptions): string;
    /** Hook for a missing key; a returned string is used as the translation */
    onMissing(fn: ((key: string, locale: string) => string | void) | null): I18n;
    on(event: 'change', fn: (detail: I18nChangeDetail) => void): () => void;
    on(event: 'missing', fn: (detail: I18nMissingDetail) => void): () => void;
    on(event: 'loaded', fn: (detail: I18nLoadedDetail) => void): () => void;
    off(event: 'change' | 'missing' | 'loaded', fn?: (...args: any[]) => void): I18n;
    /** Locales that have messages */
    locales(): string[];
    /** Text direction of a locale (default: the current one) */
    dir(code?: string): 'rtl' | 'ltr';
    /** Fill [data-i18n], [data-i18n-html] (sanitised) and [data-i18n-attr] under root */
    translate(root?: Element | Document | string | ArrayLike<Element>): number;
    /** Pick and set a locale from storage / navigator / <html lang> */
    detect(options?: I18nDetectOptions): string;
    number(n: number | bigint, opts?: WithLocale<Intl.NumberFormatOptions>): string;
    currency(n: number | bigint, code: string, opts?: WithLocale<Intl.NumberFormatOptions>): string;
    /** Date, timestamp, string or a D() wrapper; '' when invalid */
    date(d: Date | number | string | { toDate(): Date }, opts?: WithLocale<Intl.DateTimeFormatOptions>): string;
    relative(value: number, unit: Intl.RelativeTimeFormatUnit, opts?: WithLocale<Intl.RelativeTimeFormatOptions>): string;
    list(items: Iterable<string>, opts?: WithLocale<{ type?: 'conjunction' | 'disjunction' | 'unit'; style?: 'long' | 'short' | 'narrow' }>): string;
    /** Forget all messages, loads, listeners and settings */
    reset(): I18n;
}

export declare const i18n: I18n;
