/**
 * Address Lookup Admin — User Management
 */

import AdminAuth from '../../shared/admin-auth.js';
import { getApiUrl, formatDate, initALSidebar } from '../shared/al-sidebar.js';

const API_URL = getApiUrl();

/** T.create() table instance — reused across reloads. */
let usersTable = null;

/** Currently selected user ID for the grant-credits modal. */
let selectedUserId = null;

/**
 * Initialise the page.
 */
async function init() {
    if (!AdminAuth.init(API_URL, ['admin'])) {
        return;
    }

    initALSidebar('users');
    setupEventListeners();
    await loadUsers();

    $('body').removeClass('dm-cloaked');
}

/**
 * Set up event listeners using delegation so they survive table re-renders.
 */
function setupEventListeners() {
    // Search / role / sort filters
    $('#search-input').on('input', () => applyFilters());
    $('#role-filter').on('change', () => applyFilters());
    $('#sort-filter').on('change', () => applyFilters());

    // Action button delegation — covers dynamically rendered table rows
    $('body').on('click', '.btn-view-user', function () {
        Domma.elements.toast('User details page coming soon', { type: 'info' });
    });

    $('body').on('click', '.btn-grant-credits', function () {
        const userId = $(this).data('user-id');
        const email  = $(this).data('user-email');
        openGrantCreditsModal(userId, email);
    });

    // Grant-credits modal controls
    $('[data-close-modal]').on('click', () => {
        $('#grant-credits-modal').css('display', 'none');
    });

    $('#confirm-grant-credits').on('click', handleGrantCredits);
}

// ─── Data ────────────────────────────────────────────────────────────────────

/** All users loaded from the API (used for client-side filtering). */
let allUsers = [];

/**
 * Load users from the API and (re-)render the table.
 */
async function loadUsers() {
    try {
        const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/users`, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success && response.users) {
            allUsers = response.users;
            applyFilters();
        } else {
            throw new Error(response.message || 'Failed to load users');
        }
    } catch (error) {
        console.error('[AddressLookupUsers] Failed to load users:', error);
        Domma.elements.toast('Failed to load users', { type: 'error' });
    }
}

/**
 * Apply client-side filters and update the table.
 */
function applyFilters() {
    const searchTerm  = ($('#search-input').val() || '').toLowerCase();
    const roleFilter  = $('#role-filter').val();
    const sortKey     = $('#sort-filter').val() || 'lookups';

    let filtered = allUsers.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm);
        const matchesRole   = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const sortFns = {
        lookups:  (a, b) => b.totalLookups  - a.totalLookups,
        credits:  (a, b) => b.creditBalance - a.creditBalance,
        recent:   (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity),
        email:    (a, b) => a.email.localeCompare(b.email)
    };
    if (sortFns[sortKey]) filtered.sort(sortFns[sortKey]);

    $('#user-count').text(filtered.length);
    renderTable(filtered);
}

/**
 * Render users using T.create() / setData().
 */
function renderTable(users) {
    const tableData = users.map(u => ({
        email:         u.email,
        role:          u.role,
        creditBalance: u.creditBalance,
        totalLookups:  u.totalLookups,
        freeLookups:   u.freeLookups,
        premiumLookups: u.premiumLookups,
        apiKeyCount:   u.apiKeyCount,
        lastActivity:  u.lastActivity,
        userId:        u.userId
    }));

    if (!usersTable) {
        usersTable = T.create('#users-table', {
            data: tableData,
            columns: [
                { key: 'email', title: 'Email', sortable: true },
                {
                    key: 'role',
                    title: 'Role',
                    sortable: true,
                    render: (value) => {
                        const cls = { admin: 'badge-danger', subscriber: 'badge-info', guest: 'badge-secondary' }[value] || 'badge-secondary';
                        return `<span class="badge ${cls}">${_.capitalize(value)}</span>`;
                    }
                },
                {
                    key: 'creditBalance',
                    title: 'Credits',
                    sortable: true,
                    render: (value) => value.toLocaleString()
                },
                {
                    key: 'totalLookups',
                    title: 'Total Lookups',
                    sortable: true,
                    render: (value, row) =>
                        `${value.toLocaleString()} <small class="text-muted">(${row.freeLookups} free, ${row.premiumLookups} premium)</small>`
                },
                { key: 'apiKeyCount', title: 'API Keys', sortable: true },
                {
                    key: 'lastActivity',
                    title: 'Last Activity',
                    sortable: true,
                    render: (value) => formatDate(value) || 'Never'
                },
                {
                    key: 'userId',
                    title: 'Actions',
                    sortable: false,
                    render: (userId, row) =>
                        `<button class="btn btn-sm btn-primary btn-view-user" data-user-id="${userId}">View</button>
                         <button class="btn btn-sm btn-secondary btn-grant-credits" data-user-id="${userId}" data-user-email="${_.escape(row.email)}">Grant Credits</button>`
                }
            ],
            pagination: true,
            pageSize: 25,
            striped: true,
            search: true,
            exportPanel: true,
            exportOptions: ['csv', 'json']
        });
    } else {
        usersTable.setData(tableData);
    }
}

// ─── Grant Credits Modal ──────────────────────────────────────────────────────

function openGrantCreditsModal(userId, email) {
    selectedUserId = userId;
    $('#grant-user-email').text(email);
    $('#grant-credits-amount').val('100');
    $('#grant-credits-reason').val('');
    $('#grant-credits-modal').css('display', 'flex');
}

async function handleGrantCredits() {
    const amount = parseInt($('#grant-credits-amount').val());
    const reason = $('#grant-credits-reason').val().trim();

    if (!amount || amount <= 0) {
        Domma.elements.toast('Please enter a valid credit amount', { type: 'error' });
        return;
    }

    try {
        const response = await Domma.http.post(`${API_URL}/address/admin/address-lookup/grant-credits`, {
            userId: selectedUserId,
            credits: amount,
            reason: reason || 'Admin grant'
        }, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success) {
            Domma.elements.toast(`Successfully granted ${amount} credits`, { type: 'success' });
            $('#grant-credits-modal').css('display', 'none');
            await loadUsers();
        } else {
            throw new Error(response.message || 'Failed to grant credits');
        }
    } catch (error) {
        console.error('[AddressLookupUsers] Grant credits error:', error);
        Domma.elements.toast('Failed to grant credits', { type: 'error' });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
