/**
 * Storage Inspector - from public/showcase/storage.
 */
export function mount(root) {
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
    $(root).find('#btn-refresh-inspector').on('click', refreshInspector);
        // Initial inspector load
    refreshInspector();
}
