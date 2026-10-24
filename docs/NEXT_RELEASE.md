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

<!-- website -->

<p>One event, verb and lookup convention across the UI components: <code>.on()</code> and <code>dm:*</code> events for every callback, <code>open</code>/<code>close</code> on every overlay, a cancelable <code>beforeclose</code>, and <code>E.get()</code> for everything.</p>
