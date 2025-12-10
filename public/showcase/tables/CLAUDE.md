# CLAUDE.md - Tables Module Showcase

This file provides guidance for working with Tables module showcase examples.

## Tables Module Overview

Accessed via `Domma.tables` - provides DataTable-like functionality with sorting, filtering, pagination, and export.

## Creating Tables

```javascript
const table = Domma.tables.create('#table', {
    data: [
        {id: 1, name: 'Alice', age: 30, city: 'London'},
        {id: 2, name: 'Bob', age: 25, city: 'Paris'},
        {id: 3, name: 'Charlie', age: 35, city: 'Berlin'}
    ],
    columns: [
        {field: 'id', title: 'ID', sortable: true},
        {field: 'name', title: 'Name', sortable: true},
        {field: 'age', title: 'Age', sortable: true},
        {field: 'city', title: 'City', sortable: true}
    ],
    pagination: true,
    pageSize: 10,
    selectable: true,
    selectionMode: 'multiple',  // 'single' or 'multiple'
    exportPanel: true,
    columnToggle: true,
    regexSearch: false
});
```

## Data Operations

```javascript
// Get/set data
const data = table.getData();
table.setData(newData);

// Add rows
table.addRow({id: 4, name: 'David', age: 28});
table.addRows([
    {id: 5, name: 'Eve', age: 32},
    {id: 6, name: 'Frank', age: 29}
]);

// Update rows
table.updateRow(0, {age: 31});  // Update by index
table.updateRow({id: 1}, {age: 31});  // Update by match

// Remove rows
table.removeRow(0);  // By index
table.removeRow({id: 1});  // By match
table.removeRows([0, 1, 2]);  // Multiple

// Clear and refresh
table.clear();
table.refresh();
```

## Sorting

```javascript
// Sort by single column
table.sort('name', 'asc');   // or 'desc'
table.sort('age', 'desc');

// Multi-column sort
table.sortMultiple([
    {field: 'city', direction: 'asc'},
    {field: 'age', direction: 'desc'}
]);

// Clear sorting
table.clearSort();

// Get sort state
const sortState = table.getSortState();
```

## Filtering

```javascript
// Search all columns
table.search('London');

// Filter by function
table.filter(row => row.age > 25);

// Filter by specific field
table.filterBy('city', 'London');

// Clear filters
table.clearFilters();

// Get active filters
const filters = table.getFilters();
```

## Pagination

```javascript
// Navigate pages
table.nextPage();
table.prevPage();
table.firstPage();
table.lastPage();
table.page(3);  // Go to specific page

// Change page size
table.pageSize(20);

// Get pagination info
const info = table.pageInfo();
// {page: 1, pageSize: 10, totalPages: 5, totalRows: 50}
```

## Selection

```javascript
// Select rows
table.select(0);  // By index
table.select({id: 1});  // By match
table.selectAll();

// Deselect
table.deselect(0);
table.deselectAll();

// Toggle selection
table.toggleSelect(0);

// Get selected
const selected = table.getSelected();  // Get row data
const indices = table.getSelectedIndices();  // Get indices
```

## Export

```javascript
// Export as CSV
const csv = table.toCSV();

// Export as JSON
const json = table.toJSON();

// Download file
table.download('csv', 'data.csv');
table.download('json', 'data.json');
```

## Events

```javascript
// Listen for events
table.on('rowClick', (row, index) => {
    console.log('Clicked row:', row);
});

table.on('selectionChange', (selected) => {
    console.log('Selected:', selected);
});

table.on('pageChange', (page) => {
    console.log('Page changed:', page);
});

table.on('sortChange', (sortState) => {
    console.log('Sort changed:', sortState);
});

// Remove event listener
table.off('rowClick', handler);

// One-time event
table.once('dataLoad', () => {
    console.log('Data loaded');
});
```

## Row Striping Configuration

```javascript
const table = Domma.tables.create('#table', {
    data: data,
    columns: columns,
    striped: true,
    evenRowColor: 'lighter',     // Named variant or hex/rgb
    oddRowColor: 'light',        // Named variant or hex/rgb
    hoverColor: 'medium'         // Named variant or hex/rgb
});

// Named variants:
// 'none', 'lighter', 'light', 'medium', 'dark',
// 'primary-tint', 'success-tint', 'warning-tint',
// 'danger-tint', 'info-tint'

// Or custom colours:
const table2 = Domma.tables.create('#table2', {
    data: data,
    columns: columns,
    evenRowColor: '#ffffff',
    oddRowColor: '#f5f5f5',
    hoverColor: '#e0e0e0'
});
```

## Column Configuration

```javascript
const columns = [
    {
        field: 'id',
        title: 'ID',
        sortable: true,
        width: '80px'
    },
    {
        field: 'name',
        title: 'Name',
        sortable: true,
        render: (value, row) => {
            return `<strong>${value}</strong>`;
        }
    },
    {
        field: 'age',
        title: 'Age',
        sortable: true,
        format: (value) => `${value} years`
    },
    {
        field: 'actions',
        title: 'Actions',
        sortable: false,
        render: (value, row) => {
            return `
                <button class="btn btn-sm" data-id="${row.id}">Edit</button>
                <button class="btn btn-sm btn-danger" data-id="${row.id}">Delete</button>
            `;
        }
    }
];
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tables Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Tables Module Showcase</h1>

        <div class="demo-section">
            <h2>DataTable Example</h2>
            <div id="table"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        const data = [
            {id: 1, name: 'Alice', age: 30, city: 'London'},
            {id: 2, name: 'Bob', age: 25, city: 'Paris'},
            {id: 3, name: 'Charlie', age: 35, city: 'Berlin'}
        ];

        const table = Domma.tables.create('#table', {
            data: data,
            columns: [
                {field: 'id', title: 'ID', sortable: true},
                {field: 'name', title: 'Name', sortable: true},
                {field: 'age', title: 'Age', sortable: true},
                {field: 'city', title: 'City', sortable: true}
            ],
            pagination: true,
            pageSize: 10,
            selectable: true,
            exportPanel: true
        });

        // Listen for row clicks
        table.on('rowClick', (row) => {
            console.log('Clicked:', row);
        });
    </script>
</body>
</html>
```

## Common Patterns

### CRUD Operations

```javascript
// Add
$('#add-btn').on('click', () => {
    table.addRow({
        id: Date.now(),
        name: $('#name').val(),
        age: parseInt($('#age').val())
    });
});

// Edit
table.on('rowClick', (row, index) => {
    $('#name').val(row.name);
    $('#age').val(row.age);
    $('#edit-index').val(index);
});

$('#update-btn').on('click', () => {
    const index = parseInt($('#edit-index').val());
    table.updateRow(index, {
        name: $('#name').val(),
        age: parseInt($('#age').val())
    });
});

// Delete
$('body').on('click', '.delete-btn', function() {
    const id = $(this).data('id');
    table.removeRow({id: id});
});
```

### Server-Side Integration

```javascript
async function loadTableData() {
    const data = await Domma.http.get('/api/users');

    table.setData(data);
}

// Refresh on interval
setInterval(loadTableData, 30000);
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
