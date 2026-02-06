/**
 * Domma Celebrations - Main Module
 *
 * Year-round visual celebration effects system supporting 8 celebration themes.
 * Auto-detects current celebration based on date or allows manual theme selection.
 *
 * @module celebrations
 */

import { CanvasManager } from './core/canvas.js';
import { PhysicsEngine, updateParticlePhysics, updateMovingParticle } from './core/physics.js';
import { createParticle } from './core/particles.js';

/**
 * Main Celebrations Effect class
 */
export class CelebrationsEffect {
  // Theme date ranges: [[startMonth, startDay], [endMonth, endDay]]
  // 5-day lead-up, ends at midnight on celebration day
  static themes = {
    christmas: {
      module: './themes/christmas.js',
      dates: [[12, 1], [1, 1]], // All December + New Year's Day
      displayName: 'Christmas',
      emoji: '🎄'
    },
    halloween: {
      module: './themes/halloween.js',
      dates: [[10, 26], [10, 31]], // Oct 26-31 (midnight)
      displayName: 'Halloween',
      emoji: '🎃'
    },
    valentines: {
      module: './themes/valentines.js',
      dates: [[2, 9], [2, 14]], // Feb 9-14 (midnight)
      displayName: 'Valentine\'s Day',
      emoji: '💕'
    },
    'guy-fawkes': {
      module: './themes/guy-fawkes.js',
      dates: [[11, 1], [11, 5]], // Nov 1-5 (midnight)
      displayName: 'Guy Fawkes Night',
      emoji: '🎆'
    },
    'st-patricks': {
      module: './themes/st-patricks.js',
      dates: [[3, 12], [3, 17]], // Mar 12-17 (midnight)
      displayName: 'St Patrick\'s Day',
      emoji: '☘️'
    },
    'st-andrews': {
      module: './themes/st-andrews.js',
      dates: [[11, 25], [11, 30]], // Nov 25-30 (midnight)
      displayName: 'St Andrew\'s Day',
      emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
    },
    'st-davids': {
      module: './themes/st-davids.js',
      dates: [[2, 24], [3, 1]], // Feb 24 - Mar 1 (midnight)
      displayName: 'St David\'s Day',
      emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
    },
    'st-georges': {
      module: './themes/st-georges.js',
      dates: [[4, 18], [4, 23]], // Apr 18-23 (midnight)
      displayName: 'St George\'s Day',
      emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
    }
  };

  /**
   * Check if current date is within a celebration period
   */
  static isDateInRange(startMonth, startDay, endMonth, endDay) {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Handle year wrapping (e.g., Dec 1 - Jan 1)
    if (endMonth < startMonth) {
      return (
        (month === startMonth && day >= startDay) ||
        (month > startMonth) ||
        (month < startMonth && month <= endMonth) ||
        (month === endMonth && day <= endDay)
      );
    }

    // Normal date range
    return (
      (month > startMonth || (month === startMonth && day >= startDay)) &&
      (month < endMonth || (month === endMonth && day <= endDay))
    );
  }

  /**
   * Auto-detect current theme based on date
   * @returns {string|null} Theme name or null if no celebration is active
   */
  static getCurrentTheme() {
    for (const [themeName, themeData] of Object.entries(CelebrationsEffect.themes)) {
      const [[startMonth, startDay], [endMonth, endDay]] = themeData.dates;
      if (CelebrationsEffect.isDateInRange(startMonth, startDay, endMonth, endDay)) {
        return themeName;
      }
    }
    return null;
  }

  /**
   * Check if any celebration is currently active
   * @returns {boolean}
   */
  static isCelebrationSeason() {
    return CelebrationsEffect.getCurrentTheme() !== null;
  }

  /**
   * Get all available themes
   * @returns {Object} Themes object
   */
  static getThemes() {
    return CelebrationsEffect.themes;
  }

  /**
   * Create a new celebrations effect
   * @param {Object} options - Configuration options
   * @param {string} options.theme - Theme name (or 'auto' for auto-detection)
   * @param {string} options.intensity - Intensity level ('light', 'medium', 'heavy')
   * @param {boolean} options.enabled - Whether to start enabled
   * @param {number} options.zIndex - Canvas z-index
   */
  constructor(options = {}) {
    this.options = {
      theme: options.theme || 'auto',
      intensity: options.intensity || 'medium',
      enabled: options.enabled !== undefined ? options.enabled : true,
      zIndex: options.zIndex || 999
    };

    this.canvasManager = null;
    this.physicsEngine = null;
    this.themeModule = null;
    this.currentTheme = null;

    this.particles = [];
    this.specialParticles = [];

    this.animationFrame = null;
    this.lastTime = 0;
    this.running = false;
    this.initialized = false;
  }

  /**
   * Initialize the celebrations effect
   */
  async init() {
    if (this.initialized) {
      console.warn('[Celebrations] Already initialized');
      return;
    }

    console.log('[Celebrations] Initializing...');

    // Determine theme
    let themeName = this.options.theme;
    if (themeName === 'auto') {
      themeName = CelebrationsEffect.getCurrentTheme();
      if (!themeName) {
        console.log('[Celebrations] No active celebration detected');
        return;
      }
    }

    // Validate theme
    if (!CelebrationsEffect.themes[themeName]) {
      console.error(`[Celebrations] Unknown theme: ${themeName}`);
      return;
    }

    this.currentTheme = themeName;
    console.log(`[Celebrations] Loading theme: ${themeName}`);

    // Load theme module
    try {
      const themeData = CelebrationsEffect.themes[themeName];
      const module = await import(themeData.module);
      this.themeModule = module.default;
      console.log(`[Celebrations] Theme loaded: ${this.themeModule.displayName}`);
    } catch (error) {
      console.error(`[Celebrations] Failed to load theme module: ${error.message}`);
      return;
    }

    // Initialize canvas
    this.canvasManager = new CanvasManager({
      canvasId: 'celebrations-canvas',
      zIndex: this.options.zIndex
    });
    this.canvasManager.create();

    // Initialize physics
    this.physicsEngine = new PhysicsEngine({
      gustInterval: [5000, 15000],
      gustStrength: [-2, 2]
    });

    // Setup resize handler
    window.addEventListener('resize', () => {
      this.canvasManager.resize();
      this.resetParticles();
    });

    // Initialize particles
    this.resetParticles();

    this.initialized = true;
    console.log('[Celebrations] Initialized successfully');

    // Auto-start if enabled
    if (this.options.enabled) {
      this.start();
    }
  }

  /**
   * Reset particles based on current intensity
   */
  resetParticles() {
    const config = this.themeModule.intensityConfig[this.options.intensity];
    const width = this.canvasManager.canvas.width;
    const height = this.canvasManager.canvas.height;

    // Clear existing particles
    this.particles = [];
    this.specialParticles = [];

    // Create falling particles (theme-specific method or generic)
    if (this.themeModule.createFallingParticle) {
      for (let i = 0; i < config.count; i++) {
        const particle = this.themeModule.createFallingParticle(width, height, config);
        particle.y = Math.random() * height; // Spread across screen initially
        this.particles.push(particle);
      }
    } else {
      // Fallback to generic particles
      for (let i = 0; i < config.count; i++) {
        const particle = createParticle(config, width, height);
        particle.y = Math.random() * height;
        this.particles.push(particle);
      }
    }

    // Create initial static decorations (theme-specific)
    if (this.themeModule.createInitialDecorations) {
      const decorations = this.themeModule.createInitialDecorations(width, height, config);
      this.specialParticles.push(...decorations);
      console.log(`[Celebrations] Created ${decorations.length} decorations`);
    }

    console.log(`[Celebrations] Created ${config.count} particles (${this.options.intensity})`);
  }

  /**
   * Start the animation
   */
  start() {
    if (!this.initialized) {
      console.warn('[Celebrations] Cannot start - not initialized');
      return;
    }

    if (this.running) {
      console.warn('[Celebrations] Already running');
      return;
    }

    console.log('[Celebrations] Starting animation');
    this.running = true;
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Pause the animation
   */
  pause() {
    if (!this.running) {
      return;
    }

    console.log('[Celebrations] Pausing animation');
    this.running = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Resume the animation
   */
  resume() {
    if (this.running) {
      return;
    }

    this.start();
  }

  /**
   * Destroy the effect
   */
  destroy() {
    console.log('[Celebrations] Destroying effect');
    this.pause();

    if (this.canvasManager && this.canvasManager.canvas) {
      this.canvasManager.canvas.remove();
    }

    this.particles = [];
    this.specialParticles = [];
    this.canvasManager = null;
    this.physicsEngine = null;
    this.themeModule = null;
    this.initialized = false;
  }

  /**
   * Change intensity
   */
  setIntensity(intensity) {
    if (!['light', 'medium', 'heavy'].includes(intensity)) {
      console.error(`[Celebrations] Invalid intensity: ${intensity}`);
      return;
    }

    console.log(`[Celebrations] Changing intensity to: ${intensity}`);
    this.options.intensity = intensity;
    this.resetParticles();
  }

  /**
   * Change theme
   */
  async setTheme(themeName) {
    console.log(`[Celebrations] Changing theme to: ${themeName}`);

    const wasRunning = this.running;
    this.pause();

    // Wait for current animation frame to complete before clearing
    await new Promise(resolve => setTimeout(resolve, 20));

    this.initialized = false;

    // Clear canvas and particles from previous theme
    if (this.canvasManager) {
      this.canvasManager.clear();
    }
    this.particles = [];
    this.specialParticles = [];

    // Clear again to be absolutely sure
    if (this.canvasManager) {
      this.canvasManager.clear();
    }

    this.options.theme = themeName;
    await this.init();

    if (wasRunning) {
      this.start();
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.running) {
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clear canvas
    this.canvasManager.clear();

    const ctx = this.canvasManager.ctx;
    const width = this.canvasManager.canvas.width;
    const height = this.canvasManager.canvas.height;
    const config = this.themeModule.intensityConfig[this.options.intensity];

    // Update wind
    this.physicsEngine.updateWind(currentTime);
    const windForce = this.physicsEngine.getWindForce();

    // Update and render particles
    this.particles.forEach((particle, index) => {
      // Update physics
      updateParticlePhysics(particle, deltaTime, windForce);

      // Recycle particle if off-screen
      if (particle.y > height + 50) {
        particle.y = -20;
        particle.x = Math.random() * width;
      }
      if (particle.x < -50) {
        particle.x = width + 50;
      }
      if (particle.x > width + 50) {
        particle.x = -50;
      }

      // Render particle (theme-specific)
      // For now, render as generic snowflake-like particle
      // Theme modules should provide custom rendering
      if (this.themeModule.drawSnowflake && particle.type === undefined) {
        this.themeModule.drawSnowflake(ctx, particle);
      } else if (this.themeModule['draw' + this.capitalizeFirst(particle.type)]) {
        const drawMethod = 'draw' + this.capitalizeFirst(particle.type);
        this.themeModule[drawMethod](ctx, particle, currentTime);
      } else {
        // Fallback generic rendering
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = this.themeModule.colors?.primary || '#ffffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // Theme-specific special particle updates (firework explosions, etc.)
    if (this.themeModule.updateSpecialParticles) {
      this.themeModule.updateSpecialParticles(this.specialParticles, deltaTime);
    }

    // Update and render special particles (decorations)
    this.specialParticles = this.specialParticles.filter(particle => {
      if (!particle.active) {
        return false;
      }

      // Update moving particles
      if (!particle.static) {
        updateMovingParticle(particle, deltaTime, currentTime);

        // Remove if off-screen
        if (particle.x < -200 || particle.x > width + 200) {
          particle.active = false;
          return false;
        }
      }

      // Safety check: validate particle properties before rendering
      if (!isFinite(particle.x) || !isFinite(particle.y) || (particle.size && !isFinite(particle.size))) {
        console.warn('[Celebrations] Invalid particle values, removing:', particle.type);
        particle.active = false;
        return false;
      }

      // Render (theme-specific)
      const typeName = this.capitalizeFirst(particle.type);
      const drawMethod = 'draw' + typeName;
      if (this.themeModule[drawMethod]) {
        this.themeModule[drawMethod](ctx, particle, currentTime);
      }

      return true;
    });

    // Spawn special particles
    if (this.themeModule.spawnSpecialParticle) {
      const newParticle = this.themeModule.spawnSpecialParticle(
        this.specialParticles,
        width,
        height,
        config
      );
      if (newParticle) {
        this.specialParticles.push(newParticle);
      }
    }

    // Continue animation
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Helper: Capitalize first letter and letters after hyphens
   * Converts hyphenated names to camelCase: 'sparkler-bundle' → 'SparklerBundle'
   */
  capitalizeFirst(str) {
    if (!str) return '';
    // First, capitalize letters after hyphens and remove hyphens
    // 'sparkler-bundle' → 'sparklerBundle'
    const camelCase = str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    // Then capitalize the first letter: 'sparklerBundle' → 'SparklerBundle'
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
}

// Export for direct use
export default CelebrationsEffect;
