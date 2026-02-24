/**
 * Address Lookup Admin — Credit Management
 */

import AdminAuth from '../../shared/admin-auth.js';
import { getApiUrl, formatDate, initALSidebar } from '../shared/al-sidebar.js';

const API_URL = getApiUrl();

/** T.create() table instance. */
let transactionsTable = null;

/** All transactions loaded from the API. */
let allTransactions = [];

/** Transaction targeted by the refund modal. */
let selectedTransaction = null;

/**
 * Initialise the page.
 */
async function init() {
    if (!AdminAuth.init(API_URL, ['admin'])) {
        return;
    }

    initALSidebar('credits');
    setupEventListeners();
    await loadTransactions();

    $('body').removeClass('dm-cloaked');
}

/**
 * Set up event listeners.
 */
function setupEventListeners() {
    $('#search-input').on('input',   () => applyFilters());
    $('#type-filter').on('change',   () => applyFilters());
    $('#date-filter').on('change',   () => applyFilters());
    $('#sort-filter').on('change',   () => applyFilters());

    // Refund button delegation
    $('body').on('click', '.btn-refund', function () {
        const d = $(this).data();
        openRefundModal(d.txnId, d.userId, d.userEmail, Number(d.credits), d.description);
    });

    // Modal close
    $('[data-close-modal]').on('click', () => {
        $('#refund-modal').css('display', 'none');
    });

    $('#confirm-refund').on('click', handleRefund);
}

// ─── Data ────────────────────────────────────────────────────────────────────

async function loadTransactions() {
    try {
        const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/transactions`, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success && response.transactions) {
            allTransactions = response.transactions;
            updateStats();
            applyFilters();
        } else {
            throw new Error(response.message || 'Failed to load transactions');
        }
    } catch (error) {
        console.error('[AddressLookupCredits] Failed to load transactions:', error);
        Domma.elements.toast('Failed to load transactions', { type: 'error' });
    }
}

function updateStats() {
    const purchased = allTransactions
        .filter(t => t.type === 'purchase' && t.credits > 0)
        .reduce((sum, t) => sum + t.credits, 0);

    const consumed = Math.abs(allTransactions
        .filter(t => t.type === 'lookup')
        .reduce((sum, t) => sum + t.credits, 0));

    const refunded = allTransactions
        .filter(t => t.type === 'refund')
        .reduce((sum, t) => sum + t.credits, 0);

    $('#stat-total-purchased').text(purchased.toLocaleString());
    $('#stat-total-consumed').text(consumed.toLocaleString());
    $('#stat-total-remaining').text((purchased - consumed + refunded).toLocaleString());
    $('#stat-total-transactions').text(allTransactions.length.toLocaleString());
}

function applyFilters() {
    const searchTerm  = ($('#search-input').val() || '').toLowerCase();
    const typeFilter  = $('#type-filter').val();
    const dateFilter  = $('#date-filter').val();
    const sortKey     = $('#sort-filter').val() || 'recent';

    // Date threshold
    let dateThreshold = null;
    if (dateFilter) {
        const offsets = { today: 0, week: 7, month: 30 };
        const days = offsets[dateFilter];
        dateThreshold = days === 0
            ? D().startOf('day').toDate()
            : D().subtract(days, 'days').toDate();
    }

    let filtered = allTransactions.filter(txn => {
        const matchesSearch = txn.userEmail.toLowerCase().includes(searchTerm);
        const matchesType   = !typeFilter  || txn.type === typeFilter;
        const matchesDate   = !dateThreshold || new Date(txn.createdAt) >= dateThreshold;
        return matchesSearch && matchesType && matchesDate;
    });

    const sortFns = {
        recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        amount: (a, b) => Math.abs(b.credits)   - Math.abs(a.credits),
        user:   (a, b) => a.userEmail.localeCompare(b.userEmail)
    };
    if (sortFns[sortKey]) filtered.sort(sortFns[sortKey]);

    $('#transaction-count').text(filtered.length);
    renderTable(filtered);
}

function renderTable(transactions) {
    const tableData = transactions.map(t => ({
        createdAt:     t.createdAt,
        userEmail:     t.userEmail,
        type:          t.type,
        credits:       t.credits,
        balance:       t.balance,
        description:   t.description,
        transactionId: t.transactionId,
        userId:        t.userId
    }));

    if (!transactionsTable) {
        transactionsTable = T.create('#transactions-table', {
            data: tableData,
            columns: [
                {
                    key: 'createdAt',
                    title: 'Date',
                    sortable: true,
                    render: (value) => formatDate(value, true)
                },
                { key: 'userEmail', title: 'User', sortable: true },
                {
                    key: 'type',
                    title: 'Type',
                    sortable: true,
                    render: (value) => {
                        const cls = { purchase: 'badge-success', lookup: 'badge-danger', refund: 'badge-info' }[value] || 'badge-secondary';
                        return `<span class="badge ${cls}">${_.escape(value)}</span>`;
                    }
                },
                {
                    key: 'credits',
                    title: 'Credits',
                    sortable: true,
                    render: (value) => {
                        const cls  = value > 0 ? 'text-success' : 'text-danger';
                        const sign = value > 0 ? '+' : '';
                        return `<span class="${cls}">${sign}${value.toLocaleString()}</span>`;
                    }
                },
                {
                    key: 'balance',
                    title: 'Balance',
                    sortable: true,
                    render: (value) => value.toLocaleString()
                },
                { key: 'description', title: 'Description', sortable: false },
                {
                    key: 'transactionId',
                    title: 'Actions',
                    sortable: false,
                    render: (txnId, row) => {
                        if (!(row.type === 'lookup' && row.credits < 0)) return '-';
                        return `<button class="btn btn-sm btn-secondary btn-refund"
                                    data-txn-id="${_.escape(txnId)}"
                                    data-user-id="${_.escape(row.userId)}"
                                    data-user-email="${_.escape(row.userEmail)}"
                                    data-credits="${Math.abs(row.credits)}"
                                    data-description="${_.escape(row.description)}">Refund</button>`;
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
        transactionsTable.setData(tableData);
    }
}

// ─── Refund Modal ─────────────────────────────────────────────────────────────

function openRefundModal(transactionId, userId, userEmail, credits, description) {
    selectedTransaction = { transactionId, userId, userEmail, credits, description };
    $('#refund-user-email').text(userEmail);
    $('#refund-original-description').text(description);
    $('#refund-credits-amount').val(credits);
    $('#refund-reason').val('');
    $('#refund-modal').css('display', 'flex');
}

async function handleRefund() {
    const credits = parseInt($('#refund-credits-amount').val());
    const reason  = $('#refund-reason').val().trim();

    if (!credits || credits <= 0) {
        Domma.elements.toast('Please enter a valid credit amount', { type: 'error' });
        return;
    }

    if (!reason) {
        Domma.elements.toast('Please provide a refund reason', { type: 'error' });
        return;
    }

    try {
        const response = await Domma.http.post(`${API_URL}/address/admin/address-lookup/refund-credits`, {
            userId:                selectedTransaction.userId,
            credits,
            reason,
            originalTransactionId: selectedTransaction.transactionId
        }, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (response.success) {
            Domma.elements.toast(`Successfully refunded ${credits} credits`, { type: 'success' });
            $('#refund-modal').css('display', 'none');
            await loadTransactions();
        } else {
            throw new Error(response.message || 'Failed to process refund');
        }
    } catch (error) {
        console.error('[AddressLookupCredits] Refund error:', error);
        Domma.elements.toast('Failed to process refund', { type: 'error' });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
