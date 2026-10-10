/**
 * Tutorial - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const contacts = [
            {value: 'alice@company.com', label: 'Alice Johnson'},
            {value: 'bob@company.com', label: 'Bob Smith'},
            {value: 'carol@company.com', label: 'Carol White'},
            {value: 'david@company.com', label: 'David Brown'},
            {value: 'eve@company.com', label: 'Eve Davis'}
        ];
        // Tutorial
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    E.pillbox(root.querySelector('#tutorial-pillbox'), {
            data: contacts,
            creatable: true,
            duplicates: false,
            maxItems: 10,
            validatePill: (email) => {
                if (!emailRegex.test(email)) {
                    return 'Invalid email address';
                }
                return true;
            },
            onChange: (values) => {
                $(root).find('#tutorial-result')[0].innerHTML =
                  `<p class="pillbox-p-text-sm">${values.length} recipient(s) selected</p>`;
            },
            onValidationError: (error, value) => {
                E.toast(`Error: ${error} - "${value}"`);
            }
        });
}
