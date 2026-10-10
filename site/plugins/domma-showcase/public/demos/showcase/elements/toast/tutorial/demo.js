/**
 * Tutorial - from public/showcase/elements/toast.
 */
export function mount(root) {
        // Tutorial
    $(root).find('#tutorial-submit').on('click', () => {
          const email = $(root).find('#tutorial-email').val();
          const password = $(root).find('#tutorial-password').val();

            if (!email) {
                E.toast('Email is required', {
                    type: 'error',
                    duration: 3000
                });
                return;
            }

            if (password.length < 8) {
                E.toast('Password must be at least 8 characters', {
                    type: 'warning',
                    duration: 4000
                });
                return;
            }

            E.toast('Account created successfully!', {
                type: 'success',
                duration: 5000
            });
        });
}
