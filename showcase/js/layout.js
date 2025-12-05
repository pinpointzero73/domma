/**
 * Domma Showcase - Shared Layout
 * Injects consistent header, footer, and theme toggle across all showcase pages
 */

(function () {
    function init() {
    // Determine the base path based on current location
    const path = window.location.pathname;
        const isShowcaseSubpage = path.includes('/config/') || path.includes('/dom/') ||
            path.includes('/utils/') || path.includes('/dates/') ||
            path.includes('/models/') || path.includes('/elements/') ||
            path.includes('/tables/') || path.includes('/icons/') ||
            path.includes('/themes/') || path.includes('/storage/') ||
            path.includes('/download/') || path.includes('/http/');
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

        // Add theme class to body if not present
        if (!document.body.classList.contains('dm-theme-light') &&
            !document.body.classList.contains('dm-theme-dark')) {
            document.body.classList.add('dm-theme-light');
        }

        // Inject styles into head
        document.head.insertAdjacentHTML('beforeend', themeStyles);

        // Inject navbar at the start of body
        document.body.insertAdjacentHTML('afterbegin', navbar);

        // Inject theme toggle and variant selector after navbar
        document.body.insertAdjacentHTML('afterbegin', themeToggle);
        document.body.insertAdjacentHTML('afterbegin', variantSelector);

        // Inject footer at the end of body
        document.body.insertAdjacentHTML('beforeend', footer);

        // Theme toggle functionality (works even before Domma loads)
        function updateThemeIcon() {
            const isDark = document.body.classList.contains('dm-theme-dark');
            document.getElementById('theme-icon-sun').style.display = isDark ? 'block' : 'none';
            document.getElementById('theme-icon-moon').style.display = isDark ? 'none' : 'block';
        }

        function toggleTheme() {
            const isDark = document.body.classList.contains('dm-theme-dark');
            document.body.classList.remove('dm-theme-light', 'dm-theme-dark');
            document.body.classList.add(isDark ? 'dm-theme-light' : 'dm-theme-dark');

            // Save preference
            try {
                localStorage.setItem('domma-theme', isDark ? 'light' : 'dark');
            } catch (e) {
            }

            updateThemeIcon();

            // Sync with Domma.theme if available
            if (window.Domma && Domma.theme) {
                Domma.theme.set(isDark ? 'light' : 'dark');
            }
        }

        // Load saved theme preference
        try {
            const saved = localStorage.getItem('domma-theme');
            if (saved === 'dark') {
                document.body.classList.remove('dm-theme-light');
                document.body.classList.add('dm-theme-dark');
            }
        } catch (e) {
        }

        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        updateThemeIcon();

        // Variant selector functionality
        function setVariant(variant) {
            // Remove existing variant classes
            document.body.classList.remove('dm-theme-ocean', 'dm-theme-forest', 'dm-theme-sunset', 'dm-theme-royal', 'dm-theme-lemon', 'dm-theme-silver', 'dm-theme-charcoal');

            // Add new variant if specified
            if (variant) {
                document.body.classList.add(`dm-theme-${variant}`);
            }

            // Save to localStorage
            try {
                localStorage.setItem('domma-theme-variant', variant || '');
            } catch (e) {
            }

            // Sync with Domma.theme if available
            if (window.Domma && Domma.theme) {
                Domma.theme.setVariant(variant || null);
            }

            updateVariantActive();
        }

        function updateVariantActive() {
            let current = '';
            try {
                current = localStorage.getItem('domma-theme-variant') || '';
            } catch (e) {
            }

            document.querySelectorAll('.variant-dot').forEach(dot => {
                dot.classList.toggle('active', dot.dataset.variant === current);
            });
        }

        // Load saved variant preference
        try {
            const savedVariant = localStorage.getItem('domma-theme-variant');
            if (savedVariant) {
                document.body.classList.add(`dm-theme-${savedVariant}`);
            }
        } catch (e) {
        }

        // Attach click handlers to variant dots
        document.querySelectorAll('.variant-dot').forEach(dot => {
            dot.addEventListener('click', () => setVariant(dot.dataset.variant));
        });

        updateVariantActive();

        // Back to top - initialise when Domma is available
        function initBackToTop() {
            if (window.Domma && Domma.elements && Domma.elements.backToTop) {
                Domma.elements.backToTop('body', {
                    duration: 300,
                    showAfter: window.innerHeight
                });
            }
        }

        // Try immediately, or wait for Domma to load
        if (window.Domma) {
            initBackToTop();
        } else {
            window.addEventListener('load', initBackToTop);
        }
    }

    // Wait for DOM to be ready before injecting layout
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
