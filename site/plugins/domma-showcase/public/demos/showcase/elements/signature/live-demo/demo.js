/**
 * Live Demo - from public/showcase/elements/signature.
 *
 * The output panel is bound: it shows the exported PNG when there is one,
 * otherwise the last message.
 */
export function mount(root) {
    const overviewSig = E.signature(root.querySelector('#sig-overview'), {
        label: 'Signature Pad',
        placeholder: 'Draw your signature here',
    });

    const image = M.observable('');
    const message = M.observable('Interact with the pad above, then click a button.');

    const handle = M.applyBindings({
        image, message,
        exportPng() {
            if (overviewSig.isEmpty()) {
                E.toast('Pad is empty - draw something first.', {type: 'warning'});
                return;
            }
            image.value = overviewSig.toBase64('png');
        },
        checkEmpty() {
            image.value = '';
            message.value = `isEmpty() → ${overviewSig.isEmpty()}`;
        }
    }, root);

    return () => {
        handle.dispose();
        overviewSig?.destroy?.();
    };
}
