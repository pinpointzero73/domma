// src/storage.test.js
import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object

describe('Domma.storage - Storage Utilities', () => {
  // Clear localStorage before each test to ensure isolation
  beforeEach(() => {
    // global.localStorage.clear(); // This is already called by resetTestEnvironment in setup-vitest.js
    // Re-ensure basic HTML is present for Domma to function on document.body
    document.body.innerHTML = '<div id="test"></div>';
  });

  it('storage.isAvailable() should confirm that localStorage is available', () => {
    expect(Domma.storage.isAvailable()).toBe(true);
  });

  it('storage.set() and storage.get() should set and get string and object values', () => {
    Domma.storage.set('foo', 'bar');
    expect(Domma.storage.get('foo')).toBe('bar');

    const obj = {a: 1};
    Domma.storage.set('baz', obj);
    expect(Domma.storage.get('baz')).toEqual(obj); // Use toEqual for object comparison
  });

  it('storage.get() should return the default value for a nonexistent key', () => {
    expect(Domma.storage.get('nonexistent', 'default')).toBe('default');
  });

  it('storage.remove() should remove a value from storage', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.remove('foo');
    expect(Domma.storage.get('foo')).toBeNull();
  });

  it('storage.has() should return true for an existing key and false for a nonexistent key', () => {
    Domma.storage.set('foo', 'bar');
    expect(Domma.storage.has('foo')).toBe(true);
    expect(Domma.storage.has('nonexistent')).toBe(false);
  });

  it('storage.clear() should clear all domma-prefixed keys', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    Domma.storage.clear();
    expect(Domma.storage.keys().length).toBe(0);
  });

  it('storage.keys() should return an array of all domma-prefixed keys', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    const keys = Domma.storage.keys();
    expect(keys.length).toBe(2);
    expect(keys).toContain('foo');
    expect(keys).toContain('baz');
  });

  it('storage.size() should return the size of the stored data for a key', () => {
    Domma.storage.set('foo', 'bar'); // Length of "bar" is 3, plus overhead from JSON.stringify if applicable
    // Actual size might vary based on implementation and browser.
    // Let's assume a non-zero positive number for now.
    expect(Domma.storage.size('foo')).toBeGreaterThan(0);
  });

  it('storage.totalSize() should return the total size of all domma storage', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    expect(Domma.storage.totalSize()).toBeGreaterThan(0);
  });

  it('storage.getAll() should return all stored data as an object', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    const all = Domma.storage.getAll();
    expect(all).toEqual({foo: 'bar', baz: 'qux'});
  });

  it('storage.setAll() should set multiple values at once', () => {
    Domma.storage.setAll({foo: 'bar', baz: 'qux'});
    expect(Domma.storage.get('foo')).toBe('bar');
    expect(Domma.storage.get('baz')).toBe('qux');
  });
});
