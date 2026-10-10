/**
 * Demo - from public/showcase/elements/tabs.
 */
export function mount(root) {
        // Config Engine demo
    $.setup({
            '.config-demo-tabs': {
                component: 'tabs',
                options: {
                    activeIndex: 0,
                    animation: true,
                    onChange: (index) => {
                        console.log('Config demo tab changed to:', index);
                    }
                }
            }
        });
}
