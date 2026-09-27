// src/theme-contrast-aria.test.js
import { describe, expect, it, beforeEach } from 'vitest';
import Domma from './index.js';
import { runSweep } from '../scripts/sweep-themes.js';

describe('Theme Contrast & ARIA Compatibility Suite', () => {

  beforeEach(() => {
    Domma.setup({
      theme: 'charcoal-dark',
      autoDetect: false,
      persist: false
    });
  });

  describe('Theme Inventory & Structure', () => {
    it('should have all 38 themes available in the theme registry', () => {
      const themes = Domma.theme.listThemes();
      expect(themes.length).toBe(38);
    });

    it('should include all standard paired themes', () => {
      const themes = Domma.theme.listThemes();
      const pairs = [
        'ocean', 'forest', 'sunset', 'royal', 'lemon', 'silver',
        'charcoal', 'christmas', 'unicorn', 'dreamy', 'grayve',
        'mint', 'wedding', 'corporate'
      ];
      for (const base of pairs) {
        expect(themes).toContain(`${base}-light`);
        expect(themes).toContain(`${base}-dark`);
      }
    });

    it('should include all nine admin themes', () => {
      const themes = Domma.theme.listThemes();
      const adminThemes = [
        'admin-smooth-steel', 'admin-smooth-indigo', 'admin-smooth-teal',
        'admin-sharp-steel', 'admin-sharp-indigo', 'admin-sharp-teal',
        'admin-slate-steel', 'admin-slate-indigo', 'admin-slate-teal'
      ];
      for (const t of adminThemes) {
        expect(themes).toContain(t);
      }
    });

    it('should include core-light theme', () => {
      const themes = Domma.theme.listThemes();
      expect(themes).toContain('core-light');
    });
  });

  describe('WCAG 2.1 Contrast Sweep', () => {
    const sweep = runSweep();

    it('all 38 themes must satisfy WCAG AA (>= 4.5:1) for body text on background', () => {
      for (const [themeName, data] of Object.entries(sweep.themeResults)) {
        const textOnBg = data.tokens.find(t => t.id === 'text-on-bg');
        expect(textOnBg).toBeDefined();
        expect(
          textOnBg.ratio,
          `Theme ${themeName} failed body text on background contrast: got ${textOnBg.ratio}:1, expected >= 4.5:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('all 38 themes must satisfy WCAG AA (>= 4.5:1) for body text on surface/cards', () => {
      for (const [themeName, data] of Object.entries(sweep.themeResults)) {
        const textOnSurface = data.tokens.find(t => t.id === 'text-on-surface');
        expect(textOnSurface).toBeDefined();
        expect(
          textOnSurface.ratio,
          `Theme ${themeName} failed text on surface contrast: got ${textOnSurface.ratio}:1, expected >= 4.5:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('all 38 themes must satisfy WCAG AA (>= 4.5:1) for body text on raised surfaces', () => {
      for (const [themeName, data] of Object.entries(sweep.themeResults)) {
        const textOnRaised = data.tokens.find(t => t.id === 'text-on-raised');
        expect(textOnRaised).toBeDefined();
        expect(
          textOnRaised.ratio,
          `Theme ${themeName} failed text on raised surface contrast: got ${textOnRaised.ratio}:1, expected >= 4.5:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('primary button text must satisfy WCAG AA (>= 4.5:1) on primary fill', () => {
      for (const [themeName, data] of Object.entries(sweep.themeResults)) {
        const btn = data.tokens.find(t => t.id === 'primary-btn');
        expect(btn).toBeDefined();
        expect(
          btn.ratio,
          `Theme ${themeName} primary button text contrast failed: got ${btn.ratio}:1, expected >= 4.5:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('danger button text must satisfy WCAG AA (>= 4.5:1) on danger fill', () => {
      for (const [themeName, data] of Object.entries(sweep.themeResults)) {
        const btn = data.tokens.find(t => t.id === 'danger-btn');
        expect(btn).toBeDefined();
        expect(
          btn.ratio,
          `Theme ${themeName} danger button text contrast failed: got ${btn.ratio}:1, expected >= 4.5:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('every theme must achieve an overall accessibility score of at least 60% (Grade C or better)', () => {
      for (const [themeName, data] of Object.entries(sweep.themeResults)) {
        expect(
          data.stats.score,
          `Theme ${themeName} scored below acceptable minimum: ${data.stats.score}%`
        ).toBeGreaterThanOrEqual(60);
      }
    });
  });

  describe('ARIA Compatibility & Dynamic Theme Switching', () => {
    it('theme switching must preserve existing ARIA attributes on document elements', () => {
      document.body.innerHTML = `
        <div id="test-container">
          <button id="test-btn" role="button" aria-expanded="true" aria-controls="test-panel">Toggle</button>
          <div id="test-panel" role="region" aria-label="Details" aria-hidden="false">Content</div>
          <div id="test-tablist" role="tablist">
            <button role="tab" aria-selected="true" aria-controls="p1">Tab 1</button>
            <button role="tab" aria-selected="false" aria-controls="p2">Tab 2</button>
          </div>
          <input id="test-input" aria-invalid="true" aria-describedby="err-1" />
          <span id="err-1" role="alert">Required field</span>
        </div>
      `;

      // Cycle through multiple themes
      const testThemes = ['ocean-light', 'forest-dark', 'admin-sharp-steel', 'charcoal-dark'];
      for (const theme of testThemes) {
        Domma.theme.set(theme);

        // Verify all ARIA attributes remain completely intact
        const btn = document.getElementById('test-btn');
        expect(btn.getAttribute('role')).toBe('button');
        expect(btn.getAttribute('aria-expanded')).toBe('true');
        expect(btn.getAttribute('aria-controls')).toBe('test-panel');

        const panel = document.getElementById('test-panel');
        expect(panel.getAttribute('role')).toBe('region');
        expect(panel.getAttribute('aria-label')).toBe('Details');
        expect(panel.getAttribute('aria-hidden')).toBe('false');

        const tabs = document.querySelectorAll('[role="tab"]');
        expect(tabs[0].getAttribute('aria-selected')).toBe('true');
        expect(tabs[1].getAttribute('aria-selected')).toBe('false');

        const input = document.getElementById('test-input');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(input.getAttribute('aria-describedby')).toBe('err-1');

        const alert = document.getElementById('err-1');
        expect(alert.getAttribute('role')).toBe('alert');
      }
    });

    it('theme switcher correctly sets data-mode attribute on target', () => {
      Domma.theme.set('forest-dark');
      expect(document.body.getAttribute('data-mode')).toBe('dark');

      Domma.theme.set('forest-light');
      expect(document.body.getAttribute('data-mode')).toBe('light');

      Domma.theme.set('admin-sharp-steel');
      // Admin themes mode logic
      expect(document.body.getAttribute('data-mode')).toBeDefined();
    });

    it('components with built-in ARIA support maintain states across theme changes', () => {
      document.body.innerHTML = '<button id="dd-trigger">Menu</button><ul id="dd-menu"><li>Item</li></ul>';
      const dd = Domma.elements.dropdown('#dd-trigger', { items: [{ label: 'Item 1' }] });

      expect(dd.element.getAttribute('aria-haspopup')).toBe('true');
      expect(dd.element.getAttribute('aria-expanded')).toBe('false');

      // Change theme
      Domma.theme.set('royal-dark');
      expect(dd.element.getAttribute('aria-haspopup')).toBe('true');
      expect(dd.element.getAttribute('aria-expanded')).toBe('false');

      dd.open();
      expect(dd.element.getAttribute('aria-expanded')).toBe('true');

      Domma.theme.set('sunset-light');
      expect(dd.element.getAttribute('aria-expanded')).toBe('true');

      dd.close();
      expect(dd.element.getAttribute('aria-expanded')).toBe('false');
    });

    it('Modal injects dialog role, aria-modal, aria-labelledby, and accessible close button', () => {
      document.body.innerHTML = `
        <div id="test-modal" class="modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Test Modal Title</h5>
                <button class="btn-close"></button>
              </div>
              <div class="modal-body">Modal Body Content</div>
            </div>
          </div>
        </div>
      `;
      const modal = Domma.elements.modal('#test-modal');
      const modalEl = document.getElementById('test-modal');
      expect(modalEl.getAttribute('role')).toBe('dialog');
      expect(modalEl.getAttribute('aria-modal')).toBe('true');
      const titleEl = modalEl.querySelector('.modal-title');
      expect(titleEl.id).toBeDefined();
      expect(modalEl.getAttribute('aria-labelledby')).toBe(titleEl.id);
      const closeBtn = modalEl.querySelector('.btn-close');
      expect(closeBtn.getAttribute('aria-label')).toBe('Close');
      modal.destroy();
    });

    it('Tabs inject tablist, tab, tabpanel roles and dynamic aria-selected / tabindex states', () => {
      document.body.innerHTML = `
        <div id="test-tabs">
          <ul class="tabs-list">
            <li class="tab-item active" data-tab="tab1">Tab 1</li>
            <li class="tab-item" data-tab="tab2">Tab 2</li>
          </ul>
          <div class="tabs-content">
            <div class="tab-panel active" data-tab="tab1">Content 1</div>
            <div class="tab-panel" data-tab="tab2">Content 2</div>
          </div>
        </div>
      `;
      const tabs = Domma.elements.tabs('#test-tabs');
      const tablist = document.querySelector('.tabs-list');
      expect(tablist.getAttribute('role')).toBe('tablist');

      const tabItems = document.querySelectorAll('.tab-item');
      expect(tabItems[0].getAttribute('role')).toBe('tab');
      expect(tabItems[0].getAttribute('aria-selected')).toBe('true');
      expect(tabItems[0].getAttribute('tabindex')).toBe('0');
      expect(tabItems[1].getAttribute('role')).toBe('tab');
      expect(tabItems[1].getAttribute('aria-selected')).toBe('false');
      expect(tabItems[1].getAttribute('tabindex')).toBe('-1');

      const panels = document.querySelectorAll('.tab-panel');
      expect(panels[0].getAttribute('role')).toBe('tabpanel');
      expect(panels[0].getAttribute('aria-hidden')).toBe('false');
      expect(panels[1].getAttribute('role')).toBe('tabpanel');
      expect(panels[1].getAttribute('aria-hidden')).toBe('true');

      // Switch tab
      tabs.show('tab2');
      expect(tabItems[0].getAttribute('aria-selected')).toBe('false');
      expect(tabItems[0].getAttribute('tabindex')).toBe('-1');
      expect(tabItems[1].getAttribute('aria-selected')).toBe('true');
      expect(tabItems[1].getAttribute('tabindex')).toBe('0');
      expect(panels[0].getAttribute('aria-hidden')).toBe('true');
      expect(panels[1].getAttribute('aria-hidden')).toBe('false');

      tabs.destroy();
    });

    it('Accordion injects button roles, aria-expanded, aria-controls, and handles toggle', () => {
      document.body.innerHTML = `
        <div id="test-accordion" class="accordion">
          <div class="accordion-item">
            <div class="accordion-header">Section 1</div>
            <div class="accordion-content">Content 1</div>
          </div>
          <div class="accordion-item">
            <div class="accordion-header">Section 2</div>
            <div class="accordion-content">Content 2</div>
          </div>
        </div>
      `;
      const acc = Domma.elements.accordion('#test-accordion');
      const headers = document.querySelectorAll('.accordion-header');
      const contents = document.querySelectorAll('.accordion-content');

      expect(headers[0].getAttribute('role')).toBe('button');
      expect(headers[0].getAttribute('tabindex')).toBe('0');
      expect(headers[0].getAttribute('aria-expanded')).toBe('false');
      expect(headers[0].getAttribute('aria-controls')).toBe(contents[0].id);
      expect(contents[0].getAttribute('role')).toBe('region');
      expect(contents[0].getAttribute('aria-labelledby')).toBe(headers[0].id);

      // Open first section via toggle
      acc.toggle(0);
      expect(headers[0].getAttribute('aria-expanded')).toBe('true');
      expect(contents[0].getAttribute('aria-hidden')).toBe('false');

      acc.destroy();
    });

    it('Toast sets aria-live and atomic container attributes and appropriate alert/status roles', () => {
      Domma.elements.toast.success('Operation succeeded', { duration: 0 });
      const container = document.querySelector('.domma-toast-container');
      expect(container).toBeDefined();
      expect(container.getAttribute('aria-live')).toBe('polite');
      expect(container.getAttribute('aria-atomic')).toBe('true');

      const toastEl = container.querySelector('.domma-toast, domma-toast');
      expect(toastEl).toBeDefined();
      const role = toastEl.getAttribute('role') || toastEl.shadowRoot?.querySelector('.toast')?.getAttribute('role');
      expect(['status', 'alert']).toContain(role);

      Domma.elements.toast.closeAll();
    });

    it('Table incorporates accessible header sorting aria-sort and pagination navigation semantics', () => {
      document.body.innerHTML = '<div id="table-container"></div>';
      const table = Domma.tables.create('#table-container', {
        columns: [
          { key: 'id', title: 'ID', sortable: true },
          { key: 'name', title: 'Name', sortable: true },
          { key: 'role', title: 'Role', sortable: false }
        ],
        data: [
          { id: 1, name: 'Alice', role: 'Admin' },
          { id: 2, name: 'Bob', role: 'User' },
          { id: 3, name: 'Charlie', role: 'User' }
        ],
        pagination: true,
        pageSize: 2,
        selectable: true
      });

      // Verify th aria-sort
      const ths = document.querySelectorAll('th');
      const sortableTh = Array.from(ths).find(th => th.textContent.includes('ID'));
      expect(sortableTh).toBeDefined();
      expect(sortableTh.getAttribute('aria-sort')).toBe('none');

      // Sort by ID
      table.sort('id', 'asc');
      const sortedTh = Array.from(document.querySelectorAll('th')).find(th => th.textContent.includes('ID'));
      expect(sortedTh.getAttribute('aria-sort')).toBe('ascending');

      // Pagination ARIA semantics
      const pagination = document.querySelector('.domma-table-pagination');
      expect(pagination).toBeDefined();
      expect(pagination.getAttribute('role')).toBe('navigation');
      expect(pagination.getAttribute('aria-label')).toBe('Table pagination');

      // Active page button
      const activePage = pagination.querySelector('[aria-current="page"]');
      expect(activePage).toBeDefined();
      expect(activePage.textContent.trim()).toBe('1');

      table.destroy();
    });
  });
});
