/**
 * With Loading Text - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 5: With Loading Text
    const textLoader = E.loader(root.querySelector('#text-container'), {
            type: 'dots',
            size: 'medium',
            color: 'primary',
            text: 'Loading your data...'
        });
    textLoader.show();
    setTimeout(() => textLoader.setText('Almost there...'), 2000);
}
