/**
 * Binding a page you already have - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── The page route: M.applyBindings on markup already in this document ──
        //
        // Nothing below creates any HTML. #apply-demo is written out in full in the
        // section above; this only brings it to life.
        // A helper, so an expression can shape a value without calling a method.
    M.registerHelper('greet', (n) => (n ? `Hello, ${n}` : 'Hello'));
    const applyModel = M.create({
            name: {type: M.types.string},
            rows: {type: M.types.array}
        }, {
            name: 'Ada',
            rows: [{id: 1, label: 'First row'}, {id: 2, label: 'Second row'}]
        });
    let nextRowId = 3;
    M.applyBindings(applyModel, '#apply-demo', {
            methods: {
                add() {
                    const id = nextRowId++;
                    applyModel.set('rows', [...applyModel.get('rows'), {id, label: `Row ${id}`}]);
                },
                // A row's handler is given the item, via $data on the button.
                drop(row) {
                    applyModel.set('rows', applyModel.get('rows').filter((r) => r.id !== row.id));
                },
                reset() {
                    nextRowId = 3;
                    applyModel.set({
                        name: 'Ada',
                        rows: [{id: 1, label: 'First row'}, {id: 2, label: 'Second row'}]
                    });
                }
            }
        });
}
