/**
 * 1 column - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Columns ----
    const colOpts = (n) => Array.from({ length: n }, (_, i) => ({ value: 'c' + i, label: 'Item ' + (i + 1), icon: 'box' }));
    E.chooser(root.querySelector('#cols-1'), { variant: 'card', density: 'compact', columns: 1, options: colOpts(3) });
}
