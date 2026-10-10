/**
 * Blueprint → Reactive Model - from public/showcase/blueprints.
 */
export function mount(root) {
    // Reactive Model Demo
    const userBlueprint = {
        name: { type: 'string', required: true, minLength: 2 },
        email: { type: 'email', required: true },
        age: { type: 'number', min: 0, max: 120 }
    };
    const userModel = M.create(userBlueprint, {
        name: 'Alice',
        email: 'alice@example.com',
        age: 30
    });
    let changeLog = [];
    // Update state display
    function updateModelState() {
        $(root).find('#model-state-display').text(JSON.stringify(userModel.toJSON(), null, 2));
    }
    // Manual binding - M.bind() doesn't work with standard HTML inputs
    $(root).find('#model-name').on('input', function() {
        try {
            userModel.set('name', $(this).val());
        } catch (error) {
            console.warn('Validation error (name):', error.message);
        }
    });
    $(root).find('#model-email').on('input', function() {
        try {
            userModel.set('email', $(this).val());
        } catch (error) {
            console.warn('Validation error (email):', error.message);
        }
    });
    $(root).find('#model-age').on('input', function() {
        try {
            const value = $(this).val();
            userModel.set('age', value === '' ? null : parseInt(value, 10));
        } catch (error) {
            console.warn('Validation error (age):', error.message);
        }
    });
    // Listen for changes
    userModel.onChange((event) => {
        changeLog.push(`${event.field}: ${event.oldValue} → ${event.newValue}`);
        $(root).find('#model-change-log').text(changeLog.join('\n'));
        updateModelState();

        // Update input if changed programmatically
        if (event.field === 'name') $(root).find('#model-name').val(event.newValue);
        if (event.field === 'email') $(root).find('#model-email').val(event.newValue);
        if (event.field === 'age') $(root).find('#model-age').val(event.newValue);
    });
    updateModelState();
    // Validate button
    $(root).find('#validate-model').on('click', () => {
        const errors = userModel.validate();

        // Display validation result
        if (errors && errors.length > 0) {
            $(root).find('#validation-display').text(JSON.stringify(errors, null, 2));
            $(root).find('#validation-result').show();
            E.toast('Validation errors found', { type: 'error' });
        } else {
            $(root).find('#validation-display').text('✓ All fields are valid');
            $(root).find('#validation-result').show();
            E.toast('All fields valid!', { type: 'success' });
        }
    });
    // Reset button
    $(root).find('#reset-model').on('click', () => {
        userModel.reset();
        changeLog = [];
        $(root).find('#model-change-log').text('No changes yet');
        $(root).find('#validation-result').hide();
        updateModelState();
    });
}
