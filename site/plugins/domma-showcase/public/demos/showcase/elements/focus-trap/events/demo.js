/**
 * Events: every trap fires dm:focus-trap:<name> on its container, so one listener hears them all.
 */
export function mount(root) {
    const $root = $(root);
    const names = {'ev-panel': 'Form', 'ev-confirm': 'Confirm'};
    const events = ['activate', 'deactivate', 'pause', 'unpause'].map((name) => 'dm:focus-trap:' + name).join(' ');

    const log = (message) => {
        const list = $root.find('#ev-log');
        list.find('li').filter((i, el) => /^Nothing yet/.test(el.textContent)).remove();
        list.prepend($('<li></li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 8).remove();
    };

    const marker = (panel) => ({
        onActivate: () => panel.addClass('is-trapping'),
        onDeactivate: () => panel.removeClass('is-trapping')
    });
    const formPanel = $root.find('#ev-panel');
    const confirmPanel = $root.find('#ev-confirm');
    const form = E.focusTrap(formPanel.get(0), marker(formPanel));
    const confirm = E.focusTrap(confirmPanel.get(0), marker(confirmPanel));

    // The DOM events bubble, so one handler on the demo hears both traps.
    const onTrapEvent = (e) => log(names[e.detail.instance.element.id] + ': ' + e.type.replace('dm:focus-trap:', ''));
    $root.on(events, onTrapEvent);

    $root.find('#ev-on').on('click', () => form.activate());
    $root.find('#ev-off').on('click', () => form.deactivate());
    $root.find('#ev-confirm-on').on('click', () => confirm.activate());
    $root.find('#ev-confirm-off').on('click', () => confirm.deactivate());

    return () => {
        $root.off(events, onTrapEvent);
        confirm.destroy();
        form.destroy();
    };
}
