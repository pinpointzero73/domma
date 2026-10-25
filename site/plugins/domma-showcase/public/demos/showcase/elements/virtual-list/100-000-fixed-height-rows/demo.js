/**
 * 100,000 fixed-height rows - only the rows on screen exist in the page.
 */
export function mount(root) {
    const rows = Array.from({length: 100000}, (_v, i) => ({id: i, name: 'Customer ' + i, total: (i * 7919) % 10000}));

    const big = E.virtualList($(root).find('#demo-big').get(0), {
        items: rows,
        itemHeight: 40,
        keyField: 'id',
        label: 'Customers',
        render: (r) => '<span class="sx-vl-num">#' + r.id + '</span>' +
            '<span class="sx-vl-grow">' + _.escape(r.name) + '</span>' +
            '<span class="sx-vl-amount">£' + (r.total / 100).toFixed(2) + '</span>',
        onItemClick: (r) => E.toast('Clicked ' + r.name, {type: 'info'})
    });

    // The rows on screen, and how many row elements the page holds.
    const show = () => {
        const {start, end} = big.getVisibleRange();
        $(root).find('#demo-big-range').text(start + ' - ' + end);
        $(root).find('#demo-big-dom').text(String($(root).find('.dm-vlist-row').length));
    };
    big.on('scroll', show);
    big.on('render', show);
    show();

    $(root).find('#demo-big-go').on('click', () => {
        big.scrollToIndex(Number($(root).find('#demo-big-index').val()) || 0, {align: 'center'});
    });
    $(root).find('#demo-big-top').on('click', () => big.scrollToIndex(0, {align: 'start'}));

    return () => big.destroy();
}
