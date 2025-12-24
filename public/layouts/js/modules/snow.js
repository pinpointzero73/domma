/**
 * SnowEffect - Canvas-based festive snow animation with special effects
 * Standalone festive snow effect library
 *
 * Features:
 * - 6-pointed crystalline snowflakes with rotation
 * - Decorated Christmas trees with lights, baubles, tinsel, and star
 * - Christmas wreaths with bows and ornaments
 * - Santa's sleigh with 5 reindeer (including Rudolph)
 * - Sine wave flight motion for sleighs
 * - Wind gusts and physics simulation
 * - Twinkling lights animation
 * - Depth layers for parallax effect
 * - Mobile-responsive (reduced particles on small screens)
 * - Christmas Steam Train with animated smoke and decorations
 *
 * @license MIT
 */

const INTENSITY_CONFIG = {
  light: {
    count: 50,
    speedRange: [0.5, 1.5],
    sizeRange: [1, 3],
    trees: 3,
    wreaths: 2
  },
  medium: {
    count: 150,
    speedRange: [0.8, 2.5],
    sizeRange: [1, 4],
    trees: 6,
    wreaths: 3
  },
  heavy: {
    count: 300,
    speedRange: [1.0, 3.5],
    sizeRange: [1, 5],
    trees: 10,
    wreaths: 4
  }
};

export class SnowEffect {
  constructor(options = {}) {
    this.intensity = options.intensity || 'medium';
    this.enabled = options.enabled !== undefined ? options.enabled : false;
    this.seasonCheck = options.seasonCheck || null; // Optional callback for date-based visibility
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.specialParticles = []; // Sleighs, trees, etc.
    this.animationId = null;
    this.lastTime = 0;
    this.isPaused = false;
    this.resizeTimeout = null;
    this.windGust = 0; // Current wind strength
    this.windGustTarget = 0; // Target wind strength
    this.lastGustTime = 0;
    this.twinkleTime = 0; // For twinkling lights

    // Bind methods
    this._animate = this._animate.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._handleVisibility = this._handleVisibility.bind(this);
  }

  /**
   * Check if the effect should be displayed based on season check callback
   * @returns {boolean} True if effect should display
   */
  shouldDisplay() {
    if (typeof this.seasonCheck === 'function') {
      return this.seasonCheck();
    }
    return true; // Default: always allow
  }

  init() {
    if (this.canvas) return; // Already initialized

    this._createCanvas();
    this._createParticles();
    this._bindEvents();
  }

  start() {
    if (!this.canvas || this.animationId) return;

    this.isPaused = false;
    this.lastTime = performance.now();
    this.lastGustTime = performance.now();
    this.animationId = requestAnimationFrame(this._animate);
  }

  pause() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  stop() {
    this.pause();
    this._cleanup();
  }

  setIntensity(level) {
    if (!['light', 'medium', 'heavy'].includes(level)) return;

    this.intensity = level;
    this._createParticles(); // Recreate particles with new count
  }

  _createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'festive-snow-canvas';
    this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 999;
        `;

    this.ctx = this.canvas.getContext('2d', {alpha: true});
    this._resizeCanvas();
    document.body.appendChild(this.canvas);
  }

  _resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _createParticles() {
    const config = INTENSITY_CONFIG[this.intensity];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(config.count / 2) : config.count;

    this.particles = [];
    this.specialParticles = [];

    // Create regular snowflakes
    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle(config));
    }

    // Create static trees in random positions
    const treeCount = isMobile ? Math.floor(config.trees / 2) : config.trees;
    for (let i = 0; i < treeCount; i++) {
      this.specialParticles.push(this._createStaticTree());
    }

    // Create static wreaths in random positions
    const wreathCount = isMobile ? Math.floor(config.wreaths / 2) : config.wreaths;
    for (let i = 0; i < wreathCount; i++) {
      this.specialParticles.push(this._createStaticWreath());
    }
  }

  _createParticle(config) {
    // Determine depth layer (front, middle, back)
    const depth = Math.random();
    let size, speed, opacity, windSpeed;

    if (depth < 0.33) {
      // Front layer - larger, faster, more opaque
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.5;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 1.3;
      opacity = 0.8 + Math.random() * 0.2;
      windSpeed = 0.01 + Math.random() * 0.02;
    } else if (depth < 0.66) {
      // Middle layer
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      opacity = 0.5 + Math.random() * 0.2;
      windSpeed = 0.02 + Math.random() * 0.03;
    } else {
      // Back layer - smaller, slower, less opaque
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.7;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.7;
      opacity = 0.3 + Math.random() * 0.2;
      windSpeed = 0.03 + Math.random() * 0.04;
    }

    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height - this.canvas.height,
      size: size,
      speed: speed,
      opacity: opacity,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: windSpeed,
      rotation: Math.random() * Math.PI * 2, // For snowflake rotation
      rotationSpeed: (Math.random() - 0.5) * 0.02 // Slow rotation
    };
  }

  _createStaticTree() {
    return {
      type: 'tree',
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: 0,
      vy: 0,
      size: 20 + Math.random() * 15,
      opacity: 0.6 + Math.random() * 0.3,
      rotation: 0,
      rotationSpeed: 0,
      active: true,
      static: true
    };
  }

  _createStaticWreath() {
    // Generate the wreath's shape data once
    const wreathShape = [];
    const segments = 20;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      wreathShape.push({
        angle: angle,
        radius: 0.9 + Math.random() * 0.2, // Randomize radius for this segment
        thickness: 0.2 + Math.random() * 0.15, // Randomize thickness
        color: i % 2 === 0 ? '#1a6b1a' : '#228B22' // Alternate shades
      });
    }

    return {
      type: 'wreath',
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: 0,
      vy: 0,
      size: 15 + Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.2,
      rotation: 0,
      rotationSpeed: 0,
      active: true,
      static: true,
      shape: wreathShape // Store the pre-generated shape
    };
  }

  _animate(currentTime) {
    if (this.isPaused || !this.canvas) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update twinkle time for lights
    this.twinkleTime = currentTime;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update wind gusts (every 5-15 seconds)
    if (currentTime - this.lastGustTime > 5000 + Math.random() * 10000) {
      this.windGustTarget = (Math.random() - 0.5) * 4; // -2 to +2
      this.lastGustTime = currentTime;
    }

    // Smooth wind transition
    this.windGust += (this.windGustTarget - this.windGust) * 0.02;

    // Spawn special particles occasionally
    this._spawnSpecialParticle();


    // Update and draw regular snowflakes
    this.particles.forEach(particle => {
      this._updateParticle(particle, deltaTime);
      this._drawSnowflake(particle);
    });

    // Update and draw special particles
    this.specialParticles = this.specialParticles.filter(particle => {
      this._updateSpecialParticle(particle, deltaTime);
      this._drawSpecialParticle(particle);
      return particle.active;
    });

    // Continue animation loop
    this.animationId = requestAnimationFrame(this._animate);
  }

  _updateParticle(particle, deltaTime) {
    const normalizedDelta = deltaTime / (1000 / 60);

    // Apply gravity
    particle.y += particle.speed * normalizedDelta;

    // Apply wind drift + wind gust
    particle.windOffset += particle.windSpeed * normalizedDelta;
    const baseWind = Math.sin(particle.windOffset) * 0.5;
    particle.x += (baseWind + this.windGust) * normalizedDelta;

    // Rotate snowflake
    particle.rotation += particle.rotationSpeed * normalizedDelta;

    // Recycle at bottom
    if (particle.y > this.canvas.height + 10) {
      particle.y = -10;
      particle.x = Math.random() * this.canvas.width;
    }

    // Wrap horizontally
    if (particle.x < -10) {
      particle.x = this.canvas.width + 10;
    } else if (particle.x > this.canvas.width + 10) {
      particle.x = -10;
    }
  }

  _drawSnowflake(particle) {
    const ctx = this.ctx;
    ctx.save();

    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(particle.size * 0.15, 0.5);

    // Draw 6-pointed snowflake
    const branches = 6;
    const radius = particle.size;

    for (let i = 0; i < branches; i++) {
      const angle = (Math.PI * 2 * i) / branches;

      // Main branch
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
      );
      ctx.stroke();

      // Side branches
      const sideLength = radius * 0.4;
      const sideAngle = Math.PI / 6;
      const midX = Math.cos(angle) * (radius * 0.6);
      const midY = Math.sin(angle) * (radius * 0.6);

      // Left side branch
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX + Math.cos(angle - sideAngle) * sideLength,
        midY + Math.sin(angle - sideAngle) * sideLength
      );
      ctx.stroke();

      // Right side branch
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX + Math.cos(angle + sideAngle) * sideLength,
        midY + Math.sin(angle + sideAngle) * sideLength
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  _spawnSpecialParticle() {
    const choice = Math.random();
    if (choice < 0.0005) {
      if (this.specialParticles.some(p => p.type === 'sleigh')) {
        return;
      }
      const fromLeft = Math.random() < 0.5;
      this.specialParticles.push({
        type: 'sleigh',
        x: fromLeft ? -100 : this.canvas.width + 100,
        y: Math.random() * (this.canvas.height * 0.5),
        baseY: Math.random() * (this.canvas.height * 0.5),
        vx: fromLeft ? 3 + Math.random() * 2 : -(3 + Math.random() * 2),
        waveAmplitude: 20 + Math.random() * 30,
        waveFrequency: 0.001 + Math.random() * 0.002,
        wavePhase: Math.random() * Math.PI * 2,
        time: 0,
        size: 15 + Math.random() * 10,
        opacity: 0.9,
        rotation: 0,
        active: true,
        static: false
      });
    } else if (choice < 0.0008) {
      const fromLeft = Math.random() < 0.5;
      this.specialParticles.push({
        type: 'elf',
        x: fromLeft ? -50 : this.canvas.width + 50,
        y: this.canvas.height - 30,
        baseY: this.canvas.height - 30,
        vx: fromLeft ? 1.5 + Math.random() * 1 : -(1.5 + Math.random() * 1),
        waveAmplitude: 3,
        waveFrequency: 0.05,
        wavePhase: Math.random() * Math.PI * 2,
        time: 0,
        size: 10 + Math.random() * 5,
        opacity: 0.95,
        rotation: 0,
        active: true,
        static: false
      });
    } else if (choice < 0.001) { // Even rarer for train
      const fromLeft = Math.random() < 0.5;
      this.specialParticles.push({
        type: 'train',
        x: fromLeft ? -500 : this.canvas.width + 500, // Start further off-screen
        y: this.canvas.height - 50, // Near the bottom
        baseY: this.canvas.height - 50,
        vx: fromLeft ? 4 + Math.random() * 2 : -(4 + Math.random() * 2),
        size: 20 + Math.random() * 10,
        opacity: 1,
        time: 0,
        smoke: [], // To store individual smoke puffs
        active: true,
        static: false,
        carriages: 2 + Math.floor(Math.random() * 2) // 2 or 3 carriages
      });
    } else if (choice < 0.0025) { // Spawn Robins
      if (this.specialParticles.some(p => p.type === 'robin')) {
        return;
      }
      const fromLeft = Math.random() < 0.5;
      const startY = Math.random() * (this.canvas.height * 0.2);
      const startX = fromLeft ? -50 : this.canvas.width + 50;

      const robinSize = 10 + Math.random() * 5;
      const targetX = Math.random() * (this.canvas.width * 0.6) + (this.canvas.width * 0.2);
      const targetY = this.canvas.height * 0.5 + Math.random() * (this.canvas.height * 0.4);

      this.specialParticles.push({
        type: 'robin',
        state: 'flying_in',
        x: startX,
        y: startY,
        startX: startX,
        startY: startY,
        targetX: targetX,
        targetY: targetY,
        vx: fromLeft ? 0.5 + Math.random() * 0.5 : -(0.5 + Math.random() * 0.5),
        vy: 0,
        size: robinSize,
        opacity: 0.95,
        active: true,
        static: false,
        sitTime: 2000 + Math.random() * 3000,
        sitStartTime: 0,
        flightProgress: 0,
        time: 0
      });
    }
  }

  _updateSpecialParticle(particle, deltaTime) {
    if (particle.static) {
      return;
    }
    const normDelta = deltaTime / (16.67);
    particle.x += particle.vx * normDelta;
    particle.time += deltaTime;

    if (particle.type === 'sleigh' || particle.type === 'elf') {
      particle.y = particle.baseY + (Math.sin(particle.time * particle.waveFrequency + particle.wavePhase) * particle.waveAmplitude);
      const margin = particle.type === 'sleigh' ? 200 : 100;
      if (particle.x < -margin || particle.x > this.canvas.width + margin) {
        particle.active = false;
      }
    } else if (particle.type === 'train') {
      // Train smoke animation
      const size = particle.size * 1.8;
      const baseUnit = size / 20;
      const wheelRadius = baseUnit * 8;
      const engineChassisBottomY = -wheelRadius - baseUnit;
      const chassisHeight = baseUnit * 7;
      const boilerRadius = baseUnit * 10;
      const boilerTopY = engineChassisBottomY - chassisHeight - boilerRadius * 2;
      const engineLength = baseUnit * 70;
      const cabWidth = baseUnit * 25;
      const boilerWidth = engineLength - cabWidth;

      const smokeOriginX = boilerWidth * 0.7 + baseUnit * 4;
      const smokeOriginY = boilerTopY - baseUnit * 10;

      if (Math.random() < 0.45) {
        const smokeSize = particle.size * 0.6 + Math.random() * particle.size * 1.0;
        particle.smoke.push({
          x: smokeOriginX + (Math.random() - 0.5) * baseUnit * 2,
          y: smokeOriginY + (Math.random() - 0.5) * baseUnit * 1,
          size: smokeSize,
          opacity: 0.8 + Math.random() * 0.2,
          vx: (Math.random() - 0.5) * 0.6 + this.windGust * 0.15,
          vy: -1.5 - Math.random() * 0.8,
          growth: 0.2 + Math.random() * 0.15,
          life: 120 + Math.random() * 80
        });
      }
      particle.smoke.forEach(s => {
        s.x += s.vx * normDelta;
        s.y += s.vy * normDelta;
        s.opacity -= (1 / s.life) * normDelta;
        s.size += s.growth * normDelta;
      });
      particle.smoke = particle.smoke.filter(s => s.opacity > 0);

      const margin = 500;
      if (particle.x < -margin || particle.x > this.canvas.width + margin) {
        particle.active = false;
      }
    } else if (particle.type === 'robin') {
      const speed = 0.01;
      switch (particle.state) {
        case 'flying_in':
          particle.flightProgress += speed;
          const journeyX = particle.targetX - particle.startX;
          const journeyY = particle.targetY - particle.startY;

          particle.x = particle.startX + journeyX * particle.flightProgress;
          particle.y = particle.startY + journeyY * Math.sin(particle.flightProgress * Math.PI);


          if (particle.flightProgress >= 1) {
            particle.state = 'sitting';
            particle.sitStartTime = this.lastTime;
            particle.flightProgress = 0;
          }
          break;
        case 'sitting':
          if (this.lastTime - particle.sitStartTime > particle.sitTime) {
            particle.state = 'flying_away';
            particle.startX = particle.x;
            particle.startY = particle.y;
            particle.targetX = particle.x - 20;
            particle.targetY = -50;
          }
          break;
        case 'flying_away':
          particle.flightProgress += speed;
          const journeyX2 = particle.targetX - particle.startX;
          const journeyY2 = particle.targetY - particle.startY;

          particle.x = particle.startX + journeyX2 * particle.flightProgress;
          particle.y = particle.startY + journeyY2 * particle.flightProgress;

          if (particle.y < -50) {
            particle.active = false;
          }
          break;
      }
    }
  }

  _drawSpecialParticle(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.opacity;
    if (p.type === 'sleigh') this._drawSleigh(p);
    else if (p.type === 'tree') this._drawTree(p);
    else if (p.type === 'wreath') this._drawWreath(p);
    else if (p.type === 'elf') this._drawElf(p);
    else if (p.type === 'train') this._drawTrain(p);
    else if (p.type === 'robin') this._drawRobin(p);
    this.ctx.restore();
  }

  _drawRobin(particle) {
    const ctx = this.ctx;
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;
    const time = particle.time; // Access particle.time

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    let wingAngle = 0;
    if (particle.state === 'flying_in' || particle.state === 'flying_away') {
      // Oscillate wing angle between -PI/4 and PI/4
      wingAngle = Math.sin(time * 0.015) * (Math.PI / 4); // Increased frequency for faster flap
    }

    // Legs
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 0.2, size * 0.5);
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.2, size * 0.5);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.5, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red breast
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.4, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#A1887F';
    ctx.beginPath();
    ctx.arc(size * 0.5, -size, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.moveTo(size, -size * 1.1);
    ctx.lineTo(size * 1.3, -size);
    ctx.lineTo(size, -size * 0.9);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.7, -size * 1.1, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Santa Hat
    const hatX = size * 0.4;
    const hatY = -size * 1.4;
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.moveTo(hatX, hatY);
    ctx.lineTo(hatX + size * 0.6, hatY);
    ctx.lineTo(hatX + size * 0.3, hatY - size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(hatX - size * 0.05, hatY, size * 0.7, size * 0.15);
    ctx.beginPath();
    ctx.arc(hatX + size * 0.3, hatY - size * 0.5, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Wings (draw after body so they appear layered correctly)
    ctx.fillStyle = '#8D6E63'; // Same color as body
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = size * 0.05;

    ctx.save();
    ctx.translate(-size * 0.8, -size * 0.4); // Position wings relative to body
    ctx.rotate(wingAngle); // Apply rotation for flapping

    // Left wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.5, -size * 0.5, -size * 0.8, 0);
    ctx.quadraticCurveTo(-size * 0.5, size * 0.5, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(size * 0.8, -size * 0.4); // Position wings relative to body
    ctx.scale(-1, 1); // Mirror for right wing
    ctx.rotate(-wingAngle); // Apply opposite rotation for flapping

    // Right wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.5, -size * 0.5, -size * 0.8, 0);
    ctx.quadraticCurveTo(-size * 0.5, size * 0.5, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  _drawSleigh(particle) {
    const ctx = this.ctx, x = particle.x, y = particle.y, size = particle.size * 1.5, dir = particle.vx > 0 ? 1 : -1;
    const legAngle = Math.sin(particle.time * 0.01) * (Math.PI / 5);
    [{x: 4.8, y: 0}, {x: 4.0, y: -0.3}, {x: 4.0, y: 0.3}, {x: 3.2, y: -0.15}, {x: 3.2, y: 0.15}].forEach((pos, i) => {
      const rX = x + dir * (size * pos.x), oY = pos.y * size;
      ctx.fillStyle = '#9c6e49';
      ctx.strokeStyle = '#7b563a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rX - dir * size * 0.4, y + oY);
      ctx.quadraticCurveTo(rX, y + oY - size * 0.4, rX + dir * size * 0.4, y + oY);
      ctx.quadraticCurveTo(rX, y + oY + size * 0.4, rX - dir * size * 0.4, y + oY);
      ctx.fill();
      ctx.stroke();
      const hX = rX + dir * size * 0.5, hY = y + oY - size * 0.3;
      ctx.beginPath();
      ctx.ellipse(hX, hY, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#6e4a2e';
      ctx.lineWidth = 1.5;
      const anX = hX - dir * size * 0.1, anY = hY - size * 0.15;
      ctx.beginPath();
      ctx.moveTo(anX, anY);
      ctx.lineTo(anX - dir * size * 0.2, anY - size * 0.3);
      ctx.lineTo(anX - dir * size * 0.1, anY - size * 0.4);
      ctx.moveTo(anX - dir * size * 0.2, anY - size * 0.3);
      ctx.lineTo(anX - dir * size * 0.3, anY - size * 0.35);
      ctx.stroke();
      const legY = y + oY + size * 0.1;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#7b563a';
      ctx.beginPath();
      ctx.moveTo(rX + dir * size * 0.3, legY);
      ctx.lineTo(rX + dir * (size * 0.3 + Math.sin(legAngle) * size * 0.2), legY + size * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rX - dir * size * 0.3, legY);
      ctx.lineTo(rX - dir * (size * 0.3 - Math.sin(legAngle) * size * 0.2), legY + size * 0.3);
      ctx.stroke();
      if (i === 0) {
        const nX = hX + dir * size * 0.25, nY = hY;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(nX, nY, size * 0.03, 0, Math.PI * 2);
        ctx.fill();
        const g = ctx.createRadialGradient(nX, nY, 0, nX, nY, size * 0.10);
        g.addColorStop(0, 'rgba(255,0,0,0.7)');
        g.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nX, nY, size * 0.10, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.fillStyle = '#c00';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    const sT = y - size * 0.7, sF = x + dir * size * 1.5, sB = x - dir * size * 0.3, sBot = y + size * 0.3;

    // Sleigh body
    ctx.beginPath();
    ctx.moveTo(sF, sT);
    ctx.quadraticCurveTo(x + dir * size, y - size * 0.2, sF - dir * size * 0.8, y);
    ctx.lineTo(sB, y);
    ctx.lineTo(sB, sBot);
    ctx.lineTo(sF, sBot);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sleigh back
    ctx.beginPath();
    ctx.moveTo(sB, y);
    ctx.quadraticCurveTo(sB - dir * size * 0.4, y - size * 0.5, sB, sT);
    ctx.quadraticCurveTo(sB + dir * size * 0.2, y - size * 0.4, sB + dir * size * 0.2, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Runners/blades
    ctx.strokeStyle = '#a52a2a';
    ctx.lineWidth = 4;
    const runnerY = sBot + size * 0.2;

    function drawRunner(offset) {
      ctx.beginPath();
      ctx.moveTo(sF + dir * size * 0.1, runnerY + offset);
      ctx.quadraticCurveTo(x, runnerY + offset + size * 0.2, sB - dir * size * 0.2, runnerY + offset);
      ctx.stroke();
      // Struts
      ctx.beginPath();
      ctx.moveTo(sF - dir * size * 0.5, sBot);
      ctx.lineTo(sF - dir * size * 0.5, runnerY + offset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sB + dir * size * 0.5, sBot);
      ctx.lineTo(sB + dir * size * 0.5, runnerY + offset);
      ctx.stroke();
    }

    drawRunner(0);
    drawRunner(size * 0.1);


    const sackX = x - dir * size * 0.05; // Re-inserted sackX definition
    ctx.fillStyle = '#5c4033'; // Brown sack
    ctx.beginPath();
    // More irregular, lumpy shape for the sack
    ctx.moveTo(sackX - size * 0.3, y - size * 0.4);
    ctx.quadraticCurveTo(sackX - size * 0.6, y - size * 0.2, sackX - size * 0.4, y + size * 0.1);
    ctx.quadraticCurveTo(sackX, y + size * 0.3, sackX + size * 0.4, y + size * 0.1);
    ctx.quadraticCurveTo(sackX + size * 0.6, y - size * 0.2, sackX + size * 0.3, y - size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Add a highlight for dimension
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(sackX + size * 0.1, y - size * 0.3, size * 0.2, size * 0.1, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#654321'; // Rope tie
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sackX, y - size * 0.4, size * 0.2, 0, Math.PI, true);
    ctx.stroke();
    const saX = x + dir * size * 0.6, saY = y - size * 0.55;
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.moveTo(saX - size * 0.2, saY);
    ctx.lineTo(saX + size * 0.2, saY);
    ctx.lineTo(saX, saY - size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(saX - size * 0.22, saY, size * 0.44, size * 0.08);
    ctx.beginPath();
    ctx.arc(saX, saY - size * 0.4, size * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD7BA';
    ctx.beginPath();
    ctx.arc(saX, saY + size * 0.08, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(saX, saY + size * 0.2, size * 0.25, size * 0.2, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    [{x: 4.8, y: 0}, {x: 4.0, y: -0.3}, {x: 4.0, y: 0.3}, {x: 3.2, y: -0.15}, {x: 3.2, y: 0.15}].forEach(pos => {
      const rX = x + dir * (size * pos.x), oY = pos.y * size, hX = rX + dir * size * 0.5;
      ctx.beginPath();
      ctx.moveTo(saX, saY + size * 0.1);
      ctx.quadraticCurveTo((saX + hX) / 2, y + oY - size * 0.5, hX - dir * size * 0.1, y + oY - size * 0.3);
      ctx.stroke();
    });
  }

  /**
   * Draws a tree at the specified particle's position with given size and rotation.
   *
   * @param {Object} particle - The particle object containing properties like x, y, size, rotation, and snowLevel.
   * @return {void}
   */
  _drawTree(particle) {
    const ctx = this.ctx, x = particle.x, y = particle.y, size = particle.size;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, size * 0.8);
    ctx.lineTo(size * 0.2, size * 0.8);
    ctx.lineTo(size * 0.15, size * 1.3);
    ctx.lineTo(-size * 0.15, size * 1.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4a2f1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-size * 0.15, size * 0.9 + i * size * 0.12);
      ctx.lineTo(size * 0.15, size * 0.9 + i * size * 0.12);
      ctx.stroke();
    }
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 3; i++) {
      const lY = i * size * 0.4, lS = size * (1.2 - i * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, -lY);
      ctx.lineTo(-lS, size * 0.3 - lY);
      ctx.lineTo(lS, size * 0.3 - lY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1.5;
    for (let l = 0; l < 3; l++) {
      const lY = l * size * 0.4, lS = size * (1.2 - l * 0.2);
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const xP = -lS + (i / 6) * lS * 2, yP = size * 0.15 - lY + (i % 2 === 0 ? -size * 0.1 : 0);
        if (i === 0) ctx.moveTo(xP, yP); else ctx.lineTo(xP, yP);
      }
      ctx.stroke();
    }
    const baubleColors = ['#ff0000', '#0000ff', '#ffd700', '#ff69b4', '#00ff00'];
    for (let i = 0; i < 8; i++) {
      const l = Math.floor(i / 3), lY = l * size * 0.4, lS = size * (1.2 - l * 0.2) * 0.7,
        angle = (i % 3) * (Math.PI * 2 / 3) + l * 0.5, bX = Math.cos(angle) * lS, bY = size * 0.1 - lY;
      ctx.fillStyle = baubleColors[i % baubleColors.length];
      ctx.beginPath();
      ctx.arc(bX, bY, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(bX - size * 0.04, bY - size * 0.04, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
    const lightColors = ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ffffff'];
    for (let i = 0; i < 12; i++) {
      const l = Math.floor(i / 4), lY = l * size * 0.4, lS = size * (1.2 - l * 0.2) * 0.85,
        angle = (i % 4) * (Math.PI * 2 / 4) + l * 0.3, lX = Math.cos(angle) * lS, lY_ = size * 0.2 - lY,
        tI = (Math.sin((this.twinkleTime * 0.003) + (i * 0.5)) + 1) * 0.5, gO = 0.3 + (tI * 0.7),
        g = ctx.createRadialGradient(lX, lY_, 0, lX, lY_, size * 0.15), c = lightColors[i % lightColors.length];
      g.addColorStop(0, c);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = gO;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(lX, lY_, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.5 + (tI * 0.5);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(lX, lY_, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    const sS = size * 0.35, sY = -size * 1.4;
    const sG = ctx.createRadialGradient(0, sY, 0, 0, sY, sS * 2);
    sG.addColorStop(0, 'rgba(255,223,0,1)');
    sG.addColorStop(0.3, 'rgba(255,215,0,0.7)');
    sG.addColorStop(0.6, 'rgba(255,215,0,0.3)');
    sG.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = sG;
    ctx.beginPath();
    ctx.arc(0, sY, sS * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    this._drawSimpleStar(ctx, 0, sY, sS);
    ctx.save();
    ctx.translate(0, sY);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10 - Math.PI / 2, r = i % 2 === 0 ? sS : sS * 0.4, pX = Math.cos(a) * r,
        pY = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(pX, pY); else ctx.lineTo(pX, pY);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  /**
   * Draws a wreath on the canvas based on the provided particle's properties.
   *
   * @param {Object} particle - The particle object containing shape, position, size, rotation, and snowLevel.
   * @return {void}
   */
  _drawWreath(particle) {
    const ctx = this.ctx, x = particle.x, y = particle.y, size = particle.size;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);
    particle.shape.forEach(seg => {
      ctx.lineWidth = size * seg.thickness;
      ctx.strokeStyle = seg.color;
      ctx.beginPath();
      const sA = seg.angle - (Math.PI / particle.shape.length), eA = seg.angle + (Math.PI / particle.shape.length);
      ctx.arc(0, 0, size * seg.radius, sA, eA);
      ctx.stroke();
    });
    const lightColors = ['#ff0000', '#ffff00', '#0000ff'];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + particle.rotation, lX = Math.cos(angle) * size, lY = Math.sin(angle) * size,
        tI = (Math.sin((this.twinkleTime * 0.002) + (i * 0.7)) + 1) / 2;
      if (tI > 0.5) {
        const gO = (tI - 0.5) * 2, c = lightColors[i % lightColors.length],
          g = ctx.createRadialGradient(lX, lY, 0, lX, lY, size * 0.15);
        g.addColorStop(0, c);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = gO;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(lX, lY, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.fillStyle = '#c00';
    const bowY = -size;
    ctx.beginPath();
    ctx.ellipse(-size * 0.3, bowY, size * 0.3, size * 0.4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.3, bowY, size * 0.3, size * 0.4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, bowY, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Draws an elf representation using the provided particle's position and properties.
   *
   * @param {Object} particle - The object containing position, velocity, size, and time information.
   *                             It should have properties x (x-coordinate), y (y-coordinate),
   *                             vx (velocity in x-direction), size (size of the elf), and time (elapsed time).
   */
  _drawElf(particle) {
    const ctx = this.ctx, x = particle.x, y = particle.y, size = particle.size, dir = particle.vx > 0 ? 1 : -1;
    ctx.save();
    ctx.translate(x, y);
    const legAngle = Math.sin(particle.time * 0.02) * (Math.PI / 6);
    ctx.fillStyle = '#004d00';
    ctx.fillRect(dir * -size * 0.1, size * 0.2, size * 0.2, size * 0.5 + (Math.sin(legAngle + Math.PI) * size * 0.1));
    ctx.fillStyle = '#4a2c2a';
    ctx.beginPath();
    ctx.ellipse(dir * 0, size * 0.7 + (Math.sin(legAngle + Math.PI) * size * 0.1), size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#006400';
    ctx.fillRect(dir * size * 0.1, size * 0.2, size * 0.2, size * 0.5 + (Math.sin(legAngle) * size * 0.1));
    ctx.fillStyle = '#5d3836';
    ctx.beginPath();
    ctx.ellipse(dir * size * 0.2, size * 0.7 + (Math.sin(legAngle) * size * 0.1), size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#008000';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(dir * size * 0.4, size * 0.3);
    ctx.lineTo(dir * -size * 0.4, size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFD7BA';
    ctx.beginPath();
    ctx.arc(0, -size * 0.6, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(dir * size * 0.35, -size * 0.6);
    ctx.lineTo(dir * -size * 0.35, -size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.quadraticCurveTo(dir * size * 0.2, -size * 1.1, dir * size * 0.4, -size * 1.3);
    ctx.stroke();
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(dir * size * 0.4, -size * 1.3, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawTrain(particle) {
    const ctx = this.ctx;
    const x = particle.x;
    const y = particle.y;
    const size = particle.size * 1.8;
    const dir = particle.vx > 0 ? 1 : -1;
    const time = particle.time;

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    const wheelRotation = time * 0.005;
    const baseUnit = size / 20;

    // --- Define a stable baseline and proportions ---
    const baseY = 0; // Let baseY be the track level where wheels touch

    const wheelRadius = baseUnit * 8;
    const smallWheelRadius = baseUnit * 5;

    const chassisHeight = baseUnit * 7;
    const carHeight = baseUnit * 35;

    // Align bottom of chassis and carriage bodies to be the same distance from their respective wheel axles
    const carriageBodyBottomY = -smallWheelRadius - baseUnit;
    const engineChassisBottomY = -wheelRadius - baseUnit;

    const carBodyTopY = carriageBodyBottomY - carHeight;

    const cabHeight = baseUnit * 30;
    const boilerRadius = baseUnit * 10;
    const boilerTopY = engineChassisBottomY - chassisHeight - boilerRadius * 2;

    const engineLength = baseUnit * 70;
    const cabWidth = baseUnit * 25;
    const boilerWidth = engineLength - cabWidth;
    const carWidth = baseUnit * 60;
    const carGap = baseUnit * 15;

    // --- Draw Carriages ---
    for (let i = 1; i <= particle.carriages; i++) {
      const carX = -(cabWidth + (i * (carWidth + carGap)) - carGap);

      // Wheels
      ctx.fillStyle = '#222';
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(carX + carWidth * 0.25, -smallWheelRadius, smallWheelRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(carX + carWidth * 0.75, -smallWheelRadius, smallWheelRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.fillStyle = '#004d00';
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = baseUnit * 0.5;
      ctx.fillRect(carX, carBodyTopY, carWidth, carHeight);
      ctx.strokeRect(carX, carBodyTopY, carWidth, carHeight);

      // Windows, Silhouettes, Wreath...
      const windowHeight = carHeight * 0.6;
      const windowY = carBodyTopY + carHeight * 0.2;
      // ... (rest of the window/decoration logic)
      ctx.shadowColor = '#F1C40F';
      ctx.shadowBlur = 15;
      const lightIntensity = 0.8 + Math.sin(time * 0.001 + i) * 0.2;
      ctx.fillStyle = `rgba(255, 235, 150, ${lightIntensity})`;

      const windowWidth = carWidth * 0.25;
      const window1X = carX + carWidth * 0.15;
      const window2X = carX + carWidth * 0.6;

      ctx.fillRect(window1X, windowY, windowWidth, windowHeight);
      ctx.fillRect(window2X, windowY, windowWidth, windowHeight);
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      const headRadius1 = windowWidth * 0.2;
      const headX1 = window1X + windowWidth / 2;
      const headY1 = windowY + headRadius1 * 1.8;
      ctx.beginPath();
      ctx.arc(headX1, headY1, headRadius1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(headX1 - headRadius1, headY1 + headRadius1, headRadius1 * 2, headRadius1 * 2);

      const headRadius2 = windowWidth * 0.18;
      const headX2 = window2X + windowWidth / 2;
      const headY2 = windowY + headRadius2 * 1.6;
      ctx.beginPath();
      ctx.arc(headX2, headY2, headRadius2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(headX2 - headRadius2 * 1.2, headY2, headRadius2 * 2.4, headRadius2 * 2.5);

      const wreathSize = baseUnit * 4;
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(carX + carWidth / 2, carBodyTopY + carHeight / 2, wreathSize, 0, Math.PI * 2);
      ctx.arc(carX + carWidth / 2, carBodyTopY + carHeight / 2, wreathSize * 0.6, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.fillStyle = '#c00';
      ctx.beginPath();
      ctx.arc(carX + carWidth / 2, carBodyTopY + carHeight / 2 + wreathSize, wreathSize * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Coupling
      ctx.strokeStyle = '#111';
      ctx.lineWidth = baseUnit;
      ctx.beginPath();
      const couplingY = carriageBodyBottomY + chassisHeight / 2;
      const prevEnd = (i === 1) ? -cabWidth : carX + carWidth + carGap;
      ctx.moveTo(carX + carWidth, couplingY);
      ctx.lineTo(prevEnd, couplingY);
      ctx.stroke();
    }

    // --- Draw Engine ---
    // Wheels
    ctx.fillStyle = '#2C3E50';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = baseUnit;
    const wheelPositions = [baseUnit * 15, baseUnit * 35, baseUnit * 55];
    wheelPositions.forEach(wx => {
      ctx.beginPath();
      ctx.arc(wx, -wheelRadius, wheelRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    const smallWheelX = -baseUnit * 10;
    ctx.beginPath();
    ctx.arc(smallWheelX, -smallWheelRadius, smallWheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Chassis
    ctx.fillStyle = '#1C2833';
    ctx.fillRect(-cabWidth - baseUnit * 5, engineChassisBottomY - chassisHeight, engineLength + baseUnit * 5, chassisHeight);

    // Cab
    ctx.fillStyle = '#B03A2E';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = baseUnit * 0.7;
    const cabTopY = engineChassisBottomY - chassisHeight - cabHeight;
    ctx.beginPath();
    ctx.moveTo(-cabWidth, cabTopY);
    ctx.lineTo(0, cabTopY);
    ctx.lineTo(0, engineChassisBottomY - chassisHeight);
    ctx.lineTo(-cabWidth - baseUnit * 5, engineChassisBottomY - chassisHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 235, 150, ${0.8 + Math.sin(time * 0.001) * 0.2})`;
    ctx.fillRect(-cabWidth + baseUnit * 4, cabTopY + baseUnit * 4, cabWidth - baseUnit * 12, baseUnit * 10);

    // Boiler
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.moveTo(0, engineChassisBottomY - chassisHeight);
    ctx.lineTo(boilerWidth, engineChassisBottomY - chassisHeight);
    ctx.arc(boilerWidth, boilerTopY + boilerRadius, boilerRadius, Math.PI / 2, -Math.PI / 2);
    ctx.lineTo(0, boilerTopY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chimney & Headlight
    const chimneyTopY = boilerTopY - baseUnit * 8;
    ctx.fillStyle = '#17202A';
    ctx.beginPath();
    ctx.moveTo(boilerWidth * 0.7, boilerTopY);
    ctx.lineTo(boilerWidth * 0.7 - baseUnit * 2, chimneyTopY);
    ctx.lineTo(boilerWidth * 0.7 + baseUnit * 10, chimneyTopY - baseUnit * 4);
    ctx.lineTo(boilerWidth * 0.7 + baseUnit * 8, boilerTopY);
    ctx.closePath();
    ctx.fill();

    const lightX = boilerWidth + boilerRadius;
    const lightY = boilerTopY + boilerRadius;
    const lightRadius = baseUnit * 4;
    const gradient = ctx.createRadialGradient(lightX, lightY, lightRadius * 0.2, lightX, lightY, lightRadius * 1.5);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 220, 100, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(lightX - lightRadius, lightY - lightRadius, lightRadius * 2, lightRadius * 2);

    // Rods
    ctx.strokeStyle = '#99A3A4';
    ctx.lineWidth = baseUnit * 2;
    const rodYOffset = Math.sin(wheelRotation) * wheelRadius * 0.6;
    const mainRodX = wheelPositions[1] + Math.cos(wheelRotation) * wheelRadius * 0.6;
    const pistonX = engineLength - baseUnit * 10;
    const pistonY = engineChassisBottomY - chassisHeight + baseUnit * 2 + Math.sin(time * 0.01) * baseUnit;

    ctx.beginPath();
    ctx.moveTo(pistonX, pistonY);
    ctx.lineTo(mainRodX, -wheelRadius + rodYOffset);
    ctx.stroke();

    ctx.lineWidth = baseUnit * 1.5;
    [wheelPositions[0], wheelPositions[2]].forEach(wx => {
      const subRodX = wx + Math.cos(wheelRotation) * wheelRadius * 0.6;
      ctx.beginPath();
      ctx.moveTo(mainRodX, -wheelRadius + rodYOffset);
      ctx.lineTo(subRodX, -wheelRadius + rodYOffset);
      ctx.stroke();
    });

    // Smoke
    particle.smoke.forEach(s => {
      ctx.fillStyle = `rgba(220, 220, 220, ${s.opacity})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Draws a simple star on the canvas context.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for drawing.
   * @param {number} x - The x-coordinate of the center of the star.
   * @param {number} y - The y-coordinate of the center of the star.
   * @param {number} size - The size of the star, determining its overall dimensions.
   *
   * @return {void}
   */
  _drawSimpleStar(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2, r = i % 2 === 0 ? size : size * 0.4, pX = Math.cos(a) * r,
        pY = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(pX, pY); else ctx.lineTo(pX, pY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Binds event listeners to the window and document objects.
   *
   * This method attaches a 'resize' event listener to the window that triggers the _handleResize method
   * when the window is resized. Additionally, it attaches a 'visibilitychange' event listener to the document
   * which invokes the _handleVisibility method when the visibility of the page changes (e.g., switching tabs).
   *
   * @return {void}
   */
  _bindEvents() {
    window.addEventListener('resize', this._handleResize);
    document.addEventListener('visibilitychange', this._handleVisibility);
  }

  /**
   * Handles the resize event for the canvas.
   * Clears any existing timeout and sets a new one to delay the resizing action,
   * ensuring that rapid window resizes do not trigger multiple resize operations.
   *
   * @return {void}
   */
  _handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (this.canvas) {
        this._resizeCanvas();
        this._createParticles();
      }
    }, 250);
  }

  /**
   * Handles the visibility change of the document.
   * If the document is hidden, it pauses the operation.
   * If the document is visible, and the operation is enabled and not already paused, it starts the operation.
   *
   * @return {void}
   */
  _handleVisibility() {
    if (document.hidden) {
      this.pause();
    } else if (this.enabled && !this.isPaused) {
      this.start();
    }
  }

  /**
   * Cleans up resources and event listeners used by the object.
   *
   * This method removes the canvas element from the DOM, detaches resize and visibility change event listeners,
   * and sets various properties to null to free up memory.
   *
   * @return {void}
   */
  _cleanup() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    window.removeEventListener('resize', this._handleResize);
    document.removeEventListener('visibilitychange', this._handleVisibility);
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.specialParticles = [];
    this.animationId = null;
  }
}