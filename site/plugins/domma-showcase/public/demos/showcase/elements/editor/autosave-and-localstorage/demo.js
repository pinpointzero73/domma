/**
 * Autosave & localStorage - from public/showcase/elements/editor.
 */
export function mount(root) {
        // Autosave Demo
    const autosaveEditor = E.editor(root.querySelector('#autosave-editor'), {
            mode: 'text',
            autosave: true,
            autosaveInterval: 2000,
            storage: 'domma-autosave-demo',
            placeholder: 'Type something... it will save automatically every 2 seconds',
            minHeight: 150,
            onSave: (content) => {
                $(root).find('#last-saved')[0].textContent = D().format('HH:mm:ss');
            }
        });
    function manualSave() {
            autosaveEditor.save();
        };
    function clearStorage() {
            S.remove('editor:domma-autosave-demo');
            autosaveEditor.clear();
            $(root).find('#last-saved')[0].textContent = 'Never';
            E.toast('Storage cleared!');
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        manualSave();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        clearStorage();
    });
}
