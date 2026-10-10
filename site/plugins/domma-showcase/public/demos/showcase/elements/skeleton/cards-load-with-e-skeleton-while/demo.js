/**
 * Cards: load with E.skeleton.while - from public/showcase/elements/skeleton.
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
        // ---- Cards -------------------------------------------------------------
    const POSTS = [
            {title: 'Planting for spring', text: 'What to sow now for colour by April, and what can wait until the frosts have passed.'},
            {title: 'A kitchen garden in pots', text: 'Herbs, salad and tomatoes on a balcony two metres wide.'},
            {title: 'Composting without a garden', text: 'Bokashi bins, wormeries and what the council will collect.'}
        ];
    const renderPost = (p) =>
            '<div class="card"><div class="sx-sk-cover"></div><div class="card-body">' +
            '<h3 class="card-title">' + _.escape(p.title) + '</h3><p class="m-0">' + _.escape(p.text) + '</p></div></div>';
    const loadCards = async () => {
            $(root).find('#demo-cards-status').text('Loading...');
            $(root).find('#demo-cards-load').prop('disabled', true);
            const posts = await E.skeleton.while('#demo-cards', pretendLoad(POSTS), {type: 'card', count: 3});
            setHtml('#demo-cards', posts.map(renderPost).join(''));
            $(root).find('#demo-cards-status').text('Loaded ' + posts.length + ' posts.');
            $(root).find('#demo-cards-load').prop('disabled', false);
        };
    $(root).find('#demo-cards-load').on('click', loadCards);
    loadCards();
}
