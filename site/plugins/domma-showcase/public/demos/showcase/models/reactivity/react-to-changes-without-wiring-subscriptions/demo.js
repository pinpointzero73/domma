/**
 * React to changes without wiring subscriptions - from public/showcase/models/reactivity.
 */
export function mount(root) {
    function logTo(selector, message) {
            const time = D().format('HH:mm:ss');
            $(selector).prepend(
                `<div><span class="rx-log-time">[${time}]</span> ${message}</div>`
            );
        }
        // ══════════════════════════════════════════════════════════════════════
        // 2. Effects
        // ══════════════════════════════════════════════════════════════════════
    const prefs = M.create(
            {username: {}, theme: {}, sessionId: {}},
            {username: 'alice', theme: 'light', sessionId: 'abc123'}
        );
    const stopEffect = M.effect(() => {
            const user = prefs.get('username');
            const theme = prefs.get('theme');
            const session = M.untracked(() => prefs.get('sessionId'));

            logTo('#rx-effect-log', `effect ran - user=<strong>${user}</strong> theme=<strong>${theme}</strong> session=${session}`);
        });
    $(root).find('#rx-user').on('input', function () {
            prefs.set('username', $(this).val());
        });
    $(root).find('#rx-theme').on('change', function () {
            prefs.set('theme', $(this).val());
        });
    $(root).find('#rx-secret').on('input', function () {
            prefs.set('sessionId', $(this).val());
            logTo('#rx-effect-log', '<em>sessionId changed - untracked, no re-run</em>');
        });
    $(root).find('#rx-stop').on('click', function () {
            stopEffect();
            logTo('#rx-effect-log', '<strong>effect stopped</strong>');
            $(this).prop('disabled', true);
            E.toast('Effect unsubscribed', {type: 'warning'});
        });
    $(root).find('#rx-clear-log').on('click', function () {
            $(root).find('#rx-effect-log').html('');
        });
}
