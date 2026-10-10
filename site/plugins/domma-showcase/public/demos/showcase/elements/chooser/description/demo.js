/**
 * description - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
    E.chooser(root.querySelector('#opt-desc'), {
            variant: 'card', columns: 2,
            options: [
                { value: 'a', label: 'Alpha', description: 'A short description under the label' },
                { value: 'b', label: 'Beta',  description: 'Another option with its own description' }
            ]
        });
}
