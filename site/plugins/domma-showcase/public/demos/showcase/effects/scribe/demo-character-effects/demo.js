/**
 * Demo: Character Effects - from public/showcase/effects/scribe.
 */
export function mount(root) {
        // Store control objects
    let scribe1, scribe2, scribe3, scribe4, scribe5, scribe6;
        // scribe() Demo 2 - Character Effects
    function startScribeEffect(effect) {
          if (scribe2) scribe2.destroy();
          $(root).find('#scribe-demo-2').html('');
          scribe2 = Domma.effects.scribe('#scribe-demo-2', {
            speed: 40,
            respectMotionPreference: false,
            actions: [
              { render: `Effect: ${effect}`, effect: effect }
            ]
          });
        }
    $(root).find('#scribe-effect-none').on('click', () => startScribeEffect('none'));
    $(root).find('#scribe-effect-fade').on('click', () => startScribeEffect('fade'));
    $(root).find('#scribe-effect-bounce').on('click', () => startScribeEffect('bounce'));
    $(root).find('#scribe-effect-glow').on('click', () => startScribeEffect('glow'));
}
