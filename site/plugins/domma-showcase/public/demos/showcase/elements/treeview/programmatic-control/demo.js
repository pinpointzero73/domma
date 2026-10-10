/**
 * Programmatic Control - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 7: API Methods
    window.tree7 = E.treeView(root.querySelector('#tree7'), {
        data: [
          {id: 1, name: 'Node 1', parent_id: null},
          {id: 2, name: 'Node 2', parent_id: null},
          {id: 3, name: 'Node 3', parent_id: null},
          {id: 4, name: 'Child 1-1', parent_id: 1},
          {id: 5, name: 'Child 2-1', parent_id: 2},
          {id: 6, name: 'Grandchild', parent_id: 4}
        ]
      });
    function showSelected() {
        const selected = tree7.getSelected();
        if (selected.length > 0) {
          E.toast(`Selected IDs: ${selected.join(', ')}`, {type: 'success'});
        } else {
          E.toast('No nodes selected', {type: 'info'});
        }
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        tree7.expandAll();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        tree7.collapseAll();
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        tree7.select(2);
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        tree7.deselectAll();
    });
    $(root).find('[data-action="5"]').on('click', function (event) {
        showSelected();
    });
}
