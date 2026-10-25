/** Your own content and a list elsewhere - a compact, single-file picker. */
export function mount(root) {
    const toggle = $(root).find('#demo-custom-toggle');

    const avatar = E.dropzone($(root).find('#demo-custom'), {
        accept: 'image/*',
        multiple: false,
        list: $(root).find('#demo-custom-list').get(0),
        labels: {added: 'Picture chosen: {name}'}
    });

    const flip = () => {
        if (avatar.isDisabled()) avatar.enable();
        else avatar.disable();
        toggle.text(avatar.isDisabled() ? 'Enable' : 'Disable');
    };
    toggle.on('click', flip);

    return () => {
        toggle.off('click', flip);
        avatar.destroy();
    };
}
