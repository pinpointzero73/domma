/**
 * Quick Integration Reference - from public/showcase/integrations.
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
        // Initialize Quick Reference Tabs
    initTabsFromConfig('#reference-tabs', [
                {
                    id: 'blueprint-methods',
                    label: 'Blueprint Methods',
                    content: `
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <code class="badge badge-primary">M.extend()</code>
                            <code class="badge badge-primary">M.pick()</code>
                            <code class="badge badge-primary">M.omit()</code>
                            <code class="badge badge-primary">M.types.string</code>
                            <code class="badge badge-primary">M.types.number</code>
                            <code class="badge badge-primary">M.types.email</code>
                        </div>
                        <p class="mt-3">See <a href="../blueprints/">Blueprints Showcase</a> for complete reference.</p>
                    `
                },
                {
                    id: 'model-methods',
                    label: 'Model Methods',
                    content: `
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <code class="badge badge-success">M.create()</code>
                            <code class="badge badge-success">model.get()</code>
                            <code class="badge badge-success">model.set()</code>
                            <code class="badge badge-success">model.validate()</code>
                            <code class="badge badge-success">M.bind()</code>
                            <code class="badge badge-success">model.save()</code>
                            <code class="badge badge-success">model.load()</code>
                            <code class="badge badge-success">model.toJSON()</code>
                            <code class="badge badge-success">model.reset()</code>
                        </div>
                        <p class="mt-3">See <a href="../models/">Models Showcase</a> for complete reference.</p>
                    `
                },
                {
                    id: 'form-methods',
                    label: 'Form Methods',
                    content: `
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <code class="badge badge-info">F.create()</code>
                            <code class="badge badge-info">F.crud()</code>
                            <code class="badge badge-info">F.modal()</code>
                            <code class="badge badge-info">F.wizard()</code>
                            <code class="badge badge-info">form.getData()</code>
                            <code class="badge badge-info">form.setData()</code>
                            <code class="badge badge-info">form.validate()</code>
                            <code class="badge badge-info">form.reset()</code>
                        </div>
                        <p class="mt-3">See <a href="../forms/">Forms Showcase</a> for complete reference.</p>
                    `
                },
                {
                    id: 'event-methods',
                    label: 'Event Methods',
                    content: `
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <code class="badge badge-warning">M.subscribe()</code>
                            <code class="badge badge-warning">M.publish()</code>
                            <code class="badge badge-warning">M.unsubscribe()</code>
                            <code class="badge badge-warning">M.once()</code>
                            <code class="badge badge-warning">model.onChange()</code>
                        </div>
                        <p class="mt-3">See <a href="../models/">Models Showcase</a> for Pub/Sub examples.</p>
                    `
                }
            ]
        );
}
