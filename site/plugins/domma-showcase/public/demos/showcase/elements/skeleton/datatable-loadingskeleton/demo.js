/**
 * DataTable: loadingSkeleton - from public/showcase/elements/skeleton.
 */
export function mount(root) {
        // A stand-in for H.get(): resolves with the data after a pause, or rejects.
    const pretendLoad = (data, fail = false, ms = 1400) => new Promise((resolve, reject) => {
            setTimeout(() => (fail ? reject(new Error('The server did not answer (on purpose)')) : resolve(data)), ms);
        });
        // ---- DataTable ---------------------------------------------------------
    const TEAM = [
            {id: 1, name: 'Amara Okafor', role: 'Design', city: 'Manchester'},
            {id: 2, name: 'Tom Hughes', role: 'Engineering', city: 'Cardiff'},
            {id: 3, name: 'Priya Shah', role: 'Product', city: 'Leeds'},
            {id: 4, name: 'Callum Reid', role: 'Support', city: 'Glasgow'},
            {id: 5, name: 'Nia Evans', role: 'Engineering', city: 'Bristol'}
        ];
    const table = T.create('#demo-table', {
            columns: ['name', 'role', 'city'].map((key) => ({key, title: _.capitalize(key)})),
            loadingSkeleton: true,
            pageSize: 5,
            searchable: false
        });
    pretendLoad(TEAM).then((rows) => table.setData(rows));
    $(root).find('#demo-table-reload').on('click', async () => {
            table.setLoading(true);
            table.setData(await pretendLoad(_.shuffle(TEAM)));
        });
        // ---- Every type --------------------------------------------------------
    const TYPE_OPTIONS = {
            text: {type: 'text', lines: 4},
            card: {type: 'card', lines: 2},
            list: {type: 'list', count: 3},
            table: {type: 'table', rows: 3, columns: 4},
            custom: {type: 'custom', template: '<div class="sx-sk-row"><div class="skeleton skeleton-circle skeleton-xl"></div>' +
                '<div class="skeleton-lines"><div class="skeleton skeleton-heading"></div>' +
                '<div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div></div></div>'}
        };
}
