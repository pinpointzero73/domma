/**
 * Example 5: Programmatic Control - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const items = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
        // Programmatic control
    const programmaticPillbox = E.pillbox(root.querySelector('#programmatic-pillbox'), {
            data: items
        });
    window.addRandomPill = function () {
            const available = items.filter(item => !programmaticPillbox.getValue().includes(item));
            if (available.length > 0) {
                const random = available[Math.floor(Math.random() * available.length)];
                programmaticPillbox.addPill(random, random);
            }
        };
    window.removeLast = function () {
            const count = programmaticPillbox.getCount();
            if (count > 0) {
                programmaticPillbox.removePillAt(count - 1);
            }
        };
    window.clearAll = function () {
            programmaticPillbox.clear();
        };
    window.showValues = function () {
            const values = programmaticPillbox.getValue();
            E.toast('Current values: ' + (values.length > 0 ? values.join(', ') : 'None'));
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        addRandomPill();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        removeLast();
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        clearAll();
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        showValues();
    });
}
