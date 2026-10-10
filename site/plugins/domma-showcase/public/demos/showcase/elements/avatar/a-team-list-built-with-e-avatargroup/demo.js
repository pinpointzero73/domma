/**
 * A team list built with E.avatarGroup - from public/showcase/elements/avatar.
 */
export function mount(root) {
    const PEOPLE = [
            {name: 'Amara Okafor', src: '/plugins/domma-showcase/public/assets/elements/avatar/img/amara.svg', status: 'online'},
            {name: 'Tom Hughes', src: '/plugins/domma-showcase/public/assets/elements/avatar/img/tom.svg'},
            {name: 'Priya Shah', src: '/plugins/domma-showcase/public/assets/elements/avatar/img/priya.svg', status: 'away'},
            {name: 'Callum Reid', status: 'busy', href: '#team-callum'},
            {name: 'Nia Evans'},
            {name: 'Rhys Morgan', status: 'offline'},
            {name: 'Sofia Rossi'},
            {name: 'Dafydd Price'},
            {name: 'Mei Chen'}
        ];
        // ---- Team list ---------------------------------------------------------
    const PROJECTS = [
            {name: 'Website refresh', due: D().add(12, 'day'), team: PEOPLE.slice(0, 5)},
            {name: 'Mobile app', due: D().add(1, 'month'), team: PEOPLE.slice(2, 4)},
            {name: 'Annual report', due: D().add(3, 'day'), team: PEOPLE.slice(3, 9)},
            {name: 'Help centre', due: D().add(2, 'month'), team: PEOPLE, members: true}
        ];
    PROJECTS.forEach((p) => {
            const $row = $('<li class="sx-av-project"><div><p class="sx-av-project-name"></p>' +
                '<p class="sx-av-project-meta"></p></div><div data-team></div></li>');
            $row.find('.sx-av-project-name').text(p.name);
            $row.find('.sx-av-project-meta').text(`${p.team.length} people - due ${p.due.fromNow()}`);
            $(root).find('#demo-projects').append($row);
            E.avatarGroup($row.find('[data-team]'), {
                people: p.team,
                max: 3,
                size: 'sm',
                label: `${p.name} team`,
                onMore: p.members ? (hidden) => E.toast(`${hidden.length} more on ${p.name}: ` +
                    hidden.map((h) => h.name).join(', ')) : null
            });
        });
}
