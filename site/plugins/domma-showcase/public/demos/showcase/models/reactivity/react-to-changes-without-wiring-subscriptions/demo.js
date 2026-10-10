/**
 * React to changes without wiring subscriptions - from public/showcase/models/reactivity.
 */
export function mount(root) {
    // The log is a bound list (data-each in demo.html): newest first, so prepend.
    // peek() reads it without tracking - logTo runs inside effects, and a tracked
    // read of the log there would make the effect depend on its own output.
    const log = M.observable([]);
    let seq = 0;
    function logTo(entry) {
            const row = {id: ++seq, time: `[${D().format('HH:mm:ss')}]`, ...entry};
            log.value = [row, ...log.peek()];
        }
    const handle = M.applyBindings({log}, root);
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

            logTo({kind: 'ran', user, theme, session});
        });
    $(root).find('#rx-user').on('input', function () {
            prefs.set('username', $(this).val());
        });
    $(root).find('#rx-theme').on('change', function () {
            prefs.set('theme', $(this).val());
        });
    $(root).find('#rx-secret').on('input', function () {
            prefs.set('sessionId', $(this).val());
            logTo({kind: 'session'});
        });
    $(root).find('#rx-stop').on('click', function () {
            stopEffect();
            logTo({kind: 'stopped'});
            $(this).prop('disabled', true);
            E.toast('Effect unsubscribed', {type: 'warning'});
        });
    $(root).find('#rx-clear-log').on('click', function () {
            log.value = [];
        });
    return () => {
        stopEffect();
        handle.dispose();
    };
}
