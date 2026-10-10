/**
 * Simple Layout - from public/showcase/footer.
 */
export function mount(root) {
    E.footer(root.querySelector('#footer-simple'), {
        layout: 'simple',
        variant: 'light',
        brand: {
            text: 'Domma',
            url: '/'
        },
        links: [
            { text: 'Features', url: '#features' },
            { text: 'Pricing', url: '#pricing' },
            { text: 'About', url: '#about' },
            { text: 'Contact', url: '#contact' }
        ],
        social: [
            { icon: 'github', url: 'https://github.com', label: 'GitHub' },
            { icon: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
            { icon: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
        ],
        copyright: '© 2026 Domma. All rights reserved.'
    });
}
