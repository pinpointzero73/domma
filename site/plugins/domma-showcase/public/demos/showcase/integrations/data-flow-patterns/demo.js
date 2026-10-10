/**
 * Data Flow Patterns - from public/showcase/integrations.
 */
export function mount(root) {
    function initTabsFromConfig(selector, tabsData) {
            const tabsList = tabsData.map((tab, i) =>
                `<li class="tab-item${i === 0 ? ' active' : ''}">${tab.label}</li>`
            ).join('');

            const tabsPanels = tabsData.map((tab, i) =>
                `<div class="tab-panel${i === 0 ? ' active' : ''}" style="${i === 0 ? '' : 'display:none;'}">${tab.content}</div>`
            ).join('');

            $(selector).html(`
                <div class="tabs">
                    <ul class="tab-list">${tabsList}</ul>
                    <div class="tab-content">${tabsPanels}</div>
                </div>
            `);

            // Initialize tabs component
            return E.tabs(`${selector} .tabs`);
        }
        // Initialize Data Flow Patterns Tabs
    initTabsFromConfig('#data-flow-tabs', [
                {
                    id: 'form-model',
                    label: 'Form → Model',
                    content: `
                        <h4 class="mb-3">Two-Way Binding</h4>
                        <p>Forms can be automatically bound to Models for reactive updates:</p>
                        <pre class="code-block language-javascript">
    const userModel = M.create(userBlueprint, {
        name: 'John Doe',
        email: 'john@example.com'
    });

    // Create form with model binding
    const form = F.create(userBlueprint, {}, {
        model: userModel  // Two-way binding
    });

    // Changes in form update model automatically
    // Changes in model update form automatically
    </pre>
                    `
                },
                {
                    id: 'model-dom',
                    label: 'Model → DOM',
                    content: `
                        <h4 class="mb-3">Reactive DOM Binding</h4>
                        <p>Bind model properties directly to DOM elements:</p>
                        <pre class="code-block language-javascript">
    const userModel = M.create(userBlueprint);

    // Bind model fields to DOM elements
    M.bind(userModel, 'name', '#display-name', {
        twoWay: true  // Updates both ways
    });

    M.bind(userModel, 'email', '#display-email');

    // When model changes, DOM updates automatically
    userModel.set('name', 'Jane Smith');
    </pre>
                    `
                },
                {
                    id: 'model-http',
                    label: 'Model → HTTP',
                    content: `
                        <h4 class="mb-3">API Synchronization</h4>
                        <p>Sync models with REST APIs manually or use CRUD helper:</p>
                        <pre class="code-block language-javascript">
    // Manual sync
    const user = M.create(userBlueprint);

    // Load from API
    const data = await H.get('/api/users/1');
    user.set(data);

    // Save to API
    const result = await H.put('/api/users/1',
        user.toJSON()
    );

    // Or use CRUD helper for automatic sync
    F.crud('#users', userBlueprint, {
        api: '/api/users'  // Handles all CRUD
    });
    </pre>
                    `
                },
                {
                    id: 'model-storage',
                    label: 'Model → Storage',
                    content: `
                        <h4 class="mb-3">localStorage Persistence</h4>
                        <p>Models can automatically persist to localStorage:</p>
                        <pre class="code-block language-javascript">
    // Auto-persist model
    const settings = M.create(settingsBlueprint, {}, {
        persist: 'user-settings',  // localStorage key
        autoSave: true            // Save on every change
    });

    // Manual save/load
    settings.save();
    settings.load();

    // Check if persisted
    if (settings.isPersisted()) {
        console.log('Settings saved');
    }
    </pre>
                    `
                }
            ]
        );
}
