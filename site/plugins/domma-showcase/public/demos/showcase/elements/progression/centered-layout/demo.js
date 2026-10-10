/**
 * Centered Layout - from public/showcase/elements/progression.
 */
export function mount(root) {
        // Centered layout demo
    E.progression(root.querySelector('#layout-centered'), {
            mode: 'timeline',
            layout: 'centered',
            items: [
                { year: '2023', title: 'Alpha Release', description: 'Internal testing phase' },
                { year: '2024', title: 'Beta Launch', description: 'Public beta with early adopters' },
                { year: '2025', title: 'Full Release', description: 'General availability worldwide' }
            ],
            theme: 'minimal',
            animation: true
        });
}
