/**
 * Admin Dashboard JavaScript
 * Handles statistics, analytics, and user management
 */

$(() => {
  // ============================================
  // 1. Initialize Domma.auth
  // ============================================
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiUrl = isLocal ? 'http://localhost:3000/api' : '/api';

  console.log('[Admin] Initializing with API URL:', apiUrl);
  Domma.auth.init({apiUrl});

  // Debug: Check auth state
  console.log('[Admin] Auth state:', {
    token: Domma.auth.token ? 'Present' : 'Missing',
    user: Domma.auth.user,
    isAdmin: Domma.auth.isAdmin()
  });

  // ============================================
  // 2. Check Admin Role
  // ============================================
  if (!Domma.auth.isAdmin()) {
    console.warn('[Admin] Access denied - not an admin user');
    Domma.elements.alert('Access Denied. Admin privileges required.\n\nPlease log in as an admin user first.')
      .then(() => {
        window.location.href = '../index.html';
      });
    return;
  }

  console.log('[Admin] Access granted - user is admin');

  // ============================================
  // 3. Fetch Statistics
  // ============================================
  let statsData = null;

  async function loadStats() {
    try {
      console.log('[Admin] Loading stats from:', `${apiUrl}/admin/stats`);
      const response = await Domma.http.get(`${apiUrl}/admin/stats`, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
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
  // 4. Render Statistics Cards
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
  // 5. Fetch Analytics
  // ============================================
  let analyticsData = null;

  async function loadAnalytics() {
    try {
      console.log('[Admin] Loading analytics from:', `${apiUrl}/admin/analytics`);
      const response = await Domma.http.get(`${apiUrl}/admin/analytics`, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
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
  // 6. Render Analytics Stats
  // ============================================
  function renderAnalyticsStats(data) {
    $('#stat-today-pageviews').text(data.todayPageViews);
    $('#stat-today-sessions').text(data.todaySessions);
  }

  // ============================================
  // 7. Render Signup Trend Chart
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
  // 8. Render Page View Chart
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
  // 9. Render Top Pages Table
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
  // 10. Users Table with Domma.tables
  // ============================================
  let usersTable = null;
  let currentPage = 1;
  let searchQuery = '';
  let roleFilter = '';

  async function loadUsers() {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 25,
        sort: 'created_at:desc'
      });

      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter) params.append('role', roleFilter);

      console.log('[Admin] Loading users from:', `${apiUrl}/admin/users?${params}`);
      const response = await Domma.http.get(`${apiUrl}/admin/users?${params}`, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
      });

      console.log('[Admin] Users response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
      }

      // Transform data for table
      const tableData = response.data.users.map(user => {
        console.log('[Admin] Transforming user:', user);
        return {
          id: user.id,
          email: user.email,
          name: user.name || '-',
          role: user.role,
          created_at: user.created_at ? Domma.dates(user.created_at).format('DD MMM YYYY') : '-',
          stats: user.stats ? `${user.stats.documents || 0}D / ${user.stats.invoices || 0}I / ${user.stats.vehicles || 0}V` : '-',
          actions: user.id
        };
      });

      console.log('[Admin] Transformed table data:', tableData);

      if (!usersTable) {
        // Create table
        console.log('[Admin] Creating users table with', tableData.length, 'rows');

        try {
          usersTable = Domma.tables.create('#users-table', {
            data: tableData,
            columns: [
              {key: 'id', title: 'ID', sortable: true, width: '60px'},
              {key: 'email', title: 'Email', sortable: true},
              {key: 'name', title: 'Name', sortable: true},
              {
                key: 'role',
                title: 'Role',
                sortable: true,
                render: (value) => {
                  const badgeClass = {
                    admin: 'badge-danger',
                    subscriber: 'badge-primary',
                    guest: 'badge-secondary'
                  }[value] || 'badge-secondary';
                  return `<span class="badge ${badgeClass}">${_.capitalize(value)}</span>`;
                }
              },
              {key: 'created_at', title: 'Joined', sortable: true},
              {key: 'stats', title: 'Content', sortable: false},
              {
                key: 'actions',
                title: 'Actions',
                sortable: false,
                render: (userId) => `
                  <button class="btn btn-sm btn-primary change-role-btn" data-user-id="${userId}">
                    Change Role
                  </button>
                `
              }
            ],
            pagination: true,
            pageSize: 25,
            striped: true,
            selectable: true,
            selectionMode: 'multiple',
            exportPanel: true,
            exportOptions: ['text', 'csv', 'excel', 'json'],
            columnToggle: true,
            regexSearch: true
          });

          console.log('[Admin] Users table created successfully:', usersTable);
        } catch (error) {
          console.error('[Admin] Failed to create users table:', error);
          throw error;
        }

        // Handle action buttons
        $('body').on('click', '.change-role-btn', function () {
          const userId = $(this).attr('data-user-id');
          showRoleModal(userId);
        });
      } else {
        usersTable.setData(tableData);
      }
    } catch (error) {
      console.error('[Admin] Failed to load users:', error);
      Domma.elements.toast('Error loading users: ' + error.message, {type: 'error'});
    }
  }

  // ============================================
  // 11. Role Change
  // ============================================
  async function showRoleModal(userId) {
    console.log('[Admin] Opening role modal for user ID:', userId);

    // Find user in table data
    const tableData = usersTable.getData();
    const user = tableData.find(u => u.id == userId);

    if (!user) {
      console.error('[Admin] User not found in table data');
      return;
    }

    console.log('[Admin] Found user:', user);

    // Show confirm dialog with user's current role
    const confirmed = await Domma.elements.confirm(
      `Change role for ${user.email}?\n\nCurrent role: ${_.capitalize(user.role)}\n\nSelect new role:`,
      {
        title: 'Change User Role',
        confirmText: 'Update Role',
        cancelText: 'Cancel'
      }
    );

    if (!confirmed) {
      console.log('[Admin] Role change cancelled');
      return;
    }

    // Ask which role to assign (using button group approach)
    const roles = ['guest', 'subscriber', 'admin'];
    const roleLabels = roles.map(r => _.capitalize(r));

    const roleChoice = await Domma.elements.prompt(
      `Select new role for ${user.email}:`,
      {
        title: 'Select Role',
        inputPlaceholder: 'Enter: guest, subscriber, or admin',
        inputValue: user.role
      }
    );

    if (!roleChoice || !roles.includes(roleChoice.toLowerCase())) {
      Domma.elements.toast('Invalid role selected', {type: 'error'});
      return;
    }

    const newRole = roleChoice.toLowerCase();

    console.log('[Admin] Updating user', userId, 'to role', newRole);

    try {
      const response = await Domma.http.patch(
        `${apiUrl}/admin/users/${userId}/role`,
        {role: newRole},
        {headers: {Authorization: `Bearer ${Domma.auth.token}`}}
      );

      console.log('[Admin] Role update response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update role');
      }

      Domma.elements.toast('Role updated successfully!', {type: 'success'});
      loadUsers(); // Refresh table
    } catch (error) {
      console.error('[Admin] Failed to update role:', error);
      Domma.elements.toast('Error: ' + error.message, {type: 'error'});
    }
  }

  // ============================================
  // 12. Search and Filter
  // ============================================
  const searchDebounced = _.debounce(() => {
    searchQuery = $('#user-search').val().trim();
    currentPage = 1;
    loadUsers();
  }, 500);

  $('#user-search').on('input', searchDebounced);

  $('#role-filter').on('change', () => {
    roleFilter = $('#role-filter').val();
    currentPage = 1;
    loadUsers();
  });

  $('#refresh-users').on('click', () => {
    loadUsers();
    loadStats();
    loadAnalytics();
  });

  // ============================================
  // 13. Initialize
  // ============================================
  loadStats();
  loadAnalytics();
  loadUsers();
});
