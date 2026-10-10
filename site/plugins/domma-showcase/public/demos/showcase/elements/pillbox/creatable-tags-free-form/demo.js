/**
 * Example 1: Creatable Tags (Free-Form) - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const skills = ['JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL'];
        // Creatable Example
    E.pillbox(root.querySelector('#creatable-pillbox'), {
            data: skills,
            creatable: true,
            searchable: true,
            duplicates: false
        });
}
