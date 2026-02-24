/**
 * Address Lookup Admin — API Keys Management
 */

import AdminAuth from '../../shared/admin-auth.js';
import { getApiUrl, formatDate, initALSidebar } from '../shared/al-sidebar.js';

const API_URL = getApiUrl();

/** T.create() table instance. */
let keysTable = null;

/** All keys loaded from the API (used for client-side filtering). */
let allKeys = [];

/** Key ID currently targeted by a modal action. */
let selectedKeyId = null;

/**
 * Initialise the page.
 */
async function init() {
    if (!AdminAuth.init(API_URL, ['admin'])) {
        return;
    }

    initALSidebar('api-keys');
    setupEventListeners();
    await loadApiKeys();

    $('body').removeClass('dm-cloaked');
}

/**
 * Set up event listeners.
 */
function setupEventListeners() {
    $('#search-input').on('input',  () => applyFilters());
    $('#status-filter').on('change', () => applyFilters());
    $('#sort-filter').on('change',   () => applyFilters());

    // Action delegation
    $('body').on('click', '.btn-rate-limits', function () {
        const { keyId, keyPrefix, userEmail, perMinute, perDay } = $(this).data();
        openRateLimitModal(keyId, keyPrefix, userEmail, perMinute, perDay);
    });

    $('body').on('click', '.btn-revoke-key', function () {
        const { keyId, keyPrefix, userEmail } = $(this).data();
        openRevokeModal(keyId, keyPrefix, userEmail);
    });

    // Modal close
    $('[data-close-modal]').on('click', () => {
        $('#revoke-key-modal').css('display', 'none');
        $('#rate-limit-modal').css('display', 'none');
    });

    $('#confirm-revoke-key').on('click', handleRevokeKey);
    $('#confirm-rate-limit').on('click', handleUpdateRateLimit);
}

// ─── Data ────────────────────────────────────────────────────────────────────

async function loadApiKeys() {
    try {
        const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/api-keys`, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success && response.keys) {
            allKeys = response.keys;
            updateStats();
            applyFilters();
        } else {
            throw new Error(response.message || 'Failed to load API keys');
        }
    } catch (error) {
        console.error('[AddressLookupKeys] Failed to load API keys:', error);
        Domma.elements.toast('Failed to load API keys', { type: 'error' });
    }
}

function updateStats() {
    const activeKeys      = allKeys.filter(k => k.isActive).length;
    const revokedKeys     = allKeys.filter(k => !k.isActive).length;
    const totalRequests   = allKeys.reduce((sum, k) => sum + k.totalRequests, 0);

    $('#stat-total-keys').text(allKeys.length);
    $('#stat-active-keys').text(activeKeys);
    $('#stat-revoked-keys').text(revokedKeys);
    $('#stat-total-requests').text(totalRequests.toLocaleString());
}

function applyFilters() {
    const searchTerm  = ($('#search-input').val() || '').toLowerCase();
    const statusFilter = $('#status-filter').val();
    const sortKey      = $('#sort-filter').val() || 'recent';

    let filtered = allKeys.filter(key => {
        const matchesSearch =
            key.userEmail.toLowerCase().includes(searchTerm)  ||
            key.keyPrefix.toLowerCase().includes(searchTerm)  ||
            (key.name && key.name.toLowerCase().includes(searchTerm));

        const matchesStatus =
            !statusFilter ||
            (statusFilter === 'active'   && key.isActive)  ||
            (statusFilter === 'inactive' && !key.isActive);

        return matchesSearch && matchesStatus;
    });

    const sortFns = {
        recent: (a, b) => new Date(b.createdAt)      - new Date(a.createdAt),
        usage:  (a, b) => b.totalRequests             - a.totalRequests,
        user:   (a, b) => a.userEmail.localeCompare(b.userEmail)
    };
    if (sortFns[sortKey]) filtered.sort(sortFns[sortKey]);

    $('#key-count').text(filtered.length);
    renderTable(filtered);
}

function renderTable(keys) {
    const tableData = keys.map(k => ({
        userEmail:         k.userEmail,
        keyPrefix:         k.keyPrefix,
        name:              k.name || '-',
        permFree:          k.permissions.freeLookup,
        permPremium:       k.permissions.premiumLookup,
        rateLimitMin:      k.rateLimit.requestsPerMinute,
        rateLimitDay:      k.rateLimit.requestsPerDay,
        totalRequests:     k.totalRequests,
        lastUsedAt:        k.lastUsedAt,
        isActive:          k.isActive,
        createdAt:         k.createdAt,
        keyId:             k.keyId
    }));

    if (!keysTable) {
        keysTable = T.create('#keys-table', {
            data: tableData,
            columns: [
                { key: 'userEmail', title: 'User', sortable: true },
                { key: 'keyPrefix', title: 'Key',  sortable: true, render: (v) => `<code>${_.escape(v)}</code>` },
                { key: 'name',      title: 'Name', sortable: true },
                {
                    key: 'permFree',
                    title: 'Permissions',
                    sortable: false,
                    render: (free, row) =>
                        (free    ? '<span class="badge badge-info">Free</span> '    : '') +
                        (row.permPremium ? '<span class="badge badge-secondary">Premium</span>' : '')
                },
                {
                    key: 'rateLimitMin',
                    title: 'Rate Limits',
                    sortable: false,
                    render: (min, row) => `<small class="text-muted">${min}/min &nbsp; ${row.rateLimitDay}/day</small>`
                },
                {
                    key: 'totalRequests',
                    title: 'Usage',
                    sortable: true,
                    render: (value, row) =>
                        value.toLocaleString() +
                        (row.lastUsedAt ? `<br><small class="text-muted">${formatDate(row.lastUsedAt)}</small>` : '')
                },
                {
                    key: 'isActive',
                    title: 'Status',
                    sortable: true,
                    render: (value) =>
                        value
                            ? '<span class="badge badge-success">Active</span>'
                            : '<span class="badge badge-danger">Revoked</span>'
                },
                {
                    key: 'createdAt',
                    title: 'Created',
                    sortable: true,
                    render: (value) => formatDate(value)
                },
                {
                    key: 'keyId',
                    title: 'Actions',
                    sortable: false,
                    render: (keyId, row) => {
                        if (!row.isActive) return '<span class="text-muted">Revoked</span>';
                        return `<button class="btn btn-sm btn-secondary btn-rate-limits"
                                    data-key-id="${_.escape(keyId)}"
                                    data-key-prefix="${_.escape(row.keyPrefix)}"
                                    data-user-email="${_.escape(row.userEmail)}"
                                    data-per-minute="${row.rateLimitMin}"
                                    data-per-day="${row.rateLimitDay}">Rate Limits</button>
                                <button class="btn btn-sm btn-danger btn-revoke-key"
                                    data-key-id="${_.escape(keyId)}"
                                    data-key-prefix="${_.escape(row.keyPrefix)}"
                                    data-user-email="${_.escape(row.userEmail)}">Revoke</button>`;
                    }
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
        keysTable.setData(tableData);
    }
}

// ─── Revoke Modal ─────────────────────────────────────────────────────────────

function openRevokeModal(keyId, keyPrefix, userEmail) {
    selectedKeyId = keyId;
    $('#revoke-key-prefix').text(keyPrefix);
    $('#revoke-key-user').text(userEmail);
    $('#revoke-key-modal').css('display', 'flex');
}

async function handleRevokeKey() {
    try {
        const response = await Domma.http.post(`${API_URL}/address/admin/address-lookup/revoke-key`, {
            keyId: selectedKeyId
        }, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success) {
            Domma.elements.toast('API key revoked successfully', { type: 'success' });
            $('#revoke-key-modal').css('display', 'none');
            await loadApiKeys();
        } else {
            throw new Error(response.message || 'Failed to revoke key');
        }
    } catch (error) {
        console.error('[AddressLookupKeys] Revoke error:', error);
        Domma.elements.toast('Failed to revoke API key', { type: 'error' });
    }
}

// ─── Rate Limit Modal ─────────────────────────────────────────────────────────

function openRateLimitModal(keyId, keyPrefix, userEmail, perMinute, perDay) {
    selectedKeyId = keyId;
    $('#rate-limit-key-prefix').text(keyPrefix);
    $('#rate-limit-key-user').text(userEmail);
    $('#rate-limit-per-minute').val(perMinute);
    $('#rate-limit-per-day').val(perDay);
    $('#rate-limit-modal').css('display', 'flex');
}

async function handleUpdateRateLimit() {
    const perMinute = parseInt($('#rate-limit-per-minute').val());
    const perDay    = parseInt($('#rate-limit-per-day').val());

    if (!perMinute || !perDay || perMinute < 1 || perDay < 1) {
        Domma.elements.toast('Please enter valid rate limits', { type: 'error' });
        return;
    }

    try {
        const response = await Domma.http.post(`${API_URL}/address/admin/address-lookup/update-rate-limit`, {
            keyId: selectedKeyId,
            requestsPerMinute: perMinute,
            requestsPerDay:    perDay
        }, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success) {
            Domma.elements.toast('Rate limits updated successfully', { type: 'success' });
            $('#rate-limit-modal').css('display', 'none');
            await loadApiKeys();
        } else {
            throw new Error(response.message || 'Failed to update rate limits');
        }
    } catch (error) {
        console.error('[AddressLookupKeys] Rate limit update error:', error);
        Domma.elements.toast('Failed to update rate limits', { type: 'error' });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
