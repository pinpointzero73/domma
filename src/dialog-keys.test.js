// src/dialog-keys.test.js
// The "Enter trap": a dialog opened from inside a keydown handler must not
// answer itself with the key event that opened it.
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;

const key = (target, k, init = {}) => {
    const ev = new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true, ...init});
    target.dispatchEvent(ev);
    return ev;
};

// Track how a dialog promise settles without awaiting it.
const watch = (promise) => {
    const state = {settled: false, value: undefined};
    promise.then((v) => {
        state.settled = true;
        state.value = v;
    });
    return state;
};

const flush = async (ms = 0) => {
    await vi.advanceTimersByTimeAsync(ms);
};

describe('Dialog - keys', () => {
    let row;

    beforeEach(() => {
        vi.useFakeTimers();
        row = document.createElement('div');
        row.tabIndex = 0;
        document.body.appendChild(row);
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    // Opens a confirm from a keydown Enter handler on a row, the way a list
    // row action that asks "Throw away the changes?" does.
    const openFromEnter = (factory) => {
        let state;
        row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') state = watch(factory());
        });
        key(row, 'Enter');
        return () => state;
    };

    it('a confirm opened by Enter stays open after that Enter bubbles', async () => {
        const get = openFromEnter(() => E.confirm('Throw away the changes?', {animation: false}));
        await flush(100);
        expect(get().settled).toBe(false);
        expect(document.querySelector('button.dm-dialog-confirm')).not.toBeNull();
    });

    it('a fresh Enter afterwards answers OK', async () => {
        const get = openFromEnter(() => E.confirm('Throw away the changes?', {animation: false}));
        await flush(10);
        key(document.body, 'Enter');
        await flush();
        expect(get()).toEqual({settled: true, value: true});
        expect(document.querySelector('.dm-dialog')).toBeNull();
    });

    it('with the default animation, the fresh Enter still resolves true', async () => {
        const get = openFromEnter(() => E.confirm('Sure?'));
        await flush(10);
        key(document.body, 'Enter');
        await flush(250);
        expect(get()).toEqual({settled: true, value: true});
    });

    it('a held Enter (auto-repeat) does not answer; a fresh press does', async () => {
        const get = openFromEnter(() => E.confirm('Sure?', {animation: false}));
        await flush(10);
        const repeat = key(document.body, 'Enter', {repeat: true});
        await flush();
        expect(get().settled).toBe(false);
        expect(repeat.defaultPrevented).toBe(false);
        // Repeats that land on a dialog button are kept from activating it.
        const held = key(document.querySelector('button.dm-dialog-confirm'), 'Enter', {repeat: true});
        expect(held.defaultPrevented).toBe(true);
        expect(get().settled).toBe(false);
        key(document.body, 'Enter');
        await flush();
        expect(get()).toEqual({settled: true, value: true});
    });

    it('an alert opened by Enter is not dismissed by that Enter', async () => {
        const get = openFromEnter(() => E.alert('Saved', {animation: false}));
        await flush(100);
        expect(get().settled).toBe(false);
        key(document.body, 'Enter');
        await flush();
        expect(get().settled).toBe(true);
    });

    it('an Escape that opened the dialog does not cancel it; a fresh Escape does', async () => {
        let state;
        row.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') state = watch(E.confirm('Leave?', {animation: false}));
        });
        key(row, 'Escape');
        await flush(100);
        expect(state.settled).toBe(false);
        key(document.body, 'Escape');
        await flush();
        expect(state).toEqual({settled: true, value: false});
    });

    it('Escape still cancels a confirm opened normally', async () => {
        const state = watch(E.confirm('Sure?', {animation: false}));
        await flush(10);
        key(document.body, 'Escape');
        await flush();
        expect(state).toEqual({settled: true, value: false});
    });

    it('clicks are unaffected, even before the key listener attaches', async () => {
        const state = watch(E.confirm('Sure?', {animation: false}));
        document.querySelector('button.dm-dialog-confirm').click();
        await flush();
        expect(state).toEqual({settled: true, value: true});

        const second = watch(E.confirm('Sure?', {animation: false}));
        document.querySelector('.dm-dialog-cancel').click();
        await flush();
        expect(second).toEqual({settled: true, value: false});
    });

    it('a dialog closed by click leaves no key listener behind', async () => {
        const state = watch(E.confirm('Sure?', {animation: false}));
        await flush(10);
        const spy = vi.spyOn(window, 'removeEventListener');
        document.querySelector('.dm-dialog-cancel').click();
        await flush();
        expect(state.value).toBe(false);
        expect(spy.mock.calls.some(([type]) => type === 'keydown')).toBe(true);
        spy.mockRestore();
    });

    it('Enter on a focused Cancel button does not confirm', async () => {
        const state = watch(E.confirm('Sure?', {animation: false}));
        await flush(60);
        const cancel = document.querySelector('.dm-dialog-cancel');
        key(cancel, 'Enter');
        await flush();
        // The document handler leaves a focused button to activate itself.
        expect(state.settled).toBe(false);
        cancel.click(); // what the browser does for Enter on a button
        await flush();
        expect(state).toEqual({settled: true, value: false});
    });

    it('danger: true focuses Cancel and styles OK as danger', async () => {
        watch(E.confirm('Delete it?', {animation: false, danger: true}));
        await flush(60);
        const cancel = document.querySelector('.dm-dialog-cancel');
        const ok = document.querySelector('button.dm-dialog-confirm');
        expect(document.activeElement).toBe(cancel);
        expect(ok.classList.contains('btn-danger')).toBe(true);
        expect(ok.classList.contains('btn-primary')).toBe(false);
    });

    it('danger: true - Enter with focus off the buttons does nothing; the OK button still confirms', async () => {
        const state = watch(E.confirm('Delete it?', {animation: false, danger: true}));
        await flush(60);
        document.activeElement.blur(); // e.g. a click on the dialog text
        const ev = key(document.body, 'Enter');
        await flush();
        expect(state.settled).toBe(false);
        expect(ev.defaultPrevented).toBe(true);
        key(document.querySelector('.dm-dialog-overlay'), 'Enter');
        await flush();
        expect(state.settled).toBe(false);
        document.querySelector('button.dm-dialog-confirm').click();
        await flush();
        expect(state).toEqual({settled: true, value: true});
    });

    it('by default OK has focus and is primary', async () => {
        watch(E.confirm('Sure?', {animation: false}));
        await flush(60);
        const ok = document.querySelector('button.dm-dialog-confirm');
        expect(document.activeElement).toBe(ok);
        expect(ok.classList.contains('btn-primary')).toBe(true);
    });

    describe('prompt', () => {
        it('opened by Enter: that Enter does not submit; Enter in the input does', async () => {
            const get = openFromEnter(() => E.prompt('Name?', {animation: false, inputValue: 'Ada'}));
            await flush(60);
            expect(get().settled).toBe(false);
            const input = document.querySelector('.dm-dialog-input');
            expect(document.activeElement).toBe(input);
            input.value = 'Grace';
            key(input, 'Enter');
            await flush();
            expect(get()).toEqual({settled: true, value: 'Grace'});
        });

        it('Enter outside the input does not submit; Escape returns null', async () => {
            const state = watch(E.prompt('Name?', {animation: false}));
            await flush(60);
            key(document.body, 'Enter');
            await flush();
            expect(state.settled).toBe(false);
            key(document.querySelector('.dm-dialog-input'), 'Escape');
            await flush();
            expect(state).toEqual({settled: true, value: null});
        });

        it('danger does not take focus from the input', async () => {
            watch(E.prompt('Type DELETE', {animation: false, danger: true}));
            await flush(60);
            expect(document.activeElement).toBe(document.querySelector('.dm-dialog-input'));
        });
    });

    describe('Escape over slideovers', () => {
        const slideover = (opts = {}) => E.slideover({title: 'Panel', content: '<p>x</p>', animation: false, ...opts});

        it('Escape on a confirm over a slideover closes only the confirm', async () => {
            const panel = slideover().open();
            await flush(400);
            const state = watch(E.confirm('Throw away the changes?', {animation: false}));
            await flush(10);
            key(document.body, 'Escape');
            await flush(400);
            expect(state).toEqual({settled: true, value: false});
            expect(panel.isOpen()).toBe(true);
            // The next Escape reaches the slideover.
            key(document.body, 'Escape');
            await flush(400);
            expect(panel.isOpen()).toBe(false);
        });

        it('Escape on a prompt over a slideover closes only the prompt', async () => {
            const panel = slideover().open();
            await flush(400);
            const state = watch(E.prompt('Name?', {animation: false}));
            await flush(60);
            key(document.querySelector('.dm-dialog-input'), 'Escape');
            await flush(400);
            expect(state).toEqual({settled: true, value: null});
            expect(panel.isOpen()).toBe(true);
        });

        it('a confirm with keyboard: false keeps Escape from the slideover beneath', async () => {
            const panel = slideover().open();
            await flush(400);
            const state = watch(E.confirm('Sure?', {animation: false, keyboard: false}));
            await flush(10);
            key(document.body, 'Escape');
            await flush(400);
            expect(state.settled).toBe(false);
            expect(panel.isOpen()).toBe(true);
        });

        it('two stacked slideovers: one Escape closes only the top one', async () => {
            const lower = slideover({title: 'Lower'}).open();
            const upper = slideover({title: 'Upper'}).open();
            await flush(400);
            key(document.body, 'Escape');
            await flush(400);
            expect(upper.isOpen()).toBe(false);
            expect(lower.isOpen()).toBe(true);
            key(document.body, 'Escape');
            await flush(400);
            expect(lower.isOpen()).toBe(false);
        });

        it('a top slideover with closeOnEscape: false stays open, and so does the one beneath', async () => {
            const lower = slideover({title: 'Lower'}).open();
            const upper = slideover({title: 'Upper', closeOnEscape: false}).open();
            await flush(400);
            key(document.body, 'Escape');
            await flush(400);
            expect(upper.isOpen()).toBe(true);
            expect(lower.isOpen()).toBe(true);
            upper.close();
            await flush(400);
            key(document.body, 'Escape');
            await flush(400);
            expect(lower.isOpen()).toBe(false);
        });

        it('a slideover removed from the page while open is dropped from the stack', async () => {
            const lower = slideover({title: 'Lower'}).open();
            const gone = slideover({title: 'Gone'}).open();
            await flush(400);
            gone.element.remove(); // view teardown without close() or destroy()
            key(document.body, 'Escape');
            await flush(400);
            expect(lower.isOpen()).toBe(false);
            const stack = lower.constructor._stack;
            expect(stack.includes(gone)).toBe(false);
            expect(stack.includes(lower)).toBe(false);
        });

        it('a single slideover still closes on Escape', async () => {
            const panel = slideover().open();
            await flush(400);
            key(document.body, 'Escape');
            await flush(400);
            expect(panel.isOpen()).toBe(false);
        });
    });
});
