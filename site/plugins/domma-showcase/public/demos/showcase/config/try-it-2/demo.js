/**
 * Try it - from public/showcase/config.
 */
export function mount(root) {
        // Demo: DOMReady initialisation
    $.setup({
            $init() {
                console.log('✅ $init callback executed - all configs processed');
                $(root).find('#demo-init-status')
                    .html('<strong style="color: #10b981;">✓ Initialised!</strong><br>$init callback executed successfully')
                    .css({ 'background': '#d1fae5', 'color': '#065f46' });
            },

            '#demo-init-status': {
                init($el) {
                    console.log('✅ Per-selector init callback for #demo-init-status', $el);
                    setTimeout(() => {
                        $el.append('<br><small>Per-selector init also ran!</small>');
                    }, 500);
                }
            }
        });
}
