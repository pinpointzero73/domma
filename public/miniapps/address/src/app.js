/**
 * Address Lookup MiniApp
 * UK Postcode lookup service with free and premium tiers
 */

import config from '../../shared/config.js';
import { lookupBlueprint, feedbackBlueprint, apiKeyBlueprint, saveAddressBlueprint, contactBlueprint } from './blueprints.js';
import preferences from './preferences.js';

// Import Web Components
import './components/bar-chart.js';
import './components/star-rating.js';
import './components/search-filter.js';

class AddressApp {
  constructor() {
    this.config = config;
    this.currentLookupResult = null;
    this.sidebar = null;
    this.stats = {
      todayLookups: 0,
      activeKeys: 0,
      savedCount: 0
    };
    this.init();
  }

  async init() {
    // Initialize Domma.auth
    Domma.auth.init({ apiUrl: this.config.apiUrl });

    // Set up auth event listeners
    Domma.auth.on('login', () => this.handleLogin());
    Domma.auth.on('register', () => this.handleLogin());
    Domma.auth.on('logout', () => this.handleLogout());
    Domma.auth.on('tokenExpired', () => this.handleTokenExpired());
    Domma.auth.on('error', (message) => {
      Domma.elements.toast(message, { type: 'error' });
    });

    // Check authentication status
    if (Domma.auth.isAuthenticated()) {
      await this.showApp();
    } else {
      this.showAuth();
    }

    // Set up event listeners
    this.setupEventListeners();

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  setupEventListeners() {
    // Logout button
    $('#logoutBtn').on('click', () => Domma.auth.logout());

    // Create API key button
    $('#createApiKeyBtn').on('click', () => this.showCreateApiKeyModal());

    // Save Current Address button
    $('#saveAddressBtn').on('click', async () => {
      if (!this.currentLookupResult) {
        Domma.elements.toast('No address to save', { type: 'warning' });
        return;
      }

      // Switch to saved section and trigger save
      this.switchSection('saved');
      await this.showSaveAddressModal(this.currentLookupResult.data.postcode);
    });

    // Footer links
    $('#footerFeedback').on('click', (e) => {
      e.preventDefault();
      this.switchSection('feedback');
    });

    $('#footerContact').on('click', (e) => {
      e.preventDefault();
      this.switchSection('contact');
    });
  }

  showAuth() {
    $('#authSection').css('display', 'flex');
    $('#appSection').css('display', 'none');

    // Create auth UI if not already created
    const authContainer = $('#authContainer');
    if (authContainer.children().length === 0) {
      // Create containers for tabs and forms using safe DOM methods
      const tabsDiv = document.createElement('div');
      tabsDiv.id = 'authTabsContainer';

      const loginDiv = document.createElement('div');
      loginDiv.id = 'loginFormContainer';
      loginDiv.style.display = 'block';

      const registerDiv = document.createElement('div');
      registerDiv.id = 'registerFormContainer';
      registerDiv.style.display = 'none';

      authContainer.append(tabsDiv);
      authContainer.append(loginDiv);
      authContainer.append(registerDiv);

      // Create tab buttons
      Domma.auth.createAuthTabs('#authTabsContainer');

      // Create forms
      Domma.auth.createLoginForm('#loginFormContainer');
      Domma.auth.createRegisterForm('#registerFormContainer');

      // Handle tab switching
      $('#authTabsContainer button[data-tab]').on('click', (e) => {
        const tab = $(e.currentTarget).data('tab');
        if (tab === 'login') {
          $('#loginFormContainer').css('display', 'block');
          $('#registerFormContainer').css('display', 'none');
        } else if (tab === 'register') {
          $('#loginFormContainer').css('display', 'none');
          $('#registerFormContainer').css('display', 'block');
        }
      });
    }

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  async showApp() {
    $('#authSection').css('display', 'none');
    $('#appSection').css('display', 'flex');

    // Update navbar with user info
    this.updateNavbar();

    // Load initial data first to get badge counts
    await this.loadInitialData();

    // Load user preferences from backend (merges with localStorage)
    await preferences.loadFromBackend();

    // Initialize sidebar with badge counts
    this.initSidebar();

    // Initialize Domma Blueprint forms
    this.initForms();

    // Uncloak the page
    $('body').removeClass('dm-cloaked');
  }

  /**
   * Initialize Domma Blueprint forms
   */
  initForms() {
    console.log('[initForms] FORCING FALLBACK FORMS');

    // Wait for DOM to be ready, then inject forms
    setTimeout(() => {
      console.log('[initForms] Delayed form creation starting');
      this.createFallbackLookupForm();
      this.createFeedbackForm();
    }, 100);
  }

  initFormsOLD() {
    console.log('[initForms] Starting form initialization');
    console.log('[initForms] Domma.forms available:', !!Domma.forms);
    console.log('[initForms] lookupFormContainer exists:', !!$('#lookupFormContainer').length);

    // Initialize lookup form using Domma.forms OR fallback to HTML
    if ($('#lookupFormContainer').length) {
      if (Domma.forms && typeof Domma.forms.render === 'function') {
        console.log('[initForms] Creating lookup form with Domma.forms.render');
        try {
          // Use render() instead of create() - pass fields array
          Domma.forms.render('#lookupFormContainer', lookupBlueprint.fields, {}, {
            submitText: 'Lookup',
            submitIcon: 'search',
            onSubmit: (data) => this.performLookupWithData(data),
            layout: 'inline'
          });
          console.log('[initForms] Lookup form rendered successfully');
        } catch (error) {
          console.error('[initForms] Failed to render lookup form:', error);
          this.createFallbackLookupForm();
        }
      } else {
        console.warn('[initForms] Domma.forms.render not available, using fallback');
        this.createFallbackLookupForm();
      }
    } else {
      console.warn('[initForms] lookupFormContainer not found in DOM');
    }

  }

  createFallbackLookupForm() {
    console.log('[createFallbackLookupForm] Creating HTML fallback form');

    const container = document.getElementById('lookupFormContainer');
    console.log('[createFallbackLookupForm] Container found:', !!container);
    console.log('[createFallbackLookupForm] Container visible:', container?.offsetParent !== null);

    if (!container) {
      console.error('[createFallbackLookupForm] lookupFormContainer NOT FOUND!');
      return;
    }

    container.innerHTML = `
      <form id="lookupFormFallback" style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.75rem; align-items: end;">
          <div>
            <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Postcode</label>
            <input
              type="text"
              id="postcodeInput"
              class="form-input"
              placeholder="SW1A 1AA"
              maxlength="10"
              required
              style="text-transform: uppercase; width: 100%;"
            >
          </div>
          <button type="submit" class="btn btn-primary" style="white-space: nowrap;">
            <span data-icon="search"></span> Lookup
          </button>
        </div>

        <div>
          <label class="form-label" style="display: block; margin-bottom: 0.75rem; font-weight: 500;">Lookup Type</label>
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; min-width: 200px;">
              <input
                type="radio"
                name="lookupType"
                value="validate"
                checked
                style="width: 18px; height: 18px; cursor: pointer; margin-top: 2px; flex-shrink: 0;"
              >
              <span style="display: flex; flex-direction: column; line-height: 1.4;">
                <strong style="font-size: 1rem;">Validate Only</strong>
                <small style="color: #6c757d; margin-top: 0.25rem;">FREE - ONS data (coordinates, regions)</small>
              </span>
            </label>
            <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; min-width: 200px;">
              <input
                type="radio"
                name="lookupType"
                value="full"
                style="width: 18px; height: 18px; cursor: pointer; margin-top: 2px; flex-shrink: 0;"
              >
              <span style="display: flex; flex-direction: column; line-height: 1.4;">
                <strong style="font-size: 1rem;">Full Address</strong>
                <small style="color: #6c757d; margin-top: 0.25rem;">1 credit - Complete street addresses</small>
              </span>
            </label>
          </div>
        </div>
      </form>
    `;

    console.log('[createFallbackLookupForm] Form HTML injected, setting up event listener');

    const form = document.getElementById('lookupFormFallback');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const postcode = document.getElementById('postcodeInput').value.trim().toUpperCase();
        const lookupType = document.querySelector('input[name="lookupType"]:checked').value;

        if (!postcode) {
          Domma.elements.toast('Please enter a postcode', { type: 'warning' });
          return;
        }

        await this.performLookupWithData({ postcode, lookupType });
      });
      console.log('[createFallbackLookupForm] Form event listener attached');
    } else {
      console.error('[createFallbackLookupForm] Form element not found after injection!');
    }

    if (Domma.icons) {
      Domma.icons.scan();
      console.log('[createFallbackLookupForm] Icons scanned');
    }

    console.log('[createFallbackLookupForm] COMPLETE');
  }

  createFeedbackForm() {
    // Use Domma.forms.render() - it returns array-indexed data
    // We need to map indices to field names manually
    Domma.forms.render('#feedbackFormContainer', feedbackBlueprint.fields, {}, {
      onSubmit: async (data) => {
        console.log('[Feedback] Form data received:', data);

        // Map array indices to field names
        // data[0] = subject (first field), data[1] = message (second field)
        const formData = {
          subject: data[0] || data.subject,
          message: data[1] || data.message
        };

        console.log('[Feedback] Mapped data:', formData);

        await this.submitFeedback({
          type: formData.subject,
          message: formData.message
          // rating omitted - will be added when star rating component is implemented
        });
        return true;  // Return true to reset form
      },
      submitText: 'Send Feedback',
      layout: 'stacked'
    });

    if (Domma.icons) Domma.icons.scan();
  }

  handleLogin() {
    Domma.elements.toast('Welcome to Address Lookup!', { type: 'success' });
    this.showApp();
  }

  handleLogout() {
    // Clear current lookup result
    this.currentLookupResult = null;

    // Hide Save Current button
    $('#saveAddressBtn').css('display', 'none');

    this.showAuth();
  }

  handleTokenExpired() {
    Domma.elements.toast('Session expired. Please log in again.', {
      type: 'warning'
    });
    this.showAuth();
  }

  /**
   * Update navbar with user info
   */
  updateNavbar() {
    const user = Domma.auth.getUser();
    const email = user?.email || 'User';
    const userName = email.split('@')[0];
    const role = user?.role || 'guest';

    $('#userName').text(userName);

    // Update badge with role
    const badgeClass = role === 'admin' ? 'badge-success' :
                      role === 'subscriber' ? 'badge-primary' :
                      'badge-secondary';

    $('#userBadge')
      .removeClass('badge-primary badge-success badge-secondary')
      .addClass(badgeClass)
      .text(role.charAt(0).toUpperCase() + role.slice(1));
  }

  /**
   * Initialize sidebar with Domma.elements.sidebar()
   */
  initSidebar() {
    const items = [
      {
        text: 'Lookup',
        icon: 'search',
        section: 'lookup',
        badge: this.stats.todayLookups || null
      },
      {
        text: 'Dashboard',
        icon: 'layout',
        section: 'dashboard'
      },
      {
        text: 'API Keys',
        icon: 'key',
        section: 'apiKeys',
        badge: this.stats.activeKeys || null
      },
      {
        text: 'Saved Addresses',
        icon: 'bookmark',
        section: 'saved',
        badge: this.stats.savedCount || null
      },
      {
        text: 'Feedback',
        icon: 'message-square',
        section: 'feedback'
      },
      {
        text: 'Contact',
        icon: 'mail',
        section: 'contact'
      }
    ];

    this.sidebar = Domma.elements.sidebar('#app-sidebar', {
      position: 'left',
      fixed: true,
      width: '250px',
      collapsedWidth: '60px',
      top: '60px',
      header: {
        title: 'Address Lookup',
        toggle: true,
        icon: 'map-pin'
      },
      items: items,
      variant: 'dark',
      collapsible: true,
      collapsibleDesktop: true,
      persistCollapsed: true,
      persistCollapseKey: 'address-lookup-sidebar',
      collapseAt: 768,
      activeSection: 'lookup',
      push: true,
      contentSelector: '.app-main',
      onItemClick: (item) => {
        this.switchSection(item.section);
      }
    });
  }

  /**
   * Switch between sections
   */
  switchSection(sectionName) {
    // Hide all sections
    $('.app-section').removeClass('active');

    // Show target section
    const section = $(`#${sectionName}Section`);
    if (section.length > 0) {
      section.addClass('active');
    }

    // Update sidebar active state
    if (this.sidebar) {
      this.sidebar.setActive(sectionName);
    }

    // Lazy load section data if needed
    this.loadSectionData(sectionName);

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  /**
   * Lazy load section data
   */
  loadSectionData(sectionName) {
    // Render Contact section if not already rendered
    if (sectionName === 'contact' && !this._contactRendered) {
      this.renderContactSection();
      this._contactRendered = true;
    }

    // Sections already load their data in loadInitialData()
    // This method is here for future enhancements if needed
  }

  /**
   * Update sidebar badge counts
   */
  updateSidebarBadges() {
    // TODO: Implement dynamic badge updates
    // Currently, sidebar badges are only set during initialization
    // The Domma sidebar component doesn't support dynamic badge updates yet
    // We would need to re-initialize the sidebar, which is inefficient
    // For now, badges update on page refresh
    if (!this.sidebar) return;
  }

  async loadInitialData() {
    // Load data but don't fail if some requests return 401
    // This allows the app to work even if user isn't fully authenticated yet
    const results = await Promise.allSettled([
      this.loadCreditBalance(),
      this.loadBadgeCounts(),
      this.loadDashboard(),
      this.loadApiKeys(),
      this.loadSavedAddresses()
    ]);

    // Log any failures for debugging
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const names = ['credits', 'badges', 'dashboard', 'apiKeys', 'saved'];
        console.warn(`[InitialData] Failed to load ${names[index]}:`, result.reason?.message);
      }
    });

    // Update sidebar badges after data loads
    this.updateSidebarBadges();
  }

  /**
   * Load counts for sidebar badges
   */
  async loadBadgeCounts() {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/stats?days=1`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.warn('[loadBadgeCounts] Failed:', response.status);
        return;
      }

      const data = await response.json();

      // Today's lookup count
      this.stats.todayLookups = data.stats?.totalLookups || 0;

      // Active keys count (will be updated by loadApiKeys)
      // Saved count (will be updated by loadSavedAddresses)

    } catch (error) {
      console.error('Load badge counts error:', error);
    }
  }

  /**
   * Submit feedback (called by Domma.forms)
   */
  async submitFeedback(data) {
    try {
      const user = Domma.auth.getUser();

      // Map subject field to category (bug/feature/general)
      const categoryMap = {
        'bug': 'bug-report',
        'feature': 'feature-request',
        'general': 'general'
      };
      const category = categoryMap[data.type] || 'general';

      // If there's a file, use FormData, otherwise use JSON
      let body, headers;

      if (data.file) {
        const formData = new FormData();
        formData.append('name', user?.name || user?.email?.split('@')[0] || 'Anonymous');
        formData.append('email', user?.email || '');
        formData.append('category', category);
        formData.append('subject', 'Feedback from Address Lookup App');
        formData.append('message', data.message);
        if (data.rating) {
          formData.append('rating', data.rating);
        }
        // featuresUsed omitted - not applicable for miniapp feedback
        formData.append('attachment', data.file);

        body = formData;
        headers = Domma.auth.getHeaders(); // Don't set Content-Type, browser will set it with boundary
      } else {
        const payload = {
          name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          email: user?.email || '',
          category: category,
          subject: 'Feedback from Address Lookup App',
          message: data.message
          // featuresUsed omitted - not applicable for miniapp feedback
        };

        // Only include rating if provided (backend requires 1-5 if present)
        if (data.rating) {
          payload.rating = data.rating;
        }

        body = JSON.stringify(payload);
        headers = {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        };
      }

      const response = await fetch(`${this.config.apiUrl}/feedback`, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Failed to send feedback');
      }

      Domma.elements.toast('Thank you for your feedback!', { type: 'success' });

      // Reset form
      if (this.feedbackForm && this.feedbackForm.reset) {
        this.feedbackForm.reset();
      }

    } catch (error) {
      console.error('Feedback error:', error);
      throw error; // Let Domma.forms handle the error display
    }
  }

  // ============================================================================
  // CREDIT MANAGEMENT
  // ============================================================================

  async loadCreditBalance() {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/credits`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.warn('[loadCreditBalance] Failed:', response.status);
        $('#creditBalance').text('0');
        return;
      }

      const data = await response.json();
      $('#creditBalance').text(data.balance.toLocaleString());

    } catch (error) {
      console.error('Load credit balance error:', error);
      $('#creditBalance').text('0');
    }
  }

  // ============================================================================
  // POSTCODE LOOKUP
  // ============================================================================

  async checkIfPostcodeSaved(postcode) {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/saved`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const saved = data.addresses?.find(addr =>
        addr.postcode.replace(/\s/g, '').toUpperCase() === postcode.replace(/\s/g, '').toUpperCase()
      );

      return saved ? {
        saveMode: saved.isPermanent ? 'permanent' : (saved.saveMode || 'normal'),
        name: saved.name,
        id: saved._id
      } : null;
    } catch (error) {
      console.error('Check saved postcode error:', error);
      return null;
    }
  }

  async performLookupWithData(data) {
    try {
      // Reset results card before new lookup
      $('#resultsCard').hide();
      $('#lookupStatus').empty();
      $('#postcodeTitle').empty();
      $('.lookup-inline-options').remove(); // Remove any existing save mode UI
      $('#gridViewContent').empty();
      $('#jsonViewContent').empty();
      $('#cacheDetailsContent').empty();
      $('#addressesSection').hide();

      const response = await fetch(`${this.config.apiUrl}/address/lookup`, {
        method: 'POST',
        headers: {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postcode: data.postcode,
          tier: data.tier
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Lookup failed');
      }

      // Check if this postcode is saved
      const savedAddressInfo = await this.checkIfPostcodeSaved(data.postcode);

      this.currentLookupResult = responseData;
      this.renderLookupResults(responseData, savedAddressInfo);

      // Show "Save Current" button only if there are addresses (premium tier)
      if (responseData.data && responseData.data.addresses && responseData.data.addresses.length > 0) {
        $('#saveAddressBtn').css('display', 'inline-flex');
      } else {
        $('#saveAddressBtn').css('display', 'none');
      }

      // Update credit balance and stats
      await Promise.all([
        this.loadCreditBalance(),
        this.loadBadgeCounts()
      ]);

      this.updateSidebarBadges();

      Domma.elements.toast('Lookup successful', { type: 'success', duration: 2000 });

    } catch (error) {
      console.error('Lookup error:', error);
      throw error; // Let Domma.forms handle the error display
    }
  }

  renderLookupResults(result, savedAddressInfo = null) {
    if (!result.success) {
      $('#postcodeTitle').html(`
        <div class="alert alert-danger">
          <span data-icon="alert-triangle"></span>
          ${_.escape(result.error)}
        </div>
      `);
      $('#resultsCard').show();
      if (Domma.icons) {
        Domma.icons.scan();
      }
      return;
    }

    const { data, cached, cacheAge, creditCharged } = result;

    // Show results card
    $('#resultsCard').show();

    // Clear status banner
    $('#lookupStatus').empty();

    // Update cache tab label
    const cacheTabText = cached ? 'Cached Result' : 'Fresh Lookup';
    const cacheTabIcon = cached ? 'database' : 'zap';
    $('#cacheTab').html(`<span data-icon="${cacheTabIcon}"></span> ${cacheTabText}`);

    // Build cache details grid
    const cacheDetails = [];
    cacheDetails.push({ label: 'Status', value: cached ? 'Cached' : 'Fresh' });
    if (creditCharged !== undefined) cacheDetails.push({ label: 'Credit Charged', value: creditCharged ? 'Yes (1 credit)' : 'No' });
    if (cached) {
      if (cacheAge) cacheDetails.push({ label: 'Cache Age', value: cacheAge });
      if (data.cacheInfo?.hitCount) cacheDetails.push({ label: 'Cache Hits', value: data.cacheInfo.hitCount });
      if (data.cacheInfo?.cachedAt) cacheDetails.push({ label: 'Cached At', value: D(data.cacheInfo.cachedAt).format('D MMM YYYY, HH:mm') });
      if (data.cacheInfo?.expiresAt) cacheDetails.push({ label: 'Expires', value: D(data.cacheInfo.expiresAt).fromNow() });
    }

    const cacheDetailsHtml = `
      <h4 class="mb-4" style="color: var(--dm-gray-400);">Cache Information</h4>
      <div class="card shadow-sm">
        <div class="card-body p-0">
          ${cacheDetails.map(detail => `
            <div class="grid grid-cols-2">
              <div class="py-2 px-3">
                <span style="color: var(--dm-gray-600);">${detail.label}</span>
              </div>
              <div class="py-2 px-3" style="border-left: 1px solid var(--dm-border);">
                <strong>${_.escape(String(detail.value))}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    $('#cacheDetailsContent').html(cacheDetailsHtml);

    // Postcode title with credit status and data type badge
    const creditBadge = creditCharged
      ? '<span class="badge badge-warning ml-3"><span data-icon="zap"></span> 1 Credit</span>'
      : '<span class="badge badge-success ml-3"><span data-icon="check-circle"></span> Free</span>';

    const hasAddresses = data.addresses && data.addresses.length > 0;
    const dataTypeBadge = hasAddresses
      ? '<span class="badge badge-primary ml-2"><span data-icon="map-pin"></span> Full Addresses</span>'
      : '<span class="badge badge-secondary ml-2"><span data-icon="map"></span> Postcode Data</span>';

    // Show saved address indicator if this postcode is saved
    let savedBadge = '';
    if (savedAddressInfo) {
      const badgeColor = savedAddressInfo.saveMode === 'permanent' ? 'success' : (savedAddressInfo.saveMode === 'delayed' ? 'warning' : 'info');
      const badgeText = savedAddressInfo.saveMode === 'permanent' ? 'PERMANENT' : (savedAddressInfo.saveMode === 'delayed' ? 'DELAYED' : 'SAVED');
      savedBadge = `<span class="badge badge-${badgeColor} ml-2"><span data-icon="bookmark"></span> ${badgeText} ADDRESS</span>`;
    }

    $('#postcodeTitle').html(`
      <span style="font-size: 3rem; font-weight: 900; color: white; text-shadow: 3px 3px 6px rgba(0,0,0,0.5); letter-spacing: 0.1em; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">${_.escape(data.postcode)}</span>${creditBadge}${dataTypeBadge}${savedBadge}
    `);

    // Get preferences for this postcode
    const currentPostcode = data.postcode;
    const saveMode = preferences.getForPostcode(currentPostcode, 'saveMode') || 'normal';
    const tier = preferences.getForPostcode(currentPostcode, 'preferredTier');

    // Inline options: Save mode radio group
    const inlineOptionsHtml = `
      <div class="lookup-inline-options mb-4">

        <!-- Save Mode: Radio Group (mutually exclusive) -->
        <div class="save-mode-options">
          <label>Save Mode</label>
          <div class="btn-group" role="group" data-postcode="${currentPostcode}">
            <input type="radio" class="btn-check" name="saveMode-${currentPostcode}" id="mode-normal-${currentPostcode}" value="normal" ${saveMode === 'normal' ? 'checked' : ''} autocomplete="off">
            <label class="btn btn-outline-secondary save-mode-label" for="mode-normal-${currentPostcode}">
              <div class="save-mode-label-primary">Normal</div>
              <div class="save-mode-label-secondary">24h cache</div>
            </label>

            <input type="radio" class="btn-check" name="saveMode-${currentPostcode}" id="mode-delayed-${currentPostcode}" value="delayed" ${saveMode === 'delayed' ? 'checked' : ''} autocomplete="off">
            <label class="btn btn-outline-secondary save-mode-label" for="mode-delayed-${currentPostcode}">
              <div class="save-mode-label-primary">Delayed</div>
              <div class="save-mode-label-secondary">7 day + refresh</div>
            </label>

            <input type="radio" class="btn-check" name="saveMode-${currentPostcode}" id="mode-permanent-${currentPostcode}" value="permanent" ${saveMode === 'permanent' ? 'checked' : ''} autocomplete="off">
            <label class="btn btn-outline-secondary save-mode-label" for="mode-permanent-${currentPostcode}">
              <div class="save-mode-label-primary">Permanent</div>
              <div class="save-mode-label-secondary">Never expires</div>
            </label>
          </div>
        </div>

      </div>
    `;

    // Insert after postcode title
    $('#postcodeTitle').after(inlineOptionsHtml);

    // Bind save mode radio handler
    $('input[name^="saveMode-"]').on('change', async (e) => {
      const postcode = $(e.target).closest('.btn-group').data('postcode');
      const newMode = e.target.value;
      preferences.setForPostcode(postcode, 'saveMode', newMode);

      // Show feedback toast
      const modeLabels = { normal: 'Normal (24h)', delayed: 'Delayed (7 day)', permanent: 'Permanent' };
      Domma.elements.toast(`Save mode set to: ${modeLabels[newMode]}`, { type: 'info', duration: 2000 });

      // Auto-save if delayed or permanent
      if ((newMode === 'delayed' || newMode === 'permanent') && this.currentLookupResult) {
        await this.autoSaveAddress(newMode);
      }
    });

    // Build ALL fields for Grid View
    const allFields = [];
    const pd = data.postcodeData;

    if (pd) {
      // Core location
      if (pd.region) allFields.push({ label: 'Region', value: pd.region });
      if (pd.admin_district) allFields.push({ label: 'District', value: pd.admin_district });
      if (pd.admin_county) allFields.push({ label: 'County', value: pd.admin_county });
      if (pd.admin_ward) allFields.push({ label: 'Ward', value: pd.admin_ward });
      if (pd.parish) allFields.push({ label: 'Parish', value: pd.parish });
      if (pd.country) allFields.push({ label: 'Country', value: pd.country });

      // Political
      if (pd.parliamentary_constituency) allFields.push({ label: 'Constituency', value: pd.parliamentary_constituency });

      // Coordinates
      if (pd.latitude) allFields.push({ label: 'Latitude', value: pd.latitude });
      if (pd.longitude) allFields.push({ label: 'Longitude', value: pd.longitude });
      if (pd.eastings) allFields.push({ label: 'Eastings', value: pd.eastings });
      if (pd.northings) allFields.push({ label: 'Northings', value: pd.northings });

      // Statistical
      if (pd.lsoa) allFields.push({ label: 'LSOA', value: pd.lsoa });
      if (pd.msoa) allFields.push({ label: 'MSOA', value: pd.msoa });

      // Health
      if (pd.ccg) allFields.push({ label: 'CCG', value: pd.ccg });
      if (pd.nhs_ha) allFields.push({ label: 'NHS Health Authority', value: pd.nhs_ha });

      // Other
      if (pd.nuts) allFields.push({ label: 'NUTS', value: pd.nuts });
      if (pd.quality) allFields.push({ label: 'Quality Score', value: pd.quality });
    }

    // Grid View - single card, 50/50 columns using Domma Grid
    const gridHtml = `
      <h4 class="mb-4" style="color: var(--dm-gray-400);">Location Details</h4>
      <div class="card shadow-sm">
        <div class="card-body p-0">
          ${allFields.map(field => `
            <div class="grid grid-cols-2">
              <div class="py-2 px-3">
                <span style="color: var(--dm-gray-600);">${field.label}</span>
              </div>
              <div class="py-2 px-3" style="border-left: 1px solid var(--dm-border);">
                <strong>${_.escape(String(field.value))}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    $('#gridViewContent').html(gridHtml);

    // JSON View - formatted raw data in a card
    const jsonData = {
      postcode: data.postcode,
      tier: data.tier,
      postcodeData: data.postcodeData,
      cached: cached,
      cacheAge: cacheAge || null
    };
    const jsonHtml = `
      <div class="card shadow-sm">
        <div class="card-body">
          <pre class="mb-0" style="max-height: 500px; overflow-y: auto;">${JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      </div>
    `;
    $('#jsonViewContent').html(jsonHtml);

    // Initialise tabs (only once)
    if (!this.resultsTabs) {
      this.resultsTabs = Domma.elements.tabs('#resultsTabs', {
        animation: 'fade',
        animationDuration: 150
      });
    }

    // Handle addresses (Premium)
    if (data.addresses && data.addresses.length > 0) {
      $('#addressesSection').html(`
        <h4 class="text-muted mt-4 mb-3">Addresses (${data.addresses.length})</h4>
        <div class="address-list">
          ${data.addresses.map((addr, index) => `
            <div class="address-item" data-address-index="${index}">
              ${_.escape(addr.formatted)}
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary w-100 mt-3" onclick="addressApp.showSaveAddressModal()">
          <span data-icon="bookmark"></span> Save Address
        </button>
      `).show();

      // Add click handlers for addresses
      $('.address-item').on('click', (e) => {
        $('.address-item').removeClass('border-primary bg-light');
        $(e.currentTarget).addClass('border-primary bg-light');
      });
    } else {
      $('#addressesSection').hide();
    }

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  // ============================================================================
  // SAVED ADDRESSES
  // ============================================================================

  async loadSavedAddresses() {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/saved`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.warn('[loadSavedAddresses] Failed:', response.status);
        return;
      }

      const data = await response.json();

      // Store saved addresses for edit functionality
      this.savedAddresses = data.addresses || [];

      // Update badge count
      this.stats.savedCount = data.addresses?.length || 0;

      this.renderSavedAddresses(data.addresses);

    } catch (error) {
      console.error('Load saved addresses error:', error);
    }
  }

  renderSavedAddresses(addresses) {
    if (!addresses || addresses.length === 0) {
      $('#savedAddressesList').html('<p class="text-muted">No saved addresses</p>');
      $('#noSavedAddresses').show();
      return;
    }

    $('#noSavedAddresses').hide();

    // Prepare data for DataTable
    const tableData = addresses.map(addr => ({
      _id: addr._id,
      name: addr.name,
      address: addr.selectedAddress.formatted,
      postcode: addr.postcode,
      tags: addr.tags || [],
      notes: addr.notes || '',
      isPermanent: addr.isPermanent,
      saveMode: addr.isPermanent ? 'permanent' : (addr.saveMode || 'normal'),
      createdAt: addr.createdAt
    }));

    // Clear and create table container
    $('#savedAddressesList').html('<div id="savedAddressesTable"></div>');

    // Destroy existing table if present
    if (this.savedAddressesTable) {
      this.savedAddressesTable.destroy();
    }

    // Create DataTable
    this.savedAddressesTable = Domma.tables.create('#savedAddressesTable', {
      data: tableData,
      columns: [
        {
          key: 'name',
          title: 'Name',
          render: (value, row) => {
            let badge = '';
            if (row.saveMode === 'permanent') {
              badge = '<span class="badge badge-success ml-2">PERMANENT</span>';
            } else if (row.saveMode === 'delayed') {
              badge = '<span class="badge badge-warning ml-2">DELAYED</span>';
            }
            return `
              <div>
                <strong>${_.escape(value)}</strong>
                ${badge}
              </div>
            `;
          }
        },
        {
          key: 'address',
          title: 'Address',
          render: (value) => `<span class="text-muted small">${_.escape(value)}</span>`
        },
        {
          key: 'postcode',
          title: 'Postcode',
          render: (value) => `<code style="font-size: 0.875rem;">${_.escape(value)}</code>`
        },
        {
          key: 'tags',
          title: 'Tags',
          render: (value) => value.length > 0
            ? value.map(tag => `<span class="badge badge-secondary">${_.escape(tag)}</span>`).join(' ')
            : '<span class="text-muted">—</span>'
        },
        {
          key: 'createdAt',
          title: 'Saved',
          render: (value) => `<span class="text-muted small">${D(value).fromNow()}</span>`
        },
        {
          key: '_id',
          title: 'Actions',
          sortable: false,
          render: (value, row) => `
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="addressApp.editSavedAddress('${value}')" title="Edit">
                <span data-icon="edit" data-icon-size="14"></span>
              </button>
              <button class="btn btn-outline-danger" onclick="addressApp.deleteSavedAddress('${value}')" title="Delete">
                <span data-icon="trash" data-icon-size="14"></span>
              </button>
            </div>
          `
        }
      ],
      pagination: {
        enabled: true,
        pageSize: 10
      },
      search: true,
      responsive: true,
      striped: true
    });

    // Scan icons after table render
    if (Domma.icons) {
      setTimeout(() => Domma.icons.scan(), 100);
    }
  }

  filterSavedAddresses(query, tags) {
    const searchQuery = query !== null ? query.toLowerCase() : (this._lastSearchQuery || '');
    const activeTags = tags !== null ? tags : (this._lastActiveTags || []);

    // Store for next filter
    this._lastSearchQuery = searchQuery;
    this._lastActiveTags = activeTags;

    $('.saved-address-card').each(function() {
      const name = $(this).data('name').toLowerCase();
      const postcode = $(this).data('postcode').toLowerCase();
      const cardTags = $(this).data('tags').split(',').filter(Boolean);

      // Check search query
      const matchesQuery = !searchQuery || name.includes(searchQuery) || postcode.includes(searchQuery);

      // Check tags (must match all active tags)
      const matchesTags = activeTags.length === 0 || activeTags.every(tag => cardTags.includes(tag));

      if (matchesQuery && matchesTags) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  quickReLookup(postcode) {
    // Switch to lookup section
    this.switchSection('lookup');

    // Set postcode in input
    $('#postcodeInput').val(postcode);

    // Perform lookup
    this.performLookup(postcode, 'full');

    Domma.elements.toast('Re-looking up address...', { type: 'info' });
  }

  async showSaveAddressModal() {
    if (!this.currentLookupResult || !this.currentLookupResult.data.addresses) {
      Domma.elements.toast('No addresses to save', { type: 'warning' });
      return;
    }

    const addresses = this.currentLookupResult.data.addresses;
    const selectedIndex = $('.address-item.border-primary').data('address-index') || 0;
    const selectedAddress = addresses[selectedIndex];
    const postcode = this.currentLookupResult.data.postcode;

    // Get current preferences for this postcode
    const saveMode = preferences.getForPostcode(postcode, 'saveMode') || 'normal';
    const preferredTier = preferences.getForPostcode(postcode, 'preferredTier');

    // Use Domma.forms.modal with blueprint fields
    // Pass fields array and use correct option names (onSave, not onSubmit)
    const modal = Domma.forms.modal(saveAddressBlueprint.fields, {
      saveMode: saveMode
    }, {
      title: saveAddressBlueprint.title || 'Save Address',
      saveText: 'Save Address',
      onSave: async (data) => {
        await this.saveAddressWithOptions(data, selectedAddress, postcode);
      },
      onError: (error) => {
        console.error('Save address error:', error);
        Domma.elements.toast(error.message || 'Failed to save address', { type: 'error' });
      }
    });

    // Open the modal
    modal.open();
  }

  async saveAddressWithOptions(data, selectedAddress, postcode) {
    try {
      // Update preferences if setAsDefault is checked
      if (data.setAsDefault) {
        preferences.setForPostcode(postcode, 'preferredTier', 'premium');
      }

      // Update save mode preference
      preferences.setForPostcode(postcode, 'saveMode', data.saveMode);

      // Parse tags
      const tags = data.tags
        ? data.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
        : [];

      // Save to backend
      const response = await fetch(`${this.config.apiUrl}/address/saved`, {
        method: 'POST',
        headers: {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          postcode: selectedAddress.postcode,
          selectedAddress,
          isPermanent: data.saveMode === 'permanent',
          notes: data.notes || '',
          tags
        })
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Failed to save address');
      }

      Domma.elements.toast('Address saved successfully!', { type: 'success' });
      await this.loadSavedAddresses();
      this.updateSidebarBadges();

      return true;

    } catch (error) {
      console.error('Save address error:', error);
      throw error;
    }
  }

  async autoSaveAddress(saveMode) {
    if (!this.currentLookupResult) {
      console.warn('No current lookup result to save');
      return;
    }

    const postcode = this.currentLookupResult.data.postcode;
    const postcodeData = this.currentLookupResult.data;

    // Check if already saved
    const existing = this.savedAddresses?.find(addr =>
      addr.postcode.replace(/\s/g, '').toUpperCase() === postcode.replace(/\s/g, '').toUpperCase()
    );

    if (existing) {
      // Update existing address saveMode
      try {
        const response = await fetch(`${this.config.apiUrl}/address/saved/${existing._id}`, {
          method: 'PATCH',
          headers: {
            ...Domma.auth.getHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            isPermanent: saveMode === 'permanent',
            saveMode: saveMode
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update address');
        }

        Domma.elements.toast(`Address updated to ${saveMode}`, { type: 'success' });
        await this.loadSavedAddresses();
        this.updateSidebarBadges();
      } catch (error) {
        console.error('Update address error:', error);
        Domma.elements.toast('Failed to update address', { type: 'error' });
      }
      return;
    }

    // Create new saved address
    try {
      const saveData = {
        name: `${postcodeData?.admin_district || postcodeData?.region || 'Location'} (${postcode})`,
        postcode: postcode,
        selectedAddress: {
          line1: postcodeData?.admin_district || postcodeData?.region || postcode,
          town: postcodeData?.admin_ward || postcodeData?.parish || postcodeData?.admin_district || postcodeData?.region || 'Unknown',
          postcode: postcode,
          country: postcodeData?.country || 'England',
          formatted: `${postcodeData?.admin_district || postcodeData?.region || postcode}, ${postcode}`
        },
        isPermanent: saveMode === 'permanent',
        saveMode: saveMode,
        notes: `Auto-saved as ${saveMode}`,
        tags: [saveMode, 'auto']
      };

      const response = await fetch(`${this.config.apiUrl}/address/saved`, {
        method: 'POST',
        headers: {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save address');
      }

      Domma.elements.toast(`Address saved as ${saveMode}!`, { type: 'success' });
      await this.loadSavedAddresses();
      this.updateSidebarBadges();

    } catch (error) {
      console.error('Auto-save address error:', error);
      Domma.elements.toast(`Failed to save: ${error.message}`, { type: 'error' });
    }
  }

  async deleteSavedAddress(id) {
    const confirmed = await Domma.elements.confirm(
      'Are you sure you want to delete this saved address?',
      { title: 'Confirm Delete' }
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${this.config.apiUrl}/address/saved/${id}`, {
        method: 'DELETE',
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete address');
      }

      Domma.elements.toast('Address deleted', { type: 'success' });
      await this.loadSavedAddresses();

      // Update sidebar badge
      this.updateSidebarBadges();

    } catch (error) {
      console.error('Delete address error:', error);
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }

  async editSavedAddress(id) {
    // Find the address to edit
    if (!this.savedAddresses) {
      await this.loadSavedAddresses();
    }

    const address = this.savedAddresses.find(a => a._id === id);
    if (!address) {
      Domma.elements.toast('Address not found', { type: 'error' });
      return;
    }

    // Create edit form using Domma.forms.modal
    // Pass fields array, initial data, and options separately
    const editFields = [
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        required: true
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        required: false
      },
      {
        name: 'tags',
        label: 'Tags (comma-separated)',
        type: 'string',
        required: false
      }
    ];

    const editData = {
      name: address.name,
      notes: address.notes || '',
      tags: (address.tags || []).join(', ')
    };

    const modal = Domma.forms.modal(editFields, editData, {
      title: 'Edit Saved Address',
      saveText: 'Save Changes',
      onSave: async (data) => {
        // Parse tags
        const tags = data.tags
          ? data.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
          : [];

        // Update via PATCH endpoint
        const response = await fetch(`${this.config.apiUrl}/address/saved/${id}`, {
          method: 'PATCH',
          headers: {
            ...Domma.auth.getHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            notes: data.notes,
            tags
          })
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to update address');
        }

        Domma.elements.toast('Address updated successfully', { type: 'success' });
        await this.loadSavedAddresses();
      },
      onError: (error) => {
        console.error('Edit address error:', error);
        Domma.elements.toast(error.message || 'Failed to update address', { type: 'error' });
      }
    });

    // Open the modal
    modal.open();
  }

  // ============================================================================
  // API KEYS
  // ============================================================================

  async loadApiKeys() {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/keys`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.warn('[loadApiKeys] Failed:', response.status);
        return;
      }

      const data = await response.json();

      // Update badge count (active keys only)
      this.stats.activeKeys = data.keys?.filter(k => k.isActive).length || 0;

      this.renderApiKeys(data.keys);

    } catch (error) {
      console.error('Load API keys error:', error);
    }
  }

  renderApiKeys(keys) {
    if (!keys || keys.length === 0) {
      const cardHtml = `
        <div class="card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
            <h3 style="margin: 0; font-size: 1.25rem;">Your API Keys</h3>
          </div>
          <div class="card-body text-center py-5">
            <span data-icon="key" style="width: 64px; height: 64px; opacity: 0.2;"></span>
            <h3 class="mt-3">No API Keys</h3>
            <p class="text-muted">Create an API key to access the Address Lookup API programmatically.</p>
          </div>
        </div>
      `;

      $('#apiKeysList').html(cardHtml);

      // Add create button after HTML is in DOM
      const iconSpan = $('<span>').attr('data-icon', 'plus-circle').attr('data-icon-size', '16');
      const textSpan = $('<span>').text('Create API Key');
      const createBtn = $('<button>')
        .addClass('btn btn-primary')
        .css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })
        .append(iconSpan)
        .append(textSpan);

      $('#apiKeysList .card-header').append(createBtn);

      // Bind event after appending to DOM
      $('#apiKeysList .card-header button').on('click', () => this.showCreateApiKeyModal());

      if (Domma.icons) {
        Domma.icons.scan();
      }
      return;
    }

    // Prepare data for DataTable
    const tableData = keys.map(key => ({
      _id: key._id,
      name: key.name,
      isActive: key.isActive,
      keyPrefix: key.keyPrefix,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
      createdAt: key.createdAt,
      usage: key.usage
    }));

    // Clear and create table container inside a card with header
    const cardHtml = `
      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
          <h3 style="margin: 0; font-size: 1.25rem;">Your API Keys</h3>
        </div>
        <div class="card-body">
          <div id="apiKeysTable"></div>
        </div>
      </div>
    `;

    $('#apiKeysList').html(cardHtml);

    // Add create button after HTML is in DOM
    const iconSpan = $('<span>').attr('data-icon', 'plus-circle').attr('data-icon-size', '16');
    const textSpan = $('<span>').text('Create API Key');
    const createBtn = $('<button>')
      .addClass('btn btn-primary')
      .css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })
      .append(iconSpan)
      .append(textSpan);

    $('#apiKeysList .card-header').append(createBtn);

    // Bind event after appending to DOM
    $('#apiKeysList .card-header button').on('click', () => this.showCreateApiKeyModal());

    // Scan icons in header
    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Destroy existing table if present
    if (this.apiKeysTable) {
      this.apiKeysTable.destroy();
    }

    // Create DataTable
    this.apiKeysTable = Domma.tables.create('#apiKeysTable', {
      data: tableData,
      columns: [
        {
          key: 'name',
          title: 'Name',
          render: (value, row) => `
            <div>
              <strong>${_.escape(value)}</strong>
              <span class="badge badge-${row.isActive ? 'success' : 'secondary'} ml-2">
                ${row.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
          `
        },
        {
          key: 'keyPrefix',
          title: 'Key',
          sortable: false,
          render: (value) => `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <code style="background: #f5f5f5; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">${_.escape(value)}••••••••</code>
              <button class="btn btn-sm btn-outline-primary copy-key-btn" data-key="${_.escape(value)}" title="Copy">
                <span data-icon="copy" data-icon-size="12"></span>
              </button>
            </div>
          `
        },
        {
          key: 'permissions',
          title: 'Permissions',
          sortable: false,
          render: (value) => `
            <div>
              ${value.freeLookup ? '<span class="badge badge-success">Free</span>' : '<span class="badge badge-secondary">No Free</span>'}
              ${value.premiumLookup ? '<span class="badge badge-primary ml-1">Premium</span>' : '<span class="badge badge-secondary ml-1">No Premium</span>'}
            </div>
          `
        },
        {
          key: 'rateLimit',
          title: 'Rate Limit',
          sortable: false,
          render: (value) => `
            <div class="small">
              <strong>${value.requestsPerMinute}</strong>/min<br>
              <strong>${value.requestsPerDay}</strong>/day
            </div>
          `
        },
        {
          key: 'usage',
          title: 'Usage',
          sortable: false,
          render: (value) => {
            if (value && value.totalRequests > 0) {
              return `
                <div class="small">
                  <strong>${value.totalRequests}</strong> requests<br>
                  <span class="text-muted">Last ${D(value.lastUsedAt).fromNow()}</span>
                </div>
              `;
            }
            return '<span class="text-muted small">Never used</span>';
          }
        },
        {
          key: 'createdAt',
          title: 'Created',
          render: (value) => `<span class="text-muted small">${D(value).format('D MMM YYYY')}</span>`
        },
        {
          key: '_id',
          title: 'Actions',
          sortable: false,
          render: (value) => `
            <button class="btn btn-sm btn-danger delete-api-key-btn" data-key-id="${value}" title="Delete API Key">
              <span data-icon="trash" data-icon-size="16"></span>
            </button>
          `
        }
      ],
      pagination: {
        enabled: true,
        pageSize: 10
      },
      search: true,
      responsive: true,
      striped: true
    });

    // Bind delete button events using event delegation
    $('#apiKeysTable').off('click', '.delete-api-key-btn').on('click', '.delete-api-key-btn', (e) => {
      e.preventDefault();
      const keyId = $(e.currentTarget).data('key-id');
      this.deleteApiKey(keyId);
    });

    // Bind copy button events using event delegation
    $('#apiKeysTable').off('click', '.copy-key-btn').on('click', '.copy-key-btn', async function(e) {
      e.preventDefault();
      const keyPrefix = $(this).data('key');

      try {
        await _.copyToClipboard(keyPrefix);
        Domma.elements.toast('Key prefix copied!', { type: 'success', duration: 2000 });
      } catch (error) {
        console.error('Copy failed:', error);
        Domma.elements.toast('Failed to copy', { type: 'error' });
      }
    });

    // Scan icons after table render - do it multiple times to ensure they render
    if (Domma.icons) {
      Domma.icons.scan();
      // setTimeout(() => Domma.icons.scan(), 100);
      setTimeout(() => Domma.icons.scan(), 500);
      // setTimeout(() => Domma.icons.scan(), 5000);
    }
  }

  async showCreateApiKeyModal() {
    // Manual form creation instead of using modal
    const modalHTML = `
      <div class="modal-backdrop active" id="apiKeyModalBackdrop" style="display: block;"></div>
      <div class="modal active" id="apiKeyModal" style="display: block;">
        <div class="modal-header">
          <h3 class="modal-title">${apiKeyBlueprint.title}</h3>
          <button type="button" class="modal-close" id="apiKeyModalClose">&times;</button>
        </div>
        <div class="modal-body">
          <form id="apiKeyForm">
            <div class="domma-form-field">
              <label for="apiKeyName" class="form-label">API Key Name <span class="text-danger">*</span></label>
              <input type="text" id="apiKeyName" name="name" class="form-input" required placeholder="e.g., Production Server">
            </div>
            <div class="domma-form-field">
              <div class="form-check">
                <input type="checkbox" id="freeLookup" name="freeLookup" class="form-check-input" checked>
                <label for="freeLookup" class="form-check-label">Allow Free Lookups</label>
              </div>
            </div>
            <div class="domma-form-field">
              <div class="form-check">
                <input type="checkbox" id="premiumLookup" name="premiumLookup" class="form-check-input" checked>
                <label for="premiumLookup" class="form-check-label">Allow Premium Lookups</label>
              </div>
            </div>
            <div class="domma-form-field">
              <label for="requestsPerMinute" class="form-label">Requests per Minute <span class="text-danger">*</span></label>
              <input type="number" id="requestsPerMinute" name="requestsPerMinute" class="form-input" required min="1" max="100" value="60">
            </div>
            <div class="domma-form-field">
              <label for="requestsPerDay" class="form-label">Requests per Day <span class="text-danger">*</span></label>
              <input type="number" id="requestsPerDay" name="requestsPerDay" class="form-input" required min="1" max="10000" value="1000">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="apiKeyModalCancel">Cancel</button>
          <button type="button" class="btn btn-primary" id="apiKeyModalSave">Create API Key</button>
        </div>
      </div>
    `;

    $('body').append(modalHTML);

    // Close handlers
    $('#apiKeyModalClose, #apiKeyModalCancel, #apiKeyModalBackdrop').on('click', () => {
      $('#apiKeyModal, #apiKeyModalBackdrop').remove();
    });

    // Save handler
    $('#apiKeyModalSave').on('click', async () => {
      const formData = {
        name: $('#apiKeyName').val(),
        freeLookup: $('#freeLookup').prop('checked'),
        premiumLookup: $('#premiumLookup').prop('checked'),
        requestsPerMinute: parseInt($('#requestsPerMinute').val()),
        requestsPerDay: parseInt($('#requestsPerDay').val())
      };

      try {
        await this.createApiKey(formData);
        $('#apiKeyModal, #apiKeyModalBackdrop').remove();
        await this.loadApiKeys();
        this.updateSidebarBadges();
      } catch (error) {
        Domma.elements.toast(error.message || 'Failed to create API key', { type: 'error' });
      }
    });
  }

  async createApiKey(data) {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/keys`, {
        method: 'POST',
        headers: {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          permissions: {
            freeLookup: data.freeLookup,
            premiumLookup: data.premiumLookup
          },
          rateLimit: {
            requestsPerMinute: data.requestsPerMinute,
            requestsPerDay: data.requestsPerDay
          }
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create API key');
      }

      // Show the API key (only shown once)
      await Domma.elements.alert(
        `API Key created successfully!\n\nYour API key is:\n\n${responseData.apiKey.key}\n\n` +
        `IMPORTANT: Copy this key now. You won't be able to see it again!`,
        { title: 'API Key Created' }
      );

      return responseData;

    } catch (error) {
      console.error('Create API key error:', error);
      throw error; // Let Domma.forms handle the error display
    }
  }

  async toggleApiKey(id, isActive) {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/keys/${id}`, {
        method: 'PATCH',
        headers: {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update API key');
      }

      Domma.elements.toast(`API key ${isActive ? 'enabled' : 'disabled'}`, { type: 'success' });
      await this.loadApiKeys();

      // Update sidebar badge
      this.updateSidebarBadges();

    } catch (error) {
      console.error('Toggle API key error:', error);
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }

  async deleteApiKey(id) {
    const confirmed = await Domma.elements.confirm(
      'Are you sure you want to delete this API key? This action cannot be undone.',
      { title: 'Confirm Delete' }
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${this.config.apiUrl}/address/keys/${id}`, {
        method: 'DELETE',
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete API key');
      }

      Domma.elements.toast('API key deleted', { type: 'success' });
      await this.loadApiKeys();

      // Update sidebar badge
      this.updateSidebarBadges();

    } catch (error) {
      console.error('Delete API key error:', error);
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }

  async showApiKeyStats(id) {
    try {
      // Fetch per-key statistics
      const response = await fetch(`${this.config.apiUrl}/address/keys/${id}/stats`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load key statistics');
      }

      const { stats } = await response.json();

      // Build statistics modal content
      const statsHtml = `
        <div class="mb-4">
          <h5 class="mb-3">Usage Statistics</h5>
          <div class="row">
            <div class="col-6 mb-3">
              <div class="text-muted small">Total Requests</div>
              <div class="h4 mb-0">${stats.totalRequests || 0}</div>
            </div>
            <div class="col-6 mb-3">
              <div class="text-muted small">Free Lookups</div>
              <div class="h4 mb-0">${stats.freeLookups || 0}</div>
            </div>
            <div class="col-6 mb-3">
              <div class="text-muted small">Premium Lookups</div>
              <div class="h4 mb-0">${stats.premiumLookups || 0}</div>
            </div>
            <div class="col-6 mb-3">
              <div class="text-muted small">Cache Hits</div>
              <div class="h4 mb-0">${stats.cacheHits || 0}</div>
            </div>
          </div>
        </div>

        ${stats.lastUsedAt ? `
          <div class="mb-4">
            <h5 class="mb-3">Last Activity</h5>
            <p class="mb-0">
              <strong>Last Used:</strong> ${D(stats.lastUsedAt).fromNow()}
              <span class="text-muted">(${D(stats.lastUsedAt).format('D MMM YYYY HH:mm')})</span>
            </p>
          </div>
        ` : ''}

        ${stats.dailyBreakdown && stats.dailyBreakdown.length > 0 ? `
          <div class="mb-4">
            <h5 class="mb-3">Last 7 Days Activity</h5>
            <div class="list-group">
              ${stats.dailyBreakdown.slice(0, 7).map(day => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  <span>${D(day._id).format('ddd, D MMM')}</span>
                  <span class="badge badge-primary">${day.count} requests</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="alert alert-info mb-0">
          <span data-icon="info"></span>
          <strong>Note:</strong> Statistics are based on logged usage data and may not reflect all activity.
        </div>
      `;

      // Create modal using Domma.elements
      const modal = Domma.elements.modal({
        title: 'API Key Statistics',
        content: statsHtml,
        footer: `
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        `,
        size: 'medium'
      });

      modal.show();

      // Scan icons in modal
      if (Domma.icons) {
        Domma.icons.scan();
      }

    } catch (error) {
      console.error('Load API key stats error:', error);
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }

  async regenerateApiKey(id) {
    // Show confirmation dialog
    const confirmed = await Domma.elements.confirm(
      'Are you sure you want to regenerate this API key? The old key will stop working immediately and cannot be recovered.',
      {
        title: 'Regenerate API Key',
        confirmText: 'Regenerate',
        cancelText: 'Cancel'
      }
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${this.config.apiUrl}/address/keys/${id}/regenerate`, {
        method: 'POST',
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to regenerate API key');
      }

      const { key, keyPrefix } = await response.json();

      // Show new key in modal (ONE TIME ONLY)
      const newKeyHtml = `
        <div class="alert alert-warning mb-4">
          <span data-icon="alert-triangle"></span>
          <strong>Important:</strong> This is the only time you'll see the full key. Copy it now!
        </div>

        <div class="mb-4">
          <label class="form-label">New API Key</label>
          <div class="input-group">
            <input type="text" class="form-control font-monospace" id="newApiKeyValue" value="${_.escape(key)}" readonly>
            <button class="btn btn-primary" type="button" id="copyNewKeyBtn">
              <span data-icon="copy"></span> Copy
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Key Prefix (for identification)</label>
          <input type="text" class="form-control font-monospace" value="${_.escape(keyPrefix)}••••••••" readonly>
        </div>

        <p class="text-muted mb-0">
          <span data-icon="info"></span>
          Store this key securely. You won't be able to see it again after closing this dialog.
        </p>
      `;

      const modal = Domma.elements.modal({
        title: 'API Key Regenerated',
        content: newKeyHtml,
        footer: `
          <button type="button" class="btn btn-primary" data-dismiss="modal">I've Saved It</button>
        `,
        size: 'medium',
        backdrop: 'static',  // Prevent closing by clicking outside
        keyboard: false      // Prevent closing with ESC key
      });

      modal.show();

      // Scan icons in modal
      if (Domma.icons) {
        Domma.icons.scan();
      }

      // Bind copy button
      $('#copyNewKeyBtn').on('click', async () => {
        const keyValue = document.getElementById('newApiKeyValue').value;
        try {
          await _.copyToClipboard(keyValue);
          Domma.elements.toast('API key copied to clipboard!', { type: 'success' });
          $('#copyNewKeyBtn').html('<span data-icon="check"></span> Copied!');
          setTimeout(() => {
            $('#copyNewKeyBtn').html('<span data-icon="copy"></span> Copy');
            if (Domma.icons) Domma.icons.scan();
          }, 2000);
        } catch (error) {
          Domma.elements.toast('Failed to copy', { type: 'error' });
        }
      });

      // Reload API keys list after modal closes
      modal.on('hide', async () => {
        await this.loadApiKeys();
        this.updateSidebarBadges();
      });

      Domma.elements.toast('API key regenerated successfully', { type: 'success' });

    } catch (error) {
      console.error('Regenerate API key error:', error);
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  async loadDashboard() {
    // Initialize with 30 days by default
    if (!this.statsDays) {
      this.statsDays = 30;
    }

    // Render date range controls
    this.renderDashboardControls();

    await Promise.all([
      this.loadStats(this.statsDays),
      this.loadRecentLookups()
    ]);
  }

  async loadRecentLookups() {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/recent?limit=10`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.warn('[loadRecentLookups] Failed:', response.status);
        return;
      }

      const data = await response.json();
      this.renderRecentLookups(data.lookups);

    } catch (error) {
      console.error('Load recent lookups error:', error);
    }
  }

  renderRecentLookups(lookups) {
    if (!lookups || lookups.length === 0) {
      $('#recentLookups').html('<p class="text-muted">No recent lookups</p>');
      return;
    }

    // Prepare data for DataTable
    const tableData = lookups.map(lookup => ({
      postcode: lookup.postcode,
      type: lookup.lookupType || 'validate',
      source: lookup.source || 'Web UI',
      time: lookup.createdAt
    }));

    // Clear container and add card
    $('#recentLookups').html(`
      <div class="card">
        <div class="card-header">
          <h3 class="h5 mb-0">Recent Lookups</h3>
        </div>
        <div class="card-body">
          <div id="recentLookupsTable"></div>
        </div>
      </div>
    `);

    // Create DataTable
    if (this.recentLookupsTable) {
      this.recentLookupsTable.destroy();
    }

    this.recentLookupsTable = Domma.tables.create('#recentLookupsTable', {
      data: tableData,
      columns: [
        {
          key: 'postcode',
          title: 'Postcode',
          render: (value) => `<strong>${_.escape(value)}</strong>`
        },
        {
          key: 'type',
          title: 'Type',
          render: (value) => {
            const badgeClass = value === 'full' ? 'primary' : 'secondary';
            return `<span class="badge badge-${badgeClass}">${_.escape(value)}</span>`;
          }
        },
        {
          key: 'source',
          title: 'Source',
          render: (value) => `<span class="text-muted">${_.escape(value)}</span>`
        },
        {
          key: 'time',
          title: 'When',
          render: (value) => D(value).fromNow()
        }
      ],
      pagination: {
        enabled: true,
        pageSize: 5
      },
      search: true,
      responsive: true,
      striped: true
    });
  }

  renderDashboardControls() {
    const controlsHtml = `
      <div class="dashboard-controls mb-4" style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-sm ${this.statsDays === 7 ? 'btn-primary' : 'btn-outline-primary'}" data-days="7">7 Days</button>
        <button class="btn btn-sm ${this.statsDays === 30 ? 'btn-primary' : 'btn-outline-primary'}" data-days="30">30 Days</button>
        <button class="btn btn-sm ${this.statsDays === 90 ? 'btn-primary' : 'btn-outline-primary'}" data-days="90">90 Days</button>
        <div style="flex: 1;"></div>
        <button id="exportStatsBtn" class="btn btn-sm btn-outline-primary">
          <span data-icon="download" data-icon-size="14"></span> Export CSV
        </button>
      </div>
    `;

    // Check if controls already exist
    if ($('.dashboard-controls').length) {
      // Just update button states
      $('.dashboard-controls button[data-days]').each((idx, btn) => {
        const days = parseInt($(btn).data('days'));
        if (days === this.statsDays) {
          $(btn).removeClass('btn-outline-primary').addClass('btn-primary');
        } else {
          $(btn).removeClass('btn-primary').addClass('btn-outline-primary');
        }
      });
    } else {
      // Insert and bind events for first time
      $('#statsGrid').before(controlsHtml);

      // Bind events using event delegation on parent
      $('#dashboardSection').on('click', '.dashboard-controls button[data-days]', (e) => {
        const days = parseInt($(e.currentTarget).data('days'));
        this.statsDays = days;
        this.loadStats(days);
      });

      $('#dashboardSection').on('click', '#exportStatsBtn', () => this.exportStatsToCSV());

      // Scan icons
      if (Domma.icons) {
        Domma.icons.scan();
      }
    }
  }

  async loadStats(days = 30) {
    try {
      const response = await fetch(`${this.config.apiUrl}/address/stats?days=${days}`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.warn('[loadStats] Failed:', response.status);
        return;
      }

      const data = await response.json();

      // Store for export
      this.currentStats = data.stats;
      this.currentDailyBreakdown = data.dailyBreakdown;

      this.renderStats(data.stats, data.dailyBreakdown);

      // Re-render controls to update active button
      this.renderDashboardControls();

    } catch (error) {
      console.error('Load stats error:', error);
    }
  }

  renderStats(stats, dailyBreakdown) {
    const html = `
      <div class="stat-card">
        <div class="stat-label">Total Lookups</div>
        <div class="stat-value">${stats.totalLookups}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Free Lookups</div>
        <div class="stat-value">${stats.freeLookups}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Premium Lookups</div>
        <div class="stat-value">${stats.premiumLookups}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cache Hit Rate</div>
        <div class="stat-value">${(stats.cacheHitRate * 100).toFixed(0)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Credits Spent</div>
        <div class="stat-value">${stats.creditsCharged}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Response Time</div>
        <div class="stat-value">${stats.avgResponseTime}ms</div>
      </div>
    `;

    $('#statsGrid').html(html);

    // Render daily breakdown with bar chart
    if (dailyBreakdown && dailyBreakdown.length > 0) {
      // Prepare data for bar chart (last 14 days, reversed for chronological order)
      const chartData = dailyBreakdown.slice(0, 14).reverse().map(day => ({
        label: D(day._id).format('D MMM'),
        value: day.count
      }));

      const chartHtml = `
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="h5 mb-0">Usage Over Time</h3>
          </div>
          <div class="card-body">
            <dm-bar-chart id="usageBarChart" data='${JSON.stringify(chartData)}' show-values="true"></dm-bar-chart>
            <div id="usageBreakdownTable" class="mt-3"></div>
          </div>
        </div>
      `;

      $('#usageChart').html(chartHtml);

      // Create DataTable for usage breakdown
      const usageTableData = dailyBreakdown.slice(0, 14).map(day => ({
        date: day._id,
        lookups: day.count,
        cacheHits: day.cacheHits,
        cacheHitRate: day.count > 0 ? ((day.cacheHits / day.count) * 100).toFixed(0) : 0,
        creditsCharged: day.creditsCharged
      }));

      if (this.usageBreakdownTable) {
        this.usageBreakdownTable.destroy();
      }

      this.usageBreakdownTable = Domma.tables.create('#usageBreakdownTable', {
        data: usageTableData,
        columns: [
          {
            key: 'date',
            title: 'Date',
            render: (value) => D(value).format('D MMM YYYY')
          },
          {
            key: 'lookups',
            title: 'Lookups',
            render: (value) => `<strong>${value}</strong>`
          },
          {
            key: 'cacheHits',
            title: 'Cache Hits',
            render: (value, row) => `${value} (${row.cacheHitRate}%)`
          },
          {
            key: 'creditsCharged',
            title: 'Credits Used'
          }
        ],
        pagination: {
          enabled: true,
          pageSize: 7
        },
        search: false,
        responsive: true,
        striped: true
      });
    }
  }

  exportStatsToCSV() {
    if (!this.currentStats || !this.currentDailyBreakdown) {
      Domma.elements.toast('No data to export', { type: 'warning' });
      return;
    }

    const stats = this.currentStats;
    const daily = this.currentDailyBreakdown;

    // Create CSV content
    let csv = 'Address Lookup Statistics Export\n';
    csv += `Generated: ${D().format('YYYY-MM-DD HH:mm:ss')}\n`;
    csv += `Period: Last ${this.statsDays} days\n\n`;

    // Summary stats
    csv += 'Summary Statistics\n';
    csv += 'Metric,Value\n';
    csv += `Total Lookups,${stats.totalLookups}\n`;
    csv += `Free Lookups,${stats.freeLookups}\n`;
    csv += `Premium Lookups,${stats.premiumLookups}\n`;
    csv += `Cache Hit Rate,${(stats.cacheHitRate * 100).toFixed(2)}%\n`;
    csv += `Credits Spent,${stats.creditsCharged}\n`;
    csv += `Avg Response Time,${stats.avgResponseTime}ms\n\n`;

    // Daily breakdown
    csv += 'Daily Breakdown\n';
    csv += 'Date,Lookups,Cache Hits,Cache Hit %,Credits Used\n';
    daily.forEach(day => {
      const hitRate = day.count > 0 ? ((day.cacheHits / day.count) * 100).toFixed(2) : '0.00';
      csv += `${D(day._id).format('YYYY-MM-DD')},${day.count},${day.cacheHits},${hitRate}%,${day.creditsCharged}\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `address-lookup-stats-${D().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Domma.elements.toast('Statistics exported successfully', { type: 'success' });
  }

  // ============================================================================
  // CONTACT
  // ============================================================================

  renderContactSection() {
    const user = Domma.auth.getUser();
    const container = $('#contactSection');

    container.html(`
      <h2 class="mb-4">Contact Us</h2>
      <div class="contact-grid row">
        <div class="col-12 col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h3 class="h5 mb-3">Get in Touch</h3>
              <p class="text-muted mb-4">
                Have questions about Address Lookup or need help with your integration?
              </p>

              <div class="contact-methods">
                <div class="contact-method mb-3">
                  <span data-icon="mail" data-icon-size="20"></span>
                  <span>support@domma.dev</span>
                </div>
                <div class="contact-method mb-3">
                  <span data-icon="clock" data-icon-size="20"></span>
                  <span>Response within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-8">
          <div class="card">
            <div class="card-body">
              <h3 class="h5 mb-4">Send us a Message</h3>
              <div id="contactFormContainer"></div>
            </div>
          </div>
        </div>
      </div>
    `);

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Create contact form with blueprint - pre-fill with user data
    const formData = {
      name: user?.name || '',
      email: user?.email || '',
      projectType: 'support',
      details: ''
    };

    // Use Domma.forms.render() - it returns array-indexed data when using fields array
    // Map array indices to field names: 0=name, 1=email, 2=projectType, 3=details
    Domma.forms.render('#contactFormContainer', contactBlueprint.fields, formData, {
      onSubmit: async (data) => {
        try {
          // Map array indices to field names or use named properties as fallback
          const contactData = {
            name: data[0] || data.name || formData.name,
            email: data[1] || data.email || formData.email,
            // Map miniapp project types to backend expected values
            projectType: 'other',  // Use 'other' for all Address Lookup enquiries
            details: data[3] || data.details || formData.details,
            phone: '',
            company: '',
            timeline: '',
            website: ''  // Honeypot field - should always be empty
          };

          console.log('[Contact] Mapped data:', contactData);

          const response = await fetch(`${this.config.apiUrl}/contact`, {
            method: 'POST',
            headers: {
              ...Domma.auth.getHeaders(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
          });

          if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to send message');
          }

          Domma.elements.toast('Message sent! We\'ll respond within 24 hours.', { type: 'success' });
          return true;  // Reset form on success

        } catch (error) {
          console.error('Contact form error:', error);
          Domma.elements.toast(error.message || 'Failed to send message', { type: 'error' });
          return false;
        }
      },
      submitText: 'Send Message',
      layout: 'stacked'
    });
  }
}

// Initialize app and make it globally accessible
window.addressApp = new AddressApp();
