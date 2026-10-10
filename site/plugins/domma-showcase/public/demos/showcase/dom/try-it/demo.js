/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
    $(root).find('#selector-btn').on('click', function () {
        const selector = $(root).find('#selector-input').val();
        try {
            const $els = $(selector);
            $(root).find('#selector-result').text(`Found ${$els.length} element(s) matching "${selector}"`);
            // Highlight selected elements briefly
            $els.addClass('bg-warning');
            setTimeout(() => $els.removeClass('bg-warning').addClass('bg-primary'), 1000);
        } catch (e) {
            $(root).find('#selector-result').text(`Error: ${e.message}`);
        }
    });
}
