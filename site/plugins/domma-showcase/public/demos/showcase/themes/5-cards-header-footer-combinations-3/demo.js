/**
 * 5. Cards - header / footer combinations - from public/showcase/themes.
 */
export function mount(root) {
    if (E.card) E.card(root.querySelector('#audit-card-collapsible'), { collapsible: true });
}
