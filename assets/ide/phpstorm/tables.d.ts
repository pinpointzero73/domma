/**
 * Domma Tables Module - TypeScript Declarations
 * DataTable-like functionality with sorting, filtering, pagination, and export
 */

// ============================================
// Types
// ============================================

export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'multiple';
export type ExportFormat = 'csv' | 'json' | 'excel';
export type TableEventType = 'sort' | 'filter' | 'page' | 'select' | 'edit' | 'render';

export interface ColumnDefinition {
    /** Column key in data object */
    key: string;
    /** Display header text */
    title?: string;
    /** Enable sorting for this column */
    sortable?: boolean;
    /** Enable filtering for this column */
    filterable?: boolean;
    /** Column width */
    width?: string | number;
    /** Text alignment */
    align?: 'left' | 'center' | 'right';
    /** Custom render function */
    render?: (value: any, row: Record<string, any>, index: number) => string;
    /** Custom sort comparator */
    comparator?: (a: any, b: any) => number;
    /** Make column editable */
    editable?: boolean;
    /** Input type for editable cells */
    editType?: 'text' | 'number' | 'select' | 'checkbox';
    /** Options for select edit type */
    editOptions?: string[] | { value: any; label: string }[];
    /** Column visibility */
    visible?: boolean;
    /** CSS class for column */
    className?: string;
}

export interface SortState {
    column: string;
    direction: SortDirection;
}

export interface FilterState {
    column: string;
    value: any;
    operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
}

export interface PageInfo {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRows: number;
    startRow: number;
    endRow: number;
}

export interface TableEventData {
    type: TableEventType;
    data?: any;
}

export type TableEventCallback = (event: TableEventData) => void;

// ============================================
// Table Options
// ============================================

export interface TableOptions {
    /** Initial data array */
    data?: Record<string, any>[];
    /** Column definitions */
    columns?: ColumnDefinition[];
    /** Enable sorting */
    sortable?: boolean;
    /** Enable filtering */
    filterable?: boolean;
    /** Enable global search */
    searchable?: boolean;
    /** Enable pagination */
    pagination?: boolean;
    /** Rows per page */
    pageSize?: number;
    /** Page size options */
    pageSizeOptions?: number[];
    /** Enable row selection */
    selectable?: boolean;
    /** Selection mode: 'single' or 'multiple' */
    selectionMode?: SelectionMode;
    /** Enable cell editing */
    editable?: boolean;
    /** Enable column resizing */
    resizable?: boolean;
    /** Show export panel */
    exportPanel?: boolean;
    /** Show row numbers */
    showRowNumbers?: boolean;
    /** Empty state message */
    emptyMessage?: string;
    /** Loading state message */
    loadingMessage?: string;
    /** CSS class for table */
    className?: string;
    /** Striped rows */
    striped?: boolean;
    /** Hoverable rows */
    hover?: boolean;
    /** Bordered table */
    bordered?: boolean;
    /** Compact/dense layout */
    compact?: boolean;
    /** Responsive wrapper */
    responsive?: boolean;
}

// ============================================
// Table Instance
// ============================================

export interface TableInstance {
    /** The table element */
    element: HTMLElement;
    /** Current options */
    options: TableOptions;

    // Data Methods
    /** Set table data */
    setData(data: Record<string, any>[]): this;

    /** Get current data (filtered and sorted) */
    getData(): Record<string, any>[];

    /** Get original unfiltered data */
    getOriginalData(): Record<string, any>[];

    /** Add a single row */
    addRow(row: Record<string, any>): this;

    /** Add multiple rows */
    addRows(rows: Record<string, any>[]): this;

    /** Update a row by index */
    updateRow(index: number, data: Partial<Record<string, any>>): this;

    /** Remove a row by index */
    removeRow(index: number): this;

    /** Remove multiple rows by indices */
    removeRows(indices: number[]): this;

    /** Clear all data */
    clear(): this;

    /** Refresh the table display */
    refresh(): this;

    // Sort Methods
    /** Sort by column */
    sort(column: string, direction?: SortDirection): this;

    /** Sort by multiple columns */
    sortMultiple(sorts: SortState[]): this;

    /** Clear all sorting */
    clearSort(): this;

    /** Get current sort state */
    getSortState(): SortState[];

    // Filter Methods
    /** Global search across all columns */
    search(query: string): this;

    /** Filter with a custom function */
    filter(fn: (row: Record<string, any>, index: number) => boolean): this;

    /** Filter by column value */
    filterBy(column: string, value: any, operator?: FilterState['operator']): this;

    /** Clear all filters */
    clearFilters(): this;

    /** Get current filter state */
    getFilters(): FilterState[];

    // Pagination Methods
    /** Go to a specific page (1-indexed) */
    page(pageNumber: number): this;

    /** Set page size */
    pageSize(size: number): this;

    /** Go to next page */
    nextPage(): this;

    /** Go to previous page */
    prevPage(): this;

    /** Go to first page */
    firstPage(): this;

    /** Go to last page */
    lastPage(): this;

    /** Get pagination info */
    pageInfo(): PageInfo;

    // Selection Methods
    /** Select row(s) by index */
    select(index: number | number[]): this;

    /** Deselect row(s) by index */
    deselect(index: number | number[]): this;

    /** Select all rows */
    selectAll(): this;

    /** Deselect all rows */
    deselectAll(): this;

    /** Toggle row selection */
    toggleSelect(index: number): this;

    /** Get selected row data */
    getSelected(): Record<string, any>[];

    /** Get selected row indices */
    getSelectedIndices(): number[];

    // Column Methods
    /** Show a column */
    showColumn(key: string): this;

    /** Hide a column */
    hideColumn(key: string): this;

    /** Toggle column visibility */
    toggleColumn(key: string): this;

    /** Get column visibility state */
    getColumnVisibility(): Record<string, boolean>;

    /** Reorder columns */
    reorderColumns(keys: string[]): this;

    // Editing Methods
    /** Edit a cell value */
    editCell(rowIndex: number, column: string, value: any): this;

    /** Get edited cells */
    getEditedCells(): Array<{ row: number; column: string; value: any; originalValue: any }>;

    /** Clear edit history */
    clearEdits(): this;

    // Export Methods
    /** Export to CSV string */
    toCSV(options?: { delimiter?: string; includeHeaders?: boolean }): string;

    /** Export to JSON string */
    toJSON(options?: { pretty?: boolean }): string;

    /** Export to Excel-compatible format */
    toExcel(): Blob;

    /** Download export file */
    download(format: ExportFormat, filename?: string): this;

    /** Copy to clipboard */
    copyToClipboard(format?: 'csv' | 'json'): Promise<boolean>;

    // Event Methods
    /** Subscribe to table events */
    on(event: TableEventType, callback: TableEventCallback): this;

    /** Unsubscribe from table events */
    off(event: TableEventType, callback?: TableEventCallback): this;

    /** Subscribe to event once */
    once(event: TableEventType, callback: TableEventCallback): this;

    // Rendering Methods
    /** Force re-render */
    render(): this;

    /** Destroy the table instance */
    destroy(): void;

    // State Methods
    /** Get current table state */
    getState(): {
        data: Record<string, any>[];
        sort: SortState[];
        filters: FilterState[];
        page: PageInfo;
        selected: number[];
    };

    /** Restore table state */
    setState(state: Partial<ReturnType<TableInstance['getState']>>): this;
}

// ============================================
// Tables Module
// ============================================

export interface Tables {
    /** Create a new table instance */
    create(selector: string | HTMLElement, options?: TableOptions): TableInstance;

    /** Get an existing table instance */
    get(selector: string | HTMLElement): TableInstance | undefined;

    /** Destroy a table instance */
    destroy(selector: string | HTMLElement): void;

    /** Destroy all table instances */
    destroyAll(): void;
}

export declare const tables: Tables;
