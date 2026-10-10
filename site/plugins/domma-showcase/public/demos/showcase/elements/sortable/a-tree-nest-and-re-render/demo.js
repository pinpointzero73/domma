/**
 * A tree: nest and re-render - from public/showcase/elements/sortable.
 */
export function mount(root) {
        // ---- Tree: nest + onDrop re-render ------------------------------------
    const initialTree = () => [
            {id: 'home', label: 'Home', children: []},
            {id: 'about', label: 'About', children: [
                {id: 'team', label: 'Our team', children: []},
                {id: 'history', label: 'History', children: []}
            ]},
            {id: 'services', label: 'Services', children: [
                {id: 'design', label: 'Design', children: []},
                {id: 'hosting', label: 'Hosting', children: []}
            ]},
            {id: 'contact', label: 'Contact', children: []}
        ];
    let tree = initialTree();
        // The array holding a node, its index there, and the node itself
    const locate = (nodes, id) => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id) return {list: nodes, index: i, node: nodes[i]};
                const found = locate(nodes[i].children, id);
                if (found) return found;
            }
            return null;
        };
    const contains = (node, id) => node.children.some((child) => child.id === id || contains(child, id));
    const renderTree = () => {
            const rows = [];
            const walk = (nodes, depth) => nodes.forEach((node) => {
                const icon = node.children.length ? 'folder' : 'file-text';
                rows.push(
                    '<div class="sx-sort-node" data-depth="' + Math.min(depth, 4) + '" data-id="' + node.id + '">' +
                    '<span data-icon="' + icon + '"></span>' + _.escape(node.label) + '</div>'
                );
                walk(node.children, depth + 1);
            });
            walk(tree, 0);
            // Labels are escaped above. .html() would sanitise away the data-id
            // keys that the sortable matches rows by, so set the markup directly.
            const host = $(root).find('#demo-tree').get(0);
            host.innerHTML = rows.join('');
            Domma.icons.scan(host);
        };
    renderTree();
    const treeSort = E.sortable(root.querySelector('#demo-tree'), {
            nest: true,
            accepts: (item, target) => !contains(locate(tree, item.dataset.id).node, target.dataset.id),
            onDrop: ({key, targetKey, zone}) => {
                const from = locate(tree, key);
                from.list.splice(from.index, 1);

                const to = locate(tree, targetKey);
                if (zone === 'into') to.node.children.push(from.node);
                else to.list.splice(zone === 'before' ? to.index : to.index + 1, 0, from.node);

                renderTree();
                const message = from.node.label + ' moved ' + zone + ' ' + to.node.label;
                $(root).find('#demo-tree-status').text(message);
            }
        });
    $(root).find('#demo-tree-reset').on('click', () => {
            treeSort.animate(() => {
                tree = initialTree();
                renderTree();
            });
            $(root).find('#demo-tree-status').text('Tree reset.');
        });
}
