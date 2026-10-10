/**
 * B.omit() - Remove Fields - from public/showcase/blueprints.
 */
export function mount(root) {
    $(root).find('#omit-demo').on('click', () => {
        const admin = {
            name: { type: 'string' },
            email: { type: 'email' },
            role: { type: 'string' },
            permissions: { type: 'array' }
        };
        const result = B.omit(admin, ['permissions']);
        $(root).find('#omit-result-code').text(JSON.stringify(result, null, 2));
        $(root).find('#omit-result').show();
    });
}
