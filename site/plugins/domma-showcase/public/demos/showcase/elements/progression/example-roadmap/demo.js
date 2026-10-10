/**
 * Example Roadmap - from public/showcase/elements/progression.
 */
export function mount(root) {
        // Roadmap mode demo - Domma 2026 Development Roadmap
    E.progression(root.querySelector('#roadmap-demo'), {
            mode: 'roadmap',
            items: [
                {
                    id: 'celebrations-complete',
                    title: 'Celebration Effects Complete',
                    description: '8 celebration themes with flower petal animations for UK patron saints',
                    status: 'completed',
                    date: 'Q1 2026',
                    tags: ['animations', 'ui'],
                    priority: 'medium'
                },
                {
                    id: 'router-module',
                    title: 'Router Module Enhancement',
                    description: 'Advanced SPA routing with lazy loading and code splitting',
                    status: 'in-progress',
                    date: 'Q2 2026',
                    progress: 45,
                    priority: 'high',
                    tags: ['routing', 'spa'],
                    assignee: 'Core Team'
                },
                {
                    id: 'form-validation',
                    title: 'Form Validation v2',
                    description: 'Enhanced async validation with custom rules and multi-step forms',
                    status: 'in-progress',
                    date: 'Q2 2026',
                    progress: 30,
                    priority: 'high',
                    tags: ['forms', 'validation']
                },
                {
                    id: 'charts-module',
                    title: 'Charts Module',
                    description: 'Data visualization with charts, graphs, and dashboards',
                    status: 'planned',
                    date: 'Q3 2026',
                    priority: 'medium',
                    tags: ['visualization', 'charts']
                },
                {
                    id: 'testing-suite',
                    title: 'Testing Suite Expansion',
                    description: 'Comprehensive Vitest and Cypress coverage for all modules',
                    status: 'planned',
                    date: 'Q3 2026',
                    priority: 'critical',
                    tags: ['testing', 'qa']
                },
                {
                    id: 'v1-release',
                    title: 'Domma v1.0 Stable',
                    description: 'Production-ready release with complete documentation and CDN',
                    status: 'planned',
                    date: 'Q4 2026',
                    priority: 'critical',
                    tags: ['release', 'milestone']
                }
            ],
            showProgress: true,
            progressPosition: 'top',
            animation: true
        });
}
