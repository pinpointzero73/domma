/**
 * Admin Impersonate User Page
 * Allow admins to temporarily assume another user's identity
 */

import AdminSidebar from '../shared/admin-sidebar.js';
import AdminAuth from '../shared/admin-auth.js';

$(() => {
  // ============================================
  // 1. Initialize Authentication & Sidebar
  // ============================================
  const apiUrl = AdminAuth.getApiUrl();
  if (!AdminAuth.init(apiUrl)) {
    return; // Auth failed, user redirected
  }

  // Initialize sidebar
  AdminSidebar.init('impersonate', apiUrl);

  // ============================================
  // 2. Check Current Impersonation Status
  // ============================================
  let currentStatus = null;

  async function checkStatus() {
    try {
      const response = await Domma.http.get(`${apiUrl}/admin/impersonate/status`, {
        headers: AdminAuth.getAuthHeaders()
      });

      if (response.success && response.data) {
        currentStatus = response.data;
        showStatusCard(currentStatus);
      } else {
        hideStatusCard();
      }

      console.log('[Admin Impersonate] Status checked:', currentStatus);
    } catch (error) {
      console.error('[Admin Impersonate] Failed to check status:', error);
      hideStatusCard();
    }
  }

  function showStatusCard(status) {
    // Check if we have the required data
    if (!status || !status.impersonatedUser) {
      console.warn('[Admin Impersonate] Invalid status data:', status);
      hideStatusCard();
      return;
    }

    const user = status.impersonatedUser;
    const admin = status.adminUser || {};
    const expiresAt = D(status.expiresAt);

    const html = `
      <div class="alert alert-warning mb-3">
        <span data-icon="shield-alert" data-icon-size="20"></span>
        <strong>You are currently impersonating:</strong>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="mb-2"><strong>User:</strong></p>
          <p class="mb-1"><span data-icon="user" data-icon-size="16"></span> ${DOMPurify.sanitize(user.name || user.email || 'Unknown')}</p>
          <p class="mb-1 text-muted"><small>${DOMPurify.sanitize(user.email || '')}</small></p>
          <p class="mb-0 text-muted"><small>Role: ${DOMPurify.sanitize(user.role || 'unknown')}</small></p>
        </div>
        <div>
          <p class="mb-2"><strong>Session Details:</strong></p>
          <p class="mb-1"><span data-icon="clock" data-icon-size="16"></span> Started: ${D(status.startedAt).format('DD MMM YYYY HH:mm')}</p>
          <p class="mb-1"><span data-icon="calendar" data-icon-size="16"></span> Expires: ${expiresAt.format('DD MMM YYYY HH:mm')}</p>
          <p class="mb-0"><span data-icon="user-check" data-icon-size="16"></span> Original Admin: ${DOMPurify.sanitize(admin.email || 'Unknown')}</p>
        </div>
      </div>
      <div class="mt-3">
        <p class="mb-1"><strong>Reason:</strong></p>
        <p class="text-muted">${DOMPurify.sanitize(status.reason || '')}</p>
      </div>
    `;

    $('#status-content').html(html);
    $('#status-card').show();
    $('#impersonate-card').hide();

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  function hideStatusCard() {
    $('#status-card').hide();
    $('#impersonate-card').show();
  }

  // ============================================
  // 3. Load Users for Selection
  // ============================================
  async function loadUsers() {
    try {
      const response = await Domma.http.get(`${apiUrl}/admin/users`, {
        headers: AdminAuth.getAuthHeaders(),
        params: {
          page: 1,
          limit: 1000, // Get all users
          role: 'subscriber,guest,editor' // Exclude admins
        }
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
      }

      const users = response.data.users || [];
      populateUserSelect(users);

      console.log('[Admin Impersonate] Loaded users:', users.length);
    } catch (error) {
      console.error('[Admin Impersonate] Failed to load users:', error);
      Domma.elements.toast('Error loading users: ' + error.message, { type: 'error' });
    }
  }

  function populateUserSelect(users) {
    const $select = $('#userId');

    // Clear existing options except the first placeholder option
    $select.find('option').each(function(index) {
      if (index > 0) {
        $(this).remove();
      }
    });

    users.forEach(user => {
      const userName = user.name || user.email || 'Unknown';
      const option = `<option value="${DOMPurify.sanitize(user._id)}">${DOMPurify.sanitize(userName)} (${DOMPurify.sanitize(user.email)}) - ${DOMPurify.sanitize(user.role)}</option>`;
      $select.append(option);
    });

    console.log('[Admin Impersonate] Populated user select with', users.length, 'users');
  }

  // ============================================
  // 4. Start Impersonation Form
  // ============================================
  $('#impersonate-form').on('submit', async (e) => {
    e.preventDefault();

    const userId = $('#userId').val();
    const reason = $('#reason').val().trim();

    if (!userId) {
      Domma.elements.toast('Please select a user to impersonate', { type: 'warning' });
      return;
    }

    if (reason.length < 10) {
      Domma.elements.toast('Reason must be at least 10 characters', { type: 'warning' });
      return;
    }

    // Confirm action
    const userName = $('#userId option:selected').text().split('(')[0].trim();
    const confirmed = await Domma.elements.confirm(
      `Are you sure you want to impersonate "${userName}"? This action will be logged.`,
      {
        title: 'Confirm Impersonation',
        confirmText: 'Start Impersonation',
        cancelText: 'Cancel',
        confirmButtonClass: 'btn-warning'
      }
    );

    if (!confirmed) return;

    try {
      const response = await Domma.http.post(
        `${apiUrl}/admin/impersonate/${userId}`,
        { reason },
        {
          headers: AdminAuth.getAuthHeaders()
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to start impersonation');
      }

      Domma.elements.toast(response.message || 'Impersonation started successfully!', {
        type: 'success',
        duration: 3000
      });

      // Store the new impersonation token
      const data = response.data;
      if (data.impersonationToken) {
        // Replace the current token with the impersonation token
        Domma.auth.setToken(data.impersonationToken);
      }

      // Show restrictions
      if (data.restrictions && data.restrictions.length > 0) {
        const restrictionsHtml = data.restrictions.map(r => `<li>${DOMPurify.sanitize(r)}</li>`).join('');
        Domma.elements.toast(
          `<div><strong>Session Restrictions:</strong><ul class="mt-2">${restrictionsHtml}</ul></div>`,
          { type: 'warning', duration: 8000 }
        );
      }

      // Reset form
      $('#impersonate-form')[0].reset();

      // Reload status and history
      await checkStatus();
      await loadHistory();

      console.log('[Admin Impersonate] Started:', response.data);
    } catch (error) {
      console.error('[Admin Impersonate] Failed to start:', error);
      Domma.elements.toast('Error: ' + error.message, {
        type: 'error',
        duration: 5000
      });
    }
  });

  // ============================================
  // 5. Restore Identity
  // ============================================
  $('#restore-btn').on('click', async () => {
    const confirmed = await Domma.elements.confirm(
      'Are you sure you want to restore your admin identity and end the current impersonation session?',
      {
        title: 'Confirm Restore',
        confirmText: 'Restore Identity',
        cancelText: 'Cancel',
        confirmButtonClass: 'btn-danger'
      }
    );

    if (!confirmed) return;

    try {
      const response = await Domma.http.post(
        `${apiUrl}/admin/impersonate/restore`,
        {},
        {
          headers: AdminAuth.getAuthHeaders()
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to restore identity');
      }

      Domma.elements.toast(response.message || 'Identity restored successfully!', {
        type: 'success',
        duration: 3000
      });

      // Update tokens
      const data = response.data;
      if (data.token) {
        Domma.auth.setToken(data.token);
      }
      if (data.refreshToken) {
        Domma.auth.setRefreshToken(data.refreshToken);
      }

      // Show session summary
      if (data.sessionSummary) {
        const summary = data.sessionSummary;
        Domma.elements.toast(
          `<div><strong>Session Summary:</strong><br>` +
          `Impersonated: ${DOMPurify.sanitize(summary.impersonatedUser)}<br>` +
          `Duration: ${DOMPurify.sanitize(summary.duration)}<br>` +
          `Actions: ${summary.actionsPerformed}</div>`,
          { type: 'info', duration: 5000 }
        );
      }

      // Reload status and history
      await checkStatus();
      await loadHistory();

      console.log('[Admin Impersonate] Restored:', response.data);
    } catch (error) {
      console.error('[Admin Impersonate] Failed to restore:', error);
      Domma.elements.toast('Error: ' + error.message, {
        type: 'error',
        duration: 5000
      });
    }
  });

  // ============================================
  // 6. Load Impersonation History
  // ============================================
  async function loadHistory() {
    try {
      $('#history-loading').show();
      $('#history-list').hide();
      $('#history-empty').hide();

      const response = await Domma.http.get(`${apiUrl}/admin/impersonate/history`, {
        headers: AdminAuth.getAuthHeaders(),
        params: {
          page: 1,
          limit: 20
        }
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to load history');
      }

      renderHistory(response.data.sessions);

      console.log('[Admin Impersonate] History loaded:', response.data);
    } catch (error) {
      console.error('[Admin Impersonate] Failed to load history:', error);
      $('#history-loading').hide();
      $('#history-empty').show();
    }
  }

  // ============================================
  // 7. Render History List
  // ============================================
  function renderHistory(sessions) {
    $('#history-loading').hide();

    if (!sessions || sessions.length === 0) {
      $('#history-empty').show();
      $('#history-list').hide();
      return;
    }

    $('#history-empty').hide();
    $('#history-list').show();

    const html = sessions.map(session => {
      const statusClass = session.isActive ? 'badge-warning' : 'badge-secondary';
      const statusText = session.isActive ? 'Active' : 'Ended';

      const duration = session.endedAt
        ? calculateDuration(session.startedAt, session.endedAt)
        : 'Ongoing';

      return `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-1">
                <h4 class="mb-2">
                  <span data-icon="user" data-icon-size="20"></span>
                  ${DOMPurify.sanitize(session.impersonatedUser.name)}
                  <span class="badge ${statusClass} ml-2">${statusText}</span>
                </h4>
                <p class="text-muted mb-2">
                  <small>
                    ${DOMPurify.sanitize(session.impersonatedUser.email)} (${DOMPurify.sanitize(session.impersonatedUser.role)})
                  </small>
                </p>
                <p class="text-sm mb-2">
                  <span data-icon="clock" data-icon-size="14"></span>
                  <strong>Started:</strong> ${D(session.startedAt).format('DD MMM YYYY HH:mm')}
                  (${D(session.startedAt).fromNow()})
                </p>
                ${session.endedAt ? `
                  <p class="text-sm mb-2">
                    <span data-icon="calendar" data-icon-size="14"></span>
                    <strong>Ended:</strong> ${D(session.endedAt).format('DD MMM YYYY HH:mm')}
                  </p>
                ` : ''}
                <p class="text-sm mb-2">
                  <strong>Duration:</strong> ${duration}
                  ${session.actionsCount ? ` | <strong>Actions:</strong> ${session.actionsCount}` : ''}
                </p>
                <p class="text-sm mb-0">
                  <strong>Reason:</strong> ${DOMPurify.sanitize(session.reason)}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $('#history-list').html(html);

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  // Helper function to calculate duration
  function calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const seconds = Math.floor((endDate - startDate) / 1000);

    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  }

  // ============================================
  // 8. Initialize Collapsible Cards
  // ============================================
  $('[data-collapsible="true"]').each(function() {
    Domma.elements.card(this, {
      collapsible: true
    });
  });

  // ============================================
  // 9. Initialize
  // ============================================
  checkStatus();
  loadUsers();
  loadHistory();

  // Scan for icons
  if (Domma.icons) {
    Domma.icons.scan();
  }
});
