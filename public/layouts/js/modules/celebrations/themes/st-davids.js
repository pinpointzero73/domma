/**
 * St David's Day Theme for Domma Celebrations
 * (March 1st, Welsh Celebration)
 *
 * Features:
 * - Falling daffodils (Welsh national flower)
 * - Leek shapes (Welsh symbol)
 * - Welsh dragon
 * - Red and white color scheme (Welsh flag colors)
 * - Daffodil fields
 * - Spring-themed particles
 */

export default {
  name: 'st-davids',
  displayName: 'St David\'s Day',
  emoji: '🌻',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 50,
      speedRange: [0.4, 1.2],
      sizeRange: [2, 4],
      daffodilFields: 2,
      dragonChance: 0.0002,
      twinklingStars: 10
    },
    medium: {
      count: 100,
      speedRange: [0.5, 1.5],
      sizeRange: [2, 5],
      daffodilFields: 3,
      dragonChance: 0.0004,
      twinklingStars: 18
    },
    heavy: {
      count: 150,
      speedRange: [0.6, 1.8],
      sizeRange: [3, 6],
      daffodilFields: 4,
      dragonChance: 0.0006,
      twinklingStars: 25
    }
  },

  particles: ['daffodil-petal', 'daffodil', 'spring-sparkle'],
  decorations: ['daffodil-field', 'welsh-dragon', 'flag', 'harp', 'leek-bundle', 'twinkling-star'],
  colors: {
    primary: '#FFDD00',    // Daffodil yellow
    secondary: '#228B22',  // Green (leeks)
    accent: '#DC143C',     // Welsh red
    white: '#FFFFFF'       // Welsh white
  },

  /**
   * Create daffodil petal particle (simple yellow petal)
   */
  createDaffodilPetal(canvasWidth, canvasHeight, config) {
    const yellowShades = ['#FFDD00', '#FFE135', '#FFED4E', '#FFF68F'];
    return {
      type: 'daffodil-petal',
      x: -30,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),  // Horizontal drift
      size: (config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0])) * 1.5,  // Larger petals
      speed: (Math.random() - 0.5) * 0.2,  // Gentle vertical bobbing
      opacity: 0.75 + Math.random() * 0.25,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: yellowShades[Math.floor(Math.random() * yellowShades.length)],
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.02 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create daffodil particle (full flower - rare)
   */
  createDaffodil(canvasWidth, canvasHeight, config) {
    return {
      type: 'daffodil',
      x: -30,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: 0.1,  // Minimal vertical movement
      opacity: 0.8 + Math.random() * 0.2,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      active: true
    };
  },

  /**
   * Create leek particle
   */
  createLeek(canvasWidth, canvasHeight, config) {
    return {
      type: 'leek',
      x: -30,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.8,  // Horizontal drift (was vertical speed)
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.2,
      speed: 0.15,  // Minimal vertical movement (was downward falling)
      opacity: 0.7 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.02 + Math.random() * 0.03,
      active: true
    };
  },

  /**
   * Create spring sparkle particle (Welsh spring colors)
   */
  createSpringSparkle(canvasWidth, canvasHeight, config) {
    const colors = ['#FFD700', '#FFFFFF', '#90EE90', '#98FB98']; // Gold, white, light green
    return {
      type: 'spring-sparkle',
      x: -20,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.8,  // Horizontal drift (was vertical speed)
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.6,
      vy: (Math.random() - 0.5) * 0.2,  // Minimal random vertical movement
      opacity: 0.6 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinklePhase: Math.random() * Math.PI * 2,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      active: true,
      static: false
    };
  },

  /**
   * Create drifting particle (randomly picks type)
   * Note: St. David's Day particles drift horizontally (left-to-right), not vertically
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // 60% daffodil petals, 20% full daffodils, 15% sparkles, 5% leeks
    if (choice < 0.6) {
      return this.createDaffodilPetal(canvasWidth, canvasHeight, config);
    } else if (choice < 0.8) {
      return this.createDaffodil(canvasWidth, canvasHeight, config);
    } else if (choice < 0.95) {
      return this.createSpringSparkle(canvasWidth, canvasHeight, config);
    } else {
      return this.createLeek(canvasWidth, canvasHeight, config);
    }
  },

  /**
   * Create daffodil field decoration
   */
  createDaffodilField(canvasWidth, canvasHeight, options = {}) {
    const flowers = [];
    const flowerCount = 15 + Math.floor(Math.random() * 10);

    for (let i = 0; i < flowerCount; i++) {
      flowers.push({
        x: Math.random() * canvasWidth * 0.3,
        y: Math.random() * 40,
        size: 5 + Math.random() * 8,
        swayPhase: Math.random() * Math.PI * 2
      });
    }

    return {
      type: 'daffodil-field',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth * 0.7,
      y: options.y !== undefined ? options.y : canvasHeight - 50,
      flowers: flowers,
      opacity: 0.9,
      time: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations (Welsh-themed)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Daffodil fields
    const fieldCount = config.daffodilFields || 3;
    for (let i = 0; i < fieldCount; i++) {
      decorations.push(this.createDaffodilField(canvasWidth, canvasHeight, {
        x: (canvasWidth / (fieldCount + 1)) * (i + 1),
        y: canvasHeight - 50
      }));
    }

    // Welsh dragon (Y Ddraig Goch - prominent red dragon, left side)
    decorations.push({
      type: 'welsh-dragon',
      x: 150,
      y: canvasHeight - 80,
      baseY: canvasHeight - 80,
      vx: 0, // Static display
      size: 35 + Math.random() * 10,
      opacity: 1,
      time: 0,
      wingPhase: Math.random() * Math.PI * 2,
      breatheFirePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Welsh harp (traditional instrument, center-right)
    decorations.push({
      type: 'harp',
      x: canvasWidth - 200,
      y: canvasHeight - 90,
      size: 40 + Math.random() * 10,
      opacity: 1,
      glintPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Leek bundle (national vegetable, decorative display)
    decorations.push({
      type: 'leek-bundle',
      x: canvasWidth * 0.3,
      y: canvasHeight - 40,
      size: 25 + Math.random() * 5,
      opacity: 1,
      active: true,
      static: true
    });

    // Welsh flag (Y Ddraig Goch on flag)
    decorations.push({
      type: 'flag',
      x: canvasWidth - 100,
      y: 80,
      size: 50,
      opacity: 1,
      wavePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Create twinkling stars
    const starCount = config.twinklingStars || 18;
    for (let i = 0; i < starCount; i++) {
      decorations.push(this.createTwinklingStar(canvasWidth, canvasHeight));
    }

    return decorations;
  },

  /**
   * Create twinkling star particle
   */
  createTwinklingStar(canvasWidth, canvasHeight) {
    return {
      type: 'twinkling-star',
      x: Math.random() * canvasWidth,
      y: Math.random() * (canvasHeight * 0.5),
      size: 1 + Math.random() * 2,
      opacity: 0.6 + Math.random() * 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.003,
      active: true,
      static: true
    };
  },

  /**
   * Spawn special St David's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Welsh dragon (very rare, max 1)
    if (choice < config.dragonChance) {
      if (specialParticles.some(p => p.type === 'welsh-dragon')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'welsh-dragon',
        x: fromLeft ? -100 : canvasWidth + 100,
        y: Math.random() * canvasHeight * 0.4 + 50,
        baseY: Math.random() * canvasHeight * 0.4 + 50,
        vx: fromLeft ? 2 + Math.random() * 1 : -(2 + Math.random() * 1),
        size: 25 + Math.random() * 15,
        opacity: 1,
        waveAmplitude: 25 + Math.random() * 20,
        waveFrequency: 0.002 + Math.random() * 0.002,
        waveOffset: Math.random() * Math.PI * 2,
        time: 0,
        wingPhase: Math.random() * Math.PI * 2,
        breatheFirePhase: Math.random() * Math.PI * 2,
        fireParticles: [],
        active: true,
        static: false
      };
    }

    // Daffodil field (rare)
    if (choice < 0.0004) {
      const fieldCount = specialParticles.filter(p => p.type === 'daffodil-field').length;
      if (fieldCount < config.daffodilFields) {
        return this.createDaffodilField(canvasWidth, canvasHeight);
      }
    }

    return null;
  },

  /**
   * Draw daffodil petal (simple elliptical petal shape)
   */
  drawDaffodilPetal(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Flutter effect (petal curling as it drifts)
    const flutter = Math.sin(time * particle.flutterSpeed + particle.flutter) * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation + flutter);

    // Create petal shape (elongated ellipse)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = '#FFB700'; // Golden edge
    ctx.lineWidth = size * 0.08;

    ctx.beginPath();
    // Petal is wider at one end (teardrop shape)
    ctx.ellipse(0, 0, size * 0.6, size * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add subtle detail line (petal vein)
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.1);
    ctx.lineTo(0, size * 1.1);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw daffodil (full flower)
   */
  drawDaffodil(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Trumpet (center corona)
    ctx.fillStyle = '#FFA500'; // Orange center
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.moveTo(-size * 0.25, 0);
    ctx.lineTo(-size * 0.3, size * 0.3);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.lineTo(size * 0.25, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Petals (6 petals around trumpet)
    ctx.fillStyle = '#FFDD00';
    ctx.strokeStyle = '#FFC700';
    ctx.lineWidth = size * 0.06;

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.7);

      // Petal shape (pointed ellipse)
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Stem
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.lineTo(0, size * 1.5);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw leek
   */
  drawLeek(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // White bulb (bottom)
    ctx.fillStyle = '#F5F5F5';
    ctx.strokeStyle = '#DCDCDC';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.ellipse(0, size * 1.2, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Green stalk/leaves
    ctx.fillStyle = '#228B22';
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = size * 0.05;

    // Main stalk
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 1.2);
    ctx.quadraticCurveTo(-size * 0.25, size * 0.5, -size * 0.15, 0);
    ctx.quadraticCurveTo(0, -size * 0.2, size * 0.15, 0);
    ctx.quadraticCurveTo(size * 0.25, size * 0.5, size * 0.3, size * 1.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Leaves spreading at top
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, 0);
    ctx.quadraticCurveTo(-size * 0.6, -size * 0.3, -size * 0.8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.15, 0);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.3, size * 0.8, 0);
    ctx.stroke();

    // Roots
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = size * 0.05;
    for (let i = 0; i < 5; i++) {
      const rootX = (i - 2) * size * 0.15;
      ctx.beginPath();
      ctx.moveTo(rootX, size * 1.5);
      ctx.lineTo(rootX + Math.sin(i * 1.7) * size * 0.15, size * 1.8);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw spring sparkle
   */
  drawSpringSparkle(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const twinkle = 0.6 + Math.sin(time * 0.004 + particle.twinklePhase) * 0.4;

    ctx.save();
    ctx.globalAlpha = particle.opacity * twinkle;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Draw 4-pointed sparkle
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 2;

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.3, size * 0.3);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.3, -size * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw daffodil field
   */
  drawDaffodilField(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;

    ctx.save();
    ctx.globalAlpha = particle.opacity;

    particle.flowers.forEach(flower => {
      const sway = Math.sin(time * 0.001 + flower.swayPhase) * flower.size * 0.2;

      ctx.save();
      ctx.translate(x + flower.x, y - flower.y);
      ctx.rotate(sway * 0.1);

      // Stem
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = flower.size * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sway, -flower.size * 2);
      ctx.stroke();

      // Flower head (simplified)
      ctx.fillStyle = '#FFDD00';
      ctx.shadowColor = '#FFDD00';
      ctx.shadowBlur = flower.size * 0.5;
      ctx.beginPath();
      ctx.arc(sway, -flower.size * 2, flower.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Orange center
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(sway, -flower.size * 2, flower.size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  },

  /**
   * Draw Welsh dragon
   */
  drawWelshDragon(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Wing flapping
    const wingAngle = Math.sin(time * 0.012 + particle.wingPhase) * (Math.PI / 3);

    // Wings (behind body)
    ctx.fillStyle = '#DC143C'; // Red
    ctx.strokeStyle = '#8B0000'; // Dark red
    ctx.lineWidth = 2;

    // Back wing
    ctx.save();
    ctx.translate(-size * 0.3, -size * 0.3);
    ctx.rotate(-wingAngle * 0.9);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size * 1.2, -size * 0.8,
      -size * 1.5, -size * 0.3,
      -size * 1.3, size * 0.3
    );
    ctx.bezierCurveTo(
      -size * 0.8, size * 0.2,
      -size * 0.3, 0,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Front wing
    ctx.save();
    ctx.translate(size * 0.3, -size * 0.3);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 1.2, -size * 0.8,
      size * 1.5, -size * 0.3,
      size * 1.3, size * 0.3
    );
    ctx.bezierCurveTo(
      size * 0.8, size * 0.2,
      size * 0.3, 0,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Body
    ctx.fillStyle = '#DC143C';
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.7, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail (spiky)
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = size * 0.25;
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, 0);
    ctx.quadraticCurveTo(-size * 1.2, -size * 0.3, -size * 1.5, 0);
    ctx.stroke();

    // Tail spikes
    ctx.fillStyle = '#FFD700'; // Gold
    for (let i = 0; i < 3; i++) {
      const tailX = -size * (0.8 + i * 0.25);
      ctx.beginPath();
      ctx.moveTo(tailX - size * 0.1, -size * 0.2);
      ctx.lineTo(tailX, -size * 0.5);
      ctx.lineTo(tailX + size * 0.1, -size * 0.2);
      ctx.closePath();
      ctx.fill();
    }

    // Head
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.ellipse(size * 0.8, -size * 0.2, size * 0.4, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Snout
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(size * 1.1, -size * 0.2);
    ctx.quadraticCurveTo(size * 1.4, -size * 0.15, size * 1.3, 0);
    ctx.quadraticCurveTo(size * 1.4, 0.1, size * 1.1, -size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(size * 0.9, -size * 0.3, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size * 0.95, -size * 0.3, size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(size * 0.7, -size * 0.5);
    ctx.lineTo(size * 0.65, -size * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.9, -size * 0.5);
    ctx.lineTo(size * 0.95, -size * 0.8);
    ctx.stroke();

    // Fire breath (occasional)
    if (Math.sin(time * 0.005 + particle.breatheFirePhase) > 0.5) {
      const flameGradient = ctx.createLinearGradient(size * 1.3, -size * 0.1, size * 2, -size * 0.1);
      flameGradient.addColorStop(0, '#FF6600');
      flameGradient.addColorStop(0.5, '#FFA500');
      flameGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

      ctx.fillStyle = flameGradient;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(size * 1.3, -size * 0.1);
      ctx.bezierCurveTo(
        size * 1.6, -size * 0.3,
        size * 1.8, -size * 0.2,
        size * 2, -size * 0.1
      );
      ctx.bezierCurveTo(
        size * 1.8, 0,
        size * 1.6, 0.1,
        size * 1.3, -size * 0.1
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw Welsh harp (traditional instrument)
   */
  drawHarp(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Harp frame (curved wooden structure)
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';

    // Curved pillar (left side)
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 0.5);
    ctx.bezierCurveTo(
      -size * 0.5, size * 0.1,
      -size * 0.4, -size * 0.4,
      -size * 0.2, -size * 0.7
    );
    ctx.stroke();

    // Straight neck (top)
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.7);
    ctx.lineTo(size * 0.4, -size * 0.5);
    ctx.stroke();

    // Soundboard (right side)
    ctx.beginPath();
    ctx.moveTo(size * 0.4, -size * 0.5);
    ctx.lineTo(-size * 0.3, size * 0.5);
    ctx.stroke();

    // Harp strings (golden)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = size * 0.02;
    const stringCount = 12;
    for (let i = 0; i < stringCount; i++) {
      const t = i / (stringCount - 1);
      const startX = -size * 0.3 + t * size * 0.65;
      const startY = size * 0.5 - t * size * 1.0;
      const endX = -size * 0.25 + t * size * 0.55;
      const endY = -size * 0.65 + t * size * 0.15;

      // Slight wave to strings
      const wave = Math.sin(time * 0.003 + i * 0.3 + particle.glintPhase) * size * 0.02;

      ctx.beginPath();
      ctx.moveTo(startX + wave, startY);
      ctx.lineTo(endX + wave, endY);
      ctx.stroke();
    }

    // Decorative carvings on pillar (Celtic patterns)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = size * 0.03;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 4; i++) {
      const yPos = size * 0.3 - i * size * 0.25;
      ctx.beginPath();
      ctx.arc(-size * 0.35, yPos, size * 0.08, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw leek bundle (Welsh national vegetable)
   */
  drawLeekBundle(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Bundle of 5 leeks
    for (let i = 0; i < 5; i++) {
      ctx.save();
      const offsetX = (i - 2) * size * 0.15;
      const rotation = (i - 2) * 0.1;
      ctx.translate(offsetX, 0);
      ctx.rotate(rotation);

      // Leek white part (bulb)
      ctx.fillStyle = '#f5f5dc';
      ctx.strokeStyle = '#d3d3c0';
      ctx.lineWidth = 1;
      ctx.fillRect(-size * 0.08, size * 0.2, size * 0.16, size * 0.6);
      ctx.strokeRect(-size * 0.08, size * 0.2, size * 0.16, size * 0.6);

      // Leek green part (leaves)
      ctx.fillStyle = '#228B22';
      ctx.strokeStyle = '#1a6b1a';
      ctx.beginPath();
      ctx.moveTo(-size * 0.08, size * 0.2);
      ctx.lineTo(-size * 0.12, -size * 0.5);
      ctx.lineTo(0, -size * 0.7);
      ctx.lineTo(size * 0.12, -size * 0.5);
      ctx.lineTo(size * 0.08, size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leaf texture
      ctx.strokeStyle = '#1a5a1a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.2);
      ctx.lineTo(0, -size * 0.65);
      ctx.stroke();

      ctx.restore();
    }

    // Ribbon tying the bundle (red Welsh ribbon)
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(-size * 0.5, size * 0.4, size, size * 0.12);

    // Ribbon bow
    ctx.beginPath();
    ctx.ellipse(-size * 0.6, size * 0.46, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.6, size * 0.46, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw Welsh flag (Y Ddraig Goch - The Red Dragon)
   */
  drawFlag(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Flagpole
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = size * 0.04;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size * 1.5);
    ctx.stroke();

    // Flag wave motion
    const waveOffset = Math.sin(time * 0.003 + particle.wavePhase) * size * 0.08;

    // Flag background (white top, green bottom)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 0.3, 0 + waveOffset * 0.5,
      size * 0.6, 0 - waveOffset * 0.5,
      size * 0.9, 0 + waveOffset
    );
    ctx.lineTo(size * 0.9, size * 0.3 + waveOffset);
    ctx.bezierCurveTo(
      size * 0.6, size * 0.3 - waveOffset * 0.5,
      size * 0.3, size * 0.3 + waveOffset * 0.5,
      0, size * 0.3
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00B140';
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(
      size * 0.3, size * 0.3 + waveOffset * 0.5,
      size * 0.6, size * 0.3 - waveOffset * 0.5,
      size * 0.9, size * 0.3 + waveOffset
    );
    ctx.lineTo(size * 0.9, size * 0.6 + waveOffset);
    ctx.bezierCurveTo(
      size * 0.6, size * 0.6 - waveOffset * 0.5,
      size * 0.3, size * 0.6 + waveOffset * 0.5,
      0, size * 0.6
    );
    ctx.closePath();
    ctx.fill();

    // Y Ddraig Goch (The Red Dragon) - Welsh heraldic dragon
    ctx.fillStyle = '#DC143C';
    ctx.save();
    ctx.translate(size * 0.45, size * 0.3);
    ctx.scale(0.28, 0.28);

    // ===== DRAGON BODY (muscular, powerful) =====
    ctx.beginPath();
    // Chest (broad)
    ctx.ellipse(size * 0.1, 0, size * 0.45, size * 0.3, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Neck (thick, connecting to head)
    ctx.beginPath();
    ctx.ellipse(size * 0.4, -size * 0.25, size * 0.22, size * 0.15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Haunches (rear body)
    ctx.beginPath();
    ctx.ellipse(-size * 0.25, size * 0.1, size * 0.35, size * 0.28, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // ===== DRAGON HEAD (detailed, fierce) =====
    // Snout/muzzle
    ctx.beginPath();
    ctx.ellipse(size * 0.65, -size * 0.28, size * 0.2, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper jaw (protruding)
    ctx.beginPath();
    ctx.moveTo(size * 0.55, -size * 0.32);
    ctx.bezierCurveTo(
      size * 0.7, -size * 0.38,
      size * 0.85, -size * 0.35,
      size * 0.88, -size * 0.28
    );
    ctx.lineTo(size * 0.82, -size * 0.25);
    ctx.bezierCurveTo(
      size * 0.78, -size * 0.28,
      size * 0.65, -size * 0.3,
      size * 0.55, -size * 0.28
    );
    ctx.closePath();
    ctx.fill();

    // Lower jaw
    ctx.beginPath();
    ctx.moveTo(size * 0.58, -size * 0.24);
    ctx.bezierCurveTo(
      size * 0.72, -size * 0.22,
      size * 0.84, -size * 0.24,
      size * 0.87, -size * 0.28
    );
    ctx.lineTo(size * 0.82, -size * 0.3);
    ctx.bezierCurveTo(
      size * 0.75, -size * 0.27,
      size * 0.65, -size * 0.26,
      size * 0.58, -size * 0.27
    );
    ctx.closePath();
    ctx.fill();

    // Eye (fierce)
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.ellipse(size * 0.58, -size * 0.32, size * 0.04, size * 0.05, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#DC143C';

    // Horns (two curved horns)
    ctx.beginPath();
    // Left horn
    ctx.moveTo(size * 0.5, -size * 0.38);
    ctx.bezierCurveTo(
      size * 0.48, -size * 0.55,
      size * 0.52, -size * 0.65,
      size * 0.58, -size * 0.68
    );
    ctx.lineTo(size * 0.62, -size * 0.64);
    ctx.bezierCurveTo(
      size * 0.58, -size * 0.62,
      size * 0.54, -size * 0.52,
      size * 0.54, -size * 0.38
    );
    ctx.closePath();
    ctx.fill();

    // Right horn
    ctx.beginPath();
    ctx.moveTo(size * 0.48, -size * 0.4);
    ctx.bezierCurveTo(
      size * 0.42, -size * 0.58,
      size * 0.38, -size * 0.68,
      size * 0.35, -size * 0.72
    );
    ctx.lineTo(size * 0.38, -size * 0.74);
    ctx.bezierCurveTo(
      size * 0.42, -size * 0.7,
      size * 0.46, -size * 0.58,
      size * 0.5, -size * 0.42
    );
    ctx.closePath();
    ctx.fill();

    // ===== WINGS (large, bat-like with finger bones) =====
    // Left wing (rear)
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.15);
    // Wing membrane with finger bones creating points
    // Bone 1
    ctx.bezierCurveTo(
      -size * 0.3, -size * 0.5,
      -size * 0.35, -size * 0.75,
      -size * 0.25, -size * 0.85
    );
    ctx.lineTo(-size * 0.22, -size * 0.82);
    // Bone 2
    ctx.bezierCurveTo(
      -size * 0.1, -size * 0.85,
      0, -size * 0.9,
      size * 0.1, -size * 0.88
    );
    ctx.lineTo(size * 0.12, -size * 0.84);
    // Bone 3
    ctx.bezierCurveTo(
      size * 0.2, -size * 0.8,
      size * 0.28, -size * 0.72,
      size * 0.3, -size * 0.62
    );
    ctx.lineTo(size * 0.25, -size * 0.58);
    // Bone 4
    ctx.bezierCurveTo(
      size * 0.22, -size * 0.5,
      size * 0.18, -size * 0.35,
      size * 0.1, -size * 0.25
    );
    ctx.lineTo(0, -size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Right wing (front) - slightly forward
    ctx.beginPath();
    ctx.moveTo(size * 0.15, -size * 0.2);
    ctx.bezierCurveTo(
      size * 0.3, -size * 0.55,
      size * 0.45, -size * 0.78,
      size * 0.6, -size * 0.82
    );
    ctx.lineTo(size * 0.62, -size * 0.78);
    ctx.bezierCurveTo(
      size * 0.7, -size * 0.75,
      size * 0.8, -size * 0.68,
      size * 0.85, -size * 0.58
    );
    ctx.lineTo(size * 0.82, -size * 0.54);
    ctx.bezierCurveTo(
      size * 0.75, -size * 0.52,
      size * 0.68, -size * 0.45,
      size * 0.6, -size * 0.38
    );
    ctx.lineTo(size * 0.55, -size * 0.35);
    ctx.bezierCurveTo(
      size * 0.45, -size * 0.3,
      size * 0.32, -size * 0.25,
      size * 0.2, -size * 0.22
    );
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;

    // ===== FRONT LEGS (with claws) =====
    // Right front leg (foreground)
    ctx.beginPath();
    // Upper leg
    ctx.ellipse(size * 0.25, size * 0.15, size * 0.12, size * 0.25, 0.5, 0, Math.PI * 2);
    ctx.fill();
    // Lower leg
    ctx.beginPath();
    ctx.moveTo(size * 0.32, size * 0.35);
    ctx.lineTo(size * 0.38, size * 0.55);
    ctx.lineTo(size * 0.42, size * 0.57);
    ctx.lineTo(size * 0.36, size * 0.37);
    ctx.closePath();
    ctx.fill();
    // Claws (three)
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const clawX = size * 0.36 + i * size * 0.04;
      ctx.moveTo(clawX, size * 0.55);
      ctx.lineTo(clawX + size * 0.02, size * 0.63);
      ctx.lineTo(clawX + size * 0.04, size * 0.55);
      ctx.closePath();
      ctx.fill();
    }

    // Left front leg (background)
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.ellipse(size * 0.15, size * 0.12, size * 0.1, size * 0.22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.18, size * 0.3);
    ctx.lineTo(size * 0.2, size * 0.48);
    ctx.lineTo(size * 0.24, size * 0.5);
    ctx.lineTo(size * 0.22, size * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // ===== HIND LEGS (with claws) =====
    // Right hind leg
    ctx.beginPath();
    ctx.ellipse(-size * 0.15, size * 0.25, size * 0.15, size * 0.28, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-size * 0.08, size * 0.48);
    ctx.lineTo(-size * 0.02, size * 0.65);
    ctx.lineTo(size * 0.02, size * 0.67);
    ctx.lineTo(-size * 0.04, size * 0.5);
    ctx.closePath();
    ctx.fill();
    // Claws
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const clawX = -size * 0.04 + i * size * 0.04;
      ctx.moveTo(clawX, size * 0.65);
      ctx.lineTo(clawX + size * 0.02, size * 0.72);
      ctx.lineTo(clawX + size * 0.04, size * 0.65);
      ctx.closePath();
      ctx.fill();
    }

    // Left hind leg (background)
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.ellipse(-size * 0.28, size * 0.22, size * 0.13, size * 0.25, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ===== TAIL (long, powerful, with spikes) =====
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, size * 0.05);
    ctx.bezierCurveTo(
      -size * 0.75, size * 0.15,
      -size * 0.95, 0,
      -size * 1.05, -size * 0.3
    );
    ctx.bezierCurveTo(
      -size * 1.1, -size * 0.45,
      -size * 1.05, -size * 0.6,
      -size * 0.95, -size * 0.68
    );
    // Tail tip (pointed)
    ctx.lineTo(-size * 0.88, -size * 0.72);
    ctx.lineTo(-size * 0.92, -size * 0.65);
    ctx.bezierCurveTo(
      -size * 1.0, -size * 0.56,
      -size * 1.02, -size * 0.42,
      -size * 0.98, -size * 0.28
    );
    ctx.bezierCurveTo(
      -size * 0.88, 0,
      -size * 0.68, size * 0.1,
      -size * 0.48, size * 0.08
    );
    ctx.closePath();
    ctx.fill();

    // Tail spikes (triangular, along top edge)
    const spikeCount = 5;
    for (let i = 0; i < spikeCount; i++) {
      const t = i / (spikeCount - 1);
      // Calculate position along tail curve
      const spikeX = -size * 0.6 - t * size * 0.4;
      const spikeY = size * 0.1 - t * size * 0.7 + Math.sin(t * Math.PI) * size * 0.15;
      const spikeSize = size * 0.12 * (1 - t * 0.5);

      ctx.beginPath();
      ctx.moveTo(spikeX, spikeY);
      ctx.lineTo(spikeX - spikeSize * 0.3, spikeY - spikeSize);
      ctx.lineTo(spikeX + spikeSize * 0.3, spikeY - spikeSize * 0.8);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();   // closes dragon save (line 856)

    ctx.restore();   // closes flag save (line 804) - THIS WAS MISSING
  },

  /**
   * Draw twinkling star
   */
  drawTwinklingStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    const twinkleIntensity = 0.5 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;

    const starColor = `rgba(255, 240, 200, ${twinkleIntensity})`;
    const glowColor = `rgba(255, 220, 150, ${twinkleIntensity * 0.4})`;

    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = glowColor;
    ctx.shadowBlur = size * 3 * twinkleIntensity;
    ctx.fillStyle = starColor;

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const outerX = Math.cos(angle) * size;
      const outerY = Math.sin(angle) * size;
      const innerAngle = angle + Math.PI / 4;
      const innerX = Math.cos(innerAngle) * (size * 0.3);
      const innerY = Math.sin(innerAngle) * (size * 0.3);

      if (i === 0) {
        ctx.moveTo(outerX, outerY);
      } else {
        ctx.lineTo(outerX, outerY);
      }
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = size * 2 * twinkleIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};
