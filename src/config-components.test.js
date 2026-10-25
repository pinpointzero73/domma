// src/config-components.test.js - $.setup() hands each component the options it was given
import {afterEach, describe, expect, it} from 'vitest';
import {elements} from './elements.js';
import {configEngine} from './config.js';

describe('initComponent', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('passes cookieConsent, notification and alarm their options, not the selector', () => {
        const calls = [];
        const saved = {};
        for (const name of ['cookieConsent', 'notification', 'alarm']) {
            saved[name] = elements[name];
            elements[name] = (...args) => { calls.push([name, args]); return {}; };
        }
        try {
            // initComponent reads the factories when called, through its map
            configEngine.initComponent('body', 'cookieConsent', {message: 'hi'});
            configEngine.initComponent('body', 'notification', {title: 'T'});
            configEngine.initComponent('body', 'alarm', {label: 'A'});
        } finally {
            Object.assign(elements, saved);
        }
        expect(calls).toEqual([
            ['cookieConsent', [{message: 'hi'}]],
            ['notification', [{title: 'T'}]],
            ['alarm', [{label: 'A'}]]
        ]);
    });

    it('still hands element components the selector first', () => {
        document.body.innerHTML = '<div id="t"><div class="tab-list"></div></div>';
        const saved = elements.tabs;
        let got;
        elements.tabs = (...args) => { got = args; return {}; };
        try {
            configEngine.initComponent('#t', 'tabs', {fade: true});
        } finally {
            elements.tabs = saved;
        }
        expect(got).toEqual(['#t', {fade: true}]);
    });
});
