/**
 * Nexus Contact Manager - Real API CRUD Demo
 * Integrates with global Domma authentication system
 */

import {contactSchema as fullContactSchema} from './schemas.js';

class NexusApp {
  constructor() {
    this.contactsCrud = null;
    this.groupsCrud = null;
    this.currentUser = null;
    this.authToken = null;

    // Contact schema for CRUD - converted from comprehensive Forma schema
    this.contactSchema = this.convertFormaSchemaToForms(fullContactSchema);

    // Group schema for CRUD - matches backend ContactGroup model
    this.groupSchema = {
      name: {
        type: 'string',
        label: 'Group Name',
        required: true,
        formConfig: {placeholder: 'e.g., Family'}
      },
      description: {
        type: 'textarea',
        label: 'Description',
        formConfig: {placeholder: 'A short description of the group'}
      },
      colour: {
        type: 'color',
        label: 'Group Colour',
        default: '#3B82F6',
        formConfig: {placeholder: '#3B82F6'}
      },
      type: {
        type: 'select',
        label: 'Group Type',
        options: ['personal', 'work', 'client', 'supplier', 'family', 'friend', 'other'],
        default: 'personal'
      },
      privacy: {
        type: 'select',
        label: 'Privacy',
        options: ['private', 'shared', 'public'],
        default: 'private'
      }
    };

    console.log('Nexus app initialized');
  }

  // Convert Forma schema format to Domma.forms.crud format
  convertFormaSchemaToForms(formaSchema) {
    const formsCrudSchema = {};

    for (const field of formaSchema.fields) {
      formsCrudSchema[field.name] = {
        type: this.mapFormaTypeToCrudType(field),
        label: field.label,
        required: field.required || false,
        formConfig: {
          placeholder: field.placeholder || '',
          ...(field.rows && {rows: field.rows})
        }
      };

      // Handle special field types
      if (field.type === 'multiselect' && field.name === 'groups') {
        formsCrudSchema[field.name].options = []; // Will be populated dynamically
        formsCrudSchema[field.name].multiple = true;
        // Copy validation and help text if present
        if (field.validation) {
          formsCrudSchema[field.name].validation = field.validation;
        }
        if (field.help) {
          formsCrudSchema[field.name].help = field.help;
        }
        // Don't set dataType for multiselect - let the type mapping handle it
        formsCrudSchema[field.name].transform = {
          toForm: (value) => {
            if (!value) return [];
            if (Array.isArray(value)) {
              // Handle both ObjectId objects and string IDs
              const result = value.map(v => typeof v === 'object' ? (v._id || v.id || v.toString()) : v);
              console.log('Groups toForm transform:', value, '→', result);
              return result;
            }
            return [];
          },
          toData: (value) => {
            if (!value) return [];
            const result = Array.isArray(value) ? value.filter(v => v && v.trim()) : [];
            console.log('Groups toData transform:', value, '→', result);
            return result;
          }
        };
      }

      if (field.type === 'select' && field.options) {
        formsCrudSchema[field.name].options = field.options.map(opt =>
          typeof opt === 'string' ? opt : opt.label || opt.value
        );
      }

      // Ensure boolean fields have proper type conversion
      if (field.type === 'checkbox') {
        // Using 'boolean' type will render proper checkbox and handle boolean values correctly
        formsCrudSchema[field.name].type = 'boolean';
      }

      if (field.defaultValue) {
        formsCrudSchema[field.name].default = field.defaultValue;
      }
    }

    return formsCrudSchema;
  }

  // Map Forma field types to Domma.forms.crud types with smart inference
  mapFormaTypeToCrudType(field) {
    const {type, options, multiple} = field;

    // Smart UI-to-data type mapping with best judgment
    const smartMap = {
      // Boolean data types (various UI representations)
      'checkbox': 'boolean',
      'toggle': 'boolean',

      // String data types  
      'text': 'string',
      'textarea': 'textarea',
      'email': 'email',
      'tel': 'tel',
      'url': 'url',
      'password': 'string',
      'search': 'string',
      'tags': 'string',

      // Selection types with smart inference
      'select': multiple ? 'multiselect' : 'select',
      'multiselect': 'multiselect',

      // Special cases
      'radio': (options?.length === 2) ? 'boolean' : 'radio',
      'file': 'file',
      'color': 'color',
      'date': 'date',
      'number': 'number'
    };

    return smartMap[type] || 'string';
  }

  // Populate groups options dynamically for the contact schema
  async populateGroupsOptions(isLocal) {
    try {
      const groupsEndpoint = isLocal ? 'http://localhost:3000/api/contacts/groups' : '/api/contacts/groups';

      const response = await fetch(groupsEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const groups = result.data || [];

        // Update the contact schema with actual group options
        if (this.contactSchema.groups) {
          // Domma.forms.crud multiselect expects simple string array or value/label objects
          this.contactSchema.groups.options = groups.map(group => ({
            value: group._id || group.id || group.toString(),
            label: group.name || `Group ${group._id || group.id}`
          }));

          console.log(`Loaded ${groups.length} groups for contact assignment:`, groups);
          console.log('Groups options created:', this.contactSchema.groups.options);
        }
      } else {
        console.warn('Could not load groups for contact assignment');
        // Keep empty options array as fallback
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      // Keep empty options array as fallback
    }
  }

  async init() {
    // Initialize auth module if not already initialized
    if (Domma.auth && !Domma.auth.initialized) {
      console.log('Initializing auth module...');
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      Domma.auth.init({
        apiUrl: isLocal ? 'http://localhost:3000/api' : '/api'
      });
    }

    // Use global Domma auth directly
    if (Domma.auth && Domma.auth.token && Domma.auth.user) {
      this.authToken = Domma.auth.token;
      this.currentUser = Domma.auth.user;
      console.log('Found global auth, initializing CRUD...');
      await this.initializeCrud();
    } else {
      console.log('No auth found, redirecting to global login...');
      this.redirectToLogin();
    }
  }

  redirectToLogin() {
    // Hide main content and show redirect message
    $('#main-content').hide();
    $('#login-prompt').show().html(`
      <span data-icon="lock" class="icon"></span>
      <h2>Authentication Required</h2>
      <p>Please use the <strong>Login</strong> button in the navigation bar to access Nexus Contact Manager.</p>
      <div class="mt-4">
        <a href="/login/index.html" class="btn btn-primary">
          <span data-icon="log-in" class="icon"></span>
          Go to Login
        </a>
      </div>
      <div class="mt-3 text-center">
        <small class="text-muted">
          You will be redirected back to Nexus after successful login.
        </small>
      </div>
    `);
  }

  async initializeCrud() {
    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      // Load groups and populate contact schema groups options
      await this.populateGroupsOptions(isLocal);

      // Initialize Contacts CRUD
      const contactsEndpoint = isLocal ? 'http://localhost:3000/api/contacts' : '/api/contacts';
      this.contactsCrud = Domma.forms.crud({
        schema: this.contactSchema,
        endpoint: contactsEndpoint,
        tableSelector: '#contacts-table',
        title: 'Manage Contacts',
        primaryKey: 'id',
        displayField: 'firstName',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        onSuccess: (message) => {
          console.log('Success:', message);
          if (window.Domma && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast(message, {type: 'success'});
          }
        },
        onError: (error) => {
          console.error('CRUD Error:', error);
          if (error.message && error.message.includes('Unauthorized')) {
            this.handleAuthError();
            return;
          }
          if (window.Domma && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast('Error: ' + error.message, {type: 'error'});
          }
        }
      });
      await this.contactsCrud.init();

      // Initialize Groups CRUD
      const groupsEndpoint = isLocal ? 'http://localhost:3000/api/contacts/groups' : '/api/contacts/groups';
      this.groupsCrud = Domma.forms.crud({
        schema: this.groupSchema,
        endpoint: groupsEndpoint,
        tableSelector: '#groups-table',
        title: 'Manage Groups',
        primaryKey: 'id',
        displayField: 'name',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        onSuccess: (message) => {
          if (window.Domma && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast(message, {type: 'success'});
          }
        },
        onError: (error) => {
          if (window.Domma && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast('Group Error: ' + error.message, {type: 'error'});
          }
        }
      });
      await this.groupsCrud.init();

      this.setupAdditionalEvents();
      this.showMainContent();
      console.log('Nexus CRUD initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Nexus:', error);

      if (error.message && error.message.includes('Unauthorized')) {
        this.handleAuthError();
        return;
      }

      // Show fallback message
      const table = document.getElementById('contacts-table');
      if (table) {
        table.innerHTML = `
          <div class="alert alert-danger">
            <h4>Backend Connection Failed</h4>
            <p>Could not connect to the API server. Please ensure the backend is running.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <div class="mt-3">
              <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
              <a href="../login/index.html" class="btn btn-secondary ml-2">Login Again</a>
            </div>
          </div>
        `;
      }
    }
  }

  showMainContent() {
    $('#login-prompt').hide();
    $('#main-content').show();

    // Update header with user info
    if (this.currentUser) {
      $('.app-title').html(`
        <span data-icon="users" class="icon"></span>
        Nexus Contact Manager
        <small style="font-size: 0.7em; font-weight: normal; opacity: 0.7;"> - ${this.currentUser.email || this.currentUser.name}</small>
      `);
    }
  }

  handleAuthError() {
    // Clear global auth using Domma auth module
    if (Domma.auth && typeof Domma.auth.logout === 'function') {
      Domma.auth.logout();
    }

    // Redirect to login
    this.redirectToLogin();
  }

  setupAdditionalEvents() {
    // Tab switching
    $('.tab-nav button').off('click').on('click', (e) => {
      const tab = $(e.currentTarget).data('tab');

      // Update button active state
      $('.tab-nav button').removeClass('active');
      $(e.currentTarget).addClass('active');

      // Update content view active state
      $('.tab-content').removeClass('active');
      $(`#${tab}-view`).addClass('active');
    });

    // Refresh button - uses CRUD's built-in refresh
    $('#refresh-btn').off('click').on('click', async () => {
      try {
        if (this.contactsCrud) {
          await this.contactsCrud.refresh();
          console.log('Contacts refreshed');
        }
      } catch (error) {
        console.error('Refresh failed:', error);
        if (error.message && error.message.includes('Unauthorized')) {
          this.handleAuthError();
        }
      }
    });

    // Add contact button - uses CRUD's built-in create
    $('#add-contact-btn').off('click').on('click', () => {
      try {
        if (this.contactsCrud) {
          this.contactsCrud.create();
        }
      } catch (error) {
        console.error('Create contact failed:', error);
      }
    });

    // Add group button
    $('#add-group-btn').off('click').on('click', () => {
      try {
        if (this.groupsCrud) {
          this.groupsCrud.create();
        }
      } catch (error) {
        console.error('Create group failed:', error);
      }
    });

    // Sync button 
    $('#sync-btn').off('click').on('click', async () => {
      try {
        if (this.contactsCrud) {
          await this.contactsCrud.loadData();
          console.log('Data synced from server');
        }
        if (this.groupsCrud) {
          await this.groupsCrud.loadData();
          console.log('Group data synced from server');
        }
      } catch (error) {
        console.error('Sync failed:', error);
        if (error.message && error.message.includes('Unauthorized')) {
          this.handleAuthError();
        }
      }
    });

    // The logout button is now provided by the global navigation
    // so we don't need to handle it here
  }

  // Public methods for external access
  getContactsCrud() {
    return this.contactsCrud;
  }

  async addContact(contactData) {
    if (this.contactsCrud) {
      return await this.contactsCrud.addItem(contactData);
    }
  }

  async editContact(contactId, contactData) {
    if (this.contactsCrud) {
      return await this.contactsCrud.updateItem(contactId, contactData);
    }
  }

  async deleteContact(contactId) {
    if (this.contactsCrud) {
      return await this.contactsCrud.removeItem(contactId);
    }
  }
}

// Initialize app when Domma is ready
$(() => {
  window.nexusApp = new NexusApp();
  nexusApp.init();
});