/**
 * Step 4: Try It Out - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const countries = [
            {value: 'us', label: '\ud83c\uddfa\ud83c\uddf8 United States'},
            {value: 'uk', label: '\ud83c\uddec\ud83c\udde7 United Kingdom'},
            {value: 'ca', label: '\ud83c\udde8\ud83c\udde6 Canada'},
            {value: 'au', label: '\ud83c\udde6\ud83c\uddfa Australia'},
            {value: 'de', label: '\ud83c\udde9\ud83c\uddea Germany'},
            {value: 'fr', label: '\ud83c\uddeb\ud83c\uddf7 France'},
            {value: 'jp', label: '\ud83c\uddef\ud83c\uddf5 Japan'},
            {value: 'cn', label: '\ud83c\udde8\ud83c\uddf3 China'},
            {value: 'in', label: '\ud83c\uddee\ud83c\uddf3 India'},
            {value: 'br', label: '\ud83c\udde7\ud83c\uddf7 Brazil'}
        ];
        // Tutorial
    E.autocomplete(root.querySelector('#tutorial-autocomplete'), {
            data: countries,
            minChars: 1,
            highlightMatches: true,
            onSelect: (country) => {
                $(root).find('#tutorial-result')[0].innerHTML = `
                    <p class="text-sm"><strong>Selected:</strong> ${country.label}</p>
                    <p class="text-sm"><strong>Country Code:</strong> ${country.value}</p>
                `;
            }
        });
}
