/**
 * Domma Showcase - Shared Layout
 * Injects consistent header, footer, and theme toggle across all showcase pages
 * Uses Domma APIs throughout (now loads after Domma)
 */

(function () {
    // Storage key migration: old domma-theme → new S (domma:) prefix
    const oldTheme = localStorage.getItem('domma-theme');
    if (oldTheme && !S.has('theme')) {
        S.set('theme', oldTheme);
        localStorage.removeItem('domma-theme');
    }
    const oldVariant = localStorage.getItem('domma-theme-variant');
    if (oldVariant && !S.has('theme-variant')) {
        S.set('theme-variant', oldVariant);
        localStorage.removeItem('domma-theme-variant');
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
            path.includes('/grid/');
        const isQuickstart = path.includes('/quickstart/');
        const isSubpage = isShowcaseSubpage;
        const base = isSubpage ? '../' : (isQuickstart ? '../showcase/' : '');
        const splashPath = isSubpage ? '../../index.html' : (isQuickstart ? '../index.html' : '../index.html');

        // Get current page for active nav state
        const currentPage = path.split('/').filter(Boolean).pop()?.replace('.html', '') || 'index';
        const currentSection = path.split('/').filter(Boolean).slice(-2, -1)[0] || '';

        function getNavClass(page) {
            if (currentSection === page) return 'navbar-link active';
            if (currentPage === page) return 'navbar-link active';
            return 'navbar-link';
        }

        // Logo SVG (inline for theme adaptability)
        const logoSvg = `<svg class="navbar-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M12 8 L12 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 8 L24 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 40 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 8 L36 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M36 16 L36 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M36 32 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="24" cy="24" r="3" fill="currentColor"/>
    </svg>`;

        // Create navbar HTML
        const navbar = `
    <nav class="navbar navbar-dark">
        <div class="navbar-brand-group">
            <a href="${splashPath}" class="navbar-brand">${logoSvg} Domma</a>
            <a href="${base}download/index.html" class="pill pill-light">Download</a>
        </div>
        <ul class="navbar-nav">
            <li><a href="${base}config/index.html" class="${getNavClass('config')}">Config</a></li>
            <li><a href="${base}dom/index.html" class="${getNavClass('dom')}">DOM</a></li>
            <li><a href="${base}utils/index.html" class="${getNavClass('utils')}">Utils</a></li>
            <li><a href="${base}dates/index.html" class="${getNavClass('dates')}">Dates</a></li>
            <li><a href="${base}models/index.html" class="${getNavClass('models')}">Models</a></li>
            <li><a href="${base}elements/index.html" class="${getNavClass('elements')}">Elements</a></li>
            <li><a href="${base}grid/index.html" class="${getNavClass('grid')}">Grid</a></li>
            <li><a href="${base}tables/index.html" class="${getNavClass('tables')}">Tables</a></li>
            <li><a href="${base}storage/index.html" class="${getNavClass('storage')}">Storage</a></li>
            <li><a href="${base}http/index.html" class="${getNavClass('http')}">HTTP</a></li>
            <li><a href="${base}icons/index.html" class="${getNavClass('icons')}">Icons</a></li>
            <li><a href="${base}themes/index.html" class="${getNavClass('themes')}">Themes</a></li>
        </ul>
    </nav>`;

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
            background: conic-gradient(#adb5bd 0deg 45deg, #0077b6 45deg 90deg, #2d6a4f 90deg 135deg, #e85d04 135deg 180deg, #4169e1 180deg 225deg, #f0e68c 225deg 270deg, #708090 270deg 315deg, #36454f 315deg 360deg);
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
            background: linear-gradient(135deg, #e85d04, #f77f00);
        }
        .variant-dot-royal {
            background: linear-gradient(135deg, #4169e1, #6495ed);
        }
        .variant-dot-lemon {
            background: linear-gradient(135deg, #f0e68c, #fffacd);
        }
        .variant-dot-silver {
            background: linear-gradient(135deg, #708090, #a0aec0);
        }
        .variant-dot-charcoal {
            background: linear-gradient(135deg, #36454f, #607d8b);
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
    </style>`;

        // Create footer HTML
        const footer = `
    <footer class="footer footer-dark text-center">
        <p class="mb-2">Domma</p>
        <p class="text-sm">&copy; Darryl Waterhouse &amp; DCBW-IT 2025</p>
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
            const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);

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

        // Inject Google Fonts link (more reliable than CSS @import)
        const fontLink = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
        `;
        $('head').prepend(fontLink);

        // Inject styles into head
        $('head').append(themeStyles);

        // Inject navbar at the start of body
        $body.prepend(navbar);

        // Inject theme toggle and variant selector after navbar
        $body.prepend(themeToggle);
        $body.prepend(variantSelector);

        // Inject footer at the end of body
        $body.append(footer);

        // Build sidebar navigation (only on showcase subpages)
        if (isShowcaseSubpage) {
            buildSidebar();
        }

        // Theme toggle functionality
        function updateThemeIcon() {
            const isDark = $body.hasClass('dm-theme-dark');
            isDark ? $('#theme-icon-sun').show() : $('#theme-icon-sun').hide();
            isDark ? $('#theme-icon-moon').hide() : $('#theme-icon-moon').show();
        }

        function toggleTheme() {
            const isDark = $body.hasClass('dm-theme-dark');
            $body.removeClass('dm-theme-light dm-theme-dark');
            $body.addClass(isDark ? 'dm-theme-light' : 'dm-theme-dark');

            // Save preference using Domma storage
            S.set('theme', isDark ? 'light' : 'dark');

            updateThemeIcon();

            // Sync with Domma.theme if available
            if (Domma.theme) {
                Domma.theme.set(isDark ? 'light' : 'dark');
            }
        }

        // Load saved theme preference
        const saved = S.get('theme');
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
            S.set('theme-variant', variant || '');

            // Sync with Domma.theme if available
            if (Domma.theme) {
                Domma.theme.setVariant(variant || null);
            }

            updateVariantActive();
        }

        function updateVariantActive() {
            const current = S.get('theme-variant') || '';
            $('.variant-dot').each(function () {
                const $dot = $(this);
                $dot.toggleClass('active', $dot.data('variant') === current);
            });
        }

        // Load saved variant preference
        const savedVariant = S.get('theme-variant');
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
    }

    // Wait for DOM to be ready before injecting layout
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
