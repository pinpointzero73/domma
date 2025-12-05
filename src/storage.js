/**
 * Domma Storage Module
 * localStorage wrapper with auto-serialisation and key prefixing
 */

const STORAGE_PREFIX = 'domma:';

export const storage = {
    _prefix: STORAGE_PREFIX,
    _available: null,

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isAvailable() {
        if (this._available !== null) return this._available;

        try {
            const testKey = `${this._prefix}__test__`;
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            this._available = true;
        } catch (e) {
            this._available = false;
        }
        return this._available;
    },

    /**
     * Get the prefixed key
     * @param {string} key - Raw key
     * @returns {string} - Prefixed key
     * @private
     */
    _prefixKey(key) {
        return `${this._prefix}${key}`;
    },

    /**
     * Remove prefix from key
     * @param {string} prefixedKey - Prefixed key
     * @returns {string} - Raw key
     * @private
     */
    _unprefixKey(prefixedKey) {
        return prefixedKey.slice(this._prefix.length);
    },

    // ============================================
    // Core Methods
    // ============================================

    /**
     * Retrieve and auto-parse a value from localStorage
     * @param {string} key - Storage key (without prefix)
     * @param {*} [defaultValue=null] - Default if key doesn't exist
     * @returns {*} - Parsed value or defaultValue
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable()) return defaultValue;

        try {
            const prefixedKey = this._prefixKey(key);
            const raw = localStorage.getItem(prefixedKey);

            if (raw === null) return defaultValue;

            return JSON.parse(raw);
        } catch (e) {
            // JSON parse failed - return default
            console.warn(`Domma storage: Failed to parse key "${key}"`, e);
            return defaultValue;
        }
    },

    /**
     * Store a value with auto-stringify
     * @param {string} key - Storage key (without prefix)
     * @param {*} value - Value to store (will be JSON stringified)
     * @returns {boolean} - True if successful
     */
    set(key, value) {
        if (!this.isAvailable()) return false;

        try {
            const prefixedKey = this._prefixKey(key);
            const serialised = JSON.stringify(value);
            localStorage.setItem(prefixedKey, serialised);
            return true;
        } catch (e) {
            // Quota exceeded or serialisation failed
            console.warn(`Domma storage: Failed to set key "${key}"`, e);
            return false;
        }
    },

    /**
     * Remove a key from storage
     * @param {string} key - Storage key (without prefix)
     * @returns {boolean} - True if successful
     */
    remove(key) {
        if (!this.isAvailable()) return false;

        try {
            const prefixedKey = this._prefixKey(key);
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (e) {
            console.warn(`Domma storage: Failed to remove key "${key}"`, e);
            return false;
        }
    },

    /**
     * Check if a key exists
     * @param {string} key - Storage key (without prefix)
     * @returns {boolean}
     */
    has(key) {
        if (!this.isAvailable()) return false;

        try {
            const prefixedKey = this._prefixKey(key);
            return localStorage.getItem(prefixedKey) !== null;
        } catch (e) {
            return false;
        }
    },

    /**
     * Clear all Domma-prefixed keys (not all localStorage)
     * @returns {number} - Number of keys cleared
     */
    clear() {
        if (!this.isAvailable()) return 0;

        try {
            const keys = this.keys();
            keys.forEach(key => this.remove(key));
            return keys.length;
        } catch (e) {
            console.warn('Domma storage: Failed to clear storage', e);
            return 0;
        }
    },

    /**
     * List all Domma-prefixed keys (without prefix)
     * @returns {string[]}
     */
    keys() {
        if (!this.isAvailable()) return [];

        try {
            const result = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this._prefix)) {
                    result.push(this._unprefixKey(key));
                }
            }
            return result;
        } catch (e) {
            return [];
        }
    },

    // ============================================
    // Utility Methods
    // ============================================

    /**
     * Get the size of stored data for a key (in bytes)
     * @param {string} key - Storage key (without prefix)
     * @returns {number} - Size in bytes, 0 if not found
     */
    size(key) {
        if (!this.isAvailable()) return 0;

        try {
            const prefixedKey = this._prefixKey(key);
            const raw = localStorage.getItem(prefixedKey);
            return raw ? new Blob([raw]).size : 0;
        } catch (e) {
            return 0;
        }
    },

    /**
     * Get total size of all Domma storage (in bytes)
     * @returns {number}
     */
    totalSize() {
        if (!this.isAvailable()) return 0;

        try {
            let total = 0;
            this.keys().forEach(key => {
                total += this.size(key);
            });
            return total;
        } catch (e) {
            return 0;
        }
    },

    /**
     * Get all stored data as an object
     * @returns {Object}
     */
    getAll() {
        if (!this.isAvailable()) return {};

        const result = {};
        this.keys().forEach(key => {
            result[key] = this.get(key);
        });
        return result;
    },

    /**
     * Set multiple values at once
     * @param {Object} data - Key-value pairs to store
     * @returns {boolean} - True if all successful
     */
    setAll(data) {
        if (!this.isAvailable() || !data) return false;

        let success = true;
        Object.keys(data).forEach(key => {
            if (!this.set(key, data[key])) {
                success = false;
            }
        });
        return success;
    }
};

export default storage;
