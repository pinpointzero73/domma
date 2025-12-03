/**
 * Domma Showcase - Shared Layout
 * Injects consistent header and footer across all showcase pages
 */

(function () {
    // Determine the base path based on current location
    const path = window.location.pathname;
    const isSubpage = path.includes('/dom/') || path.includes('/utils/') ||
        path.includes('/dates/') || path.includes('/models/') ||
        path.includes('/elements/') || path.includes('/tables/');
    const base = isSubpage ? '../' : '';

    // Get current page for active nav state
    const currentPage = path.split('/').filter(Boolean).pop()?.replace('.html', '') || 'index';
    const currentSection = path.split('/').filter(Boolean).slice(-2, -1)[0] || '';

    function getNavClass(page) {
        if (currentSection === page) return 'navbar-link active';
        if (currentPage === page) return 'navbar-link active';
        return 'navbar-link';
    }

    // Create navbar HTML
    const navbar = `
    <nav class="navbar navbar-dark">
        <a href="${base}index.html" class="navbar-brand">Domma</a>
        <ul class="navbar-nav">
            <li><a href="${base}dom/index.html" class="${getNavClass('dom')}">DOM</a></li>
            <li><a href="${base}utils/index.html" class="${getNavClass('utils')}">Utils</a></li>
            <li><a href="${base}dates/index.html" class="${getNavClass('dates')}">Dates</a></li>
            <li><a href="${base}models/index.html" class="${getNavClass('models')}">Models</a></li>
            <li><a href="${base}elements/index.html" class="${getNavClass('elements')}">Elements</a></li>
            <li><a href="${base}tables/index.html" class="${getNavClass('tables')}">Tables</a></li>
        </ul>
    </nav>`;

    // Create footer HTML
    const footer = `
    <footer class="footer footer-dark text-center">
        <p class="mb-2">Domma &copy; 2025</p>
        <p class="text-sm">A lightweight JavaScript framework for modern web development</p>
    </footer>`;

    // Inject navbar at the start of body
    document.body.insertAdjacentHTML('afterbegin', navbar);

    // Inject footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footer);
})();
