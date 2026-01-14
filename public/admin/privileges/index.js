/**
 * Admin Privileges Page
 * Manage admin's own privileges
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
  AdminSidebar.init('privileges', apiUrl);

  // ============================================
  // 2. Load Privileges
  // ============================================
  let privileges = [];

  async function loadPrivileges() {
    try {
      $('#privileges-loading').show();
      $('#privileges-list').hide();
      $('#privileges-empty').hide();

      const response = await Domma.http.get(`${apiUrl}/admin/self/privileges`, {
        headers: AdminAuth.getAuthHeaders()
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to load privileges');
      }

      privileges = response.data;
      renderPrivileges(privileges);

      console.log('[Admin Privileges] Loaded successfully:', privileges);
    } catch (error) {
      console.error('[Admin Privileges] Failed to load:', error);
      Domma.elements.toast('Error loading privileges: ' + error.message, { type: 'error' });
      $('#privileges-loading').hide();
      $('#privileges-empty').show();
    }
  }

  // ============================================
  // 3. Render Privileges List
  // ============================================
  function renderPrivileges(privilegesList) {
    $('#privileges-loading').hide();

    if (privilegesList.length === 0) {
      $('#privileges-empty').show();
      $('#privileges-list').hide();
      return;
    }

    $('#privileges-empty').hide();
    $('#privileges-list').show();

    const html = privilegesList.map(priv => {
      const isActive = priv.isActive && (!priv.expiresAt || new Date(priv.expiresAt) > new Date());
      const statusClass = isActive ? 'badge-success' : 'badge-secondary';
      const statusText = isActive ? 'Active' : 'Expired';

      const expiryText = priv.expiresAt
        ? `Expires: ${D(priv.expiresAt).format('DD MMM YYYY HH:mm')}`
        : 'Permanent';

      const grantedText = `Granted: ${D(priv.grantedAt).format('DD MMM YYYY HH:mm')}`;

      return `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h4 class="mb-2">
                  <span data-icon="key" data-icon-size="20"></span>
                  <code class="bg-gray-100 px-2 py-1 rounded">${DOMPurify.sanitize(priv.privilege)}</code>
                </h4>
                <p class="text-muted mb-2">
                  <small>
                    <span data-icon="clock" data-icon-size="14"></span> ${grantedText}<br>
                    <span data-icon="calendar" data-icon-size="14"></span> ${expiryText}
                  </small>
                </p>
                ${priv.reason ? `<p class="text-sm"><strong>Reason:</strong> ${DOMPurify.sanitize(priv.reason)}</p>` : ''}
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge ${statusClass}">${statusText}</span>
                ${isActive ? `
                  <button class="btn btn-sm btn-danger revoke-btn" data-privilege="${DOMPurify.sanitize(priv.privilege)}">
                    <span data-icon="trash" data-icon-size="16"></span> Revoke
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $('#privileges-list').html(html);

    // Attach revoke handlers using event delegation
    $('#privileges-list').on('click', '.revoke-btn', function() {
      const privilege = $(this).data('privilege');
      confirmRevoke(privilege);
    });

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  // ============================================
  // 4. Grant Privilege Form
  // ============================================
  $('#grant-privilege-form').on('submit', async (e) => {
    e.preventDefault();

    const privilege = $('#privilege').val().trim();
    const expiresAt = $('#expiresAt').val() || null;
    const reason = $('#reason').val().trim();

    if (reason.length < 10) {
      Domma.elements.toast('Reason must be at least 10 characters', { type: 'warning' });
      return;
    }

    try {
      const payload = {
        privilege,
        reason
      };

      if (expiresAt) {
        payload.expiresAt = new Date(expiresAt).toISOString();
      }

      const response = await Domma.http.post(
        `${apiUrl}/admin/self/privileges`,
        payload,
        {
          headers: AdminAuth.getAuthHeaders()
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to grant privilege');
      }

      Domma.elements.toast(`Privilege "${privilege}" granted successfully!`, {
        type: 'success',
        duration: 3000
      });

      // Reset form
      $('#grant-privilege-form')[0].reset();

      // Reload privileges
      await loadPrivileges();
      await loadActivity();

      console.log('[Admin Privileges] Granted:', response.data);
    } catch (error) {
      console.error('[Admin Privileges] Failed to grant:', error);
      Domma.elements.toast('Error: ' + error.message, {
        type: 'error',
        duration: 5000
      });
    }
  });

  // ============================================
  // 5. Revoke Privilege
  // ============================================
  async function confirmRevoke(privilege) {
    const confirmed = await Domma.elements.confirm(
      `Are you sure you want to revoke the privilege "${privilege}"?`,
      {
        title: 'Confirm Revoke',
        confirmText: 'Revoke',
        cancelText: 'Cancel',
        confirmButtonClass: 'btn-danger'
      }
    );

    if (!confirmed) return;

    try {
      const response = await Domma.http.delete(
        `${apiUrl}/admin/self/privileges/${privilege}`,
        {
          headers: AdminAuth.getAuthHeaders()
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to revoke privilege');
      }

      Domma.elements.toast(`Privilege "${privilege}" revoked successfully!`, {
        type: 'success',
        duration: 3000
      });

      // Reload privileges
      await loadPrivileges();
      await loadActivity();

      console.log('[Admin Privileges] Revoked:', privilege);
    } catch (error) {
      console.error('[Admin Privileges] Failed to revoke:', error);
      Domma.elements.toast('Error: ' + error.message, {
        type: 'error',
        duration: 5000
      });
    }
  }

  // ============================================
  // 6. Load Activity Log
  // ============================================
  async function loadActivity() {
    try {
      $('#activity-loading').show();
      $('#activity-list').hide();
      $('#activity-empty').hide();

      const response = await Domma.http.get(`${apiUrl}/admin/self/activity`, {
        headers: AdminAuth.getAuthHeaders(),
        params: {
          page: 1,
          limit: 10,
          type: 'privilege_self_grant,privilege_self_revoke'
        }
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to load activity');
      }

      renderActivity(response.data.activities);

      console.log('[Admin Privileges] Activity loaded:', response.data);
    } catch (error) {
      console.error('[Admin Privileges] Failed to load activity:', error);
      $('#activity-loading').hide();
      $('#activity-empty').show();
    }
  }

  // ============================================
  // 7. Render Activity List
  // ============================================
  function renderActivity(activities) {
    $('#activity-loading').hide();

    if (activities.length === 0) {
      $('#activity-empty').show();
      $('#activity-list').hide();
      return;
    }

    $('#activity-empty').hide();
    $('#activity-list').show();

    const html = activities.map(activity => {
      const typeIcon = activity.type === 'privilege_self_grant' ? 'plus' : 'trash';
      const typeClass = activity.type === 'privilege_self_grant' ? 'text-success' : 'text-danger';

      return `
        <div class="d-flex gap-3 mb-3 pb-3 border-bottom">
          <div class="${typeClass}">
            <span data-icon="${typeIcon}" data-icon-size="20"></span>
          </div>
          <div class="flex-1">
            <p class="mb-1"><strong>${DOMPurify.sanitize(activity.description)}</strong></p>
            <p class="text-muted mb-0">
              <small>
                <span data-icon="clock" data-icon-size="14"></span> ${D(activity.createdAt).fromNow()}
                (${D(activity.createdAt).format('DD MMM YYYY HH:mm')})
              </small>
            </p>
          </div>
        </div>
      `;
    }).join('');

    $('#activity-list').html(html);

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
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
  loadPrivileges();
  loadActivity();

  // Scan for icons
  if (Domma.icons) {
    Domma.icons.scan();
  }
});
