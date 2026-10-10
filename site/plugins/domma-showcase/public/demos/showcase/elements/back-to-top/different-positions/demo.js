/**
 * Different Positions - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
        // Position examples
    const btnRight = E.backToTop(root.querySelector('#btn-bottom-right'), {
            showAfter: 200,
            target: '#position-demo',
            offset: {bottom: 20, right: 20}
        });
    const btnLeft = E.backToTop(root.querySelector('#btn-bottom-left'), {
            showAfter: 200,
            target: '#position-demo',
            offset: {bottom: 20, left: 20}
        });
}
