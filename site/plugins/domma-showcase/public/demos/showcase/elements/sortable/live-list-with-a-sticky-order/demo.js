/**
 * Live list with a sticky order - from public/showcase/elements/sortable.
 */
export function mount(root) {
        // ---- Live list with persist ------------------------------------------
    const DEFAULT_TASKS = ['brief', 'design', 'build', 'review', 'launch'];
    const showSaved = () => {
            const saved = S.get('sortable:showcase-tasks');
            $(root).find('#demo-tasks-saved').text(Array.isArray(saved) ? saved.join(', ') : 'none');
        };
    const tasks = E.sortable(root.querySelector('#demo-tasks'), {
            persist: 'showcase-tasks',
            onSort: ({from, to}) => {
                showSaved();
                log('Task list: moved from position ' + (from + 1) + ' to ' + (to + 1));
            }
        });
    showSaved();
    $(root).find('#demo-tasks-reset').on('click', () => {
            tasks.forget();
            tasks.sort(DEFAULT_TASKS);
            showSaved();
            log('Task list: saved order forgotten');
        });
}
