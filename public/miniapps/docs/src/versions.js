/**
 * Version History Manager
 * Handles document version viewing and restoration
 */

import config from '../../shared/config.js';

export class VersionHistory {
  /**
   * Create a new VersionHistory instance
   * @param {Object} app - Reference to main DocsApp
   */
  constructor(app) {
    this.app = app;
    this.apiUrl = config.apiUrl;
    this.versions = [];
    this.currentDocument = null;
  }

  /**
   * Load versions for a document
   * @param {number} documentId - Document ID
   */
  async loadVersions(documentId) {
    try {
      const response = await fetch(
        `${this.apiUrl}/documents/${documentId}/versions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...window.Domma.auth.getHeaders()
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load versions');
      }

      const data = await response.json();
      this.versions = data.versions || [];
      this.currentDocument = {
        id: documentId,
        currentVersion: data.currentVersion
      };

      return this.versions;

    } catch (error) {
      console.error('Failed to load versions:', error);
      this.versions = [];
      return [];
    }
  }

  /**
   * Show version history modal
   * @param {number} documentId - Document ID
   */
  async showVersionHistory(documentId) {
    // Load versions
    await this.loadVersions(documentId);

    // Create modal HTML
    const modalHTML = `
            <div class="version-history-modal">
                <div class="version-history-header">
                    <div class="version-history-header-content">
                        <div class="version-history-icon">
                            <span data-icon="clock" data-icon-size="32"></span>
                        </div>
                        <h2>Version History</h2>
                    </div>
                    <button class="btn-close-versions" data-tooltip="Close">
                        <span data-icon="x" data-icon-size="20"></span>
                    </button>
                </div>
                <div class="version-history-body" id="versionHistoryList">
                    ${this.renderVersionList()}
                </div>
            </div>
        `;

    // Create modal container using native DOM
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Initialize Domma icons
    if (window.Domma && window.Domma.icons) {
      window.Domma.icons.scan();
    }

    // Setup event listeners
    this.setupVersionListeners(modalContainer);
  }

  /**
   * Render version list
   * @returns {string} HTML string
   */
  renderVersionList() {
    if (this.versions.length === 0) {
      return `
                <div class="version-empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No Version History</h3>
                    <p>Versions will be created automatically as you edit this document.</p>
                </div>
            `;
    }

    let html = '<div class="version-list">';

    this.versions.forEach(version => {
      const isCurrent = version.version_number === this.currentDocument.currentVersion;
      const timestamp = window.D(version.created_at).fromNow();
      const sizeKB = Math.round(version.content_size / 1024);

      html += `
                <div class="version-item ${isCurrent ? 'version-current' : ''}"
                     data-version-id="${version.id}"
                     data-version-number="${version.version_number}">
                    <div class="version-header">
                        <div class="version-info">
                            <div class="version-number">
                                Version ${version.version_number}
                                ${isCurrent ? '<span class="version-badge">Current</span>' : ''}
                            </div>
                            <div class="version-meta">
                                <span data-icon="user" data-icon-size="14"></span>
                                ${this.escapeHtml(version.created_by_username || 'Unknown')}
                                <span class="meta-separator">•</span>
                                <span data-icon="clock" data-icon-size="14"></span>
                                ${timestamp}
                                <span class="meta-separator">•</span>
                                <span data-icon="document" data-icon-size="14"></span>
                                ${sizeKB} KB
                            </div>
                        </div>
                        <div class="version-actions">
                            <button class="btn-version-action btn-preview"
                                    data-version-number="${version.version_number}"
                                    data-tooltip="Preview version">
                                <span data-icon="eye" data-icon-size="16"></span>
                                Preview
                            </button>
                            ${!isCurrent ? `
                                <button class="btn-version-action btn-restore"
                                        data-version-number="${version.version_number}"
                                        data-tooltip="Restore this version">
                                    <span data-icon="save" data-icon-size="16"></span>
                                    Restore
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="version-title">
                        <span data-icon="document" data-icon-size="14"></span>
                        ${this.escapeHtml(version.title)}
                    </div>
                </div>
            `;
    });

    html += '</div>';

    return html;
  }

  /**
   * Setup event listeners for version modal
   * @param {HTMLElement} modalContainer - Modal container element
   */
  setupVersionListeners(modalContainer) {
    const closeBtn = modalContainer.querySelector('.btn-close-versions');

    // Close button handler
    const handleClose = () => {
      closeBtn.removeEventListener('click', handleClose);
      modalContainer.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleEscape);
      modalContainer.remove();
    };

    // Click outside to close handler
    const handleOverlayClick = (e) => {
      if (e.target === modalContainer) {
        handleClose();
      }
    };

    // ESC key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // Click handler for preview and restore buttons
    const handleButtonClick = async (e) => {
      const previewBtn = e.target.closest('.btn-preview');
      const restoreBtn = e.target.closest('.btn-restore');

      if (previewBtn) {
        e.stopPropagation();
        const versionNumber = parseInt(previewBtn.getAttribute('data-version-number'));
        await this.previewVersion(versionNumber);
      } else if (restoreBtn) {
        e.stopPropagation();
        const versionNumber = parseInt(restoreBtn.getAttribute('data-version-number'));
        await this.restoreVersion(versionNumber, modalContainer);
      }
    };

    // Attach event listeners
    closeBtn.addEventListener('click', handleClose);
    modalContainer.addEventListener('click', handleOverlayClick);
    modalContainer.addEventListener('click', handleButtonClick);
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Preview a version
   * @param {number} versionNumber - Version number
   */
  async previewVersion(versionNumber) {
    try {
      const response = await fetch(
        `${this.apiUrl}/documents/${this.currentDocument.id}/versions/${versionNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...window.Domma.auth.getHeaders()
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load version');
      }

      const data = await response.json();
      const version = data.version;

      // Create preview modal using native DOM
      const previewHTML = `
                <div class="version-preview-modal">
                    <div class="version-preview-header">
                        <h2>Preview: ${this.escapeHtml(version.title)}</h2>
                        <div class="version-preview-meta">
                            Version ${version.version_number} •
                            ${window.D(version.created_at).format('MMM D, YYYY h:mm A')}
                        </div>
                        <button class="btn-close-preview" data-tooltip="Close">
                            <span data-icon="x" data-icon-size="20"></span>
                        </button>
                    </div>
                    <div class="version-preview-body">
                        ${version.content || '<p>No content</p>'}
                    </div>
                </div>
            `;

      const previewContainer = document.createElement('div');
      previewContainer.className = 'modal-overlay';
      previewContainer.innerHTML = previewHTML;
      document.body.appendChild(previewContainer);

      // Initialize Domma icons
      if (window.Domma && window.Domma.icons) {
        window.Domma.icons.scan();
      }

      // Close handlers with native DOM
      const closeBtn = previewContainer.querySelector('.btn-close-preview');

      const handleClose = () => {
        closeBtn.removeEventListener('click', handleClose);
        previewContainer.removeEventListener('click', handleOverlayClick);
        previewContainer.remove();
      };

      const handleOverlayClick = (e) => {
        if (e.target === previewContainer) {
          handleClose();
        }
      };

      closeBtn.addEventListener('click', handleClose);
      previewContainer.addEventListener('click', handleOverlayClick);

    } catch (error) {
      console.error('Failed to preview version:', error);
      await window.Domma.elements.alert('Failed to load version preview.', {
        title: 'Error'
      });
    }
  }

  /**
   * Restore a version
   * @param {number} versionNumber - Version number
   * @param {jQuery} modalContainer - Parent modal container
   */
  async restoreVersion(versionNumber, modalContainer) {
    const confirmed = await window.Domma.elements.confirm(
      `Restore to version ${versionNumber}? This will create a new version with the previous content.`,
      {title: 'Restore Version'}
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${this.apiUrl}/documents/${this.currentDocument.id}/versions/${versionNumber}/restore`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...window.Domma.auth.getHeaders()
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to restore version');
      }

      const data = await response.json();

      // Close modal
      modalContainer.remove();

      // Show success message
      await window.Domma.elements.alert(
        `Successfully restored to version ${versionNumber}. New version ${data.new_version} created.`,
        {title: 'Version Restored'}
      );

      // Reload document if currently open
      if (this.app && this.app.currentDocId === this.currentDocument.id) {
        await this.app.openDocument(this.currentDocument.id);
      }

    } catch (error) {
      console.error('Failed to restore version:', error);
      await window.Domma.elements.alert('Failed to restore version. Please try again.', {
        title: 'Error'
      });
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
