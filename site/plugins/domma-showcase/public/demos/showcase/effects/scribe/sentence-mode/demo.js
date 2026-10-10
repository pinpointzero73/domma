/**
 * Sentence Mode - from public/showcase/effects/scribe.
 */
export function mount(root) {
    let scribeModeChar, scribeModeWord, scribeModeSentence;
        // Mode Demos - Sentence Mode
    $(root).find('#scribe-start-mode-sentence').on('click', () => {
          if (scribeModeSentence) scribeModeSentence.destroy();
          $(root).find('#scribe-mode-sentence').html('');
          scribeModeSentence = Domma.effects.scribe('#scribe-mode-sentence', {
            mode: 'sentence',
            speed: 200,
            respectMotionPreference: false,
            actions: [{ render: 'First sentence. Second sentence! Third sentence?', effect: 'fade' }]
          });
        });
}
