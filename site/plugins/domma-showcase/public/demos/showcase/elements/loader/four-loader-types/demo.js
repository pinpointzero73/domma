/**
 * Four Loader Types - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 1: Loader Types
    const spinnerLoader = E.loader(root.querySelector('#type-spinner'), {type: 'spinner', size: 'medium', color: 'primary'});
    spinnerLoader.show();
    const dotsLoader = E.loader(root.querySelector('#type-dots'), {type: 'dots', size: 'medium', color: 'primary'});
    dotsLoader.show();
    const pulseLoader = E.loader(root.querySelector('#type-pulse'), {type: 'pulse', size: 'medium', color: 'primary'});
    pulseLoader.show();
    const barsLoader = E.loader(root.querySelector('#type-bars'), {type: 'bars', size: 'medium', color: 'primary'});
    barsLoader.show();
}
