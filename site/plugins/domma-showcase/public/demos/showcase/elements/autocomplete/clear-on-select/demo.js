/**
 * Example 4: Clear on Select - from public/showcase/elements/autocomplete.
 *
 * Picked tags live in an observable list rendered by data-each, so the
 * remove button is a bound handler rather than an inline onclick string.
 */
export function mount(root) {
    const tags = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Remix'];
    // Clear on Select
    const selectedTags = M.observable([]);
    const ac = E.autocomplete(root.querySelector('#clear-on-select'), {
        data: tags,
        clearOnSelect: true,
        onSelect: (tag) => {
            if (!selectedTags.value.some(t => t.name === tag)) {
                selectedTags.value = [...selectedTags.value, {name: tag}];
            }
        }
    });
    const handle = M.applyBindings({
        selectedTags,
        removeTag: (tag) => { selectedTags.value = selectedTags.value.filter(t => t !== tag); }
    }, root);
    return () => {
        handle.dispose();
        ac?.destroy?.();
    };
}
