/**
 * Simple Back to Top Button - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
    const quickBtn = E.backToTop(root.querySelector('#quick-back-to-top'), {
        showAfter: 200,
        duration: 500,
        target: '#quick-demo-container'
    });
}
