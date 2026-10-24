/**
 * The adapter between Domma's data and the binding engine.
 *
 * ── The contract, and the two ways it fails ──────────────────────────────────
 *
 * `domma-reactive` resolves every expression - `{{ }}`, `data-bind-*`,
 * `data-if`, `data-on-*`, `data-model` - against ONE object, and writes back
 * through that same object. Both halves matter, and getting either wrong fails
 * SILENTLY, in two specific ways that this module exists to prevent:
 *
 *   1. A read-only snapshot swallows every `data-model` write. The control
 *      still looks correct, because what you see while typing is your own
 *      keystrokes, but the model never changes and nothing else bound to that
 *      field moves.
 *
 *   2. An object carrying no functions resolves no `data-on-*` handler. Every
 *      event binding logs "did not resolve to a function" and does nothing,
 *      while every other binding on the same element works perfectly.
 *
 * Both shipped, in `component-factory.js`, and were fixed in v0.37.0. The fix
 * then existed twice - once there and once in `models.js` for `M.applyBindings`
 * - in two slightly different shapes. This is that fix, once.
 *
 * ── Why a Proxy and not a merged object ──────────────────────────────────────
 *
 * Because reads must stay LIVE. A component's data is a snapshot, but
 * `M.applyBindings` resolves against `model.tracked()`, where every read
 * registers a dependency and every write routes through `set()`. Copying that
 * into a plain object would flatten it into a snapshot and lose both halves.
 *
 * @module binding-source
 */
/**
 * Build the object the binding engine reads from and writes through.
 *
 * @template {object} T
 * @param {T}        primary            Reads resolve here first; writes land here.
 *                                      For `M.applyBindings` this is a model's
 *                                      `tracked()` view, which is what makes a
 *                                      write reach the model.
 * @param {object}   [options]
 * @param {Record<string, any>} [options.fallback] Consulted only when `primary` has no such
 *                                      key. Event handlers live here, so a data
 *                                      field of the same name always wins - a
 *                                      template mostly renders data, and a method
 *                                      quietly shadowing a rendered value is the
 *                                      worse failure.
 * @param {(key: string, value: any) => void} [options.onWrite]  Called `(key, value)` after a write lands
 *                                      on `primary`. Used where `primary` is a
 *                                      snapshot that cannot route the write
 *                                      itself, so the model has to be told.
 * @returns {T} `primary` itself when there is nothing to layer, otherwise a
 *                   Proxy over it.
 */
export function createBindingSource<T extends unknown>(primary: T, { fallback, onWrite }?: {
    fallback?: Record<string, any>;
    onWrite?: (key: string, value: any) => void;
}): T;
