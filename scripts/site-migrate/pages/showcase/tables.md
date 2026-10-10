---
title: Tables
description: "DataTable-like functionality for interactive data grids with sorting, filtering, pagination, and more."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Tables" tagline="DataTable-like functionality for interactive data grids with sorting, filtering, pagination, and more." align="center"][/hero]

## Creating Tables

Transform a table element into an interactive data grid.

```javascript
// Create a table instance
const table = Domma.tables.create('#my-table', {
    data: [
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
        // ...more rows
    ],
    columns: [
        { key: 'id', title: 'ID', sortable: true },
        { key: 'name', title: 'Name', sortable: true },
        { key: 'email', title: 'Email', sortable: true, editable: true },
        { key: 'role', title: 'Role', filterable: true },
        {
            key: 'actions',
            title: '',
            render: (val, row) => `Edit`
        }
    ],
    pagination: true,
    pageSize: 10,
    selectable: true
});

// HTML
```

### Column Options

[table striped="true"]
| Option | Type | Description |
| --- | --- | --- |
| `key` | string | Property name in data object |
| `title` | string | Column header text |
| `sortable` | boolean | Enable sorting on this column |
| `filterable` | boolean | Enable filtering on this column |
| `editable` | boolean | Enable inline editing |
| `render` | function | Custom cell renderer (val, row) => html |
[/table]

### Custom Render Examples

Use the `render` function to transform cell values - perfect for date formatting, badges, or custom HTML.

```javascript
// Format dates using Domma's date module
{
    key: 'joined',
    title: 'Joined',
    sortable: true,
    render: (val) => D(val).format('DD/MM/YYYY')  // 15/01/2024
}

// Status badge with conditional styling
{
    key: 'status',
    title: 'Status',
    render: (val) => `${val}`
}

// Action buttons with row data
{
    key: 'actions',
    title: '',
    render: (val, row) => `Edit ${row.name}`
}
```

**Tip:** Use `width: '100px'` or `width:
                '20%'` to set column widths.

### Table Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | array | [] | Array of row objects |
| `columns` | array | [] | Column configuration |
| `pagination` | boolean | false | Enable pagination |
| `pageSize` | number | 10 | Rows per page |
| `selectable` | boolean | false | Enable row selection |
| `selectionMode` | string | 'multiple' | 'single' or 'multiple' |
| `columnToggle` | boolean | false | Show column visibility dropdown |
[/table]

## Interactive Demo

This demo includes the **Columns** dropdown (to show/hide columns) and the **Export Panel** (Copy/Download toggle). Note the **Joined** column uses a custom `render` function to format dates as DD/MM/YYYY.

[showcase-demo id="showcase/tables/interactive-demo" title="Interactive Demo" /]

## Sorting

Sort data by one or multiple columns.

```javascript
// Single column sort
table.sort('name', 'asc');
table.sort('age', 'desc');

// Multi-column sort
table.sortMultiple([
    { key: 'department', direction: 'asc' },
    { key: 'name', direction: 'asc' }
]);

// Clear sorting
table.clearSort();

// Get current sort state
const sortState = table.getSortState();
// { column: 'name', direction: 'asc' }

// Listen for sort events
table.on('sort', (column, direction) => {
    console.log(`Sorted by ${column} ${direction}`);
});
```

[showcase-demo id="showcase/tables/sorting" title="Sorting" /]

## Filtering

Filter data with text search or column-specific filters.

```javascript
// Global text search
table.search('alice');

// Column filter
table.filter('role', 'Admin');
table.filter('status', 'active', 'equals');

// Filter operators
table.filter('age', 25, 'gt');      // Greater than
table.filter('age', 30, 'lt');      // Less than
table.filter('age', 25, 'gte');     // Greater or equal
table.filter('name', 'al', 'contains');

// Custom filter function
table.filterBy((row) => {
    return row.age >= 25 && row.status === 'active';
});

// Clear filters
table.clearFilters();

// Listen for filter events
table.on('filter', (filters) => {
    console.log('Active filters:', filters);
});
```

## Pagination

Navigate through large datasets with pagination controls.

```javascript
// Create table with pagination
const table = Domma.tables.create('#table', {
    data: largeDataset,
    pagination: true,
    pageSize: 25
});

// Navigate pages
table.page(1);          // Go to page 1 (0-indexed)
table.nextPage();
table.prevPage();
table.firstPage();
table.lastPage();

// Change page size
table.pageSize(50);

// Get pagination info
const info = table.pageInfo();
// {
//   currentPage: 0,
//   pageSize: 25,
//   totalPages: 10,
//   totalRows: 250,
//   startRow: 1,
//   endRow: 25
// }

// Listen for page events
table.on('page', (page, pageSize) => {
    console.log(`Page ${page + 1}`);
});
```

[showcase-demo id="showcase/tables/pagination" title="Pagination" /]

## Row Selection

Select single or multiple rows for bulk operations.

```javascript
// Enable selection
const table = Domma.tables.create('#table', {
    data: data,
    selectable: true,
    selectionMode: 'multiple'  // or 'single'
});

// Select rows
table.select(0);           // Select first row
table.select([0, 1, 2]);   // Select multiple rows
table.selectAll();

// Deselect
table.deselect(0);
table.deselectAll();

// Toggle selection
table.toggleSelect(0);

// Get selected rows
const selected = table.getSelected();
// Returns array of selected row data

const selectedIndices = table.getSelectedIndices();
// Returns array of selected row indices

// Listen for selection events
table.on('select', (selectedRows, selectedIndices) => {
    console.log(`${selectedRows.length} rows selected`);
});
```

[showcase-demo id="showcase/tables/row-selection" title="Row Selection" /]

## Data Management

Add, update, and remove data dynamically.

```javascript
// Set all data
table.setData(newDataArray);

// Get all data (filtered/sorted state)
const currentData = table.getData();

// Get original data
const originalData = table.getData(true);

// Add rows
table.addRow({ id: 100, name: 'New User', ... });
table.addRows([{ ... }, { ... }]);

// Update row
table.updateRow(0, { name: 'Updated Name' });
table.updateRow(0, newRowData, true);  // Replace entire row

// Remove rows
table.removeRow(0);
table.removeRows([0, 1, 2]);

// Clear all data
table.clear();

// Refresh table (re-render)
table.refresh();
```

[showcase-demo id="showcase/tables/data-management" title="Data Management" /]

## Export Panel

Enable a built-in export toolbar with Copy/Download toggle and format buttons.

```javascript
// Enable export panel
const table = Domma.tables.create('#my-table', {
    data: myData,
    columns: [...],
    exportPanel: true,  // Enable the export toolbar
    exportOptions: ['copy', 'csv', 'excel', 'json'],  // Choose which buttons to show
    onExport: (info) => {
        console.log(`Exported ${info.rowCount} rows as ${info.format}`);
    }
});

// The panel shows:
// [ Copy (•)──Download ]  |  📋 Text  📄 CSV  📊 Excel  { } JSON
//
// Toggle LEFT  = Copy mode (copies to clipboard)
// Toggle RIGHT = Download mode (downloads file)
```

### Export Panel Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `exportPanel` | boolean | false | Show the export toolbar |
| `exportOptions` | array | ['copy', 'csv', 'excel', 'json'] | Which export buttons to display |
| `onExport` | function | null | Callback when data is exported |
[/table]

## Column Visibility

Enable a dropdown to show/hide columns dynamically. Users can toggle column visibility without reloading the table.

```javascript
// Enable column toggle dropdown
const table = Domma.tables.create('#my-table', {
    data: myData,
    columns: [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email', visible: false },  // Hidden by default
        { key: 'role', title: 'Role' }
    ],
    columnToggle: true  // Enable the Columns dropdown
});

// Programmatic control
table.showColumn('email');      // Show a hidden column
table.hideColumn('role');       // Hide a visible column
table.toggleColumn('name');     // Toggle visibility

// Get column info
table.getVisibleColumns();      // Array of visible column configs
table.getHiddenColumns();       // Array of hidden column configs
table.getColumns();             // All columns
```

### Column Visibility Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `columnToggle` | boolean | false | Show the Columns dropdown in the toolbar |
| `regexSearch` | boolean | false | Show the regex toggle button next to search input |
| `visible` (column) | boolean | true | Initial visibility of a column |
[/table]

[showcase-demo id="showcase/tables/column-visibility-options" title="Column Visibility Options" /]

## Stripe Styling Configuration

Customise row stripe and hover colours using named variants or custom hex/RGB values.

```javascript
// Named variants (uses CSS variables)
const table1 = Domma.tables.create('#table', {
    data: data,
    striped: true,
    evenRowColor: 'lighter',   // var(--dm-gray-100)
    oddRowColor: 'light',      // var(--dm-gray-200)
    hoverColor: 'medium'       // var(--dm-gray-300)
});

// Custom hex colors
const table2 = Domma.tables.create('#table', {
    data: data,
    striped: true,
    evenRowColor: '#ffffff',
    oddRowColor: '#f9f9f9',
    hoverColor: '#e6f2ff'
});

// Semantic tints
const table3 = Domma.tables.create('#table', {
    data: data,
    striped: true,
    evenRowColor: 'none',
    oddRowColor: 'primary-tint',
    hoverColor: 'light'
});

// Named variants: 'none', 'lighter', 'light', 'medium', 'dark',
//                 'primary-tint', 'success-tint', 'warning-tint',
//                 'danger-tint', 'info-tint'
```

### Stripe Colour Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `evenRowColor` | string | `null` (transparent) | Colour for even rows (0, 2, 4...). Named variant or hex/rgb value. |
| `oddRowColor` | string | `null` ('#f9f9f9') | Colour for odd rows (1, 3, 5...). Named variant or hex/rgb value. |
| `hoverColor` | string | `null` ('#f0f0f0') | Colour for row hover state. Named variant or hex/rgb value. |
[/table]

[showcase-demo id="showcase/tables/stripe-colour-options" title="Stripe Colour Options" /]

## Export Methods

Programmatically export data in various formats.

```javascript
// Copy to clipboard
table.copyToClipboard();        // Tab-separated (paste into Excel)
table.copyToClipboard('csv');   // CSV format
table.copyToClipboard('json');  // JSON format

// Get data as string
const csv = table.toCSV();      // CSV string
const json = table.toJSON();    // JSON string
const excel = table.toExcel();  // HTML table (Excel-compatible)

// Download files
table.download('csv', 'users.csv');
table.download('excel', 'users.xls');
table.download('json', 'users.json');

// Export callback
table.on('export', (info) => {
    console.log(`Exported ${info.rowCount} rows as ${info.format}`);
});
```

[showcase-demo id="showcase/tables/export-methods" title="Export Methods" /]

## Events

Listen to table events for custom behavior.

```javascript
// Available events
table.on('sort', (column, direction) => { });
table.on('filter', (activeFilters) => { });
table.on('search', (query) => { });
table.on('page', (page, pageSize) => { });
table.on('select', (rows, indices) => { });
table.on('edit', (row, column, oldValue, newValue) => { });
table.on('render', () => { });
table.on('dataChange', (data) => { });

// Remove event listener
table.off('sort', handler);

// One-time listener
table.once('render', () => {
    console.log('Table rendered for the first time');
});
```

## Declarative Table Configuration

While tables use `Domma.tables.create()`, you can still leverage Domma's config engine to declaratively manage table setups, event handlers, and interactions.

### Centralized Table Config

```javascript
// Define all table configurations in one place
const tableConfigs = {
    users: {
        selector: '#users-table',
        options: {
            data: userData,
            columns: [
                { key: 'id', title: 'ID', sortable: true },
                { key: 'name', title: 'Name', sortable: true },
                { key: 'email', title: 'Email', sortable: true },
                { key: 'role', title: 'Role', filterable: true }
            ],
            pagination: true,
            pageSize: 20,
            selectable: true,
            exportPanel: true
        },
        events: {
            select: (rows) => {
                console.log(`${rows.length} users selected`);
            },
            edit: (row, column, oldVal, newVal) => {
                // Save to server
                api.updateUser(row.id, { [column]: newVal });
            }
        }
    },
    products: {
        selector: '#products-table',
        options: {
            data: productData,
            columns: [
                { key: 'sku', title: 'SKU', sortable: true },
                { key: 'name', title: 'Product', sortable: true },
                { key: 'price', title: 'Price', sortable: true, render: (val) => `$${val}` },
                { key: 'stock', title: 'Stock', sortable: true }
            ],
            pagination: true,
            pageSize: 50
        }
    }
};

// Initialize all tables
Object.values(tableConfigs).forEach(config => {
    const table = Domma.tables.create(config.selector, config.options);

    // Attach event handlers
    if (config.events) {
        Object.entries(config.events).forEach(([event, handler]) => {
            table.on(event, handler);
        });
    }
});
```

### Using $.setup() for Table Containers

```javascript
// Enhance table containers with config engine
$.setup({
    '.table-container': {
        initial: {
            css: {
                background: 'var(--dm-gray-50)',
                padding: 'var(--dm-space-4)',
                borderRadius: 'var(--dm-radius-lg)'
            }
        },
        events: {
            ready: (e, $el) => {
                // Create table when container is ready
                const tableId = $el.find('table').attr('id');
                const config = tableConfigs[tableId];

                if (config) {
                    const table = Domma.tables.create(`#${tableId}`, config.options);
                    $el.data('tableInstance', table);
                }
            }
        }
    },

    '#export-controls': {
        events: {
            'click .export-btn': (e, $el) => {
                const format = $(e.target).data('format');
                const table = $('.table-container').data('tableInstance');

                if (table) {
                    table.download(format);
                    Domma.elements.toast.success(`Exported as ${format.toUpperCase()}`);
                }
            }
        }
    }
});
```

### Dynamic Table Factory

```javascript
// Create a reusable table factory with config
class TableFactory {
    static presets = {
        users: {
            columns: [
                { key: 'id', title: 'ID', sortable: true },
                { key: 'name', title: 'Name', sortable: true },
                { key: 'email', title: 'Email', sortable: true, editable: true },
                { key: 'role', title: 'Role', filterable: true }
            ],
            pagination: true,
            pageSize: 20,
            exportPanel: true
        },
        products: {
            columns: [
                { key: 'sku', title: 'SKU', sortable: true },
                { key: 'name', title: 'Product', sortable: true },
                { key: 'price', title: 'Price', sortable: true, render: (val) => `$${val}` },
                { key: 'stock', title: 'Stock', sortable: true }
            ],
            pagination: true,
            pageSize: 50
        }
    };

    static create(selector, preset, data, customOptions = {}) {
        const presetConfig = this.presets[preset];
        if (!presetConfig) {
            throw new Error(`Unknown preset: ${preset}`);
        }

        return Domma.tables.create(selector, {
            ...presetConfig,
            ...customOptions,
            data
        });
    }
}

// Usage - clean and declarative
const usersTable = TableFactory.create('#users', 'users', userData);
const productsTable = TableFactory.create('#products', 'products', productData, {
    pageSize: 100  // Override preset
});
```

### State-Driven Table Management

```javascript
// Use Domma models for reactive table state
const tableState = M.create({
    data: { type: 'array', default: [] },
    sortColumn: { type: 'string', default: '' },
    sortDirection: { type: 'string', default: 'asc' },
    currentPage: { type: 'number', default: 1 },
    pageSize: { type: 'number', default: 20 },
    selectedRows: { type: 'array', default: [] }
});

// Create table
const table = Domma.tables.create('#state-table', {
    data: tableState.get('data'),
    pageSize: tableState.get('pageSize'),
    pagination: true
});

// Sync table events with state
table.on('sort', (column, direction) => {
    tableState.set({ sortColumn: column, sortDirection: direction });
});

table.on('page', (page) => {
    tableState.set({ currentPage: page });
});

table.on('select', (rows) => {
    tableState.set({ selectedRows: rows });
});

// React to state changes
tableState.onChange('data', (newData) => {
    table.setData(newData);
});

tableState.onChange('selectedRows', (rows) => {
    $('#selection-count').text(`${rows.length} selected`);
});
```

### Benefits of Configuration-Driven Tables

- **Maintainability** - All table configs in centralized location
- **Reusability** - Share column definitions and presets across tables
- **Testability** - Easy to test config objects independently
- **Type Safety** - Config validation before table creation
- **State Management** - Integrate with reactive models for data flow

### Imperative vs Configuration-Driven

Imperative (Scattered)

```javascript
// Table 1
const table1 = Domma.tables.create('#t1', {
    data: data1,
    columns: [/*...*/],
    pagination: true
});

table1.on('select', (rows) => {
    console.log(rows);
});

// Table 2 - elsewhere in code
const table2 = Domma.tables.create('#t2', {
    data: data2,
    columns: [/*...*/],
    pageSize: 50
});

// Configurations spread out
```

Configuration-Driven (Centralized)

```javascript
// One config object
const config = {
    table1: {
        selector: '#t1',
        options: {
            data: data1,
            columns: [/*...*/],
            pagination: true
        },
        events: {
            select: (rows) => console.log(rows)
        }
    },
    table2: {
        selector: '#t2',
        options: { data: data2, pageSize: 50 }
    }
};

// Single init
initTables(config);
```

## Complete Method Reference

### Data Methods

setData()

getData()

addRow()

addRows()

updateRow()

removeRow()

removeRows()

clear()

refresh()

### Sorting Methods

sort()

sortMultiple()

clearSort()

getSortState()

### Filtering Methods

search()

filter()

filterBy()

clearFilters()

getFilters()

### Pagination Methods

page()

pageSize()

nextPage()

prevPage()

firstPage()

lastPage()

pageInfo()

### Selection Methods

select()

deselect()

selectAll()

deselectAll()

toggleSelect()

getSelected()

getSelectedIndices()

### Column Methods

showColumn()

hideColumn()

toggleColumn()

getColumns()

getVisibleColumns()

getHiddenColumns()

### Export Methods

toCSV()

toJSON()

toExcel()

download()

copyToClipboard()

### Event Methods

on()

off()

once()

### Static Methods

tables.create()

tables.get()

tables.destroy()
