/**
 * Domma Layout System
 * Preset-based, configuration-driven layout injection
 */

import {LayoutDetector} from './modules/detector.js';
import {PathResolver} from './modules/path-resolver.js';
import {TemplateLoader} from './modules/template-loader.js';
import {FeaturesModule} from './modules/features.js';
import {SidebarModule} from './modules/sidebar.js';
import {SiteSearch} from './modules/search.js';

(async function () {
    // Inject canonical tag as early as possible (before DOMContentLoaded await)
    // so search engines see it even if later layout steps fail.
    injectCanonicalTag();

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
            await renderNavbar(presetConfig.navbar, data, presetConfig);
        }

        // Render breadcrumbs
        if (presetConfig.breadcrumbs && presetConfig.breadcrumbs.enabled) {
            renderBreadcrumbs(presetConfig.breadcrumbs, depth);
        }

        // Render theme controls
        if (presetConfig.theme && (presetConfig.theme.toggle || presetConfig.theme.variantSelector)) {
            await renderThemeControls(presetConfig.theme);
        }

        // Render celebrations controls
        if (presetConfig.celebrations) {
            await renderCelebrationsControls(presetConfig.celebrations);
        }

        // Initialize twinkling stars
        if (presetConfig.twinklingStars && presetConfig.twinklingStars.enabled) {
            await initTwinklingStars(presetConfig.twinklingStars);
        }

        // Render footer
        if (presetConfig.footer) {
            await renderFooter(presetConfig.footer, data, configBase, depth);
        }

        // Initialize cookie consent
        await initCookieConsent();

        // Initialize sidebar
        if (presetConfig.sidebar) {
            await SidebarModule.init(presetConfig.sidebar, configBase);
        }

        // Initialize features
        if (presetConfig.features) {
            FeaturesModule.init(presetConfig.features);
        }

        // Note: Cookie consent is initialized earlier via initCookieConsent() at line 107
        // ConsentModule.init() removed to prevent duplicate consent banners

        // Load analytics tracker (for page view tracking with IP address)
        const analyticsScript = document.createElement('script');
        analyticsScript.src = PathResolver.resolve('assets/js/analytics.js', depth);
        analyticsScript.async = true;
        document.head.appendChild(analyticsScript);
        console.log('[Domma Layout] Analytics tracker loaded');

        console.log('[Domma Layout] Initialization complete');

        // Reveal cloaked content
        document.body.classList.add('dm-ready');

    } catch (error) {
        console.error('[Domma Layout] Initialization error:', error);
        // Reveal content even on error
        document.body.classList.add('dm-ready');
    }

    /**
     * Inject critical CSS styles
     */
    function injectStyles() {
        const styles = `
      <style id="layout-styles">
        /* Celebrations toggle disc */
        .celebrations-toggle-container {
          position: fixed;
          bottom: 91px;
          right: 16px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .celebrations-toggle {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          background: var(--dm-surface, #fff);
          border: 1px solid var(--dm-border, #dee2e6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .celebrations-toggle:hover {
          background: var(--dm-hover-bg, rgba(0,0,0,0.04));
          transform: scale(1.05);
        }
        .celebrations-toggle svg {
          color: var(--dm-text, #212529);
          width: 20px;
          height: 20px;
        }
        .celebrations-toggle.active svg {
          color: var(--dm-primary, #0d6efd);
        }
        .celebrations-toggle::after {
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
        .celebrations-toggle:hover::after {
          opacity: 1;
        }
        .celebrations-slider {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
        }
        .celebrations-toggle-container:hover .celebrations-slider {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .celebrations-intensity-btn {
          padding: 0.35rem 0.6rem;
          background: var(--dm-surface, #fff);
          border: 1px solid var(--dm-border, #dee2e6);
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .celebrations-intensity-btn:hover {
          background: var(--dm-hover-bg, rgba(0,0,0,0.04));
        }
        .celebrations-intensity-btn.active {
          background: var(--dm-primary, #0d6efd);
          color: var(--dm-white, #fff);
          border-color: var(--dm-primary, #0d6efd);
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
          display: grid;
          grid-template-columns: repeat(2, 40px);
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--dm-surface, #fff);
          border: 1px solid var(--dm-border, #dee2e6);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
        /* Ocean - CORRECTED: Dark swatch gets dark colors, Light swatch gets light colors */
        .variant-dot-ocean-dark { background: linear-gradient(135deg, #023e8a, #0077b6); }
        .variant-dot-ocean-light { background: linear-gradient(135deg, #48cae4, #90e0ef); }
        /* Forest - CORRECTED */
        .variant-dot-forest-dark { background: linear-gradient(135deg, #1b4332, #2d6a4f); }
        .variant-dot-forest-light { background: linear-gradient(135deg, #52b788, #95d5b2); }
        /* Sunset - CORRECTED */
        .variant-dot-sunset-dark { background: linear-gradient(135deg, #8b4513, #a0522d); }
        .variant-dot-sunset-light { background: linear-gradient(135deg, #f4a261, #ffc09f); }
        /* Royal - CORRECTED */
        .variant-dot-royal-dark { background: linear-gradient(135deg, #1e3a8a, #2b4c9e); }
        .variant-dot-royal-light { background: linear-gradient(135deg, #6495ed, #a3b8f2); }
        /* Lemon - CORRECTED */
        .variant-dot-lemon-dark { background: linear-gradient(135deg, #854d0e, #a89c3a); }
        .variant-dot-lemon-light { background: linear-gradient(135deg, #fef3c7, #fffbeb); }
        /* Silver - CORRECTED */
        .variant-dot-silver-dark { background: linear-gradient(135deg, #2d3748, #4a5568); }
        .variant-dot-silver-light { background: linear-gradient(135deg, #e2e8f0, #f7fafc); }
        /* Charcoal - CORRECTED */
        .variant-dot-charcoal-dark { background: linear-gradient(135deg, #1a202c, #2d3748); }
        .variant-dot-charcoal-light { background: linear-gradient(135deg, #a0aec0, #cbd5e0); }
        /* Christmas - CORRECTED */
        .variant-dot-christmas-dark { background: linear-gradient(135deg, #0A1A10, #1A3020); }
        .variant-dot-christmas-light { background: linear-gradient(135deg, #228B22, #C41E3A); }
        /* Unicorn */
        .variant-dot-unicorn-dark { background: linear-gradient(135deg, #1a0e24, #4a2660); }
        .variant-dot-unicorn-light { background: linear-gradient(135deg, #e91e90, #9b59b6); }
        /* Dreamy */
        .variant-dot-dreamy-dark { background: linear-gradient(135deg, #1c1410, #4e342e); }
        .variant-dot-dreamy-light { background: linear-gradient(135deg, #d7ccc8, #8d6e63); }
        /* Grayve */
        .variant-dot-grayve-dark { background: linear-gradient(135deg, #1a1e21, #343A40); }
        .variant-dot-grayve-light { background: linear-gradient(135deg, #e0f7fa, #00838f); }
        /* Mint */
        .variant-dot-mint-dark { background: linear-gradient(135deg, #1e3a2f, #2e6e52); }
        .variant-dot-mint-light { background: linear-gradient(135deg, #d4f5e4, #2e9e6e); }
        /* Wedding */
        .variant-dot-wedding-light { background: linear-gradient(135deg, #FFFDF7, #C5A55A); }
        .variant-dot-wedding-dark { background: linear-gradient(135deg, #12121F, #C5A55A); }
        /* Admin */
        .variant-dot-admin-smooth-steel { background: linear-gradient(135deg, #586170, #3b76bc); }
        .variant-dot-admin-smooth-indigo { background: linear-gradient(135deg, #586170, #5b63a8); }
        .variant-dot-admin-smooth-teal { background: linear-gradient(135deg, #586170, #2a8178); }
        .variant-dot-admin-sharp-steel { background: linear-gradient(135deg, #eef1f6, #3b76bc); }
        .variant-dot-admin-sharp-indigo { background: linear-gradient(135deg, #eef1f6, #5b63a8); }
        .variant-dot-admin-sharp-teal { background: linear-gradient(135deg, #eef1f6, #2a8178); }
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

        /* Variant selector inline override */
        .variant-selector.variant-selector-inline {
          position: static !important;
          top: auto !important;
          right: auto !important;
          transform: none !important;
          display: flex;
          align-items: center;
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

        /* Auth Modal Styles */
        .auth-user-display {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--dm-gray-50, #f9fafb);
          border-radius: 8px;
        }
        .auth-user-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--dm-primary, #0d6efd);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .auth-user-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.25rem;
        }
        .auth-user-name {
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--dm-gray-900, #212529);
        }
        .auth-user-email {
          font-size: 0.875rem;
          color: var(--dm-gray-600, #6c757d);
        }
        .auth-user-role {
          margin-top: 0.5rem;
        }
        #authModalTabs {
          margin-bottom: 1.5rem;
        }
        #authModalLoginForm,
        #authModalRegisterForm {
          display: none;
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

        /* Consent Banner */
        .consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: var(--dm-surface, #fff);
          border-top: 1px solid var(--dm-border, #dee2e6);
          box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
          padding: 1rem 2rem;
          animation: slideUp 0.3s ease;
        }

        .consent-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          gap: 2rem;
        }

        .consent-message {
          flex: 1;
          font-size: 0.9rem;
          color: var(--dm-text, #212529);
        }

        .consent-actions {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .consent-banner {
            padding: 1rem;
          }
          .consent-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          .consent-actions {
            width: 100%;
          }
          .consent-actions .btn {
            width: 100%;
          }
        }
        /* Breadcrumbs pill overlay */
        .layout-breadcrumbs-pill {
          position: absolute;
          top: 1rem;
          left: 1.5rem;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border-radius: 999px;
          padding: 0.35rem 0.9rem;
          font-size: 0.8rem;
        }

        .layout-breadcrumbs-pill .dm-breadcrumbs {
          padding: 0;
          margin: 0;
          font-size: inherit;
          gap: 0.35rem;
        }

        .layout-breadcrumbs-pill .dm-breadcrumbs-item {
          color: rgba(255, 255, 255, 0.75);
        }

        .layout-breadcrumbs-pill .dm-breadcrumbs-link:hover {
          color: white;
        }

        .layout-breadcrumbs-pill .dm-breadcrumbs-separator {
          color: rgba(255, 255, 255, 0.4);
          opacity: 1;
        }

        .layout-breadcrumbs-pill .dm-breadcrumbs-item.active {
          color: white;
          font-weight: 500;
        }

        /* Fallback bar when no hero exists */
        .layout-breadcrumbs-bar {
          padding: 0.5rem 2rem;
          background: var(--dm-surface, #fff);
          border-bottom: 1px solid var(--dm-border, #dee2e6);
        }

        .layout-breadcrumbs-bar .dm-breadcrumbs {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
        }

        @media (max-width: 576px) {
          .layout-breadcrumbs-pill {
            top: 0.5rem;
            left: 0.75rem;
            font-size: 0.7rem;
            padding: 0.25rem 0.6rem;
          }
        }

      </style>
    `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /**
     * Render theme selector action
     */
    function renderThemeSelector(action, container) {
        const position = action.position || 'inline';
        const selectorClass = position === 'inline' ? 'variant-selector variant-selector-inline' : 'variant-selector';

        const themeSelectorHtml = `
            <div class="${selectorClass}" id="variant-selector">
                <button class="variant-trigger" data-tooltip="Theme variants (26)"></button>
                <div class="variant-options">
                    <button class="variant-dot variant-dot-ocean-light" data-theme="ocean-light" data-tooltip="Ocean Light ☀️"></button>
                    <button class="variant-dot variant-dot-ocean-dark" data-theme="ocean-dark" data-tooltip="Ocean Dark 🌙"></button>
                    <button class="variant-dot variant-dot-forest-light" data-theme="forest-light" data-tooltip="Forest Light ☀️"></button>
                    <button class="variant-dot variant-dot-forest-dark" data-theme="forest-dark" data-tooltip="Forest Dark 🌙"></button>
                    <button class="variant-dot variant-dot-sunset-light" data-theme="sunset-light" data-tooltip="Sunset Light ☀️"></button>
                    <button class="variant-dot variant-dot-sunset-dark" data-theme="sunset-dark" data-tooltip="Sunset Dark 🌙"></button>
                    <button class="variant-dot variant-dot-royal-light" data-theme="royal-light" data-tooltip="Royal Light ☀️"></button>
                    <button class="variant-dot variant-dot-royal-dark" data-theme="royal-dark" data-tooltip="Royal Dark 🌙"></button>
                    <button class="variant-dot variant-dot-lemon-light" data-theme="lemon-light" data-tooltip="Lemon Light ☀️"></button>
                    <button class="variant-dot variant-dot-lemon-dark" data-theme="lemon-dark" data-tooltip="Lemon Dark 🌙"></button>
                    <button class="variant-dot variant-dot-silver-light" data-theme="silver-light" data-tooltip="Silver Light ☀️"></button>
                    <button class="variant-dot variant-dot-silver-dark" data-theme="silver-dark" data-tooltip="Silver Dark 🌙"></button>
                    <button class="variant-dot variant-dot-charcoal-light" data-theme="charcoal-light" data-tooltip="Charcoal Light ☀️"></button>
                    <button class="variant-dot variant-dot-charcoal-dark" data-theme="charcoal-dark" data-tooltip="Charcoal Dark 🌙"></button>
                    <button class="variant-dot variant-dot-christmas-light" data-theme="christmas-light" data-tooltip="Christmas Day ❄️"></button>
                    <button class="variant-dot variant-dot-christmas-dark" data-theme="christmas-dark" data-tooltip="Christmas Eve 🎄"></button>
                    <button class="variant-dot variant-dot-unicorn-light" data-theme="unicorn-light" data-tooltip="Unicorn Light ☀️"></button>
                    <button class="variant-dot variant-dot-unicorn-dark" data-theme="unicorn-dark" data-tooltip="Unicorn Dark 🌙"></button>
                    <button class="variant-dot variant-dot-dreamy-light" data-theme="dreamy-light" data-tooltip="Dreamy Light ☀️"></button>
                    <button class="variant-dot variant-dot-dreamy-dark" data-theme="dreamy-dark" data-tooltip="Dreamy Dark 🌙"></button>
                    <button class="variant-dot variant-dot-grayve-light" data-theme="grayve-light" data-tooltip="Grayve Light ☀️"></button>
                    <button class="variant-dot variant-dot-grayve-dark" data-theme="grayve-dark" data-tooltip="Grayve Dark 🌙"></button>
                    <button class="variant-dot variant-dot-mint-light" data-theme="mint-light" data-tooltip="Mint Light ☀️"></button>
                    <button class="variant-dot variant-dot-mint-dark" data-theme="mint-dark" data-tooltip="Mint Dark 🌙"></button>
                    <button class="variant-dot variant-dot-wedding-light" data-theme="wedding-light" data-tooltip="Wedding Day ☀️"></button>
                    <button class="variant-dot variant-dot-wedding-dark" data-theme="wedding-dark" data-tooltip="Wedding Evening 🌙"></button>
                    <button class="variant-dot variant-dot-admin-smooth-steel" data-theme="admin-smooth-steel" data-tooltip="Admin Smooth · Steel"></button>
                    <button class="variant-dot variant-dot-admin-smooth-indigo" data-theme="admin-smooth-indigo" data-tooltip="Admin Smooth · Indigo"></button>
                    <button class="variant-dot variant-dot-admin-smooth-teal" data-theme="admin-smooth-teal" data-tooltip="Admin Smooth · Teal"></button>
                    <button class="variant-dot variant-dot-admin-sharp-steel" data-theme="admin-sharp-steel" data-tooltip="Admin Sharp · Steel"></button>
                    <button class="variant-dot variant-dot-admin-sharp-indigo" data-theme="admin-sharp-indigo" data-tooltip="Admin Sharp · Indigo"></button>
                    <button class="variant-dot variant-dot-admin-sharp-teal" data-theme="admin-sharp-teal" data-tooltip="Admin Sharp · Teal"></button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', themeSelectorHtml);
        setTimeout(() => initVariantSelector(), 100);
    }

    /**
     * Render auth actions (Login/Register/Logout)
     */
    async function renderAuthActions(action, container, data) {
        const { levelsUp, user } = data;
        const loginPath = action.loginUrl || '/login/index.html';

        // Add Login/Logout link
        const loginLogoutHtml = user
            ? `<a href="#" class="navbar-action-link" id="navbar-logout">Logout</a>`
            : `<a href="${loginPath}" class="navbar-action-link">Login/Register</a>`;
        container.insertAdjacentHTML('beforeend', loginLogoutHtml);

        // Bind logout handler
        if (user) {
            const $logoutLink = $('#navbar-logout');
            if ($logoutLink.length) {
                $logoutLink.on('click', (e) => {
                    e.preventDefault();
                    Domma.auth.logout();
                    const homePath = levelsUp > 0 ? '../'.repeat(levelsUp) + 'index.html' : 'index.html';
                    window.location.href = homePath;
                });
            }
        }
    }

    /**
     * Render custom button action
     */
    function renderCustomButton(action, container) {
        const buttonHtml = `<a href="${action.url || '#'}" class="navbar-action-link ${action.class || ''}">${action.text || 'Button'}</a>`;
        container.insertAdjacentHTML('beforeend', buttonHtml);
    }

    /**
     * Render the search icon button that opens the site-wide search overlay
     */
    function renderSearchIcon(action, container) {
        const btn = document.createElement('button');
        btn.className = 'search-btn-trigger';
        btn.setAttribute('aria-label', 'Search');
        btn.setAttribute('title', 'Search (Ctrl+K)');

        const icon = document.createElement('span');
        icon.setAttribute('data-icon', 'search');
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);

        btn.addEventListener('click', () => SiteSearch.open());
        container.appendChild(btn);

        // Scan the icon immediately
        if (typeof Domma !== 'undefined' && Domma.icons && Domma.icons.scan) {
            Domma.icons.scan(btn);
        } else if (typeof I !== 'undefined' && I.scan) {
            I.scan(btn);
        }
    }

    /**
     * Render all navbar actions from config
     */
    async function renderNavbarActions(actionsConfig, container, data) {
        if (!actionsConfig || actionsConfig.length === 0) return;

        for (const action of actionsConfig) {
            switch (action.type) {
                case 'search':
                    renderSearchIcon(action, container);
                    break;
                case 'theme-selector':
                    renderThemeSelector(action, container);
                    break;
                case 'auth':
                    await renderAuthActions(action, container, data);
                    break;
                case 'button':
                    renderCustomButton(action, container);
                    break;
            }
        }
    }

    /**
     * Render navbar
     */
    async function renderNavbar(config, data, presetConfig) {
        try {
            // Check if navbar already exists in HTML
            const navbarExists = document.getElementById('main-navbar');

            // Only load and inject template if navbar doesn't exist
            if (!navbarExists) {
                const template = await TemplateLoader.load('navbar');
                const html = template({});

                // Inject into page (safe: template is from trusted local source)
                const body = document.body;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                body.insertBefore(tempDiv.firstElementChild, body.firstChild);
            }

            // Logo SVG
            const logoSvg = `<svg class="navbar-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M12 8 L12 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 8 L24 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 40 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 8 L36 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M36 16 L36 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M36 32 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="24" cy="24" r="3" fill="currentColor"/>
      </svg>`;

            // Initialize Domma.auth FIRST (so it loads user from localStorage)
            if (typeof Domma !== 'undefined' && Domma.auth && !Domma.auth.initialized) {
                // Use localhost API for local dev, relative path for production
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                Domma.auth.init({
                    apiUrl: isLocal ? 'http://localhost:3000/api' : '/api'
                });
            }

            // Initialize navbar using Domma.elements.navbar()
            if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.navbar) {
                // Build complete items array with Admin, Download and Login/Logout
                const navItems = [];

                // Get user for role checking
                const user = Domma.auth?.getUser();
                const pathParts = window.location.pathname.split('/').filter(Boolean);
                // Calculate levels up correctly: for /miniapps/garage/, pathParts = ['miniapps', 'garage']
                // We need 2 levels up (../../) to reach root, so use pathParts.length directly
                const levelsUp = pathParts.length;
                const adminPath = levelsUp > 0 ? '../'.repeat(levelsUp) + 'admin/index.html' : 'admin/index.html';

                // Add existing nav items from config (only navigation items, not Login/Logout)
                if (config.items && config.items.length > 0) {
                    navItems.push(...config.items);
                }

                // Prepare actions for the right side
                const loginPath = '/login/index.html';

                Domma.elements.navbar('#main-navbar', {
                    brand: {text: config.brand?.text || 'Domma', url: config.brand?.url || '/'},
                    items: navItems,
                    variant: config.variant || 'dark',
                    position: 'static',
                    collapseAt: 992
                });

                // Customise brand section with logo + version
                const $brandLink = $('#main-navbar .navbar-brand-link');
                const $brandContainer = $('#main-navbar .navbar-brand');

                if ($brandLink.length) {
                    $brandLink.html(`
            ${logoSvg}
            <span class="navbar-brand-text">
              ${config.brand?.text || 'Domma'}
              ${config.brand?.showVersion ? `<span class="header-version">v${data.version}</span>` : ''}
            </span>
          `, {safe: false});
                }

                // Add user name and role badge next to brand if logged in
                if ($brandContainer.length && user) {
                    const userName = user.name || user.email.split('@')[0];
                    const userRole = user.role || 'guest';

                    // Determine badge colour based on role
                    const roleBadgeClass = {
                        admin: 'badge-danger',
                        subscriber: 'badge-primary',
                        guest: 'badge-secondary'
                    }[userRole] || 'badge-secondary';

                    // Create clickable link for admin users, span for others
                    const isAdmin = userRole === 'admin';
                    const userInfoEl = document.createElement(isAdmin ? 'a' : 'span');
                    userInfoEl.className = 'navbar-user-info';

                    // Set href for admin users
                    if (isAdmin) {
                        userInfoEl.href = adminPath;
                        userInfoEl.style.cssText = 'margin-left: 1rem; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; cursor: pointer;';
                    } else {
                        userInfoEl.style.cssText = 'margin-left: 1rem; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem;';
                    }

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = `Hello, ${userName}`;

                    const badge = document.createElement('span');
                    badge.className = `badge ${roleBadgeClass}`;
                    badge.style.cssText = 'text-transform: capitalize; font-size: 0.75rem;';
                    badge.textContent = userRole;

                    userInfoEl.appendChild(nameSpan);
                    userInfoEl.appendChild(badge);
                    $brandContainer.get(0).appendChild(userInfoEl);
                }

                // Add "What's New?" pill (visible to all visitors)
                if ($brandContainer.length) {
                    const changelogPill = document.createElement('a');
                    changelogPill.href = levelsUp > 0 ? '../'.repeat(levelsUp) + 'changelog/' : 'changelog/';
                    changelogPill.className = 'navbar-changelog-pill';
                    changelogPill.style.cssText = 'margin-left: 1rem; text-decoration: none;';

                    const pillBadge = document.createElement('span');
                    pillBadge.className = 'badge badge-info';
                    pillBadge.textContent = "What's New?";
                    changelogPill.appendChild(pillBadge);

                    // Check for new releases (pulse animation)
                    const lastSeen = localStorage.getItem('domma:lastSeenVersion');
                    const dataPath = levelsUp > 0 ? '../'.repeat(levelsUp) + 'data/releases.json' : 'data/releases.json';
                    fetch(dataPath)
                        .then(r => r.json())
                        .then(data => {
                            if (data.latestVersion && data.latestVersion !== lastSeen) {
                                pillBadge.classList.add('badge-pulse');
                            }
                        })
                        .catch(() => {}); // Fail silently

                    $brandContainer.get(0).appendChild(changelogPill);
                }

                // Inject navbar actions (config-driven or legacy fallback)
                const $navbarCollapse = $('#main-navbar .navbar-collapse');
                if ($navbarCollapse.length) {
                    // Create or get navbar-actions div
                    let $navbarActions = $('#main-navbar .navbar-actions');
                    if (!$navbarActions.length) {
                        $navbarCollapse.get(0).insertAdjacentHTML('beforeend', '<div class="navbar-actions"></div>');
                        $navbarActions = $('#main-navbar .navbar-actions');
                    }

                    // Determine actions from config or use legacy fallback
                    let actions = config.actions || [];

                    // Legacy fallback: if no config.actions, build from old structure
                    if (actions.length === 0) {
                        // Always add auth action (Login/Register/Logout)
                        actions.push({ type: 'auth', loginUrl: loginPath });

                        // Add theme selector if configured in legacy structure
                        if (presetConfig.theme && presetConfig.theme.variantSelector) {
                            const position = presetConfig.theme.position === 'fixed-right' ? 'fixed-right' : 'inline';
                            actions.push({ type: 'theme-selector', position });
                        }
                    }

                    // Render all actions from config
                    await renderNavbarActions(actions, $navbarActions.get(0), { levelsUp, user });

                    // Initialise site search (non-blocking - fetches index in background)
                    SiteSearch.init(levelsUp).catch(() => {});
                }

                // Set up auth state listeners to reload page on auth changes
                if (typeof Domma !== 'undefined' && Domma.auth) {
                    Domma.auth.on('login', () => window.location.reload());
                    Domma.auth.on('logout', () => window.location.reload());
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
     * Initialize cookie consent
     */
    async function initCookieConsent() {
        try {
            // Check if Domma elements is available
            if (typeof Domma === 'undefined' || !Domma.elements || !Domma.elements.cookieConsent) {
                console.log('[Domma Layout] Cookie consent not available');
                return;
            }

            // Check if we already have consent stored
            const consentKey = 'domma-cookie-consent';
            const existingConsent = localStorage.getItem(consentKey);

            // Initialize cookie consent
            const consent = Domma.elements.cookieConsent({
                message: 'We use cookies to enhance your browsing experience and analyze site usage. By continuing to use this site, you consent to our use of cookies.',
                categories: {
                    necessary: {
                        label: 'Essential Cookies',
                        description: 'Required for the website to function properly.',
                        required: true
                    },
                    analytics: {
                        label: 'Analytics Cookies',
                        description: 'Help us understand how visitors interact with our website.',
                        required: false
                    },
                    preferences: {
                        label: 'Preference Cookies',
                        description: 'Remember your settings and preferences.',
                        required: false
                    }
                },
                privacyPolicyUrl: '/privacy',
                cookiePolicyUrl: '/cookies',
                position: 'bottom',
                layout: 'bar',
                theme: 'dark',
                storageKey: consentKey,
                storageDuration: 365, // 1 year
                reopenSelector: '[data-cookie-consent-open]',
                onAccept: (preferences) => {
                    console.log('[Domma Layout] Cookie consent accepted:', preferences);
                    // Enable analytics if accepted
                    if (preferences.analytics) {
                        // Enable Google Analytics or other tracking
                        console.log('[Domma Layout] Analytics cookies enabled');
                    }
                },
                onReject: () => {
                    console.log('[Domma Layout] Cookie consent rejected');
                },
                onChange: (preferences) => {
                    console.log('[Domma Layout] Cookie preferences changed:', preferences);
                }
            });

            console.log('[Domma Layout] Cookie consent initialized');
        } catch (error) {
            console.error('[Domma Layout] Cookie consent init failed:', error);
        }
    }

    /**
     * Set active state on dropdown toggles
     */
    function setActiveDropdown() {
        const currentPath = window.location.pathname;
        const currentSection = currentPath.split('/').filter(Boolean).pop()?.replace('.html', '') ||
            currentPath.split('/').slice(-2, -1)[0];

        const dropdowns = document.querySelectorAll('#main-navbar .navbar-dropdown');
        dropdowns.forEach(dd => {
            const links = dd.querySelectorAll('.navbar-dropdown-item');
            const isActive = Array.from(links).some(link => {
                const href = link.getAttribute('href');
                if (!href) return false;
                const section = href.split('/').slice(-2, -1)[0];
                return section && currentSection === section;
            });

            if (isActive) {
                const toggle = dd.querySelector('.navbar-dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        });
    }

    /**
     * Resolve footer URLs to prevent path-doubling from relative hrefs
     * (e.g. "blog/index.html" from depth-2 page → "../../blog/index.html")
     */
    function resolveFooterConfig(config, depth) {
        const resolveUrl = (url) => (url ? PathResolver.resolve(url, depth) : url);
        const resolved = {...config};

        if (resolved.brand && resolved.brand.url) {
            resolved.brand = {...resolved.brand, url: resolveUrl(resolved.brand.url)};
        }

        if (Array.isArray(resolved.columns)) {
            resolved.columns = resolved.columns.map(col => ({
                ...col,
                links: (col.links || []).map(link => {
                    if (link.external || !link.url || link.url === '#' || link.url.startsWith('#')) return link;
                    return {...link, url: resolveUrl(link.url)};
                })
            }));
        }

        if (Array.isArray(resolved.links)) {
            resolved.links = resolved.links.map(link => {
                if (link.external || !link.url || link.url === '#' || link.url.startsWith('#')) return link;
                return {...link, url: resolveUrl(link.url)};
            });
        }

        return resolved;
    }

    /**
     * Render footer
     */
    async function renderFooter(configName, data, configBase, depth = 0) {
        try {
            // Load footer config
            const response = await fetch(configBase + configName + '.json');
            const config = await response.json();

            // Check if this uses the Domma Footer Element component
            if (config.type === 'element') {
                // Create footer container
                const footerId = 'domma-footer-element';
                const footerDiv = document.createElement('div');
                footerDiv.id = footerId;
                document.body.appendChild(footerDiv);

                // Resolve URLs (brand, column links) so relative paths don't double-up
                const resolvedConfig = resolveFooterConfig(config, depth);

                // Process copyright template
                const footerOptions = {
                    ...resolvedConfig,
                    copyright: processTemplate(resolvedConfig.copyright || '', data)
                };

                // Remove 'type' from options (not a valid Domma.elements.footer option)
                delete footerOptions.type;

                // Initialize Domma Footer Element
                if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.footer) {
                    Domma.elements.footer(`#${footerId}`, footerOptions);
                    console.log('[Domma Layout] Footer Element rendered');
                } else {
                    console.error('[Domma Layout] Domma.elements.footer not available');
                }
                return;
            }

            // Legacy footer layouts
            let html;

            // Handle different footer layouts
            if (config.layout === 'nav') {
                // Public footer with navigation - resolve URLs to prevent path-doubling
                const navLinks = config.content.nav.map(item => {
                    // Build attributes string if present
                    let attrs = '';
                    if (item.attributes) {
                        attrs = Object.entries(item.attributes)
                          .map(([key, value]) => `${key}="${value}"`)
                          .join(' ');
                    }
                    const resolvedUrl = (!item.url || item.url === '#' || item.url.startsWith('#'))
                        ? item.url
                        : PathResolver.resolve(item.url, depth);
                    return `<a href="${resolvedUrl}"${attrs ? ' ' + attrs : ''}>${item.text}</a>`;
                }).join('\n        ');

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
     * Build breadcrumb items from the current URL path
     * @param {Object} config - Breadcrumb config
     * @param {number} depth - Page depth
     * @returns {Array} Items array for Domma Breadcrumbs component
     */
    function buildBreadcrumbItems(config, depth) {
        const labelMap = {
            dom: 'DOM', utils: 'Utils', http: 'HTTP', css: 'CSS',
            faq: 'FAQs', api: 'API', spa: 'SPA', mpa: 'MPA',
            'theme-roller': 'Theme Roller', 'page-roller': 'Page Roller',
            'button-group': 'Button Group', 'back-to-top': 'Back to Top',
            'cookie-consent': 'Cookie Consent',
            'desktop-notification': 'Desktop Notification',
            'print-to-pdf': 'Print to PDF',
            ...(config.labelOverrides || {})
        };

        const toLabel = (segment) => {
            if (labelMap[segment]) return labelMap[segment];
            return segment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
        };

        const path = window.location.pathname;
        // Filter out empty segments, 'public', and 'index.html'
        const segments = path.split('/').filter(s => s && s !== 'public' && s !== 'index.html');

        // Need at least 2 segments (e.g. showcase + dom) to show breadcrumbs
        if (segments.length < 1) return [];

        const base = PathResolver.getBasePath(depth);
        const homeLabel = config.homeLabel || 'Home';
        const homeUrl = config.homeUrl || 'index.html';

        const items = [
            {
                text: homeLabel,
                url: base + homeUrl
            }
        ];

        // Build intermediate items
        for (let i = 0; i < segments.length - 1; i++) {
            const stepsUp = depth - (i + 1);
            const segUrl = stepsUp > 0
                ? '../'.repeat(stepsUp) + 'index.html'
                : 'index.html';
            items.push({
                text: toLabel(segments[i]),
                url: segUrl
            });
        }

        // Last segment - extract label from <title>, stripping common suffixes
        const lastSegment = segments[segments.length - 1];
        let lastText = toLabel(lastSegment);
        const titleText = document.title;
        if (titleText) {
            const stripped = titleText
                .replace(/\s*[·\-|]\s*(Domma(JS)?( Showcase| Framework)?)/gi, '')
                .trim();
            if (stripped) lastText = stripped;
        }

        items.push({ text: lastText, active: true });

        return items;
    }

    /**
     * Render frosted glass breadcrumb pill into the hero section (or a fallback bar)
     * @param {Object} config - Breadcrumb config from preset
     * @param {number} depth - Page depth
     */
    function renderBreadcrumbs(config, depth) {
        try {
            const items = buildBreadcrumbItems(config, depth);
            if (!items.length) return;

            // Outer wrapper holds the pill styling; inner div is the Domma target
            // (Breadcrumbs._render() overwrites element.className, so we need two layers)
            const hero = document.querySelector('.hero');
            let wrapperEl;

            if (hero) {
                wrapperEl = document.createElement('nav');
                wrapperEl.id = 'layout-breadcrumbs';
                wrapperEl.setAttribute('aria-label', 'Breadcrumb navigation');
                wrapperEl.className = 'layout-breadcrumbs-pill';
                hero.prepend(wrapperEl);
            } else {
                // Fallback: insert a bar below the navbar
                wrapperEl = document.createElement('nav');
                wrapperEl.id = 'layout-breadcrumbs';
                wrapperEl.setAttribute('aria-label', 'Breadcrumb navigation');
                wrapperEl.className = 'layout-breadcrumbs-bar';
                const navbar = document.querySelector('.navbar, nav[class*="navbar"], #layout-navbar');
                if (navbar && navbar.nextSibling) {
                    navbar.parentNode.insertBefore(wrapperEl, navbar.nextSibling);
                } else {
                    document.body.prepend(wrapperEl);
                }
            }

            // Inner target for the Domma Breadcrumbs component
            const inner = document.createElement('div');
            inner.id = 'layout-breadcrumbs-inner';
            wrapperEl.appendChild(inner);

            if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.breadcrumbs) {
                Domma.elements.breadcrumbs('#layout-breadcrumbs-inner', {
                    items,
                    separator: config.separator || 'chevron',
                    homeIcon: config.homeIcon || false,
                    responsive: true
                });
                console.log('[Domma Layout] Breadcrumbs rendered');
            } else {
                console.warn('[Domma Layout] Domma.elements.breadcrumbs not available');
            }
        } catch (error) {
            console.error('[Domma Layout] Breadcrumbs render failed:', error);
        }
    }

    /**
     * Render theme controls
     * Note: Theme selector is now injected inline in navbar during navbar rendering
     * This function is kept for backwards compatibility but does nothing
     */
    async function renderThemeControls(config) {
        try {
            // Theme selector is now rendered inline in navbar
            // Skip rendering here to avoid duplicates
            console.log('[Domma Layout] Theme controls skipped (rendered inline in navbar)');
        } catch (error) {
            console.error('[Domma Layout] Theme controls render failed:', error);
        }
    }

    /**
     * Initialize variant selector
     */
    function initVariantSelector() {
        const selector = document.getElementById('variant-selector');
        if (!selector) return;

        // Check if ThemeEngine is available
        if (typeof Domma === 'undefined' || !Domma.theme) {
            console.warn('[Domma Layout] ThemeEngine not available, variant selector disabled');
            return;
        }

        const themeEngine = Domma.theme;

        // Set theme
        function setTheme(themeName) {
            if (!themeName) return;

            // Use ThemeEngine to apply theme (handles storage, classes, and notifications)
            themeEngine.set(themeName);

            // Update active state
            updateActiveState();
        }

        // Update active theme dot
        function updateActiveState() {
            const currentTheme = themeEngine.get(); // Returns full theme like 'ocean-dark'
            const dots = selector.querySelectorAll('.variant-dot');

            dots.forEach(dot => {
                const dotTheme = dot.getAttribute('data-theme');
                dot.classList.toggle('active', dotTheme === currentTheme);
            });
        }

        // Attach click handlers
        const dots = selector.querySelectorAll('.variant-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                setTheme(dot.getAttribute('data-theme'));
            });
        });

        // Listen for theme changes from other sources (e.g., ThemeRoller)
        themeEngine.onChange((oldTheme, newTheme) => {
            updateActiveState();
        });

        // Initial update
        updateActiveState();
    }

    /**
     * Check if current date is in festive season (Dec 1 - Jan 3)
     */
    /**
     * Check if any celebration is currently active
     * (Delegated to CelebrationsEffect module)
     */
    async function isCelebrationSeason() {
        try {
            const { CelebrationsEffect } = await import('./modules/celebrations/index.js');
            return CelebrationsEffect.isCelebrationSeason();
        } catch (error) {
            console.error('[Domma Layout] Failed to check celebration season:', error);
            return false;
        }
    }

    /**
     * Render celebrations toggle disc
     */
    async function renderCelebrationsControls(config) {
        try {
            const isSeason = await isCelebrationSeason();
            if (!config.toggle || !isSeason) {
                return; // Only show during celebration season
            }

            // Get sparkles icon from Domma icon system
            const sparklesIcon = typeof Domma !== 'undefined' && Domma.icons
              ? Domma.icons.html('sparkles', {size: 20})
              : '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 1l2.5 6.5L21 10l-6.5 2.5L12 19l-2.5-6.5L3 10l6.5-2.5L12 1z"/></svg>';

            // Create celebrations toggle HTML
            const toggleHtml = `
                <div class="celebrations-toggle-container">
                    <button class="celebrations-toggle" id="celebrations-toggle" data-tooltip="Celebration effects">
                        ${sparklesIcon}
                    </button>
                    <div class="celebrations-slider" id="celebrations-slider">
                        <button class="celebrations-intensity-btn" data-intensity="light">Light</button>
                        <button class="celebrations-intensity-btn" data-intensity="medium">Medium</button>
                        <button class="celebrations-intensity-btn" data-intensity="heavy">Heavy</button>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('afterbegin', toggleHtml);

            const { CelebrationsEffect } = await import('./modules/celebrations/index.js');
            initCelebrationsToggle(CelebrationsEffect);

            console.log('[Domma Layout] Celebrations toggle rendered');
        } catch (error) {
            console.error('[Domma Layout] Celebrations toggle render failed:', error);
        }
    }

    /**
     * Initialize celebrations toggle
     */
    function initCelebrationsToggle(CelebrationsEffect) {
        const toggleBtn = document.getElementById('celebrations-toggle');
        const slider = document.getElementById('celebrations-slider');

        if (!toggleBtn || !slider) return;

        const storage = typeof Domma !== 'undefined' && Domma.storage ? Domma.storage : null;
        let celebrationsEffect = null;

        // Load saved state
        const savedEnabled = storage ? storage.get('celebrations-enabled', false) : false;
        const savedIntensity = storage ? storage.get('celebrations-intensity', 'medium') : 'medium';

        // Initialize if enabled
        if (savedEnabled) {
            celebrationsEffect = new CelebrationsEffect({
                theme: 'auto',
                intensity: savedIntensity,
                enabled: true
            });
            celebrationsEffect.init().then(() => {
                celebrationsEffect.start();
                toggleBtn.classList.add('active');
            });
        }

        // Update slider active state
        function updateSliderState() {
            const current = storage ? storage.get('celebrations-intensity', 'medium') : 'medium';
            slider.querySelectorAll('.celebrations-intensity-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.intensity === current);
            });
        }

        // Toggle handler
        toggleBtn.addEventListener('click', () => {
            const isActive = toggleBtn.classList.contains('active');

            if (isActive) {
                // Disable celebrations
                if (celebrationsEffect) {
                    celebrationsEffect.pause();
                    celebrationsEffect.destroy();
                    celebrationsEffect = null;
                }
                toggleBtn.classList.remove('active');
                if (storage) storage.set('celebrations-enabled', false);
            } else {
                // Enable celebrations
                const intensity = storage ? storage.get('celebrations-intensity', 'medium') : 'medium';
                celebrationsEffect = new CelebrationsEffect({
                    theme: 'auto',
                    intensity,
                    enabled: false
                });
                celebrationsEffect.init().then(() => {
                    celebrationsEffect.start();
                    toggleBtn.classList.add('active');
                    if (storage) storage.set('celebrations-enabled', true);
                });
            }
        });

        // Intensity handlers
        slider.querySelectorAll('.celebrations-intensity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const intensity = btn.dataset.intensity;
                if (storage) storage.set('celebrations-intensity', intensity);

                if (celebrationsEffect) {
                    celebrationsEffect.setIntensity(intensity);
                }

                updateSliderState();
            });
        });

        updateSliderState();
    }

    /**
     * Initialize twinkling stars effect
     * Prefers Domma.effects.twinkle() when available; falls back to the standalone module
     */
    async function initTwinklingStars(config) {
        // Prefer the bundled Domma.effects.twinkle() if the full build is loaded
        if (typeof Domma !== 'undefined' && Domma.effects && Domma.effects.twinkle) {
            try {
                Domma.effects.twinkle(null, {
                    count: config.count || 150,
                    minSize: config.minSize || 1,
                    maxSize: config.maxSize || 3,
                    twinkleSpeed: config.twinkleSpeed || 0.003,
                    colour: config.color || 'rgba(255, 240, 200, 1)',
                    zIndex: config.zIndex || 1,
                    respectMotionPreference: false  // Layout manages its own lifecycle
                });
                console.log('[Domma Layout] Twinkling stars initialized (via Domma.effects)');
                return;
            } catch (error) {
                console.warn('[Domma Layout] Domma.effects.twinkle failed, falling back to module:', error);
            }
        }

        // Fallback: direct module import for standalone usage without the full Domma build
        try {
            const { TwinklingStars } = await import('./modules/twinkling-stars.js');

            const stars = new TwinklingStars({
                count: config.count || 150,
                minSize: config.minSize || 1,
                maxSize: config.maxSize || 3,
                twinkleSpeed: config.twinkleSpeed || 0.003,
                color: config.color || 'rgba(255, 240, 200, 1)',
                zIndex: config.zIndex || 1
            });

            stars.init();
            stars.start();

            console.log('[Domma Layout] Twinkling stars initialized (via standalone module)');
        } catch (error) {
            console.error('[Domma Layout] Failed to initialize twinkling stars:', error);
        }
    }

    /**
     * Process template string
     */
    function processTemplate(template, data) {
        if (!template) return '';
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
    }

    /**
     * Inject <link rel="canonical"> into <head>.
     * Canonical domain is https://dommajs.org (no www), trailing /index.html stripped.
     * Skips injection if a canonical tag is already present (per-page override).
     */
    function injectCanonicalTag() {
        try {
            if (document.querySelector('link[rel="canonical"]')) return;

            const host = 'https://dommajs.org';
            let path = window.location.pathname || '/';
            path = path.replace(/\/index\.html$/i, '/');
            if (!path.startsWith('/')) path = '/' + path;

            const link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            link.setAttribute('href', host + path);
            document.head.appendChild(link);
        } catch (_) {
            // Canonical injection is best-effort; never break the page
        }
    }

})();
