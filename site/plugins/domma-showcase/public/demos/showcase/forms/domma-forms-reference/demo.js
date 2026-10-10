/**
 * Domma Forms Reference - from public/showcase/forms.
 */
export function mount(root) {
            // Copy functionality for reference guide
    async function copyToClipboard(text) {
              try {
                await navigator.clipboard.writeText(text);
                // Show brief success indicator
                E.toast('Copied to clipboard!', {type: 'success', duration: 2000});
              } catch (err) {
                console.error('Failed to copy:', err);
                E.toast('Failed to copy', {type: 'error', duration: 2000});
              }
            };
    function copyCodeExample(button) {
              const codeBlock = button.nextElementSibling.querySelector('code') ||
                button.nextElementSibling;
              const text = codeBlock.textContent;
              copyToClipboard(text);
            };

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
    $(root).find('[data-action="13"]').on('click', function (event) {
        copyToClipboard('required: true');
    });
    $(root).find('[data-action="14"]').on('click', function (event) {
        copyToClipboard('minLength: 3');
    });
    $(root).find('[data-action="15"]').on('click', function (event) {
        copyToClipboard('maxLength: 100');
    });
    $(root).find('[data-action="16"]').on('click', function (event) {
        copyToClipboard('min: 0, max: 100');
    });
    $(root).find('[data-action="17"]').on('click', function (event) {
        copyToClipboard('pattern: /^[A-Za-z]+$/');
    });
    $(root).find('[data-action="18"]').on('click', function (event) {
        copyToClipboard('validate: (value) => value !== \'test\'');
    });
    $(root).find('[data-action="19"]').on('click', function (event) {
        copyToClipboard('layout: \'stacked\'');
    });
    $(root).find('[data-action="20"]').on('click', function (event) {
        copyToClipboard('layout: \'grid\'');
    });
    $(root).find('[data-action="21"]').on('click', function (event) {
        copyToClipboard('layout: \'inline\'');
    });
    $(root).find('[data-action="22"]').on('click', function (event) {
        copyToClipboard('columns: 2');
    });
    $(root).find('[data-action="23"]').on('click', function (event) {
        copyToClipboard('submitText: \'Save Changes\'');
    });
    $(root).find('[data-action="24"]').on('click', function (event) {
        copyToClipboard('showSubmitButton: false');
    });
    $(root).find('[data-action="25"]').on('click', function (event) {
        copyToClipboard('formConfig: { placeholder: \'Enter text...\' }');
    });
    $(root).find('[data-action="26"]').on('click', function (event) {
        copyToClipboard('formConfig: { helperText: \'This helps you\' }');
    });
    $(root).find('[data-action="27"]').on('click', function (event) {
        copyToClipboard('formConfig: { hint: \'Required field\' }');
    });
    $(root).find('[data-action="28"]').on('click', function (event) {
        copyToClipboard('formConfig: { disabled: true }');
    });
    $(root).find('[data-action="29"]').on('click', function (event) {
        copyToClipboard('formConfig: { readonly: true }');
    });
    $(root).find('[data-action="30"]').on('click', function (event) {
        copyToClipboard('formConfig: { span: 2 }');
    });
    $(root).find('[data-action="31"]').on('click', function (event) {
        copyToClipboard('const html = form.render();');
    });
    $(root).find('[data-action="32"]').on('click', function (event) {
        copyToClipboard('form.renderTo(\'#container\');');
    });
    $(root).find('[data-action="33"]').on('click', function (event) {
        copyToClipboard('const isValid = form.validate();');
    });
    $(root).find('[data-action="34"]').on('click', function (event) {
        copyToClipboard('const data = form.getFormData();');
    });
    $(root).find('[data-action="35"]').on('click', function (event) {
        copyToClipboard('form.setData(newData);');
    });
    $(root).find('[data-action="36"]').on('click', function (event) {
        copyToClipboard('form.reset();');
    });
    $(root).find('[data-action="37"]').on('click', function (event) {
        copyToClipboard('onSubmit: (data) => console.log(data)');
    });
    $(root).find('[data-action="38"]').on('click', function (event) {
        copyToClipboard('onValidationError: (errors) => console.error(errors)');
    });
    $(root).find('[data-action="39"]').on('click', function (event) {
        copyToClipboard('onChange: (data) => console.log(data)');
    });
    $(root).find('[data-action="40"]').on('click', function (event) {
        copyToClipboard('onError: (error) => console.error(error)');
    });
    $(root).find('[data-action="41"]').on('click', function (event) {
        copyToClipboard('onSave: async (data) => await api.save(data)');
    });
    $(root).find('[data-action="42"]').on('click', function (event) {
        copyToClipboard('onComplete: (data) => console.log(\'Completed:\', data)');
    });
}
