---
title: TreeView
description: "Hierarchical data visualization with expandable/collapsible nodes, checkboxes, and selection support"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="TreeView" tagline="Hierarchical data visualization with expandable/collapsible nodes, checkboxes, and selection support" align="center"][/hero]

## Overview

TreeView provides a hierarchical tree structure for displaying nested data with expand/collapse functionality, selection management, and customisable rendering. Perfect for file systems, folder hierarchies, navigation menus, and any nested data structure.

### Key Features

- Automatic tree building from flat data with parent_id relationships
- Expand/collapse nodes with smooth animations
- Single or multi-select node selection
- Custom node rendering with badges and icons
- Action buttons on hover for CRUD operations
- Comprehensive API for programmatic control
- Event callbacks for all interactions
- Theme-aware with light/dark mode support

### When to Use TreeView

- **File Systems**: Display folders and files with hierarchical structure
- **Navigation**: Multi-level navigation menus and sitemap structures
- **Organisation**: Category hierarchies, taxonomies, org charts
- **Data Management**: Hierarchical data browsing and selection

### Basic Usage

```javascript
// Simple hierarchical data
const folders = [
    { id: 1, name: 'Documents', parent_id: null },
    { id: 2, name: 'Work', parent_id: 1 },
    { id: 3, name: 'Personal', parent_id: 1 },
    { id: 4, name: 'Reports', parent_id: 2 }
];

// Create TreeView
const tree = Domma.elements.treeView('#tree', {
    data: folders,
    expandedByDefault: true,
    selectable: true,
    onSelect: (nodeId, node) => {
        console.log('Selected:', node.name);
    }
});

// Control programmatically
tree.expandAll();      // Expand all nodes
tree.collapseAll();    // Collapse all nodes
tree.select(nodeId);   // Select a node
tree.refresh();        // Re-render tree
```

## Getting Started

Add a hierarchical tree view to your page in three simple steps

### Step 1: Add Container Element

Create a container div for the tree:

```
<div id="my-tree"></div>
```

### Step 2: Include Domma

Add Domma CSS and JavaScript to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">

<!-- JavaScript -->
<script src="dist/domma.min.js"></script>
```

### Step 3: Initialize the TreeView

Call `Domma.elements.treeView()` with hierarchical data:

```
// Prepare hierarchical data (flat structure with parent_id)
const folders = [
    { id: 1, name: 'Documents', parent_id: null },
    { id: 2, name: 'Work', parent_id: 1 },
    { id: 3, name: 'Personal', parent_id: 1 },
    { id: 4, name: 'Projects', parent_id: 2 },
    { id: 5, name: 'Reports', parent_id: 2 }
];

// Initialize the tree
const tree = Domma.elements.treeView('#my-tree', {
    data: folders,           // Hierarchical data array
    expandedByDefault: true, // Start with nodes expanded
    selectable: true,        // Allow node selection
    onSelect: (nodeId, node) => {
        console.log('Selected:', node.name);
    },
    onExpand: (nodeId) => {
        console.log('Node expanded:', nodeId);
    }
});

// Programmatic control
tree.expandAll();    // Expand all nodes
tree.collapseAll();  // Collapse all nodes
tree.select(nodeId); // Select a node
```

> **Note:** The treeview auto-generates the complete tree UI from your data array (no HTML structure required). Data must include `id`, `name`, and `parent_id` fields. Root nodes have `parent_id: null`. The component automatically builds the hierarchy and handles expand/collapse.

## Basic Tree

A simple hierarchical tree with default styling. Click nodes to select them, click the chevron to expand/collapse.

[showcase-demo id="showcase/elements/treeview/basic-tree" title="Basic Tree" /]

```javascript
const tree = Domma.elements.treeView('#tree1', {
    data: [
        { id: 1, name: 'Root', parent_id: null },
        { id: 2, name: 'Child 1', parent_id: 1 },
        { id: 3, name: 'Child 2', parent_id: 1 },
        { id: 4, name: 'Grandchild', parent_id: 2 }
    ]
});
```

## With Icons

Add custom icons to tree nodes using the `icon` property. Uses Domma's icon system.

[showcase-demo id="showcase/elements/treeview/with-icons" title="With Icons" /]

```javascript
Domma.elements.treeView('#tree2', {
    data: [
        { id: 1, name: 'Documents', parent_id: null, icon: 'folder' },
        { id: 2, name: 'Images', parent_id: null, icon: 'folder' },
        { id: 3, name: 'Report.pdf', parent_id: 1, icon: 'file-text' },
        { id: 4, name: 'Photo.jpg', parent_id: 2, icon: 'image' }
    ]
});
```

## With Badges

Display counts or status indicators using the `getBadge` callback. Perfect for showing item counts.

[showcase-demo id="showcase/elements/treeview/with-badges" title="With Badges" /]

```javascript
Domma.elements.treeView('#tree3', {
    data: [
        { id: 1, name: 'Projects', parent_id: null, count: 12 },
        { id: 2, name: 'Work', parent_id: 1, count: 5 },
        { id: 3, name: 'Personal', parent_id: 1, count: 7 },
        { id: 4, name: 'Archive', parent_id: null, count: 25 }
    ],
    getBadge: (node) => node.count || null
});
```

## With Action Buttons

Add action buttons that appear on hover. Perfect for CRUD operations like add, edit, and delete.

[showcase-demo id="showcase/elements/treeview/with-action-buttons" title="With Action Buttons" /]

```javascript
Domma.elements.treeView('#tree4', {
    data: [
        { id: 1, name: 'Folder 1', parent_id: null },
        { id: 2, name: 'Folder 2', parent_id: null },
        { id: 3, name: 'Subfolder', parent_id: 1 }
    ],
    actions: [
        { name: 'add', icon: 'plus', tooltip: 'Add subfolder' },
        { name: 'edit', icon: 'edit', tooltip: 'Edit' },
        { name: 'delete', icon: 'trash', tooltip: 'Delete' }
    ],
    onAction: (action, nodeId, node) => {
        Domma.elements.toast(`${action}: ${node.name}`, { type: 'info' });
    }
});
```

## Custom Node Rendering

Fully customise node appearance using the `renderNode` callback. Add file sizes, metadata, or any custom HTML.

[showcase-demo id="showcase/elements/treeview/custom-node-rendering" title="Custom Node Rendering" /]

```javascript
Domma.elements.treeView('#tree5', {
    data: [
        { id: 1, name: 'index.js', parent_id: null, icon: 'file-text', size: '2.4 KB' },
        { id: 2, name: 'package.json', parent_id: null, icon: 'package', size: '1.2 KB' },
        { id: 3, name: 'src', parent_id: null, icon: 'folder', size: '' },
        { id: 4, name: 'utils.js', parent_id: 3, icon: 'file-text', size: '3.1 KB' }
    ],
    renderNode: (node, depth, state) => {
        const iconColor = node.icon === 'folder' ? '#f59e0b' : '#6b7280';
        return `
            <span data-icon="${node.icon}" style="color: ${iconColor};"></span>
            <span style="flex: 1;">${node.name}</span>
            ${node.size ? `<span style="color: var(--dm-slate-500); font-size: 0.75rem;">${node.size}</span>` : ''}
        `;
    }
});
```

## Event Handling

React to user interactions with event callbacks. Monitor selections, expansions, and custom actions.

[showcase-demo id="showcase/elements/treeview/event-handling" title="Event Handling" /]

```javascript
Domma.elements.treeView('#tree6', {
    data: [
        { id: 1, name: 'Node 1', parent_id: null },
        { id: 2, name: 'Node 2', parent_id: null },
        { id: 3, name: 'Child', parent_id: 1 }
    ],
    onSelect: (nodeId, node) => {
        console.log('Selected:', node.name);
    },
    onExpand: (nodeId, node) => {
        console.log('Expanded:', node.name);
    },
    onCollapse: (nodeId, node) => {
        console.log('Collapsed:', node.name);
    }
});
```

## Programmatic Control

Control the tree programmatically using the comprehensive API. Expand, collapse, select, and navigate nodes.

[showcase-demo id="showcase/elements/treeview/programmatic-control" title="Programmatic Control" /]

```javascript
const tree = Domma.elements.treeView('#tree', { data });

// Expansion
tree.expandAll();           // Expand all nodes
tree.collapseAll();         // Collapse all nodes
tree.toggle(nodeId);        // Toggle specific node
tree.expand(nodeId);        // Expand specific node
tree.collapse(nodeId);      // Collapse specific node

// Selection
tree.select(nodeId);        // Select a node
tree.deselect(nodeId);      // Deselect a node
tree.selectAll();           // Select all (multiSelect only)
tree.deselectAll();         // Clear all selections
tree.getSelected();         // Get array of selected IDs

// Navigation
tree.getParent(nodeId);     // Get parent node
tree.getChildren(nodeId);   // Get child nodes
tree.getAncestors(nodeId);  // Get path to root
tree.getDescendants(nodeId);// Get all descendants
tree.getLevel(nodeId);      // Get depth level

// Data
tree.setData(newData);      // Replace tree data
tree.refresh();             // Re-render tree
tree.updateNode(id, data);  // Update specific node
tree.getData();             // Get hierarchical data
tree.getFlatData();         // Get flat array

// Utilities
tree.find(predicate);       // Find first matching node
tree.filter(predicate);     // Find all matching nodes
tree.scrollToNode(nodeId);  // Scroll into view
```

## Configuration Options

### Data Configuration

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | Array | [] | Flat or hierarchical array of nodes |
| `idKey` | String | 'id' | Property name for node ID |
| `parentKey` | String | 'parent_id' | Property name for parent reference |
| `labelKey` | String | 'name' | Property name for node label |
| `iconKey` | String | 'icon' | Property name for icon name |
[/table]

### Behaviour Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `expandedByDefault` | Boolean | true | Expand all nodes initially |
| `selectable` | Boolean | true | Enable node selection |
| `multiSelect` | Boolean | false | Allow multiple selected nodes |
| `indentSize` | Number | 1.5 | Indentation per level (rem) |
[/table]

### Callback Options

[table striped="true"]
| Option | Parameters | Description |
| --- | --- | --- |
| `renderNode` | (node, depth, state) | Custom node rendering function |
| `getBadge` | (node) | Return badge content for node |
| `onSelect` | (nodeId, node, event) | Called when node is selected |
| `onDeselect` | (nodeId, node, event) | Called when node is deselected |
| `onExpand` | (nodeId, node, event) | Called when node expands |
| `onCollapse` | (nodeId, node, event) | Called when node collapses |
| `onAction` | (action, nodeId, node, event) | Called when action button clicked |
[/table]

## CSS Customisation

Override these CSS variables to customise TreeView appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Selected node colour |
| `--dm-hover-bg` | `var(--dm-slate-100)` | Node hover background |
| `--dm-border` | `var(--dm-slate-300)` | Tree border colour |
| `--dm-text` | `var(--dm-slate-800)` | Node text colour |
[/table]

### Example Override

```css
:root {
    /* Highlight selected nodes */
    --dm-primary: #059669;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)
