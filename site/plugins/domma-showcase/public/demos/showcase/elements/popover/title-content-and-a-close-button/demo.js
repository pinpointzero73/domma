/**
 * Title, content and a close button - from public/showcase/elements/popover.
 */
export function mount(root) {
        // ---- Basic -----------------------------------------------------------
    E.popover(root.querySelector('#demo-basic'), {
            title: 'Delivery options',
            content: 'Standard delivery takes 3-5 working days. Next-day delivery is available on orders placed before 2pm.',
            dismissible: true
        });
    E.popover(root.querySelector('#demo-plain'), {content: 'A popover needs nothing more than content.'});
}
