/**
 * Conditionals - from public/showcase/models/bindings.
 */
export function mount(root) {
    $(root).find('#if-host').append(document.createElement('bind-if'));
}
