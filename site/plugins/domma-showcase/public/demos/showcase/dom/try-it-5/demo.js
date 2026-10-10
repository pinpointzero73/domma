/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // Content demo
    $(root).find('#get-html').on('click', function () {
            $(root).find('#content-result').text('html(): ' + $(root).find('#content-box').html());
        });
    $(root).find('#set-html').on('click', function () {
            $(root).find('#content-box').html('<u>Updated</u> <mark>HTML</mark>');
            $(root).find('#content-result').text('Set new HTML content');
        });
    $(root).find('#get-text').on('click', function () {
            $(root).find('#content-result').text('text(): ' + $(root).find('#content-box').text());
        });
    $(root).find('#set-text').on('click', function () {
            $(root).find('#content-box').text('Plain text only');
            $(root).find('#content-result').text('Set plain text (HTML escaped)');
        });
}
