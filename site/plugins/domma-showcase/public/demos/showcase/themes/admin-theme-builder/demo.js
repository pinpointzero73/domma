/**
 * Admin Theme Builder - from public/showcase/themes.
 */
export function mount(root) {
    E.tooltip('[data-tooltip]');
      // --- Admin Theme Builder ---
    (function initAdminBuilder() {
        const state = { finish: 'sharp', accent: 'steel' };
        const $current = $(root).find('#admin-current');
        const $finish = $(root).find('#admin-finish');
        const $accent = $(root).find('#admin-accent');
        if (!$finish.length || !$accent.length || !$current.length) return;

        // Wire real tooltips so data-tooltip isn't dead markup (one instance per button)
        if (window.Domma && Domma.elements && E.tooltip) {
          $accent.find('.admin-acc').each((i, btn) => {
            E.tooltip(btn, { trigger: 'hover', position: 'top' });
          });
        }

        if (window.Domma && Domma.tables) {
          Domma.tables.create('#admin-preview-table', {
            data: [
              { customer: 'Acme Ltd', plan: 'Pro', status: 'Active' },
              { customer: 'Globex', plan: 'Team', status: 'Trial' },
              { customer: 'Initech', plan: 'Free', status: 'Active' }
            ],
            columns: [
              { key: 'customer', title: 'Customer' },
              { key: 'plan', title: 'Plan' },
              { key: 'status', title: 'Status' }
            ],
            pagination: false
          });
        }

        function apply() {
          const name = `admin-${state.finish}-${state.accent}`;
          $current.text(name);
          Domma.theme.set(name);
        }

        $finish.on('click', '[data-finish]', function () {
          state.finish = $(this).data('finish');
          $finish.find('[data-finish]').removeClass('active');
          $(this).addClass('active');
          apply();
        });

        $accent.on('click', '[data-accent]', function () {
          state.accent = $(this).data('accent');
          $accent.find('[data-accent]').css('border-color', 'transparent');
          $(this).css('border-color', 'var(--dm-text)');
          apply();
        });
      })();
}
