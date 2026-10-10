/**
 * icon - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Per-option flags ----
    E.chooser(root.querySelector('#opt-icon'), {
            variant: 'card', density: 'compact', columns: 3,
            options: [
                { value: 'a', label: 'Rocket', icon: 'rocket' },
                { value: 'b', label: 'Zap', icon: 'zap' },
                { value: 'c', label: 'Briefcase', icon: 'briefcase' }
            ]
        });
}
