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

  it('http.request() error handling should catch HTTP errors', async () => {
    let errorCaught = false;
    try {
      await Domma.http.request('GET', '/api/error');
    } catch (e) {
      errorCaught = true;
      expect(e.message).toBe('HTTP Error: 404');
    }
    expect(errorCaught).toBe(true);
  });
});
