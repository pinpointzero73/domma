/**
 * Interactive Roadmap - from public/showcase/elements/progression.
 */
export function mount(root) {
        // Interactive roadmap demo
    E.progression(root.querySelector('#interactive-roadmap'), {
            mode: 'roadmap',
            items: [
                { id: 'phase1', title: 'Phase 1: Planning', status: 'completed', date: 'Jan 2026' },
                { id: 'phase2', title: 'Phase 2: Development', status: 'in-progress', date: 'Feb-Apr 2026', progress: 50 },
                { id: 'phase3', title: 'Phase 3: Testing', status: 'planned', date: 'May 2026' },
                { id: 'phase4', title: 'Phase 4: Deployment', status: 'planned', date: 'Jun 2026' }
            ],
            allowStatusChange: true,
            showProgress: true,
            onStatusChange: (item, oldStatus, newStatus) => {
                console.log(`Status changed: ${item.title} from ${oldStatus} to ${newStatus}`);
            },
            animation: true
        });
}
