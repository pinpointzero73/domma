/**
 * It stops listening to what it stopped reading - from public/showcase/models/reactivity.
 */
export function mount(root) {
    function logTo(selector, message) {
            const time = D().format('HH:mm:ss');
            $(selector).prepend(
                `<div><span class="rx-log-time">[${time}]</span> ${message}</div>`
            );
        }
        // ══════════════════════════════════════════════════════════════════════
        // 4. Conditional Dependencies
        // ══════════════════════════════════════════════════════════════════════
    const state = M.create({mode: {}, x: {}, y: {}}, {mode: 'x', x: 1, y: 100});
    M.effect(() => {
            const mode = state.get('mode');
            const value = mode === 'x' ? state.get('x') : state.get('y');
            logTo('#rx-branch-log', `re-ran - mode=<strong>${mode}</strong>, value=<strong>${value}</strong>`);
        });
    $(root).find('#rx-mode').on('change', function () {
            state.set('mode', $(this).val());
        });
    $(root).find('#rx-x').on('input', function () {
            state.set('x', Number($(this).val()) || 0);
        });
    $(root).find('#rx-y').on('input', function () {
            state.set('y', Number($(this).val()) || 0);
        });
}
