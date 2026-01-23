/**
 * User Blueprint
 *
 * Common user fields for profiles, accounts, and authentication.
 * Includes basic user information with validation.
 *
 * Usage:
 *   import { userBlueprint } from './blueprints/common/user.js';
 *   F.render('#form', userBlueprint);
 *   const user = M.create(userBlueprint, initialData);
 */

export const userBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 100,
        label: 'Full Name',
        formConfig: {
            placeholder: 'John Doe',
            tooltip: 'Enter your first and last name'
        }
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        formConfig: {
            placeholder: 'you@example.com',
            tooltip: 'We\'ll never share your email'
        }
    },
    username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_]+$/,
        label: 'Username',
        formConfig: {
            placeholder: 'johndoe',
            tooltip: 'Letters, numbers, and underscores only'
        }
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        label: 'Password',
        formConfig: {
            tooltip: 'Min 8 chars: uppercase, lowercase, number, and special character'
        }
    },
    phone: {
        type: 'string',
        pattern: /^\+?[\d\s\-()]+$/,
        label: 'Phone Number',
        formConfig: {
            placeholder: '+1 (555) 123-4567',
            tooltip: 'Optional: Include country code'
        }
    },
    bio: {
        type: 'textarea',
        maxLength: 500,
        rows: 4,
        label: 'Biography',
        formConfig: {
            placeholder: 'Tell us about yourself...',
            tooltip: 'A brief description (max 500 characters)'
        }
    },
    avatar: {
        type: 'url',
        label: 'Avatar URL',
        formConfig: {
            placeholder: 'https://example.com/avatar.jpg',
            tooltip: 'URL to your profile picture'
        }
    },
    role: {
        type: 'select',
        options: [
            { value: 'user', label: 'User' },
            { value: 'moderator', label: 'Moderator' },
            { value: 'admin', label: 'Administrator' }
        ],
        label: 'Role',
        formConfig: {
            tooltip: 'User permission level'
        }
    },
    active: {
        type: 'boolean',
        label: 'Active Account',
        formConfig: {
            tooltip: 'Enable or disable this account'
        }
    }
};

/**
 * Minimal user fields for public profiles
 * Omits sensitive data like email and password
 */
export const publicUserBlueprint = {
    name: userBlueprint.name,
    username: userBlueprint.username,
    bio: userBlueprint.bio,
    avatar: userBlueprint.avatar
};

/**
 * User essentials for listings/tables
 * Includes only the most important fields
 */
export const userEssentialsBlueprint = {
    name: userBlueprint.name,
    email: userBlueprint.email,
    role: userBlueprint.role,
    active: userBlueprint.active
};
