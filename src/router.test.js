// src/router.test.js - the router end to end: real hashchange events, real Domma $ fades.
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import './index.js'; // window.$, window.M, window._
import {router} from './router.js';

const tick = (ms = 0) => new Promise(r => setTimeout(r, ms));

/** Wait until the router is idle (hashchange events are async in jsdom). */
async function settle(R) {
    for (let i = 0; i < 50; i++) {
        await tick(5);
        if (!R._routing && !R._transitioning) { await tick(5); if (!R._routing && !R._transitioning) return; }
    }
}

let R;
let errors;
let unsub;

/** A fresh router on #app; transitions of 0 ms so the real fades run quickly. */
function start(options = {}) {
    R = {...router, _routes: [], _views: {}, _middleware: [], _templateCache: {}, _currentRoute: null,
        _routing: false, _missedChange: false, _transitioning: false, _shownPath: null, _initialised: false};
    R.init({container: '#app', transitions: {duration: 0}, ...options});
    return R;
}

/** Templates by url; anything else is a 404. */
function stubTemplates(map) {
    vi.stubGlobal('fetch', vi.fn(async (url) => (url in map
        ? new Response(map[url], {status: 200, headers: {'Content-Type': 'text/html'}})
        : new Response('missing', {status: 404}))));
}

beforeEach(() => {
    history.replaceState(null, '', '#/a');
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    errors = [];
    unsub = window.M.subscribe('router:error', (d) => errors.push(d));
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    R?.destroy();
    if (typeof unsub === 'function') unsub(); else window.M.unsubscribe?.('router:error');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

const app = () => document.getElementById('app');

describe('router - a view that fails to render', () => {
    it('a 404 templateUrl does not wedge the router: later changes still route', async () => {
        stubTemplates({'/t/ok.html': '<p id="ok">ok</p>'});
        start({routes: [{path: '/a', view: 'a'}, {path: '/broken', view: 'broken'}, {path: '/ok', view: 'ok'}],
            views: {a: '<p>a</p>', broken: {templateUrl: '/t/missing.html'}, ok: {templateUrl: '/t/ok.html'}}});
        await settle(R);
        location.hash = '#/broken';
        await settle(R);
        expect(R._transitioning).toBe(false);
        expect(app().style.display).not.toBe('none');
        expect(errors).toHaveLength(1);
        expect(errors[0].error.message).toMatch(/Failed to load template/);
        expect(errors[0].route).toBe('/broken');

        location.hash = '#/ok';
        await settle(R);
        expect(app().querySelector('#ok')).not.toBeNull();
        expect(R.current().path).toBe('/ok');
    });

    it('a missing partial is handled the same way', async () => {
        stubTemplates({'/t/main.html': '<p>main</p>'});
        start({routes: [{path: '/a', view: 'a'}, {path: '/p', view: 'p'}],
            views: {a: '<p>a</p>', p: {templateUrl: '/t/main.html', partials: {head: '/t/nope.html'}}}});
        await settle(R);
        location.hash = '#/p';
        await settle(R);
        expect(R._transitioning).toBe(false);
        expect(app().style.display).not.toBe('none');
        expect(errors).toHaveLength(1);
        location.hash = '#/a';
        await settle(R);
        expect(app().textContent).toBe('a');
    });

    it('a throwing render function or onMount is reported, not left hanging', async () => {
        start({routes: [{path: '/a', view: 'a'}, {path: '/x', view: 'x'}],
            views: {a: '<p>a</p>', x: {template: '<p>x</p>', onMount() { throw new Error('mount broke'); }}}});
        await settle(R);
        location.hash = '#/x';
        await settle(R);
        expect(errors.map(e => e.error.message)).toEqual(['mount broke']);
        expect(R._transitioning).toBe(false);
    });

    it('without $ (static render) a failure is caught too, and the render is awaited', async () => {
        const saved = window.$;
        window.$ = undefined;
        try {
            stubTemplates({'/t/slow.html': '<p id="slow">slow</p>'});
            const seen = [];
            const off = window.M.subscribe('router:afterChange', () => seen.push(app().innerHTML));
            start({routes: [{path: '/a', view: 'slow'}, {path: '/b', view: 'b'}],
                views: {slow: {templateUrl: '/t/slow.html'}, b: {templateUrl: '/t/gone.html'}}});
            await settle(R);
            // afterChange saw the rendered view, not the empty container
            expect(seen[0]).toContain('id="slow"');
            location.hash = '#/b';
            await settle(R);
            expect(errors).toHaveLength(1);
            expect(R._transitioning).toBe(false);
            if (typeof off === 'function') off();
        } finally {
            window.$ = saved;
        }
    });
});

describe('router - destroy()', () => {
    it('removes the hashchange listener it added', async () => {
        start({routes: [{path: '/a', view: 'a'}, {path: '/b', view: 'b'}], views: {a: 'a', b: 'b'}});
        await settle(R);
        R.destroy();
        const spy = vi.fn();
        R._handleRouteChange = spy;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        await tick(5);
        expect(spy).not.toHaveBeenCalled();
    });

    it('init after destroy listens once, not twice', async () => {
        start({routes: [{path: '/a', view: 'a'}], views: {a: 'a'}});
        await settle(R);
        R.destroy();
        R.init({container: '#app', routes: [{path: '/a', view: 'a'}, {path: '/b', view: 'b'}], views: {a: 'a', b: 'b'}, transitions: {duration: 0}});
        await settle(R);
        const spy = vi.fn();
        R._handleRouteChange = spy;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        await tick(5);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('the listener still calls _handleRouteChange as it is at event time (wrappers keep working)', async () => {
        start({routes: [{path: '/a', view: 'a'}], views: {a: 'a'}});
        await settle(R);
        const spy = vi.fn();
        R._handleRouteChange = spy;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        await tick(5);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('router - params and query strings', () => {
    it('decodes params', async () => {
        history.replaceState(null, '', '#/user/J%C3%BCrgen%20M%C3%BCller');
        const onEnter = vi.fn();
        start({routes: [{path: '/user/:name', view: 'u', onEnter}], views: {u: '<p>{{name}}</p>'}});
        await settle(R);
        expect(onEnter.mock.calls[0][0]).toEqual({name: 'Jürgen Müller'});
        expect(R.current().params.name).toBe('Jürgen Müller');
    });

    it('a malformed escape does not throw: the raw segment is kept', () => {
        start({routes: [{path: '/user/:name', view: 'u'}], views: {u: 'u'}});
        expect(() => R._extractParams('/user/:name', '/user/100%')).not.toThrow();
        expect(R._extractParams('/user/:name', '/user/100%')).toEqual({name: '100%'});
        expect(R._extractParams('/user/:name', '/user/%E0%A4%A')).toEqual({name: '%E0%A4%A'});
    });

    it('static segments compare encoded and decoded alike', () => {
        start({routes: [], views: {}});
        expect(R._extractParams('/café', '/caf%C3%A9')).toEqual({});
    });

    it('#/search?q=x matches /search and exposes the parsed query', async () => {
        const onEnter = vi.fn();
        let seen;
        start({routes: [{path: '/a', view: 'a'}, {path: '/search', view: 's', onEnter}], views: {a: 'a', s: '<p>s</p>'}});
        await settle(R);
        R.use((to, from, next) => { seen = to; next(); });
        location.hash = '#/search?q=hello%20world&tag=a+b&flag';
        await settle(R);
        expect(app().textContent).toBe('s');
        expect(R.current().query).toEqual({q: 'hello world', tag: 'a b', flag: ''});
        expect(seen.query).toEqual({q: 'hello world', tag: 'a b', flag: ''});
        // path keeps the address as it was (query included), as before
        expect(R.current().path).toBe('/search?q=hello%20world&tag=a+b&flag');
        expect(onEnter.mock.calls.at(-1)[1].query.q).toBe('hello world');
    });

    it('_matchRoute strips the query for outside callers too', () => {
        start({routes: [{path: '/forms/new', view: 'f'}], views: {f: 'f'}});
        expect(R._matchRoute('/forms/new?project=x').route?.path).toBe('/forms/new');
    });

    it('a route with no query gets an empty query object', async () => {
        start({routes: [{path: '/a', view: 'a'}], views: {a: 'a'}});
        await settle(R);
        expect(R.current().query).toEqual({});
    });
});

describe('router - blocked navigation puts the address back', () => {
    it('a guard that does not call next() restores the previous hash, without routing again', async () => {
        const enterA = vi.fn();
        start({routes: [{path: '/a', view: 'a', onEnter: enterA}, {path: '/b', view: 'b'}], views: {a: '<p>a</p>', b: '<p>b</p>'}});
        await settle(R);
        R.use((to, from, next) => { if (to.path !== '/b') next(); });
        const routeOnce = vi.spyOn(R, '_routeOnce');
        location.hash = '#/b';
        await settle(R);
        await tick(20);
        await settle(R);
        expect(location.hash).toBe('#/a');
        expect(app().textContent).toBe('a');
        expect(routeOnce).toHaveBeenCalledTimes(1);   // the blocked attempt only, no second route
        expect(enterA).toHaveBeenCalledTimes(1);      // /a was not re-entered
    });

    it('onLeave returning false restores the previous hash', async () => {
        start({routes: [{path: '/a', view: 'a', onLeave: () => false}, {path: '/b', view: 'b'}], views: {a: '<p>a</p>', b: '<p>b</p>'}});
        await settle(R);
        location.hash = '#/b';
        await settle(R);
        expect(location.hash).toBe('#/a');
        expect(app().textContent).toBe('a');
    });

    it('a guard that navigates elsewhere instead of next() is not overridden', async () => {
        start({routes: [{path: '/a', view: 'a'}, {path: '/b', view: 'b'}, {path: '/login', view: 'login'}],
            views: {a: '<p>a</p>', b: '<p>b</p>', login: '<p>login</p>'}});
        await settle(R);
        R.use((to, from, next) => { if (to.path === '/b') { R.navigate('/login'); return; } next(); });
        location.hash = '#/b';
        await settle(R);
        await tick(20);
        await settle(R);
        expect(location.hash).toBe('#/login');
        expect(app().textContent).toBe('login');
    });

    it("next('/login') redirects, as the docs describe", async () => {
        start({routes: [{path: '/a', view: 'a'}, {path: '/secret', view: 's'}, {path: '/login', view: 'login'}],
            views: {a: '<p>a</p>', s: '<p>secret</p>', login: '<p>login</p>'}});
        await settle(R);
        R.use((to, from, next) => (to.path === '/secret' ? next('/login') : next()));
        location.hash = '#/secret';
        await settle(R);
        await tick(20);
        await settle(R);
        expect(app().textContent).toBe('login');
        expect(location.hash).toBe('#/login');
    });

    it('a guard that restores the hash itself (as Domma CMS does) still works', async () => {
        start({routes: [{path: '/a', view: 'a'}, {path: '/b', view: 'b'}], views: {a: '<p>a</p>', b: '<p>b</p>'}});
        await settle(R);
        R.use((to, from, next) => { if (to.path === '/b') { history.replaceState(null, '', `#${from.path}`); return; } next(); });
        location.hash = '#/b';
        await settle(R);
        expect(location.hash).toBe('#/a');
        expect(app().textContent).toBe('a');
    });
});
