/**
 * Login Blueprint
 *
 * Standard authentication form with email/username and password.
 * Includes "remember me" and forgot password support.
 *
 * Usage:
 *   import { loginBlueprint } from './blueprints/forms/login.js';
 *
 *   // Render as form
 *   F.render('#login-form', loginBlueprint, {}, {
 *       layout: 'stacked',
 *       submitText: 'Sign In',
 *       onSubmit: async (data) => {
 *           const response = await H.post('/api/login', data);
 *           S.set('authToken', response.token);
 *           window.location.href = '/dashboard';
 *       }
 *   });
 *
 *   // Or as modal
 *   F.modal(loginBlueprint, {
 *       title: 'Sign In',
 *       submitText: 'Login',
 *       onSave: handleLogin
 *   });
 */

export const loginBlueprint = {
    identifier: {
        type: 'string',
        required: true,
        minLength: 3,
        label: 'Email or Username',
        formConfig: {
            placeholder: 'you@example.com or username',
            tooltip: 'Enter your email address or username',
            class: 'form-input-lg',
            autocomplete: 'username'
        }
    },
    password: {
        type: 'password',
        required: true,
        minLength: 1,
        label: 'Password',
        formConfig: {
            placeholder: '••••••••',
            tooltip: 'Enter your password',
            class: 'form-input-lg',
            autocomplete: 'current-password'
        }
    },
    rememberMe: {
        type: 'boolean',
        label: 'Remember me',
        formConfig: {
            tooltip: 'Stay logged in for 30 days'
        }
    }
};

/**
 * Email-only login (no username)
 */
export const emailLoginBlueprint = {
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        formConfig: {
            placeholder: 'you@example.com',
            tooltip: 'Enter your email address',
            class: 'form-input-lg',
            autocomplete: 'email'
        }
    },
    password: loginBlueprint.password,
    rememberMe: loginBlueprint.rememberMe
};

/**
 * Two-factor authentication blueprint
 * Extended login with 2FA code field
 */
export const twoFactorLoginBlueprint = {
    ...loginBlueprint,
    twoFactorCode: {
        type: 'string',
        required: true,
        minLength: 6,
        maxLength: 6,
        pattern: /^\d{6}$/,
        label: 'Two-Factor Code',
        formConfig: {
            placeholder: '000000',
            tooltip: 'Enter the 6-digit code from your authenticator app',
            class: 'form-input-lg text-center'
        }
    }
};

/**
 * Forgot password blueprint
 * Simple form to request password reset
 */
export const forgotPasswordBlueprint = {
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        formConfig: {
            placeholder: 'you@example.com',
            tooltip: 'We\'ll send a password reset link to this email',
            class: 'form-input-lg'
        }
    }
};

/**
 * Reset password blueprint
 * Form to set new password with token
 */
export const resetPasswordBlueprint = {
    token: {
        type: 'string',
        required: true,
        label: 'Reset Token',
        formConfig: {
            placeholder: 'Token from email',
            tooltip: 'Enter the reset token from your email',
            readonly: true  // Usually pre-filled from URL
        }
    },
    newPassword: {
        type: 'password',
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        label: 'New Password',
        formConfig: {
            placeholder: '••••••••',
            tooltip: 'Min 8 characters with uppercase, lowercase, number, and special character',
            class: 'form-input-lg'
        }
    },
    confirmPassword: {
        type: 'password',
        required: true,
        custom: (value, allData) => {
            if (value !== allData.newPassword) {
                return 'Passwords do not match';
            }
        },
        label: 'Confirm New Password',
        formConfig: {
            placeholder: '••••••••',
            tooltip: 'Re-enter your new password to confirm',
            class: 'form-input-lg'
        }
    }
};

/**
 * Example usage with complete login flow
 */
export function createLoginForm(selector, options = {}) {
    const defaultOptions = {
        layout: 'stacked',
        submitText: 'Sign In',
        onSubmit: async (data) => {
            try {
                // Show loading state
                const loader = E.loader(selector, {
                    type: 'spinner',
                    overlay: true,
                    text: 'Signing in...'
                });
                loader.show();

                // Authenticate
                const response = await H.post('/api/login', {
                    identifier: data.identifier,
                    password: data.password,
                    rememberMe: data.rememberMe || false
                });

                // Store auth token
                if (response.token) {
                    S.set('authToken', response.token);
                    S.set('user', response.user);
                }

                // Success feedback
                E.toast('Welcome back!', { type: 'success' });

                // Redirect or callback
                if (options.onSuccess) {
                    options.onSuccess(response);
                } else {
                    // Default: redirect to dashboard
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                }

                loader.hide();
            } catch (error) {
                // Handle errors
                if (error.status === 401) {
                    E.toast('Invalid credentials. Please try again.', { type: 'danger' });
                } else if (error.status === 429) {
                    E.toast('Too many attempts. Please try again later.', { type: 'warning' });
                } else {
                    E.toast('Login failed. Please try again.', { type: 'danger' });
                }

                console.error('Login error:', error);

                if (options.onError) {
                    options.onError(error);
                }
            }
        }
    };

    return F.render(selector, loginBlueprint, {}, {
        ...defaultOptions,
        ...options
    });
}

/**
 * Example usage for forgot password
 */
export function createForgotPasswordForm(selector, options = {}) {
    return F.render(selector, forgotPasswordBlueprint, {}, {
        layout: 'stacked',
        submitText: 'Send Reset Link',
        onSubmit: async (data) => {
            try {
                await H.post('/api/forgot-password', data);
                E.toast('Password reset email sent!', { type: 'success' });

                if (options.onSuccess) {
                    options.onSuccess();
                }
            } catch (error) {
                E.toast('Failed to send reset email.', { type: 'danger' });

                if (options.onError) {
                    options.onError(error);
                }
            }
        },
        ...options
    });
}

/**
 * Example usage for reset password
 */
export function createResetPasswordForm(selector, token, options = {}) {
    return F.render(selector, resetPasswordBlueprint, { token }, {
        layout: 'stacked',
        submitText: 'Reset Password',
        onSubmit: async (data) => {
            try {
                const { confirmPassword, ...resetData } = data;
                await H.post('/api/reset-password', resetData);

                E.toast('Password reset successfully!', { type: 'success' });

                if (options.onSuccess) {
                    options.onSuccess();
                } else {
                    // Redirect to login
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                }
            } catch (error) {
                E.toast('Failed to reset password.', { type: 'danger' });

                if (options.onError) {
                    options.onError(error);
                }
            }
        },
        ...options
    });
}
