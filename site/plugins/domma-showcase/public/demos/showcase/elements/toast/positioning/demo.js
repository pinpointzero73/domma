/**
 * Positioning - from public/showcase/elements/toast.
 */
export function mount(root) {
        // Positioning
    const positions = {
            'pos-tl': 'top-left',
            'pos-tc': 'top-center',
            'pos-tr': 'top-right',
            'pos-cl': 'center-left',
            'pos-cc': 'center',
            'pos-cr': 'center-right',
            'pos-bl': 'bottom-left',
            'pos-bc': 'bottom-center',
            'pos-br': 'bottom-right'
        };
    Object.keys(positions).forEach(id => {
          $('#' + id).on('click', () => {
                E.toast(`Toast at ${positions[id]}`, {
                    position: positions[id],
                    type: 'info'
                });
            });
        });
}
