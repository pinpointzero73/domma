// src/theme.test.js
import {beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

describe('Domma.theme - Theme Module (Refactored)', () => {

  beforeEach(() => {
    // Initialize Domma.theme before each test
    Domma.setup({
      theme: 'charcoal-light', // Use a valid full theme name
      autoDetect: false,
      persist: false
    });
  });

  it('get() should return the current theme', () => {
    const theme = Domma.theme.get();
    expect(theme).toBe('charcoal-light');
  });

  it('set() should change the theme', () => {
    const original = Domma.theme.get();
    expect(original).toBe('charcoal-light');

    Domma.theme.set('ocean-dark');
    expect(Domma.theme.get()).toBe('ocean-dark');

    Domma.theme.set(original); // restore
    expect(Domma.theme.get()).toBe('charcoal-light');
  });

  it('listThemes() should return an array of all available themes', () => {
    const themes = Domma.theme.listThemes();
    expect(Array.isArray(themes)).toBe(true);
    expect(themes.length).toBe(16);
    expect(themes).toContain('forest-dark');
    expect(themes).not.toContain('light'); // Old format should not exist
  });

  it('should switch between light and dark modes of a theme', () => {
    Domma.theme.set('silver-light');
    expect(Domma.theme.get()).toBe('silver-light');
    expect(Domma.theme.isLight()).toBe(true);
    expect(Domma.theme.isDark()).toBe(false);

    // Switch to dark mode of the same base
    Domma.theme.set('silver-dark');
    expect(Domma.theme.get()).toBe('silver-dark');
    expect(Domma.theme.isDark()).toBe(true);
    expect(Domma.theme.isLight()).toBe(false);
  });

  it('onChange() should trigger callback with old and new themes', () => {
    const onChangeSpy = vi.fn();
    const unsubscribe = Domma.theme.onChange(onChangeSpy);

    const initialTheme = Domma.theme.get();
    const newTheme = 'sunset-dark';

    Domma.theme.set(newTheme);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(initialTheme, newTheme);

    unsubscribe();
    Domma.theme.set('royal-light'); // This should not trigger the spy
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});
