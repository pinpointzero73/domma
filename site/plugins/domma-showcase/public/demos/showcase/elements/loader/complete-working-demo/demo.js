/**
 * Step 6: Complete Working Demo - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Tutorial Demo
    const tutorialLoader = E.loader(root.querySelector('#tutorial-container'), {
            type: 'spinner',
            size: 'large',
          color: 'var(--dm-white)',
            overlay: true,
            text: 'Loading data...'
        });
    $(root).find('#tutorial-load-btn').on('click', async () => {
            $(root).find('#tutorial-placeholder').hide();
            $(root).find('#tutorial-result').hide();
            tutorialLoader.show();

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            tutorialLoader.setText('Processing results...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            tutorialLoader.hide();

            $(root).find('#tutorial-result').html(`
                <h4>Data Loaded Successfully!</h4>
                <p class="text-muted">Fetched at: ${D().format('HH:mm:ss')}</p>
                <pre class="mt-2 p-3 bg-dark text-white rounded">
    {
      "users": 42,
      "posts": 128,
      "comments": 356
    }
    </pre>
            `).show();
        });
}
