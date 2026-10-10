/**
 * The four matrix combinations - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Matrix ----
    E.chooser(root.querySelector('#matrix-card-single'), {
            variant: 'card',
            columns: 2,
            options: [
                { value: 'starter', label: 'Starter', icon: 'rocket', description: 'For solo builders.' },
                { value: 'pro', label: 'Pro', icon: 'zap', description: 'Teams up to 10.' }
            ]
        });
    E.chooser(root.querySelector('#matrix-card-multi'), {
            variant: 'card',
            multiple: true,
            columns: 2,
            options: [
                { value: 'auth', label: 'Auth', icon: 'lock', description: 'OAuth + 2FA' },
                { value: 'pay', label: 'Payments', icon: 'credit-card', description: 'Stripe + invoices' }
            ]
        });
    E.chooser(root.querySelector('#matrix-chip-single'), {
            variant: 'chip',
            options: [
                { value: 'js', label: 'JavaScript', icon: 'code' },
                { value: 'ts', label: 'TypeScript', icon: 'type' },
                { value: 'rust', label: 'Rust', icon: 'package' }
            ]
        });
    E.chooser(root.querySelector('#matrix-chip-multi'), {
            variant: 'chip',
            multiple: true,
            options: [
                { value: 'react', label: 'React', icon: 'box' },
                { value: 'vue', label: 'Vue', icon: 'box' },
                { value: 'svelte', label: 'Svelte', icon: 'box' },
                { value: 'solid', label: 'Solid', icon: 'box' }
            ]
        });
        // Init tooltips on any data-tooltip elements
    if (E.tooltip) {
            $('[data-tooltip]').each((i, el) => E.tooltip(el, { trigger: 'hover', position: 'top' }));
        }
}
