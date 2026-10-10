/**
 * Live binding - one value, three places.
 *
 * The markup says what each part shows (data-model, data-bind-text); the
 * greeting is a computed, so it can never disagree with the name it is made
 * from. M.applyBindings keeps the page true; dispose() undoes it.
 */
export function mount(root) {
    const name = M.observable('Guest');
    const greeting = M.computed(() => `Hello, ${name.value.trim() || 'Guest'}!`);

    const handle = M.applyBindings({name, greeting}, root, {
        methods: {
            reset: () => { name.value = 'Guest'; }
        }
    });
    return () => handle.dispose();
}
