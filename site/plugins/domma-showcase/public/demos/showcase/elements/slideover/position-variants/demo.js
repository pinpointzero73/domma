/**
 * Position Variants - from public/showcase/elements/slideover.
 */
export function mount(root) {
    let currentSlideover = null;
      // Position demos
    function demoPositionRight() {
        currentSlideover = E.slideover({
          title: 'Right Slideover',
          content: '<p>This slideover slides in from the right side of the screen.</p><p>This is the default position and works well for detail panels, filters, and forms.</p>',
          position: 'right',
          size: 'lg'
        });
        currentSlideover.open();
      }
    function demoPositionLeft() {
        currentSlideover = E.slideover({
          title: 'Left Slideover',
          content: '<p>This slideover slides in from the left side of the screen.</p><p>Great for navigation menus and table of contents.</p>',
          position: 'left',
          size: 'md'
        });
        currentSlideover.open();
      }
    function demoPositionTop() {
        currentSlideover = E.slideover({
          title: 'Top Slideover',
          content: '<p>This slideover slides down from the top of the screen.</p><p>Perfect for notification panels or headers.</p>',
          position: 'top',
          size: 'sm'
        });
        currentSlideover.open();
      }
    function demoPositionBottom() {
        currentSlideover = E.slideover({
          title: 'Bottom Slideover',
          content: '<p>This slideover slides up from the bottom of the screen.</p><p>Ideal for shopping carts or action sheets.</p>',
          position: 'bottom',
          size: 'md'
        });
        currentSlideover.open();
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        demoPositionRight();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        demoPositionLeft();
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        demoPositionTop();
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        demoPositionBottom();
    });
}
