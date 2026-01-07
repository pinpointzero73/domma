/**
 * Nexus Contact Manager - Main Application
 * Powered by Forma schema-driven forms (80% code reduction vs manual implementation)
 */

import NexusStorage from './storage.js';
import {importSchema} from './schemas.js';

class NexusApp {
  constructor() {
    this.storage = null;
    this.currentUser = null;
    this.contacts = [];
    this.groups = [];
    this.currentView = 'contacts';
    this.selectedContact = null;
    this.contactsTable = null;
    this.groupsTable = null;

    // DOM elements
    this.elements = {};

    // Initialize app
    this.init();
  }

  /**
   * Initialize application
   */
  async init() {
    console.log('DEBUG: Init method called - starting initialization');
    try {
      // Initialize Domma authentication
      console.log('DEBUG: About to call initAuth()');
      await this.initAuth();

      // Initialize storage
      this.initStorage();

      // Initialize UI
      this.initUI();

      // Load initial data
      await this.loadData();

      // Bind events
      this.bindEvents();

      // Update toolbar for initial view
      console.log('DEBUG: About to call updateToolbar(), method exists:', typeof this.updateToolbar);
      this.updateToolbar();
      console.log('DEBUG: Called updateToolbar()');

      console.log('✓ Nexus Contact Manager initialized');
    } catch (error) {
      console.error('✗ Failed to initialize Nexus:', error);
      this.showError('Failed to initialize Contact Manager');
    }
  }

  /**
   * Initialize authentication
   */
  async initAuth() {
    // BYPASS AUTH FOR TESTING
    this.showApp();
    return;

    // Initialize Domma.auth module
    Domma.auth.init({
      apiUrl: 'http://localhost:3000/api'
    });

    // Listen to auth events
    Domma.auth.on('login', () => {
      console.log('DEBUG: Auth login event fired');
      this.currentUser = Domma.auth.user;
      this.storage?.setToken(Domma.auth.token);
      this.showApp();
    });

    Domma.auth.on('register', () => {
      console.log('DEBUG: Auth register event fired');
      this.currentUser = Domma.auth.user;
      this.storage?.setToken(Domma.auth.token);
      this.showApp();
    });

    Domma.auth.on('logout', () => {
      console.log('DEBUG: Auth logout event fired - HIDING APP');
      this.currentUser = null;
      this.storage?.setToken(null);
      this.hideApp();
    });

    Domma.auth.on('tokenExpired', () => {
      console.log('DEBUG: Auth tokenExpired event fired - HIDING APP');
      this.currentUser = null;
      this.storage?.setToken(null);
      this.hideApp();
      this.showToast('Session expired. Please login again.', 'error');
    });

    Domma.auth.on('error', (message) => {
      console.log('DEBUG: Auth error event fired:', message);
      this.showToast(`Authentication error: ${message}`, 'error');
    });

    // Check if already authenticated
    if (Domma.auth.isAuthenticated()) {
      this.currentUser = Domma.auth.user;
      this.storage?.setToken(Domma.auth.token);
      this.showApp();
    } else {
      // TEMPORARY: Skip auth for testing - show app anyway
      console.log('DEBUG: Skipping authentication for testing');
      this.showApp();
    }
  }

  /**
   * Initialize storage
   */
  initStorage() {
    this.storage = new NexusStorage({
      apiUrl: window.location.origin + '/api'
    });

    // Set token if user is logged in
    if (this.currentUser?.token) {
      this.storage.setToken(this.currentUser.token);
    }

    // Listen for storage events
    this.storage.on('online', () => {
      this.updateConnectionStatus(true);
      this.showToast('Back online - syncing data...', 'success');
    });

    this.storage.on('offline', () => {
      this.updateConnectionStatus(false);
      this.showToast('Working offline - changes will sync when online', 'warning');
    });

    this.storage.on('sync-complete', (data) => {
      if (data.processed > 0) {
        this.showToast(`Synced ${data.processed} items`, 'success');
        this.loadData(); // Refresh UI
      }
    });
  }

  /**
   * Initialize UI components
   */
  initUI() {
    // Cache DOM elements
    this.elements = {
      app: $('#nexus-app'),
      loginPrompt: $('#login-prompt'),
      mainContent: $('#main-content'),
      groupsList: $('#groups-list'),
      syncStatus: $('#sync-status'),
      connectionStatus: $('#connection-status')
    };

    // Initialize Domma tables
    this.initContactsTable();
    this.initGroupsTable();

    // Initialize view tabs
    this.initTabs();

    // Initialize toolbar
    this.initToolbar();
  }

  /**
   * Initialize Domma contacts table
   */
  initContactsTable() {
    const columns = [
      {
        key: 'name',
        title: 'Name',
        render: (contact) => {
          if (!contact) return '';
          const star = contact.favourite ? '<span data-icon="star" style="color: #f59e0b; margin-left: 0.5rem;"></span>' : '';
          return `${contact.firstName || ''} ${contact.lastName || ''}${star}`;
        }
      },
      {
        key: 'email',
        title: 'Email',
        render: (contact) => contact?.email || '-'
      },
      {
        key: 'phone',
        title: 'Phone',
        render: (contact) => contact?.phone || '-'
      },
      {
        key: 'company',
        title: 'Company',
        render: (contact) => contact?.company || '-'
      },
      {
        key: 'groups',
        title: 'Groups',
        sortable: false,
        render: (contact) => {
          if (!contact || !contact.groups?.length) return '-';
          const groupNames = contact.groups.map(groupId => {
            const group = this.groups.find(g => (g.id || g._id) === groupId);
            return group ? group.name : groupId;
          });
          return groupNames.map(name =>
            `<span class="badge badge-secondary-soft">${name}</span>`
          ).join(' ');
        }
      },
      {
        key: 'tags',
        title: 'Tags',
        sortable: false,
        render: (contact) => {
          if (!contact?.tags?.length) return '-';
          return contact.tags.map(tag =>
            `<span class="badge badge-primary-soft">${tag}</span>`
          ).join(' ');
        }
      },
      {
        key: 'actions',
        title: 'Actions',
        sortable: false,
        render: (contact) => {
          if (!contact) return '';
          const contactId = contact.id || contact._id;
          return `
                        <button class="btn btn-sm btn-secondary" onclick="nexusApp.editContact('${contactId}')" title="Edit">
                            <span data-icon="edit"></span>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="nexusApp.deleteContact('${contactId}')" title="Delete">
                            <span data-icon="trash"></span>
                        </button>
                    `;
        }
      }
    ];

    this.contactsTable = Domma.tables.create('#contacts-table', {
      data: [],
      columns: columns,
      pagination: true,
      pageSize: 25,
      selectable: true,
      selectionMode: 'multiple',
      exportPanel: true,
      columnToggle: true,
      regexSearch: true,
      striped: true,
      evenRowColor: 'lighter',
      oddRowColor: 'light',
      hoverColor: 'medium'
    });

    // Listen for table events
    this.contactsTable.on('rowSelect', (event) => {
      console.log('Selected contacts:', event.selectedRows);
    });
  }

  /**
   * Initialize Domma groups table
   */
  initGroupsTable() {
    const columns = [
      {
        key: 'name',
        title: 'Name',
        render: (group) => {
          if (!group) return '';
          const colorIndicator = `<div style="width: 12px; height: 12px; border-radius: 50%; ${group.colorStyle || `background-color: ${group.colour || '#3b82f6'}`}; display: inline-block; margin-right: 0.5rem;"></div>`;
          return `${colorIndicator}${group.name || ''}`;
        }
      },
      {
        key: 'type',
        title: 'Type',
        render: (group) => group?.type || '-'
      },
      {
        key: 'contactCount',
        title: 'Contact Count',
        render: (group) => group?.contactCount || 0
      },
      {
        key: 'description',
        title: 'Description',
        render: (group) => group?.description || '-'
      },
      {
        key: 'actions',
        title: 'Actions',
        sortable: false,
        render: (group) => {
          if (!group) return '';
          const groupId = group.id || group._id;
          return `
                        <button class="btn btn-sm btn-secondary" onclick="nexusApp.editGroup('${groupId}')" title="Edit">
                            <span data-icon="edit"></span>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="nexusApp.deleteGroup('${groupId}')" title="Delete">
                            <span data-icon="trash"></span>
                        </button>
                    `;
        }
      }
    ];

    this.groupsTable = Domma.tables.create('#groups-table', {
      data: [],
      columns: columns,
      pagination: true,
      pageSize: 25,
      selectable: true,
      selectionMode: 'multiple',
      exportPanel: true,
      columnToggle: true,
      regexSearch: true,
      striped: true,
      evenRowColor: 'lighter',
      oddRowColor: 'light',
      hoverColor: 'medium'
    });

    // Listen for table events
    this.groupsTable.on('rowSelect', (event) => {
      console.log('Selected groups:', event.selectedRows);
    });
  }

  /**
   * Initialize navigation tabs
   */
  initTabs() {
    $('.tab-nav button').on('click', (e) => {
      const tab = $(e.target).data('tab');
      this.switchView(tab);
    });
  }

  /**
   * Initialize toolbar actions
   */
  initToolbar() {
    console.log('DEBUG: initToolbar() called');
    console.log('DEBUG: Looking for add-contact-btn element:', !!$('#add-contact-btn').length);
    console.log('DEBUG: Element exists?', document.getElementById('add-contact-btn'));

    // Wait for DOM to be ready
    setTimeout(() => {
      console.log('DEBUG: Delayed check - add-contact-btn element:', !!$('#add-contact-btn').length);

      // Remove existing event handlers to prevent duplicates
      $('#add-contact-btn').off('click');

      // Add contact button
      $('#add-contact-btn').on('click', (event) => {
        event.preventDefault();
        console.log('🎯 Add Contact button clicked!');
        try {
          this.showContactForm();
        } catch (error) {
          console.error('ERROR calling showContactForm:', error);
          this.showToast('Error opening contact form: ' + error.message, 'error');
        }
      });

      console.log('DEBUG: Event listener attached to add-contact-btn');
    }, 100);

    // Remove existing event handlers to prevent duplicates
    $('#add-group-btn, #import-btn, #settings-btn, #sync-btn').off('click');

    // Add group button
    $('#add-group-btn').on('click', () => this.showGroupForm());

    // Import button
    $('#import-btn').on('click', () => this.showImportForm());

    // Settings button
    $('#settings-btn').on('click', () => this.showSettings());

    // Sync button
    $('#sync-btn').on('click', () => this.forceSync());
  }

  /**
   * Bind additional events
   */
  bindEvents() {
    // Window events
    $(window).on('beforeunload', () => {
      // Attempt to sync before leaving
      if (this.storage.syncQueue.length > 0) {
        this.storage.forceSync().catch(() => {
        });
      }
    });
  }

  /**
   * Load data from storage
   */
  async loadData() {
    try {
      this.showLoading(true);

      // Load contacts and groups in parallel
      const [contacts, groups] = await Promise.all([
        this.storage.getContacts(),
        this.storage.getGroups()
      ]);

      this.contacts = contacts || [];
      this.groups = groups || [];

      // Update UI
      this.contactsTable.setData(this.contacts);
      this.groupsTable.setData(this.groups);
      this.updateSyncStatus();

      // Scan icons after table update
      setTimeout(() => Domma.icons.scan(), 100);

    } catch (error) {
      console.error('Failed to load data:', error);
      this.showError('Failed to load contacts');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Switch between views (contacts/groups)
   */
  switchView(view) {
    this.currentView = view;

    // Update active tab
    $('.tab-nav button').removeClass('active');
    $(`.tab-nav button[data-tab="${view}"]`).addClass('active');

    // Update content visibility
    $('.tab-content').removeClass('active');
    $(`#${view}-view`).addClass('active');

    // Update toolbar
    this.updateToolbar();
  }

  /**
   * Update toolbar for current view
   */
  updateToolbar() {
    console.log('DEBUG: updateToolbar called, currentView:', this.currentView);

    // Show both buttons always - users should be able to add contacts or groups from any view
    console.log('DEBUG: Showing both add-contact-btn and add-group-btn');
    $('#add-contact-btn').show();
    $('#add-group-btn').show();

    console.log('DEBUG: updateToolbar completed - both buttons visible');
  }

  /**
   * Refresh contacts table
   */
  refreshContactsTable() {
    this.contactsTable.setData(this.contacts);
    setTimeout(() => Domma.icons.scan(), 100);
  }

  /**
   * Refresh groups table
   */
  refreshGroupsTable() {
    this.groupsTable.setData(this.groups);
    setTimeout(() => Domma.icons.scan(), 100);
  }


  /**
   * Update sync status display
   */
  updateSyncStatus() {
    const status = this.storage.getSyncStatus();
    const statusEl = this.elements.syncStatus;

    if (status.queueSize > 0) {
      statusEl.html(`
                <span data-icon="refresh-cw" class="icon spinning"></span>
                ${status.queueSize} pending sync
            `).addClass('has-pending');
    } else {
      const lastSync = status.lastSync ?
        new Date(status.lastSync).toLocaleTimeString() :
        'Never';

      statusEl.html(`
                <span data-icon="check" class="icon"></span>
                Last sync: ${lastSync}
            `).removeClass('has-pending');
    }
  }

  /**
   * Update connection status display
   */
  updateConnectionStatus(isOnline) {
    const statusEl = this.elements.connectionStatus;

    if (isOnline) {
      statusEl.html(`
                <span data-icon="wifi" class="icon"></span>
                Online
            `).removeClass('offline').addClass('online');
    } else {
      statusEl.html(`
                <span data-icon="wifi-off" class="icon"></span>
                Offline
            `).removeClass('online').addClass('offline');
    }
  }

  // ============================================================================
  // CONTACT MANAGEMENT (POWERED BY FORMA)
  // ============================================================================

  /**
   * Show contact form (create/edit) - direct slideover creation
   */
  async showContactForm(contactId = null) {
    console.log('📝 showContactForm called with contactId:', contactId);

    const isEdit = !!contactId;
    const contact = isEdit ?
      this.contacts.find(c => (c.id || c._id) === contactId) :
      {};

    // Toggle form display
    const existingForm = document.getElementById('contact-form-card');
    if (existingForm) {
      existingForm.remove();
      return;
    }

    // Create card container
    const cardHtml = `
            <div id="contact-form-card" class="card mt-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">${isEdit ? 'Edit Contact' : 'Add New Contact'}</h5>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('contact-form-card').remove()">
                        <span data-icon="x"></span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row g-3" id="contact-form-container"></div>
                </div>
            </div>
        `;

    // Insert form after toolbar
    const toolbar = document.querySelector('.toolbar, .d-flex.justify-content-between');
    if (toolbar) {
      toolbar.insertAdjacentHTML('afterend', cardHtml);
    } else {
      const container = document.querySelector('#contacts-view, .container-fluid');
      if (container) {
        container.insertAdjacentHTML('afterbegin', cardHtml);
      }
    }

    // Create Forma form with proper schema
    const formSchema = {
      firstName: {
        type: 'string',
        label: 'First Name',
        required: true,
        formConfig: {placeholder: 'Enter first name'}
      },
      lastName: {
        type: 'string',
        label: 'Last Name',
        required: true,
        formConfig: {placeholder: 'Enter last name'}
      },
      email: {
        type: 'email',
        label: 'Email',
        required: true,
        formConfig: {placeholder: 'contact@example.com'}
      },
      phone: {
        type: 'tel',
        label: 'Phone',
        formConfig: {placeholder: '+44 20 1234 5678'}
      },
      company: {
        type: 'string',
        label: 'Company',
        formConfig: {placeholder: 'Company name'}
      },
      jobTitle: {
        type: 'string',
        label: 'Job Title',
        formConfig: {placeholder: 'Position/role'}
      },
      notes: {
        type: 'textarea',
        label: 'Notes',
        formConfig: {rows: 3, placeholder: 'Additional notes'}
      }
    };

    const formOptions = {
      cssFramework: 'domma',
      fieldClassName: 'col-md-6 mb-3',
      layout: 'grid',
      onSubmit: async (formData) => {
        try {
          await this.saveContactFromForm(formData, isEdit, contactId);
          document.getElementById('contact-form-card').remove();
          this.showToast(isEdit ? 'Contact updated successfully' : 'Contact created successfully', 'success');
        } catch (error) {
          console.error('Error saving contact:', error);
          this.showToast('Failed to save contact', 'error');
        }
        return false;
      }
    };

    // Special field classes for layout
    formSchema.email.formConfig.fieldClassName = 'col-md-8 mb-3';
    formSchema.phone.formConfig.fieldClassName = 'col-md-4 mb-3';
    formSchema.notes.formConfig.fieldClassName = 'col-12 mb-3';

    // Create the form using Domma.forms
    const form = Domma.forms.create(formSchema, contact || {}, formOptions);
    form.renderTo('#contact-form-container');

    // Scan for icons
    setTimeout(() => Domma.icons.scan(), 100);
  }

  showCustomContactModal(contact, isEdit, contactId) {
    // Remove any existing slideover
    $('#contact-slideover').remove();

    // Create slideover HTML - much simpler than modal!
    const slideoverHtml = `
            <div id="contact-slideover" style="
                position: fixed;
                top: 0;
                right: -75%;
                width: 75%;
                height: 100vh;
                background: white;
                box-shadow: -2px 0 8px rgba(0,0,0,0.15);
                z-index: 9999;
                transition: right 0.3s ease;
                overflow-y: auto;
                border-left: 1px solid #ddd;
            ">
                <div style="padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
                        <h2 style="margin: 0; font-size: 1.5rem; color: #333;">${isEdit ? 'Edit Contact' : 'Add Contact'}</h2>
                        <button id="close-slideover" style="
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            color: #666;
                            padding: 0.5rem;
                        ">&times;</button>
                    </div>
                    
                    <form id="contact-slideover-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">First Name *</label>
                            <input type="text" name="firstName" value="${contact.firstName || ''}" 
                                   placeholder="Enter first name" required
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">Last Name *</label>
                            <input type="text" name="lastName" value="${contact.lastName || ''}" 
                                   placeholder="Enter last name" required
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">Email *</label>
                            <input type="email" name="email" value="${contact.email || ''}" 
                                   placeholder="contact@example.com" required
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">Phone</label>
                            <input type="tel" name="phone" value="${contact.phone || ''}" 
                                   placeholder="+44 20 1234 5678"
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">Company</label>
                            <input type="text" name="company" value="${contact.company || ''}" 
                                   placeholder="Company name"
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333;">Job Title</label>
                            <input type="text" name="jobTitle" value="${contact.jobTitle || ''}" 
                                   placeholder="Position/role"
                                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        </div>
                    </form>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
                        <button type="button" id="slideover-cancel" class="btn btn-secondary" style="flex: 1; padding: 0.75rem; border: 1px solid #ddd; background: white; cursor: pointer;">Cancel</button>
                        <button type="button" id="slideover-save" class="btn btn-primary" style="flex: 1; padding: 0.75rem; background: #007bff; color: white; border: none; cursor: pointer;">Save Contact</button>
                    </div>
                </div>
            </div>
        `;

    // Add slideover to page
    $('body').append(slideoverHtml);

    // Animate slideover in
    setTimeout(() => {
      $('#contact-slideover').css('right', '0');
    }, 10);

    const self = this;

    // Close handlers
    $('#close-slideover, #slideover-cancel').on('click', function () {
      $('#contact-slideover').css('right', '-75%');
      setTimeout(() => $('#contact-slideover').remove(), 300);
    });

    // Save handler
    $('#slideover-save').on('click', function () {
      console.log('🔧 Slideover save clicked!');

      // Get form data
      const form = document.getElementById('contact-slideover-form');
      const formData = new FormData(form);
      const contactData = {};

      for (let [key, value] of formData.entries()) {
        contactData[key] = value.trim();
      }

      console.log('🔧 Slideover form data:', contactData);

      // Validate required fields
      if (!contactData.firstName || !contactData.lastName || !contactData.email) {
        alert('Please fill in First Name, Last Name, and Email');
        return;
      }

      // Create/update contact
      try {
        if (isEdit) {
          console.log('🔧 Updating existing contact');
          const index = self.contacts.findIndex(c => (c.id || c._id) === contactId);
          if (index !== -1) {
            self.contacts[index] = {
              ...self.contacts[index],
              ...contactData,
              updatedAt: new Date().toISOString()
            };
          }
        } else {
          console.log('🔧 Creating new contact');
          const newContact = {
            id: Date.now(),
            ...contactData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          self.contacts.push(newContact);
        }

        console.log('🔧 Contact saved, total contacts:', self.contacts.length);

        // Refresh the table
        self.refreshContactsTable();
        console.log('🔧 Table refreshed');

        // Close slideover with animation
        $('#contact-slideover').css('right', '-75%');
        setTimeout(() => $('#contact-slideover').remove(), 300);

        // Show success message
        alert(`Contact ${isEdit ? 'updated' : 'saved'} successfully! Total contacts: ${self.contacts.length}`);

      } catch (error) {
        console.error('🔧 Save error:', error);
        alert('Error saving contact: ' + error.message);
      }
    });

    // Focus first input after animation
    setTimeout(() => {
      $('#contact-slideover input[name="firstName"]').focus();
    }, 400);

    console.log('🔧 Contact slideover created and displayed');
  }


  saveContactFromSlideover(isEdit, contactId) {
    console.log('💾 saveContactFromSlideover called', {isEdit, contactId});

    // Get form data
    const contactData = {
      firstName: document.getElementById('field-firstName')?.value?.trim() || '',
      lastName: document.getElementById('field-lastName')?.value?.trim() || '',
      email: document.getElementById('field-email')?.value?.trim() || '',
      phone: document.getElementById('field-phone')?.value?.trim() || '',
      company: document.getElementById('field-company')?.value?.trim() || '',
      notes: document.getElementById('field-notes')?.value?.trim() || ''
    };

    console.log('💾 Form data:', contactData);

    // Validate required fields
    if (!contactData.firstName || !contactData.lastName || !contactData.email) {
      alert('Please fill in First Name, Last Name, and Email');
      return;
    }

    try {
      if (isEdit) {
        console.log('💾 Updating existing contact');
        const index = this.contacts.findIndex(c => (c.id || c._id) === contactId);
        if (index !== -1) {
          this.contacts[index] = {
            ...this.contacts[index],
            ...contactData,
            updatedAt: new Date().toISOString()
          };
          console.log('💾 Contact updated successfully');
        }
      } else {
        console.log('💾 Creating new contact');
        const newContact = {
          id: Date.now(),
          ...contactData,
          createdAt: new Date().toISOString()
        };
        this.contacts.push(newContact);
        console.log('💾 Contact created successfully');
      }

      // Refresh table and close slideover
      this.refreshContactsTable();
      this.updateSyncStatus();
      this.currentSlideover?.close();

      // Show success message
      this.showToast(isEdit ? 'Contact updated successfully' : 'Contact created successfully', 'success');

    } catch (error) {
      console.error('💾 Error saving contact:', error);
      this.showToast('Failed to save contact', 'error');
    }
  }

  async saveContactFromForm(formData, isEdit, contactId) {
    console.log('💾 saveContactFromForm called with:', {formData, isEdit, contactId});

    try {
      if (isEdit) {
        console.log('💾 Updating existing contact');
        const index = this.contacts.findIndex(c => (c.id || c._id) === contactId);
        if (index !== -1) {
          this.contacts[index] = {
            ...this.contacts[index],
            ...formData,
            updatedAt: new Date().toISOString()
          };
          console.log('💾 Contact updated successfully');
        }
      } else {
        console.log('💾 Creating new contact');
        const newContact = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        this.contacts.push(newContact);
        console.log('💾 Contact created successfully');
      }

      // Refresh table and update sync status
      this.refreshContactsTable();
      this.updateSyncStatus();

    } catch (error) {
      console.error('💾 Error saving contact:', error);
      throw error; // Re-throw so the slideover can handle it
    }
  }

  /**
   * Create new contact
   */
  async createContact(contactData) {
    console.log('DEBUG: createContact called with:', contactData);
    console.log('DEBUG: About to call this.storage.createContact');

    try {
      const contact = await this.storage.createContact(contactData);
      console.log('DEBUG: Storage returned contact:', contact);

      this.contacts.push(contact);
      console.log('DEBUG: Added contact to local contacts array, total:', this.contacts.length);

      this.refreshContactsTable();
      console.log('DEBUG: Refreshed contacts table');

      this.updateSyncStatus();
      console.log('DEBUG: Updated sync status');

      console.log('DEBUG: createContact completed successfully');
    } catch (error) {
      console.error('DEBUG: createContact error:', error);
      throw error;
    }
  }

  /**
   * Update existing contact
   */
  async updateContact(contactId, updates) {
    const contact = await this.storage.updateContact(contactId, updates);
    const index = this.contacts.findIndex(c => (c.id || c._id) === contactId);

    if (index !== -1) {
      this.contacts[index] = {...this.contacts[index], ...contact};
    }

    this.refreshContactsTable();
    this.updateSyncStatus();
  }

  /**
   * Edit contact (show form)
   */
  editContact(contactId) {
    this.showContactForm(contactId);
  }

  /**
   * Delete contact with confirmation
   */
  async deleteContact(contactId) {
    const contact = this.contacts.find(c => (c.id || c._id) === contactId);
    if (!contact) return;

    const confirmed = await this.showConfirm(
      'Delete Contact',
      `Are you sure you want to delete "${contact.firstName} ${contact.lastName}"?`
    );

    if (confirmed) {
      try {
        await this.storage.deleteContact(contactId);
        this.contacts = this.contacts.filter(c => (c.id || c._id) !== contactId);
        this.refreshContactsTable();
        this.updateSyncStatus();
        this.showToast('Contact deleted successfully', 'success');
      } catch (error) {
        console.error('Failed to delete contact:', error);
        this.showToast('Failed to delete contact', 'error');
      }
    }
  }

  // ============================================================================
  // GROUP MANAGEMENT (POWERED BY FORMA)
  // ============================================================================

  /**
   * Show group form (create/edit)
   */
  async showGroupForm(groupId = null) {
    const isEdit = !!groupId;
    const group = isEdit ?
      this.groups.find(g => (g.id || g._id) === groupId) :
      {};

    // Toggle form display
    const existingForm = document.getElementById('group-form-card');
    if (existingForm) {
      existingForm.remove();
      return;
    }

    // Create card container
    const cardHtml = `
            <div id="group-form-card" class="card mt-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">${isEdit ? 'Edit Group' : 'Add New Group'}</h5>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('group-form-card').remove()">
                        <span data-icon="x"></span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row g-3" id="group-form-container"></div>
                </div>
            </div>
        `;

    // Insert form after toolbar (groups view)
    const toolbar = document.querySelector('#groups-view .toolbar, #groups-view .d-flex.justify-content-between');
    if (toolbar) {
      toolbar.insertAdjacentHTML('afterend', cardHtml);
    } else {
      const container = document.querySelector('#groups-view, .container-fluid');
      if (container) {
        container.insertAdjacentHTML('afterbegin', cardHtml);
      }
    }

    // Create Forma form schema
    const formSchema = {
      name: {
        type: 'string',
        label: 'Group Name',
        required: true,
        formConfig: {placeholder: 'Enter group name'}
      },
      type: {
        type: 'select',
        label: 'Group Type',
        required: true,
        options: [
          {value: 'personal', label: 'Personal'},
          {value: 'work', label: 'Work'},
          {value: 'client', label: 'Client'},
          {value: 'supplier', label: 'Supplier'},
          {value: 'family', label: 'Family'},
          {value: 'friend', label: 'Friends'},
          {value: 'other', label: 'Other'}
        ]
      },
      colour: {
        type: 'color',
        label: 'Colour',
        formConfig: {placeholder: '#3b82f6'}
      },
      description: {
        type: 'textarea',
        label: 'Description',
        formConfig: {
          rows: 3,
          placeholder: 'Optional description for this group',
          fieldClassName: 'col-12 mb-3'
        }
      }
    };

    const formOptions = {
      cssFramework: 'domma',
      fieldClassName: 'col-md-6 mb-3',
      layout: 'grid',
      onSubmit: async (formData) => {
        try {
          if (isEdit) {
            await this.updateGroup(groupId, formData);
            this.showToast('Group updated successfully', 'success');
          } else {
            await this.createGroup(formData);
            this.showToast('Group created successfully', 'success');
          }
          document.getElementById('group-form-card').remove();
        } catch (error) {
          console.error('Failed to save group:', error);
          this.showToast('Failed to save group', 'error');
        }
        return false;
      }
    };

    // Create the form using Domma.forms
    const form = Domma.forms.create(formSchema, group || {}, formOptions);
    form.renderTo('#group-form-container');

    // Scan for icons
    setTimeout(() => Domma.icons.scan(), 100);
  }

  /**
   * Create new group
   */
  async createGroup(groupData) {
    const group = await this.storage.createGroup(groupData);
    this.groups.push(group);
    this.refreshGroupsTable();
    this.updateSyncStatus();
  }

  /**
   * Update existing group
   */
  async updateGroup(groupId, updates) {
    const group = await this.storage.updateGroup(groupId, updates);
    const index = this.groups.findIndex(g => (g.id || g._id) === groupId);

    if (index !== -1) {
      this.groups[index] = {...this.groups[index], ...group};
    }

    this.refreshGroupsTable();
    this.updateSyncStatus();
  }

  /**
   * Edit group (show form)
   */
  editGroup(groupId) {
    this.showGroupForm(groupId);
  }

  /**
   * Delete group with confirmation
   */
  async deleteGroup(groupId) {
    const group = this.groups.find(g => (g.id || g._id) === groupId);
    if (!group) return;

    const confirmed = await this.showConfirm(
      'Delete Group',
      `Are you sure you want to delete the group "${group.name}"? Contacts in this group will not be deleted.`
    );

    if (confirmed) {
      try {
        await this.storage.deleteGroup(groupId);
        this.groups = this.groups.filter(g => (g.id || g._id) !== groupId);

        // Remove group from contacts
        this.contacts.forEach(contact => {
          if (contact.groups?.includes(groupId)) {
            contact.groups = contact.groups.filter(gId => gId !== groupId);
          }
        });

        this.refreshGroupsTable();
        this.refreshContactsTable();
        this.updateSyncStatus();
        this.showToast('Group deleted successfully', 'success');
      } catch (error) {
        console.error('Failed to delete group:', error);
        this.showToast('Failed to delete group', 'error');
      }
    }
  }

  // ============================================================================
  // IMPORT/EXPORT & SETTINGS
  // ============================================================================

  /**
   * Show import form
   */
  async showImportForm() {
    const form = await Domma.forms.modal(importSchema, {
      onSave: async (formData) => {
        try {
          await this.importContacts(formData);
          form.close();
        } catch (error) {
          console.error('Import failed:', error);
          this.showToast('Import failed', 'error');
        }
      }
    });
  }

  /**
   * Import contacts from file
   */
  async importContacts(formData) {
    // TODO: Implement file parsing logic
    this.showToast('Import functionality coming soon', 'info');
  }

  /**
   * Show settings panel
   */
  showSettings() {
    // TODO: Implement settings panel
    this.showToast('Settings panel coming soon', 'info');
  }

  /**
   * Force sync now
   */
  async forceSync() {
    try {
      this.showToast('Syncing...', 'info');
      await this.storage.forceSync();
      await this.loadData(); // This will refresh the table
    } catch (error) {
      console.error('Sync failed:', error);
      this.showToast('Sync failed - working offline', 'error');
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get contact initials
   */
  getInitials(contact) {
    const first = contact.firstName?.charAt(0)?.toUpperCase() || '';
    const last = contact.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
  }

  /**
   * Show/hide app based on auth status
   */
  showApp() {
    $('#login-prompt').hide();
    $('#main-content').show();
  }

  hideApp() {
    // FORCE SHOW APP FOR TESTING
    $('#login-prompt').hide();
    $('#main-content').show();
  }

  /**
   * Show loading state
   */
  showLoading(show = true) {
    if (show) {
      $('#loading-overlay').addClass('active');
    } else {
      $('#loading-overlay').removeClass('active');
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    // Use Domma's toast system if available, otherwise fallback
    if (typeof Domma.toast === 'function') {
      Domma.toast(message, {type});
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showToast(message, 'error');
  }

  /**
   * Show confirmation dialog
   */
  async showConfirm(title, message) {
    return new Promise((resolve) => {
      // Use Domma's confirm system if available, otherwise fallback
      if (typeof Domma.confirm === 'function') {
        Domma.confirm(title, message, resolve);
      } else {
        resolve(window.confirm(`${title}\n\n${message}`));
      }
    });
  }
}

// Initialize app when DOM is ready
$(() => {
  console.log('DEBUG: DOM ready, creating NexusApp...');
  try {
    window.nexusApp = new NexusApp();
    console.log('DEBUG: NexusApp created, calling init...');
    window.nexusApp.init().catch(error => {
      console.error('DEBUG: Error during automatic init:', error);
    });
  } catch (error) {
    console.error('DEBUG: Error creating NexusApp or calling init:', error);
  }
});