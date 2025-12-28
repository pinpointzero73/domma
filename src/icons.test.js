// src/icons.test.js
import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';

describe('Domma.icons - Icons Module', () => {

  const customIconName = 'vitest-custom-icon';
  const customIconDef = {
    viewBox: '0 0 100 100',
    path: 'M 10 10 H 90 V 90 H 10 Z',
  };

  // Unregister the custom icon after each test to ensure a clean state
  beforeEach(() => {
    if (Domma.icons.has(customIconName)) {
      Domma.icons.unregister(customIconName);
    }
  });

  it('`get()` should return the icon definition object', () => {
    const iconData = Domma.icons.get('home');
    expect(typeof iconData).toBe('object');
    expect(iconData).not.toBeNull();
    expect(iconData).toHaveProperty('viewBox');
    expect(iconData).toHaveProperty('path');
  });

  it('`get()` should return null for a non-existent icon', () => {
    const iconData = Domma.icons.get('non-existent-icon-xyz');
    expect(iconData).toBeNull();
  });

  it('`html()` should return an SVG string', () => {
    const svgString = Domma.icons.html('home');
    expect(typeof svgString).toBe('string');
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });

  it('`html()` should return an empty string for a non-existent icon', () => {
    const svgString = Domma.icons.html('non-existent-icon-xyz');
    expect(svgString).toBe('');
  });

  it('`html()` should apply size options', () => {
    const svgString = Domma.icons.html('home', {size: 48});
    expect(svgString).toContain('width="48"');
    expect(svgString).toContain('height="48"');
  });

  it('`html()` should apply color options', () => {
    const svgString = Domma.icons.html('home', {color: 'green'});
    // This is a robust way to check for color application on either stroke or fill
    expect(svgString).toMatch(/stroke="green"|fill="green"/);
  });

  it('`render()` should return an SVGElement instance', () => {
    const svgElement = Domma.icons.render('home');
    expect(svgElement.tagName).toBe('svg');
  });

  it('`list()` should return an array of icon names', () => {
    const iconList = Domma.icons.list();
    expect(Array.isArray(iconList)).toBe(true);
    expect(iconList.length).toBeGreaterThan(100); // Assuming there are many icons
    expect(iconList).toContain('home');
  });

  it('`has()` should correctly check for an icon\'s existence', () => {
    expect(Domma.icons.has('home')).toBe(true);
    expect(Domma.icons.has('this-icon-does-not-exist')).toBe(false);
  });

  it('`register()` should add a new icon from a definition object', () => {
    expect(Domma.icons.has(customIconName)).toBe(false);

    Domma.icons.register(customIconName, customIconDef);

    expect(Domma.icons.has(customIconName)).toBe(true);
    const iconData = Domma.icons.get(customIconName);
    expect(iconData).toEqual(customIconDef);

    const svgString = Domma.icons.html(customIconName);
    expect(svgString).toContain(customIconDef.path);
  });

  it('`unregister()` should remove a previously registered icon', () => {
    Domma.icons.register(customIconName, customIconDef);
    expect(Domma.icons.has(customIconName)).toBe(true);

    const unregisterResult = Domma.icons.unregister(customIconName);
    expect(unregisterResult).toBe(true);
    expect(Domma.icons.has(customIconName)).toBe(false);

    const nonExistentUnregister = Domma.icons.unregister('non-existent');
    expect(nonExistentUnregister).toBe(false);
  });
});