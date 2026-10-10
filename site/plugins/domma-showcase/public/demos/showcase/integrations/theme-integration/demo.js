/**
 * Theme Integration - from public/showcase/integrations.
 */
export function mount(root) {
        // Theme Demo
    $('[data-theme]').on('click', function() {
            const theme = $(this).attr('data-theme');
            const variant = $(this).attr('data-variant');

            if (theme === 'reset') {
                Domma.theme.set('light');
                Domma.theme.setVariant('');
                E.toast('Theme reset to Light', { type: 'success' });
            } else {
                Domma.theme.set(theme);
                Domma.theme.setVariant(variant || '');

                const themeName = variant ? _.capitalize(variant) : _.capitalize(theme);
                E.toast(`Theme changed to ${themeName}`, { type: 'success' });
            }
        });
}
