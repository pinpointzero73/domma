# API conventions, one implementation per component

### API conventions (non-breaking)

- Every `onX` option on the UI components now has a matching `.on('x', fn)` event and a bubbling `dm:<component>:x` DOM event with `detail = {instance, args}`. Options run exactly as before.
- Overlays (dropdown, sidebar, autocomplete, pillbox, slideover, date picker, context menu, cookie consent) all answer `open()`, `close()`, `toggle()` and `isOpen()`; `show()`, `hide()` and `isVisible()` stay as permanent aliases. Popover gains `open()`, `close()` and `isVisible()`.
- The aliases, close buttons, backdrops and Escape all call `close()` by name, so a "discard changes?" guard patched onto `instance.close` covers every way out.
- Slideover, dropdown, sidebar, date picker, autocomplete, pillbox and context menu fire a cancelable `beforeclose` (and `beforeopen`): return `false` from `onBeforeClose` or a listener, or call `preventDefault()`, to keep it open. `destroy()` always closes.
- `E.buttonGroup()` and `E.listGroup()` return the first instance when the selector matches several elements, with `.all()` (and `E.buttonGroup.all()` / `E.listGroup.all()`) for the list. Using the result as an array still works, with a one-time warning, until 1.0.
- `E.get(el)` finds skeletons, avatars, avatar groups and choosers as well as every component; `E.popover.getInstance`, `E.skeleton.get`, `E.avatar.get` and `E.avatarGroup.get` give the same answer.
- `E.chooser()` with a missing host returns an inert chooser instead of `null`, and choosers have an `element` property.
- `E.notify({title, body, ...})` works as well as `E.notify(title, options)`.
- Alarms: `removeAlarm(id)` is the name; `remove(id)` keeps working.
- Fixes: a sidebar's floating toggle is removed on `destroy()`; a destroyed cookie consent is no longer handed back by `E.cookieConsent()`; destroying a slideover in the frame it opened no longer throws.

See "Conventions" in docs/Components.md.


### One implementation per component

`E.card`, `E.modal`, `E.tooltip`, `E.badge`, `E.numberBadge`, `E.toast`, `E.loader` (with `showLoader`, `hideLoader`, `fullscreenLoader`), `E.backToTop`, `E.createModal` and `E.showModal` now each have one implementation, a component like the rest (`src/components/`). The `<domma-*>` tags are thin shells that build that same component on themselves.

- The element you pass is the component's element. Nothing replaces it any more, so references you hold, listeners bound to it, `#id` lookups and `E.get(el)` all keep working. Every instance has a real `options` object.
- Theme colours reach every one of them. Inside the old shadow roots, `--dm-primary`, `--dm-success`, the greys and the shadows were declared in terms of themselves, which made them invalid, so each component drew its hard-coded fallback whatever the theme. In Chrome under `ocean-dark`, the page's primary was `#48cae4` and a badge's was `rgb(79, 70, 229)`. Card, badge, number badge, tooltip, toast, loader and back-to-top are now plain page markup styled by `elements.css`. The modal keeps a shadow root (on your element) and now uses the theme.
- Events follow the shared conventions: every `onX` option has a matching `.on('x')` and `dm:<component>:x` DOM event. The old unprefixed `close`, `show`, `click` and `remove` events no longer leak out of nested components, and a badge click fires once.
- Modal: `onClosed` fires, and factory modals honour `onOpened`, `onClosed`, `headerClass`, `bodyClass` and `className`. New cancelable `onBeforeOpen` / `onBeforeClose` (also `.on('beforeclose')` and `dm:modal:beforeclose`). The X, backdrop and Escape call `close()` by name, so a replaced `close()` is honoured, and Escape closes only the top modal. The unprefixed `open` and `close` DOM events are still dispatched on the element, once per open or close, until 1.0. `show()` / `hide()` stay as aliases of `open()` / `close()`. `showModal()` resolves with `null` when the modal is closed without a button.
- Modal content (`content`, `setContent()`) is sanitised as `$().html()` does, which removes inputs and buttons. Pass `{safe: false}` for trusted markup. Selector mode keeps your `.modal-header` / `.modal-body` markup and wires its `.modal-close`, `[data-close]` and `[data-dismiss="modal"]` buttons.
- Toast: the message is always text unless you pass `html: true`, which is now sanitised (`safe: false` for trusted markup). `E.toast('123')` shows "123". `action` is a shorthand for a single `actions` entry, and an action's `onClick` is called.
- Tooltip: `E.tooltip(selector)` sets up every match, not just the first. It returns the first instance, and `all()` gives every one. The tooltip appears beside the target without wrapping it. A `title` is used as the content when there is no `content` (the browser's own tooltip is held back), and keyboard focus shows hover tooltips.
- Badge keeps child markup such as icons, and card keeps loose text. Card's `hoverable` gives the `.card-hover` border highlight, and `color: 'primary'` adds `.card-primary`.
- `fullscreenLoader()` reuses one overlay, and `hideLoader('#dm-loader-fullscreen')` hides it. Loader options given as strings (`centered: 'false'`) are read correctly.
- `E.backToTop('#my-button')` now uses that button, and inside the container it watches, it sticks to that container's corner. Any other selector still adds a button to the body.
- The `<domma-*>` tags are registered on first use or when the page contains one. Their methods (`badge.setVariant()`, `nb.increment()`) are on the tag, and a changed attribute updates the component. `<domma-toast>` is gone (use `E.toast`). So is the `legacy-wrappers` module with its `createXWrapper` exports, which nothing in Domma used.

<!-- website -->

<p>One implementation per component behind <code>E.*</code> - theme colours finally reach modal, badge, toast and the rest, and nothing replaces your element - plus one event, verb and lookup convention: <code>.on()</code> and <code>dm:*</code> events for every callback, <code>open</code>/<code>close</code> on every overlay, a cancelable <code>beforeclose</code>, and <code>E.get()</code> for everything.</p>
