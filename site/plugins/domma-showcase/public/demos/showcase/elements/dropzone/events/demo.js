/** Events - .on() listeners on the instance and one DOM listener for refusals. */
export function mount(root) {
    const list = $(root).find('#demo-log');
    const log = (message) => {
        list.find('.sx-dz-empty').remove();
        list.prepend($('<li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 8).remove();
    };

    const dz = E.dropzone($(root).find('#demo-events'), {accept: 'image/*'});
    dz.on('add', (entry) => log('add: ' + entry.name));
    dz.on('remove', (entry) => log('remove: ' + entry.name));
    dz.on('change', (files) => log('change: ' + files.length + ' file(s)'));

    // Every event also bubbles as dm:dropzone:<event>, with {instance, args} in detail
    const onReject = (e) => {
        const [entry, reason] = e.detail.args;
        log('dm:dropzone:reject: ' + entry.name + ' (' + reason + ')');
    };
    $(root).on('dm:dropzone:reject', onReject);

    return () => {
        $(root).off('dm:dropzone:reject', onReject);
        dz.destroy();
    };
}
