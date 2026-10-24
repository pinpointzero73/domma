# 

<!-- website -->


### i18n

*   New `Domma.i18n` module, with `Domma.t(key, params)` as the shortcut: messages as nested JSON
    (flattened to dot keys, merged on `add()`), `load()` from a URL via `H.get` or a loader (cached,
    concurrent loads shared), a fallback chain (`fr-CA` -> `fr` -> fallbacks).
*   Plurals and select as objects of forms (`{one, few, many, other, '=0'}`, `{select: 'gender', ...}`)
    chosen by `Intl.PluralRules`, ordinals included. No ICU parser to ship.
*   `t()` returns plain text; `html()` keeps the message's markup and escapes every param. Messages
    are never evaluated.
*   `number()`, `currency()`, `date()` (Date, timestamp, string or `D()`), `relative()` and `list()`
    over cached `Intl` formatters in the current locale.
*   `translate(root)` fills `data-i18n`, `data-i18n-html` (sanitised) and `data-i18n-attr`, with
    `data-i18n-params`; changing locale sets `<html lang dir>` (rtl for Arabic, Hebrew, Persian,
    Urdu...) and re-translates the page. `detect()` picks a locale from storage, the browser or
    `<html lang>` and can remember it with `S`.
*   Missing keys return the key (or `default`), fire `missing` and an `onMissing` hook, and warn once;
    `window.DommaOptions = {i18nWarnings: false}` silences them. Events `change`, `missing`, `loaded`
    via `i18n.on()` and as `dm:i18n:*` on document.
*   Types in `assets/types/i18n.d.ts`; guide in `docs/I18n.md`; showcase page `showcase/i18n/`.
