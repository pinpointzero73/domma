export namespace storage {
    export { STORAGE_PREFIX as _prefix };
    export let _available: boolean | null;
    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    export function isAvailable(): boolean;
    /**
     * Get the prefixed key
     * @param {string} key - Raw key
     * @returns {string} - Prefixed key
     * @private
     */
    export function _prefixKey(key: string): string;
    /**
     * Remove prefix from key
     * @param {string} prefixedKey - Prefixed key
     * @returns {string} - Raw key
     * @private
     */
    export function _unprefixKey(prefixedKey: string): string;
    /**
     * Retrieve and auto-parse a value from localStorage
     * @template [T=any]
     * @param {string} key - Storage key (without prefix)
     * @param {T} [defaultValue=null] - Default if key doesn't exist
     * @returns {T} - Parsed value or defaultValue
     */
    export function get<T = any>(key: string, defaultValue?: T): T;
    /**
     * Store a value with auto-stringify
     * @param {string} key - Storage key (without prefix)
     * @param {any} value - Value to store (will be JSON stringified)
     * @returns {boolean} - True if successful
     */
    export function set(key: string, value: any): boolean;
    /**
     * Remove a key from storage
     * @param {string} key - Storage key (without prefix)
     * @returns {boolean} - True if successful
     */
    export function remove(key: string): boolean;
    /**
     * Check if a key exists
     * @param {string} key - Storage key (without prefix)
     * @returns {boolean}
     */
    export function has(key: string): boolean;
    /**
     * Clear all Domma-prefixed keys (not all localStorage)
     * @returns {number} - Number of keys cleared
     */
    export function clear(): number;
    /**
     * List all Domma-prefixed keys (without prefix)
     * @returns {string[]}
     */
    export function keys(): string[];
    /**
     * Get the size of stored data for a key (in bytes)
     * @param {string} key - Storage key (without prefix)
     * @returns {number} - Size in bytes, 0 if not found
     */
    export function size(key: string): number;
    /**
     * Get total size of all Domma storage (in bytes)
     * @returns {number}
     */
    export function totalSize(): number;
    /**
     * Get all stored data as an object
     * @returns {Record<string, any>}
     */
    export function getAll(): Record<string, any>;
    /**
     * Set multiple values at once
     * @param {Record<string, any>} data - Key-value pairs to store
     * @returns {boolean} - True if all successful
     */
    export function setAll(data: Record<string, any>): boolean;
}
export default storage;
/**
 * localStorage wrapper: values are JSON-serialised and keys carry the `domma:` prefix.
 * Every method fails soft (false / 0 / the default) when localStorage is unavailable.
 */
export type Storage = typeof storage;
/**
 * Domma Storage Module
 * localStorage wrapper with auto-serialisation and key prefixing
 */
declare const STORAGE_PREFIX: "domma:";
