/**
 * Domma Storage Module - TypeScript Declarations
 * localStorage wrapper with auto-serialisation and key prefixing
 */

export interface Storage {
    /**
     * Get a value from storage
     * @param key - The storage key
     * @param defaultValue - Default value if key doesn't exist
     * @returns The stored value or default
     */
    get<T = any>(key: string, defaultValue?: T): T;

    /**
     * Set a value in storage
     * @param key - The storage key
     * @param value - The value to store (auto-serialised)
     * @returns true if successful
     */
    set(key: string, value: any): boolean;

    /**
     * Remove a key from storage
     * @param key - The storage key
     * @returns true if successful
     */
    remove(key: string): boolean;

    /**
     * Check if a key exists in storage
     * @param key - The storage key
     * @returns true if key exists
     */
    has(key: string): boolean;

    /**
     * Clear all storage (within prefix)
     * @returns true if successful
     */
    clear(): boolean;

    /**
     * Get all storage keys (within prefix)
     * @returns Array of keys
     */
    keys(): string[];

    /**
     * Get the number of stored items (within prefix)
     * @returns Number of items
     */
    size(): number;

    /**
     * Get total storage size in bytes
     * @returns Size in bytes
     */
    totalSize(): number;

    /**
     * Get all stored data as an object
     * @returns Object with all key-value pairs
     */
    getAll(): Record<string, any>;

    /**
     * Set multiple values at once
     * @param data - Object with key-value pairs
     * @returns true if all successful
     */
    setAll(data: Record<string, any>): boolean;

    /**
     * Check if localStorage is available
     * @returns true if available
     */
    isAvailable(): boolean;

    /**
     * Set the key prefix
     * @param prefix - Prefix string for all keys
     */
    setPrefix(prefix: string): void;

    /**
     * Get the current key prefix
     * @returns Current prefix
     */
    getPrefix(): string;
}

export declare const storage: Storage;
