// src/elements.test.js
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

describe('Domma.elements - UI Components', () => {
  let testContainer;

  beforeEach(() => {
    testContainer = document.createElement('div');
    testContainer.id = 'test-container-elements';
    document.body.appendChild(testContainer);
    vi.useFakeTimers(); // Use fake timers for all element tests
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    testContainer = null;
  });

  describe('Modal', () => {
    it('modal() should create an instance from a selector', () => {
      testContainer.innerHTML = '<div id="test-modal" class="modal"><div class="modal-content">Test</div></div>';
      const modal = Domma.elements.modal('#test-modal');
      expect(modal).not.toBeNull();
      expect(typeof modal.open).toBe('function');
      expect(typeof modal.close).toBe('function');
    });

    it('modal() should open and close an existing modal', async () => {
      testContainer.innerHTML = '<div id="test-modal-toggle" class="modal" style="display: none;"><div class="modal-content">Test</div></div>';
      const modal = Domma.elements.modal('#test-modal-toggle');

      modal.open();
      await vi.advanceTimersByTimeAsync(10);
      expect(modal.isOpen()).toBe(true);

      modal.close();
      await vi.advanceTimersByTimeAsync(500);
      expect(modal.isOpen()).toBe(false);
    });

    it('createModal() should return a new modal instance', () => {
      const modal = Domma.elements.createModal({title: 'Test Modal'});
      expect(modal).not.toBeNull();
      expect(typeof modal.open).toBe('function');
      expect(modal._factoryCreated).toBe(true);
      modal.remove();
    });

    it.skip('createModal() should handle custom buttons and onButtonClick callback', async () => {
      const onButtonClickSpy = vi.fn();
      const modal = Domma.elements.createModal({
        title: 'Confirm',
        buttons: [{id: 'ok', text: 'OK'}],
        onButtonClick: onButtonClickSpy,
        animation: false,
      });

      modal.open();
      const okButton = document.querySelector('[data-button-id="ok"]');
      expect(okButton).not.toBeNull();
      okButton.click();

      await vi.runAllTimersAsync();
      expect(onButtonClickSpy).toHaveBeenCalledWith('ok', expect.any(Object));
      modal.remove();
    });

    it.skip('showModal() should return a promise that resolves with button ID', async () => {
      const promise = Domma.elements.showModal({
        title: 'Test Promise',
        buttons: [{id: 'ok', text: 'OK'}],
        animation: false,
      });

      await vi.advanceTimersByTimeAsync(50);

      const okBtn = document.querySelector('[data-button-id="ok"]');
      expect(okBtn).not.toBeNull();
      okBtn.click();

      await expect(promise).resolves.toBe('ok');
    });

    it('modal() should handle different creation modes', () => {
      const factoryModal = Domma.elements.modal({title: 'Factory'});
      expect(factoryModal._factoryCreated).toBe(true);
      factoryModal.remove();

      testContainer.innerHTML = '<div id="selector-modal" class="modal"></div>';
      const selectorModal = Domma.elements.modal('#selector-modal');
      expect(selectorModal._factoryCreated).toBe(undefined);

      const el = document.createElement('div');
      const elementModal = Domma.elements.modal(el);
      expect(elementModal._factoryCreated).toBe(undefined);
    });
  });

  it('tabs() should create a tabs instance', () => {
    testContainer.innerHTML = `
      <div id="test-tabs">
        <div class="tabs-nav"><button data-tab="tab1"></button></div>
        <div class="tabs-content"><div data-panel="tab1"></div></div>
      </div>
    `;
    const tabs = Domma.elements.tabs('#test-tabs');
    expect(tabs).not.toBeNull();
    expect(typeof tabs.show).toBe('function');
  });

  it('accordion() should create an accordion instance', () => {
    testContainer.innerHTML = `
      <div id="test-accordion">
        <div class="accordion-item">
          <div class="accordion-header"></div><div class="accordion-body"></div>
        </div>
      </div>
    `;
    const accordion = Domma.elements.accordion('#test-accordion');
    expect(accordion).not.toBeNull();
    expect(typeof accordion.open).toBe('function');
  });

  it('tooltip() should create a tooltip instance', () => {
    testContainer.innerHTML = '<button id="test-tooltip-btn"></button>';
    const tooltip = Domma.elements.tooltip('#test-tooltip-btn', {content: 'Tooltip'});
    expect(tooltip).not.toBeNull();
    expect(typeof tooltip.show).toBe('function');
  });

  describe('Card', () => {
    it('card() should create a card instance', () => {
      // Safe: hardcoded test fixture HTML, not user input
      testContainer.innerHTML = '<div id="test-card" class="card"><div class="card-body">Content</div></div>';
      const card = Domma.elements.card('#test-card');
      expect(card).not.toBeNull();
    });

    it('card() with collapsible option should add collapse icon', () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="collapsible-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#collapsible-card', {collapsible: true});

      // Card renders as a <domma-card> Web Component. Collapsible state is a
      // HOST ATTRIBUTE (its shadow CSS keys off :host([collapsible])), and the
      // collapse chrome is built inside the SHADOW ROOT - not as light-DOM
      // classes. The .card-collapsible/.card-collapsed rules in elements.css
      // serve hand-written, JS-free cards; adding them to the host would make
      // those rules double-apply to the slotted light-DOM nodes.
      expect(card.element.hasAttribute('collapsible')).toBe(true);
      expect(card.element.shadowRoot.querySelector('.card-collapse-icon')).not.toBeNull();
      expect(card.element.shadowRoot.querySelector('.card-header-content')).not.toBeNull();
    });

    it('card() should collapse and expand', async () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="toggle-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#toggle-card', {collapsible: true});

      // Initially expanded
      expect(card.isCollapsed()).toBe(false);

      // Collapse
      card.collapse();
      await vi.advanceTimersByTimeAsync(10);
      expect(card.isCollapsed()).toBe(true);
      // Collapsed state is a host attribute; shadow CSS collapses the body via
      // :host([collapsed]) .card-body-wrapper
      expect(card.element.hasAttribute('collapsed')).toBe(true);

      // Expand
      card.expand();
      await vi.advanceTimersByTimeAsync(10);
      expect(card.isCollapsed()).toBe(false);
      expect(card.element.hasAttribute('collapsed')).toBe(false);
    });

    it('card() toggle() should switch collapsed state', async () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="toggle-test-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#toggle-test-card', {collapsible: true});

      expect(card.isCollapsed()).toBe(false);

      card.toggle();
      await vi.advanceTimersByTimeAsync(10);
      expect(card.isCollapsed()).toBe(true);

      card.toggle();
      await vi.advanceTimersByTimeAsync(10);
      expect(card.isCollapsed()).toBe(false);
    });

    it('card() should fire onCollapse and onExpand callbacks', async () => {
      const onCollapseSpy = vi.fn();
      const onExpandSpy = vi.fn();

      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="callback-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#callback-card', {
        collapsible: true,
        onCollapse: onCollapseSpy,
        onExpand: onExpandSpy
      });

      card.collapse();
      await vi.advanceTimersByTimeAsync(10);
      expect(onCollapseSpy).toHaveBeenCalledWith(card);

      card.expand();
      await vi.advanceTimersByTimeAsync(10);
      expect(onExpandSpy).toHaveBeenCalledWith(card);
    });

    it('card() should start collapsed if collapsed option is true', () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="initially-collapsed-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#initially-collapsed-card', {
        collapsible: true,
        collapsed: true
      });

      expect(card.isCollapsed()).toBe(true);
      expect(card.element.hasAttribute('collapsed')).toBe(true);
    });

    it('card() should persist state to localStorage with element ID', async () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="persist-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#persist-card', {collapsible: true});

      // Collapse and check localStorage
      card.collapse();
      await vi.advanceTimersByTimeAsync(10);

      const stored = Domma.storage.get('domma-card-persist-card');
      expect(stored).not.toBeNull();
      expect(stored.collapsed).toBe(true);

      // Expand and check localStorage updated
      card.expand();
      await vi.advanceTimersByTimeAsync(10);

      const storedAfter = Domma.storage.get('domma-card-persist-card');
      expect(storedAfter.collapsed).toBe(false);
    });

    it('card() should use custom persistKey when provided', async () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card(testContainer.querySelector('.card'), {
        collapsible: true,
        persistKey: 'my-custom-key'
      });

      card.collapse();
      await vi.advanceTimersByTimeAsync(10);

      const stored = Domma.storage.get('my-custom-key');
      expect(stored).not.toBeNull();
      expect(stored.collapsed).toBe(true);
    });

    it('card() should restore collapsed state from localStorage', () => {
      // Pre-populate localStorage
      Domma.storage.set('domma-card-restore-card', {collapsed: true});

      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="restore-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#restore-card', {collapsible: true});

      // Should be collapsed based on localStorage
      expect(card.isCollapsed()).toBe(true);
      expect(card.element.hasAttribute('collapsed')).toBe(true);
    });

    it('card() clicking header should toggle collapse', async () => {
      // Safe: hardcoded test fixture HTML
      testContainer.innerHTML = `
        <div id="click-card" class="card">
          <div class="card-header"><h3>Title</h3></div>
          <div class="card-body">Content</div>
        </div>
      `;
      const card = Domma.elements.card('#click-card', {collapsible: true});
      const header = card.element.querySelector('.card-header');

      expect(card.isCollapsed()).toBe(false);

      // Click to collapse
      header.click();
      await vi.advanceTimersByTimeAsync(10);
      expect(card.isCollapsed()).toBe(true);

      // Click to expand
      header.click();
      await vi.advanceTimersByTimeAsync(10);
      expect(card.isCollapsed()).toBe(false);
    });
  });

  it('buttonGroup() should create a button group instance', () => {
    testContainer.innerHTML = '<div id="test-btn-group"></div>';
    const group = Domma.elements.buttonGroup('#test-btn-group');
    expect(group).not.toBeNull();
    expect(typeof group.getValue).toBe('function');
  });

  it('backToTop() should create a backToTop instance', () => {
    testContainer.innerHTML = '<button id="test-back-to-top"></button>';
    const backToTop = Domma.elements.backToTop('#test-back-to-top');
    expect(backToTop).not.toBeNull();
    expect(typeof backToTop.scroll).toBe('function');
    backToTop.destroy();
  });

  describe('Navbar appearOnHover', () => {
    const ITEMS = [
      {text: 'Home', url: '#'},
      {text: 'Products', items: [{text: 'Widgets', url: '#a'}, {text: 'Gadgets', url: '#b'}]}
    ];
    // jsdom defaults window.innerWidth to 1024 (>= collapseAt), so the desktop
    // hover path runs. mouseover/mouseout bubble, so dispatch from the toggle.
    const fire = (el, type, relatedTarget = null) =>
      el.dispatchEvent(new MouseEvent(type, {bubbles: true, relatedTarget}));

    it('opens a dropdown on hover and closes it after the delay on leave', () => {
      testContainer.innerHTML = '<nav id="nav-hover"></nav>';
      const nav = Domma.elements.navbar('#nav-hover', {items: ITEMS, appearOnHover: true});
      const dropdown = nav.element.querySelector('.navbar-dropdown');
      const toggle = dropdown.querySelector('.navbar-dropdown-toggle');

      fire(toggle, 'mouseover');
      expect(dropdown.classList.contains('open')).toBe(true);

      // Leaving the navbar entirely schedules a close after hoverCloseDelay.
      fire(toggle, 'mouseout', document.body);
      expect(dropdown.classList.contains('open')).toBe(true); // still open before timer
      vi.advanceTimersByTime(250);
      expect(dropdown.classList.contains('open')).toBe(false);

      nav.destroy();
    });

    it('keeps working after setItems() re-renders the dropdown DOM (regression)', () => {
      testContainer.innerHTML = '<nav id="nav-rerender"></nav>';
      const nav = Domma.elements.navbar('#nav-rerender', {items: ITEMS, appearOnHover: true});

      // Re-render replaces the inner DOM, discarding the original dropdown nodes.
      nav.setItems([
        {text: 'Docs', url: '#'},
        {text: 'More', items: [{text: 'Blog', url: '#c'}, {text: 'FAQ', url: '#d'}]}
      ]);

      const dropdown = nav.element.querySelector('.navbar-dropdown');
      const toggle = dropdown.querySelector('.navbar-dropdown-toggle');

      // Delegated on the persistent nav element, hover still resolves the new node.
      fire(toggle, 'mouseover');
      expect(dropdown.classList.contains('open')).toBe(true);

      nav.destroy();
    });

    it('a click pins a hovered dropdown open against the next pointer move', () => {
      testContainer.innerHTML = '<nav id="nav-pin"></nav>';
      const nav = Domma.elements.navbar('#nav-pin', {items: ITEMS, appearOnHover: true});
      const dropdown = nav.element.querySelector('.navbar-dropdown');
      const toggle = dropdown.querySelector('.navbar-dropdown-toggle');

      fire(toggle, 'mouseover');
      toggle.click();
      expect(dropdown.classList.contains('open')).toBe(true);

      // Hover reconciliation used to undo the click on the very next mousemove.
      fire(nav.element, 'mouseover');
      expect(dropdown.classList.contains('open')).toBe(true);

      // And leaving the bar no longer closes what was deliberately pinned.
      fire(toggle, 'mouseout', document.body);
      vi.advanceTimersByTime(500);
      expect(dropdown.classList.contains('open')).toBe(true);

      nav.destroy();
    });

    it('a second click unpins, and hover does not reopen under a still pointer', () => {
      testContainer.innerHTML = '<nav id="nav-unpin"></nav>';
      const nav = Domma.elements.navbar('#nav-unpin', {items: ITEMS, appearOnHover: true});
      const dropdown = nav.element.querySelector('.navbar-dropdown');
      const toggle = dropdown.querySelector('.navbar-dropdown-toggle');

      toggle.click();
      expect(dropdown.classList.contains('open')).toBe(true);

      toggle.click();
      expect(dropdown.classList.contains('open')).toBe(false);

      fire(toggle, 'mouseover');
      expect(dropdown.classList.contains('open')).toBe(false);

      nav.destroy();
    });

    it('opening one dropdown by click closes its siblings', () => {
      testContainer.innerHTML = '<nav id="nav-siblings"></nav>';
      const nav = Domma.elements.navbar('#nav-siblings', {
        items: [
          {text: 'One', items: [{text: 'a', url: '#'}]},
          {text: 'Two', items: [{text: 'b', url: '#'}]}
        ]
      });
      const [first, second] = nav.element.querySelectorAll('.navbar-dropdown');

      first.querySelector('.navbar-dropdown-toggle').click();
      expect(first.classList.contains('open')).toBe(true);

      second.querySelector('.navbar-dropdown-toggle').click();
      expect(first.classList.contains('open')).toBe(false);
      expect(second.classList.contains('open')).toBe(true);

      nav.destroy();
    });

    it('does not bind hover behaviour when appearOnHover is false', () => {
      testContainer.innerHTML = '<nav id="nav-nohover"></nav>';
      const nav = Domma.elements.navbar('#nav-nohover', {items: ITEMS});
      const dropdown = nav.element.querySelector('.navbar-dropdown');
      const toggle = dropdown.querySelector('.navbar-dropdown-toggle');

      fire(toggle, 'mouseover');
      expect(dropdown.classList.contains('open')).toBe(false);

      nav.destroy();
    });
  });
  describe('Dropdown', () => {
    // jsdom gives every element a zero rect, and the hover logic is geometric,
    // so pin real boxes: a 100x40 trigger with the menu 4px below it.
    const TRIGGER_BOX = {left: 100, right: 200, top: 100, bottom: 140, width: 100, height: 40};
    const MENU_BOX = {left: 100, right: 260, top: 144, bottom: 400, width: 160, height: 256};

    const stubRects = (dd) => {
      dd.element.getBoundingClientRect = () => ({...TRIGGER_BOX, x: TRIGGER_BOX.left, y: TRIGGER_BOX.top});
      if (dd._menu) {
        dd._menu.getBoundingClientRect = () => ({...MENU_BOX, x: MENU_BOX.left, y: MENU_BOX.top});
      }
    };

    const fire = (el, type, init = {}) =>
      el.dispatchEvent(new MouseEvent(type, {bubbles: true, ...init}));

    const menus = () => document.querySelectorAll('.domma-dropdown-menu');

    const ITEMS = [{text: 'One', value: 1}, {text: 'Two', value: 2}];

    it('opening one dropdown closes every other one', () => {
      testContainer.innerHTML = '<button id="dd-a"></button><button id="dd-b"></button>';
      const a = Domma.elements.dropdown('#dd-a', {items: ITEMS});
      const b = Domma.elements.dropdown('#dd-b', {items: ITEMS});

      a.open();
      expect(a.isOpen()).toBe(true);

      b.open();
      expect(a.isOpen()).toBe(false);
      expect(b.isOpen()).toBe(true);

      a.destroy();
      b.destroy();
    });

    it('does not swallow the trigger click, so other dropdowns still close', () => {
      testContainer.innerHTML = '<button id="dd-c"></button><button id="dd-d"></button>';
      const c = Domma.elements.dropdown('#dd-c', {items: ITEMS});
      const d = Domma.elements.dropdown('#dd-d', {items: ITEMS});
      const spy = vi.fn();
      document.addEventListener('click', spy);

      fire(c.element, 'click');
      expect(c.isOpen()).toBe(true);

      fire(d.element, 'click');
      expect(c.isOpen()).toBe(false);
      expect(d.isOpen()).toBe(true);
      // The trigger click reached document both times - no stopPropagation().
      expect(spy).toHaveBeenCalledTimes(2);

      document.removeEventListener('click', spy);
      c.destroy();
      d.destroy();
    });

    it('keeps a hover menu open while the pointer is in the gap below the trigger', () => {
      testContainer.innerHTML = '<button id="dd-hover"></button>';
      const dd = Domma.elements.dropdown('#dd-hover', {items: ITEMS, trigger: 'hover'});

      fire(dd.element, 'mouseenter');
      expect(dd.isOpen()).toBe(true);
      stubRects(dd);

      // Leaving the trigger arms the close...
      fire(dd.element, 'mouseleave');
      // ...but the pointer is in the corridor between trigger and menu, which is
      // outside both boxes. This is the move that used to close the menu.
      document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150, clientY: 142}));
      vi.advanceTimersByTime(1000);
      expect(dd.isOpen()).toBe(true);

      dd.destroy();
    });

    it('closes a hover menu once the pointer is outside trigger, menu and corridor', () => {
      testContainer.innerHTML = '<button id="dd-hover2"></button>';
      const dd = Domma.elements.dropdown('#dd-hover2', {items: ITEMS, trigger: 'hover'});

      fire(dd.element, 'mouseenter');
      stubRects(dd);
      fire(dd.element, 'mouseleave');

      document.dispatchEvent(new MouseEvent('mousemove', {clientX: 600, clientY: 600}));
      expect(dd.isOpen()).toBe(true); // still inside the grace period
      vi.advanceTimersByTime(300);
      expect(dd.isOpen()).toBe(false);

      dd.destroy();
    });

    it('re-opening inside the close animation reuses the menu node', () => {
      testContainer.innerHTML = '<button id="dd-reopen"></button>';
      const dd = Domma.elements.dropdown('#dd-reopen', {items: ITEMS});

      dd.open();
      const node = dd._menu;
      expect(menus()).toHaveLength(1);

      dd.close();
      // Node is still fading out here - the old code built a second one on top.
      dd.open();
      expect(menus()).toHaveLength(1);
      expect(dd._menu).toBe(node);

      vi.advanceTimersByTime(500);
      expect(menus()).toHaveLength(1);
      expect(dd.isOpen()).toBe(true);

      dd.destroy();
    });

    it('a closing menu stops taking pointer events immediately', () => {
      testContainer.innerHTML = '<button id="dd-fade"></button>';
      const dd = Domma.elements.dropdown('#dd-fade', {items: ITEMS});

      dd.open();
      const node = dd._menu;
      dd.close();
      expect(node.style.pointerEvents).toBe('none');

      vi.advanceTimersByTime(500);
      expect(menus()).toHaveLength(0);

      dd.destroy();
    });

    it('selects an item and closes', () => {
      testContainer.innerHTML = '<button id="dd-select"></button>';
      const onSelect = vi.fn();
      const dd = Domma.elements.dropdown('#dd-select', {items: ITEMS, onSelect});

      dd.open();
      dd._menu.querySelectorAll('.domma-dropdown-item')[1].click();

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect.mock.calls[0][0].value).toBe('2');
      expect(dd.isOpen()).toBe(false);

      dd.destroy();
    });

    it('Escape closes an open dropdown', () => {
      testContainer.innerHTML = '<button id="dd-esc"></button>';
      const dd = Domma.elements.dropdown('#dd-esc', {items: ITEMS});

      dd.open();
      document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
      expect(dd.isOpen()).toBe(false);

      dd.destroy();
    });

    it('tracks aria-expanded on the trigger', () => {
      testContainer.innerHTML = '<button id="dd-aria"></button>';
      const dd = Domma.elements.dropdown('#dd-aria', {items: ITEMS});

      expect(dd.element.getAttribute('aria-haspopup')).toBe('true');
      expect(dd.element.getAttribute('aria-expanded')).toBe('false');
      dd.open();
      expect(dd.element.getAttribute('aria-expanded')).toBe('true');
      dd.close();
      expect(dd.element.getAttribute('aria-expanded')).toBe('false');

      dd.destroy();
    });

    it('destroy() releases the menu and its document listeners', () => {
      testContainer.innerHTML = '<button id="dd-destroy"></button>';
      const dd = Domma.elements.dropdown('#dd-destroy', {items: ITEMS});

      dd.open();
      dd.destroy();

      expect(menus()).toHaveLength(0);
      // No listener left behind to reopen or throw on a later document click.
      document.body.click();
      expect(dd.isOpen()).toBe(false);
    });
  });
});
