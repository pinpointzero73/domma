# Dependency refresh and build compatibility

- Refresh build, test and browser tooling, including Vitest 5, jsdom 31 and the TypeScript 7 CLI.
- Retain TypeScript 6 compiler APIs for compatible declaration generation and catalogue output; validate consumer declarations with TypeScript 7.
- Update the development server watcher to Chokidar 3, removing its older vulnerable watcher dependencies.
- Adapt DOM test setup and iframe focus fixtures to the current jsdom environment, with iframe behavior verified in Chromium.

<!-- website -->
<p>Updated dependencies and build tooling, verified declaration compatibility, and refreshed the development server watcher.</p>
