/**
 * Try it: focus the picker, then use ArrowRight / ArrowLeft - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Accessibility demo ----
    const $a11yOutput = $(root).find('#a11y-output');
    E.chooser(root.querySelector('#a11y-demo'), {
            variant: 'card', columns: 3,
            options: [
                { value: 'small',  label: 'Small',  icon: 'minimize' },
                { value: 'medium', label: 'Medium', icon: 'square' },
                { value: 'large',  label: 'Large',  icon: 'maximize' }
            ],
            onChange: (v) => { $a11yOutput.text('value: ' + v); }
        });
}
