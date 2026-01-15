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
  // 2. Load Settings and User Profile
  // ============================================
  let currentSettings = null;
  let currentUser = null;

  async function loadSettings() {
    try {
      const response = await Domma.http.get(`${apiUrl}/admin/self/settings`, {
        headers: AdminAuth.getAuthHeaders()
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to load settings');
      }

      currentSettings = response.data;

      // Get current user info (includes email and name from User model)
      currentUser = Domma.auth.getUser();

      populateForms(currentSettings, currentUser);

      // Check for pending email change
      await checkPendingEmailChange();

      console.log('[Admin Settings] Loaded successfully:', currentSettings);
    } catch (error) {
      console.error('[Admin Settings] Failed to load:', error);
      Domma.elements.toast('Error loading settings: ' + error.message, { type: 'error' });
    }
  }

  /**
   * Check if there's a pending email change and show verification section
   */
  async function checkPendingEmailChange() {
    try {
      const response = await Domma.http.get(`${apiUrl}/admin/self/email/pending`, {
        headers: AdminAuth.getAuthHeaders()
      });

      if (response.success && response.data.hasPending) {
        showVerificationSection(response.data.pendingEmail, response.data.expiresAt);
        Domma.elements.toast(
          'You have a pending email verification. Please check your email for the 8-digit code.',
          { type: 'info', duration: 7000 }
        );
      } else if (response.success && response.data.expired) {
        Domma.elements.toast(
          'Your previous email verification code has expired. Please request a new one.',
          { type: 'warning', duration: 5000 }
        );
      }
    } catch (error) {
      console.error('[Admin Settings] Failed to check pending email:', error);
      // Don't show error toast - this is a background check
    }
  }

  // ============================================
  // 3. Populate Forms
  // ============================================
  function populateForms(settings, user) {
    // User model fields (email, name)
    if (user) {
      $('#name').val(DOMPurify.sanitize(user.name || ''));
      $('#email').val(DOMPurify.sanitize(user.email || ''));
    }

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

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const profileData = {
      displayName: $('#displayName').val().trim(),
      phone: $('#phone').val().trim(),
      bio: $('#bio').val().trim(),
      location: $('#location').val().trim(),
      website: $('#website').val().trim()
    };

    // Track if any updates were successful
    let anySuccess = false;

    // Update name if changed
    if (name && name !== currentUser.name) {
      try {
        const response = await Domma.http.patch(
          `${apiUrl}/admin/self/profile`,
          { name },
          { headers: AdminAuth.getAuthHeaders() }
        );

        if (response.success) {
          currentUser.name = name;
          Domma.elements.toast('Name updated successfully!', { type: 'success', duration: 3000 });
          anySuccess = true;
        }
      } catch (error) {
        console.error('[Admin Settings] Failed to update name:', error);
        Domma.elements.toast('Error updating name: ' + error.message, { type: 'error', duration: 5000 });
      }
    }

    // Request email change if changed
    if (email && email !== currentUser.email) {
      const confirmed = await Domma.elements.confirm(
        `Are you sure you want to change your email to "${email}"? You will receive an 8-digit verification code at the new address.`,
        {
          title: 'Confirm Email Change',
          confirmText: 'Send Verification Code',
          cancelText: 'Cancel',
          confirmButtonClass: 'btn-warning'
        }
      );

      if (confirmed) {
        try {
          const response = await Domma.http.post(
            `${apiUrl}/admin/self/email/change`,
            { newEmail: email },
            { headers: AdminAuth.getAuthHeaders() }
          );

          if (response.success) {
            // Show verification code input section
            showVerificationSection(email, response.data?.expiresAt);

            Domma.elements.toast(response.message || 'Verification code sent!', { type: 'info', duration: 5000 });
            anySuccess = true;
          }
        } catch (error) {
          console.error('[Admin Settings] Failed to request email change:', error);
          Domma.elements.toast('Error requesting email change: ' + error.message, { type: 'error', duration: 5000 });
        }
      }
    }

    // Update profile settings (displayName, phone, bio, etc.)
    await updateSection('profile', profileData);
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
  // 6. Email Verification Code Handling
  // ============================================

  /**
   * Show the verification code input section
   */
  function showVerificationSection(pendingEmail, expiresAt) {
    $('#email-verification-section').show();
    $('#pending-email').text(pendingEmail);

    // Format expiry time
    if (expiresAt) {
      const expiry = new Date(expiresAt);
      const formatted = Domma.dates(expiry).format('DD/MM/YYYY HH:mm');
      $('#code-expiry').text(formatted);
    }

    // Focus on code input
    $('#verification-code').focus();
  }

  /**
   * Hide the verification code input section
   */
  function hideVerificationSection() {
    $('#email-verification-section').hide();
    $('#verification-code').val('');
    $('#pending-email').text('');
    $('#code-expiry').text('');
  }

  /**
   * Handle verification code submission
   */
  $('#verify-code-btn').on('click', async () => {
    const code = $('#verification-code').val().trim().toUpperCase();

    // Validate code format
    if (!code || !/^[A-F0-9]{8}$/i.test(code)) {
      Domma.elements.toast('Please enter a valid 8-character verification code', {
        type: 'error',
        duration: 4000
      });
      return;
    }

    try {
      const response = await Domma.http.post(
        `${apiUrl}/admin/self/email/verify`,
        { code },
        { headers: AdminAuth.getAuthHeaders() }
      );

      if (response.success) {
        const { oldEmail, newEmail } = response.data || {};

        Domma.elements.toast(
          `Email successfully changed from ${oldEmail} to ${newEmail}!`,
          { type: 'success', duration: 5000 }
        );

        // Update current user email
        currentUser.email = newEmail;
        $('#email').val(newEmail);

        // Hide verification section
        hideVerificationSection();

        // Reload settings to get fresh data
        await loadSettings();
      }
    } catch (error) {
      console.error('[Admin Settings] Failed to verify code:', error);

      // Handle specific error cases
      let errorMessage = error.message || 'Failed to verify code';

      if (error.message?.includes('Invalid code format')) {
        errorMessage = 'Invalid code format. Please enter 8 hexadecimal characters.';
      } else if (error.message?.includes('expired')) {
        errorMessage = 'Verification code has expired. Please request a new one.';
        hideVerificationSection();
      } else if (error.message?.includes('not found')) {
        errorMessage = 'Verification code not found or already used.';
        hideVerificationSection();
      } else if (error.message?.includes('Rate limit')) {
        errorMessage = 'Too many attempts. Please wait 15 minutes and try again.';
      }

      Domma.elements.toast(errorMessage, {
        type: 'error',
        duration: 6000
      });
    }
  });

  /**
   * Allow pressing Enter to submit verification code
   */
  $('#verification-code').on('keypress', (e) => {
    if (e.which === 13) { // Enter key
      e.preventDefault();
      $('#verify-code-btn').click();
    }
  });

  // ============================================
  // 7. Initialize Collapsible Cards
  // ============================================
  $('[data-collapsible="true"]').each(function() {
    Domma.elements.card(this, {
      collapsible: true
    });
  });

  // ============================================
  // 8. Initialize
  // ============================================
  loadSettings();

  // Scan for icons
  if (Domma.icons) {
    Domma.icons.scan();
  }
});
