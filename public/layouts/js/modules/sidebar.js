/**
 * Sidebar Module
 * Auto-generates navigation sidebar from page sections
 */
export const SidebarModule = {
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

            // Render sidebar
            this.renderSidebar(items, config);

            // Initialize scroll spy if enabled
            if (config.scrollSpy !== false) {
                this.initScrollSpy(items);
            }

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

        // Try primary selector first
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
     * Render sidebar HTML
     * @param {Array} items - Sidebar items
     * @param {Object} config - Sidebar configuration
     */
    renderSidebar(items, config) {
        const html = `
<aside id="page-sidebar" class="page-sidebar">
    <nav class="sidebar-nav">
        <div class="sidebar-header">Contents</div>
        <ul class="sidebar-list">
            ${items.map((item, index) => `
                <li class="sidebar-item ${index === 0 ? 'active' : ''}">
                    <a href="#${item.id}" class="sidebar-link" data-section-id="${item.id}">
                        ${this.escapeHtml(item.title)}
                    </a>
                </li>
            `).join('')}
        </ul>
    </nav>
</aside>`;

        // Insert sidebar after navbar or at start of body
        const navbar = document.querySelector('nav');
        if (navbar && navbar.nextSibling) {
            navbar.insertAdjacentHTML('afterend', html);
        } else {
            document.body.insertAdjacentHTML('afterbegin', html);
        }

        // Add styles
        this.injectStyles();

        // Add click handlers
        this.attachHandlers();
    },

    /**
     * Inject sidebar CSS
     */
    injectStyles() {
        if (document.getElementById('sidebar-styles')) return;

        const styles = `
<style id="sidebar-styles">
.page-sidebar {
    position: fixed;
    left: 2px;
    bottom: 8px;
    width: 220px;
    max-height: 400px;
    overflow-y: auto;
    background: var(--dm-surface, #fff);
    border: 1px solid var(--dm-border, #dee2e6);
    border-radius: var(--dm-radius, 0.375rem);
    padding: 1rem;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.sidebar-header {
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--dm-gray-600, #6c757d);
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--dm-border, #dee2e6);
}

.sidebar-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar-item {
    margin-bottom: 0.25rem;
}

.sidebar-link {
    display: block;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--dm-text, #212529);
    text-decoration: none;
    border-radius: var(--dm-radius-sm, 0.25rem);
    transition: all 0.15s ease;
}

.sidebar-link:hover {
    background: var(--dm-hover-bg, rgba(0,0,0,0.04));
    color: var(--dm-primary, #6495ED);
}

.sidebar-item.active .sidebar-link {
    background: var(--dm-primary, #6495ED);
    color: white;
    font-weight: 500;
}

/* Adjust on smaller screens */
@media (max-width: 992px) {
    .page-sidebar {
        left: 0.5rem;
        bottom: 0.5rem;
        width: 180px;
        max-height: 300px;
    }
}

@media (max-width: 576px) {
    .page-sidebar {
        display: none;
    }
}

/* Scrollbar styling */
.page-sidebar::-webkit-scrollbar {
    width: 6px;
}

.page-sidebar::-webkit-scrollbar-track {
    background: transparent;
}

.page-sidebar::-webkit-scrollbar-thumb {
    background: var(--dm-gray-400, #adb5bd);
    border-radius: 3px;
}

.page-sidebar::-webkit-scrollbar-thumb:hover {
    background: var(--dm-gray-500, #6c757d);
}
</style>`;

        document.head.insertAdjacentHTML('beforeend', styles);
    },

    /**
     * Attach event handlers
     */
    attachHandlers() {
        // Smooth scroll to sections
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-section-id');
                const target = document.getElementById(targetId);

                if (target) {
                    // Use smooth scroll
                    target.scrollIntoView({behavior: 'smooth', block: 'start'});

                    // Update active state
                    document.querySelectorAll('.sidebar-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    link.closest('.sidebar-item').classList.add('active');

                    // Update URL without jumping
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    },

    /**
     * Initialize scroll spy
     * @param {Array} items - Sidebar items
     */
    initScrollSpy(items) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Update active state
                    const id = entry.target.id;
                    document.querySelectorAll('.sidebar-item').forEach(item => {
                        item.classList.remove('active');
                    });

                    const activeLink = document.querySelector(`.sidebar-link[data-section-id="${id}"]`);
                    if (activeLink) {
                        activeLink.closest('.sidebar-item').classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -50% 0px'
        });

        // Observe all sections
        items.forEach(item => {
            if (item.element) {
                observer.observe(item.element);
            }
        });
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
