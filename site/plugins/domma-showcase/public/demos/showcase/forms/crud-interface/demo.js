/**
 * CRUD Interface - from public/showcase/forms.
 */
export function mount(root) {

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        copyCodeExample(this);
    });
}
