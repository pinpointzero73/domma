/**
 * A list, and what happens on failure - from public/showcase/elements/skeleton.
 */
export function mount(root) {
        // Markup below is built from escaped strings. $.html() sanitises through
        // DOMPurify and escapes everything when DOMPurify is absent (as on this
        // page), so the demos set innerHTML on the element directly.
    const setHtml = (sel, html) => { $(sel).get(0).innerHTML = html; };
        // A stand-in for H.get(): resolves with the data after a pause, or rejects.
    const pretendLoad = (data, fail = false, ms = 1400) => new Promise((resolve, reject) => {
            setTimeout(() => (fail ? reject(new Error('The server did not answer (on purpose)')) : resolve(data)), ms);
        });
        // ---- List, with a failure path ----------------------------------------
    const PEOPLE = [
            {name: 'Amara Okafor', role: 'Head of design'},
            {name: 'Tom Hughes', role: 'Developer'},
            {name: 'Priya Shah', role: 'Product manager'},
            {name: 'Callum Reid', role: 'Support lead'}
        ];
    const initials = (name) => name.split(' ').map((w) => w[0]).join('');
    const renderPeople = (people) => '<ul class="list-group">' + people.map((p) =>
            '<li class="list-group-item"><span class="list-group-item-icon"><span class="sx-sk-avatar">' +
            _.escape(initials(p.name)) + '</span></span><span class="list-group-item-content">' +
            '<span class="list-group-item-heading">' + _.escape(p.name) + '</span>' +
            '<span class="list-group-item-text">' + _.escape(p.role) + '</span></span></li>').join('') + '</ul>';
    const loadList = async (fail) => {
            $('#demo-list-load, #demo-list-fail').prop('disabled', true);
            try {
                const people = await E.skeleton.while('#demo-list', pretendLoad(PEOPLE, fail), {type: 'list', count: 4});
                setHtml('#demo-list', renderPeople(people));
            } catch (err) {
                E.toast(err.message, {type: 'danger'});
            }
            $('#demo-list-load, #demo-list-fail').prop('disabled', false);
        };
    $(root).find('#demo-list-load').on('click', () => loadList(false));
    $(root).find('#demo-list-fail').on('click', () => loadList(true));
}
