export const http = {
    _csrfToken: null,
    _csrfEndpoint: '/api/csrf-token',

    /**
     * Get CSRF token (cached)
     * @returns {Promise<string>} CSRF token
     */
    async getCsrfToken() {
        if (this._csrfToken) {
            return this._csrfToken;
        }

        try {
            const response = await fetch(this._csrfEndpoint, {
                method: 'GET',
                credentials: 'include' // Include cookies
            });
            const data = await response.json();
            this._csrfToken = data.csrfToken;
            return this._csrfToken;
        } catch (error) {
            console.warn('Failed to fetch CSRF token:', error);
            return null;
        }
    },

    /**
     * Clear cached CSRF token (useful after logout or token expiry)
     */
    clearCsrfToken() {
        this._csrfToken = null;
    },

    async request(method, url, data = null, config = {}) {
        const options = {
            method,
            headers: {
                ...config.headers
            },
            credentials: config.credentials || 'include', // Include cookies by default
            ...config
        };

        // Add CSRF token for state-changing requests
        const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        if (stateChangingMethods.includes(method)) {
            const csrfToken = await this.getCsrfToken();
            if (csrfToken) {
                options.headers['x-csrf-token'] = csrfToken;
            }
        }

        if (data && method !== 'GET' && method !== 'HEAD') {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            // If CSRF token is invalid, clear it and retry once
            if (response.status === 403 && this._csrfToken) {
                this.clearCsrfToken();
                return this.request(method, url, data, config);
            }

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            // Only log if not silent (useful for expected errors like 401 auth checks)
            if (!config.silent) {
                console.error('Domma HTTP Error:', error);
            }
            throw error;
        }
    },

    get(url, config) {
        return this.request('GET', url, null, config);
    },

    post(url, data, config) {
        return this.request('POST', url, data, config);
    },

    put(url, data, config) {
        return this.request('PUT', url, data, config);
    },

    patch(url, data, config) {
        return this.request('PATCH', url, data, config);
    },

    delete(url, config) {
        return this.request('DELETE', url, {delete: true}, config);
    },

    head(url, config) {
        return this.request('HEAD', url, null, config);
    },

    options(url, config) {
        return this.request('OPTIONS', url, null, config);
    }
};
