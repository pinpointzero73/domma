/**
 * Try it - from public/showcase/config.
 */
export function mount(root) {
        // Demo: Runtime updates
    $.setup({
            '#demo-update-box': {
                initial: {
                    text: 'Original State',
                    css: {background: 'var(--dm-gray-200)'}
                }
            },
            '#demo-update-1': {
                events: {
                    click: () => $.update('#demo-update-box', {
                        initial: {text: 'Text Updated!'}
                    })
                }
            },
            '#demo-update-2': {
                events: {
                    click: () => $.update('#demo-update-box', {
                        initial: {
                            css: {background: 'var(--dm-primary)', color: 'var(--dm-white)'}
                        }
                    })
                }
            },
            '#demo-update-3': {
                events: {
                    click: () => $.update('#demo-update-box', {
                        initial: {
                            text: 'Original State',
                            css: {background: 'var(--dm-gray-200)', color: 'inherit'}
                        }
                    })
                }
            }
        });
}
