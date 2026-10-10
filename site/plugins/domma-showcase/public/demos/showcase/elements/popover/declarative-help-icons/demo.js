/**
 * Declarative help icons - from public/showcase/elements/popover.
 */
export function mount(root) {
        // ---- Declarative -------------------------------------------------------
    E.popover.scan('#demo-scan');

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('submit', function (event) {
        event.preventDefault();
    });
}
