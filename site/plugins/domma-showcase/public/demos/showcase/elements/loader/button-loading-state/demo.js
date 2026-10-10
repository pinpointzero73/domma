/**
 * Button Loading State - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 7: Button Loading State
    let btnLoader = null;
    const submitBtn = $(root).find('#submit-btn')[0];
    $(root).find('#submit-btn').on('click', async function () {
            const originalText = this.textContent;
            this.disabled = true;
            this.textContent = '';

            btnLoader = E.loader(this, {
                type: 'spinner',
                size: 20,
              color: 'var(--dm-white)',
                centered: true
            });
            btnLoader.show();

            await new Promise(resolve => setTimeout(resolve, 2000));

            btnLoader.destroy();
            this.disabled = false;
            this.textContent = originalText;
        });
}
