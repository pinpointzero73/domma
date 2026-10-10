/**
 * Try it - from public/showcase/config.
 */
export function mount(root) {
    let clickCount = 0;
    $.setup({
            '#demo-click-btn': {
                events: {
                    click: (e, $el) => {
                        clickCount++;
                        $(root).find('#demo-click-result').text('Click count: ' + clickCount);
                    }
                }
            }
        });
}
