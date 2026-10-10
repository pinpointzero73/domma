/**
 * Simple Tag Selector - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const languages = [
            {value: 'js', label: 'JavaScript'},
            {value: 'ts', label: 'TypeScript'},
            {value: 'py', label: 'Python'},
            {value: 'java', label: 'Java'},
            {value: 'go', label: 'Go'},
            {value: 'rust', label: 'Rust'},
            {value: 'cpp', label: 'C++'},
            {value: 'csharp', label: 'C#'}
        ];
        // Quick Start
    E.pillbox(root.querySelector('#quick-pillbox'), {
            data: languages,
            value: ['js'],
            maxItems: 3
        });
}
