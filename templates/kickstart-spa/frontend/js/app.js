/**
 * {{projectName}} - Single Page Application
 * Domma SPA with hash-based routing
 */
import {views} from './views/index.js';

// Wait for Domma to be ready
$(() => {
    console.log('{{projectName}} SPA initializing...');

    // Load configuration
    Domma.http.get('domma.config.json')
        .then(config => {
            // Initialize theme
            if (config.theme) {
                Domma.theme.init({
                    theme: config.theme.default,
                    persist: config.theme.persist !== false,
                    autoDetect: config.theme.autoDetect || false
                });
            }

            // Initialize navbar with hash-aware links
            if (config.navbar) {
                Domma.elements.navbar('#main-navbar', {
                    brand: config.navbar.brand,
                    items: config.navbar.items,
                    variant: config.navbar.variant || 'dark',
                    position: config.navbar.position || 'sticky',
                    collapsible: config.navbar.collapsible !== false,
                    onItemClick: (item, index, e) => {
                        // Handle hash navigation
                        if (item.url && item.url.startsWith('#')) {
                            e.preventDefault();
                            const path = item.url.slice(1);
                            R.navigate(path);
                        }
                    }
                });
            }

            // Initialize footer
            if (config.footer) {
                initFooter(config.footer);
            }

            // Initialize router
            if (config.spa?.enabled) {
                R.init({
                    container: config.spa.container || '#app',
                    routes: config.routes || [],
                    views: views,
                    default: config.spa.defaultRoute || '/',
                    notFound: config.spa.notFoundView || '404',
                    transitions: config.spa.transitions || {
                        enter: 'fadeIn',
                        leave: 'fadeOut',
                        duration: 200
                    }
                });

                // Subscribe to route changes
                M.subscribe('router:afterChange', ({to, from}) => {
                    // Update active navbar item
                    updateNavbarActive(`#${to.path}`);

                    // Scroll to top on route change (unless configured otherwise)
                    if (config.spa.persistScroll !== true) {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    }

                    console.log(`Route changed: ${from?.path || '(initial)'} → ${to.path}`);
                });

                console.log('Router initialized');
            } else {
                console.error('SPA mode not enabled in domma.config.json');
            }

            // Initialize features
            if (config.features?.icons) {
                Domma.icons.scan();
            }

            if (config.features?.backToTop) {
                Domma.elements.backToTop();
            }

            if (config.features?.smoothScroll) {
                enableSmoothScroll();
            }

            console.log(`${config.project.name} v${config.project.version} ready!`);
        })
        .catch(error => {
            console.error('Failed to load configuration:', error);
        });
});

/**
 * Update navbar active state
 */
function updateNavbarActive(url) {
    $('.navbar-link').removeClass('active');
    $(`.navbar-link[href="${url}"]`).addClass('active');
}

/**
 * Initialize footer
 */
function initFooter(config) {
    const $footer = $('.page-footer');
    if (!$footer.length) return;

    let html = `<div class="footer-content">`;
    html += `<p>${config.copyright}</p>`;

    if (config.links && config.links.length > 0) {
        html += `<nav class="footer-nav">`;
        config.links.forEach(link => {
            html += `<a href="${link.url}">${link.text}</a>`;
        });
        html += `</nav>`;
    }

    html += `</div>`;
    $footer.html(html, {safe: false});
}

/**
 * Enable smooth scrolling for anchor links
 */
function enableSmoothScroll() {
    $(document).on('click', 'a[href^="#"]', function (e) {
        const href = $(this).attr('href');
        if (href === '#' || href.startsWith('#/')) return; // Skip router links

        e.preventDefault();
        const target = $(href);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 400);
        }
    });
}
