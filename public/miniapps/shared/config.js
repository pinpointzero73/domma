/**
 * Shared configuration for Domma MiniApps
 * Uses runtime environment detection (no build-time replacement needed)
 *
 * @module miniapps/shared/config
 */

// Detect environment at runtime based on hostname
const isLocal = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

export const config = {
  /**
   * Backend API base URL
   * Automatically detects environment:
   * - localhost: http://localhost:3000/api
   * - production: /api (relative to current domain)
   *
   * @type {string}
   */
  apiUrl: isLocal ? 'http://localhost:3000/api' : '/api',

  /**
   * Current environment: 'development' | 'production'
   * @type {string}
   */
  environment: isLocal ? 'development' : 'production',

  /**
   * Application version from package.json
   * @type {string}
   */
  version: '%%APP_VERSION%%',

  /**
   * Check if running in development (localhost)
   * @returns {boolean}
   */
  isDevelopment() {
    return isLocal;
  },

  /**
   * Check if running in production (not localhost)
   * @returns {boolean}
   */
  isProduction() {
    return !isLocal;
  }
};

export default config;
