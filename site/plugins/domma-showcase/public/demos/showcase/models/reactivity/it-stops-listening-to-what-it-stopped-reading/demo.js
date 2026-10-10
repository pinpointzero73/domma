/**
 * It stops listening to what it stopped reading - from public/showcase/models/reactivity.
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
        // 4. Conditional Dependencies
        // ══════════════════════════════════════════════════════════════════════
    const state = M.create({mode: {}, x: {}, y: {}}, {mode: 'x', x: 1, y: 100});
    const stopEffect = M.effect(() => {
            const mode = state.get('mode');
            const value = mode === 'x' ? state.get('x') : state.get('y');
            logTo({mode, val: value});
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
    return () => {
        stopEffect();
        handle.dispose();
    };
}
