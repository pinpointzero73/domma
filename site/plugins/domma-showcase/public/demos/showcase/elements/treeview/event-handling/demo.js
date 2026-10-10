/**
 * Event Handling - from public/showcase/elements/treeview.
 */
export function mount(root) {
      // Tree 6: Events
    const eventLog = $(root).find('#eventLog')[0];
    function logEvent(message) {
        const time = D().format('HH:mm:ss');
        eventLog.innerHTML = `[${time}] ${message}<br>` + eventLog.innerHTML;
      }
    E.treeView(root.querySelector('#tree6'), {
        data: [
          {id: 1, name: 'Node 1', parent_id: null},
          {id: 2, name: 'Node 2', parent_id: null},
          {id: 3, name: 'Child', parent_id: 1}
        ],
        onSelect: (nodeId, node) => {
          logEvent(`Selected: ${node.name}`);
        },
        onExpand: (nodeId, node) => {
          logEvent(`Expanded: ${node.name}`);
        },
        onCollapse: (nodeId, node) => {
          logEvent(`Collapsed: ${node.name}`);
        }
      });
}
