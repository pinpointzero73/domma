/**
 * Tutorial - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
        // Tutorial
    const tutorialBtn = E.backToTop(root.querySelector('#tutorial-back-to-top'), {
            showAfter: 300,
            duration: 600,
            target: '#tutorial-container',
            onShow: () => {
                $(root).find('#button-status')[0].textContent = 'Visible';
            },
            onHide: () => {
                $(root).find('#button-status')[0].textContent = 'Hidden';
            }
        });
}
