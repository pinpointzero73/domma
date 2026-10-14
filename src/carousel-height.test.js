import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const instances = [];
afterEach(() => {
    instances.forEach(carousel => carousel.destroy());
    instances.length = 0;
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
});

function fixture(options = {}, dimensions = [[1200, 600], [800, 1200], [1000, 1000]]) {
    const element = document.createElement('div');
    element.className = 'carousel';
    element.innerHTML = `<div class="carousel-track">${dimensions.map(() => '<div class="carousel-slide"><img><div class="carousel-slide-content">Caption</div></div>').join('')}</div>`;
    document.body.appendChild(element);
    let width = 600;
    Object.defineProperty(element, 'clientWidth', {get: () => width});
    element.querySelectorAll('img').forEach((image, i) => {
        Object.defineProperties(image, {
            naturalWidth: {value: dimensions[i][0], configurable: true},
            naturalHeight: {value: dimensions[i][1], configurable: true}
        });
    });
    const carousel = Domma.elements.carousel(element, {showArrows: false, showIndicators: false, ...options});
    instances.push(carousel);
    return {element, carousel, resize: value => {width = value; window.dispatchEvent(new Event('resize'));}};
}

describe('carousel image viewport', () => {
    for (const animation of ['slide', 'fade', 'crossfade']) {
        it(`uses the shortest scaled image by default for ${animation}`, () => {
            const {element, carousel} = fixture({animation});
            expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('300px');
            expect(element.classList.contains('carousel-sized')).toBe(true);
            carousel.goTo(1);
            expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('300px');
        });
    }

    it('takes the midpoint of the shortest and tallest, rather than the mean of all images', () => {
        const {element} = fixture({heightMode: 'average'}, [[1000, 500], [1000, 600], [1000, 1500]]);
        expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('600px');
    });

    it('recalculates the scaled heights on resize and when options change', () => {
        const {element, carousel, resize} = fixture({heightMode: 'average'});
        resize(300);
        expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('300px');
        carousel.setOptions({heightMode: 'crop'});
        expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('150px');
    });

    it('uses a fixed height even before images have loaded', () => {
        const {element, resize} = fixture({height: 420}, [[0, 0]]);
        resize(300);
        expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('420px');
    });

    it('waits for image dimensions and updates on load', () => {
        const {element} = fixture({}, [[0, 0]]);
        expect(element.classList.contains('carousel-sized')).toBe(false);
        const image = element.querySelector('img');
        Object.defineProperties(image, {naturalWidth: {value: 1000}, naturalHeight: {value: 500}});
        image.dispatchEvent(new Event('load'));
        expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('300px');
    });

    it('keeps text-only carousels in flow', () => {
        const {element, carousel} = fixture({}, []);
        carousel.destroy();
        element.innerHTML = '<div class="carousel-track"><div class="carousel-slide"><div class="carousel-slide-content">A text slide</div></div></div>';
        instances.push(Domma.elements.carousel(element));
        expect(element.classList.contains('carousel-sized')).toBe(false);
    });

    it('disconnects its resize observer and removes image listeners on destroy', () => {
        let callback;
        const disconnect = vi.fn();
        vi.stubGlobal('ResizeObserver', class {
            constructor(cb) { callback = cb; }
            observe() {}
            disconnect() { disconnect(); }
        });
        const {element, carousel} = fixture();
        callback();
        carousel.destroy();
        expect(disconnect).toHaveBeenCalledOnce();
        expect(element.classList.contains('carousel-sized')).toBe(false);
        element.querySelector('img').dispatchEvent(new Event('load'));
        expect(element.style.getPropertyValue('--dm-carousel-height')).toBe('');
        instances.length = 0;
    });
});
