/**
 * Admin Authentication Guard
 * Shared auth check for all admin pages
 */

import { InactivityTimer } from '../../miniapps/shared/inactivity-timer.js';
import config from '../../miniapps/shared/config.js';

const AdminAuth = {
    /**
     * Initialise admin authentication
     * @param {string} apiUrl - The API URL
     * @param {Array<string>} allowedRoles - Roles allowed to access (default: ['admin'])
     * @returns {boolean} True if user is authenticated with allowed role, false otherwise
     */
    init(apiUrl, allowedRoles = ['admin']) {
        // Initialise Domma auth
        Domma.auth.init({ apiUrl });

        // Get current user
        const user = Domma.auth.getUser();

        if (!user || !allowedRoles.includes(user.role)) {
            const rolesList = allowedRoles.join(' or ');
            console.warn(`[Admin] Access denied - user role '${user?.role || 'unknown'}' not in allowed roles: ${rolesList}`);
            Domma.elements.alert(`Access Denied. ${rolesList.charAt(0).toUpperCase() + rolesList.slice(1)} privileges required.\n\nPlease log in with appropriate privileges.`)
                .then(() => {
                    window.location.href = '/login/index.html';
                });
            return false;
        }

        console.log(`[Admin] Access granted - user role: ${user.role}`);

        // Start inactivity auto-logout timer
        const timer = new InactivityTimer({
            timeoutMs: config.sessionTimeoutMs,
            warningMs: config.sessionWarningMs,
            onWarning: () => {
                Domma.elements.toast(
                    'Your session will expire in 1 minute due to inactivity.',
                    { type: 'warning', duration: 10000 }
                );
            },
            onTimeout: () => {
                Domma.elements.toast('Signed out due to inactivity.', { type: 'info' });
                Domma.auth.logout();
                window.location.href = '/login/index.html';
            }
        });
        timer.start();

        return true;
    },

    /**
     * Get API URL based on environment
     * @returns {string} API URL
     */
    getApiUrl() {
        const isLocal = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1';
        return isLocal ? 'http://localhost:3000/api' : '/api';
    },

    /**
     * Get authentication headers for API calls
     * @returns {Object} Headers object with Authorization
     */
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${Domma.auth.token}`,
            'Content-Type': 'application/json'
        };
    },

    /**
     * Get current user information
     * @returns {Object|null} User object or null
     */
    getUser() {
        return Domma.auth.getUser();
    }
};

export default AdminAuth;
