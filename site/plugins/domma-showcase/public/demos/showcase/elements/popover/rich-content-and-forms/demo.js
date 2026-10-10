/**
 * Rich content and forms - from public/showcase/elements/popover.
 */
export function mount(root) {
        // ---- Rich content ------------------------------------------------------
    const rename = E.popover(root.querySelector('#demo-rename'), {
            title: 'Rename project',
            placement: 'bottom-start',
            content: () => {
                const form = $('<form class="sx-pop-form">' +
                    '<input class="form-input" name="name" aria-label="Project name">' +
                    '<div class="sx-pop-actions">' +
                    '<button type="button" class="btn btn-sm btn-ghost" data-cancel>Cancel</button>' +
                    '<button class="btn btn-sm btn-primary">Save</button>' +
                    '</div></form>');
                form.find('input').val($(root).find('#demo-name').text());
                form.find('[data-cancel]').on('click', () => rename.hide({returnFocus: true}));
                form.on('submit', (e) => {
                    e.preventDefault();
                    const value = String(form.find('input').val()).trim();
                    if (value) {
                        $(root).find('#demo-name').text(value);
                        log('Renamed to ' + value);
                    }
                    rename.hide({returnFocus: true});
                });
                return form.get(0);
            }
        });
    E.popover(root.querySelector('#demo-html'), {
            html: true,
            title: 'Sanitised',
            content: '<p><strong>Bold</strong>, <em>italic</em> and a <a href="#Rich Content">link</a> survive.</p>' +
                '<p><a href="javascript:E.toast(1)">This link</a> loses its href, ' +
                '<span onmouseover="E.toast(1)">this span</span> its handler.</p>'
        });
}
