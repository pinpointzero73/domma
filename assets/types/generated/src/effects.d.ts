/**
 * Domma Effects Module
 * Visual effects and animations for UI elements
 *
 * @module effects
 */
/**
 * What an effect is applied to: a CSS selector, an element, a NodeList or an array of elements.
 * @typedef {string|Element|NodeList|HTMLElement[]} Selector
 */
/**
 * The control object every effect returns. Effects without a running state (reveal, ripple)
 * implement pause/resume as no-ops.
 * @typedef {object} EffectControl
 * @property {() => void} pause - Pause the effect
 * @property {() => void} resume - Resume the effect
 * @property {() => void} stop - Stop the effect
 * @property {() => void} restart - Restart the effect from the beginning
 * @property {() => void} destroy - Destroy the effect and clean up all resources
 * @property {() => boolean} isRunning - Check if the effect is currently running
 * @property {() => boolean} isPaused - Check if the effect is paused
 */
/**
 * One step of a scribe action queue: render text, wait, or delete what was rendered.
 * @typedef {object} ScribeAction
 * @property {string} [render] - Text to type
 * @property {'none'|'fade'|'bounce'|'glow'} [effect] - Entrance effect for each rendered unit (default: 'none')
 * @property {string|number} [wait] - Pause: '2s', '500ms' or a number of milliseconds
 * @property {boolean|number|'all'} [undoRender] - Delete text: true = the last render, a number = that many units, 'all' = everything
 */
/**
 * A palette name (see EFFECT_PALETTES; 'theme' reads the active Domma theme's colours) or an
 * array of CSS colour strings.
 * @typedef {'theme'|'rainbow'|'festive'|'gold'|'silver'|'pastel'|'mono'|'sunset'|'ocean'|'forest'|'bridal'|'meadow'|'firefly'|'aqua'|'autumn'|string[]} TickerTapePalette
 */
/**
 * Options for `Domma.effects.breathe()`.
 * @typedef {object} BreatheOptions
 * @property {number} [amplitude] - Vertical movement distance in pixels (default: 6)
 * @property {number} [duration] - Complete animation cycle time in milliseconds (default: 3000)
 * @property {string} [easing] - CSS easing function (default: 'ease-in-out')
 * @property {number} [delay] - Initial delay before animation starts in milliseconds (default: 0)
 * @property {number} [stagger] - Delay between multiple elements in milliseconds (default: 0)
 * @property {number|'infinite'} [iterations] - Number of cycles or 'infinite' (default: 'infinite')
 * @property {boolean} [pauseOnHover] - Pause animation when hovering (default: false)
 * @property {boolean} [autoStart] - Start animation immediately (default: true)
 * @property {boolean} [respectMotionPreference] - Honor prefers-reduced-motion (default: true)
 * @property {() => void} [onStart] - Callback when animation starts
 * @property {() => void} [onComplete] - Callback when animation completes
 */
/**
 * Options for `Domma.effects.pulse()`.
 * @typedef {object} PulseOptions
 * @property {number} [scale] - Scale factor (e.g., 1.05 = 5% larger) (default: 1.05)
 * @property {number} [duration] - Complete animation cycle time in milliseconds (default: 2000)
 * @property {string} [easing] - CSS easing function (default: 'ease-in-out')
 * @property {number} [delay] - Initial delay before animation starts (default: 0)
 * @property {number} [stagger] - Delay between multiple elements (default: 0)
 * @property {number|'infinite'} [iterations] - Number of cycles or 'infinite' (default: 'infinite')
 * @property {boolean} [pauseOnHover] - Pause animation when hovering (default: false)
 * @property {boolean} [respectMotionPreference] - Honor prefers-reduced-motion (default: true)
 */
/**
 * Options for `Domma.effects.scribe()`.
 * @typedef {object} ScribeOptions
 * @property {'typewriter'|'word'|'sentence'} [mode] - Rendering granularity: 'typewriter' (char-by-char), 'word', or 'sentence' (default: 'typewriter')
 * @property {number} [speed] - Milliseconds per unit when typing (default: 50)
 * @property {number} [deleteSpeed] - Milliseconds per unit when deleting (default: 30)
 * @property {boolean} [cursor] - Show blinking cursor (default: true)
 * @property {string} [cursorChar] - Cursor character (default: '|')
 * @property {boolean} [cursorBlink] - Animate cursor blink (default: true)
 * @property {'caret'|'block'|'underline'} [cursorType] - Cursor style (default: 'caret')
 * @property {boolean|number} [loop] - Loop count: true = infinite, number = specific count (default: false)
 * @property {number} [loopDelay] - Delay between loops in milliseconds (default: 1000)
 * @property {boolean} [pauseOnHover] - Pause animation when hovering (default: false)
 * @property {boolean} [autoStart] - Start animation immediately (default: true)
 * @property {boolean} [respectMotionPreference] - Honor prefers-reduced-motion (default: true)
 * @property {ScribeAction[]} [actions] - Action queue to execute
 * @property {() => void} [onStart] - Callback when animation starts
 * @property {() => void} [onComplete] - Callback when animation completes
 * @property {(unit: string, index: number) => void} [onCharacter] - Callback for each unit rendered (unit, index) - unit can be char/word/sentence depending on mode
 * @property {(text: string) => void} [onRender] - Callback when render action completes (text)
 * @property {(deletedText: string) => void} [onUndoRender] - Callback when undoRender action completes (deletedText)
 * @property {(loopCount: number) => void} [onLoop] - Callback on each loop iteration (loopCount)
 */
/**
 * Options for `Domma.effects.reveal()`.
 * @typedef {object} RevealOptions
 * @property {'fade'|'slide-up'|'slide-down'|'slide-left'|'slide-right'|'zoom'|'flip'} [animation] - Animation type: 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom', 'flip' (default: 'fade')
 * @property {number} [duration] - Animation duration in ms (default: 600)
 * @property {string} [easing] - CSS easing function (default: 'ease-out')
 * @property {number} [delay] - Delay before animation in ms (default: 0)
 * @property {number} [stagger] - Delay between multiple elements in ms (default: 0)
 * @property {number} [threshold] - IntersectionObserver threshold 0-1 (default: 0.1)
 * @property {string} [rootMargin] - Observer root margin (default: '0px')
 * @property {boolean} [once] - Only animate once (default: true)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 * @property {(element: Element) => void} [onReveal] - Callback per element when revealed
 */
/**
 * Options for `Domma.effects.scramble()`.
 * @typedef {object} ScrambleOptions
 * @property {number} [speed] - Ms per character resolve (default: 50)
 * @property {number} [scrambleSpeed] - Ms between scramble frame updates (default: 30)
 * @property {string} [characters] - Character pool for scramble (default: alphanumeric + symbols)
 * @property {'left-to-right'|'right-to-left'|'random'|'center-out'} [revealOrder] - 'left-to-right', 'right-to-left', 'random', 'center-out' (default: 'left-to-right')
 * @property {number} [scrambleDuration] - How long each char scrambles before resolving in ms (default: 800)
 * @property {number} [stagger] - Delay between multiple elements in ms (default: 0)
 * @property {boolean|number} [loop] - false, true (infinite), or number of loops (default: false)
 * @property {number} [loopDelay] - Ms between loops (default: 2000)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 * @property {() => void} [onComplete] - Callback when animation completes
 * @property {(char: string, index: number) => void} [onCharacter] - Callback per character resolved (char, index)
 */
/**
 * Options for `Domma.effects.counter()`.
 * @typedef {object} CounterOptions
 * @property {number} [from] - Start value (default: 0)
 * @property {number|null} [to] - End value (required, or reads from element textContent)
 * @property {number} [duration] - Total count duration in ms (default: 2000)
 * @property {'linear'|'ease-out'|'ease-in-out'} [easing] - 'linear', 'ease-out', 'ease-in-out' (default: 'ease-out')
 * @property {number} [decimals] - Decimal places (default: 0)
 * @property {string} [separator] - Thousands separator (default: ',')
 * @property {string} [prefix] - Text before number (default: '')
 * @property {string} [suffix] - Text after number (default: '')
 * @property {number} [stagger] - Delay between multiple elements in ms (default: 0)
 * @property {'immediate'|'scroll'} [trigger] - 'immediate' or 'scroll' (default: 'immediate')
 * @property {number} [threshold] - Observer threshold when trigger is scroll (default: 0.5)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 * @property {(currentValue: number) => void} [onUpdate] - Callback on each frame (currentValue)
 * @property {() => void} [onComplete] - Callback when counting completes
 */
/**
 * Options for `Domma.effects.ripple()`.
 * @typedef {object} RippleOptions
 * @property {string} [colour] - Ripple colour (default: 'rgba(255, 255, 255, 0.35)')
 * @property {number} [duration] - Ripple animation duration in ms (default: 600)
 * @property {number} [opacity] - Starting opacity (default: 0.35)
 * @property {boolean} [unbounded] - Allow ripple to overflow element (default: false)
 * @property {boolean} [centered] - Always ripple from centre (default: false)
 * @property {'click'|'mousedown'|'pointerdown'} [trigger] - 'click', 'mousedown', 'pointerdown' (default: 'pointerdown')
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 */
/**
 * Options for `Domma.effects.shake()`.
 * @typedef {object} ShakeOptions
 * @property {number} [intensity] - Shake distance in px (default: 6)
 * @property {number} [duration] - Total shake duration in ms (default: 500)
 * @property {'horizontal'|'vertical'|'both'} [direction] - 'horizontal', 'vertical', 'both' (default: 'horizontal')
 * @property {string} [easing] - CSS easing function (default: 'ease-in-out')
 * @property {number} [iterations] - Number of shake cycles (default: 1)
 * @property {number} [stagger] - Delay between elements in ms (default: 0)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 * @property {() => void} [onComplete] - Callback when shake completes
 */
/**
 * Options for `Domma.effects.twinkle()`.
 * @typedef {object} TwinkleOptions
 * @property {number} [count] - Number of stars (default: 100)
 * @property {number} [minSize] - Minimum star size in pixels (default: 1)
 * @property {number} [maxSize] - Maximum star size in pixels (default: 3)
 * @property {number} [twinkleSpeed] - Base oscillation speed (default: 0.003)
 * @property {string} [colour] - Star colour (default: 'rgba(255, 240, 200, 1)')
 * @property {number} [zIndex] - Canvas z-index (default: 1)
 * @property {'star'|'circle'} [shape] - Star shape; 'star' draws a 4-pointed star, 'circle' draws a dot (default: 'star')
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 */
/**
 * Options for `Domma.effects.tickerTape()`.
 * @typedef {object} TickerTapeOptions
 * @property {TickerTapePalette} [palette] - Named theme palette (e.g. 'theme', 'rainbow', 'gold', 'silver', 'festive', 'pastel', 'mono') or a custom array of CSS colour strings (default: 'theme')
 * @property {number} [density] - Average strips on screen at any moment (default: 50)
 * @property {number} [speed] - Fall speed multiplier (1 = default) (default: 1)
 * @property {number} [sway] - Horizontal sway amplitude in pixels (default: 60)
 * @property {number} [rotationSpeed] - Max rotation degrees per frame (default: 6)
 * @property {number} [minWidth] - Minimum strip width in pixels (default: 5)
 * @property {number} [maxWidth] - Maximum strip width in pixels (default: 9)
 * @property {number} [minHeight] - Minimum strip height in pixels (default: 12)
 * @property {number} [maxHeight] - Maximum strip height in pixels (default: 22)
 * @property {number} [fadeStart] - Fraction of fall (0-1) before fade begins (default: 0.55)
 * @property {boolean} [burst] - If true, drops a single batch and stops respawning (default: false)
 * @property {number} [burstCount] - Strips emitted in burst mode (default: 150)
 * @property {number} [zIndex] - Canvas stacking order (default: 1)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 */
/**
 * Options for `Domma.effects.butterflies()`.
 * @typedef {object} ButterfliesOptions
 * @property {TickerTapePalette} [palette] - Named palette (e.g. 'meadow', 'firefly', 'aqua', 'autumn' or any ticker-tape palette) or a custom array of CSS colour strings (default: 'meadow')
 * @property {number} [density] - Target butterflies on screen at once (default: 18)
 * @property {number} [speed] - Global speed multiplier (default: 1)
 * @property {number} [wander] - Steering erraticness (default: 1)
 * @property {number} [riseSpeed] - Upward drift bias (default: 0.4)
 * @property {number} [flapSpeed] - Wingbeat rate multiplier (default: 1)
 * @property {number} [minSize] - Minimum wingspan in pixels (default: 14)
 * @property {number} [maxSize] - Maximum wingspan in pixels (default: 26)
 * @property {boolean} [twoTone] - Use two palette colours per butterfly (default: true)
 * @property {boolean} [burst] - Release one batch then settle (default: false)
 * @property {number} [burstCount] - Butterflies released in burst mode (default: 40)
 * @property {number} [zIndex] - Canvas stacking order (default: 1)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 */
/**
 * Options for `Domma.effects.strobe()`.
 * @typedef {object} StrobeOptions
 * @property {'club'|'concert'|'police'|'searchlight'|'scanner'|'mood'} [preset] - Named preset (club|concert|police|searchlight|scanner|mood). Individual options override the preset. (default: 'club')
 * @property {Array<'tl'|'tr'|'bl'|'br'>} [origins] - Corners beams emit from: any of 'tl','tr','bl','br'
 * @property {'sweep'|'rotate'} [motion] - 'sweep' (fan back and forth) or 'rotate' (full circle)
 * @property {number} [sweepArc] - Degrees a beam fans across in sweep mode
 * @property {number} [speed] - Sweep/rotation speed multiplier
 * @property {number} [beamWidth] - Angular width of each beam cone in degrees
 * @property {boolean} [flicker] - Blink beams on/off (the strobe character)
 * @property {number} [hz] - Flicker rate in flashes/sec (warns above 5)
 * @property {string[]} [colours] - Beam colours, assigned per beam in order
 * @property {number} [intensity] - Beam brightness 0-1
 * @property {number|null} [duration] - Auto-stop after N ms (default: null)
 * @property {number} [zIndex] - Canvas stacking order (default: 9999)
 * @property {boolean} [respectMotionPreference] - Honour prefers-reduced-motion (default: true)
 */
/**
 * The effects module (`Domma.effects`).
 * @typedef {object} Effects
 * @property {typeof breathe} breathe - Sinusoidal floating animation
 * @property {typeof pulse} pulse - Pulsing scale animation
 * @property {typeof scribe} scribe - Text animation with configurable granularity (characters, words, or sentences) and action queue
 * @property {typeof reveal} reveal - Scroll-triggered entrance animations using IntersectionObserver
 * @property {typeof scramble} scramble - Text cipher/decode animation
 * @property {typeof counter} counter - Animated number counting with easing and formatting
 * @property {typeof ripple} ripple - Material Design click ripple effect
 * @property {typeof shake} shake - Attention/error shake animation
 * @property {typeof twinkle} twinkle - Canvas-based twinkling stars animation
 * @property {typeof tickerTape} tickerTape - Canvas-based ticker-tape parade - colourful rectangles fall, sway, rotate, and fade
 * @property {typeof butterflies} butterflies - Canvas-based fluttering butterflies
 * @property {typeof strobe} strobe - Stage-lighting beams sweeping from the corners
 */
/**
 * Apply a sinusoidal breathing animation to elements
 * Creates a gentle up-and-down floating motion
 *
 * @param {Selector} selector - Element(s) to animate
 * @param {BreatheOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy() methods
 *
 * @example
 * // Simple usage
 * Domma.effects.breathe('.stat-card');
 *
 * @example
 * // With configuration
 * const breathe = Domma.effects.breathe('.notification', {
 *   amplitude: 8,
 *   duration: 2000,
 *   pauseOnHover: true,
 *   stagger: 100
 * });
 *
 * // Control the animation
 * breathe.pause();
 * breathe.resume();
 * breathe.stop();
 */
export function breathe(selector: Selector, options?: BreatheOptions): EffectControl | null;
/**
 * Apply a pulsing scale animation to elements
 * Creates a grow-and-shrink breathing effect
 *
 * @param {Selector} selector - Element(s) to animate
 * @param {PulseOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy() methods
 *
 * @example
 * // Simple usage
 * Domma.effects.pulse('.badge');
 *
 * @example
 * // With configuration
 * Domma.effects.pulse('.notification-dot', {
 *   scale: 1.2,
 *   duration: 1500
 * });
 */
export function pulse(selector: Selector, options?: PulseOptions): EffectControl | null;
/**
 * Parse a wait duration for a scribe action: '2s', '500ms', or a raw number
 * of milliseconds. Anything unreadable is 0.
 *
 * 'ms' MUST be tested before 's', because 'ms' also ends with 's'. Checking
 * 's' first makes the 'ms' branch unreachable and multiplies every
 * millisecond value by 1000 - a '300ms' wait became five minutes.
 *
 * @param {string|number} value
 * @returns {number} milliseconds
 */
export function parseWait(value: string | number): number;
/**
 * Apply a scribe effect to elements
 * Types text with configurable granularity (characters, words, or sentences) and optional entrance effects
 *
 * @param {Selector} selector - Element(s) to animate
 * @param {ScribeOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy() methods
 *
 * @example
 * // Simple usage (character mode)
 * Domma.effects.scribe('.hero-title', {
 *   mode: 'typewriter',
 *   actions: [
 *     { render: 'Hello, World!', effect: 'bounce' }
 *   ]
 * });
 *
 * @example
 * // Word-by-word rendering
 * Domma.effects.scribe('.demo', {
 *   mode: 'word',
 *   actions: [
 *     { render: 'Welcome to Domma', effect: 'fade' }
 *   ]
 * });
 *
 * @example
 * // Complex sequence with undo
 * const scribe = Domma.effects.scribe('.demo', {
 *   mode: 'typewriter',
 *   speed: 50,
 *   actions: [
 *     { render: 'Hello', effect: 'fade' },
 *     { wait: '2s' },
 *     { undoRender: true },
 *     { render: 'Welcome to Domma', effect: 'bounce' },
 *     { wait: '3s' }
 *   ],
 *   loop: true
 * });
 */
export function scribe(selector: Selector, options?: ScribeOptions): EffectControl | null;
/**
 * Scroll-triggered entrance animations using IntersectionObserver
 * Elements animate into view when they enter the viewport.
 *
 * @param {Selector} selector - Element(s) to animate
 * @param {RevealOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with destroy() method
 *
 * @example
 * // Simple fade-in on scroll
 * Domma.effects.reveal('.card');
 *
 * @example
 * // Slide up with stagger
 * Domma.effects.reveal('.feature', {
 *   animation: 'slide-up',
 *   duration: 800,
 *   stagger: 100
 * });
 */
export function reveal(selector: Selector, options?: RevealOptions): EffectControl | null;
/**
 * Text cipher/decode animation
 * Characters cycle through random glyphs before settling on the correct character.
 *
 * @param {Selector} selector - Element(s) to animate
 * @param {ScrambleOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy() methods
 *
 * @example
 * Domma.effects.scramble('.hero-title');
 *
 * @example
 * Domma.effects.scramble('.heading', {
 *   scrambleDuration: 1200,
 *   revealOrder: 'random',
 *   loop: true,
 *   loopDelay: 3000
 * });
 */
export function scramble(selector: Selector, options?: ScrambleOptions): EffectControl | null;
/**
 * Animated number counting effect
 * Smoothly counts from one number to another with easing.
 *
 * @param {Selector} selector - Element(s) to animate
 * @param {CounterOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy() methods
 *
 * @example
 * // Count from 0 to value in element
 * Domma.effects.counter('.stat-number');
 *
 * @example
 * // Count with formatting
 * Domma.effects.counter('.revenue', {
 *   from: 0,
 *   to: 1250000,
 *   duration: 3000,
 *   separator: ',',
 *   prefix: '$',
 *   decimals: 2
 * });
 */
export function counter(selector: Selector, options?: CounterOptions): EffectControl | null;
/**
 * Material Design click ripple effect
 * Adds a circular wave effect emanating from click/touch point.
 *
 * @param {Selector} selector - Element(s) to add ripple to
 * @param {RippleOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with destroy() method
 *
 * @example
 * // Add ripple to buttons
 * Domma.effects.ripple('.btn');
 *
 * @example
 * // Custom colour ripple
 * Domma.effects.ripple('.card', {
 *   colour: 'rgba(59, 130, 246, 0.3)',
 *   duration: 800
 * });
 */
export function ripple(selector: Selector, options?: RippleOptions): EffectControl | null;
/**
 * Attention/error shake animation
 * Quick shake animation for invalid inputs or attention-grabbing.
 *
 * @param {Selector} selector - Element(s) to shake
 * @param {ShakeOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with stop(), restart(), destroy() methods
 *
 * @example
 * // Shake an invalid input
 * Domma.effects.shake('#email-input');
 *
 * @example
 * // Vertical shake with multiple iterations
 * Domma.effects.shake('.alert', {
 *   direction: 'vertical',
 *   intensity: 4,
 *   iterations: 2,
 *   onComplete: () => console.log('Shake done')
 * });
 */
export function shake(selector: Selector, options?: ShakeOptions): EffectControl | null;
/**
 * Canvas-based twinkling stars animation
 * Creates an ambient starfield effect, either as a full-page fixed overlay or scoped to a container element
 *
 * @param {Selector|null} selector - CSS selector, Element, or null/'body' for full-page mode
 * @param {TwinkleOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy(), isRunning(), isPaused()
 *
 * @example
 * // Full-page overlay (matches splash page behaviour)
 * const stars = Domma.effects.twinkle(null);
 *
 * @example
 * // Container-scoped stars
 * const stars = Domma.effects.twinkle('#hero-section', {
 *   count: 60,
 *   colour: 'rgba(200, 230, 255, 0.9)',
 *   shape: 'circle'
 * });
 *
 * // Control methods
 * stars.pause();
 * stars.resume();
 * stars.destroy();
 */
export function twinkle(selector: Selector | null, options?: TwinkleOptions): EffectControl | null;
/**
 * Ticker tape effect - colourful rectangular strips drop from the top of a
 * container (or the viewport), spinning, swaying, and fading as they fall.
 * Reminiscent of a ticker-tape parade. Pass `null` (or omit the selector)
 * for a full-page fixed overlay, or provide a selector to scope strips
 * inside a specific container.
 *
 * @param {Selector|null} selector
 * @param {TickerTapeOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy(), isRunning(), isPaused()
 *
 * @example
 * // Full-page overlay using current theme colours
 * Domma.effects.tickerTape(null);
 *
 * @example
 * // Container-scoped, festive palette, slower fall
 * Domma.effects.tickerTape('#celebration', {
 *   palette: 'festive',
 *   density: 60,
 *   speed: 0.7
 * });
 *
 * @example
 * // One-shot burst (parade arrives, then settles)
 * Domma.effects.tickerTape('#stage', { burst: true, burstCount: 200 });
 */
export function tickerTape(selector: Selector | null, options?: TickerTapeOptions): EffectControl | null;
/**
 * Butterflies effect - procedurally drawn butterflies wander and rise with
 * flapping wings. Pass `null` (or omit the selector) for a full-page fixed
 * overlay, or a selector to scope them inside a container.
 *
 * @param {Selector|null} selector
 * @param {ButterfliesOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy(), isRunning(), isPaused()
 *
 * @example
 * Domma.effects.butterflies(null);                       // full-page meadow
 * Domma.effects.butterflies('#hero', { palette: 'pastel', density: 24 });
 * Domma.effects.butterflies('#card', { burst: true, burstCount: 30 });
 */
export function butterflies(selector: Selector | null, options?: ButterfliesOptions): EffectControl | null;
/**
 * Resolve a strobe-lighting preset name to its option bundle.
 * Unknown names warn and fall back to 'club'.
 * @param {string} name
 * @returns {StrobeOptions}
 */
export function resolveStrobePreset(name: string): StrobeOptions;
/**
 * Strobe lighting effect - light beams emanate from the chosen corners, sweep
 * (or rotate), and brighten where they cross (additive blending). Pass `null`
 * for a full-page overlay, or a selector for a container-scoped rig.
 *
 * Safety: disabled entirely under prefers-reduced-motion. The `flicker` rate
 * (`hz`) is not clamped, but a console warning fires above 5 Hz since rapid
 * flashing can trigger photosensitive seizures.
 *
 * @param {Selector|null} selector
 * @param {StrobeOptions} [options] - Configuration options
 * @returns {EffectControl|null} Control object with pause(), resume(), stop(), restart(), destroy(), isRunning(), isPaused()
 *
 * @example
 * Domma.effects.strobe(null);                                  // full-page club lighting
 * Domma.effects.strobe('#stage', { preset: 'police' });
 * Domma.effects.strobe(null, { preset: 'club', flicker: false, colours: ['#fff'] });
 */
export function strobe(selector: Selector | null, options?: StrobeOptions): EffectControl | null;
/**
 * Resolve a palette specifier into an array of CSS colour strings.
 * - Named keys ('meadow', 'rainbow', …) → preset palette.
 * - 'theme' → reads CSS custom properties from the active Domma theme.
 * - Array → returned as-is.
 *
 * @param {string|string[]} spec
 * @returns {string[]}
 */
export function resolvePalette(spec: string | string[]): string[];
/**
 * Strobe-lighting presets: name -> option bundle.
 * @type {Record<'club'|'concert'|'police'|'searchlight'|'scanner'|'mood', StrobeOptions>}
 */
export const STROBE_PRESETS: Record<"club" | "concert" | "police" | "searchlight" | "scanner" | "mood", StrobeOptions>;
/**
 * Named colour palettes for tickerTape and butterflies: name -> CSS colours.
 * @type {Record<string, string[]>}
 */
export const EFFECT_PALETTES: Record<string, string[]>;
declare const _default: Effects;
export default _default;
/**
 * What an effect is applied to: a CSS selector, an element, a NodeList or an array of elements.
 */
export type Selector = string | Element | NodeList | HTMLElement[];
/**
 * The control object every effect returns. Effects without a running state (reveal, ripple)
 * implement pause/resume as no-ops.
 */
export type EffectControl = {
    /**
     * - Pause the effect
     */
    pause: () => void;
    /**
     * - Resume the effect
     */
    resume: () => void;
    /**
     * - Stop the effect
     */
    stop: () => void;
    /**
     * - Restart the effect from the beginning
     */
    restart: () => void;
    /**
     * - Destroy the effect and clean up all resources
     */
    destroy: () => void;
    /**
     * - Check if the effect is currently running
     */
    isRunning: () => boolean;
    /**
     * - Check if the effect is paused
     */
    isPaused: () => boolean;
};
/**
 * One step of a scribe action queue: render text, wait, or delete what was rendered.
 */
export type ScribeAction = {
    /**
     * - Text to type
     */
    render?: string;
    /**
     * - Entrance effect for each rendered unit (default: 'none')
     */
    effect?: "none" | "fade" | "bounce" | "glow";
    /**
     * - Pause: '2s', '500ms' or a number of milliseconds
     */
    wait?: string | number;
    /**
     * - Delete text: true = the last render, a number = that many units, 'all' = everything
     */
    undoRender?: boolean | number | "all";
};
/**
 * A palette name (see EFFECT_PALETTES; 'theme' reads the active Domma theme's colours) or an
 * array of CSS colour strings.
 */
export type TickerTapePalette = "theme" | "rainbow" | "festive" | "gold" | "silver" | "pastel" | "mono" | "sunset" | "ocean" | "forest" | "bridal" | "meadow" | "firefly" | "aqua" | "autumn" | string[];
/**
 * Options for `Domma.effects.breathe()`.
 */
export type BreatheOptions = {
    /**
     * - Vertical movement distance in pixels (default: 6)
     */
    amplitude?: number;
    /**
     * - Complete animation cycle time in milliseconds (default: 3000)
     */
    duration?: number;
    /**
     * - CSS easing function (default: 'ease-in-out')
     */
    easing?: string;
    /**
     * - Initial delay before animation starts in milliseconds (default: 0)
     */
    delay?: number;
    /**
     * - Delay between multiple elements in milliseconds (default: 0)
     */
    stagger?: number;
    /**
     * - Number of cycles or 'infinite' (default: 'infinite')
     */
    iterations?: number | "infinite";
    /**
     * - Pause animation when hovering (default: false)
     */
    pauseOnHover?: boolean;
    /**
     * - Start animation immediately (default: true)
     */
    autoStart?: boolean;
    /**
     * - Honor prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
    /**
     * - Callback when animation starts
     */
    onStart?: () => void;
    /**
     * - Callback when animation completes
     */
    onComplete?: () => void;
};
/**
 * Options for `Domma.effects.pulse()`.
 */
export type PulseOptions = {
    /**
     * - Scale factor (e.g., 1.05 = 5% larger) (default: 1.05)
     */
    scale?: number;
    /**
     * - Complete animation cycle time in milliseconds (default: 2000)
     */
    duration?: number;
    /**
     * - CSS easing function (default: 'ease-in-out')
     */
    easing?: string;
    /**
     * - Initial delay before animation starts (default: 0)
     */
    delay?: number;
    /**
     * - Delay between multiple elements (default: 0)
     */
    stagger?: number;
    /**
     * - Number of cycles or 'infinite' (default: 'infinite')
     */
    iterations?: number | "infinite";
    /**
     * - Pause animation when hovering (default: false)
     */
    pauseOnHover?: boolean;
    /**
     * - Honor prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
};
/**
 * Options for `Domma.effects.scribe()`.
 */
export type ScribeOptions = {
    /**
     * - Rendering granularity: 'typewriter' (char-by-char), 'word', or 'sentence' (default: 'typewriter')
     */
    mode?: "typewriter" | "word" | "sentence";
    /**
     * - Milliseconds per unit when typing (default: 50)
     */
    speed?: number;
    /**
     * - Milliseconds per unit when deleting (default: 30)
     */
    deleteSpeed?: number;
    /**
     * - Show blinking cursor (default: true)
     */
    cursor?: boolean;
    /**
     * - Cursor character (default: '|')
     */
    cursorChar?: string;
    /**
     * - Animate cursor blink (default: true)
     */
    cursorBlink?: boolean;
    /**
     * - Cursor style (default: 'caret')
     */
    cursorType?: "caret" | "block" | "underline";
    /**
     * - Loop count: true = infinite, number = specific count (default: false)
     */
    loop?: boolean | number;
    /**
     * - Delay between loops in milliseconds (default: 1000)
     */
    loopDelay?: number;
    /**
     * - Pause animation when hovering (default: false)
     */
    pauseOnHover?: boolean;
    /**
     * - Start animation immediately (default: true)
     */
    autoStart?: boolean;
    /**
     * - Honor prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
    /**
     * - Action queue to execute
     */
    actions?: ScribeAction[];
    /**
     * - Callback when animation starts
     */
    onStart?: () => void;
    /**
     * - Callback when animation completes
     */
    onComplete?: () => void;
    /**
     * - Callback for each unit rendered (unit, index) - unit can be char/word/sentence depending on mode
     */
    onCharacter?: (unit: string, index: number) => void;
    /**
     * - Callback when render action completes (text)
     */
    onRender?: (text: string) => void;
    /**
     * - Callback when undoRender action completes (deletedText)
     */
    onUndoRender?: (deletedText: string) => void;
    /**
     * - Callback on each loop iteration (loopCount)
     */
    onLoop?: (loopCount: number) => void;
};
/**
 * Options for `Domma.effects.reveal()`.
 */
export type RevealOptions = {
    /**
     * - Animation type: 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom', 'flip' (default: 'fade')
     */
    animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom" | "flip";
    /**
     * - Animation duration in ms (default: 600)
     */
    duration?: number;
    /**
     * - CSS easing function (default: 'ease-out')
     */
    easing?: string;
    /**
     * - Delay before animation in ms (default: 0)
     */
    delay?: number;
    /**
     * - Delay between multiple elements in ms (default: 0)
     */
    stagger?: number;
    /**
     * - IntersectionObserver threshold 0-1 (default: 0.1)
     */
    threshold?: number;
    /**
     * - Observer root margin (default: '0px')
     */
    rootMargin?: string;
    /**
     * - Only animate once (default: true)
     */
    once?: boolean;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
    /**
     * - Callback per element when revealed
     */
    onReveal?: (element: Element) => void;
};
/**
 * Options for `Domma.effects.scramble()`.
 */
export type ScrambleOptions = {
    /**
     * - Ms per character resolve (default: 50)
     */
    speed?: number;
    /**
     * - Ms between scramble frame updates (default: 30)
     */
    scrambleSpeed?: number;
    /**
     * - Character pool for scramble (default: alphanumeric + symbols)
     */
    characters?: string;
    /**
     * - 'left-to-right', 'right-to-left', 'random', 'center-out' (default: 'left-to-right')
     */
    revealOrder?: "left-to-right" | "right-to-left" | "random" | "center-out";
    /**
     * - How long each char scrambles before resolving in ms (default: 800)
     */
    scrambleDuration?: number;
    /**
     * - Delay between multiple elements in ms (default: 0)
     */
    stagger?: number;
    /**
     * - false, true (infinite), or number of loops (default: false)
     */
    loop?: boolean | number;
    /**
     * - Ms between loops (default: 2000)
     */
    loopDelay?: number;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
    /**
     * - Callback when animation completes
     */
    onComplete?: () => void;
    /**
     * - Callback per character resolved (char, index)
     */
    onCharacter?: (char: string, index: number) => void;
};
/**
 * Options for `Domma.effects.counter()`.
 */
export type CounterOptions = {
    /**
     * - Start value (default: 0)
     */
    from?: number;
    /**
     * - End value (required, or reads from element textContent)
     */
    to?: number | null;
    /**
     * - Total count duration in ms (default: 2000)
     */
    duration?: number;
    /**
     * - 'linear', 'ease-out', 'ease-in-out' (default: 'ease-out')
     */
    easing?: "linear" | "ease-out" | "ease-in-out";
    /**
     * - Decimal places (default: 0)
     */
    decimals?: number;
    /**
     * - Thousands separator (default: ',')
     */
    separator?: string;
    /**
     * - Text before number (default: '')
     */
    prefix?: string;
    /**
     * - Text after number (default: '')
     */
    suffix?: string;
    /**
     * - Delay between multiple elements in ms (default: 0)
     */
    stagger?: number;
    /**
     * - 'immediate' or 'scroll' (default: 'immediate')
     */
    trigger?: "immediate" | "scroll";
    /**
     * - Observer threshold when trigger is scroll (default: 0.5)
     */
    threshold?: number;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
    /**
     * - Callback on each frame (currentValue)
     */
    onUpdate?: (currentValue: number) => void;
    /**
     * - Callback when counting completes
     */
    onComplete?: () => void;
};
/**
 * Options for `Domma.effects.ripple()`.
 */
export type RippleOptions = {
    /**
     * - Ripple colour (default: 'rgba(255, 255, 255, 0.35)')
     */
    colour?: string;
    /**
     * - Ripple animation duration in ms (default: 600)
     */
    duration?: number;
    /**
     * - Starting opacity (default: 0.35)
     */
    opacity?: number;
    /**
     * - Allow ripple to overflow element (default: false)
     */
    unbounded?: boolean;
    /**
     * - Always ripple from centre (default: false)
     */
    centered?: boolean;
    /**
     * - 'click', 'mousedown', 'pointerdown' (default: 'pointerdown')
     */
    trigger?: "click" | "mousedown" | "pointerdown";
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
};
/**
 * Options for `Domma.effects.shake()`.
 */
export type ShakeOptions = {
    /**
     * - Shake distance in px (default: 6)
     */
    intensity?: number;
    /**
     * - Total shake duration in ms (default: 500)
     */
    duration?: number;
    /**
     * - 'horizontal', 'vertical', 'both' (default: 'horizontal')
     */
    direction?: "horizontal" | "vertical" | "both";
    /**
     * - CSS easing function (default: 'ease-in-out')
     */
    easing?: string;
    /**
     * - Number of shake cycles (default: 1)
     */
    iterations?: number;
    /**
     * - Delay between elements in ms (default: 0)
     */
    stagger?: number;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
    /**
     * - Callback when shake completes
     */
    onComplete?: () => void;
};
/**
 * Options for `Domma.effects.twinkle()`.
 */
export type TwinkleOptions = {
    /**
     * - Number of stars (default: 100)
     */
    count?: number;
    /**
     * - Minimum star size in pixels (default: 1)
     */
    minSize?: number;
    /**
     * - Maximum star size in pixels (default: 3)
     */
    maxSize?: number;
    /**
     * - Base oscillation speed (default: 0.003)
     */
    twinkleSpeed?: number;
    /**
     * - Star colour (default: 'rgba(255, 240, 200, 1)')
     */
    colour?: string;
    /**
     * - Canvas z-index (default: 1)
     */
    zIndex?: number;
    /**
     * - Star shape; 'star' draws a 4-pointed star, 'circle' draws a dot (default: 'star')
     */
    shape?: "star" | "circle";
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
};
/**
 * Options for `Domma.effects.tickerTape()`.
 */
export type TickerTapeOptions = {
    /**
     * - Named theme palette (e.g. 'theme', 'rainbow', 'gold', 'silver', 'festive', 'pastel', 'mono') or a custom array of CSS colour strings (default: 'theme')
     */
    palette?: TickerTapePalette;
    /**
     * - Average strips on screen at any moment (default: 50)
     */
    density?: number;
    /**
     * - Fall speed multiplier (1 = default) (default: 1)
     */
    speed?: number;
    /**
     * - Horizontal sway amplitude in pixels (default: 60)
     */
    sway?: number;
    /**
     * - Max rotation degrees per frame (default: 6)
     */
    rotationSpeed?: number;
    /**
     * - Minimum strip width in pixels (default: 5)
     */
    minWidth?: number;
    /**
     * - Maximum strip width in pixels (default: 9)
     */
    maxWidth?: number;
    /**
     * - Minimum strip height in pixels (default: 12)
     */
    minHeight?: number;
    /**
     * - Maximum strip height in pixels (default: 22)
     */
    maxHeight?: number;
    /**
     * - Fraction of fall (0-1) before fade begins (default: 0.55)
     */
    fadeStart?: number;
    /**
     * - If true, drops a single batch and stops respawning (default: false)
     */
    burst?: boolean;
    /**
     * - Strips emitted in burst mode (default: 150)
     */
    burstCount?: number;
    /**
     * - Canvas stacking order (default: 1)
     */
    zIndex?: number;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
};
/**
 * Options for `Domma.effects.butterflies()`.
 */
export type ButterfliesOptions = {
    /**
     * - Named palette (e.g. 'meadow', 'firefly', 'aqua', 'autumn' or any ticker-tape palette) or a custom array of CSS colour strings (default: 'meadow')
     */
    palette?: TickerTapePalette;
    /**
     * - Target butterflies on screen at once (default: 18)
     */
    density?: number;
    /**
     * - Global speed multiplier (default: 1)
     */
    speed?: number;
    /**
     * - Steering erraticness (default: 1)
     */
    wander?: number;
    /**
     * - Upward drift bias (default: 0.4)
     */
    riseSpeed?: number;
    /**
     * - Wingbeat rate multiplier (default: 1)
     */
    flapSpeed?: number;
    /**
     * - Minimum wingspan in pixels (default: 14)
     */
    minSize?: number;
    /**
     * - Maximum wingspan in pixels (default: 26)
     */
    maxSize?: number;
    /**
     * - Use two palette colours per butterfly (default: true)
     */
    twoTone?: boolean;
    /**
     * - Release one batch then settle (default: false)
     */
    burst?: boolean;
    /**
     * - Butterflies released in burst mode (default: 40)
     */
    burstCount?: number;
    /**
     * - Canvas stacking order (default: 1)
     */
    zIndex?: number;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
};
/**
 * Options for `Domma.effects.strobe()`.
 */
export type StrobeOptions = {
    /**
     * - Named preset (club|concert|police|searchlight|scanner|mood). Individual options override the preset. (default: 'club')
     */
    preset?: "club" | "concert" | "police" | "searchlight" | "scanner" | "mood";
    /**
     * - Corners beams emit from: any of 'tl','tr','bl','br'
     */
    origins?: Array<"tl" | "tr" | "bl" | "br">;
    /**
     * - 'sweep' (fan back and forth) or 'rotate' (full circle)
     */
    motion?: "sweep" | "rotate";
    /**
     * - Degrees a beam fans across in sweep mode
     */
    sweepArc?: number;
    /**
     * - Sweep/rotation speed multiplier
     */
    speed?: number;
    /**
     * - Angular width of each beam cone in degrees
     */
    beamWidth?: number;
    /**
     * - Blink beams on/off (the strobe character)
     */
    flicker?: boolean;
    /**
     * - Flicker rate in flashes/sec (warns above 5)
     */
    hz?: number;
    /**
     * - Beam colours, assigned per beam in order
     */
    colours?: string[];
    /**
     * - Beam brightness 0-1
     */
    intensity?: number;
    /**
     * - Auto-stop after N ms (default: null)
     */
    duration?: number | null;
    /**
     * - Canvas stacking order (default: 9999)
     */
    zIndex?: number;
    /**
     * - Honour prefers-reduced-motion (default: true)
     */
    respectMotionPreference?: boolean;
};
/**
 * The effects module (`Domma.effects`).
 */
export type Effects = {
    /**
     * - Sinusoidal floating animation
     */
    breathe: typeof breathe;
    /**
     * - Pulsing scale animation
     */
    pulse: typeof pulse;
    /**
     * - Text animation with configurable granularity (characters, words, or sentences) and action queue
     */
    scribe: typeof scribe;
    /**
     * - Scroll-triggered entrance animations using IntersectionObserver
     */
    reveal: typeof reveal;
    /**
     * - Text cipher/decode animation
     */
    scramble: typeof scramble;
    /**
     * - Animated number counting with easing and formatting
     */
    counter: typeof counter;
    /**
     * - Material Design click ripple effect
     */
    ripple: typeof ripple;
    /**
     * - Attention/error shake animation
     */
    shake: typeof shake;
    /**
     * - Canvas-based twinkling stars animation
     */
    twinkle: typeof twinkle;
    /**
     * - Canvas-based ticker-tape parade - colourful rectangles fall, sway, rotate, and fade
     */
    tickerTape: typeof tickerTape;
    /**
     * - Canvas-based fluttering butterflies
     */
    butterflies: typeof butterflies;
    /**
     * - Stage-lighting beams sweeping from the corners
     */
    strobe: typeof strobe;
};
