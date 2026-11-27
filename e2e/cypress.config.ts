/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress';
import { exposeEnv } from './cypress/common/exposeEnv';

export default defineConfig({
  e2e: {
    // Specs visit the app once in before() and share the page across their tests.
    testIsolation: false,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // @ts-ignore
      return exposeEnv(require('./cypress/plugins/index.js')(on, config));
    },
  },
});
