/**
 * Domma Site Search Module
 * Full-overlay search with keyboard navigation, categorised results, and Ctrl+K shortcut
 *
 * XSS safety notes:
 * - All user query text is HTML-escaped via _escapeHtml() before any DOM insertion
 * - Search index data is loaded from a trusted local static JSON file, not user input
 * - The _highlight() function escapes the source string first, then wraps matched
 *   substrings of that already-escaped string in a <mark> element — safe by construction
 * - _buildOverlay() uses only hardcoded HTML (no user input) in the static template
 * - href values come from the static search index, not from user-typed content
 * - DOMPurify is used as an additional sanitisation layer when available on the page
 */

export const SiteSearch = (() => {
    let _entries = [];
    let _levelsUp = 0;
    let _isOpen = false;
    let _currentIndex = -1;
    let _debouncedSearch = null;
    let _dataPath = '';

    /**
     * Popular/featured entries shown before the user types anything
     */
    const _featured = [
        'DOM Manipulation',
        'Forms',
        'Models',
        'Tables',
        'HTTP Client',
        'Blueprints',
        'Themes',
        'Router'
    ];

    /**
     * Sanitise HTML using DOMPurify if available, otherwise return as-is
     * (content is already escaped at the source — this is belt-and-braces)
     */
    function _sanitise(html) {
        if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
            return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['mark', 'span', 'div', 'a', 'kbd'], ALLOWED_ATTR: ['class', 'href', 'data-idx', 'role', 'data-icon', 'aria-hidden'] });
        }
        return html;
    }

    /**
     * Initialise: resolve paths, fetch index, bind global shortcut
     */
    async function init(levelsUp) {
        _levelsUp = levelsUp || 0;
        _dataPath = _levelsUp > 0 ? '../'.repeat(_levelsUp) : '';

        // Fetch search index (non-blocking — loads in background)
        try {
            const res = await fetch(_dataPath + 'data/search-index.json');
            _entries = await res.json();
        } catch (e) {
            console.warn('[SiteSearch] Could not load search index:', e);
        }

        // Set up debounced input handler
        if (typeof _ !== 'undefined' && _.debounce) {
            _debouncedSearch = _.debounce(_onInput, 150);
        } else {
            _debouncedSearch = _onInput;
        }

        // Global keyboard shortcut: Ctrl+K / Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                _isOpen ? close() : open();
            }
        });
    }

    /**
     * Open the search overlay
     */
    function open() {
        if (_isOpen) return;
        _isOpen = true;
        _currentIndex = -1;

        // Inject overlay into DOM if not already present
        if (!document.getElementById('site-search-overlay')) {
            _buildOverlay();
        }

        const overlay = document.getElementById('site-search-overlay');
        const input = document.getElementById('site-search-input');

        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // Focus input after CSS transition begins
        requestAnimationFrame(() => {
            setTimeout(() => input && input.focus(), 50);
        });

        // Show featured results immediately (empty query state)
        _renderResults(_getFeatured(), '');
    }

    /**
     * Close the search overlay
     */
    function close() {
        if (!_isOpen) return;
        _isOpen = false;
        _currentIndex = -1;

        const overlay = document.getElementById('site-search-overlay');
        if (overlay) {
            overlay.classList.remove('is-open');
        }

        document.body.style.overflow = '';

        const input = document.getElementById('site-search-input');
        if (input) input.value = '';
    }

    /**
     * Filter entries by query against title, description, keywords, and category
     */
    function _search(query) {
        if (!query || !query.trim()) return _getFeatured();

        const q = query.toLowerCase().trim();

        const matchFn = (entry) => {
            const h = (s) => (s || '').toLowerCase();
            return h(entry.title).includes(q) ||
                h(entry.description).includes(q) ||
                h(entry.category).includes(q) ||
                (entry.keywords || []).some(k => h(k).includes(q));
        };

        if (typeof _ !== 'undefined' && _.filter) {
            return _.filter(_entries, matchFn);
        }

        return _entries.filter(matchFn);
    }

    /**
     * Return featured/popular entries for the initial empty-query state
     */
    function _getFeatured() {
        return _entries.filter(e => _featured.includes(e.title));
    }

    /**
     * Handle text input (called after debounce)
     */
    function _onInput(e) {
        const query = e.target.value;
        _currentIndex = -1;
        const results = _search(query);
        _renderResults(results, query);
    }

    /**
     * Render categorised result cards into #site-search-results
     * All dynamic content is HTML-escaped before insertion
     */
    function _renderResults(results, query) {
        const container = document.getElementById('site-search-results');
        if (!container) return;

        if (!results || results.length === 0) {
            // Empty state — entirely static markup with a data-icon attribute (no user content)
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'search-empty';
            emptyDiv.innerHTML = '<span data-icon="search" class="search-empty-icon" aria-hidden="true"></span>';
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No results found';
            const emptySub = document.createElement('span');
            emptySub.textContent = 'Try a different search term';
            emptyDiv.appendChild(emptyMsg);
            emptyDiv.appendChild(emptySub);
            container.textContent = '';
            container.appendChild(emptyDiv);
            _scanIcons(container);
            return;
        }

        // Group results by category
        const groups = {};
        results.forEach(entry => {
            if (!groups[entry.category]) groups[entry.category] = [];
            groups[entry.category].push(entry);
        });

        // Preferred category display order
        const order = ['QuickStart', 'Core', 'Data', 'UI', 'Elements', 'Effects', 'Tools', 'Examples', 'MiniApps', 'Resources'];
        const sortedCategories = Object.keys(groups).sort((a, b) => {
            const ai = order.indexOf(a);
            const bi = order.indexOf(b);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });

        // Flat list for keyboard nav
        const flatResults = [];

        // Build DOM nodes safely
        container.textContent = '';
        container.dataset.count = '0';

        sortedCategories.forEach(cat => {
            const groupEl = document.createElement('div');
            groupEl.className = 'search-result-group';

            const labelEl = document.createElement('div');
            labelEl.className = 'search-result-group-label';
            labelEl.textContent = cat; // textContent = no XSS risk
            groupEl.appendChild(labelEl);

            groups[cat].forEach(entry => {
                const idx = flatResults.length;
                flatResults.push(entry);

                const url = _resolveUrl(entry.url);

                const anchor = document.createElement('a');
                anchor.href = url; // from trusted static JSON
                anchor.className = 'search-result-item';
                anchor.dataset.idx = idx;
                anchor.setAttribute('role', 'option');

                const contentDiv = document.createElement('div');
                contentDiv.className = 'search-result-content';

                // Title: highlighted HTML — _highlight() escapes source, then wraps in <mark>
                const titleEl = document.createElement('div');
                titleEl.className = 'search-result-title';
                titleEl.innerHTML = _sanitise(_highlight(entry.title, query));

                // Description: same treatment
                const descEl = document.createElement('div');
                descEl.className = 'search-result-desc';
                descEl.innerHTML = _sanitise(_highlight(entry.description, query));

                contentDiv.appendChild(titleEl);
                contentDiv.appendChild(descEl);

                const catBadge = document.createElement('span');
                catBadge.className = 'badge badge-secondary search-result-cat';
                catBadge.textContent = cat; // textContent = no XSS risk

                anchor.appendChild(contentDiv);
                anchor.appendChild(catBadge);
                groupEl.appendChild(anchor);

                // Events
                anchor.addEventListener('mouseenter', () => _setActive(idx));
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    _navigate(entry.url);
                });
            });

            container.appendChild(groupEl);
        });

        container.dataset.count = flatResults.length;
        _scanIcons(container);
    }

    /**
     * Handle keyboard navigation within the overlay
     */
    function _onKeydown(e) {
        const container = document.getElementById('site-search-results');
        if (!container) return;

        const count = parseInt(container.dataset.count || '0', 10);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            _currentIndex = Math.min(_currentIndex + 1, count - 1);
            _setActive(_currentIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            _currentIndex = Math.max(_currentIndex - 1, 0);
            _setActive(_currentIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (_currentIndex >= 0) {
                const active = container.querySelector(`.search-result-item[data-idx="${_currentIndex}"]`);
                if (active) active.click();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    }

    /**
     * Visually activate a result item by its flat index
     */
    function _setActive(idx) {
        _currentIndex = idx;
        const container = document.getElementById('site-search-results');
        if (!container) return;

        container.querySelectorAll('.search-result-item').forEach((el, i) => {
            if (i === idx) {
                el.classList.add('is-active');
                el.scrollIntoView({ block: 'nearest' });
            } else {
                el.classList.remove('is-active');
            }
        });
    }

    /**
     * Highlight matching query text within a string
     * Safety: _escapeHtml() is called on `text` first; $1 in the replacement
     * references substrings of the already-escaped string (safe)
     */
    function _highlight(text, query) {
        const safe = _escapeHtml(text);
        if (!query || !query.trim()) return safe;
        // Escape regex special characters in the query string
        const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return safe.replace(new RegExp(`(${q})`, 'gi'), '<mark class="search-highlight">$1</mark>');
    }

    /**
     * Escape HTML entities to prevent XSS
     */
    function _escapeHtml(str) {
        if (typeof _ !== 'undefined' && _.escape) return _.escape(str || '');
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Resolve a root-relative entry URL accounting for current page depth
     */
    function _resolveUrl(url) {
        return _dataPath + url;
    }

    /**
     * Navigate to an entry URL (close overlay first)
     */
    function _navigate(url) {
        close();
        window.location.href = _resolveUrl(url);
    }

    /**
     * Scan data-icon attributes in a container using Domma's icon system
     */
    function _scanIcons(container) {
        if (typeof Domma !== 'undefined' && Domma.icons && Domma.icons.scan) {
            Domma.icons.scan(container);
        } else if (typeof I !== 'undefined' && I.scan) {
            I.scan(container);
        }
    }

    /**
     * Build and inject the overlay element + styles into the document body
     * Uses hardcoded markup only (no user input in this function)
     */
    function _buildOverlay() {
        // Inject styles (done once only)
        if (!document.getElementById('site-search-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'site-search-styles';
            styleEl.textContent = `
                #site-search-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 80px 1rem 2rem;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.15s ease;
                }
                #site-search-overlay.is-open {
                    opacity: 1;
                    pointer-events: all;
                }
                #site-search-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.55);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                #site-search-panel {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 640px;
                    background: var(--dm-background, var(--dm-surface, #fff));
                    border: 1px solid var(--dm-border, #dee2e6);
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
                    display: flex;
                    flex-direction: column;
                    max-height: calc(100vh - 120px);
                    overflow: hidden;
                    transform: translateY(-8px);
                    transition: transform 0.15s ease;
                }
                #site-search-overlay.is-open #site-search-panel {
                    transform: translateY(0);
                }
                #site-search-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1rem;
                    border-bottom: 1px solid var(--dm-border, #dee2e6);
                    flex-shrink: 0;
                }
                .search-icon-lead { color: var(--dm-text-muted, #6c757d); flex-shrink: 0; display: flex; align-items: center; }
                .search-icon-lead svg { width: 18px; height: 18px; }
                #site-search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    color: var(--dm-text, #212529);
                    font-size: 1rem;
                    font-family: inherit;
                    padding: 0;
                    min-width: 0;
                }
                #site-search-input::placeholder { color: var(--dm-text-muted, #6c757d); }
                #site-search-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--dm-text-muted, #6c757d);
                    padding: 0.25rem;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    transition: background 0.1s, color 0.1s;
                    flex-shrink: 0;
                }
                #site-search-close:hover {
                    background: var(--dm-hover-bg, rgba(0,0,0,0.06));
                    color: var(--dm-text, #212529);
                }
                #site-search-close svg { width: 18px; height: 18px; }
                #site-search-results {
                    overflow-y: auto;
                    flex: 1;
                    padding: 0.5rem;
                }
                .search-result-group { margin-bottom: 0.25rem; }
                .search-result-group-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--dm-text-muted, #6c757d);
                    padding: 0.5rem 0.75rem 0.25rem;
                }
                .search-result-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.625rem 0.75rem;
                    border-radius: 8px;
                    cursor: pointer;
                    text-decoration: none;
                    color: var(--dm-text, #212529);
                    transition: background 0.1s ease;
                    margin-bottom: 1px;
                }
                .search-result-item:hover,
                .search-result-item.is-active {
                    background: var(--dm-primary-light, rgba(13,110,253,0.08));
                    color: var(--dm-text, #212529);
                    text-decoration: none;
                }
                .search-result-content { flex: 1; min-width: 0; }
                .search-result-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .search-result-desc {
                    font-size: 0.78rem;
                    color: var(--dm-text-muted, #6c757d);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 1px;
                }
                .search-result-cat { flex-shrink: 0; font-size: 0.68rem; }
                .search-highlight {
                    background: var(--dm-warning-light, #fff3cd);
                    color: var(--dm-warning-dark, #664d03);
                    border-radius: 2px;
                    padding: 0 1px;
                    font-style: normal;
                }
                .search-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1rem;
                    color: var(--dm-text-muted, #6c757d);
                    gap: 0.5rem;
                }
                .search-empty-icon svg { width: 36px; height: 36px; opacity: 0.4; }
                .search-empty p { font-size: 0.95rem; font-weight: 500; margin: 0.25rem 0 0; color: var(--dm-text, #212529); }
                .search-empty span { font-size: 0.82rem; margin: 0; }
                #site-search-footer {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 0.5rem 1rem;
                    border-top: 1px solid var(--dm-border, #dee2e6);
                    flex-shrink: 0;
                }
                .search-kbd-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.72rem;
                    color: var(--dm-text-muted, #6c757d);
                }
                .search-kbd-hint kbd {
                    background: var(--dm-hover-bg, rgba(0,0,0,0.06));
                    border: 1px solid var(--dm-border, #dee2e6);
                    border-radius: 3px;
                    padding: 0.1rem 0.35rem;
                    font-size: 0.68rem;
                    font-family: inherit;
                    line-height: 1.4;
                }
                .search-btn-trigger {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0.35rem;
                    border-radius: 6px;
                    color: var(--dm-text-muted, #6c757d);
                    transition: background 0.15s, color 0.15s;
                }
                .search-btn-trigger:hover {
                    background: var(--dm-hover-bg, rgba(0,0,0,0.06));
                    color: var(--dm-text, #212529);
                }
                .search-btn-trigger svg { width: 18px; height: 18px; }
            `;
            document.head.appendChild(styleEl);
        }

        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'site-search-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Site search');

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'site-search-backdrop';
        overlay.appendChild(backdrop);

        // Panel
        const panel = document.createElement('div');
        panel.id = 'site-search-panel';

        // Header
        const header = document.createElement('div');
        header.id = 'site-search-header';

        const iconLead = document.createElement('span');
        iconLead.className = 'search-icon-lead';
        iconLead.setAttribute('data-icon', 'search');
        iconLead.setAttribute('aria-hidden', 'true');

        const input = document.createElement('input');
        input.id = 'site-search-input';
        input.type = 'search';
        input.placeholder = 'Search Domma\u2026';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');
        input.setAttribute('aria-label', 'Search');

        const closeBtn = document.createElement('button');
        closeBtn.id = 'site-search-close';
        closeBtn.setAttribute('aria-label', 'Close search');

        const closeIcon = document.createElement('span');
        closeIcon.setAttribute('data-icon', 'close');
        closeIcon.setAttribute('aria-hidden', 'true');
        closeBtn.appendChild(closeIcon);

        header.appendChild(iconLead);
        header.appendChild(input);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // Results
        const results = document.createElement('div');
        results.id = 'site-search-results';
        results.setAttribute('role', 'listbox');
        results.setAttribute('aria-label', 'Search results');
        panel.appendChild(results);

        // Footer hints
        const footer = document.createElement('div');
        footer.id = 'site-search-footer';
        footer.innerHTML = `
            <span class="search-kbd-hint"><kbd>\u2191</kbd><kbd>\u2193</kbd> Navigate</span>
            <span class="search-kbd-hint"><kbd>\u21b5</kbd> Open</span>
            <span class="search-kbd-hint"><kbd>Esc</kbd> Close</span>
        `;
        panel.appendChild(footer);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Bind interaction events
        input.addEventListener('input', _debouncedSearch || _onInput);
        input.addEventListener('keydown', _onKeydown);
        closeBtn.addEventListener('click', close);
        backdrop.addEventListener('click', close);

        // Scan icons into the newly created elements
        _scanIcons(overlay);
    }

    return { init, open, close, _search, _renderResults, _navigate };
})();
