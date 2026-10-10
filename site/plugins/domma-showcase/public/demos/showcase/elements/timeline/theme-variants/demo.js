/**
 * theme-variants - from public/showcase/elements/timeline.
 */
export function mount(root) {
    const shortData = [
                { year: '2023', title: 'Alpha', description: 'Initial Domma framework concept and core modules' },
                { year: '2024', title: 'Beta', description: 'UI components, forms, and reactive models' },
                { year: '2026', title: 'v1.0', description: 'Production-ready stable release' }
            ];
                // Minimal theme
    E.progression(root.querySelector('#minimal-timeline'), {
                    mode: 'timeline',
                    items: shortData,
                    theme: 'minimal',
                    animation: true
                });
                // Corporate theme
    E.progression(root.querySelector('#corporate-timeline'), {
                    mode: 'timeline',
                    items: shortData,
                    theme: 'corporate',
                    animation: true
                });
}
