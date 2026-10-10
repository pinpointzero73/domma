/**
 * 11. Navigation Components - from public/showcase/themes.
 */
export function mount(root) {
    E.breadcrumbs(root.querySelector('#audit-breadcrumbs'), {
      items: [
        { text: 'Home', url: '#' },
        { text: 'Showcase', url: '#' },
        { text: 'Themes', active: true }
      ],
      separator: 'chevron'
    });
}
