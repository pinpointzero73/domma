/**
 * Address Lookup Admin - API Keys Management
 */

import AdminSidebar from '../../shared/admin-sidebar.js';
import AdminAuth from '../../shared/admin-auth.js';

// Configuration
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// State
let apiKeys = [];
let filteredKeys = [];
let currentSort = 'recent';
let selectedKeyId = null;

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

  // Load API keys
  await loadApiKeys();

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
    activeSection: 'api-keys',
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

  // Status filter
  $('#status-filter').on('change', () => {
    applyFilters();
  });

  // Sort filter
  $('#sort-filter').on('change', (e) => {
    currentSort = $(e.target).val();
    applyFilters();
  });

  // Modal close handlers
  $('[data-close-modal]').on('click', () => {
    $('#revoke-key-modal').css('display', 'none');
    $('#rate-limit-modal').css('display', 'none');
  });

  // Confirm revoke
  $('#confirm-revoke-key').on('click', handleRevokeKey);

  // Confirm rate limit update
  $('#confirm-rate-limit').on('click', handleUpdateRateLimit);
}

/**
 * Load API keys from backend
 */
async function loadApiKeys() {
  try {
    $('#loading-indicator').css('display', 'block');
    $('#keys-table').css('display', 'none');
    $('#no-keys').css('display', 'none');

    const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/api-keys`, {
      headers: AdminAuth.getAuthHeaders()
    });

    if (response.success && response.keys) {
      apiKeys = response.keys;
      filteredKeys = [...apiKeys];
      updateStats();
      applyFilters();
    } else {
      throw new Error(response.message || 'Failed to load API keys');
    }
  } catch (error) {
    console.error('[AddressLookupKeys] Failed to load API keys:', error);
    Domma.elements.toast('Failed to load API keys', { type: 'error' });
    $('#loading-indicator').html('<p class="text-gray-500">Failed to load API keys</p>');
  }
}

/**
 * Update summary statistics
 */
function updateStats() {
  const activeKeys = apiKeys.filter(k => k.isActive).length;
  const revokedKeys = apiKeys.filter(k => !k.isActive).length;
  const totalRequests = apiKeys.reduce((sum, k) => sum + k.totalRequests, 0);

  $('#stat-total-keys').text(apiKeys.length);
  $('#stat-active-keys').text(activeKeys);
  $('#stat-revoked-keys').text(revokedKeys);
  $('#stat-total-requests').text(totalRequests.toLocaleString());
}

/**
 * Apply filters and sorting
 */
function applyFilters() {
  const searchTerm = $('#search-input').val().toLowerCase();
  const statusFilter = $('#status-filter').val();

  // Filter
  filteredKeys = apiKeys.filter(key => {
    const matchesSearch =
      key.userEmail.toLowerCase().includes(searchTerm) ||
      key.keyPrefix.toLowerCase().includes(searchTerm) ||
      (key.name && key.name.toLowerCase().includes(searchTerm));

    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'active' && key.isActive) ||
      (statusFilter === 'inactive' && !key.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sort
  switch (currentSort) {
    case 'recent':
      filteredKeys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'usage':
      filteredKeys.sort((a, b) => b.totalRequests - a.totalRequests);
      break;
    case 'user':
      filteredKeys.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
      break;
  }

  renderKeysTable();
}

/**
 * Render API keys table
 */
function renderKeysTable() {
  $('#loading-indicator').css('display', 'none');
  $('#key-count').text(filteredKeys.length);

  if (filteredKeys.length === 0) {
    $('#keys-table').css('display', 'none');
    $('#no-keys').css('display', 'block');
    return;
  }

  $('#no-keys').css('display', 'none');
  $('#keys-table').css('display', 'table');

  const tableHtml = `
    <thead>
      <tr>
        <th>User</th>
        <th>Key</th>
        <th>Name</th>
        <th>Permissions</th>
        <th>Rate Limits</th>
        <th>Usage</th>
        <th>Status</th>
        <th>Created</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${filteredKeys.map(key => `
        <tr>
          <td>${DOMPurify.sanitize(key.userEmail)}</td>
          <td><code>${DOMPurify.sanitize(key.keyPrefix)}</code></td>
          <td>${DOMPurify.sanitize(key.name || '-')}</td>
          <td>
            ${key.permissions.freeLookup ? '<span class="badge badge-primary">Free</span>' : ''}
            ${key.permissions.premiumLookup ? '<span class="badge badge-secondary">Premium</span>' : ''}
          </td>
          <td>
            <small class="text-gray-500">
              ${key.rateLimit.requestsPerMinute}/min<br>
              ${key.rateLimit.requestsPerDay}/day
            </small>
          </td>
          <td>
            ${key.totalRequests.toLocaleString()}
            ${key.lastUsedAt ? `<br><small class="text-gray-500">${formatDate(key.lastUsedAt)}</small>` : ''}
          </td>
          <td>
            <span class="badge ${key.isActive ? 'badge-success' : 'badge-danger'}">
              ${key.isActive ? 'Active' : 'Revoked'}
            </span>
          </td>
          <td>${formatDate(key.createdAt)}</td>
          <td>
            ${key.isActive ? `
              <button class="btn btn-sm btn-secondary" onclick="window.openRateLimitModal('${key.keyId}', '${key.keyPrefix}', '${key.userEmail.replace(/'/g, "\\'")}', ${key.rateLimit.requestsPerMinute}, ${key.rateLimit.requestsPerDay})">
                Rate Limits
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.openRevokeModal('${key.keyId}', '${key.keyPrefix}', '${key.userEmail.replace(/'/g, "\\'")}')">
                Revoke
              </button>
            ` : `
              <span class="text-gray-500">Revoked</span>
            `}
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  $('#keys-table').html(tableHtml);
}

/**
 * Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Never';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Open revoke key modal
 */
window.openRevokeModal = function(keyId, keyPrefix, userEmail) {
  selectedKeyId = keyId;
  $('#revoke-key-prefix').text(keyPrefix);
  $('#revoke-key-user').text(userEmail);
  $('#revoke-key-modal').css('display', 'flex');
};

/**
 * Open rate limit adjustment modal
 */
window.openRateLimitModal = function(keyId, keyPrefix, userEmail, perMinute, perDay) {
  selectedKeyId = keyId;
  $('#rate-limit-key-prefix').text(keyPrefix);
  $('#rate-limit-key-user').text(userEmail);
  $('#rate-limit-per-minute').val(perMinute);
  $('#rate-limit-per-day').val(perDay);
  $('#rate-limit-modal').css('display', 'flex');
};

/**
 * Handle key revocation
 */
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

/**
 * Handle rate limit update
 */
async function handleUpdateRateLimit() {
  const perMinute = parseInt($('#rate-limit-per-minute').val());
  const perDay = parseInt($('#rate-limit-per-day').val());

  if (!perMinute || !perDay || perMinute < 1 || perDay < 1) {
    Domma.elements.toast('Please enter valid rate limits', { type: 'error' });
    return;
  }

  try {
    const response = await Domma.http.post(`${API_URL}/address/admin/address-lookup/update-rate-limit`, {
      keyId: selectedKeyId,
      requestsPerMinute: perMinute,
      requestsPerDay: perDay
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
