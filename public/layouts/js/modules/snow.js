/**
 * SnowEffect - Canvas-based festive snow animation with special effects
 * Part of Domma Layout System
 */

const INTENSITY_CONFIG = {
  light: {
    count: 50,
    speedRange: [0.5, 1.5],
    sizeRange: [1, 3],
    trees: 5,
    wreaths: 3
  },
  medium: {
    count: 150,
    speedRange: [0.8, 2.5],
    sizeRange: [1, 4],
    trees: 10,
    wreaths: 6
  },
  heavy: {
    count: 300,
    speedRange: [1.0, 3.5],
    sizeRange: [1, 5],
    trees: 20,
    wreaths: 10
  }
};

export class SnowEffect {
  constructor(options = {}) {
    this.intensity = options.intensity || 'medium';
    this.enabled = options.enabled !== undefined ? options.enabled : false;
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
    this.canvas.id = 'dm-snow-effect';
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
    return {
      type: 'wreath',
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: 0,
      vy: 0,
      size: 15 + Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: 0,
      active: true,
      static: true
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
    if (Math.random() < 0.0005) { // ~0.05% chance per frame
      this._spawnSpecialParticle();
    }

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
    // Only spawn sleighs (trees and wreaths are static)
    const fromLeft = Math.random() < 0.5;
    const startY = Math.random() * (this.canvas.height * 0.5); // Upper 50% of screen

    this.specialParticles.push({
      type: 'sleigh',
      x: fromLeft ? -100 : this.canvas.width + 100,
      y: startY,
      baseY: startY, // Track original Y for sine wave
      vx: fromLeft ? 3 + Math.random() * 2 : -(3 + Math.random() * 2), // Horizontal speed
      waveAmplitude: 20 + Math.random() * 30, // How much the sleigh bobs up/down
      waveFrequency: 0.001 + Math.random() * 0.002, // Speed of wave oscillation
      wavePhase: Math.random() * Math.PI * 2, // Random starting point in wave
      time: 0, // Track time for sine wave
      size: 15 + Math.random() * 10,
      opacity: 0.9,
      rotation: 0,
      active: true,
      static: false
    });
  }

  _updateSpecialParticle(particle, deltaTime) {
    // Skip static particles (trees and wreaths)
    if (particle.static) return;

    const normalizedDelta = deltaTime / (1000 / 60);

    // Update horizontal position
    particle.x += particle.vx * normalizedDelta;

    // For sleighs, use sine wave for smooth up/down flight motion
    if (particle.type === 'sleigh') {
      particle.time += deltaTime;
      const wave = Math.sin(particle.time * particle.waveFrequency + particle.wavePhase);
      particle.y = particle.baseY + (wave * particle.waveAmplitude);

      // Mark inactive when off screen
      if (particle.x < -200 || particle.x > this.canvas.width + 200) {
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
    }

    ctx.restore();
  }

  _drawSleigh(particle) {
    const ctx = this.ctx;
    const x = particle.x;
    const y = particle.y;
    const size = particle.size * 1.5; // Make it bigger
    const direction = particle.vx > 0 ? 1 : -1;

    // Draw 5 reindeer in V-formation
    const reindeerPositions = [
      {x: 4.8, y: 0},      // Rudolph - lead position, straight ahead
      {x: 4.0, y: -0.3},   // Second row left
      {x: 4.0, y: 0.3},    // Second row right
      {x: 3.2, y: -0.15},  // Back row left
      {x: 3.2, y: 0.15}    // Back row right
    ];

    for (let i = 0; i < 5; i++) {
      const reindeerX = x + direction * (size * reindeerPositions[i].x);
      const offsetY = reindeerPositions[i].y * size;

      ctx.fillStyle = '#8B4513'; // Brown

      // Reindeer body
      ctx.beginPath();
      ctx.ellipse(reindeerX, y + offsetY, size * 0.5, size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Reindeer neck
      ctx.fillRect(reindeerX + direction * size * 0.35, y + offsetY - size * 0.25, size * 0.15, size * 0.25);

      // Reindeer head
      ctx.beginPath();
      ctx.ellipse(reindeerX + direction * size * 0.6, y + offsetY - size * 0.35, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antlers (branching)
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 1.5;
      const antlerBase = reindeerX + direction * size * 0.6;
      // Main antler branch
      ctx.beginPath();
      ctx.moveTo(antlerBase, y + offsetY - size * 0.45);
      ctx.lineTo(antlerBase + direction * size * 0.15, y + offsetY - size * 0.7);
      ctx.stroke();
      // Sub branches
      ctx.beginPath();
      ctx.moveTo(antlerBase + direction * size * 0.08, y + offsetY - size * 0.58);
      ctx.lineTo(antlerBase + direction * size * 0.2, y + offsetY - size * 0.65);
      ctx.stroke();

      // Legs
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(reindeerX - size * 0.15, y + offsetY + size * 0.25, size * 0.1, size * 0.2);
      ctx.fillRect(reindeerX + size * 0.15, y + offsetY + size * 0.25, size * 0.1, size * 0.2);

      // Red nose on Rudolph (lead reindeer at i === 0)
      if (i === 0) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(reindeerX + direction * size * 0.75, y + offsetY - size * 0.35, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        // Nose glow
        const noseGlow = ctx.createRadialGradient(
          reindeerX + direction * size * 0.75, y + offsetY - size * 0.35, 0,
          reindeerX + direction * size * 0.75, y + offsetY - size * 0.35, size * 0.2
        );
        noseGlow.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
        noseGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = noseGlow;
        ctx.beginPath();
        ctx.arc(reindeerX + direction * size * 0.75, y + offsetY - size * 0.35, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reins connecting Santa to each reindeer
    const santaX = x + direction * size * 0.6;
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const reindeerX = x + direction * (size * reindeerPositions[i].x);
      const offsetY = reindeerPositions[i].y * size;
      ctx.beginPath();
      ctx.moveTo(santaX + direction * size * 0.2, y - size * 0.3);
      ctx.quadraticCurveTo(
        x + direction * size * 2, y + offsetY - size * 0.4,
        reindeerX - direction * size * 0.3, y + offsetY - size * 0.1
      );
      ctx.stroke();
    }

    // Gift sack at rear of sleigh (behind Santa)
    const sackX = x - direction * size * 0.2;
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(sackX, y - size * 0.15, size * 0.3, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sack tie/rope at top
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sackX, y - size * 0.45, size * 0.15, 0, Math.PI, true);
    ctx.stroke();

    // Gold ribbon/bow
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(sackX - size * 0.1, y - size * 0.5, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sackX + size * 0.1, y - size * 0.5, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Sleigh runners - curved skis
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    // Front runner
    ctx.beginPath();
    ctx.moveTo(x - direction * size * 0.4, y + size * 0.3);
    ctx.quadraticCurveTo(x + direction * size * 0.2, y + size * 0.5, x + direction * size * 0.7, y + size * 0.25);
    ctx.stroke();
    // Back runner
    ctx.beginPath();
    ctx.moveTo(x + direction * size * 0.5, y + size * 0.3);
    ctx.quadraticCurveTo(x + direction * size * 1.1, y + size * 0.5, x + direction * size * 1.6, y + size * 0.25);
    ctx.stroke();

    // Sleigh body - elegant curved design (drawn before Santa so he appears inside)
    ctx.fillStyle = '#8B0000'; // Dark red
    ctx.beginPath();
    ctx.moveTo(x - direction * size * 0.3, y - size * 0.5);
    ctx.quadraticCurveTo(x + direction * size * 0.5, y - size * 0.7, x + direction * size * 1.5, y - size * 0.5);
    ctx.lineTo(x + direction * size * 1.3, y + size * 0.2);
    ctx.quadraticCurveTo(x + direction * size * 0.7, y + size * 0.4, x - direction * size * 0.1, y + size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Sleigh highlights
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gold decorative swirls
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + direction * size * 0.6, y - size * 0.3, size * 0.15, 0, Math.PI);
    ctx.stroke();

    // Santa in sleigh (drawn AFTER sleigh body so upper body visible above sleigh edge)
    // Santa's upper body (red coat) - only top half visible
    ctx.fillStyle = '#C41E3A';
    ctx.beginPath();
    ctx.arc(santaX, y - size * 0.1, size * 0.35, 0, Math.PI, true); // Top half of torso
    ctx.fill();

    // White fur trim at waist (where sleigh edge cuts off)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(santaX - size * 0.35, y - size * 0.12, size * 0.7, size * 0.08);

    // Santa's head
    ctx.fillStyle = '#FFD7BA';
    ctx.beginPath();
    ctx.arc(santaX, y - size * 0.5, size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Santa's beard
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(santaX, y - size * 0.35, size * 0.25, size * 0.2, 0, 0, Math.PI);
    ctx.fill();

    // Santa's hat
    ctx.fillStyle = '#C41E3A';
    ctx.beginPath();
    ctx.moveTo(santaX - size * 0.2, y - size * 0.6);
    ctx.lineTo(santaX + size * 0.2, y - size * 0.6);
    ctx.lineTo(santaX + direction * size * 0.35, y - size * 0.9);
    ctx.closePath();
    ctx.fill();

    // Hat white trim
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(santaX - size * 0.2, y - size * 0.63, size * 0.4, size * 0.08);

    // Hat pompom
    ctx.beginPath();
    ctx.arc(santaX + direction * size * 0.35, y - size * 0.9, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Santa's mittens holding reins
    ctx.fillStyle = '#C41E3A';
    ctx.beginPath();
    ctx.arc(santaX + direction * size * 0.2, y - size * 0.3, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(santaX - direction * size * 0.1, y - size * 0.3, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
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

  _drawStar(particle) {
    const ctx = this.ctx;
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.fillStyle = '#FFD700'; // Gold
    this._drawSimpleStar(ctx, x, y, size);

    // Tail/trail
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - particle.vx * 3, y);
    ctx.stroke();
  }

  _drawWreath(particle) {
    const ctx = this.ctx;
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Outer wreath ring (evergreen)
    ctx.strokeStyle = '#228B22'; // Forest green
    ctx.lineWidth = size * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    // Inner darker ring for depth
    ctx.strokeStyle = '#1a6b1a';
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // Red bow at top
    ctx.fillStyle = '#C41E3A'; // Christmas red
    // Left bow loop
    ctx.beginPath();
    ctx.ellipse(-size * 0.3, -size * 1.1, size * 0.25, size * 0.35, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right bow loop
    ctx.beginPath();
    ctx.ellipse(size * 0.3, -size * 1.1, size * 0.25, size * 0.35, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Bow center knot
    ctx.beginPath();
    ctx.arc(0, -size * 1.1, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    // Bow ribbons
    ctx.fillRect(-size * 0.08, -size * 1.1, size * 0.16, size * 0.4);

    // Berries (small red dots around wreath)
    ctx.fillStyle = '#ff0000';
    const berryCount = 8;
    for (let i = 0; i < berryCount; i++) {
      const angle = (i / berryCount) * Math.PI * 2;
      const bx = Math.cos(angle) * size;
      const by = Math.sin(angle) * size;
      ctx.beginPath();
      ctx.arc(bx, by, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Small ornament baubles
    const baubleColors = ['#ffd700', '#0000ff', '#ff69b4'];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.5;
      const ox = Math.cos(angle) * size * 1.1;
      const oy = Math.sin(angle) * size * 1.1;
      ctx.fillStyle = baubleColors[i % baubleColors.length];
      ctx.beginPath();
      ctx.arc(ox, oy, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }

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
