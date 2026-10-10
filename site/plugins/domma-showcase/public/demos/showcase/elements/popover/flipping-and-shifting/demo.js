/**
 * Flipping and shifting - from public/showcase/elements/popover.
 */
export function mount(root) {
    const whereDidItGo = (asked) => ({
            placement: asked,
            content: 'Asked for ' + asked + '.',
            onShown: (p) => p.setContent('Asked for ' + asked + ', placed ' + p.panel.dataset.side + '.')
        });
    E.popover(root.querySelector('#demo-edge-left'), whereDidItGo('left'));
    E.popover(root.querySelector('#demo-edge-right'), whereDidItGo('right'));
}
