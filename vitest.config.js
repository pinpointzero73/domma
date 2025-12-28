// vitest.config.js
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup-vitest.js'],
    // You might want to adjust global options here
    // e.g., globals: true, to avoid importing test utilities in every file
  },
});
