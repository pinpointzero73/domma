/**
 * Minimal Layout - from public/showcase/footer.
 */
export function mount(root) {
            // Minimal Layout
    E.footer(root.querySelector('#footer-minimal'), {
                layout: 'minimal',
                variant: 'light',
                copyright: '© 2026 Domma',
                social: [
                    { icon: 'github', url: '#', label: 'GitHub' },
                    { icon: 'twitter', url: '#', label: 'Twitter' },
                    { icon: 'linkedin', url: '#', label: 'LinkedIn' }
                ]
            });
}
