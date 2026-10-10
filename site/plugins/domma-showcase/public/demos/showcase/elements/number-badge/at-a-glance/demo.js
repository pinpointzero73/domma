/**
 * At a Glance - from public/showcase/elements/number-badge.
 */
export function mount(root) {
        // Overview quick demo - JS API target
    if ($(root).find('#overview-js-target').length) {
          E.numberBadge(root.querySelector('#overview-js-target'), { count: 9, variant: 'danger' });
        }
}
