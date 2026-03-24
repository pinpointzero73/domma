/**
 * Shared configuration for Domma MiniApps
 * Uses runtime environment detection (no build-time replacement needed)
 *
 * @module miniapps/shared/config
 */

// Detect environment at runtime based on hostname and port
// Dev server runs on port 3001; standard web ports (80/443) indicate production
const _hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const _port = typeof window !== 'undefined' ? parseInt(window.location.port || '80') : 80;
const _isDevPort = _port !== 80 && _port !== 443;
const _isLocalHost = _hostname === 'localhost' || _hostname === '127.0.0.1';
const isLocal = _isLocalHost || _isDevPort;

export const config = {
  /**
   * Backend API base URL
   * Automatically detects environment:
   * - dev (non-standard port or localhost): http://{hostname}:3000/api
   * - production (port 80/443): /api (proxied by web server)
   *
   * @type {string}
   */
  apiUrl: isLocal ? `http://${_hostname}:3000/api` : '/api',

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
   * Inactivity auto-logout timeout in milliseconds.
   * User is signed out after this period of no mouse, keyboard, scroll, or touch activity.
   * Default: 20 minutes. Change here to apply across all MiniApps and Admin pages.
   *
   * @type {number}
   */
  sessionTimeoutMs: 20 * 60 * 1000,

  /**
   * Warning shown before auto-logout (ms before timeout).
   * Default: 60 seconds before logout.
   *
   * @type {number}
   */
  sessionWarningMs: 60 * 1000,

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
