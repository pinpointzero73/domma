/**
 * Event Handling - from public/showcase/elements/treeview.
 *
 * The event log is a bound list (data-each), newest first.
 */
export function mount(root) {
    // Tree 6: Events
    const entries = M.observable([]);
    let seq = 0;
    const handle = M.applyBindings({entries}, root);

    function logEvent(message) {
        const time = D().format('HH:mm:ss');
        entries.value = [{id: ++seq, text: `[${time}] ${message}`}, ...entries.value];
    }
    const tree = E.treeView(root.querySelector('#tree6'), {
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

    return () => {
        handle.dispose();
        tree?.destroy?.();
    };
}
