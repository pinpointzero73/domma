/**
 * 16. Autocomplete & Pillbox - from public/showcase/themes.
 */
export function mount(root) {
    E.autocomplete(root.querySelector('#audit-autocomplete'), {
        data: ['United Kingdom', 'United States', 'France', 'Germany', 'Spain', 'Italy', 'Japan', 'Australia', 'Brazil', 'Canada', 'Norway', 'Sweden', 'Denmark', 'Finland', 'Netherlands'],
        minChars: 1,
        maxResults: 8
      });
    E.pillbox(root.querySelector('#audit-pillbox'), {
        data: ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Domma', 'Node.js', 'PHP', 'Python', 'Rust', 'Go'],
        value: ['JavaScript', 'Domma'],
        creatable: true,
        placeholder: 'Add a tag…'
      });
}
