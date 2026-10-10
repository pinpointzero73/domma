/**
 * Domma Icons - from public/showcase/icons.
 */
export function mount(root) {
        // Icon size state
    let currentSize = 24;
        // Category data
    const categoryMeta = {
            buildings: {name: 'Buildings', description: 'Architecture, structures, landmarks, and facilities'},
            code: {name: 'Code', description: 'Code, and code operations'},
            commerce: {name: 'Commerce', description: 'Shopping, payments, and e-commerce'},
            communication: {name: 'Communication', description: 'Messaging, email, and notification icons'},
            devices: {name: 'Devices', description: 'Electronic devices, phones, computers, and hardware'},
            emojis: {name: 'Emojis', description: 'Expressive emoji faces and emotional reactions'},
            files: {name: 'Files', description: 'Documents, folders, and file operations'},
            finance: {name: 'Finance', description: 'Charts, currency, banking, and business icons'},
            health: {name: 'Health', description: 'Medical, wellness, pills, and healthcare symbols'},
            media: {name: 'Media', description: 'Audio, video, images, and playback controls'},
            navigation: {name: 'Navigation', description: 'Arrows, directions, and navigation elements'},
            seasonal: {name: 'Seasonal', description: '\'Tis the season to be jolly'},
            social: {name: 'Social', description: 'Social media, sharing, and user interactions'},
            sport: {name: 'Sport', description: 'Sports, fitness, awards, and athletic equipment'},
            status: {name: 'Status', description: 'Indicators, alerts, and state icons'},
            transport: {name: 'Transport', description: 'Vehicle icons'},
            ui: {name: 'UI', description: 'Core user interface elements - buttons, menus, controls'},
            weather: {name: 'Weather', description: 'Weather conditions, sun, clouds, rain, and meteorology'}
        };
        // Track tabs instance
    let tabsInstance = null;
        // Render the icon gallery
    function renderGallery(filter = '') {
            const gallery = $(root).find('#icon-gallery');
            const tabList = $(root).find('#tab-list');
            const categories = Domma.icons.listCategories();
            const filterLower = filter.toLowerCase();

            let totalIcons = 0;
            let totalCategories = 0;
            let navHtml = '';
            let panelsHtml = '';
            let firstCategory = true;

            Object.entries(categories).forEach(([key, cat]) => {
                let icons = cat.icons;

                // Filter icons
                if (filterLower) {
                    icons = icons.filter(name => name.toLowerCase().includes(filterLower));
                }

                if (icons.length === 0) return;

                totalCategories++;
                totalIcons += icons.length;

                const meta = categoryMeta[key] || {name: key, description: ''};
                const activeClass = firstCategory ? ' active' : '';

                // Tab navigation item
                navHtml += `<button class="icons-tab-item${activeClass}" data-tab="${key}">${meta.name} (${icons.length})</button>`;

                // Tab panel content
                panelsHtml += `
                    <div class="tab-panel${activeClass}" data-panel="${key}">
                        <p class="icons-category-description">${meta.description}</p>
                        <div class="icons-icon-grid">
                `;

                icons.forEach(name => {
                    const iconHtml = Domma.icons.html(name, {size: currentSize});
                    panelsHtml += `
                        <div class="icons-icon-card" data-icon-name="${name}" title="Click to copy: ${name}">
                            ${iconHtml}
                            <span class="icons-icon-name">${name}</span>
                        </div>
                    `;
                });

                panelsHtml += '</div></div>';
                firstCategory = false;
            });

            tabList.html(navHtml, {safe: false});
            gallery.html(panelsHtml, {safe: false});

            // Update stats
            $(root).find('#total-icons').text(totalIcons);
            $(root).find('#total-categories').text(totalCategories);

            // Show/hide elements based on results
            const hasResults = totalIcons > 0;
            $(root).find('#no-results').css('display', hasResults ? 'none' : 'block');
            $(root).find('#icon-tabs').css('display', hasResults ? 'block' : 'none');

            // Initialise tabs component
            if (hasResults) {
                tabsInstance = E.tabs(root.querySelector('#icon-tabs'), {animation: true});
            }

            // Attach click handlers
            $('.icons-icon-card').on('click', function () {
                const name = $(this).attr('data-icon-name');
                copyToClipboard(name);
            });
        }
        // Copy icon name to clipboard
    function copyToClipboard(name) {
            const text = `data-icon="${name}"`;
            navigator.clipboard.writeText(text).then(() => {
                E.toast.success(`Copied: ${name}`, {
                    position: 'bottom-center',
                    duration: 2000
                });
            });
        }
        // Search handler with debounce
    let searchTimeout;
    $(root).find('#search').on('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderGallery($(this).val());
            }, 200);
        });
        // Size controls
    $('.icons-size-btn').on('click', function () {
            $('.icons-size-btn').removeClass('active');
            $(this).addClass('active');
            currentSize = parseInt($(this).attr('data-size'), 10);
            renderGallery($(root).find('#search').val());
        });
        // Initial render
    renderGallery();
}
