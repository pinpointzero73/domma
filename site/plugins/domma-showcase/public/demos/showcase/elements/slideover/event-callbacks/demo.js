/**
 * Event Callbacks - from public/showcase/elements/slideover.
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
    function demoNonClosable() {
        currentSlideover = E.slideover({
          title: 'Non-Closable Slideover',
          content: `
                    <p>This slideover has no X button and cannot be closed with the backdrop or Escape key.</p>
                    <p>It must be closed programmatically:</p>
                    <button onclick="currentSlideover.close()" class="btn btn-primary">Close Programmatically</button>
                `,
          closable: false,
          backdropClose: false,
          keyboard: false
        });
        currentSlideover.open();
      }
    function demoCallbacks() {
        const logEl = $(root).find('#callback-log');
        logEl.html('');

        function log(message) {
          const time = D().format('HH:mm:ss');
          logEl.append(`<div>[${time}] ${message}</div>`);
        }

        currentSlideover = E.slideover({
          title: 'Callback Demo',
          content: '<p>Watch the log below for callback messages!</p><p>Try opening and closing this slideover multiple times.</p>',
          onOpen: () => {
            log('🎉 <strong>onOpen</strong> - Slideover opened!');
          },
          onClose: () => {
            log('🔄 <strong>onClose</strong> - Slideover is closing...');
          },
          onClosed: () => {
            log('✅ <strong>onClosed</strong> - Slideover fully closed!');
          }
        });

        log('📝 Slideover created, opening now...');
        currentSlideover.open();
      }
    function demoFormContent() {
        currentSlideover = E.slideover({
          title: 'Contact Form',
          content: `
                    <form id="contact-form" class="p-0">
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Subject</label>
                            <input type="text" name="subject" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Message</label>
                            <textarea name="message" rows="6" class="form-control" required></textarea>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                <span data-icon="send" data-icon-size="16"></span> Send Message
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="currentSlideover.close()">Cancel</button>
                        </div>
                    </form>
                `,
          size: 'md',
          onOpen: () => {
            $(root).find('#contact-form').on('submit', function (e) {
              e.preventDefault();
              E.toast('Form submitted successfully!', {type: 'success'});
              currentSlideover.close();
            });
          }
        });
        currentSlideover.open();
      }
    function demoProgrammatic() {
        currentSlideover = E.slideover({
          title: 'Programmatic Control',
          content: `
                    <p class="mb-4">Use the buttons below to modify this slideover:</p>
                    <div class="d-flex flex-column gap-2 mb-4">
                        <button onclick="currentSlideover.setTitle('🎯 Title Updated!')" class="btn btn-sm btn-outline">Change Title</button>
                        <button onclick="currentSlideover.setContent('<div class=\\'p-4 bg-success text-white rounded\\'><h4>Content Updated!</h4><p>The content was changed dynamically.</p></div>')" class="btn btn-sm btn-outline">Change Content</button>
                        <hr>
                        <button onclick="currentSlideover.setSize('sm')" class="btn btn-sm btn-secondary">Size: Small</button>
                        <button onclick="currentSlideover.setSize('md')" class="btn btn-sm btn-secondary">Size: Medium</button>
                        <button onclick="currentSlideover.setSize('lg')" class="btn btn-sm btn-secondary">Size: Large</button>
                        <button onclick="currentSlideover.setSize('xl')" class="btn btn-sm btn-secondary">Size: XL</button>
                        <hr>
                        <button onclick="currentSlideover.setPosition('left')" class="btn btn-sm btn-primary">Position: Left</button>
                        <button onclick="currentSlideover.setPosition('right')" class="btn btn-sm btn-primary">Position: Right</button>
                        <button onclick="currentSlideover.setPosition('top')" class="btn btn-sm btn-primary">Position: Top</button>
                        <button onclick="currentSlideover.setPosition('bottom')" class="btn btn-sm btn-primary">Position: Bottom</button>
                    </div>
                    <div class="alert alert-info">
                        <strong>Is Open:</strong> <span id="is-open-status" class="font-mono">?</span>
                    </div>
                `,
          position: 'right',
          size: 'md',
          onOpen: () => {
            // Update status every 500ms
            const interval = setInterval(() => {
              const statusEl = $(root).find('#is-open-status')[0];
              if (statusEl && currentSlideover) {
                statusEl.textContent = currentSlideover.isOpen() ? 'true ✅' : 'false ❌';
              } else {
                clearInterval(interval);
              }
            }, 500);
          }
        });
        currentSlideover.open();
      }
}
