/**
 * Model Integration - from public/showcase/elements/editor.
 */
export function mount(root) {
        // Model Integration Demo
    const contentModel = M.create({
            text: {type: 'string', default: ''}
        });
    const modelEditor = E.editor(root.querySelector('#model-editor'), {
            mode: 'text',
            model: contentModel,
            modelKey: 'text',
            placeholder: 'Type here to update the model...',
            minHeight: 200
        });
        // Bind model to display
    M.bind(contentModel, 'text', '#model-display', {
            format: (val) => val || '(empty)'
        });
    function updateModel() {
            contentModel.set('text', 'Hello from Model!\n\nThis text was set programmatically via model.set()');
        };
    function clearModel() {
            contentModel.set('text', '');
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        updateModel();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        clearModel();
    });
}
