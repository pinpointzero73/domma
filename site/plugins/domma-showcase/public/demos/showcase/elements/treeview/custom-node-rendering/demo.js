/**
 * Custom Node Rendering - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 5: Custom Rendering
    E.treeView(root.querySelector('#tree5'), {
        data: [
          {id: 1, name: 'index.js', parent_id: null, icon: 'file-text', size: '2.4 KB'},
          {id: 2, name: 'package.json', parent_id: null, icon: 'package', size: '1.2 KB'},
          {id: 3, name: 'src', parent_id: null, icon: 'folder', size: ''},
          {id: 4, name: 'utils.js', parent_id: 3, icon: 'file-text', size: '3.1 KB'}
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
}
