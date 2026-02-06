/**
 * Canvas Management Utilities
 * Handles canvas creation, resizing, and context management
 */

export class CanvasManager {
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'celebrations-canvas';
    this.zIndex = options.zIndex || 999;
    this.canvas = null;
    this.ctx = null;
    this.resizeTimeout = null;
    this.resizeCallback = options.onResize || null;

    // Bind methods
    this._handleResize = this._handleResize.bind(this);
  }

  /**
   * Create and append canvas to DOM
   */
  create() {
    if (this.canvas) return; // Already created

    this.canvas = document.createElement('canvas');
    this.canvas.id = this.canvasId;
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: ${this.zIndex};
    `;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.resize();
    document.body.appendChild(this.canvas);

    // Bind resize listener
    window.addEventListener('resize', this._handleResize);
  }

  /**
   * Resize canvas to match window dimensions
   */
  resize() {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Clear entire canvas
   */
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Get canvas dimensions
   */
  getDimensions() {
    return {
      width: this.canvas?.width || 0,
      height: this.canvas?.height || 0
    };
  }

  /**
   * Check if mobile device
   */
  isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Remove canvas from DOM and cleanup
   */
  destroy() {
    window.removeEventListener('resize', this._handleResize);

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Handle window resize with debouncing
   * @private
   */
  _handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.resize();

      if (this.resizeCallback) {
        this.resizeCallback();
      }
    }, 250);
  }
}
