// src/dates.test.js
import {describe, expect, it} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object

describe('Domma.dates - Dates Module Tests', () => {

  it('Dates - create from current time', () => {
    const d = Domma.dates();
    expect(d.isValid()).toBe(true);
    expect(typeof d.year()).toBe('number');
  });

  it('Dates - create from string', () => {
    const d = Domma.dates('2025-06-15');
    expect(d.isValid()).toBe(true);
    expect(d.year()).toBe(2025);
    expect(d.month()).toBe(5); // Month is 0-indexed (June = 5)
    expect(d.date()).toBe(15);
  });

  it('Dates - create from timestamp', () => {
    const timestamp = 1718452800000; // 2024-06-15 12:00:00 UTC
    const d = Domma.dates(timestamp);
    expect(d.isValid()).toBe(true);
  });

  it('Dates - format basic', () => {
    const d = Domma.dates('2025-12-25');
    expect(d.format('YYYY')).toBe('2025');
    expect(d.format('MM')).toBe('12');
    expect(d.format('DD')).toBe('25');
  });

  it('Dates - format full', () => {
    const d = Domma.dates('2025-03-05');
    const formatted = d.format('DD/MM/YYYY');
    expect(formatted).toBe('05/03/2025');
  });

  it('Dates - add days', () => {
    const d = Domma.dates('2025-01-01').add(5, 'days');
    expect(d.date()).toBe(6);
  });

  it('Dates - add months', () => {
    const d = Domma.dates('2025-01-15').add(2, 'months');
    expect(d.month()).toBe(2); // March = 2
  });

  it('Dates - subtract days', () => {
    const d = Domma.dates('2025-01-10').subtract(3, 'days');
    expect(d.date()).toBe(7);
  });

  it('Dates - startOf day', () => {
    const d = Domma.dates('2025-06-15T14:30:00').startOf('day');
    expect(d.hour()).toBe(0);
    expect(d.minute()).toBe(0);
  });

  it('Dates - startOf month', () => {
    const d = Domma.dates('2025-06-15').startOf('month');
    expect(d.date()).toBe(1);
  });

  it('Dates - endOf month', () => {
    const d = Domma.dates('2025-02-10').endOf('month');
    expect(d.date()).toBe(28); // February 2025 is not a leap year
  });

  it('Dates - isBefore', () => {
    const d1 = Domma.dates('2025-01-01');
    const d2 = Domma.dates('2025-12-31');
    expect(d1.isBefore(d2)).toBe(true);
    expect(d2.isBefore(d1)).toBe(false);
  });

  it('Dates - isAfter', () => {
    const d1 = Domma.dates('2025-12-31');
    const d2 = Domma.dates('2025-01-01');
    expect(d1.isAfter(d2)).toBe(true);
    expect(d2.isAfter(d1)).toBe(false); // Added for completeness
  });

  it('Dates - isSame', () => {
    const d1 = Domma.dates('2025-06-15');
    const d2 = Domma.dates('2025-06-15');
    expect(d1.isSame(d2, 'day')).toBe(true);
    const d3 = Domma.dates('2025-06-15T10:00:00');
    const d4 = Domma.dates('2025-06-15T12:00:00');
    expect(d3.isSame(d4, 'day')).toBe(true);
    expect(d3.isSame(d4, 'hour')).toBe(false);
  });

  it('Dates - diff in days', () => {
    const d1 = Domma.dates('2025-01-01');
    const d2 = Domma.dates('2025-01-11');
    expect(d2.diff(d1, 'days')).toBe(10);
  });

  it('Dates - clone', () => {
    const d1 = Domma.dates('2025-06-15');
    const d2 = d1.clone().add(1, 'day');
    expect(d1.date()).toBe(15); // Original should be unchanged
    expect(d2.date()).toBe(16); // Clone should be modified
    expect(d1).not.toBe(d2); // Should be a different object instance
  });

  it('Dates - isValid false for invalid', () => {
    const d = Domma.dates('invalid-date');
    expect(d.isValid()).toBe(false);
  });

  it('Dates - unix timestamp', () => {
    const d = Domma.dates('2025-01-01T00:00:00Z');
    const unix = d.unix();
    expect(typeof unix).toBe('number');
    // Example: expect a specific unix timestamp if precise (optional)
    // expect(unix).toBe(1735689600); // Unix timestamp for 2025-01-01 00:00:00 UTC
  });

  it('Dates - toISOString', () => {
    const d = Domma.dates('2025-06-15T12:34:56.789Z');
    const iso = d.toISOString();
    expect(iso).include('2025-06-15');
    expect(iso).include('T12:34:56.789Z'); // Check for specific time part
  });
});
