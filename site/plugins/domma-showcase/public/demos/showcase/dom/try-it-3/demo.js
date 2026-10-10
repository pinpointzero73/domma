/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // Context parameter demonstration
    $(root).find('#context-btn-1').on('click', function () {
            // Reset all badges first
            $('.context-item').removeClass('badge-primary').addClass('badge-secondary');

            // Select only within container 1 using context parameter
            const container1 = $(root).find('#context-demo-1')[0];
            $('.context-item', container1)
                .removeClass('badge-secondary')
                .addClass('badge-primary');

            $(root).find('#context-result')
                .text('Highlighted 3 items in Container 1 using: $(".context-item", container1)')
                .css('color', '#0066cc');
        });
    $(root).find('#context-btn-2').on('click', function () {
            // Reset all badges first
            $('.context-item').removeClass('badge-primary').addClass('badge-secondary');

            // Select only within container 2 using context parameter
            const container2 = $(root).find('#context-demo-2')[0];
            $('.context-item', container2)
                .removeClass('badge-secondary')
                .addClass('badge-primary');

            $(root).find('#context-result')
                .text('Highlighted 3 items in Container 2 using: $(".context-item", container2)')
                .css('color', '#0066cc');
        });
    $(root).find('#context-btn-reset').on('click', function () {
            $('.context-item').removeClass('badge-primary').addClass('badge-secondary');
            $(root).find('#context-result')
                .text('Click buttons to see context-scoped selection')
                .css('color', '');
        });
}
