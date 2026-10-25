/**
 * Events - one document listener logs every palette on the page.
 */
export function mount(root) {
    const list = $(root).find('#demo-log');
    const EVENTS = 'dm:command-palette:open dm:command-palette:close dm:command-palette:select dm:command-palette:run';

    const log = (message) => {
        list.find('li').filter((i, el) => /^Nothing yet/.test(el.textContent)).remove();
        list.prepend($('<li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 8).remove();
    };

    // detail = {instance, args}; select and run pass the command first.
    const onEvent = (e) => {
        const name = e.type.split(':').pop();
        const command = e.detail.args[0];
        log(name + (command && command.title ? ' "' + command.title + '"' : ''));
    };

    $(document).on(EVENTS, onEvent);
    return () => $(document).off(EVENTS, onEvent);
}
