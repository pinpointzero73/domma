/**
 * Schema Builder - from public/showcase/schema-builder.
 */
export function mount(root) {
        // Create Schema Builder instance
    const builder = E.schemaBuilder(root.querySelector('#schema-builder-container'), {
            theme: Domma.theme.get(),
            autoSave: true,
            showPreview: true,
            previewLayout: 'stacked',
            onChange: (fields) => {
                console.log('Schema changed:', fields);
            },
            onExport: (format, data) => {
                console.log(`Exported as ${format}:`, data);
            }
        });
        // Try to load active schema from localStorage
    const activeFields = SchemaTemplateManager.loadActive();
    if (activeFields && activeFields.length > 0) {
            builder._fields = activeFields;
            builder._renderCanvas();
            builder._renderPreview();
        }
}
