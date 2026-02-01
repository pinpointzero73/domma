/**
 * Address Lookup Admin - User Management
 */

import AdminSidebar from '../../shared/admin-sidebar.js';
import AdminAuth from '../../shared/admin-auth.js';

// Configuration
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// State
let users = [];
let filteredUsers = [];
let currentSort = 'lookups';
let selectedUserId = null;

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

  // Load users
  await loadUsers();

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
    activeSection: 'users',
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

  // Role filter
  $('#role-filter').on('change', () => {
    applyFilters();
  });

  // Sort filter
  $('#sort-filter').on('change', (e) => {
    currentSort = $(e.target).val();
    applyFilters();
  });

  // Modal close handlers
  $('[data-close-modal]').on('click', () => {
    $('#grant-credits-modal').css('display', 'none');
  });

  // Confirm grant credits
  $('#confirm-grant-credits').on('click', handleGrantCredits);
}

/**
 * Load users from API
 */
async function loadUsers() {
  try {
    $('#loading-indicator').css('display', 'block');
    $('#users-table').css('display', 'none');
    $('#no-users').css('display', 'none');

    const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/users`, {
      headers: AdminAuth.getAuthHeaders()
    });

    if (response.success && response.users) {
      users = response.users;
      filteredUsers = [...users];
      applyFilters();
    } else {
      throw new Error(response.message || 'Failed to load users');
    }
  } catch (error) {
    console.error('[AddressLookupUsers] Failed to load users:', error);
    Domma.elements.toast('Failed to load users', { type: 'error' });
    $('#loading-indicator').html('<p class="text-gray-500">Failed to load users</p>');
  }
}

/**
 * Apply filters and sorting
 */
function applyFilters() {
  const searchTerm = $('#search-input').val().toLowerCase();
  const roleFilter = $('#role-filter').val();

  // Filter
  filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Sort
  switch (currentSort) {
    case 'lookups':
      filteredUsers.sort((a, b) => b.totalLookups - a.totalLookups);
      break;
    case 'credits':
      filteredUsers.sort((a, b) => b.creditBalance - a.creditBalance);
      break;
    case 'recent':
      filteredUsers.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
      break;
    case 'email':
      filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
      break;
  }

  renderUsersTable();
}

/**
 * Render users table
 */
function renderUsersTable() {
  $('#loading-indicator').css('display', 'none');
  $('#user-count').text(filteredUsers.length);

  if (filteredUsers.length === 0) {
    $('#users-table').css('display', 'none');
    $('#no-users').css('display', 'block');
    return;
  }

  $('#no-users').css('display', 'none');
  $('#users-table').css('display', 'table');

  const tableHtml = `
    <thead>
      <tr>
        <th>Email</th>
        <th>Role</th>
        <th>Credits</th>
        <th>Total Lookups</th>
        <th>API Keys</th>
        <th>Last Activity</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${filteredUsers.map(user => `
        <tr>
          <td>${DOMPurify.sanitize(user.email)}</td>
          <td>
            <span class="badge ${getRoleBadgeClass(user.role)}">
              ${DOMPurify.sanitize(user.role)}
            </span>
          </td>
          <td>${user.creditBalance.toLocaleString()}</td>
          <td>
            ${user.totalLookups.toLocaleString()}
            <small class="text-gray-500">
              (${user.freeLookups} free, ${user.premiumLookups} premium)
            </small>
          </td>
          <td>${user.apiKeyCount}</td>
          <td>${formatDate(user.lastActivity)}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="window.viewUserDetails('${user.userId}')">
              View
            </button>
            <button class="btn btn-sm btn-secondary" onclick="window.openGrantCreditsModal('${user.userId}', '${user.email.replace(/'/g, "\\'")}')">
              Grant Credits
            </button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  $('#users-table').html(tableHtml);
}

/**
 * Get role badge class
 */
function getRoleBadgeClass(role) {
  const roleMap = {
    'admin': 'badge-danger',
    'subscriber': 'badge-primary',
    'guest': 'badge-secondary'
  };
  return roleMap[role] || 'badge-secondary';
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
 * Open grant credits modal
 */
window.openGrantCreditsModal = function(userId, email) {
  selectedUserId = userId;
  $('#grant-user-email').text(email);
  $('#grant-credits-amount').val('100');
  $('#grant-credits-reason').val('');
  $('#grant-credits-modal').css('display', 'flex');
};

/**
 * View user details
 */
window.viewUserDetails = function(userId) {
  // For now, just navigate to a user detail page (to be built later)
  Domma.elements.toast('User details page coming soon', { type: 'info' });
};

/**
 * Handle grant credits
 */
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

      // Reload users to show updated balance
      await loadUsers();
    } else {
      throw new Error(response.message || 'Failed to grant credits');
    }
  } catch (error) {
    console.error('[AddressLookupUsers] Grant credits error:', error);
    Domma.elements.toast('Failed to grant credits', { type: 'error' });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
