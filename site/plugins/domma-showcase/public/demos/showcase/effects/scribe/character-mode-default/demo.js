/**
 * Character Mode (default) - from public/showcase/effects/scribe.
 */
export function mount(root) {
    let scribeModeChar, scribeModeWord, scribeModeSentence;
        // Mode Demos - Character Mode
    $(root).find('#scribe-start-mode-char').on('click', () => {
          if (scribeModeChar) scribeModeChar.destroy();
          $(root).find('#scribe-mode-char').html('');
          scribeModeChar = Domma.effects.scribe('#scribe-mode-char', {
            mode: 'typewriter',
            speed: 50,
            respectMotionPreference: false,
            actions: [{ render: 'Hello World!', effect: 'fade' }]
          });
        });
}
