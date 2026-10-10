/**
 * Trigger Notification on Click - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Config Engine Demo
    $.setup({
            '#config-demo': {
                events: {
                    click: () => {
                        E.notify('Config Engine', {
                            body: 'Triggered via declarative config!'
                        });
                    }
                }
            }
        });
}
