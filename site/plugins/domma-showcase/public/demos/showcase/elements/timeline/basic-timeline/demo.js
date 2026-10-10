/**
 * basic-timeline - from public/showcase/elements/timeline.
 */
export function mount(root) {
    const basicTimelineData = [
                { year: '2023', title: 'Domma v0.1.0', description: 'Initial alpha release with DOM manipulation ($) and utilities (_)' },
                { year: 'Q1 2024', title: 'v0.3.0 Alpha', description: 'Added Dates (D), Storage (S), and HTTP (H) modules' },
                { year: 'Q2 2024', title: 'v0.5.0 Beta', description: 'Models (M) with reactive data binding and Forms module launched' },
                { year: 'Q3 2024', title: 'v0.8.0', description: 'Elements module with 22+ UI components and Tables module' },
                { year: 'Q4 2024', title: 'v0.12.0', description: 'Layout system, Blueprint schemas, and celebration effects' },
                { year: 'Jan 2026', title: 'v0.14.1', description: 'Enhanced celebrations with patron saint flower petal animations' }
            ];
            // Initialize all timelines
                // Basic timeline
    E.progression(root.querySelector('#basic-timeline'), {
                    mode: 'timeline',
                    items: basicTimelineData,
                    animation: true,
                    animationDelay: 100
                });
}
