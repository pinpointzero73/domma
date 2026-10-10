/**
 * Step 6: Complete Working Demo - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Tutorial Demo
    const tutorialNav = E.navbar(root.querySelector('#tutorial-navbar'), {
            brand: {text: 'My SaaS App', url: '#'},
            items: [
                {text: 'Dashboard', url: '/dashboard', active: true},
                {text: 'Analytics', url: '/analytics'},
                {
                    text: 'Resources',
                    items: [
                        {text: 'Documentation', url: '/docs'},
                        {text: 'API Reference', url: '/api'},
                        {text: 'Support', url: '/support'}
                    ]
                },
                {text: 'Settings', url: '/settings'}
            ],
            actions: [
                {text: 'Upgrade', variant: 'outline', url: '/upgrade'},
                {text: 'Account', variant: 'primary', url: '/account'}
            ],
            onItemClick: (item, index, event) => {
                event.preventDefault();
                const log = $(root).find('#tutorial-log')[0];
                const timestamp = D().format('HH:mm:ss');
                log.textContent = `[${timestamp}] Clicked: ${item.text} → ${item.url}`;
            }
        });
}
