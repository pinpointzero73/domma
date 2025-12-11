/**
 * Domma Layout System
 * Preset-based, configuration-driven layout injection
 */

import {LayoutDetector} from './modules/detector.js';
import {PathResolver} from './modules/path-resolver.js';
import {TemplateLoader} from './modules/template-loader.js';
import {FeaturesModule} from './modules/features.js';
import {SidebarModule} from './modules/sidebar.js';

(async function () {
    // Wait for DOM
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }

    try {
        // Detect preset
        const {preset, variant} = LayoutDetector.detect();
        console.log('[Domma Layout] Detected preset:', preset, variant ? `(${variant})` : '');

        // Load presets configuration
        const depth = PathResolver.detectDepth();
        const configBase = PathResolver.resolve('layouts/config/', depth);
        const templateBase = PathResolver.resolve('layouts/templates/', depth);

        // Initialize template loader
        TemplateLoader.init(templateBase);

        // Load preset config
        const presetsResponse = await fetch(configBase + 'presets.json');
        const presets = await presetsResponse.json();

        let presetConfig = presets[preset];
        if (!presetConfig) {
            console.warn(`[Domma Layout] Preset "${preset}" not found, using minimal`);
            presetConfig = presets.minimal;
        }

        // Apply variant if specified
        if (variant && presetConfig.variants) {
            presetConfig = presetConfig.variants[variant] || presetConfig;
        }

        // Get build info
        const buildInfo = typeof Domma !== 'undefined' && Domma.buildInfo ?
            Domma.buildInfo :
            {version: '1.0.0', built: 'dev', commit: 'dev'};

        const data = {
            version: buildInfo.version,
            buildDate: buildInfo.built || 'dev',
            year: new Date().getFullYear(),
            left: `v${buildInfo.version} · ${buildInfo.built || 'dev'}`,
            right: `© Darryl Waterhouse & DCBW-IT ${new Date().getFullYear()}`
        };

        console.log('[Domma Layout] Preset config:', presetConfig);
        console.log('[Domma Layout] Has navbar:', !!presetConfig.navbar);
        console.log('[Domma Layout] Has footer:', !!presetConfig.footer);

        // Load and process navigation config if needed
        if (presetConfig.navbar && presetConfig.navbar.items && typeof presetConfig.navbar.items === 'string') {
            const navResponse = await fetch(configBase + presetConfig.navbar.items + '.json');
            const navConfig = await navResponse.json();

            // Resolve URLs and calculate active states
            const resolved = PathResolver.resolveNavUrls(navConfig, depth);
            const withActive = PathResolver.calculateActiveStates(resolved);

            presetConfig.navbar.items = withActive.items;
        }

        // Inject critical CSS styles
        injectStyles();

        // Render navbar
        if (presetConfig.navbar) {
            await renderNavbar(presetConfig.navbar, data);
        }

        // Render theme controls
        if (presetConfig.theme && (presetConfig.theme.toggle || presetConfig.theme.variantSelector)) {
            await renderThemeControls(presetConfig.theme);
        }

        // Render footer
        if (presetConfig.footer) {
            await renderFooter(presetConfig.footer, data, configBase);
        }

        // Initialize sidebar
        if (presetConfig.sidebar) {
            SidebarModule.init(presetConfig.sidebar);
        }

        // Initialize features
        if (presetConfig.features) {
            FeaturesModule.init(presetConfig.features);
        }

        console.log('[Domma Layout] Initialization complete');

    } catch (error) {
        console.error('[Domma Layout] Initialization error:', error);
    }

    /**
     * Inject critical CSS styles
     */
    function injectStyles() {
        const styles = `
      <style id="layout-styles">
        /* Theme toggle */
        .theme-toggle {
          position: fixed;
          top: 50vh;
          transform: translateY(-50%);
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
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .theme-toggle:hover {
          background: var(--dm-hover-bg, rgba(0,0,0,0.04));
        }
        .theme-toggle svg {
          color: var(--dm-text, #212529);
        }
        .theme-toggle::after {
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
        .theme-toggle:hover::after {
          opacity: 1;
        }

        /* Variant selector */
        .variant-selector {
          position: fixed;
          top: 50vh;
          transform: translateY(50px);
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
        .variant-trigger::after {
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
        .variant-trigger:hover::after {
          opacity: 1;
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
        .variant-dot-default { background: var(--dm-gray-400, #adb5bd); }
        .variant-dot-ocean { background: linear-gradient(135deg, #0077b6, #48cae4); }
        .variant-dot-forest { background: linear-gradient(135deg, #2d6a4f, #74c69d); }
        .variant-dot-sunset { background: linear-gradient(135deg, #c67b5c, #da9d82); }
        .variant-dot-royal { background: linear-gradient(135deg, #4169e1, #6495ed); }
        .variant-dot-lemon { background: linear-gradient(135deg, #c9b458, #d4c06a); }
        .variant-dot-silver { background: linear-gradient(135deg, #708090, #a0aec0); }
        .variant-dot-charcoal { background: linear-gradient(135deg, #36454f, #607d8b); }
        .variant-dot-christmas { background: linear-gradient(135deg, #c41e3a, #165b33); }
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

        /* Footer */
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

        /* Navbar customizations */
        #main-navbar {
          font-family: var(--dm-font-sans);
        }
        #main-navbar.dm-navbar-dark {
          background: var(--dm-gray-900);
          border-bottom: none;
        }
        #main-navbar .dm-navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        #main-navbar .dm-navbar-brand-text {
          display: inline-flex;
          flex-direction: column;
          line-height: 1.2;
          color: white;
          font-family: inherit;
        }
        #main-navbar .dm-navbar-brand-link {
          text-decoration: none;
          color: inherit;
        }
        #main-navbar .dm-navbar-logo {
          vertical-align: middle;
          margin-right: 0.35rem;
          color: white;
        }
        #main-navbar .dm-navbar-link,
        #main-navbar .dm-navbar-dropdown-toggle,
        #main-navbar .dm-navbar-dropdown-item {
          text-decoration: none;
        }
        #main-navbar .dm-navbar-action {
          border-radius: 9999px;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        #main-navbar .dm-navbar-dropdown-toggle.active {
          color: var(--dm-primary-light);
        }
        #main-navbar .dm-navbar-container {
          max-width: none;
          padding: 0 1rem;
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
          .footer-content {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
            padding: 1rem;
          }
          .page-footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      </style>
    `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /**
     * Render navbar
     */
    async function renderNavbar(config, data) {
        try {
            // Load navbar placeholder template
            const template = await TemplateLoader.load('navbar');
            const html = template({});

            // Inject into page
            const body = document.body;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            body.insertBefore(tempDiv.firstElementChild, body.firstChild);

            // Logo SVG
            const logoSvg = `<svg class="dm-navbar-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M12 8 L12 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 8 L24 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 40 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 8 L36 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M36 16 L36 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M36 32 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="24" cy="24" r="3" fill="currentColor"/>
      </svg>`;

            // Initialize navbar using Domma.elements.navbar()
            if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.navbar) {
                Domma.elements.navbar('#main-navbar', {
                    brand: {text: config.brand?.text || 'Domma', url: config.brand?.url || '/'},
                    items: config.items || [],
                    variant: config.variant || 'dark',
                    position: 'static',
                    collapseAt: 992
                });

                // Customize brand section with logo + version + download button
                const $brandLink = $('#main-navbar .dm-navbar-brand-link');
                const $brandContainer = $('#main-navbar .dm-navbar-brand');

                if ($brandLink.length) {
                    $brandLink.html(`
            ${logoSvg}
            <span class="dm-navbar-brand-text">
              ${config.brand?.text || 'Domma'}
              ${config.brand?.showVersion ? `<span class="header-version">v${data.version}</span>` : ''}
            </span>
          `);
                }

                // Add actions (like Download pill) next to brand if configured
                if ($brandContainer.length && config.actions && config.actions.length > 0) {
                    config.actions.forEach(action => {
                        $brandContainer.append(`<a href="${action.url}" class="${action.class}">${action.text}</a>`);
                    });
                }

                // Set active dropdown for showcase pages
                if (config.items && config.items.length > 0 && config.items[0].items) {
                    setActiveDropdown();
                }
            }

            console.log('[Domma Layout] Navbar rendered');
        } catch (error) {
            console.error('[Domma Layout] Navbar render failed:', error);
        }
    }

    /**
     * Set active state on dropdown toggles
     */
    function setActiveDropdown() {
        const currentPath = window.location.pathname;
        const currentSection = currentPath.split('/').filter(Boolean).pop()?.replace('.html', '') ||
            currentPath.split('/').slice(-2, -1)[0];

        const dropdowns = document.querySelectorAll('#main-navbar .dm-navbar-dropdown');
        dropdowns.forEach(dd => {
            const links = dd.querySelectorAll('.dm-navbar-dropdown-item');
            const isActive = Array.from(links).some(link => {
                const href = link.getAttribute('href');
                if (!href) return false;
                const section = href.split('/').slice(-2, -1)[0];
                return section && currentSection === section;
            });

            if (isActive) {
                const toggle = dd.querySelector('.dm-navbar-dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        });
    }

    /**
     * Render footer
     */
    async function renderFooter(configName, data, configBase) {
        try {
            // Load footer config
            const response = await fetch(configBase + configName + '.json');
            const config = await response.json();

            let html;

            // Handle different footer layouts
            if (config.layout === 'nav') {
                // Public footer with navigation
                const navLinks = config.content.nav.map(item =>
                    `<a href="${item.url}">${item.text}</a>`
                ).join('\n        ');

                html = `
<footer class="${config.class}">
  <div class="page-footer-content">
    <span>${processTemplate(config.content.left, data)}</span>
    <nav class="page-footer-nav">
      ${navLinks}
    </nav>
  </div>
</footer>`;
            } else {
                // Simple footer with left/right content
                const template = await TemplateLoader.load('footer');
                const processedData = {
                    ...config,
                    left: processTemplate(config.content.left, data),
                    right: processTemplate(config.content.right, data)
                };
                html = template(processedData);
            }

            // Inject into page
            document.body.insertAdjacentHTML('beforeend', html);

            console.log('[Domma Layout] Footer rendered');
        } catch (error) {
            console.error('[Domma Layout] Footer render failed:', error);
        }
    }

    /**
     * Render theme controls
     */
    async function renderThemeControls(config) {
        try {
            // Load and inject theme toggle if enabled
            if (config.toggle) {
                const toggleTemplate = await TemplateLoader.load('theme-toggle');
                const toggleHtml = toggleTemplate({});
                document.body.insertAdjacentHTML('afterbegin', toggleHtml);
            }

            // Load and inject variant selector if enabled
            if (config.variantSelector) {
                const variantTemplate = await TemplateLoader.load('variant-selector');
                const variantHtml = variantTemplate({});
                document.body.insertAdjacentHTML('afterbegin', variantHtml);
            }

            // Initialize theme toggle functionality
            if (config.toggle) {
                initThemeToggle();
            }

            // Initialize variant selector functionality
            if (config.variantSelector) {
                initVariantSelector();
            }

            console.log('[Domma Layout] Theme controls rendered');
        } catch (error) {
            console.error('[Domma Layout] Theme controls render failed:', error);
        }
    }

    /**
     * Initialize theme toggle
     */
    function initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const body = document.body;

        if (!toggleBtn) return;

        // Load saved theme
        const storage = typeof Domma !== 'undefined' && Domma.storage ? Domma.storage : null;
        const savedTheme = storage ? storage.get('theme') : null;

        if (savedTheme === 'dark') {
            body.classList.remove('dm-theme-light');
            body.classList.add('dm-theme-dark');
        }

        // Update icon visibility
        function updateThemeIcon() {
            const isDark = body.classList.contains('dm-theme-dark');
            const sunIcon = document.getElementById('theme-icon-sun');
            const moonIcon = document.getElementById('theme-icon-moon');

            // Show icon for CURRENT state (moon in dark, sun in light)
            if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';
            if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
            toggleBtn.setAttribute('data-tooltip', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }

        // Toggle theme
        function toggleTheme() {
            const isDark = body.classList.contains('dm-theme-dark');
            body.classList.remove('dm-theme-light', 'dm-theme-dark');
            body.classList.add(isDark ? 'dm-theme-light' : 'dm-theme-dark');

            // Save preference
            if (storage) {
                storage.set('theme', isDark ? 'light' : 'dark');
            }

            updateThemeIcon();
        }

        toggleBtn.addEventListener('click', toggleTheme);
        updateThemeIcon();
    }

    /**
     * Initialize variant selector
     */
    function initVariantSelector() {
        const selector = document.getElementById('variant-selector');
        if (!selector) return;

        const storage = typeof Domma !== 'undefined' && Domma.storage ? Domma.storage : null;
        const body = document.body;

        // Load saved variant
        const savedVariant = storage ? storage.get('theme-variant') : null;
        if (savedVariant) {
            body.classList.add('dm-theme-' + savedVariant);
        }

        // Set variant
        function setVariant(variant) {
            // Remove existing variant classes
            body.classList.remove('dm-theme-ocean', 'dm-theme-forest', 'dm-theme-sunset',
                'dm-theme-royal', 'dm-theme-lemon', 'dm-theme-silver',
                'dm-theme-charcoal', 'dm-theme-christmas');

            // Add new variant if specified
            if (variant) {
                body.classList.add('dm-theme-' + variant);
            }

            // Save to storage
            if (storage) {
                storage.set('theme-variant', variant || '');
            }

            // Sync with Domma.theme if available
            if (typeof Domma !== 'undefined' && Domma.theme) {
                Domma.theme.setVariant(variant || null);
            }

            updateVariantActive();
        }

        // Update active variant dot
        function updateVariantActive() {
            const current = storage ? storage.get('theme-variant') || '' : '';
            const dots = selector.querySelectorAll('.variant-dot');
            dots.forEach(dot => {
                dot.classList.toggle('active', dot.getAttribute('data-variant') === current);
            });
        }

        // Attach click handlers
        const dots = selector.querySelectorAll('.variant-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                setVariant(dot.getAttribute('data-variant'));
            });
        });

        updateVariantActive();
    }

    /**
     * Process template string
     */
    function processTemplate(template, data) {
        if (!template) return '';
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
    }

})();
