/**
 * Example 1: Async Data Source (Simulated API) - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const languages = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
            'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala'
        ];
        // Async Example
    E.autocomplete(root.querySelector('#async-autocomplete'), {
            dataSource: async (query) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                return languages.filter(lang =>
                    lang.toLowerCase().includes(query.toLowerCase())
                );
            },
            debounce: 300,
            minChars: 2,
            loadingMessage: 'Searching languages...'
        });
}
