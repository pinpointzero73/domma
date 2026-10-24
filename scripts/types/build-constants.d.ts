// Values rollup's replace plugin writes into src/index.js at build time.
// Read by tsconfig.types.json only, so Domma.version is typed as a string.
declare const __BUILD_VERSION__: string;
declare const __BUILD_DATE__: string;
declare const __BUILD_COMMIT__: string;
