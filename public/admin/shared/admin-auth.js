/**
 * Admin Authentication Guard
 * Shared auth check for all admin pages
 */

const AdminAuth = {
    /**
     * Initialise admin authentication
     * @param {string} apiUrl - The API URL
     * @returns {boolean} True if user is authenticated as admin, false otherwise
     */
    init(apiUrl) {
        // Initialise Domma auth
        Domma.auth.init({ apiUrl });

        // Check if user is admin
        if (!Domma.auth.isAdmin()) {
            console.warn('[Admin] Access denied - not an admin user');
            Domma.elements.alert('Access Denied. Admin privileges required.\n\nPlease log in as an admin user first.')
                .then(() => {
                    window.location.href = '/login/index.html';
                });
            return false;
        }

        console.log('[Admin] Access granted - user is admin');
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
