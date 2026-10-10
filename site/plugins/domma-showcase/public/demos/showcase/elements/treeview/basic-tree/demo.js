/**
 * Basic Tree - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 1: Basic
    const tree1 = E.treeView(root.querySelector('#tree1'), {
        data: [
          {id: 1, name: 'Root', parent_id: null},
          {id: 2, name: 'Child 1', parent_id: 1},
          {id: 3, name: 'Child 2', parent_id: 1},
          {id: 4, name: 'Grandchild', parent_id: 2}
        ]
      });
}
