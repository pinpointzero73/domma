/**
 * Valentine's Day Theme for Domma Celebrations
 *
 * Features:
 * - Floating hearts in various sizes and shades of pink/red
 * - Rose petals gently falling with realistic physics
 * - Cupid flying across the screen with bow and arrow
 * - Love letters floating gracefully
 * - Heart garlands strung across the viewport
 * - Romantic sparkles and glitter effects
 * - Soft pink/red color palette with gold accents
 */

export default {
  name: 'valentines',
  displayName: 'Valentine\'s Day',
  emoji: '💕',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 40,         // Fewer hearts for subtlety
      speedRange: [0.3, 0.8],
      sizeRange: [2, 4],
      garlands: 1,
      cupidChance: 0.0003
    },
    medium: {
      count: 80,
      speedRange: [0.4, 1.2],
      sizeRange: [2, 5],
      garlands: 2,
      cupidChance: 0.0005
    },
    heavy: {
      count: 150,
      speedRange: [0.5, 1.5],
      sizeRange: [3, 6],
      garlands: 3,
      cupidChance: 0.0008
    }
  },

  particles: ['heart', 'rose-petal', 'sparkle', 'lips'],
  decorations: ['cupid', 'love-letter', 'heart-garland', 'envelope', 'butterfly', 'heart-moon', 'neon-sign'],
  colors: {
    primary: '#ff1493',    // Deep pink
    secondary: '#ff69b4',  // Hot pink
    accent: '#dc143c',     // Crimson red
    light: '#ffb6c1',      // Light pink
    gold: '#ffd700'        // Gold accents
  },

  /**
   * Create floating heart particle
   */
  createHeart(canvasWidth, canvasHeight, config) {
    const depth = Math.random();
    let size, speed, opacity;
    const heartColors = ['#ff1493', '#ff69b4', '#dc143c', '#ffb6c1', '#ff0080'];

    if (depth < 0.33) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.5;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      opacity = 0.8 + Math.random() * 0.2;
    } else if (depth < 0.66) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      opacity = 0.6 + Math.random() * 0.2;
    } else {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.8;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.8;
      opacity = 0.4 + Math.random() * 0.2;
    }

    return {
      type: 'heart',
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: size,
      vx: (Math.random() - 0.5) * 0.3, // Gentle horizontal drift
      vy: (Math.random() - 0.7) * 0.2, // Slight upward bias (floating)
      speed: speed * 0.3, // Much slower overall movement
      opacity: opacity,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.005 + Math.random() * 0.01, // Slower wind
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01, // Slower rotation
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.002 + Math.random() * 0.003,
      floatPhase: Math.random() * Math.PI * 2, // For bobbing motion
      floatSpeed: 0.001 + Math.random() * 0.002,
      active: true,
      depth: depth
    };
  },

  /**
   * Create rose petal particle
   */
  createRosePetal(canvasWidth, canvasHeight, config) {
    const petalColors = ['#ff1493', '#ff69b4', '#dc143c', '#ff758f', '#ffb6c1'];

    return {
      type: 'rose-petal',
      x: Math.random() * canvasWidth,
      y: -20,
      size: 1.5 + Math.random() * 2,
      speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.6,
      opacity: 0.7 + Math.random() * 0.3,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.02 + Math.random() * 0.03,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      flutterPhase: Math.random() * Math.PI * 2,
      active: true
    };
  },

  /**
   * Create sparkle particle
   */
  createSparkle(canvasWidth, canvasHeight, config) {
    return {
      type: 'sparkle',
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 0.5 + Math.random() * 1.5,
      opacity: 1,
      life: 20 + Math.random() * 30,
      maxLife: 20 + Math.random() * 30,
      color: Math.random() < 0.5 ? '#ffd700' : '#ffffff',
      twinklePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create floating kissy lips particle
   */
  createLips(canvasWidth, canvasHeight, config) {
    const lipColors = ['#dc143c', '#ff1493', '#c71585', '#ff0066'];

    return {
      type: 'lips',
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 3 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.7) * 0.2, // Slight upward bias (floating)
      speed: 0.3 + Math.random() * 0.2,
      opacity: 0.8 + Math.random() * 0.2,
      color: lipColors[Math.floor(Math.random() * lipColors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.003 + Math.random() * 0.002,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.001 + Math.random() * 0.002,
      kissPhase: Math.random() * Math.PI * 2,
      active: true
    };
  },

  /**
   * Create heart garland decoration
   */
  createHeartGarland(canvasWidth, canvasHeight, options = {}) {
    const heartCount = 8 + Math.floor(Math.random() * 5);
    const hearts = [];

    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        offset: i / heartCount,
        size: 8 + Math.random() * 4,
        color: Math.random() < 0.5 ? '#ff1493' : '#ff69b4',
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    return {
      type: 'heart-garland',
      x: 0,
      y: options.y !== undefined ? options.y : 50 + Math.random() * 100,
      width: canvasWidth,
      hearts: hearts,
      sag: 40 + Math.random() * 30,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmplitude: 10 + Math.random() * 10,
      opacity: 0.8 + Math.random() * 0.2,
      active: true,
      static: true
    };
  },

  /**
   * Create love letter decoration
   */
  createLoveLetter(canvasWidth, canvasHeight, options = {}) {
    const fromLeft = Math.random() < 0.5;

    return {
      type: 'love-letter',
      x: fromLeft ? -50 : canvasWidth + 50,
      y: Math.random() * canvasHeight * 0.6,
      baseY: Math.random() * canvasHeight * 0.6,
      vx: fromLeft ? 1 + Math.random() * 1 : -(1 + Math.random() * 1),
      size: 12 + Math.random() * 6,
      opacity: 0.9 + Math.random() * 0.1,
      rotation: (Math.random() - 0.5) * 0.3,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      waveAmplitude: 15 + Math.random() * 15,
      waveFrequency: 0.002 + Math.random() * 0.002,
      waveOffset: Math.random() * Math.PI * 2,
      time: 0,
      active: true,
      static: false
    };
  },

  /**
   * Create falling particle (hearts, rose petals, lips)
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    // Mix of hearts (60%), rose petals (25%), and lips (15%)
    const choice = Math.random();

    if (choice < 0.6) {
      return this.createHeart(canvasWidth, canvasHeight, config);
    } else if (choice < 0.85) {
      return this.createRosePetal(canvasWidth, canvasHeight, config);
    } else {
      return this.createLips(canvasWidth, canvasHeight, config);
    }
  },

  /**
   * Create initial static decorations (heart garlands)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Create heart garlands
    const garlandCount = config.garlands || 2;
    for (let i = 0; i < garlandCount; i++) {
      decorations.push(this.createHeartGarland(canvasWidth, canvasHeight, {
        y: 50 + i * (canvasHeight / (garlandCount + 1))
      }));
    }

    // Love letters/envelopes at bottom
    const envelopeCount = 4;
    for (let i = 0; i < envelopeCount; i++) {
      decorations.push({
        type: 'envelope',
        x: (canvasWidth / (envelopeCount + 1)) * (i + 1) + (Math.random() - 0.5) * 30,
        y: canvasHeight - 25 - Math.random() * 10,
        size: 15 + Math.random() * 5,
        opacity: 0.85,
        rotation: (Math.random() - 0.5) * 0.3,
        active: true,
        static: true
      });
    }

    // Butterflies (not static - they fly around)
    const butterflyCount = config.butterflies || 3;
    for (let i = 0; i < butterflyCount; i++) {
      decorations.push({
        type: 'butterfly',
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight * 0.6 + 50,
        baseY: Math.random() * canvasHeight * 0.6 + 50,
        size: 12 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        waveOffset: Math.random() * Math.PI * 2,
        waveFrequency: 0.003 + Math.random() * 0.002,
        waveAmplitude: 20 + Math.random() * 15,
        wingPhase: Math.random() * Math.PI * 2,
        opacity: 0.9,
        color: Math.random() < 0.5 ? 'pink' : 'purple',
        active: true,
        static: false
      });
    }

    // Pink heart-shaped moon (romantic atmospheric element)
    decorations.push({
      type: 'heart-moon',
      x: canvasWidth * 0.85,
      y: canvasHeight * 0.15,
      size: 60 + Math.random() * 20,
      opacity: 0.9,
      glowPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    return decorations;
  },

  /**
   * Spawn special Valentine's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Cupid (very rare)
    if (choice < config.cupidChance) {
      if (specialParticles.some(p => p.type === 'cupid')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'cupid',
        x: fromLeft ? -100 : canvasWidth + 100,
        y: Math.random() * canvasHeight * 0.4 + 50,
        baseY: Math.random() * canvasHeight * 0.4 + 50,
        vx: fromLeft ? 2 + Math.random() * 1.5 : -(2 + Math.random() * 1.5),
        size: 15 + Math.random() * 8,
        opacity: 1,
        waveAmplitude: 20 + Math.random() * 20,
        waveFrequency: 0.002 + Math.random() * 0.002,
        waveOffset: Math.random() * Math.PI * 2,
        time: 0,
        wingPhase: Math.random() * Math.PI * 2,
        active: true,
        static: false
      };
    }

    // Love letter (rare)
    if (choice < 0.001) {
      return this.createLoveLetter(canvasWidth, canvasHeight);
    }

    // Neon sign (very rare, only if none active)
    if (choice < 0.0015) {
      if (specialParticles.some(p => p.type === 'neon-sign' && p.active)) {
        return null;
      }
      return {
        type: 'neon-sign',
        x: canvasWidth / 2,
        y: canvasHeight * 0.3,
        size: 40 + Math.random() * 20,
        opacity: 0,
        targetOpacity: 1,
        phase: 'fade-in',    // fade-in → stable → fade-out
        phaseTime: 0,
        fadeInDuration: 1500,   // 1.5 seconds to fade in with crackle
        stableDuration: 5000,   // 5 seconds stable
        fadeOutDuration: 1000,  // 1 second to fade out
        crackleIntensity: 1,    // Starts high, decreases
        flickerPhase: Math.random() * Math.PI * 2,
        glowPhase: Math.random() * Math.PI * 2,
        tubeFlickers: [],       // Individual tube flicker states
        active: true,
        static: false
      };
    }

    // Sparkles (common)
    if (choice < 0.02) {
      return this.createSparkle(canvasWidth, canvasHeight, config);
    }

    return null;
  },

  /**
   * Draw heart shape
   */
  drawHeart(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Pulsing effect
    const pulse = 1 + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.15;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);
    ctx.scale(pulse, pulse);

    // Heart shape
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 0.8;

    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);

    // Left curve
    ctx.bezierCurveTo(
      -size, -size * 0.3,
      -size * 0.6, -size,
      0, -size * 0.4
    );

    // Right curve
    ctx.bezierCurveTo(
      size * 0.6, -size,
      size, -size * 0.3,
      0, size * 0.3
    );

    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-size * 0.25, -size * 0.5, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw rose petal
   */
  drawRosePetal(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Flutter effect
    const flutter = Math.sin(time * 0.01 + particle.flutterPhase) * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation + flutter);

    // Petal shape
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)'; // Dark red vein
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 2, -size,
      size * 2, size,
      0, 0
    );
    ctx.closePath();
    ctx.fill();

    // Vein
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size, 0, size * 1.5, 0);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw sparkle
   */
  drawSparkle(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const lifeRatio = particle.life / particle.maxLife;
    const twinkle = (Math.sin(time * 0.01 + particle.twinklePhase) + 1) * 0.5;

    ctx.save();
    ctx.globalAlpha = particle.opacity * lifeRatio * twinkle;
    ctx.translate(x, y);

    // Four-pointed star
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = size * 2;

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const tipX = Math.cos(angle) * size * 3;
      const tipY = Math.sin(angle) * size * 3;
      const midAngle = angle + Math.PI / 4;
      const midX = Math.cos(midAngle) * size * 0.5;
      const midY = Math.sin(midAngle) * size * 0.5;

      if (i === 0) ctx.moveTo(tipX, tipY);
      else {
        ctx.lineTo(midX, midY);
        ctx.lineTo(tipX, tipY);
      }
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw kissy lips with puckered effect
   */
  drawLips(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Pulsing/kissing effect
    const pulse = 1 + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.1;
    const kissAnimation = Math.sin(time * 0.008 + particle.kissPhase);

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);
    ctx.scale(pulse, pulse);

    // Lip color with gradient (darker at edges)
    const lipGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
    lipGradient.addColorStop(0, particle.color);
    lipGradient.addColorStop(0.6, particle.color);
    lipGradient.addColorStop(1, '#8b0000');

    ctx.fillStyle = lipGradient;
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = size * 0.1;

    // Upper lip (two curves meeting in middle)
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    // Left side of cupid's bow
    ctx.bezierCurveTo(
      -size * 0.8, -size * 0.8,
      -size * 0.3, -size * 1.0,
      0, -size * 0.6
    );
    // Right side of cupid's bow
    ctx.bezierCurveTo(
      size * 0.3, -size * 1.0,
      size * 0.8, -size * 0.8,
      size, 0
    );
    ctx.fill();
    ctx.stroke();

    // Lower lip (fuller, puckered)
    const puckerAmount = kissAnimation * size * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.bezierCurveTo(
      -size * 0.7, size * (0.7 + puckerAmount),
      -size * 0.3, size * (1.0 + puckerAmount),
      0, size * (0.8 + puckerAmount)
    );
    ctx.bezierCurveTo(
      size * 0.3, size * (1.0 + puckerAmount),
      size * 0.7, size * (0.7 + puckerAmount),
      size, 0
    );
    ctx.fill();
    ctx.stroke();

    // Glossy highlight on upper lip
    ctx.globalAlpha = particle.opacity * 0.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-size * 0.4, -size * 0.4, size * 0.2, size * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.4, -size * 0.4, size * 0.2, size * 0.15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Glossy highlight on lower lip (center)
    ctx.beginPath();
    ctx.ellipse(0, size * 0.5, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Optional: add tiny sparkle for "mwah" kiss effect
    if (kissAnimation > 0.8) {
      const sparkleDistance = size * 1.5;
      const sparkleX = Math.sin(particle.kissPhase) * sparkleDistance;
      const sparkleY = -Math.abs(Math.cos(particle.kissPhase)) * sparkleDistance;

      ctx.globalAlpha = particle.opacity * (kissAnimation - 0.8) * 5;
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = size * 0.5;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Star sparkle
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + time * 0.01;
        const tipX = sparkleX + Math.cos(angle) * size * 0.4;
        const tipY = sparkleY + Math.sin(angle) * size * 0.4;
        ctx.beginPath();
        ctx.moveTo(sparkleX, sparkleY);
        ctx.lineTo(tipX, tipY);
        ctx.lineWidth = size * 0.05;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }
    }

    ctx.restore();
  },

  /**
   * Draw cupid (side profile)
   */
  drawCupid(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Wing flapping
    const wingAngle = Math.sin(time * 0.015 + particle.wingPhase) * (Math.PI / 6);

    // Back wing (behind body)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffb6c1';
    ctx.lineWidth = 1.5;
    ctx.save();
    ctx.translate(-size * 0.2, -size * 0.3);
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size * 1.2, -size * 0.8,
      -size * 1.5, -size * 0.3,
      -size * 1.2, size * 0.3
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

    // Body (side profile - oval)
    ctx.fillStyle = '#ffdbac'; // Peachy skin tone
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (side profile)
    ctx.beginPath();
    ctx.ellipse(size * 0.3, -size * 0.6, size * 0.35, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair (curly golden locks)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(size * 0.1, -size * 0.9, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.95, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 0.75, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Eye (single eye, profile view)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size * 0.42, -size * 0.62, size * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheek
    ctx.fillStyle = 'rgba(255, 105, 180, 0.3)';
    ctx.beginPath();
    ctx.arc(size * 0.25, -size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Legs (bent in flying position)
    ctx.strokeStyle = '#ffdbac';
    ctx.lineWidth = size * 0.15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, size * 0.4);
    ctx.lineTo(-size * 0.3, size * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size * 0.05, size * 0.4);
    ctx.lineTo(-size * 0.15, size * 0.75);
    ctx.stroke();

    // Arms holding bow
    ctx.strokeStyle = '#ffdbac';
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(size * 0.1, -size * 0.2);
    ctx.lineTo(size * 0.6, -size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.05, 0);
    ctx.lineTo(size * 0.9, -size * 0.35);
    ctx.stroke();

    // Bow (curved wooden bow)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.9, -size * 0.6);
    ctx.quadraticCurveTo(size * 1.1, -size * 0.35, size * 0.9, -size * 0.1);
    ctx.stroke();

    // Bow string (drawn back)
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.9, -size * 0.6);
    ctx.lineTo(size * 0.6, -size * 0.35);
    ctx.lineTo(size * 0.9, -size * 0.1);
    ctx.stroke();

    // Arrow (nocked and ready)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 0.35);
    ctx.lineTo(size * 1.8, -size * 0.35);
    ctx.stroke();

    // Arrowhead (heart-shaped)
    ctx.fillStyle = '#dc143c';
    ctx.beginPath();
    ctx.moveTo(size * 1.8, -size * 0.35);
    ctx.lineTo(size * 2.0, -size * 0.35);
    ctx.lineTo(size * 1.9, -size * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 1.8, -size * 0.35);
    ctx.lineTo(size * 2.0, -size * 0.35);
    ctx.lineTo(size * 1.9, -size * 0.45);
    ctx.closePath();
    ctx.fill();

    // Arrow fletching
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 0.35);
    ctx.lineTo(size * 0.5, -size * 0.25);
    ctx.lineTo(size * 0.5, -size * 0.45);
    ctx.closePath();
    ctx.fill();

    // Front wing (over body)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffb6c1';
    ctx.lineWidth = 1.5;
    ctx.save();
    ctx.translate(size * 0.1, -size * 0.3);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size * 1.0, -size * 0.6,
      -size * 1.3, -size * 0.2,
      -size * 1.0, size * 0.2
    );
    ctx.bezierCurveTo(
      -size * 0.6, size * 0.15,
      -size * 0.2, 0,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  },

  /**
   * Draw love letter
   */
  drawLoveLetter(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Envelope
    ctx.fillStyle = '#fff5e6';
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 1;
    ctx.fillRect(-size, -size * 0.7, size * 2, size * 1.4);
    ctx.strokeRect(-size, -size * 0.7, size * 2, size * 1.4);

    // Envelope flap (top triangle)
    ctx.fillStyle = '#ffe4b3';
    ctx.beginPath();
    ctx.moveTo(-size, -size * 0.7);
    ctx.lineTo(0, 0);
    ctx.lineTo(size, -size * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heart seal
    ctx.fillStyle = '#dc143c';
    ctx.shadowColor = '#dc143c';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.1);
    ctx.bezierCurveTo(-size * 0.3, -size * 0.1, -size * 0.2, -size * 0.3, 0, -size * 0.15);
    ctx.bezierCurveTo(size * 0.2, -size * 0.3, size * 0.3, -size * 0.1, 0, size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },

  /**
   * Draw heart garland
   */
  drawHeartGarland(ctx, particle, time) {
    const y = particle.y;
    const width = particle.width;
    const sag = particle.sag;
    const hearts = particle.hearts;

    ctx.save();
    ctx.globalAlpha = particle.opacity;

    // Sway effect
    const swayOffset = Math.sin(time * 0.001 + particle.swayPhase) * particle.swayAmplitude;

    // String
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(width / 2, y + sag + swayOffset, width, y);
    ctx.stroke();

    // Hearts along the string
    hearts.forEach(heart => {
      const heartX = heart.offset * width;
      const heartY = y + Math.sin(Math.PI * heart.offset) * (sag + swayOffset);

      // Pulsing
      const pulse = 1 + Math.sin(time * 0.003 + heart.pulsePhase) * 0.1;

      ctx.save();
      ctx.translate(heartX, heartY);
      ctx.scale(pulse, pulse);

      ctx.fillStyle = heart.color;
      ctx.shadowColor = heart.color;
      ctx.shadowBlur = heart.size * 0.5;

      // Heart shape
      ctx.beginPath();
      ctx.moveTo(0, heart.size * 0.3);
      ctx.bezierCurveTo(
        -heart.size, -heart.size * 0.3,
        -heart.size * 0.6, -heart.size,
        0, -heart.size * 0.4
      );
      ctx.bezierCurveTo(
        heart.size * 0.6, -heart.size,
        heart.size, -heart.size * 0.3,
        0, heart.size * 0.3
      );
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.restore();
    });

    ctx.restore();
  },

  /**
   * Draw love letter/envelope
   */
  drawEnvelope(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Envelope body
    ctx.fillStyle = '#fff5f5';
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = size * 0.05;
    ctx.fillRect(-size * 0.7, -size * 0.5, size * 1.4, size);
    ctx.strokeRect(-size * 0.7, -size * 0.5, size * 1.4, size);

    // Envelope flap (closed)
    ctx.fillStyle = '#ffe4e1';
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, -size * 0.5);
    ctx.lineTo(0, size * 0.1);
    ctx.lineTo(size * 0.7, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heart seal
    ctx.fillStyle = '#ff1493';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = size * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.25);
    ctx.bezierCurveTo(
      -size * 0.3, -size * 0.1,
      -size * 0.2, -size * 0.3,
      0, -size * 0.15
    );
    ctx.bezierCurveTo(
      size * 0.2, -size * 0.3,
      size * 0.3, -size * 0.1,
      0, size * 0.25
    );
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw butterfly
   */
  drawButterfly(ctx, particle, time) {
    const x = particle.x + Math.sin(time * particle.waveFrequency + particle.waveOffset) * particle.waveAmplitude;
    const y = particle.baseY + Math.cos(time * particle.waveFrequency * 0.7 + particle.waveOffset) * (particle.waveAmplitude * 0.6);
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Wing flap animation
    const wingAngle = Math.sin(time * 0.015 + particle.wingPhase) * (Math.PI / 6);

    // Color palette
    const colors = {
      pink: { main: '#ffb3d9', accent: '#ff69b4', outline: '#ff1493' },
      purple: { main: '#dda0dd', accent: '#ba55d3', outline: '#9932cc' }
    };
    const col = colors[particle.color];

    // Left wings (back)
    ctx.save();
    ctx.translate(-size * 0.15, 0);
    ctx.rotate(-wingAngle);

    // Upper left wing
    ctx.fillStyle = col.main;
    ctx.strokeStyle = col.outline;
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size * 0.8, -size * 0.6,
      -size * 0.5, -size * 1.2,
      0, -size * 0.5
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lower left wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size * 0.7, size * 0.4,
      -size * 0.4, size * 0.9,
      0, size * 0.4
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wing patterns (spots)
    ctx.fillStyle = col.accent;
    ctx.beginPath();
    ctx.arc(-size * 0.4, -size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.35, size * 0.35, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Right wings (front)
    ctx.save();
    ctx.translate(size * 0.15, 0);
    ctx.rotate(wingAngle);

    // Upper right wing
    ctx.fillStyle = col.main;
    ctx.strokeStyle = col.outline;
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 0.8, -size * 0.6,
      size * 0.5, -size * 1.2,
      0, -size * 0.5
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lower right wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 0.7, size * 0.4,
      size * 0.4, size * 0.9,
      0, size * 0.4
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wing patterns
    ctx.fillStyle = col.accent;
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.35, size * 0.35, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Body
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(-size * 0.05, -size * 0.5, size * 0.1, size * 0.9);

    // Head
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(0, -size * 0.55, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.6);
    ctx.quadraticCurveTo(-size * 0.15, -size * 0.8, -size * 0.2, -size * 0.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.6);
    ctx.quadraticCurveTo(size * 0.15, -size * 0.8, size * 0.2, -size * 0.75);
    ctx.stroke();

    // Antennae tips
    ctx.fillStyle = col.outline;
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.75, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.75, size * 0.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw pink heart-shaped moon (romantic atmospheric element)
   */
  drawHeartMoon(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const glowIntensity = 0.3 + Math.sin(time * 0.002 + particle.glowPhase) * 0.2;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Romantic pink glow (pulsing)
    const glowGradient = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, size * 2.5);
    glowGradient.addColorStop(0, `rgba(255, 182, 193, ${glowIntensity * 0.8})`); // Light pink
    glowGradient.addColorStop(0.4, `rgba(255, 105, 180, ${glowIntensity * 0.5})`); // Hot pink
    glowGradient.addColorStop(0.7, `rgba(255, 20, 147, ${glowIntensity * 0.3})`); // Deep pink
    glowGradient.addColorStop(1, 'rgba(255, 20, 147, 0)');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Heart-shaped moon body
    const moonGradient = ctx.createRadialGradient(-size * 0.3, -size * 0.3, 0, 0, 0, size);
    moonGradient.addColorStop(0, '#ffcce0');    // Pale pink center (highlight)
    moonGradient.addColorStop(0.5, '#ffb3d9');  // Soft pink
    moonGradient.addColorStop(1, '#ff69b4');    // Hot pink edge

    ctx.fillStyle = moonGradient;

    // Draw heart shape
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3); // Bottom point

    // Left side of heart
    ctx.bezierCurveTo(
      -size * 0.5, size * 0.5,  // Control point 1
      -size, size * 0.2,          // Control point 2
      -size, -size * 0.2          // End of left lobe top
    );
    // Left lobe curve (top left)
    ctx.bezierCurveTo(
      -size, -size * 0.6,        // Control (top of curve)
      -size * 0.5, -size * 0.7,  // Control
      0, -size * 0.3             // Center dip between lobes
    );

    // Right lobe curve (top right)
    ctx.bezierCurveTo(
      size * 0.5, -size * 0.7,   // Control
      size, -size * 0.6,          // Control (top of curve)
      size, -size * 0.2           // End of right lobe top
    );
    // Right side of heart
    ctx.bezierCurveTo(
      size, size * 0.2,           // Control point 1
      size * 0.5, size * 0.5,     // Control point 2
      0, size * 0.3               // Bottom point
    );

    ctx.closePath();
    ctx.fill();

    // Heart outline (subtle)
    ctx.strokeStyle = '#ff1493'; // Deep pink
    ctx.lineWidth = size * 0.02;
    ctx.stroke();

    // Crater details (lighter pink spots for texture)
    ctx.fillStyle = 'rgba(255, 240, 245, 0.4)';
    ctx.beginPath();
    ctx.arc(-size * 0.4, -size * 0.1, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(size * 0.3, 0, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-size * 0.2, size * 0.15, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles on the moon surface
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    const sparklePositions = [
      { x: -size * 0.3, y: -size * 0.4 },
      { x: size * 0.2, y: -size * 0.3 },
      { x: 0, y: 0 },
      { x: -size * 0.5, y: size * 0.1 },
      { x: size * 0.4, y: size * 0.15 }
    ];

    for (const pos of sparklePositions) {
      ctx.save();
      ctx.translate(pos.x, pos.y);

      // Four-pointed star sparkle
      ctx.beginPath();
      const sparkleSize = size * 0.08;
      ctx.moveTo(0, -sparkleSize);
      ctx.lineTo(sparkleSize * 0.2, -sparkleSize * 0.2);
      ctx.lineTo(sparkleSize, 0);
      ctx.lineTo(sparkleSize * 0.2, sparkleSize * 0.2);
      ctx.lineTo(0, sparkleSize);
      ctx.lineTo(-sparkleSize * 0.2, sparkleSize * 0.2);
      ctx.lineTo(-sparkleSize, 0);
      ctx.lineTo(-sparkleSize * 0.2, -sparkleSize * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  },

  /**
   * Draw "Happy Valentine's Day" neon sign (crackles in, stays 5s, fades out)
   */
  drawNeonSign(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Update phase timing
    particle.phaseTime += 16; // Assuming ~60fps

    // Phase transitions
    if (particle.phase === 'fade-in' && particle.phaseTime >= particle.fadeInDuration) {
      particle.phase = 'stable';
      particle.phaseTime = 0;
      particle.opacity = particle.targetOpacity;
      particle.crackleIntensity = 0; // Stop crackling
    } else if (particle.phase === 'stable' && particle.phaseTime >= particle.stableDuration) {
      particle.phase = 'fade-out';
      particle.phaseTime = 0;
    } else if (particle.phase === 'fade-out' && particle.phaseTime >= particle.fadeOutDuration) {
      particle.active = false;
      return;
    }

    // Calculate opacity based on phase
    if (particle.phase === 'fade-in') {
      particle.opacity = (particle.phaseTime / particle.fadeInDuration) * particle.targetOpacity;
      particle.crackleIntensity = 1 - (particle.phaseTime / particle.fadeInDuration); // Decreases over time
    } else if (particle.phase === 'fade-out') {
      particle.opacity = particle.targetOpacity * (1 - particle.phaseTime / particle.fadeOutDuration);
    }

    ctx.save();
    ctx.translate(x, y);

    // Neon colors (hot pink with slight variations)
    const neonPink = '#ff1493';
    const neonRed = '#ff0066';
    const neonWhite = '#ffffff';

    // Text to display
    const text = 'Happy Valentine\'s Day';

    // Font settings
    const fontSize = size;
    ctx.font = `bold ${fontSize}px 'Arial Black', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure text for effects
    const textWidth = ctx.measureText(text).width;

    // Crackling effect during fade-in
    let crackleOffset = 0;
    if (particle.crackleIntensity > 0) {
      // Random flicker/crackle displacement
      crackleOffset = (Math.random() - 0.5) * particle.crackleIntensity * 5;
    }

    // Individual letter flicker during crackle
    const letters = text.split('');
    let currentX = -textWidth / 2;

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const letterWidth = ctx.measureText(letter).width;

      // Random flicker for this letter during crackle
      const letterFlicker = particle.crackleIntensity > 0
        ? Math.random() < particle.crackleIntensity * 0.3
        : false;

      const letterOpacity = letterFlicker
        ? particle.opacity * (0.3 + Math.random() * 0.7)
        : particle.opacity;

      ctx.save();
      ctx.translate(currentX + letterWidth / 2, crackleOffset);
      ctx.globalAlpha = letterOpacity;

      // Neon glow effect (multiple layers)
      const glowIntensity = 0.8 + Math.sin(time * 0.002 + particle.glowPhase + i * 0.5) * 0.2;

      // Outer glow (largest)
      ctx.shadowColor = neonPink;
      ctx.shadowBlur = size * 0.8 * glowIntensity;
      ctx.fillStyle = neonPink;
      ctx.fillText(letter, 0, 0);

      // Middle glow
      ctx.shadowBlur = size * 0.5 * glowIntensity;
      ctx.fillStyle = neonRed;
      ctx.fillText(letter, 0, 0);

      // Inner glow (bright core)
      ctx.shadowBlur = size * 0.3 * glowIntensity;
      ctx.fillStyle = neonWhite;
      ctx.fillText(letter, 0, 0);

      // Core text (very bright)
      ctx.shadowBlur = 0;
      ctx.fillStyle = neonWhite;
      ctx.globalAlpha = letterOpacity * 0.9;
      ctx.fillText(letter, 0, 0);

      ctx.restore();

      currentX += letterWidth;
    }

    // Add spark/crackle particles during fade-in
    if (particle.crackleIntensity > 0.3) {
      for (let i = 0; i < 3; i++) {
        if (Math.random() < particle.crackleIntensity * 0.5) {
          const sparkX = (Math.random() - 0.5) * textWidth;
          const sparkY = (Math.random() - 0.5) * size * 0.3;
          const sparkSize = 2 + Math.random() * 3;

          ctx.save();
          ctx.globalAlpha = particle.opacity * Math.random();
          ctx.fillStyle = Math.random() < 0.5 ? neonPink : neonWhite;
          ctx.shadowColor = neonPink;
          ctx.shadowBlur = sparkSize * 4;
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Background glow plate (like neon backing)
    if (particle.phase === 'stable' || particle.phase === 'fade-out') {
      ctx.globalAlpha = particle.opacity * 0.1;
      ctx.fillStyle = '#ff1493';
      ctx.fillRect(-textWidth * 0.55, -size * 0.6, textWidth * 1.1, size * 1.2);
    }

    ctx.restore();
  }
};
