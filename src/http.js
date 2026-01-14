export const http = {
    async request(method, url, data = null, config = {}) {
        const options = {
            method,
            headers: {
                ...config.headers
            },
            credentials: config.credentials || 'include', // Include cookies by default
            ...config
        };

        if (data && method !== 'GET' && method !== 'HEAD') {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Try to parse error response body
                let errorMessage = `HTTP Error: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    if (errorBody.message) {
                        errorMessage = errorBody.message;
                    } else if (errorBody.error) {
                        errorMessage = errorBody.error;
                    }
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
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
