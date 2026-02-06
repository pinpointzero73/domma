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

// Export as default for module usage
export default {
  breathe,
  pulse
};
