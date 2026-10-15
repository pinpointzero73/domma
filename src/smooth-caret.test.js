import {afterEach, describe, expect, it, vi} from 'vitest';
import {attachSmoothCaret, getCaretPreference, installSmoothCarets, setCaretPreference, supportsSmoothCaret} from './smooth-caret.js';

const handles = [];
afterEach(() => {
    handles.splice(0).reverse().forEach(handle => handle.destroy());
    document.body.replaceChildren();
    localStorage.removeItem('domma:editor-caret');
    vi.unstubAllGlobals();
});
function browserFeatures() {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    vi.stubGlobal('matchMedia', () => ({matches: false, addEventListener() {}, removeEventListener() {}}));
}
function field(type = 'text') {
    const wrapper = document.createElement('div');
    const input = document.createElement('input'); input.type = type;
    wrapper.append(input); document.body.append(wrapper);
    return input;
}

describe('smooth caret lifecycle', () => {
    it('enhances editable text controls and excludes passwords and picker controls', () => {
        for (const type of ['text', 'url', 'search', 'tel']) expect(supportsSmoothCaret(field(type))).toBe(true);
        for (const type of ['password', 'email', 'number', 'date', 'file', 'checkbox', 'hidden']) expect(supportsSmoothCaret(field(type))).toBe(false);
        const input = field(); input.readOnly = true; expect(supportsSmoothCaret(input)).toBe(false);
        input.readOnly = false; input.disabled = true; expect(supportsSmoothCaret(input)).toBe(false);
    });
    it('is idempotent so automatic installation does not duplicate explicit editors', () => {
        browserFeatures(); const input = field();
        const explicit = attachSmoothCaret(input); handles.push(explicit);
        const install = installSmoothCarets(document); handles.push(install);
        expect(installSmoothCarets(document)).toBe(install);
        input.focus(); expect(attachSmoothCaret(input)).toBe(explicit);
        expect(document.querySelectorAll('.dm-smooth-caret-layer')).toHaveLength(1);
        input.blur(); expect(document.querySelectorAll('.dm-smooth-caret-layer')).toHaveLength(1);
    });
    it('enhances fields added later and releases automatic instances on blur', () => {
        browserFeatures(); handles.push(installSmoothCarets(document));
        const input = field(); input.focus();
        expect(document.querySelectorAll('.dm-smooth-caret-layer')).toHaveLength(1);
        input.blur(); expect(document.querySelectorAll('.dm-smooth-caret-layer')).toHaveLength(0);
    });
    it('cleans up when a wizard removes its focused field', async () => {
        browserFeatures(); handles.push(installSmoothCarets(document));
        const input = field(); input.focus(); input.parentElement.remove();
        await Promise.resolve();
        expect(document.querySelectorAll('.dm-smooth-caret-layer')).toHaveLength(0);
    });
    it('never creates an overlay for a password field', () => {
        browserFeatures(); handles.push(installSmoothCarets(document));
        const input = field('password'); input.focus();
        expect(document.querySelectorAll('.dm-smooth-caret-layer')).toHaveLength(0);
    });
    it('stores and sanitises the shared preference', () => {
        expect(getCaretPreference()).toBe('auto');
        setCaretPreference('smooth'); expect(getCaretPreference()).toBe('smooth');
        setCaretPreference('native'); expect(getCaretPreference()).toBe('native');
        setCaretPreference('invalid'); expect(getCaretPreference()).toBe('auto');
    });
});
