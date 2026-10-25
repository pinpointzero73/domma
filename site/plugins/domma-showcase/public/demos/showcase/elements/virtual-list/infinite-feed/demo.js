/**
 * Infinite feed - loadMore() pages in posts; page three fails once, and the feed ends after eight.
 */
export function mount(root) {
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
        'labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris').split(' ');
    const sentence = (min, max) => {
        const n = min + Math.floor(rand() * (max - min));
        const text = Array.from({length: n}, () => pick(WORDS)).join(' ');
        return text.charAt(0).toUpperCase() + text.slice(1) + '.';
    };

    // A pretend server: half a second a page.
    const timers = new Set();
    let failedOnce = false;
    let postId = 0;
    const fetchPage = (page) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            timers.delete(timer);
            if (page === 2 && !failedOnce) {
                failedOnce = true;
                reject(new Error('The network went away (on purpose). Press Retry.'));
                return;
            }
            const items = Array.from({length: 20}, () => ({
                id: 'p' + (++postId),
                title: 'Post ' + postId + ': ' + sentence(3, 8),
                body: sentence(10, rand() < 0.3 ? 60 : 24)
            }));
            resolve({items, done: page >= 7});
        }, 500);
        timers.add(timer);
    });

    const feed = E.virtualList($(root).find('#demo-feed').get(0), {
        itemHeight: 'auto',
        estimatedItemHeight: 96,
        keyField: 'id',
        rowClass: 'sx-vl-post',
        label: 'Posts',
        threshold: 300,
        loadMore: ({page}) => fetchPage(page),
        endTemplate: 'You are all caught up.',
        render: (p) => '<p class="sx-vl-post-title">' + _.escape(p.title) + '</p>' +
            '<p class="sx-vl-post-body">' + _.escape(p.body) + '</p>',
        onItemClick: (p) => E.toast('Opened ' + p.title, {type: 'info'})
    });

    return () => {
        timers.forEach(clearTimeout);
        feed.destroy();
    };
}
