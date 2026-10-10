/**
 * Events - from public/showcase/elements/sortable.
 */
export function mount(root) {
    const log = (message) => {
            const list = $(root).find('#demo-log');
            list.find('li').filter((i, el) => /^Nothing yet/.test(el.textContent)).remove();
            list.prepend('<li>' + _.escape(message) + '</li>');
            list.find('li').filter((i) => i >= 6).remove();
        };
        // ---- One listener for every cancel on the page ------------------------
    $('main').on('sortable:cancel', () => log('Drag cancelled'));
}
