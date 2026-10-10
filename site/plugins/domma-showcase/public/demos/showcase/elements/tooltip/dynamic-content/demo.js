/**
 * Dynamic Content - from public/showcase/elements/tooltip.
 */
export function mount(root) {
    let hoverCount = 0;
    const dynamicTip = E.tooltip(root.querySelector('#dynamic-tooltip'), {
                content: 'Hover count: 0',
                position: 'top'
            });
    $(root).find('#dynamic-tooltip').on('mouseenter', () => {
                hoverCount++;
                $(root).find('#hover-count').text(hoverCount);
                dynamicTip.setContent(`Hover count: ${hoverCount}`);
            });
}
