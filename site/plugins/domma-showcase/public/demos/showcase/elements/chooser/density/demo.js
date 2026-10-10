/**
 * Density - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Density ----
    const densityOptions = [
            { value: 'a', label: 'Compact mode', icon: 'square', description: 'Description visible' },
            { value: 'b', label: 'Cosy', icon: 'square', description: 'Description visible' },
            { value: 'c', label: 'Spacious', icon: 'square', description: 'Description visible' }
        ];
    E.chooser(root.querySelector('#density-comfortable'), { variant: 'card', density: 'comfortable', columns: 1, options: densityOptions });
    E.chooser(root.querySelector('#density-compact'),     { variant: 'card', density: 'compact',     columns: 1, options: densityOptions });
}
