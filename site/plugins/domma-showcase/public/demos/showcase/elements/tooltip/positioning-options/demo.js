/**
 * Positioning Options - from public/showcase/elements/tooltip.
 */
export function mount(root) {
    E.tooltip(root.querySelector('#pos-top'), {content: 'Tooltip on top', position: 'top'});
    E.tooltip(root.querySelector('#pos-bottom'), {content: 'Tooltip on bottom', position: 'bottom'});
    E.tooltip(root.querySelector('#pos-left'), {content: 'Tooltip on left', position: 'left'});
    E.tooltip(root.querySelector('#pos-right'), {content: 'Tooltip on right', position: 'right'});
}
