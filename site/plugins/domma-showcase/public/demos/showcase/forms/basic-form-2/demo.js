/**
 * Basic Form - from public/showcase/forms.
 */
export function mount(root) {
            // Copy functionality for reference guide
    async function copyToClipboard(text) {
              try {
                await navigator.clipboard.writeText(text);
                // Show brief success indicator
                E.toast('Copied to clipboard!', {type: 'success', duration: 2000});
              } catch (err) {
                console.error('Failed to copy:', err);
                E.toast('Failed to copy', {type: 'error', duration: 2000});
              }
            };
    function copyCodeExample(button) {
              const codeBlock = button.nextElementSibling.querySelector('code') ||
                button.nextElementSibling;
              const text = codeBlock.textContent;
              copyToClipboard(text);
            };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        copyCodeExample(this);
    });
}
