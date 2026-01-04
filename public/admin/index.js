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
  // 13. Email Management
  // ============================================
  let emailData = [];
  let filteredEmailData = [];
  let currentEmailPage = 1;
  const emailsPerPage = 20;
  let emailSearchQuery = '';
  let emailStatusFilter = '';
  let emailTypeFilter = '';
  let emailDateFilter = '';

  async function loadEmailStats() {
    try {
      const response = await Domma.http.get(`${apiUrl}/emails/stats`, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
      });

      if (response.success) {
        const {stats} = response.data;
        let totalEmails = 0;
        let contactEmails = 0;
        let sentEmails = 0;
        let failedEmails = 0;
        let pendingEmails = 0;

        stats.forEach(stat => {
          totalEmails += stat.total;
          if (stat._id === 'contact') {
            contactEmails = stat.total;
          }
          stat.stats.forEach(statusStat => {
            if (statusStat.status === 'sent') sentEmails += statusStat.count;
            if (statusStat.status === 'failed') failedEmails += statusStat.count;
            if (statusStat.status === 'pending') pendingEmails += statusStat.count;
          });
        });

        $('#stat-total-emails').text(totalEmails);
        $('#stat-contact-emails').text(contactEmails);
        $('#stat-pending-emails').text(pendingEmails);
        $('#stat-sent-emails').text(`${sentEmails} sent`);
        $('#stat-failed-emails').text(`${failedEmails} failed`);
      }
    } catch (error) {
      console.error('[Admin] Failed to load email stats:', error);
    }
  }

  async function loadEmails() {
    try {
      const params = new URLSearchParams({
        limit: 100, // Load more to handle client-side filtering
        offset: 0,
        type: emailTypeFilter || 'contact' // Default to contact emails
      });

      if (emailStatusFilter) params.append('status', emailStatusFilter);
      if (emailDateFilter) params.append('startDate', emailDateFilter);

      console.log('[Admin] Loading emails with params:', Object.fromEntries(params));

      const response = await Domma.http.get(`${apiUrl}/emails?${params}`, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
      });

      console.log('[Admin] Emails response:', response);

      if (response.success) {
        emailData = response.data || [];
        applyEmailFilters();
        renderEmailsTable();
        updateEmailPagination();
      }
    } catch (error) {
      console.error('[Admin] Failed to load emails:', error);
      Domma.elements.toast('Failed to load emails', {type: 'error'});
    }
  }

  function applyEmailFilters() {
    filteredEmailData = emailData.filter(email => {
      const searchMatch = !emailSearchQuery ||
        email.metadata?.contactName?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
        email.metadata?.contactEmail?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
        email.metadata?.contactCompany?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
        email.from?.email?.toLowerCase().includes(emailSearchQuery.toLowerCase());

      return searchMatch;
    });
  }

  function renderEmailsTable() {
    const startIndex = (currentEmailPage - 1) * emailsPerPage;
    const endIndex = startIndex + emailsPerPage;
    const pageEmails = filteredEmailData.slice(startIndex, endIndex);

    console.log('[Admin] Rendering emails table, pageEmails:', pageEmails);

    const tableData = pageEmails.map(email => {
      const contactInfo = {
        name: email.metadata?.contactName || email.from?.name || 'Unknown',
        email: email.metadata?.contactEmail || email.from?.email || '',
        company: email.metadata?.contactCompany || '',
        phone: email.metadata?.contactPhone || ''
      };

      const projectType = email.metadata?.projectType ?
        formatProjectType(email.metadata.projectType) : 'N/A';

      // Return plain text status for proper badge rendering
      const statusText = email.status || 'pending';
      const submitted = new Date(email.createdAt).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return {
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone || 'N/A',
        company: contactInfo.company || 'N/A',
        projectType: projectType,
        status: statusText,
        submitted: submitted,
        actions: 'View | Archive',
        emailId: email._id
      };
    });

    console.log('[Admin] Email table data:', tableData);

    // Destroy existing table if it exists and create new one
    const existingTable = Domma.tables.get('#emails-table');
    if (existingTable) {
      Domma.tables.destroy('#emails-table');
    }

    Domma.tables.create('#emails-table', {
      data: tableData,
      columns: [
        {key: 'name', title: 'Name', sortable: true},
        {key: 'email', title: 'Email', sortable: true},
        {key: 'phone', title: 'Phone'},
        {key: 'company', title: 'Company', sortable: true},
        {key: 'projectType', title: 'Project Type', sortable: true},
        {
          key: 'status', title: 'Status', sortable: true, renderer: (value) => {
            const statusMap = {
              pending: '<span class="badge badge-warning">Pending</span>',
              sent: '<span class="badge badge-success">Sent</span>',
              failed: '<span class="badge badge-danger">Failed</span>',
              delivered: '<span class="badge badge-success">Delivered</span>',
              read: '<span class="badge badge-info">Read</span>'
            };
            return statusMap[value] || `<span class="badge badge-secondary">${_.capitalize(value)}</span>`;
          }
        },
        {key: 'submitted', title: 'Submitted', sortable: true},
        {key: 'actions', title: 'Actions'}
      ],
      pagination: false,
      striped: true,
      responsive: true,
      exportPanel: true,
      exportOptions: ['text', 'csv', 'excel', 'json'],
      columnToggle: true,
      regexSearch: true
    });
  }

  function formatProjectType(type) {
    const types = {
      'legacy-modernisation': 'Legacy Modernisation',
      'greenfield': 'Greenfield Development',
      'consulting': 'Technical Consulting',
      'fractional-cto': 'Fractional CTO',
      'other': 'Other'
    };
    return types[type] || _.capitalize(type);
  }

  function formatEmailStatus(status) {
    const statusMap = {
      pending: '<span class="badge badge-warning">Pending</span>',
      sent: '<span class="badge badge-success">Sent</span>',
      failed: '<span class="badge badge-danger">Failed</span>',
      delivered: '<span class="badge badge-success">Delivered</span>',
      read: '<span class="badge badge-info">Read</span>'
    };
    return statusMap[status] || `<span class="badge badge-secondary">${_.capitalize(status)}</span>`;
  }

  function updateEmailPagination() {
    const totalEmails = filteredEmailData.length;
    const totalPages = Math.ceil(totalEmails / emailsPerPage);
    const startIndex = (currentEmailPage - 1) * emailsPerPage;
    const endIndex = Math.min(startIndex + emailsPerPage, totalEmails);

    $('#emails-info').text(`Showing ${startIndex + 1}-${endIndex} of ${totalEmails} emails`);

    $('#emails-prev').prop('disabled', currentEmailPage <= 1);
    $('#emails-next').prop('disabled', currentEmailPage >= totalPages);
  }

  // Email Actions
  window.viewEmailDetails = async function (emailId) {
    try {
      const response = await Domma.http.get(`${apiUrl}/emails/${emailId}`, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
      });

      if (response.success) {
        const email = response.data;
        const details = `
Subject: ${email.subject}

From: ${email.from.email}
To: ${email.to[0].email}
Status: ${_.capitalize(email.status)}
Created: ${new Date(email.createdAt).toLocaleString('en-GB')}

Project Details:
${email.metadata?.details || 'No details available'}
        `.trim();

        await Domma.elements.alert(details, {
          title: 'Email Details',
          size: 'large'
        });
      }
    } catch (error) {
      console.error('[Admin] Failed to load email details:', error);
      Domma.elements.toast('Failed to load email details', {type: 'error'});
    }
  };

  window.retryEmail = async function (emailId) {
    const confirmed = await Domma.elements.confirm('Retry sending this email?');
    if (!confirmed) return;

    try {
      const response = await Domma.http.post(`${apiUrl}/emails/${emailId}/retry`, {}, {
        headers: {Authorization: `Bearer ${Domma.auth.token}`}
      });

      if (response.success) {
        Domma.elements.toast('Email queued for retry', {type: 'success'});
        loadEmails();
        loadEmailStats();
      }
    } catch (error) {
      console.error('[Admin] Failed to retry email:', error);
      Domma.elements.toast('Failed to retry email', {type: 'error'});
    }
  };

  window.archiveEmail = async function (emailId) {
    const confirmed = await Domma.elements.confirm('Archive this email?');
    if (!confirmed) return;

    try {
      const response = await Domma.http.patch(`${apiUrl}/emails/${emailId}/archive`,
        {archived: true},
        {headers: {Authorization: `Bearer ${Domma.auth.token}`}}
      );

      if (response.success) {
        Domma.elements.toast('Email archived successfully', {type: 'success'});
        loadEmails();
        loadEmailStats();
      }
    } catch (error) {
      console.error('[Admin] Failed to archive email:', error);
      Domma.elements.toast('Failed to archive email', {type: 'error'});
    }
  };

  // Email Search and Filters
  const emailSearchDebounced = _.debounce(() => {
    emailSearchQuery = $('#email-search').val().trim();
    currentEmailPage = 1;
    applyEmailFilters();
    renderEmailsTable();
    updateEmailPagination();
  }, 500);

  $('#email-search').on('input', emailSearchDebounced);

  $('#email-status-filter').on('change', () => {
    emailStatusFilter = $('#email-status-filter').val();
    currentEmailPage = 1;
    loadEmails();
  });

  $('#email-type-filter').on('change', () => {
    emailTypeFilter = $('#email-type-filter').val();
    currentEmailPage = 1;
    loadEmails();
  });

  $('#email-date-filter').on('change', () => {
    emailDateFilter = $('#email-date-filter').val();
    currentEmailPage = 1;
    loadEmails();
  });

  $('#refresh-emails').on('click', () => {
    loadEmails();
    loadEmailStats();
  });

  // Email Pagination
  $('#emails-prev').on('click', () => {
    if (currentEmailPage > 1) {
      currentEmailPage--;
      renderEmailsTable();
      updateEmailPagination();
    }
  });

  $('#emails-next').on('click', () => {
    const totalPages = Math.ceil(filteredEmailData.length / emailsPerPage);
    if (currentEmailPage < totalPages) {
      currentEmailPage++;
      renderEmailsTable();
      updateEmailPagination();
    }
  });

  // ============================================
  // 14. Initialize Collapsible Cards
  // ============================================
  function initializeCollapsibleCards() {
    const cards = document.querySelectorAll('[data-collapsible="true"]');
    cards.forEach(card => {
      try {
        Domma.elements.card(card, {collapsible: true});
        console.log('[Admin] Initialized collapsible card:', card);
      } catch (error) {
        console.error('[Admin] Failed to initialize collapsible card:', error);
      }
    });
    console.log(`[Admin] Initialized ${cards.length} collapsible cards`);
  }

  // ============================================
  // 15. Initialize
  // ============================================
  initializeCollapsibleCards();
  loadStats();
  loadAnalytics();
  loadUsers();
  loadEmails();
  loadEmailStats();
});
