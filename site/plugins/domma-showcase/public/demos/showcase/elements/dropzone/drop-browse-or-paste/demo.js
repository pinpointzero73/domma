/** Drop, browse or paste - a dropzone with its defaults. */
export function mount(root) {
    const count = $(root).find('#demo-basic-count');

    const dz = E.dropzone($(root).find('#demo-basic'));
    dz.on('change', (files) => count.text(files.length + (files.length === 1 ? ' file' : ' files')));

    return () => dz.destroy();
}
