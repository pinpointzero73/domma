/**
 * Derived values that can't go stale - from public/showcase/models/reactivity.
 */
export function mount(root) {
    function flash(selector) {
            const $el = $(selector).addClass('is-hot');
            setTimeout(() => $el.removeClass('is-hot'), 220);
        }
        // ══════════════════════════════════════════════════════════════════════
        // 1. Tracked Computeds
        // ══════════════════════════════════════════════════════════════════════
    const order = M.create(
            {price: {}, qty: {}, note: {}},
            {price: 10, qty: 3, note: ''}
        );
    let evalCount = 0;
    const total = M.computed(() => {
            evalCount++;
            return order.get('price') * order.get('qty');
        });
    function renderTotal() {
            $(root).find('#rx-total').text(total.get());
            $(root).find('#rx-evals').text(evalCount);
            flash('#rx-evals-box');
        }
    renderTotal();
    $(root).find('#rx-price').on('input', function () {
            order.set('price', Number($(this).val()) || 0);
            renderTotal();
        });
    $(root).find('#rx-qty').on('input', function () {
            order.set('qty', Number($(this).val()) || 0);
            renderTotal();
        });
    $(root).find('#rx-note').on('input', function () {
            // Writes to the model, but 'note' is not a dependency of `total`
            order.set('note', $(this).val());
            renderTotal();
        });
    $(root).find('#rx-read').on('click', function () {
            renderTotal();
            E.toast(`Read served from cache - still ${evalCount} evaluation(s)`, {type: 'info'});
        });
}
