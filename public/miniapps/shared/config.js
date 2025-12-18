/**
 * Shared configuration for Domma MiniApps
 * Build-time variables replaced by Rollup
 *
 * @module miniapps/shared/config
 */

export const config = {
  /**
   * Backend API base URL
   *
   * Development: http://localhost:3001/api
   * Production: https://domma.dcbw-it.co.uk:3000/api
   *
   * @type {string}
   */
  apiUrl: '%%API_URL%%',

  /**
   * Current environment: 'development' | 'production'
   * @type {string}
   */
  environment: '%%NODE_ENV%%',

  /**
   * Application version from package.json
   * @type {string}
   */
  version: '%%APP_VERSION%%',

  /**
   * Check if running in development
   * @returns {boolean}
   */
  isDevelopment() {
    return this.environment === 'development';
  },

  /**
   * Check if running in production
   * @returns {boolean}
   */
  isProduction() {
    return this.environment === 'production';
  }
};

export default config;
