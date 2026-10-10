/**
 * Columns Layout - from public/showcase/footer.
 */
export function mount(root) {
            // Columns Layout
    E.footer(root.querySelector('#footer-columns'), {
                layout: 'columns',
                variant: 'dark',
                brand: {
                    text: 'Domma Framework'
                },
                columns: [
                    {
                        title: 'Product',
                        links: [
                            { text: 'Features', url: '#' },
                            { text: 'Pricing', url: '#' },
                            { text: 'Changelog', url: '#' },
                            { text: 'Roadmap', url: '#' }
                        ]
                    },
                    {
                        title: 'Resources',
                        links: [
                            { text: 'Documentation', url: '#' },
                            { text: 'API Reference', url: '#' },
                            { text: 'Examples', url: '#' },
                            { text: 'Tutorials', url: '#' }
                        ]
                    },
                    {
                        title: 'Company',
                        links: [
                            { text: 'About', url: '#' },
                            { text: 'Blog', url: '#' },
                            { text: 'Contact', url: '#' },
                            { text: 'Careers', url: '#' }
                        ]
                    },
                    {
                        title: 'Legal',
                        links: [
                            { text: 'Privacy', url: '#' },
                            { text: 'Terms', url: '#' },
                            { text: 'Security', url: '#' }
                        ]
                    }
                ],
                social: [
                    { icon: 'github', url: '#', label: 'GitHub' },
                    { icon: 'twitter', url: '#', label: 'Twitter' },
                    { icon: 'linkedin', url: '#', label: 'LinkedIn' },
                    { icon: 'youtube', url: '#', label: 'YouTube' }
                ],
                copyright: '© 2026 Domma. All rights reserved.'
            });
}
