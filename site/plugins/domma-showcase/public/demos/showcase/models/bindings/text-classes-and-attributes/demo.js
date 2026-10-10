/**
 * Text, classes and attributes - from public/showcase/models/bindings.
 */
export function mount(root) {
    $(root).find('#oneway-host').append(document.createElement('bind-oneway'));
}
