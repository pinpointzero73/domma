# Command palette recents survive a reload

<!-- website -->
The command palette now brings back recent commands that came from a nested page loaded on demand, or from a search source, after the page reloads. A plain link command keeps a small copy of its title and address so it can be shown and followed again; a command that runs code can be found again through the new `resolveRecent(id)` option.

- `E.commandPalette`: recents from async `children` and `source` are no longer lost on reload. Link commands (an `href`, no `action`) are saved under `<recentKey>:saved`; `clearRecent()` removes both keys.
- New option `resolveRecent(id)` returns a command for a remembered id the list does not hold.
