/**
 * Path Resolution Module
 * Calculates correct relative paths based on page depth
 */
export const PathResolver = {
    /**
     * Calculate base path for given page depth
     * @param {number} depth - Depth from root (0 = root, 1 = /showcase/, 2 = /showcase/dom/, etc.)
     * @returns {string}
     */
    getBasePath(depth) {
        if (depth === 0) return '';
        return '../'.repeat(depth);
    },

    /**
     * Auto-detect depth from current URL
     * @returns {number}
     */
    detectDepth() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p && p !== 'index.html');

        // Remove 'public' from count if present
        const filtered = parts.filter(p => p !== 'public');

        return filtered.length;
    },

    /**
     * Resolve URL relative to current page
     * @param {string} url - URL to resolve
     * @param {number} [depth] - Optional depth override
     * @returns {string}
     */
    resolve(url, depth = null) {
        const actualDepth = depth !== null ? depth : this.detectDepth();
        const base = this.getBasePath(actualDepth);

        // If URL is absolute, return as-is
        if (url.startsWith('/') || url.startsWith('http')) {
            return url;
        }

        return base + url;
    },

    /**
     * Resolve all URLs in navigation config
     * @param {Object} navConfig - Navigation configuration
     * @param {number} depth - Page depth
     * @returns {Object} Config with resolved URLs
     */
    resolveNavUrls(navConfig, depth) {
        const base = this.getBasePath(depth);

        const resolveItem = (item) => {
            const resolved = {...item};
            if (resolved.url) {
                // If URL is absolute or external, return as-is
                if (resolved.url.startsWith('/') || resolved.url.startsWith('http://') || resolved.url.startsWith('https://')) {
                    // Keep URL unchanged
                } else {
                    resolved.url = base + resolved.url;
                }
            }
            if (resolved.items) {
                resolved.items = resolved.items.map(resolveItem);
            }
            return resolved;
        };

        return {
            ...navConfig,
            items: navConfig.items.map(resolveItem)
        };
    },

    /**
     * Calculate active state for navigation items
     * @param {Object} navConfig - Navigation configuration
     * @returns {Object} Config with active flags
     */
    calculateActiveStates(navConfig) {
        const currentPath = window.location.pathname;
        const currentSection = currentPath.split('/').filter(Boolean).slice(-2, -1)[0] || '';

        const markActive = (item) => {
            const marked = {...item};

            // Check if this item's section matches current
            if (marked.section === currentSection) {
                marked.active = true;
            }

            // Check nested items
            if (marked.items) {
                marked.items = marked.items.map(markActive);
                // Mark parent dropdown active if any child is active
                if (marked.items.some(i => i.active)) {
                    marked.active = true;
                }
            }

            return marked;
        };

        return {
            ...navConfig,
            items: navConfig.items.map(markActive)
        };
    }
};
