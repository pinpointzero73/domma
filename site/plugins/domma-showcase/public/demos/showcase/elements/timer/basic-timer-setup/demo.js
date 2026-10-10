/**
 * Basic Timer Setup - from public/showcase/elements/timer.
 */
export function mount(root) {
        // Config Engine Setup
    $.setup({
            '#config-timer': {
                component: 'timer',
                options: {
                    duration: 300000,
                    format: 'mm:ss',
                    showControls: true
                }
            }
        });
}
