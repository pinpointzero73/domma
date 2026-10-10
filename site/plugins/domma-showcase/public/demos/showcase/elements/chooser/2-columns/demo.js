/**
 * 2 columns - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Columns ----
    const colOpts = (n) => Array.from({ length: n }, (_, i) => ({ value: 'c' + i, label: 'Item ' + (i + 1), icon: 'box' }));
    E.chooser(root.querySelector('#cols-2'), { variant: 'card', density: 'compact', columns: 2, options: colOpts(4) });
}
