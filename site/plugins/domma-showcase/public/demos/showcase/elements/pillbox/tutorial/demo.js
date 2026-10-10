/**
 * Tutorial - from public/showcase/elements/pillbox.
 *
 * The recipient count is bound (data-bind-text), so onChange only sets an
 * observable. It is muted until the first change, as before.
 */
export function mount(root) {
    const contacts = [
        {value: 'alice@company.com', label: 'Alice Johnson'},
        {value: 'bob@company.com', label: 'Bob Smith'},
        {value: 'carol@company.com', label: 'Carol White'},
        {value: 'david@company.com', label: 'David Brown'},
        {value: 'eve@company.com', label: 'Eve Davis'}
    ];
    const count = M.observable(0);
    const changed = M.observable(false);
    const handle = M.applyBindings({count, changed}, root);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pillbox = E.pillbox(root.querySelector('#tutorial-pillbox'), {
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
            count.value = values.length;
            changed.value = true;
        },
        onValidationError: (error, value) => {
            E.toast(`Error: ${error} - "${value}"`);
        }
    });

    return () => {
        handle.dispose();
        pillbox?.destroy?.();
    };
}
