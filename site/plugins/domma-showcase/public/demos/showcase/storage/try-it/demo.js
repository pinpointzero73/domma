/**
 * Try It - from public/showcase/storage.
 */
export function mount(root) {
        // ============================================
        // Basic Storage Demo
        // ============================================
    const $result = $(root).find('#storage-result');
    function showResult(data) {
            $result.text(JSON.stringify(data, null, 2));
        }
    $(root).find('#btn-set').on('click', function () {
            const key = $(root).find('#storage-key').val();
            let value;
            try {
                value = JSON.parse($(root).find('#storage-value').val());
            } catch (e) {
                value = $(root).find('#storage-value').val();
            }

            const success = S.set(key, value);
            showResult({action: 'set', key, success, value});
            refreshInspector();
        });
    $(root).find('#btn-get').on('click', function () {
            const key = $(root).find('#storage-key').val();
            const value = S.get(key, null);
            showResult({action: 'get', key, value, found: value !== null});
        });
    $(root).find('#btn-remove').on('click', function () {
            const key = $(root).find('#storage-key').val();
            const success = S.remove(key);
            showResult({action: 'remove', key, success});
            refreshInspector();
        });
    $(root).find('#btn-clear').on('click', function () {
            const count = S.clear();
            showResult({action: 'clear', keysCleared: count});
            refreshInspector();
            updatePrefsDisplay();
        });
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
