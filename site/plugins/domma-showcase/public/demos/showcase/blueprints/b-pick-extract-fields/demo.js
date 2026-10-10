/**
 * B.pick() - Extract Fields - from public/showcase/blueprints.
 */
export function mount(root) {
    $(root).find('#pick-demo').on('click', () => {
        const full = {
            name: { type: 'string' },
            email: { type: 'email' },
            age: { type: 'number' },
            role: { type: 'string' }
        };
        const result = B.pick(full, ['name', 'email']);
        $(root).find('#pick-result-code').text(JSON.stringify(result, null, 2));
        $(root).find('#pick-result').show();
    });
}
