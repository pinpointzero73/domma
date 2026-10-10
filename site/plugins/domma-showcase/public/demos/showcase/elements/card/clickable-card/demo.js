/**
 * Example 3: Clickable Card - from public/showcase/elements/card.
 */
export function mount(root) {
    E.card(root.querySelector('#example-clickable'), {
        hover: true,
        clickable: true,
        onClick: (e) => {
            const result = $(root).find('#click-result')[0];
            result.classList.remove('hidden');
            result.textContent = `Card clicked at ${D().format('HH:mm:ss')}`;
        }
    });
}
