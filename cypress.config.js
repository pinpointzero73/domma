const {defineConfig} = require('cypress');

module.exports = defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // We will set the baseUrl to the one from your dev server
    baseUrl: 'http://localhost:3001',
  },
});
