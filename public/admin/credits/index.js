/**
 * Admin Credits Management JavaScript
 * Gift credits to users and view transaction history
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
    AdminSidebar.init('credits', apiUrl);

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
    // 3. User Search & Selection
    // ============================================
    let selectedUser = null;
    let userSearchTimeout = null;

    // Debounced user search
    $('#user-search').on('input', function () {
        const query = $(this).val().trim();

        clearTimeout(userSearchTimeout);

        if (query.length < 2) {
            $('#user-search-results').hide().html('');
            return;
        }

        userSearchTimeout = setTimeout(async () => {
            await searchUsers(query);
        }, 300);
    });

    // Helper function to escape HTML attributes
    function escapeAttr(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    async function searchUsers(query) {
        try {
            const response = await Domma.http.get(
                `${apiUrl}/admin/users?search=${encodeURIComponent(query)}&limit=10`,
                { headers: AdminAuth.getAuthHeaders() }
            );

            if (!response.success || !response.data?.users) {
                throw new Error('Failed to search users');
            }

            const users = response.data.users;

            console.log('[DEBUG] Search returned users:', users);

            if (users.length === 0) {
                $('#user-search-results').html(
                    '<div class="p-3 bg-gray-100 rounded text-sm text-gray-600">No users found</div>'
                ).show();
                return;
            }

            // Create container
            const $container = $('<div class="border rounded max-h-64 overflow-y-auto"></div>');

            // Create user result elements directly (bypass HTML string sanitization)
            users.forEach(user => {
                console.log('[DEBUG] Processing user:', user);

                // Create the main div
                const $userDiv = $('<div class="user-result p-3 border-b hover:bg-gray-50 cursor-pointer"></div>');

                // Set data attributes directly on the element
                $userDiv.attr('data-user-id', user.id);
                $userDiv.attr('data-user-email', user.email);
                $userDiv.attr('data-user-name', user.name || 'N/A');

                console.log('[DEBUG] Set attributes:', {
                    id: $userDiv.attr('data-user-id'),
                    email: $userDiv.attr('data-user-email'),
                    name: $userDiv.attr('data-user-name')
                });

                // Create content (sanitized for display)
                const $email = $('<div class="font-semibold"></div>').text(user.email);
                const $details = $('<div class="text-sm text-gray-600"></div>');
                $details.html(
                    `${DOMPurify.sanitize(user.name || 'No name')} - ` +
                    `<span class="badge badge-sm ${getRoleBadgeClass(user.role)}">${_.capitalize(user.role)}</span>`
                );

                $userDiv.append($email);
                $userDiv.append($details);
                $container.append($userDiv);
            });

            // Insert into DOM
            $('#user-search-results').empty().append($container).show();

            console.log('[DEBUG] Inserted into DOM, checking first element:',
                $('.user-result').first().attr('data-user-id'));

        } catch (error) {
            console.error('[Admin] User search failed:', error);
            Domma.elements.toast('Failed to search users', { type: 'error' });
        }
    }

    function getRoleBadgeClass(role) {
        const classes = {
            admin: 'badge-danger',
            subscriber: 'badge-primary',
            guest: 'badge-secondary'
        };
        return classes[role] || 'badge-secondary';
    }

    // Handle user selection
    $('body').on('click', '.user-result', async function () {
        console.log('[DEBUG] Clicked element:', this);
        console.log('[DEBUG] Element HTML:', this.outerHTML);

        const userId = $(this).attr('data-user-id');  // Use attr() for HTML data attributes
        const userEmail = $(this).attr('data-user-email');
        const userName = $(this).attr('data-user-name');

        console.log('[DEBUG] Extracted values:', { userId, userEmail, userName });

        await selectUser(userId, userEmail, userName);
    });

    async function selectUser(userId, userEmail, userName) {
        try {
            // Fetch user's current credit balance
            const response = await Domma.http.get(
                `${apiUrl}/admin/credits/${userId}`,
                { headers: AdminAuth.getAuthHeaders() }
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch user balance');
            }

            selectedUser = {
                id: userId,
                email: userEmail,
                name: userName,
                balance: response.data.balance || 0
            };

            // Update UI
            $('#selected-user-id').val(userId);
            $('#selected-user-email').text(userEmail);
            $('#selected-user-name').text(userName);
            $('#selected-user-balance').text(`${selectedUser.balance} credits`);
            $('#selected-user-info').show();

            // Clear search
            $('#user-search').val('');
            $('#user-search-results').hide().html('');

            // Enable submit button
            validateForm();

            // Update balance preview
            updateBalancePreview();

        } catch (error) {
            console.error('[Admin] Failed to select user:', error);
            Domma.elements.toast('Failed to load user balance', { type: 'error' });
        }
    }

    // ============================================
    // 4. Balance Preview
    // ============================================
    function updateBalancePreview() {
        if (!selectedUser) {
            $('#balance-preview').text('-').removeClass('text-success text-danger text-warning');
            return;
        }

        const creditAmount = parseInt($('#credit-amount').val() || 0, 10);
        const newBalance = selectedUser.balance + creditAmount;

        $('#balance-preview').text(newBalance);

        // Color coding
        $('#balance-preview').removeClass('text-success text-danger text-warning text-gray-600');
        if (creditAmount > 0) {
            $('#balance-preview').addClass('text-success'); // Green for positive
        } else if (creditAmount < 0) {
            $('#balance-preview').addClass('text-danger'); // Red for negative
        } else {
            $('#balance-preview').addClass('text-gray-600'); // Gray for zero
        }

        // Warning if would go negative
        if (newBalance < 0) {
            Domma.elements.toast('Warning: This would result in a negative balance', { type: 'warning' });
        }
    }

    $('#credit-amount').on('input', updateBalancePreview);

    // ============================================
    // 5. Form Validation
    // ============================================
    function validateForm() {
        const hasUser = !!selectedUser;
        const hasAmount = $('#credit-amount').val() && parseInt($('#credit-amount').val(), 10) !== 0;
        const hasReason = $('#credit-reason').val().trim().length >= 10;

        const isValid = hasUser && hasAmount && hasReason;
        $('#gift-credits-btn').prop('disabled', !isValid);

        return isValid;
    }

    $('#credit-amount').on('input', validateForm);
    $('#credit-reason').on('input', validateForm);

    // ============================================
    // 6. Gift Credits Form Submission
    // ============================================
    $('#gift-credits-form').on('submit', async function (e) {
        e.preventDefault();

        if (!validateForm()) {
            Domma.elements.toast('Please fill in all required fields', { type: 'error' });
            return;
        }

        const userId = selectedUser.id;
        const credits = parseInt($('#credit-amount').val(), 10);
        const reason = $('#credit-reason').val().trim();

        // Final confirmation
        const actionWord = credits > 0 ? 'gift' : 'deduct';
        const confirmed = await Domma.elements.confirm(
            `Are you sure you want to ${actionWord} ${Math.abs(credits)} credits ${credits > 0 ? 'to' : 'from'} ${selectedUser.email}?\n\nReason: ${reason}\n\nCurrent balance: ${selectedUser.balance}\nNew balance: ${selectedUser.balance + credits}`,
            {
                title: 'Confirm Credit Adjustment',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                type: credits < 0 ? 'warning' : 'info'
            }
        );

        if (!confirmed) return;

        try {
            const response = await Domma.http.post(
                `${apiUrl}/admin/credits/gift`,
                { userId, credits, reason },
                { headers: AdminAuth.getAuthHeaders() }
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to gift credits');
            }

            Domma.elements.toast(response.message || 'Credits updated successfully!', { type: 'success' });

            // Reset form
            resetForm();

            // Reload transactions
            loadTransactions();

        } catch (error) {
            console.error('[Admin] Failed to gift credits:', error);
            Domma.elements.toast('Error: ' + error.message, { type: 'error' });
        }
    });

    // ============================================
    // 7. Reset Form
    // ============================================
    function resetForm() {
        selectedUser = null;
        $('#user-search').val('');
        $('#credit-amount').val('');
        $('#credit-reason').val('');
        $('#selected-user-info').hide();
        $('#user-search-results').hide().html('');
        $('#balance-preview').text('-').removeClass('text-success text-danger text-warning');
        $('#gift-credits-btn').prop('disabled', true);
    }

    $('#reset-form-btn').on('click', resetForm);

    // ============================================
    // 8. Transaction History Table
    // ============================================
    let transactionsTable = null;
    let transactionTypeFilter = '';
    let transactionUserFilter = '';

    async function loadTransactions() {
        try {
            const params = new URLSearchParams({
                limit: 100,
                sort: 'createdAt:desc'
            });

            if (transactionTypeFilter) params.append('type', transactionTypeFilter);
            if (transactionUserFilter) params.append('userEmail', transactionUserFilter);

            const response = await Domma.http.get(
                `${apiUrl}/admin/credits/transactions?${params}`,
                { headers: AdminAuth.getAuthHeaders() }
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to load transactions');
            }

            // Transform data for table
            const tableData = (response.data?.transactions || []).map(tx => ({
                id: tx.id || '-',
                user: tx.user?.email || '-',
                type: tx.type || '-',
                credits: tx.credits || 0,
                balance: tx.balance || 0,
                description: tx.description || '-',
                created_at: tx.createdAt ? Domma.dates(tx.createdAt).format('DD MMM YYYY HH:mm') : '-'
            }));

            if (!transactionsTable) {
                // Create table
                transactionsTable = Domma.tables.create('#transactions-table', {
                    data: tableData,
                    columns: [
                        { key: 'created_at', title: 'Date', sortable: true, width: '140px' },
                        { key: 'user', title: 'User', sortable: true },
                        {
                            key: 'type',
                            title: 'Type',
                            sortable: true,
                            width: '120px',
                            render: (value) => {
                                const badgeClass = {
                                    purchase: 'badge-success',
                                    lookup: 'badge-primary',
                                    refund: 'badge-warning',
                                    adjustment: 'badge-info'
                                }[value] || 'badge-secondary';
                                return `<span class="badge ${badgeClass}">${_.capitalize(value)}</span>`;
                            }
                        },
                        {
                            key: 'credits',
                            title: 'Credits',
                            sortable: true,
                            width: '100px',
                            render: (value) => {
                                const colorClass = value > 0 ? 'text-success' : value < 0 ? 'text-danger' : 'text-gray-600';
                                return `<span class="${colorClass} font-semibold">${value > 0 ? '+' : ''}${value}</span>`;
                            }
                        },
                        {
                            key: 'balance',
                            title: 'Balance',
                            sortable: true,
                            width: '100px',
                            render: (value) => `<strong>${value}</strong>`
                        },
                        { key: 'description', title: 'Description', sortable: false }
                    ],
                    pagination: true,
                    pageSize: 25,
                    striped: true,
                    selectable: false,
                    exportPanel: true,
                    exportOptions: ['csv', 'excel', 'json'],
                    columnToggle: true,
                    regexSearch: true
                });
            } else {
                transactionsTable.setData(tableData);
            }

        } catch (error) {
            console.error('[Admin] Failed to load transactions:', error);
            Domma.elements.toast('Error loading transactions: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 9. Transaction Filters
    // ============================================
    $('#transaction-type-filter').on('change', () => {
        transactionTypeFilter = $('#transaction-type-filter').val();
        loadTransactions();
    });

    const userFilterDebounced = _.debounce(() => {
        transactionUserFilter = $('#transaction-user-filter').val().trim();
        loadTransactions();
    }, 500);

    $('#transaction-user-filter').on('input', userFilterDebounced);

    $('#refresh-transactions').on('click', loadTransactions);

    // ============================================
    // 10. Initialise
    // ============================================
    loadTransactions();
    Domma.icons.scan(); // Scan for icons in dynamically added content
});
