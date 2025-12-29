/**
 * Folder Manager
 * Handles hierarchical folder organisation for documents
 * Refactored to use Domma TreeView component
 */

import config from '../../shared/config.js';

export class FolderManager {
  /**
   * Create a new FolderManager instance
   * @param {Object} app - Reference to main DocsApp
   */
  constructor(app) {
    this.app = app;
    this.apiUrl = config.apiUrl;
    this.folders = [];
    this.currentFolderId = null;
    this.treeView = null;
  }

  /**
   * Initialise folder manager
   */
  async init() {
    await this.loadFolders();
    this._initTreeView();
  }

  /**
   * Load all folders from API
   */
  async loadFolders() {
    try {
      const response = await fetch(`${this.apiUrl}/folders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...window.Domma.auth.getHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load folders: ${response.statusText}`);
      }

      const data = await response.json();
      this.folders = data.folders || [];

    } catch (error) {
      console.error('Failed to load folders:', error);
      this.folders = [];
    }
  }

  /**
   * Initialise TreeView component
   * @private
   */
  _initTreeView() {
    const sidebar = document.getElementById('folderSidebar');
    if (!sidebar) return;

    // Create container for tree
    sidebar.innerHTML = `
      <div class="folder-list">
        <div class="folder-item all-documents ${this.currentFolderId === null ? 'active' : ''}"
             data-folder-id="null">
          <div class="folder-content">
            <span class="folder-icon" data-icon="folder-open" data-icon-size="18"></span>
            <span class="folder-name">All Documents</span>
          </div>
        </div>
        <div id="folderTree"></div>
        <div class="folder-actions-bottom">
          <button class="btn-new-folder" id="btnNewFolder">
            <span data-icon="plus" data-icon-size="16"></span>
            New Folder
          </button>
        </div>
      </div>
    `;

    // Initialize TreeView component
    this.treeView = window.Domma.elements.treeView('#folderTree', {
      data: this.folders,
      idKey: 'id',
      parentKey: 'parent_id',
      labelKey: 'name',
      iconKey: 'icon',
      colorKey: 'color',
      expandedByDefault: true,
      selectable: true,
      indentSize: 1.5,

      // Custom node rendering
      renderNode: (node, depth, state) => {
        return `
          <span class="folder-icon"
                data-icon="${node.icon || 'folder'}"
                data-icon-size="18"
                ${node.color ? `style="color: ${node.color};"` : ''}></span>
          <span class="folder-name">${this.escapeHtml(node.name)}</span>
        `;
      },

      // Badge counts
      getBadge: (node) => {
        const count = this.getDocumentCount(node.id);
        return count > 0 ? count : null;
      },

      // Action buttons
      actions: [
        {
          name: 'subfolder',
          icon: 'folder-plus',
          tooltip: 'New subfolder',
          visible: () => true
        },
        {
          name: 'edit',
          icon: 'edit',
          tooltip: 'Edit folder',
          visible: () => true
        },
        {
          name: 'delete',
          icon: 'trash',
          tooltip: 'Delete folder',
          visible: () => true
        }
      ],

      // Event handlers
      onSelect: (nodeId, node) => {
        this.selectFolder(nodeId);
      },

      onAction: async (action, nodeId, node) => {
        if (action === 'subfolder') {
          await this.createFolder(nodeId);
        } else if (action === 'edit') {
          await this.editFolder(nodeId);
        } else if (action === 'delete') {
          await this.deleteFolder(nodeId);
        }
      }
    });

    // Setup listener for "All Documents" option
    const allDocsItem = sidebar.querySelector('.all-documents');
    if (allDocsItem) {
      allDocsItem.addEventListener('click', () => {
        this.selectFolder(null);
      });
    }

    // Setup listener for "New Folder" button
    const newFolderBtn = document.getElementById('btnNewFolder');
    if (newFolderBtn) {
      newFolderBtn.addEventListener('click', () => {
        this.createFolder(null);
      });
    }

    // Initialize Domma icons
    if (window.Domma && window.Domma.icons) {
      window.Domma.icons.scan();
    }
  }

  /**
   * Refresh folder badges without full re-render
   */
  async refreshBadges() {
    // Reload documents to get accurate counts
    if (this.app && this.app.loadDocuments) {
      await this.app.loadDocuments();
    }

    // Refresh tree view (will re-call getBadge for all nodes)
    if (this.treeView) {
      this.treeView.refresh();
    }

    // Also refresh icons
    if (window.Domma && window.Domma.icons) {
      window.Domma.icons.scan();
    }
  }

  /**
   * Get document count for a folder
   * @param {number} folderId - Folder ID
   * @returns {number} Number of documents in folder
   */
  getDocumentCount(folderId) {
    // Count from ALL documents, not filtered ones
    if (!this.app || !this.app.allDocuments) return 0;
    return this.app.allDocuments.filter(doc => {
      const docFolderId = doc.folder_id === null ? null : doc.folder_id; // MongoDB ObjectId is a string
      return docFolderId === folderId;
    }).length;
  }

  /**
   * Select a folder
   * @param {number|null} folderId - Folder ID or null for all documents
   */
  selectFolder(folderId) {
    this.currentFolderId = folderId;

    // Update UI - highlight selected folder
    const sidebar = document.getElementById('folderSidebar');
    if (sidebar) {
      // Remove active class from all folders
      sidebar.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('active');
      });

      // Add active class to selected folder
      if (folderId === null) {
        const allDocs = sidebar.querySelector('.all-documents');
        if (allDocs) allDocs.classList.add('active');
      }
      // TreeView handles its own selected state
    }

    // Filter documents in app
    if (this.app && this.app.filterByFolder) {
      this.app.filterByFolder(folderId);
    }
  }

  /**
   * Escape HTML in strings
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create a new folder
   * @param {number|null} parentId - Parent folder ID or null for root
   */
  async createFolder(parentId = null) {
    const folderName = prompt('Enter folder name:');
    if (!folderName || !folderName.trim()) return;

    try {
      const response = await fetch(`${this.apiUrl}/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...window.Domma.auth.getHeaders()
        },
        body: JSON.stringify({
          name: folderName.trim(),
          parent_id: parentId,
          icon: 'folder',
          color: null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      const data = await response.json();

      // Add to folders array
      this.folders.push(data.folder);

      // Refresh tree view
      await this.loadFolders();
      this._initTreeView();
      await this.refreshBadges();

      window.Domma.elements.toast('Folder created successfully', {type: 'success'});

    } catch (error) {
      console.error('Failed to create folder:', error);
      window.Domma.elements.toast('Failed to create folder', {type: 'error'});
    }
  }

  /**
   * Edit a folder
   * @param {number} folderId - Folder ID
   */
  async editFolder(folderId) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;

    const newName = prompt('Edit folder name:', folder.name);
    if (!newName || !newName.trim() || newName === folder.name) return;

    try {
      const response = await fetch(`${this.apiUrl}/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...window.Domma.auth.getHeaders()
        },
        body: JSON.stringify({
          name: newName.trim(),
          icon: folder.icon,
          color: folder.color
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update folder');
      }

      // Update folder in array
      folder.name = newName.trim();

      // Refresh tree view
      await this.loadFolders();
      this._initTreeView();
      await this.refreshBadges();

      window.Domma.elements.toast('Folder updated successfully', {type: 'success'});

    } catch (error) {
      console.error('Failed to update folder:', error);
      window.Domma.elements.toast('Failed to update folder', {type: 'error'});
    }
  }

  /**
   * Delete a folder
   * @param {number} folderId - Folder ID
   */
  async deleteFolder(folderId) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;

    // Check if folder has children
    const hasChildren = this.folders.some(f => f.parent_id === folderId);
    if (hasChildren) {
      window.Domma.elements.toast('Cannot delete folder with subfolders', {type: 'warning'});
      return;
    }

    // Check if folder has documents
    const docCount = this.getDocumentCount(folderId);
    if (docCount > 0) {
      const confirm = await window.Domma.elements.confirm(
        `This folder contains ${docCount} document(s). Delete anyway?`,
        {
          title: 'Delete Folder',
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      );
      if (!confirm) return;
    } else {
      const confirm = await window.Domma.elements.confirm(
        `Delete folder "${folder.name}"?`,
        {
          title: 'Delete Folder',
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      );
      if (!confirm) return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...window.Domma.auth.getHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      // Remove from folders array
      this.folders = this.folders.filter(f => f.id !== folderId);

      // If current folder was deleted, select "All Documents"
      if (this.currentFolderId === folderId) {
        this.selectFolder(null);
      }

      // Refresh tree view
      await this.loadFolders();
      this._initTreeView();
      await this.refreshBadges();

      window.Domma.elements.toast('Folder deleted successfully', {type: 'success'});

    } catch (error) {
      console.error('Failed to delete folder:', error);
      window.Domma.elements.toast('Failed to delete folder', {type: 'error'});
    }
  }

  /**
   * Move a document to a folder
   * @param {number} documentId - Document ID
   * @param {number|null} folderId - Target folder ID or null for root
   */
  async moveDocument(documentId, folderId) {
    try {
      const response = await fetch(`${this.apiUrl}/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...window.Domma.auth.getHeaders()
        },
        body: JSON.stringify({
          folder_id: folderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to move document');
      }

      // Refresh badges to reflect new counts
      await this.refreshBadges();

      window.Domma.elements.toast('Document moved successfully', {type: 'success'});

    } catch (error) {
      console.error('Failed to move document:', error);
      window.Domma.elements.toast('Failed to move document', {type: 'error'});
    }
  }

  /**
   * Get folder by ID
   * @param {number} folderId - Folder ID
   * @returns {Object|null} Folder object or null
   */
  getFolder(folderId) {
    return this.folders.find(f => f.id === folderId) || null;
  }

  /**
   * Get folder path (breadcrumb trail)
   * @param {number} folderId - Folder ID
   * @returns {Array} Array of folders from root to current
   */
  getFolderPath(folderId) {
    const path = [];
    let currentId = folderId;

    while (currentId !== null) {
      const folder = this.getFolder(currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parent_id;
    }

    return path;
  }
}
