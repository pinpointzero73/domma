# Scribe effects follow speed and delete speed

- Stretch a Scribe entrance effect (fade, bounce or glow) to the unit's `speed` when that is slower than the effect's own length, so a slow sentence-by-sentence fade fades in slowly instead of waiting and then snapping in.
- Fade units that came in with an effect back out over `deleteSpeed` when they are undone; the next action waits for the fade to finish. Pause, restart and stop hold or clear a unit mid-fade, and text without an effect still deletes at once.

<!-- website -->
<p>Scribe's fade, bounce and glow now follow the typing and delete speeds, fading text out as well as in.</p>
