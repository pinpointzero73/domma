/**
 * Tutorial - from public/showcase/elements/dropdown.
 */
export function mount(root) {
        // Tutorial - the chosen action is an observable that #tutorial-result binds to
    const action = M.observable('');
    const handle = M.applyBindings({action}, root.querySelector('#tutorial-result'));
    const tutorialDropdown = E.dropdown(root.querySelector('#tutorial-dropdown'), {
            items: [
                {header: 'Signed in as user@example.com'},
                {divider: true},
                {text: 'Profile', value: 'profile'},
                {text: 'Settings', value: 'settings'},
                {text: 'Billing', value: 'billing'},
                {divider: true},
                {text: 'Sign Out', value: 'logout'}
            ],
            onOpen: () => console.log('User menu opened'),
            onClose: () => console.log('User menu closed'),
            onSelect: (item) => { action.value = item.value; }
        });
    return () => {
        handle.dispose();
        tutorialDropdown?.destroy?.();
    };
}
