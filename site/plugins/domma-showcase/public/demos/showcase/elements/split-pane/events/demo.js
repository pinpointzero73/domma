/** Events - drags from .on() listeners, collapse and expand from the bubbling DOM events. */
export function mount(root) {
    const list = $(root).find('#demo-log');
    const log = (message) => {
        list.find('.sx-split-empty').remove();
        list.prepend($('<li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 8).remove();
    };

    const split = E.splitPane($(root).find('#demo-events'), {
        sizes: [30, 70],
        minSize: 120,
        collapsible: [true, false]
    });
    split.on('dragstart', (sizes, gutter) => log('dragstart: gutter ' + gutter));
    split.on('dragend', (sizes) => log('dragend: ' + sizes.map(Math.round).join(' / ')));

    // Every event also bubbles as dm:split-pane:<event>, with {instance, args} in detail
    const onToggle = (e) => log(e.type.replace('dm:split-pane:', '') + ': pane ' + e.detail.args[0]);
    $(root).on('dm:split-pane:collapse dm:split-pane:expand', onToggle);

    return () => {
        $(root).off('dm:split-pane:collapse dm:split-pane:expand', onToggle);
        split.destroy();
    };
}
