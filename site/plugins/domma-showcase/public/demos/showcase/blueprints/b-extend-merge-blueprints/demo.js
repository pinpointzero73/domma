/**
 * B.extend() - Merge Blueprints - from public/showcase/blueprints.
 */
export function mount(root) {
    // Composition demos
    $(root).find('#extend-demo').on('click', () => {
        const base = { name: { type: 'string' }, email: { type: 'email' } };
        const extended = { email: { required: true }, age: { type: 'number' } };
        const result = B.extend(base, extended);
        $(root).find('#extend-result-code').text(JSON.stringify(result, null, 2));
        $(root).find('#extend-result').show();
    });
}
