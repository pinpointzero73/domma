/**
 * Programmatic Control - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
        // Programmatic control
    const programmaticBtn = E.backToTop(root.querySelector('#programmatic-btn'), {
            showAfter: 200,
            target: '#programmatic-demo'
        });
    $(root).find('#prog-show').on('click', () => programmaticBtn.show());
    $(root).find('#prog-hide').on('click', () => programmaticBtn.hide());
    $(root).find('#prog-toggle').on('click', () => programmaticBtn.toggle());
    $(root).find('#prog-scroll').on('click', () => programmaticBtn.scroll(400));
}
