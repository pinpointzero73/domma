/**
 * Screen Reader Only - from public/showcase/css-utilities/accessibility-text.
 */
export function mount(root) {
        // What a screen reader would hear for the two icon buttons: their text content,
        // since the icons are aria-hidden and the .sr-only spans are not.
    $(root).find('#demo-sr-names').text(['#demo-sr-bell', '#demo-sr-trash']
            .map((sel) => '"' + $(sel).text().trim() + '"').join(', '));
}
