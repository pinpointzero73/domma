import {it, expect, vi, afterEach} from 'vitest';
import {tickerTape} from './effects.js';
afterEach(() => {vi.restoreAllMocks(); vi.unstubAllGlobals();});
it('uses CSS coordinates on retina and keeps pause, resume and destroy working', () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('ResizeObserver', class {observe() {} disconnect() {}});
    Object.defineProperty(window, 'devicePixelRatio', {value: 2, configurable: true});
    const ctx = new Proxy({setTransform: vi.fn(), clearRect: vi.fn()}, {get(t, k) {return t[k] || (() => {});}});
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
    const host = document.createElement('div'); document.body.appendChild(host);
    host.getBoundingClientRect = () => ({width: 320, height: 180});
    const control = tickerTape(host, {density: 0, respectMotionPreference: false});
    const canvas = host.querySelector('canvas'); expect(canvas.width).toBe(640); expect(canvas.height).toBe(360);
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 320, 180);
    control.pause(); expect(control.isPaused()).toBe(true); control.resume(); expect(control.isRunning()).toBe(true);
    control.destroy(); expect(host.querySelector('canvas')).toBeNull(); expect(control.isRunning()).toBe(false); host.remove();
});
