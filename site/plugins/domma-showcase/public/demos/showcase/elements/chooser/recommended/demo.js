/**
 * recommended - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
    E.chooser(root.querySelector('#opt-recommended'), {
            variant: 'card', columns: 3,
            options: [
                { value: 'a', label: 'Standard', icon: 'square' },
                { value: 'b', label: 'Best value', icon: 'star', recommended: true, description: 'Recommended option' },
                { value: 'c', label: 'Premium', icon: 'gem' }
            ]
        });
}
