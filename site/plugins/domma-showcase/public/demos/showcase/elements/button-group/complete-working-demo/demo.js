/**
 * Step 6: Complete Working Demo - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Tutorial Demo
    const tutorialLabels = ['Bold', 'Italic', 'Underline'];
    const tutorialToolbar = E.buttonGroup(root.querySelector('#tutorial-toolbar'), {
            mode: 'multiple',
            onChange: (values) => {
              const result = $(root).find('#tutorial-result');
                const active = values.map(i => tutorialLabels[i]).join(', ');
              result.text(active || 'No formatting selected');

                // Apply visual styles
              result.css({
                'font-weight': values.includes(0) ? 'bold' : 'normal',
                'font-style': values.includes(1) ? 'italic' : 'normal',
                'text-decoration': values.includes(2) ? 'underline' : 'none'
              });
            }
        });
    $(root).find('#tutorial-select-all').on('click', () => {
            tutorialToolbar.selectAll();
        });
    $(root).find('#tutorial-clear-all').on('click', () => {
            tutorialToolbar.deselectAll();
        });
}
