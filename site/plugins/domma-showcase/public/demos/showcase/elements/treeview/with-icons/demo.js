/**
 * With Icons - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 2: With Icons
    E.treeView(root.querySelector('#tree2'), {
        data: [
          {id: 1, name: 'Documents', parent_id: null, icon: 'folder'},
          {id: 2, name: 'Images', parent_id: null, icon: 'folder'},
          {id: 3, name: 'Report.pdf', parent_id: 1, icon: 'file-text'},
          {id: 4, name: 'Photo.jpg', parent_id: 2, icon: 'image'}
        ]
      });
}
