/**
 * Interactive Demo - from public/showcase/tables.
 */
export function mount(root) {
    const sampleData = [
            {
                id: 1,
                name: 'Alice Johnson',
                email: 'alice@example.com',
                role: 'Admin',
                status: 'Active',
                joined: '2024-01-15'
            },
            {id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'Active', joined: '2024-02-20'},
            {
                id: 3,
                name: 'Carol White',
                email: 'carol@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-03-10'
            },
            {
                id: 4,
                name: 'David Brown',
                email: 'david@example.com',
                role: 'Manager',
                status: 'Inactive',
                joined: '2024-01-05'
            },
            {
                id: 5,
                name: 'Eva Martinez',
                email: 'eva@example.com',
                role: 'Developer',
                status: 'Active',
                joined: '2024-04-01'
            },
            {
                id: 6,
                name: 'Frank Wilson',
                email: 'frank@example.com',
                role: 'Admin',
                status: 'Active',
                joined: '2024-02-14'
            },
            {
                id: 7,
                name: 'Grace Lee',
                email: 'grace@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-05-22'
            },
            {
                id: 8,
                name: 'Henry Davis',
                email: 'henry@example.com',
                role: 'Developer',
                status: 'Inactive',
                joined: '2024-03-30'
            },
            {id: 9, name: 'Ivy Chen', email: 'ivy@example.com', role: 'Manager', status: 'Active', joined: '2024-06-15'},
            {
                id: 10,
                name: 'Jack Taylor',
                email: 'jack@example.com',
                role: 'Developer',
                status: 'Active',
                joined: '2024-04-18'
            },
            {
                id: 11,
                name: 'Kate Anderson',
                email: 'kate@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-07-01'
            },
            {id: 12, name: 'Leo Thomas', email: 'leo@example.com', role: 'Admin', status: 'Inactive', joined: '2024-01-28'},
            {
                id: 13,
                name: 'Mia Jackson',
                email: 'mia@example.com',
                role: 'Developer',
                status: 'Active',
                joined: '2024-08-10'
            },
            {
                id: 14,
                name: 'Noah Garcia',
                email: 'noah@example.com',
                role: 'Manager',
                status: 'Active',
                joined: '2024-05-05'
            },
            {
                id: 15,
                name: 'Olivia Moore',
                email: 'olivia@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-09-20'
            }
        ];
        // Create table with export panel
    const table = Domma.tables.create('#demo-table', {
            data: sampleData,
            columns: [
                {key: 'id', title: 'ID', sortable: true, width: '60px'},
                {key: 'name', title: 'Name', sortable: true},
                {key: 'email', title: 'Email', sortable: true},
                {key: 'role', title: 'Role', sortable: true, filterable: true},
                {
                    key: 'status',
                    title: 'Status',
                    render: (val) => `<span class="badge ${val === 'Active' ? 'badge-success' : 'badge-secondary'}">${val}</span>`
                },
                {
                    key: 'joined',
                    title: 'Joined',
                    sortable: true,
                    render: (val) => D(val).format('DD/MM/YYYY')
                }
            ],
            pagination: true,
            pageSize: 10,
            selectable: true,
            selectionMode: 'multiple',
            // Column visibility toggle
            columnToggle: true,
            // Regex search toggle
            regexSearch: true,
            // Export panel options
            exportPanel: true,
            exportOptions: ['copy', 'csv', 'excel', 'json'],
            onExport: (info) => {
                console.log(`Exported ${info.rowCount} rows as ${info.format}`);
            }
        });
    function updateSelectedInfo() {
            const selected = table.getSelected();
            if (selected.length === 0) {
                $(root).find('#selected-info').text('No rows selected');
                $(root).find('#delete-selected').prop('disabled', true);
            } else {
                const names = selected.slice(0, 3).map(r => r.name).join(', ');
                const extra = selected.length > 3 ? ` and ${selected.length - 3} more` : '';
                $(root).find('#selected-info').text(`${selected.length} row(s) selected: ${names}${extra}`);
                $(root).find('#delete-selected').prop('disabled', false);
            }
        }
        // Table events
    table.on('select', () => {
            updateSelectedInfo();
        });
        // Role filter
    $(root).find('#role-filter').on('change', function () {
            const role = $(this).val();
            if (role) {
                table.filter('role', role);
            } else {
                table.clearFilters();
            }
        });
    $(root).find('#clear-filters').on('click', function () {
            $(root).find('#table-search').val('');
            $(root).find('#role-filter').val('');
            table.clearFilters();
        });
        // Selection buttons
    $(root).find('#select-all').on('click', () => table.selectAll());
    $(root).find('#deselect-all').on('click', () => table.deselectAll());
    $(root).find('#delete-selected').on('click', function () {
            const selected = table.getSelected();
            if (selected.length && confirm(`Delete ${selected.length} row(s)?`)) {
                // Remove by row key (id)
                selected.forEach(row => table.removeRow(row.id));
            }
        });
    const names = ['Alex', 'Blake', 'Casey', 'Dana', 'Ellis', 'Finn'];
        // ============================================
        // Stripe Styling Demo
        // ============================================
        // Sample data for stripe demo
    const stripeData = sampleData.slice(0, 6);
}
