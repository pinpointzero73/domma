/**
 * Live Web Component Demo - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
        // Web Component Demos
        // Main Web Component demo - get the element and set its target
    const wcDemoBtn = $(root).find('#wc-demo-btn')[0];
    if (wcDemoBtn) {
            wcDemoBtn.setAttribute('target', '#wc-demo-container');
        }
}
