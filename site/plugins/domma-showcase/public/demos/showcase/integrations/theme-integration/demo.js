/**
 * Theme Integration - from public/showcase/integrations.
 */
export function mount(root) {
        // Theme Demo
    $('[data-theme]').on('click', function() {
            const theme = $(this).attr('data-theme');
            const variant = $(this).attr('data-variant');

            if (theme === 'reset') {
                Domma.theme.set('ocean-light');
                E.toast('Theme reset to Light', { type: 'success' });
            } else {
                Domma.theme.set(`${variant || 'ocean'}-${theme}`);

                const themeName = variant ? _.capitalize(variant) : _.capitalize(theme);
                E.toast(`Theme changed to ${themeName}`, { type: 'success' });
            }
        });
}
