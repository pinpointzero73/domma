/**
 * Static Fullscreen Loader - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Quick Start Fullscreen
    $(root).find('#quick-fullscreen-btn').on('click', () => {
            const fs = E.fullscreenLoader('Loading something amazing...');
            setTimeout(() => fs.destroy(), 2000);
        });
}
