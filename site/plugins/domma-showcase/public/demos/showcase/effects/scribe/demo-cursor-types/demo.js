/**
 * Demo: Cursor Types - from public/showcase/effects/scribe.
 */
export function mount(root) {
        // Store control objects
    let scribe1, scribe2, scribe3, scribe4, scribe5, scribe6;
        // scribe() Demo 6 - Cursor Types
    function startCursorDemo(cursorType, cursorChar, cursorBlink = true) {
          if (scribe6) scribe6.destroy();
          $(root).find('#scribe-demo-6').html('');
          scribe6 = Domma.effects.scribe('#scribe-demo-6', {
            speed: 50,
            cursorType: cursorType,
            cursorChar: cursorChar,
            cursorBlink: cursorBlink,
            respectMotionPreference: false,
            actions: [
              { render: 'Cursor type: ' + cursorType }
            ]
          });
        }
    $(root).find('#scribe-cursor-caret').on('click', () => startCursorDemo('caret', '|'));
    $(root).find('#scribe-cursor-block').on('click', () => startCursorDemo('block', '█'));
    $(root).find('#scribe-cursor-underline').on('click', () => startCursorDemo('underline', '_'));
    $(root).find('#scribe-cursor-noblink').on('click', () => startCursorDemo('caret', '|', false));
}
