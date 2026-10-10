/**
 * Word Mode - from public/showcase/effects/scribe.
 */
export function mount(root) {
    let scribeModeChar, scribeModeWord, scribeModeSentence;
        // Mode Demos - Word Mode
    $(root).find('#scribe-start-mode-word').on('click', () => {
          if (scribeModeWord) scribeModeWord.destroy();
          $(root).find('#scribe-mode-word').html('');
          scribeModeWord = Domma.effects.scribe('#scribe-mode-word', {
            mode: 'word',
            speed: 100,
            respectMotionPreference: false,
            actions: [{ render: 'Welcome to the Domma framework!', effect: 'bounce' }]
          });
        });
}
