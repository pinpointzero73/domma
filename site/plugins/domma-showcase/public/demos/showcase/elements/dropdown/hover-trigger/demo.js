/**
 * Hover Trigger - from public/showcase/elements/dropdown.
 */
export function mount(root) {
        // Hover Trigger
    E.dropdown(root.querySelector('#hover-dropdown'), {
            trigger: 'hover',
            items: [
                {text: 'Profile', value: 'profile'},
                {text: 'Dashboard', value: 'dashboard'},
                {text: 'Projects', value: 'projects'},
                {text: 'Team', value: 'team'},
                {text: 'Settings', value: 'settings'},
                {text: 'Sign Out', value: 'signout'}
            ]
        });
        // Same menu, click trigger - confirms click stays consistent alongside hover.
    E.dropdown(root.querySelector('#hover-click-dropdown'), {
            trigger: 'click',
            items: [
                {text: 'Profile', value: 'profile'},
                {text: 'Dashboard', value: 'dashboard'},
                {text: 'Projects', value: 'projects'},
                {text: 'Team', value: 'team'},
                {text: 'Settings', value: 'settings'},
                {text: 'Sign Out', value: 'signout'}
            ]
        });
}
