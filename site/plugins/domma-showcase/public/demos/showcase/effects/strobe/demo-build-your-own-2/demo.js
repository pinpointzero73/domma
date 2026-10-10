/**
 * Demo: Build Your Own - from public/showcase/effects/strobe.
 */
export function mount(root) {
    let ctrl2 = null;
    $(root).find('#stop-2').on('click', () => { if (ctrl2) { ctrl2.stop(); ctrl2 = null; } });
}
