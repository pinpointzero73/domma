/**
 * With Badges - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 3: With Badges
    E.treeView(root.querySelector('#tree3'), {
        data: [
          {id: 1, name: 'Projects', parent_id: null, count: 12},
          {id: 2, name: 'Work', parent_id: 1, count: 5},
          {id: 3, name: 'Personal', parent_id: 1, count: 7},
          {id: 4, name: 'Archive', parent_id: null, count: 25}
        ],
        getBadge: (node) => node.count || null
      });
}
