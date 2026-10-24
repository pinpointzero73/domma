/**
 * Events - from public/showcase/elements/popover.
 */
export function mount(root) {
    const log = (message) => {
            const list = $(root).find('#demo-log');
            list.find('li').filter((i, el) => /^Nothing yet/.test(el.textContent)).remove();
            list.prepend('<li>' + _.escape(D().format('HH:mm:ss') + ' - ' + message) + '</li>');
            list.find('li').filter((i) => i >= 8).remove();
        };
        // ---- One listener for the whole page -------------------------------------
    $('main').on('dm:popover:shown', (e) => {
            const trigger = e.detail.instance.trigger;
            log('Opened: ' + (trigger.getAttribute('aria-label') || trigger.textContent.trim()));
        });
    $('main').on('dm:popover:hidden', (e) => {
            const trigger = e.detail.instance.trigger;
            log('Closed: ' + (trigger.getAttribute('aria-label') || trigger.textContent.trim()));
        });
}
