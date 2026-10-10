/**
 * Reactive Attributes Demo - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
        // Reactive attributes demo
    const reactiveBtn = $(root).find('#reactive-btn')[0];
    if (reactiveBtn) {
            reactiveBtn.setAttribute('target', '#reactive-demo');

            let currentPosition = 'bottom-right';
            $(root).find('#wc-change-position').on('click', () => {
                currentPosition = currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
                reactiveBtn.setPosition(currentPosition);
            });

            let currentOffset = 16;
            $(root).find('#wc-change-offset').on('click', () => {
                currentOffset = currentOffset === 16 ? 32 : 16;
                reactiveBtn.setOffset(currentOffset);
            });

            $(root).find('#wc-manual-show').on('click', () => {
                reactiveBtn.show();
            });
        }
}
