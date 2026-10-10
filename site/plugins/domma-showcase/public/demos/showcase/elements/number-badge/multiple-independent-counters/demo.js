/**
 * Multiple Independent Counters - from public/showcase/elements/number-badge.
 */
export function mount(root) {
        // Multiple counters demo
    if ($(root).find('#multi-bell').length) {
          const bellB = E.numberBadge(root.querySelector('#multi-bell'), { count: 3, variant: 'danger' });
          const mailB = E.numberBadge(root.querySelector('#multi-mail'), { count: 12, variant: 'primary' });
          const cartB = E.numberBadge(root.querySelector('#multi-cart'), { count: 0, variant: 'success' });

          $(root).find('#multi-add-all').on('click', () => {
            bellB.increment();
            mailB.increment();
            cartB.increment();
          });

          $(root).find('#multi-clear-all').on('click', () => {
            bellB.setCount(0);
            mailB.setCount(0);
            cartB.setCount(0);
          });
        }
}
