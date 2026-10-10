/**
 * A list, and what happens on failure - from public/showcase/elements/skeleton.
 *
 * The list is bound (data-each). E.skeleton.while moves the container's
 * children aside and puts the same nodes back, so the bindings survive: on
 * success the new people are assigned, on failure whatever was there returns.
 */
export function mount(root) {
    // A stand-in for H.get(): resolves with the data after a pause, or rejects.
    const pretendLoad = (data, fail = false, ms = 1400) => new Promise((resolve, reject) => {
        setTimeout(() => (fail ? reject(new Error('The server did not answer (on purpose)')) : resolve(data)), ms);
    });
    // ---- List, with a failure path ----------------------------------------
    const initials = (name) => name.split(' ').map((w) => w[0]).join('');
    const PEOPLE = [
        {name: 'Amara Okafor', role: 'Head of design'},
        {name: 'Tom Hughes', role: 'Developer'},
        {name: 'Priya Shah', role: 'Product manager'},
        {name: 'Callum Reid', role: 'Support lead'}
    ].map((p) => ({...p, initials: initials(p.name)}));

    const people = M.observable([]);
    const busy = M.observable(false);
    const listEl = root.querySelector('#demo-list');

    const loadList = async (fail) => {
        busy.value = true;
        try {
            people.value = await E.skeleton.while(listEl, pretendLoad(PEOPLE, fail), {type: 'list', count: 4});
        } catch (err) {
            E.toast(err.message, {type: 'danger'});
        }
        busy.value = false;
    };

    const handle = M.applyBindings({
        people, busy,
        load: () => loadList(false),
        loadAndFail: () => loadList(true)
    }, root);

    return () => {
        handle.dispose();
        E.skeleton.remove(listEl);
    };
}
