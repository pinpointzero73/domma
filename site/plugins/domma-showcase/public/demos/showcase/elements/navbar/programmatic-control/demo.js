/**
 * Programmatic Control - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 7: Programmatic
    const progNav = E.navbar(root.querySelector('#programmatic-example'), {
            brand: {text: 'App'},
            items: [
                {text: 'Home', url: '#', active: true},
                {text: 'About', url: '#'},
                {text: 'Contact', url: '#'}
            ]
        });
    $(root).find('#prog-home').on('click', () => progNav.setActive(0));
    $(root).find('#prog-about').on('click', () => progNav.setActive(1));
    $(root).find('#prog-expand').on('click', () => progNav.expand());
    $(root).find('#prog-collapse').on('click', () => progNav.collapse());
}
