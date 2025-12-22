/**
 * Domma TreeView Component
 * Renders hierarchical data structures with expand/collapse, selection, and custom rendering
 *
 * @example
 * const tree = Domma.elements.treeView('#sidebar', {
 *     data: folders,
 *     idKey: 'id',
 *     parentKey: 'parent_id',
 *     renderNode: (node, depth, state) => `<span>${node.name}</span>`,
 *     getBadge: (node) => node.count || null,
 *     onSelect: (nodeId, node) => console.log('Selected:', node)
 * });
 */

import Component from './component.js';

class TreeView extends Component {
  static defaults = {
    // Data configuration
    data: [],
    idKey: 'id',
    parentKey: 'parent_id',
    childrenKey: 'children',
    labelKey: 'name',
    iconKey: 'icon',
    colorKey: 'color',

    // Tree behaviour
    expandedByDefault: true,
    expandedNodes: [],
    selectable: true,
    multiSelect: false,
    selectedNodes: [],

    // Rendering callbacks
    renderNode: null,
    getBadge: null,
    getNodeIcon: null,
    getNodeClass: null,

    // Action buttons
    actions: [],

    // Visual options
    indentSize: 1.5,
    showIcons: true,
    showToggleButtons: true,
    toggleIcon: 'chevron-down',

    // Events
    onSelect: null,
    onDeselect: null,
    onExpand: null,
    onCollapse: null,
    onAction: null,
    onClick: null
  };

  constructor(selector, options = {}) {
    super(selector, options);

    if (!this.element) {
      console.error('TreeView: Element not found', selector);
      return;
    }

    this._tree = [];
    this._flatMap = {};
    this._expandedNodes = new Set();
    this._selectedNodes = new Set();

    this._init();
  }

  /**
   * Initialise the TreeView component
   * @private
   */
  _init() {
    // Add base class
    if (!this.element.classList.contains('dm-treeview')) {
      this.element.classList.add('dm-treeview');
    }

    // Initialise expanded nodes
    if (this.options.expandedNodes.length > 0) {
      this.options.expandedNodes.forEach(id => this._expandedNodes.add(id));
    }

    // Initialise selected nodes
    if (this.options.selectedNodes.length > 0) {
      this.options.selectedNodes.forEach(id => this._selectedNodes.add(id));
    }

    // Build tree and render
    if (this.options.data && this.options.data.length > 0) {
      this.setData(this.options.data);
    }

    // Setup event listeners
    this._setupEventListeners();
  }

  /**
   * Setup event delegation
   * @private
   */
  _setupEventListeners() {
    // Node selection
    this._addEventListener(this.element, 'click', (e) => {
      const nodeEl = e.target.closest('.dm-treeview-node');
      if (!nodeEl || e.target.closest('.dm-treeview-toggle') || e.target.closest('.dm-treeview-action')) {
        return;
      }

      const nodeId = this._parseNodeId(nodeEl.dataset.nodeId);
      this._handleSelect(nodeId, e);
    });

    // Toggle expand/collapse
    this._addEventListener(this.element, 'click', (e) => {
      const toggle = e.target.closest('.dm-treeview-toggle');
      if (toggle) {
        e.stopPropagation();
        const nodeId = this._parseNodeId(toggle.dataset.nodeId);
        this.toggle(nodeId);
      }
    });

    // Action buttons
    this._addEventListener(this.element, 'click', (e) => {
      const action = e.target.closest('.dm-treeview-action');
      if (action) {
        e.stopPropagation();
        const nodeId = this._parseNodeId(action.dataset.nodeId);
        const actionName = action.dataset.action;
        this._handleAction(actionName, nodeId, e);
      }
    });
  }

  /**
   * Build tree structure from flat data
   * @private
   * @param {Array} data - Flat array of nodes
   * @returns {Object} Object with tree and nodeMap
   */
  _buildTree(data) {
    const nodeMap = {};
    const tree = [];
    const idKey = this.options.idKey;
    const parentKey = this.options.parentKey;
    const childrenKey = this.options.childrenKey;

    // First pass: Create map
    data.forEach(item => {
      nodeMap[item[idKey]] = {
        ...item,
        [childrenKey]: []
      };
    });

    // Second pass: Build hierarchy
    data.forEach(item => {
      const node = nodeMap[item[idKey]];
      const parentId = item[parentKey];

      if (parentId === null || parentId === undefined) {
        tree.push(node);
      } else if (nodeMap[parentId]) {
        nodeMap[parentId][childrenKey].push(node);
      } else {
        // Orphaned node - add to root
        tree.push(node);
      }
    });

    // Sort tree
    this._sortTree(tree);

    return {tree, nodeMap};
  }

  /**
   * Sort tree nodes recursively
   * @private
   * @param {Array} nodes - Array of nodes to sort
   */
  _sortTree(nodes) {
    const childrenKey = this.options.childrenKey;
    const labelKey = this.options.labelKey;

    nodes.sort((a, b) => {
      const aLabel = (a[labelKey] || '').toLowerCase();
      const bLabel = (b[labelKey] || '').toLowerCase();
      return aLabel.localeCompare(bLabel);
    });

    nodes.forEach(node => {
      if (node[childrenKey] && node[childrenKey].length > 0) {
        this._sortTree(node[childrenKey]);
      }
    });
  }

  /**
   * Render tree to DOM
   * @private
   */
  _render() {
    const html = this._tree.map(node => this._renderNode(node, 0)).join('');
    this.element.innerHTML = html;
  }

  /**
   * Render a single node recursively
   * @private
   * @param {Object} node - Node data
   * @param {number} depth - Current depth level
   * @returns {string} HTML string
   */
  _renderNode(node, depth) {
    const idKey = this.options.idKey;
    const childrenKey = this.options.childrenKey;
    const nodeId = node[idKey];
    const hasChildren = node[childrenKey] && node[childrenKey].length > 0;
    const isExpanded = this._expandedNodes.has(nodeId);
    const isSelected = this._selectedNodes.has(nodeId);

    const state = {isExpanded, isSelected, hasChildren};

    // Custom render or default
    const content = this.options.renderNode
      ? this.options.renderNode(node, depth, state)
      : this._defaultRenderNode(node, depth, state);

    // Badge
    const badge = this.options.getBadge
      ? this.options.getBadge(node)
      : null;

    // Additional classes
    const additionalClass = this.options.getNodeClass
      ? this.options.getNodeClass(node)
      : '';

    // Build node HTML
    let html = `
      <div class="dm-treeview-node ${isSelected ? 'dm-treeview-node-selected' : ''} ${additionalClass}"
           data-node-id="${nodeId}"
           data-depth="${depth}"
           style="padding-left: ${depth * this.options.indentSize}rem;">
        <div class="dm-treeview-node-content">
          ${hasChildren && this.options.showToggleButtons ? this._renderToggle(nodeId, isExpanded) : '<span class="dm-treeview-spacer"></span>'}
          ${content}
          ${badge !== null && badge !== undefined ? `<span class="dm-treeview-badge">${badge}</span>` : ''}
        </div>
        ${this.options.actions.length > 0 ? this._renderActions(node) : ''}
      </div>
    `;

    // Render children recursively
    if (hasChildren && isExpanded) {
      html += `<div class="dm-treeview-children" data-parent-id="${nodeId}">`;
      node[childrenKey].forEach(child => {
        html += this._renderNode(child, depth + 1);
      });
      html += '</div>';
    }

    return html;
  }

  /**
   * Default node rendering
   * @private
   * @param {Object} node - Node data
   * @param {number} depth - Depth level
   * @param {Object} state - Node state
   * @returns {string} HTML string
   */
  _defaultRenderNode(node, depth, state) {
    const labelKey = this.options.labelKey;
    const iconKey = this.options.iconKey;
    const colorKey = this.options.colorKey;

    const label = node[labelKey] || '';
    const icon = this.options.getNodeIcon
      ? this.options.getNodeIcon(node)
      : node[iconKey];
    const color = node[colorKey];

    let html = '';

    if (this.options.showIcons && icon) {
      html += `<span class="dm-treeview-icon" data-icon="${icon}" ${color ? `style="color: ${color};"` : ''}></span>`;
    }

    html += `<span class="dm-treeview-label">${this._escapeHtml(label)}</span>`;

    return html;
  }

  /**
   * Render toggle button
   * @private
   * @param {string|number} nodeId - Node ID
   * @param {boolean} isExpanded - Is node expanded
   * @returns {string} HTML string
   */
  _renderToggle(nodeId, isExpanded) {
    const icon = this.options.toggleIcon;
    return `
      <button type="button"
              class="dm-treeview-toggle ${isExpanded ? 'dm-treeview-expanded' : 'dm-treeview-collapsed'}"
              data-node-id="${nodeId}"
              aria-label="${isExpanded ? 'Collapse' : 'Expand'}">
        <span data-icon="${icon}"></span>
      </button>
    `;
  }

  /**
   * Render action buttons
   * @private
   * @param {Object} node - Node data
   * @returns {string} HTML string
   */
  _renderActions(node) {
    const nodeId = node[this.options.idKey];
    const visibleActions = this.options.actions.filter(action => {
      if (typeof action.visible === 'function') {
        return action.visible(node);
      }
      return true;
    });

    if (visibleActions.length === 0) {
      return '';
    }

    let html = '<div class="dm-treeview-actions">';
    visibleActions.forEach(action => {
      html += `
        <button type="button"
                class="dm-treeview-action"
                data-node-id="${nodeId}"
                data-action="${action.name}"
                title="${action.tooltip || action.name}"
                aria-label="${action.tooltip || action.name}">
          ${action.icon ? `<span data-icon="${action.icon}"></span>` : action.name}
        </button>
      `;
    });
    html += '</div>';

    return html;
  }

  /**
   * Handle node selection
   * @private
   * @param {string|number} nodeId - Node ID
   * @param {Event} event - Click event
   */
  _handleSelect(nodeId, event) {
    if (!this.options.selectable) {
      return;
    }

    const node = this._flatMap[nodeId];
    if (!node) {
      return;
    }

    // Call onClick if provided
    if (typeof this.options.onClick === 'function') {
      this.options.onClick(nodeId, node, event);
    }

    const wasSelected = this._selectedNodes.has(nodeId);

    if (this.options.multiSelect) {
      // Multi-select mode
      if (wasSelected) {
        this.deselect(nodeId);
      } else {
        this.select(nodeId);
      }
    } else {
      // Single-select mode
      if (wasSelected) {
        this.deselect(nodeId);
      } else {
        // Deselect all others
        this.deselectAll(true);
        this.select(nodeId);
      }
    }
  }

  /**
   * Handle action button click
   * @private
   * @param {string} action - Action name
   * @param {string|number} nodeId - Node ID
   * @param {Event} event - Click event
   */
  _handleAction(action, nodeId, event) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return;
    }

    if (typeof this.options.onAction === 'function') {
      this.options.onAction(action, nodeId, node, event);
    }
  }

  /**
   * Parse node ID (convert string to number if needed)
   * @private
   * @param {string} idString - ID as string
   * @returns {string|number} Parsed ID
   */
  _parseNodeId(idString) {
    // Try to convert to number if it looks like one
    const num = Number(idString);
    return !isNaN(num) && idString === num.toString() ? num : idString;
  }

  /**
   * Escape HTML in strings
   * @private
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===========================================
  // PUBLIC API - Data Management
  // ===========================================

  /**
   * Set tree data
   * @param {Array} data - Flat or hierarchical array
   * @returns {TreeView} This instance for chaining
   */
  setData(data) {
    const {tree, nodeMap} = this._buildTree(data);
    this._tree = tree;
    this._flatMap = nodeMap;

    // Auto-expand nodes if needed
    if (this.options.expandedByDefault) {
      Object.keys(nodeMap).forEach(id => {
        const node = nodeMap[id];
        const childrenKey = this.options.childrenKey;
        if (node[childrenKey] && node[childrenKey].length > 0) {
          this._expandedNodes.add(this._parseNodeId(id));
        }
      });
    }

    this._render();
    return this;
  }

  /**
   * Get tree data (hierarchical)
   * @returns {Array} Tree array
   */
  getData() {
    return this._tree;
  }

  /**
   * Get flat data (all nodes)
   * @returns {Array} Flat array of nodes
   */
  getFlatData() {
    return Object.values(this._flatMap);
  }

  /**
   * Refresh tree rendering
   * @returns {TreeView} This instance for chaining
   */
  refresh() {
    this._render();

    // Rescan icons after rendering
    if (typeof window !== 'undefined' && window.Domma && window.Domma.icons) {
      window.Domma.icons.scan(this.element);
    }

    return this;
  }

  /**
   * Get node by ID
   * @param {string|number} nodeId - Node ID
   * @returns {Object|null} Node data or null
   */
  getNode(nodeId) {
    return this._flatMap[nodeId] || null;
  }

  /**
   * Update node data
   * @param {string|number} nodeId - Node ID
   * @param {Object} changes - Changes to apply
   * @returns {TreeView} This instance for chaining
   */
  updateNode(nodeId, changes) {
    const node = this._flatMap[nodeId];
    if (node) {
      Object.assign(node, changes);
      this.refresh();
    }
    return this;
  }

  // ===========================================
  // PUBLIC API - Selection Management
  // ===========================================

  /**
   * Select a node
   * @param {string|number} nodeId - Node ID
   * @param {boolean} silent - Skip callback if true
   * @returns {TreeView} This instance for chaining
   */
  select(nodeId, silent = false) {
    if (!this.options.selectable) {
      return this;
    }

    const node = this._flatMap[nodeId];
    if (!node) {
      return this;
    }

    this._selectedNodes.add(nodeId);
    this.refresh();

    if (!silent && typeof this.options.onSelect === 'function') {
      this.options.onSelect(nodeId, node, null);
    }

    return this;
  }

  /**
   * Deselect a node
   * @param {string|number} nodeId - Node ID
   * @param {boolean} silent - Skip callback if true
   * @returns {TreeView} This instance for chaining
   */
  deselect(nodeId, silent = false) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return this;
    }

    this._selectedNodes.delete(nodeId);
    this.refresh();

    if (!silent && typeof this.options.onDeselect === 'function') {
      this.options.onDeselect(nodeId, node, null);
    }

    return this;
  }

  /**
   * Toggle node selection
   * @param {string|number} nodeId - Node ID
   * @returns {TreeView} This instance for chaining
   */
  toggleSelect(nodeId) {
    if (this._selectedNodes.has(nodeId)) {
      this.deselect(nodeId);
    } else {
      this.select(nodeId);
    }
    return this;
  }

  /**
   * Select all nodes
   * @returns {TreeView} This instance for chaining
   */
  selectAll() {
    if (!this.options.multiSelect) {
      return this;
    }

    Object.keys(this._flatMap).forEach(id => {
      this._selectedNodes.add(this._parseNodeId(id));
    });
    this.refresh();
    return this;
  }

  /**
   * Deselect all nodes
   * @param {boolean} silent - Skip callbacks if true
   * @returns {TreeView} This instance for chaining
   */
  deselectAll(silent = false) {
    const selectedIds = Array.from(this._selectedNodes);
    this._selectedNodes.clear();
    this.refresh();

    if (!silent && typeof this.options.onDeselect === 'function') {
      selectedIds.forEach(id => {
        const node = this._flatMap[id];
        if (node) {
          this.options.onDeselect(id, node, null);
        }
      });
    }

    return this;
  }

  /**
   * Get selected node IDs
   * @returns {Array} Array of selected IDs
   */
  getSelected() {
    return Array.from(this._selectedNodes);
  }

  /**
   * Get selected node objects
   * @returns {Array} Array of selected nodes
   */
  getSelectedNodes() {
    return this.getSelected().map(id => this._flatMap[id]).filter(Boolean);
  }

  /**
   * Check if node is selected
   * @param {string|number} nodeId - Node ID
   * @returns {boolean} True if selected
   */
  isSelected(nodeId) {
    return this._selectedNodes.has(nodeId);
  }

  // ===========================================
  // PUBLIC API - Expansion Management
  // ===========================================

  /**
   * Expand a node
   * @param {string|number} nodeId - Node ID
   * @param {boolean} silent - Skip callback if true
   * @returns {TreeView} This instance for chaining
   */
  expand(nodeId, silent = false) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return this;
    }

    this._expandedNodes.add(nodeId);
    this.refresh();

    if (!silent && typeof this.options.onExpand === 'function') {
      this.options.onExpand(nodeId, node, null);
    }

    return this;
  }

  /**
   * Collapse a node
   * @param {string|number} nodeId - Node ID
   * @param {boolean} silent - Skip callback if true
   * @returns {TreeView} This instance for chaining
   */
  collapse(nodeId, silent = false) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return this;
    }

    this._expandedNodes.delete(nodeId);
    this.refresh();

    if (!silent && typeof this.options.onCollapse === 'function') {
      this.options.onCollapse(nodeId, node, null);
    }

    return this;
  }

  /**
   * Toggle node expansion
   * @param {string|number} nodeId - Node ID
   * @returns {TreeView} This instance for chaining
   */
  toggle(nodeId) {
    if (this._expandedNodes.has(nodeId)) {
      this.collapse(nodeId);
    } else {
      this.expand(nodeId);
    }
    return this;
  }

  /**
   * Expand all nodes
   * @returns {TreeView} This instance for chaining
   */
  expandAll() {
    Object.keys(this._flatMap).forEach(id => {
      const node = this._flatMap[id];
      const childrenKey = this.options.childrenKey;
      if (node[childrenKey] && node[childrenKey].length > 0) {
        this._expandedNodes.add(this._parseNodeId(id));
      }
    });
    this.refresh();
    return this;
  }

  /**
   * Collapse all nodes
   * @returns {TreeView} This instance for chaining
   */
  collapseAll() {
    this._expandedNodes.clear();
    this.refresh();
    return this;
  }

  /**
   * Check if node is expanded
   * @param {string|number} nodeId - Node ID
   * @returns {boolean} True if expanded
   */
  isExpanded(nodeId) {
    return this._expandedNodes.has(nodeId);
  }

  /**
   * Get expanded node IDs
   * @returns {Array} Array of expanded IDs
   */
  getExpanded() {
    return Array.from(this._expandedNodes);
  }

  // ===========================================
  // PUBLIC API - Tree Navigation
  // ===========================================

  /**
   * Get parent node
   * @param {string|number} nodeId - Node ID
   * @returns {Object|null} Parent node or null
   */
  getParent(nodeId) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return null;
    }

    const parentId = node[this.options.parentKey];
    return parentId !== null && parentId !== undefined ? this._flatMap[parentId] || null : null;
  }

  /**
   * Get child nodes
   * @param {string|number} nodeId - Node ID
   * @returns {Array} Array of child nodes
   */
  getChildren(nodeId) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return [];
    }

    const childrenKey = this.options.childrenKey;
    return node[childrenKey] || [];
  }

  /**
   * Get all ancestors (path to root)
   * @param {string|number} nodeId - Node ID
   * @returns {Array} Array of ancestor nodes
   */
  getAncestors(nodeId) {
    const ancestors = [];
    let current = this.getParent(nodeId);

    while (current) {
      ancestors.unshift(current);
      current = this.getParent(current[this.options.idKey]);
    }

    return ancestors;
  }

  /**
   * Get all descendants (recursive)
   * @param {string|number} nodeId - Node ID
   * @returns {Array} Array of descendant nodes
   */
  getDescendants(nodeId) {
    const descendants = [];
    const children = this.getChildren(nodeId);

    children.forEach(child => {
      descendants.push(child);
      const childId = child[this.options.idKey];
      descendants.push(...this.getDescendants(childId));
    });

    return descendants;
  }

  /**
   * Get sibling nodes
   * @param {string|number} nodeId - Node ID
   * @returns {Array} Array of sibling nodes
   */
  getSiblings(nodeId) {
    const node = this._flatMap[nodeId];
    if (!node) {
      return [];
    }

    const parent = this.getParent(nodeId);
    if (parent) {
      return this.getChildren(parent[this.options.idKey]).filter(
        sibling => sibling[this.options.idKey] !== nodeId
      );
    }

    // Root level siblings
    return this._tree.filter(root => root[this.options.idKey] !== nodeId);
  }

  /**
   * Get node depth level
   * @param {string|number} nodeId - Node ID
   * @returns {number} Depth level (0 = root)
   */
  getLevel(nodeId) {
    return this.getAncestors(nodeId).length;
  }

  // ===========================================
  // PUBLIC API - Utilities
  // ===========================================

  /**
   * Find first node matching predicate
   * @param {Function} predicate - Test function
   * @returns {Object|null} First matching node or null
   */
  find(predicate) {
    for (const id in this._flatMap) {
      const node = this._flatMap[id];
      if (predicate(node)) {
        return node;
      }
    }
    return null;
  }

  /**
   * Find all nodes matching predicate
   * @param {Function} predicate - Test function
   * @returns {Array} Array of matching nodes
   */
  filter(predicate) {
    const results = [];
    for (const id in this._flatMap) {
      const node = this._flatMap[id];
      if (predicate(node)) {
        results.push(node);
      }
    }
    return results;
  }

  /**
   * Iterate all nodes
   * @param {Function} callback - Callback function
   * @returns {TreeView} This instance for chaining
   */
  forEach(callback) {
    for (const id in this._flatMap) {
      callback(this._flatMap[id], id);
    }
    return this;
  }

  /**
   * Scroll node into view
   * @param {string|number} nodeId - Node ID
   * @param {Object} options - Scroll options
   * @returns {TreeView} This instance for chaining
   */
  scrollToNode(nodeId, options = {}) {
    const nodeEl = this.element.querySelector(`[data-node-id="${nodeId}"]`);
    if (nodeEl) {
      nodeEl.scrollIntoView({
        behavior: options.behavior || 'smooth',
        block: options.block || 'center',
        inline: options.inline || 'nearest'
      });
    }
    return this;
  }

  /**
   * Destroy the TreeView instance
   * @returns {void}
   */
  destroy() {
    this._tree = [];
    this._flatMap = {};
    this._expandedNodes.clear();
    this._selectedNodes.clear();
    this.element.innerHTML = '';
    super.destroy();
  }
}

export default TreeView;
