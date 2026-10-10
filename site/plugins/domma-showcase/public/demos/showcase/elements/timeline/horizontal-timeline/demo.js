/**
 * horizontal-timeline - from public/showcase/elements/timeline.
 */
export function mount(root) {
    const projectMilestones = [
                { year: 'v0.8.0', title: 'Elements Module', description: 'Modal, tabs, tooltip, carousel, and 18 more components' },
                { year: 'v0.10.0', title: 'Forms & Tables', description: 'FormBuilder, validation, and DataTable functionality' },
                { year: 'v0.12.0', title: 'Blueprints', description: 'Unified schema system for models, forms, and CRUD' },
                { year: 'v0.14.1', title: 'Celebrations', description: '8 celebration themes with advanced canvas animations' }
            ];
                // Horizontal timeline
    E.progression(root.querySelector('#horizontal-timeline'), {
                    mode: 'timeline',
                    items: projectMilestones,
                    layout: 'horizontal',
                    animation: true,
                    animationDelay: 150
                });
}
