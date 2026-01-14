/**
 * Admin Settings Page
 * Manage admin's own settings and preferences
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
  AdminSidebar.init('settings', apiUrl);

  // ============================================
  // 2. Load Settings
  // ============================================
  let currentSettings = null;

  async function loadSettings() {
    try {
      const response = await Domma.http.get(`${apiUrl}/admin/self/settings`, {
        headers: AdminAuth.getAuthHeaders()
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to load settings');
      }

      currentSettings = response.data;
      populateForms(currentSettings);

      console.log('[Admin Settings] Loaded successfully:', currentSettings);
    } catch (error) {
      console.error('[Admin Settings] Failed to load:', error);
      Domma.elements.toast('Error loading settings: ' + error.message, { type: 'error' });
    }
  }

  // ============================================
  // 3. Populate Forms
  // ============================================
  function populateForms(settings) {
    // Profile - sanitize all user input
    if (settings.profile) {
      $('#displayName').val(DOMPurify.sanitize(settings.profile.displayName || ''));
      $('#phone').val(DOMPurify.sanitize(settings.profile.phone || ''));
      $('#bio').val(DOMPurify.sanitize(settings.profile.bio || ''));
      $('#location').val(DOMPurify.sanitize(settings.profile.location || ''));
      $('#website').val(DOMPurify.sanitize(settings.profile.website || ''));
    }

    // Preferences
    if (settings.preferences) {
      $('#theme').val(settings.preferences.theme || 'system');
      $('#language').val(settings.preferences.language || 'en-GB');
      $('#timezone').val(settings.preferences.timezone || 'Europe/London');
      $('#timeFormat').val(settings.preferences.timeFormat || '24h');
      $('#dateFormat').val(settings.preferences.dateFormat || 'DD/MM/YYYY');
    }

    // Notifications
    if (settings.notifications) {
      $('#emailEnabled').prop('checked', settings.notifications.email?.enabled !== false);
      $('#emailMarketing').prop('checked', settings.notifications.email?.marketing === true);
      $('#emailProductUpdates').prop('checked', settings.notifications.email?.productUpdates !== false);
      $('#emailSecurityAlerts').prop('checked', settings.notifications.email?.securityAlerts !== false);

      $('#pushEnabled').prop('checked', settings.notifications.push?.enabled === true);
      $('#pushDocumentUpdates').prop('checked', settings.notifications.push?.documentUpdates !== false);
      $('#pushMentions').prop('checked', settings.notifications.push?.mentions !== false);
    }

    // Privacy
    if (settings.privacy) {
      $('#showEmail').prop('checked', settings.privacy.showEmail === true);
      $('#showActivity').prop('checked', settings.privacy.showActivity === true);
      $('#analyticsOptOut').prop('checked', settings.privacy.analyticsOptOut === true);
      $('#allowDataExport').prop('checked', settings.privacy.allowDataExport !== false);
      $('#dataRetentionDays').val(settings.privacy.dataRetentionDays || 90);
    }
  }

  // ============================================
  // 4. Form Submission Handlers
  // ============================================

  // Profile Form
  $('#profile-form').on('submit', async (e) => {
    e.preventDefault();

    const formData = {
      displayName: $('#displayName').val().trim(),
      phone: $('#phone').val().trim(),
      bio: $('#bio').val().trim(),
      location: $('#location').val().trim(),
      website: $('#website').val().trim()
    };

    await updateSection('profile', formData);
  });

  // Preferences Form
  $('#preferences-form').on('submit', async (e) => {
    e.preventDefault();

    const formData = {
      theme: $('#theme').val(),
      language: $('#language').val(),
      timezone: $('#timezone').val(),
      timeFormat: $('#timeFormat').val(),
      dateFormat: $('#dateFormat').val()
    };

    await updateSection('preferences', formData);
  });

  // Notifications Form
  $('#notifications-form').on('submit', async (e) => {
    e.preventDefault();

    const formData = {
      email: {
        enabled: $('#emailEnabled').is(':checked'),
        marketing: $('#emailMarketing').is(':checked'),
        productUpdates: $('#emailProductUpdates').is(':checked'),
        securityAlerts: $('#emailSecurityAlerts').is(':checked')
      },
      push: {
        enabled: $('#pushEnabled').is(':checked'),
        documentUpdates: $('#pushDocumentUpdates').is(':checked'),
        mentions: $('#pushMentions').is(':checked')
      }
    };

    await updateSection('notifications', formData);
  });

  // Privacy Form
  $('#privacy-form').on('submit', async (e) => {
    e.preventDefault();

    const formData = {
      showEmail: $('#showEmail').is(':checked'),
      showActivity: $('#showActivity').is(':checked'),
      analyticsOptOut: $('#analyticsOptOut').is(':checked'),
      allowDataExport: $('#allowDataExport').is(':checked'),
      dataRetentionDays: parseInt($('#dataRetentionDays').val())
    };

    await updateSection('privacy', formData);
  });

  // ============================================
  // 5. Update Section API Call
  // ============================================
  async function updateSection(section, data) {
    try {
      const response = await Domma.http.patch(
        `${apiUrl}/admin/self/settings/${section}`,
        data,
        {
          headers: AdminAuth.getAuthHeaders()
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to update settings');
      }

      currentSettings = response.data;
      Domma.elements.toast(`${_.capitalize(section)} settings updated successfully!`, {
        type: 'success',
        duration: 3000
      });

      console.log(`[Admin Settings] Updated ${section}:`, data);
    } catch (error) {
      console.error(`[Admin Settings] Failed to update ${section}:`, error);
      Domma.elements.toast(`Error updating ${section}: ` + error.message, {
        type: 'error',
        duration: 5000
      });
    }
  }

  // ============================================
  // 6. Initialize Collapsible Cards
  // ============================================
  $('[data-collapsible="true"]').each(function() {
    Domma.elements.card(this, {
      collapsible: true
    });
  });

  // ============================================
  // 7. Initialize
  // ============================================
  loadSettings();

  // Scan for icons
  if (Domma.icons) {
    Domma.icons.scan();
  }
});
