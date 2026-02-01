/**
 * Address Lookup Admin - Overview Dashboard
 */

import AdminSidebar from '../shared/admin-sidebar.js';
import AdminAuth from '../shared/admin-auth.js';

// Configuration
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

/**
 * Initialize the page
 */
async function init() {
  // Check authentication - init() handles redirect if not authorized
  if (!AdminAuth.init(API_URL, ['admin'])) {
    return; // Will redirect to login
  }

  // Initialize Address Lookup Admin Sidebar
  initSidebar();

  // Load dashboard data
  await loadDashboardStats();

  // Uncloak the page
  $('body').removeClass('dm-cloaked');
}

/**
 * Initialize sidebar with Address Lookup admin navigation
 */
function initSidebar() {
  // Create custom sidebar items for Address Lookup admin
  const addressLookupItems = [
    { text: 'Overview', url: '/admin/address-lookup/index.html', icon: 'layout', section: 'overview', roles: ['admin'] },
    { text: 'Users', url: '/admin/address-lookup/users/index.html', icon: 'users', section: 'users', roles: ['admin'] },
    { text: 'API Keys', url: '/admin/address-lookup/api-keys/index.html', icon: 'key', section: 'api-keys', roles: ['admin'] },
    { text: 'Credits', url: '/admin/address-lookup/credits/index.html', icon: 'credit-card', section: 'credits', roles: ['admin'] },
    { text: 'Analytics', url: '/admin/address-lookup/analytics/index.html', icon: 'chart-bar', section: 'analytics', roles: ['admin'] },
    { text: 'Back to Admin', url: '/admin/index.html', icon: 'arrow-left', section: 'back', roles: ['admin'] }
  ];

  const $container = $('#admin-sidebar');
  if ($container.length === 0) {
    console.error('[AddressLookupAdmin] Container #admin-sidebar not found');
    return;
  }

  // Get current user
  const user = Domma.auth.getUser();
  const userRole = user?.role || 'guest';

  // Filter items based on role
  const filteredItems = addressLookupItems.filter(item => {
    return !item.roles || item.roles.includes(userRole);
  });

  // Create sidebar
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
    activeSection: 'overview',
    push: true,
    contentSelector: '.admin-main'
  });
}

/**
 * Load dashboard statistics from API
 */
async function loadDashboardStats() {
  try {
    const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/stats`, {
      headers: AdminAuth.getAuthHeaders()
    });

    if (response.success && response.stats) {
      renderStats(response.stats);
    } else {
      throw new Error(response.message || 'Failed to load statistics');
    }
  } catch (error) {
    console.error('[AddressLookupAdmin] Failed to load stats:', error);
    Domma.elements.toast('Failed to load dashboard statistics', { type: 'error' });

    // Show placeholder data
    renderStats({
      totalUsers: 0,
      totalLookups: { total: 0, free: 0, premium: 0 },
      credits: { purchased: 0, consumed: 0, remaining: 0 },
      cacheStats: { hitRate: 0, hits: 0, misses: 0 },
      activeApiKeys: 0,
      recentActivity: []
    });
  }
}

/**
 * Render statistics to the dashboard
 */
function renderStats(stats) {
  // Total Users
  $('#stat-total-users').text(stats.totalUsers.toLocaleString());

  // Total Lookups
  $('#stat-total-lookups').text(stats.totalLookups.total.toLocaleString());
  $('#stat-free-lookups').text(`${stats.totalLookups.free.toLocaleString()} free`);
  $('#stat-premium-lookups').text(`${stats.totalLookups.premium.toLocaleString()} premium`);

  // Credits
  $('#stat-credits-purchased').text(stats.credits.purchased.toLocaleString());
  $('#stat-credits-consumed').text(stats.credits.consumed.toLocaleString());
  $('#stat-credits-remaining').text(stats.credits.remaining.toLocaleString());

  // Cache Stats
  const hitRatePercent = stats.cacheStats.hitRate.toFixed(1);
  $('#stat-cache-hit-rate').text(`${hitRatePercent}%`);
  $('#stat-cache-hits').text(`${stats.cacheStats.hits.toLocaleString()} hits`);
  $('#stat-cache-misses').text(`${stats.cacheStats.misses.toLocaleString()} misses`);

  // Active API Keys
  $('#stat-active-keys').text(stats.activeApiKeys.toLocaleString());

  // Recent Activity Table
  renderActivityTable(stats.recentActivity);
}

/**
 * Render recent activity table
 */
function renderActivityTable(activities) {
  const $table = $('#activity-table');

  if (!activities || activities.length === 0) {
    $table.html('<p class="text-gray-500">No recent activity</p>');
    return;
  }

  // Create table using Domma
  const tableHtml = `
    <thead>
      <tr>
        <th>User</th>
        <th>Action</th>
        <th>Postcode</th>
        <th>Tier</th>
        <th>Cache</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      ${activities.map(activity => `
        <tr>
          <td>${DOMPurify.sanitize(activity.userEmail || 'Unknown')}</td>
          <td>
            <span class="badge ${getActionBadgeClass(activity.action)}">
              ${DOMPurify.sanitize(activity.action)}
            </span>
          </td>
          <td>${DOMPurify.sanitize(activity.postcode || '-')}</td>
          <td>
            <span class="badge ${activity.tier === 'premium' ? 'badge-secondary' : 'badge-primary'}">
              ${DOMPurify.sanitize(activity.tier || '-')}
            </span>
          </td>
          <td>
            ${activity.cacheHit
              ? '<span class="badge badge-success">Hit</span>'
              : '<span class="badge badge-danger">Miss</span>'}
          </td>
          <td>${formatDate(activity.createdAt)}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  $table.html(tableHtml);
}

/**
 * Get badge class for action type
 */
function getActionBadgeClass(action) {
  const actionMap = {
    'lookup_free': 'badge-primary',
    'lookup_premium': 'badge-secondary',
    'cache_hit': 'badge-success',
    'api_error': 'badge-danger'
  };
  return actionMap[action] || 'badge-secondary';
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
