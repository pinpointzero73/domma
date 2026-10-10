/**
 * Programmatic API - from public/showcase/elements/tooltip.
 */
export function mount(root) {
    const positions = ['top', 'bottom', 'left', 'right'];
    let currentPosIndex = 0;
    const tooltipContents = [
            'Updated content!',
            'New tooltip text!',
            'Changed again!',
            'Back to original'
        ];
    let contentIndex = 0;
    window.updateTooltipContent = function() {
            const tooltip = $(root).find('#programmable-tooltip')[0];
            contentIndex = (contentIndex + 1) % tooltipContents.length;
            tooltip.setContent(tooltipContents[contentIndex]);
        };
    window.changeTooltipPosition = function() {
            const tooltip = $(root).find('#programmable-tooltip')[0];
            currentPosIndex = (currentPosIndex + 1) % positions.length;
            tooltip.setPosition(positions[currentPosIndex]);
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        updateTooltipContent();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        changeTooltipPosition();
    });
}
