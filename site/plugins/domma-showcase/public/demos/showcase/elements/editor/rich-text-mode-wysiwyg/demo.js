/**
 * Rich Text Mode (WYSIWYG) - from public/showcase/elements/editor.
 */
export function mount(root) {
        // Rich Text Mode Demo
    const richEditor = E.editor(root.querySelector('#rich-editor'), {
            mode: 'rich',
            placeholder: 'Start writing...',
            autosave: true,
            storage: 'domma-rich-demo',
            minHeight: 250,
            imagePaste: true,
            imageMode: 'base64'
        });
}
