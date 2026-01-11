/**
 * Sidebar Module
 * Auto-generates navigation sidebar from page sections using Domma.elements.sidebar()
 */
export const SidebarModule = {
    sidebarInstance: null,

    /**
     * Initialize sidebar
     * @param {Object} config - Sidebar configuration
     */
    init(config) {
        if (!config || !config.enabled) return;

        try {
            // Generate sidebar content
            const items = this.generateItems(config);

            if (!items || items.length === 0) {
                console.log('[Domma Layout] No sidebar items found');
                return;
            }

            // Create container element
            this.createContainer();

            // Initialize Domma.elements.sidebar() with push mode and scroll-spy
            this.sidebarInstance = window.Domma.elements.sidebar('#page-sidebar', {
                position: 'left',
                fixed: true,
                push: true,
                contentSelector: '.container',
                top: '64px',              // Navbar height offset
                width: '220px',
                collapsedWidth: '60px',
                header: { title: 'Contents' },
                items: items.map(item => ({
                    text: item.title,
                    url: `#${item.id}`,
                    section: item.id
                })),
                variant: 'dark',
                scrollSpy: true,
                scrollSpyOffset: '-100px 0px -50% 0px',
                scrollSpyThreshold: 0.5,
                collapsible: true,
                collapsibleDesktop: true,  // Enable desktop collapse
                persistCollapsed: true,     // Save collapse state
                persistCollapseKey: 'layout-sidebar',
                collapseAt: 576,
                onItemClick: (item, path, event) => {
                    event.preventDefault();
                    const target = document.getElementById(item.section);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        history.pushState(null, null, `#${item.section}`);
                    }
                }
            });

            console.log('[Domma Layout] Sidebar rendered with', items.length, 'items');
        } catch (error) {
            console.error('[Domma Layout] Sidebar initialization failed:', error);
        }
    },

    /**
     * Generate sidebar items from page content
     * @param {Object} config - Sidebar configuration
     * @returns {Array} Array of sidebar items
     */
    generateItems(config) {
        const items = [];

        // Try the primary selector first
        const selector = config.selector || '[data-section]';
        let elements = document.querySelectorAll(selector);

        // Fallback to secondary selector if no results
        if (elements.length === 0 && config.fallbackSelector) {
            elements = document.querySelectorAll(config.fallbackSelector);
        }

        elements.forEach((el, index) => {
            // Generate ID if missing
            if (!el.id) {
                const text = el.textContent.trim();
                el.id = 'section-' + text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
            }

            // Get section title
            let title = el.getAttribute('data-section') || el.textContent.trim();

            items.push({
                id: el.id,
                title: title,
                element: el
            });
        });

        return items;
    },

    /**
     * Create container element for sidebar
     */
    createContainer() {
        // Remove existing sidebar if present
        const existing = document.getElementById('page-sidebar');
        if (existing) {
            existing.remove();
        }

        // Create new container
        const navbar = document.querySelector('nav');
        const container = document.createElement('aside');
        container.id = 'page-sidebar';

        // Insert after navbar or at start of body
        if (navbar && navbar.nextSibling) {
            navbar.insertAdjacentElement('afterend', container);
        } else {
            document.body.insertAdjacentElement('afterbegin', container);
        }
    },

    /**
     * Escape HTML
     * @param {string} text - Text to escape
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
