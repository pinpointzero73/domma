/**
 * Text Mode - from public/showcase/elements/editor.
 */
export function mount(root) {
    const textEditor = E.editor(root.querySelector('#text-editor'), {
        mode: 'text',
        placeholder: 'Start typing your notes...',
        characterCount: true,
        wordCount: true,
        autosave: true,
        autosaveInterval: 3000,
        storage: 'domma-text-demo',
        minHeight: 150
    });
}
