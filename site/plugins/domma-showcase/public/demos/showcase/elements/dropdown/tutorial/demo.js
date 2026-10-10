/**
 * Tutorial - from public/showcase/elements/dropdown.
 */
export function mount(root) {
        // Tutorial
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
            onSelect: (item) => {
                const resultDiv = $(root).find('#tutorial-result')[0];
                resultDiv.innerHTML = `<p class="text-primary text-sm">✓ Action selected: <strong>${item.value}</strong></p>`;
            }
        });
}
