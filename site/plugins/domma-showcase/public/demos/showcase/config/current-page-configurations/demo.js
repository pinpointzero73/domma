/**
 * Current Page Configurations - from public/showcase/config.
 */
export function mount(root) {
        // Demo: Config inspection
    $.setup({
            '#demo-inspect': {
                events: {
                    click: () => {
                        const config = $.config();
                        const result = $(root).find('#demo-inspect-result');
                        result.removeClass('hidden');
                        result.text(JSON.stringify(config, (key, value) => {
                            if (typeof value === 'function') return '[Function]';
                            return value;
                        }, 2));
                    }
                }
            }
        });
}
