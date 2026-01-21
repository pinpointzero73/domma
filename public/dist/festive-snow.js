/**
 * Festive Snow Effect v1.0.0
 * Canvas-based festive snow with Santa, reindeer, and decorated trees
 *
 * @author Darryl Waterhouse
 * @license MIT
 * @see https://github.com/yourusername/let-it-snow.git
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FestiveSnow = {}));
})(this, (function (exports) { 'use strict';

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

  class SnowEffect {
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
        static: true,
        snowLevel: 0 // For snow accumulation
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
        shape: wreathShape, // Store the pre-generated shape
        snowLevel: 0 // For snow accumulation
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

      if (choice < 0.0005) { // Spawn sleigh
        const fromLeft = Math.random() < 0.5;
        const startY = Math.random() * (this.canvas.height * 0.5); // Upper 50% of screen

        this.specialParticles.push({
          type: 'sleigh',
          x: fromLeft ? -100 : this.canvas.width + 100,
          y: startY,
          baseY: startY,
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
      } else if (choice < 0.0008) { // Spawn elf (rarer)
        const fromLeft = Math.random() < 0.5;
        const startY = this.canvas.height - 30; // Bottom of the screen

        this.specialParticles.push({
          type: 'elf',
          x: fromLeft ? -50 : this.canvas.width + 50,
          y: startY,
          baseY: startY,
          vx: fromLeft ? 1.5 + Math.random() * 1 : -(1.5 + Math.random() * 1), // Slower than sleigh
          waveAmplitude: 3, // Bobbing motion
          waveFrequency: 0.05,
          wavePhase: Math.random() * Math.PI * 2,
          time: 0,
          size: 10 + Math.random() * 5,
          opacity: 0.95,
          rotation: 0,
          active: true,
          static: false
        });
      }
    }

    _updateSpecialParticle(particle, deltaTime) {
      const normalizedDelta = deltaTime / (1000 / 60);

      // Accumulate snow on static objects
      if (particle.static) {
        if (Math.random() < 0.0005) {
          particle.snowLevel = Math.min(particle.snowLevel + Math.random() * 0.2, particle.size * 0.3);
        }
        return;
      }

      // Update horizontal position for moving particles
      particle.x += particle.vx * normalizedDelta;
      particle.time += deltaTime;

      // Sine wave motion for sleighs and elves
      if (particle.type === 'sleigh' || particle.type === 'elf') {
        const wave = Math.sin(particle.time * particle.waveFrequency + particle.wavePhase);
        particle.y = particle.baseY + (wave * particle.waveAmplitude);

        const offscreenMargin = particle.type === 'sleigh' ? 200 : 100;
        if (particle.x < -offscreenMargin || particle.x > this.canvas.width + offscreenMargin) {
          particle.active = false;
        }
      }
    }

    _drawSpecialParticle(particle) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = particle.opacity;

      if (particle.type === 'sleigh') {
        this._drawSleigh(particle);
      } else if (particle.type === 'tree') {
        this._drawTree(particle);
      } else if (particle.type === 'wreath') {
        this._drawWreath(particle);
      } else if (particle.type === 'elf') {
        this._drawElf(particle);
      }

      ctx.restore();
    }

    _drawElf(particle) {
      const ctx = this.ctx;
      const x = particle.x;
      const y = particle.y;
      const size = particle.size;
      const direction = particle.vx > 0 ? 1 : -1;

      ctx.save();
      ctx.translate(x, y);

      // Leg animation based on time
      const legAngle = Math.sin(particle.time * 0.02) * (Math.PI / 6);

      // Back leg
      ctx.fillStyle = '#004d00'; // Dark green
      ctx.fillRect(direction * -size * 0.1, size * 0.2, size * 0.2, size * 0.5 + (Math.sin(legAngle + Math.PI) * size * 0.1));
      // Back shoe
      ctx.fillStyle = '#4a2c2a';
      ctx.beginPath();
      ctx.ellipse(direction * 0, size * 0.7 + (Math.sin(legAngle + Math.PI) * size * 0.1), size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Front leg
      ctx.fillStyle = '#006400'; // Green
      ctx.fillRect(direction * size * 0.1, size * 0.2, size * 0.2, size * 0.5 + (Math.sin(legAngle) * size * 0.1));
      // Front shoe
      ctx.fillStyle = '#5d3836';
      ctx.beginPath();
      ctx.ellipse(direction * size * 0.2, size * 0.7 + (Math.sin(legAngle) * size * 0.1), size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (tunic)
      ctx.fillStyle = '#008000'; // Bright green
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.5);
      ctx.lineTo(direction * size * 0.4, size * 0.3);
      ctx.lineTo(direction * -size * 0.4, size * 0.3);
      ctx.closePath();
      ctx.fill();

      // Head
      ctx.fillStyle = '#FFD7BA';
      ctx.beginPath();
      ctx.arc(0, -size * 0.6, size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Hat
      ctx.fillStyle = '#c00'; // Red hat
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(direction * size * 0.35, -size * 0.6);
      ctx.lineTo(direction * -size * 0.35, -size * 0.6);
      ctx.closePath();
      ctx.fill();

      // Hat point
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.quadraticCurveTo(direction * size * 0.2, -size * 1.1, direction * size * 0.4, -size * 1.3);
      ctx.stroke();

      // Hat pompom
      ctx.fillStyle = '#ffff00'; // Yellow
      ctx.beginPath();
      ctx.arc(direction * size * 0.4, -size * 1.3, size * 0.15, 0, Math.PI * 2);
      ctx.fill();


      ctx.restore();
    }

    _drawSleigh(particle) {
      const ctx = this.ctx;
      const x = particle.x;
      const y = particle.y;
      const size = particle.size * 1.5;
      const direction = particle.vx > 0 ? 1 : -1;

      // Reindeer drawing
      const reindeerPositions = [
        {x: 4.8, y: 0},
        {x: 4.0, y: -0.3},
        {x: 4.0, y: 0.3},
        {x: 3.2, y: -0.15},
        {x: 3.2, y: 0.15}
      ];

      const legAngle = Math.sin(particle.time * 0.01) * (Math.PI / 5);

      for (let i = 0; i < 5; i++) {
        const reindeerX = x + direction * (size * reindeerPositions[i].x);
        const offsetY = reindeerPositions[i].y * size;

        ctx.fillStyle = '#9c6e49'; // A richer brown
        ctx.strokeStyle = '#7b563a';
        ctx.lineWidth = 1;

        // Body
        ctx.beginPath();
        ctx.moveTo(reindeerX - direction * size * 0.4, y + offsetY);
        ctx.quadraticCurveTo(reindeerX, y + offsetY - size * 0.4, reindeerX + direction * size * 0.4, y + offsetY);
        ctx.quadraticCurveTo(reindeerX, y + offsetY + size * 0.4, reindeerX - direction * size * 0.4, y + offsetY);
        ctx.fill();
        ctx.stroke();

        // Head
        const headX = reindeerX + direction * size * 0.5;
        const headY = y + offsetY - size * 0.3;
        ctx.beginPath();
        ctx.ellipse(headX, headY, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Antlers
        ctx.strokeStyle = '#6e4a2e';
        ctx.lineWidth = 1.5;
        const antlerBaseX = headX - direction * size * 0.1;
        const antlerBaseY = headY - size * 0.15;
        ctx.beginPath();
        ctx.moveTo(antlerBaseX, antlerBaseY);
        ctx.lineTo(antlerBaseX - direction * size * 0.2, antlerBaseY - size * 0.3);
        ctx.lineTo(antlerBaseX - direction * size * 0.1, antlerBaseY - size * 0.4);
        ctx.moveTo(antlerBaseX - direction * size * 0.2, antlerBaseY - size * 0.3);
        ctx.lineTo(antlerBaseX - direction * size * 0.3, antlerBaseY - size * 0.35);
        ctx.stroke();

        // Animated Legs
        const legY = y + offsetY + size * 0.1;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#7b563a';
        ctx.beginPath();
        ctx.moveTo(reindeerX + direction * size * 0.3, legY);
        ctx.lineTo(reindeerX + direction * (size * 0.3 + Math.sin(legAngle) * size * 0.2), legY + size * 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(reindeerX - direction * size * 0.3, legY);
        ctx.lineTo(reindeerX - direction * (size * 0.3 - Math.sin(legAngle) * size * 0.2), legY + size * 0.3);
        ctx.stroke();

        // Rudolph's nose
        if (i === 0) {
          const noseX = headX + direction * size * 0.25;
          const noseY = headY;
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(noseX, noseY, size * 0.05, 0, Math.PI * 2); // Smaller nose
          ctx.fill();

          // Smaller glow
          const noseGlow = ctx.createRadialGradient(noseX, noseY, 0, noseX, noseY, size * 0.15);
          noseGlow.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
          noseGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
          ctx.fillStyle = noseGlow;
          ctx.beginPath();
          ctx.arc(noseX, noseY, size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Sleigh body (classic design)
      ctx.fillStyle = '#c00'; // Christmas red
      ctx.strokeStyle = '#FFD700'; // Gold trim
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sleighTop = y - size * 0.7;
      const sleighFront = x + direction * size * 1.5;
      const sleighBack = x - direction * size * 0.3;
      const sleighBottom = y + size * 0.3;
      ctx.moveTo(sleighFront, sleighTop);
      ctx.quadraticCurveTo(x + direction * size * 1.2, y - size * 0.3, sleighFront, sleighBottom);
      ctx.lineTo(sleighBack, sleighBottom);
      ctx.quadraticCurveTo(x - direction * size * 0.5, y, sleighBack, sleighTop);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gift sack
      const sackX = x - direction * size * 0.05;
      ctx.fillStyle = '#5c4033'; // Brown sack
      ctx.beginPath();
      ctx.ellipse(sackX, y - size * 0.2, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Santa (only head and hat visible)
      const santaX = x + direction * size * 0.6;
      const santaY = y - size * 0.55;

      // Hat
      ctx.fillStyle = '#c00';
      ctx.beginPath();
      ctx.moveTo(santaX - size * 0.2, santaY);
      ctx.lineTo(santaX + size * 0.2, santaY);
      ctx.lineTo(santaX, santaY - size * 0.4);
      ctx.closePath();
      ctx.fill();

      // Hat trim
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(santaX - size * 0.22, santaY, size * 0.44, size * 0.08);

      // Hat pompom
      ctx.beginPath();
      ctx.arc(santaX, santaY - size * 0.4, size * 0.07, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#FFD7BA'; // Skin tone
      ctx.beginPath();
      ctx.arc(santaX, santaY + size * 0.08, size * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // Beard
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(santaX, santaY + size * 0.2, size * 0.25, size * 0.2, 0, 0, Math.PI);
      ctx.fill();

      // Reins
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const reindeerX = x + direction * (size * reindeerPositions[i].x);
        const offsetY = reindeerPositions[i].y * size;
        const headX = reindeerX + direction * size * 0.5;
        ctx.beginPath();
        ctx.moveTo(santaX, santaY + size * 0.1);
        ctx.quadraticCurveTo(
          (santaX + headX) / 2, y + offsetY - size * 0.5,
          headX - direction * size * 0.1, y + offsetY - size * 0.3
        );
        ctx.stroke();
      }
    }

    _drawTree(particle) {
      const ctx = this.ctx;
      const x = particle.x;
      const y = particle.y;
      const size = particle.size;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(particle.rotation);

      // Tree trunk - tapered shape
      ctx.fillStyle = '#654321'; // Darker brown
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, size * 0.8); // Top left
      ctx.lineTo(size * 0.2, size * 0.8);  // Top right
      ctx.lineTo(size * 0.15, size * 1.3); // Bottom right
      ctx.lineTo(-size * 0.15, size * 1.3); // Bottom left
      ctx.closePath();
      ctx.fill();

      // Trunk texture lines
      ctx.strokeStyle = '#4a2f1a';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-size * 0.15, size * 0.9 + i * size * 0.12);
        ctx.lineTo(size * 0.15, size * 0.9 + i * size * 0.12);
        ctx.stroke();
      }

      // Tree layers (3 triangles)
      ctx.fillStyle = '#228B22'; // Forest green

      for (let i = 0; i < 3; i++) {
        const layerY = i * size * 0.4;
        const layerSize = size * (1.2 - i * 0.2);

        ctx.beginPath();
        ctx.moveTo(0, -layerY);
        ctx.lineTo(-layerSize, size * 0.3 - layerY);
        ctx.lineTo(layerSize, size * 0.3 - layerY);
        ctx.closePath();
        ctx.fill();
      }

      // Tinsel garland (zigzag lines)
      ctx.strokeStyle = '#C0C0C0'; // Silver
      ctx.lineWidth = 1.5;
      for (let layer = 0; layer < 3; layer++) {
        const layerY = layer * size * 0.4;
        const layerSize = size * (1.2 - layer * 0.2);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const xPos = -layerSize + (i / 6) * layerSize * 2;
          const yPos = size * 0.15 - layerY + (i % 2 === 0 ? -size * 0.1 : 0);
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        }
        ctx.stroke();
      }

      // Baubles (ornaments)
      const baubleColors = ['#ff0000', '#0000ff', '#ffd700', '#ff69b4', '#00ff00'];
      for (let i = 0; i < 8; i++) {
        const layer = Math.floor(i / 3);
        const layerY = layer * size * 0.4;
        const layerSize = size * (1.2 - layer * 0.2) * 0.7;
        const angle = (i % 3) * (Math.PI * 2 / 3) + layer * 0.5;
        const bx = Math.cos(angle) * layerSize;
        const by = size * 0.1 - layerY;

        ctx.fillStyle = baubleColors[i % baubleColors.length];
        ctx.beginPath();
        ctx.arc(bx, by, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        // Bauble highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(bx - size * 0.04, by - size * 0.04, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
      }

      // Twinkling lights (glowing dots)
      const lightColors = ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ffffff'];
      for (let i = 0; i < 12; i++) {
        const layer = Math.floor(i / 4);
        const layerY = layer * size * 0.4;
        const layerSize = size * (1.2 - layer * 0.2) * 0.85;
        const angle = (i % 4) * (Math.PI * 2 / 4) + layer * 0.3;
        const lx = Math.cos(angle) * layerSize;
        const ly = size * 0.2 - layerY;

        // Twinkle effect - each light has its own phase
        const twinklePhase = (this.twinkleTime * 0.003) + (i * 0.5); // Different phase for each light
        const twinkleIntensity = (Math.sin(twinklePhase) + 1) * 0.5; // 0 to 1

        // Glow effect with twinkle
        const glowOpacity = 0.3 + (twinkleIntensity * 0.7);
        const gradient = ctx.createRadialGradient(lx, ly, 0, lx, ly, size * 0.15);
        const color = lightColors[i % lightColors.length];
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.globalAlpha = glowOpacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(lx, ly, size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Light bulb with twinkle
        ctx.globalAlpha = 0.5 + (twinkleIntensity * 0.5);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(lx, ly, size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1; // Reset
      }

      // BRIGHT STAR ON TOP
      const starSize = size * 0.35; // Reduced by half
      const starY = -size * 1.4; // Higher up

      // Bright glow effect
      const starGlow = ctx.createRadialGradient(0, starY, 0, 0, starY, starSize * 2);
      starGlow.addColorStop(0, 'rgba(255, 223, 0, 1)');
      starGlow.addColorStop(0.3, 'rgba(255, 215, 0, 0.7)');
      starGlow.addColorStop(0.6, 'rgba(255, 215, 0, 0.3)');
      starGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = starGlow;
      ctx.beginPath();
      ctx.arc(0, starY, starSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Bright gold star
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      this._drawSimpleStar(ctx, 0, starY, starSize);

      // Add stroke to star for visibility
      ctx.save();
      ctx.translate(0, starY);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        const radius = i % 2 === 0 ? starSize : starSize * 0.4;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    _drawWreath(particle) {
      const ctx = this.ctx;
      const x = particle.x;
      const y = particle.y;
      const size = particle.size;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(particle.rotation);

      // Draw the pre-generated wreath shape
      particle.shape.forEach(segment => {
        ctx.lineWidth = size * segment.thickness;
        ctx.strokeStyle = segment.color;
        ctx.beginPath();
        const startAngle = segment.angle - (Math.PI / particle.shape.length);
        const endAngle = segment.angle + (Math.PI / particle.shape.length);
        ctx.arc(0, 0, size * segment.radius, startAngle, endAngle);
        ctx.stroke();
      });


      // Twinkling lights (this part remains the same)
      const lightColors = ['#ff0000', '#ffff00', '#0000ff'];
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + particle.rotation;
        const lx = Math.cos(angle) * size;
        const ly = Math.sin(angle) * size;

        const twinklePhase = (this.twinkleTime * 0.002) + (i * 0.7);
        const twinkleIntensity = (Math.sin(twinklePhase) + 1) / 2;

        if (twinkleIntensity > 0.5) {
          const glowOpacity = (twinkleIntensity - 0.5) * 2;
          const color = lightColors[i % lightColors.length];
          const gradient = ctx.createRadialGradient(lx, ly, 0, lx, ly, size * 0.15);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.globalAlpha = glowOpacity;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(lx, ly, size * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // Red bow at top (remains the same)
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

    _drawSimpleStar(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? size : size * 0.4;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    _bindEvents() {
      window.addEventListener('resize', this._handleResize);
      document.addEventListener('visibilitychange', this._handleVisibility);
    }

    _handleResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        if (this.canvas) {
          this._resizeCanvas();
          this._createParticles();
        }
      }, 250);
    }

    _handleVisibility() {
      if (document.hidden) {
        this.pause();
      } else if (this.enabled && !this.isPaused) {
        this.start();
      }
    }

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

  /**
   * SimpleStorage - Lightweight localStorage wrapper
   *
   * Provides a simple interface for storing and retrieving data from localStorage
   * with automatic JSON serialization/deserialization and error handling.
   *
   * @license MIT
   */

  class SimpleStorage {
    /**
     * Create a new SimpleStorage instance
     * @param {string} prefix - Key prefix for namespacing (default: 'festive-snow')
     */
    constructor(prefix = 'festive-snow') {
      this.prefix = prefix;
    }

    /**
     * Get a value from localStorage
     * @param {string} key - The key to retrieve
     * @param {*} defaultValue - Default value if key doesn't exist (default: null)
     * @returns {*} The stored value or defaultValue
     */
    get(key, defaultValue = null) {
      try {
        const value = localStorage.getItem(`${this.prefix}:${key}`);
        return value ? JSON.parse(value) : defaultValue;
      } catch {
        return defaultValue;
      }
    }

    /**
     * Set a value in localStorage
     * @param {string} key - The key to store under
     * @param {*} value - The value to store (will be JSON serialized)
     * @returns {boolean} True if successful, false otherwise
     */
    set(key, value) {
      try {
        localStorage.setItem(`${this.prefix}:${key}`, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }

    /**
     * Remove a value from localStorage
     * @param {string} key - The key to remove
     * @returns {boolean} True if successful, false otherwise
     */
    remove(key) {
      try {
        localStorage.removeItem(`${this.prefix}:${key}`);
        return true;
      } catch {
        return false;
      }
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is supported and enabled
     */
    isAvailable() {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * SnowToggle - UI controller for festive snow effect
   *
   * Provides a toggle button with intensity slider for controlling the snow effect.
   * Includes state persistence using localStorage.
   *
   * @license MIT
   */


  // Default Christmas tree icon SVG
  const DEFAULT_TREE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 4h-1l2 4h-1.5l2.5 5h-2l3 6H7l3-6H8l2.5-5H9l2-4h-1l2-4z"/></svg>`;

  class SnowToggle {
    /**
     * Create a new SnowToggle instance
     * @param {class} SnowEffectClass - The SnowEffect class to instantiate
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.container - Container to append toggle to (default: document.body)
     * @param {string} options.position - Position: 'top-right', 'top-left', 'bottom-right', 'bottom-left' (default: 'bottom-right')
     * @param {string} options.icon - Custom icon HTML or 'default' for built-in tree icon
     * @param {string} options.storageKey - localStorage key prefix (default: 'festive-snow')
     * @param {string[]} options.intensities - Available intensity levels (default: ['light', 'medium', 'heavy'])
     * @param {string} options.defaultIntensity - Default intensity level (default: 'medium')
     * @param {Function} options.seasonCheck - Optional callback for date-based visibility
     */
    constructor(SnowEffectClass, options = {}) {
      this.SnowEffect = SnowEffectClass;
      this.options = {
        container: options.container || document.body,
        position: options.position || 'bottom-right',
        icon: options.icon || 'default',
        storageKey: options.storageKey || 'festive-snow',
        intensities: options.intensities || ['light', 'medium', 'heavy'],
        defaultIntensity: options.defaultIntensity || 'medium',
        seasonCheck: options.seasonCheck || null,
        ...options
      };

      this.storage = new SimpleStorage(this.options.storageKey);
      this.snowEffect = null;
      this.elements = {};

      this.init();
    }

    /**
     * Initialize the toggle UI and event handlers
     */
    init() {
      this.createUI();
      this.attachEvents();
      this.restoreState();
    }

    /**
     * Create the toggle button and intensity slider UI
     */
    createUI() {
      // Determine icon HTML
      const iconHtml = this.options.icon === 'default' ? DEFAULT_TREE_ICON : this.options.icon;

      // Create container element
      const container = document.createElement('div');
      container.className = 'festive-snow-toggle-container';
      container.dataset.position = this.options.position;

      // Build intensity buttons
      const intensityButtons = this.options.intensities
        .map(intensity => {
          const label = intensity.charAt(0).toUpperCase() + intensity.slice(1);
          return `<button class="festive-snow-intensity-btn" data-intensity="${intensity}">${label}</button>`;
        })
        .join('');

      // Create HTML
      container.innerHTML = `
            <button class="festive-snow-toggle" id="festive-snow-toggle" data-tooltip="Snow effect">
                ${iconHtml}
            </button>
            <div class="festive-snow-slider" id="festive-snow-slider">
                ${intensityButtons}
            </div>
        `;

      // Append to container
      this.options.container.appendChild(container);

      // Store references to elements
      this.elements.container = container;
      this.elements.toggleBtn = container.querySelector('.festive-snow-toggle');
      this.elements.slider = container.querySelector('.festive-snow-slider');
      this.elements.intensityButtons = container.querySelectorAll('.festive-snow-intensity-btn');
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
      // Toggle button click handler
      this.elements.toggleBtn.addEventListener('click', () => {
        const isActive = this.elements.toggleBtn.classList.contains('active');

        if (isActive) {
          this.disable();
        } else {
          const intensity = this.storage.get('intensity', this.options.defaultIntensity);
          this.enable(intensity);
        }
      });

      // Intensity button click handlers
      this.elements.intensityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const intensity = btn.dataset.intensity;
          this.setIntensity(intensity);
        });
      });
    }

    /**
     * Restore saved state from localStorage
     */
    restoreState() {
      const enabled = this.storage.get('enabled', false);
      const intensity = this.storage.get('intensity', this.options.defaultIntensity);

      if (enabled) {
        this.enable(intensity);
      }

      this.updateSliderState();
    }

    /**
     * Enable snow effect
     * @param {string} intensity - Intensity level (light, medium, heavy)
     */
    enable(intensity = 'medium') {
      // Check season if callback provided
      if (typeof this.options.seasonCheck === 'function' && !this.options.seasonCheck()) {
        console.log('[FestiveSnow] Not enabling - outside festive season');
        return;
      }

      // Stop existing effect
      if (this.snowEffect) {
        this.snowEffect.stop();
      }

      // Create and start new effect
      this.snowEffect = new this.SnowEffect({
        intensity,
        enabled: true,
        seasonCheck: this.options.seasonCheck
      });
      this.snowEffect.init();
      this.snowEffect.start();

      // Update UI
      this.elements.toggleBtn.classList.add('active');

      // Save state
      this.storage.set('enabled', true);
      this.storage.set('intensity', intensity);

      this.updateSliderState();
    }

    /**
     * Disable snow effect
     */
    disable() {
      // Stop effect
      if (this.snowEffect) {
        this.snowEffect.stop();
        this.snowEffect = null;
      }

      // Update UI
      this.elements.toggleBtn.classList.remove('active');

      // Save state
      this.storage.set('enabled', false);
    }

    /**
     * Set intensity level
     * @param {string} level - Intensity level (light, medium, heavy)
     */
    setIntensity(level) {
      if (!this.options.intensities.includes(level)) {
        console.warn(`[FestiveSnow] Invalid intensity level: ${level}`);
        return;
      }

      // Save intensity
      this.storage.set('intensity', level);

      // Update existing effect if running
      if (this.snowEffect) {
        this.snowEffect.setIntensity(level);
      }

      this.updateSliderState();
    }

    /**
     * Update slider button active states
     */
    updateSliderState() {
      const current = this.storage.get('intensity', this.options.defaultIntensity);
      this.elements.intensityButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.intensity === current);
      });
    }

    /**
     * Destroy the toggle and clean up
     */
    destroy() {
      // Stop effect
      if (this.snowEffect) {
        this.snowEffect.stop();
        this.snowEffect = null;
      }

      // Remove UI
      if (this.elements.container && this.elements.container.parentNode) {
        this.elements.container.parentNode.removeChild(this.elements.container);
      }

      // Clear references
      this.elements = {};
    }
  }

  /**
   * Festive Snow - Canvas-based festive snow animation library
   *
   * A lightweight, zero-dependency JavaScript library that adds a festive snow effect
   * to web pages with customizable intensity and UI controls.
   *
   * Features:
   * - Canvas-based particle system with 6-pointed crystalline snowflakes
   * - Decorated Christmas trees with lights, baubles, tinsel, and star
   * - Christmas wreaths with bows and ornaments
   * - Santa's sleigh with 5 reindeer (including Rudolph with glowing nose)
   * - Smooth sine wave flight motion for sleighs
   * - Wind gusts and realistic physics simulation
   * - Twinkling lights animation
   * - Depth layers for 3D parallax effect
   * - Mobile-responsive (automatically reduces particles on small screens)
   * - Optional UI toggle with intensity slider
   * - State persistence using localStorage
   *
   * @version 1.0.0
   * @license MIT
   * @author Darryl Waterhouse
   */


  /**
   * Create and initialize a snow effect
   * @param {Object} options - Configuration options
   * @param {string} options.intensity - Intensity level: 'light', 'medium', 'heavy' (default: 'medium')
   * @param {boolean} options.enabled - Whether effect is enabled (default: false)
   * @param {Function} options.seasonCheck - Optional callback for date-based visibility
   * @param {boolean} options.autoStart - Whether to automatically start the effect (default: true)
   * @returns {SnowEffect} The created SnowEffect instance
   *
   * @example
   * // Basic usage
   * const snow = createSnowEffect({ intensity: 'heavy' });
   *
   * @example
   * // With season check
   * const snow = createSnowEffect({
   *   intensity: 'medium',
   *   seasonCheck: () => {
   *     const now = new Date();
   *     const month = now.getMonth();
   *     return month === 11 || month === 0; // December or January
   *   }
   * });
   *
   * @example
   * // Manual control
   * const snow = createSnowEffect({ autoStart: false });
   * // Later...
   * snow.start();
   */
  function createSnowEffect(options = {}) {
    const effect = new SnowEffect(options);
    effect.init();
    if (options.autoStart !== false) {
      effect.start();
    }
    return effect;
  }

  /**
   * Create a snow toggle UI with intensity controls
   * @param {Object} options - Configuration options
   * @param {HTMLElement} options.container - Container to append toggle to (default: document.body)
   * @param {string} options.position - Position: 'top-right', 'top-left', 'bottom-right', 'bottom-left' (default: 'bottom-right')
   * @param {string} options.icon - Custom icon HTML or 'default' for built-in tree icon
   * @param {string} options.storageKey - localStorage key prefix (default: 'festive-snow')
   * @param {string[]} options.intensities - Available intensity levels (default: ['light', 'medium', 'heavy'])
   * @param {string} options.defaultIntensity - Default intensity level (default: 'medium')
   * @param {Function} options.seasonCheck - Optional callback for date-based visibility
   * @returns {SnowToggle} The created SnowToggle instance
   *
   * @example
   * // Basic usage with default UI
   * createSnowToggle();
   *
   * @example
   * // Custom position and season check
   * createSnowToggle({
   *   position: 'top-right',
   *   seasonCheck: () => {
   *     const now = new Date();
   *     const month = now.getMonth();
   *     const day = now.getDate();
   *     return (month === 11) || (month === 0 && day <= 3);
   *   }
   * });
   *
   * @example
   * // Custom intensities
   * createSnowToggle({
   *   intensities: ['gentle', 'moderate', 'blizzard'],
   *   defaultIntensity: 'gentle'
   * });
   */
  function createSnowToggle(options = {}) {
    return new SnowToggle(SnowEffect, options);
  }

  /**
   * Helper function to check if it's the festive season (December 1 - January 3)
   * @returns {boolean} True if within festive season
   *
   * @example
   * if (isFestiveSeason()) {
   *   createSnowToggle();
   * }
   */
  function isFestiveSeason() {
    const now = new Date();
    const month = now.getMonth(); // 0 = January, 11 = December
    const day = now.getDate();

    // December (month 11) or January 1-3 (month 0, days 1-3)
    return (month === 11) || (month === 0 && day <= 3);
  }

  // Default export for convenience
  var index = {
    SnowEffect,
    SnowToggle,
    SimpleStorage,
    createSnowEffect,
    createSnowToggle,
    isFestiveSeason
  };

  exports.SimpleStorage = SimpleStorage;
  exports.SnowEffect = SnowEffect;
  exports.SnowToggle = SnowToggle;
  exports.createSnowEffect = createSnowEffect;
  exports.createSnowToggle = createSnowToggle;
  exports.default = index;
  exports.isFestiveSeason = isFestiveSeason;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=festive-snow.js.map
