/**
 * Admin Dashboard JavaScript
 * Handles overview statistics, analytics, and charts
 */

import AdminSidebar from './shared/admin-sidebar.js';
import AdminAuth from './shared/admin-auth.js';

$(() => {
  // ============================================
  // 1. Initialise Authentication & Sidebar
  // ============================================
  const apiUrl = AdminAuth.getApiUrl();
  if (!AdminAuth.init(apiUrl)) {
    return; // Auth failed, user redirected
  }

  // Initialise sidebar with current section and API URL for badge counts
  AdminSidebar.init('overview', apiUrl);

  // ============================================
  // 2. Fetch Statistics
  // ============================================
  let statsData = null;

  async function loadStats() {
    try {
      console.log('[Admin] Loading stats from:', `${apiUrl}/admin/stats`);
      const response = await Domma.http.get(`${apiUrl}/admin/stats`, {
        headers: AdminAuth.getAuthHeaders()
      });

      console.log('[Admin] Stats response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to load stats');
      }

      statsData = response.data;
      console.log('[Admin] Stats data:', statsData);
      renderStats(statsData);
      renderSignupChart(statsData.signupTrend);
    } catch (error) {
      console.error('[Admin] Failed to load statistics:', error);
      Domma.elements.toast('Error loading statistics: ' + error.message, {type: 'error'});
    }
  }

  // ============================================
  // 3. Render Statistics Cards
  // ============================================
  function renderStats(data) {
    console.log('[Admin] Rendering stats to DOM elements');

    $('#stat-total-users').text(data.totalUsers);
    $('#stat-today-signups').text(data.todaySignups);
    $('#stat-month-signups').text(data.thisMonthSignups);

    $('#stat-role-admin').text(`${data.roleDistribution.admin || 0} admin`);
    $('#stat-role-subscriber').text(`${data.roleDistribution.subscriber || 0} subscriber`);
    $('#stat-role-guest').text(`${data.roleDistribution.guest || 0} guest`);

    $('#stat-documents').text(data.contentStats.totalDocuments);
    $('#stat-invoices').text(data.contentStats.totalInvoices);
    $('#stat-vehicles').text(data.contentStats.totalVehicles);

    console.log('[Admin] Stats rendered successfully');
  }

  // ============================================
  // 4. Fetch Analytics
  // ============================================
  let analyticsData = null;

  async function loadAnalytics() {
    try {
      console.log('[Admin] Loading analytics from:', `${apiUrl}/admin/analytics`);
      const response = await Domma.http.get(`${apiUrl}/admin/analytics`, {
        headers: AdminAuth.getAuthHeaders()
      });

      console.log('[Admin] Analytics response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to load analytics');
      }

      analyticsData = response.data;
      console.log('[Admin] Analytics data:', analyticsData);
      renderAnalyticsStats(analyticsData);
      renderPageViewChart(analyticsData.pageViewTrend);
      renderTopPagesTable(analyticsData.topPages);
    } catch (error) {
      console.error('[Admin] Failed to load analytics:', error);
      Domma.elements.toast('Error loading analytics: ' + error.message, {type: 'error'});
    }
  }

  // ============================================
  // 5. Render Analytics Stats
  // ============================================
  function renderAnalyticsStats(data) {
    $('#stat-today-pageviews').text(data.todayPageViews);
    $('#stat-today-sessions').text(data.todaySessions);
  }

  // ============================================
  // 6. Render Signup Trend Chart
  // ============================================
  let signupChart = null;

  function renderSignupChart(trendData) {
    const ctx = document.getElementById('signup-chart');
    if (!ctx) return;

    const labels = trendData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-GB', {month: 'short', day: 'numeric'});
    });

    const counts = trendData.map(d => d.count);

    if (signupChart) {
      signupChart.destroy();
    }

    signupChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Signups',
          data: counts,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {display: false}
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {stepSize: 1}
          }
        }
      }
    });
  }

  // ============================================
  // 7. Render Page View Chart
  // ============================================
  let pageViewChart = null;

  function renderPageViewChart(trendData) {
    const ctx = document.getElementById('pageview-chart');
    if (!ctx) return;

    const labels = trendData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-GB', {month: 'short', day: 'numeric'});
    });

    const counts = trendData.map(d => d.count);

    if (pageViewChart) {
      pageViewChart.destroy();
    }

    pageViewChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Page Views',
          data: counts,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {display: false}
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {stepSize: 1}
          }
        }
      }
    });
  }

  // ============================================
  // 8. Render Top Pages Table
  // ============================================
  let topPagesTable = null;

  function renderTopPagesTable(topPages) {
    console.log('[Admin] Rendering top pages, raw data:', topPages);

    const tableData = topPages.map(page => {
      console.log('[Admin] Page object keys:', Object.keys(page));
      return {
        path: page.path,
        views: page.views || page.COUNT || 0
      };
    });

    console.log('[Admin] Top pages table data:', tableData);

    if (!topPagesTable) {
      topPagesTable = Domma.tables.create('#top-pages-table', {
        data: tableData,
        columns: [
          {key: 'path', title: 'Page Path', sortable: true},
          {key: 'views', title: 'Views', sortable: true}
        ],
        pagination: false,
        striped: true,
        selectable: true,
        selectionMode: 'multiple',
        exportPanel: true,
        exportOptions: ['text', 'csv', 'excel', 'json'],
        columnToggle: true,
        regexSearch: true
      });
    } else {
      topPagesTable.setData(tableData);
    }
  }

  // ============================================
  // 9. Initialise Collapsible Cards
  // ============================================
  function initCollapsibleCards() {
    const cards = document.querySelectorAll('[data-collapsible="true"]');
    cards.forEach(card => {
      try {
        Domma.elements.card(card, {collapsible: true});
        console.log('[Admin] Initialised collapsible card:', card);
      } catch (error) {
        console.error('[Admin] Failed to initialise collapsible card:', error);
      }
    });
    console.log(`[Admin] Initialised ${cards.length} collapsible cards`);
  }

  // ============================================
  // 10. Initialise
  // ============================================
  initCollapsibleCards();
  loadStats();
  loadAnalytics();
});
