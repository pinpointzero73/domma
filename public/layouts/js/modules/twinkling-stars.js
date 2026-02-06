/**
 * Twinkling Stars Effect
 * Ambient background stars for dark-themed pages
 */

export class TwinklingStars {
  constructor(options = {}) {
    this.options = {
      count: options.count || 100,
      minSize: options.minSize || 1,
      maxSize: options.maxSize || 3,
      twinkleSpeed: options.twinkleSpeed || 0.003,
      color: options.color || 'rgba(255, 240, 200, 1)',
      container: options.container || document.body,
      zIndex: options.zIndex || 1
    };

    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.animationFrame = null;
    this.running = false;
  }

  /**
   * Initialize the stars effect
   */
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'twinkling-stars-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = this.options.zIndex;
    this.ctx = this.canvas.getContext('2d');

    // Size canvas
    this.resize();

    // Add to container
    this.options.container.appendChild(this.canvas);

    // Create stars
    this.createStars();

    // Handle resize
    window.addEventListener('resize', () => this.resize());

    console.log(`[TwinklingStars] Initialized with ${this.options.count} stars`);
  }

  /**
   * Resize canvas
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Recreate stars on resize
    if (this.stars.length > 0) {
      this.createStars();
    }
  }

  /**
   * Create stars
   */
  createStars() {
    this.stars = [];
    const width = this.canvas.width;
    const height = this.canvas.height;

    for (let i = 0; i < this.options.count; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: this.options.minSize + Math.random() * (this.options.maxSize - this.options.minSize),
        opacity: 0.3 + Math.random() * 0.7,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: this.options.twinkleSpeed + Math.random() * this.options.twinkleSpeed
      });
    }
  }

  /**
   * Start animation
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  /**
   * Stop animation
   */
  stop() {
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Destroy effect
   */
  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.running) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw stars
    this.stars.forEach(star => {
      // Update twinkle phase
      star.twinklePhase += star.twinkleSpeed;

      // Calculate twinkle intensity
      const twinkle = 0.3 + Math.sin(star.twinklePhase) * 0.7;

      // Draw star
      ctx.save();
      ctx.globalAlpha = star.opacity * twinkle;
      ctx.fillStyle = this.options.color;
      ctx.shadowColor = this.options.color;
      ctx.shadowBlur = star.size * 2;

      // 4-pointed star
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

      // Center glow
      ctx.shadowBlur = star.size;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

export default TwinklingStars;
