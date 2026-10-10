/**
 * Positioning - from public/showcase/elements/dropdown.
 */
export function mount(root) {
        // Positioning
    E.dropdown(root.querySelector('#pos-bottom'), {
            position: 'bottom-start',
            items: [
                {text: 'Bottom Start', value: 'b1'},
                {text: 'Default Position', value: 'b2'}
            ]
        });
    E.dropdown(root.querySelector('#pos-top'), {
            position: 'top-start',
            items: [
                {text: 'Top Start', value: 't1'},
                {text: 'Upward Position', value: 't2'}
            ]
        });
    E.dropdown(root.querySelector('#pos-left'), {
            position: 'left-start',
            items: [
                {text: 'Left Start', value: 'l1'},
                {text: 'Leftward', value: 'l2'}
            ]
        });
    E.dropdown(root.querySelector('#pos-right'), {
            position: 'right-start',
            items: [
                {text: 'Right Start', value: 'r1'},
                {text: 'Rightward', value: 'r2'}
            ]
        });
}
