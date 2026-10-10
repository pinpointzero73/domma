/**
 * danger - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Visual options demos ----
    const visualOptions = [
            { value: 'a', label: 'Alpha', icon: 'star', description: 'Selected by default' },
            { value: 'b', label: 'Beta',  icon: 'circle' },
            { value: 'c', label: 'Gamma', icon: 'square' }
        ];
    const visualBase = { variant: 'card', columns: 3, options: visualOptions, value: 'a' };
    E.chooser(root.querySelector('#accent-danger'),  { ...visualBase, accent: 'danger' });
}
