/**
 * Searching a server - source(query, {signal}) with debounce, aborts, empty and error states.
 */
export function mount(root) {
    const directory = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton',
        'Tim Berners-Lee', 'Barbara Liskov', 'Donald Knuth', 'Edsger Dijkstra', 'Frances Allen', 'Radia Perlman',
        'Ken Thompson', 'Dennis Ritchie', 'Hedy Lamarr', 'Sophie Wilson'];
    const timers = new Set();
    const counts = {sent: 0, aborted: 0};
    const show = () => {
        $(root).find('#people-sent').text(String(counts.sent));
        $(root).find('#people-aborted').text(String(counts.aborted));
    };

    // The best fuzzy matches, as commands.
    const search = (query) => directory
        .map((name) => ({name, match: E.commandPalette.fuzzyMatch(query, name)}))
        .filter((r) => r.match)
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 8)
        .map((r) => ({
            id: 'person:' + r.name,
            title: r.name,
            subtitle: r.name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.org',
            icon: 'user',
            action: () => E.toast('Messaging ' + r.name, {type: 'success'})
        }));

    // A pretend server: answers after 400 ms, unless the query changes first.
    const ask = (query, signal, fail) => new Promise((resolve, reject) => {
        counts.sent++;
        show();
        const timer = setTimeout(() => {
            timers.delete(timer);
            if (fail) reject(new Error('Server unavailable'));
            else resolve(search(query));
        }, 400);
        timers.add(timer);
        signal.addEventListener('abort', () => {
            if (!timers.delete(timer)) return;   // already answered
            clearTimeout(timer);
            counts.aborted++;
            show();
            reject(new DOMException('Aborted', 'AbortError'));
        });
    });

    const people = E.commandPalette({
        hotkey: false,
        label: 'Find a person',
        placeholder: 'Search people…',
        debounce: 200,
        emptyText: 'Nobody by that name',
        errorText: 'The directory did not answer. Try again.',
        sourceGroup: 'People',
        source: (query, {signal}) => ask(query.trim(), signal, $(root).find('#people-fail').prop('checked'))
    });

    $(root).find('#open-people').on('click', () => people.open());

    return () => {
        timers.forEach(clearTimeout);
        people.destroy();
    };
}
