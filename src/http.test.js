// src/http.test.js
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object
import {http} from './http.js';

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

/** Swap fetch for one answering with `respond(url, options)`, recording each call. */
function stubFetch(respond) {
  const calls = [];
  const fn = vi.fn(async (url, options) => {
    calls.push({url, options});
    return respond(url, options);
  });
  vi.stubGlobal('fetch', fn);
  return calls;
}

const json = (body, init = {}) => new Response(JSON.stringify(body), {
  status: 200, ...init, headers: {'Content-Type': 'application/json', ...(init.headers || {})}
});

describe('http - response bodies', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('204 No Content resolves to null instead of rejecting', async () => {
    stubFetch(() => new Response(null, {status: 204}));
    await expect(http.delete('/x', {silent: true})).resolves.toBeNull();
  });

  it('205 Reset Content resolves to null', async () => {
    stubFetch(() => new Response(null, {status: 205}));
    await expect(http.post('/x', {a: 1}, {silent: true})).resolves.toBeNull();
  });

  it('head() resolves (no body to parse)', async () => {
    stubFetch(() => new Response(null, {status: 200, headers: {'Content-Type': 'application/json'}}));
    await expect(http.head('/x', {silent: true})).resolves.toBeNull();
  });

  it('a 200 with an empty JSON body resolves to null', async () => {
    stubFetch(() => new Response('', {status: 200, headers: {'Content-Type': 'application/json'}}));
    await expect(http.get('/x', {silent: true})).resolves.toBeNull();
  });

  it('JSON responses are still parsed (charset and +json types too)', async () => {
    stubFetch(() => json({ok: 1}, {headers: {'Content-Type': 'application/json; charset=utf-8'}}));
    await expect(http.get('/x')).resolves.toEqual({ok: 1});
    stubFetch(() => new Response('{"p":2}', {headers: {'Content-Type': 'application/problem+json'}}));
    await expect(http.get('/x')).resolves.toEqual({p: 2});
  });

  it('a non-JSON content type resolves to the text', async () => {
    stubFetch(() => new Response('<p>hi</p>', {headers: {'Content-Type': 'text/html'}}));
    await expect(http.get('/x')).resolves.toBe('<p>hi</p>');
  });

  it('an unlabelled body is JSON when it parses, text otherwise', async () => {
    stubFetch(() => new Response(new TextEncoder().encode('{"a":1}')));
    await expect(http.get('/x')).resolves.toEqual({a: 1});
    stubFetch(() => new Response(new TextEncoder().encode('plain words')));
    await expect(http.get('/x')).resolves.toBe('plain words');
  });

  it('errors carry status and body, message unchanged', async () => {
    stubFetch(() => json({error: 'Nope'}, {status: 403, statusText: 'Forbidden'}));
    const err = await http.get('/x', {silent: true}).catch(e => e);
    expect(err.message).toBe('Nope');
    expect(err.status).toBe(403);
    expect(err.body).toEqual({error: 'Nope'});
  });

  it('a 401 with no body keeps the "HTTP Error: 401 ..." message', async () => {
    stubFetch(() => new Response(null, {status: 401, statusText: 'Unauthorized'}));
    const err = await http.get('/x', {silent: true}).catch(e => e);
    expect(err.message).toBe('HTTP Error: 401 Unauthorized');
    expect(err.status).toBe(401);
  });
});

describe('http - request bodies', () => {
  afterEach(() => vi.unstubAllGlobals());

  const raw = [
    ['FormData', () => { const f = new FormData(); f.append('a', '1'); return f; }],
    ['URLSearchParams', () => new URLSearchParams('a=1')],
    ['Blob', () => new Blob(['x'], {type: 'text/plain'})],
    ['ArrayBuffer', () => new ArrayBuffer(4)],
    ['Uint8Array', () => new Uint8Array([1, 2])]
  ];
  for (const [name, make] of raw) {
    it(`${name} is sent as it is, with no JSON content type`, async () => {
      const calls = stubFetch(() => json({}));
      const body = make();
      await http.post('/x', body);
      expect(calls[0].options.body).toBe(body);
      expect(calls[0].options.headers['Content-Type']).toBeUndefined();
    });
  }

  for (const value of [0, false, '']) {
    it(`a falsy body (${JSON.stringify(value)}) is still sent`, async () => {
      const calls = stubFetch(() => json({}));
      await http.post('/x', value);
      expect(calls[0].options.body).toBe(JSON.stringify(value));
      expect(calls[0].options.headers['Content-Type']).toBe('application/json');
    });
  }

  it('null/undefined bodies send nothing', async () => {
    const calls = stubFetch(() => json({}));
    await http.post('/x', null);
    await http.post('/x', undefined);
    expect(calls.map(c => c.options.body)).toEqual([undefined, undefined]);
  });

  it('a caller Content-Type is kept, and the caller headers object is not mutated', async () => {
    const calls = stubFetch(() => json({}));
    const headers = {'content-type': 'application/vnd.x+json'};
    await http.post('/x', {a: 1}, {headers});
    expect(calls[0].options.headers['Content-Type']).toBeUndefined();
    expect(calls[0].options.headers['content-type']).toBe('application/vnd.x+json');
    const shared = {Authorization: 'Bearer t'};
    await http.post('/x', {a: 1}, {headers: shared});
    expect(shared).toEqual({Authorization: 'Bearer t'});
  });

  it('own options (silent, timeout) are not passed to fetch', async () => {
    const calls = stubFetch(() => json({}));
    await http.get('/x', {silent: true, timeout: 1000, mode: 'cors'});
    expect(calls[0].options).not.toHaveProperty('silent');
    expect(calls[0].options).not.toHaveProperty('timeout');
    expect(calls[0].options.mode).toBe('cors');
  });

  it('delete() sends no body by default', async () => {
    const calls = stubFetch(() => new Response(null, {status: 204}));
    await http.delete('/x');
    expect(calls[0].options.method).toBe('DELETE');
    expect(calls[0].options.body).toBeUndefined();
    expect(calls[0].options.headers['Content-Type']).toBeUndefined();
  });

  it('delete() sends a body given as config.data', async () => {
    const calls = stubFetch(() => new Response(null, {status: 204}));
    await http.delete('/x', {data: {ids: [1, 2]}, headers: {A: 'b'}});
    expect(calls[0].options.body).toBe('{"ids":[1,2]}');
    expect(calls[0].options.headers).toEqual({A: 'b', 'Content-Type': 'application/json'});
    expect(calls[0].options).not.toHaveProperty('data');
  });
});

describe('http - credentials', () => {
  afterEach(() => vi.unstubAllGlobals());

  it("defaults to 'same-origin' (cookies to this site; cross-origin only on request)", async () => {
    const calls = stubFetch(() => json({}));
    await http.get('/x');
    expect(calls[0].options.credentials).toBe('same-origin');
  });

  it('a caller credentials setting wins', async () => {
    const calls = stubFetch(() => json({}));
    await http.get('https://api.example.com/x', {credentials: 'include'});
    expect(calls[0].options.credentials).toBe('include');
  });
});

describe('http - timeout', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  /** fetch that never answers, but rejects with the signal's reason on abort. */
  const hanging = () => stubFetch((url, options) => new Promise((_, reject) => {
    if (options.signal?.aborted) return reject(options.signal.reason);
    options.signal?.addEventListener('abort', () => reject(options.signal.reason), {once: true});
  }));

  it('aborts a request that takes longer than `timeout` ms', async () => {
    hanging();
    const err = await http.get('/slow', {timeout: 20, silent: true}).catch(e => e);
    expect(err.name).toBe('TimeoutError');
  });

  it('a fast response is not aborted, and the timer is cleared', async () => {
    vi.useFakeTimers();
    const calls = stubFetch(() => json({ok: true}));
    await expect(http.get('/x', {timeout: 50})).resolves.toEqual({ok: true});
    expect(calls[0].options.signal.aborted).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('the caller signal still aborts when a timeout is set', async () => {
    hanging();
    const ctl = new AbortController();
    const p = http.get('/slow', {timeout: 5000, signal: ctl.signal, silent: true}).catch(e => e);
    ctl.abort(new Error('caller gave up'));
    expect((await p).message).toBe('caller gave up');
  });

  it('an already-aborted caller signal aborts at once', async () => {
    hanging();
    const ctl = new AbortController();
    ctl.abort(new Error('already'));
    const err = await http.get('/slow', {timeout: 5000, signal: ctl.signal, silent: true}).catch(e => e);
    expect(err.message).toBe('already');
  });

  it('without timeout the caller signal is passed straight through', async () => {
    const calls = stubFetch(() => json({}));
    const ctl = new AbortController();
    await http.get('/x', {signal: ctl.signal});
    expect(calls[0].options.signal).toBe(ctl.signal);
  });
});
