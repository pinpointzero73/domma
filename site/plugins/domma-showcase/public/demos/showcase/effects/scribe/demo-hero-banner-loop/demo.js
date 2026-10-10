/**
 * Demo: Hero Banner Loop - from public/showcase/effects/scribe.
 */
export function mount(root) {
        // Store control objects
    let scribe1, scribe2, scribe3, scribe4, scribe5, scribe6;
        // scribe() Demo 5 - Hero Banner Loop
    $(root).find('#scribe-start-5').on('click', () => {
          if (scribe5) scribe5.destroy();
          $(root).find('#scribe-demo-5').html('');
          scribe5 = Domma.effects.scribe('#scribe-demo-5', {
            speed: 60,
            deleteSpeed: 40,
            loop: true,
            loopDelay: 2000,
            respectMotionPreference: false,
            actions: [
              { render: 'Build Faster', effect: 'bounce' },
              { wait: '2s' },
              { undoRender: 'all' },
              { wait: '500ms' },
              { render: 'Code Smarter', effect: 'fade' },
              { wait: '2s' },
              { undoRender: 'all' },
              { wait: '500ms' },
              { render: 'Ship Better', effect: 'glow' },
              { wait: '2s' },
              { undoRender: 'all' },
              { wait: '500ms' }
            ]
          });
        });
    $(root).find('#scribe-stop-5').on('click', () => {
          if (scribe5) {
            scribe5.stop();
            scribe5 = null;
          }
        });
}
