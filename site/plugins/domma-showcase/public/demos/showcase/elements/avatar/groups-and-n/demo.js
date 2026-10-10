/**
 * Groups and "+N" - from public/showcase/elements/avatar.
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
        // ---- Groups ------------------------------------------------------------
    const groupState = {max: 4, size: 'md', overlap: 'md'};
    const group = E.avatarGroup(root.querySelector('#demo-group'), {people: PEOPLE, max: 4, label: 'Design team'});
    const drawGroup = () => {
            group.update({max: groupState.max, size: groupState.size, overlap: groupState.overlap});
            const parts = ['people'];
            if (groupState.max != null) parts.push(`max: ${groupState.max}`);
            if (groupState.size !== 'md') parts.push(`size: '${groupState.size}'`);
            if (groupState.overlap !== 'md') parts.push(`overlap: '${groupState.overlap}'`);
            $(root).find('#demo-group-code').text(`E.avatarGroup(root.querySelector('#demo-group'), {${parts.join(', ')}});`);
        };
    const choose = (attr, key, parse) => $(`[${attr}]`).on('click', (e) => {
            const btn = e.currentTarget;
            $(`[${attr}]`).removeClass('active');
            $(btn).addClass('active');
            groupState[key] = parse(btn.getAttribute(attr));
            drawGroup();
        });
    choose('data-max', 'max', (v) => (v === '' ? null : Number(v)));
    choose('data-gsize', 'size', (v) => v);
    choose('data-overlap', 'overlap', (v) => v);
        // ---- Team list ---------------------------------------------------------
    const PROJECTS = [
            {name: 'Website refresh', due: D().add(12, 'day'), team: PEOPLE.slice(0, 5)},
            {name: 'Mobile app', due: D().add(1, 'month'), team: PEOPLE.slice(2, 4)},
            {name: 'Annual report', due: D().add(3, 'day'), team: PEOPLE.slice(3, 9)},
            {name: 'Help centre', due: D().add(2, 'month'), team: PEOPLE, members: true}
        ];
}
