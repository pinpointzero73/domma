/**
 * One flag, four shapes - from public/showcase/flags.
 */
export function mount(root) {
    const shapesHost = $(root).find('#shapes-demo');
    ['rect', 'rounded', 'square', 'circle'].forEach(shape => {
            const fig = document.createElement('figure');
            fig.appendChild(FL.render('gb', {size: 72, shape, border: true}));
            const cap = document.createElement('figcaption');
            cap.textContent = shape;
            fig.appendChild(cap);
            shapesHost.append(fig);
        });
}
