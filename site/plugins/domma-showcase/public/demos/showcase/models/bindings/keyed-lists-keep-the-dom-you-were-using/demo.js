/**
 * Keyed lists keep the DOM you were using - from public/showcase/models/bindings.
 */
export function mount(root) {
    $(root).find('#keyed-host').append(document.createElement('bind-keyed'));
}
