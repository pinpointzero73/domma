/**
 * Halloween Theme for Domma Celebrations
 *
 * Features:
 * - Flying bats with wing animation
 * - Floating ghosts with wavy motion
 *
 * - Pumpkins (both floating and static jack-o-lanterns)
 * - Gravestones scattered on ground
 * - Haunted castle with towers and turrets
 * - Bubbling cauldron with smoke/steam
 * - Spiders dangling from webs
 * - Dark, spooky atmosphere with orange and purple accents
 * - Wind effects for eerie atmosphere
 */

export default {
  name: 'halloween',
  displayName: 'Halloween',
  emoji: '🎃',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 30,         // Fewer bats/ghosts for subtlety
      speedRange: [0.3, 1.0],
      sizeRange: [2, 5],
      gravestones: 3,
      jackOLanterns: 2,
      spiders: 2,
      scarecrows: 1,
      twinklingStars: 8
    },
    medium: {
      count: 60,
      speedRange: [0.5, 1.5],
      sizeRange: [2, 6],
      gravestones: 5,
      jackOLanterns: 4,
      spiders: 4,
      scarecrows: 2,
      twinklingStars: 15
    },
    heavy: {
      count: 100,
      speedRange: [0.7, 2.0],
      sizeRange: [3, 8],
      gravestones: 8,
      jackOLanterns: 6,
      spiders: 6,
      scarecrows: 3,
      twinklingStars: 25
    }
  },

  particles: ['bat', 'ghost', 'pumpkin'],
  decorations: ['gravestone', 'jack-o-lantern', 'haunted-house', 'cauldron', 'spider', 'scarecrow', 'twinkling-star'],
  colors: {
    primary: '#ff6600',    // Pumpkin orange
    secondary: '#1a1a2e',  // Dark night blue
    accent: '#8b0000',     // Deep blood red
    ghost: '#f0f0f0',      // Ghostly white
    purple: '#6a0dad'      // Spooky purple
  },

  // Lightning effect properties
  lightningChance: 0.0005, // 0.05% chance per frame to strike
  lightningDuration: 200, // Lightning flash lasts 200ms
  lightningTimer: 0,
  lightningActive: false,
  lightningColor: '#fefefe', // Bright white/blue flash

  /**
   * Create bat particle
   */
  createBat(canvasWidth, canvasHeight, config) {
    const depth = Math.random();
    let size, speed, opacity;

    if (depth < 0.33) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.5;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 1.3;
      opacity = 0.9 + Math.random() * 0.1;
    } else if (depth < 0.66) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.sizeRange[0]);
      opacity = 0.6 + Math.random() * 0.2;
    } else {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.7;
      speed = config.speedRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.7;
      opacity = 0.4 + Math.random() * 0.2;
    }

    const fromLeft = Math.random() < 0.5;

    return {
      type: 'bat',
      x: fromLeft ? -20 : canvasWidth + 20,
      y: Math.random() * canvasHeight * 0.7, // Upper 70% of screen
      baseY: Math.random() * canvasHeight * 0.7,
      vx: fromLeft ? speed * 2 : -speed * 2,
      vy: 0,
      size: size,
      speed: speed,
      opacity: opacity,
      waveAmplitude: 10 + Math.random() * 20,
      waveFrequency: 0.002 + Math.random() * 0.003,
      waveOffset: Math.random() * Math.PI * 2,
      time: 0,
      rotation: 0,
      active: true,
      depth: depth
    };
  },

  /**
   * Create ghost particle
   */
  createGhost(canvasWidth, canvasHeight, config) {
    const depth = Math.random();
    let size, speed, opacity;

    if (depth < 0.33) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.8;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.sizeRange[0]) * 0.5;
      opacity = 0.7 + Math.random() * 0.2;
    } else if (depth < 0.66) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.2;
      speed = config.speedRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.5;
      opacity = 0.5 + Math.random() * 0.15;
    } else {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speed = config.speedRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.5;
      opacity = 0.3 + Math.random() * 0.15;
    }

    return {
      type: 'ghost',
      x: Math.random() * canvasWidth,
      y: -50, // Start above viewport
      size: size,
      speed: speed,
      opacity: opacity,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.01 + Math.random() * 0.02,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      time: Math.random() * 1000,
      active: true,
      depth: depth
    };
  },

  /**
   * Create floating pumpkin particle
   */
  createPumpkin(canvasWidth, canvasHeight, config) {
    return {
      type: 'pumpkin',
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      vx: (Math.random() - 0.5) * 0.2, // Gentle horizontal drift
      speed: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.sizeRange[0])) * 0.2, // Slight downward/floating speed
      opacity: 0.8 + Math.random() * 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.008 + Math.random() * 0.015, // Slower wind
      glowPhase: Math.random() * Math.PI * 2,
      floatPhase: Math.random() * Math.PI * 2, // For bobbing motion
      floatSpeed: 0.001 + Math.random() * 0.002,
      active: true
    };
  },

  /**
   * Create static gravestone decoration
   */
  createGravestone(canvasWidth, canvasHeight, options = {}) {
    const shapes = ['rounded', 'cross', 'obelisk'];
    return {
      type: 'gravestone',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 30 - Math.random() * 20,
      size: 15 + Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: (Math.random() - 0.5) * 0.1, // Slight tilt
      active: true,
      static: true
    };
  },

  /**
   * Create static jack-o-lantern
   */
  createJackOLantern(canvasWidth, canvasHeight, options = {}) {
    const faces = ['happy', 'scary', 'wicked'];
    return {
      type: 'jack-o-lantern',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 25 - Math.random() * 15,
      size: 12 + Math.random() * 8,
      opacity: 0.9 + Math.random() * 0.1,
      face: faces[Math.floor(Math.random() * faces.length)],
      glowPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create dangling spider
   */
  createSpider(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'spider',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : Math.random() * canvasHeight * 0.3, // Upper portion
      baseY: options.y !== undefined ? options.y : Math.random() * canvasHeight * 0.3,
      size: 5 + Math.random() * 5,
      opacity: 0.8 + Math.random() * 0.2,
      threadLength: 30 + Math.random() * 50,
      swingPhase: Math.random() * Math.PI * 2,
      swingAmplitude: 20 + Math.random() * 30,
      swingSpeed: 0.001 + Math.random() * 0.002,
      time: 0,
      active: true,
      static: false
    };
  },

  /**
   * Create falling particle (mix of pumpkins and spiders)
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // 70% pumpkins, 30% spiders
    if (choice < 0.7) {
      return this.createPumpkin(canvasWidth, canvasHeight, config);
    } else {
      // Create small spider particle
      return {
        type: 'spider-small',
        x: Math.random() * canvasWidth,
        y: -20,
        size: 1 + Math.random() * 2,
        speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.sizeRange[0]) * 0.5,
        opacity: 0.6 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        windOffset: Math.random() * Math.PI * 2,
        windSpeed: 0.01 + Math.random() * 0.02,
        active: true
      };
    }
  },

  /**
   * Create initial static decorations
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Haunted castle silhouette (left side)
    decorations.push({
      type: 'haunted-house',
      x: 80,
      y: canvasHeight - 120,
      size: 80,
      opacity: 0.85,
      active: true,
      static: true
    });

    // Full moon (right side)
    decorations.push({
      type: 'moon',
      x: canvasWidth - 120,
      y: 100,
      size: 60,
      opacity: 0.9,
      glowPhase: 0,
      active: true,
      static: true
      // Removed Batman properties
    });

    // Create gravestones
    const gravestoneCount = config.gravestones || 5;
    for (let i = 0; i < gravestoneCount; i++) {
      decorations.push({
        type: 'gravestone',
        x: (canvasWidth / (gravestoneCount + 1)) * (i + 1) + (Math.random() - 0.5) * 40,
        y: canvasHeight - 30 - Math.random() * 10,
        size: 12 + Math.random() * 8,
        opacity: 0.7 + Math.random() * 0.2,
        variant: Math.floor(Math.random() * 3), // Different gravestone shapes
        active: true,
        static: true
      });
    }

    // Create jack-o-lanterns
    const lanternCount = config.jackOLanterns || 4;
    for (let i = 0; i < lanternCount; i++) {
      decorations.push({
        type: 'jack-o-lantern',
        x: (canvasWidth / (lanternCount + 1)) * (i + 1) + (Math.random() - 0.5) * 30,
        y: canvasHeight - 15,
        size: 10 + Math.random() * 6,
        opacity: 0.9,
        glowPhase: Math.random() * Math.PI * 2,
        active: true,
        static: true
      });
    }

    // Create dangling spiders
    const spiderCount = config.spiders || 4;
    for (let i = 0; i < spiderCount; i++) {
      decorations.push({
        type: 'spider',
        x: (canvasWidth / (spiderCount + 1)) * (i + 1),
        y: 0,
        targetY: 50 + Math.random() * 100,
        currentY: 0,
        size: 3 + Math.random() * 3,
        opacity: 0.8,
        swingPhase: Math.random() * Math.PI * 2,
        swingAmplitude: 20 + Math.random() * 30,
        swingSpeed: 0.02 + Math.random() * 0.02,
        active: true,
        static: true
      });
    }

    // Create sinister scarecrows
    const scarecrowCount = config.scarecrows || 2;
    for (let i = 0; i < scarecrowCount; i++) {
      decorations.push({
        type: 'scarecrow',
        x: 120 + (i / (scarecrowCount - 1 || 1)) * (canvasWidth - 240),
        y: canvasHeight - 60,
        size: 30 + Math.random() * 10,
        opacity: 0.9,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.015,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.02,
        active: true,
        static: true
      });
    }

    // Create twinkling stars scattered across the night sky
    const starCount = config.twinklingStars || 15;
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
      y: Math.random() * (canvasHeight * 0.5), // Top half of screen only
      size: 1 + Math.random() * 2.5,
      opacity: 0.5 + Math.random() * 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.004 + Math.random() * 0.003,
      colorVariant: Math.floor(Math.random() * 3), // 0=pale white, 1=purple tint, 2=dim orange
      active: true,
      static: true
    };
  },

  /**
   * Draw a procedurally generated lightning bolt
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {number} segments - Number of segments for the bolt (controls detail)
   * @param {number} displacement - Max displacement for forks
   * @param {number} roughness - How jagged the line is
   * @param {number} branchChance - Probability of branching
   * @param {number} lineWidth - Base line width
   * @param {string} color - Color of the lightning
   */
  drawLightning(ctx, x1, y1, x2, y2, segments, displacement, roughness, branchChance, lineWidth, color) {
    if (segments < 1) {
      return;
    }

    const midpointX = (x1 + x2) / 2;
    const midpointY = (y1 + y2) / 2;

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpendicularAngle = angle + Math.PI / 2;

    const offset = (Math.random() - 0.5) * displacement;
    const newMidpointX = midpointX + Math.cos(perpendicularAngle) * offset;
    const newMidpointY = midpointY + Math.sin(perpendicularAngle) * offset;

    const newSegments = segments - 1;
    const newDisplacement = displacement * roughness;
    const newLineWidth = lineWidth * 0.8;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw main segment
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(newMidpointX, newMidpointY);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Recursive call for sub-segments
    if (newSegments > 0) {
      this.drawLightning(ctx, x1, y1, newMidpointX, newMidpointY, newSegments, newDisplacement, roughness, branchChance, newLineWidth, color);
      this.drawLightning(ctx, newMidpointX, newMidpointY, x2, y2, newSegments, newDisplacement, roughness, branchChance, newLineWidth, color);

      // Create a fork
      if (Math.random() < branchChance && newSegments > 1) {
        const forkLength = Math.random() * displacement * 0.5;
        const forkAngle = (Math.random() - 0.5) * Math.PI / 3; // Max 60 degree deviation
        const forkX = newMidpointX + Math.cos(angle + forkAngle) * forkLength;
        const forkY = newMidpointY + Math.sin(angle + forkAngle) * forkLength;
        this.drawLightning(ctx, newMidpointX, newMidpointY, forkX, forkY, newSegments - 1, newDisplacement * 0.5, roughness, branchChance * 0.5, newLineWidth * 0.6, color);
      }
    }
  },

  /**
   * Spawn special Halloween particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight) {
    const choice = Math.random();
    const config = this.intensityConfig.medium; // Use medium config for spawning

    // Bat (15% chance)
    if (choice < 0.15) {
      return this.createBat(canvasWidth, canvasHeight, config);
    }

    // Witch (1% chance, max 1 flying)
    if (choice < 0.16) {
      if (specialParticles.some(p => p.type === 'witch')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'witch',
        x: fromLeft ? -100 : canvasWidth + 100,
        y: Math.random() * (canvasHeight * 0.4) + 50,
        baseY: Math.random() * (canvasHeight * 0.4) + 50,
        vx: fromLeft ? 3 + Math.random() * 2 : -(3 + Math.random() * 2),
        size: 15 + Math.random() * 8,
        opacity: 0.85,
        waveAmplitude: 15 + Math.random() * 20,
        waveFrequency: 0.002 + Math.random() * 0.002,
        waveOffset: Math.random() * Math.PI * 2,
        time: 0,
        active: true,
        static: false
      };
    }

    // Floating pumpkin (2% chance)
    if (choice < 0.18) {
      return {
        type: 'floating-pumpkin',
        x: Math.random() * canvasWidth,
        y: -50,
        size: 8 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 0.5, // Initial horizontal velocity
        vy: 0.3 + Math.random() * 0.5, // Initial vertical velocity
        opacity: 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        glowPhase: Math.random() * Math.PI * 2,
        windOffset: Math.random() * Math.PI * 2,
        windSpeed: 0.015,
        active: true
      };
    }

    // Haunted castle (rare, max 1)
    if (choice < 0.2102) {
      if (specialParticles.some(p => p.type === 'haunted-house')) {
        return null;
      }
      return {
        type: 'haunted-house',
        x: Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2, // Center-ish
        y: canvasHeight - 100,
        size: 40 + Math.random() * 20,
        opacity: 0.8,
        windowFlicker: 0,
        active: true,
        static: true
      };
    }

    // Cauldron (rare, max 1)
    if (choice < 0.2105) {
      if (specialParticles.some(p => p.type === 'cauldron')) {
        return null;
      }
      return {
        type: 'cauldron',
        x: Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2,
        y: canvasHeight - 40,
        size: 25 + Math.random() * 10,
        opacity: 1,
        bubbles: [],
        smoke: [],
        time: 0,
        active: true,
        static: true
      };
    }

    return null;
  },

  /**
   * Update special Halloween particles (moon, witch, floating pumpkin)
   */
  updateSpecialParticles(specialParticles, deltaTime, canvasWidth, canvasHeight) {
    // Update lightning effect
    if (this.lightningActive) {
      this.lightningTimer += deltaTime;
      if (this.lightningTimer >= this.lightningDuration) {
        this.lightningActive = false;
        this.lightningTimer = 0;
      }
    } else {
      if (Math.random() < this.lightningChance) {
        this.lightningActive = true;
        this.lightningTimer = 0;
      }
    }

    specialParticles.forEach(particle => {
      // Increment time for animated particles (if they have a time property)
      if (particle.time !== undefined) {
        particle.time += deltaTime;
      }

      switch (particle.type) {
        case 'moon':
          // Batman logo logic removed
          break;

        case 'witch':
          // Witch flies across the screen then deactivates
          if ((particle.vx > 0 && particle.x > canvasWidth + 100) || (particle.vx < 0 && particle.x < -100)) {
            particle.active = false;
          }
          break;

        case 'floating-pumpkin':
          // Floating pumpkins also eventually go off-screen
          if (particle.y > canvasHeight + 50) {
            particle.active = false;
          }
          break;

        case 'cauldron':
          // Manage bubbles
          if (particle.time % 100 < 20) { // Spawn new bubbles periodically
            particle.bubbles.push({
              x: (Math.random() - 0.5) * particle.size * 0.5,
              y: particle.size * 0.3 + Math.random() * particle.size * 0.2, // From potion surface
              size: particle.size * (0.05 + Math.random() * 0.1),
              vy: -0.5 - Math.random() * 0.5,
              opacity: 1,
              life: 1.0,
              fadeRate: 0.01 + Math.random() * 0.005
            });
          }
          particle.bubbles = particle.bubbles.filter(bubble => {
            bubble.y += bubble.vy;
            bubble.vy *= 0.98; // Slow down ascent
            bubble.opacity -= bubble.fadeRate;
            return bubble.opacity > 0 && bubble.y > -particle.size; // Remove if too high or faded
          });

          // Manage smoke/steam
          if (particle.time % 200 < 30) { // Emit smoke periodically
            particle.smoke.push({
              x: (Math.random() - 0.5) * particle.size * 0.3,
              y: -particle.size * 0.5 + Math.random() * particle.size * 0.1,
              size: particle.size * (0.2 + Math.random() * 0.3),
              vx: (Math.random() - 0.5) * 0.1,
              vy: -0.2 - Math.random() * 0.2,
              opacity: 0.5,
              life: 1.0,
              fadeRate: 0.005 + Math.random() * 0.003
            });
          }
          particle.smoke = particle.smoke.filter(smoke => {
            smoke.x += smoke.vx;
            smoke.y += smoke.vy;
            smoke.size *= 1.02; // Expand
            smoke.opacity -= smoke.fadeRate;
            return smoke.opacity > 0;
          });
          break;

        // Add other special particle update logic here if needed
      }
    });
  },

  /**
   * Draw bat with wing animation
   */
  drawBat(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;
    const time = particle.time;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Wing flap animation
    const flapCycle = time * 0.01;
    const wingAngle = Math.sin(flapCycle) * (Math.PI / 4);

    // Body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.4, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(size * 0.1, -size * 0.7);
    ctx.lineTo(size * 0.25, -size * 1.1);
    ctx.lineTo(size * 0.4, -size * 0.7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 0.7);
    ctx.lineTo(size * 0.35, -size * 1.0);
    ctx.lineTo(size * 0.5, -size * 0.7);
    ctx.fill();

    // Eyes (red glow)
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.45, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.45, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Eye glow
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.45, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.45, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#2a2a2a';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;

    // Left wing
    ctx.save();
    ctx.translate(-size * 0.3, 0);
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.8, -size * 0.5, -size * 1.2, 0);
    ctx.quadraticCurveTo(-size * 0.9, size * 0.3, -size * 0.6, size * 0.4);
    ctx.quadraticCurveTo(-size * 0.3, size * 0.2, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.translate(size * 0.3, 0);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.8, -size * 0.5, size * 1.2, 0);
    ctx.quadraticCurveTo(size * 0.9, size * 0.3, size * 0.6, size * 0.4);
    ctx.quadraticCurveTo(size * 0.3, size * 0.2, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  },

  /**
   * Draw floating ghost with wavy motion
   */
  drawGhost(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const time = particle.time;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Ghost body (wavy bottom)
    ctx.fillStyle = '#f0f0f0';
    ctx.shadowColor = 'rgba(240, 240, 240, 0.5)';
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.6, Math.PI, 0);

    // Wavy bottom edge
    const waveCount = 5;
    for (let i = 0; i <= waveCount; i++) {
      const waveX = -size * 0.6 + (i / waveCount) * size * 1.2;
      const waveY = Math.sin(time * 0.005 + i) * size * 0.15;
      if (i === 0) {
        ctx.lineTo(waveX, waveY);
      } else {
        ctx.quadraticCurveTo(
          waveX - size * 0.12,
          waveY - size * 0.1,
          waveX,
          waveY
        );
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(-size * 0.2, -size * 0.6, size * 0.12, size * 0.18, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.2, -size * 0.6, size * 0.12, size * 0.18, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (spooky O shape)
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.3, size * 0.15, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw floating pumpkin
   */
  drawPumpkin(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Pumpkin body
    ctx.fillStyle = '#ff6600';
    ctx.strokeStyle = '#cc5200';
    ctx.lineWidth = size * 0.08;

    // Draw pumpkin segments
    const segments = 5;
    ctx.beginPath();
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
      const nextAngle = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;
      const radiusX = size * 0.9;
      const radiusY = size;

      if (i === 0) {
        ctx.moveTo(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY);
      }
      ctx.quadraticCurveTo(
        Math.cos((angle + nextAngle) / 2) * radiusX * 0.8,
        Math.sin((angle + nextAngle) / 2) * radiusY * 0.8,
        Math.cos(nextAngle) * radiusX,
        Math.sin(nextAngle) * radiusY
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-size * 0.2, -size * 1.1, size * 0.4, size * 0.2);

    // Inner glow (pulsing)
    const glowIntensity = (Math.sin(time * 0.002 + particle.glowPhase) + 1) * 0.5;
    ctx.globalAlpha = particle.opacity * glowIntensity * 0.7;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#ffaa00');
    gradient.addColorStop(1, 'rgba(255, 170, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-size, -size, size * 2, size * 2);

    ctx.restore();
  },

  /**
   * Draw gravestone
   */
  drawGravestone(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = '#555555';
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;

    if (particle.shape === 'rounded') {
      // Rounded top gravestone
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, size * 0.8);
      ctx.lineTo(-size * 0.5, -size * 0.3);
      ctx.arc(0, -size * 0.3, size * 0.5, Math.PI, 0);
      ctx.lineTo(size * 0.5, size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (particle.shape === 'cross') {
      // Cross-shaped gravestone
      ctx.fillRect(-size * 0.15, -size, size * 0.3, size * 1.8);
      ctx.fillRect(-size * 0.5, -size * 0.3, size, size * 0.3);
    } else {
      // Obelisk
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, size * 0.8);
      ctx.lineTo(-size * 0.5, -size * 0.5);
      ctx.lineTo(0, -size);
      ctx.lineTo(size * 0.5, -size * 0.5);
      ctx.lineTo(size * 0.4, size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Moss/aging texture
    ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
    ctx.fillRect(-size * 0.4, size * 0.5, size * 0.8, size * 0.3);

    // RIP text
    ctx.fillStyle = '#222222';
    ctx.font = `${size * 0.4}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RIP', 0, 0);

    ctx.restore();
  },

  /**
   * Draw sinister jack-o-lantern with spikey mouth and yellow glow
   */
  drawJackOLantern(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Pumpkin body
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.2, size, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vertical ridges
    ctx.strokeStyle = '#cc6600';
    ctx.lineWidth = size * 0.08;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size * 0.35, -size * 0.8);
      ctx.quadraticCurveTo(i * size * 0.3, 0, i * size * 0.35, size * 0.8);
      ctx.stroke();
    }

    // Stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-size * 0.2, -size * 1.1, size * 0.4, size * 0.2);

    // Inner glow (pulsing) - now just an internal light source
    const flicker = 0.8 + Math.sin(time * 0.02 + particle.glowPhase) * 0.2; // Flicker effect
    const glowIntensity = 0.5 + flicker * 0.5;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    glowGradient.addColorStop(0, `rgba(255, 255, 100, ${glowIntensity})`); // Bright yellow center
    glowGradient.addColorStop(0.5, `rgba(255, 200, 0, ${glowIntensity * 0.7})`); // Orange-yellow transition
    glowGradient.addColorStop(1, 'rgba(255, 150, 0, 0)'); // Fades to transparent orange
    ctx.fillStyle = glowGradient;
    ctx.fillRect(-size * 1.5, -size * 1.5, size * 3, size * 3);

    // Face (carved out - black with enhanced glow)
    ctx.fillStyle = '#000000';
    ctx.shadowColor = `rgba(255, 180, 0, ${flicker})`; // Shadow color matches glow
    ctx.shadowBlur = size * 0.5; // Increased blur for more glow

    // Sinister Triangular Eyes
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, -size * 0.4);
    ctx.lineTo(-size * 0.2, -size * 0.3);
    ctx.lineTo(-size * 0.5, -size * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 0.4);
    ctx.lineTo(size * 0.2, -size * 0.3);
    ctx.lineTo(size * 0.5, -size * 0.1);
    ctx.closePath();
    ctx.fill();

    // Spikey Mouth
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, size * 0.2);
    ctx.lineTo(-size * 0.5, size * 0.4);
    ctx.lineTo(-size * 0.3, size * 0.25);
    ctx.lineTo(0, size * 0.45);
    ctx.lineTo(size * 0.3, size * 0.25);
    ctx.lineTo(size * 0.5, size * 0.4);
    ctx.lineTo(size * 0.7, size * 0.2);
    ctx.lineTo(size * 0.5, size * 0.1);
    ctx.lineTo(0, size * 0.25);
    ctx.lineTo(-size * 0.5, size * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw haunted castle with towers, turrets, and battlements
   */
  drawHauntedHouse(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    const castleColor = '#1a1a2e';
    const darkOutline = '#0a0a0a';
    const flickerIntensity = 0.5 + Math.random() * 0.5;

    ctx.fillStyle = castleColor;
    ctx.strokeStyle = darkOutline;
    ctx.lineWidth = 2;

    // Left tower (tall, circular with conical roof)
    ctx.fillRect(-size * 1.2, -size * 1.4, size * 0.5, size * 2.0);
    // Battlements on left tower
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(-size * 1.2 + i * size * 0.2, -size * 1.5, size * 0.12, size * 0.1);
    }
    // Conical roof
    ctx.beginPath();
    ctx.moveTo(-size * 1.3, -size * 1.5);
    ctx.lineTo(-size * 0.95, -size * 2.0);
    ctx.lineTo(-size * 0.6, -size * 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right tower (tall, circular with conical roof)
    ctx.fillRect(size * 0.7, -size * 1.3, size * 0.5, size * 1.9);
    // Battlements on right tower
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(size * 0.7 + i * size * 0.2, -size * 1.4, size * 0.12, size * 0.1);
    }
    // Conical roof
    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 1.4);
    ctx.lineTo(size * 0.95, -size * 1.9);
    ctx.lineTo(size * 1.3, -size * 1.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central keep (main castle body)
    ctx.fillRect(-size * 0.7, -size * 0.9, size * 1.4, size * 1.5);
    ctx.strokeRect(-size * 0.7, -size * 0.9, size * 1.4, size * 1.5);

    // Central keep battlements (crenellations)
    for (let i = 0; i < 7; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(-size * 0.7 + i * size * 0.2, -size * 1.0, size * 0.2, size * 0.1);
      }
    }

    // Small turrets on central keep corners
    // Left turret
    ctx.fillRect(-size * 0.8, -size * 1.1, size * 0.3, size * 0.5);
    ctx.beginPath();
    ctx.moveTo(-size * 0.85, -size * 1.1);
    ctx.lineTo(-size * 0.65, -size * 1.35);
    ctx.lineTo(-size * 0.45, -size * 1.1);
    ctx.closePath();
    ctx.fill();

    // Right turret
    ctx.fillRect(size * 0.5, -size * 1.1, size * 0.3, size * 0.5);
    ctx.beginPath();
    ctx.moveTo(size * 0.45, -size * 1.1);
    ctx.lineTo(size * 0.65, -size * 1.35);
    ctx.lineTo(size * 0.85, -size * 1.1);
    ctx.closePath();
    ctx.fill();

    // Windows with flickering light
    ctx.fillStyle = `rgba(255, 200, 100, ${flickerIntensity})`;
    ctx.shadowColor = '#ffcc66';
    ctx.shadowBlur = 10;

    // Left tower windows (3 vertically)
    ctx.fillRect(-size * 1.05, -size * 1.2, size * 0.2, size * 0.25);
    ctx.fillRect(-size * 1.05, -size * 0.8, size * 0.2, size * 0.25);
    ctx.fillRect(-size * 1.05, -size * 0.4, size * 0.2, size * 0.25);

    // Right tower windows (3 vertically)
    ctx.fillRect(size * 0.85, -size * 1.1, size * 0.2, size * 0.25);
    ctx.fillRect(size * 0.85, -size * 0.7, size * 0.2, size * 0.25);
    ctx.fillRect(size * 0.85, -size * 0.3, size * 0.2, size * 0.25);

    // Central keep windows (2 rows)
    ctx.fillRect(-size * 0.5, -size * 0.6, size * 0.25, size * 0.3);
    ctx.fillRect(-size * 0.1, -size * 0.6, size * 0.25, size * 0.3);
    ctx.fillRect(size * 0.3, -size * 0.6, size * 0.25, size * 0.3);
    ctx.fillRect(-size * 0.3, -size * 0.15, size * 0.25, size * 0.3);
    ctx.fillRect(size * 0.1, -size * 0.15, size * 0.25, size * 0.3);

    ctx.shadowBlur = 0;

    // Grand entrance archway
    ctx.fillStyle = darkOutline;
    ctx.beginPath();
    ctx.arc(0, size * 0.3, size * 0.25, Math.PI, 0, true);
    ctx.lineTo(size * 0.25, size * 0.6);
    ctx.lineTo(-size * 0.25, size * 0.6);
    ctx.closePath();
    ctx.fill();

    // Portcullis gate (vertical bars)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size * 0.1, size * 0.3);
      ctx.lineTo(i * size * 0.1, size * 0.6);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw bubbling cauldron
   */
  drawCauldron(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.translate(x, y);

    // Cauldron body
    ctx.fillStyle = '#222222';
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI);
    ctx.lineTo(-size * 0.8, size * 0.5);
    ctx.quadraticCurveTo(0, size * 0.8, size * 0.8, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Legs
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    [-size * 0.5, 0, size * 0.5].forEach(legX => {
      ctx.beginPath();
      ctx.moveTo(legX, size * 0.5);
      ctx.lineTo(legX, size * 0.9);
      ctx.stroke();
    });

    // Bubbling potion (green)
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.7, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bubbles
    particle.bubbles.forEach(bubble => {
      ctx.globalAlpha = bubble.opacity;
      ctx.fillStyle = '#88ff88';
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Smoke/steam
    particle.smoke.forEach(smoke => {
      ctx.globalAlpha = smoke.opacity;
      ctx.fillStyle = '#aaaaaa';
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  },

  /**
   * Draw spider dangling from web
   */
  drawSpider(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Calculate swing position
    const swingOffset = Math.sin(time * particle.swingSpeed + particle.swingPhase) * particle.swingAmplitude;

    ctx.save();
    ctx.globalAlpha = particle.opacity;

    // Thread
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + swingOffset, y + particle.threadLength);
    ctx.stroke();
    ctx.setLineDash([]);

    // Spider body
    ctx.translate(x + swingOffset, y + particle.threadLength);
    ctx.fillStyle = '#000000';

    // Abdomen
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Legs (8 legs)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = size * 0.1;
    const legAngle = Math.sin(time * 0.005) * 0.2;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI - Math.PI / 2;
      const legLength = size * 1.5;

      // Left legs
      ctx.beginPath();
      ctx.moveTo(-size * 0.3, -size * 0.2 + i * size * 0.2);
      ctx.quadraticCurveTo(
        -size - Math.sin(angle + legAngle) * size * 0.3,
        -size * 0.2 + i * size * 0.2 - size * 0.5,
        -size * 1.2,
        -size * 0.2 + i * size * 0.2
      );
      ctx.stroke();

      // Right legs
      ctx.beginPath();
      ctx.moveTo(size * 0.3, -size * 0.2 + i * size * 0.2);
      ctx.quadraticCurveTo(
        size + Math.sin(angle + legAngle) * size * 0.3,
        -size * 0.2 + i * size * 0.2 - size * 0.5,
        size * 1.2,
        -size * 0.2 + i * size * 0.2
      );
      ctx.stroke();
    }

    // Eyes (8 eyes)
    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-size * 0.15 + (i % 2) * size * 0.3, -size * 0.55 + Math.floor(i / 2) * size * 0.1, size * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw small spider particle (falling)
   */
  drawSpiderSmall(ctx, particle) {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    // Tiny spider body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    ctx.fill();

    // Tiny legs
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = particle.size * 0.3;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI - Math.PI / 2;
      // Left leg
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * particle.size * 2, Math.sin(angle) * particle.size * 2);
      ctx.stroke();
      // Right leg
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-Math.cos(angle) * particle.size * 2, Math.sin(angle) * particle.size * 2);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw flying witch
   */
  drawWitch(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y + Math.sin(time * particle.waveFrequency + particle.waveOffset) * particle.waveAmplitude;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Broomstick (horizontal, pointing backward relative to direction of travel)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = size * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.6);  // Start point near witch's body
    ctx.lineTo(-size * 1.5, size * 0.6); // End point extending backward
    ctx.stroke();

    // Bristles (at back of broom)
    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = size * 0.06;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 3) * ((i / 7) - 0.5);
      ctx.beginPath();
      ctx.moveTo(-size * 1.5, size * 0.6); // Bristles start at the back of the broom
      ctx.lineTo(
        -size * 1.5 + Math.cos(angle) * size * 0.4,
        size * 0.6 + Math.sin(angle) * size * 0.4
      );
      ctx.stroke();
    }

    // Flowing black cloak (side profile)
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.6); // Bottom of cloak on broom
    ctx.quadraticCurveTo(-size * 0.5, size * 0.4, -size * 0.8, size * 0.1);
    ctx.lineTo(-size * 0.7, -size * 0.3);
    ctx.quadraticCurveTo(-size * 0.3, -size * 0.5, 0, -size * 0.6);
    ctx.lineTo(size * 0.3, -size * 0.4);
    ctx.lineTo(size * 0.3, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head (side profile, greenish skin)
    ctx.fillStyle = '#8B9355';
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.6, size * 0.3, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crooked nose (prominent hooked nose)
    ctx.fillStyle = '#7a8245';
    ctx.beginPath();
    ctx.moveTo(size * 0.45, -size * 0.6);
    ctx.quadraticCurveTo(size * 0.7, -size * 0.65, size * 0.72, -size * 0.5);
    ctx.lineTo(size * 0.6, -size * 0.52);
    ctx.quadraticCurveTo(size * 0.58, -size * 0.58, size * 0.4, -size * 0.55);
    ctx.closePath();
    ctx.fill();

    // Pointed witch hat (side profile)
    ctx.fillStyle = '#2C1810';
    // Hat cone (tilted forward)
    ctx.beginPath();
    ctx.moveTo(size * 0.05, -size * 0.85);
    ctx.lineTo(size * 0.4, -size * 1.6);
    ctx.lineTo(size * 0.5, -size * 0.8);
    ctx.closePath();
    ctx.fill();
    // Hat brim
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.85, size * 0.5, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye (single glowing eye, profile view)
    ctx.fillStyle = '#ff6600';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = size * 0.3;
    ctx.beginPath();
    ctx.arc(size * 0.35, -size * 0.65, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Hands gripping broom
    ctx.fillStyle = '#8B9355';
    ctx.beginPath();
    ctx.arc(size * 0.1, size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.3, size * 0.55, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Legs dangling
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(size * 0.15, size * 0.6);
    ctx.lineTo(size * 0.1, size * 1.0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.05, size * 0.6);
    ctx.lineTo(size * 0.2, size * 0.95);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw floating pumpkin
   */
  drawFloatingPumpkin(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Pumpkin body
    ctx.fillStyle = '#ff6600';
    ctx.strokeStyle = '#cc5200';
    ctx.lineWidth = size * 0.1;

    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Vertical lines
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size * 0.25, -size * 0.8);
      ctx.quadraticCurveTo(i * size * 0.3, 0, i * size * 0.25, size * 0.8);
      ctx.stroke();
    }

    // Stem
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, -size * 0.8);
    ctx.lineTo(-size * 0.1, -size * 1.1);
    ctx.lineTo(size * 0.1, -size * 1.1);
    ctx.lineTo(size * 0.15, -size * 0.8);
    ctx.closePath();
    ctx.fill();

    // Jack-o-lantern face (glowing)
    const glow = 0.5 + Math.sin(particle.glowPhase + Date.now() * 0.005) * 0.5;
    ctx.fillStyle = `rgba(255, 200, 0, ${glow})`;

    // Eyes (triangles)
    ctx.beginPath();
      ctx.moveTo(-size * 0.4, -size * 0.3);
      ctx.lineTo(-size * 0.2, -size * 0.1);
      ctx.lineTo(-size * 0.6, -size * 0.1);
      ctx.closePath();
      ctx.fill();

    ctx.beginPath();
      ctx.moveTo(size * 0.4, -size * 0.3);
      ctx.lineTo(size * 0.6, -size * 0.1);
      ctx.lineTo(size * 0.2, -size * 0.1);
      ctx.closePath();
      ctx.fill();

    // Mouth (zigzag)
    ctx.beginPath();
      ctx.moveTo(-size * 0.5, size * 0.2);
      for (let i = -4; i <= 4; i++) {
        ctx.lineTo(i * size * 0.12, size * 0.2 + (i % 2 === 0 ? size * 0.15 : 0));
      }
      ctx.lineTo(size * 0.5, size * 0.2);
      ctx.closePath();
      ctx.fill();

    ctx.restore();
  },

  /**
   * Draw full moon with eerie glow
   */
  drawMoon(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Glow effect
    const glow = 0.8 + Math.sin(time * 0.001 + particle.glowPhase) * 0.2;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    gradient.addColorStop(0, `rgba(255, 255, 220, ${glow})`);
    gradient.addColorStop(0.4, `rgba(255, 255, 200, ${glow * 0.5})`);
    gradient.addColorStop(0.7, `rgba(255, 220, 150, ${glow * 0.2})`);
    gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-size * 1.5, -size * 1.5, size * 3, size * 3);

    // Moon body
    ctx.fillStyle = '#ffffdc';
    ctx.shadowColor = '#ffffaa';
    ctx.shadowBlur = size * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Moon craters (darker spots)
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(200, 200, 170, 0.4)';
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.2, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.4, size * 0.1, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.1, size * 0.4, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.2, size * 0.5, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // No Batman logo drawing
    ctx.restore();
  },

  /**
   * Draw sinister scarecrow (creepy field guardian)
   */
  drawScarecrow(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const sway = Math.sin(time * particle.swaySpeed + particle.swayPhase) * size * 0.12; // Increased amplitude
    const bounce = Math.abs(Math.sin(time * particle.swaySpeed * 2 + particle.swayPhase)) * size * 0.03; // Subtle vertical bounce

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x + sway, y - bounce);

    // Wooden pole/stake (weathered wood)
    const poleGradient = ctx.createLinearGradient(-size * 0.05, 0, size * 0.05, 0);
    poleGradient.addColorStop(0, '#5a4632');
    poleGradient.addColorStop(0.5, '#6b5644');
    poleGradient.addColorStop(1, '#4a3622');
    ctx.fillStyle = poleGradient;
    ctx.fillRect(-size * 0.05, 0, size * 0.1, size * 1.8);
    ctx.strokeStyle = '#3a2612';
    ctx.lineWidth = 1;
    ctx.strokeRect(-size * 0.05, 0, size * 0.1, size * 1.8);

    // Cross beam (arms)
    ctx.fillRect(-size * 0.8, size * 0.5, size * 1.6, size * 0.08);
    ctx.strokeRect(-size * 0.8, size * 0.5, size * 1.6, size * 0.08);

    // Ragged burlap body (tattered shirt)
    ctx.fillStyle = '#8B7355';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, size * 0.5);
    ctx.lineTo(-size * 0.45, size * 1.2);
    ctx.lineTo(-size * 0.25, size * 1.4);
    ctx.lineTo(size * 0.25, size * 1.4);
    ctx.lineTo(size * 0.45, size * 1.2);
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tattered patches (darker)
    ctx.fillStyle = '#6b5c4d';
    ctx.fillRect(-size * 0.3, size * 0.7, size * 0.2, size * 0.15);
    ctx.fillRect(size * 0.1, size * 1.0, size * 0.18, size * 0.2);

    // Ragged sleeves on cross beam
    ctx.fillStyle = '#8B7355';
    ctx.strokeStyle = '#654321';
    // Left sleeve
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, size * 0.5);
    ctx.lineTo(-size * 0.75, size * 0.7);
    ctx.lineTo(-size * 0.85, size * 0.75);
    ctx.lineTo(-size * 0.9, size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Right sleeve
    ctx.beginPath();
    ctx.moveTo(size * 0.8, size * 0.5);
    ctx.lineTo(size * 0.75, size * 0.7);
    ctx.lineTo(size * 0.85, size * 0.75);
    ctx.lineTo(size * 0.9, size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Creepy pumpkin head (or burlap sack head)
    const usesPumpkin = Math.random() < 0.6; // 60% pumpkin, 40% burlap
    if (usesPumpkin) {
      // Pumpkin head (orange with carved face)
      const headGradient = ctx.createRadialGradient(-size * 0.1, -size * 0.05, 0, 0, 0, size * 0.35);
      headGradient.addColorStop(0, '#ff8c00');
      headGradient.addColorStop(0.7, '#ff6600');
      headGradient.addColorStop(1, '#cc5500');
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.ellipse(0, size * 0.2, size * 0.35, size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pumpkin ridges (vertical lines)
      ctx.strokeStyle = '#cc5500';
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size * 0.12, size * 0.05);
        ctx.quadraticCurveTo(i * size * 0.1, size * 0.2, i * size * 0.12, size * 0.45);
        ctx.stroke();
      }

      // Stem
      ctx.fillStyle = '#228B22';
      ctx.strokeStyle = '#1a6b1a';
      ctx.fillRect(-size * 0.04, size * 0.02, size * 0.08, size * 0.1);
      ctx.strokeRect(-size * 0.04, size * 0.02, size * 0.08, size * 0.1);
    } else {
      // Burlap sack head
      ctx.fillStyle = '#d2b48c';
      ctx.strokeStyle = '#8b7355';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, size * 0.2, size * 0.32, size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Burlap texture (crosshatch)
      ctx.strokeStyle = '#a0826d';
      ctx.lineWidth = 0.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size * 0.1, size * 0.05);
        ctx.lineTo(i * size * 0.1, size * 0.42);
        ctx.stroke();
      }
    }

    // Evil glowing eyes
    const glowIntensity = 0.6 + Math.sin(time * particle.glowSpeed + particle.glowPhase) * 0.4;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = size * 0.2;
    ctx.fillStyle = `rgba(255, 0, 0, ${glowIntensity})`;
    // Left eye
    ctx.beginPath();
    ctx.moveTo(-size * 0.18, size * 0.15);
    ctx.lineTo(-size * 0.12, size * 0.2);
    ctx.lineTo(-size * 0.18, size * 0.25);
    ctx.closePath();
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.moveTo(size * 0.18, size * 0.15);
    ctx.lineTo(size * 0.12, size * 0.2);
    ctx.lineTo(size * 0.18, size * 0.25);
    ctx.closePath();
    ctx.fill();

    // Jagged mouth (sinister grin)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, size * 0.35);
    for (let i = -3; i <= 3; i++) {
      const yOff = i % 2 === 0 ? 0 : size * 0.04;
      ctx.lineTo(i * size * 0.07, size * 0.35 + yOff);
    }
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Tattered wide-brim hat
    ctx.fillStyle = '#2a2a2a';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    // Brim
    ctx.beginPath();
    ctx.ellipse(0, size * 0.05, size * 0.45, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Crown (cone shape)
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, size * 0.05);
    ctx.lineTo(-size * 0.15, -size * 0.2);
    ctx.lineTo(size * 0.15, -size * 0.2);
    ctx.lineTo(size * 0.2, size * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hat band
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-size * 0.2, size * 0.03, size * 0.4, size * 0.05);

    // Tattered hat edges (tears/rips)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const brimX = Math.cos(angle) * size * 0.45;
      const brimY = size * 0.05 + Math.sin(angle) * size * 0.08;
      ctx.beginPath();
      ctx.moveTo(brimX, brimY);
      ctx.lineTo(brimX + Math.cos(angle) * size * 0.08, brimY + Math.sin(angle) * size * 0.08);
      ctx.stroke();
    }

    // Crows perched on shoulders (rare, ominous)
    if (Math.random() < 0.3) {
      const crowX = Math.random() < 0.5 ? -size * 0.6 : size * 0.6;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      // Simple crow silhouette
      ctx.arc(crowX, size * 0.5, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#ffa500';
      ctx.beginPath();
      ctx.moveTo(crowX + size * 0.08, size * 0.5);
      ctx.lineTo(crowX + size * 0.15, size * 0.5);
      ctx.lineTo(crowX + size * 0.1, size * 0.52);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw twinkling star
   */
  drawTwinklingStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Calculate twinkle intensity
    const twinkleIntensity = 0.4 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.6;

    // Select color based on variant (Halloween themed)
    let starColor, glowColor;
    switch (particle.colorVariant) {
      case 0: // Pale white (most common)
        starColor = `rgba(255, 255, 255, ${twinkleIntensity})`;
        glowColor = `rgba(255, 255, 255, ${twinkleIntensity * 0.3})`;
        break;
      case 1: // Purple tint (eerie)
        starColor = `rgba(200, 150, 255, ${twinkleIntensity})`;
        glowColor = `rgba(150, 100, 255, ${twinkleIntensity * 0.3})`;
        break;
      case 2: // Dim orange (haunting)
        starColor = `rgba(255, 180, 100, ${twinkleIntensity})`;
        glowColor = `rgba(255, 150, 50, ${twinkleIntensity * 0.3})`;
        break;
    }

    ctx.save();
    ctx.translate(x, y);

    // Outer glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = size * 4 * twinkleIntensity;
    ctx.fillStyle = starColor;

    // Draw 4-pointed star
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI - Math.PI / 2;
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

    // Bright center
    ctx.shadowBlur = size * 2 * twinkleIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw global theme effects (e.g., lightning)
   */
  drawGlobalEffects(ctx, currentTime, canvasWidth, canvasHeight) {
    if (this.lightningActive) {
      ctx.save();
      ctx.globalAlpha = 0.8 + Math.sin(this.lightningTimer * 0.01) * 0.2; // Pulsing effect during flash
      ctx.shadowColor = this.lightningColor;
      ctx.shadowBlur = 20;

      // Draw main lightning bolt from top-center to random bottom position
      const startX = canvasWidth * (0.4 + Math.random() * 0.2); // Top middle
      const startY = 0;
      const endX = canvasWidth * Math.random();
      const endY = canvasHeight;

      this.drawLightning(
        ctx,
        startX,
        startY,
        endX,
        endY,
        5 + Math.floor(Math.random() * 3), // 5-7 segments
        50 + Math.random() * 50, // 50-100 displacement
        0.7, // Roughness
        0.3, // Branch chance
        3 + Math.random() * 2, // Line width
        this.lightningColor
      );

      ctx.restore();
    }
  }
};