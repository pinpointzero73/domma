/**
 * Example 4: Clear on Select - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const tags = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Remix'];
        // Clear on Select
    const selectedTags = [];
    E.autocomplete(root.querySelector('#clear-on-select'), {
            data: tags,
            clearOnSelect: true,
            onSelect: (tag) => {
                if (!selectedTags.includes(tag)) {
                    selectedTags.push(tag);
                    renderTags();
                }
            }
        });
    function renderTags() {
            $(root).find('#selected-tags')[0].innerHTML =
                selectedTags.map(tag =>
                    `<span class="badge">${tag} <button onclick="removeTag('${tag}')" class="ml-1 bg-none border-none cursor-pointer">&times;</button></span>`
                ).join('');
        }
    function removeTag(tag) {
            const index = selectedTags.indexOf(tag);
            if (index > -1) {
                selectedTags.splice(index, 1);
                renderTags();
            }
        }
}
