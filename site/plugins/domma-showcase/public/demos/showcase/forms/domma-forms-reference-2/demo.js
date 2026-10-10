/**
 * Domma Forms Reference - from public/showcase/forms.
 */
export function mount(root) {

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        copyToClipboard('string');
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        copyToClipboard('email');
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        copyToClipboard('password');
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        copyToClipboard('number');
    });
    $(root).find('[data-action="5"]').on('click', function (event) {
        copyToClipboard('boolean');
    });
    $(root).find('[data-action="6"]').on('click', function (event) {
        copyToClipboard('textarea');
    });
    $(root).find('[data-action="7"]').on('click', function (event) {
        copyToClipboard('select');
    });
    $(root).find('[data-action="8"]').on('click', function (event) {
        copyToClipboard('radio');
    });
    $(root).find('[data-action="9"]').on('click', function (event) {
        copyToClipboard('checkbox-group');
    });
    $(root).find('[data-action="10"]').on('click', function (event) {
        copyToClipboard('file');
    });
    $(root).find('[data-action="11"]').on('click', function (event) {
        copyToClipboard('date');
    });
    $(root).find('[data-action="12"]').on('click', function (event) {
        copyToClipboard('datetime');
    });
}
