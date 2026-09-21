/**
 * DatePicker - the calendar that replaces `<input type="date">`.
 *
 * The properties that matter are the ones the native control gets wrong and
 * the ones everything downstream depends on: the value is ISO and local (not
 * shifted by a timezone), the input keeps the value, and a click on a day
 * fires the same events typing would - without which nothing bound to the
 * input ever hears about it.
 */
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

describe('Domma.elements.datePicker', () => {
    let host;
    let input;

    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
        input = document.createElement('input');
        input.type = 'text';
        host.appendChild(input);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.useRealTimers();
    });

    // ---- value -----------------------------------------------------------

    it('reads the input it is attached to', () => {
        input.value = '2026-09-21';
        const dp = Domma.elements.datePicker(input);
        expect(dp.getValue()).toBe('2026-09-21');
        dp.destroy();
    });

    it('keeps a local calendar date rather than a UTC instant', () => {
        // The bug this guards: `new Date('2026-09-21')` is UTC midnight, and
        // `toISOString().slice(0,10)` on a local date shifts it the other way.
        // Either mistake moves the date by a day for half the planet.
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21'});
        const date = dp.getDate();
        expect(date.getFullYear()).toBe(2026);
        expect(date.getMonth()).toBe(8);
        expect(date.getDate()).toBe(21);
        expect(dp.getValue()).toBe('2026-09-21');
        dp.destroy();
    });

    it('refuses a date that does not exist', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-02-31'});
        expect(dp.getValue()).toBe('');
        dp.destroy();
    });

    it('writes the value into the input and fires input and change', () => {
        const dp = Domma.elements.datePicker(input);
        const seen = [];
        input.addEventListener('input', () => seen.push('input'));
        input.addEventListener('change', () => seen.push('change'));

        dp.setValue('2026-01-02');

        expect(input.value).toBe('2026-01-02');
        expect(seen).toEqual(['input', 'change']);
        dp.destroy();
    });

    it('does not fire when the value has not actually changed', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-01-02'});
        let fired = 0;
        input.addEventListener('change', () => fired++);
        dp.setValue('2026-01-02');
        expect(fired).toBe(0);
        dp.destroy();
    });

    it('shows a formatted date but still reports ISO', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21', format: 'DD MMM YYYY'});
        expect(input.value).toBe('21 Sep 2026');
        expect(dp.getValue()).toBe('2026-09-21');
        // The displayed text is no longer the value, so the value has to be
        // readable off the element by anything that did not ask the instance.
        expect(input.dataset.date).toBe('2026-09-21');
        dp.destroy();
    });

    it('clamps a value outside min/max', () => {
        const dp = Domma.elements.datePicker(input, {min: '2026-03-01', max: '2026-03-31'});
        dp.setValue('2026-01-01');
        expect(dp.getValue()).toBe('2026-03-01');
        dp.setValue('2026-12-25');
        expect(dp.getValue()).toBe('2026-03-31');
        dp.destroy();
    });

    it('clears', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21'});
        dp.clear();
        expect(dp.getValue()).toBe('');
        expect(input.value).toBe('');
        dp.destroy();
    });

    // ---- the calendar ----------------------------------------------------

    it('draws six weeks starting on the configured first day', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21', firstDay: 1});
        dp.open();
        const panel = document.querySelector('.dm-datepicker');
        expect(panel).not.toBeNull();
        expect(panel.querySelectorAll('.dm-datepicker-row').length).toBe(7); // header + 6
        expect(panel.querySelector('.dm-datepicker-weekday').textContent).toBe('Mo');
        expect(panel.querySelectorAll('.dm-datepicker-day').length).toBe(42);
        dp.destroy();
    });

    it('starts on Sunday when asked', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21', firstDay: 0});
        dp.open();
        expect(document.querySelector('.dm-datepicker-weekday').textContent).toBe('Su');
        dp.destroy();
    });

    it('marks the selected day and disables what is out of range', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21', min: '2026-09-10'});
        dp.open();
        const selected = document.querySelector('.dm-datepicker-day.is-selected');
        expect(selected.dataset.dmDate).toBe('2026-09-21');
        expect(document.querySelector('[data-dm-date="2026-09-05"]').disabled).toBe(true);
        expect(document.querySelector('[data-dm-date="2026-09-15"]').disabled).toBe(false);
        dp.destroy();
    });

    it('honours a disabledDates predicate', () => {
        const dp = Domma.elements.datePicker(input, {
            value: '2026-09-21',
            // No weekends.
            disabledDates: (d) => d.getDay() === 0 || d.getDay() === 6
        });
        dp.open();
        expect(document.querySelector('[data-dm-date="2026-09-19"]').disabled).toBe(true); // Saturday
        expect(document.querySelector('[data-dm-date="2026-09-21"]').disabled).toBe(false); // Monday
        dp.destroy();
    });

    it('picks a date when a day is clicked', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21'});
        dp.open();
        document.querySelector('[data-dm-date="2026-09-08"]').click();
        expect(dp.getValue()).toBe('2026-09-08');
        expect(input.value).toBe('2026-09-08');
        dp.destroy();
    });

    it('ignores a click on a disabled day', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21', min: '2026-09-10'});
        dp.open();
        document.querySelector('[data-dm-date="2026-09-05"]').click();
        expect(dp.getValue()).toBe('2026-09-21');
        dp.destroy();
    });

    it('moves a month at a time without changing the value', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21'});
        dp.open();
        document.querySelectorAll('.dm-datepicker-nav')[0].click(); // previous
        expect(document.querySelector('.dm-datepicker-select').value).toBe('7'); // August
        expect(dp.getValue()).toBe('2026-09-21');
        dp.destroy();
    });

    it('exposes exactly one tabbable day', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21'});
        dp.open();
        const tabbable = document.querySelectorAll('.dm-datepicker-day[tabindex="0"]');
        expect(tabbable.length).toBe(1);
        expect(tabbable[0].dataset.dmDate).toBe('2026-09-21');
        dp.destroy();
    });

    it('opens inline without a popup', () => {
        const dp = Domma.elements.datePicker(input, {inline: true, value: '2026-09-21'});
        expect(input.nextElementSibling.classList.contains('dm-datepicker')).toBe(true);
        expect(input.nextElementSibling.classList.contains('dm-datepicker--inline')).toBe(true);
        dp.destroy();
    });

    it('takes the panel with it when destroyed', () => {
        const dp = Domma.elements.datePicker(input, {value: '2026-09-21'});
        dp.open();
        expect(document.querySelector('.dm-datepicker')).not.toBeNull();
        dp.destroy();
        expect(document.querySelector('.dm-datepicker')).toBeNull();
    });

    it('never leaves a native picker underneath its own', () => {
        const native = document.createElement('input');
        native.type = 'date';
        host.appendChild(native);
        const dp = Domma.elements.datePicker(native);
        expect(native.type).toBe('text');
        dp.destroy();
    });
});
