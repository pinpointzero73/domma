/**
 * disabled - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
    E.chooser(root.querySelector('#opt-disabled'), {
            variant: 'card', columns: 3,
            options: [
                { value: 'a', label: 'Available',   icon: 'check' },
                { value: 'b', label: 'Coming soon', icon: 'clock', disabled: true, description: 'Not yet available' },
                { value: 'c', label: 'Available',   icon: 'check' }
            ]
        });
}
