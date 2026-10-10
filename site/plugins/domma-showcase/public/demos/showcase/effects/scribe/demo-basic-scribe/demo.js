/**
 * Demo: Basic Scribe - from public/showcase/effects/scribe.
 */
export function mount(root) {
        // Store control objects
    let scribe1, scribe2, scribe3, scribe4, scribe5, scribe6;
        // scribe() Demo 1 - Basic
    $(root).find('#scribe-start-1').on('click', () => {
          if (scribe1) scribe1.destroy();
          $(root).find('#scribe-demo-1').html('');
          scribe1 = Domma.effects.scribe('#scribe-demo-1', {
            speed: 50,
            deleteSpeed: 30,
            respectMotionPreference: false,
            actions: [
              { render: 'Hello, World!' },
              { wait: '2s' },
              { undoRender: 'all' },
              { wait: '500ms' },
              { render: 'Welcome to DommaJS', effect: 'fade' }
            ]
          });
        });
    $(root).find('#scribe-pause-1').on('click', () => {
          if (scribe1) scribe1.pause();
        });
    $(root).find('#scribe-resume-1').on('click', () => {
          if (scribe1) scribe1.resume();
        });
    $(root).find('#scribe-stop-1').on('click', () => {
          if (scribe1) {
            scribe1.stop();
            scribe1 = null;
          }
        });
}
