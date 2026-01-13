/**
 * Admin Sidebar Component
 * Shared navigation for all admin pages
 * Now using Domma.elements.sidebar() component
 */

const AdminSidebar = {
    items: [
        { text: 'Overview', url: '/admin/index.html', icon: 'layout', section: 'overview', roles: ['admin'] },
        { text: 'Users', url: '/admin/users/index.html', icon: 'users', section: 'users', roles: ['admin'] },
        { text: 'Contact Forms', url: '/admin/contact-forms/index.html', icon: 'mail', section: 'contact-forms', roles: ['admin'] },
        { text: 'Feedback', url: '/admin/feedback/index.html', icon: 'message-square', section: 'feedback', roles: ['admin'] },
        { text: 'Blog', url: '/admin/blog/index.html', icon: 'file-text', section: 'blog', roles: ['admin', 'editor'] }
    ],

    sidebarInstance: null,

    /**
     * Initialise sidebar using Domma.elements.sidebar()
     * @param {string} currentSection - The current active section
     */
    init(currentSection) {
        const container = document.getElementById('admin-sidebar');
        if (!container) {
            console.error('[AdminSidebar] Container #admin-sidebar not found');
            return;
        }

        // Check if Domma is available
        if (typeof Domma === 'undefined' || !Domma.elements || !Domma.elements.sidebar) {
            console.error('[AdminSidebar] Domma.elements.sidebar is not available');
            return;
        }

        // Get current user for role-based filtering
        const user = Domma.auth.getUser();
        const userRole = user?.role || 'guest';

        // Filter items based on user role
        const filteredItems = this.items.filter(item => {
            return !item.roles || item.roles.includes(userRole);
        });

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
            variant: 'dark',
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
