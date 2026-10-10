/**
 * One render per change, not one per write - from public/showcase/models/reactivity.
 */
export function mount(root) {
        // ══════════════════════════════════════════════════════════════════════
        // 3. Batching
        // ══════════════════════════════════════════════════════════════════════
    const form = M.create({a: {}, b: {}, c: {}}, {a: 0, b: 0, c: 0});
    let runCount = 0;
    M.effect(() => {
            form.get('a');
            form.get('b');
            form.get('c');
            runCount++;
            $(root).find('#rx-runs').text(runCount);
        });
    let nudge = 0;
    $(root).find('#rx-burst').on('click', function () {
            nudge++;
            form.set('a', nudge);
            form.set('b', nudge * 2);
            form.set('c', nudge * 3);
            E.toast('3 separate writes → 1 flush', {type: 'success'});
        });
    $(root).find('#rx-batch').on('click', function () {
            nudge++;
            form.set({a: nudge, b: nudge * 2, c: nudge * 3});
            E.toast('1 batched write → 1 flush', {type: 'success'});
        });
    $(root).find('#rx-sync').on('click', function () {
            nudge++;
            form.set('a', nudge);
            M.flush();
            E.toast(`Settled synchronously - run count is already ${runCount}`, {type: 'info'});
        });
}
