# Dependency refresh and build compatibility

- Refresh build, test and browser tooling, including Vitest 5, jsdom 31 and the TypeScript 7 CLI.
- Retain TypeScript 6 compiler APIs for compatible declaration generation and catalogue output; validate consumer declarations with TypeScript 7.
- Update the development server watcher to Chokidar 3, removing its older vulnerable watcher dependencies.
- Adapt DOM test setup and iframe focus fixtures to the current jsdom environment, with iframe behavior verified in Chromium.

🔁 **domma-reactive 1.3.2**

*   Domma is now built against domma-reactive 1.3.2 - see [its release notes](https://github.com/pinpointzero73/domma-reactive/blob/v1.3.2/CHANGELOG.md).

- Build against domma-celebrate 1.5.1 and domma-reactive 1.3.2 with verified browser, CommonJS and ES module artifacts.

<!-- website -->

<p>Updated dependencies and build tooling, verified declaration compatibility, and refreshed the development server watcher.</p>
