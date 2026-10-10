/**
 * Declarative: data-skeleton - from public/showcase/elements/skeleton.
 */
export function mount(root) {
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
    $(root).find('#demo-declared-done').on('click', () => {
            const sk = E.skeleton.get('#demo-declared');
            if (sk) sk.replace(renderPeople(PEOPLE.slice(0, 2)));
        });
    $(root).find('#demo-declared-again').on('click', () => {
            // A finished container is marked data-skeleton-done so a later scan leaves it alone
            $(root).find('#demo-declared').empty().removeAttr('data-skeleton-done');
            E.skeleton.scan();
        });
}
