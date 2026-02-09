/**
 * Christmas Theme for Domma Celebrations
 *
 * Features:
 * - 6-pointed crystalline snowflakes with rotation and depth layers
 * - Decorated Christmas trees with twinkling lights, baubles, tinsel, and gold star
 * - Christmas wreaths with bows and ornaments
 * - Santa's sleigh with 5 reindeer (including Rudolph with glowing red nose)
 * - Smooth sine wave flight motion for sleigh
 * - Christmas Steam Train with animated smoke, carriages, decorations
 * - Walking elves in green costumes
 * - Robins with Santa hats doing swoop flights
 * - Festive fireworks
 * - Wind gusts and realistic physics simulation
 * - Mobile-responsive particle reduction
 */

import { createParticle } from './../core/particles.js';

export default {
  name: 'christmas',
  displayName: 'Christmas',
  emoji: '🎄',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 50,
      speedRange: [0.5, 1.5],
      sizeRange: [1, 3],
      trees: 3,
      wreaths: 2,
      northStars: 1,
      snowmen: 2
    },
    medium: {
      count: 150,
      speedRange: [0.8, 2.5],
      sizeRange: [1, 4],
      trees: 6,
      wreaths: 3,
      northStars: 1,
      snowmen: 3
    },
    heavy: {
      count: 300,
      speedRange: [1.0, 3.5],
      sizeRange: [1, 5],
      trees: 10,
      wreaths: 4,
      northStars: 1,
      snowmen: 4
    }
  },

  particles: ['snowflake'],
  decorations: ['tree', 'wreath', 'sleigh', 'robin', 'train', 'elf', 'firework', 'north-star', 'snowman'],
  colors: {
    primary: '#ffffff',    // Snow white
    secondary: '#228B22',  // Forest green
    accent: '#c00',        // Christmas red
    gold: '#FFD700'        // Gold star/trim
  },

  /**
   * Create a snowflake particle
   */
  createSnowflakeParticle(canvasWidth, canvasHeight, config) {
    const particle = createParticle(config, canvasWidth, canvasHeight);
    particle.type = 'snowflake';
    return particle;
  },

  /**
   * Create falling particle (snowflakes)
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    return this.createSnowflakeParticle(canvasWidth, canvasHeight, config);
  },

  /**
   * Create Christmas tree decoration
   */
  createTree(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'tree',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : Math.random() * canvasHeight,
      vx: 0,
      vy: 0,
      size: 20 + Math.random() * 15,
      opacity: 0.6 + Math.random() * 0.3,
      rotation: 0,
      rotationSpeed: 0,
      active: true,
      static: true
    };
  },

  /**
   * Create Christmas wreath decoration
   */
  createWreath(canvasWidth, canvasHeight, options = {}) {
    // Generate the wreath's shape data once
    const wreathShape = [];
    const segments = 20;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      wreathShape.push({
        angle: angle,
        radius: 0.9 + Math.random() * 0.2,
        thickness: 0.2 + Math.random() * 0.15,
        color: i % 2 === 0 ? '#1a6b1a' : '#228B22'
      });
    }

    return {
      type: 'wreath',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : Math.random() * canvasHeight,
      vx: 0,
      vy: 0,
      size: 15 + Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.2,
      rotation: 0,
      rotationSpeed: 0,
      active: true,
      static: true,
      shape: wreathShape
    };
  },

  /**
   * Create North Star (Star of Bethlehem) decoration
   */
  createNorthStar(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'north-star',
      x: options.x !== undefined ? options.x : canvasWidth / 2,  // Center by default
      y: options.y !== undefined ? options.y : 80,  // Top of screen by default
      vx: 0,
      vy: 0,
      size: 25,  // Fixed size for prominence
      opacity: 1.0,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003,  // Extremely slow, barely noticeable twinkle
      active: true,
      static: true
    };
  },

  /**
   * Create snowman decoration
   */
  createSnowman(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'snowman',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 50,
      vx: 0,
      vy: 0,
      size: 15 + Math.random() * 10,
      opacity: 1.0,
      time: Math.random() * 1000,
      wavePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations (trees, wreaths, and North Stars)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Create trees
    const treeCount = config.trees || 6;
    for (let i = 0; i < treeCount; i++) {
      decorations.push(this.createTree(canvasWidth, canvasHeight, {
        x: (canvasWidth / (treeCount + 1)) * (i + 1),
        y: canvasHeight - 60 - Math.random() * 20
      }));
    }

    // Create wreaths
    const wreathCount = config.wreaths || 3;
    for (let i = 0; i < wreathCount; i++) {
      decorations.push(this.createWreath(canvasWidth, canvasHeight, {
        x: (canvasWidth / (wreathCount + 1)) * (i + 1),
        y: 50 + Math.random() * 100
      }));
    }

    // Create North Star (Star of Bethlehem) - single centered star
    if (config.northStars) {
      decorations.push(this.createNorthStar(canvasWidth, canvasHeight, {
        x: canvasWidth / 2,
        y: 60
      }));
    }

    // Create snowmen
    const snowmanCount = config.snowmen || 3;
    for (let i = 0; i < snowmanCount; i++) {
      decorations.push(this.createSnowman(canvasWidth, canvasHeight, {
        x: (canvasWidth / (snowmanCount + 1)) * (i + 1),
        y: canvasHeight - 50 - Math.random() * 10
      }));
    }

    return decorations;
  },

  /**
   * Spawn special particles with configurable probability
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight) {
    const choice = Math.random();

    // Santa's sleigh (0.05% chance, max 1)
    if (choice < 0.0005) {
      if (specialParticles.some(p => p.type === 'sleigh')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -100 : canvasWidth + 100;
      const baseY = 100 + Math.random() * (canvasHeight * 0.3);
      return {
        type: 'sleigh',
        x: startX,
        startX: startX,           // Store starting X for arc calculation
        y: baseY,
        baseY: baseY,
        targetX: fromLeft ? canvasWidth + 100 : -100, // Store target X
        canvasWidth: canvasWidth, // Store canvas width for arc calculation
        vx: fromLeft ? 3 + Math.random() * 2 : -(3 + Math.random() * 2),
        vy: 0,
        arcHeight: 150 + Math.random() * 100, // Height of the arc
        time: 0,
        size: 15 + Math.random() * 10,
        opacity: 0.9,
        rotation: 0,
        active: true,
        static: false
      };
    } else if (choice < 0.0013) { // Elf (0.08% chance) - Sequential range after sleigh
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'elf',
        x: fromLeft ? -50 : canvasWidth + 50,
        y: canvasHeight - 30,
        baseY: canvasHeight - 30,
        vx: fromLeft ? 1.5 + Math.random() * 1 : -(1.5 + Math.random() * 1),
        waveAmplitude: 3,
        waveFrequency: 0.05,
        waveOffset: Math.random() * Math.PI * 2,
        time: 0,
        size: 10 + Math.random() * 5,
        opacity: 0.95,
        rotation: 0,
        active: true,
        static: false
      };
    } else if (choice < 0.005) { // Christmas train (0.37% chance - much more frequent)
      if (specialParticles.some(p => p.type === 'train')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -500 : canvasWidth + 500;
      const trainSize = 21 + Math.random() * 9; // 21-30 (40% reduction from 35-50)

      // Calculate Y position so wheels sit near the bottom
      // size = trainSize * 1.8
      // baseUnit = size / 20
      // wheelRadius = baseUnit * 8 = (trainSize * 1.8 / 20) * 8 = trainSize * 0.72
      const wheelRadius = trainSize * 0.72;
      const trainY = canvasHeight - wheelRadius - 10; // Position wheels 10px from bottom

      return {
        type: 'train',
        x: startX,
        y: trainY,
        baseY: trainY,
        vx: fromLeft ? 4 + Math.random() * 2 : -(4 + Math.random() * 2),
        vy: 0,
        size: trainSize,
        opacity: 1,
        time: 0,
        smoke: [],
        active: true,
        static: false,
        carriages: 2 + Math.floor(Math.random() * 2)
      };
    } else if (choice < 0.008) { // Fireworks (0.3% chance) - Sequential range after train
      return {
        type: 'firework',
        x: Math.random() * canvasWidth,
        y: canvasHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: -10 - Math.random() * 5,
        size: 2 + Math.random() * 2,
        opacity: 1,
        active: true,
        static: false,
        time: 0,
        exploded: false,
        explosionTime: 30 + Math.random() * 30
      };
    } else if (choice < 0.012) { // Robin (0.4% chance, max 1) - Sequential range after fireworks
      if (specialParticles.some(p => p.type === 'robin')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      const startY = Math.random() * (canvasHeight * 0.2);
      const startX = fromLeft ? -50 : canvasWidth + 50;
      const robinSize = 10 + Math.random() * 5;
      // Ensure targetY is within reasonable visible bounds
      const targetY = Math.max(robinSize * 3, Math.min(canvasHeight * 0.6 - robinSize * 2, canvasHeight * 0.2 + Math.random() * (canvasHeight * 0.4)));
      const targetX = Math.random() * (canvasWidth * 0.6) + (canvasWidth * 0.2); // Also ensure targetX is not too far off

      return {
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
        sitTime: 3000 + Math.random() * 2000,
        sitStartTime: 0,
        flightProgress: 0,
        time: 0,
        waveOffset: Math.random() * Math.PI * 2
      };
    }

    return null;
  },

  /**
   * Update special particles (sleigh, robin, train, firework)
   */
  updateSpecialParticles(specialParticles, deltaTime, canvasWidth = 1024, canvasHeight = 768) { // Added default canvas dimensions
    specialParticles.forEach(particle => {
      // Increment time for animated particles
      if (particle.time !== undefined) {
        particle.time += deltaTime;
      }

      switch (particle.type) {
        case 'sleigh':
          // Sleigh movement (arc motion is handled in drawSleigh based on particle.x)
          // Just need to ensure it deactivates when off-screen
          if ((particle.vx > 0 && particle.x > particle.targetX) || (particle.vx < 0 && particle.x < particle.targetX)) {
            particle.active = false;
          }
          break;

        case 'robin':
          // Robin flight pattern: fly in -> sit -> flit off
          switch (particle.state) {
            case 'flying_in':
              const dx = particle.targetX - particle.x;
              const dy = particle.targetY - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 20) {
                particle.state = 'sitting';
                particle.vx = 0;
                particle.vy = 0;
                particle.sitStartTime = particle.time;
              } else {
                // Calculate desired velocity components based on direction to target
                const targetDirectionX = dx / distance;
                const targetDirectionY = dy / distance;

                // Max speed for flying in
                const maxFlightSpeed = 3;

                // Base horizontal speed towards target
                particle.vx = targetDirectionX * maxFlightSpeed;

                // Add undulating wave motion (bird-like bobbing flight)
                const waveAmplitude = 30; // Vertical wave height
                const waveFrequency = 0.008; // Wave frequency
                const waveMotion = Math.sin(particle.time * waveFrequency + particle.waveOffset) * waveAmplitude;

                // Calculate vertical velocity: base direction + wave derivative
                const waveDerivative = Math.cos(particle.time * waveFrequency + particle.waveOffset) * waveAmplitude * waveFrequency;
                particle.vy = targetDirectionY * maxFlightSpeed * 0.3 + waveDerivative;
              }
              break;

            case 'sitting':
              particle.vx = 0;
              particle.vy = 0;
              if (particle.time - particle.sitStartTime > particle.sitTime) {
                particle.state = 'flying_away';
                // Set base horizontal velocity (away from center)
                const baseVx = particle.x < canvasWidth / 2 ? -4 : 4;
                particle.vx = baseVx;
                particle.flyAwayStartTime = particle.time;
              }
              break;

            case 'flying_away':
              // Maintain horizontal velocity
              const flyDirection = particle.vx > 0 ? 1 : -1;
              particle.vx = flyDirection * 4;

              // Add undulating wave motion for natural bird flight
              const waveAmplitude = 25;
              const waveFrequency = 0.01;
              const flyTime = particle.time - particle.flyAwayStartTime;

              // Upward bias + wave motion
              const waveMotion = Math.sin(flyTime * waveFrequency + particle.waveOffset) * waveAmplitude;
              const waveDerivative = Math.cos(flyTime * waveFrequency + particle.waveOffset) * waveAmplitude * waveFrequency;
              particle.vy = -1.5 + waveDerivative; // Gentle upward + wave

              if (particle.x < -50 || particle.x > canvasWidth + 50 || particle.y < -50) {
                particle.active = false;
              }
              break;
          }
          break;

        case 'train':
          // Train deactivates when off-screen
          if ((particle.vx > 0 && particle.x > canvasWidth + 500) || (particle.vx < 0 && particle.x < -500)) {
            particle.active = false;
          }

          // Emit smoke puffs - every 150ms
          if (!particle.lastSmokeTime) {
            particle.lastSmokeTime = 0;
          }

          if (particle.time - particle.lastSmokeTime > 150) {
            particle.lastSmokeTime = particle.time;

            // Calculate smoke position from chimney
            const smokeX = particle.x + (particle.vx > 0 ? -particle.size * 0.8 : particle.size * 0.8);
            const smokeY = particle.y - particle.size * 1.5;

            particle.smoke.push({
              x: smokeX,
              y: smokeY,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -1 - Math.random() * 0.5,
              size: particle.size * (0.3 + Math.random() * 0.4),
              opacity: 1,
              life: 1.0,
              fadeRate: 0.02 + Math.random() * 0.01
            });
          }

          // Update smoke puffs
          particle.smoke = particle.smoke.filter(smoke => {
            smoke.x += smoke.vx;
            smoke.y += smoke.vy;
            smoke.vy *= 0.99; // Slow vertical lift
            smoke.size *= 1.01; // Expand
            smoke.opacity -= smoke.fadeRate;
            return smoke.opacity > 0;
          });
          break;

        case 'firework':
          // Check firework explosion
          if (!particle.exploded) {
            // Explode when reached target height OR after flight time
            const reachedTarget = particle.y <= particle.targetY;
            const timeExpired = particle.time >= particle.explosionTime;

            if (reachedTarget || timeExpired) {
              particle.exploded = true;
              this.explodeFirework(particle, specialParticles);
              particle.active = false; // Remove the firework itself
            }
          }
          break;
      }
    });
  },

  /**
   * Draw 6-pointed crystalline snowflake
   */
  drawSnowflake(ctx, particle) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(particle.size * 0.15, 0.5);

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
  },

  /**
   * Draw Christmas tree with lights, baubles, tinsel, and star
   */
  drawTree(ctx, particle, twinkleTime) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Trunk
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, size * 0.8);
    ctx.lineTo(size * 0.2, size * 0.8);
    ctx.lineTo(size * 0.15, size * 1.3);
    ctx.lineTo(-size * 0.15, size * 1.3);
    ctx.closePath();
    ctx.fill();

    // Trunk texture
    ctx.strokeStyle = '#4a2f1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-size * 0.15, size * 0.9 + i * size * 0.12);
      ctx.lineTo(size * 0.15, size * 0.9 + i * size * 0.12);
      ctx.stroke();
    }

    // Tree layers (3 triangular layers)
    ctx.fillStyle = '#228B22';
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

    // Tinsel
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1.5;
    for (let layer = 0; layer < 3; layer++) {
      const layerY = layer * size * 0.4;
      const layerSize = size * (1.2 - layer * 0.2);
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const xPos = -layerSize + (i / 6) * layerSize * 2;
        const yPos = size * 0.15 - layerY + (i % 2 === 0 ? -size * 0.1 : 0);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
    }

    // Baubles
    const baubleColors = ['#ff0000', '#0000ff', '#ffd700', '#ff69b4', '#00ff00'];
    for (let i = 0; i < 8; i++) {
      const layer = Math.floor(i / 3);
      const layerY = layer * size * 0.4;
      const layerSize = size * (1.2 - layer * 0.2) * 0.7;
      const angle = (i % 3) * (Math.PI * 2 / 3) + layer * 0.5;
      const baubleX = Math.cos(angle) * layerSize;
      const baubleY = size * 0.1 - layerY;

      ctx.fillStyle = baubleColors[i % baubleColors.length];
      ctx.beginPath();
      ctx.arc(baubleX, baubleY, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(baubleX - size * 0.04, baubleY - size * 0.04, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }

    // Twinkling lights
    const lightColors = ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ffffff'];
    for (let i = 0; i < 12; i++) {
      const layer = Math.floor(i / 4);
      const layerY = layer * size * 0.4;
      const layerSize = size * (1.2 - layer * 0.2) * 0.85;
      const angle = (i % 4) * (Math.PI * 2 / 4) + layer * 0.3;
      const lightX = Math.cos(angle) * layerSize;
      const lightY = size * 0.2 - layerY;

      // Twinkle effect
      const twinkleIntensity = (Math.sin((twinkleTime * 0.003) + (i * 0.5)) + 1) * 0.5;
      const glowOpacity = 0.3 + (twinkleIntensity * 0.7);

      // Glow
      const gradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, size * 0.15);
      const color = lightColors[i % lightColors.length];
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = glowOpacity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(lightX, lightY, size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Light bulb
      ctx.globalAlpha = 0.5 + (twinkleIntensity * 0.5);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lightX, lightY, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Gold star with glow
    const starSize = size * 0.35;
    const starY = -size * 1.4;

    // Star glow
    const starGradient = ctx.createRadialGradient(0, starY, 0, 0, starY, starSize * 2);
    starGradient.addColorStop(0, 'rgba(255,223,0,1)');
    starGradient.addColorStop(0.3, 'rgba(255,215,0,0.7)');
    starGradient.addColorStop(0.6, 'rgba(255,215,0,0.3)');
    starGradient.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = starGradient;
    ctx.beginPath();
    ctx.arc(0, starY, starSize * 2, 0, Math.PI * 2);
    ctx.fill();

    // Star
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(0, starY);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      const radius = i % 2 === 0 ? starSize : starSize * 0.4;
      const pointX = Math.cos(angle) * radius;
      const pointY = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  },

  /**
   * Draw Christmas wreath with bow and lights
   */
  drawWreath(ctx, particle, twinkleTime) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Wreath body (pre-generated irregular shape)
    particle.shape.forEach(segment => {
      ctx.lineWidth = size * segment.thickness;
      ctx.strokeStyle = segment.color;
      ctx.beginPath();
      const startAngle = segment.angle - (Math.PI / particle.shape.length);
      const endAngle = segment.angle + (Math.PI / particle.shape.length);
      ctx.arc(0, 0, size * segment.radius, startAngle, endAngle);
      ctx.stroke();
    });

    // Twinkling lights on wreath
    const lightColors = ['#ff0000', '#ffff00', '#0000ff'];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + particle.rotation;
      const lightX = Math.cos(angle) * size;
      const lightY = Math.sin(angle) * size;
      const twinkleIntensity = (Math.sin((twinkleTime * 0.002) + (i * 0.7)) + 1) / 2;

      if (twinkleIntensity > 0.5) {
        const glowOpacity = (twinkleIntensity - 0.5) * 2;
        const color = lightColors[i % lightColors.length];
        const gradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, size * 0.15);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = glowOpacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
      ctx.arc(lightX, lightY, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      }
    }

    // Red bow at top
    ctx.fillStyle = '#c00';
    const bowY = -size;

    // Left loop
    ctx.beginPath();
    ctx.ellipse(-size * 0.3, bowY, size * 0.3, size * 0.4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Right loop
    ctx.beginPath();
    ctx.ellipse(size * 0.3, bowY, size * 0.3, size * 0.4, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Bow center knot
    ctx.beginPath();
    ctx.arc(0, bowY, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw North Star (Star of Bethlehem) - Silver 4-pointed star, non-spinning
   */
  drawNorthStar(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Calculate twinkle intensity (gentle pulsing)
    const twinkleIntensity = 0.8 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.2;

    ctx.save();
    ctx.translate(x, y);

    // Outer glow halo (pulsing silver aura)
    const glowSize = size * 4 * twinkleIntensity;
    const haloGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
    haloGradient.addColorStop(0, 'rgba(220, 230, 240, 0.4)');
    haloGradient.addColorStop(0.4, 'rgba(200, 210, 220, 0.2)');
    haloGradient.addColorStop(1, 'rgba(180, 190, 200, 0)');
    ctx.fillStyle = haloGradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw 4-pointed star with pointed tips (taller and thinner)
    const horizontalLength = size * 1.0;  // Horizontal arms
    const verticalLength = size * 1.5;    // Vertical arms (much taller)
    const armWidth = size * 0.12;         // Width at base of each arm (thinner)

    // Silver gradient for star body
    const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    starGradient.addColorStop(0, '#ffffff');           // Bright white center
    starGradient.addColorStop(0.3, '#f0f0f0');         // Light silver
    starGradient.addColorStop(0.6, '#c0c0c0');         // Silver
    starGradient.addColorStop(1, '#a0a0a0');           // Darker silver edge

    ctx.shadowColor = 'rgba(220, 230, 240, 0.9)';
    ctx.shadowBlur = size * 0.8 * twinkleIntensity;
    ctx.fillStyle = starGradient;

    // Draw 4-pointed star with pointed tips
    ctx.beginPath();
    // Top point
    ctx.moveTo(0, -verticalLength);
    ctx.lineTo(armWidth, -armWidth);
    // Right point
    ctx.lineTo(horizontalLength, 0);
    ctx.lineTo(armWidth, armWidth);
    // Bottom point
    ctx.lineTo(0, verticalLength);
    ctx.lineTo(-armWidth, armWidth);
    // Left point
    ctx.lineTo(-horizontalLength, 0);
    ctx.lineTo(-armWidth, -armWidth);
    ctx.closePath();
    ctx.fill();

    // Inner bright white core (circular center)
    ctx.shadowBlur = size * 1.2 * twinkleIntensity;
    ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.6, '#f5f5f5');
    coreGradient.addColorStop(1, 'rgba(200, 200, 200, 0.8)');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw Santa's sleigh with 5 reindeer (including Rudolph)
   */
  drawSleigh(ctx, particle) {
    const x = particle.x;

    // Calculate progress across screen (0 to 1)
    const totalDistance = Math.abs(particle.targetX - particle.startX);
    const traveled = Math.abs(particle.x - particle.startX);
    const progress = Math.min(1, traveled / totalDistance);

    // Half-sine arc path: starts at baseY, arcs upward to peak at middle, returns to baseY
    // Math.sin(progress * Math.PI) gives: 0 → 1 (peak) → 0
    const arcOffset = Math.sin(progress * Math.PI) * particle.arcHeight;
    const y = particle.baseY - arcOffset; // Subtract to arc upward

    const size = particle.size * 1.5;
    const dir = particle.vx > 0 ? 1 : -1;
    // Half-sine wave for galloping/running motion (0 to 1 range)
    const runCycle = Math.abs(Math.sin(particle.time * 0.007));

    // Safety check for NaN values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size)) {
      console.warn('[Christmas] Invalid sleigh values:', {x, y, size});
      return;
    }

    // Reindeer positions (5 reindeer)
    const reindeerPositions = [
      {x: 4.8, y: 0},      // Rudolph (lead)
      {x: 4.0, y: -0.3},   // Second row left
      {x: 4.0, y: 0.3},    // Second row right
      {x: 3.2, y: -0.15},  // Back row left
      {x: 3.2, y: 0.15}    // Back row right
    ];

    reindeerPositions.forEach((pos, i) => {
      const reindeerX = x + dir * (size * pos.x);
      const offsetY = pos.y * size;

      // Reindeer body
      ctx.fillStyle = '#9c6e49';
      ctx.strokeStyle = '#7b563a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(reindeerX - dir * size * 0.4, y + offsetY);
      ctx.quadraticCurveTo(reindeerX, y + offsetY - size * 0.4, reindeerX + dir * size * 0.4, y + offsetY);
      ctx.quadraticCurveTo(reindeerX, y + offsetY + size * 0.4, reindeerX - dir * size * 0.4, y + offsetY);
      ctx.fill();
      ctx.stroke();

      // Head
      const headX = reindeerX + dir * size * 0.5;
      const headY = y + offsetY - size * 0.3;
      ctx.beginPath();
      ctx.ellipse(headX, headY, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Antlers
      ctx.strokeStyle = '#6e4a2e';
      ctx.lineWidth = 1.5;
      const antlerX = headX - dir * size * 0.1;
      const antlerY = headY - size * 0.15;
      ctx.beginPath();
      ctx.moveTo(antlerX, antlerY);
      ctx.lineTo(antlerX - dir * size * 0.2, antlerY - size * 0.3);
      ctx.lineTo(antlerX - dir * size * 0.1, antlerY - size * 0.4);
      ctx.moveTo(antlerX - dir * size * 0.2, antlerY - size * 0.3);
      ctx.lineTo(antlerX - dir * size * 0.3, antlerY - size * 0.35);
      ctx.stroke();

      // Legs - galloping motion using half-sine wave
      const legY = y + offsetY + size * 0.1;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#7b563a';

      // Front leg extends forward during gallop
      const frontLegExtension = runCycle * size * 0.45;
      ctx.beginPath();
      ctx.moveTo(reindeerX + dir * size * 0.3, legY);
      ctx.lineTo(reindeerX + dir * (size * 0.3 + frontLegExtension), legY + size * 0.3);
      ctx.stroke();

      // Back leg extends backward during gallop (opposite phase)
      const backLegExtension = (1 - runCycle) * size * 0.45;
      ctx.beginPath();
      ctx.moveTo(reindeerX - dir * size * 0.3, legY);
      ctx.lineTo(reindeerX - dir * (size * 0.3 + backLegExtension), legY + size * 0.3);
      ctx.stroke();

      // Rudolph's glowing red nose (first reindeer only)
      if (i === 0) {
        const noseX = headX + dir * size * 0.25;
        const noseY = headY;

        // Nose
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(noseX, noseY, size * 0.03, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(noseX, noseY, 0, noseX, noseY, size * 0.10);
        gradient.addColorStop(0, 'rgba(255,0,0,0.7)');
        gradient.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(noseX, noseY, size * 0.10, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Sleigh body
    ctx.fillStyle = '#c00';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;

    const sleighTop = y - size * 0.7;
    const sleighFront = x + dir * size * 1.5;
    const sleighBack = x - dir * size * 0.3;
    const sleighBottom = y + size * 0.3;

    ctx.beginPath();
    ctx.moveTo(sleighFront, sleighTop);
    ctx.quadraticCurveTo(x + dir * size, y - size * 0.2, sleighFront - dir * size * 0.8, y);
    ctx.lineTo(sleighBack, y);
    ctx.lineTo(sleighBack, sleighBottom);
    ctx.lineTo(sleighFront, sleighBottom);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sleigh back
    ctx.beginPath();
    ctx.moveTo(sleighBack, y);
    ctx.quadraticCurveTo(sleighBack - dir * size * 0.4, y - size * 0.5, sleighBack, sleighTop);
    ctx.quadraticCurveTo(sleighBack + dir * size * 0.2, y - size * 0.4, sleighBack + dir * size * 0.2, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Runners/blades
    ctx.strokeStyle = '#a52a2a';
    ctx.lineWidth = 4;
    const runnerY = sleighBottom + size * 0.2;

    function drawRunner(offset) {
      ctx.beginPath();
      ctx.moveTo(sleighFront + dir * size * 0.1, runnerY + offset);
      ctx.quadraticCurveTo(x, runnerY + offset + size * 0.2, sleighBack - dir * size * 0.2, runnerY + offset);
      ctx.stroke();

      // Struts
      ctx.beginPath();
      ctx.moveTo(sleighFront - dir * size * 0.5, sleighBottom);
      ctx.lineTo(sleighFront - dir * size * 0.5, runnerY + offset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sleighBack + dir * size * 0.5, sleighBottom);
      ctx.lineTo(sleighBack + dir * size * 0.5, runnerY + offset);
      ctx.stroke();
    }

    drawRunner(0);
    drawRunner(size * 0.1);

    // Gift sack
    const sackX = x - dir * size * 0.05;
    ctx.fillStyle = '#5c4033';
    ctx.beginPath();
    ctx.moveTo(sackX - size * 0.3, y - size * 0.4);
    ctx.quadraticCurveTo(sackX - size * 0.6, y - size * 0.2, sackX - size * 0.4, y + size * 0.1);
    ctx.quadraticCurveTo(sackX, y + size * 0.3, sackX + size * 0.4, y + size * 0.1);
    ctx.quadraticCurveTo(sackX + size * 0.6, y - size * 0.2, sackX + size * 0.3, y - size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(sackX + size * 0.1, y - size * 0.3, size * 0.2, size * 0.1, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Rope tie
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sackX, y - size * 0.4, size * 0.2, 0, Math.PI, true);
    ctx.stroke();

    // Santa
    const santaX = x + dir * size * 0.6;
    const santaY = y - size * 0.55;

    // Santa hat
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.moveTo(santaX - size * 0.2, santaY);
    ctx.lineTo(santaX + size * 0.2, santaY);
    ctx.lineTo(santaX, santaY - size * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.fillRect(santaX - size * 0.22, santaY, size * 0.44, size * 0.08);
    ctx.beginPath();
    ctx.arc(santaX, santaY - size * 0.4, size * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Santa face
    ctx.fillStyle = '#FFD7BA';
    ctx.beginPath();
    ctx.arc(santaX, santaY + size * 0.08, size * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Santa beard
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(santaX, santaY + size * 0.2, size * 0.25, size * 0.2, 0, 0, Math.PI);
    ctx.fill();

    // Reins connecting to reindeer
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    reindeerPositions.forEach(pos => {
      const reindeerX = x + dir * (size * pos.x);
      const offsetY = pos.y * size;
      const headX = reindeerX + dir * size * 0.5;
      ctx.beginPath();
      ctx.moveTo(santaX, santaY + size * 0.1);
      ctx.quadraticCurveTo((santaX + headX) / 2, y + offsetY - size * 0.5, headX - dir * size * 0.1, y + offsetY - size * 0.3);
      ctx.stroke();
    });
  },

  /**
   * Draw walking elf
   */
  drawElf(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.translate(x, y);

    const legAngle = Math.sin(particle.time * 0.05) * (Math.PI / 3);

    // Legs
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

    // Body (green tunic)
    ctx.fillStyle = '#008000';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(dir * size * 0.4, size * 0.3);
    ctx.lineTo(dir * -size * 0.4, size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#FFD7BA';
    ctx.beginPath();
    ctx.arc(0, -size * 0.6, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Red elf hat
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(dir * size * 0.35, -size * 0.6);
    ctx.lineTo(dir * -size * 0.35, -size * 0.6);
    ctx.closePath();
    ctx.fill();

    // Hat tip
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.quadraticCurveTo(dir * size * 0.2, -size * 1.1, dir * size * 0.4, -size * 1.3);
    ctx.stroke();

    // Bell
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(dir * size * 0.4, -size * 1.3, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw Christmas steam train
   */
  drawTrain(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size * 1.8;
    const dir = particle.vx > 0 ? 1 : -1;
    const time = particle.time;

    // Draw smoke puffs FIRST (before translation) - they use absolute coordinates
    particle.smoke.forEach(smoke => {
      ctx.save();
      ctx.globalAlpha = smoke.opacity;
      ctx.fillStyle = '#E8E8E8'; // Light gray smoke
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    const wheelRotation = time * 0.005;
    const baseUnit = size / 20;
    const baseY = 0;
    const wheelRadius = baseUnit * 8;
    const smallWheelRadius = baseUnit * 5;
    const chassisHeight = baseUnit * 7;
    const carHeight = baseUnit * 35;
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

    // Draw carriages
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

      // Windows with warm light
      const windowHeight = carHeight * 0.6;
      const windowY = carBodyTopY + carHeight * 0.2;
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

      // Passenger silhouettes
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

      // Wreath on carriage
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

    // Draw engine
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

    // Chimney
    const chimneyTopY = boilerTopY - baseUnit * 8;
    ctx.fillStyle = '#17202A';
    ctx.beginPath();
    ctx.moveTo(boilerWidth * 0.7, boilerTopY);
    ctx.lineTo(boilerWidth * 0.7 - baseUnit * 2, chimneyTopY);
    ctx.lineTo(boilerWidth * 0.7 + baseUnit * 10, chimneyTopY - baseUnit * 4);
    ctx.lineTo(boilerWidth * 0.7 + baseUnit * 8, boilerTopY);
    ctx.closePath();
    ctx.fill();

    // Headlight
    const lightX = boilerWidth + boilerRadius;
    const lightY = boilerTopY + boilerRadius;
    const lightRadius = baseUnit * 4;
    const gradient = ctx.createRadialGradient(lightX, lightY, lightRadius * 0.2, lightX, lightY, lightRadius * 1.5);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 220, 100, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(lightX - lightRadius, lightY - lightRadius, lightRadius * 2, lightRadius * 2);

    // Connecting rods
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

    ctx.restore();
  },

  /**
   * Draw firework particle or spark
   */
  drawFirework(ctx, particle) {
    ctx.fillStyle = particle.color || '#ffffff';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  },

  /**
   * Explode firework into sparks
   */
  explodeFirework(particle, specialParticles) {
    const sparkCount = 50 + Math.random() * 50;
    const colors = ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ffffff'];
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      specialParticles.push({
        type: 'spark',
        x: particle.x,
        y: particle.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        opacity: 1,
        active: true,
        static: false,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  },

  /**
   * Draw robin (British red-breasted robin with Santa hat)
   */
  drawRobin(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx >= 0 ? 1 : -1;

    // Determine animation state
    const isFlying = particle.state === 'flying_in' || particle.state === 'flying_away';
    const isSitting = particle.state === 'sitting';

    // Initialize transition tracking if needed
    if (particle.wingIntensity === undefined) {
      particle.wingIntensity = isFlying ? 1 : 0;
    }

    // Smooth exponential transition between flying and sitting
    const targetIntensity = isFlying ? 1 : 0;
    const transitionSpeed = 0.02; // Smooth transition
    particle.wingIntensity += (targetIntensity - particle.wingIntensity) * transitionSpeed;

    // Wing flapping with sinusoidal easing for smooth, natural motion
    let wingAngle = 0;
    if (particle.wingIntensity > 0.01) {
      // Natural wing flap frequency (about 2-3 flaps per second)
      const flapFrequency = 0.012; // Frequency in radians per millisecond

      // Get base sine wave (-1 to 1)
      const rawSine = Math.sin(time * flapFrequency + particle.waveOffset);

      // Apply ease-in-out using sine for smooth acceleration/deceleration
      // This creates the characteristic "flap" motion: slow at extremes, fast in middle
      const easedSine = Math.sin(rawSine * Math.PI / 2);

      // Amplitude: wings move from folded (down) to extended (up)
      const flapAmplitude = Math.PI / 6; // 30° range

      // Apply intensity for smooth transitions
      wingAngle = easedSine * flapAmplitude * particle.wingIntensity;
    }

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Body (red breast)
    ctx.fillStyle = '#A52A2A'; // Brown back
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red breast
    ctx.fillStyle = '#DC143C'; // Crimson red
    ctx.beginPath();
    ctx.ellipse(size * 0.15, size * 0.1, size * 0.45, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (behind wings) - very subtle
    ctx.fillStyle = '#654321';
    ctx.strokeStyle = '#4a2c2a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, 0);
    ctx.quadraticCurveTo(-size * 0.7, -size * 0.08, -size * 0.85, 0);
    ctx.quadraticCurveTo(-size * 0.7, size * 0.08, -size * 0.5, 0);
    ctx.fill();
    ctx.stroke();

    // Left wing (back wing)
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(-size * 0.3, -size * 0.1);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.45, size * 0.25, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right wing (front wing)
    ctx.fillStyle = '#A0692F';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(-size * 0.3, size * 0.1);
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.45, size * 0.25, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Head - simple, minimal animation
    ctx.fillStyle = '#A52A2A';
    ctx.beginPath();
    ctx.arc(size * 0.5, -size * 0.2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.75, -size * 0.2);
    ctx.lineTo(size * 0.95, -size * 0.15);
    ctx.lineTo(size * 0.75, -size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size * 0.6, -size * 0.25, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.62, -size * 0.27, size * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Legs (when sitting) - simple and clean
    if (isSitting) {
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = size * 0.08;
      ctx.lineCap = 'round';

      // Right leg
      ctx.beginPath();
      ctx.moveTo(size * 0.1, size * 0.7);
      ctx.lineTo(size * 0.1, size * 1.0);
      ctx.stroke();

      // Left leg
      ctx.beginPath();
      ctx.moveTo(-size * 0.1, size * 0.7);
      ctx.lineTo(-size * 0.1, size * 1.0);
      ctx.stroke();

      // Simple feet
      ctx.lineWidth = size * 0.06;
      ctx.beginPath();
      ctx.moveTo(size * 0.1, size * 1.0);
      ctx.lineTo(size * 0.25, size * 1.0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.1, size * 1.0);
      ctx.lineTo(-size * 0.25, size * 1.0);
      ctx.stroke();
    }

    // Santa hat
    const hatX = size * 0.5;
    const hatY = -size * 0.55;

    // Hat body
    ctx.fillStyle = '#c00';
    ctx.beginPath();
    ctx.moveTo(hatX - size * 0.3, hatY);
    ctx.lineTo(hatX + size * 0.25, hatY);
    ctx.lineTo(hatX + size * 0.1, hatY - size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Hat brim
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(hatX - size * 0.32, hatY, size * 0.58, size * 0.1);

    // Hat pompom
    ctx.beginPath();
    ctx.arc(hatX + size * 0.1, hatY - size * 0.5, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw snowman with top hat, scarf, and coal features
   */
  drawSnowman(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Subtle idle animation (gentle sway)
    const sway = Math.sin(time * 0.002 + particle.wavePhase) * 0.03;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sway);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, size * 2.0, size * 1.2, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bottom snowball (largest)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, size * 1.3, size * 1.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Middle snowball
    ctx.beginPath();
    ctx.arc(0, size * 0.3, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head snowball (smallest)
    ctx.beginPath();
    ctx.arc(0, -size * 0.6, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Coal buttons
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, size * 0.5, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, size * 0.1, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Stick arms
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = size * 0.1;

    // Left arm
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, size * 0.3);
    ctx.lineTo(-size * 1.2, size * 0.0);
    ctx.lineTo(-size * 1.5, -size * 0.1);
    ctx.stroke();
    // Fingers
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.moveTo(-size * 1.5, -size * 0.1);
    ctx.lineTo(-size * 1.7, -size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size * 1.5, -size * 0.1);
    ctx.lineTo(-size * 1.8, -size * 0.05);
    ctx.stroke();

    // Right arm
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(size * 0.6, size * 0.3);
    ctx.lineTo(size * 1.2, size * 0.0);
    ctx.lineTo(size * 1.5, -size * 0.1);
    ctx.stroke();
    // Fingers
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.moveTo(size * 1.5, -size * 0.1);
    ctx.lineTo(size * 1.7, -size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 1.5, -size * 0.1);
    ctx.lineTo(size * 1.8, -size * 0.05);
    ctx.stroke();

    // Carrot nose
    ctx.fillStyle = '#FF6347'; // Tomato orange
    ctx.beginPath();
    ctx.moveTo(size * 0.15, -size * 0.6);
    ctx.lineTo(size * 0.6, -size * 0.65);
    ctx.lineTo(size * 0.15, -size * 0.55);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.7, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 0.7, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Smile (coal pieces)
    const smilePoints = [
      { x: -size * 0.2, y: -size * 0.4 },
      { x: -size * 0.1, y: -size * 0.35 },
      { x: 0, y: -size * 0.33 },
      { x: size * 0.1, y: -size * 0.35 },
      { x: size * 0.2, y: -size * 0.4 }
    ];
    smilePoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, size * 0.05, 0, Math.PI * 2);
      ctx.fill();
    });

    // Scarf
    ctx.fillStyle = '#c00';
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 1;

    // Scarf around neck
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.15, size * 0.55, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Scarf hanging end
    ctx.fillRect(size * 0.3, -size * 0.1, size * 0.2, size * 0.8);
    ctx.strokeRect(size * 0.3, -size * 0.1, size * 0.2, size * 0.8);

    // Fringe at end of scarf
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = size * 0.03;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(size * 0.33 + i * size * 0.13, size * 0.7);
      ctx.lineTo(size * 0.33 + i * size * 0.13, size * 0.85);
      ctx.stroke();
    }

    // Top hat
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;

    // Hat brim
    ctx.beginPath();
    ctx.ellipse(0, -size * 1.1, size * 0.7, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hat top
    ctx.fillRect(-size * 0.45, -size * 1.8, size * 0.9, size * 0.7);
    ctx.strokeRect(-size * 0.45, -size * 1.8, size * 0.9, size * 0.7);

    // Hat band (red)
    ctx.fillStyle = '#c00';
    ctx.fillRect(-size * 0.45, -size * 1.3, size * 0.9, size * 0.15);

    // Holly on hat
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 1.22, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 1.22, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    // Berries
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(0, -size * 1.25, size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};