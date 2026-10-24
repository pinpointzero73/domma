export default TreeView;
/**
 * A node id: whatever the data's `idKey` holds.
 */
export type TreeViewNodeId = string | number;
/**
 * A data row. The keys are configurable (`idKey`, `parentKey`, `childrenKey`, `labelKey`,
 * `iconKey`, `colorKey`); `children` is filled in when a flat array is given.
 */
export type TreeViewNode = Record<string, any>;
/**
 * The state handed to `renderNode`.
 */
export type TreeViewNodeState = {
    isExpanded: boolean;
    isSelected: boolean;
    hasChildren: boolean;
};
/**
 * An action button drawn on each node.
 */
export type TreeViewAction = {
    /**
     * - Passed to onAction; the button's text when there is no icon
     */
    name: string;
    /**
     * - Icon name
     */
    icon?: string;
    /**
     * - Title and aria-label (default: the name)
     */
    tooltip?: string;
    /**
     * - Show the button on this node?
     */
    visible?: (node: TreeViewNode) => boolean;
};
export type TreeViewOptions = {
    /**
     * - Flat (with parentKey) or hierarchical (with childrenKey) rows
     */
    data?: TreeViewNode[];
    /**
     * - Default 'id'
     */
    idKey?: string;
    /**
     * - Default 'parent_id'
     */
    parentKey?: string;
    /**
     * - Default 'children'
     */
    childrenKey?: string;
    /**
     * - Default 'name'
     */
    labelKey?: string;
    /**
     * - Default 'icon'
     */
    iconKey?: string;
    /**
     * - Default 'color'
     */
    colorKey?: string;
    /**
     * - Default true
     */
    expandedByDefault?: boolean;
    /**
     * - Ids expanded at the start
     */
    expandedNodes?: TreeViewNodeId[];
    /**
     * - Default true
     */
    selectable?: boolean;
    /**
     * - Default false
     */
    multiSelect?: boolean;
    /**
     * - Ids selected at the start
     */
    selectedNodes?: TreeViewNodeId[];
    /**
     * - HTML for a node's content
     */
    renderNode?: ((node: TreeViewNode, depth: number, state: TreeViewNodeState) => string) | null;
    /**
     * - Badge text (HTML), or null for none
     */
    getBadge?: ((node: TreeViewNode) => string | number | null | undefined) | null;
    /**
     * - Icon name (default: node[iconKey])
     */
    getNodeIcon?: ((node: TreeViewNode) => string | null | undefined) | null;
    /**
     * - Extra classes on the node
     */
    getNodeClass?: ((node: TreeViewNode) => string) | null;
    /**
     * - Action buttons on each node
     */
    actions?: TreeViewAction[];
    /**
     * - rem per level (default 1.5)
     */
    indentSize?: number;
    /**
     * - Default true
     */
    showIcons?: boolean;
    /**
     * - Default true
     */
    showToggleButtons?: boolean;
    /**
     * - Default 'chevron-down'
     */
    toggleIcon?: string;
    onSelect?: ((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void) | null;
    onDeselect?: ((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void) | null;
    onExpand?: ((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void) | null;
    onCollapse?: ((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void) | null;
    onAction?: ((action: string, nodeId: TreeViewNodeId, node: TreeViewNode, event: MouseEvent) => void) | null;
    onClick?: ((nodeId: TreeViewNodeId, node: TreeViewNode, event: MouseEvent) => void) | null;
};
export type TreeViewInstance = TreeView;
/**
 * A node id: whatever the data's `idKey` holds.
 * @typedef {string|number} TreeViewNodeId
 */
/**
 * A data row. The keys are configurable (`idKey`, `parentKey`, `childrenKey`, `labelKey`,
 * `iconKey`, `colorKey`); `children` is filled in when a flat array is given.
 * @typedef {Record<string, any>} TreeViewNode
 */
/**
 * The state handed to `renderNode`.
 * @typedef {object} TreeViewNodeState
 * @property {boolean} isExpanded
 * @property {boolean} isSelected
 * @property {boolean} hasChildren
 */
/**
 * An action button drawn on each node.
 * @typedef {object} TreeViewAction
 * @property {string} name - Passed to onAction; the button's text when there is no icon
 * @property {string} [icon] - Icon name
 * @property {string} [tooltip] - Title and aria-label (default: the name)
 * @property {(node: TreeViewNode) => boolean} [visible] - Show the button on this node?
 */
/**
 * @typedef {object} TreeViewOptions
 * @property {TreeViewNode[]} [data] - Flat (with parentKey) or hierarchical (with childrenKey) rows
 * @property {string} [idKey] - Default 'id'
 * @property {string} [parentKey] - Default 'parent_id'
 * @property {string} [childrenKey] - Default 'children'
 * @property {string} [labelKey] - Default 'name'
 * @property {string} [iconKey] - Default 'icon'
 * @property {string} [colorKey] - Default 'color'
 * @property {boolean} [expandedByDefault] - Default true
 * @property {TreeViewNodeId[]} [expandedNodes] - Ids expanded at the start
 * @property {boolean} [selectable] - Default true
 * @property {boolean} [multiSelect] - Default false
 * @property {TreeViewNodeId[]} [selectedNodes] - Ids selected at the start
 * @property {((node: TreeViewNode, depth: number, state: TreeViewNodeState) => string)|null} [renderNode] - HTML for a node's content
 * @property {((node: TreeViewNode) => string|number|null|undefined)|null} [getBadge] - Badge text (HTML), or null for none
 * @property {((node: TreeViewNode) => string|null|undefined)|null} [getNodeIcon] - Icon name (default: node[iconKey])
 * @property {((node: TreeViewNode) => string)|null} [getNodeClass] - Extra classes on the node
 * @property {TreeViewAction[]} [actions] - Action buttons on each node
 * @property {number} [indentSize] - rem per level (default 1.5)
 * @property {boolean} [showIcons] - Default true
 * @property {boolean} [showToggleButtons] - Default true
 * @property {string} [toggleIcon] - Default 'chevron-down'
 * @property {((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void)|null} [onSelect]
 * @property {((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void)|null} [onDeselect]
 * @property {((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void)|null} [onExpand]
 * @property {((nodeId: TreeViewNodeId, node: TreeViewNode, event: null) => void)|null} [onCollapse]
 * @property {((action: string, nodeId: TreeViewNodeId, node: TreeViewNode, event: MouseEvent) => void)|null} [onAction]
 * @property {((nodeId: TreeViewNodeId, node: TreeViewNode, event: MouseEvent) => void)|null} [onClick]
 */
/** @typedef {TreeView} TreeViewInstance */
declare class TreeView extends Component {
    static defaults: {
        data: any[];
        idKey: string;
        parentKey: string;
        childrenKey: string;
        labelKey: string;
        iconKey: string;
        colorKey: string;
        expandedByDefault: boolean;
        expandedNodes: any[];
        selectable: boolean;
        multiSelect: boolean;
        selectedNodes: any[];
        renderNode: any;
        getBadge: any;
        getNodeIcon: any;
        getNodeClass: any;
        actions: any[];
        indentSize: number;
        showIcons: boolean;
        showToggleButtons: boolean;
        toggleIcon: string;
        onSelect: any;
        onDeselect: any;
        onExpand: any;
        onCollapse: any;
        onAction: any;
        onClick: any;
    };
    /**
     * @param {string|HTMLElement} selector - Container element or selector
     * @param {TreeViewOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: TreeViewOptions);
    _tree: any[];
    _flatMap: {};
    _expandedNodes: Set<any>;
    _selectedNodes: Set<any>;
    /**
     * Initialise the TreeView component
     * @private
     */
    private _init;
    /**
     * Setup event delegation
     * @private
     */
    private _setupEventListeners;
    /**
     * Build tree structure from flat data
     * @private
     * @param {Array} data - Flat array of nodes
     * @returns {Object} Object with tree and nodeMap
     */
    private _buildTree;
    /**
     * Sort tree nodes recursively
     * @private
     * @param {Array} nodes - Array of nodes to sort
     */
    private _sortTree;
    /**
     * Render tree to DOM
     * @private
     */
    private _render;
    /**
     * Render a single node recursively
     * @private
     * @param {Object} node - Node data
     * @param {number} depth - Current depth level
     * @returns {string} HTML string
     */
    private _renderNode;
    /**
     * Default node rendering
     * @private
     * @param {Object} node - Node data
     * @param {number} depth - Depth level
     * @param {Object} state - Node state
     * @returns {string} HTML string
     */
    private _defaultRenderNode;
    /**
     * Render toggle button
     * @private
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {boolean} isExpanded - Is node expanded
     * @returns {string} HTML string
     */
    private _renderToggle;
    /**
     * Render action buttons
     * @private
     * @param {Object} node - Node data
     * @returns {string} HTML string
     */
    private _renderActions;
    /**
     * Handle node selection
     * @private
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {Event} event - Click event
     */
    private _handleSelect;
    /**
     * Handle action button click
     * @private
     * @param {string} action - Action name
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {Event} event - Click event
     */
    private _handleAction;
    /**
     * Parse node ID (convert string to number if needed)
     * @private
     * @param {string} idString - ID as string
     * @returns {string|number} Parsed ID
     */
    private _parseNodeId;
    /**
     * Escape HTML in strings
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    private _escapeHtml;
    /**
     * Set tree data
     * @param {TreeViewNode[]} data - Flat or hierarchical array
     * @returns {this} This instance for chaining
     */
    setData(data: TreeViewNode[]): this;
    /**
     * Get tree data (hierarchical)
     * @returns {TreeViewNode[]} Tree array
     */
    getData(): TreeViewNode[];
    /**
     * Get flat data (all nodes)
     * @returns {TreeViewNode[]} Flat array of nodes
     */
    getFlatData(): TreeViewNode[];
    /**
     * Refresh tree rendering
     * @returns {this} This instance for chaining
     */
    refresh(): this;
    /**
     * Get node by ID
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {TreeViewNode|null} Node data or null
     */
    getNode(nodeId: TreeViewNodeId): TreeViewNode | null;
    /**
     * Update node data
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {Partial<TreeViewNode>} changes - Changes to apply
     * @returns {this} This instance for chaining
     */
    updateNode(nodeId: TreeViewNodeId, changes: Partial<TreeViewNode>): this;
    /**
     * Select a node
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {boolean} [silent] - Skip callback if true
     * @returns {this} This instance for chaining
     */
    select(nodeId: TreeViewNodeId, silent?: boolean): this;
    /**
     * Deselect a node
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {boolean} [silent] - Skip callback if true
     * @returns {this} This instance for chaining
     */
    deselect(nodeId: TreeViewNodeId, silent?: boolean): this;
    /**
     * Toggle node selection
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {this} This instance for chaining
     */
    toggleSelect(nodeId: TreeViewNodeId): this;
    /**
     * Select all nodes
     * @returns {this} This instance for chaining
     */
    selectAll(): this;
    /**
     * Deselect all nodes
     * @param {boolean} [silent] - Skip callbacks if true
     * @returns {this} This instance for chaining
     */
    deselectAll(silent?: boolean): this;
    /**
     * Get selected node IDs
     * @returns {TreeViewNodeId[]} Array of selected IDs
     */
    getSelected(): TreeViewNodeId[];
    /**
     * Get selected node objects
     * @returns {TreeViewNode[]} Array of selected nodes
     */
    getSelectedNodes(): TreeViewNode[];
    /**
     * Check if node is selected
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {boolean} True if selected
     */
    isSelected(nodeId: TreeViewNodeId): boolean;
    /**
     * Expand a node
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {boolean} [silent] - Skip callback if true
     * @returns {this} This instance for chaining
     */
    expand(nodeId: TreeViewNodeId, silent?: boolean): this;
    /**
     * Collapse a node
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {boolean} [silent] - Skip callback if true
     * @returns {this} This instance for chaining
     */
    collapse(nodeId: TreeViewNodeId, silent?: boolean): this;
    /**
     * Toggle node expansion
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {this} This instance for chaining
     */
    toggle(nodeId: TreeViewNodeId): this;
    /**
     * Expand all nodes
     * @returns {this} This instance for chaining
     */
    expandAll(): this;
    /**
     * Collapse all nodes
     * @returns {this} This instance for chaining
     */
    collapseAll(): this;
    /**
     * Check if node is expanded
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {boolean} True if expanded
     */
    isExpanded(nodeId: TreeViewNodeId): boolean;
    /**
     * Get expanded node IDs
     * @returns {TreeViewNodeId[]} Array of expanded IDs
     */
    getExpanded(): TreeViewNodeId[];
    /**
     * Get parent node
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {TreeViewNode|null} Parent node or null
     */
    getParent(nodeId: TreeViewNodeId): TreeViewNode | null;
    /**
     * Get child nodes
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {TreeViewNode[]} Array of child nodes
     */
    getChildren(nodeId: TreeViewNodeId): TreeViewNode[];
    /**
     * Get all ancestors (path to root)
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {TreeViewNode[]} Array of ancestor nodes
     */
    getAncestors(nodeId: TreeViewNodeId): TreeViewNode[];
    /**
     * Get all descendants (recursive)
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {TreeViewNode[]} Array of descendant nodes
     */
    getDescendants(nodeId: TreeViewNodeId): TreeViewNode[];
    /**
     * Get sibling nodes
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {TreeViewNode[]} Array of sibling nodes
     */
    getSiblings(nodeId: TreeViewNodeId): TreeViewNode[];
    /**
     * Get node depth level
     * @param {TreeViewNodeId} nodeId - Node ID
     * @returns {number} Depth level (0 = root)
     */
    getLevel(nodeId: TreeViewNodeId): number;
    /**
     * Find first node matching predicate
     * @param {(node: TreeViewNode) => boolean} predicate - Test function
     * @returns {TreeViewNode|null} First matching node or null
     */
    find(predicate: (node: TreeViewNode) => boolean): TreeViewNode | null;
    /**
     * Find all nodes matching predicate
     * @param {(node: TreeViewNode) => boolean} predicate - Test function
     * @returns {TreeViewNode[]} Array of matching nodes
     */
    filter(predicate: (node: TreeViewNode) => boolean): TreeViewNode[];
    /**
     * Iterate all nodes
     * @param {(node: TreeViewNode, id: string) => void} callback - Callback function
     * @returns {this} This instance for chaining
     */
    forEach(callback: (node: TreeViewNode, id: string) => void): this;
    /**
     * Scroll node into view
     * @param {TreeViewNodeId} nodeId - Node ID
     * @param {{behavior?: ScrollBehavior, block?: ScrollLogicalPosition, inline?: ScrollLogicalPosition}} [options] - Scroll options
     * @returns {this} This instance for chaining
     */
    scrollToNode(nodeId: TreeViewNodeId, options?: {
        behavior?: ScrollBehavior;
        block?: ScrollLogicalPosition;
        inline?: ScrollLogicalPosition;
    }): this;
}
import Component from './component.js';
