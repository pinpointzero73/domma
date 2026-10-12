import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { scribe } from './effects.js';

describe('Scribe playback', () => {
  let now, frames, nextId, el, control;
  beforeEach(() => {
    now = 0; frames = new Map(); nextId = 0;
    vi.stubGlobal('requestAnimationFrame', fn => { frames.set(++nextId, fn); return nextId; });
    vi.stubGlobal('cancelAnimationFrame', id => frames.delete(id));
    window.matchMedia = vi.fn(() => ({ matches: false }));
    el = document.createElement('div'); document.body.appendChild(el);
  });
  afterEach(() => { control?.destroy(); control = null; vi.unstubAllGlobals(); });
  function frame(ms = 16) {
    now += ms;
    const pending = [...frames.values()]; frames.clear();
    pending.forEach(fn => fn(now));
  }
  function advance(ms) { for (let passed = 0; passed < ms; passed += 10) frame(10); }
  const text = () => Array.from(el.querySelectorAll('[class^="dm-scribe-char"], .dm-scribe-word, .dm-scribe-sentence'), span => span.textContent).join('');

  it('keeps fractional frame time instead of slowing each character to whole frames', () => {
    control = scribe(el, { speed: 20, actions: [{ render: 'abcdefghij' }] });
    frame(); for (let i = 0; i < 10; i++) frame();
    expect(text()).toBe('abcdefgh');
  });
  it('resumes typing without duplicating text, and repeated resume does not add runners', () => {
    const done = vi.fn();
    control = scribe(el, { speed: 20, actions: [{ render: 'Hello' }], onComplete: done });
    frame(); advance(40); expect(text()).toBe('He');
    control.pause(); advance(1000); expect(text()).toBe('He');
    control.resume(); control.resume(); frame(); advance(60);
    expect(text()).toBe('Hello'); expect(done).toHaveBeenCalledTimes(1);
    expect(control.isRunning()).toBe(false);
  });
  it('preserves the remaining wait across pause and resume', () => {
    control = scribe(el, { speed: 0, actions: [{ render: 'A' }, { wait: 100 }, { render: 'B' }] });
    frame(); advance(40); control.pause(); advance(1000);
    control.resume(); frame(); advance(50); expect(text()).toBe('A');
    advance(10); expect(text()).toBe('AB');
  });
  it('resumes deletion at the next unit', () => {
    control = scribe(el, { speed: 0, deleteSpeed: 20, actions: [{ render: 'ABCD' }, { undoRender: 'all' }] });
    frame(); advance(40); expect(text()).toBe('AB');
    control.pause(); control.resume(); frame(); advance(40); expect(text()).toBe('');
  });
  it('types and deletes emoji and combined accents as whole graphemes', () => {
    const unit = vi.fn(), deleted = vi.fn();
    control = scribe(el, { speed: 0, deleteSpeed: 20,
      actions: [{ render: 'A👩🏽‍💻e\u0301' }, { undoRender: 1 }], onCharacter: unit, onUndoRender: deleted });
    frame(); expect(unit.mock.calls.map(args => args[0])).toEqual(['A', '👩🏽‍💻', 'e\u0301']);
    advance(20); expect(text()).toBe('A👩🏽‍💻'); expect(deleted).toHaveBeenCalledWith('e\u0301');
  });
  it('holds the final phrase during the loop delay', () => {
    control = scribe(el, { speed: 0, loop: 2, loopDelay: 100, actions: [{ render: 'Hi' }] });
    frame(); advance(90); expect(text()).toBe('Hi');
    advance(10); expect(text()).toBe('Hi'); expect(control.isRunning()).toBe(false);
  });
  it('keeps the cursor steady during typing and blinks during waits', () => {
    control = scribe(el, { speed: 20, actions: [{ render: 'Hi' }, { wait: 100 }] });
    frame(); const cursor = el.querySelector('.dm-scribe-cursor');
    expect(cursor.classList.contains('dm-scribe-cursor-active')).toBe(true);
    expect(cursor.getAttribute('aria-hidden')).toBe('true');
    advance(40); expect(cursor.classList.contains('dm-scribe-cursor-active')).toBe(false);
  });
  it('starts only when requested and cannot revive a destroyed controller', () => {
    const start = vi.fn();
    control = scribe(el, { autoStart: false, speed: 0, actions: [{ render: 'Hi' }], onStart: start });
    expect(control.isRunning()).toBe(false); expect(start).not.toHaveBeenCalled();
    control.resume(); frame(); expect(text()).toBe('Hi');
    control.destroy(); control.resume(); control.restart(); frame(); expect(el.textContent).toBe('');
  });
  it('cancels an old wait on restart', () => {
    const done = vi.fn();
    control = scribe(el, { speed: 0, actions: [{ render: 'A' }, { wait: 100 }, { render: 'B' }], onComplete: done });
    frame(); advance(90); control.restart(); frame(); advance(90); expect(text()).toBe('A');
    advance(10); expect(text()).toBe('AB'); expect(done).toHaveBeenCalledTimes(1);
  });
  it('preserves leading spaces in word mode and wraps sentence content into units', () => {
    control = scribe(el, { mode: 'word', speed: 0, actions: [{ render: '  Hello world  ' }] });
    frame(); expect(text()).toBe('  Hello world  ');
  });
  it('keeps typewriter words together across render actions and partial undo', () => {
    control = scribe(el, { speed: 0, deleteSpeed: 0, actions: [
      { render: 'Hello wo', effect: 'bounce' }, { render: 'rld' },
      { undoRender: 3 }, { render: 'rk' }
    ] });
    frame();
    expect(text()).toBe('Hello work');
    expect(Array.from(el.querySelectorAll('.dm-scribe-word-group'), group => group.textContent))
      .toEqual(['Hello', 'work']);
    expect(el.querySelector('.dm-scribe-space').parentElement).toBe(el);
    control.restart(); frame();
    expect(el.querySelectorAll('.dm-scribe-word-group')).toHaveLength(2);
  });
  it('removes empty word groups when deleting all characters', () => {
    control = scribe(el, { speed: 0, deleteSpeed: 0,
      actions: [{ render: 'Hello world' }, { undoRender: 'all' }] });
    frame();
    expect(el.querySelectorAll('.dm-scribe-word-group')).toHaveLength(0);
  });
  it('shows a readable static phrase with reduced motion', () => {
    window.matchMedia = vi.fn(() => ({ matches: true }));
    control = scribe(el, { loop: true, actions: [{ render: 'Readable' }, { undoRender: 'all' }] });
    expect(el.textContent).toBe('Readable'); expect(frames.size).toBe(0);
  });
  it('uses the same continuation for hover pause', () => {
    control = scribe(el, { pauseOnHover: true, speed: 20, actions: [{ render: 'ABCD' }] });
    frame(); advance(40); el.dispatchEvent(new Event('mouseenter')); advance(100);
    el.dispatchEvent(new Event('mouseleave')); frame(); advance(40); expect(text()).toBe('ABCD');
  });
  it('hover cannot start a Scribe configured to wait for Play', () => {
    control = scribe(el, {autoStart: false, pauseOnHover: true, speed: 0, actions: [{render: 'Wait'}]});
    el.dispatchEvent(new Event('mouseenter')); el.dispatchEvent(new Event('mouseleave')); frame();
    expect(text()).toBe(''); expect(control.isRunning()).toBe(false);
    control.resume(); frame(); expect(text()).toBe('Wait');
  });
  it('hover does not resume a manual pause', () => {
    control = scribe(el, {pauseOnHover: true, speed: 20, actions: [{render: 'ABCD'}]});
    frame(); advance(20); control.pause();
    el.dispatchEvent(new Event('mouseenter')); el.dispatchEvent(new Event('mouseleave')); advance(100);
    expect(text()).toBe('A'); expect(control.isPaused()).toBe(true);
  });
});
