/**
 * Static Helper Methods - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 6: Static Helper Methods
    $(root).find('#static-show-btn').on('click', () => {
            E.showLoader(root.querySelector('#static-container'));
        });
    $(root).find('#static-hide-btn').on('click', () => {
            E.hideLoader(root.querySelector('#static-container'));
        });
}
