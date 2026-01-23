/**
 * Settings Blueprint
 *
 * Application settings and preferences.
 * Designed for user preferences, configurations, and options.
 *
 * Usage:
 *   import { settingsBlueprint } from './blueprints/common/settings.js';
 *   const settings = M.create(settingsBlueprint, {}, { persist: 'app-settings' });
 *   M.bind(settings, 'theme', '#theme-select');
 */

export const settingsBlueprint = {
    // Appearance Settings
    theme: {
        type: 'select',
        options: [
            { value: 'light', label: 'Light Theme' },
            { value: 'dark', label: 'Dark Theme' },
            { value: 'auto', label: 'Auto (System)' }
        ],
        label: 'Theme',
        formConfig: {
            tooltip: 'Choose your preferred color scheme'
        }
    },
    fontSize: {
        type: 'select',
        options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
        ],
        label: 'Font Size',
        formConfig: {
            tooltip: 'Adjust text size for readability'
        }
    },
    compactMode: {
        type: 'boolean',
        label: 'Compact Mode',
        formConfig: {
            tooltip: 'Reduce spacing for more content on screen'
        }
    },

    // Notification Settings
    notifications: {
        type: 'boolean',
        label: 'Enable Notifications',
        formConfig: {
            tooltip: 'Allow browser notifications'
        }
    },
    emailNotifications: {
        type: 'boolean',
        label: 'Email Notifications',
        formConfig: {
            tooltip: 'Receive updates via email'
        }
    },
    notificationSound: {
        type: 'boolean',
        label: 'Notification Sound',
        formConfig: {
            tooltip: 'Play sound when notifications appear'
        }
    },

    // Privacy Settings
    showOnlineStatus: {
        type: 'boolean',
        label: 'Show Online Status',
        formConfig: {
            tooltip: 'Let others see when you\'re online'
        }
    },
    showProfile: {
        type: 'boolean',
        label: 'Public Profile',
        formConfig: {
            tooltip: 'Make your profile visible to others'
        }
    },
    allowMessages: {
        type: 'select',
        options: [
            { value: 'everyone', label: 'Everyone' },
            { value: 'contacts', label: 'Contacts Only' },
            { value: 'none', label: 'No One' }
        ],
        label: 'Who Can Message You',
        formConfig: {
            tooltip: 'Control who can send you messages'
        }
    },

    // Regional Settings
    language: {
        type: 'select',
        options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'it', label: 'Italiano' },
            { value: 'pt', label: 'Português' }
        ],
        label: 'Language',
        formConfig: {
            tooltip: 'Choose your preferred language'
        }
    },
    timezone: {
        type: 'select',
        options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'America/New_York', label: 'Eastern Time (US)' },
            { value: 'America/Chicago', label: 'Central Time (US)' },
            { value: 'America/Denver', label: 'Mountain Time (US)' },
            { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
            { value: 'Europe/London', label: 'London' },
            { value: 'Europe/Paris', label: 'Paris' },
            { value: 'Asia/Tokyo', label: 'Tokyo' }
        ],
        label: 'Timezone',
        formConfig: {
            tooltip: 'Select your local timezone'
        }
    },
    dateFormat: {
        type: 'select',
        options: [
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
        ],
        label: 'Date Format',
        formConfig: {
            tooltip: 'How dates should be displayed'
        }
    },

    // Advanced Settings
    autoSave: {
        type: 'boolean',
        label: 'Auto-Save',
        formConfig: {
            tooltip: 'Automatically save changes'
        }
    },
    confirmations: {
        type: 'boolean',
        label: 'Show Confirmations',
        formConfig: {
            tooltip: 'Ask before performing destructive actions'
        }
    },
    analytics: {
        type: 'boolean',
        label: 'Usage Analytics',
        formConfig: {
            tooltip: 'Help improve the app by sharing anonymous usage data'
        }
    }
};

/**
 * Appearance-only settings
 * Just theme, font size, and compact mode
 */
export const appearanceSettingsBlueprint = {
    theme: settingsBlueprint.theme,
    fontSize: settingsBlueprint.fontSize,
    compactMode: settingsBlueprint.compactMode
};

/**
 * Notification settings only
 */
export const notificationSettingsBlueprint = {
    notifications: settingsBlueprint.notifications,
    emailNotifications: settingsBlueprint.emailNotifications,
    notificationSound: settingsBlueprint.notificationSound
};

/**
 * Privacy settings only
 */
export const privacySettingsBlueprint = {
    showOnlineStatus: settingsBlueprint.showOnlineStatus,
    showProfile: settingsBlueprint.showProfile,
    allowMessages: settingsBlueprint.allowMessages
};
