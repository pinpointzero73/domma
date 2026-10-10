/**
 * tooltip - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
    E.chooser(root.querySelector('#opt-tooltip'), {
            variant: 'chip',
            options: [
                { value: 'a', label: 'Hover me',    icon: 'info', tooltip: 'This is a tooltip on a chip' },
                { value: 'b', label: 'And me too', icon: 'info', tooltip: 'Each option may have its own tooltip' }
            ]
        });
}
