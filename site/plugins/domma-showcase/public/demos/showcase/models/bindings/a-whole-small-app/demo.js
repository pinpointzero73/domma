/**
 * A whole small app - from public/showcase/models/bindings.
 */
export function mount(root) {
    $(root).find('#todo-host').append(document.createElement('bind-todo'));
}
