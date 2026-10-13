/**
 * Supported 2. modal - from public/showcase/config/all-components.
 */
export function mount(root) {
    const pageRoot = $(root).closest('.sx-showcase').get(0) || root;
    $.setup({
      // 1. Card
      '.demo-card': {
        component: 'card',
        options: {
          hoverable: true,
          onClick: function () {
            E.toast('Card clicked!', {type: 'info', duration: 2000});
          }
        }
      },

      // 2. Modal
      '#demo-modal': {
        component: 'modal',
        options: {
          backdrop: true,
          backdropClose: true,
          keyboard: true,
          animation: 'fade'
        }
      },
      '#open-modal-btn': {
        events: {
          click: () => {
            // $.setup() keeps instances internally - reach them with $.getComponent()
            const modal = $.getComponent('#demo-modal');
            if (modal) modal.open();
          }
        }
      },

      // 3. Tabs
      '#demo-tabs': {
        component: 'tabs',
        options: {
          activeIndex: 0,
          animation: 'fade'
        }
      },

      // 4. Accordion
      '#demo-accordion': {
        component: 'accordion',
        options: {
          multiExpand: false,
          animation: 'slide',
          activeIndex: 0
        }
      },

      // 5. Tooltip
      '[data-tooltip]': {
        component: 'tooltip',
        options: {
          trigger: 'hover',
          delay: 200
        }
      },

      // 6. Carousel
      '#demo-carousel': {
        component: 'carousel',
        options: {
          autoplay: true,
          interval: 3000,
          loop: true,
          showArrows: true,
          showIndicators: true
        }
      },

      // 7. Dropdown
      '#demo-dropdown': {
        component: 'dropdown',
        options: {
          items: [
            {text: 'Edit', value: 'edit'},
            {text: 'Duplicate', value: 'duplicate'},
            {divider: true},
            {text: 'Delete', value: 'delete', class: 'text-danger'}
          ],
          placement: 'bottom',
          closeOnSelect: true
        }
      },

      // 10. Button Group
      '#demo-btngroup': {
        component: 'buttonGroup',
        options: {
          mode: 'single',
          activeClass: 'active',
          onChange: (value) => {
            const labels = ['Left', 'Center', 'Right', 'Justify'];
            $(pageRoot).find('#btngroup-result').text(labels[value]);
          }
        }
      },

      // 11. Loader
      '#show-loader-btn': {
        events: {
          click: () => {
            const loader = E.loader($(pageRoot).find('#demo-loader-container').get(0), {
              type: 'spinner',
              overlay: true,
              text: 'Loading...'
            });
            loader.show();
            setTimeout(() => loader.hide(), 3000);
          }
        }
      },

      // 12. Breadcrumbs
      '#demo-breadcrumbs': {
        component: 'breadcrumbs',
        options: {
          items: [
            {text: 'Home', url: '#'},
            {text: 'Showcase', url: '#'},
            {text: 'Config Engine', url: '#'},
            {text: 'All Components', active: true}
          ],
          separator: '/'
        }
      },

      // 13. Navbar
      '#demo-navbar': {
        component: 'navbar',
        options: {
          brand: {text: 'Domma', url: '#'},
          items: [
            {text: 'Home', url: '#', active: true},
            {text: 'Docs', url: '#'},
            {text: 'Examples', url: '#'}
          ],
          variant: 'light'
        }
      },

      // 14. Notification
      '#request-notification-btn': {
        events: {
          click: async () => {
            if ('Notification' in window) {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                E.notify('Domma Notification', {
                  body: 'This is a desktop notification configured via $.setup()!',
                  icon: '../../assets/logo/domma-icon.svg'
                });
              }
            } else {
              E.toast('Notifications not supported', {type: 'error'});
            }
          }
        }
      },

      // 15. Timer
      '#demo-timer': {
        component: 'timer',
        options: {
          duration: 60000,
          format: 'mm:ss',
          showControls: true,
          autoStart: false
        }
      }
    });
}
