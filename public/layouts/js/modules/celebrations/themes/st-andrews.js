/**
 * St Andrew's Day Theme for Domma Celebrations
 * (November 30th, Scottish Celebration)
 *
 * Features:
 * - Falling thistles (Scottish national flower)
 * - Snowflakes (Scottish winter)
 * - Saltire flag patterns (white X on blue)
 * - Bagpiper silhouette
 * - Tartan patterns
 * - Blue and white color scheme with purple thistles
 */

export default {
  name: 'st-andrews',
  displayName: 'St Andrew\'s Day',
  emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 50,
      speedRange: [0.5, 1.5],
      sizeRange: [2, 4],
      thistles: 4,
      bagpiperChance: 0.0002,
      twinklingStars: 12
    },
    medium: {
      count: 100,
      speedRange: [0.6, 2.0],
      sizeRange: [2, 5],
      thistles: 6,
      bagpiperChance: 0.0004,
      twinklingStars: 20
    },
    heavy: {
      count: 200,
      speedRange: [0.8, 2.5],
      sizeRange: [3, 6],
      thistles: 8,
      bagpiperChance: 0.0006,
      twinklingStars: 30
    }
  },

  particles: ['heather-petal', 'heather', 'saltire-sparkle'],
  decorations: ['thistle-plant', 'bagpiper', 'saltire-flag', 'tartan-pattern', 'highland-scene', 'twinkling-star'],
  colors: {
    primary: '#0065BD',    // Scottish blue (Saltire)
    secondary: '#FFFFFF',  // White (Saltire)
    accent: '#8B008B',     // Thistle purple (decorations only)
    tartan: ['#0065BD', '#006400', '#8B0000', '#FFDD00']
  },

  /**
   * Create heather petal particle (simple purple petal)
   */
  createHeatherPetal(canvasWidth, canvasHeight, config) {
    // Purple/pink heather shades
    const purpleShades = ['#9370DB', '#BA55D3', '#DA70D6', '#DDA0DD', '#8B008B'];
    return {
      type: 'heather-petal',
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
      color: purpleShades[Math.floor(Math.random() * purpleShades.length)],
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.02 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create thistle particle (white and blue - Scottish Saltire colors - full flower)
   */
  createThistle(canvasWidth, canvasHeight, config) {
    const isWhite = Math.random() < 0.5; // 50% white, 50% blue
    const flowerColor = isWhite ? '#FFFFFF' : '#0065BD';
    const petalColors = isWhite
      ? ['#FFFFFF', '#f0f0f0', '#e0e0e0']  // White shades
      : ['#0065BD', '#1a7dd4', '#3399ee']; // Blue shades

    return {
      type: 'thistle',
      x: -30,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.7,  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.15,  // Gentle vertical bobbing
      opacity: 0.7 + Math.random() * 0.3,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.015 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      flowerColor: flowerColor,
      petalColors: petalColors,
      active: true
    };
  },

  /**
   * Create heather particle (Scottish Highland heather - purple flowers - full sprig)
   */
  createHeather(canvasWidth, canvasHeight, config) {
    // Heather color variations (purple/pink shades)
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.5) {
      color = '#9370DB';  // 50% medium purple
    } else if (colorChoice < 0.8) {
      color = '#BA55D3';  // 30% medium orchid
    } else {
      color = '#DA70D6';  // 20% orchid pink
    }

    return {
      type: 'heather',
      x: -30,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.6,  // Horizontal drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: (Math.random() - 0.5) * 0.15,  // Gentle vertical bobbing
      opacity: 0.75 + Math.random() * 0.25,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed: 0.02 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: color,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      bellCount: 3 + Math.floor(Math.random() * 3), // 3-5 bells per sprig
      active: true
    };
  },

  /**
   * Create saltire sparkle particle
   */
  createSaltireSparkle(canvasWidth, canvasHeight, config) {
    const colors = ['#0065BD', '#FFFFFF']; // Scottish blue and white
    return {
      type: 'saltire-sparkle',
      x: -20,  // Start from left edge
      y: Math.random() * canvasHeight,  // Random height
      vx: (config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0])) * 0.8,  // Horizontal drift
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
   * Note: St. Andrew's Day particles drift horizontally (left-to-right), not vertically
   */
  createFallingParticle(canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // 60% heather petals, 20% full heather, 15% sparkles, 5% thistles
    if (choice < 0.6) {
      return this.createHeatherPetal(canvasWidth, canvasHeight, config);
    } else if (choice < 0.8) {
      return this.createHeather(canvasWidth, canvasHeight, config);
    } else if (choice < 0.95) {
      return this.createSaltireSparkle(canvasWidth, canvasHeight, config);
    } else {
      return this.createThistle(canvasWidth, canvasHeight, config);
    }
  },

  /**
   * Create static thistle plant decoration
   */
  createThistlePlant(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'thistle-plant',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
      y: options.y !== undefined ? options.y : canvasHeight - 40,
      size: 15 + Math.random() * 10,
      opacity: 0.8 + Math.random() * 0.2,
      swayPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations (Scottish-themed)
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Thistle plants (Scottish national flower, multiple positions)
    const thistleCount = config.thistles || 5;
    for (let i = 0; i < thistleCount; i++) {
      decorations.push(this.createThistlePlant(canvasWidth, canvasHeight, {
        x: 80 + (i / (thistleCount - 1)) * (canvasWidth - 160),
        y: canvasHeight - 60 - Math.random() * 30
      }));
    }

    // Bagpiper (Highland piper in traditional dress, left side)
    decorations.push({
      type: 'bagpiper',
      x: 150,
      y: canvasHeight - 60,
      baseY: canvasHeight - 60,
      vx: 0, // Static display
      size: 30 + Math.random() * 8,
      opacity: 1,
      time: 0,
      legPhase: 0,
      bagInflate: 0.5,
      active: true,
      static: true
    });

    // Saltire flag (St Andrew's Cross, top right)
    decorations.push({
      type: 'saltire-flag',
      x: canvasWidth - 100,
      y: 80,
      size: 60,
      opacity: 1,
      wavePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Tartan pattern display (decorative Scottish pattern, bottom center)
    decorations.push({
      type: 'tartan-pattern',
      x: canvasWidth * 0.5,
      y: canvasHeight - 80,
      size: 80 + Math.random() * 20,
      opacity: 0.9,
      active: true,
      static: true
    });

    // Highland scene silhouette (mountains, castle, loch - right side)
    decorations.push({
      type: 'highland-scene',
      x: canvasWidth - 200,
      y: canvasHeight - 150,
      size: 100,
      opacity: 0.7,
      active: true,
      static: true
    });

    // Create twinkling stars (Scottish winter night sky)
    const starCount = config.twinklingStars || 20;
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
      y: Math.random() * (canvasHeight * 0.6), // Upper portion of sky
      size: 1 + Math.random() * 2,
      opacity: 0.6 + Math.random() * 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.003,
      active: true,
      static: true
    };
  },

  /**
   * Spawn special St Andrew's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Bagpiper (very rare, max 1)
    if (choice < config.bagpiperChance) {
      if (specialParticles.some(p => p.type === 'bagpiper')) {
        return null;
      }
      const fromLeft = Math.random() < 0.5;
      return {
        type: 'bagpiper',
        x: fromLeft ? -60 : canvasWidth + 60,
        y: canvasHeight - 50,
        vx: fromLeft ? 0.8 + Math.random() * 0.5 : -(0.8 + Math.random() * 0.5),
        size: 18 + Math.random() * 8,
        opacity: 0.9,
        time: 0,
        marchPhase: Math.random() * Math.PI * 2,
        active: true,
        static: false
      };
    }

    // Saltire flag (rare, max 2)
    if (choice < 0.0004) {
      const flagCount = specialParticles.filter(p => p.type === 'saltire-flag').length;
      if (flagCount < 2) {
        return {
          type: 'saltire-flag',
          x: Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2,
          y: 50 + Math.random() * 100,
          size: 40 + Math.random() * 20,
          opacity: 0.8,
          waveOffset: Math.random() * Math.PI * 2,
          time: 0,
          active: true,
          static: false
        };
      }
    }

    // Sparkles
    if (choice < 0.01) {
      return this.createSaltireSparkle(canvasWidth, canvasHeight, config);
    }

    return null;
  },

  /**
   * Draw heather petal (simple purple bell-shaped petal)
   */
  drawHeatherPetal(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Flutter effect (petal curling as it drifts)
    const flutter = Math.sin(time * particle.flutterSpeed + particle.flutter) * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation + flutter);

    // Heather bell petal shape (small bell)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = '#6A0DAD'; // Purple edge
    ctx.lineWidth = size * 0.08;

    ctx.beginPath();
    // Bell shape with slight flare at bottom
    ctx.moveTo(0, -size * 0.6);
    ctx.bezierCurveTo(
      size * 0.4, -size * 0.5,
      size * 0.5, size * 0.2,
      size * 0.3, size * 0.8
    );
    ctx.lineTo(-size * 0.3, size * 0.8);
    ctx.bezierCurveTo(
      -size * 0.5, size * 0.2,
      -size * 0.4, -size * 0.5,
      0, -size * 0.6
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Add bell texture lines
    ctx.strokeStyle = 'rgba(106, 13, 173, 0.3)';
    ctx.lineWidth = size * 0.04;
    for (let i = 0; i < 4; i++) {
      const yPos = -size * 0.5 + i * size * 0.35;
      ctx.beginPath();
      ctx.moveTo(-size * 0.25, yPos);
      ctx.lineTo(size * 0.25, yPos);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw heather (Scottish Highland heather sprig with bell-shaped flowers)
   */
  drawHeather(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const sway = Math.sin(particle.sway) * size * 0.4;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x + sway, y);
    ctx.rotate(particle.rotation);

    // Stem (thin green-brown)
    ctx.strokeStyle = '#6b5c4d';
    ctx.lineWidth = size * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, size * 0.6);
    ctx.lineTo(0, -size * 0.8);
    ctx.stroke();

    // Bell-shaped flowers along the stem (small purple bells)
    const bellCount = particle.bellCount || 4;
    for (let i = 0; i < bellCount; i++) {
      const yPos = -size * 0.7 + (i / bellCount) * size * 1.2;
      const bellSize = size * (0.18 + Math.random() * 0.08);
      const side = i % 2 === 0 ? 1 : -1; // Alternate sides

      ctx.save();
      ctx.translate(side * size * 0.15, yPos);
      ctx.rotate(side * 0.3);

      // Bell flower (small oval with darker top)
      const bellGradient = ctx.createLinearGradient(0, -bellSize, 0, bellSize * 0.3);
      bellGradient.addColorStop(0, particle.color);
      bellGradient.addColorStop(0.6, particle.color);
      bellGradient.addColorStop(1, `${particle.color}CC`); // Slightly darker at bottom
      ctx.fillStyle = bellGradient;

      // Bell shape (elongated oval, wider at bottom)
      ctx.beginPath();
      ctx.ellipse(0, 0, bellSize * 0.4, bellSize, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bell opening (darker rim)
      ctx.strokeStyle = `${particle.color}AA`;
      ctx.lineWidth = bellSize * 0.1;
      ctx.beginPath();
      ctx.ellipse(0, bellSize * 0.7, bellSize * 0.35, bellSize * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Small stamen (thin line protruding from bell)
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = bellSize * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, bellSize * 0.8);
      ctx.lineTo(0, bellSize * 1.1);
      ctx.stroke();

      ctx.restore();
    }

    // Small leaves at base (green-grey)
    ctx.fillStyle = '#6b8b6b';
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, size * 0.5, size * 0.1, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  },

  /**
   * Draw thistle (Scottish thistle with realistic spiky bracts)
   */
  drawThistle(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Stem (woody, slightly curved)
    ctx.strokeStyle = '#5a704a';
    ctx.lineWidth = size * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, size * 2);
    ctx.quadraticCurveTo(size * 0.1, size * 1.2, 0, size * 0.5);
    ctx.stroke();

    // Spiky bracts (green spiny base around flower head)
    const bractCount = 16;
    ctx.strokeStyle = '#4a7a3a';
    ctx.fillStyle = '#5a8a4a';
    ctx.lineWidth = size * 0.06;
    ctx.lineCap = 'round';

    for (let i = 0; i < bractCount; i++) {
      const angle = (i / bractCount) * Math.PI * 2;
      const bractLength = size * (0.35 + Math.random() * 0.15);
      const bendAngle = angle + (Math.random() - 0.5) * 0.3;

      // Bract spine (sharp and pointed)
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.2);

      // Curved spiky bract
      const controlX = size * 0.15;
      const controlY = -size * 0.3;
      const endX = Math.sin(0.4) * bractLength;
      const endY = -Math.cos(0.4) * bractLength - size * 0.2;

      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();

      // Tiny spines along bract edge
      for (let j = 0; j < 3; j++) {
        const t = (j + 1) / 4;
        const spineX = t * endX;
        const spineY = -size * 0.2 + t * (endY + size * 0.2);
        ctx.beginPath();
        ctx.moveTo(spineX, spineY);
        ctx.lineTo(spineX + size * 0.08, spineY - size * 0.06);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Flower head base (bulbous receptacle)
    ctx.fillStyle = '#6a8a5a';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.15, size * 0.28, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flower petals (white or blue - Scottish Saltire colors)
    const petalLayers = 3;
    const petalColors = particle.petalColors || ['#9b59b6', '#b980d1', '#d4a5e3']; // Fallback to purple

    for (let layer = 0; layer < petalLayers; layer++) {
      const layerRadius = size * (0.25 + layer * 0.08);
      const petalCount = 8 + layer * 4;
      const layerColor = petalColors[layer];

      ctx.fillStyle = layerColor;

      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + layer * 0.15;
        const petalX = Math.cos(angle) * layerRadius;
        const petalY = Math.sin(angle) * layerRadius - size * 0.15;

        // Thin wispy petal
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size * (0.2 + layer * 0.05));
        ctx.lineWidth = size * 0.02;
        ctx.strokeStyle = layerColor;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Serrated leaves (2-3 along stem with spiny edges)
    ctx.fillStyle = '#4a6a3a';
    ctx.strokeStyle = '#3a5a2a';
    ctx.lineWidth = 1;

    for (let i = 0; i < 2; i++) {
      const leafY = size * (0.8 + i * 0.6);
      const leafSide = i % 2 === 0 ? 1 : -1;

      ctx.save();
      ctx.translate(0, leafY);

      // Leaf base shape with deep serrations
      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Create deeply lobed, spiny leaf edge
      const lobes = 5;
      const depth = size * 0.15;  // Moved outside loop so it's accessible below

      for (let j = 0; j <= lobes; j++) {
        const t = j / lobes;
        const leafWidth = size * 0.25 * Math.sin(t * Math.PI);

        if (j < lobes) {
          // Deep cut between lobes
          ctx.lineTo(leafSide * leafWidth * 0.3, -depth * t);
          // Sharp spine point
          ctx.lineTo(leafSide * (leafWidth + size * 0.08), -depth * (t + 0.05));
          ctx.lineTo(leafSide * leafWidth * 0.7, -depth * (t + 0.1));
        } else {
          ctx.lineTo(0, -depth);
        }
      }

      // Return path (smooth inner edge)
      ctx.quadraticCurveTo(leafSide * size * 0.05, -depth * 0.5, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leaf vein
      ctx.strokeStyle = '#2a4a1a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -depth);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  },

  /**
   * Draw thistle plant (ground decoration)
   */
  drawThistlePlant(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Gentle sway
    const sway = Math.sin(time * 0.001 + particle.swayPhase) * 0.1;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(sway);

    // Multiple stems
    for (let stem = 0; stem < 3; stem++) {
      const stemX = (stem - 1) * size * 0.4;
      const stemHeight = size * (1.5 + stem * 0.3);

      // Stem
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = size * 0.1;
      ctx.beginPath();
      ctx.moveTo(stemX, 0);
      ctx.quadraticCurveTo(stemX + sway * size, -stemHeight * 0.5, stemX, -stemHeight);
      ctx.stroke();

      // Flower head
      ctx.fillStyle = '#8B008B';
      ctx.beginPath();
      ctx.arc(stemX, -stemHeight, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Spikes
      const spikeCount = 8;
      ctx.strokeStyle = '#8B008B';
      ctx.lineWidth = size * 0.05;
      for (let i = 0; i < spikeCount; i++) {
        const angle = (i / spikeCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(stemX, -stemHeight);
        ctx.lineTo(
          stemX + Math.cos(angle) * size * 0.6,
          -stemHeight + Math.sin(angle) * size * 0.6
        );
        ctx.stroke();
      }
    }

    ctx.restore();
  },

  /**
   * Draw bagpiper
   */
  drawBagpiper(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    const marchPhase = Math.sin(time * 0.015 + particle.marchPhase) * (Math.PI / 6);

    // Legs (marching)
    ctx.strokeStyle = '#000080'; // Navy blue kilt
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, size * 0.6);
    ctx.lineTo(-size * 0.3, size * 1.4 + Math.sin(marchPhase) * size * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.6);
    ctx.lineTo(size * 0.3, size * 1.4 + Math.sin(marchPhase + Math.PI) * size * 0.15);
    ctx.stroke();

    // Kilt (tartan pattern suggested)
    ctx.fillStyle = '#000080';
    ctx.fillRect(-size * 0.45, size * 0.2, size * 0.9, size * 0.5);

    // Sporran (decorative pouch)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-size * 0.25, size * 0.5, size * 0.5, size * 0.25);

    // Body (red tunic)
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(-size * 0.4, -size * 0.2, size * 0.8, size * 0.5);

    // Arms (holding bagpipes)
    ctx.strokeStyle = '#FFD7BA';
    ctx.lineWidth = size * 0.12;
    // Left arm
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, 0);
    ctx.lineTo(-size * 0.6, size * 0.3);
    ctx.stroke();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(size * 0.3, 0);
    ctx.lineTo(size * 0.7, size * 0.2);
    ctx.stroke();

    // Bagpipes
    ctx.fillStyle = '#654321';
    // Bag
    ctx.beginPath();
    ctx.ellipse(size * 0.1, size * 0.25, size * 0.35, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pipes (drones)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.moveTo(size * 0.15, size * 0.05);
    ctx.lineTo(size * 0.15, -size * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.1);
    ctx.lineTo(size * 0.3, -size * 0.6);
    ctx.stroke();
    // Chanter (melody pipe)
    ctx.beginPath();
    ctx.moveTo(size * 0.55, size * 0.2);
    ctx.lineTo(size * 0.65, size * 0.7);
    ctx.stroke();

    // Head
    ctx.fillStyle = '#FFD7BA';
    ctx.beginPath();
    ctx.arc(0, -size * 0.45, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Glengarry (Scottish cap)
    ctx.fillStyle = '#000080';
    ctx.fillRect(-size * 0.4, -size * 0.8, size * 0.8, size * 0.15);
    ctx.beginPath();
    ctx.moveTo(-size * 0.35, -size * 0.8);
    ctx.lineTo(0, -size * 1.1);
    ctx.lineTo(size * 0.35, -size * 0.8);
    ctx.closePath();
    ctx.fill();

    // Feather plume
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.1);
    ctx.quadraticCurveTo(size * 0.2, -size * 1.3, size * 0.3, -size * 1.4);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw Saltire flag (white X on blue)
   */
  drawSaltireFlag(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    // Wave effect
    const wavePhase = time * 0.002 + particle.waveOffset;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Flagpole
    ctx.fillStyle = '#654321';
    ctx.fillRect(-size * 0.05, 0, size * 0.1, size * 1.5);

    // Flag (waving)
    const segments = 10;
    const flagWidth = size * 1.2;
    const flagHeight = size * 0.8;

    ctx.fillStyle = '#0065BD'; // Scottish blue

    for (let i = 0; i < segments; i++) {
      const segmentWidth = flagWidth / segments;
      const x1 = i * segmentWidth;
      const x2 = (i + 1) * segmentWidth;
      const wave1 = Math.sin(wavePhase + i * 0.3) * size * 0.1;
      const wave2 = Math.sin(wavePhase + (i + 1) * 0.3) * size * 0.1;

      ctx.beginPath();
      ctx.moveTo(x1, wave1);
      ctx.lineTo(x2, wave2);
      ctx.lineTo(x2, flagHeight + wave2);
      ctx.lineTo(x1, flagHeight + wave1);
      ctx.closePath();
      ctx.fill();
    }

    // White X (Saltire)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = size * 0.12;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 5;

    // Draw X with wave
    for (let i = 0; i < segments; i++) {
      const segmentWidth = flagWidth / segments;
      const x1 = i * segmentWidth;
      const x2 = (i + 1) * segmentWidth;
      const wave1 = Math.sin(wavePhase + i * 0.3) * size * 0.1;
      const wave2 = Math.sin(wavePhase + (i + 1) * 0.3) * size * 0.1;

      // Top-left to bottom-right
      ctx.beginPath();
      ctx.moveTo(x1, wave1);
      ctx.lineTo(x2, flagHeight + wave2);
      ctx.stroke();

      // Bottom-left to top-right
      ctx.beginPath();
      ctx.moveTo(x1, flagHeight + wave1);
      ctx.lineTo(x2, wave2);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  },

  /**
   * Draw saltire sparkle
   */
  drawSaltireSparkle(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const twinkle = 0.6 + Math.sin(time * 0.004 + particle.twinklePhase) * 0.4;

    ctx.save();
    ctx.globalAlpha = particle.opacity * twinkle;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Draw 4-pointed sparkle (Scottish blue or white)
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
   * Draw authentic Scottish tartan pattern (Stewart/Royal Stewart style)
   */
  drawTartanPattern(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Create authentic tartan weave pattern
    const patternSize = 120; // Smaller repeating unit
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const pCtx = patternCanvas.getContext('2d');

    // Royal Stewart tartan colors
    const NAVY = '#1a237e';
    const RED = '#c62828';
    const FOREST = '#1b5e20';
    const YELLOW = '#f9a825';
    const WHITE = '#ffffff';
    const BLACK = '#000000';

    // Tartan stripe sequence (width, color) - authentic Royal Stewart pattern
    const stripeSequence = [
      [4, RED], [2, BLACK], [2, RED], [2, BLACK], [4, RED],
      [8, NAVY], [2, BLACK], [2, NAVY], [2, BLACK], [8, NAVY],
      [2, FOREST], [2, YELLOW], [2, FOREST],
      [8, NAVY], [2, BLACK], [2, NAVY], [2, BLACK], [8, NAVY],
      [4, RED], [2, BLACK], [2, RED], [2, BLACK], [4, RED]
    ];

    // Draw horizontal stripes
    let ypos = 0;
    for (let i = 0; i < 2; i++) { // Repeat pattern twice
      for (const [width, color] of stripeSequence) {
        pCtx.fillStyle = color;
        pCtx.fillRect(0, ypos, patternSize, width);
        ypos += width;
      }
    }

    // Draw vertical stripes with blending (creates the weave effect)
    pCtx.globalCompositeOperation = 'multiply';
    pCtx.globalAlpha = 0.8;

    let xpos = 0;
    for (let i = 0; i < 2; i++) { // Repeat pattern twice
      for (const [width, color] of stripeSequence) {
        pCtx.fillStyle = color;
        pCtx.fillRect(xpos, 0, width, patternSize);
        xpos += width;
      }
    }

    // Add white highlights (creates tartan shine)
    pCtx.globalCompositeOperation = 'lighten';
    pCtx.globalAlpha = 0.15;
    xpos = 0;
    for (let i = 0; i < 2; i++) {
      for (const [width, color] of stripeSequence) {
        if (color === YELLOW || color === WHITE) {
          pCtx.fillStyle = WHITE;
          pCtx.fillRect(xpos, 0, width, patternSize);
        }
        xpos += width;
      }
    }

    // Reset composite operation
    pCtx.globalCompositeOperation = 'source-over';
    pCtx.globalAlpha = 1;

    // Draw the tartan pattern (tiled)
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    // Fabric edge (darker border to show it's fabric)
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = size * 0.03;
    ctx.strokeRect(-size / 2, -size / 2, size, size);

    // Inner decorative border (silver/white tartan trim)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = size * 0.015;
    ctx.strokeRect(-size / 2 + size * 0.04, -size / 2 + size * 0.04,
                    size - size * 0.08, size - size * 0.08);

    // Fabric texture overlay (subtle diagonal lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = -size; i < size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(-size / 2 + i, -size / 2);
      ctx.lineTo(-size / 2 + i + size, size / 2);
      ctx.stroke();
    }

    // Silver thistle brooch in corner (holds the tartan)
    ctx.save();
    ctx.translate(-size * 0.35, -size * 0.35);

    // Brooch circle (silver)
    ctx.fillStyle = '#c0c0c0';
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Thistle emblem on brooch
    ctx.scale(0.06, 0.06);
    ctx.fillStyle = '#8B008B';
    ctx.strokeStyle = '#6A006A';
    ctx.lineWidth = 2;

    // Stylized thistle flower
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4);
      ctx.stroke();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore();
  },

  /**
   * Draw Highland scene silhouette (mountains, castle, loch)
   */
  drawHighlandScene(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Sky gradient (misty blue)
    const skyGradient = ctx.createLinearGradient(0, -size, 0, size * 0.5);
    skyGradient.addColorStop(0, '#4a7ba7');
    skyGradient.addColorStop(1, '#b0c4de');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(-size, -size, size * 2, size * 1.5);

    // Distant mountains (layered)
    ctx.fillStyle = 'rgba(80, 100, 130, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-size, size * 0.3);
    ctx.lineTo(-size * 0.6, -size * 0.3);
    ctx.lineTo(-size * 0.2, size * 0.1);
    ctx.lineTo(size * 0.2, -size * 0.5);
    ctx.lineTo(size * 0.6, size * 0.2);
    ctx.lineTo(size, size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Closer mountains (darker)
    ctx.fillStyle = 'rgba(60, 80, 100, 0.8)';
    ctx.beginPath();
    ctx.moveTo(-size, size * 0.4);
    ctx.lineTo(-size * 0.7, size * 0.1);
    ctx.lineTo(-size * 0.3, -size * 0.1);
    ctx.lineTo(size * 0.1, -size * 0.2);
    ctx.lineTo(size * 0.5, size * 0.15);
    ctx.lineTo(size, size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Highland castle silhouette (on hill)
    ctx.fillStyle = '#2a3a4a';

    // Castle base
    ctx.fillRect(-size * 0.15, size * 0.25, size * 0.3, size * 0.2);

    // Castle tower (left)
    ctx.fillRect(-size * 0.2, size * 0.15, size * 0.1, size * 0.15);

    // Castle tower (right)
    ctx.fillRect(size * 0.1, size * 0.15, size * 0.1, size * 0.15);

    // Central keep (tall)
    ctx.fillRect(-size * 0.06, size * 0.05, size * 0.12, size * 0.25);

    // Battlements
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(-size * 0.06 + i * size * 0.06, size * 0.02, size * 0.03, size * 0.03);
      }
    }

    // Loch (water) at bottom
    const lochGradient = ctx.createLinearGradient(0, size * 0.45, 0, size * 0.6);
    lochGradient.addColorStop(0, '#1e3a5f');
    lochGradient.addColorStop(1, '#0a1f3d');
    ctx.fillStyle = lochGradient;
    ctx.fillRect(-size, size * 0.45, size * 2, size * 0.15);

    // Reflection in loch (simplified)
    ctx.globalAlpha = particle.opacity * 0.3;
    ctx.fillStyle = '#4a6a8a';
    ctx.fillRect(-size * 0.15, size * 0.48, size * 0.3, size * 0.08);

    // Mist over loch
    ctx.globalAlpha = particle.opacity * 0.2;
    ctx.fillStyle = '#d0e0f0';
    ctx.fillRect(-size, size * 0.5, size * 2, size * 0.05);

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
    const twinkleIntensity = 0.5 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;

    // Scottish blue and white color scheme
    const starColor = `rgba(200, 220, 255, ${twinkleIntensity})`;
    const glowColor = `rgba(150, 180, 255, ${twinkleIntensity * 0.4})`;

    ctx.save();
    ctx.translate(x, y);

    // Outer glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = size * 3 * twinkleIntensity;
    ctx.fillStyle = starColor;

    // Draw 4-pointed star
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

    // Bright center
    ctx.shadowBlur = size * 2 * twinkleIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};
