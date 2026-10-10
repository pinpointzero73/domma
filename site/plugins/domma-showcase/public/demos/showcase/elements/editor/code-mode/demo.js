/**
 * Code Mode - from public/showcase/elements/editor.
 */
export function mount(root) {
        // Code Mode Demo
    const codeEditor = E.editor(root.querySelector('#code-editor'), {
            mode: 'code',
            language: 'javascript',
            placeholder: '// Write your code here...',
            lineNumbers: true,
            autosave: true,
            storage: 'domma-code-demo',
            minHeight: 200
        });
}
