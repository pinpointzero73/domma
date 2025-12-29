/**
 * Domma Docs - Document Editor MiniApp
 *
 * A Google Docs-like document editor built with the Domma framework.
 * Features: Multi-document management, rich text editing, auto-save, export
 */

import config from '../../shared/config.js';
import {DocumentTemplates} from './templates.js';
import {FindReplace} from './find-replace.js';
import {FolderManager} from './folders.js';
import {VersionHistory} from './versions.js';
import {errorHandler} from './error-handler.js';

const DocsApp = {
  // Configuration
  apiUrl: config.apiUrl,

  // State
  currentDocId: null,
  documents: [],         // Currently displayed documents (can be filtered)
  allDocuments: [],      // ALL documents (never filtered, used for badge counts)
  editor: null,
  findReplace: null,
  folderManager: null,
  versionHistory: null,
  autosaveTimer: null,
  typingTimer: null,

  // Constants
  AUTOSAVE_DELAY: 5000,  // 5 seconds
  TYPING_DELAY: 2000,     // 2 seconds

  /**
   * Initialize the application
   */
  async init() {

    // Initialize Domma.auth
    Domma.auth.init({apiUrl: this.apiUrl});

    // Subscribe to auth events
    Domma.auth.on('login', () => this.handleLogin());
    Domma.auth.on('register', () => this.handleLogin());
    Domma.auth.on('logout', () => this.handleLogout());
    Domma.auth.on('tokenExpired', () => this.handleTokenExpired());
    Domma.auth.on('error', (msg) => this.showAlert(msg, 'error'));

    // Check authentication state
    if (Domma.auth.isAuthenticated()) {
      await this.loadDocuments();

      // Initialize folder manager
      this.folderManager = new FolderManager(this);
      await this.folderManager.init();

      this.showApp();
    } else {
      this.showAuth();
    }

    // Setup event listeners
    this.setupEventListeners();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Setup shortcuts modal
    this.setupShortcutsModal();

    // Setup beforeunload handler
    this.setupBeforeUnload();

    // Setup connection monitoring
    this.setupConnectionMonitoring();

    // Scan for icons
    if (Domma.icons) {
      Domma.icons.scan();
    }

  },

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Initialize centralized auth components
    this.initAuthComponents();

    // Logout is now handled by the navbar in layout.js

    // New document button
    $('#newDocBtn').on('click', () => {
      this.createNewDocument();
    });

    // New document from template button
    $('#newDocFromTemplateBtn').on('click', () => {
      this.showTemplateSelector();
    });

    // Import document button
    $('#importDocBtn').on('click', () => {
      this.showFileUploadModal();
    });

    // Search input
    const searchDebounced = _.debounce((query) => {
      this.filterDocuments(query);
    }, 300);

    $('#searchInput').on('input', (e) => {
      searchDebounced(e.target.value);
    });

    // Back to list button
    $('#backToListBtn').on('click', async () => {
      await this.confirmLeaveEditor();
    });

    // Actions button
    $('#actionsBtn').on('click', () => {
      this.showActionsMenu();
    });

    // Document title input
    const saveTitleDebounced = _.debounce(() => {
      this.saveToBackend();
    }, 2000);

    $('#documentTitle').on('input', saveTitleDebounced);

    // Document grid click delegation - using native DOM
    const documentGrid = document.getElementById('documentGrid');
    if (documentGrid) {
      documentGrid.addEventListener('click', (e) => {
        // Check if clicked on menu button first (and stop event)
        const menuButton = e.target.closest('.btn-doc-menu');
        if (menuButton) {
          e.stopPropagation();
          e.preventDefault();
          const docId = menuButton.getAttribute('data-id'); // MongoDB ObjectId is a string
          this.showDocumentCardMenu(menuButton, docId);
          return;
        }

        // Otherwise, handle card click to open document
        const card = e.target.closest('.doc-card');
        if (card && !e.target.closest('.btn-doc-menu')) {
          const docId = card.getAttribute('data-id'); // MongoDB ObjectId is a string
          this.openDocument(docId);
        }
      });
    }

    // Version history button
    $('#versionHistoryBtn').on('click', () => {
      if (this.currentDocId) {
        this.showVersionHistory();
      }
    });
  },

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    $(document).on('keydown', (e) => {
      // Ctrl+S or Cmd+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.currentDocId) {
          this.saveToBackend();
        }
      }

      // Ctrl+E or Cmd+E: Export menu
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (this.currentDocId) {
          this.showActionsMenu();
        }
      }

      // Ctrl+/ or Cmd+/: Show keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        this.showShortcutsModal();
      }

      // Ctrl+F or Cmd+F: Find
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (this.currentDocId) {
          this.showFindReplace();
        }
      }

      // Ctrl+H or Cmd+H: Find and Replace
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        if (this.currentDocId) {
          this.showFindReplace();
        }
      }

      // ESC: Close shortcuts modal if open
      if (e.key === 'Escape') {
        const modal = document.getElementById('shortcutsModal');
        if (modal && modal.style.display !== 'none') {
          this.hideShortcutsModal();
        }
      }
    });
  },

  /**
   * Show keyboard shortcuts modal
   */
  showShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  },

  /**
   * Hide keyboard shortcuts modal
   */
  hideShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  /**
   * Setup shortcuts modal handlers
   */
  setupShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (!modal) return;

    // Close when clicking on the overlay (outside the modal content)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideShortcutsModal();
      }
    });

    // Close button handler (if not already bound in HTML)
    const closeBtn = modal.querySelector('.shortcuts-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideShortcutsModal();
      });
    }
  },

  /**
   * Setup beforeunload handler
   */
  setupBeforeUnload() {
    window.addEventListener('beforeunload', (e) => {
      if (this.currentDocId && this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  },

  /**
   * Setup connection monitoring and status updates
   */
  setupConnectionMonitoring() {
    // Start periodic connection checking (every 30 seconds)
    const monitoringId = errorHandler.startConnectionMonitoring(this.apiUrl, 30000);

    // Store monitoring ID for cleanup
    this.connectionMonitoringId = monitoringId;

    // Listen for connection status changes
    window.addEventListener('connection-status-change', (e) => {
      this.updateConnectionStatusUI(e.detail.status);
    });

    // Initial status update
    this.updateConnectionStatusUI('online');
  },

  /**
   * Update connection status indicator UI
   * @param {string} status - 'online', 'offline', or 'error'
   */
  updateConnectionStatusUI(status) {
    const statusElement = $('#connectionStatus');
    if (!statusElement.length) return;

    const indicator = statusElement.find('.status-indicator');
    const text = statusElement.find('.status-text');

    // Remove all status classes
    indicator.removeClass('status-online status-offline status-error');

    // Add appropriate class and update text
    switch (status) {
      case 'online':
        indicator.addClass('status-online');
        text.text('Connected');
        break;
      case 'offline':
        indicator.addClass('status-offline');
        text.text('Offline');
        break;
      case 'error':
        indicator.addClass('status-error');
        text.text('Server Error');
        break;
    }
  },

  /**
   * Add document to recent list
   */
  addToRecentDocuments(docId) {
    const key = 'domma-docs:recent';
    let recent = [];

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        recent = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load recent documents:', e);
    }

    // Remove if already exists (to move to top)
    recent = recent.filter(id => id !== docId);

    // Add to beginning
    recent.unshift(docId);

    // Keep only last 10
    recent = recent.slice(0, 10);

    // Save
    try {
      localStorage.setItem(key, JSON.stringify(recent));
    } catch (e) {
      console.error('Failed to save recent documents:', e);
    }
  },

  /**
   * Get recent documents
   */
  getRecentDocuments() {
    const key = 'domma-docs:recent';
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const recentIds = JSON.parse(stored);
        // Filter to only include documents that still exist
        return recentIds
          .map(id => this.documents.find(doc => doc.id === id))
          .filter(doc => doc !== undefined)
          .slice(0, 10);
      }
    } catch (e) {
      console.error('Failed to load recent documents:', e);
    }
    return [];
  },

  /**
   * Clear recent documents
   */
  clearRecentDocuments() {
    const key = 'domma-docs:recent';
    try {
      localStorage.removeItem(key);
      this.renderDocumentList();
    } catch (e) {
      console.error('Failed to clear recent documents:', e);
    }
  },

  /**
   * Handle login
   */
  async handleLogin() {
    await this.loadDocuments();

    // Initialize folder manager
    this.folderManager = new FolderManager(this);
    await this.folderManager.init();

    this.showApp();
  },

  /**
   * Handle logout
   */
  handleLogout() {
    this.clearState();
    this.showAuth();
  },

  /**
   * Handle token expiry
   */
  handleTokenExpired() {
    this.saveDrafts();
    this.showAlert('Session expired. Please login again.', 'error');
    this.showAuth();
  },

  /**
   * Initialize centralized auth components
   */
  initAuthComponents() {
    // Create auth tabs
    Domma.auth.createAuthTabs('#authTabs', {
      activeTab: 'login',
      onChange: (tab) => {
        // Show/hide forms based on active tab
        const loginContainer = document.getElementById('loginFormContainer');
        const registerContainer = document.getElementById('registerFormContainer');

        if (loginContainer && registerContainer) {
          loginContainer.style.display = tab === 'login' ? 'block' : 'none';
          registerContainer.style.display = tab === 'register' ? 'block' : 'none';
        }
      }
    });

    // Create login form
    Domma.auth.createLoginForm('#loginFormContainer', {
      showLabels: true,
      onSuccess: (user) => {
        // Success handled by auth event listener
        this.showAlert(`Welcome back, ${user.name || user.email}!`, 'success');
      },
      onError: (error) => {
        this.showAlert(error.message || 'Login failed', 'error');
      }
    });

    // Create register form
    Domma.auth.createRegisterForm('#registerFormContainer', {
      showLabels: true,
      onSuccess: (user) => {
        // Success handled by auth event listener
        this.showAlert(`Welcome to Domma Docs, ${user.name || user.email}!`, 'success');
      },
      onError: (error) => {
        this.showAlert(error.message || 'Registration failed', 'error');
      }
    });
  },

  /**
   * Show auth message (user must login via navbar)
   */
  showAuth() {
    $('#authSection').css('display', 'block');
    $('#appSection').css('display', 'none');

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Show app section
   */
  showApp() {
    $('#authSection').css('display', 'none');
    $('#appSection').css('display', 'block');

    this.showDocumentList();

    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Load documents from API
   */
  async loadDocuments() {

    try {
      const response = await fetch(`${this.apiUrl}/documents`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.documents = data.documents || [];
      this.allDocuments = data.documents || [];  // Store ALL documents for badge counts

      // Cache to localStorage
      S.set('domma-docs:list-cache', this.documents);

    } catch (error) {
      console.error('Failed to load documents:', error);

      // Try loading from cache
      this.documents = S.get('domma-docs:list-cache', []);
      this.allDocuments = this.documents;  // Sync allDocuments with cache

      if (this.documents.length > 0) {
        await Domma.elements.alert('Failed to load documents from server. Showing cached documents.');
      }
    }
  },

  /**
   * Render document list
   */
  renderDocumentList() {
    const container = $('#documentGrid');
    container.empty();

    if (this.documents.length === 0) {
      container.html(this.getEmptyStateHTML());
      return;
    }

    // Render recent documents section
    const recentDocs = this.getRecentDocuments();
    if (recentDocs.length > 0) {
      const recentSection = $('<div class="recent-documents-section"></div>');

      const recentHeader = $(`
                <div class="recent-documents-header">
                    <h3>
                        <span data-icon="clock" data-icon-size="20"></span>
                        Recent Documents
                    </h3>
                    <button class="btn-clear-recent" data-tooltip="Clear recent documents">
                        <span data-icon="trash" data-icon-size="16"></span>
                        Clear Recent
                    </button>
                </div>
            `);

      recentSection.append(recentHeader);

      const recentGrid = $('<div class="recent-documents-grid"></div>');
      recentDocs.forEach(doc => {
        const card = this.createDocumentCard(doc, true);
        recentGrid.append(card);
      });

      recentSection.append(recentGrid);
      container.append(recentSection);

      // Add clear recent button handler
      $('.btn-clear-recent').on('click', (e) => {
        e.preventDefault();
        this.clearRecentDocuments();
      });
    }

    // Render all documents section
    const allSection = $('<div class="all-documents-section"></div>');

    if (recentDocs.length > 0) {
      // Calculate total file size
      const totalSize = this.documents.reduce((sum, doc) => {
        const contentSize = (doc.content || '').length;
        return sum + contentSize;
      }, 0);

      // Format file size
      const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
      };

      const allHeader = $(`
                <h3 class="all-documents-header">
                    All Documents
                    <span class="badge badge-primary" style="margin-left: 0.5rem;">${this.documents.length} docs</span>
                    <span class="badge badge-secondary" style="margin-left: 0.5rem;">${formatSize(totalSize)}</span>
                </h3>
            `);
      allSection.append(allHeader);
    }

    const allGrid = $('<div class="all-documents-grid"></div>');
    this.documents.forEach(doc => {
      const card = this.createDocumentCard(doc);
      allGrid.append(card);
    });

    allSection.append(allGrid);
    container.append(allSection);

    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Filter documents by folder
   * @param {number|null} folderId - Folder ID or null for all documents
   */
  async filterByFolder(folderId) {
    try {
      // Fetch documents, optionally filtered by folder
      const response = await fetch(`${this.apiUrl}/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...Domma.auth.getHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      let fetchedDocuments = data.documents || [];


      // Always store ALL documents for badge counts
      this.allDocuments = fetchedDocuments;

      // Filter client-side if folder specified
      if (folderId !== null) {
        // Compare folder IDs as strings (MongoDB ObjectIds)
        this.documents = fetchedDocuments.filter(doc => {
          const docFolderId = doc.folder_id === null ? null : doc.folder_id;
          return docFolderId === folderId;
        });
      } else {
        this.documents = fetchedDocuments;
      }

      // Update cache
      S.set('domma-docs:list-cache', this.documents);

      // Re-render document list
      this.renderDocumentList();

    } catch (error) {
      console.error('Failed to filter documents:', error);
    }
  },

  /**
   * Create document card HTML
   */
  createDocumentCard(doc) {
    const preview = this.getContentPreview(doc.content, 100);
    const timestamp = D(doc.updated_at).fromNow();
    const stats = this.calculateDocumentStats(doc.content);

    return $(`
            <div class="doc-card" data-id="${doc.id}">
                <button class="btn-doc-menu" data-id="${doc.id}" data-tooltip="Document actions">
                    <span data-icon="more-vertical" data-icon-size="20"></span>
                </button>
                <h3 class="doc-title">${_.escape(doc.title)}</h3>
                <p class="doc-preview">${preview}</p>
                <div class="doc-stats">
                    <span class="doc-stat" data-tooltip="Words">
                        <span data-icon="document" data-icon-size="12"></span>
                        ${stats.words}
                    </span>
                    <span class="doc-stat" data-tooltip="Characters">
                        <span data-icon="edit" data-icon-size="12"></span>
                        ${stats.chars}
                    </span>
                    <span class="doc-stat" data-tooltip="Reading time">
                        <span data-icon="eye" data-icon-size="12"></span>
                        ${stats.readingTime}
                    </span>
                    <span class="doc-stat" data-tooltip="File size">
                        <span data-icon="database" data-icon-size="12"></span>
                        ${stats.fileSize}
                    </span>
                </div>
                <div class="doc-footer">
                    <span class="doc-timestamp">${timestamp}</span>
                </div>
            </div>
        `);
  },

  /**
   * Calculate document statistics
   */
  calculateDocumentStats(html) {
    if (!html) {
      return {
        words: 0,
        chars: 0,
        readingTime: '0 min',
        fileSize: '0 B'
      };
    }

    // Strip HTML tags
    const text = html.replace(/<[^>]+>/g, '');

    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const readingMinutes = Math.ceil(words / 200) || 1;
    const readingTime = readingMinutes === 1 ? '1 min' : `${readingMinutes} min`;

    // Calculate file size
    const contentSize = (html || '').length;
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };
    const fileSize = formatSize(contentSize);

    return {words, chars, readingTime, fileSize};
  },

  /**
   * Get content preview (strip HTML, truncate)
   */
  getContentPreview(html, maxLength) {
    if (!html) return 'No content';

    // Strip HTML tags
    const text = html.replace(/<[^>]+>/g, '');

    // Truncate
    return _.truncate(text, {length: maxLength});
  },

  /**
   * Get empty state HTML
   */
  getEmptyStateHTML() {
    return `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <h3>No documents yet</h3>
                <p>Click "New Document" to create your first document</p>
            </div>
        `;
  },

  /**
   * Filter documents by search query
   */
  filterDocuments(query) {
    if (!query) {
      this.renderDocumentList();
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = this.documents.filter(doc =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery)
    );

    const container = $('#documentGrid');
    container.empty();

    if (filtered.length === 0) {
      container.html(`
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>Try a different search term</p>
                </div>
            `);
      return;
    }

    filtered.forEach(doc => {
      const card = this.createDocumentCard(doc);
      container.append(card);
    });

    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Create new document
   */
  async createNewDocument() {
    const title = await Domma.elements.prompt('Enter document title:', {
      title: 'New Document',
      inputPlaceholder: 'Untitled Document',
      inputValue: 'Untitled Document'
    });

    if (!title) return;


    try {
      const response = await fetch(`${this.apiUrl}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...Domma.auth.getHeaders()
        },
        body: JSON.stringify({
          title,
          content: ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const newDoc = data.document;

      // Add to documents array
      this.documents.unshift(newDoc);

      // Update cache
      S.set('domma-docs:list-cache', this.documents);

      // Open the new document
      await this.openDocument(newDoc.id);

    } catch (error) {
      console.error('Failed to create document:', error);
      await Domma.elements.alert('Failed to create document. Please try again.');
    }
  },

  /**
   * Show template selector modal
   */
  async showTemplateSelector() {
    const templates = DocumentTemplates.getAll();
    const categories = DocumentTemplates.getCategories();

    // Build modal HTML
    let modalHTML = '<div class="template-selector">';
    modalHTML += '<h2>Choose a Template</h2>';

    // Group templates by category
    categories.forEach(category => {
      const categoryTemplates = DocumentTemplates.getByCategory(category);
      if (categoryTemplates.length === 0) return;

      modalHTML += `<div class="template-category">`;
      modalHTML += `<h3>${_.capitalize(category)}</h3>`;
      modalHTML += `<div class="template-grid">`;

      categoryTemplates.forEach(template => {
        modalHTML += `
                    <div class="template-card" data-template-id="${template.id}">
                        <div class="template-icon">
                            <span data-icon="${template.icon}" data-icon-size="32"></span>
                        </div>
                        <div class="template-name">${template.name}</div>
                        <div class="template-description">${template.description}</div>
                    </div>
                `;
      });

      modalHTML += `</div></div>`;
    });

    modalHTML += '</div>';

    // Create modal container using native DOM
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Scan for icons
    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Handle template selection with native event listeners
    const templatePromise = new Promise((resolve) => {
      // Click handler for template cards
      const templateClickHandler = (e) => {
        const card = e.target.closest('.template-card');
        if (card) {
          e.stopPropagation();
          const templateId = card.getAttribute('data-template-id');
          modalContainer.removeEventListener('click', templateClickHandler);
          modalContainer.removeEventListener('click', overlayClickHandler);
          document.removeEventListener('keydown', escHandler);
          modalContainer.remove();
          resolve(templateId);
        }
      };

      // Click handler for overlay (close)
      const overlayClickHandler = (e) => {
        if (e.target === modalContainer) {
          modalContainer.removeEventListener('click', templateClickHandler);
          modalContainer.removeEventListener('click', overlayClickHandler);
          document.removeEventListener('keydown', escHandler);
          modalContainer.remove();
          resolve(null);
        }
      };

      // ESC key handler
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          modalContainer.removeEventListener('click', templateClickHandler);
          modalContainer.removeEventListener('click', overlayClickHandler);
          document.removeEventListener('keydown', escHandler);
          modalContainer.remove();
          resolve(null);
        }
      };

      modalContainer.addEventListener('click', templateClickHandler);
      modalContainer.addEventListener('click', overlayClickHandler);
      document.addEventListener('keydown', escHandler);
    });

    const templateId = await templatePromise;
    if (templateId) {
      await this.createDocumentFromTemplate(templateId);
    }
  },

  /**
   * Create document from template
   */
  async createDocumentFromTemplate(templateId) {
    const template = DocumentTemplates.getById(templateId);
    if (!template) {
      console.error('Template not found:', templateId);
      return;
    }

    const title = await Domma.elements.prompt('Enter document title:', {
      title: 'New Document',
      inputPlaceholder: template.name,
      inputValue: template.name
    });

    if (!title) return;


    try {
      const response = await fetch(`${this.apiUrl}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...Domma.auth.getHeaders()
        },
        body: JSON.stringify({
          title,
          content: template.content
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const newDoc = data.document;

      // Add to both documents arrays
      this.documents.unshift(newDoc);
      this.allDocuments.unshift(newDoc);

      // Update cache
      S.set('domma-docs:list-cache', this.documents);

      // Refresh folder badges
      if (this.folderManager) {
        await this.folderManager.refreshBadges();
      }

      // Open the new document
      await this.openDocument(newDoc.id);

    } catch (error) {
      console.error('Failed to create document from template:', error);
      await Domma.elements.alert('Failed to create document. Please try again.');
    }
  },

  /**
   * Show file upload modal
   */
  showFileUploadModal() {
    let selectedFile = null;

    const modal = $(`
            <div class="modal-overlay">
                <div class="file-upload-modal">
                    <h2>Import Document</h2>

                    <div class="file-drop-zone" id="fileDropZone">
                        <div class="file-drop-zone-icon">📁</div>
                        <div class="file-drop-zone-text">Drop your file here or click to browse</div>
                        <div class="file-drop-zone-hint">Maximum file size: 10MB</div>
                    </div>

                    <input type="file" id="fileInput" accept=".docx,.pdf,.md,.txt,.html" style="display: none;">

                    <div class="file-info" id="fileInfo">
                        <div class="file-info-row">
                            <span class="file-info-label">File:</span>
                            <span class="file-info-value" id="fileName"></span>
                        </div>
                        <div class="file-info-row">
                            <span class="file-info-label">Size:</span>
                            <span class="file-info-value" id="fileSize"></span>
                        </div>
                        <div class="file-info-row">
                            <span class="file-info-label">Type:</span>
                            <span class="file-info-value" id="fileType"></span>
                        </div>
                    </div>

                    <div class="supported-formats">
                        <div class="supported-formats-title">Supported Formats:</div>
                        <div class="supported-formats-list">
                            <span>.docx</span>
                            <span>.pdf</span>
                            <span>.md</span>
                            <span>.txt</span>
                            <span>.html</span>
                        </div>
                    </div>

                    <div class="upload-progress" id="uploadProgress">
                        <div class="upload-progress-bar">
                            <div class="upload-progress-fill" style="width: 100%"></div>
                        </div>
                        <div class="upload-progress-text">Importing document...</div>
                    </div>

                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="cancelImport">Cancel</button>
                        <button class="btn btn-primary" id="importFile" disabled>Import</button>
                    </div>
                </div>
            </div>
        `);

    $('body').append(modal);

    // Get the actual DOM element for removal
    const modalEl = modal.get(0);

    // Get elements - use native DOM
    const fileInputEl = document.getElementById('fileInput');
    const dropZoneEl = document.getElementById('fileDropZone');
    const fileInfo = modal.find('#fileInfo');
    const importBtnEl = document.getElementById('importFile');
    const cancelBtnEl = document.getElementById('cancelImport');
    const uploadProgress = modal.find('#uploadProgress');

    // File validation
    const validateFile = (file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedExtensions = ['.docx', '.pdf', '.md', '.txt', '.html'];
      const extension = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        Domma.elements.alert('Unsupported file type. Please upload a .docx, .pdf, .md, .txt, or .html file.');
        return false;
      }

      if (file.size > maxSize) {
        Domma.elements.alert('File size exceeds 10MB limit.');
        return false;
      }

      return true;
    };

    // Format file size
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    // Handle file selection
    const handleFile = (file) => {
      if (!validateFile(file)) return;

      selectedFile = file;
      if (dropZoneEl) {
        dropZoneEl.classList.add('has-file');
      }
      fileInfo.addClass('show');
      if (importBtnEl) {
        importBtnEl.disabled = false;
      }

      modal.find('#fileName').text(file.name);
      modal.find('#fileSize').text(formatSize(file.size));
      modal.find('#fileType').text(file.type || 'Unknown');
    };

    // Click to browse - native DOM
    if (dropZoneEl) {
      dropZoneEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (fileInputEl) {
          fileInputEl.click();
        }
      });
    }

    // File input change
    if (fileInputEl) {
      fileInputEl.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          handleFile(file);
        }
      });
    }

    // Drag and drop - native DOM events
    if (dropZoneEl) {
      dropZoneEl.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      dropZoneEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneEl.classList.add('drag-over');
      });

      dropZoneEl.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneEl.classList.remove('drag-over');
      });

      dropZoneEl.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneEl.classList.remove('drag-over');

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          handleFile(files[0]);
        }
      });
    }

    // Cancel button - native DOM
    if (cancelBtnEl) {
      cancelBtnEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.remove();
      });
    }

    // Import button - native DOM
    if (importBtnEl) {
      importBtnEl.addEventListener('click', async () => {
        if (!selectedFile) return;

        importBtnEl.disabled = true;
        if (cancelBtnEl) {
          cancelBtnEl.disabled = true;
        }
        uploadProgress.addClass('show');

        try {
          const document = await this.importDocumentFromFile(selectedFile);
          modal.remove();

          // Add to both documents arrays
          this.documents.unshift(document);
          this.allDocuments.unshift(document);

          // Update cache
          S.set('domma-docs:list-cache', this.documents);

          // Refresh folder badges
          if (this.folderManager) {
            await this.folderManager.refreshBadges();
          }

          // Open the imported document
          await this.openDocument(document.id);

          await Domma.elements.alert('Document imported successfully!');
        } catch (error) {
          uploadProgress.removeClass('show');
          importBtnEl.disabled = false;
          if (cancelBtnEl) {
            cancelBtnEl.disabled = false;
          }
          console.error('Import failed:', error);
          await Domma.elements.alert(`Import failed: ${error.message}`);
        }
      });
    }

    // Close on overlay click
    modal.on('click', (e) => {
      if (e.target === modal[0]) {
        modal.remove();
      }
    });
  },

  /**
   * Import document from file
   */
  async importDocumentFromFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.apiUrl}/documents/import`, {
      method: 'POST',
      headers: {
        ...Domma.auth.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.document;
  },

  /**
   * Duplicate document
   */
  async duplicateDocument(docId) {
    const originalDoc = this.documents.find(d => d.id === docId);
    if (!originalDoc) {
      console.error('Document not found:', docId);
      return;
    }

    const title = await Domma.elements.prompt('Enter title for duplicate:', {
      title: 'Duplicate Document',
      inputPlaceholder: `${originalDoc.title} (Copy)`,
      inputValue: `${originalDoc.title} (Copy)`
    });

    if (!title) return;


    try {
      const response = await fetch(`${this.apiUrl}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...Domma.auth.getHeaders()
        },
        body: JSON.stringify({
          title,
          content: originalDoc.content || ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const newDoc = data.document;

      // Add to both documents arrays
      this.documents.unshift(newDoc);
      this.allDocuments.unshift(newDoc);

      // Update cache
      S.set('domma-docs:list-cache', this.documents);

      // Refresh folder badges
      if (this.folderManager) {
        await this.folderManager.refreshBadges();
      }

      // Refresh the list to show the new document
      this.renderDocumentList();

      // Show success message
      await Domma.elements.alert(`Document duplicated successfully as "${title}"`, {
        title: 'Success'
      });

    } catch (error) {
      console.error('Failed to duplicate document:', error);
      await Domma.elements.alert('Failed to duplicate document. Please try again.');
    }
  },

  /**
   * Show find and replace panel
   */
  showFindReplace() {
    if (!this.editor) {
      console.warn('Editor not initialized');
      return;
    }

    // Initialize FindReplace if not already created
    if (!this.findReplace) {
      this.findReplace = new FindReplace(this.editor);
    }

    this.findReplace.show();
  },

  /**
   * Show version history modal
   */
  async showVersionHistory() {
    if (!this.currentDocId) {
      console.warn('No document open');
      return;
    }

    // Initialize VersionHistory if not already created
    if (!this.versionHistory) {
      this.versionHistory = new VersionHistory(this);
    }

    await this.versionHistory.showVersionHistory(this.currentDocId);
  },

  /**
   * Show move to folder dialog
   */
  async showMoveToFolderDialog() {
    if (!this.currentDocId) {
      console.error('No document is currently open');
      return;
    }

    if (!this.folderManager) {
      console.error('Folder manager not initialized');
      return;
    }

    const moved = await this.folderManager.showMoveToFolderModal(this.currentDocId);
    if (moved) {
    }
  },

  /**
   * Show document card menu dropdown
   */
  showDocumentCardMenu(button, docId) {
    // Close any existing dropdowns
    document.querySelectorAll('.doc-card-dropdown').forEach(d => d.remove());

    // Get the document
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'doc-card-dropdown';
    dropdown.style.cssText = `
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            width: 200px;
        `;

    const actions = [
      {label: 'Open', icon: 'eye', action: () => this.openDocument(docId)},
      {type: 'separator'},
      {
        label: 'Export as PDF', icon: 'file-text', action: async () => {
          // Open document first, then export
          await this.openDocument(docId);
          setTimeout(() => this.exportPDF(), 500);
        }
      },
      {
        label: 'Export as HTML', icon: 'code', action: async () => {
          await this.openDocument(docId);
          setTimeout(() => this.exportHTML(), 500);
        }
      },
      {
        label: 'Export as Markdown', icon: 'file-code', action: async () => {
          await this.openDocument(docId);
          setTimeout(() => this.exportMarkdown(), 500);
        }
      },
      {type: 'separator'},
      {label: 'Duplicate', icon: 'copy', action: () => this.duplicateDocument(docId)},
      {
        label: 'Move to Folder', icon: 'folder', action: async () => {
          if (this.folderManager) {
            await this.folderManager.showMoveToFolderModal(docId);
          }
        }
      },
      {
        label: 'Version History', icon: 'clock', action: async () => {
          if (!this.versionHistory) {
            this.versionHistory = new VersionHistory(this);
          }
          await this.versionHistory.showVersionHistory(docId);
        }
      },
      {type: 'separator'},
      {label: 'Delete', icon: 'trash', action: () => this.deleteDocument(docId), destructive: true}
    ];

    actions.forEach(action => {
      if (action.type === 'separator') {
        const sep = document.createElement('div');
        sep.style.cssText = 'height: 1px; background: #e5e7eb; margin: 4px 0;';
        dropdown.appendChild(sep);
      } else {
        const item = document.createElement('button');
        item.type = 'button';
        item.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    padding: 8px 12px;
                    border: none;
                    background: white;
                    text-align: left;
                    cursor: pointer;
                    font-size: 14px;
                    color: ${action.destructive ? '#ef4444' : '#374151'};
                `;
        item.innerHTML = `<span data-icon="${action.icon}" data-icon-size="14"></span>${action.label}`;

        item.addEventListener('mouseenter', () => {
          item.style.background = action.destructive ? '#fee2e2' : '#f3f4f6';
        });

        item.addEventListener('mouseleave', () => {
          item.style.background = 'white';
        });

        item.addEventListener('click', async (e) => {
          e.stopPropagation();
          dropdown.remove();
          await action.action();
        });

        dropdown.appendChild(item);
      }
    });

    // Position dropdown relative to button position
    const card = button.closest('.doc-card');
    const buttonRect = button.getBoundingClientRect();

    // Append to body for proper positioning
    document.body.appendChild(dropdown);

    // Position dropdown below and to the right of the button
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${buttonRect.bottom + 4}px`;
    dropdown.style.left = `${buttonRect.left}px`;

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Close on click outside
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!dropdown.contains(e.target) && !button.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 0);
  },

  /**
   * Setup editor dialogs to use Domma Dialog instead of browser prompts
   */
  setupEditorDialogs() {
    // Wait for toolbar to be rendered
    setTimeout(() => {
      if (!this.editor || !this.editor._toolbarEl) {
        console.warn('Editor or toolbar not available');
        return;
      }

      const toolbar = this.editor._toolbarEl;

      // Override link button handler
      const linkBtn = toolbar.querySelector('.dm-editor-btn-link');
      if (linkBtn) {
        // Clone and replace to remove all existing handlers
        const newLinkBtn = linkBtn.cloneNode(true);
        linkBtn.parentNode.replaceChild(newLinkBtn, linkBtn);

        newLinkBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const selection = window.getSelection();
          const selectedText = selection.toString();

          const url = await Domma.elements.prompt('Enter URL:', {
            title: 'Insert Link',
            inputPlaceholder: 'https://example.com',
            inputType: 'url'
          });

          if (url) {
            const text = selectedText || url;
            document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
          }
        });
      } else {
        console.warn('Link button not found');
      }

      // Override image button handler
      const imageBtn = toolbar.querySelector('.dm-editor-btn-image');
      if (imageBtn) {
        // Clone and replace to remove all existing handlers
        const newImageBtn = imageBtn.cloneNode(true);
        imageBtn.parentNode.replaceChild(newImageBtn, imageBtn);

        newImageBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const url = await Domma.elements.prompt('Enter image URL:', {
            title: 'Insert Image',
            inputPlaceholder: 'https://example.com/image.jpg',
            inputType: 'url'
          });

          if (url) {
            document.execCommand('insertHTML', false, `<img src="${url}" alt="Image" style="max-width: 100%;">`);
          }
        });
      } else {
        console.warn('Image button not found');
      }

    }, 100);
  },

  /**
   * Open document in editor
   */
  async openDocument(docId) {

    this.currentDocId = docId;
    const doc = this.documents.find(d => d.id === docId);

    if (!doc) {
      console.error('Document not found:', docId);
      return;
    }

    // Add to recent documents
    this.addToRecentDocuments(docId);

    // Check for newer draft
    const draft = this.loadDraft(docId);
    let content = doc.content || '';
    let title = doc.title;

    if (draft && draft.timestamp > new Date(doc.updated_at).getTime()) {
      const restore = await Domma.elements.confirm(
        'Unsaved changes found. Restore draft?',
        {title: 'Draft Found'}
      );

      if (restore) {
        content = draft.content;
        title = draft.title;
      }
    }

    // Initialize editor
    this.editor = Domma.elements.editor('#editorContent', {
      mode: 'rich',
      placeholder: 'Start writing...',
      autosave: false,  // Manual control
      imagePaste: true,  // Enable drag & drop images
      imageMode: 'base64',  // Store as base64
      toolbar: [
        ['bold', 'italic', 'underline', 'strikethrough'],
        ['blockquote', 'code'],
        ['link', 'image'],
        ['undo', 'redo']
      ],
      onChange: (content) => this.handleEditorChange(content)
    });

    this.editor.setValue(content);
    $('#documentTitle').val(title);

    // Override link and image handlers to use Domma Dialog
    this.setupEditorDialogs();

    // Apply editor extensions (try both export patterns)
    const EditorExtensions = window.Domma?.EditorExtensions || window.DommaEditorExtensions;

    if (EditorExtensions && typeof EditorExtensions.apply === 'function') {
      try {
        EditorExtensions.apply(this.editor, [
          'colorPicker',
          'headings',
          'lists',
          'alignment',
          'table',
          'divider',
          'contextMenu',
          'imageResize'
        ]);
      } catch (err) {
        console.error('✗ Failed to apply editor extensions:', err);
      }
    } else {
      console.error('✗ EditorExtensions not available!');
    }

    // Listen for selection changes to update stats
    document.addEventListener('selectionchange', () => {
      if (this.editor && this.editor._editorEl) {
        this.updateStats();
      }
    });

    // Initialize tooltips
    this.initTooltips();

    // Create actions dropdown
    this.createActionsDropdown();

    // Add click-outside handler for actions dropdown
    this.setupActionsDropdownHandler();

    this.showEditorView();
    this.updateSaveIndicator('ready');
    this.updateStats();
  },

  /**
   * Setup click-outside handler for actions dropdown
   */
  setupActionsDropdownHandler() {
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('actionsDropdown');
      const actionsBtn = document.getElementById('actionsBtn');

      if (dropdown && dropdown.style.display === 'block') {
        // Check if click is outside dropdown and button
        if (!dropdown.contains(e.target) && !actionsBtn.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      }
    });
  },


  /**
   * Initialize Domma tooltips
   */
  initTooltips() {
    setTimeout(() => {

      if (!Domma || !Domma.elements || !Domma.elements.tooltip) {
        console.error('Domma.elements.tooltip is not available!');
        return;
      }

      // Map of toolbar button classes/content to tooltip text
      const buttonTooltips = {
        'bold': 'Bold (Ctrl+B)',
        'italic': 'Italic (Ctrl+I)',
        'underline': 'Underline (Ctrl+U)',
        'strikethrough': 'Strikethrough',
        'blockquote': 'Blockquote',
        'link': 'Insert Link (Ctrl+K)',
        'image': 'Insert Image',
        'code': 'Code Block',
        'undo': 'Undo (Ctrl+Z)',
        'redo': 'Redo (Ctrl+Y)'
      };

      let tooltipCount = 0;

      // Add tooltips to ALL buttons with data-tooltip first
      document.querySelectorAll('[data-tooltip]').forEach(el => {
        try {
          const content = el.getAttribute('data-tooltip');
          Domma.elements.tooltip(el, {
            content: content,
            position: 'top'
          });
          tooltipCount++;
        } catch (err) {
          console.error('Failed to add tooltip:', err);
        }
      });

      // Add tooltips to toolbar buttons by data-cmd
      document.querySelectorAll('.dm-editor-toolbar-btn').forEach(btn => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd && buttonTooltips[cmd] && !btn.getAttribute('data-tooltip')) {
          try {
            Domma.elements.tooltip(btn, {
              content: buttonTooltips[cmd],
              position: 'top'
            });
            tooltipCount++;
          } catch (err) {
            console.error('Failed to add tooltip for cmd:', cmd, err);
          }
        }
      });

    }, 300);
  },

  /**
   * Enable image resizing in editor
   */
  enableImageResize() {
    const editorEl = this.editor._editorEl;
    if (!editorEl) return;

    // Make existing images resizable
    this.makeImagesResizable(editorEl);

    // Watch for new images
    const observer = new MutationObserver(() => {
      this.makeImagesResizable(editorEl);
    });

    observer.observe(editorEl, {
      childList: true,
      subtree: true
    });
  },

  /**
   * Make all images in container resizable
   */
  makeImagesResizable(container) {
    const images = container.querySelectorAll('img:not([data-resizable])');

    images.forEach(img => {
      img.setAttribute('data-resizable', 'true');
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.cursor = 'pointer';

      // Make image resizable by dragging
      img.addEventListener('click', async (e) => {
        e.preventDefault();
        const currentWidth = img.width || img.naturalWidth;
        const newWidth = await Domma.elements.prompt('Enter image width (in pixels or %):', {
          defaultValue: currentWidth.toString()
        });

        if (newWidth) {
          if (newWidth.includes('%')) {
            img.style.width = newWidth;
          } else {
            img.style.width = parseInt(newWidth) + 'px';
          }
          img.style.height = 'auto';
        }
      });
    });
  },

  /**
   * Add color picker to editor toolbar
   */
  addColorPicker() {
    const toolbar = document.querySelector('.dm-editor-toolbar');
    if (!toolbar) return;

    // Create color picker group
    const colorGroup = document.createElement('div');
    colorGroup.className = 'dm-editor-toolbar-group';

    // Text color picker
    const textColorBtn = this.createColorButton('Text Color', '#000000', (color) => {
      document.execCommand('foreColor', false, color);
      this.editor._editorEl.focus();
    });

    // Background color picker
    const bgColorBtn = this.createColorButton('Highlight', '#ffff00', (color) => {
      document.execCommand('hiliteColor', false, color);
      this.editor._editorEl.focus();
    });

    colorGroup.appendChild(textColorBtn);
    colorGroup.appendChild(bgColorBtn);
    toolbar.appendChild(colorGroup);
  },

  /**
   * Create a color picker button
   */
  createColorButton(label, defaultColor, onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dm-editor-color-picker';
    wrapper.style.cssText = 'position: relative; display: inline-block;';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dm-editor-toolbar-btn';
    button.title = label;
    button.setAttribute('data-tooltip', label);
    button.style.position = 'relative';
    button.innerHTML = `
            <span data-icon="palette" data-icon-size="16"></span>
            <span style="position:absolute;bottom:2px;right:2px;width:8px;height:8px;border:1px solid #fff;background:${defaultColor};border-radius:50%;"></span>
        `;

    const input = document.createElement('input');
    input.type = 'color';
    input.value = defaultColor;
    input.style.cssText = 'position:absolute;opacity:0;width:0;height:0;';

    button.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
      const color = e.target.value;
      const colorDot = button.querySelectorAll('span')[1]; // Second span is the color indicator
      if (colorDot) {
        colorDot.style.background = color;
      }
      onChange(color);
    });

    wrapper.appendChild(button);
    wrapper.appendChild(input);
    return wrapper;
  },

  /**
   * Handle editor change
   */
  handleEditorChange(content) {
    // Clear existing timers
    clearTimeout(this.typingTimer);
    clearTimeout(this.autosaveTimer);

    this.updateSaveIndicator('typing');

    // Immediate localStorage save (after brief delay)
    this.typingTimer = setTimeout(() => {
      this.saveDraft(this.currentDocId, content);
    }, this.TYPING_DELAY);

    // Debounced backend save
    this.autosaveTimer = setTimeout(() => {
      this.saveToBackend();
    }, this.AUTOSAVE_DELAY);

    // Update stats
    this.updateStats();
  },

  /**
   * Save to backend
   */
  async saveToBackend() {
    if (!this.currentDocId || !this.editor) return;

    this.updateSaveIndicator('saving');

    // Show fullscreen loader
    const loader = Domma.elements.fullscreenLoader('Saving document...');

    const title = $('#documentTitle').val();
    const content = this.editor.getValue();

    try {
      const response = await fetch(`${this.apiUrl}/documents/${this.currentDocId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...Domma.auth.getHeaders()
        },
        body: JSON.stringify({title, content})
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Clear draft
      this.clearDraft(this.currentDocId);

      // Update document in list
      this.updateDocumentInList(this.currentDocId, {
        title,
        content,
        updated_at: new Date().toISOString()
      });

      this.updateSaveIndicator('saved');

      // Destroy loader and show success toast
      loader.destroy();
      Domma.elements.toast('Document saved successfully', {
        type: 'success',
        duration: 2000
      });

    } catch (error) {
      console.error('Save failed:', error);
      this.updateSaveIndicator('error');

      // Destroy loader and show error toast
      loader.destroy();
      Domma.elements.toast('Failed to save document', {
        type: 'error',
        duration: 3000
      });
    }
  },

  /**
   * Update save indicator
   */
  updateSaveIndicator(state) {
    const indicator = $('#saveIndicator');
    const text = $('#saveText');

    // Remove all state classes
    indicator.removeClass('typing saving saved error');

    switch (state) {
      case 'ready':
        text.text('Ready');
        break;

      case 'typing':
        indicator.addClass('typing');
        text.text('Typing...');
        break;

      case 'saving':
        indicator.addClass('saving');
        text.text('Saving...');
        break;

      case 'saved':
        indicator.addClass('saved');
        text.text(`Saved ${D().fromNow()}`);
        break;

      case 'error':
        indicator.addClass('error');
        text.html('Save failed - <a href="#" id="retryBtn">retry</a>');

        // Setup retry button
        $('#retryBtn').on('click', (e) => {
          e.preventDefault();
          this.saveToBackend();
        });
        break;
    }
  },

  /**
   * Update document stats
   */
  updateStats() {
    if (!this.editor) return;

    const text = this.editor.getText() || '';
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Count paragraphs (non-empty lines)
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    const readingTimeText = readingTime === 1 ? '1 min read' : `${readingTime} min read`;

    // Check if there's selected text
    const selection = window.getSelection();
    let statsText = '';

    if (selection && !selection.isCollapsed && this.editor._editorEl.contains(selection.anchorNode)) {
      // Show selected text stats
      const selectedText = selection.toString();
      const selectedWords = selectedText.trim().split(/\s+/).filter(w => w.length > 0).length;
      const selectedChars = selectedText.length;
      statsText = `Selected: ${selectedWords} words, ${selectedChars} chars | `;
    }

    statsText += `${words} words • ${charsWithSpaces} characters (${charsWithoutSpaces} no spaces) • ${paragraphs} paragraphs • ${readingTimeText}`;

    $('#docStats').text(statsText);
  },

  /**
   * Save draft to localStorage
   */
  saveDraft(docId, content) {
    const title = $('#documentTitle').val();

    S.set(`domma-docs:draft:${docId}`, {
      content,
      title,
      timestamp: Date.now()
    });

  },

  /**
   * Load draft from localStorage
   */
  loadDraft(docId) {
    return S.get(`domma-docs:draft:${docId}`);
  },

  /**
   * Clear draft from localStorage
   */
  clearDraft(docId) {
    S.remove(`domma-docs:draft:${docId}`);
  },

  /**
   * Save all drafts
   */
  saveDrafts() {
    if (this.currentDocId && this.editor) {
      const content = this.editor.getValue();
      this.saveDraft(this.currentDocId, content);
    }
  },

  /**
   * Update document in list
   */
  updateDocumentInList(docId, updates) {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      Object.assign(doc, updates);

      // Update cache
      S.set('domma-docs:list-cache', this.documents);
    }
  },

  /**
   * Delete document
   */
  async deleteDocument(docId) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    const confirmed = await Domma.elements.confirm(
      `Delete "${doc.title}"? This action cannot be undone.`,
      {title: 'Confirm Delete'}
    );

    if (!confirmed) return;


    try {
      const response = await fetch(`${this.apiUrl}/documents/${docId}`, {
        method: 'DELETE',
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Remove from both documents arrays
      this.documents = this.documents.filter(d => d.id !== docId);
      this.allDocuments = this.allDocuments.filter(d => d.id !== docId);

      // Clear draft
      this.clearDraft(docId);

      // Update cache
      S.set('domma-docs:list-cache', this.documents);

      // Refresh folder badges
      if (this.folderManager) {
        await this.folderManager.refreshBadges();
      }

      // If currently editing this document, go back to list
      if (this.currentDocId === docId) {
        this.showDocumentList();
      } else {
        this.renderDocumentList();
      }

      await Domma.elements.alert('Document deleted successfully.');

    } catch (error) {
      console.error('Failed to delete document:', error);
      await Domma.elements.alert('Failed to delete document. Please try again.');
    }
  },

  /**
   * Create actions dropdown menu
   */
  createActionsDropdown() {
    const actionsMenu = document.querySelector('.actions-menu');
    if (!actionsMenu) return;

    // Remove existing dropdown if any
    const existingDropdown = document.getElementById('actionsDropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'actionsDropdown';
    dropdown.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid var(--dm-border-color, #ddd);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            margin-top: 4px;
            min-width: 180px;
        `;

    const actions = [
      {label: 'Save', icon: 'save', action: () => this.saveToBackend()},
      {type: 'separator'},
      {label: 'Export as PDF', icon: 'file-text', action: () => this.exportPDF()},
      {label: 'Export as HTML', icon: 'code', action: () => this.exportHTML()},
      {label: 'Export as Markdown', icon: 'file-code', action: () => this.exportMarkdown()},
      {type: 'separator'},
      {label: 'Move to Folder', icon: 'folder', action: () => this.showMoveToFolderDialog()},
      {label: 'Version History', icon: 'clock', action: () => this.showVersionHistory()},
      {type: 'separator'},
      {label: 'Delete Document', icon: 'trash', action: () => this.deleteDocument(this.currentDocId)}
    ];

    actions.forEach(action => {
      if (action.type === 'separator') {
        const sep = document.createElement('div');
        sep.style.cssText = 'height: 1px; background: #e0e0e0; margin: 4px 0;';
        dropdown.appendChild(sep);
      } else {
        const item = document.createElement('button');
        item.type = 'button';
        item.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    padding: 8px 12px;
                    border: none;
                    background: white;
                    text-align: left;
                    cursor: pointer;
                    font-size: 14px;
                `;
        item.innerHTML = `<span data-icon="${action.icon}" data-icon-size="14"></span>${action.label}`;

        item.addEventListener('mouseenter', () => {
          item.style.background = '#f0f0f0';
        });

        item.addEventListener('mouseleave', () => {
          item.style.background = 'white';
        });

        item.addEventListener('click', async (e) => {
          e.stopPropagation();
          dropdown.style.display = 'none';
          await action.action();
        });

        dropdown.appendChild(item);
      }
    });

    actionsMenu.appendChild(dropdown);

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Show actions menu (toggle dropdown)
   */
  showActionsMenu() {
    if (!this.currentDocId) return;

    const dropdown = document.getElementById('actionsDropdown');
    if (!dropdown) return;

    // Toggle dropdown
    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    } else {
      dropdown.style.display = 'block';

      // Scan icons when showing
      if (Domma.icons) {
        Domma.icons.scan();
      }
    }
  },

  /**
   * Export as PDF
   */
  exportPDF() {
    const content = this.editor.getValue();
    const title = $('#documentTitle').val();


    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${_.escape(title)}</title>
                <style>
                    body {
                        font-family: Georgia, serif;
                        max-width: 800px;
                        margin: 2cm auto;
                        padding: 1cm;
                        line-height: 1.6;
                        font-size: 12pt;
                    }
                    h1 { font-size: 24pt; margin-top: 0; }
                    h2 { font-size: 20pt; }
                    h3 { font-size: 16pt; }
                    @media print {
                        body { margin: 0; padding: 1cm; }
                    }
                </style>
            </head>
            <body>
                <h1>${_.escape(title)}</h1>
                ${content}
            </body>
            </html>
        `);
    doc.close();

    // Trigger print
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove iframe after print
    setTimeout(() => iframe.remove(), 1000);
  },

  /**
   * Export as HTML
   */
  exportHTML() {
    const content = this.editor.getValue();
    const title = $('#documentTitle').val();


    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${_.escape(title)}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>${_.escape(title)}</h1>
    ${content}
</body>
</html>`;

    this.downloadFile(html, `${title}.html`, 'text/html');
  },

  /**
   * Export as Markdown
   */
  exportMarkdown() {
    const content = this.editor.getValue();
    const title = $('#documentTitle').val();


    // Convert HTML to Markdown
    let markdown = `# ${title}\n\n`;
    markdown += this.htmlToMarkdown(content);

    this.downloadFile(markdown, `${title}.md`, 'text/markdown');
  },

  /**
   * Convert HTML to Markdown
   */
  htmlToMarkdown(html) {
    if (!html) return '';

    return html
      // Headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')

      // Bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')

      // Links
      .replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

      // Images
      .replace(/<img\s+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
      .replace(/<img\s+src="([^"]*)"[^>]*>/gi, '![]($1)')

      // Blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
        const lines = content.trim().split('\n');
        return lines.map(line => `> ${line}`).join('\n') + '\n\n';
      })

      // Code blocks
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')

      // Unordered lists
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, items) => {
        return items.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })

      // Ordered lists
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, items) => {
        let counter = 1;
        return items.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
          return `${counter++}. $1\n`;
        }) + '\n';
      })

      // Paragraphs
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')

      // Line breaks
      .replace(/<br\s*\/?>/gi, '\n')

      // Strip remaining HTML tags
      .replace(/<[^>]+>/g, '')

      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  },

  /**
   * Download file
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], {type: mimeType});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Show document list view
   */
  showDocumentList() {
    document.getElementById('documentListView').style.display = 'block';
    document.getElementById('editorView').style.display = 'none';

    this.currentDocId = null;

    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    this.renderDocumentList();

    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Show editor view
   */
  showEditorView() {
    document.getElementById('documentListView').style.display = 'none';
    document.getElementById('editorView').style.display = 'block';

    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Confirm leave editor
   */
  async confirmLeaveEditor() {
    if (this.hasUnsavedChanges()) {
      const leave = await Domma.elements.confirm(
        'You have unsaved changes. Leave anyway?',
        {title: 'Unsaved Changes'}
      );

      if (!leave) return;
    }

    this.showDocumentList();
  },

  /**
   * Check if has unsaved changes
   */
  hasUnsavedChanges() {
    if (!this.editor || !this.currentDocId) return false;

    const currentContent = this.editor.getValue();
    const doc = this.documents.find(d => d.id === this.currentDocId);

    if (!doc) return false;

    return currentContent !== doc.content;
  },

  /**
   * Clear state
   */
  clearState() {
    this.currentDocId = null;
    this.documents = [];

    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    clearTimeout(this.autosaveTimer);
    clearTimeout(this.typingTimer);
  },

  /**
   * Show alert
   */
  showAlert(message, type = 'info') {
    const alertClass = `alert-${type}`;
    const icon = type === 'error' ? 'x-circle' : 'info';

    const alert = $(`
            <div class="alert ${alertClass}">
                <span data-icon="${icon}" data-icon-size="20"></span>
                <span>${_.escape(message)}</span>
            </div>
        `);

    $('#alertContainer').empty().append(alert);

    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      alert.fadeOut(300, () => alert.remove());
    }, 5000);
  }
};

// Export to window
window.DocsApp = DocsApp;

// Wait for all dependencies to load before initializing
function initWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
    return;
  }

  // Check if all required libraries are loaded
  if (!window.Domma) {
    console.error('Domma not loaded!');
    setTimeout(initWhenReady, 100);
    return;
  }

  if (!window.Domma.elements) {
    console.error('Domma.elements not loaded!');
    setTimeout(initWhenReady, 100);
    return;
  }

  // Check for EditorExtensions (try both export patterns)
  const EditorExtensions = window.Domma?.EditorExtensions || window.DommaEditorExtensions;
  if (!EditorExtensions) {
    console.warn('EditorExtensions not yet loaded, retrying...');
    setTimeout(initWhenReady, 100);
    return;
  }

  DocsApp.init();
}

initWhenReady();
