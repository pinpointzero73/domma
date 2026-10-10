/**
 * Usage - from public/showcase/schema-builder.
 */
export function mount(root) {
        // Initialize Usage tabs
    E.tabs(root.querySelector('#usage-tabs'), {
            tabs: [
                {
                    id: 'api',
                    label: 'JavaScript API',
                    content: `
                        <div class="code-block language-javascript">
                            <span class="comment">// Create a Schema Builder instance</span>
                            const builder = E.schemaBuilder(root.querySelector('#container'), {
                                theme: 'light',
                                autoSave: true,
                                showPreview: true,
                                previewLayout: 'stacked'
                            });

                            <span class="comment">// Add fields programmatically</span>
                            builder.addField('string', 0);
                            builder.addField('email', 1);
                            builder.addField('select', 2);

                            <span class="comment">// Update field properties</span>
                            builder.updateField(0, {
                                required: true,
                                minLength: 3,
                                label: 'Username'
                            });

                            <span class="comment">// Export to multiple formats</span>
                            const js = builder.exportJS();
                            const json = builder.exportJSON();
                            const ts = builder.exportTypeScript({
                                interfaceName: 'UserData',
                                comments: true
                            });
                        </div>
                    `
                },
                {
                    id: 'composition',
                    label: 'Blueprint Composition',
                    content: `
                        <div class="code-block language-javascript">
                            <span class="comment">// Import existing blueprint</span>
                            const userBlueprint = {
                                username: { type: 'string', required: true },
                                email: { type: 'email', required: true }
                            };
                            builder.importBlueprint(userBlueprint, 'User');

                            <span class="comment">// Extend with M.extend</span>
                            const extended = M.extend(
                                userBlueprint,
                                { role: { type: 'select', options: ['admin', 'user'] } }
                            );
                            builder.importBlueprint(extended, 'Extended User');

                            <span class="comment">// Pick specific fields</span>
                            const picked = M.pick(userBlueprint, ['email']);
                            builder.importBlueprint(picked, 'Email Only');

                            <span class="comment">// Save/Load templates</span>
                            builder.saveTemplate('Contact Form');
                            builder.loadTemplate('Contact Form');
                        </div>
                    `
                },
                {
                    id: 'management',
                    label: 'Field Management',
                    content: `
                        <div class="code-block language-javascript">
                            <span class="comment">// Field operations</span>
                            builder.removeField(1);
                            builder.moveField(2, 0);
                            builder.duplicateField(0);

                            <span class="comment">// Get blueprint data</span>
                            const blueprint = builder.getBlueprint();
                            const fields = builder.getFields();

                            <span class="comment">// Select field for editing</span>
                            builder._selectField(0);

                            <span class="comment">// Clear all fields</span>
                            builder.newSchema('My New Schema');
                        </div>
                    `
                },
                {
                    id: 'export',
                    label: 'Export Examples',
                    content: `
                        <div class="code-block language-javascript">
                            <span class="comment">// JavaScript object</span>
                            const userBlueprint = {
                                username: {
                                    type: 'string',
                                    required: true,
                                    minLength: 3,
                                    label: 'Username'
                                }
                            };

                            <span class="comment">// TypeScript interface</span>
                            interface UserData {
                                username: string;  <span class="comment">// Username</span>
                            }

                            <span class="comment">// JSON for API/config</span>
                            {
                                "username": {
                                    "type": "string",
                                    "required": true
                                }
                            }
                        </div>
                    `
                }
            ]
        });
}
