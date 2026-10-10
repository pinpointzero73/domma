/**
 * Every type - from public/showcase/elements/skeleton.
 */
export function mount(root) {
        // ---- Every type --------------------------------------------------------
    const TYPE_OPTIONS = {
            text: {type: 'text', lines: 4},
            card: {type: 'card', lines: 2},
            list: {type: 'list', count: 3},
            table: {type: 'table', rows: 3, columns: 4},
            custom: {type: 'custom', template: '<div class="sx-sk-row"><div class="skeleton skeleton-circle skeleton-xl"></div>' +
                '<div class="skeleton-lines"><div class="skeleton skeleton-heading"></div>' +
                '<div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div></div></div>'}
        };
    let currentType = 'text';
    const showType = () => {
            const animate = $(root).find('#demo-types-animate').prop('checked');
            const opts = {...TYPE_OPTIONS[currentType], animate};
            E.skeleton(root.querySelector('#demo-types'), opts);
            const shown = _.omit(opts, ['template', 'animate']);
            if (!animate) shown.animate = false;
            const args = JSON.stringify(shown).replace(/"(\w+)":/g, '$1: ').replace(/"/g, "'").replace(/,/g, ', ');
            $(root).find('#demo-types-code').text("E.skeleton(root.querySelector('#demo-types'), " + (currentType === 'custom' ? "{type: 'custom', template: '...'}" : args) + ');');
        };
    $('[data-type]').on('click', (e) => {
            currentType = e.currentTarget.getAttribute('data-type');
            $('[data-type]').removeClass('active');
            $(e.currentTarget).addClass('active');
            showType();
        });
    $(root).find('#demo-types-animate').on('change', showType);
    showType();
}
