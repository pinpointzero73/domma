/**
 * Address Lookup Admin - Credit Management
 */

import AdminSidebar from '../../shared/admin-sidebar.js';
import AdminAuth from '../../shared/admin-auth.js';

// Configuration
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// State
let transactions = [];
let filteredTransactions = [];
let currentSort = 'recent';
let selectedTransaction = null;

/**
 * Initialize the page
 */
async function init() {
  // Check authentication
  if (!AdminAuth.init(API_URL, ['admin'])) {
    return;
  }

  // Initialize sidebar
  initSidebar();

  // Setup event listeners
  setupEventListeners();

  // Load transactions
  await loadTransactions();

  // Uncloak the page
  $('body').removeClass('dm-cloaked');
}

/**
 * Initialize sidebar
 */
function initSidebar() {
  const addressLookupItems = [
    { text: 'Overview', url: '/admin/address-lookup/index.html', icon: 'layout', section: 'overview', roles: ['admin'] },
    { text: 'Users', url: '/admin/address-lookup/users/index.html', icon: 'users', section: 'users', roles: ['admin'] },
    { text: 'API Keys', url: '/admin/address-lookup/api-keys/index.html', icon: 'key', section: 'api-keys', roles: ['admin'] },
    { text: 'Credits', url: '/admin/address-lookup/credits/index.html', icon: 'credit-card', section: 'credits', roles: ['admin'] },
    { text: 'Analytics', url: '/admin/address-lookup/analytics/index.html', icon: 'chart-bar', section: 'analytics', roles: ['admin'] },
    { text: 'Back to Admin', url: '/admin/index.html', icon: 'arrow-left', section: 'back', roles: ['admin'] }
  ];

  const user = Domma.auth.getUser();
  const userRole = user?.role || 'guest';
  const filteredItems = addressLookupItems.filter(item => !item.roles || item.roles.includes(userRole));

  Domma.elements.sidebar('#admin-sidebar', {
    position: 'left',
    fixed: true,
    width: '250px',
    collapsedWidth: '60px',
    top: '60px',
    header: {
      title: 'Address Lookup Admin',
      toggle: true,
      icon: null
    },
    items: filteredItems,
    variant: 'dark',
    collapsible: true,
    collapsibleDesktop: true,
    persistCollapsed: true,
    persistCollapseKey: 'address-admin-sidebar',
    collapseAt: 768,
    activeSection: 'credits',
    push: true,
    contentSelector: '.admin-main'
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search filter
  $('#search-input').on('input', () => {
    applyFilters();
  });

  // Type filter
  $('#type-filter').on('change', () => {
    applyFilters();
  });

  // Date filter
  $('#date-filter').on('change', () => {
    applyFilters();
  });

  // Sort filter
  $('#sort-filter').on('change', (e) => {
    currentSort = $(e.target).val();
    applyFilters();
  });

  // Modal close handlers
  $('[data-close-modal]').on('click', () => {
    $('#refund-modal').css('display', 'none');
  });

  // Confirm refund
  $('#confirm-refund').on('click', handleRefund);
}

/**
 * Load transactions from backend
 */
async function loadTransactions() {
  try {
    $('#loading-indicator').css('display', 'block');
    $('#transactions-table').css('display', 'none');
    $('#no-transactions').css('display', 'none');

    const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/transactions`, {
      headers: AdminAuth.getAuthHeaders()
    });

    if (response.success && response.transactions) {
      transactions = response.transactions;
      filteredTransactions = [...transactions];
      updateStats();
      applyFilters();
    } else {
      throw new Error(response.message || 'Failed to load transactions');
    }
  } catch (error) {
    console.error('[AddressLookupCredits] Failed to load transactions:', error);
    Domma.elements.toast('Failed to load transactions', { type: 'error' });
    $('#loading-indicator').html('<p class="text-gray-500">Failed to load transactions</p>');
  }
}

/**
 * Update summary statistics
 */
function updateStats() {
  const purchased = transactions
    .filter(t => t.type === 'purchase' && t.credits > 0)
    .reduce((sum, t) => sum + t.credits, 0);

  const consumed = Math.abs(transactions
    .filter(t => t.type === 'lookup')
    .reduce((sum, t) => sum + t.credits, 0));

  const refunded = transactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.credits, 0);

  const remaining = purchased - consumed + refunded;

  $('#stat-total-purchased').text(purchased.toLocaleString());
  $('#stat-total-consumed').text(consumed.toLocaleString());
  $('#stat-total-remaining').text(remaining.toLocaleString());
  $('#stat-total-transactions').text(transactions.length.toLocaleString());
}

/**
 * Apply filters and sorting
 */
function applyFilters() {
  const searchTerm = $('#search-input').val().toLowerCase();
  const typeFilter = $('#type-filter').val();
  const dateFilter = $('#date-filter').val();

  // Calculate date threshold
  let dateThreshold = null;
  const now = new Date();
  switch (dateFilter) {
    case 'today':
      dateThreshold = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }

  // Filter
  filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.userEmail.toLowerCase().includes(searchTerm);
    const matchesType = !typeFilter || txn.type === typeFilter;
    const matchesDate = !dateThreshold || new Date(txn.createdAt) >= dateThreshold;

    return matchesSearch && matchesType && matchesDate;
  });

  // Sort
  switch (currentSort) {
    case 'recent':
      filteredTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'amount':
      filteredTransactions.sort((a, b) => Math.abs(b.credits) - Math.abs(a.credits));
      break;
    case 'user':
      filteredTransactions.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
      break;
  }

  renderTransactionsTable();
}

/**
 * Render transactions table
 */
function renderTransactionsTable() {
  $('#loading-indicator').css('display', 'none');
  $('#transaction-count').text(filteredTransactions.length);

  if (filteredTransactions.length === 0) {
    $('#transactions-table').css('display', 'none');
    $('#no-transactions').css('display', 'block');
    return;
  }

  $('#no-transactions').css('display', 'none');
  $('#transactions-table').css('display', 'table');

  const tableHtml = `
    <thead>
      <tr>
        <th>Date</th>
        <th>User</th>
        <th>Type</th>
        <th>Credits</th>
        <th>Balance</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${filteredTransactions.map(txn => `
        <tr>
          <td>${formatDate(txn.createdAt)}</td>
          <td>${DOMPurify.sanitize(txn.userEmail)}</td>
          <td>
            <span class="badge ${getTypeBadgeClass(txn.type)}">
              ${DOMPurify.sanitize(txn.type)}
            </span>
          </td>
          <td class="${txn.credits > 0 ? 'text-success' : 'text-danger'}">
            ${txn.credits > 0 ? '+' : ''}${txn.credits.toLocaleString()}
          </td>
          <td>${txn.balance.toLocaleString()}</td>
          <td>${DOMPurify.sanitize(txn.description)}</td>
          <td>
            ${txn.type === 'lookup' && txn.credits < 0 ? `
              <button class="btn btn-sm btn-secondary" onclick="window.openRefundModal('${txn.transactionId}', '${txn.userId}', '${txn.userEmail.replace(/'/g, "\\'")}', ${Math.abs(txn.credits)}, '${txn.description.replace(/'/g, "\\'")}')">
                Refund
              </button>
            ` : '-'}
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  $('#transactions-table').html(tableHtml);
}

/**
 * Get type badge class
 */
function getTypeBadgeClass(type) {
  const typeMap = {
    'purchase': 'badge-success',
    'lookup': 'badge-danger',
    'refund': 'badge-primary'
  };
  return typeMap[type] || 'badge-secondary';
}

/**
 * Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';

  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Open refund modal
 */
window.openRefundModal = function(transactionId, userId, userEmail, credits, description) {
  selectedTransaction = {
    transactionId,
    userId,
    userEmail,
    credits,
    description
  };

  $('#refund-user-email').text(userEmail);
  $('#refund-original-description').text(description);
  $('#refund-credits-amount').val(credits);
  $('#refund-reason').val('');
  $('#refund-modal').css('display', 'flex');
};

/**
 * Handle refund
 */
async function handleRefund() {
  const credits = parseInt($('#refund-credits-amount').val());
  const reason = $('#refund-reason').val().trim();

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
      userId: selectedTransaction.userId,
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
