/**
 * Bodies fetch sends as they are: they carry their own Content-Type (FormData's
 * multipart boundary, URLSearchParams' form encoding, a Blob's type) or none.
 */
function isRawBody(data) {
    if (typeof FormData !== 'undefined' && data instanceof FormData) return true;
    if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) return true;
    if (typeof Blob !== 'undefined' && data instanceof Blob) return true;
    if (typeof ArrayBuffer !== 'undefined' && (data instanceof ArrayBuffer || ArrayBuffer.isView(data))) return true;
    if (typeof ReadableStream !== 'undefined' && data instanceof ReadableStream) return true;
    return false;
}

function hasHeader(headers, name) {
    const lower = name.toLowerCase();
    return Object.keys(headers).some(k => k.toLowerCase() === lower);
}

/** Copy caller headers (plain object or Headers) into a fresh object - never mutate theirs. */
function copyHeaders(headers) {
    if (!headers) return {};
    if (typeof headers.forEach === 'function' && !Array.isArray(headers) && typeof headers.get === 'function') {
        const out = {};
        headers.forEach((v, k) => { out[k] = v; });
        return out;
    }
    if (Array.isArray(headers)) return Object.fromEntries(headers);
    return {...headers};
}

/**
 * Read a response body: JSON for a JSON (or unlabelled) body, text for anything
 * else, null when there is no body (204/205/304, HEAD, an empty body).
 */
async function readBody(response, method) {
    if (method === 'HEAD' || response.status === 204 || response.status === 205 || response.status === 304) {
        return null;
    }
    const headers = response.headers;
    const type = headers && typeof headers.get === 'function' ? (headers.get('content-type') || '') : null;
    // No usable headers or no text() (a minimal mock): the old behaviour, JSON.
    if (type === null || typeof response.text !== 'function') return response.json();
    if (headers.get('content-length') === '0') return null;

    const text = await response.text();
    if (text === '') return null;
    if (/[/+]json\b/i.test(type)) return JSON.parse(text);
    if (type) return text;
    // Unlabelled: JSON when it parses, the text otherwise.
    try { return JSON.parse(text); } catch { return text; }
}

export const http = {
    async request(method, url, data = null, config = {}) {
        const {headers, silent, timeout, credentials, signal, ...rest} = config || {};
        const options = {
            ...rest,
            method,
            headers: copyHeaders(headers),
            // Cookies go to this site's own origin; a cross-origin request carries
            // them only when the caller asks (`credentials: 'include'`).
            credentials: credentials || 'same-origin'
        };

        if (data !== undefined && data !== null && method !== 'GET' && method !== 'HEAD') {
            if (isRawBody(data)) {
                options.body = data;
            } else {
                if (!hasHeader(options.headers, 'Content-Type')) {
                    options.headers['Content-Type'] = 'application/json';
                }
                options.body = JSON.stringify(data);
            }
        }

        // Timeout (ms), composed with any caller signal: whichever fires first aborts.
        let timer = null;
        let controller = null;
        if (timeout > 0 && typeof AbortController !== 'undefined') {
            controller = new AbortController();
            timer = setTimeout(() => {
                const reason = typeof DOMException !== 'undefined'
                    ? new DOMException(`Request timed out after ${timeout}ms`, 'TimeoutError')
                    : Object.assign(new Error(`Request timed out after ${timeout}ms`), {name: 'TimeoutError'});
                controller.abort(reason);
            }, timeout);
            if (signal) {
                if (signal.aborted) controller.abort(signal.reason);
                else signal.addEventListener('abort', () => controller.abort(signal.reason), {once: true});
            }
            options.signal = controller.signal;
        } else if (signal) {
            options.signal = signal;
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Try to parse error response body
                let errorMessage = `HTTP Error: ${response.status}`;
                let body;
                try {
                    body = await readBody(response, method);
                    if (body === null || typeof body !== 'object') throw new Error('not JSON');
                    if (body.message) {
                        errorMessage = body.message;
                    } else if (body.error) {
                        errorMessage = body.error;
                    }
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
                }
                const error = new Error(errorMessage);
                error.status = response.status;
                error.statusText = response.statusText;
                error.body = body;
                throw error;
            }
            return await readBody(response, method);
        } catch (error) {
            // Only log if not silent (useful for expected errors like 401 auth checks)
            if (!silent) {
                console.error('Domma HTTP Error:', error);
            }
            throw error;
        } finally {
            if (timer) clearTimeout(timer);
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

    /** DELETE sends no body unless one is given as `config.data`. */
    delete(url, config) {
        const {data = null, ...rest} = config || {};
        return this.request('DELETE', url, data, rest);
    },

    head(url, config) {
        return this.request('HEAD', url, null, config);
    },

    options(url, config) {
        return this.request('OPTIONS', url, null, config);
    }
};
