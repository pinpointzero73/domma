/**
 * Admin Users Dashboard JavaScript
 * Manages user accounts and roles
 */

import AdminSidebar from '../shared/admin-sidebar.js';
import AdminAuth from '../shared/admin-auth.js';

$(() => {
    // ============================================
    // 1. Initialise Authentication & Sidebar
    // ============================================
    const apiUrl = AdminAuth.getApiUrl();
    if (!AdminAuth.init(apiUrl)) {
        return; // Auth failed, user redirected
    }

    // Initialise sidebar with current section
    AdminSidebar.init('users');

    // ============================================
    // 2. Initialise Collapsible Cards
    // ============================================
    function initCollapsibleCards() {
        const cards = document.querySelectorAll('[data-collapsible="true"]');
        cards.forEach(card => {
            Domma.elements.card(card, { collapsible: true });
        });
    }

    initCollapsibleCards();

    // ============================================
    // 3. Load Statistics
    // ============================================
    async function loadStats() {
        try {
            const response = await Domma.http.get(`${apiUrl}/admin/stats`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load stats');
            }

            const data = response.data;

            $('#stat-total-users').text(data.totalUsers);
            $('#stat-today-signups').text(data.todaySignups);
            $('#stat-week-signups').text(data.thisWeekSignups);
            $('#stat-month-signups').text(data.thisMonthSignups);

            $('#stat-role-admin').text(`${data.roleDistribution.admin || 0} admin`);
            $('#stat-role-subscriber').text(`${data.roleDistribution.subscriber || 0} subscriber`);
            $('#stat-role-guest').text(`${data.roleDistribution.guest || 0} guest`);

            $('#stat-documents').text(data.contentStats.totalDocuments);
            $('#stat-invoices').text(data.contentStats.totalInvoices);
            $('#stat-vehicles').text(data.contentStats.totalVehicles);
        } catch (error) {
            console.error('[Admin] Failed to load stats:', error);
            Domma.elements.toast('Error loading statistics: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 4. Users Table
    // ============================================
    let usersTable = null;
    let currentPage = 1;
    let searchQuery = '';
    let roleFilter = '';

    // User schema for form generation
    const userSchema = {
        name: {
            type: 'string',
            label: 'Full Name',
            required: true,
            minLength: 2,
            maxLength: 100,
            formConfig: {
                placeholder: 'Enter user\'s full name'
            }
        },
        email: {
            type: 'email',
            label: 'Email Address',
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            formConfig: {
                placeholder: 'user@example.com'
            }
        },
        role: {
            type: 'select',
            label: 'User Role',
            required: true,
            options: [
                { value: 'guest', label: 'Guest' },
                { value: 'subscriber', label: 'Subscriber' },
                { value: 'admin', label: 'Administrator' }
            ],
            formConfig: {
                helperText: 'Select the appropriate role for this user'
            }
        }
    };

    async function loadUsers() {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 25,
                sort: 'createdAt:desc'
            });

            if (searchQuery) params.append('search', searchQuery);
            if (roleFilter) params.append('role', roleFilter);

            const response = await Domma.http.get(`${apiUrl}/admin/users?${params}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load users');
            }

            // Transform data for table
            const tableData = response.data.users.map(user => {
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name || '-',
                    role: user.role,
                    created_at: user.created_at ? Domma.dates(user.created_at).format('DD MMM YYYY') : '-',
                    stats: user.stats ? `${user.stats.documents || 0}D / ${user.stats.invoices || 0}I / ${user.stats.vehicles || 0}V` : '-',
                    actions: user.id
                };
            });

            if (!usersTable) {
                // Create table
                usersTable = Domma.tables.create('#users-table', {
                    data: tableData,
                    columns: [
                        { key: 'id', title: 'ID', sortable: true, width: '60px' },
                        { key: 'email', title: 'Email', sortable: true },
                        { key: 'name', title: 'Name', sortable: true },
                        {
                            key: 'role',
                            title: 'Role',
                            sortable: true,
                            render: (value) => {
                                const badgeClass = {
                                    admin: 'badge-danger',
                                    subscriber: 'badge-primary',
                                    guest: 'badge-secondary'
                                }[value] || 'badge-secondary';
                                return `<span class="badge ${badgeClass}">${_.capitalize(value)}</span>`;
                            }
                        },
                        { key: 'created_at', title: 'Joined', sortable: true },
                        { key: 'stats', title: 'Content', sortable: false },
                        {
                            key: 'actions',
                            title: 'Actions',
                            sortable: false,
                            render: (userId) => `
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-outline-primary edit-user-btn" data-user-id="${userId}">
                                        Edit
                                    </button>
                                    <button class="btn btn-outline-warning change-role-btn" data-user-id="${userId}">
                                        Role
                                    </button>
                                    <button class="btn btn-outline-danger delete-user-btn" data-user-id="${userId}">
                                        Delete
                                    </button>
                                </div>
                            `
                        }
                    ],
                    pagination: true,
                    pageSize: 25,
                    striped: true,
                    selectable: true,
                    selectionMode: 'multiple',
                    exportPanel: true,
                    exportOptions: ['text', 'csv', 'excel', 'json'],
                    columnToggle: true,
                    regexSearch: true
                });

                // Handle action buttons
                $('body').on('click', '.change-role-btn', function () {
                    const userId = $(this).attr('data-user-id');
                    showRoleModal(userId);
                });

                $('body').on('click', '.edit-user-btn', function () {
                    const userId = $(this).attr('data-user-id');
                    showEditUserModal(userId);
                });

                $('body').on('click', '.delete-user-btn', function () {
                    const userId = $(this).attr('data-user-id');
                    showDeleteUserConfirmation(userId);
                });
            } else {
                usersTable.setData(tableData);
            }
        } catch (error) {
            console.error('[Admin] Failed to load users:', error);
            Domma.elements.toast('Error loading users: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 5. Role Change
    // ============================================
    async function showRoleModal(userId) {
        const tableData = usersTable.getData();
        const user = tableData.find(u => u.id == userId);

        if (!user) {
            console.error('[Admin] User not found in table data');
            return;
        }

        const roleChoice = await Domma.elements.prompt(
            `Change role for ${user.email}?\n\nCurrent role: ${_.capitalize(user.role)}\n\nEnter new role (guest, subscriber, or admin):`,
            {
                title: 'Change User Role',
                inputPlaceholder: 'Enter: guest, subscriber, or admin',
                inputValue: user.role
            }
        );

        const roles = ['guest', 'subscriber', 'admin'];
        if (!roleChoice || !roles.includes(roleChoice.toLowerCase())) {
            Domma.elements.toast('Invalid role selected', { type: 'error' });
            return;
        }

        const newRole = roleChoice.toLowerCase();

        try {
            const response = await Domma.http.patch(
                `${apiUrl}/admin/users/${userId}/role`,
                { role: newRole },
                { headers: AdminAuth.getAuthHeaders() }
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to update role');
            }

            Domma.elements.toast('Role updated successfully!', { type: 'success' });
            loadUsers();
            loadStats();
        } catch (error) {
            console.error('[Admin] Failed to update role:', error);
            Domma.elements.toast('Error: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 6. Edit User Modal (Schema-Driven)
    // ============================================
    async function showEditUserModal(userId) {
        const tableData = usersTable.getData();
        const user = tableData.find(u => u.id == userId);

        if (!user) {
            console.error('[Admin] User not found');
            Domma.elements.toast('User not found', { type: 'error' });
            return;
        }

        const initialData = {
            name: user.name || '',
            email: user.email,
            role: user.role
        };

        try {
            const modal = Domma.forms.modal(userSchema, initialData, {
                title: `Edit User: ${user.email}`,
                size: 'medium',
                saveText: 'Update User',
                layout: 'stacked',
                sections: [
                    {
                        title: 'User Information',
                        fields: ['name', 'email', 'role']
                    }
                ],
                onSave: async (formData) => {
                    const response = await Domma.http.patch(
                        `${apiUrl}/admin/users/${userId}`,
                        formData,
                        { headers: AdminAuth.getAuthHeaders() }
                    );

                    if (!response.success) {
                        throw new Error(response.message || 'Failed to update user');
                    }

                    Domma.elements.toast('User updated successfully!', { type: 'success' });
                    loadUsers();
                    loadStats();
                },
                onError: (error) => {
                    console.error('[Admin] Failed to update user:', error);
                    Domma.elements.toast('Error: ' + error.message, { type: 'error' });
                }
            });

            modal.open();
        } catch (error) {
            console.error('[Admin] Failed to create edit modal:', error);
            Domma.elements.toast('Failed to open edit form', { type: 'error' });
        }
    }

    // ============================================
    // 7. Delete User Confirmation
    // ============================================
    async function showDeleteUserConfirmation(userId) {
        const tableData = usersTable.getData();
        const user = tableData.find(u => u.id == userId);

        if (!user) {
            console.error('[Admin] User not found');
            Domma.elements.toast('User not found', { type: 'error' });
            return;
        }

        const firstConfirm = await Domma.elements.confirm(
            `Are you sure you want to delete this user?\n\nUser: ${user.email}\nName: ${user.name || 'N/A'}\nRole: ${_.capitalize(user.role)}\nContent: ${user.stats}\n\nThis action cannot be undone.`,
            {
                title: 'Confirm User Deletion',
                confirmText: 'Yes, Delete',
                cancelText: 'Cancel',
                type: 'warning'
            }
        );

        if (!firstConfirm) return;

        const typeConfirm = await Domma.elements.prompt(
            `FINAL WARNING: This will permanently delete the user "${user.email}".\n\nType "DELETE" to confirm:`,
            {
                title: 'Final Deletion Confirmation',
                inputPlaceholder: 'Type DELETE to confirm',
                confirmText: 'Delete User',
                cancelText: 'Cancel'
            }
        );

        if (!typeConfirm || typeConfirm.toUpperCase() !== 'DELETE') {
            Domma.elements.toast('User deletion cancelled', { type: 'info' });
            return;
        }

        try {
            const response = await Domma.http.delete(`${apiUrl}/admin/users/${userId}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to delete user');
            }

            const contentInfo = response.data?.contentRemaining;
            let message = 'User deleted successfully!';
            if (contentInfo && (contentInfo.documents || contentInfo.invoices || contentInfo.vehicles)) {
                message += `\n\nOrphaned content: ${contentInfo.documents || 0} documents, ${contentInfo.invoices || 0} invoices, ${contentInfo.vehicles || 0} vehicles`;
            }

            Domma.elements.toast(message, { type: 'success' });
            loadUsers();
            loadStats();
        } catch (error) {
            console.error('[Admin] Failed to delete user:', error);
            Domma.elements.toast('Error: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 8. Search and Filter
    // ============================================
    const searchDebounced = _.debounce(() => {
        searchQuery = $('#user-search').val().trim();
        currentPage = 1;
        loadUsers();
    }, 500);

    $('#user-search').on('input', searchDebounced);

    $('#role-filter').on('change', () => {
        roleFilter = $('#role-filter').val();
        currentPage = 1;
        loadUsers();
    });

    $('#refresh-users').on('click', () => {
        loadUsers();
        loadStats();
    });

    // ============================================
    // 9. Initialise
    // ============================================
    loadStats();
    loadUsers();
});
