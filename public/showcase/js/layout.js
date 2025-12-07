/**
 * Domma Showcase - Shared Layout
 * Injects consistent header, footer, and theme toggle across all showcase pages
 * Uses Domma APIs throughout (now loads after Domma)
 */

(function () {
    // Storage helper - use Domma.storage if available, fallback to localStorage
    const storage = typeof Domma !== 'undefined' && Domma.storage ? Domma.storage : {
        get: (key, def) => {
            try {
                return JSON.parse(localStorage.getItem('domma:' + key)) ?? def;
            } catch {
                return def;
            }
        },
        set: (key, val) => {
            try {
                localStorage.setItem('domma:' + key, JSON.stringify(val));
            } catch {
            }
        },
        has: (key) => localStorage.getItem('domma:' + key) !== null
    };

    // Storage key migration: old domma-theme → new storage prefix
    try {
        const oldTheme = localStorage.getItem('domma-theme');
        if (oldTheme && !storage.has('theme')) {
            storage.set('theme', oldTheme);
            localStorage.removeItem('domma-theme');
        }
        const oldVariant = localStorage.getItem('domma-theme-variant');
        if (oldVariant && !storage.has('theme-variant')) {
            storage.set('theme-variant', oldVariant);
            localStorage.removeItem('domma-theme-variant');
        }
    } catch (e) {
        console.warn('Layout: Storage migration skipped', e);
    }

    function init() {
        // Determine the base path based on current location
        const path = window.location.pathname;
        const isShowcaseSubpage = path.includes('/config/') || path.includes('/dom/') ||
            path.includes('/utils/') || path.includes('/dates/') ||
            path.includes('/models/') || path.includes('/elements/') ||
            path.includes('/tables/') || path.includes('/icons/') ||
            path.includes('/themes/') || path.includes('/storage/') ||
            path.includes('/download/') || path.includes('/http/') ||
            path.includes('/grid/') || path.includes('/theme-roller/') ||
            path.includes('/page-roller/');
        const isQuickstart = path.includes('/quickstart/');

        // Public pages (About, FAQ, Blog) - not showcase subpages
        const isAboutPage = path.endsWith('/about.html') || path.endsWith('/about');
        const isFaqPage = path.endsWith('/faq.html') || path.endsWith('/faq');
        const isBlogPage = path.includes('/blog/');
        const isPublicPage = isAboutPage || isFaqPage || isBlogPage;
        const isSplashPage = (path === '/' || path.endsWith('/index.html') || path.endsWith('/public/')) &&
            !path.includes('/showcase/') && !path.includes('/quickstart/') && !path.includes('/blog/');

        const isSubpage = isShowcaseSubpage;

        // Calculate base paths for different page types
        let base, splashPath, publicBase;
        if (isSubpage) {
            base = '../';
            splashPath = '../../index.html';
            publicBase = '../../';
        } else if (isQuickstart) {
            base = '../showcase/';
            splashPath = '../index.html';
            publicBase = '../';
        } else if (isBlogPage) {
            base = '../showcase/';
            splashPath = '../index.html';
            publicBase = '../';
        } else if (isPublicPage || isSplashPage) {
            base = 'showcase/';
            splashPath = 'index.html';
            publicBase = '';
        } else {
            base = '';
            splashPath = '../index.html';
            publicBase = '../';
        }

        // Get current page for active nav state
        const currentPage = path.split('/').filter(Boolean).pop()?.replace('.html', '') || 'index';
        const currentSection = path.split('/').filter(Boolean).slice(-2, -1)[0] || '';

        // Logo SVG (inline for theme adaptability)
        const logoSvg = `<svg class="dm-navbar-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M12 8 L12 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 8 L24 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 40 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 8 L36 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M36 16 L36 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M36 32 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="24" cy="24" r="3" fill="currentColor"/>
    </svg>`;

        // Navbar items configuration - showcase pages with dropdowns
        const showcaseItems = [
            {
                text: 'Core',
                items: [
                    {text: 'Config', url: `${base}config/index.html`},
                    {text: 'DOM', url: `${base}dom/index.html`},
                    {text: 'Utils', url: `${base}utils/index.html`},
                    {text: 'Storage', url: `${base}storage/index.html`},
                    {text: 'HTTP', url: `${base}http/index.html`}
                ]
            },
            {
                text: 'Data',
                items: [
                    {text: 'Dates', url: `${base}dates/index.html`},
                    {text: 'Models', url: `${base}models/index.html`},
                    {text: 'Tables', url: `${base}tables/index.html`}
                ]
            },
            {
                text: 'UI',
                items: [
                    {text: 'Elements', url: `${base}elements/index.html`},
                    {text: 'Grid', url: `${base}grid/index.html`},
                    {text: 'Icons', url: `${base}icons/index.html`},
                    {text: 'Themes', url: `${base}themes/index.html`}
                ]
            },
            {
                text: 'Tools',
                items: [
                    {text: 'Theme Roller', url: `${base}theme-roller/index.html`},
                    {text: 'Page Roller', url: `${base}page-roller/index.html`}
                ]
            }
        ];

        // Navbar items configuration - public pages (flat)
        const publicItems = [
            {text: 'Showcase', url: `${publicBase}showcase/index.html`},
            {text: 'Quickstart', url: `${publicBase}quickstart/index.html`},
            {text: 'About Us', url: `${publicBase}about.html`},
            {text: 'FAQs', url: `${publicBase}faq.html`},
            {text: 'Blog', url: `${publicBase}blog/index.html`}
        ];

        // Download path calculation
        const downloadPath = (isPublicPage || isSplashPage) ? `${publicBase}showcase/download/index.html` : `${base}download/index.html`;

        // Get build info (fallback for dev mode)
        const buildInfo = Domma.buildInfo || {version: '1.0.0', built: 'dev', commit: 'dev', size: '~250KB'};

        // Fetch extended build info (includes size) and update placeholders
        let distBase;
        if (isSubpage) {
            distBase = '../../dist/';
        } else if (isQuickstart || isBlogPage) {
            distBase = '../dist/';
        } else if (isPublicPage || isSplashPage) {
            distBase = 'dist/';
        } else {
            distBase = '../dist/';
        }
        fetch(distBase + 'build-info.json')
            .then(r => r.json())
            .then(info => {
                // Update any elements with data-build-size attribute
                document.querySelectorAll('[data-build-size]').forEach(el => {
                    el.textContent = info.size || '~250KB';
                });
            })
            .catch(() => {
            });

        // Function to set active state on public navbar items
        function setPublicActiveState() {
            if (isAboutPage) {
                publicItems.find(i => i.text === 'About Us').active = true;
            } else if (isFaqPage) {
                publicItems.find(i => i.text === 'FAQs').active = true;
            } else if (isBlogPage) {
                publicItems.find(i => i.text === 'Blog').active = true;
            }
        }
        setPublicActiveState();

        // Theme toggle button HTML
        const themeToggle = `
    <button class="theme-toggle" id="theme-toggle" title="Toggle theme">
        <svg id="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <svg id="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
    </button>`;

        // Variant selector HTML
        const variantSelector = `
    <div class="variant-selector" id="variant-selector">
        <button class="variant-trigger" title="Colour variants"></button>
        <div class="variant-options">
            <button class="variant-dot variant-dot-default" data-variant="" data-tooltip="Default"></button>
            <button class="variant-dot variant-dot-ocean" data-variant="ocean" data-tooltip="Ocean"></button>
            <button class="variant-dot variant-dot-forest" data-variant="forest" data-tooltip="Forest"></button>
            <button class="variant-dot variant-dot-sunset" data-variant="sunset" data-tooltip="Sunset"></button>
            <button class="variant-dot variant-dot-royal" data-variant="royal" data-tooltip="Royal"></button>
            <button class="variant-dot variant-dot-lemon" data-variant="lemon" data-tooltip="Lemon"></button>
            <button class="variant-dot variant-dot-silver" data-variant="silver" data-tooltip="Silver"></button>
            <button class="variant-dot variant-dot-charcoal" data-variant="charcoal" data-tooltip="Charcoal"></button>
            <button class="variant-dot variant-dot-christmas" data-variant="christmas" data-tooltip="Christmas"></button>
        </div>
    </div>`;

        // Theme toggle and variant selector styles
        const themeStyles = `
    <style id="theme-toggle-styles">
        .navbar-logo {
            vertical-align: middle;
            margin-right: 0.35rem;
            margin-top: -2px;
        }
        .navbar-brand-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .theme-toggle {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem;
            background: var(--dm-surface, #fff);
            border: 1px solid var(--dm-border, #dee2e6);
            border-radius: 9999px;
            cursor: pointer;
            z-index: 1000;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }
        .theme-toggle:hover {
            background: var(--dm-hover-bg, rgba(0,0,0,0.04));
        }
        .theme-toggle svg {
            color: var(--dm-text, #212529);
        }
        .variant-selector {
            position: fixed;
            top: 4rem;
            right: 1rem;
            z-index: 1000;
        }
        .variant-trigger {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid var(--dm-border, #dee2e6);
            cursor: pointer;
            background: conic-gradient(#adb5bd 0deg 40deg, #0077b6 40deg 80deg, #2d6a4f 80deg 120deg, #c67b5c 120deg 160deg, #4169e1 160deg 200deg, #c9b458 200deg 240deg, #708090 240deg 280deg, #36454f 280deg 320deg, #c41e3a 320deg 360deg);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            padding: 0;
        }
        .variant-trigger:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .variant-options {
            position: absolute;
            top: 48px;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
        }
        .variant-selector:hover .variant-options,
        .variant-selector:focus-within .variant-options {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .variant-dot {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid var(--dm-border, #dee2e6);
            cursor: pointer;
            transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
            padding: 0;
            position: relative;
        }
        .variant-dot:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .variant-dot.active {
            border-color: var(--dm-primary, #6495ED);
            box-shadow: 0 0 0 2px var(--dm-primary, #6495ED);
        }
        .variant-dot-default {
            background: var(--dm-gray-400, #adb5bd);
        }
        .variant-dot-ocean {
            background: linear-gradient(135deg, #0077b6, #48cae4);
        }
        .variant-dot-forest {
            background: linear-gradient(135deg, #2d6a4f, #74c69d);
        }
        .variant-dot-sunset {
            background: linear-gradient(135deg, #c67b5c, #da9d82);
        }
        .variant-dot-royal {
            background: linear-gradient(135deg, #4169e1, #6495ed);
        }
        .variant-dot-lemon {
            background: linear-gradient(135deg, #c9b458, #d4c06a);
        }
        .variant-dot-silver {
            background: linear-gradient(135deg, #708090, #a0aec0);
        }
        .variant-dot-charcoal {
            background: linear-gradient(135deg, #36454f, #607d8b);
        }
        .variant-dot-christmas {
            background: linear-gradient(135deg, #c41e3a, #165b33);
        }
        .variant-dot::after {
            content: attr(data-tooltip);
            position: absolute;
            right: 50px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--dm-gray-800, #343a40);
            color: var(--dm-white, #fff);
            padding: 0.35rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease;
        }
        .variant-dot:hover::after {
            opacity: 1;
        }
        /* Version displays */
        .navbar-brand-text {
            display: inline-flex;
            flex-direction: column;
            line-height: 1.2;
        }
        .header-version {
            font-size: 0.65rem;
            opacity: 0.6;
            font-weight: 400;
            margin-top: -2px;
        }
        .nav-version {
            font-size: 0.75rem;
            opacity: 0.7;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            color: inherit;
        }
        /* Navbar toggle icon states */
        .navbar-toggle-open,
        .navbar-toggle-close {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .footer-version {
            font-size: 0.8rem;
            opacity: 0.7;
        }
        .footer-copyright {
            font-size: 0.85rem;
        }
        @media (max-width: 576px) {
            .footer-content {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
                padding: 1rem;
            }
            .nav-version {
                display: none;
            }
        }
        /* Code block copy button */
        .code-block-wrapper {
            position: relative;
        }
        .code-block-copy {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--dm-gray-400, #adb5bd);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
            z-index: 10;
        }
        .code-block-wrapper:hover .code-block-copy,
        .code-block-copy:focus {
            opacity: 1;
        }
        .code-block-copy:hover {
            background: rgba(255, 255, 255, 0.2);
            color: var(--dm-gray-100, #f8f9fa);
        }
        .code-block-copy.copied {
            background: var(--dm-success, #198754);
            color: white;
        }
        .code-block-copy svg {
            width: 16px;
            height: 16px;
        }
        /* Public page footer styles */
        .page-footer {
            background: var(--dm-gray-900);
            color: var(--dm-gray-400);
            padding: 1.5rem 2rem;
        }
        .page-footer a {
            color: var(--dm-primary-light);
            text-decoration: none;
        }
        .page-footer a:hover {
            text-decoration: underline;
        }
        .page-footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        .page-footer-nav {
            display: flex;
            gap: 1.5rem;
        }
        .page-footer-nav a {
            font-size: 0.9rem;
        }
        @media (max-width: 576px) {
            .page-footer-content {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
        }
        /* Public page header styles */
        .page-header {
            background: linear-gradient(135deg, var(--dm-primary) 0%, var(--dm-primary-dark) 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        .page-header h1 {
            font-size: 2.5rem;
            margin: 0 0 1rem;
        }
        .page-header p {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        /* Pill button styles */
        .pill {
            display: inline-block;
            padding: 0.35rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-radius: 9999px;
            border: 1px solid transparent;
            transition: background 0.2s ease, transform 0.15s ease;
            cursor: pointer;
        }
        .pill-light {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            color: white;
        }
        .pill-light:hover {
            background: rgba(255, 255, 255, 0.25);
        }
        /* Navbar component overrides for dark variant */
        #main-navbar.dm-navbar-dark {
            background: var(--dm-gray-900);
            border-bottom: none;
        }
        #main-navbar .dm-navbar-brand-text {
            display: inline-flex;
            flex-direction: column;
            line-height: 1.2;
            color: white;
        }
        #main-navbar .header-version {
            font-size: 0.65rem;
            opacity: 0.6;
            font-weight: 400;
        }
        #main-navbar .dm-navbar-logo {
            vertical-align: middle;
            margin-right: 0.35rem;
            color: white;
        }
        #main-navbar .dm-navbar-action {
            border-radius: 9999px;
            padding: 0.35rem 0.75rem;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        /* Active dropdown toggle */
        #main-navbar .dm-navbar-dropdown-toggle.active {
            color: var(--dm-primary-light);
        }
        /* Fix navbar container to be full width */
        #main-navbar .dm-navbar-container {
            max-width: none;
            padding: 0 1rem;
        }
    </style>`;

        // Create footer HTML (for showcase pages)
        const footer = `
    <footer class="footer footer-dark">
        <div class="footer-content">
            <span class="footer-version">v${buildInfo.version} · ${buildInfo.built}</span>
            <span class="footer-copyright">&copy; Darryl Waterhouse &amp; DCBW-IT 2025</span>
        </div>
    </footer>`;

        // Public page footer HTML (for About, FAQ, Blog, Splash)
        const publicFooter = `
    <footer class="page-footer">
        <div class="page-footer-content">
            <span>&copy; DCBW-IT (2025)</span>
            <nav class="page-footer-nav">
                <a href="${publicBase}about.html">About Us</a>
                <a href="${publicBase}faq.html">FAQs</a>
                <a href="${publicBase}blog/index.html">Blog</a>
            </nav>
        </div>
    </footer>`;

        // Sidebar templates (using Domma's _.template())
        const SIDEBAR_TEMPLATE = `
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">On This Page</div>
                <ul class="sidebar-nav">
                    {{#each items}}
                    <li><a href="#{{id}}" class="sidebar-link">{{text}}</a></li>
                    {{/each}}
                </ul>
            </aside>
        `;

        const TOGGLE_TEMPLATE = `
            <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle navigation">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        `;

        const OVERLAY_TEMPLATE = `<div class="sidebar-overlay" id="sidebar-overlay"></div>`;

        // Sidebar navigation builder
        function buildSidebar() {
            // Find all section headings (supports data-section attribute or card headers)
            const $sections = $('[data-section]');
            const $headings = $sections.length > 0
                ? $sections
                : $('.card-header h2, .card-header h3');

            if ($headings.length < 2) return; // Don't show sidebar for pages with few sections

            // Generate IDs and build nav items
            const navItems = [];
            $headings.each(function () {
                const $el = $(this);
                let text, id;

                if ($el.attr('data-section') !== undefined) {
                    // Using data-section attribute
                    text = $el.data('section');
                    id = 'section-' + text.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    $el.attr('id', id);
                } else {
                    // Using card header detection
                    text = $el.text().trim();
                    id = 'section-' + text.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    const $card = $el.closest('.card, section');
                    if ($card.length) {
                        $card.attr('id', id);
                    }
                }

                navItems.push({id, text});
            });

            // Sort alphabetically by text
            navItems.sort((a, b) => a.text.localeCompare(b.text));

            // Render sidebar HTML using Domma's template system
            const render = _.template(SIDEBAR_TEMPLATE);
            const sidebarHtml = render({items: navItems});

            // Toggle and overlay HTML (static, no templating needed)
            const toggleHtml = TOGGLE_TEMPLATE;
            const overlayHtml = OVERLAY_TEMPLATE;

            // Find the hero and content container
            const $container = $('.container');

            if ($container.length) {
                // Create wrapper elements using Domma
                const $wrapper = $('<div class="showcase-layout">');
                const $contentWrapper = $('<div class="showcase-content">');

                // Insert sidebar into wrapper
                $wrapper.html(sidebarHtml);

                // Wrap the container
                $wrapper.insertBefore($container);
                $contentWrapper.append($container);
                $wrapper.append($contentWrapper);

                // Move footer inside content wrapper if it exists after wrapper
                const $existingFooter = $('.footer');
                if ($existingFooter.length && !$contentWrapper.find('.footer').length) {
                    $contentWrapper.append($existingFooter);
                }
            }

            // Add toggle button and overlay to body
            $('body').append(toggleHtml).append(overlayHtml);

            // Initialise sidebar interactions
            initSidebarToggle();
            initScrollSpy(navItems);
        }

        // Sidebar toggle for mobile
        function initSidebarToggle() {
            const $sidebar = $('#sidebar');
            const $toggle = $('#sidebar-toggle');
            const $overlay = $('#sidebar-overlay');
            const $body = $('body');

            if (!$sidebar.length || !$toggle.length || !$overlay.length) return;

            function openSidebar() {
                $sidebar.addClass('open');
                $overlay.addClass('active');
                $body.css('overflow', 'hidden');
            }

            function closeSidebar() {
                $sidebar.removeClass('open');
                $overlay.removeClass('active');
                $body.css('overflow', '');
            }

            $toggle.on('click', function () {
                if ($sidebar.hasClass('open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });

            $overlay.on('click', closeSidebar);

            // Close on link click (mobile)
            $sidebar.find('.sidebar-link').on('click', function () {
                if (window.innerWidth <= 1024) {
                    closeSidebar();
                }
            });

            // Close on escape key
            $(document).on('keydown', function (e) {
                if (e.key === 'Escape' && $sidebar.hasClass('open')) {
                    closeSidebar();
                }
            });
        }

        // Scroll spy to highlight current section
        function initScrollSpy(navItems) {
            const $links = $('.sidebar-link');
            const sections = navItems.map(item => $('#' + item.id)[0]).filter(Boolean);

            if (sections.length === 0) return;

            // Use Intersection Observer for scroll spy
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        $links.each(function () {
                            const $link = $(this);
                            $link.toggleClass('active', $link.attr('href') === '#' + id);
                        });
                    }
                });
            }, {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            });

            sections.forEach(section => observer.observe(section));
        }

        // Add theme class to body if not present
        const $body = $('body');
        if (!$body.hasClass('dm-theme-light') && !$body.hasClass('dm-theme-dark')) {
            $body.addClass('dm-theme-light');
        }

        // Inject styles into head
        $('head').append(themeStyles);

        // Choose footer based on page type
        const footerToUse = (isPublicPage || isSplashPage) ? publicFooter : footer;

        // Inject navbar container at the start of body
        $body.prepend('<nav id="main-navbar"></nav>');

        // Determine which items to use and initialize navbar component
        const navItems = (isPublicPage || isSplashPage) ? publicItems : showcaseItems;
        Domma.elements.navbar('#main-navbar', {
            brand: {text: 'Domma', url: splashPath},
            items: navItems,
            variant: 'dark',
            position: 'static',
            collapseAt: 992,
            actions: [
                {text: 'Download', url: downloadPath, variant: 'outline'}
            ]
        });

        // Customize brand section with SVG logo + version
        const $brand = $('#main-navbar .dm-navbar-brand-link');
        if ($brand.length) {
            $brand.html(`
                ${logoSvg}
                <span class="dm-navbar-brand-text">
                    Domma
                    <span class="header-version">v${buildInfo.version}</span>
                </span>
            `);
        }

        // Set active state on dropdown toggles for showcase pages
        function setActiveDropdown() {
            if (isPublicPage || isSplashPage) return; // Public pages use flat items with active state
            const dropdowns = $('#main-navbar .dm-navbar-dropdown');
            dropdowns.each(function () {
                const $dd = $(this);
                const links = $dd.find('.dm-navbar-dropdown-item');
                const isActive = links.toArray().some(link => {
                    const href = $(link).attr('href');
                    if (!href) return false;
                    const section = href.split('/').slice(-2, -1)[0];
                    return section && currentSection === section;
                });
                if (isActive) {
                    $dd.find('.dm-navbar-dropdown-toggle').addClass('active');
                }
            });
        }
        setActiveDropdown();

        // Inject theme toggle and variant selector after navbar
        $body.prepend(themeToggle);
        $body.prepend(variantSelector);

        // Inject footer at the end of body
        $body.append(footerToUse);

        // Build sidebar navigation (only on showcase subpages)
        if (isShowcaseSubpage) {
            buildSidebar();
        }

        // Theme toggle functionality
        function updateThemeIcon() {
            const isDark = $body.hasClass('dm-theme-dark');
            isDark ? $('#theme-icon-sun').show() : $('#theme-icon-sun').hide();
            isDark ? $('#theme-icon-moon').hide() : $('#theme-icon-moon').show();
            $('#theme-toggle').attr('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }

        function toggleTheme() {
            const isDark = $body.hasClass('dm-theme-dark');
            $body.removeClass('dm-theme-light dm-theme-dark');
            $body.addClass(isDark ? 'dm-theme-light' : 'dm-theme-dark');

            // Save preference using Domma storage
            storage.set('theme', isDark ? 'light' : 'dark');

            updateThemeIcon();

            // Sync with Domma.theme if available
            if (Domma.theme) {
                Domma.theme.set(isDark ? 'light' : 'dark');
            }
        }

        // Load saved theme preference
        const saved = storage.get('theme');
        if (saved === 'dark') {
            $body.removeClass('dm-theme-light').addClass('dm-theme-dark');
        }

        $('#theme-toggle').on('click', toggleTheme);
        updateThemeIcon();

        // Variant selector functionality
        function setVariant(variant) {
            // Remove existing variant classes
            $body.removeClass('dm-theme-ocean dm-theme-forest dm-theme-sunset dm-theme-royal dm-theme-lemon dm-theme-silver dm-theme-charcoal');

            // Add new variant if specified
            if (variant) {
                $body.addClass('dm-theme-' + variant);
            }

            // Save to storage
            storage.set('theme-variant', variant || '');

            // Sync with Domma.theme if available
            if (Domma.theme) {
                Domma.theme.setVariant(variant || null);
            }

            updateVariantActive();
        }

        function updateVariantActive() {
            const current = storage.get('theme-variant') || '';
            $('.variant-dot').each(function () {
                const $dot = $(this);
                $dot.toggleClass('active', $dot.data('variant') === current);
            });
        }

        // Load saved variant preference
        const savedVariant = storage.get('theme-variant');
        if (savedVariant) {
            $body.addClass('dm-theme-' + savedVariant);
        }

        // Attach click handlers to variant dots
        $('.variant-dot').on('click', function () {
            setVariant($(this).data('variant'));
        });

        updateVariantActive();

        // Back to top - initialise with Domma
        if (Domma.elements && Domma.elements.backToTop) {
            Domma.elements.backToTop('body', {
                duration: 300,
                showAfter: window.innerHeight
            });
        }

        // Code block copy-to-clipboard functionality
        function setupCodeBlockCopy() {
            const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>`;

            const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;

            // Find all code blocks using native DOM
            const codeBlocks = document.querySelectorAll('.code-block');

            codeBlocks.forEach(codeBlock => {
                // Skip if already wrapped
                if (codeBlock.parentElement?.classList.contains('code-block-wrapper')) {
                    return;
                }

                // Create wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                codeBlock.parentNode.insertBefore(wrapper, codeBlock);
                wrapper.appendChild(codeBlock);

                // Create copy button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'code-block-copy';
                copyBtn.innerHTML = copyIcon;
                wrapper.appendChild(copyBtn);

                // Add tooltip if Domma available
                if (Domma?.elements?.tooltip) {
                    try {
                        Domma.elements.tooltip(copyBtn, {
                            content: 'Copy code',
                            position: 'top'
                        });
                    } catch (e) { /* ignore */
                    }
                }

                // Handle click
                copyBtn.addEventListener('click', async function () {
                    const code = codeBlock.textContent;

                    try {
                        // Try Domma utility first, fallback to native
                        if (Domma?.utils?.copyToClipboard) {
                            await Domma.utils.copyToClipboard(code);
                        } else {
                            await navigator.clipboard.writeText(code);
                        }

                        // Show success state
                        copyBtn.classList.add('copied');
                        copyBtn.innerHTML = checkIcon;

                        // Show toast if available
                        if (Domma?.elements?.toast) {
                            Domma.elements.toast.success('Code copied!', {
                                position: 'bottom-center',
                                duration: 2000
                            });
                        }
                    } catch (err) {
                        console.error('Copy failed:', err);
                        if (Domma?.elements?.toast) {
                            Domma.elements.toast.error('Copy failed', {
                                position: 'bottom-center',
                                duration: 2000
                            });
                        }
                    }

                    // Reset after delay
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = copyIcon;
                    }, 2000);
                });
            });
        }

        // Run code block copy setup
        setupCodeBlockCopy();
    }

    // Wait for DOM to be ready before injecting layout
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
