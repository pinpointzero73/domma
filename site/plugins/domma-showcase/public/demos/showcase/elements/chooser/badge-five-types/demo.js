/**
 * badge - five types - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
    const badgeMaker = (type, text) => ({
            variant: 'card', columns: 1,
            options: [
                { value: 'a', label: 'Featured option', icon: 'star', description: 'Has a corner badge', badge: { text, type } }
            ]
        });
    E.chooser(root.querySelector('#badge-primary'), badgeMaker('primary', 'NEW'));
    E.chooser(root.querySelector('#badge-success'), badgeMaker('success', 'POPULAR'));
    E.chooser(root.querySelector('#badge-info'),    badgeMaker('info',    'INFO'));
    E.chooser(root.querySelector('#badge-warning'), badgeMaker('warning', 'BETA'));
    E.chooser(root.querySelector('#badge-danger'),  badgeMaker('danger',  'LIMITED'));
}
