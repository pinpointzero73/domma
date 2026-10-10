/**
 * Example 4: Custom Pill Rendering - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const team = [
            {value: '1', label: 'Alice', role: 'Admin'},
            {value: '2', label: 'Bob', role: 'Developer'},
            {value: '3', label: 'Carol', role: 'Designer'},
            {value: '4', label: 'David', role: 'Developer'},
            {value: '5', label: 'Eve', role: 'Admin'}
        ];
        // Custom rendering
    E.pillbox(root.querySelector('#custom-render-pillbox'), {
            data: team,
            renderPill: (item) => {
                const icon = item.role === 'Admin' ? '👑' :
                    item.role === 'Developer' ? '💻' : '🎨';
              return `${icon} ${item.label} <span class="pillbox-tag-display">(${item.role})</span>`;
            },
            renderOption: (item) => {
                const icon = item.role === 'Admin' ? '👑' :
                    item.role === 'Developer' ? '💻' : '🎨';
                return `
                    <div class="pillbox-flex-align-center-gap-2">
                        <span>${icon}</span>
                        <div class="pillbox-flex-col-align-start">
                            <div><strong>${item.label}</strong></div>
                            <div class="pillbox-option-text-opacity-7">${item.role}</div>
                        </div>
                    </div>
                `;
            }
        });
}
