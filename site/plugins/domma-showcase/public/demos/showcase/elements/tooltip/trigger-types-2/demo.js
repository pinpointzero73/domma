/**
 * Trigger Types - from public/showcase/elements/tooltip.
 */
export function mount(root) {
    E.tooltip(root.querySelector('#trigger-hover'), {content: 'Shown on hover', trigger: 'hover'});
    E.tooltip(root.querySelector('#trigger-click'), {content: 'Shown on click', trigger: 'click'});
    E.tooltip(root.querySelector('#trigger-focus'), {content: 'Shown on focus', trigger: 'focus'});
}
