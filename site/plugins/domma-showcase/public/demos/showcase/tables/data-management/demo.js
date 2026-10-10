/**
 * Data Management - from public/showcase/tables.
 */
export function mount(root) {
        // Data manipulation
    let nextId = 100;
    const roles = ['Admin', 'Manager', 'Developer', 'Designer'];
    const names = ['Alex', 'Blake', 'Casey', 'Dana', 'Ellis', 'Finn'];
    $(root).find('#add-row').on('click', function () {
            const name = _.sample(names) + ' ' + _.sample(names);
            table.addRow({
                id: nextId++,
                name: name,
                email: name.toLowerCase().replace(' ', '.') + '@example.com',
                role: _.sample(roles),
                status: _.random(0, 9) > 2 ? 'Active' : 'Inactive',
                joined: D().format('YYYY-MM-DD')
            });
        });
    $(root).find('#update-first').on('click', function () {
            table.updateRow(0, {name: 'Updated Name ' + _.random(0, 99)});
        });
    $(root).find('#remove-last').on('click', function () {
            const data = table.getData();
            if (data.length > 0) {
                table.removeRow(data.length - 1);
            }
        });
}
