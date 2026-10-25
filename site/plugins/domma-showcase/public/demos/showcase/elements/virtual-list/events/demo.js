/**
 * Events - one document listener logs the lists on this page (the feed's loading, and clicks on any row).
 */
export function mount(root) {
    const list = $(root).find('#demo-log');
    const EVENTS = 'dm:virtual-list:loadmore dm:virtual-list:loaded dm:virtual-list:end ' +
        'dm:virtual-list:error dm:virtual-list:itemclick';

    const log = (message) => {
        list.find('li').filter((i, el) => /^Nothing yet/.test(el.textContent)).remove();
        list.prepend($('<li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 8).remove();
    };

    // detail = {instance, args}: the list that fired, and the event's arguments.
    const describe = {
        loadmore: ({page}) => 'loading page ' + (page + 1),
        loaded: (items) => 'loaded ' + items.length + ' items',
        end: () => 'nothing more to load',
        error: (err) => 'error: ' + err.message,
        itemclick: (item, index) => 'clicked row ' + index
    };
    const onEvent = (e) => {
        const name = e.type.split(':').pop();
        const label = e.detail.instance.options.label || 'A list';
        log(label + ': ' + describe[name](...e.detail.args));
    };

    $(document).on(EVENTS, onEvent);
    return () => $(document).off(EVENTS, onEvent);
}
