/**
 * Domma HTTP Module - TypeScript Declarations
 * Fetch-based HTTP client
 */

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    /** Request body - will be JSON.stringify'd if object */
    body?: any;
    /** Request headers */
    headers?: Record<string, string>;
    /** Request timeout in ms */
    timeout?: number;
    /** Base URL to prepend */
    baseUrl?: string;
    /** Query parameters */
    params?: Record<string, string | number | boolean>;
}

export interface HttpResponse<T = any> {
    /** Response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Status text */
    statusText: string;
    /** Response headers */
    headers: Headers;
    /** Original response object */
    response: Response;
}

export interface Http {
    /**
     * Make a generic HTTP request
     * @param url - Request URL
     * @param options - Request options
     * @returns Promise resolving to response data
     */
    request<T = any>(url: string, options?: RequestOptions): Promise<T>;

    /**
     * Make a GET request
     * @param url - Request URL
     * @param options - Request options
     * @returns Promise resolving to response data
     */
    get<T = any>(url: string, options?: RequestOptions): Promise<T>;

    /**
     * Make a POST request
     * @param url - Request URL
     * @param data - Request body data
     * @param options - Request options
     * @returns Promise resolving to response data
     */
    post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T>;

    /**
     * Make a PUT request
     * @param url - Request URL
     * @param data - Request body data
     * @param options - Request options
     * @returns Promise resolving to response data
     */
    put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T>;

    /**
     * Make a PATCH request
     * @param url - Request URL
     * @param data - Request body data
     * @param options - Request options
     * @returns Promise resolving to response data
     */
    patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T>;

    /**
     * Make a DELETE request
     * @param url - Request URL
     * @param options - Request options
     * @returns Promise resolving to response data
     */
    delete<T = any>(url: string, options?: RequestOptions): Promise<T>;

    /**
     * Set default options for all requests
     * @param options - Default options to apply
     */
    setDefaults(options: RequestOptions): void;

    /**
     * Get current default options
     * @returns Default options object
     */
    getDefaults(): RequestOptions;
}

export declare const http: Http;
