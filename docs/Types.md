# Types

Domma ships TypeScript declarations with the npm package (`"types"` and `exports["."].types` point at
`assets/types/index.d.ts`). They are **generated from the JSDoc in `src/`** - the JSDoc is the source of truth.

```ts
import Domma, {$, E, H} from 'domma-js';
import type {DommaCollection, ModalInstance} from 'domma-js';

const user = await H.get<User>('/api/user');   // Promise<User>
const modal: ModalInstance = E.modal({title: 'Hello'});
```

A page that loads `domma.min.js` with a script tag gets the globals (`$`, `_`, `M`, `D`, `S`, `A`, `F`, `H`,
`E`, `I`, `T`, `R`, `B`, `Domma`) and `window.DommaOptions` from the same file - point `jsconfig.json` or
`tsconfig.json` at it (`/// <reference path="node_modules/domma-js/assets/types/index.d.ts" />` also works).

## Where to edit

| What                                   | Where                                                                      |
|----------------------------------------|----------------------------------------------------------------------------|
| A method's parameters, return, generics | The JSDoc above it in `src/` (`@param`, `@returns`, `@template`, `@overload`) |
| An options object                      | An `@typedef {object} XOptions` with `@property` lines next to the code     |
| The name of an instance type           | `@typedef {Modal} ModalInstance` (or the exported class)                    |
| Globals, `Domma.noConflict`, which modules are public | `assets/types/index.d.ts` - the only hand-written file             |

Never edit `assets/types/generated/` - it is rewritten on every build.

Two tsc habits to know:

- Every top-level `@typedef` in a module is exported. Two modules exporting the same name make it ambiguous
  in the public index (TS2308), so grep before adding one.
- An object literal whose members are later assigned to (`elements.contextMenu.closeAll = ...`) is emitted
  as a namespace holding only those assignments. `/** @type {Elements} */` on the const, with an
  `@typedef {object} Elements` describing it, keeps the members.

## Regenerate

```bash
npm run build:types        # also the last step of npm run build
```

It runs `tsc -p tsconfig.types.json` (`--allowJs --declaration --emitDeclarationOnly`, entry points
`src/index.js` and `src/flags-bundle.js`) into `assets/types/generated/`, and copies `domma-reactive`'s own
declarations to `generated/vendor/` (it is bundled into Domma, not a dependency of it). tsc is the exact
version pinned in `devDependencies`; without it in `node_modules`, the script runs it through `npx`.
Commit the result with the JSDoc change.

## The catalogue

`assets/types/catalogue.json` (`import 'domma-js/types/catalogue.json'`) is the same information for tools
that cannot run TypeScript - a page editor checking `{"component": "carousel", "options": {...}}`, say.
`npm run build:types` writes it after the declarations (`scripts/build-type-catalogue.mjs`, which reads the
generated `.d.ts`, never `src/`):

```json
{
  "components": {"carousel": {"factory": "E.carousel", "options": "CarouselOptions"}},
  "setup": ["SelectorConfig", "InitialProperties", "EventAction"],
  "types": {"CarouselOptions": {"interval": {"kind": "number", "doc": "Autoplay interval in ms"},
                                "animation": {"kind": "enum", "values": ["slide", "fade", "crossfade"]}}}
}
```

`components` is every `ComponentType` `$.setup()` can create, with the factory it calls and the name of its
options type. A property's `kind` is `boolean`, `number`, `string`, `enum` (with `values`), `function`,
`array`, `object` or `any`; `kinds` lists them when it takes several, `nullable` says null is allowed, `type`
names a nested type in `types`, and `each` describes one value of a record. `doc` is the JSDoc line. Only
Domma's own types are described, not the DOM's.

## The gate

```bash
npm run check:types        # part of make check, so of every release
```

1. Regenerates into a temp directory and fails if anything differs from the committed
   `assets/types/generated/` - JSDoc changed without `npm run build:types`, or the output edited by hand.
2. Type-checks `tests/types/` with `tsc --noEmit --strict` against the published entry, resolving
   `'domma-js'` through `package.json` `exports` as a user's project does. `consumer.ts` is a module using
   the public API; `globals.ts` is a classic script using the globals. Each `@ts-expect-error` there proves a
   type is not `any` - add a line when a new public call matters.
3. Rebuilds the catalogue from the committed declarations and fails if `assets/types/catalogue.json` differs.
