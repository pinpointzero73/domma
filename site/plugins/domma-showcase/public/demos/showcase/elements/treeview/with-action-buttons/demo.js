/**
 * With Action Buttons - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 4: With Actions
    E.treeView(root.querySelector('#tree4'), {
        data: [
          {id: 1, name: 'Folder 1', parent_id: null},
          {id: 2, name: 'Folder 2', parent_id: null},
          {id: 3, name: 'Subfolder', parent_id: 1}
        ],
        actions: [
          {name: 'add', icon: 'plus', tooltip: 'Add subfolder'},
          {name: 'edit', icon: 'edit', tooltip: 'Edit'},
          {name: 'delete', icon: 'trash', tooltip: 'Delete'}
        ],
        onAction: (action, nodeId, node) => {
          E.toast(`${action}: ${node.name}`, {type: 'info'});
        }
      });
}
