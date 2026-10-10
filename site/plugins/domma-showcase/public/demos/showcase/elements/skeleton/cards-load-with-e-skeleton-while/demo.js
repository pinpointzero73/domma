/**
 * Cards: load with E.skeleton.while - from public/showcase/elements/skeleton.
 *
 * The cards are a bound list (data-each). E.skeleton.while moves the
 * container's children aside and puts the same nodes back, so the bindings
 * survive the placeholders; the loaded posts are then simply assigned.
 */
export function mount(root) {
    // A stand-in for H.get(): resolves with the data after a pause, or rejects.
    const pretendLoad = (data, fail = false, ms = 1400) => new Promise((resolve, reject) => {
        setTimeout(() => (fail ? reject(new Error('The server did not answer (on purpose)')) : resolve(data)), ms);
    });
    // ---- Cards -------------------------------------------------------------
    const POSTS = [
        {title: 'Planting for spring', text: 'What to sow now for colour by April, and what can wait until the frosts have passed.'},
        {title: 'A kitchen garden in pots', text: 'Herbs, salad and tomatoes on a balcony two metres wide.'},
        {title: 'Composting without a garden', text: 'Bokashi bins, wormeries and what the council will collect.'}
    ];

    const posts = M.observable([]);
    const status = M.observable('');
    const busy = M.observable(false);
    const cardsEl = root.querySelector('#demo-cards');

    const loadCards = async () => {
        status.value = 'Loading...';
        busy.value = true;
        const loaded = await E.skeleton.while(cardsEl, pretendLoad(POSTS), {type: 'card', count: 3});
        posts.value = [...loaded];
        status.value = 'Loaded ' + loaded.length + ' posts.';
        busy.value = false;
    };

    const handle = M.applyBindings({posts, status, busy, load: loadCards}, root);
    loadCards();

    return () => {
        handle.dispose();
        E.skeleton.remove(cardsEl);
    };
}
