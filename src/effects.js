/**
 * Domma Effects Module
 * Visual effects and animations for UI elements
 *
 * @module effects
 */

/**
 * Apply a sinusoidal breathing animation to elements
 * Creates a gentle up-and-down floating motion
 *
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {number} options.amplitude - Vertical movement distance in pixels (default: 6)
 * @param {number} options.duration - Complete animation cycle time in milliseconds (default: 3000)
 * @param {string} options.easing - CSS easing function (default: 'ease-in-out')
 * @param {number} options.delay - Initial delay before animation starts in milliseconds (default: 0)
 * @param {number} options.stagger - Delay between multiple elements in milliseconds (default: 0)
 * @param {number|string} options.iterations - Number of cycles or 'infinite' (default: 'infinite')
 * @param {boolean} options.pauseOnHover - Pause animation when hovering (default: false)
 * @param {boolean} options.autoStart - Start animation immediately (default: true)
 * @param {boolean} options.respectMotionPreference - Honor prefers-reduced-motion (default: true)
 * @param {Function} options.onStart - Callback when animation starts
 * @param {Function} options.onComplete - Callback when animation completes
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy() methods
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
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {number} options.scale - Scale factor (e.g., 1.05 = 5% larger) (default: 1.05)
 * @param {number} options.duration - Complete animation cycle time in milliseconds (default: 2000)
 * @param {string} options.easing - CSS easing function (default: 'ease-in-out')
 * @param {number} options.delay - Initial delay before animation starts (default: 0)
 * @param {number} options.stagger - Delay between multiple elements (default: 0)
 * @param {number|string} options.iterations - Number of cycles or 'infinite' (default: 'infinite')
 * @param {boolean} options.pauseOnHover - Pause animation when hovering (default: false)
 * @param {boolean} options.respectMotionPreference - Honor prefers-reduced-motion (default: true)
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy() methods
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
 * Apply a scribe effect to elements
 * Types text with configurable granularity (characters, words, or sentences) and optional entrance effects
 *
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {string} options.mode - Rendering granularity: 'typewriter' (char-by-char), 'word', or 'sentence' (default: 'typewriter')
 * @param {number} options.speed - Milliseconds per unit when typing (default: 50)
 * @param {number} options.deleteSpeed - Milliseconds per unit when deleting (default: 30)
 * @param {boolean} options.cursor - Show blinking cursor (default: true)
 * @param {string} options.cursorChar - Cursor character (default: '|')
 * @param {boolean} options.cursorBlink - Animate cursor blink (default: true)
 * @param {boolean|number} options.loop - Loop count: true = infinite, number = specific count (default: false)
 * @param {number} options.loopDelay - Delay between loops in milliseconds (default: 1000)
 * @param {boolean} options.pauseOnHover - Pause animation when hovering (default: false)
 * @param {boolean} options.autoStart - Start animation immediately (default: true)
 * @param {boolean} options.respectMotionPreference - Honor prefers-reduced-motion (default: true)
 * @param {Array<Object>} options.actions - Action queue to execute
 * @param {Function} options.onStart - Callback when animation starts
 * @param {Function} options.onComplete - Callback when animation completes
 * @param {Function} options.onCharacter - Callback for each unit rendered (unit, index) - unit can be char/word/sentence depending on mode
 * @param {Function} options.onRender - Callback when render action completes (text)
 * @param {Function} options.onUndoRender - Callback when undoRender action completes (deletedText)
 * @param {Function} options.onLoop - Callback on each loop iteration (loopCount)
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy() methods
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

  // Respect motion preferences - return no-op control object
  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.scribe] Disabled due to prefers-reduced-motion');
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

  // Parse wait duration (supports '2s', '500ms', or raw number)
  function parseWait(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      if (value.endsWith('s')) {
        return parseFloat(value) * 1000;
      }
      if (value.endsWith('ms')) {
        return parseFloat(value);
      }
    }
    return 0;
  }

  // State for each element
  const elementStates = elements.map(el => ({
    element: el,
    unitSpans: [],
    cursorSpan: null,
    currentAction: 0,
    charTimerId: null,
    waitTimerId: null,
    paused: false,
    loopCount: 0,
    lastRenderStart: 0
  }));

  // Track hover handlers
  const hoverHandlers = new Map();

  // Initialize cursors
  elementStates.forEach(state => {
    if (opts.cursor) {
      state.cursorSpan = document.createElement('span');

      // Base cursor classes
      let cursorClasses = ['dm-scribe-cursor'];

      // Add cursor type class
      if (opts.cursorType === 'block') {
        cursorClasses.push('dm-scribe-cursor-block');
      } else if (opts.cursorType === 'underline') {
        cursorClasses.push('dm-scribe-cursor-underline');
      } else {
        cursorClasses.push('dm-scribe-cursor-caret');
      }

      // Add no-blink class if needed
      if (!opts.cursorBlink) {
        cursorClasses.push('dm-scribe-cursor-no-blink');
      }

      state.cursorSpan.className = cursorClasses.join(' ');
      // Underline cursor uses border-bottom, so no text content needed
      state.cursorSpan.textContent = opts.cursorType === 'underline' ? '\u00A0' : opts.cursorChar;
      state.element.appendChild(state.cursorSpan);
    }
  });

  // Process action queue
  async function processActions(state) {
    if (state.paused) return;

    if (state.currentAction >= opts.actions.length) {
      // Queue complete - handle looping
      if (opts.loop === true || (typeof opts.loop === 'number' && state.loopCount < opts.loop - 1)) {
        state.loopCount++;
        if (opts.onLoop) opts.onLoop(state.loopCount);

        // Clear element content (keep cursor)
        state.unitSpans.forEach(span => span.remove());
        state.unitSpans = [];
        state.lastRenderStart = 0;
        state.currentAction = 0;

        // Delay before restart
        state.waitTimerId = setTimeout(() => {
          if (!state.paused) processActions(state);
        }, opts.loopDelay);
      } else {
        // Complete
        if (opts.onComplete) opts.onComplete();
      }
      return;
    }

    const action = opts.actions[state.currentAction];

    if (action.render !== undefined) {
      await handleRender(state, action);
    } else if (action.wait !== undefined) {
      await handleWait(state, action);
    } else if (action.undoRender !== undefined) {
      await handleUndoRender(state, action);
    }

    state.currentAction++;
    processActions(state);
  }

  // Split text into units based on mode
  function splitTextByMode(text, mode) {
    if (mode === 'word') {
      // Split on word boundaries, keeping whitespace attached to preceding word
      return text.match(/(\S+\s*)/g) || [];
    } else if (mode === 'sentence') {
      // Split on sentence endings, keeping punctuation and whitespace
      const sentences = text.match(/([^.!?]*[.!?]+\s*)/g) || [];
      // If text doesn't end with sentence punctuation, add remainder as final sentence
      const lastSentence = sentences.join('');
      if (lastSentence.length < text.length) {
        sentences.push(text.substring(lastSentence.length));
      }
      return sentences;
    } else {
      // Typewriter mode - split into individual characters
      return text.split('');
    }
  }

  // Get CSS class name based on mode
  function getUnitClassName(mode) {
    if (mode === 'word') return 'dm-scribe-word';
    if (mode === 'sentence') return 'dm-scribe-sentence';
    return 'dm-scribe-char';
  }

  // Handle render action
  function handleRender(state, action) {
    return new Promise(resolve => {
      const text = String(action.render);
      const effect = action.effect || 'none';
      const units = splitTextByMode(text, opts.mode);
      const unitClassName = getUnitClassName(opts.mode);

      state.lastRenderStart = state.unitSpans.length;
      let unitIndex = 0;
      let lastFrameTime = performance.now();

      function typeUnit(currentTime) {
        if (state.paused) return;

        if (unitIndex >= units.length) {
          if (opts.onRender) opts.onRender(text);
          resolve();
          return;
        }

        // Throttle to desired speed using RAF for smoother timing
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < opts.speed) {
          state.charTimerId = requestAnimationFrame(typeUnit);
          return;
        }

        lastFrameTime = currentTime;

        const unit = units[unitIndex];
        const span = document.createElement('span');
        span.className = unitClassName;
        span.textContent = unit;

        // Apply entrance effect
        if (effect === 'fade') {
          span.classList.add('dm-scribe-fade');
        } else if (effect === 'bounce') {
          span.classList.add('dm-scribe-bounce');
        } else if (effect === 'glow') {
          span.classList.add('dm-scribe-glow');
        }

        // Use DocumentFragment for smoother insertion
        const fragment = document.createDocumentFragment();
        fragment.appendChild(span);

        // Insert before cursor
        if (state.cursorSpan) {
          state.element.insertBefore(fragment, state.cursorSpan);
        } else {
          state.element.appendChild(fragment);
        }

        state.unitSpans.push(span);

        if (opts.onCharacter) {
          opts.onCharacter(unit, state.unitSpans.length - 1);
        }

        unitIndex++;
        state.charTimerId = requestAnimationFrame(typeUnit);
      }

      state.charTimerId = requestAnimationFrame(typeUnit);
    });
  }

  // Handle wait action
  function handleWait(state, action) {
    return new Promise(resolve => {
      const duration = parseWait(action.wait);
      state.waitTimerId = setTimeout(() => {
        if (!state.paused) resolve();
      }, duration);
    });
  }

  // Handle undoRender action
  function handleUndoRender(state, action) {
    return new Promise(resolve => {
      let unitsToDelete = 0;
      const undoValue = action.undoRender;

      if (undoValue === true) {
        // Delete all from last render
        unitsToDelete = state.unitSpans.length - state.lastRenderStart;
      } else if (undoValue === 'all') {
        // Delete everything
        unitsToDelete = state.unitSpans.length;
      } else if (typeof undoValue === 'number') {
        // Delete specific count
        unitsToDelete = Math.min(undoValue, state.unitSpans.length);
      }

      if (unitsToDelete === 0) {
        resolve();
        return;
      }

      const deletedUnits = [];
      let deleted = 0;
      let lastFrameTime = performance.now();

      function deleteUnit(currentTime) {
        if (state.paused) return;

        if (deleted >= unitsToDelete) {
          const deletedText = deletedUnits.reverse().join('');
          if (opts.onUndoRender) opts.onUndoRender(deletedText);
          resolve();
          return;
        }

        // Throttle to desired delete speed using RAF
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < opts.deleteSpeed) {
          state.charTimerId = requestAnimationFrame(deleteUnit);
          return;
        }

        lastFrameTime = currentTime;

        if (state.unitSpans.length > 0) {
          const span = state.unitSpans.pop();
          deletedUnits.push(span.textContent);
          span.remove();
        }

        deleted++;
        state.charTimerId = requestAnimationFrame(deleteUnit);
      }

      state.charTimerId = requestAnimationFrame(deleteUnit);
    });
  }

  // Start all elements
  elementStates.forEach(state => {
    if (opts.pauseOnHover) {
      const mouseEnterHandler = () => {
        state.paused = true;
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);
      };
      const mouseLeaveHandler = () => {
        state.paused = false;
        processActions(state);
      };

      state.element.addEventListener('mouseenter', mouseEnterHandler);
      state.element.addEventListener('mouseleave', mouseLeaveHandler);

      hoverHandlers.set(state.element, { mouseEnterHandler, mouseLeaveHandler });
    }

    if (opts.autoStart) {
      processActions(state);
    }
  });

  // Call onStart callback
  if (opts.onStart) {
    opts.onStart();
  }

  // Return control object
  return {
    /**
     * Pause the scribe animation
     */
    pause() {
      elementStates.forEach(state => {
        state.paused = true;
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);
      });
    },

    /**
     * Resume the scribe animation
     */
    resume() {
      elementStates.forEach(state => {
        state.paused = false;
        processActions(state);
      });
    },

    /**
     * Stop the scribe animation
     */
    stop() {
      elementStates.forEach(state => {
        state.paused = true;
        state.currentAction = opts.actions.length; // Mark as complete
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);
      });
    },

    /**
     * Restart the scribe animation from the beginning
     */
    restart() {
      elementStates.forEach(state => {
        // Clear all timers
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);

        // Clear content
        state.unitSpans.forEach(span => span.remove());
        state.unitSpans = [];
        state.currentAction = 0;
        state.loopCount = 0;
        state.lastRenderStart = 0;
        state.paused = false;

        // Restart
        processActions(state);
      });
    },

    /**
     * Destroy the scribe animation and clean up
     */
    destroy() {
      elementStates.forEach(state => {
        // Clear timers
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);

        // Remove all unit spans
        state.unitSpans.forEach(span => span.remove());

        // Remove cursor
        if (state.cursorSpan) {
          state.cursorSpan.remove();
        }

        // Remove hover handlers
        if (hoverHandlers.has(state.element)) {
          const handlers = hoverHandlers.get(state.element);
          state.element.removeEventListener('mouseenter', handlers.mouseEnterHandler);
          state.element.removeEventListener('mouseleave', handlers.mouseLeaveHandler);
          hoverHandlers.delete(state.element);
        }
      });
    },

    /**
     * Check if animation is running
     * @returns {boolean}
     */
    isRunning() {
      if (elementStates.length === 0) return false;
      const state = elementStates[0];
      return !state.paused && state.currentAction < opts.actions.length;
    },

    /**
     * Check if animation is paused
     * @returns {boolean}
     */
    isPaused() {
      if (elementStates.length === 0) return false;
      return elementStates[0].paused;
    }
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
 * @returns {Object}
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
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {string} options.animation - Animation type: 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom', 'flip' (default: 'fade')
 * @param {number} options.duration - Animation duration in ms (default: 600)
 * @param {string} options.easing - CSS easing function (default: 'ease-out')
 * @param {number} options.delay - Delay before animation in ms (default: 0)
 * @param {number} options.stagger - Delay between multiple elements in ms (default: 0)
 * @param {number} options.threshold - IntersectionObserver threshold 0-1 (default: 0.1)
 * @param {string} options.rootMargin - Observer root margin (default: '0px')
 * @param {boolean} options.once - Only animate once (default: true)
 * @param {boolean} options.respectMotionPreference - Honour prefers-reduced-motion (default: true)
 * @param {Function} options.onReveal - Callback per element when revealed
 * @returns {Object} Control object with destroy() method
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
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Ms per character resolve (default: 50)
 * @param {number} options.scrambleSpeed - Ms between scramble frame updates (default: 30)
 * @param {string} options.characters - Character pool for scramble (default: alphanumeric + symbols)
 * @param {string} options.revealOrder - 'left-to-right', 'right-to-left', 'random', 'center-out' (default: 'left-to-right')
 * @param {number} options.scrambleDuration - How long each char scrambles before resolving in ms (default: 800)
 * @param {number} options.stagger - Delay between multiple elements in ms (default: 0)
 * @param {boolean|number} options.loop - false, true (infinite), or number of loops (default: false)
 * @param {number} options.loopDelay - Ms between loops (default: 2000)
 * @param {boolean} options.respectMotionPreference - Honour prefers-reduced-motion (default: true)
 * @param {Function} options.onComplete - Callback when animation completes
 * @param {Function} options.onCharacter - Callback per character resolved (char, index)
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy() methods
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
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {number} options.from - Start value (default: 0)
 * @param {number} options.to - End value (required, or reads from element textContent)
 * @param {number} options.duration - Total count duration in ms (default: 2000)
 * @param {string} options.easing - 'linear', 'ease-out', 'ease-in-out' (default: 'ease-out')
 * @param {number} options.decimals - Decimal places (default: 0)
 * @param {string} options.separator - Thousands separator (default: ',')
 * @param {string} options.prefix - Text before number (default: '')
 * @param {string} options.suffix - Text after number (default: '')
 * @param {number} options.stagger - Delay between multiple elements in ms (default: 0)
 * @param {string} options.trigger - 'immediate' or 'scroll' (default: 'immediate')
 * @param {number} options.threshold - Observer threshold when trigger is scroll (default: 0.5)
 * @param {boolean} options.respectMotionPreference - Honour prefers-reduced-motion (default: true)
 * @param {Function} options.onUpdate - Callback on each frame (currentValue)
 * @param {Function} options.onComplete - Callback when counting completes
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy() methods
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
 * @param {string|Element|NodeList} selector - Element(s) to add ripple to
 * @param {Object} options - Configuration options
 * @param {string} options.colour - Ripple colour (default: 'rgba(255, 255, 255, 0.35)')
 * @param {number} options.duration - Ripple animation duration in ms (default: 600)
 * @param {number} options.opacity - Starting opacity (default: 0.35)
 * @param {boolean} options.unbounded - Allow ripple to overflow element (default: false)
 * @param {boolean} options.centered - Always ripple from centre (default: false)
 * @param {string} options.trigger - 'click', 'mousedown', 'pointerdown' (default: 'pointerdown')
 * @param {boolean} options.respectMotionPreference - Honour prefers-reduced-motion (default: true)
 * @returns {Object} Control object with destroy() method
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
 * @param {string|Element|NodeList} selector - Element(s) to shake
 * @param {Object} options - Configuration options
 * @param {number} options.intensity - Shake distance in px (default: 6)
 * @param {number} options.duration - Total shake duration in ms (default: 500)
 * @param {string} options.direction - 'horizontal', 'vertical', 'both' (default: 'horizontal')
 * @param {string} options.easing - CSS easing function (default: 'ease-in-out')
 * @param {number} options.iterations - Number of shake cycles (default: 1)
 * @param {number} options.stagger - Delay between elements in ms (default: 0)
 * @param {boolean} options.respectMotionPreference - Honour prefers-reduced-motion (default: true)
 * @param {Function} options.onComplete - Callback when shake completes
 * @returns {Object} Control object with stop(), restart(), destroy() methods
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
 * @param {string|Element|null} selector - CSS selector, Element, or null/'body' for full-page mode
 * @param {Object} options - Configuration options
 * @param {number} options.count - Number of stars (default: 100)
 * @param {number} options.minSize - Minimum star size in pixels (default: 1)
 * @param {number} options.maxSize - Maximum star size in pixels (default: 3)
 * @param {number} options.twinkleSpeed - Base oscillation speed (default: 0.003)
 * @param {string} options.colour - Star colour (default: 'rgba(255, 240, 200, 1)')
 * @param {number} options.zIndex - Canvas z-index (default: 1)
 * @param {'star'|'circle'} options.shape - Star shape; 'star' draws a 4-pointed star, 'circle' draws a dot (default: 'star')
 * @param {boolean} options.respectMotionPreference - Honour prefers-reduced-motion (default: true)
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy(), isRunning(), isPaused()
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
 * Ticker tape effect — colourful rectangular strips drop from the top of a
 * container (or the viewport), spinning, swaying, and fading as they fall.
 * Reminiscent of a ticker-tape parade. Pass `null` (or omit the selector)
 * for a full-page fixed overlay, or provide a selector to scope strips
 * inside a specific container.
 *
 * @param {string|Element|NodeList|HTMLElement[]|null} selector
 * @param {Object} options
 * @param {string|string[]} [options.palette] - Named theme palette (e.g.
 *   'theme', 'rainbow', 'gold', 'silver', 'festive', 'pastel', 'mono') or
 *   a custom array of CSS colour strings.
 * @param {number} [options.density] - Average strips on screen at any moment
 * @param {number} [options.speed] - Fall speed multiplier (1 = default)
 * @param {number} [options.sway] - Horizontal sway amplitude in pixels
 * @param {number} [options.rotationSpeed] - Max rotation degrees per frame
 * @param {number} [options.minWidth] - Minimum strip width in pixels
 * @param {number} [options.maxWidth] - Maximum strip width in pixels
 * @param {number} [options.minHeight] - Minimum strip height in pixels
 * @param {number} [options.maxHeight] - Maximum strip height in pixels
 * @param {number} [options.fadeStart] - Fraction of fall (0–1) before fade begins
 * @param {boolean} [options.burst] - If true, drops a single batch and stops respawning
 * @param {number} [options.burstCount] - Strips emitted in burst mode
 * @param {number} [options.zIndex]
 * @param {boolean} [options.respectMotionPreference]
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
    palette: 'theme',
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

  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.tickerTape] Disabled due to prefers-reduced-motion');
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
      console.warn('[Domma.effects.tickerTape] No elements found for selector:', selector);
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

  // ── Particle (rectangular tape strip) ────────────────────────────────────

  function createParticle(width, height, fromTop) {
    const stripW = opts.minWidth + Math.random() * (opts.maxWidth - opts.minWidth);
    const stripH = opts.minHeight + Math.random() * (opts.maxHeight - opts.minHeight);
    return {
      x: Math.random() * width,
      // Stagger initial Y across the height when seeding the canvas; otherwise spawn just above
      y: fromTop ? -stripH - Math.random() * 40 : Math.random() * -height,
      vy: (1 + Math.random() * 2.2) * opts.speed,           // base fall velocity
      vx: (Math.random() - 0.5) * 0.4 * opts.speed,         // gentle drift
      swayPhase: Math.random() * Math.PI * 2,
      swayFreq: 0.005 + Math.random() * 0.01,
      width: stripW,
      height: stripH,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: ((Math.random() - 0.5) * opts.rotationSpeed * Math.PI) / 180,
      colour: colours[Math.floor(Math.random() * colours.length)],
      alive: true
    };
  }

  function updateParticle(p, height) {
    p.swayPhase += p.swayFreq;
    p.x += p.vx + Math.sin(p.swayPhase) * (opts.sway * 0.02);
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    // Determine fade based on vertical position
    const progress = p.y / height;
    if (progress >= opts.fadeStart) {
      const fadeRange = 1 - opts.fadeStart;
      const fadeProgress = (progress - opts.fadeStart) / fadeRange;
      p.alpha = Math.max(0, 1 - fadeProgress);
    } else {
      p.alpha = 1;
    }

    // Mark dead once invisible or off-screen
    if (p.y - p.height > height || p.alpha <= 0.01) {
      p.alive = false;
    }
  }

  function drawParticle(ctx, p) {
    if (p.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.colour;
    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    ctx.restore();
  }

  // ── Canvas setup ─────────────────────────────────────────────────────────

  function createCanvas(container, isFixed) {
    const canvas = document.createElement('canvas');
    canvas.id = instanceId + (canvases.length > 0 ? `-${canvases.length}` : '');
    canvas.setAttribute('data-domma-effect', 'ticker-tape');
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
    return { canvas, ctx, particles: [], container, burstFired: false };
  }

  function seedParticles(entry) {
    entry.particles = [];
    if (opts.burst) {
      // In burst mode, scatter all strips above the canvas at varied heights
      for (let i = 0; i < opts.burstCount; i++) {
        const p = createParticle(entry.canvas.width, entry.canvas.height, false);
        // Stagger Y so they cascade rather than all arriving simultaneously
        p.y = -Math.random() * entry.canvas.height * 1.5;
        entry.particles.push(p);
      }
      entry.burstFired = true;
    } else {
      // Continuous mode: pre-fill so canvas isn't empty on start
      const initial = Math.floor(opts.density * 0.5);
      for (let i = 0; i < initial; i++) {
        entry.particles.push(createParticle(entry.canvas.width, entry.canvas.height, false));
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

  // ── Initialise ──────────────────────────────────────────────────────────

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
      resizeObserver = new ResizeObserver(() => {
        canvases.forEach(e => resizeCanvas(e));
      });
      containers.forEach(c => resizeObserver.observe(c));
    }
  }

  // ── Animation loop ──────────────────────────────────────────────────────

  function animate() {
    if (!running || paused) return;

    canvases.forEach(entry => {
      const { canvas, ctx, particles } = entry;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw alive particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        updateParticle(p, canvas.height);
        if (p.alive) {
          drawParticle(ctx, p);
        } else {
          particles.splice(i, 1);
        }
      }

      // Top up to maintain density (continuous mode only)
      if (!opts.burst) {
        const target = opts.density;
        // Stochastic spawn — gives a natural rather than uniform stream
        while (particles.length < target && Math.random() < 0.6) {
          particles.push(createParticle(canvas.width, canvas.height, true));
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
  console.log(`[Domma.effects.tickerTape] Initialised (${isFullPage ? 'full-page' : 'container'} mode, palette: ${Array.isArray(opts.palette) ? 'custom' : opts.palette})`);

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
      canvases.forEach(e => seedParticles(e));
      startAnimation();
    },
    destroy() {
      this.stop();
      if (isFullPage && canvases[0]?._resizeHandler) {
        window.removeEventListener('resize', canvases[0]._resizeHandler);
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

// ── Ticker tape palette resolution ──────────────────────────────────────────

const TICKER_PALETTES = {
  rainbow:  ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
  festive:  ['#dc2626', '#16a34a', '#fbbf24', '#3b82f6', '#a855f7', '#ec4899'],
  gold:     ['#fbbf24', '#f59e0b', '#fde68a', '#fffbeb', '#d97706', '#fcd34d'],
  silver:   ['#e5e7eb', '#cbd5e1', '#94a3b8', '#f8fafc', '#9ca3af', '#d1d5db'],
  pastel:   ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fef3c7', '#ddd6fe', '#fed7aa'],
  mono:     ['#1f2937', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'],
  sunset:   ['#f43f5e', '#fb923c', '#facc15', '#f59e0b', '#ec4899'],
  ocean:    ['#0ea5e9', '#22d3ee', '#06b6d4', '#3b82f6', '#6366f1'],
  forest:   ['#16a34a', '#65a30d', '#84cc16', '#22c55e', '#15803d'],
  bridal:   ['#ffffff', '#fef3c7', '#fce7f3', '#fbcfe8', '#f9a8d4']
};

/**
 * Resolve a palette specifier into an array of CSS colour strings.
 * - Named keys ('rainbow', 'festive', etc.) → preset palette.
 * - 'theme' → reads CSS custom properties from the active Domma theme.
 * - Array → returned as-is.
 */
function resolveTickerPalette(spec) {
  if (Array.isArray(spec) && spec.length > 0) {
    return spec;
  }
  if (typeof spec === 'string' && TICKER_PALETTES[spec]) {
    return TICKER_PALETTES[spec];
  }
  if (spec === 'theme' || !spec) {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const vars = [
      '--dm-primary',
      '--dm-secondary',
      '--dm-success',
      '--dm-warning',
      '--dm-danger',
      '--dm-info'
    ];
    const resolved = vars
      .map(name => styles.getPropertyValue(name).trim())
      .filter(value => value && value !== 'transparent');
    if (resolved.length > 0) return resolved;
    // Fallback if theme variables aren't loaded
    return TICKER_PALETTES.rainbow;
  }
  // Unknown string → fall back to rainbow rather than throwing
  console.warn(`[Domma.effects.tickerTape] Unknown palette '${spec}', using rainbow.`);
  return TICKER_PALETTES.rainbow;
}

// Export as default for module usage
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
  tickerTape
};
