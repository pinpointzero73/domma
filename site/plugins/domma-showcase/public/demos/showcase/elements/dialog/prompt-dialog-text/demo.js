/**
 * Prompt Dialog (Text) - from public/showcase/elements/dialog.
 */
export function mount(root) {
    $(root).find('#ex-prompt-text').on('click', async () => {
        const result = await E.prompt('What is your name?', {
            title: 'User Information',
            inputPlaceholder: 'Enter your name'
        });
      $(root).find('#prompt-text-result').text(result || '(cancelled)');
    });
}
