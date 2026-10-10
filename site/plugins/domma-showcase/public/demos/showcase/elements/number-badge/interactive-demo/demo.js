/**
 * Interactive Demo - from public/showcase/elements/number-badge.
 */
export function mount(root) {
        // Interactive JS API demo
    let jsBadge = null;
    let isDot = false;
    let isPulse = false;
    if ($(root).find('#js-demo-target').length) {
          jsBadge = E.numberBadge(root.querySelector('#js-demo-target'), { count: 0, variant: 'danger' });

          const updateDisplay = () => {
            $(root).find('#js-count-display').text(jsBadge.getCount());
          };

          $(root).find('#js-increment').on('click', () => { jsBadge.increment(); updateDisplay(); });
          $(root).find('#js-decrement').on('click', () => { jsBadge.decrement(); updateDisplay(); });
          $(root).find('#js-add-5').on('click', () => { jsBadge.increment(5); updateDisplay(); });
          $(root).find('#js-reset').on('click', () => { jsBadge.setCount(0); updateDisplay(); });

          $(root).find('#js-dot-toggle').on('click', function() {
            isDot = !isDot;
            jsBadge.setDot(isDot);
            $(this).text(isDot ? 'Disable Dot' : 'Enable Dot');
          });

          $(root).find('#js-pulse-toggle').on('click', function() {
            isPulse = !isPulse;
            jsBadge.setPulse(isPulse);
            $(this).text(isPulse ? 'Disable Pulse' : 'Enable Pulse');
          });

          $('.variant-btn').on('click', function() {
            jsBadge.setVariant($(this).data('variant'));
          });
        }
}
