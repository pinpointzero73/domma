// src/auth.test.js - token verification keeps the session unless the server refuses it.
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {auth} from './auth.js';
import {storage} from './storage.js';

const API = 'https://site.test/api';
const USER = {id: 1, email: 'a@b.c', role: 'admin'};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status, headers: {'Content-Type': 'application/json'}
});

/** A fresh auth with a stored token, and fetch answering `respond()`. */
function setup(respond, {autoCheck = false} = {}) {
    auth.token = null;
    auth.user = null;
    auth.eventHandlers = {};
    auth.initialized = false;
    storage.set('auth_token', 'tok-1');
    storage.set('auth_user', USER);
    const fetchMock = vi.fn(async () => respond());
    vi.stubGlobal('fetch', fetchMock);
    const expired = vi.fn();
    auth.on('tokenExpired', expired);
    auth.init({apiUrl: API, autoCheck});
    return {fetchMock, expired};
}

const flush = () => new Promise(r => setTimeout(r, 0));

describe('auth._verifyToken', () => {
    beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
    afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

    it('a valid token refreshes the stored user', async () => {
        const {fetchMock} = setup(() => json({success: true, user: {...USER, name: 'New'}}));
        await expect(auth._verifyToken()).resolves.toEqual({...USER, name: 'New'});
        expect(fetchMock.mock.calls[0][0]).toBe(`${API}/auth/me`);
        expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer tok-1');
        expect(storage.get('auth_user').name).toBe('New');
    });

    for (const status of [401, 403]) {
        it(`a ${status} clears the token and user`, async () => {
            setup(() => json({error: 'Invalid token'}, status));
            await expect(auth._verifyToken()).rejects.toThrow('Invalid token');
            expect(auth.token).toBeNull();
            expect(auth.user).toBeNull();
            expect(storage.get('auth_token')).toBeNull();
            expect(storage.get('auth_user')).toBeNull();
        });
    }

    it('a 200 that says success:false (the server refusing it) clears the token', async () => {
        setup(() => json({success: false}));
        await expect(auth._verifyToken()).rejects.toThrow('Token verification failed');
        expect(auth.token).toBeNull();
    });

    it('a network error keeps the token and user', async () => {
        setup(() => { throw new TypeError('Failed to fetch'); });
        await expect(auth._verifyToken()).rejects.toThrow('Failed to fetch');
        expect(auth.token).toBe('tok-1');
        expect(auth.user).toEqual(USER);
        expect(storage.get('auth_token')).toBe('tok-1');
        expect(auth.isAuthenticated()).toBe(true);
    });

    for (const status of [500, 502, 503]) {
        it(`a ${status} keeps the token`, async () => {
            setup(() => json({error: 'Server down'}, status));
            await expect(auth._verifyToken()).rejects.toThrow();
            expect(auth.token).toBe('tok-1');
            expect(storage.get('auth_user')).toEqual(USER);
        });
    }

    it('rejects with no token without calling the server', async () => {
        const {fetchMock} = setup(() => json({}));
        auth.token = null;
        await expect(auth._verifyToken()).rejects.toThrow('No token to verify');
        expect(fetchMock).not.toHaveBeenCalled();
    });
});

describe('auth.init autoCheck', () => {
    beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
    afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

    it('an offline start keeps the session and emits no tokenExpired', async () => {
        const {expired} = setup(() => { throw new TypeError('Failed to fetch'); }, {autoCheck: true});
        await flush();
        await flush();
        expect(auth.token).toBe('tok-1');
        expect(auth.isAuthenticated()).toBe(true);
        expect(expired).not.toHaveBeenCalled();
    });

    it('a 401 at start clears the session and emits tokenExpired', async () => {
        const {expired} = setup(() => json({error: 'expired'}, 401), {autoCheck: true});
        await flush();
        await flush();
        expect(auth.token).toBeNull();
        expect(auth.isAuthenticated()).toBe(false);
        expect(expired).toHaveBeenCalledTimes(1);
    });
});

describe('UserInfo', () => {
    it('renders the signed-in user, and its logout button still works after a re-render', () => {
        const getUser = vi.spyOn(auth, 'getUser').mockReturnValue({email: 'a@b.c', role: 'admin'});
        const logout = vi.fn();
        document.body.innerHTML = '<div id="ui"></div>';
        const ui = auth.createUserInfo('#ui', {onLogout: logout});
        const el = document.getElementById('ui');
        expect(el.textContent).toContain('a@b.c');
        ui.render(); // a login/logout re-renders and replaces the button
        const handle = vi.spyOn(ui, 'handleLogout').mockImplementation(() => {});
        el.querySelector('.auth-logout-btn').click();
        expect(handle).toHaveBeenCalledTimes(1);
        ui.destroy();
        getUser.mockRestore();
    });
});
