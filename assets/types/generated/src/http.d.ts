export namespace http {
    /**
     * Make a request with any method.
     * @template [T=any]
     * @param {HttpMethod} method HTTP method
     * @param {string} url Request URL
     * @param {any} [data] Body - JSON-encoded unless FormData, URLSearchParams, Blob, ArrayBuffer/view or a stream. Not sent for GET/HEAD.
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function request<T = any>(method: HttpMethod, url: string, data?: any, config?: RequestOptions): Promise<T>;
    /**
     * Make a GET request.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function get<T = any>(url: string, config?: RequestOptions): Promise<T>;
    /**
     * Make a POST request.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {any} [data] Request body (JSON-encoded unless a raw body such as FormData)
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function post<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T>;
    /**
     * Make a PUT request.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {any} [data] Request body (JSON-encoded unless a raw body such as FormData)
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function put<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T>;
    /**
     * Make a PATCH request.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {any} [data] Request body (JSON-encoded unless a raw body such as FormData)
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function patch<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T>;
    /**
     * Make a DELETE request. DELETE sends no body unless one is given as `config.data`.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {DeleteRequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    function _delete<T = any>(url: string, config?: DeleteRequestOptions): Promise<T>;
    export { _delete as delete };
    /**
     * Make a HEAD request.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function head<T = any>(url: string, config?: RequestOptions): Promise<T>;
    /**
     * Make a OPTIONS request.
     * @template [T=any]
     * @param {string} url Request URL
     * @param {RequestOptions} [config] Request options
     * @returns {Promise<T>} The response body
     */
    export function options<T = any>(url: string, config?: RequestOptions): Promise<T>;
}
/**
 * Options for a request. Anything not listed by name here is passed to `fetch()` as it is.
 */
export type RequestOptions = Omit<RequestInit, "method" | keyof RequestOwnOptions> & RequestOwnOptions;
/**
 * The options Domma reads itself (the rest of {@link RequestOptions} goes to `fetch()`).
 */
export type RequestOwnOptions = {
    /**
     * Request headers (plain object, `Headers` or entry pairs); copied, never mutated.
     * `Content-Type: application/json` is added for a JSON body unless one is given.
     */
    headers?: HeadersInit;
    /**
     * Do not log a failure to the console (useful for expected errors such as a 401 check).
     */
    silent?: boolean;
    /**
     * Abort after this many milliseconds (rejects with a `TimeoutError`).
     */
    timeout?: number;
    /**
     * Defaults to `'same-origin'`; pass `'include'` to send cookies cross-origin.
     */
    credentials?: RequestCredentials;
    /**
     * Abort signal, composed with `timeout` (whichever fires first aborts).
     */
    signal?: AbortSignal;
    mode?: RequestMode;
    cache?: RequestCache;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    integrity?: string;
    keepalive?: boolean;
};
/**
 * Options for `http.delete()`: a body is sent only when given as `data`.
 */
export type DeleteRequestOptions = RequestOptions & {
    data?: any;
};
/**
 * The error a failed request rejects with: the server's `message` (or `error`) from a JSON body,
 * otherwise `HTTP Error: <status> <statusText>`.
 */
export type HttpError = Error & {
    status?: number;
    statusText?: string;
    body?: any;
};
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | (string & {});
/**
 * Fetch-based HTTP client. Every method resolves to the response BODY (not a response object):
 * parsed JSON for a JSON or unlabelled body, text for any other type, `null` when there is no body
 * (204/205/304, HEAD, an empty body). A non-2xx status rejects with an {@link HttpError}.
 */
export type Http = typeof http;
