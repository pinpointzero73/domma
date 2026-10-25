/**
 * Rows of different heights - measured rows, a chat that opens at the bottom and grows upwards.
 */
export function mount(root) {
    // A small seeded generator, so every visit shows the same messages.
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

    const PEOPLE = ['Ada', 'Grace', 'Alan', 'Katherine', 'Tim', 'Margaret'];
    let messageId = 0;
    let minutesAgo = 0;
    const message = () => {
        minutesAgo += 1 + Math.floor(rand() * 9);
        return {
            id: 'm' + (messageId++),
            who: pick(PEOPLE),
            when: D().subtract(minutesAgo, 'minutes').format('D MMM HH:mm'),
            text: sentence(3, rand() < 0.2 ? 90 : 25)
        };
    };
    // Generated newest first, shown oldest first.
    const olderMessages = (n) => Array.from({length: n}, message).reverse();
    const messages = olderMessages(5000);

    const chat = E.virtualList($(root).find('#demo-chat').get(0), {
        items: messages,
        itemHeight: 'auto',
        estimatedItemHeight: 72,
        keyField: 'id',
        rowClass: 'sx-vl-msg',
        label: 'Messages',
        render: (m) => '<span class="sx-vl-who">' + _.escape(m.who) + '</span>' +
            '<span class="sx-vl-when">' + _.escape(m.when) + '</span>' +
            '<p class="sx-vl-text">' + _.escape(m.text) + '</p>',
        onItemClick: (m) => E.toast(m.who + ' at ' + m.when, {type: 'info'})
    });
    const latest = () => chat.scrollToIndex(chat.count - 1, {align: 'end'});
    const showCount = () => $(root).find('#demo-chat-count').text(String(chat.count));
    latest();
    showCount();

    $(root).find('#demo-chat-older').on('click', () => {
        chat.prepend(olderMessages(20));   // the message you are reading stays put
        showCount();
    });
    $(root).find('#demo-chat-bottom').on('click', latest);

    return () => chat.destroy();
}
