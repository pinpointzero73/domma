// src/chooser.test.js
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Domma from './index.js';

describe('Domma.elements.chooser', () => {
  let host;

  beforeEach(() => {
    host = document.createElement('div');
    host.id = 'chooser-host';
    document.body.appendChild(host);
  });

  afterEach(() => {
    host = null;
  });

  describe('basic single-select card variant', () => {
    it('renders a card-variant chooser with options', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' }
        ]
      });

      expect(c).not.toBeNull();
      const root = host.querySelector('.domma-chooser');
      expect(root).not.toBeNull();
      expect(root.getAttribute('data-variant')).toBe('card');
      expect(root.querySelectorAll('.picker-option').length).toBe(2);
    });

    it('selects an option when clicked and exposes getValue()', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' }
        ]
      });

      const second = host.querySelectorAll('.picker-option')[1];
      second.click();

      expect(c.getValue()).toBe('b');
      expect(host.querySelectorAll('.picker-option')[1].classList.contains('is-selected')).toBe(true);
    });

    it('only one option is selected at a time when multiple is false', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' }
        ]
      });

      host.querySelectorAll('.picker-option')[0].click();
      host.querySelectorAll('.picker-option')[1].click();

      expect(c.getValue()).toBe('b');
      const opts = host.querySelectorAll('.picker-option');
      expect(opts[0].classList.contains('is-selected')).toBe(false);
      expect(opts[1].classList.contains('is-selected')).toBe(true);
    });

    it('setValue() updates the rendered selection', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' }
        ]
      });

      c.setValue('a');
      expect(host.querySelectorAll('.picker-option')[0].classList.contains('is-selected')).toBe(true);
      expect(c.getValue()).toBe('a');
    });

    it('destroy() removes the chooser DOM', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        options: [{ value: 'a', label: 'Alpha' }]
      });

      c.destroy();
      expect(host.querySelector('.domma-chooser')).toBeNull();
    });
  });

  describe('multi-select', () => {
    it('multiple: true allows toggling several options', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ]
      });

      host.querySelectorAll('.picker-option')[0].click();
      host.querySelectorAll('.picker-option')[2].click();
      expect(c.getValue()).toEqual(['a', 'c']);

      host.querySelectorAll('.picker-option')[0].click(); // deselect
      expect(c.getValue()).toEqual(['c']);
    });

    it('uses role="group" with role="checkbox" when multiple is true', () => {
      Domma.elements.chooser('#chooser-host', {
        multiple: true,
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.picker-options').getAttribute('role')).toBe('group');
      expect(host.querySelector('.picker-option').getAttribute('role')).toBe('checkbox');
    });

    it('uses role="radiogroup" with role="radio" when multiple is false', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.picker-options').getAttribute('role')).toBe('radiogroup');
      expect(host.querySelector('.picker-option').getAttribute('role')).toBe('radio');
    });
  });

  describe('chip variant', () => {
    it('renders with data-variant="chip"', () => {
      Domma.elements.chooser('#chooser-host', {
        variant: 'chip',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-variant')).toBe('chip');
    });

    it('does not render the picker-option-tick in chip variant', () => {
      Domma.elements.chooser('#chooser-host', {
        variant: 'chip',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.picker-option-tick')).toBeNull();
    });

    it('chip variant does not render description', () => {
      Domma.elements.chooser('#chooser-host', {
        variant: 'chip',
        options: [{ value: 'a', label: 'A', description: 'never shown' }]
      });
      expect(host.querySelector('.picker-option-desc')).toBeNull();
    });
  });

  describe('density', () => {
    it('compact density hides description', () => {
      Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        density: 'compact',
        options: [{ value: 'a', label: 'A', description: 'hidden' }]
      });
      expect(host.querySelector('.picker-option-desc')).toBeNull();
      expect(host.querySelector('.domma-chooser').getAttribute('data-density')).toBe('compact');
    });

    it('comfortable density shows description in card variant', () => {
      Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        density: 'comfortable',
        options: [{ value: 'a', label: 'A', description: 'shown' }]
      });
      expect(host.querySelector('.picker-option-desc').textContent).toBe('shown');
    });
  });

  describe('columns', () => {
    it('sets the --picker-cols custom property', () => {
      Domma.elements.chooser('#chooser-host', {
        variant: 'card',
        columns: 4,
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').style.getPropertyValue('--picker-cols')).toBe('4');
    });
  });

  describe('per-option flags', () => {
    it('renders icon when option.icon is set', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', icon: 'rocket' }]
      });
      const iconEl = host.querySelector('.picker-option-icon');
      expect(iconEl).not.toBeNull();
      expect(iconEl.getAttribute('data-icon')).toBe('rocket');
    });

    it('omits icon when option.icon is not set', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.picker-option-icon')).toBeNull();
    });

    it('renders description in card+comfortable variant', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', description: 'sub' }]
      });
      expect(host.querySelector('.picker-option-desc').textContent).toBe('sub');
    });

    it('renders badge with the right type class', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', badge: { text: 'NEW', type: 'success' } }]
      });
      const badgeEl = host.querySelector('.picker-option-badge .badge');
      expect(badgeEl).not.toBeNull();
      expect(badgeEl.classList.contains('badge-success')).toBe(true);
      expect(badgeEl.textContent).toBe('NEW');
    });

    it('badge defaults to primary type when type omitted', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', badge: { text: 'X' } }]
      });
      expect(host.querySelector('.picker-option-badge .badge').classList.contains('badge-primary')).toBe(true);
    });

    it('adds is-recommended when option.recommended is true', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', recommended: true }]
      });
      expect(host.querySelector('.picker-option').classList.contains('is-recommended')).toBe(true);
    });

    it('disabled options cannot be selected by click', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        options: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B' }
        ]
      });
      host.querySelectorAll('.picker-option')[0].click();
      expect(c.getValue()).toBeNull();
      host.querySelectorAll('.picker-option')[1].click();
      expect(c.getValue()).toBe('b');
    });

    it('disabled options carry aria-disabled', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', disabled: true }]
      });
      expect(host.querySelector('.picker-option').getAttribute('aria-disabled')).toBe('true');
    });

    it('tooltip puts the text in a data-tooltip attribute', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A', tooltip: 'hello' }]
      });
      expect(host.querySelector('.picker-option').getAttribute('data-tooltip')).toBe('hello');
    });
  });

  describe('accessibility & native form integration', () => {
    it('emits hidden radio inputs when name is set and multiple is false', () => {
      Domma.elements.chooser('#chooser-host', {
        name: 'plan',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      const natives = host.querySelectorAll('input.picker-native-input');
      expect(natives.length).toBe(2);
      expect(natives[0].type).toBe('radio');
      expect(natives[0].name).toBe('plan');
      expect(natives[0].value).toBe('a');
    });

    it('emits hidden checkboxes when name is set and multiple is true', () => {
      Domma.elements.chooser('#chooser-host', {
        name: 'tags',
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      const natives = host.querySelectorAll('input.picker-native-input');
      expect(natives[0].type).toBe('checkbox');
      expect(natives[0].name).toBe('tags[]');
    });

    it('aria-checked reflects selection state', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      c.setValue('a');
      const opts = host.querySelectorAll('.picker-option');
      expect(opts[0].getAttribute('aria-checked')).toBe('true');
      expect(opts[1].getAttribute('aria-checked')).toBe('false');
    });

    it('first option has tabindex 0 when multiple is false', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      const opts = host.querySelectorAll('.picker-option');
      expect(opts[0].getAttribute('tabindex')).toBe('0');
      expect(opts[1].getAttribute('tabindex')).toBe('-1');
    });

    it('every option has tabindex 0 when multiple is true', () => {
      Domma.elements.chooser('#chooser-host', {
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      host.querySelectorAll('.picker-option').forEach((o) => {
        expect(o.getAttribute('tabindex')).toBe('0');
      });
    });

    it('onChange callback fires with the new value', () => {
      let captured;
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A' }],
        onChange: (v) => { captured = v; }
      });
      host.querySelector('.picker-option').click();
      expect(captured).toBe('a');
    });
  });

  describe('keyboard navigation', () => {
    it('arrow keys move selection in radio mode', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ]
      });
      const first = host.querySelectorAll('.picker-option')[0];
      first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(c.getValue()).toBe('b');
      const second = host.querySelector('.picker-option[data-value="b"]');
      second.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(c.getValue()).toBe('c');
      const third = host.querySelector('.picker-option[data-value="c"]');
      third.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(c.getValue()).toBe('b');
    });

    it('arrow keys skip disabled options', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
          { value: 'c', label: 'C' }
        ]
      });
      const first = host.querySelectorAll('.picker-option')[0];
      first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(c.getValue()).toBe('c');
    });

    it('Space toggles in checkbox mode', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      let first = host.querySelectorAll('.picker-option')[0];
      first.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(c.getValue()).toEqual(['a']);
      first = host.querySelectorAll('.picker-option')[0];
      first.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(c.getValue()).toEqual([]);
    });

    it('Enter selects in radio mode', () => {
      const c = Domma.elements.chooser('#chooser-host', {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      });
      const second = host.querySelectorAll('.picker-option')[1];
      second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(c.getValue()).toBe('b');
    });
  });

  describe('forms.js integration', () => {
    it('renders inside Forma as a chooser field', () => {
      const schema = {
        plan: {
          type: 'chooser',
          variant: 'card',
          label: 'Plan',
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' }
          ]
        }
      };
      const form = Domma.forms.create(schema);
      form.renderTo(host);

      expect(host.querySelector('.domma-chooser')).not.toBeNull();
      expect(host.querySelector('.domma-chooser[data-variant="card"]')).not.toBeNull();
    });

    it('captures the value through the form pipeline', () => {
      const schema = {
        plan: {
          type: 'chooser',
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' }
          ]
        }
      };
      const form = Domma.forms.create(schema);
      form.renderTo(host);

      host.querySelectorAll('.picker-option')[1].click();
      expect(form.getData().plan).toBe('b');
    });

    it('multi-select returns an array', () => {
      const schema = {
        tags: {
          type: 'chooser',
          multiple: true,
          options: [
            { value: 'x', label: 'X' },
            { value: 'y', label: 'Y' }
          ]
        }
      };
      const form = Domma.forms.create(schema);
      form.renderTo(host);

      host.querySelectorAll('.picker-option')[0].click();
      host.querySelectorAll('.picker-option')[1].click();
      expect(form.getData().tags).toEqual(['x', 'y']);
    });

    it('required validation fails when no option selected', () => {
      const schema = {
        plan: {
          type: 'chooser',
          required: true,
          options: [{ value: 'a', label: 'A' }]
        }
      };
      const form = Domma.forms.create(schema);
      form.renderTo(host);

      const ok = form.validate();
      expect(ok).toBe(false);
    });

    it('required validation passes when an option is selected', () => {
      const schema = {
        plan: {
          type: 'chooser',
          required: true,
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' }
          ]
        }
      };
      const form = Domma.forms.create(schema);
      form.renderTo(host);

      host.querySelectorAll('.picker-option')[0].click();
      const ok = form.validate();
      expect(ok).toBe(true);
    });

    it('multi-select required validation fails when array is empty', () => {
      const schema = {
        tags: {
          type: 'chooser',
          multiple: true,
          required: true,
          options: [{ value: 'x', label: 'X' }]
        }
      };
      const form = Domma.forms.create(schema);
      form.renderTo(host);

      const ok = form.validate();
      expect(ok).toBe(false);
    });
  });

  describe('visual options', () => {
    it('semantic accent value sets data-accent attribute', () => {
      Domma.elements.chooser('#chooser-host', {
        accent: 'success',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-accent')).toBe('success');
    });

    it('hex accent value sets --picker-accent inline variable', () => {
      Domma.elements.chooser('#chooser-host', {
        accent: '#ff6699',
        options: [{ value: 'a', label: 'A' }]
      });
      const root = host.querySelector('.domma-chooser');
      expect(root.getAttribute('data-accent')).toBeNull();
      expect(root.style.getPropertyValue('--picker-accent')).toBe('#ff6699');
    });

    it('default accent is primary (no data-accent attribute)', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A' }]
      });
      // 'primary' is the default - JS sets data-accent="primary" too
      expect(host.querySelector('.domma-chooser').getAttribute('data-accent')).toBe('primary');
    });

    it('glow:true sets data-glow="true"', () => {
      Domma.elements.chooser('#chooser-host', {
        glow: true,
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-glow')).toBe('true');
    });

    it('glow:false leaves data-glow unset', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-glow')).toBeNull();
    });

    it('semantic glowColour sets data-glow-colour', () => {
      Domma.elements.chooser('#chooser-host', {
        glow: true,
        glowColour: 'info',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-glow-colour')).toBe('info');
    });

    it('hex glowColour sets --picker-glow-colour inline', () => {
      Domma.elements.chooser('#chooser-host', {
        glow: true,
        glowColour: '#00ffaa',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').style.getPropertyValue('--picker-glow-colour')).toBe('#00ffaa');
    });

    it('shadow weight sets data-shadow', () => {
      Domma.elements.chooser('#chooser-host', {
        shadow: 'lg',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-shadow')).toBe('lg');
    });

    it('shadow:"none" leaves data-shadow unset', () => {
      Domma.elements.chooser('#chooser-host', {
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-shadow')).toBeNull();
    });

    it('shadowColour sets --picker-shadow-colour inline', () => {
      Domma.elements.chooser('#chooser-host', {
        shadow: 'md',
        shadowColour: 'rgba(0,0,0,0.3)',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').style.getPropertyValue('--picker-shadow-colour')).toBe('rgba(0,0,0,0.3)');
    });

    it('accentStyle other than "border" sets data-accent-style', () => {
      ['solid', 'glow', 'overlay', 'underline'].forEach((style) => {
        host.replaceChildren();
        Domma.elements.chooser(host, {
          accentStyle: style,
          options: [{ value: 'a', label: 'A' }]
        });
        expect(host.querySelector('.domma-chooser').getAttribute('data-accent-style')).toBe(style);
      });
    });

    it('accentStyle:"border" leaves data-accent-style unset (default)', () => {
      Domma.elements.chooser('#chooser-host', {
        accentStyle: 'border',
        options: [{ value: 'a', label: 'A' }]
      });
      expect(host.querySelector('.domma-chooser').getAttribute('data-accent-style')).toBeNull();
    });
  });
});
