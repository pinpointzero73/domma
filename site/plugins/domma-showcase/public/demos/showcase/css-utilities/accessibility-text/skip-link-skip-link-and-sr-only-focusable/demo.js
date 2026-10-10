/**
 * Skip link: .skip-link and .sr-only-focusable - from public/showcase/css-utilities/accessibility-text.
 */
export function mount(root) {
        // Focus the skip link so it can be seen without leaving the page.
    $(root).find('#demo-skip-focus').on('click', () => $('.skip-link').get(0).focus());
}
