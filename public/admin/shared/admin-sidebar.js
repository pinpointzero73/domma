/**
 * Admin Sidebar Component
 * Shared navigation for all admin pages
 * Now using Domma.elements.sidebar() component
 */

const AdminSidebar = {
    items: [
        { text: 'Overview', url: '/admin/index.html', icon: 'layout', section: 'overview', roles: ['admin'], badge: null },
        { text: 'Users', url: '/admin/users/index.html', icon: 'users', section: 'users', roles: ['admin'], badge: null },
        { text: 'Credits', url: '/admin/credits/index.html', icon: 'gift', section: 'credits', roles: ['admin'], badge: null },
        { text: 'Contact Forms', url: '/admin/contact-forms/index.html', icon: 'mail', section: 'contact-forms', roles: ['admin'], badge: null },
        { text: 'Feedback', url: '/admin/feedback/index.html', icon: 'message-square', section: 'feedback', roles: ['admin'], badge: null },
        { text: 'Blog', url: '/admin/blog/index.html', icon: 'file-text', section: 'blog', roles: ['admin', 'editor'], badge: null },
        // MiniApp Management
        { text: 'Address Lookup', url: '/admin/address-lookup/index.html', icon: 'map-pin', section: 'address-lookup', roles: ['admin'], badge: null },
        // Admin self-management
        { text: 'My Settings', url: '/admin/settings/index.html', icon: 'settings', section: 'settings', roles: ['admin'], badge: null },
        { text: 'My Privileges', url: '/admin/privileges/index.html', icon: 'key', section: 'privileges', roles: ['admin'], badge: null },
        { text: 'Impersonate User', url: '/admin/impersonate/index.html', icon: 'user-check', section: 'impersonate', roles: ['admin'], badge: null }
    ],

    sidebarInstance: null,
    apiUrl: null,

    /**
     * Initialise sidebar using Domma.elements.sidebar()
     * @param {string} currentSection - The current active section
     * @param {string} apiUrl - The API base URL (optional, for loading badge counts)
     */
    init(currentSection, apiUrl = null) {
        const $container = $('#admin-sidebar');
        if ($container.length === 0) {
            console.error('[AdminSidebar] Container #admin-sidebar not found');
            return;
        }

        // Check if Domma is available
        if (typeof Domma === 'undefined' || !Domma.elements || !Domma.elements.sidebar) {
            console.error('[AdminSidebar] Domma.elements.sidebar is not available');
            return;
        }

        // Store API URL for later use
        this.apiUrl = apiUrl;

        // Get current user for role-based filtering
        const user = Domma.auth.getUser();
        const userRole = user?.role || 'guest';

        // Filter items based on user role
        const filteredItems = this.items.filter(item => {
            return !item.roles || item.roles.includes(userRole);
        });

        // Determine sidebar variant based on current theme
        const theme = window.Domma.theme;
        const getVariant = () => (theme && theme.isDark()) ? 'dark' : 'light';

        // Create sidebar using Domma component
        this.sidebarInstance = Domma.elements.sidebar('#admin-sidebar', {
            position: 'left',
            fixed: true,
            width: '250px',
            collapsedWidth: '60px',
            top: '60px', // Below the navbar
            header: {
                title: userRole === 'editor' ? 'Editor Panel' : 'Admin Panel',
                toggle: true,
                icon: null
            },
            items: filteredItems,
            variant: getVariant(),
            collapsible: true,
            collapsibleDesktop: true,         // Enable desktop collapse
            persistCollapsed: true,            // Save collapse state
            persistCollapseKey: 'admin-sidebar',
            collapseAt: 768,
            activeSection: currentSection,
            push: true,                      // Push content instead of overlay
            contentSelector: '.admin-main',   // Push the main content area
            onItemClick: (item, path, event) => {
                console.log('Navigating to:', item.text, item.url);
                // Allow default link behavior
            }
        });

        // React to theme changes — swap sidebar variant class
        if (theme && theme.onChange) {
            theme.onChange(() => {
                const el = document.getElementById('admin-sidebar');
                if (!el) return;
                const variant = getVariant();
                el.classList.remove('sidebar-dark', 'sidebar-light');
                el.classList.add(`sidebar-${variant}`);
            });
        }

        // Load badge counts if apiUrl provided
        if (apiUrl) {
            this.loadBadgeCounts();
        }
    },

    /**
     * Load badge counts from API
     * Fetches counts for each section and updates badges
     */
    async loadBadgeCounts() {
        if (!this.apiUrl) {
            console.warn('[AdminSidebar] No API URL provided, skipping badge count load');
            return;
        }

        try {
            // Import AdminAuth to get auth headers
            const AdminAuth = (await import('./admin-auth.js')).default;

            const response = await Domma.http.get(`${this.apiUrl}/admin/sidebar-counts`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success && response.counts) {
                this.updateBadges(response.counts);
            }
        } catch (error) {
            console.error('[AdminSidebar] Failed to load badge counts:', error);
            // Don't show toast error, badges are optional enhancement
        }
    },

    /**
     * Update sidebar badges with counts
     * @param {object} counts - Object with counts keyed by section
     */
    updateBadges(counts) {
        // Map API counts to section identifiers
        const badgeMap = {
            'users': counts.users,
            'contact-forms': counts.contactForms,
            'feedback': counts.feedback,
            'blog': counts.blog
        };

        // Update items with badge values
        this.items.forEach(item => {
            if (item.section && badgeMap[item.section] !== undefined) {
                item.badge = badgeMap[item.section];
            }
        });

        // Update the DOM badges directly using Domma
        Object.keys(badgeMap).forEach(section => {
            const count = badgeMap[section];
            const $link = $(`[data-section="${section}"]`);

            if ($link.length > 0) {
                // Find existing badge or create new one
                let $badge = $link.find('.sidebar-badge');

                if (count > 0) {
                    if ($badge.length === 0) {
                        // Create badge element
                        const badgeHtml = '<span class="sidebar-badge"></span>';
                        const $text = $link.find('.sidebar-text');
                        if ($text.length > 0) {
                            $text.after(badgeHtml);
                            $badge = $link.find('.sidebar-badge');
                        } else {
                            $link.append(badgeHtml);
                            $badge = $link.find('.sidebar-badge');
                        }
                    }
                    $badge.text(count);
                } else if ($badge.length > 0) {
                    // Remove badge if count is 0
                    $badge.remove();
                }
            }
        });

        console.log('[AdminSidebar] Updated badges:', badgeMap);
    },

    /**
     * Update the active section
     * @param {string} section - The section to mark as active
     */
    setActive(section) {
        if (this.sidebarInstance) {
            this.sidebarInstance.setActive(section);
        }
    },

    /**
     * Get the sidebar instance
     * @returns {object|null} The sidebar component instance
     */
    getInstance() {
        return this.sidebarInstance;
    }
};

export default AdminSidebar;
