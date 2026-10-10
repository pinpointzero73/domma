/**
 * Theme awareness - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Theme demo ----
    const themeChooser = E.chooser(root.querySelector('#theme-demo'), {
            variant: 'card', columns: 3,
            options: [
                { value: 'auth',   label: 'Authentication', icon: 'lock',        description: 'Single sign-on' },
                { value: 'pay',    label: 'Payments',       icon: 'credit-card', description: 'Stripe-powered' },
                { value: 'mail',   label: 'Email',          icon: 'mail',        description: 'Transactional', badge: { text: 'NEW', type: 'success' } }
            ]
        });
    const $themeSel = $(root).find('#theme-select');
    const $variantSel = $(root).find('#theme-variant');
    const applyTheme = () => {
            if (Domma.theme && typeof Domma.theme.set === 'function') {
                Domma.theme.set($themeSel.val() + '-' + $variantSel.val());
            }
        };
    $themeSel.on('change', applyTheme);
    $variantSel.on('change', applyTheme);
}
