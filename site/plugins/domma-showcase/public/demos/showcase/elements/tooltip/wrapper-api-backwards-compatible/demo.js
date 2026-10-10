/**
 * Wrapper API (Backwards Compatible) - from public/showcase/elements/tooltip.
 */
export function mount(root) {
        // Web Components - Wrapper API demo
    if ($(root).find('#wrapper-tooltip-btn').length) {
                E.tooltip(root.querySelector('#wrapper-tooltip-btn'), {
                    content: 'This uses the wrapper API!',
                    position: 'top',
                    trigger: 'hover'
                });
            }
}
