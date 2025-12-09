/**
 * Preset Detection Module
 * Determines which layout preset to apply based on page attributes and URL
 */
export const LayoutDetector = {
    /**
     * Detect preset and variant from page context
     * @returns {{preset: string, variant: string|null}}
     */
    detect() {
        // Method 1: Check data-layout attribute
        const layoutAttr = document.body.getAttribute('data-layout');
        const variantAttr = document.body.getAttribute('data-layout-variant');

        if (layoutAttr) {
            return {preset: layoutAttr, variant: variantAttr};
        }

        // Method 2: Check meta tag
        const metaLayout = document.querySelector('meta[name="layout"]');
        const metaVariant = document.querySelector('meta[name="layout-variant"]');

        if (metaLayout) {
            return {
                preset: metaLayout.getAttribute('content'),
                variant: metaVariant?.getAttribute('content') || null
            };
        }

        // Method 3: Auto-detect from URL
        return this.autoDetect();
    },

    /**
     * Auto-detect preset from URL path
     * @returns {{preset: string, variant: string|null}}
     */
    autoDetect() {
        const path = window.location.pathname;

        // Splash page
        if (this.isSplashPage(path)) {
            return {preset: 'splash', variant: null};
        }

        // Public pages
        if (this.isPublicPage(path)) {
            return {preset: 'public', variant: null};
        }

        // Quickstart
        if (path.includes('/quickstart/')) {
            return {preset: 'quickstart', variant: null};
        }

        // Showcase variants
        if (path.includes('/showcase/')) {
            // Element detail pages (e.g., /showcase/elements/card/)
            if (this.isElementPage(path)) {
                return {preset: 'showcase', variant: 'element'};
            }
            // Subpages (e.g., /showcase/dom/, /showcase/utils/)
            if (this.isShowcaseSubpage(path)) {
                return {preset: 'showcase', variant: 'subpage'};
            }
            // Main showcase index page
            return {preset: 'showcase', variant: 'index'};
        }

        // Default to minimal
        return {preset: 'minimal', variant: null};
    },

    /**
     * Check if path is splash page
     * @param {string} path - URL path
     * @returns {boolean}
     */
    isSplashPage(path) {
        return (path === '/' ||
                path.endsWith('/index.html') ||
                path.endsWith('/public/')) &&
            !path.includes('/showcase/') &&
            !path.includes('/quickstart/') &&
            !path.includes('/blog/');
    },

    /**
     * Check if path is public page
     * @param {string} path - URL path
     * @returns {boolean}
     */
    isPublicPage(path) {
        return path.endsWith('/about.html') ||
            path.endsWith('/about') ||
            path.endsWith('/faq.html') ||
            path.endsWith('/faq') ||
            path.includes('/blog/');
    },

    /**
     * Check if path is showcase subpage
     * @param {string} path - URL path
     * @returns {boolean}
     */
    isShowcaseSubpage(path) {
        return path.includes('/config/') ||
            path.includes('/dom/') ||
            path.includes('/utils/') ||
            path.includes('/dates/') ||
            path.includes('/models/') ||
            path.includes('/elements/') ||
            path.includes('/tables/') ||
            path.includes('/icons/') ||
            path.includes('/themes/') ||
            path.includes('/storage/') ||
            path.includes('/download/') ||
            path.includes('/http/') ||
            path.includes('/grid/') ||
            path.includes('/theme-roller/') ||
            path.includes('/page-roller/');
    },

    /**
     * Check if path is element detail page
     * @param {string} path - URL path
     * @returns {boolean}
     */
    isElementPage(path) {
        return path.includes('/elements/') &&
            !path.endsWith('/elements/index.html') &&
            !path.match(/\/elements\/?$/);
    }
};
