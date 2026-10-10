/**
 * Events - from public/showcase/models/bindings.
 */
export function mount(root) {
    $(root).find('#events-host').append(document.createElement('bind-events'));
}
