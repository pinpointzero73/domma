/**
 * Dark Theme Variant - from public/showcase/footer.
 */
export function mount(root) {
            // Dark Theme Example
    E.footer(root.querySelector('#footer-dark'), {
                layout: 'simple',
                variant: 'dark',
                brand: {
                    text: 'Domma'
                },
                links: [
                    { text: 'Home', url: '#' },
                    { text: 'Features', url: '#' },
                    { text: 'Docs', url: '#' }
                ],
                social: [
                    { icon: 'github', url: '#', label: 'GitHub' },
                    { icon: 'twitter', url: '#', label: 'Twitter' }
                ],
                copyright: '© 2026 Domma'
            });
}
