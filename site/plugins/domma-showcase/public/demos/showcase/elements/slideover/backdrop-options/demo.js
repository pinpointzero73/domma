/**
 * Backdrop Options - from public/showcase/elements/slideover.
 */
export function mount(root) {
    let currentSlideover = null;
      // Advanced features
    function demoNoBackdrop() {
        currentSlideover = E.slideover({
          title: 'No Backdrop',
          content: '<p>This slideover has no backdrop overlay.</p><p>The main content remains fully visible and interactive.</p>',
          backdrop: false
        });
        currentSlideover.open();
      }
    function demoBackdropNoClose() {
        currentSlideover = E.slideover({
          title: 'Backdrop, No Close',
          content: '<p>This slideover has a backdrop but you cannot close it by clicking the backdrop.</p><p>You must use the X button to close.</p>',
          backdrop: true,
          backdropClose: false
        });
        currentSlideover.open();
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        demoNoBackdrop();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        demoBackdropNoClose();
    });
}
