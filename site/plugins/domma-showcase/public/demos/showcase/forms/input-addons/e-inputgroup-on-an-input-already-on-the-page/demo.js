/**
 * E.inputGroup - on an input already on the page - from public/showcase/forms/input-addons.
 */
export function mount(root) {
        // ---- E.inputGroup on a hand-written input --------------------------------
    let group = null;
    const updaters = '#ig-text, #ig-icon, #ig-kg, #ig-no-suffix, #ig-destroy';
    const showMarkup = () => {
            const el = group ? group.wrapper : $(root).find('#ig-demo').get(0);
            // Show icons as the data-icon span they started as, not the SVG they became.
            const html = el ? el.outerHTML.replace(/<svg[^>]*data-icon="([^"]+)"[\s\S]*?<\/svg>/g, '<span data-icon="$1"></span>') : '';
            $(root).find('#ig-markup').text(html.replace(/></g, '>\n<').replace(/<span data-icon="([^"]+)">\n<\/span>/g, '<span data-icon="$1"></span>'));
        };
    const bind = () => {
            group = E.inputGroup(root.querySelector('#ig-demo'), {prefix: '£', suffix: '.00'});
            $(updaters).prop('disabled', false);
            $(root).find('#ig-bind').prop('disabled', true);
            showMarkup();
        };
    const change = (slots) => {
            if (!group) return;
            group.update(slots);
            showMarkup();
        };
    $(root).find('#ig-text').on('click', () => change({prefix: '£'}));
    $(root).find('#ig-icon').on('click', () => change({prefix: {icon: 'tag'}}));
    $(root).find('#ig-kg').on('click', () => change({suffix: 'kg'}));
    $(root).find('#ig-no-suffix').on('click', () => change({suffix: null}));
    $(root).find('#ig-destroy').on('click', () => {
            if (!group) return;
            group.destroy();
            group = null;
            $(updaters).prop('disabled', true);
            $(root).find('#ig-bind').prop('disabled', false);
            showMarkup();
        });
    $(root).find('#ig-bind').on('click', bind);
    bind();
}
