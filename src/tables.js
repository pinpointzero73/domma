/**
 * Domma Tables Module
 * DataTable-like functionality
 */

import {utils} from './utils.js';
import {icons} from './icons.js';

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

            // Export panel
            exportPanel: false,
            exportOptions: ['copy', 'csv', 'excel', 'json'],

            // Column visibility
            columnToggle: false,

            // Regex search toggle
            regexSearch: false,

            // Callbacks
            onSort: null,
            onFilter: null,
            onPageChange: null,
            onSelect: null,
            onEdit: null,
            onRender: null,
            onExport: null,

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
        this._columnDropdownOpen = false;
        this._searchIsRegex = false;

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
        this._searchQuery = this._searchIsRegex ? query.trim() : query.toLowerCase().trim();
        this._applyFiltersAndSort();
        this._currentPage = 1;
        this.render();
        if (this.options.onFilter) {
            this.options.onFilter({query, type: 'search', isRegex: this._searchIsRegex});
        }
        return this;
    }

    setSearchMode(isRegex) {
        this._searchIsRegex = isRegex;
        if (this._searchQuery) {
            // Re-apply search with new mode
            this._applyFiltersAndSort();
            this.render();
        }
        return this;
    }

    toggleSearchMode() {
        return this.setSearchMode(!this._searchIsRegex);
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
            if (this._searchIsRegex) {
                // Regex search
                try {
                    const regex = new RegExp(this._searchQuery, 'i');
                    filtered = filtered.filter(row => {
                        return this._columns.some(col => {
                            const val = row[col.key];
                            return val != null && regex.test(String(val));
                        });
                    });
                } catch (e) {
                    // Invalid regex, return no results
                    filtered = [];
                }
            } else {
                // Plain text search
                filtered = filtered.filter(row => {
                    return this._columns.some(col => {
                        const val = row[col.key];
                        return val != null && String(val).toLowerCase().includes(this._searchQuery);
                    });
                });
            }
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

    toggleColumn(key) {
        const col = this._columns.find(c => c.key === key);
        if (col) {
            col.visible = !col.visible;
            this.render();
        }
        return this;
    }

    getVisibleColumns() {
        return this._columns.filter(c => c.visible);
    }

    getHiddenColumns() {
        return this._columns.filter(c => !c.visible);
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

        // Use selected rows if any, otherwise use filtered data
        const data = this._getExportData();

        if (includeHeaders) {
            rows.push(columns.map(c => `"${c.title}"`).join(','));
        }

        for (const row of data) {
            const values = columns.map(c => {
                const val = row[c.key];
                if (val == null) return '""';
                return `"${String(val).replace(/"/g, '""')}"`;
            });
            rows.push(values.join(','));
        }

        return rows.join('\n');
    }

    _getExportData() {
        // If rows are selected, export only those; otherwise export all filtered data
        const selected = this.getSelected();
        return selected.length > 0 ? selected : this._filteredData;
    }

    toJSON(options = {}) {
        const {columns = this._columns.filter(c => c.visible), pretty = false} = options;
        const keys = columns.map(c => c.key);

        // Use selected rows if any, otherwise use filtered data
        const sourceData = this._getExportData();

        const data = sourceData.map(row => {
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

        switch (format) {
            case 'csv':
                content = this.toCSV();
                mimeType = 'text/csv';
                filename = filename || 'data.csv';
                break;
            case 'excel':
                content = this.toExcel();
                mimeType = 'application/vnd.ms-excel';
                filename = filename || 'data.xls';
                break;
            case 'json':
            default:
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

        if (this.options.onExport) {
            const exportData = this._getExportData();
            const selected = this.getSelected();
            this.options.onExport({
                format,
                filename,
                rowCount: exportData.length,
                selectedOnly: selected.length > 0
            });
        }
    }

    toExcel(options = {}) {
        const {columns = this._columns.filter(c => c.visible)} = options;

        // Use selected rows if any, otherwise use filtered data
        const data = this._getExportData();

        // Create HTML table that Excel can open
        let html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:x="urn:schemas-microsoft-com:office:excel">
            <head>
                <meta charset="UTF-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Data</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    table { border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; }
                    th { background: #f0f0f0; font-weight: bold; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>`;

        // Headers
        for (const col of columns) {
            html += `<th>${this._escapeHtml(col.title)}</th>`;
        }

        html += `</tr></thead><tbody>`;

        // Data rows
        for (const row of data) {
            html += '<tr>';
            for (const col of columns) {
                const val = row[col.key];
                html += `<td>${val != null ? this._escapeHtml(String(val)) : ''}</td>`;
            }
            html += '</tr>';
        }

        html += '</tbody></table></body></html>';

        return html;
    }

    copyToClipboard(format = 'text') {
        let content;

        // Use selected rows if any, otherwise use filtered data
        const data = this._getExportData();

        if (format === 'json') {
            content = this.toJSON({pretty: true});
        } else if (format === 'csv') {
            content = this.toCSV();
        } else {
            // Tab-separated for easy pasting into spreadsheets
            const columns = this._columns.filter(c => c.visible);
            const rows = [];

            // Headers
            rows.push(columns.map(c => c.title).join('\t'));

            // Data
            for (const row of data) {
                rows.push(columns.map(c => row[c.key] ?? '').join('\t'));
            }

            content = rows.join('\n');
        }

        // Use clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content).then(() => {
                if (this.options.onExport) {
                    this.options.onExport({format: 'clipboard', rowCount: this._filteredData.length});
                }
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = content;
            textarea.style.cssText = 'position: fixed; left: -9999px;';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            if (this.options.onExport) {
                this.options.onExport({format: 'clipboard', rowCount: this._filteredData.length});
            }
        }

        return this;
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

        // Toolbar (search + export)
        const toolbar = document.createElement('div');
        toolbar.className = 'domma-table-toolbar';
        toolbar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;';

        // Search bar
        if (opts.searchable) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = classes.search;
            searchWrapper.style.cssText = 'display: flex; align-items: center; gap: 4px;';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = this._searchIsRegex ? 'Regex pattern...' : opts.searchPlaceholder;
            searchInput.value = this._searchQuery;
            searchInput.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                width: 250px;
                ${this._searchIsRegex ? 'font-family: monospace; background: #f8f5ff;' : ''}
            `;

            this._addEventHandler(searchInput, 'input', utils.debounce((e) => {
                this.search(e.target.value);
            }, 300));

            searchWrapper.appendChild(searchInput);

            // Regex toggle button (conditional)
            if (opts.regexSearch) {
                const regexBtn = document.createElement('button');
                regexBtn.type = 'button';
                regexBtn.title = this._searchIsRegex ? 'Regex mode (click for text)' : 'Text mode (click for regex)';
                regexBtn.innerHTML = '.*';
                regexBtn.style.cssText = `
                    padding: 8px 10px;
                    border: 1px solid ${this._searchIsRegex ? '#4f46e5' : '#ddd'};
                    background: ${this._searchIsRegex ? '#4f46e5' : '#fff'};
                    color: ${this._searchIsRegex ? '#fff' : '#666'};
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.15s;
                `;

                this._addEventHandler(regexBtn, 'click', () => {
                    this._searchIsRegex = !this._searchIsRegex;
                    // Re-run search with current query in new mode
                    if (this._searchQuery) {
                        this._searchQuery = this._searchIsRegex
                            ? searchInput.value.trim()
                            : searchInput.value.toLowerCase().trim();
                        this._applyFiltersAndSort();
                    }
                    this.render();
                });

                this._addEventHandler(regexBtn, 'mouseenter', () => {
                    if (!this._searchIsRegex) {
                        regexBtn.style.background = '#f8f9fa';
                        regexBtn.style.borderColor = '#adb5bd';
                    }
                });
                this._addEventHandler(regexBtn, 'mouseleave', () => {
                    if (!this._searchIsRegex) {
                        regexBtn.style.background = '#fff';
                        regexBtn.style.borderColor = '#ddd';
                    }
                });

                searchWrapper.appendChild(regexBtn);
            }

            toolbar.appendChild(searchWrapper);
        }

        // Column visibility toggle
        if (opts.columnToggle) {
            const columnWrapper = document.createElement('div');
            columnWrapper.className = 'domma-table-column-toggle';
            columnWrapper.style.cssText = 'position: relative;';

            const columnBtn = document.createElement('button');
            columnBtn.type = 'button';
            columnBtn.innerHTML = `${icons.html('columns', {size: 16})} Columns`;
            columnBtn.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #ddd;
                background: ${this._columnDropdownOpen ? '#f0f0f0' : '#fff'};
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            `;

            const dropdown = document.createElement('div');
            dropdown.className = 'domma-column-dropdown';
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 4px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 200px;
                z-index: 1000;
                display: ${this._columnDropdownOpen ? 'block' : 'none'};
                max-height: 300px;
                overflow-y: auto;
            `;

            // Build column list with styled toggles
            for (const col of this._columns) {
                const item = document.createElement('label');
                item.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 10px 12px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: background 0.15s;
                    border-bottom: 1px solid #f0f0f0;
                `;

                const labelText = document.createElement('span');
                labelText.textContent = col.title;
                labelText.style.cssText = col.visible ? 'color: #333;' : 'color: #999;';

                // Styled toggle switch
                const toggleWrapper = document.createElement('div');
                toggleWrapper.style.cssText = `
                    position: relative;
                    width: 36px;
                    height: 20px;
                    flex-shrink: 0;
                `;

                const toggleInput = document.createElement('input');
                toggleInput.type = 'checkbox';
                toggleInput.checked = col.visible;
                toggleInput.style.cssText = 'opacity: 0; width: 0; height: 0; position: absolute;';

                const toggleTrack = document.createElement('span');
                toggleTrack.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: ${col.visible ? '#4f46e5' : '#ccc'};
                    border-radius: 20px;
                    transition: background 0.2s;
                `;

                const toggleKnob = document.createElement('span');
                toggleKnob.style.cssText = `
                    position: absolute;
                    height: 16px;
                    width: 16px;
                    left: ${col.visible ? '18px' : '2px'};
                    top: 2px;
                    background: white;
                    border-radius: 50%;
                    transition: left 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                `;

                toggleTrack.appendChild(toggleKnob);
                toggleWrapper.appendChild(toggleInput);
                toggleWrapper.appendChild(toggleTrack);

                this._addEventHandler(item, 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    col.visible = !col.visible;
                    // Update visuals immediately
                    toggleTrack.style.background = col.visible ? '#4f46e5' : '#ccc';
                    toggleKnob.style.left = col.visible ? '18px' : '2px';
                    labelText.style.color = col.visible ? '#333' : '#999';
                    toggleInput.checked = col.visible;
                    // Re-render table but keep dropdown open
                    this._columnDropdownOpen = true;
                    this.render();
                });

                this._addEventHandler(item, 'mouseenter', () => {
                    item.style.background = '#f8f9fa';
                });
                this._addEventHandler(item, 'mouseleave', () => {
                    item.style.background = 'transparent';
                });

                item.appendChild(labelText);
                item.appendChild(toggleWrapper);
                dropdown.appendChild(item);
            }

            // Remove border from last item
            if (dropdown.lastChild) {
                dropdown.lastChild.style.borderBottom = 'none';
            }

            // Toggle dropdown
            this._addEventHandler(columnBtn, 'click', (e) => {
                e.stopPropagation();
                this._columnDropdownOpen = !this._columnDropdownOpen;
                dropdown.style.display = this._columnDropdownOpen ? 'block' : 'none';
                columnBtn.style.background = this._columnDropdownOpen ? '#f0f0f0' : '#fff';
            });

            // Close on outside click
            this._addEventHandler(document, 'click', () => {
                if (this._columnDropdownOpen) {
                    this._columnDropdownOpen = false;
                    dropdown.style.display = 'none';
                    columnBtn.style.background = '#fff';
                }
            });

            // Prevent dropdown clicks from closing
            this._addEventHandler(dropdown, 'click', (e) => {
                e.stopPropagation();
            });

            // Hover effects for button
            this._addEventHandler(columnBtn, 'mouseenter', () => {
                if (!this._columnDropdownOpen) columnBtn.style.background = '#f8f9fa';
            });
            this._addEventHandler(columnBtn, 'mouseleave', () => {
                if (!this._columnDropdownOpen) columnBtn.style.background = '#fff';
            });

            columnWrapper.appendChild(columnBtn);
            columnWrapper.appendChild(dropdown);
            toolbar.appendChild(columnWrapper);
        }

        // Export panel
        if (opts.exportPanel) {
            const exportWrapper = document.createElement('div');
            exportWrapper.className = 'domma-table-export';
            exportWrapper.style.cssText = 'display: flex; gap: 8px; align-items: center;';

            // Mode toggle (Copy / Download)
            let downloadMode = false;

            const toggleWrapper = document.createElement('div');
            toggleWrapper.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-right: 8px;';

            const toggleLabel = document.createElement('span');
            toggleLabel.textContent = 'Copy';
            toggleLabel.style.cssText = 'font-size: 12px; color: #666;';

            const toggleSwitch = document.createElement('label');
            toggleSwitch.style.cssText = `
                position: relative;
                display: inline-block;
                width: 44px;
                height: 22px;
                cursor: pointer;
            `;

            const toggleInput = document.createElement('input');
            toggleInput.type = 'checkbox';
            toggleInput.style.cssText = 'opacity: 0; width: 0; height: 0;';

            const toggleSlider = document.createElement('span');
            toggleSlider.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #ccc;
                border-radius: 22px;
                transition: 0.3s;
            `;

            const toggleKnob = document.createElement('span');
            toggleKnob.style.cssText = `
                position: absolute;
                height: 16px;
                width: 16px;
                left: 3px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: 0.3s;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            `;

            toggleSlider.appendChild(toggleKnob);
            toggleSwitch.appendChild(toggleInput);
            toggleSwitch.appendChild(toggleSlider);

            const toggleLabelRight = document.createElement('span');
            toggleLabelRight.textContent = 'Download';
            toggleLabelRight.style.cssText = 'font-size: 12px; color: #999;';

            const updateToggleState = () => {
                if (downloadMode) {
                    toggleSlider.style.background = '#4f46e5';
                    toggleKnob.style.transform = 'translateX(22px)';
                    toggleLabel.style.color = '#999';
                    toggleLabelRight.style.color = '#4f46e5';
                    toggleLabelRight.style.fontWeight = '600';
                    toggleLabel.style.fontWeight = 'normal';
                } else {
                    toggleSlider.style.background = '#ccc';
                    toggleKnob.style.transform = 'translateX(0)';
                    toggleLabel.style.color = '#333';
                    toggleLabel.style.fontWeight = '600';
                    toggleLabelRight.style.color = '#999';
                    toggleLabelRight.style.fontWeight = 'normal';
                }
            };

            this._addEventHandler(toggleInput, 'change', () => {
                downloadMode = toggleInput.checked;
                updateToggleState();
            });

            updateToggleState();

            toggleWrapper.appendChild(toggleLabel);
            toggleWrapper.appendChild(toggleSwitch);
            toggleWrapper.appendChild(toggleLabelRight);
            exportWrapper.appendChild(toggleWrapper);

            // Separator
            const separator = document.createElement('span');
            separator.style.cssText = 'width: 1px; height: 20px; background: #ddd;';
            exportWrapper.appendChild(separator);

            const btnStyle = `
                padding: 6px 12px;
                border: 1px solid #ddd;
                background: #fff;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                transition: all 0.15s ease;
            `;

            const exportFormats = {
                text: {
                    label: 'Text',
                    icon: icons.html('clipboard', {size: 16}),
                    format: 'text'
                },
                csv: {
                    label: 'CSV',
                    icon: icons.html('document', {size: 16}),
                    format: 'csv'
                },
                excel: {
                    label: 'Excel',
                    icon: icons.html('grid', {size: 16}),
                    format: 'excel'
                },
                json: {
                    label: 'JSON',
                    icon: icons.html('file-code', {size: 16}),
                    format: 'json'
                }
            };

            // Map old 'copy' option to 'text'
            const normalizedOptions = opts.exportOptions.map(opt => opt === 'copy' ? 'text' : opt);

            for (const exportType of normalizedOptions) {
                const config = exportFormats[exportType];
                if (!config) continue;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('data-export', exportType);
                btn.innerHTML = `${config.icon} ${config.label}`;
                btn.style.cssText = btnStyle;

                const showFeedback = (message, success = true) => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = message;
                    btn.style.background = success ? '#d4edda' : '#f8d7da';
                    btn.style.borderColor = success ? '#28a745' : '#dc3545';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '#fff';
                        btn.style.borderColor = '#ddd';
                    }, 1500);
                };

                this._addEventHandler(btn, 'mouseenter', () => {
                    btn.style.background = '#f8f9fa';
                    btn.style.borderColor = '#adb5bd';
                });
                this._addEventHandler(btn, 'mouseleave', () => {
                    btn.style.background = '#fff';
                    btn.style.borderColor = '#ddd';
                });
                this._addEventHandler(btn, 'click', () => {
                    const selected = this.getSelected();
                    const rowCount = selected.length > 0 ? selected.length : this._filteredData.length;
                    const suffix = selected.length > 0 ? ` (${rowCount} selected)` : ` (${rowCount} rows)`;

                    if (downloadMode) {
                        // Download mode
                        const format = config.format === 'text' ? 'csv' : config.format;
                        this.download(format);
                        showFeedback('✓ Downloaded!' + suffix);
                    } else {
                        // Copy mode
                        const format = config.format === 'excel' ? 'text' : config.format;
                        this.copyToClipboard(format);
                        showFeedback('✓ Copied!' + suffix);
                    }
                });

                exportWrapper.appendChild(btn);
            }

            toolbar.appendChild(exportWrapper);
        }

        if (opts.searchable || opts.columnToggle || opts.exportPanel) {
            wrapper.appendChild(toolbar);
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
            select.className = 'form-select';
            select.style.cssText = 'width: auto; display: inline-block; margin: 0 5px;';
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
            const createBtn = (content, onClick, disabled = false, isIcon = false) => {
                const btn = document.createElement('button');
                if (isIcon) {
                    btn.innerHTML = content;
                } else {
                    btn.textContent = content;
                }
                btn.disabled = disabled;
                btn.style.cssText = 'padding: 6px 12px; margin: 0 2px; border: 1px solid #ddd; background: #fff; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center;';
                if (disabled) btn.style.opacity = '0.5';
                this._addEventHandler(btn, 'click', onClick);
                return btn;
            };

            buttonsWrapper.appendChild(createBtn(icons.html('chevrons-left', {size: 14}), () => this.firstPage(), this._currentPage === 1, true));
            buttonsWrapper.appendChild(createBtn(icons.html('chevron-left', {size: 14}), () => this.prevPage(), this._currentPage === 1, true));

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

            buttonsWrapper.appendChild(createBtn(icons.html('chevron-right', {size: 14}), () => this.nextPage(), this._currentPage === info.totalPages, true));
            buttonsWrapper.appendChild(createBtn(icons.html('chevrons-right', {size: 14}), () => this.lastPage(), this._currentPage === info.totalPages, true));

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
