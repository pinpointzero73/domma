/**
 * Page Builder - from public/showcase/page-roller.
 */
export function mount(root) {
        // Create Page Roller instance
    const builder = E.pageRoller(root.querySelector('#page-roller-container'), {
            theme: Domma.theme.get(),
            splitView: true,
            autoSave: true
        });
        // Try to load active document
    const active = builder.loadFromStorage ? builder.loadFromStorage() : null;
}
