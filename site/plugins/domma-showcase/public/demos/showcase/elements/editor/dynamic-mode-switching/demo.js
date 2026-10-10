/**
 * Dynamic Mode Switching - from public/showcase/elements/editor.
 */
export function mount(root) {
        // Switchable Editor Demo
    let switchableEditor = E.editor(root.querySelector('#switchable-editor'), {
            mode: 'text',
            placeholder: 'Try switching modes...',
            minHeight: 200
        });
    window.switchMode = function (mode) {
            switchableEditor.setMode(mode);

            // Update button states
            $('.mode-switcher button').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
            });
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        switchMode('text');
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        switchMode('rich');
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        switchMode('code');
    });
}
