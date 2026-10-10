/**
 * Interactive Demo - from public/showcase/css-utilities.
 */
export function mount(root) {
        /* ── Interactive slider demo ─────────────────────── */
    const $target = $(root).find('#opacity-target');
    const $readout = $(root).find('#opacity-readout');
    const opacityMap = {
            0: '0', 10: '0.1', 20: '0.2', 25: '0.25', 30: '0.3',
            40: '0.4', 50: '0.5', 60: '0.6', 70: '0.7', 75: '0.75',
            80: '0.8', 90: '0.9', 100: '1'
        };
        // Snap slider to nearest supported step
    const steps = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];
    function nearest(val) {
            return steps.reduce((prev, curr) =>
                Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
            );
        }
    $(root).find('#opacity-slider').on('input', function () {
            const raw  = parseInt($(this).val());
            const snapped = nearest(raw);
            $(this).val(snapped);
            const opacityVal = opacityMap[snapped];
            $target.css('opacity', opacityVal);
            $readout.text(`opacity: ${opacityVal}  →  class="opacity-${snapped}"`);
        });
}
