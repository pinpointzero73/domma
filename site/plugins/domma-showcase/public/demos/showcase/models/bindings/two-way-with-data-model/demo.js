/**
 * Two-way with data-model - from public/showcase/models/bindings.
 */
export function mount(root) {
    $(root).find('#model-host').append(document.createElement('bind-model'));
}
