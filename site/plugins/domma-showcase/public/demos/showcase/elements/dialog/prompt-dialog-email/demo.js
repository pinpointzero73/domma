/**
 * Prompt Dialog (Email) - from public/showcase/elements/dialog.
 */
export function mount(root) {
    $(root).find('#ex-prompt-email').on('click', async () => {
        const result = await E.prompt('Enter your email:', {
            title: 'Email Address',
            inputPlaceholder: 'you@example.com',
            inputType: 'email'
        });
      $(root).find('#prompt-email-result').text(result || '(cancelled)');
    });
}
