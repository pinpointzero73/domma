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
 * Apply a typewriter effect to elements
 * Types text character-by-character with optional entrance effects
 *
 * @param {string|Element|NodeList} selector - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Milliseconds per character when typing (default: 50)
 * @param {number} options.deleteSpeed - Milliseconds per character when deleting (default: 30)
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
 * @param {Function} options.onCharacter - Callback for each character typed (char, index)
 * @param {Function} options.onRender - Callback when render action completes (text)
 * @param {Function} options.onUndoRender - Callback when undoRender action completes (deletedText)
 * @param {Function} options.onLoop - Callback on each loop iteration (loopCount)
 * @returns {Object} Control object with pause(), resume(), stop(), restart(), destroy() methods
 *
 * @example
 * // Simple usage
 * Domma.effects.typewriter('.hero-title', {
 *   actions: [
 *     { render: 'Hello, World!', effect: 'bounce' }
 *   ]
 * });
 *
 * @example
 * // Complex sequence with undo
 * const tw = Domma.effects.typewriter('.demo', {
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
export function typewriter(selector, options = {}) {
  // Default options
  const defaults = {
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
    console.error('[Domma.effects.typewriter] Invalid selector');
    return null;
  }

  if (elements.length === 0) {
    console.warn('[Domma.effects.typewriter] No elements found');
    return null;
  }

  // Respect motion preferences - return no-op control object
  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.typewriter] Disabled due to prefers-reduced-motion');
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
    charSpans: [],
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
      let cursorClasses = ['dm-tw-cursor'];

      // Add cursor type class
      if (opts.cursorType === 'block') {
        cursorClasses.push('dm-tw-cursor-block');
      } else if (opts.cursorType === 'underline') {
        cursorClasses.push('dm-tw-cursor-underline');
      } else {
        cursorClasses.push('dm-tw-cursor-caret');
      }

      // Add no-blink class if needed
      if (!opts.cursorBlink) {
        cursorClasses.push('dm-tw-cursor-no-blink');
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
        state.charSpans.forEach(span => span.remove());
        state.charSpans = [];
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

  // Handle render action
  function handleRender(state, action) {
    return new Promise(resolve => {
      const text = String(action.render);
      const effect = action.effect || 'none';
      state.lastRenderStart = state.charSpans.length;
      let charIndex = 0;
      let lastFrameTime = performance.now();

      function typeChar(currentTime) {
        if (state.paused) return;

        if (charIndex >= text.length) {
          if (opts.onRender) opts.onRender(text);
          resolve();
          return;
        }

        // Throttle to desired speed using RAF for smoother timing
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < opts.speed) {
          state.charTimerId = requestAnimationFrame(typeChar);
          return;
        }

        lastFrameTime = currentTime;

        const char = text[charIndex];
        const span = document.createElement('span');
        span.className = 'dm-tw-char';
        span.textContent = char;

        // Apply entrance effect
        if (effect === 'fade') {
          span.classList.add('dm-tw-char-fade');
        } else if (effect === 'bounce') {
          span.classList.add('dm-tw-char-bounce');
        } else if (effect === 'glow') {
          span.classList.add('dm-tw-char-glow');
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

        state.charSpans.push(span);

        if (opts.onCharacter) {
          opts.onCharacter(char, state.charSpans.length - 1);
        }

        charIndex++;
        state.charTimerId = requestAnimationFrame(typeChar);
      }

      state.charTimerId = requestAnimationFrame(typeChar);
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
      let charsToDelete = 0;
      const undoValue = action.undoRender;

      if (undoValue === true) {
        // Delete all from last render
        charsToDelete = state.charSpans.length - state.lastRenderStart;
      } else if (undoValue === 'all') {
        // Delete everything
        charsToDelete = state.charSpans.length;
      } else if (typeof undoValue === 'number') {
        // Delete specific count
        charsToDelete = Math.min(undoValue, state.charSpans.length);
      }

      if (charsToDelete === 0) {
        resolve();
        return;
      }

      const deletedChars = [];
      let deleted = 0;
      let lastFrameTime = performance.now();

      function deleteChar(currentTime) {
        if (state.paused) return;

        if (deleted >= charsToDelete) {
          const deletedText = deletedChars.reverse().join('');
          if (opts.onUndoRender) opts.onUndoRender(deletedText);
          resolve();
          return;
        }

        // Throttle to desired delete speed using RAF
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < opts.deleteSpeed) {
          state.charTimerId = requestAnimationFrame(deleteChar);
          return;
        }

        lastFrameTime = currentTime;

        if (state.charSpans.length > 0) {
          const span = state.charSpans.pop();
          deletedChars.push(span.textContent);
          span.remove();
        }

        deleted++;
        state.charTimerId = requestAnimationFrame(deleteChar);
      }

      state.charTimerId = requestAnimationFrame(deleteChar);
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
     * Pause the typewriter animation
     */
    pause() {
      elementStates.forEach(state => {
        state.paused = true;
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);
      });
    },

    /**
     * Resume the typewriter animation
     */
    resume() {
      elementStates.forEach(state => {
        state.paused = false;
        processActions(state);
      });
    },

    /**
     * Stop the typewriter animation
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
     * Restart the typewriter animation from the beginning
     */
    restart() {
      elementStates.forEach(state => {
        // Clear all timers
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);

        // Clear content
        state.charSpans.forEach(span => span.remove());
        state.charSpans = [];
        state.currentAction = 0;
        state.loopCount = 0;
        state.lastRenderStart = 0;
        state.paused = false;

        // Restart
        processActions(state);
      });
    },

    /**
     * Destroy the typewriter animation and clean up
     */
    destroy() {
      elementStates.forEach(state => {
        // Clear timers
        if (state.charTimerId) cancelAnimationFrame(state.charTimerId);
        if (state.waitTimerId) clearTimeout(state.waitTimerId);

        // Remove all character spans
        state.charSpans.forEach(span => span.remove());

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

// Export as default for module usage
export default {
  breathe,
  pulse,
  typewriter
};
