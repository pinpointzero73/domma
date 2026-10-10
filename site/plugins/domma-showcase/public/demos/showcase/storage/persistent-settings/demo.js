/**
 * Persistent Settings - from public/showcase/storage.
 */
export function mount(root) {
        // ============================================
        // Model Persistence Demo
        // ============================================
    const prefsModel = M.create({
            theme: {type: 'string', default: 'light'},
            fontSize: {type: 'number', default: 14, min: 10, max: 24},
            notifications: {type: 'boolean', default: true}
        }, {}, {persist: 'demo-prefs'});
    function updatePrefsDisplay() {
            const data = prefsModel.toJSON();
            $(root).find('#prefs-state').text(JSON.stringify(data, null, 2));

            // Update form inputs to match model
            $(root).find('#pref-theme').val(data.theme);
            $(root).find('#pref-fontsize').val(data.fontSize);
            $(root).find('#pref-notifications').val(String(data.notifications));
        }
        // Bind form inputs to model
    $(root).find('#pref-theme').on('change', function () {
            prefsModel.set('theme', $(this).val());
            updatePrefsDisplay();
            refreshInspector();
        });
    $(root).find('#pref-fontsize').on('input', function () {
            const val = parseInt($(this).val(), 10);
            if (val >= 10 && val <= 24) {
                prefsModel.set('fontSize', val);
                updatePrefsDisplay();
                refreshInspector();
            }
        });
    $(root).find('#pref-notifications').on('change', function () {
            prefsModel.set('notifications', $(this).val() === 'true');
            updatePrefsDisplay();
            refreshInspector();
        });
    $(root).find('#btn-reset-prefs').on('click', function () {
            prefsModel.reset();
            updatePrefsDisplay();
            refreshInspector();
        });
    $(root).find('#btn-clear-prefs').on('click', function () {
            prefsModel.reset(true);
            updatePrefsDisplay();
            refreshInspector();
        });
        // Initial display
    updatePrefsDisplay();
        // ============================================
        // Storage Inspector
        // ============================================
    function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }
    function refreshInspector() {
            const keys = S.keys();
            const totalSize = S.totalSize();
            const available = S.isAvailable();

            // Update stats
            $(root).find('#stat-keys').text(keys.length);
            $(root).find('#stat-size').text(formatBytes(totalSize));
            $(root).find('#stat-available').text(available ? 'Yes' : 'No');

            // Update inspector
            const $inspector = $(root).find('#storage-inspector');

            if (keys.length === 0) {
                $inspector.html('<p class="text-muted">No data stored</p>');
                return;
            }

            let html = '';
            keys.forEach(key => {
                const value = S.get(key);
                const displayValue = JSON.stringify(value);
                html += `
                    <div class="storage-item-style">
                        <span class="storage-key-style">${_.escape(key)}</span>
                        <span class="storage-value-style">${_.escape(displayValue)}</span>
                    </div>
                `;
            });

            $inspector.html(html);
        }
}
