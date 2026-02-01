import { DommaElement, getThemeVariables } from '../../../../../src/web-components/base/domma-element.js';

/**
 * Search Filter Web Component
 * Text search input with tag filtering for Saved Addresses
 *
 * Usage:
 *   <dm-search-filter placeholder="Search..." tags='["home", "work"]'></dm-search-filter>
 *
 * Attributes:
 *   - placeholder: Search input placeholder text
 *   - tags: JSON array of available tags
 *   - search-value: Current search query
 *   - active-tags: JSON array of currently active tag filters
 *
 * Events:
 *   - search: Fired when search input changes, detail: { query }
 *   - filter: Fired when tag filters change, detail: { tags }
 *   - clear: Fired when filters are cleared
 */
export class SearchFilter extends DommaElement {
    static defaults = {
        placeholder: 'Search...',
        tags: [],
        searchValue: '',
        activeTags: []
    };

    static get observedAttributes() {
        return ['placeholder', 'tags', 'search-value', 'active-tags'];
    }

    _getStyles() {
        return `
            ${getThemeVariables()}

            :host {
                display: block;
                width: 100%;
            }

            .search-filter-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .search-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .search-input {
                flex: 1;
                padding: 0.5rem 0.75rem;
                border: 1px solid var(--dm-gray-300, #dee2e6);
                border-radius: var(--dm-radius-md, 0.375rem);
                font-size: 14px;
                transition: all var(--dm-transition-fast, 150ms);
                background: var(--dm-white, #ffffff);
                color: var(--dm-gray-900, #212529);
            }

            .search-input:focus {
                outline: none;
                border-color: var(--dm-primary, #6495ED);
                box-shadow: 0 0 0 3px rgba(100, 149, 237, 0.1);
            }

            .clear-btn {
                padding: 0.5rem 0.75rem;
                border: 1px solid var(--dm-gray-300, #dee2e6);
                border-radius: var(--dm-radius-md, 0.375rem);
                background: var(--dm-white, #ffffff);
                color: var(--dm-gray-700, #495057);
                font-size: 14px;
                cursor: pointer;
                transition: all var(--dm-transition-fast, 150ms);
                white-space: nowrap;
            }

            .clear-btn:hover {
                background: var(--dm-gray-100, #f8f9fa);
                border-color: var(--dm-gray-400, #ced4da);
            }

            .clear-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .tags-row {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .tag-filter {
                padding: 0.375rem 0.75rem;
                border-radius: var(--dm-radius-full, 9999px);
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all var(--dm-transition-fast, 150ms);
                border: 1px solid var(--dm-gray-300, #dee2e6);
                background: var(--dm-white, #ffffff);
                color: var(--dm-gray-700, #495057);
                user-select: none;
            }

            .tag-filter:hover {
                background: var(--dm-gray-100, #f8f9fa);
                border-color: var(--dm-gray-400, #ced4da);
            }

            .tag-filter.active {
                background: var(--dm-primary, #6495ED);
                color: var(--dm-white, #ffffff);
                border-color: var(--dm-primary, #6495ED);
            }

            .tag-filter.active:hover {
                background: rgba(100, 149, 237, 0.9);
            }

            .no-tags {
                font-size: 13px;
                color: var(--dm-gray-500, #adb5bd);
                font-style: italic;
            }

            @media (max-width: 768px) {
                .search-row {
                    flex-direction: column;
                }

                .clear-btn {
                    width: 100%;
                }
            }
        `;
    }

    _render() {
        const { placeholder, tags, searchValue, activeTags } = this._options;

        // Clear existing content (preserve style tag)
        const existingContainer = this.shadowRoot.querySelector('.search-filter-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        const container = document.createElement('div');
        container.className = 'search-filter-container';

        // Search row
        const searchRow = document.createElement('div');
        searchRow.className = 'search-row';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = placeholder;
        searchInput.value = searchValue || '';
        searchRow.appendChild(searchInput);

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'clear-btn';
        clearBtn.textContent = 'Clear Filters';
        clearBtn.disabled = !searchValue && (!activeTags || activeTags.length === 0);
        searchRow.appendChild(clearBtn);

        container.appendChild(searchRow);

        // Tags row
        if (tags && tags.length > 0) {
            const tagsRow = document.createElement('div');
            tagsRow.className = 'tags-row';

            tags.forEach(tag => {
                const tagBtn = document.createElement('button');
                tagBtn.type = 'button';
                tagBtn.className = 'tag-filter';
                if (activeTags && activeTags.includes(tag)) {
                    tagBtn.classList.add('active');
                }
                tagBtn.textContent = String(tag);
                tagBtn.dataset.tag = String(tag);
                tagsRow.appendChild(tagBtn);
            });

            container.appendChild(tagsRow);
        } else {
            const noTags = document.createElement('div');
            noTags.className = 'no-tags';
            noTags.textContent = 'No tags available';
            container.appendChild(noTags);
        }

        this.shadowRoot.appendChild(container);
    }

    _bindEvents() {
        const searchInput = this.shadowRoot.querySelector('.search-input');
        const clearBtn = this.shadowRoot.querySelector('.clear-btn');
        const tagButtons = this.shadowRoot.querySelectorAll('.tag-filter');

        // Search input with debounce
        let searchTimeout;
        this._addEventListener(searchInput, 'input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.trim();
                this.setAttribute('search-value', query);
                this._emit('search', { query });
                this._updateClearButton();
            }, 300);
        });

        // Clear button
        this._addEventListener(clearBtn, 'click', () => {
            searchInput.value = '';
            this.setAttribute('search-value', '');
            this.setAttribute('active-tags', '[]');

            // Remove active class from all tags
            tagButtons.forEach(btn => btn.classList.remove('active'));

            this._emit('clear', {});
            this._emit('search', { query: '' });
            this._emit('filter', { tags: [] });
            this._updateClearButton();
        });

        // Tag filter buttons
        tagButtons.forEach(tagBtn => {
            this._addEventListener(tagBtn, 'click', () => {
                tagBtn.classList.toggle('active');

                const activeTags = [...this.shadowRoot.querySelectorAll('.tag-filter.active')]
                    .map(btn => btn.dataset.tag);

                this.setAttribute('active-tags', JSON.stringify(activeTags));
                this._emit('filter', { tags: activeTags });
                this._updateClearButton();
            });
        });
    }

    _updateClearButton() {
        const clearBtn = this.shadowRoot.querySelector('.clear-btn');
        const searchInput = this.shadowRoot.querySelector('.search-input');
        const activeTags = this.shadowRoot.querySelectorAll('.tag-filter.active');

        if (clearBtn) {
            clearBtn.disabled = !searchInput.value && activeTags.length === 0;
        }
    }

    _onAttributeChange(name, oldValue, newValue) {
        // Re-render when attributes change
        this._render();
        this._bindEvents();
    }

    // Public API
    setTags(tags) {
        this.setAttribute('tags', JSON.stringify(tags));
    }

    getTags() {
        try {
            const tagsAttr = this.getAttribute('tags');
            return tagsAttr ? JSON.parse(tagsAttr) : [];
        } catch {
            return [];
        }
    }

    getActiveTags() {
        try {
            const activeTagsAttr = this.getAttribute('active-tags');
            return activeTagsAttr ? JSON.parse(activeTagsAttr) : [];
        } catch {
            return [];
        }
    }

    getSearchValue() {
        return this.getAttribute('search-value') || '';
    }

    clear() {
        this.setAttribute('search-value', '');
        this.setAttribute('active-tags', '[]');
        const searchInput = this.shadowRoot.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        const tagButtons = this.shadowRoot.querySelectorAll('.tag-filter');
        tagButtons.forEach(btn => btn.classList.remove('active'));
        this._updateClearButton();
    }
}

// Register the custom element
customElements.define('dm-search-filter', SearchFilter);
