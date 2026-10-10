/**
 * Step 6: Complete Working Demo - from public/showcase/elements/loader.
 *
 * The placeholder and the result panel are shown by data-if on a status
 * observable ('idle' -> 'loading' -> 'done'); only the fetch time varies.
 */
export function mount(root) {
    const status = M.observable('idle');
    const fetchedAt = M.observable('');
    const handle = M.applyBindings({status, fetchedAt}, root.querySelector('#tutorial-container'));

    // Tutorial Demo
    const tutorialLoader = E.loader(root.querySelector('#tutorial-container'), {
        type: 'spinner',
        size: 'large',
        color: 'var(--dm-white)',
        overlay: true,
        text: 'Loading data...'
    });
    $(root).find('#tutorial-load-btn').on('click', async () => {
        status.value = 'loading';
        tutorialLoader.show();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        tutorialLoader.setText('Processing results...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        tutorialLoader.hide();

        fetchedAt.value = D().format('HH:mm:ss');
        status.value = 'done';
    });

    return () => {
        handle.dispose();
        tutorialLoader?.destroy?.();
    };
}
