/**
 * Demo: Partial Undo - from public/showcase/effects/scribe.
 */
export function mount(root) {
        // Store control objects
    let scribe1, scribe2, scribe3, scribe4, scribe5, scribe6;
        // scribe() Demo 4 - Partial Undo
    $(root).find('#scribe-start-4').on('click', () => {
          if (scribe4) scribe4.destroy();
          $(root).find('#scribe-demo-4').html('');
          scribe4 = Domma.effects.scribe('#scribe-demo-4', {
            speed: 50,
            deleteSpeed: 30,
            respectMotionPreference: false,
            actions: [
              { render: 'Domma Framework', effect: 'fade' },
              { wait: '1s' },
              { undoRender: 9 },  // Delete "Framework"
              { wait: '500ms' },
              { render: 'Effects!', effect: 'glow' },
              { wait: '2s' }
            ]
          });
        });
}
