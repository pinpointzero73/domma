/**
 * One flag, four shapes - from public/showcase/flags.
 */
export function mount(root) {
        // ---- Gallery ----
    const regions = FL.listRegions();
    let currentShape = 'rect';
    let currentSize = 48;
    function renderGallery(query = '') {
            const gallery = $(root).find('#gallery');
            gallery.html('');
            const matches = query ? FL.search(query) : null;
            let shown = 0;

            _.each(regions, (meta, key) => {
                const codes = meta.codes.filter(c => !matches || matches.includes(c));
                if (!codes.length) {
                    return;
                }
                shown += codes.length;

                const title = document.createElement('h2');
                title.className = 'flag-region-title';
                title.textContent = meta.name;
                gallery.append(title);

                const grid = document.createElement('div');
                grid.className = 'flag-grid';
                codes.forEach(code => {
                    const cell = document.createElement('div');
                    cell.className = 'flag-cell';
                    cell.appendChild(FL.render(code, {size: currentSize, shape: currentShape, border: true}));
                    const name = document.createElement('div');
                    name.className = 'flag-name';
                    name.textContent = FL.name(code);
                    const cd = document.createElement('div');
                    cd.className = 'flag-code';
                    cd.textContent = code;
                    cell.append(name, cd);
                    $(cell).on('click', () => copy(code));
                    grid.appendChild(cell);
                });
                gallery.append(grid);
            });

            $(root).find('#no-results').css('display', shown ? 'none' : 'block');
        }
    function copy(code) {
            navigator.clipboard.writeText(`data-flag="${code}"`).then(() => {
                E.toast(`Copied: ${code}`, {type: 'success', position: 'bottom-center', duration: 1800});
            });
        }
        // Controls
    let t;
    $(root).find('#search').on('input', function () {
            clearTimeout(t);
            const v = $(this).val();
            t = setTimeout(() => renderGallery(v), 180);
        });
    $(root).find('#shape').on('change', function () {
            currentShape = $(this).val();
            renderGallery($(root).find('#search').val());
        });
    $(root).find('#size').on('change', function () {
            currentSize = parseInt($(this).val(), 10);
            renderGallery($(root).find('#search').val());
        });
        // Initial render
    renderGallery();
}
