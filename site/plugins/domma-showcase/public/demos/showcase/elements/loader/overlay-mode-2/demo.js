/**
 * Overlay Mode - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 4: Overlay Mode
    let overlayLoader = null;
    $(root).find('#show-overlay-btn').on('click', () => {
            if (!overlayLoader) {
                overlayLoader = E.loader(root.querySelector('#overlay-container'), {
                    type: 'spinner',
                    size: 'large',
                  color: 'var(--dm-white)',
                    overlay: true,
                    text: 'Loading content...'
                });
            }
            overlayLoader.show();
            setTimeout(() => overlayLoader.hide(), 2000);
        });
}
