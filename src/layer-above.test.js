// src/layer-above.test.js - body-level popups opened from inside an overlay draw above it
import {afterEach, describe, expect, it} from 'vitest';
import Domma from './index.js';
import {layerAbove} from './components/shared.js';

afterEach(() => { document.body.innerHTML = ''; });

describe('layerAbove', () => {
    it('lifts a popup above its trigger\'s stacking layer, and leaves it alone otherwise', () => {
        document.body.innerHTML = '<div id="layer" style="position:fixed;z-index:9999"><input id="t"></div><div id="p" style="position:absolute;z-index:1080"></div><input id="plain">';
        const popup = document.getElementById('p');
        layerAbove(document.getElementById('t'), popup);
        expect(popup.style.zIndex).toBe('10000');
        layerAbove(document.getElementById('plain'), popup);
        expect(popup.style.zIndex).toBe('');
    });

    it('a date picker opened inside a slideover draws above the slideover', () => {
        const so = Domma.elements.slideover({title: 'S', content: '<input id="dp" type="text">'});
        so.open();
        const dp = Domma.elements.datePicker(so.element.querySelector('#dp'));
        dp.open();
        const panel = document.querySelector('.dm-datepicker-panel, .dm-datepicker');
        expect(Number(panel.style.zIndex)).toBeGreaterThan(9999);
        dp.destroy();
        so.destroy();
    });
});
