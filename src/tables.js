/**
 * Domma Tables Module
 * DataTable-like functionality
 */

import {utils} from './utils.js';

/**
 * Table Instance Class
 */
class TableInstance {
    constructor(element, options = {}) {
        this.element = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        this.options = {
            // Data
            data: [],
            columns: [],
            rowKey: 'id',

            // Sorting
            sortable: true,
            multiSort: false,
            defaultSort: null,

            // Filtering
            filterable: true,
            searchable: true,
            searchPlaceholder: 'Search...',

            // Pagination
            pagination: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100],

            // Selection
            selectable: false,
            selectionMode: 'single',

            // Editing
            editable: false,
            editMode: 'cell',

            // Column features
            resizable: true,

            // UI
            striped: true,
            hover: true,
            bordered: true,
            responsive: true,

            // Classes
            classes: {
                wrapper: 'domma-table-wrapper',
                table: 'domma-table',
                header: 'domma-table-header',
                body: 'domma-table-body',
                row: 'domma-table-row',
                cell: 'domma-table-cell',
                selected: 'domma-table-selected',
                sorted: 'domma-table-sorted',
                sortAsc: 'domma-table-sort-asc',
                sortDesc: 'domma-table-sort-desc',
                pagination: 'domma-table-pagination',
                search: 'domma-table-search'
            },

            // Callbacks
            onSort: null,
            onFilter: null,
            onPageChange: null,
            onSelect: null,
            onEdit: null,
            onRender: null,

            ...options
        };

        // State
        this._originalData = [...this.options.data];
        this._data = [...this.options.data];
        this._filteredData = [...this._data];
        this._currentPage = 1;
        this._pageSize = this.options.pageSize;
        this._sorts = [];
        this._filters = [];
        this._searchQuery = '';
        this._selected = new Set();
        this._editingCell = null;
        this._eventListeners = new Map();

        // Normalize columns
        this._columns = this.options.columns.map(col => ({
            key: col.key || col,
            title: col.title || col.key || col,
            sortable: col.sortable !== false && this.options.sortable,
            filterable: col.filterable !== false,
            editable: col.editable || false,
            width: col.width || null,
            render: col.render || null,
            filterOptions: col.filterOptions || null,
            visible: col.visible !== false
        }));

        this._init();
    }

    _init() {
        if (!this.element) return;

        // Apply default sort if specified
        if (this.options.defaultSort) {
            this._sorts = [this.options.defaultSort];
        }

        // Initial render
        this.render();
    }

    // ============================================
    // Data Management
    // ============================================

    setData(data) {
        this._originalData = [...data];
        this._data = [...data];
        this._applyFiltersAndSort();
        this._currentPage = 1;
        this.render();
        return this;
    }

    getData() {
        return [...this._getPageData()];
    }

    getFilteredData() {
        return [...this._filteredData];
    }

    getOriginalData() {
        return [...this._originalData];
    }

    addRow(rowData) {
        this._originalData.push(rowData);
        this._data.push(rowData);
        this._applyFiltersAndSort();
        this.render();
        return this;
    }

    updateRow(identifier, rowData) {
        const index = this._findRowIndex(identifier);
        if (index !== -1) {
            this._originalData[index] = {...this._originalData[index], ...rowData};
            this._data[index] = {...this._data[index], ...rowData};
            this._applyFiltersAndSort();
            this.render();
        }
        return this;
    }

    removeRow(identifier) {
        const index = this._findRowIndex(identifier);
        if (index !== -1) {
            this._originalData.splice(index, 1);
            this._data.splice(index, 1);
            this._applyFiltersAndSort();
            this.render();
        }
        return this;
    }

    _findRowIndex(identifier) {
        const key = this.options.rowKey;
        if (typeof identifier === 'number') {
            return identifier;
        }
        return this._originalData.findIndex(row => row[key] === identifier);
    }

    // ============================================
    // Sorting
    // ============================================

    sort(column, direction = 'asc') {
        this._sorts = [{column, direction}];
        this._applyFiltersAndSort();
        this.render();
        if (this.options.onSort) {
            this.options.onSort({column, direction, sorts: this._sorts});
        }
        return this;
    }

    sortMultiple(sorts) {
        this._sorts = sorts;
        this._applyFiltersAndSort();
        this.render();
        if (this.options.onSort) {
            this.options.onSort({sorts: this._sorts});
        }
        return this;
    }

    clearSort() {
        this._sorts = [];
        this._applyFiltersAndSort();
        this.render();
        return this;
    }

    _applySort(data) {
        if (this._sorts.length === 0) return data;

        return [...data].sort((a, b) => {
            for (const sort of this._sorts) {
                const {column, direction} = sort;
                const valA = a[column];
                const valB = b[column];

                let comparison = 0;
                if (valA == null) comparison = 1;
                else if (valB == null) comparison = -1;
                else if (valA < valB) comparison = -1;
                else if (valA > valB) comparison = 1;

                if (comparison !== 0) {
                    return direction === 'desc' ? -comparison : comparison;
                }
            }
            return 0;
        });
    }

    // ============================================
    // Filtering
    // ============================================

    search(query) {
        this._searchQuery = query.toLowerCase().trim();
        this._applyFiltersAndSort();
        this._currentPage = 1;
        this.render();
        if (this.options.onFilter) {
            this.options.onFilter({query, type: 'search'});
        }
        return this;
    }

    filter(column, value, operator = 'equals') {
        // Remove existing filter for this column
        this._filters = this._filters.filter(f => f.column !== column);

        if (value !== null && value !== undefined && value !== '') {
            this._filters.push({column, value, operator});
        }

        this._applyFiltersAndSort();
        this._currentPage = 1;
        this.render();
        if (this.options.onFilter) {
            this.options.onFilter({column, value, operator, type: 'column'});
        }
        return this;
    }

    filterBy(filterFn) {
        this._customFilter = filterFn;
        this._applyFiltersAndSort();
        this._currentPage = 1;
        this.render();
        return this;
    }

    clearFilters() {
        this._filters = [];
        this._searchQuery = '';
        this._customFilter = null;
        this._applyFiltersAndSort();
        this._currentPage = 1;
        this.render();
        return this;
    }

    _applyFilters(data) {
        let filtered = data;

        // Apply search
        if (this._searchQuery) {
            filtered = filtered.filter(row => {
                return this._columns.some(col => {
                    const val = row[col.key];
                    return val != null && String(val).toLowerCase().includes(this._searchQuery);
                });
            });
        }

        // Apply column filters
        for (const filter of this._filters) {
            filtered = filtered.filter(row => {
                const val = row[filter.column];
                return this._matchFilter(val, filter.value, filter.operator);
            });
        }

        // Apply custom filter
        if (this._customFilter) {
            filtered = filtered.filter(this._customFilter);
        }

        return filtered;
    }

    _matchFilter(value, filterValue, operator) {
        if (value == null) return false;

        const strVal = String(value).toLowerCase();
        const strFilter = String(filterValue).toLowerCase();

        switch (operator) {
            case 'equals':
                return strVal === strFilter;
            case 'contains':
                return strVal.includes(strFilter);
            case 'startsWith':
                return strVal.startsWith(strFilter);
            case 'endsWith':
                return strVal.endsWith(strFilter);
            case 'gt':
                return Number(value) > Number(filterValue);
            case 'lt':
                return Number(value) < Number(filterValue);
            case 'gte':
                return Number(value) >= Number(filterValue);
            case 'lte':
                return Number(value) <= Number(filterValue);
            case 'between':
                const [min, max] = filterValue;
                const num = Number(value);
                return num >= min && num <= max;
            case 'in':
                return filterValue.includes(value);
            default:
                return strVal === strFilter;
        }
    }

    _applyFiltersAndSort() {
        this._filteredData = this._applyFilters(this._data);
        this._filteredData = this._applySort(this._filteredData);
    }

    // ============================================
    // Pagination
    // ============================================

    page(pageNum) {
        const totalPages = this._getTotalPages();
        this._currentPage = Math.max(1, Math.min(pageNum, totalPages));
        this.render();
        if (this.options.onPageChange) {
            this.options.onPageChange(this.pageInfo());
        }
        return this;
    }

    pageSize(size) {
        this._pageSize = size;
        this._currentPage = 1;
        this.render();
        return this;
    }

    nextPage() {
        return this.page(this._currentPage + 1);
    }

    prevPage() {
        return this.page(this._currentPage - 1);
    }

    firstPage() {
        return this.page(1);
    }

    lastPage() {
        return this.page(this._getTotalPages());
    }

    pageInfo() {
        const totalPages = this._getTotalPages();
        return {
            page: this._currentPage,
            pageSize: this._pageSize,
            totalPages,
            totalRows: this._filteredData.length,
            startRow: (this._currentPage - 1) * this._pageSize + 1,
            endRow: Math.min(this._currentPage * this._pageSize, this._filteredData.length)
        };
    }

    _getTotalPages() {
        if (!this.options.pagination) return 1;
        return Math.ceil(this._filteredData.length / this._pageSize) || 1;
    }

    _getPageData() {
        if (!this.options.pagination) return this._filteredData;

        const start = (this._currentPage - 1) * this._pageSize;
        const end = start + this._pageSize;
        return this._filteredData.slice(start, end);
    }

    // ============================================
    // Selection
    // ============================================

    select(identifier) {
        if (!this.options.selectable) return this;

        const key = this.options.rowKey;
        const id = typeof identifier === 'object' ? identifier[key] : identifier;

        if (this.options.selectionMode === 'single') {
            this._selected.clear();
        }

        this._selected.add(id);
        this.render();

        if (this.options.onSelect) {
            this.options.onSelect(this.getSelected());
        }
        return this;
    }

    deselect(identifier) {
        const key = this.options.rowKey;
        const id = typeof identifier === 'object' ? identifier[key] : identifier;
        this._selected.delete(id);
        this.render();

        if (this.options.onSelect) {
            this.options.onSelect(this.getSelected());
        }
        return this;
    }

    toggleSelect(identifier) {
        const key = this.options.rowKey;
        const id = typeof identifier === 'object' ? identifier[key] : identifier;

        if (this._selected.has(id)) {
            this.deselect(identifier);
        } else {
            this.select(identifier);
        }
        return this;
    }

    selectAll() {
        if (!this.options.selectable || this.options.selectionMode === 'single') return this;

        const key = this.options.rowKey;
        for (const row of this._filteredData) {
            this._selected.add(row[key]);
        }
        this.render();

        if (this.options.onSelect) {
            this.options.onSelect(this.getSelected());
        }
        return this;
    }

    deselectAll() {
        this._selected.clear();
        this.render();

        if (this.options.onSelect) {
            this.options.onSelect([]);
        }
        return this;
    }

    getSelected() {
        const key = this.options.rowKey;
        return this._filteredData.filter(row => this._selected.has(row[key]));
    }

    isSelected(identifier) {
        const key = this.options.rowKey;
        const id = typeof identifier === 'object' ? identifier[key] : identifier;
        return this._selected.has(id);
    }

    // ============================================
    // Column Management
    // ============================================

    showColumn(key) {
        const col = this._columns.find(c => c.key === key);
        if (col) {
            col.visible = true;
            this.render();
        }
        return this;
    }

    hideColumn(key) {
        const col = this._columns.find(c => c.key === key);
        if (col) {
            col.visible = false;
            this.render();
        }
        return this;
    }

    resizeColumn(key, width) {
        const col = this._columns.find(c => c.key === key);
        if (col) {
            col.width = width;
            this.render();
        }
        return this;
    }

    getColumns() {
        return [...this._columns];
    }

    // ============================================
    // Inline Editing
    // ============================================

    editCell(rowIndex, column) {
        if (!this.options.editable) return this;

        this._editingCell = {rowIndex, column};
        this.render();
        return this;
    }

    saveEdits() {
        this._editingCell = null;
        this.render();
        return this;
    }

    cancelEdits() {
        this._editingCell = null;
        this.render();
        return this;
    }

    // ============================================
    // Export
    // ============================================

    toCSV(options = {}) {
        const {columns = this._columns.filter(c => c.visible), includeHeaders = true} = options;
        const rows = [];

        if (includeHeaders) {
            rows.push(columns.map(c => `"${c.title}"`).join(','));
        }

        for (const row of this._filteredData) {
            const values = columns.map(c => {
                const val = row[c.key];
                if (val == null) return '""';
                return `"${String(val).replace(/"/g, '""')}"`;
            });
            rows.push(values.join(','));
        }

        return rows.join('\n');
    }

    toJSON(options = {}) {
        const {columns = this._columns.filter(c => c.visible), pretty = false} = options;
        const keys = columns.map(c => c.key);

        const data = this._filteredData.map(row => {
            const obj = {};
            for (const key of keys) {
                obj[key] = row[key];
            }
            return obj;
        });

        return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    }

    download(format, filename) {
        let content, mimeType;

        if (format === 'csv') {
            content = this.toCSV();
            mimeType = 'text/csv';
            filename = filename || 'data.csv';
        } else {
            content = this.toJSON({pretty: true});
            mimeType = 'application/json';
            filename = filename || 'data.json';
        }

        const blob = new Blob([content], {type: mimeType});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ============================================
    // Rendering
    // ============================================

    render() {
        if (!this.element) return this;

        const opts = this.options;
        const classes = opts.classes;
        const visibleColumns = this._columns.filter(c => c.visible);
        const pageData = this._getPageData();

        // Clear existing
        this.element.innerHTML = '';
        this._clearEventListeners();

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = classes.wrapper;

        // Search bar
        if (opts.searchable) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = classes.search;
            searchWrapper.style.marginBottom = '10px';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = opts.searchPlaceholder;
            searchInput.value = this._searchQuery;
            searchInput.style.cssText = 'padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; width: 250px;';

            this._addEventHandler(searchInput, 'input', utils.debounce((e) => {
                this.search(e.target.value);
            }, 300));

            searchWrapper.appendChild(searchInput);
            wrapper.appendChild(searchWrapper);
        }

        // Table
        const table = document.createElement('table');
        table.className = classes.table;
        table.style.cssText = 'width: 100%; border-collapse: collapse;';

        // Header
        const thead = document.createElement('thead');
        thead.className = classes.header;
        const headerRow = document.createElement('tr');

        // Selection checkbox column
        if (opts.selectable && opts.selectionMode === 'multiple') {
            const th = document.createElement('th');
            th.style.cssText = 'padding: 12px; border: 1px solid #ddd; background: #f8f9fa; width: 40px;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = this._selected.size > 0 && this._selected.size === pageData.length;
            this._addEventHandler(checkbox, 'change', () => {
                if (checkbox.checked) {
                    this.selectAll();
                } else {
                    this.deselectAll();
                }
            });
            th.appendChild(checkbox);
            headerRow.appendChild(th);
        }

        for (const col of visibleColumns) {
            const th = document.createElement('th');
            th.style.cssText = 'padding: 12px; border: 1px solid #ddd; background: #f8f9fa; text-align: left;';
            if (col.width) th.style.width = typeof col.width === 'number' ? col.width + 'px' : col.width;

            const sort = this._sorts.find(s => s.column === col.key);
            if (sort) {
                th.classList.add(classes.sorted);
                th.classList.add(sort.direction === 'asc' ? classes.sortAsc : classes.sortDesc);
            }

            if (col.sortable) {
                th.style.cursor = 'pointer';
                th.innerHTML = `${col.title} <span style="opacity: 0.5">${sort ? (sort.direction === 'asc' ? '▲' : '▼') : '⇅'}</span>`;
                this._addEventHandler(th, 'click', () => {
                    const currentSort = this._sorts.find(s => s.column === col.key);
                    const newDirection = currentSort?.direction === 'asc' ? 'desc' : 'asc';
                    this.sort(col.key, newDirection);
                });
            } else {
                th.textContent = col.title;
            }

            headerRow.appendChild(th);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        tbody.className = classes.body;

        const key = opts.rowKey;
        pageData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            tr.className = classes.row;

            if (opts.striped && rowIndex % 2 === 1) {
                tr.style.background = '#f9f9f9';
            }
            if (opts.hover) {
                tr.style.transition = 'background 0.2s';
                this._addEventHandler(tr, 'mouseenter', () => tr.style.background = '#f0f0f0');
                this._addEventHandler(tr, 'mouseleave', () => tr.style.background = opts.striped && rowIndex % 2 === 1 ? '#f9f9f9' : '');
            }

            if (this._selected.has(row[key])) {
                tr.classList.add(classes.selected);
                tr.style.background = '#e3f2fd';
            }

            // Selection checkbox
            if (opts.selectable && opts.selectionMode === 'multiple') {
                const td = document.createElement('td');
                td.style.cssText = 'padding: 12px; border: 1px solid #ddd;';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = this._selected.has(row[key]);
                this._addEventHandler(checkbox, 'change', () => {
                    this.toggleSelect(row[key]);
                });
                td.appendChild(checkbox);
                tr.appendChild(td);
            }

            // Row click for single selection
            if (opts.selectable && opts.selectionMode === 'single') {
                tr.style.cursor = 'pointer';
                this._addEventHandler(tr, 'click', () => {
                    this.toggleSelect(row[key]);
                });
            }

            for (const col of visibleColumns) {
                const td = document.createElement('td');
                td.className = classes.cell;
                td.style.cssText = 'padding: 12px; border: 1px solid #ddd;';

                const isEditing = this._editingCell &&
                    this._editingCell.rowIndex === rowIndex &&
                    this._editingCell.column === col.key;

                if (isEditing && col.editable) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = row[col.key] || '';
                    input.style.cssText = 'width: 100%; padding: 4px; border: 1px solid #007bff;';

                    this._addEventHandler(input, 'blur', () => {
                        this.updateRow(row[key], {[col.key]: input.value});
                        this.saveEdits();
                        if (opts.onEdit) {
                            opts.onEdit({row, column: col.key, oldValue: row[col.key], newValue: input.value});
                        }
                    });

                    this._addEventHandler(input, 'keydown', (e) => {
                        if (e.key === 'Enter') {
                            input.blur();
                        } else if (e.key === 'Escape') {
                            this.cancelEdits();
                        }
                    });

                    td.appendChild(input);
                    setTimeout(() => input.focus(), 0);
                } else {
                    if (col.render) {
                        td.innerHTML = col.render(row[col.key], row, rowIndex);
                    } else {
                        td.textContent = row[col.key] ?? '';
                    }

                    if (col.editable && opts.editable) {
                        td.style.cursor = 'pointer';
                        this._addEventHandler(td, 'dblclick', () => {
                            this.editCell(rowIndex, col.key);
                        });
                    }
                }

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);

        // Pagination
        if (opts.pagination) {
            const paginationWrapper = document.createElement('div');
            paginationWrapper.className = classes.pagination;
            paginationWrapper.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding: 10px 0;';

            const info = this.pageInfo();

            // Info
            const infoSpan = document.createElement('span');
            infoSpan.textContent = `Showing ${info.startRow}-${info.endRow} of ${info.totalRows}`;

            // Page size selector
            const pageSizeWrapper = document.createElement('span');
            pageSizeWrapper.innerHTML = 'Show ';
            const select = document.createElement('select');
            select.style.cssText = 'padding: 4px 8px; margin: 0 5px;';
            for (const size of opts.pageSizeOptions) {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                if (size === this._pageSize) option.selected = true;
                select.appendChild(option);
            }
            this._addEventHandler(select, 'change', () => {
                this.pageSize(Number(select.value));
            });
            pageSizeWrapper.appendChild(select);
            pageSizeWrapper.appendChild(document.createTextNode(' entries'));

            // Page buttons
            const buttonsWrapper = document.createElement('span');
            const createBtn = (text, onClick, disabled = false) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.disabled = disabled;
                btn.style.cssText = 'padding: 6px 12px; margin: 0 2px; border: 1px solid #ddd; background: #fff; cursor: pointer; border-radius: 4px;';
                if (disabled) btn.style.opacity = '0.5';
                this._addEventHandler(btn, 'click', onClick);
                return btn;
            };

            buttonsWrapper.appendChild(createBtn('«', () => this.firstPage(), this._currentPage === 1));
            buttonsWrapper.appendChild(createBtn('‹', () => this.prevPage(), this._currentPage === 1));

            // Page numbers
            const maxButtons = 5;
            let startPage = Math.max(1, this._currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(info.totalPages, startPage + maxButtons - 1);
            startPage = Math.max(1, endPage - maxButtons + 1);

            for (let i = startPage; i <= endPage; i++) {
                const btn = createBtn(i, () => this.page(i), false);
                if (i === this._currentPage) {
                    btn.style.background = '#007bff';
                    btn.style.color = '#fff';
                    btn.style.borderColor = '#007bff';
                }
                buttonsWrapper.appendChild(btn);
            }

            buttonsWrapper.appendChild(createBtn('›', () => this.nextPage(), this._currentPage === info.totalPages));
            buttonsWrapper.appendChild(createBtn('»', () => this.lastPage(), this._currentPage === info.totalPages));

            paginationWrapper.appendChild(pageSizeWrapper);
            paginationWrapper.appendChild(infoSpan);
            paginationWrapper.appendChild(buttonsWrapper);
            wrapper.appendChild(paginationWrapper);
        }

        this.element.appendChild(wrapper);

        if (opts.onRender) {
            opts.onRender(this);
        }

        return this;
    }

    // ============================================
    // Event Handling
    // ============================================

    _addEventHandler(element, event, handler) {
        element.addEventListener(event, handler);
        if (!this._eventListeners.has(element)) {
            this._eventListeners.set(element, []);
        }
        this._eventListeners.get(element).push({event, handler});
    }

    _clearEventListeners() {
        for (const [element, listeners] of this._eventListeners) {
            for (const {event, handler} of listeners) {
                element.removeEventListener(event, handler);
            }
        }
        this._eventListeners.clear();
    }

    on(event, callback) {
        const validEvents = ['sort', 'filter', 'page', 'select', 'edit', 'render'];
        if (validEvents.includes(event)) {
            const optKey = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
            this.options[optKey] = callback;
        }
        return this;
    }

    off(event) {
        const optKey = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
        this.options[optKey] = null;
        return this;
    }

    // ============================================
    // Lifecycle
    // ============================================

    refresh() {
        this._applyFiltersAndSort();
        this.render();
        return this;
    }

    destroy() {
        this._clearEventListeners();
        if (this.element) {
            this.element.innerHTML = '';
        }
    }
}

// ============================================
// Tables Module Export
// ============================================

export const tables = {
    _instances: new Map(),

    create(selector, options = {}) {
        const element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        const instance = new TableInstance(element, options);
        if (element) {
            this._instances.set(element, instance);
        }
        return instance;
    },

    get(selector) {
        const element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        return this._instances.get(element);
    },

    destroy(selector) {
        const element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        const instance = this._instances.get(element);
        if (instance) {
            instance.destroy();
            this._instances.delete(element);
        }
    },

    destroyAll() {
        for (const instance of this._instances.values()) {
            instance.destroy();
        }
        this._instances.clear();
    }
};
