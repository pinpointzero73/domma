/**
 * Rollup configuration for Domma MiniApps
 *
 * Builds miniapps with environment-based configuration.
 * Uses build-time variable replacement for optimal performance.
 */

import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import {readFileSync} from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Environment-based API URLs
const API_URLS = {
  production: 'https://domma.dcbw-it.co.uk:3000/api',
  development: 'http://localhost:3000/api'
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const API_URL = process.env.API_URL || API_URLS[NODE_ENV];

console.log(`\n🔧 Building miniapps for ${NODE_ENV}`);
console.log(`📡 API URL: ${API_URL}\n`);

/**
 * Create Rollup config for a miniapp
 *
 * @param {string} name - MiniApp name (e.g., 'garage', 'docs')
 * @param {Object} options - Configuration options
 * @param {string} [options.input] - Source file path
 * @param {string} [options.output] - Output file path
 * @param {boolean} [options.sourcemap=false] - Generate sourcemap
 * @returns {Object} Rollup configuration object
 */
export function createMiniAppConfig(name, options = {}) {
  const {
    input = `public/miniapps/${name}/src/app.js`,
    output = `public/miniapps/${name}/dist/app.min.js`,
    sourcemap = false
  } = options;

  return {
    input,
    output: {
      file: output,
      format: 'iife',
      sourcemap,
      banner: `/**
 * ${name.charAt(0).toUpperCase() + name.slice(1)} MiniApp
 * Built: ${new Date().toISOString()}
 * Environment: ${NODE_ENV}
 * API URL: ${API_URL}
 */`
    },
    plugins: [
      resolve(),
      replace({
        preventAssignment: true,
        delimiters: ['%%', '%%'],
        values: {
          'API_URL': API_URL,
          'NODE_ENV': NODE_ENV,
          'APP_VERSION': pkg.version
        }
      }),
      terser({
        compress: {
          drop_console: NODE_ENV === 'production' ? ['log', 'debug'] : false
        },
        format: {
          comments: /^!/
        }
      })
    ]
  };
}

// Export configurations for all miniapps
export default [
  createMiniAppConfig('garage')
  // Add more miniapps here as they're created:
  // createMiniAppConfig('docs'),
  // createMiniAppConfig('invoicing'),
];
