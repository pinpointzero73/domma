/**
 * Address Lookup Admin - Shared Sidebar Module
 *
 * Single source of truth for the AL admin sidebar items, API URL, and date
 * formatting. Extracted from all 5 AL sub-pages to eliminate duplication.
 * Follows the same theme-reactive pattern as admin-sidebar.js.
 */

/** Address Lookup admin navigation items (shared across all 5 sub-pages). */
const AL_SIDEBAR_ITEMS = [
    { text: 'Overview',      url: '/admin/address-lookup/index.html',          icon: 'layout',      section: 'overview',  roles: ['admin'] },
    { text: 'Users',         url: '/admin/address-lookup/users/index.html',     icon: 'users',       section: 'users',     roles: ['admin'] },
    { text: 'API Keys',      url: '/admin/address-lookup/api-keys/index.html',  icon: 'key',         section: 'api-keys',  roles: ['admin'] },
    { text: 'Credits',       url: '/admin/address-lookup/credits/index.html',   icon: 'credit-card', section: 'credits',   roles: ['admin'] },
    { text: 'Analytics',     url: '/admin/address-lookup/analytics/index.html', icon: 'chart-bar',   section: 'analytics', roles: ['admin'] },
    { text: 'Back to Admin', url: '/admin/index.html',                          icon: 'arrow-left',  section: 'back',      roles: ['admin'] }
];

/**
 * Returns the API base URL for the current environment.
 * @returns {string}
 */
export function getApiUrl() {
    return window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api';
}

/**
 * Format a date string as a relative time using Domma Dates.
 * Falls back to a localised absolute date for older entries.
 * @param {string} dateStr - ISO date string
 * @param {boolean} [absolute=false] - Force absolute date/time format
 * @returns {string}
 */
export function formatDate(dateStr, absolute = false) {
    if (!dateStr) return '-';

    if (absolute) {
        return D(dateStr).format('DD MMM YYYY, HH:mm');
    }

    // Use relative time for recent entries, absolute for older ones
    const diffDays = Math.abs(D().diff(D(dateStr), 'days'));
    if (diffDays > 30) {
        return D(dateStr).format('DD MMM YYYY');
    }

    return D(dateStr).fromNow();
}

/**
 * Initialise the Address Lookup admin sidebar.
 *
 * Theme-reactive: follows Domma.theme changes just like admin-sidebar.js.
 * The variant starts as dark or light based on the current theme and
 * switches automatically when the user toggles the theme.
 *
 * @param {string} activeSection - The currently active section key
 */
export function initALSidebar(activeSection) {
    const $container = $('#admin-sidebar');
    if ($container.length === 0) {
        console.error('[ALSidebar] Container #admin-sidebar not found');
        return;
    }

    // Role-based item filtering
    const user = Domma.auth.getUser();
    const userRole = user?.role || 'guest';
    const filteredItems = AL_SIDEBAR_ITEMS.filter(
        item => !item.roles || item.roles.includes(userRole)
    );

    // Theme-reactive variant - matches admin-sidebar.js pattern
    const theme = window.Domma?.theme;
    const getVariant = () => (theme && theme.isDark()) ? 'dark' : 'light';

    Domma.elements.sidebar('#admin-sidebar', {
        position: 'left',
        fixed: true,
        width: '250px',
        collapsedWidth: '60px',
        top: '60px',
        header: {
            title: 'Address Lookup Admin',
            toggle: true,
            icon: null
        },
        items: filteredItems,
        variant: getVariant(),
        collapsible: true,
        collapsibleDesktop: true,
        persistCollapsed: true,
        persistCollapseKey: 'address-admin-sidebar',
        collapseAt: 768,
        activeSection,
        push: true,
        contentSelector: '.admin-main'
    });

    // React to theme changes - swap sidebar variant class
    if (theme && theme.onChange) {
        theme.onChange(() => {
            const el = document.getElementById('admin-sidebar');
            if (!el) return;
            const variant = getVariant();
            el.classList.remove('sidebar-dark', 'sidebar-light');
            el.classList.add(`sidebar-${variant}`);
        });
    }
}
