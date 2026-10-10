/**
 * Demo: Action Sequence - from public/showcase/effects/scribe.
 */
export function mount(root) {
        // Store control objects
    let scribe1, scribe2, scribe3, scribe4, scribe5, scribe6;
        // scribe() Demo 3 - Action Sequence
    $(root).find('#scribe-start-3').on('click', () => {
          if (scribe3) scribe3.destroy();
          $(root).find('#scribe-demo-3').html('');
          scribe3 = Domma.effects.scribe('#scribe-demo-3', {
            speed: 50,
            deleteSpeed: 30,
            respectMotionPreference: false,
            actions: [
              { render: 'Hello', effect: 'bounce' },
              { wait: '1.5s' },
              { undoRender: true },
              { render: 'Welcome to Domma', effect: 'fade' },
              { wait: '2s' }
            ]
          });
        });
}
