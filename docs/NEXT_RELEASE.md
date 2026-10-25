# Fixes: command palette recents survive a reload

### Fixed

- **Command palette recents from async pages and sources.** A command that came from an async `children` page or a `source` search was remembered only by id, so after a reload nothing could find it and it vanished from Recent. A link command (an `href`, no `action`) now keeps a copy of what it needs to be shown and followed again, under `<recentKey>:saved`; `clearRecent()` removes both keys.

### Added

- **`resolveRecent(id)`** option on `E.commandPalette`: returns the command for a remembered id the list does not hold (one that runs code, which cannot be saved). A command it returns under a different id is ignored.

<!-- website -->

<p>The command palette now keeps recent commands that came from a nested page or a search source after the page reloads. Link commands come back on their own; commands that run code can be found again through the new <code>resolveRecent(id)</code> option.</p>
