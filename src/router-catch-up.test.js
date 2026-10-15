// src/router-catch-up.test.js
// An address change while a route change is running is caught up, not dropped
// (the hash on one route, the screen on another).
import {describe, expect, it, beforeEach} from 'vitest';
import {router} from './router.js';

const tick = (ms) => new Promise(r => setTimeout(r, ms));

/** A fresh router with a slow, recording render in place of the DOM work. */
function makeRouter() {
    const R = {...router, _routes: [{path: '/a', view: 'a'}, {path: '/b', view: 'b'}, {path: '/c', view: 'c'}, {path: '/d', view: 'd'}],
        _views: {}, _middleware: [], _currentRoute: null, _routing: false, _missedChange: false, _transitioning: false, rendered: []};
    R._renderView = async function (view) {
        this._transitioning = true;
        await tick(20);
        this.rendered.push(view);
        this._transitioning = false;
    };
    R._renderNotFound = async function () { this.rendered.push('404'); };
    return R;
}

describe('router - address changes during a route change', () => {
    beforeEach(() => { window.location.hash = '#/a'; });

    it('catches up with a change made mid-transition', async () => {
        const R = makeRouter();
        const first = R._handleRouteChange();
        await tick(5);
        window.location.hash = '#/b';
        await R._handleRouteChange();
        await first;
        expect(R.rendered).toEqual(['a', 'b']);
        expect(R._currentRoute.path).toBe('/b');
    });

    it('lands on the last of several changes, skipping the ones in between', async () => {
        const R = makeRouter();
        const first = R._handleRouteChange();
        for (const h of ['#/b', '#/c', '#/d']) { await tick(3); window.location.hash = h; R._handleRouteChange(); }
        await first;
        expect(R.rendered).toEqual(['a', 'd']);
    });

    it('does not render again when the address came back to the screen shown', async () => {
        const R = makeRouter();
        const first = R._handleRouteChange();
        await tick(5);
        window.location.hash = '#/b';
        R._handleRouteChange();
        window.location.hash = '#/a';
        R._handleRouteChange();
        await first;
        expect(R.rendered).toEqual(['a']);
    });

    it('a change during middleware waits its turn instead of running alongside', async () => {
        const R = makeRouter();
        let release;
        R._middleware = [async (to, from, next) => { if (to.path === '/a') await new Promise(r => { release = r; }); next(); }];
        const first = R._handleRouteChange();
        await tick(5);
        window.location.hash = '#/b';
        R._handleRouteChange();
        await tick(30);
        expect(R.rendered).toEqual([]);      // /b did not overtake /a
        release();
        await first;
        expect(R.rendered).toEqual(['a', 'b']);
    });

    it('a denied change does not stop later ones', async () => {
        const R = makeRouter();
        R._middleware = [(to, from, next) => { if (to.path !== '/c') next(); }];
        window.location.hash = '#/c';
        await R._handleRouteChange();
        expect(R.rendered).toEqual([]);
        window.location.hash = '#/b';
        await R._handleRouteChange();
        expect(R.rendered).toEqual(['b']);
    });
});

describe('router - catching up from a not-found screen', () => {
    it('Back during a not-found screen shows the page the address names again', async () => {
        window.location.hash = '#/a';
        const R = makeRouter();
        await R._handleRouteChange();
        window.location.hash = '#/missing';
        R._renderNotFound = async function () { this._transitioning = true; await tick(20); this.rendered.push('404'); this._transitioning = false; };
        const nf = R._handleRouteChange();
        await tick(5);
        window.location.hash = '#/a';
        R._handleRouteChange();
        await nf;
        expect(R.rendered).toEqual(['a', '404', 'a']);
    });

    it('destroy() clears a run in flight, so the next init routes at once', async () => {
        const R = makeRouter();
        R._routing = true; R._missedChange = true;
        R.destroy();
        expect([R._routing, R._missedChange, R._shownPath]).toEqual([false, false, null]);
    });
});

describe('router - a not-found override that adds routes and asks again', () => {
    it('the retry is caught up (as Domma CMS does after loading plugins)', async () => {
        window.location.hash = '#/plug';
        const R = makeRouter();
        R._renderNotFound = async function () { this._routes = [...this._routes, {path: '/plug', view: 'plug'}]; return this._handleRouteChange(); };
        await R._handleRouteChange();
        expect(R.rendered).toEqual(['plug']);
        expect(R._currentRoute.path).toBe('/plug');
    });
});
