/** Accept, size and count - files that break a rule are refused with a reason. */
export function mount(root) {
    const log = $(root).find('#demo-rules-log');

    const dz = E.dropzone($(root).find('#demo-rules'), {
        accept: ['image/*', '.pdf'],
        maxSize: 1024 * 1024,
        maxFiles: 3,
        // Return false to refuse one file for your own reasons
        onBeforeAdd: (entry) => !entry.name.startsWith('~'),
        onReject: (entry, reason) => {
            log.find('.sx-dz-empty').remove();
            log.prepend($('<li>').text(entry.name + ' - ' + reason));
        }
    });

    return () => dz.destroy();
}
