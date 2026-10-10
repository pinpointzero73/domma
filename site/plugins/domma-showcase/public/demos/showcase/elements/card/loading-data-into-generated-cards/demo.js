/**
 * Loading data into a generated card - the card shows a skeleton while the
 * (simulated) request runs, then its content is swapped in. The timer is
 * cleared on teardown, so a reset never writes into a card that has gone.
 */
export function mount(root) {
    const statsCard = E.card(root.querySelector('#stats-card'), {
        title: 'User statistics',
        icon: 'database',
        collapsible: true,
        content: '<div class="skeleton-lines" aria-busy="true"><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div></div>'
    });

    const timer = setTimeout(() => {
        statsCard.setContent(`
            <div class="grid grid-cols-2 gap-3">
                <div><strong>Total users:</strong> 1,234</div>
                <div><strong>Active:</strong> 987</div>
                <div><strong>New today:</strong> 42</div>
                <div><strong>Growth:</strong> +12%</div>
            </div>`);
        statsCard.updateHeight();
    }, 1500);

    return () => clearTimeout(timer);
}
