/**
 * Size Variants - from public/showcase/elements/slideover.
 */
export function mount(root) {
    let currentSlideover = null;
      // Size demos
    function demoSizeSmall() {
        currentSlideover = E.slideover({
          title: 'Small Slideover (25%)',
          content: '<p>This is a small slideover, taking up 25% of the screen width.</p>',
          size: 'sm'
        });
        currentSlideover.open();
      }
    function demoSizeMedium() {
        currentSlideover = E.slideover({
          title: 'Medium Slideover (50%)',
          content: '<p>This is a medium slideover, taking up 50% of the screen width.</p>',
          size: 'md'
        });
        currentSlideover.open();
      }
    function demoSizeLarge() {
        currentSlideover = E.slideover({
          title: 'Large Slideover (75%)',
          content: '<p>This is a large slideover, taking up 75% of the screen width.</p>',
          size: 'lg'
        });
        currentSlideover.open();
      }
    function demoSizeXL() {
        currentSlideover = E.slideover({
          title: 'Extra Large Slideover (90%)',
          content: '<p>This is an extra large slideover, taking up 90% of the screen width.</p>',
          size: 'xl'
        });
        currentSlideover.open();
      }
    function demoSizeFull() {
        currentSlideover = E.slideover({
          title: 'Full Slideover (100%)',
          content: '<p>This is a full slideover, taking up 100% of the screen width.</p><p>Acts like a full-screen panel.</p>',
          size: 'full'
        });
        currentSlideover.open();
      }
    function demoSizeCustom() {
        currentSlideover = E.slideover({
          title: 'Custom Size (400px)',
          content: '<p>This slideover has a custom width of exactly 400 pixels.</p><p>You can use px, rem, em, or % for custom sizes.</p>',
          size: '400px'
        });
        currentSlideover.open();
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        demoSizeSmall();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        demoSizeMedium();
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        demoSizeLarge();
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        demoSizeXL();
    });
    $(root).find('[data-action="5"]').on('click', function (event) {
        demoSizeFull();
    });
    $(root).find('[data-action="6"]').on('click', function (event) {
        demoSizeCustom();
    });
}
