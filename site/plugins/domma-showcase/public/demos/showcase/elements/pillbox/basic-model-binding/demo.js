/**
 * Basic Model Binding - from public/showcase/elements/pillbox.
 */
export function mount(root) {
        // Model Integration Demo
    const tagsModel = M.create({
            selectedTags: {type: 'array', default: []}
        });
    E.pillbox(root.querySelector('#model-tags'), {
            data: ['React', 'Vue', 'Angular', 'Svelte', 'Ember', 'Backbone'],
            model: tagsModel,
            modelKey: 'selectedTags'
        });
        // Bind model value display
    M.bind(tagsModel, 'selectedTags', '#model-display', {
            format: (tags) => tags.length > 0 ? JSON.stringify(tags) : '[]'
        });
}
