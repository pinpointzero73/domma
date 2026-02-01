/**
 * Address Lookup Admin - Analytics
 */

import AdminSidebar from '../../shared/admin-sidebar.js';
import AdminAuth from '../../shared/admin-auth.js';

// Configuration
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// State
let charts = {};
let currentPeriod = 30;

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

  // Load analytics
  await loadAnalytics();

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
    activeSection: 'analytics',
    push: true,
    contentSelector: '.admin-main'
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Time period selector
  $('#time-period').on('change', async (e) => {
    currentPeriod = parseInt($(e.target).val());
    await loadAnalytics();
  });
}

/**
 * Load analytics data
 */
async function loadAnalytics() {
  try {
    const response = await Domma.http.get(`${API_URL}/address/admin/address-lookup/analytics?days=${currentPeriod}`, {
      headers: AdminAuth.getAuthHeaders()
    });

    if (response.success && response.analytics) {
      renderCharts(response.analytics);
      renderPopularPostcodes(response.analytics.popularPostcodes);
      renderErrors(response.analytics.recentErrors);
    } else {
      throw new Error(response.message || 'Failed to load analytics');
    }
  } catch (error) {
    console.error('[AddressLookupAnalytics] Failed to load analytics:', error);
    Domma.elements.toast('Failed to load analytics', { type: 'error' });
  }
}

/**
 * Render all charts
 */
function renderCharts(analytics) {
  renderLookupsChart(analytics.lookupsOverTime);
  renderTierChart(analytics.tierBreakdown);
  renderCacheChart(analytics.cachePerformance);
  renderProviderChart(analytics.providerUsage);
}

/**
 * Render lookups over time chart
 */
function renderLookupsChart(data) {
  const ctx = document.getElementById('lookups-chart');

  // Destroy existing chart
  if (charts.lookups) {
    charts.lookups.destroy();
  }

  charts.lookups = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Free Lookups',
          data: data.free,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4
        },
        {
          label: 'Premium Lookups',
          data: data.premium,
          borderColor: '#6c757d',
          backgroundColor: 'rgba(108, 117, 125, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * Render tier breakdown chart
 */
function renderTierChart(data) {
  const ctx = document.getElementById('tier-chart');

  if (charts.tier) {
    charts.tier.destroy();
  }

  charts.tier = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Free', 'Premium'],
      datasets: [{
        data: [data.free, data.premium],
        backgroundColor: ['#007bff', '#6c757d']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

/**
 * Render cache performance chart
 */
function renderCacheChart(data) {
  const ctx = document.getElementById('cache-chart');

  if (charts.cache) {
    charts.cache.destroy();
  }

  charts.cache = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cache Hits', 'Cache Misses'],
      datasets: [{
        label: 'Count',
        data: [data.hits, data.misses],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * Render provider usage chart
 */
function renderProviderChart(data) {
  const ctx = document.getElementById('provider-chart');

  if (charts.provider) {
    charts.provider.destroy();
  }

  const labels = data.map(p => p.provider);
  const values = data.map(p => p.count);
  const colors = ['#007bff', '#6c757d', '#28a745', '#ffc107', '#dc3545'];

  charts.provider = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

/**
 * Render popular postcodes table
 */
function renderPopularPostcodes(postcodes) {
  $('#loading-postcodes').css('display', 'none');

  if (!postcodes || postcodes.length === 0) {
    $('#popular-postcodes-table').html('<p class="text-gray-500" style="text-align: center; padding: 2rem;">No data available</p>');
    $('#popular-postcodes-table').css('display', 'block');
    return;
  }

  const tableHtml = `
    <thead>
      <tr>
        <th>Rank</th>
        <th>Postcode</th>
        <th>Lookups</th>
        <th>Free</th>
        <th>Premium</th>
        <th>Cache Hit Rate</th>
      </tr>
    </thead>
    <tbody>
      ${postcodes.map((pc, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${DOMPurify.sanitize(pc.postcode)}</strong></td>
          <td>${pc.count.toLocaleString()}</td>
          <td>${pc.free.toLocaleString()}</td>
          <td>${pc.premium.toLocaleString()}</td>
          <td>
            <span class="badge ${pc.cacheHitRate > 50 ? 'badge-success' : 'badge-secondary'}">
              ${pc.cacheHitRate.toFixed(1)}%
            </span>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  $('#popular-postcodes-table').html(tableHtml);
  $('#popular-postcodes-table').css('display', 'table');
}

/**
 * Render errors table
 */
function renderErrors(errors) {
  $('#loading-errors').css('display', 'none');

  if (!errors || errors.length === 0) {
    $('#errors-table').css('display', 'none');
    $('#no-errors').css('display', 'block');
    return;
  }

  $('#no-errors').css('display', 'none');

  const tableHtml = `
    <thead>
      <tr>
        <th>Date</th>
        <th>User</th>
        <th>Postcode</th>
        <th>Provider</th>
        <th>Error</th>
      </tr>
    </thead>
    <tbody>
      ${errors.map(err => `
        <tr>
          <td>${formatDate(err.createdAt)}</td>
          <td>${DOMPurify.sanitize(err.userEmail)}</td>
          <td>${DOMPurify.sanitize(err.postcode || '-')}</td>
          <td>${DOMPurify.sanitize(err.provider || '-')}</td>
          <td><span class="text-danger">${DOMPurify.sanitize(err.error)}</span></td>
        </tr>
      `).join('')}
    </tbody>
  `;

  $('#errors-table').html(tableHtml);
  $('#errors-table').css('display', 'table');
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
