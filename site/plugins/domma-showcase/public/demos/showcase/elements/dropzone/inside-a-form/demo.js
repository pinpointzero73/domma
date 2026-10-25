/** Inside a form - the dropzone uses the form's own file input, so the files submit with it. */
export function mount(root) {
    const form = $(root).find('#demo-form');
    const output = $(root).find('#demo-form-output');

    const dz = E.dropzone($(root).find('#demo-form-zone'));

    // Show what the form would send instead of sending it
    const show = (e) => {
        e.preventDefault();
        const lines = [];
        for (const [key, value] of new FormData(e.currentTarget).entries()) {
            lines.push(key + ' = ' + (typeof value === 'string' ? value : value.name + ' (' + value.size + ' bytes)'));
        }
        output.text(lines.join('\n') || '(empty)');
    };
    form.on('submit', show);

    return () => {
        form.off('submit', show);
        dz.destroy();
    };
}
