/**
 * What happened - from public/showcase/elements/context-menu.
 */
export function mount(root) {
    const log = (message) => {
        const list = $(root).find('#demo-log');
        list.html('<li>' + message + '</li>' + list.html().replace(/^<li>Nothing yet[^<]*<\/li>/, ''));
    };
}
