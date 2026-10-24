/** @typedef {Record<string, any>} TableRow A data row - a plain object keyed by column key. */
/** @typedef {'asc'|'desc'} SortDirection */
/** @typedef {'single'|'multiple'} SelectionMode */
/** @typedef {'csv'|'json'|'excel'} ExportFormat Formats `download()` writes (anything else is written as JSON). */
/** @typedef {'copy'|'text'|'csv'|'excel'|'json'} TableExportOption Buttons the export panel can show ('copy' is an alias of 'text'). */
/** @typedef {'sort'|'filter'|'page'|'select'|'edit'|'render'} TableEventType */
/**
 * Column filter operators. Text comparisons are case-insensitive; 'between' takes `[min, max]`,
 * 'in' takes an array of values. An unknown operator compares as 'equals'.
 * @typedef {'equals'|'contains'|'startsWith'|'endsWith'|'gt'|'lt'|'gte'|'lte'|'between'|'in'} FilterOperator
 */
/**
 * A column as passed in `options.columns` (a plain string is shorthand for `{key}`).
 * @typedef {object} ColumnDefinition
 * @property {string} key - Column key in the data object
 * @property {string} [title] - Header text (defaults to the key)
 * @property {boolean} [sortable] - false turns sorting off for this column (also off when `options.sortable` is false)
 * @property {boolean} [filterable] - false marks the column as not filterable
 * @property {boolean} [editable] - Double-click to edit the cell (needs `options.editable`)
 * @property {string|number} [width] - Column width; a number is pixels
 * @property {(value: any, row: TableRow, index: number) => string} [render] - Cell HTML (set as innerHTML)
 * @property {any[]} [filterOptions] - Stored on the column for custom filter UIs
 * @property {boolean} [visible] - false starts the column hidden
 */
/**
 * A column after normalisation, as `getColumns()` returns it.
 * @typedef {object} TableColumn
 * @property {string} key
 * @property {string} title
 * @property {boolean} sortable
 * @property {boolean} filterable
 * @property {boolean} editable
 * @property {string|number|null} width
 * @property {((value: any, row: TableRow, index: number) => string)|null} render
 * @property {any[]|null} filterOptions
 * @property {boolean} visible
 */
/**
 * @typedef {object} SortState
 * @property {string} column
 * @property {SortDirection} direction
 */
/**
 * @typedef {object} FilterState
 * @property {string} column
 * @property {any} value
 * @property {FilterOperator} [operator]
 */
/**
 * @typedef {object} PageInfo
 * @property {number} page - Current page (1-based)
 * @property {number} pageSize
 * @property {number} totalPages
 * @property {number} totalRows - Rows after filtering
 * @property {number} startRow - 1-based index of the first row on the page
 * @property {number} endRow - 1-based index of the last row on the page
 */
/**
 * Payload of `onSort`: `sort()` sends column + direction + sorts, `sortMultiple()` sends sorts only.
 * @typedef {object} TableSortEvent
 * @property {string} [column]
 * @property {SortDirection} [direction]
 * @property {SortState[]} sorts
 */
/**
 * Payload of `onFilter`: `type: 'search'` from `search()`, `type: 'column'` from `filter()`.
 * @typedef {object} TableFilterEvent
 * @property {'search'|'column'} type
 * @property {string} [query]
 * @property {boolean} [isRegex]
 * @property {string} [column]
 * @property {any} [value]
 * @property {FilterOperator} [operator]
 */
/**
 * Payload of `onEdit`.
 * @typedef {object} TableEditEvent
 * @property {TableRow} row
 * @property {string} column
 * @property {any} oldValue
 * @property {string} newValue
 */
/**
 * Payload of `onExport`.
 * @typedef {object} TableExportEvent
 * @property {ExportFormat|'clipboard'} format
 * @property {string} [filename]
 * @property {number} rowCount
 * @property {boolean} [selectedOnly]
 */
/**
 * What an event callback receives: sort -> TableSortEvent, filter -> TableFilterEvent,
 * page -> PageInfo, select -> the selected rows, edit -> TableEditEvent, render -> the table.
 * @typedef {TableSortEvent|TableFilterEvent|PageInfo|TableRow[]|TableEditEvent|TableInstance} TableEventData
 */
/**
 * @callback TableEventCallback
 * @param {TableEventData} data - What each event sends: see TableEventData
 * @returns {void}
 */
/**
 * CSS class names the table renders with.
 * @typedef {object} TableClasses
 * @property {string} [wrapper]
 * @property {string} [table]
 * @property {string} [header]
 * @property {string} [body]
 * @property {string} [row]
 * @property {string} [cell]
 * @property {string} [selected]
 * @property {string} [sorted]
 * @property {string} [sortAsc]
 * @property {string} [sortDesc]
 * @property {string} [pagination]
 * @property {string} [search]
 */
/**
 * @typedef {object} TableOptions
 * @property {TableRow[]} [data] - Initial data
 * @property {Array<ColumnDefinition|string>} [columns] - Column definitions
 * @property {string} [rowKey] - Row identity field for select / update / remove (default 'id')
 * @property {boolean} [sortable] - Enable sorting (default true)
 * @property {boolean} [multiSort] - Allow sorting by several columns (default false)
 * @property {SortState|null} [defaultSort] - Sort applied on first render
 * @property {boolean} [filterable] - Enable filtering (default true)
 * @property {boolean} [searchable] - Show the search box (default true)
 * @property {string} [searchPlaceholder] - Search box placeholder (default 'Search...')
 * @property {boolean} [pagination] - Enable pagination (default true)
 * @property {number} [pageSize] - Rows per page (default 10)
 * @property {number[]} [pageSizeOptions] - Page size choices (default [10, 25, 50, 100])
 * @property {boolean} [selectable] - Enable row selection (default false)
 * @property {SelectionMode} [selectionMode] - default 'single'
 * @property {boolean} [editable] - Enable cell editing on editable columns (default false)
 * @property {string} [editMode] - default 'cell'
 * @property {boolean} [resizable] - default true
 * @property {boolean|number} [loadingSkeleton] - Skeleton rows until the first setData()/addRow(): true = min(pageSize, 5), or a row count
 * @property {string} [loadingLabel] - Screen-reader status while loading (default 'Loading...')
 * @property {boolean} [striped] - Striped rows (default true)
 * @property {boolean} [hover] - Row hover colour (default true)
 * @property {boolean} [bordered] - default true
 * @property {boolean} [responsive] - default true
 * @property {string|null} [evenRowColor] - Named variant (see TableInstance.stripeColors), hex/rgb/hsl or var()
 * @property {string|null} [oddRowColor] - Named variant or colour
 * @property {string|null} [hoverColor] - Named variant (see TableInstance.hoverColors) or colour
 * @property {TableClasses} [classes] - CSS class names
 * @property {boolean} [exportPanel] - Show the export panel (default false)
 * @property {TableExportOption[]} [exportOptions] - Export panel buttons (default ['copy', 'csv', 'excel', 'json'])
 * @property {boolean} [columnToggle] - Show the column visibility menu (default false)
 * @property {boolean} [regexSearch] - Show the regex search toggle (default false)
 * @property {boolean} [persistSettings] - Remember column visibility/width, sorting and page size (default false)
 * @property {string|null} [storageKey] - Storage key (defaults to `domma-table-<element id>`)
 * @property {((event: TableSortEvent) => void)|null} [onSort]
 * @property {((event: TableFilterEvent) => void)|null} [onFilter]
 * @property {((info: PageInfo) => void)|null} [onPageChange]
 * @property {((selected: TableRow[]) => void)|null} [onSelect]
 * @property {((event: TableEditEvent) => void)|null} [onEdit]
 * @property {((table: TableInstance) => void)|null} [onRender]
 * @property {((event: TableExportEvent) => void)|null} [onExport]
 */
/**
 * Table Instance Class
 */
export class TableInstance {
    static stripeColors: {
        none: string;
        lighter: string;
        light: string;
        medium: string;
        dark: string;
        'primary-tint': string;
        'success-tint': string;
        'warning-tint': string;
        'danger-tint': string;
        'info-tint': string;
        default: string;
    };
    static hoverColors: {
        none: string;
        lighter: string;
        light: string;
        medium: string;
        dark: string;
        default: string;
    };
    /**
     * @param {string|HTMLElement|null} element - Container element or selector
     * @param {TableOptions} [options]
     */
    constructor(element: string | HTMLElement | null, options?: TableOptions);
    /** @type {HTMLElement|null} */
    element: HTMLElement | null;
    /** @type {TableOptions} */
    options: TableOptions;
    _originalData: TableRow[];
    _data: TableRow[];
    _filteredData: TableRow[];
    _currentPage: number;
    _pageSize: number;
    _sorts: any[];
    _filters: any[];
    _searchQuery: string;
    _selected: Set<any>;
    _editingCell: {
        rowIndex: number;
        column: string;
    };
    _eventListeners: Map<any, any>;
    _columnDropdownOpen: boolean;
    _searchIsRegex: boolean;
    _loading: boolean;
    /** @type {TableColumn[]} @private */
    private _columns;
    /** @private */
    private _init;
    /**
     * Resolve a color value - supports named variants, CSS variables, and direct colors
     * @param {string} colorValue - Named variant (e.g., 'light') or direct color (e.g., '#fff')
     * @param {Object} colorMap - Dictionary to lookup named variants
     * @param {string} fallback - Fallback color if value is invalid
     * @returns {string} Resolved color value
     * @private
     */
    private _resolveColor;
    /**
     * Get the stripe color configuration for a row
     * @param {number} rowIndex - The row index (0-based)
     * @returns {Object} Object with { background, hover } colors
     * @private
     */
    private _getRowColors;
    /**
     * Replace the data (ends a loadingSkeleton state) and go to page 1.
     * @param {TableRow[]} data
     * @returns {this}
     */
    setData(data: TableRow[]): this;
    /**
     * Rows on the current page (filtered and sorted).
     * @returns {TableRow[]}
     */
    getData(): TableRow[];
    /**
     * Show (or hide) skeleton rows in place of the body - for a reload. The
     * first setData() or addRow() turns it off again.
     * @param {boolean} [on=true]
     * @returns {this}
     */
    setLoading(on?: boolean): this;
    /**
     * Whether skeleton rows are showing.
     * @returns {boolean}
     */
    isLoading(): boolean;
    /**
     * Every row that passes the search and filters, sorted.
     * @returns {TableRow[]}
     */
    getFilteredData(): TableRow[];
    /**
     * The data as given, unfiltered and unsorted.
     * @returns {TableRow[]}
     */
    getOriginalData(): TableRow[];
    /**
     * Append a row (ends a loadingSkeleton state).
     * @param {TableRow} rowData
     * @returns {this}
     */
    addRow(rowData: TableRow): this;
    /**
     * Merge values into a row.
     * @param {number|string} identifier - Index in the original data (a number), or the row's `rowKey` value
     * @param {Partial<TableRow>} rowData
     * @returns {this}
     */
    updateRow(identifier: number | string, rowData: Partial<TableRow>): this;
    /**
     * @param {number|string} identifier - Index in the original data (a number), or the row's `rowKey` value
     * @returns {this}
     */
    removeRow(identifier: number | string): this;
    /** @private */
    private _findRowIndex;
    /**
     * Sort by one column (replaces any other sort).
     * @param {string} column
     * @param {SortDirection} [direction='asc']
     * @returns {this}
     */
    sort(column: string, direction?: SortDirection): this;
    /**
     * Sort by several columns, first entry first.
     * @param {SortState[]} sorts
     * @returns {this}
     */
    sortMultiple(sorts: SortState[]): this;
    /** @returns {this} */
    clearSort(): this;
    /** @private */
    private _applySort;
    /**
     * Search every column (plain text, case-insensitive, or a regular expression in regex mode).
     * @param {string} query
     * @returns {this}
     */
    search(query: string): this;
    /**
     * @param {boolean} isRegex - true treats the search query as a regular expression
     * @returns {this}
     */
    setSearchMode(isRegex: boolean): this;
    /** @returns {this} */
    toggleSearchMode(): this;
    /**
     * Filter one column (replaces that column's earlier filter; an empty value removes it).
     * @param {string} column
     * @param {any} value
     * @param {FilterOperator} [operator='equals']
     * @returns {this}
     */
    filter(column: string, value: any, operator?: FilterOperator): this;
    /**
     * Filter with a custom predicate (replaces the previous one).
     * @param {(row: TableRow, index: number, rows: TableRow[]) => boolean} filterFn
     * @returns {this}
     */
    filterBy(filterFn: (row: TableRow, index: number, rows: TableRow[]) => boolean): this;
    _customFilter: (row: TableRow, index: number, rows: TableRow[]) => boolean;
    /**
     * Clear the column filters, the search and the custom filter.
     * @returns {this}
     */
    clearFilters(): this;
    /** @private */
    private _applyFilters;
    /** @private */
    private _matchFilter;
    /** @private */
    private _applyFiltersAndSort;
    /**
     * Go to a page (1-based, clamped to the page range).
     * @param {number} pageNum
     * @returns {this}
     */
    page(pageNum: number): this;
    /**
     * @param {number} size - Rows per page
     * @returns {this}
     */
    pageSize(size: number): this;
    /** @returns {this} */
    nextPage(): this;
    /** @returns {this} */
    prevPage(): this;
    /** @returns {this} */
    firstPage(): this;
    /** @returns {this} */
    lastPage(): this;
    /** @returns {PageInfo} */
    pageInfo(): PageInfo;
    /** @private */
    private _getTotalPages;
    /** @private */
    private _getPageData;
    /**
     * Select a row (needs `selectable`; in 'single' mode it replaces the selection).
     * @param {string|number|TableRow} identifier - The row's `rowKey` value, or the row itself
     * @returns {this}
     */
    select(identifier: string | number | TableRow): this;
    /**
     * @param {string|number|TableRow} identifier - The row's `rowKey` value, or the row itself
     * @returns {this}
     */
    deselect(identifier: string | number | TableRow): this;
    /**
     * @param {string|number|TableRow} identifier - The row's `rowKey` value, or the row itself
     * @returns {this}
     */
    toggleSelect(identifier: string | number | TableRow): this;
    /**
     * Select every filtered row ('multiple' mode only).
     * @returns {this}
     */
    selectAll(): this;
    /** @returns {this} */
    deselectAll(): this;
    /**
     * Selected rows among the filtered data.
     * @returns {TableRow[]}
     */
    getSelected(): TableRow[];
    /**
     * @param {string|number|TableRow} identifier - The row's `rowKey` value, or the row itself
     * @returns {boolean}
     */
    isSelected(identifier: string | number | TableRow): boolean;
    /** @private */
    private _getStorageKey;
    /** @private */
    private _loadSettings;
    /** @private */
    private _saveSettings;
    /**
     * Forget the persisted settings (with `persistSettings`).
     * @returns {void}
     */
    clearSettings(): void;
    /**
     * @param {string} key
     * @returns {this}
     */
    showColumn(key: string): this;
    /**
     * @param {string} key
     * @returns {this}
     */
    hideColumn(key: string): this;
    /**
     * @param {string} key
     * @returns {this}
     */
    toggleColumn(key: string): this;
    /** @returns {TableColumn[]} */
    getVisibleColumns(): TableColumn[];
    /** @returns {TableColumn[]} */
    getHiddenColumns(): TableColumn[];
    /**
     * @param {string} key
     * @param {string|number} width - A number is pixels
     * @returns {this}
     */
    resizeColumn(key: string, width: string | number): this;
    /** @returns {TableColumn[]} */
    getColumns(): TableColumn[];
    /**
     * Open a cell's editor (needs `editable`).
     * @param {number} rowIndex - Row index on the current page
     * @param {string} column
     * @returns {this}
     */
    editCell(rowIndex: number, column: string): this;
    /** @returns {this} */
    saveEdits(): this;
    /** @returns {this} */
    cancelEdits(): this;
    /**
     * Selected rows if any, otherwise every filtered row, as CSV.
     * @param {{columns?: TableColumn[], includeHeaders?: boolean}} [options]
     * @returns {string}
     */
    toCSV(options?: {
        columns?: TableColumn[];
        includeHeaders?: boolean;
    }): string;
    /** @private */
    private _getExportData;
    /**
     * Selected rows if any, otherwise every filtered row, as a JSON string (visible columns only).
     * @param {{columns?: TableColumn[], pretty?: boolean}} [options]
     * @returns {string}
     */
    toJSON(options?: {
        columns?: TableColumn[];
        pretty?: boolean;
    }): string;
    /**
     * Download the export as a file (default name data.csv / data.xls / data.json).
     * @param {ExportFormat} format
     * @param {string} [filename]
     * @returns {void}
     */
    download(format: ExportFormat, filename?: string): void;
    /**
     * Selected rows if any, otherwise every filtered row, as an Excel-readable HTML document.
     * @param {{columns?: TableColumn[]}} [options]
     * @returns {string}
     */
    toExcel(options?: {
        columns?: TableColumn[];
    }): string;
    /**
     * Copy the export to the clipboard: 'text' (tab-separated, default), 'csv' or 'json'.
     * @param {'text'|'csv'|'json'} [format='text']
     * @returns {Promise<this>}
     */
    copyToClipboard(format?: "text" | "csv" | "json"): Promise<this>;
    /** @private */
    private _escapeHtml;
    /**
     * Rebuild the table's DOM.
     * @returns {this}
     */
    render(): this;
    /** @private */
    private _reinitRenderedContent;
    /** @private */
    private _addEventHandler;
    /** @private */
    private _clearEventListeners;
    /** @private */
    private _restoreIconsBeforeRebuild;
    /**
     * @overload
     * @param {'sort'} event
     * @param {(event: TableSortEvent) => void} callback
     * @returns {this}
     */
    on(event: "sort", callback: (event: TableSortEvent) => void): this;
    /**
     * @overload
     * @param {'filter'} event
     * @param {(event: TableFilterEvent) => void} callback
     * @returns {this}
     */
    on(event: "filter", callback: (event: TableFilterEvent) => void): this;
    /**
     * @overload
     * @param {'page'} event
     * @param {(info: PageInfo) => void} callback
     * @returns {this}
     */
    on(event: "page", callback: (info: PageInfo) => void): this;
    /**
     * @overload
     * @param {'select'} event
     * @param {(selected: TableRow[]) => void} callback
     * @returns {this}
     */
    on(event: "select", callback: (selected: TableRow[]) => void): this;
    /**
     * @overload
     * @param {'edit'} event
     * @param {(event: TableEditEvent) => void} callback
     * @returns {this}
     */
    on(event: "edit", callback: (event: TableEditEvent) => void): this;
    /**
     * @overload
     * @param {'render'} event
     * @param {(table: TableInstance) => void} callback
     * @returns {this}
     */
    on(event: "render", callback: (table: TableInstance) => void): this;
    /**
     * @overload
     * @param {TableEventType} event
     * @param {TableEventCallback} callback
     * @returns {this}
     */
    on(event: TableEventType, callback: TableEventCallback): this;
    /**
     * Remove the callback for an event.
     * @param {TableEventType} event
     * @returns {this}
     */
    off(event: TableEventType): this;
    /**
     * Re-apply filters and sort, then render.
     * @returns {this}
     */
    refresh(): this;
    /**
     * Remove the listeners and empty the element.
     * @returns {void}
     */
    destroy(): void;
}
export namespace tables {
    let _instances: Map<HTMLElement, TableInstance>;
    /**
     * Create a table in a container (a later create on the same element replaces the registered one).
     * @param {string|HTMLElement} selector - Container element or selector
     * @param {TableOptions} [options]
     * @returns {TableInstance}
     */
    function create(selector: string | HTMLElement, options?: TableOptions): TableInstance;
    /**
     * The table created in a container, if any.
     * @param {string|HTMLElement} selector
     * @returns {TableInstance|undefined}
     */
    function get(selector: string | HTMLElement): TableInstance | undefined;
    /**
     * Destroy the table in a container and forget it.
     * @param {string|HTMLElement} selector
     * @returns {void}
     */
    function destroy(selector: string | HTMLElement): void;
    /**
     * Destroy every table created through `tables.create()`.
     * @returns {void}
     */
    function destroyAll(): void;
}
/**
 * A data row - a plain object keyed by column key.
 */
export type TableRow = Record<string, any>;
export type SortDirection = "asc" | "desc";
export type SelectionMode = "single" | "multiple";
/**
 * Formats `download()` writes (anything else is written as JSON).
 */
export type ExportFormat = "csv" | "json" | "excel";
/**
 * Buttons the export panel can show ('copy' is an alias of 'text').
 */
export type TableExportOption = "copy" | "text" | "csv" | "excel" | "json";
export type TableEventType = "sort" | "filter" | "page" | "select" | "edit" | "render";
/**
 * Column filter operators. Text comparisons are case-insensitive; 'between' takes `[min, max]`,
 * 'in' takes an array of values. An unknown operator compares as 'equals'.
 */
export type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte" | "between" | "in";
/**
 * A column as passed in `options.columns` (a plain string is shorthand for `{key}`).
 */
export type ColumnDefinition = {
    /**
     * - Column key in the data object
     */
    key: string;
    /**
     * - Header text (defaults to the key)
     */
    title?: string;
    /**
     * - false turns sorting off for this column (also off when `options.sortable` is false)
     */
    sortable?: boolean;
    /**
     * - false marks the column as not filterable
     */
    filterable?: boolean;
    /**
     * - Double-click to edit the cell (needs `options.editable`)
     */
    editable?: boolean;
    /**
     * - Column width; a number is pixels
     */
    width?: string | number;
    /**
     * - Cell HTML (set as innerHTML)
     */
    render?: (value: any, row: TableRow, index: number) => string;
    /**
     * - Stored on the column for custom filter UIs
     */
    filterOptions?: any[];
    /**
     * - false starts the column hidden
     */
    visible?: boolean;
};
/**
 * A column after normalisation, as `getColumns()` returns it.
 */
export type TableColumn = {
    key: string;
    title: string;
    sortable: boolean;
    filterable: boolean;
    editable: boolean;
    width: string | number | null;
    render: ((value: any, row: TableRow, index: number) => string) | null;
    filterOptions: any[] | null;
    visible: boolean;
};
export type SortState = {
    column: string;
    direction: SortDirection;
};
export type FilterState = {
    column: string;
    value: any;
    operator?: FilterOperator;
};
export type PageInfo = {
    /**
     * - Current page (1-based)
     */
    page: number;
    pageSize: number;
    totalPages: number;
    /**
     * - Rows after filtering
     */
    totalRows: number;
    /**
     * - 1-based index of the first row on the page
     */
    startRow: number;
    /**
     * - 1-based index of the last row on the page
     */
    endRow: number;
};
/**
 * Payload of `onSort`: `sort()` sends column + direction + sorts, `sortMultiple()` sends sorts only.
 */
export type TableSortEvent = {
    column?: string;
    direction?: SortDirection;
    sorts: SortState[];
};
/**
 * Payload of `onFilter`: `type: 'search'` from `search()`, `type: 'column'` from `filter()`.
 */
export type TableFilterEvent = {
    type: "search" | "column";
    query?: string;
    isRegex?: boolean;
    column?: string;
    value?: any;
    operator?: FilterOperator;
};
/**
 * Payload of `onEdit`.
 */
export type TableEditEvent = {
    row: TableRow;
    column: string;
    oldValue: any;
    newValue: string;
};
/**
 * Payload of `onExport`.
 */
export type TableExportEvent = {
    format: ExportFormat | "clipboard";
    filename?: string;
    rowCount: number;
    selectedOnly?: boolean;
};
/**
 * What an event callback receives: sort -> TableSortEvent, filter -> TableFilterEvent,
 * page -> PageInfo, select -> the selected rows, edit -> TableEditEvent, render -> the table.
 */
export type TableEventData = TableSortEvent | TableFilterEvent | PageInfo | TableRow[] | TableEditEvent | TableInstance;
export type TableEventCallback = (data: TableEventData) => void;
/**
 * CSS class names the table renders with.
 */
export type TableClasses = {
    wrapper?: string;
    table?: string;
    header?: string;
    body?: string;
    row?: string;
    cell?: string;
    selected?: string;
    sorted?: string;
    sortAsc?: string;
    sortDesc?: string;
    pagination?: string;
    search?: string;
};
export type TableOptions = {
    /**
     * - Initial data
     */
    data?: TableRow[];
    /**
     * - Column definitions
     */
    columns?: Array<ColumnDefinition | string>;
    /**
     * - Row identity field for select / update / remove (default 'id')
     */
    rowKey?: string;
    /**
     * - Enable sorting (default true)
     */
    sortable?: boolean;
    /**
     * - Allow sorting by several columns (default false)
     */
    multiSort?: boolean;
    /**
     * - Sort applied on first render
     */
    defaultSort?: SortState | null;
    /**
     * - Enable filtering (default true)
     */
    filterable?: boolean;
    /**
     * - Show the search box (default true)
     */
    searchable?: boolean;
    /**
     * - Search box placeholder (default 'Search...')
     */
    searchPlaceholder?: string;
    /**
     * - Enable pagination (default true)
     */
    pagination?: boolean;
    /**
     * - Rows per page (default 10)
     */
    pageSize?: number;
    /**
     * - Page size choices (default [10, 25, 50, 100])
     */
    pageSizeOptions?: number[];
    /**
     * - Enable row selection (default false)
     */
    selectable?: boolean;
    /**
     * - default 'single'
     */
    selectionMode?: SelectionMode;
    /**
     * - Enable cell editing on editable columns (default false)
     */
    editable?: boolean;
    /**
     * - default 'cell'
     */
    editMode?: string;
    /**
     * - default true
     */
    resizable?: boolean;
    /**
     * - Skeleton rows until the first setData()/addRow(): true = min(pageSize, 5), or a row count
     */
    loadingSkeleton?: boolean | number;
    /**
     * - Screen-reader status while loading (default 'Loading...')
     */
    loadingLabel?: string;
    /**
     * - Striped rows (default true)
     */
    striped?: boolean;
    /**
     * - Row hover colour (default true)
     */
    hover?: boolean;
    /**
     * - default true
     */
    bordered?: boolean;
    /**
     * - default true
     */
    responsive?: boolean;
    /**
     * - Named variant (see TableInstance.stripeColors), hex/rgb/hsl or var()
     */
    evenRowColor?: string | null;
    /**
     * - Named variant or colour
     */
    oddRowColor?: string | null;
    /**
     * - Named variant (see TableInstance.hoverColors) or colour
     */
    hoverColor?: string | null;
    /**
     * - CSS class names
     */
    classes?: TableClasses;
    /**
     * - Show the export panel (default false)
     */
    exportPanel?: boolean;
    /**
     * - Export panel buttons (default ['copy', 'csv', 'excel', 'json'])
     */
    exportOptions?: TableExportOption[];
    /**
     * - Show the column visibility menu (default false)
     */
    columnToggle?: boolean;
    /**
     * - Show the regex search toggle (default false)
     */
    regexSearch?: boolean;
    /**
     * - Remember column visibility/width, sorting and page size (default false)
     */
    persistSettings?: boolean;
    /**
     * - Storage key (defaults to `domma-table-<element id>`)
     */
    storageKey?: string | null;
    onSort?: ((event: TableSortEvent) => void) | null;
    onFilter?: ((event: TableFilterEvent) => void) | null;
    onPageChange?: ((info: PageInfo) => void) | null;
    onSelect?: ((selected: TableRow[]) => void) | null;
    onEdit?: ((event: TableEditEvent) => void) | null;
    onRender?: ((table: TableInstance) => void) | null;
    onExport?: ((event: TableExportEvent) => void) | null;
};
export type Tables = typeof tables;
