/**
 * Blueprint Examples - from public/showcase/blueprints.
 */
export function mount(root) {
    const blueprints = {
        contact: {
            name: { type: 'string', required: true, minLength: 2, label: 'Full Name', placeholder: 'Enter your full name' },
            email: { type: 'email', required: true, label: 'Email Address', placeholder: 'you@example.com' },
            message: { type: 'textarea', required: true, minLength: 10, rows: 4, label: 'Message', placeholder: 'Your message here...' }
        },
        registration: {
            email: { type: 'email', required: true, label: 'Email Address' },
            password: {
                type: 'password',
                required: true,
                minLength: 8,
                label: 'Password',
                help: 'At least 8 characters',
                validate: (value) => {
                    if (!/[A-Z]/.test(value)) return 'Need uppercase letter';
                    if (!/[0-9]/.test(value)) return 'Need a number';
                    return true;
                }
            },
            confirmPassword: {
                type: 'password',
                required: true,
                label: 'Confirm Password',
                validate: (value, data) => {
                    return value === data.password || 'Passwords do not match';
                }
            },
            agreeToTerms: {
                type: 'boolean',
                required: true,
                label: 'I agree to the Terms of Service',
                validate: (value) => value || 'You must accept the terms'
            }
        },
        settings: {
            notifications: { type: 'boolean', default: true, label: 'Email Notifications' },
            theme: { type: 'select', options: ['light', 'dark', 'auto'], default: 'auto', label: 'Theme' },
            language: {
                type: 'radio',
                options: [
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' }
                ],
                default: 'en',
                label: 'Language'
            }
        },
        product: {
            name: {
                type: 'string',
                required: true,
                maxLength: 100,
                label: 'Product Name',
                formConfig: {
                    span: 2,  // Span 2 columns in grid layout
                    tooltip: 'The display name of your product'
                }
            },
            sku: {
                type: 'string',
                required: true,
                pattern: /^[A-Z0-9-]+$/,
                label: 'SKU',
                formConfig: {
                    placeholder: 'e.g. PROD-001',
                    tooltip: 'Stock Keeping Unit - unique product identifier'
                }
            },
            price: {
                type: 'number',
                required: true,
                min: 0,
                step: 0.01,
                label: 'Price (£)',
                formConfig: {
                    placeholder: '0.00',
                    tooltip: 'Product price in GBP'
                }
            },
            category: {
                type: 'select',
                required: true,
                options: ['Electronics', 'Clothing', 'Home'],
                label: 'Category',
                formConfig: {
                    tooltip: 'Product category for organisation'
                }
            },
            stock: {
                type: 'number',
                required: true,
                min: 0,
                label: 'Stock Quantity',
                formConfig: {
                    placeholder: '0',
                    tooltip: 'Current available inventory'
                }
            },
            description: {
                type: 'textarea',
                required: true,
                maxLength: 1000,
                rows: 5,
                label: 'Description',
                formConfig: {
                    span: 2,  // Full width in 2-column grid
                    placeholder: 'Product description...',
                    helperText: 'Maximum 1000 characters',
                    tooltip: 'Detailed product description for customers'
                }
            },
            inStock: {
                type: 'boolean',
                default: true,
                label: 'In Stock',
                formConfig: { span: 2 }  // Full width
            }
        },
        userProfile: {
            firstName: {
                type: 'string',
                required: true,
                minLength: 2,
                label: 'First Name',
                formConfig: { placeholder: 'Enter first name' }
            },
            lastName: {
                type: 'string',
                required: true,
                minLength: 2,
                label: 'Last Name',
                formConfig: { placeholder: 'Enter last name' }
            },
            email: {
                type: 'email',
                required: true,
                label: 'Email Address',
                formConfig: {
                    placeholder: 'you@example.com',
                    helperText: 'We will never share your email'
                }
            },
            phone: {
                type: 'tel',
                label: 'Phone Number',
                formConfig: { placeholder: '+44 20 1234 5678' }
            },
            bio: {
                type: 'textarea',
                rows: 4,
                maxLength: 500,
                label: 'Biography',
                formConfig: {
                    span: 2,  // Full width
                    placeholder: 'Tell us about yourself...',
                    helperText: 'Maximum 500 characters'
                }
            },
            website: {
                type: 'url',
                label: 'Website',
                formConfig: {
                    placeholder: 'https://example.com',
                    hint: '(optional)'
                }
            },
            role: {
                type: 'select',
                required: true,
                options: ['Developer', 'Designer', 'Manager', 'Other'],
                label: 'Role',
                default: 'Developer'
            },
            newsletter: {
                type: 'boolean',
                label: 'Subscribe to newsletter',
                default: false,
                formConfig: { span: 2 }
            }
        }
    };
    // Initialize blueprint tabs - CREATE HTML FIRST!
    const tabItems = [
        { label: 'Contact', value: 'contact' },
        { label: 'Registration', value: 'registration' },
        { label: 'Settings', value: 'settings' },
        { label: 'Product (Grid)', value: 'product' },
        { label: 'User Profile (Grid)', value: 'userProfile' }
    ];
    // Build tabs HTML structure
    let tabsHTML = '<div class="tabs"><div class="tab-list" role="tablist">';
    tabItems.forEach((item, index) => {
        tabsHTML += `<button type="button" class="tab-item${index === 0 ? ' active' : ''}" role="tab" data-tab="${item.value}">${item.label}</button>`;
    });
    tabsHTML += '</div><div class="tabs-content">';
    tabItems.forEach((item, index) => {
        tabsHTML += `<div class="tab-panel${index === 0 ? ' active' : ''}" role="tabpanel" data-panel="${item.value}" id="tab-${item.value}"></div>`;
    });
    tabsHTML += '</div></div>';
    // Sanitize and insert HTML
    $(root).find('#blueprint-tabs').html(tabsHTML);
    // NOW initialize the tabs component
    const tabsInstance = E.tabs($(root).find('#blueprint-tabs .tabs').get(0), {
        animation: true,
        onChange: (e) => {
            const exampleKey = tabItems[e.index].value;
            showBlueprintExample(exampleKey);
        }
    });
    function showBlueprintExample(key) {
        const blueprint = blueprints[key];
        const container = $(root).find(`#tab-${key}`);

        // Escape JSON for safe HTML insertion
        const blueprintCode = JSON.stringify(blueprint, null, 2)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const html = `
            <div class="grid grid-cols-1 grid-cols-md-2 gap-4">
                <div>
                    <h4 class="font-semibold mb-2">Blueprint Code</h4>
                    <pre class="blueprint-code">${blueprintCode}</pre>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Generated Form</h4>
                    <div class="result-pane" id="form-${key}"></div>
                </div>
            </div>
        `;

        container.html(html);

        // Generate and render form - ONE-STEP API
        // Use grid layout for product and userProfile examples
        const formLayout = (key === 'product' || key === 'userProfile') ? 'grid' : 'stacked';
        const formColumns = 2;

        F.render(`#form-${key}`, blueprint, {}, {
            layout: formLayout,
            columns: formColumns,
            submitText: 'Submit',
            onSubmit: (data) => {
                E.toast('Form submitted successfully!', { type: 'success' });
                console.log('Submitted:', data);
            },
            onValidationError: (errors) => {
                E.toast('Please fix validation errors', { type: 'error' });
                console.error('Validation errors:', errors);
            }
        });
    }
    // Show first example
    showBlueprintExample('contact');
    return () => tabsInstance.destroy();
}
