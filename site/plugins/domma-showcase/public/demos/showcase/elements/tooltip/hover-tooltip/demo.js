/**
 * Hover Tooltip - from public/showcase/elements/tooltip.
 */
export function mount(root) {
            // Original showcase examples
    E.tooltip(root.querySelector('#quick-hover'), {
                content: 'This appears on hover',
                position: 'top'
            });
}
