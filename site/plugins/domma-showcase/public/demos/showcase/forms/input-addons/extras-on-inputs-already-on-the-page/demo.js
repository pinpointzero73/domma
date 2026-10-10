/**
 * Extras on inputs already on the page - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    E.inputGroup(root.querySelector('#x-pw'), {reveal: true});
    E.inputGroup(root.querySelector('#x-q'), {prefix: {icon: 'filter'}, clear: true});
    E.inputGroup(root.querySelector('#x-qty'), {stepper: true, suffix: 'boxes'});
    E.inputGroup(root.querySelector('#x-note'), {counter: true, clear: true});
}
