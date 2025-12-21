/**
 * Error Handler
 * Centralized error handling for API calls and application errors
 */

export class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
    this.connectionStatus = 'online';
    this.lastCheckTime = Date.now();
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - Error object
   * @param {Response} [response] - Optional fetch response
   * @param {Object} [options] - Optional configuration
   * @returns {Promise<void>}
   */
  async handleApiError(error, response = null, options = {}) {
    const {
      silent = false,
      customMessage = null,
      onUnauthorized = null
    } = options;

    // Log error
    this.logError(error, response);

    // Determine error type and message
    let title = 'Error';
    let message = customMessage || 'An unexpected error occurred. Please try again.';

    if (response) {
      switch (response.status) {
        case 401:
          title = 'Session Expired';
          message = 'Your session has expired. Please log in again.';
          // Call logout handler if provided
          if (onUnauthorized && typeof onUnauthorized === 'function') {
            setTimeout(() => onUnauthorized(), 1000);
          }
          break;

        case 403:
          title = 'Access Denied';
          message = 'You do not have permission to perform this action.';
          break;

        case 404:
          title = 'Not Found';
          message = customMessage || 'The requested resource was not found.';
          break;

        case 409:
          title = 'Conflict';
          message = 'This action conflicts with existing data. Please refresh and try again.';
          break;

        case 422:
          title = 'Validation Error';
          message = 'The data provided is invalid. Please check your input.';
          break;

        case 429:
          title = 'Too Many Requests';
          message = 'You are making too many requests. Please wait a moment and try again.';
          break;

        case 500:
        case 502:
        case 503:
          title = 'Server Error';
          message = 'The server encountered an error. Please try again later.';
          this.updateConnectionStatus('error');
          break;

        default:
          if (response.status >= 500) {
            title = 'Server Error';
            message = 'The server is experiencing issues. Please try again later.';
            this.updateConnectionStatus('error');
          }
      }
    } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      // Network error
      title = 'Connection Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
      this.updateConnectionStatus('offline');
    }

    // Show error to user unless silent
    if (!silent && window.Domma && window.Domma.elements) {
      await window.Domma.elements.alert(message, {title});
    }

    return {title, message};
  }

  /**
   * Log error for debugging
   * @param {Error} error - Error object
   * @param {Response} [response] - Optional fetch response
   */
  logError(error, response = null) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      type: error.name,
      response: response ? {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      } : null
    };

    // Add to errors array (keep last 50)
    this.errors.unshift(errorLog);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorHandler]', errorLog);
    }
  }

  /**
   * Get recent errors for debugging
   * @param {number} [limit=10] - Number of errors to return
   * @returns {Array} Recent errors
   */
  getRecentErrors(limit = 10) {
    return this.errors.slice(0, limit);
  }

  /**
   * Clear error log
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Update connection status
   * @param {string} status - 'online', 'offline', or 'error'
   */
  updateConnectionStatus(status) {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.lastCheckTime = Date.now();

      // Emit custom event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('connection-status-change', {
          detail: {status, timestamp: this.lastCheckTime}
        }));
      }
    }
  }

  /**
   * Check API connection health
   * @param {string} apiUrl - API base URL
   * @returns {Promise<boolean>} Connection status
   */
  async checkConnection(apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/../health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        this.updateConnectionStatus('online');
        return true;
      } else {
        this.updateConnectionStatus('error');
        return false;
      }
    } catch (error) {
      this.updateConnectionStatus('offline');
      return false;
    }
  }

  /**
   * Start periodic connection checking
   * @param {string} apiUrl - API base URL
   * @param {number} [interval=30000] - Check interval in milliseconds
   * @returns {number} Interval ID
   */
  startConnectionMonitoring(apiUrl, interval = 30000) {
    // Initial check
    this.checkConnection(apiUrl);

    // Periodic checks
    return setInterval(() => {
      this.checkConnection(apiUrl);
    }, interval);
  }

  /**
   * Stop connection monitoring
   * @param {number} intervalId - Interval ID from startConnectionMonitoring
   */
  stopConnectionMonitoring(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  /**
   * Get current connection status
   * @returns {Object} Status object
   */
  getConnectionStatus() {
    return {
      status: this.connectionStatus,
      lastCheck: this.lastCheckTime,
      isOnline: this.connectionStatus === 'online'
    };
  }

  /**
   * Wrap fetch call with error handling
   * @param {string} url - Request URL
   * @param {Object} [options] - Fetch options
   * @returns {Promise<Response>}
   */
  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        await this.handleApiError(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          response,
          options.errorOptions || {}
        );
        throw new Error(`HTTP ${response.status}`);
      }

      this.updateConnectionStatus('online');
      return response;

    } catch (error) {
      if (!error.message.startsWith('HTTP ')) {
        await this.handleApiError(error, null, options.errorOptions || {});
      }
      throw error;
    }
  }

  /**
   * Show error notification using Domma
   * @param {string} message - Error message
   * @param {string} [title='Error'] - Error title
   */
  async showError(message, title = 'Error') {
    if (window.Domma && window.Domma.elements) {
      await window.Domma.elements.alert(message, {title});
    } else {
      // Fallback to console
      console.error(`${title}: ${message}`);
    }
  }

  /**
   * Show success notification using Domma
   * @param {string} message - Success message
   * @param {string} [title='Success'] - Success title
   */
  async showSuccess(message, title = 'Success') {
    if (window.Domma && window.Domma.elements) {
      await window.Domma.elements.alert(message, {title});
    } else {
      console.log(`${title}: ${message}`);
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
