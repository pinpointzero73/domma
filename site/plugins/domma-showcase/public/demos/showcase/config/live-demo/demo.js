/**
 * Live Demo - from public/showcase/config.
 */
export function mount(root) {
        // Demo: Live form
    $.setup({
            '#live-email': {
                events: {
                    blur: (e, $el) => {
                        const val = $el.val();
                        if (val) {
                            const valid = val.includes('@');
                            $el.removeClass('success error warning')
                                .addClass(valid ? 'success' : 'error');
                        }
                    },
                    input: (e, $el) => {
                        $el.removeClass('success error warning');
                    }
                }
            },
            '#live-form': {
                events: {
                    submit: (e, $form) => {
                        e.preventDefault();
                        const $btn = $(root).find('#live-submit');

                      // Show loading state
                        $btn.text('Sending...').attr('disabled', true);

                      // Simulate API call
                        setTimeout(() => {
                          // Show success toast
                          E.toast('Message sent successfully!', {
                            type: 'success',
                            duration: 3000
                          });

                          // Reset form and button
                          $form[0].reset();
                          $form.find('input').removeClass('success error');
                          $btn.text('Send Message').attr('disabled', false);
                        }, 1000);
                    }
                }
            }
        });
}
