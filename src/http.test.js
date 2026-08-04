// src/http.test.js
import {describe, expect, it} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object

describe('Domma.http - HTTP Utilities', () => {
  it('http.get() should make a GET request and return JSON data', async () => {
    // Mock the global fetch in setup-vitest.js handles this
    const result = await Domma.http.get('/api/data');
    expect(result.message).toBe('Success');
  });

  it('http.post() should make a POST request and return JSON data', async () => {
    // Mock the global fetch in setup-vitest.js handles this
    const result = await Domma.http.post('/api/post', {test: 'data'});
    expect(result.received.test).toBe('data');
  });

  it('http.request() surfaces the error message from a JSON error body', async () => {
    // http.js deliberately reports the server's own message rather than a
    // generic 'HTTP Error: <status>', falling back to status + statusText only
    // when the body is not JSON.
    await expect(Domma.http.request('GET', '/api/error', null, {silent: true}))
      .rejects.toThrow('Not Found');
  });

  it('http.request() prefers `message` over `error` in the body', async () => {
    await expect(Domma.http.request('GET', '/api/error-message', null, {silent: true}))
      .rejects.toThrow('Validation failed');
  });

  it('http.request() falls back to status and statusText for a non-JSON body', async () => {
    await expect(Domma.http.request('GET', '/api/error-plain', null, {silent: true}))
      .rejects.toThrow('HTTP Error: 500 Internal Server Error');
  });
});
