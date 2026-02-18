/**
 * Sidebar Module
 * Auto-generates navigation sidebar from page sections using Domma.elements.sidebar()
 * Supports prependNav config to prepend grouped navigation links before auto-generated items
 */
export const SidebarModule = {
    sidebarInstance: null,

    /**
     * Initialize sidebar
     * @param {Object} config - Sidebar configuration
     * @param {string} configBase - Base path to config directory
     */
    async init(config, configBase) {
        if (!config || !config.enabled) return;

        try {
            // Load prepended navigation items if configured
            let prependItems = [];
            if (config.prependNav && configBase) {
                prependItems = await this.loadPrependNav(config.prependNav, configBase);
            }

            // Generate sidebar content from page sections
            const pageItems = this.generateItems(config);

            // Build the sidebar items array
            const sidebarItems = [];

            // Add prepended nav groups first
            if (prependItems.length > 0) {
                sidebarItems.push(...prependItems);

                // Add page sections as a group if there are any
                if (pageItems.length > 0) {
                    sidebarItems.push({
                        text: 'On This Page',
                        items: pageItems.map(item => ({
                            text: item.title,
                            url: `#${item.id}`,
                            section: item.id
                        }))
                    });
                }
            }

            if (sidebarItems.length === 0 && pageItems.length === 0) {
                console.log('[Domma Layout] No sidebar items found');
                return;
            }

            // Create container element
            this.createContainer();

            // Build items for Domma.elements.sidebar()
            let finalItems;
            if (sidebarItems.length > 0) {
                finalItems = sidebarItems;
            } else {
                // No prepended nav, use flat page items
                finalItems = pageItems.map(item => ({
                    text: item.title,
                    url: `#${item.id}`,
                    section: item.id
                }));
            }

            // Initialize Domma.elements.sidebar() with push mode and scroll-spy
            this.sidebarInstance = window.Domma.elements.sidebar('#page-sidebar', {
                position: 'left',
                fixed: true,
                push: true,
                contentSelector: '.dm-content-area',
                top: '64px',              // Navbar height offset
                width: '220px',
                collapsedWidth: '60px',
                header: { title: 'Contents' },
                items: finalItems,
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
                    // Only handle anchor links (page section links)
                    if (item.url && item.url.startsWith('#')) {
                        event.preventDefault();
                        const target = document.getElementById(item.section);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            history.pushState(null, null, `#${item.section}`);
                        }
                    }
                    // External page links navigate normally (default behaviour)
                }
            });

            const totalItems = prependItems.length > 0
                ? prependItems.reduce((sum, g) => sum + (g.items ? g.items.length : 1), 0) + pageItems.length
                : pageItems.length;
            console.log('[Domma Layout] Sidebar rendered with', totalItems, 'items');
        } catch (error) {
            console.error('[Domma Layout] Sidebar initialization failed:', error);
        }
    },

    /**
     * Load prepended navigation from a config file
     * @param {string} navName - Config file name (without .json extension)
     * @param {string} configBase - Base path to config directory
     * @returns {Array} Array of sidebar group items
     */
    async loadPrependNav(navName, configBase) {
        try {
            const response = await fetch(configBase + navName + '.json');
            if (!response.ok) return [];

            const navConfig = await response.json();

            if (navConfig.type === 'grouped' && Array.isArray(navConfig.groups)) {
                return navConfig.groups.map(group => {
                    const children = (group.items || []).map(item => {
                        const sidebarItem = {
                            text: item.text,
                            url: item.url
                        };
                        if (item.slug) sidebarItem.section = item.slug;
                        if (item.badge) sidebarItem.badge = item.badge;
                        return sidebarItem;
                    });

                    return {
                        text: group.title,
                        items: children
                    };
                });
            }

            return [];
        } catch (error) {
            console.warn('[Domma Layout] Failed to load prependNav config:', navName, error);
            return [];
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
     * Create container element for sidebar and content wrapper
     */
    createContainer() {
        // Remove existing sidebar if present
        const existing = document.getElementById('page-sidebar');
        if (existing) {
            existing.remove();
        }

        // Remove existing content wrapper if present
        const existingWrapper = document.querySelector('.dm-content-area');
        if (existingWrapper) {
            // Unwrap: move children back to body, then remove wrapper
            while (existingWrapper.firstChild) {
                existingWrapper.parentNode.insertBefore(existingWrapper.firstChild, existingWrapper);
            }
            existingWrapper.remove();
        }

        // Create sidebar element
        const navbar = document.querySelector('nav');
        const sidebar = document.createElement('aside');
        sidebar.id = 'page-sidebar';

        // Insert sidebar after navbar or at start of body
        if (navbar && navbar.nextSibling) {
            navbar.insertAdjacentElement('afterend', sidebar);
        } else {
            document.body.insertAdjacentElement('afterbegin', sidebar);
        }

        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'dm-content-area';

        // Move all remaining siblings after sidebar into the wrapper
        let nextSibling = sidebar.nextSibling;
        while (nextSibling) {
            const current = nextSibling;
            nextSibling = nextSibling.nextSibling;
            contentWrapper.appendChild(current);
        }

        // Insert wrapper after sidebar
        sidebar.insertAdjacentElement('afterend', contentWrapper);
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
