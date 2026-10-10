/**
 * Tutorial - from public/showcase/elements/forms.
 */
export function mount(root) {
    $(root).find('#tutorial-form').on('submit', (e) => {
        e.preventDefault();

        // Clear previous validation
        $('.form-group').removeClass('has-error has-success');

        let isValid = true;

        // Validate name
        const $name = $(root).find('#name');
        if ($name.val().length < 2) {
            $name.closest('.form-group').addClass('has-error');
            isValid = false;
        } else {
            $name.closest('.form-group').addClass('has-success');
        }

        // Validate email
        const $email = $(root).find('#email');
        if (!$email.val().includes('@')) {
            $email.closest('.form-group').addClass('has-error');
            isValid = false;
        } else {
            $email.closest('.form-group').addClass('has-success');
        }

        // Validate password
        const $password = $(root).find('#password');
        if ($password.val().length < 8) {
            $password.closest('.form-group').addClass('has-error');
            isValid = false;
        } else {
            $password.closest('.form-group').addClass('has-success');
        }

        // Validate account type
        const $accountType = $(root).find('#account-type');
        if (!$accountType.val()) {
            $accountType.closest('.form-group').addClass('has-error');
            isValid = false;
        } else {
            $accountType.closest('.form-group').addClass('has-success');
        }

        // Validate terms
        const $terms = $(root).find('#terms');
        if (!$terms.prop('checked')) {
            $terms.closest('.form-group').addClass('has-error');
            isValid = false;
        } else {
            $terms.closest('.form-group').addClass('has-success');
        }

        // Show result
        if (isValid) {
            $(root).find('#tutorial-result').html('<p class="text-success">✓ Form submitted successfully!</p>');
        } else {
            $(root).find('#tutorial-result').html('<p class="text-danger">✗ Please fix the errors above</p>');
        }
    });
}
