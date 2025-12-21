/**
 * Folder Manager
 * Handles hierarchical folder organization for documents
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
    this.folderTree = [];
  }

  /**
   * Initialize folder manager
   */
  async init() {
    await this.loadFolders();
    this.renderSidebar();
    this.setupSidebarListeners();
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
      this.folderTree = this.buildTree();

    } catch (error) {
      console.error('Failed to load folders:', error);
      this.folders = [];
      this.folderTree = [];
    }
  }

  /**
   * Build hierarchical tree structure from flat folder list
   * @returns {Array} Tree structure
   */
  buildTree() {
    const folderMap = {};
    const tree = [];

    // Create map of all folders
    this.folders.forEach(folder => {
      folderMap[folder.id] = {
        ...folder,
        children: []
      };
    });

    // Build tree by assigning children to parents
    this.folders.forEach(folder => {
      if (folder.parent_id === null) {
        // Root level folder
        tree.push(folderMap[folder.id]);
      } else if (folderMap[folder.parent_id]) {
        // Child folder
        folderMap[folder.parent_id].children.push(folderMap[folder.id]);
      }
    });

    // Sort tree by position and name
    const sortFolders = (folders) => {
      folders.sort((a, b) => {
        if (a.position !== b.position) {
          return a.position - b.position;
        }
        return a.name.localeCompare(b.name);
      });
      folders.forEach(folder => {
        if (folder.children.length > 0) {
          sortFolders(folder.children);
        }
      });
    };

    sortFolders(tree);

    return tree;
  }

  /**
   * Render folder sidebar
   */
  renderSidebar() {
    const sidebar = document.getElementById('folderSidebar');
    if (!sidebar) return;

    let html = '<div class="folder-list">';

    // "All Documents" option
    html += `
            <div class="folder-item all-documents ${this.currentFolderId === null ? 'active' : ''}"
                 data-folder-id="null">
                <div class="folder-content">
                    <span class="folder-icon" data-icon="folder-open" data-icon-size="18"></span>
                    <span class="folder-name">All Documents</span>
                </div>
            </div>
        `;

    // Render folder tree
    this.folderTree.forEach(folder => {
      html += this.renderFolderNode(folder, 0);
    });

    // New folder button
    html += `
            <div class="folder-actions-bottom">
                <button class="btn-new-folder" id="btnNewFolder">
                    <span data-icon="plus" data-icon-size="16"></span>
                    New Folder
                </button>
            </div>
        `;

    html += '</div>';

    sidebar.innerHTML = html;

    // Initialize Domma icons
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
    if (!this.app || !this.app.documents) return 0;
    return this.app.documents.filter(doc => {
      const docFolderId = doc.folder_id === null ? null : parseInt(doc.folder_id);
      return docFolderId === folderId;
    }).length;
  }

  /**
   * Render a folder node (recursive)
   * @param {Object} folder - Folder object
   * @param {number} depth - Nesting depth
   * @returns {string} HTML string
   */
  renderFolderNode(folder, depth) {
    const isActive = this.currentFolderId === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = true; // Default to expanded

    // Count documents in this folder
    const docCount = this.getDocumentCount(folder.id);

    let html = `
            <div class="folder-item ${isActive ? 'active' : ''}"
                 data-folder-id="${folder.id}"
                 style="padding-left: ${depth * 1.5 + 1}rem;">
                <div class="folder-content">
                    ${hasChildren ? `
                        <button class="folder-toggle ${isExpanded ? 'expanded' : ''}"
                                data-folder-id="${folder.id}">
                            <span data-icon="chevron-down" data-icon-size="14"></span>
                        </button>
                    ` : '<span class="folder-spacer"></span>'}
                    <span class="folder-icon" data-icon="${folder.icon || 'folder'}" data-icon-size="18"
                          ${folder.color ? `style="color: ${folder.color};"` : ''}></span>
                    <span class="folder-name">${this.escapeHtml(folder.name)}</span>
                    ${docCount > 0 ? `<span class="folder-badge">${docCount}</span>` : ''}
                </div>
                <div class="folder-item-actions">
                    <button class="btn-folder-action" data-action="subfolder" data-folder-id="${folder.id}"
                            data-tooltip="New subfolder">
                        <span data-icon="folder-plus" data-icon-size="14"></span>
                    </button>
                    <button class="btn-folder-action" data-action="edit" data-folder-id="${folder.id}"
                            data-tooltip="Edit folder">
                        <span data-icon="edit" data-icon-size="14"></span>
                    </button>
                    <button class="btn-folder-action" data-action="delete" data-folder-id="${folder.id}"
                            data-tooltip="Delete folder">
                        <span data-icon="trash" data-icon-size="14"></span>
                    </button>
                </div>
            </div>
        `;

    // Render children
    if (hasChildren && isExpanded) {
      html += `<div class="folder-children" data-parent-id="${folder.id}">`;
      folder.children.forEach(child => {
        html += this.renderFolderNode(child, depth + 1);
      });
      html += '</div>';
    }

    return html;
  }

  /**
   * Setup event listeners for sidebar
   */
  setupSidebarListeners() {
    const sidebar = document.getElementById('folderSidebar');
    if (!sidebar) return;

    // Folder click - filter documents
    sidebar.addEventListener('click', (e) => {
      const folderItem = e.target.closest('.folder-item');
      if (folderItem && !e.target.closest('.btn-folder-action') && !e.target.closest('.folder-toggle')) {
        const folderId = folderItem.getAttribute('data-folder-id');
        this.selectFolder(folderId === 'null' ? null : parseInt(folderId));
      }
    });

    // Toggle folder expand/collapse
    sidebar.addEventListener('click', (e) => {
      const toggle = e.target.closest('.folder-toggle');
      if (toggle) {
        e.stopPropagation();
        this.toggleFolder(parseInt(toggle.getAttribute('data-folder-id')));
      }
    });

    // Folder actions (subfolder/edit/delete)
    sidebar.addEventListener('click', async (e) => {
      const actionBtn = e.target.closest('.btn-folder-action');
      if (actionBtn) {
        e.stopPropagation();
        const action = actionBtn.getAttribute('data-action');
        const folderId = parseInt(actionBtn.getAttribute('data-folder-id'));

        if (action === 'subfolder') {
          await this.createFolder(folderId);
        } else if (action === 'edit') {
          await this.editFolder(folderId);
        } else if (action === 'delete') {
          await this.deleteFolder(folderId);
        }
      }
    });

    // New folder button
    const btnNewFolder = document.getElementById('btnNewFolder');
    if (btnNewFolder) {
      btnNewFolder.addEventListener('click', () => this.createFolder());
    }
  }

  /**
   * Select a folder and filter documents
   * @param {number|null} folderId - Folder ID or null for all documents
   */
  selectFolder(folderId) {
    this.currentFolderId = folderId;
    this.renderSidebar(); // Re-render to update active state

    // Filter documents in main app
    if (this.app && this.app.filterByFolder) {
      this.app.filterByFolder(folderId);
    }
  }

  /**
   * Toggle folder expand/collapse
   * @param {number} folderId - Folder ID
   */
  toggleFolder(folderId) {
    const toggle = document.querySelector(`.folder-toggle[data-folder-id="${folderId}"]`);
    const children = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);

    if (!toggle || !children) return;

    const isExpanded = toggle.classList.contains('expanded');

    if (isExpanded) {
      toggle.classList.remove('expanded');
      children.style.display = 'none';
    } else {
      toggle.classList.add('expanded');
      children.style.display = 'block';
    }
  }

  /**
   * Create a new folder
   * @param {number|null} parentId - Parent folder ID
   */
  async createFolder(parentId = null) {
    // Get parent folder name if parentId is provided
    let parentFolder = null;
    let dialogTitle = 'New Folder';
    let parentFieldHTML = '';

    if (parentId !== null) {
      // Creating a subfolder - show disabled parent field
      parentFolder = this.folders.find(f => f.id === parentId);
      if (parentFolder) {
        dialogTitle = `New Subfolder in "${parentFolder.name}"`;
      }
      parentFieldHTML = `
                <div class="form-group">
                    <label>Parent Folder</label>
                    <input type="text" class="form-control"
                           value="${this.escapeHtml(parentFolder?.name || 'Root')}" disabled>
                </div>
            `;
    } else {
      // Creating a new folder - show parent dropdown
      let parentOptionsHTML = '<option value="null">Root (No Parent)</option>';

      const buildOptions = (folders, depth = 0) => {
        folders.forEach(f => {
          const indent = '&nbsp;&nbsp;'.repeat(depth);
          parentOptionsHTML += `<option value="${f.id}">${indent}${this.escapeHtml(f.name)}</option>`;

          if (f.children && f.children.length > 0) {
            buildOptions(f.children, depth + 1);
          }
        });
      };

      buildOptions(this.folderTree);

      parentFieldHTML = `
                <div class="form-group">
                    <label for="folderParent">Parent Folder</label>
                    <select id="folderParent" class="form-control">
                        ${parentOptionsHTML}
                    </select>
                </div>
            `;
    }

    // Create modal HTML
    const modalHTML = `
            <div class="edit-folder-modal">
                <h3>${dialogTitle}</h3>
                <div class="form-group">
                    <label for="folderName">Folder Name</label>
                    <input type="text" id="folderName" class="form-control"
                           placeholder="My Folder" autofocus>
                </div>
                ${parentFieldHTML}
                <div class="form-group">
                    <label for="folderColor">Folder Color</label>
                    <input type="color" id="folderColor" class="form-control" value="#6b7280">
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-create">Create</button>
                </div>
            </div>
        `;

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Handle modal actions with native event listeners
    return new Promise((resolve) => {
      const createBtn = modalContainer.querySelector('.btn-create');
      const cancelBtn = modalContainer.querySelector('.btn-cancel');
      const nameInput = document.getElementById('folderName');
      const parentSelect = document.getElementById('folderParent');
      const colorInput = document.getElementById('folderColor');

      const handleCreate = async () => {
        const name = nameInput.value.trim();
        const color = colorInput.value;

        // Get parent ID from dropdown (if available) or use provided parentId
        let finalParentId = parentId;
        if (parentId === null && parentSelect) {
          finalParentId = parentSelect.value === 'null' ? null : parseInt(parentSelect.value);
        }

        if (!name || name.length === 0) {
          await window.Domma.elements.alert('Please enter a folder name.', {
            title: 'Validation Error'
          });
          return;
        }

        try {
          const response = await fetch(`${this.apiUrl}/folders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...window.Domma.auth.getHeaders()
            },
            body: JSON.stringify({
              name: name,
              parent_id: finalParentId,
              color: color
            })
          });

          if (!response.ok) {
            throw new Error('Failed to create folder');
          }

          // Remove event listeners
          createBtn.removeEventListener('click', handleCreate);
          cancelBtn.removeEventListener('click', handleCancel);
          modalContainer.removeEventListener('click', handleOverlayClick);
          document.removeEventListener('keydown', handleEscape);

          modalContainer.remove();

          // Reload folders and re-render
          await this.loadFolders();
          this.renderSidebar();
          this.setupSidebarListeners();

          resolve(true);

        } catch (error) {
          console.error('Failed to create folder:', error);
          await window.Domma.elements.alert('Failed to create folder. Please try again.', {
            title: 'Error'
          });
        }
      };

      const handleCancel = () => {
        createBtn.removeEventListener('click', handleCreate);
        cancelBtn.removeEventListener('click', handleCancel);
        modalContainer.removeEventListener('click', handleOverlayClick);
        document.removeEventListener('keydown', handleEscape);
        modalContainer.remove();
        resolve(false);
      };

      const handleOverlayClick = (e) => {
        if (e.target === modalContainer) {
          handleCancel();
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleCancel();
        }
      };

      createBtn.addEventListener('click', handleCreate);
      cancelBtn.addEventListener('click', handleCancel);
      modalContainer.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleEscape);

      // Focus name input
      nameInput.focus();
    });
  }

  /**
   * Edit a folder
   * @param {number} folderId - Folder ID
   */
  async editFolder(folderId) {
    await this.showEditFolderDialog(folderId);
  }

  /**
   * Show edit folder dialog with parent and color options
   * @param {number} folderId - Folder ID to edit
   */
  async showEditFolderDialog(folderId) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;

    // Helper function to check if a folder is a descendant
    const isDescendant = (checkFolder, targetId) => {
      if (checkFolder.id === targetId) return true;
      if (!checkFolder.children) return false;
      return checkFolder.children.some(c => isDescendant(c, targetId));
    };

    // Build parent folder options (exclude self and descendants)
    let parentOptionsHTML = '<option value="null">Root (No Parent)</option>';

    const buildOptions = (folders, depth = 0) => {
      folders.forEach(f => {
        // Skip the folder itself and all its descendants
        if (f.id === folderId || isDescendant(f, folderId)) return;

        const indent = '&nbsp;&nbsp;'.repeat(depth);
        const selected = folder.parent_id === f.id ? 'selected' : '';
        parentOptionsHTML += `<option value="${f.id}" ${selected}>${indent}${this.escapeHtml(f.name)}</option>`;

        if (f.children && f.children.length > 0) {
          buildOptions(f.children, depth + 1);
        }
      });
    };

    buildOptions(this.folderTree);

    // Create modal HTML
    const modalHTML = `
            <div class="edit-folder-modal">
                <h3>Edit Folder</h3>
                <div class="form-group">
                    <label for="folderName">Folder Name</label>
                    <input type="text" id="folderName" class="form-control"
                           value="${this.escapeHtml(folder.name)}" placeholder="Folder name">
                </div>
                <div class="form-group">
                    <label for="folderParent">Parent Folder</label>
                    <select id="folderParent" class="form-control">
                        ${parentOptionsHTML}
                    </select>
                </div>
                <div class="form-group">
                    <label for="folderColor">Folder Color</label>
                    <input type="color" id="folderColor" class="form-control"
                           value="${folder.color || '#6b7280'}">
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-save">Save</button>
                </div>
            </div>
        `;

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Handle modal actions with native event listeners
    return new Promise((resolve) => {
      const saveBtn = modalContainer.querySelector('.btn-save');
      const cancelBtn = modalContainer.querySelector('.btn-cancel');
      const nameInput = document.getElementById('folderName');
      const parentSelect = document.getElementById('folderParent');
      const colorInput = document.getElementById('folderColor');

      const handleSave = async () => {
        const newName = nameInput.value.trim();
        const newParentId = parentSelect.value === 'null' ? null : parseInt(parentSelect.value);
        const newColor = colorInput.value;

        if (!newName || newName.length === 0) {
          await window.Domma.elements.alert('Please enter a folder name.', {
            title: 'Validation Error'
          });
          return;
        }

        try {
          const response = await fetch(`${this.apiUrl}/folders/${folderId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...window.Domma.auth.getHeaders()
            },
            body: JSON.stringify({
              name: newName,
              parent_id: newParentId,
              color: newColor
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update folder');
          }

          // Remove event listeners
          saveBtn.removeEventListener('click', handleSave);
          cancelBtn.removeEventListener('click', handleCancel);
          modalContainer.removeEventListener('click', handleOverlayClick);
          document.removeEventListener('keydown', handleEscape);

          modalContainer.remove();

          // Reload folders and re-render
          await this.loadFolders();
          this.renderSidebar();
          this.setupSidebarListeners();

          resolve(true);

        } catch (error) {
          console.error('Failed to update folder:', error);
          await window.Domma.elements.alert('Failed to update folder. Please try again.', {
            title: 'Error'
          });
        }
      };

      const handleCancel = () => {
        saveBtn.removeEventListener('click', handleSave);
        cancelBtn.removeEventListener('click', handleCancel);
        modalContainer.removeEventListener('click', handleOverlayClick);
        document.removeEventListener('keydown', handleEscape);
        modalContainer.remove();
        resolve(false);
      };

      const handleOverlayClick = (e) => {
        if (e.target === modalContainer) {
          handleCancel();
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleCancel();
        }
      };

      saveBtn.addEventListener('click', handleSave);
      cancelBtn.addEventListener('click', handleCancel);
      modalContainer.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleEscape);

      // Focus name input
      nameInput.focus();
      nameInput.select();
    });
  }

  /**
   * Delete a folder
   * @param {number} folderId - Folder ID
   */
  async deleteFolder(folderId) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;

    const confirmed = await window.Domma.elements.confirm(
      `Delete folder "${folder.name}"? Documents inside will be moved to "All Documents".`,
      {title: 'Delete Folder'}
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${this.apiUrl}/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...window.Domma.auth.getHeaders()
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      // If we were viewing this folder, switch to "All Documents"
      if (this.currentFolderId === folderId) {
        this.selectFolder(null);
      }

      // Reload folders and re-render
      await this.loadFolders();
      this.renderSidebar();
      this.setupSidebarListeners();

    } catch (error) {
      console.error('Failed to delete folder:', error);
      await window.Domma.elements.alert('Failed to delete folder. Please try again.', {
        title: 'Error'
      });
    }
  }

  /**
   * Move document to folder
   * @param {number} documentId - Document ID
   * @param {number|null} folderId - Target folder ID (null for root)
   */
  async moveDocumentToFolder(documentId, folderId) {
    try {
      const response = await fetch(
        `${this.apiUrl}/folders/${folderId || 'null'}/documents/${documentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...window.Domma.auth.getHeaders()
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        throw new Error('Failed to move document');
      }

      return true;

    } catch (error) {
      console.error('Failed to move document:', error);
      return false;
    }
  }

  /**
   * Show modal to move document to folder
   * @param {number} documentId - Document ID
   */
  async showMoveToFolderModal(documentId) {
    // Build folder selection HTML
    let optionsHTML = '<option value="null">All Documents (Root)</option>';

    const buildOptions = (folders, depth = 0) => {
      folders.forEach(folder => {
        const indent = '&nbsp;&nbsp;'.repeat(depth);
        optionsHTML += `<option value="${folder.id}">${indent}${this.escapeHtml(folder.name)}</option>`;
        if (folder.children && folder.children.length > 0) {
          buildOptions(folder.children, depth + 1);
        }
      });
    };

    buildOptions(this.folderTree);

    // Create modal using native DOM
    const modalHTML = `
            <div class="move-to-folder-modal">
                <h3>Move Document to Folder</h3>
                <select id="folderSelect" class="folder-select">
                    ${optionsHTML}
                </select>
                <div class="modal-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-move">Move</button>
                </div>
            </div>
        `;

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Handle modal actions with native event listeners
    return new Promise((resolve) => {
      const moveBtn = modalContainer.querySelector('.btn-move');
      const cancelBtn = modalContainer.querySelector('.btn-cancel');

      const handleMove = async () => {
        const select = document.getElementById('folderSelect');
        const folderId = select.value === 'null' ? null : parseInt(select.value);

        console.log('Moving document', documentId, 'to folder', folderId);

        const success = await this.moveDocumentToFolder(documentId, folderId);

        // Remove event listeners
        moveBtn.removeEventListener('click', handleMove);
        cancelBtn.removeEventListener('click', handleCancel);
        modalContainer.removeEventListener('click', handleOverlayClick);

        modalContainer.remove();

        if (success) {
          // Reload and reapply current folder filter
          if (this.app && this.app.filterByFolder) {
            await this.app.filterByFolder(this.currentFolderId);
          }
        }

        resolve(success);
      };

      const handleCancel = () => {
        moveBtn.removeEventListener('click', handleMove);
        cancelBtn.removeEventListener('click', handleCancel);
        modalContainer.removeEventListener('click', handleOverlayClick);
        modalContainer.remove();
        resolve(false);
      };

      const handleOverlayClick = (e) => {
        if (e.target === modalContainer) {
          handleCancel();
        }
      };

      moveBtn.addEventListener('click', handleMove);
      cancelBtn.addEventListener('click', handleCancel);
      modalContainer.addEventListener('click', handleOverlayClick);
    });
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
