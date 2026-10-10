/**
 * Inside a form (F.create) - from public/showcase/elements/chooser.
 */
export function mount(root) {
        // ---- Inside a form demo ----
    const form = Domma.forms.create({
            plan: {
                type: 'chooser',
                variant: 'card',
                columns: 3,
                label: 'Choose your plan',
                required: true,
                options: [
                    { value: 'starter', label: 'Starter', icon: 'rocket', description: 'For solo builders.' },
                    { value: 'pro', label: 'Pro', icon: 'zap', description: 'Teams up to 10.', recommended: true,
                      badge: { text: 'POPULAR', type: 'success' } },
                    { value: 'ent', label: 'Enterprise', icon: 'briefcase', description: 'Custom limits + SSO.' }
                ]
            },
            addons: {
                type: 'chooser',
                variant: 'chip',
                multiple: true,
                label: 'Optional add-ons',
                options: [
                    { value: 'sso',   label: 'SSO',        icon: 'lock' },
                    { value: 'audit', label: 'Audit log',  icon: 'file-text' },
                    { value: 'sla',   label: '24/7 SLA',   icon: 'phone' }
                ]
            }
        });
    form.renderTo('#form-demo-host');
    const $formContainer = $(root).find('#form-demo-host');
    const $formOutput = $(root).find('#form-demo-output');
    $formContainer.on('submit', (e) => {
            e.preventDefault();
            if (!form.validate()) {
                $formOutput.text('Validation failed - Plan is required.');
                return;
            }
            $formOutput.text(JSON.stringify(form.getData(), null, 2));
        });
        // Add a submit button (Forma renders one by default - check if so; otherwise add)
    if (!$formContainer.find('button[type="submit"]').length) {
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'btn btn-primary';
            submitBtn.textContent = 'Submit';
            const formEl = formContainer.querySelector('form');
            if (formEl) formEl.appendChild(submitBtn);
        }
}
