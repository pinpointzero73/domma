import {drawTickerStrip, advanceTickerStrip} from './ticker-tape-drawing.js';
import {drawIllustratedButterfly} from './butterfly-drawing.js';

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
export function breathe(selector, options = {}) {
  // Default options
  const defaults = {
    amplitude: 6,
    duration: 3000,
    easing: 'ease-in-out',
    delay: 0,
    stagger: 0,
    iterations: 'infinite',
    pauseOnHover: false,
    autoStart: true,
    respectMotionPreference: true,
    onStart: null,
    onComplete: null
  };

  const opts = { ...defaults, ...options };

  // Get elements
  let elements;
  if (typeof selector === 'string') {
    elements = document.querySelectorAll(selector);
  } else if (selector instanceof Element) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = Array.from(selector);
  } else {
    console.error('[Domma.effects.breathe] Invalid selector');
    return null;
  }

  if (elements.length === 0) {
    console.warn('[Domma.effects.breathe] No elements found');
    return null;
  }

  // Respect motion preferences
  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.breathe] Disabled due to prefers-reduced-motion');
    return {
      pause: () => {},
      resume: () => {},
      stop: () => {},
      restart: () => {},
      destroy: () => {},
      isRunning: () => false,
      isPaused: () => false
    };
  }

  // Generate unique animation name
  const animId = `domma-breathe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create keyframes
  const keyframes = `
    @keyframes ${animId} {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-${opts.amplitude}px);
      }
    }
  `;

  // Inject stylesheet
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-domma-effect', animId);
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);

  // Track hover handlers for cleanup
  const hoverHandlers = new Map();

  // Apply animation to elements with stagger
  elements.forEach((el, index) => {
    const staggerDelay = opts.delay + (index * opts.stagger);
    el.style.animation = `${animId} ${opts.duration}ms ${opts.easing} ${staggerDelay}ms ${opts.iterations}`;

    // Pause on hover if enabled
    if (opts.pauseOnHover) {
      const mouseEnterHandler = () => {
        el.style.animationPlayState = 'paused';
      };
      const mouseLeaveHandler = () => {
        el.style.animationPlayState = 'running';
      };

      el.addEventListener('mouseenter', mouseEnterHandler);
      el.addEventListener('mouseleave', mouseLeaveHandler);

      hoverHandlers.set(el, { mouseEnterHandler, mouseLeaveHandler });
    }

    // Animation end callback
    if (opts.onComplete && opts.iterations !== 'infinite') {
      const animEndHandler = () => {
        opts.onComplete();
        el.removeEventListener('animationend', animEndHandler);
      };
      el.addEventListener('animationend', animEndHandler);
    }
  });

  // Call onStart callback
  if (opts.onStart) {
    opts.onStart();
  }

  // Return control object
  return {
    /**
     * Pause the animation
     */
    pause() {
      elements.forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    },

    /**
     * Resume the animation
     */
    resume() {
      elements.forEach(el => {
        el.style.animationPlayState = 'running';
      });
    },

    /**
     * Stop the animation
     */
    stop() {
      elements.forEach(el => {
        el.style.animation = 'none';
      });
    },

    /**
     * Restart the animation from the beginning
     */
    restart() {
      elements.forEach((el, index) => {
        const staggerDelay = opts.delay + (index * opts.stagger);
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = `${animId} ${opts.duration}ms ${opts.easing} ${staggerDelay}ms ${opts.iterations}`;
      });
    },

    /**
     * Destroy the animation and clean up
     */
    destroy() {
      elements.forEach(el => {
        el.style.animation = 'none';

        // Remove hover handlers
        if (hoverHandlers.has(el)) {
          const handlers = hoverHandlers.get(el);
          el.removeEventListener('mouseenter', handlers.mouseEnterHandler);
          el.removeEventListener('mouseleave', handlers.mouseLeaveHandler);
          hoverHandlers.delete(el);
        }
      });

      // Remove stylesheet
      styleElement.remove();
    },

    /**
     * Check if animation is running
     * @returns {boolean}
     */
    isRunning() {
      if (elements.length === 0) return false;
      const firstEl = elements[0];
      return firstEl.style.animationPlayState !== 'paused' &&
             firstEl.style.animation !== 'none';
    },

    /**
     * Check if animation is paused
     * @returns {boolean}
     */
    isPaused() {
      if (elements.length === 0) return false;
      return elements[0].style.animationPlayState === 'paused';
    }
  };
}

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
export function pulse(selector, options = {}) {
  const defaults = {
    scale: 1.05,
    duration: 2000,
    easing: 'ease-in-out',
    delay: 0,
    stagger: 0,
    iterations: 'infinite',
    pauseOnHover: false,
    respectMotionPreference: true
  };

  const opts = { ...defaults, ...options };

  // Get elements
  let elements;
  if (typeof selector === 'string') {
    elements = document.querySelectorAll(selector);
  } else if (selector instanceof Element) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = Array.from(selector);
  } else {
    console.error('[Domma.effects.pulse] Invalid selector');
    return null;
  }

  if (elements.length === 0) {
    console.warn('[Domma.effects.pulse] No elements found');
    return null;
  }

  // Respect motion preferences
  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      pause: () => {},
      resume: () => {},
      stop: () => {},
      restart: () => {},
      destroy: () => {},
      isRunning: () => false,
      isPaused: () => false
    };
  }

  // Generate unique animation name
  const animId = `domma-pulse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create keyframes
  const keyframes = `
    @keyframes ${animId} {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(${opts.scale});
      }
    }
  `;

  // Inject stylesheet
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-domma-effect', animId);
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);

  // Track hover handlers
  const hoverHandlers = new Map();

  // Apply animation
  elements.forEach((el, index) => {
    const staggerDelay = opts.delay + (index * opts.stagger);
    el.style.animation = `${animId} ${opts.duration}ms ${opts.easing} ${staggerDelay}ms ${opts.iterations}`;

    if (opts.pauseOnHover) {
      const mouseEnterHandler = () => el.style.animationPlayState = 'paused';
      const mouseLeaveHandler = () => el.style.animationPlayState = 'running';

      el.addEventListener('mouseenter', mouseEnterHandler);
      el.addEventListener('mouseleave', mouseLeaveHandler);

      hoverHandlers.set(el, { mouseEnterHandler, mouseLeaveHandler });
    }
  });

  // Return control object
  return {
    pause() {
      elements.forEach(el => el.style.animationPlayState = 'paused');
    },
    resume() {
      elements.forEach(el => el.style.animationPlayState = 'running');
    },
    stop() {
      elements.forEach(el => el.style.animation = 'none');
    },
    restart() {
      elements.forEach((el, index) => {
        const staggerDelay = opts.delay + (index * opts.stagger);
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = `${animId} ${opts.duration}ms ${opts.easing} ${staggerDelay}ms ${opts.iterations}`;
      });
    },
    destroy() {
      elements.forEach(el => {
        el.style.animation = 'none';
        if (hoverHandlers.has(el)) {
          const handlers = hoverHandlers.get(el);
          el.removeEventListener('mouseenter', handlers.mouseEnterHandler);
          el.removeEventListener('mouseleave', handlers.mouseLeaveHandler);
          hoverHandlers.delete(el);
        }
      });
      styleElement.remove();
    },
    isRunning() {
      return elements.length > 0 &&
             elements[0].style.animationPlayState !== 'paused' &&
             elements[0].style.animation !== 'none';
    },
    isPaused() {
      return elements.length > 0 && elements[0].style.animationPlayState === 'paused';
    }
  };
}

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
export function parseWait(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value !== 'string') return 0;

    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed)) return 0;

    if (value.endsWith('ms')) return parsed;
    if (value.endsWith('s')) return parsed * 1000;
    return 0;
}

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
export function scribe(selector, options = {}) {
  // Default options
  const defaults = {
    mode: 'typewriter', // 'typewriter' (char-by-char), 'word', or 'sentence'
    speed: 50,
    deleteSpeed: 30,
    cursor: true,
    cursorChar: '|',
    cursorBlink: true,
    cursorType: 'caret', // 'caret', 'block', 'underline'
    loop: false,
    loopDelay: 1000,
    pauseOnHover: false,
    autoStart: true,
    respectMotionPreference: true,
    actions: [],
    onStart: null,
    onComplete: null,
    onCharacter: null,
    onRender: null,
    onUndoRender: null,
    onLoop: null
  };

  const opts = { ...defaults, ...options };

  // Resolve elements using same pattern as breathe/pulse
  let elements;
  if (typeof selector === 'string') {
    elements = Array.from(document.querySelectorAll(selector));
  } else if (selector instanceof Element) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = Array.from(selector);
  } else {
    console.error('[Domma.effects.scribe] Invalid selector');
    return null;
  }

  if (elements.length === 0) {
    console.warn('[Domma.effects.scribe] No elements found');
    return null;
  }

  // A static first phrase remains readable when motion is disabled.
  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const firstRender = opts.actions.find(action => action.render !== undefined);
    if (firstRender) elements.forEach(el => { el.textContent = String(firstRender.render); });
    return noopControl();
  }

  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  function splitText(text) {
    if (opts.mode === 'word') return text.match(/\s*\S+\s*|\s+/g) || [];
    if (opts.mode === 'sentence') return text.match(/[^.!?]*[.!?]+\s*|[^.!?]+$/g) || [];
    return segmenter ? Array.from(segmenter.segment(text), part => part.segment) : Array.from(text);
  }

  const states = elements.map(element => ({
    element, spans: [], cursor: null, action: 0, task: null,
    exiting: [], frame: null, lastTime: null, elapsed: 0, loops: 0, lastRenderStart: 0,
    started: false, paused: false, stopped: false, destroyed: false, hoverPaused: false, hoverHandlers: null
  }));

  function setCursorActive(state, active) {
    state.cursor?.classList.toggle('dm-scribe-cursor-active', active);
  }

  function removeUnit(span) {
    const parent = span.parentElement;
    span.remove();
    if (parent?.classList.contains('dm-scribe-word-group') && !parent.childNodes.length) parent.remove();
  }

  // Entrance lengths from domma.css; a slower speed stretches them to fill the unit's turn.
  const ENTRANCE_MS = { fade: 220, bounce: 380, glow: 500 };
  const EXIT_MS = 220;

  // A unit that came in with an effect fades out over its delete turn. The engine
  // removes it on its own clock, so pause holds it and reduced-motion CSS cannot strand it.
  function exitUnit(state, span) {
    span.classList.remove('dm-scribe-fade', 'dm-scribe-bounce', 'dm-scribe-glow');
    const ms = Math.max(EXIT_MS, opts.deleteSpeed);
    span.style.animationDuration = `${ms}ms`;
    span.classList.add('dm-scribe-out');
    state.exiting.push({ span, left: ms });
    return ms;
  }

  function clearText(state) {
    state.spans.forEach(removeUnit);
    state.spans = [];
    state.exiting.forEach(item => removeUnit(item.span));
    state.exiting = [];
    state.lastRenderStart = 0;
  }

  function schedule(state) {
    if (state.frame === null && state.started && !state.paused && !state.stopped && !state.destroyed) {
      state.frame = requestAnimationFrame(time => tick(state, time));
    }
  }

  function prepareTask(state) {
    if (state.action >= opts.actions.length) {
      setCursorActive(state, false);
      if (opts.loop === true || (typeof opts.loop === 'number' && state.loops < opts.loop - 1)) {
        state.task = { type: 'loop', duration: Math.max(0, opts.loopDelay) };
      } else {
        state.stopped = true;
        setCursorActive(state, false);
        opts.onComplete?.();
      }
      return;
    }
    const action = opts.actions[state.action];
    if (action.render !== undefined) {
      state.lastRenderStart = state.spans.length;
      state.task = { type: 'render', text: String(action.render), units: splitText(String(action.render)),
        index: 0, effect: action.effect || 'none', duration: Math.max(0, opts.speed) };
    } else if (action.undoRender !== undefined) {
      let count = 0;
      if (action.undoRender === true) count = state.spans.length - state.lastRenderStart;
      else if (action.undoRender === 'all') count = state.spans.length;
      else if (Number.isFinite(action.undoRender)) count = Math.floor(action.undoRender);
      state.task = { type: 'undo', count: Math.max(0, Math.min(count, state.spans.length)),
        deleted: [], duration: Math.max(0, opts.deleteSpeed) };
    } else {
      state.task = { type: 'wait', duration: Math.max(0, parseWait(action.wait)) };
    }
    setCursorActive(state, state.task.type === 'render' || state.task.type === 'undo');
  }

  function finishTask(state) {
    const task = state.task;
    state.task = null;
    if (task.type === 'loop') {
      clearText(state);
      state.action = 0;
      state.loops++;
      opts.onLoop?.(state.loops);
    } else {
      state.action++;
      if (task.type === 'render') opts.onRender?.(task.text);
      if (task.type === 'undo') opts.onUndoRender?.(task.deleted.reverse().join(''));
    }
  }

  function appendUnit(state, task) {
    const unit = task.units[task.index++];
    const span = document.createElement('span');
    span.className = opts.mode === 'word' ? 'dm-scribe-word'
      : opts.mode === 'sentence' ? 'dm-scribe-sentence' : 'dm-scribe-char';
    span.textContent = unit;
    // Inline whitespace preserves explicit newlines between animated units.
    if (/^\s+$/.test(unit)) span.classList.add('dm-scribe-space');
    if (['fade', 'bounce', 'glow'].includes(task.effect)) {
      const effectClass = `dm-scribe-${task.effect}`;
      span.classList.add(effectClass);
      span.dmScribeEffect = task.effect;
      if (opts.speed > ENTRANCE_MS[task.effect]) span.style.animationDuration = `${opts.speed}ms`;
      if (opts.mode === 'sentence' && task.effect === 'bounce') span.classList.add('dm-scribe-transform-unit');
      // Release animation layers once the entrance settles.
      span.addEventListener('animationend', () => span.classList.remove(effectClass), { once: true });
    }
    if (opts.mode === 'typewriter' && !/^\s+$/.test(unit)) {
      const previous = state.spans.at(-1);
      let group = previous?.parentElement;
      if (!group?.classList.contains('dm-scribe-word-group')) {
        group = document.createElement('span');
        group.className = 'dm-scribe-word-group';
        state.element.insertBefore(group, state.cursor);
      }
      group.appendChild(span);
    } else {
      state.element.insertBefore(span, state.cursor);
    }
    state.spans.push(span);
    opts.onCharacter?.(unit, state.spans.length - 1);
  }

  function tick(state, time) {
    state.frame = null;
    if (state.paused || state.stopped || state.destroyed) return;
    // Keep fractional frame time for accurate pacing, but avoid a burst after a hidden tab.
    const delta = state.lastTime !== null ? Math.min(time - state.lastTime, 64) : 0;
    state.elapsed += delta;
    state.lastTime = time;
    state.exiting = state.exiting.filter(item => {
      item.left -= delta;
      if (item.left > 0) return true;
      removeUnit(item.span);
      return false;
    });
    // Bound zero-duration scripts so an infinite loop cannot block the browser.
    let steps = 0;
    while (steps++ < 100 && !state.paused && !state.stopped && !state.destroyed) {
      if (!state.task) prepareTask(state);
      if (state.stopped || state.paused || state.destroyed) break;
      const task = state.task;
      const complete = (task.type === 'render' && task.index >= task.units.length)
        || (task.type === 'undo' && task.deleted.length >= task.count && !task.hold);
      if (complete) {
        finishTask(state);
        continue;
      }
      // After the last faded unit, the undo holds until that fade has finished.
      const wait = task.hold || task.duration;
      if (state.elapsed < wait) break;
      state.elapsed -= wait;
      if (task.hold) task.hold = 0;
      else if (task.type === 'render') appendUnit(state, task);
      else if (task.type === 'undo') {
        const span = state.spans.pop();
        task.deleted.push(span.textContent);
        if (span.dmScribeEffect) {
          const ms = exitUnit(state, span);
          if (task.deleted.length >= task.count) task.hold = ms;
        } else removeUnit(span);
      } else finishTask(state);
    }
    schedule(state);
  }

  function pauseState(state) {
    if (state.destroyed || state.stopped) return;
    state.paused = true;
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    state.frame = null;
    state.lastTime = null;
    state.spans.forEach(span => { span.style.animationPlayState = 'paused'; });
    state.exiting.forEach(item => { item.span.style.animationPlayState = 'paused'; });
    setCursorActive(state, false);
  }

  function resumeState(state) {
    if (state.destroyed || state.stopped || (state.started && !state.paused)) return;
    const firstStart = !state.started;
    state.started = true;
    state.paused = false;
    state.lastTime = null;
    state.spans.forEach(span => { span.style.animationPlayState = ''; });
    state.exiting.forEach(item => { item.span.style.animationPlayState = ''; });
    setCursorActive(state, state.task?.type === 'render' || state.task?.type === 'undo');
    if (firstStart) opts.onStart?.();
    schedule(state);
  }

  states.forEach(state => {
    if (opts.cursor) {
      const cursor = document.createElement('span');
      const type = ['block', 'underline'].includes(opts.cursorType) ? opts.cursorType : 'caret';
      cursor.className = `dm-scribe-cursor dm-scribe-cursor-${type}`;
      if (!opts.cursorBlink) cursor.classList.add('dm-scribe-cursor-no-blink');
      cursor.textContent = type === 'underline' ? '\u00A0' : opts.cursorChar;
      cursor.setAttribute('aria-hidden', 'true');
      state.cursor = cursor;
      state.element.appendChild(cursor);
    }
    if (opts.pauseOnHover) {
      state.hoverHandlers = {
        enter: () => {
          if (!state.started || state.paused || state.stopped) return;
          state.hoverPaused = true;
          pauseState(state);
        },
        leave: () => {
          if (!state.hoverPaused) return;
          state.hoverPaused = false;
          resumeState(state);
        }
      };
      state.element.addEventListener('mouseenter', state.hoverHandlers.enter);
      state.element.addEventListener('mouseleave', state.hoverHandlers.leave);
    }
    if (opts.autoStart) resumeState(state);
  });

  return {
    pause() { states.forEach(state => { state.hoverPaused = false; pauseState(state); }); },
    resume() { states.forEach(resumeState); },
    stop() {
      states.forEach(state => {
        pauseState(state);
        state.paused = false;
        state.stopped = true;
        state.spans.forEach(span => {
          span.classList.remove('dm-scribe-fade', 'dm-scribe-bounce', 'dm-scribe-glow');
          span.style.animationPlayState = '';
        });
        state.exiting.forEach(item => removeUnit(item.span));
        state.exiting = [];
        setCursorActive(state, false);
      });
    },
    restart() {
      states.forEach(state => {
        if (state.destroyed) return;
        pauseState(state);
        clearText(state);
        Object.assign(state, { action: 0, task: null, elapsed: 0, lastTime: null,
          loops: 0, stopped: false, started: false });
        resumeState(state);
      });
    },
    destroy() {
      states.forEach(state => {
        pauseState(state);
        state.destroyed = true;
        clearText(state);
        state.cursor?.remove();
        if (state.hoverHandlers) {
          state.element.removeEventListener('mouseenter', state.hoverHandlers.enter);
          state.element.removeEventListener('mouseleave', state.hoverHandlers.leave);
        }
      });
    },
    isRunning() { return states.some(state => state.started && !state.paused && !state.stopped && !state.destroyed); },
    isPaused() { return states.some(state => state.paused && !state.destroyed); }
  };
}

/**
 * Resolve selector to an array of elements
 * Shared helper for all effects
 *
 * @param {string|Element|NodeList|Array} selector
 * @param {string} effectName - Name for error/warning messages
 * @returns {Array<Element>|null}
 */
function resolveElements(selector, effectName) {
  let elements;
  if (typeof selector === 'string') {
    elements = Array.from(document.querySelectorAll(selector));
  } else if (selector instanceof Element) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = Array.from(selector);
  } else {
    console.error(`[Domma.effects.${effectName}] Invalid selector`);
    return null;
  }

  if (elements.length === 0) {
    console.warn(`[Domma.effects.${effectName}] No elements found`);
    return null;
  }

  return elements;
}

/**
 * Create a no-op control object for when effects are disabled
 * @returns {EffectControl}
 */
function noopControl() {
  return {
    pause: () => {},
    resume: () => {},
    stop: () => {},
    restart: () => {},
    destroy: () => {},
    isRunning: () => false,
    isPaused: () => false
  };
}

/**
 * Check if reduced motion is preferred
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
export function reveal(selector, options = {}) {
  const defaults = {
    animation: 'fade',
    duration: 600,
    easing: 'ease-out',
    delay: 0,
    stagger: 0,
    threshold: 0.1,
    rootMargin: '0px',
    once: true,
    respectMotionPreference: true,
    onReveal: null
  };

  const opts = { ...defaults, ...options };

  const elements = resolveElements(selector, 'reveal');
  if (!elements) return null;

  // Respect motion preferences
  if (opts.respectMotionPreference && prefersReducedMotion()) {
    // Show elements immediately without animation
    elements.forEach(el => {
      el.classList.add('dm-reveal-visible');
    });
    return noopControl();
  }

  // Apply initial hidden state and animation class
  elements.forEach((el, index) => {
    el.classList.add('dm-reveal', `dm-reveal-${opts.animation}`);
    el.style.transitionDuration = `${opts.duration}ms`;
    el.style.transitionTimingFunction = opts.easing;
    const totalDelay = opts.delay + (index * opts.stagger);
    if (totalDelay > 0) {
      el.style.transitionDelay = `${totalDelay}ms`;
    }
    // Add attribute to force animation even with prefers-reduced-motion
    if (!opts.respectMotionPreference) {
      el.setAttribute('data-force-animation', 'true');
    }
  });

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('dm-reveal-visible');
        if (opts.onReveal) opts.onReveal(entry.target);
        if (opts.once) {
          observer.unobserve(entry.target);
        }
      } else if (!opts.once) {
        entry.target.classList.remove('dm-reveal-visible');
      }
    });
  }, {
    threshold: opts.threshold,
    rootMargin: opts.rootMargin
  });

  elements.forEach(el => observer.observe(el));

  return {
    pause() {},
    resume() {},
    stop() {
      observer.disconnect();
    },
    restart() {
      elements.forEach(el => {
        el.classList.remove('dm-reveal-visible');
        observer.observe(el);
      });
    },
    destroy() {
      observer.disconnect();
      elements.forEach(el => {
        el.classList.remove('dm-reveal', 'dm-reveal-visible',
          `dm-reveal-${opts.animation}`);
        el.style.transitionDuration = '';
        el.style.transitionTimingFunction = '';
        el.style.transitionDelay = '';
      });
    },
    isRunning() { return true; },
    isPaused() { return false; }
  };
}

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
export function scramble(selector, options = {}) {
  const defaults = {
    speed: 50,
    scrambleSpeed: 30,
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*',
    revealOrder: 'left-to-right',
    scrambleDuration: 800,
    stagger: 0,
    loop: false,
    loopDelay: 2000,
    respectMotionPreference: true,
    onComplete: null,
    onCharacter: null
  };

  const opts = { ...defaults, ...options };

  const elements = resolveElements(selector, 'scramble');
  if (!elements) return null;

  if (opts.respectMotionPreference && prefersReducedMotion()) {
    return noopControl();
  }

  // State per element
  const states = elements.map((el, elIndex) => {
    const originalText = el.textContent;
    return {
      element: el,
      originalText,
      rafId: null,
      timeoutId: null,
      paused: false,
      loopCount: 0
    };
  });

  function getRevealOrder(length, order) {
    const indices = Array.from({ length }, (_, i) => i);
    switch (order) {
      case 'right-to-left':
        return indices.reverse();
      case 'random':
        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
      case 'center-out': {
        const center = Math.floor(length / 2);
        const result = [center];
        for (let offset = 1; offset <= center; offset++) {
          if (center - offset >= 0) result.push(center - offset);
          if (center + offset < length) result.push(center + offset);
        }
        return result;
      }
      default: // left-to-right
        return indices;
    }
  }

  function randomChar() {
    return opts.characters[Math.floor(Math.random() * opts.characters.length)];
  }

  function animateElement(state) {
    if (state.paused) return;

    const text = state.originalText;
    const len = text.length;

    if (len === 0) {
      if (opts.onComplete) opts.onComplete();
      return;
    }

    const order = getRevealOrder(len, opts.revealOrder);
    const resolved = new Array(len).fill(false);
    const display = text.split('').map(ch => ch === ' ' ? ' ' : randomChar());
    const startTime = performance.now();

    // Calculate resolve time per character based on order
    const resolveDelay = opts.speed;

    function frame(currentTime) {
      if (state.paused) return;

      const elapsed = currentTime - startTime;

      // Resolve characters based on timing
      order.forEach((charIndex, orderPos) => {
        if (resolved[charIndex]) return;

        const charResolveTime = opts.scrambleDuration + (orderPos * resolveDelay);
        if (elapsed >= charResolveTime) {
          resolved[charIndex] = true;
          display[charIndex] = text[charIndex];
          if (opts.onCharacter) opts.onCharacter(text[charIndex], charIndex);
        }
      });

      // Scramble unresolved characters
      for (let i = 0; i < len; i++) {
        if (!resolved[i] && text[i] !== ' ') {
          display[i] = randomChar();
        }
      }

      // Build output with spans
      state.element.innerHTML = display.map((ch, i) =>
        `<span class="dm-scramble-char${resolved[i] ? ' dm-scramble-resolved' : ''}">${ch}</span>`
      ).join('');

      // Check if all resolved
      if (resolved.every(Boolean)) {
        if (opts.onComplete) opts.onComplete();
        handleLoop(state);
        return;
      }

      state.rafId = requestAnimationFrame(frame);
    }

    state.rafId = requestAnimationFrame(frame);
  }

  function handleLoop(state) {
    if (opts.loop === false) return;

    if (typeof opts.loop === 'number' && state.loopCount >= opts.loop - 1) return;

    state.loopCount++;
    state.timeoutId = setTimeout(() => {
      if (!state.paused) animateElement(state);
    }, opts.loopDelay);
  }

  // Start all elements with stagger
  states.forEach((state, index) => {
    const delay = index * opts.stagger;
    if (delay > 0) {
      state.timeoutId = setTimeout(() => animateElement(state), delay);
    } else {
      animateElement(state);
    }
  });

  return {
    pause() {
      states.forEach(s => {
        s.paused = true;
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
      });
    },
    resume() {
      states.forEach(s => {
        s.paused = false;
        animateElement(s);
      });
    },
    stop() {
      states.forEach(s => {
        s.paused = true;
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
        s.element.textContent = s.originalText;
      });
    },
    restart() {
      states.forEach(s => {
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
        s.paused = false;
        s.loopCount = 0;
        animateElement(s);
      });
    },
    destroy() {
      states.forEach(s => {
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
        s.element.textContent = s.originalText;
      });
    },
    isRunning() {
      return states.length > 0 && !states[0].paused;
    },
    isPaused() {
      return states.length > 0 && states[0].paused;
    }
  };
}

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
export function counter(selector, options = {}) {
  const defaults = {
    from: 0,
    to: null,
    duration: 2000,
    easing: 'ease-out',
    decimals: 0,
    separator: ',',
    prefix: '',
    suffix: '',
    stagger: 0,
    trigger: 'immediate',
    threshold: 0.5,
    respectMotionPreference: true,
    onUpdate: null,
    onComplete: null
  };

  const opts = { ...defaults, ...options };

  const elements = resolveElements(selector, 'counter');
  if (!elements) return null;

  // If reduced motion, show final value immediately
  if (opts.respectMotionPreference && prefersReducedMotion()) {
    elements.forEach(el => {
      const to = opts.to !== null ? opts.to : parseFloat(el.textContent.replace(/[^0-9.\-]/g, '')) || 0;
      el.textContent = opts.prefix + formatNumber(to, opts.decimals, opts.separator) + opts.suffix;
    });
    return noopControl();
  }

  // Easing functions
  function easingFn(t) {
    switch (opts.easing) {
      case 'linear': return t;
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'ease-out':
      default: return 1 - Math.pow(1 - t, 3);
    }
  }

  function formatNumber(num, decimals, separator) {
    const fixed = num.toFixed(decimals);
    if (!separator) return fixed;
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  }

  const states = elements.map((el, index) => {
    const to = opts.to !== null ? opts.to : parseFloat(el.textContent.replace(/[^0-9.\-]/g, '')) || 0;
    return {
      element: el,
      from: opts.from,
      to: to,
      rafId: null,
      timeoutId: null,
      startTime: null,
      paused: false,
      complete: false
    };
  });

  function animateCounter(state) {
    if (state.paused) return;

    state.startTime = performance.now();
    state.complete = false;

    function frame(currentTime) {
      if (state.paused) return;

      const elapsed = currentTime - state.startTime;
      const progress = Math.min(elapsed / opts.duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = state.from + (state.to - state.from) * easedProgress;

      state.element.textContent = opts.prefix + formatNumber(currentValue, opts.decimals, opts.separator) + opts.suffix;

      if (opts.onUpdate) opts.onUpdate(currentValue);

      if (progress < 1) {
        state.rafId = requestAnimationFrame(frame);
      } else {
        state.complete = true;
        // Ensure final value is exact
        state.element.textContent = opts.prefix + formatNumber(state.to, opts.decimals, opts.separator) + opts.suffix;
        if (opts.onComplete) opts.onComplete();
      }
    }

    state.rafId = requestAnimationFrame(frame);
  }

  // Scroll-triggered observer
  let observer = null;

  function startElement(state, delay) {
    if (delay > 0) {
      state.timeoutId = setTimeout(() => animateCounter(state), delay);
    } else {
      animateCounter(state);
    }
  }

  if (opts.trigger === 'scroll') {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const state = states.find(s => s.element === entry.target);
          if (state && !state.complete) {
            const index = states.indexOf(state);
            startElement(state, index * opts.stagger);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: opts.threshold });

    elements.forEach(el => observer.observe(el));
  } else {
    // Immediate start
    states.forEach((state, index) => {
      startElement(state, index * opts.stagger);
    });
  }

  return {
    pause() {
      states.forEach(s => {
        s.paused = true;
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
      });
    },
    resume() {
      states.forEach(s => {
        if (s.paused && !s.complete) {
          s.paused = false;
          animateCounter(s);
        }
      });
    },
    stop() {
      states.forEach(s => {
        s.paused = true;
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
      });
      if (observer) observer.disconnect();
    },
    restart() {
      states.forEach((s, index) => {
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
        s.paused = false;
        s.complete = false;
        startElement(s, index * opts.stagger);
      });
    },
    destroy() {
      states.forEach(s => {
        if (s.rafId) cancelAnimationFrame(s.rafId);
        if (s.timeoutId) clearTimeout(s.timeoutId);
      });
      if (observer) observer.disconnect();
    },
    isRunning() {
      return states.length > 0 && !states[0].paused && !states[0].complete;
    },
    isPaused() {
      return states.length > 0 && states[0].paused;
    }
  };
}

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
export function ripple(selector, options = {}) {
  const defaults = {
    colour: 'rgba(255, 255, 255, 0.35)',
    duration: 600,
    opacity: 0.35,
    unbounded: false,
    centered: false,
    trigger: 'pointerdown',
    respectMotionPreference: true
  };

  const opts = { ...defaults, ...options };

  const elements = resolveElements(selector, 'ripple');
  if (!elements) return null;

  if (opts.respectMotionPreference && prefersReducedMotion()) {
    return noopControl();
  }

  // Inject shared keyframes once
  const styleId = 'domma-ripple-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes dm-ripple-expand {
        0% {
          transform: scale(0);
          opacity: var(--dm-ripple-opacity, 0.35);
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const handlers = new Map();

  elements.forEach(el => {
    // Set up container
    el.classList.add('dm-ripple-container');
    const originalPosition = getComputedStyle(el).position;
    if (originalPosition === 'static') {
      el.style.position = 'relative';
    }
    if (!opts.unbounded) {
      el.style.overflow = 'hidden';
    }
    // Add attribute to force animation even with prefers-reduced-motion
    if (!opts.respectMotionPreference) {
      el.setAttribute('data-force-animation', 'true');
    }

    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;

      let x, y;
      if (opts.centered) {
        x = rect.width / 2;
        y = rect.height / 2;
      } else {
        x = (e.clientX || e.touches?.[0]?.clientX || rect.width / 2) - rect.left;
        y = (e.clientY || e.touches?.[0]?.clientY || rect.height / 2) - rect.top;
      }

      const rippleEl = document.createElement('span');
      rippleEl.className = 'dm-ripple';
      if (!opts.respectMotionPreference) {
        rippleEl.setAttribute('data-force-animation', 'true');
      }
      rippleEl.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        background: ${opts.colour};
        --dm-ripple-opacity: ${opts.opacity};
        animation: dm-ripple-expand ${opts.duration}ms ease-out forwards;
      `;

      el.appendChild(rippleEl);

      // Remove after animation
      setTimeout(() => {
        rippleEl.remove();
      }, opts.duration);
    };

    el.addEventListener(opts.trigger, handler);
    handlers.set(el, handler);
  });

  return {
    pause() {},
    resume() {},
    stop() {},
    restart() {},
    destroy() {
      elements.forEach(el => {
        if (handlers.has(el)) {
          el.removeEventListener(opts.trigger, handlers.get(el));
          handlers.delete(el);
        }
        el.classList.remove('dm-ripple-container');
        // Remove active ripple elements
        el.querySelectorAll('.dm-ripple').forEach(r => r.remove());
      });
    },
    isRunning() { return true; },
    isPaused() { return false; }
  };
}

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
export function shake(selector, options = {}) {
  const defaults = {
    intensity: 6,
    duration: 500,
    direction: 'horizontal',
    easing: 'ease-in-out',
    iterations: 1,
    stagger: 0,
    respectMotionPreference: true,
    onComplete: null
  };

  const opts = { ...defaults, ...options };

  const elements = resolveElements(selector, 'shake');
  if (!elements) return null;

  if (opts.respectMotionPreference && prefersReducedMotion()) {
    if (opts.onComplete) opts.onComplete();
    return noopControl();
  }

  const animId = `domma-shake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const d = opts.intensity;

  let keyframeBody;
  switch (opts.direction) {
    case 'vertical':
      keyframeBody = `
        0%, 100% { transform: translateY(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateY(-${d}px); }
        20%, 40%, 60%, 80% { transform: translateY(${d}px); }
      `;
      break;
    case 'both':
      keyframeBody = `
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-${d}px, -${d}px); }
        20% { transform: translate(${d}px, ${d}px); }
        30% { transform: translate(-${d}px, ${d}px); }
        40% { transform: translate(${d}px, -${d}px); }
        50% { transform: translate(-${d}px, 0); }
        60% { transform: translate(${d}px, 0); }
        70% { transform: translate(0, -${d}px); }
        80% { transform: translate(0, ${d}px); }
        90% { transform: translate(-${d}px, -${d}px); }
      `;
      break;
    default: // horizontal
      keyframeBody = `
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-${d}px); }
        20%, 40%, 60%, 80% { transform: translateX(${d}px); }
      `;
  }

  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-domma-effect', animId);
  styleElement.textContent = `@keyframes ${animId} { ${keyframeBody} }`;
  document.head.appendChild(styleElement);

  const animEndHandlers = new Map();

  elements.forEach((el, index) => {
    const staggerDelay = index * opts.stagger;

    const startShake = () => {
      el.style.animation = `${animId} ${opts.duration}ms ${opts.easing} ${opts.iterations}`;

      const onEnd = () => {
        el.style.animation = '';
        el.removeEventListener('animationend', onEnd);
        animEndHandlers.delete(el);
        if (opts.onComplete && index === elements.length - 1) {
          opts.onComplete();
        }
      };

      el.addEventListener('animationend', onEnd);
      animEndHandlers.set(el, onEnd);
    };

    if (staggerDelay > 0) {
      setTimeout(startShake, staggerDelay);
    } else {
      startShake();
    }
  });

  return {
    pause() {
      elements.forEach(el => el.style.animationPlayState = 'paused');
    },
    resume() {
      elements.forEach(el => el.style.animationPlayState = 'running');
    },
    stop() {
      elements.forEach(el => {
        el.style.animation = '';
        if (animEndHandlers.has(el)) {
          el.removeEventListener('animationend', animEndHandlers.get(el));
          animEndHandlers.delete(el);
        }
      });
    },
    restart() {
      elements.forEach((el, index) => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = `${animId} ${opts.duration}ms ${opts.easing} ${opts.iterations}`;
      });
    },
    destroy() {
      elements.forEach(el => {
        el.style.animation = '';
        if (animEndHandlers.has(el)) {
          el.removeEventListener('animationend', animEndHandlers.get(el));
          animEndHandlers.delete(el);
        }
      });
      styleElement.remove();
    },
    isRunning() {
      return elements.length > 0 && elements[0].style.animation !== '' &&
             elements[0].style.animationPlayState !== 'paused';
    },
    isPaused() {
      return elements.length > 0 && elements[0].style.animationPlayState === 'paused';
    }
  };
}

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
export function twinkle(selector, options = {}) {
  const defaults = {
    count: 100,
    minSize: 1,
    maxSize: 3,
    twinkleSpeed: 0.003,
    colour: 'rgba(255, 240, 200, 1)',
    zIndex: 1,
    shape: 'star',
    respectMotionPreference: true
  };

  const opts = { ...defaults, ...options };

  // Respect motion preferences
  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.twinkle] Disabled due to prefers-reduced-motion');
    return {
      pause: () => {},
      resume: () => {},
      stop: () => {},
      restart: () => {},
      destroy: () => {},
      isRunning: () => false,
      isPaused: () => false
    };
  }

  // Determine mode: full-page or container-scoped
  const isFullPage = !selector || selector === 'body' || selector === document.body;

  // Resolve container element(s)
  let containers = [];
  if (!isFullPage) {
    if (typeof selector === 'string') {
      containers = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      containers = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      containers = Array.from(selector);
    }

    if (containers.length === 0) {
      console.warn('[Domma.effects.twinkle] No elements found for selector:', selector);
      return null;
    }
  }

  // State
  let running = false;
  let paused = false;
  let animationFrame = null;
  const instanceId = `domma-twinkle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Per-canvas state: one canvas per container (or one for full-page)
  const canvases = [];

  // ── Star drawing helpers ──────────────────────────────────────────────────

  function createStars(width, height) {
    const stars = [];
    for (let i = 0; i < opts.count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: opts.minSize + Math.random() * (opts.maxSize - opts.minSize),
        opacity: 0.3 + Math.random() * 0.7,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: opts.twinkleSpeed + Math.random() * opts.twinkleSpeed
      });
    }
    return stars;
  }

  function drawStar(ctx, star) {
    star.twinklePhase += star.twinkleSpeed;
    const twinkle = 0.3 + Math.sin(star.twinklePhase) * 0.7;

    ctx.save();
    ctx.globalAlpha = star.opacity * twinkle;
    ctx.fillStyle = opts.colour;
    ctx.shadowColor = opts.colour;

    if (opts.shape === 'circle') {
      ctx.shadowBlur = star.size * 2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 4-pointed star with centre glow
      ctx.shadowBlur = star.size * 2;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = star.x + Math.cos(angle) * star.size;
        const outerY = star.y + Math.sin(angle) * star.size;
        const innerAngle = angle + Math.PI / 4;
        const innerX = star.x + Math.cos(innerAngle) * (star.size * 0.3);
        const innerY = star.y + Math.sin(innerAngle) * (star.size * 0.3);
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();

      // Centre glow dot
      ctx.shadowBlur = star.size;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Canvas setup ──────────────────────────────────────────────────────────

  function createCanvas(container, isFixed) {
    const canvas = document.createElement('canvas');
    canvas.id = instanceId + (canvases.length > 0 ? `-${canvases.length}` : '');
    canvas.setAttribute('data-domma-effect', 'twinkle');
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = opts.zIndex;

    if (isFixed) {
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    } else {
      const computedPosition = window.getComputedStyle(container).position;
      if (computedPosition === 'static') {
        container.style.position = 'relative';
      }
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = container.offsetWidth || container.getBoundingClientRect().width;
      canvas.height = container.offsetHeight || container.getBoundingClientRect().height;
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    const stars = createStars(canvas.width, canvas.height);

    return { canvas, ctx, stars, container };
  }

  function resizeCanvas(entry) {
    if (entry.isFixed) {
      entry.canvas.width = window.innerWidth;
      entry.canvas.height = window.innerHeight;
    } else {
      const rect = entry.container.getBoundingClientRect();
      entry.canvas.width = rect.width || entry.container.offsetWidth;
      entry.canvas.height = rect.height || entry.container.offsetHeight;
    }
    // Recreate stars for the new dimensions
    entry.stars = createStars(entry.canvas.width, entry.canvas.height);
  }

  // ── Initialise canvases ───────────────────────────────────────────────────

  if (isFullPage) {
    const entry = createCanvas(document.body, true);
    entry.isFixed = true;
    canvases.push(entry);
  } else {
    containers.forEach(container => {
      const entry = createCanvas(container, false);
      entry.isFixed = false;
      canvases.push(entry);
    });
  }

  // ── Resize handling ───────────────────────────────────────────────────────

  let resizeObserver = null;

  if (isFullPage) {
    const onWindowResize = () => canvases.forEach(e => resizeCanvas(e));
    window.addEventListener('resize', onWindowResize);
    // Store for cleanup
    canvases[0]._resizeHandler = onWindowResize;
  } else {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        canvases.forEach(e => resizeCanvas(e));
      });
      containers.forEach(c => resizeObserver.observe(c));
    }
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  function animate() {
    if (!running || paused) return;

    canvases.forEach(({ canvas, ctx, stars }) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => drawStar(ctx, star));
    });

    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (running) return;
    running = true;
    paused = false;
    animate();
  }

  // ── Start immediately ─────────────────────────────────────────────────────

  startAnimation();
  console.log(`[Domma.effects.twinkle] Initialised with ${opts.count} stars (${isFullPage ? 'full-page' : 'container'} mode)`);

  // ── Control object ────────────────────────────────────────────────────────

  return {
    pause() {
      if (!running || paused) return;
      paused = true;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    },
    resume() {
      if (!running || !paused) return;
      paused = false;
      animate();
    },
    stop() {
      running = false;
      paused = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    },
    restart() {
      this.stop();
      canvases.forEach(e => {
        e.stars = createStars(e.canvas.width, e.canvas.height);
      });
      startAnimation();
    },
    destroy() {
      this.stop();
      // Remove resize listeners
      if (isFullPage && canvases[0]?._resizeHandler) {
        window.removeEventListener('resize', canvases[0]._resizeHandler);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      // Remove canvases from DOM
      canvases.forEach(({ canvas }) => {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      });
      canvases.length = 0;
    },
    isRunning() {
      return running && !paused;
    },
    isPaused() {
      return running && paused;
    }
  };
}

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
export function tickerTape(selector, options = {}) {
  const defaults = {
    palette: "theme",
    density: 50,
    speed: 1,
    sway: 60,
    rotationSpeed: 6,
    minWidth: 5,
    maxWidth: 9,
    minHeight: 12,
    maxHeight: 22,
    fadeStart: 0.55,
    burst: false,
    burstCount: 150,
    zIndex: 1,
    respectMotionPreference: true
  };
  const opts = { ...defaults, ...options };
  if (opts.respectMotionPreference && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    console.log("[Domma.effects.tickerTape] Disabled due to prefers-reduced-motion");
    return noopControl();
  }
  const isFullPage = !selector || selector === "body" || selector === document.body;
  let containers = [];
  if (!isFullPage) {
    if (typeof selector === "string") {
      containers = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      containers = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      containers = Array.from(selector);
    }
    if (containers.length === 0) {
      console.warn("[Domma.effects.tickerTape] No elements found for selector:", selector);
      return null;
    }
  }
  const colours = resolveTickerPalette(opts.palette);
  let running = false;
  let paused = false;
  let animationFrame = null;
  const instanceId = `domma-ticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const canvases = [];
  let resizeObserver = null;
  let lastFrame = null;
  function createParticle(width, height, fromTop) {
    const stripW = opts.minWidth + Math.random() * (opts.maxWidth - opts.minWidth);
    const stripH = opts.minHeight + Math.random() * (opts.maxHeight - opts.minHeight);
    return {
      x: Math.random() * width,
      // Stagger initial Y across the height when seeding the canvas; otherwise spawn just above
      y: fromTop ? -stripH - Math.random() * 40 : Math.random() * -height,
      vy: (1 + Math.random() * 2.2) * opts.speed,
      // base fall velocity
      vx: (Math.random() - 0.5) * 0.4 * opts.speed,
      // gentle drift
      swayPhase: Math.random() * Math.PI * 2,
      swayFreq: 5e-3 + Math.random() * 0.01,
      width: stripW,
      height: stripH,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * opts.rotationSpeed * Math.PI / 180,
      flipPhase: Math.random() * Math.PI * 2,
      flipSpeed: 0.018 + Math.random() * 0.035,
      curlPhase: Math.random() * Math.PI * 2,
      alpha: 1,
      colour: colours[Math.floor(Math.random() * colours.length)],
      alive: true
    };
  }
  function createCanvas(container, isFixed) {
    const canvas = document.createElement("canvas");
    canvas.id = instanceId + (canvases.length > 0 ? `-${canvases.length}` : "");
    canvas.setAttribute("data-domma-effect", "ticker-tape");
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = opts.zIndex;
    if (isFixed) {
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    } else {
      const computedPosition = window.getComputedStyle(container).position;
      if (computedPosition === "static") {
        container.style.position = "relative";
      }
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = container.offsetWidth || container.getBoundingClientRect().width;
      canvas.height = container.offsetHeight || container.getBoundingClientRect().height;
      container.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");
    const entry = { canvas, ctx, particles: [], container, isFixed, burstFired: false };
    resizeCanvas(entry);
    return entry;
  }
  function seedParticles(entry) {
    entry.particles = [];
    if (opts.burst) {
      for (let i = 0; i < opts.burstCount; i++) {
        const p = createParticle(entry.width, entry.height, false);
        p.y = -Math.random() * entry.height * 1.5;
        entry.particles.push(p);
      }
      entry.burstFired = true;
    } else {
      const initial = Math.floor(opts.density * 0.5);
      for (let i = 0; i < initial; i++) {
        entry.particles.push(createParticle(entry.width, entry.height, false));
      }
    }
  }
  function resizeCanvas(entry) {
    const bounds = entry.isFixed ? { width: window.innerWidth, height: window.innerHeight } : entry.container.getBoundingClientRect();
    entry.width = bounds.width || entry.container.offsetWidth || 1;
    entry.height = bounds.height || entry.container.offsetHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    entry.canvas.width = Math.round(entry.width * dpr);
    entry.canvas.height = Math.round(entry.height * dpr);
    entry.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  if (isFullPage) {
    const entry = createCanvas(document.body, true);
    entry.isFixed = true;
    seedParticles(entry);
    canvases.push(entry);
    const onWindowResize = () => canvases.forEach((e) => resizeCanvas(e));
    window.addEventListener("resize", onWindowResize);
    canvases[0]._resizeHandler = onWindowResize;
  } else {
    containers.forEach((container) => {
      const entry = createCanvas(container, false);
      entry.isFixed = false;
      seedParticles(entry);
      canvases.push(entry);
    });
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        canvases.forEach((e) => resizeCanvas(e));
      });
      containers.forEach((c) => resizeObserver.observe(c));
    }
  }
  function animate(now = performance.now()) {
    if (!running || paused) return;
    const frames = lastFrame === null ? 1 : Math.min(3, Math.max(0, (now - lastFrame) / (1e3 / 60)));
    lastFrame = now;
    canvases.forEach((entry) => {
      const { canvas, ctx, particles } = entry;
      ctx.clearRect(0, 0, entry.width, entry.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        advanceTickerStrip(p, entry.height, opts, frames);
        if (p.alive) {
          drawTickerStrip(ctx, p);
        } else {
          particles.splice(i, 1);
        }
      }
      if (!opts.burst) {
        const target = opts.density;
        while (particles.length < target && Math.random() < 0.6) {
          particles.push(createParticle(entry.width, entry.height, true));
        }
      }
    });
    animationFrame = requestAnimationFrame(animate);
  }
  function startAnimation() {
    if (running) return;
    running = true;
    paused = false;
    lastFrame = null;
    animate();
  }
  startAnimation();
  console.log(`[Domma.effects.tickerTape] Initialised (${isFullPage ? "full-page" : "container"} mode, palette: ${Array.isArray(opts.palette) ? "custom" : opts.palette})`);
  return {
    pause() {
      if (!running || paused) return;
      paused = true;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    },
    resume() {
      if (!running || !paused) return;
      paused = false;
      lastFrame = null;
      animate();
    },
    stop() {
      running = false;
      paused = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    },
    restart() {
      this.stop();
      canvases.forEach((e) => seedParticles(e));
      startAnimation();
    },
    destroy() {
      this.stop();
      if (isFullPage && canvases[0]?._resizeHandler) {
        window.removeEventListener("resize", canvases[0]._resizeHandler);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      canvases.forEach(({ canvas }) => {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      });
      canvases.length = 0;
    },
    isRunning() {
      return running && !paused;
    },
    isPaused() {
      return running && paused;
    }
  };
}

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
export function butterflies(selector, options = {}) {
  const defaults = {
    palette: 'meadow',
    density: 18,
    speed: 1,
    wander: 1,
    riseSpeed: 0.4,
    flapSpeed: 1,
    minSize: 14,
    maxSize: 26,
    twoTone: true,
    burst: false,
    burstCount: 40,
    zIndex: 1,
    respectMotionPreference: true
  };

  const opts = { ...defaults, ...options };

  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.butterflies] Disabled due to prefers-reduced-motion');
    return noopControl();
  }

  const isFullPage = !selector || selector === 'body' || selector === document.body;

  let containers = [];
  if (!isFullPage) {
    if (typeof selector === 'string') {
      containers = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      containers = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      containers = Array.from(selector);
    }
    if (containers.length === 0) {
      console.warn('[Domma.effects.butterflies] No elements found for selector:', selector);
      return null;
    }
  }

  const colours = resolvePalette(opts.palette);

  let running = false;
  let paused = false;
  let animationFrame = null;
  const instanceId = `domma-butterflies-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const canvases = [];
  let resizeObserver = null;

  // ── Particle (butterfly) ──────────────────────────────────────────────────

  function createButterfly(w, h) {
    const size = opts.minSize + Math.random() * (opts.maxSize - opts.minSize);
    const edge = Math.random();
    let x, y;
    if (edge < 0.6) { x = Math.random() * w; y = h + size; }                 // bottom
    else if (edge < 0.8) { x = -size; y = h * (0.4 + Math.random() * 0.6); } // lower-left
    else { x = w + size; y = h * (0.4 + Math.random() * 0.6); }              // lower-right
    const heading = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;              // roughly upward
    const upper = colours[Math.floor(Math.random() * colours.length)];
    const lower = opts.twoTone ? colours[Math.floor(Math.random() * colours.length)] : upper;
    return {
      x, y, heading,
      targetHeading: heading,
      speed: 0.6 + Math.random() * 0.8,
      wanderTimer: Math.random() * 60,
      flapPhase: Math.random() * Math.PI * 2,
      flapSpeed: (0.18 + Math.random() * 0.12) * opts.flapSpeed,
      size,
      colourUpper: upper,
      colourLower: lower,
      alpha: 1,
      alive: true
    };
  }

  // DEFAULT flight core - constants intended to be tuned later.
  function updateButterfly(b, w, h) {
    b.wanderTimer -= 1;
    if (b.wanderTimer <= 0) {
      b.targetHeading = -Math.PI / 2 + (Math.random() - 0.5) * (1.4 * opts.wander);
      b.wanderTimer = 30 + Math.random() * (60 / Math.max(0.2, opts.wander));
    }
    let diff = b.targetHeading - b.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    b.heading += diff * 0.05 * opts.wander;

    const v = b.speed * opts.speed;
    b.x += Math.cos(b.heading) * v + Math.sin(b.flapPhase) * 0.3;
    b.y += Math.sin(b.heading) * v - opts.riseSpeed * opts.speed;
    b.flapPhase += b.flapSpeed;

    if (b.y + b.size < 0 || b.y - b.size > h * 2 || b.x < -b.size * 3 || b.x > w + b.size * 3) {
      b.alive = false;
    }
  }

  // ── Canvas setup (mirrors tickerTape) ─────────────────────────────────────

  function createCanvas(container, isFixed) {
    const canvas = document.createElement('canvas');
    canvas.id = instanceId + (canvases.length > 0 ? `-${canvases.length}` : '');
    canvas.setAttribute('data-domma-effect', 'butterflies');
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = opts.zIndex;

    if (isFixed) {
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    } else {
      if (window.getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = container.offsetWidth || container.getBoundingClientRect().width;
      canvas.height = container.offsetHeight || container.getBoundingClientRect().height;
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    return { canvas, ctx, particles: [], container, burstFired: false };
  }

  function seedParticles(entry) {
    entry.particles = [];
    if (opts.burst) {
      for (let i = 0; i < opts.burstCount; i++) {
        entry.particles.push(createButterfly(entry.canvas.width, entry.canvas.height));
      }
      entry.burstFired = true;
    } else {
      const initial = Math.floor(opts.density * 0.5);
      for (let i = 0; i < initial; i++) {
        entry.particles.push(createButterfly(entry.canvas.width, entry.canvas.height));
      }
    }
  }

  function resizeCanvas(entry) {
    if (entry.isFixed) {
      entry.canvas.width = window.innerWidth;
      entry.canvas.height = window.innerHeight;
    } else {
      const rect = entry.container.getBoundingClientRect();
      entry.canvas.width = rect.width || entry.container.offsetWidth;
      entry.canvas.height = rect.height || entry.container.offsetHeight;
    }
  }

  // ── Initialise ────────────────────────────────────────────────────────────

  if (isFullPage) {
    const entry = createCanvas(document.body, true);
    entry.isFixed = true;
    seedParticles(entry);
    canvases.push(entry);
    const onWindowResize = () => canvases.forEach(e => resizeCanvas(e));
    window.addEventListener('resize', onWindowResize);
    canvases[0]._resizeHandler = onWindowResize;
  } else {
    containers.forEach(container => {
      const entry = createCanvas(container, false);
      entry.isFixed = false;
      seedParticles(entry);
      canvases.push(entry);
    });
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => canvases.forEach(e => resizeCanvas(e)));
      containers.forEach(c => resizeObserver.observe(c));
    }
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  function animate() {
    if (!running || paused) return;
    canvases.forEach(entry => {
      const { canvas, ctx, particles } = entry;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        updateButterfly(p, canvas.width, canvas.height);
        if (p.alive) {
          drawIllustratedButterfly(ctx, p);
        } else {
          particles.splice(i, 1);
        }
      }
      if (!opts.burst) {
        while (particles.length < opts.density && Math.random() < 0.3) {
          particles.push(createButterfly(canvas.width, canvas.height));
        }
      }
    });
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (running) return;
    running = true;
    paused = false;
    animate();
  }

  startAnimation();
  console.log(`[Domma.effects.butterflies] Initialised (${isFullPage ? 'full-page' : 'container'} mode, palette: ${Array.isArray(opts.palette) ? 'custom' : opts.palette})`);

  return {
    pause() {
      if (!running || paused) return;
      paused = true;
      if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    },
    resume() {
      if (!running || !paused) return;
      paused = false;
      animate();
    },
    stop() {
      running = false;
      paused = false;
      if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    },
    restart() {
      this.stop();
      canvases.forEach(e => seedParticles(e));
      startAnimation();
    },
    destroy() {
      this.stop();
      if (isFullPage && canvases[0]?._resizeHandler) {
        window.removeEventListener('resize', canvases[0]._resizeHandler);
      }
      if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
      canvases.forEach(({ canvas }) => {
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      });
      canvases.length = 0;
    },
    isRunning() { return running && !paused; },
    isPaused() { return running && paused; }
  };
}

// ── Strobe lighting presets ─────────────────────────────────────────────────

/**
 * Strobe-lighting presets: name -> option bundle.
 * @type {Record<'club'|'concert'|'police'|'searchlight'|'scanner'|'mood', StrobeOptions>}
 */
export const STROBE_PRESETS = {
  club:        { origins: ['tl', 'tr', 'bl', 'br'], motion: 'sweep',  sweepArc: 100, speed: 1,    beamWidth: 16, flicker: true,  hz: 10, colours: ['#ffffff', '#38bdf8', '#f472b6', '#a855f7'], intensity: 0.7 },
  concert:     { origins: ['tl', 'tr'],             motion: 'sweep',  sweepArc: 120, speed: 0.8,  beamWidth: 18, flicker: true,  hz: 6,  colours: ['#f43f5e', '#fb923c', '#facc15', '#22c55e', '#3b82f6'], intensity: 0.75 },
  police:      { origins: ['tl', 'tr'],             motion: 'sweep',  sweepArc: 70,  speed: 2.2,  beamWidth: 22, flicker: true,  hz: 8,  colours: ['#ef4444', '#3b82f6'], intensity: 0.85 },
  searchlight: { origins: ['bl', 'br'],             motion: 'rotate', sweepArc: 90,  speed: 0.5,  beamWidth: 12, flicker: false, hz: 0,  colours: ['#fffbe6', '#fde68a'], intensity: 0.6 },
  scanner:     { origins: ['tl', 'tr', 'bl', 'br'], motion: 'sweep',  sweepArc: 60,  speed: 1.6,  beamWidth: 8,  flicker: false, hz: 0,  colours: ['#22d3ee'], intensity: 0.7 },
  mood:        { origins: ['tl', 'tr', 'bl', 'br'], motion: 'sweep',  sweepArc: 140, speed: 0.35, beamWidth: 28, flicker: false, hz: 0,  colours: ['#a855f7', '#6366f1', '#ec4899', '#38bdf8'], intensity: 0.45 }
};

/**
 * Resolve a strobe-lighting preset name to its option bundle.
 * Unknown names warn and fall back to 'club'.
 * @param {string} name
 * @returns {StrobeOptions}
 */
export function resolveStrobePreset(name) {
  if (name && STROBE_PRESETS[name]) return STROBE_PRESETS[name];
  if (name) console.warn(`[Domma.effects.strobe] Unknown preset '${name}', using 'club'.`);
  return STROBE_PRESETS.club;
}

/** Convert a #rgb / #rrggbb hex colour to an rgba() string with the given alpha. */
function hexToRgba(hex, alpha) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
export function strobe(selector, options = {}) {
  const HARD_DEFAULTS = {
    preset: 'club',
    origins: ['tl', 'tr', 'bl', 'br'],
    motion: 'sweep',
    sweepArc: 100,
    speed: 1,
    beamWidth: 16,
    flicker: true,
    hz: 10,
    colours: ['#ffffff', '#38bdf8', '#f472b6', '#a855f7'],
    intensity: 0.7,
    duration: null,
    zIndex: 9999,
    respectMotionPreference: true
  };

  const preset = resolveStrobePreset(options.preset || 'club');
  const opts = { ...HARD_DEFAULTS, ...preset, ...options };

  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.strobe] Disabled due to prefers-reduced-motion');
    return noopControl();
  }

  if (opts.flicker && opts.hz > 5) {
    console.warn(`[Domma.effects.strobe] flicker hz=${opts.hz} exceeds 5Hz - rapid flashing can trigger photosensitive seizures.`);
  }

  const isFullPage = !selector || selector === 'body' || selector === document.body;

  let containers = [];
  if (!isFullPage) {
    if (typeof selector === 'string') {
      containers = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      containers = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      containers = Array.from(selector);
    }
    if (containers.length === 0) {
      console.warn('[Domma.effects.strobe] No elements found for selector:', selector);
      return null;
    }
  }

  let running = false;
  let paused = false;
  let animationFrame = null;
  let stopTimer = null;
  const instanceId = `domma-strobe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const canvases = [];
  let resizeObserver = null;

  function cornerPos(corner, w, h) {
    switch (corner) {
      case 'tr': return { x: w, y: 0 };
      case 'bl': return { x: 0, y: h };
      case 'br': return { x: w, y: h };
      case 'tl':
      default:   return { x: 0, y: 0 };
    }
  }

  function buildBeams() {
    return opts.origins.map((corner, i) => ({
      corner,
      colour: opts.colours[i % opts.colours.length],
      phase: (i / Math.max(1, opts.origins.length)) * Math.PI * 2
    }));
  }

  // Soft feathered beam: a wide dim halo, the main beam, and a bright narrow
  // core, layered additively so the cone has soft edges and a glowing centre
  // line rather than a hard triangular wedge. `mul` scales brightness (used by
  // the smooth flicker pulse).
  const BEAM_LAYERS = [
    { widthMul: 1.9, alphaMul: 0.16 },
    { widthMul: 1.0, alphaMul: 0.5 },
    { widthMul: 0.45, alphaMul: 1.0 }
  ];

  function drawBeam(ctx, ox, oy, angle, colour, w, h, mul) {
    const len = Math.hypot(w, h) * 1.5;
    const baseHalf = ((opts.beamWidth * Math.PI) / 180) / 2;
    for (let i = 0; i < BEAM_LAYERS.length; i++) {
      const layer = BEAM_LAYERS[i];
      const half = baseHalf * layer.widthMul;
      const a = opts.intensity * layer.alphaMul * mul;
      if (a <= 0.003) continue;
      const x1 = ox + Math.cos(angle - half) * len;
      const y1 = oy + Math.sin(angle - half) * len;
      const x2 = ox + Math.cos(angle + half) * len;
      const y2 = oy + Math.sin(angle + half) * len;
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, len);
      grad.addColorStop(0, hexToRgba(colour, a));
      grad.addColorStop(0.4, hexToRgba(colour, a * 0.4));
      grad.addColorStop(1, hexToRgba(colour, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function createCanvas(container, isFixed) {
    const canvas = document.createElement('canvas');
    canvas.id = instanceId + (canvases.length > 0 ? `-${canvases.length}` : '');
    canvas.setAttribute('data-domma-effect', 'strobe');
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = opts.zIndex;

    if (isFixed) {
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    } else {
      if (window.getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = container.offsetWidth || container.getBoundingClientRect().width;
      canvas.height = container.offsetHeight || container.getBoundingClientRect().height;
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    return { canvas, ctx, container, beams: buildBeams() };
  }

  function resizeCanvas(entry) {
    if (entry.isFixed) {
      entry.canvas.width = window.innerWidth;
      entry.canvas.height = window.innerHeight;
    } else {
      const rect = entry.container.getBoundingClientRect();
      entry.canvas.width = rect.width || entry.container.offsetWidth;
      entry.canvas.height = rect.height || entry.container.offsetHeight;
    }
  }

  if (isFullPage) {
    const entry = createCanvas(document.body, true);
    entry.isFixed = true;
    canvases.push(entry);
    const onWindowResize = () => canvases.forEach(e => resizeCanvas(e));
    window.addEventListener('resize', onWindowResize);
    canvases[0]._resizeHandler = onWindowResize;
  } else {
    containers.forEach(container => {
      const entry = createCanvas(container, false);
      entry.isFixed = false;
      canvases.push(entry);
    });
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => canvases.forEach(e => resizeCanvas(e)));
      containers.forEach(c => resizeObserver.observe(c));
    }
  }

  function now() {
    return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  function animate() {
    if (!running || paused) return;
    // Smooth brightness pulse instead of a hard on/off blink. Oscillates
    // between a floor and full brightness at `hz` pulses per second, so the
    // beams breathe rather than strobe harshly.
    let flickerMul = 1;
    if (opts.flicker) {
      const cycle = 0.5 + 0.5 * Math.sin((now() / 1000) * opts.hz * Math.PI * 2);
      flickerMul = 0.4 + 0.6 * cycle;
    }
    canvases.forEach(entry => {
      const { canvas, ctx, beams } = entry;
      const w = canvas.width;
      const h = canvas.height;
      // Fade the previous frame slightly (rather than clearing it) so beams
      // leave a soft trail as they move - smooth motion, and it keeps the
      // overlay transparent over the page (destination-out lowers alpha only).
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const cx = w / 2;
      const cy = h / 2;
      beams.forEach(beam => {
        const { x: ox, y: oy } = cornerPos(beam.corner, w, h);
        let angle;
        if (opts.motion === 'rotate') {
          angle = beam.phase;
          beam.phase += 0.01 * opts.speed;
        } else {
          const centre = Math.atan2(cy - oy, cx - ox);
          angle = centre + Math.sin(beam.phase) * ((opts.sweepArc * Math.PI) / 180) / 2;
          beam.phase += 0.02 * opts.speed;
        }
        drawBeam(ctx, ox, oy, angle, beam.colour, w, h, flickerMul);
      });
      ctx.globalCompositeOperation = 'source-over';
    });
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (running) return;
    running = true;
    paused = false;
    animate();
    if (opts.duration) {
      stopTimer = setTimeout(() => api.stop(), opts.duration);
    }
  }

  const api = {
    pause() {
      if (!running || paused) return;
      paused = true;
      if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    },
    resume() {
      if (!running || !paused) return;
      paused = false;
      animate();
    },
    stop() {
      running = false;
      paused = false;
      if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
      if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
      canvases.forEach(({ canvas, ctx }) => ctx && ctx.clearRect(0, 0, canvas.width, canvas.height));
    },
    restart() {
      this.stop();
      canvases.forEach(e => { e.beams = buildBeams(); });
      startAnimation();
    },
    destroy() {
      this.stop();
      if (isFullPage && canvases[0]?._resizeHandler) {
        window.removeEventListener('resize', canvases[0]._resizeHandler);
      }
      if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
      canvases.forEach(({ canvas }) => {
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      });
      canvases.length = 0;
    },
    isRunning() { return running && !paused; },
    isPaused() { return running && paused; }
  };

  startAnimation();
  console.log(`[Domma.effects.strobe] Initialised (${isFullPage ? 'full-page' : 'container'} mode, preset: ${opts.preset})`);
  return api;
}

// ── Ticker tape palette resolution ──────────────────────────────────────────

/**
 * Named colour palettes for tickerTape and butterflies: name -> CSS colours.
 * @type {Record<string, string[]>}
 */
export const EFFECT_PALETTES = {
  rainbow:  ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
  festive:  ['#dc2626', '#16a34a', '#fbbf24', '#3b82f6', '#a855f7', '#ec4899'],
  gold:     ['#fbbf24', '#f59e0b', '#fde68a', '#fffbeb', '#d97706', '#fcd34d'],
  silver:   ['#e5e7eb', '#cbd5e1', '#94a3b8', '#f8fafc', '#9ca3af', '#d1d5db'],
  pastel:   ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fef3c7', '#ddd6fe', '#fed7aa'],
  mono:     ['#1f2937', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'],
  sunset:   ['#f43f5e', '#fb923c', '#facc15', '#f59e0b', '#ec4899'],
  ocean:    ['#0ea5e9', '#22d3ee', '#06b6d4', '#3b82f6', '#6366f1'],
  forest:   ['#16a34a', '#65a30d', '#84cc16', '#22c55e', '#15803d'],
  bridal:   ['#ffffff', '#fef3c7', '#fce7f3', '#fbcfe8', '#f9a8d4'],
  meadow:   ['#84cc16', '#a3e635', '#bbf7d0', '#bae6fd', '#fef08a', '#ddd6fe'],
  firefly:  ['#fde68a', '#facc15', '#f59e0b', '#a3e635', '#fef9c3'],
  aqua:     ['#a5f3fc', '#67e8f9', '#22d3ee', '#bae6fd', '#e0f2fe'],
  autumn:   ['#b45309', '#d97706', '#f59e0b', '#ca8a04', '#92400e', '#dc2626']
};

/**
 * Resolve a palette specifier into an array of CSS colour strings.
 * - Named keys ('meadow', 'rainbow', …) → preset palette.
 * - 'theme' → reads CSS custom properties from the active Domma theme.
 * - Array → returned as-is.
 *
 * @param {string|string[]} spec
 * @returns {string[]}
 */
export function resolvePalette(spec) {
  if (Array.isArray(spec) && spec.length > 0) {
    return spec;
  }
  if (typeof spec === 'string' && EFFECT_PALETTES[spec]) {
    return EFFECT_PALETTES[spec];
  }
  if (spec === 'theme' || !spec) {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const vars = ['--dm-primary', '--dm-secondary', '--dm-success', '--dm-warning', '--dm-danger', '--dm-info'];
    const resolved = vars
      .map(name => styles.getPropertyValue(name).trim())
      .filter(value => value && value !== 'transparent');
    if (resolved.length > 0) return resolved;
    return EFFECT_PALETTES.rainbow;
  }
  console.warn(`[Domma.effects] Unknown palette '${spec}', using rainbow.`);
  return EFFECT_PALETTES.rainbow;
}

// Back-compat alias - tickerTape still calls resolveTickerPalette internally.
const resolveTickerPalette = resolvePalette;

// Export as default for module usage
/** @type {Effects} */
export default {
  breathe,
  pulse,
  scribe,
  reveal,
  scramble,
  counter,
  ripple,
  shake,
  twinkle,
  tickerTape,
  butterflies,
  strobe
};
