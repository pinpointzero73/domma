/**
 * Reaching past one level - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── Ancestors: $parents and $parentContext, on a list inside a list ────
        //
        // The inner list is {{#each}}, not a second data-each: an item template is
        // compiled markup, and the compiler discovers lists from {{#each}} only.
    const roster = () => [
            {id: 1, name: 'Red team',  members: [{id: 11, name: 'Ada'}, {id: 12, name: 'Grace'}]},
            {id: 2, name: 'Blue team', members: [{id: 21, name: 'Alan'}, {id: 22, name: 'Edsger'}]}
        ];
    const ancestorsModel = M.create({
            season: {type: M.types.string},
            teams: {type: M.types.array}
        }, {season: 'the summer league', teams: roster()});
    M.applyBindings(ancestorsModel, '#ancestors-demo', {
            methods: {
                // Appends. Deliberately NOT a reorder: moving an outer row leaves
                // $parentContext.$index reading the old position - see the note in
                // the section above. Appending leaves every existing index alone.
                addTeam() {
                    const teams = ancestorsModel.get('teams');
                    const id = teams.length + 1;
                    ancestorsModel.set('teams', [...teams, {
                        id,
                        name: `Team ${id}`,
                        members: [{id: id * 10 + 1, name: 'Someone new'}]
                    }]);
                }
            }
        });
}
