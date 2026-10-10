/**
 * Example 2: Custom Rendering - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const users = [
            {name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin'},
            {name: 'Bob Smith', email: 'bob@example.com', role: 'User'},
            {name: 'Carol White', email: 'carol@example.com', role: 'Editor'}
        ];
        // Custom Rendering
    E.autocomplete(root.querySelector('#custom-render-autocomplete'), {
            data: users,
            renderItem: (user, query) => {
                return `
                    <div class="flex flex-col">
                        <strong>${user.name}</strong>
                        <span class="text-sm text-muted">${user.email}</span>
                        <span class="text-xs text-muted">Role: ${user.role}</span>
                    </div>
                `;
            },
            onSelect: (user) => console.log('Selected user:', user.name)
        });
}
