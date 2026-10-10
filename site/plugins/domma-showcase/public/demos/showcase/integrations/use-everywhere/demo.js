/**
 * Use Everywhere - from public/showcase/integrations.
 */
export function mount(root) {
        // Blueprint Power Demo
    const blueprintDemoBtn = $(root).find('#demo-blueprint-btn');
    const blueprintResult = $(root).find('#blueprint-demo-result');
    const blueprintContent = $(root).find('#blueprint-demo-content');
    let currentView = 'form';
        // Shared data storage for the demo
    let demoData = [
            { name: 'John Doe', email: 'john@example.com', age: 30 },
            { name: 'Jane Smith', email: 'jane@example.com', age: 28 }
        ];
    let demoModel = null;
    let demoTable = null;
    const demoBlueprint = {
            name: { type: 'string', required: true, label: 'Name', placeholder: 'Enter name' },
            email: { type: 'email', required: true, label: 'Email', placeholder: 'you@example.com' },
            age: { type: 'number', min: 18, max: 125, label: 'Age' }
        };
    blueprintDemoBtn.on('click', () => {
            blueprintResult.show();
            renderBlueprintView('form');
        });
    function renderBlueprintView(view) {
            currentView = view;

            // Update button states
            $('[data-view]').removeClass('btn-primary').addClass('btn-secondary');
            $(`[data-view="${view}"]`).removeClass('btn-secondary').addClass('btn-primary');

            if (view === 'form') {
                // Build HTML with container first
                const html = `
                    <h4 class="font-semibold mb-3">Generated Form</h4>
                    <p class="text-muted mb-3">Fill out the form and submit to add data to the table →</p>
                    <div id="demo-form-container"></div>
                `;

                blueprintContent.html(DOMPurify.sanitize(html, {safe: false}));

                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    F.render('#demo-form-container', demoBlueprint, {}, {
                        layout: 'stacked',
                        submitText: 'Add to Table',
                        onSubmit: (data) => {
                            // Add to shared data array
                            demoData.push(data);

                            // Update model if it exists
                            if (demoModel) {
                                demoModel.set(data);
                            }

                            // Show success and switch to table view
                            E.toast(`Added ${data.name} to table!`, { type: 'success' });
                            console.log('Form data:', data);
                            console.log('All data:', demoData);

                            // Auto-switch to table view after 500ms
                            setTimeout(() => {
                                renderBlueprintView('table');
                            }, 500);
                        }
                    });
                }, 10);
            } else if (view === 'model') {
                // Use latest data from array, or create default
                const latestData = demoData.length > 0
                    ? demoData[demoData.length - 1]
                    : { name: 'John Doe', email: 'john@example.com', age: 30 };

                // Create or update model
                if (!demoModel) {
                    demoModel = M.create(demoBlueprint, latestData);
                } else {
                    demoModel.set(latestData);
                }

                const html = `
                    <h4 class="font-semibold mb-3">Model State (JSON)</h4>
                    <p class="text-muted mb-3">This model reflects the latest form submission</p>
                    <pre style="background: #282c34; color: #abb2bf; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 13px;">${JSON.stringify(demoModel.toJSON(), null, 2)}</pre>
                    <p class="mt-3"><strong>Try it:</strong> Open browser console and type:</p>
                    <pre class="code-block language-javascript">
    // Change model property
    window.demoModel.set('name', 'Jane Smith');

    // Get a value
    window.demoModel.get('name');

    // Validate the model
    window.demoModel.validate();

    // Get all data as JSON
    window.demoModel.toJSON();
    </pre>
                `;

                blueprintContent.html(DOMPurify.sanitize(html, {safe: false}));
                window.demoModel = demoModel;
            } else if (view === 'table') {
                // Build HTML with container
                const html = `
                    <h4 class="font-semibold mb-3">Generated Table</h4>
                    <p class="text-muted mb-3">Showing ${demoData.length} record${demoData.length !== 1 ? 's' : ''} - Add more via the Form view</p>
                    <div id="demo-table-container"></div>
                `;

                blueprintContent.html(DOMPurify.sanitize(html, {safe: false}));

                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    // Create table with all data
                    demoTable = Domma.tables.create('#demo-table-container', {
                        columns: [
                            { key: 'name', label: 'Name' },
                            { key: 'email', label: 'Email' },
                            { key: 'age', label: 'Age' }
                        ],
                        data: demoData,
                        striped: true,
                        hover: true,
                        pagination: demoData.length > 5 ? true : false,
                        itemsPerPage: 5
                    });
                }, 10);
            }
        }
    $('[data-view]').on('click', function() {
            renderBlueprintView($(this).attr('data-view'));
        });
}
