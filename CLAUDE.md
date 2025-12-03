# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Build:**
```bash
npm install
npm run build
```

Outputs minified + obfuscated bundles to `dist/`.

**Run tests:**
Open `tests/test.html` in a browser.

## Architecture

Domma is a lightweight JavaScript toolkit with four core modules exposed through a single entry point (`src/index.js`):

- **dom.js** - Full jQuery-compatible DOM API. The main `Domma(selector)` function returns a `DommaCollection` with chainable methods:
  - **Traversal** (22): `find()`, `children()`, `parent()`, `parents()`, `closest()`, `siblings()`, `next()`, `prev()`, `nextAll()`, `prevAll()`, `first()`, `last()`, `eq()`, `get()`, `filter()`, `not()`, `is()`, `has()`, `add()`, `contents()`, `toArray()`, `index()`
  - **Content** (3): `html()`, `text()`, `val()`
  - **Attributes** (6): `attr()`, `removeAttr()`, `prop()`, `removeProp()`, `data()`, `removeData()`
  - **CSS/Classes** (5): `css()`, `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`
  - **DOM Manipulation** (16): `append()`, `prepend()`, `after()`, `before()`, `appendTo()`, `prependTo()`, `insertAfter()`, `insertBefore()`, `wrap()`, `wrapAll()`, `wrapInner()`, `unwrap()`, `remove()`, `detach()`, `empty()`, `clone()`, `replaceWith()`, `replaceAll()`
  - **Events** (22+): `on()` (with delegation), `off()`, `one()`, `trigger()`, `hover()` + shortcuts (`click`, `dblclick`, `focus`, `blur`, `change`, `submit`, `keydown`, `keyup`, `keypress`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`, `mousedown`, `mouseup`, `mousemove`, `scroll`, `resize`)
  - **Effects** (12): `show()`, `hide()`, `toggle()`, `fadeIn()`, `fadeOut()`, `fadeToggle()`, `fadeTo()`, `slideUp()`, `slideDown()`, `slideToggle()`, `animate()`, `stop()`, `delay()`
  - **Dimensions** (11): `width()`, `height()`, `innerWidth()`, `innerHeight()`, `outerWidth()`, `outerHeight()`, `offset()`, `position()`, `scrollTop()`, `scrollLeft()`, `offsetParent()`

- **http.js** - Fetch-based HTTP client with `get()`, `post()`, `put()`, `delete()` methods. All methods return promises resolving to JSON.

- **utils.js** - 120+ Lodash-compatible utility functions:
  - **Array** (30+): `chunk()`, `compact()`, `concat()`, `difference()`, `drop()`, `flatten()`, `flattenDeep()`, `head()`, `last()`, `initial()`, `tail()`, `nth()`, `pull()`, `pullAt()`, `remove()`, `reverse()`, `slice()`, `take()`, `uniq()`, `uniqBy()`, `without()`, `zip()`, `unzip()`, `intersection()`, `union()`, `xor()`
  - **Collection** (20+): `each()`, `filter()`, `find()`, `findIndex()`, `groupBy()`, `keyBy()`, `map()`, `orderBy()`, `partition()`, `reduce()`, `reduceRight()`, `reject()`, `sample()`, `shuffle()`, `size()`, `some()`, `every()`, `sortBy()`, `includes()`, `countBy()`
  - **Function** (18): `debounce()`, `throttle()`, `memoize()`, `once()`, `after()`, `before()`, `curry()`, `curryRight()`, `flip()`, `negate()`, `partial()`, `partialRight()`, `rearg()`, `spread()`, `unary()`, `wrap()`, `flow()`, `flowRight()`
  - **Object** (30+): `get()`, `set()`, `has()`, `pick()`, `omit()`, `merge()`, `defaults()`, `defaultsDeep()`, `cloneDeep()`, `keys()`, `values()`, `entries()`, `fromEntries()`, `assign()`, `mapKeys()`, `mapValues()`, `invert()`, `invertBy()`, `findKey()`, `forOwn()`, `forIn()`, `transform()`, `update()`, `unset()`
  - **Lang** (18): `isArray()`, `isObject()`, `isPlainObject()`, `isFunction()`, `isString()`, `isNumber()`, `isBoolean()`, `isNil()`, `isNull()`, `isUndefined()`, `isEmpty()`, `isEqual()`, `isDate()`, `isRegExp()`, `isSymbol()`, `isElement()`, `isNaN()`, `toArray()`
  - **Math** (14): `sum()`, `sumBy()`, `mean()`, `meanBy()`, `max()`, `maxBy()`, `min()`, `minBy()`, `ceil()`, `floor()`, `round()`, `clamp()`, `inRange()`, `random()`
  - **String** (24): `camelCase()`, `capitalize()`, `kebabCase()`, `lowerCase()`, `snakeCase()`, `startCase()`, `upperCase()`, `upperFirst()`, `lowerFirst()`, `trim()`, `trimStart()`, `trimEnd()`, `pad()`, `padStart()`, `padEnd()`, `repeat()`, `replace()`, `split()`, `startsWith()`, `endsWith()`, `truncate()`, `escape()`, `unescape()`, `words()`

- **config.js** - JSON configuration engine allowing declarative DOM behaviour. `Domma.setup(config)` processes a config object where keys are selectors and values define `initial` properties and `events` with associated actions.

## Module Pattern

All modules use ES modules. The main export pattern:
```javascript
const Domma = (selector) => dom(selector);
Domma.http = http;
Domma.utils = utils;
Domma.setup = (config) => configEngine.process(config);

// Short aliases (like jQuery's $ and Lodash's _)
const $ = Domma;
const _ = Domma.utils;

export default Domma;
export { Domma, $, _ };
```

## Aliases

| Full Name | Alias | Description |
|-----------|-------|-------------|
| `Domma` | `$` | DOM selection/manipulation |
| `Domma.utils` | `_` | Utility functions |

All three (`Domma`, `$`, `_`) are exposed globally in browser environments.

## Testing

Tests use a simple custom runner with basic `assert(condition, message)` pattern. Run in browser via `tests/test.html`.
