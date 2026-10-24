/**
 * Domma - Dynamic Object Manipulation & Modeling API
 * TypeScript declarations.
 *
 * Everything under ./generated/ is written by `npm run build:types` from the JSDoc in src/ -
 * edit the JSDoc there, never the output (`npm run check:types` fails when the two differ).
 *
 * This file is the only hand-written part. It holds what JSDoc cannot say:
 *   1. `Domma` itself. tsc emits the Domma function with the statics src/index.js assigns, but
 *      `noConflict` is attached inside installGlobals() and `flags` / `FL` by the domma-flags
 *      bundle, so neither is on it. `DommaStatic` (a @typedef in src/index.js) adds them; the
 *      default and named `Domma` exports are re-declared with that type here.
 *   2. Globals: `declare global` for the aliases installGlobals() puts on window (and `FL`,
 *      which domma-flags adds), and `Window.DommaOptions`.
 *   3. Which modules' types are public: the `export type *` list below.
 *   4. `$('.x')[0]`: the DommaCollection constructor assigns `this[i]`, and a JS class cannot
 *      declare an index signature in JSDoc, so it is added by augmentation.
 */
import type {DommaStatic} from './generated/src/index.js';
import type {DommaLoadOptions} from './generated/src/globals.js';
import type {Flags} from './generated/src/flags.js';

type Exports = typeof import('./generated/src/index.js');

// The runtime exports of the ES module ($, _, M, D, S, A, F, H, E, I, T, R, B, components, smoothCaret,
// i18n) and the types declared in src/index.js. `Domma` is re-declared below.
export * from './generated/src/index.js';

declare const Domma: DommaStatic;
export default Domma;
export {Domma};

// Types (and `typeof` handles) of every public module. Type-only: the ES module's runtime exports are
// the ones above, so `import {utils} from 'domma-js'` is refused rather than undefined at runtime.
export type * from './generated/src/dom.js';
export type * from './generated/src/utils.js';
export type * from './generated/src/dates.js';
export type * from './generated/src/models.js';
export type * from './generated/src/config.js';
export type * from './generated/src/elements.js';
export type * from './generated/src/tables.js';
export type * from './generated/src/storage.js';
export type * from './generated/src/http.js';
export type * from './generated/src/theme.js';
export type * from './generated/src/icons.js';
export type * from './generated/src/flags.js';
export type * from './generated/src/smooth-caret.js';
export type * from './generated/src/i18n.js';
export type * from './generated/src/globals.js';
export type * from './generated/src/router.js';
export type * from './generated/src/auth.js';
export type * from './generated/src/forms.js';
export type * from './generated/src/effects.js';
export type * from './generated/src/component-factory.js';
export type * from './generated/src/web-components/base/domma-element.js';
export type * from './generated/src/component.js';
export type * from './generated/src/popover.js';
export type * from './generated/src/context-menu.js';
export type * from './generated/src/sortable.js';
export type * from './generated/src/skeleton.js';
export type * from './generated/src/avatar.js';
export type * from './generated/src/input-group.js';
export type * from './generated/src/treeview.js';
export type * from './generated/src/components/card.js';
export type * from './generated/src/components/modal.js';
export type * from './generated/src/components/tooltip.js';
export type * from './generated/src/components/badge.js';
export type * from './generated/src/components/loader.js';
export type * from './generated/src/components/back-to-top.js';
export type * from './generated/src/components/toast.js';
export type * from './generated/src/components/focus-trap.js';
export type * from './generated/src/components/command-palette.js';
export type * from './generated/src/components/split-pane.js';
export type * from './generated/src/components/virtual-list.js';
export type * from './generated/src/components/dropzone.js';
export type * from './generated/src/components/range-slider.js';

declare module './generated/src/dom.js' {
    interface DommaCollection {
        /** The elements by position - `$('.x')[0]` is `$('.x').get(0)` */
        [index: number]: HTMLElement;
    }
}

declare global {
    /** Domma - jQuery-style selection plus every module (`Domma.utils`, `Domma.elements`, ...) */
    const Domma: DommaStatic;
    /** Alias for Domma */
    const $: DommaStatic;
    /** Utilities (Lodash-style) - `Domma.utils` */
    const _: Exports['_'];
    /** Reactive models and pub/sub - `Domma.models` */
    const M: Exports['M'];
    /** Dates (Moment-style) - `Domma.dates` */
    const D: Exports['D'];
    /** localStorage wrapper - `Domma.storage` */
    const S: Exports['S'];
    /** Auth helpers - `Domma.auth` */
    const A: Exports['A'];
    /** Forms - `Domma.forms` */
    const F: Exports['F'];
    /** HTTP client - `Domma.http` */
    const H: Exports['H'];
    /** UI components - `Domma.elements` */
    const E: Exports['E'];
    /** Icons - `Domma.icons` */
    const I: Exports['I'];
    /** Tables - `Domma.tables` */
    const T: Exports['T'];
    /** Hash router - `Domma.router` */
    const R: Exports['R'];
    /** Blueprint composition - `B.extend`, `B.pick`, `B.omit` */
    const B: Exports['B'];
    /** Nation flags - only once the opt-in domma-flags bundle is loaded */
    const FL: Flags;

    interface Window {
        /** Options read when Domma loads - set before the script tag. */
        DommaOptions?: DommaLoadOptions;
    }
}
