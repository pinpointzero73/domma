/**
 * St George's Day Theme for Domma Celebrations
 * (April 23rd, English Celebration)
 *
 * Features:
 * - Rose petals (red and white - English colors)
 * - English roses blooming
 * - St George's Cross (red cross on white)
 * - Knight silhouette (St George)
 * - Dragon (medieval European style)
 * - Shield and sword imagery
 * - Red and white color scheme with gold accents
 */

export default {
  name: 'st-georges',
  displayName: 'St George\'s Day',
  emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',

  // Intensity configurations
  intensityConfig: {
    light: {
      count: 40,
      speedRange: [0.3, 1.0],
      sizeRange: [2, 4],
      roses: 3,
      knightChance: 0.0002,
      twinklingStars: 10
    },
    medium: {
      count: 80,
      speedRange: [0.4, 1.3],
      sizeRange: [2, 5],
      roses: 5,
      knightChance: 0.0004,
      twinklingStars: 18
    },
    heavy: {
      count: 120,
      speedRange: [0.5, 1.6],
      sizeRange: [3, 6],
      roses: 8,
      knightChance: 0.0006,
      twinklingStars: 25
    }
  },

  particles: ['tudor-rose', 'oak-leaf', 'crown', 'sparkle'],
  decorations: ['english-rose', 'st-georges-cross', 'knight', 'dragon', 'shield', 'castle','twinkling-star'],
  colors: {
    primary: '#C8102E',    // English red
    secondary: '#FFFFFF',  // White
    tertiary: '#012169',   // English blue (from Union Jack)
    accent: '#FFD700',     // Gold
    greenStem: '#228B22'   // Rose stem
  },

  /**
   * Create Tudor Rose particle (red and white layered rose)
   */
  createTudorRose(canvasWidth, canvasHeight, config) {
    return {
      type: 'tudor-rose',
      x: Math.random() * canvasWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 0.3, // Side-to-side drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
      opacity: 0.8 + Math.random() * 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      petalCount: 5, // Tudor rose has 5 petals
      active: true
    };
  },

  /**
   * Create Oak Leaf particle (English oak - national tree)
   */
  createOakLeaf(canvasWidth, canvasHeight, config) {
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.6) {
      color = '#2d5016'; // 60% dark green
    } else if (colorChoice < 0.85) {
      color = '#6b8e23'; // 25% olive green
    } else {
      color = '#8b4513'; // 15% autumn brown
    }

    return {
      type: 'oak-leaf',
      x: Math.random() * canvasWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 0.4, // Side-to-side drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.8,
      opacity: 0.75 + Math.random() * 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: color,
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.03 + Math.random() * 0.02,
      active: true
    };
  },

  /**
   * Create Royal Crown particle (English monarchy symbol)
   */
  createCrown(canvasWidth, canvasHeight, config) {
    return {
      type: 'crown',
      x: Math.random() * canvasWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 0.25, // Slow side-to-side drift
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.6,
      opacity: 0.85 + Math.random() * 0.15,
      rotation: Math.random() * 0.3 - 0.15, // Slight tilt only
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      glint: Math.random() * Math.PI * 2,
      glintSpeed: 0.02,
      active: true
    };
  },

  /**
   * Create English rose decoration (blooming flower)
   */
  createEnglishRose(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'english-rose',
      x: options.x !== undefined ? options.x : Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1,
      y: options.y !== undefined ? options.y : canvasHeight - 60 - Math.random() * 100,
      size: 15 + Math.random() * 10,
      opacity: 1,
      color: Math.random() < 0.7 ? '#C8102E' : '#FFFFFF', // 70% red, 30% white
      bloomPhase: Math.random() * Math.PI * 2,
      petalCount: 8 + Math.floor(Math.random() * 5),
      active: true,
      static: true
    };
  },

  /**
   * Create St George's Cross flag decoration
   */
  createStGeorgesCross(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'st-georges-cross',
      x: options.x !== undefined ? options.x : canvasWidth * 0.1 + Math.random() * canvasWidth * 0.8,
      y: options.y !== undefined ? options.y : 50 + Math.random() * 100,
      size: 40 + Math.random() * 20,
      opacity: 1,
      waveOffset: Math.random() * Math.PI * 2,
      waveSpeed: 0.001 + Math.random() * 0.001,
      active: true,
      static: true
    };
  },

  /**
   * Create knight (St George) decoration
   */
  createKnight(canvasWidth, canvasHeight) {
    const fromLeft = Math.random() < 0.5;
    return {
      type: 'knight',
      x: fromLeft ? -80 : canvasWidth + 80,
      y: canvasHeight - 50,
      baseY: canvasHeight - 50,
      vx: fromLeft ? 0.8 + Math.random() * 0.4 : -(0.8 + Math.random() * 0.4),
      size: 20 + Math.random() * 10,
      opacity: 1,
      marchPhase: Math.random() * Math.PI * 2,
      marchSpeed: 0.015,
      active: true,
      static: false
    };
  },

  /**
   * Create dragon decoration (medieval European style)
   */
  createDragon(canvasWidth, canvasHeight, options = {}) {
    const fromLeft = Math.random() < 0.5;
    return {
      type: 'dragon',
      x: fromLeft ? -100 : canvasWidth + 100,
      y: canvasHeight * 0.3 + Math.random() * canvasHeight * 0.2,
      baseY: canvasHeight * 0.3 + Math.random() * canvasHeight * 0.2,
      vx: fromLeft ? 1.5 + Math.random() * 0.5 : -(1.5 + Math.random() * 0.5),
      size: 30 + Math.random() * 15,
      opacity: 1,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.012,
      breatheFirePhase: Math.random() * Math.PI * 2,
      active: true,
      static: false
    };
  },

  /**
   * Create shield decoration (with St George's Cross)
   */
  createShield(canvasWidth, canvasHeight, options = {}) {
    return {
      type: 'shield',
      x: options.x !== undefined ? options.x : canvasWidth * 0.2 + Math.random() * canvasWidth * 0.6,
      y: options.y !== undefined ? options.y : canvasHeight - 80 - Math.random() * 150,
      size: 20 + Math.random() * 10,
      opacity: 1,
      rotation: -Math.PI / 12 + Math.random() * (Math.PI / 6),
      glintPhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    };
  },

  /**
   * Create initial static decorations
   */
  createInitialDecorations(canvasWidth, canvasHeight, config) {
    const decorations = [];

    // Castle (left side)
    decorations.push({
      type: 'castle',
      x: 150,
      y: canvasHeight - 100,
      size: 80 + Math.random() * 20,
      opacity: 1,
      active: true,
      static: true
    });

    // Static dragon (perched on castle or ground, right side)
    decorations.push({
      type: 'dragon',
      x: canvasWidth - 200,
      y: canvasHeight - 60,
      baseY: canvasHeight - 60,
      vx: 0, // Static, not moving
      size: 25 + Math.random() * 10,
      opacity: 1,
      time: 0,
      wingPhase: Math.random() * Math.PI * 2,
      breathePhase: Math.random() * Math.PI * 2,
      active: true,
      static: true
    });

    // Knight on steed (center-left, facing dragon)
    decorations.push({
      type: 'knight',
      x: canvasWidth * 0.4,
      y: canvasHeight - 45,
      baseY: canvasHeight - 45,
      vx: 0, // Static, mounted and ready
      size: 20 + Math.random() * 5,
      opacity: 1,
      time: 0,
      legPhase: 0, // Standing still
      weaponRaised: true, // Lance raised toward dragon
      active: true,
      static: true
    });

    // St George's Cross flags on castle
    decorations.push(this.createStGeorgesCross(canvasWidth, canvasHeight, {
      x: 150,
      y: canvasHeight - 180,
      size: 30
    }));

    // Shields displayed (decorative)
    decorations.push(this.createShield(canvasWidth, canvasHeight, {
      x: canvasWidth * 0.15,
      y: canvasHeight - 60
    }));

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
   * Spawn special St George's particles
   */
  spawnSpecialParticle(specialParticles, canvasWidth, canvasHeight, config) {
    const choice = Math.random();

    // Knight (very rare, max 1)
    if (choice < config.knightChance) {
      if (specialParticles.some(p => p.type === 'knight')) {
        return null;
      }
      return this.createKnight(canvasWidth, canvasHeight);
    }

    // Dragon (very rare, max 1)
    if (choice < config.knightChance * 1.2) {
      if (specialParticles.some(p => p.type === 'dragon')) {
        return null;
      }
      return this.createDragon(canvasWidth, canvasHeight);
    }

    // English rose (rare)
    if (choice < 0.0005) {
      const roseCount = specialParticles.filter(p => p.type === 'english-rose').length;
      if (roseCount < config.roses) {
        return this.createEnglishRose(canvasWidth, canvasHeight);
      }
    }

    // St George's Cross flag (rare, max 2)
    if (choice < 0.0003) {
      const flagCount = specialParticles.filter(p => p.type === 'st-georges-cross').length;
      if (flagCount < 2) {
        return this.createStGeorgesCross(canvasWidth, canvasHeight);
      }
    }

    // Shield (rare, max 3)
    if (choice < 0.0004) {
      const shieldCount = specialParticles.filter(p => p.type === 'shield').length;
      if (shieldCount < 3) {
        return this.createShield(canvasWidth, canvasHeight);
      }
    }

    return null;
  },

  /**
   * Draw rose petal
   */
  drawRosePetal(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const sway = Math.sin(particle.sway) * size * 0.3;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x + sway, y);
    ctx.rotate(particle.rotation);

    // Petal shape (teardrop/oval)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = particle.color === '#FFFFFF' ? '#FFE6E6' : '#8B0000';
    ctx.lineWidth = size * 0.1;

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.bezierCurveTo(
      size * 0.5, -size * 0.3,
      size * 0.5, size * 0.3,
      0, size * 0.5
    );
    ctx.bezierCurveTo(
      -size * 0.5, size * 0.3,
      -size * 0.5, -size * 0.3,
      0, -size * 0.5
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central vein
    ctx.strokeStyle = particle.color === '#FFFFFF' ? '#FFB6C1' : '#600000';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.4);
    ctx.lineTo(0, size * 0.4);
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw English rose (blooming flower)
   */
  drawEnglishRose(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const bloom = 0.8 + (Math.sin(time * 0.002 + particle.bloomPhase) + 1) * 0.1;

    ctx.save();
    ctx.translate(x, y);

    // Stem
    ctx.strokeStyle = this.colors.greenStem;
    ctx.lineWidth = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      -size * 0.2, size * 0.8,
      0, size * 1.5
    );
    ctx.stroke();

    // Leaves
    ctx.fillStyle = '#2D5016';
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.translate(side * size * 0.15, size * 0.8);
      ctx.rotate(side * Math.PI / 6);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Rose petals (layered circular pattern)
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = particle.color === '#FFFFFF' ? '#FFE6E6' : '#8B0000';
    ctx.lineWidth = 1;

    // Outer layer
    for (let i = 0; i < particle.petalCount; i++) {
      const angle = (i / particle.petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.4 * bloom);

      ctx.beginPath();
      ctx.moveTo(0, size * 0.25);
      ctx.bezierCurveTo(
        -size * 0.25, -size * 0.1,
        -size * 0.15, -size * 0.35,
        0, -size * 0.25
      );
      ctx.bezierCurveTo(
        size * 0.15, -size * 0.35,
        size * 0.25, -size * 0.1,
        0, size * 0.25
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Inner layer (offset rotation)
    ctx.globalAlpha = 0.9;
    for (let i = 0; i < particle.petalCount - 2; i++) {
      const angle = (i / (particle.petalCount - 2)) * Math.PI * 2 + (Math.PI / particle.petalCount);
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -size * 0.25 * bloom);

      ctx.beginPath();
      ctx.moveTo(0, size * 0.15);
      ctx.bezierCurveTo(
        -size * 0.15, -size * 0.05,
        -size * 0.1, -size * 0.2,
        0, -size * 0.15
      );
      ctx.bezierCurveTo(
        size * 0.1, -size * 0.2,
        size * 0.15, -size * 0.05,
        0, size * 0.15
      );
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Center (yellow stamens)
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15 * bloom, 0, Math.PI * 2);
    ctx.fill();

    // Stamen dots
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = size * 0.08 * bloom;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        size * 0.03,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw St George's Cross flag (redesigned)
   */
  drawStGeorgesCross(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const waveOffset = time * particle.waveSpeed + particle.waveOffset;

    ctx.save();
    ctx.translate(x, y);

    // ===== FLAGPOLE (wooden with grain detail) =====
    const poleGradient = ctx.createLinearGradient(-size * 0.64, 0, -size * 0.56, 0);
    poleGradient.addColorStop(0, '#5a4a3a');
    poleGradient.addColorStop(0.5, '#8B4513');
    poleGradient.addColorStop(1, '#6a5343');
    ctx.fillStyle = poleGradient;
    ctx.fillRect(-size * 0.64, -size * 0.35, size * 0.08, size * 1.9);

    // Pole edge highlight
    ctx.strokeStyle = '#9a6333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.64, -size * 0.35);
    ctx.lineTo(-size * 0.64, size * 1.55);
    ctx.stroke();

    // Pole shadow
    ctx.strokeStyle = '#3a2a1a';
    ctx.beginPath();
    ctx.moveTo(-size * 0.56, -size * 0.35);
    ctx.lineTo(-size * 0.56, size * 1.55);
    ctx.stroke();

    // Gold finial (decorative top)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-size * 0.6, -size * 0.4, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ===== FLAG FABRIC (smooth wave, proper cross) =====
    const flagWidth = size * 1.5;
    const flagHeight = size * 1.0;
    const verticalStripes = 12; // More stripes for smoother wave

    // Draw flag in vertical strips with wave displacement
    for (let i = 0; i < verticalStripes; i++) {
      const stripX = -size * 0.5 + (i / verticalStripes) * flagWidth;
      const nextStripX = -size * 0.5 + ((i + 1) / verticalStripes) * flagWidth;
      const stripWidth = nextStripX - stripX;

      // Wave calculation for this strip
      const wave = Math.sin(waveOffset + i * 0.4) * size * 0.12;
      const nextWave = Math.sin(waveOffset + (i + 1) * 0.4) * size * 0.12;

      // Calculate if this strip is in the cross area
      const stripCenter = stripX + stripWidth / 2 + size * 0.5;
      const normalizedX = stripCenter / flagWidth; // 0 to 1

      const isVerticalBar = normalizedX > 0.4 && normalizedX < 0.6;

      ctx.save();

      // ===== WHITE BACKGROUND STRIP =====
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(stripX, -flagHeight / 2 + wave);
      ctx.lineTo(nextStripX, -flagHeight / 2 + nextWave);
      ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
      ctx.lineTo(stripX, flagHeight / 2 + wave);
      ctx.closePath();
      ctx.fill();

      // ===== RED CROSS STRIPS =====
      ctx.fillStyle = '#C8102E';

      // Vertical bar of cross (center strip)
      if (isVerticalBar) {
        ctx.beginPath();
        ctx.moveTo(stripX, -flagHeight / 2 + wave);
        ctx.lineTo(nextStripX, -flagHeight / 2 + nextWave);
        ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
        ctx.lineTo(stripX, flagHeight / 2 + wave);
        ctx.closePath();
        ctx.fill();
      }

      // Horizontal bar of cross (middle section of each strip)
      ctx.beginPath();
      ctx.moveTo(stripX, -flagHeight * 0.15 + wave);
      ctx.lineTo(nextStripX, -flagHeight * 0.15 + nextWave);
      ctx.lineTo(nextStripX, flagHeight * 0.15 + nextWave);
      ctx.lineTo(stripX, flagHeight * 0.15 + wave);
      ctx.closePath();
      ctx.fill();

      // ===== FABRIC SHADING (alternating for depth) =====
      const shade = Math.sin(waveOffset + i * 0.4) * 0.15;
      if (shade > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${shade * 0.3})`;
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${-shade * 0.2})`;
      }
      ctx.beginPath();
      ctx.moveTo(stripX, -flagHeight / 2 + wave);
      ctx.lineTo(nextStripX, -flagHeight / 2 + nextWave);
      ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
      ctx.lineTo(stripX, flagHeight / 2 + wave);
      ctx.closePath();
      ctx.fill();

      // Strip edge line (fabric texture)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(nextStripX, -flagHeight / 2 + nextWave);
      ctx.lineTo(nextStripX, flagHeight / 2 + nextWave);
      ctx.stroke();

      ctx.restore();
    }

    // ===== FLAG BORDER (subtle outline) =====
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Top edge
    ctx.moveTo(-size * 0.5, -flagHeight / 2 + Math.sin(waveOffset) * size * 0.12);
    for (let i = 1; i <= verticalStripes; i++) {
      const stripX = -size * 0.5 + (i / verticalStripes) * flagWidth;
      const wave = Math.sin(waveOffset + i * 0.4) * size * 0.12;
      ctx.lineTo(stripX, -flagHeight / 2 + wave);
    }
    // Right edge
    ctx.lineTo(
      -size * 0.5 + flagWidth,
      flagHeight / 2 + Math.sin(waveOffset + verticalStripes * 0.4) * size * 0.12
    );
    // Bottom edge
    for (let i = verticalStripes; i >= 0; i--) {
      const stripX = -size * 0.5 + (i / verticalStripes) * flagWidth;
      const wave = Math.sin(waveOffset + i * 0.4) * size * 0.12;
      ctx.lineTo(stripX, flagHeight / 2 + wave);
    }
    // Left edge (back to pole)
    ctx.closePath();
    ctx.stroke();

    // ===== HOIST ATTACHMENT (flag grommets) =====
    ctx.fillStyle = '#A9A9A9'; // Metal grommets
    for (let i = 0; i < 3; i++) {
      const yPos = -flagHeight / 2 + (i / 2) * flagHeight;
      const wave = Math.sin(waveOffset) * size * 0.12;
      ctx.beginPath();
      ctx.arc(-size * 0.48, yPos + wave, size * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw knight (St George)
   */
  drawKnight(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;
    const marchPhase = Math.sin(time * particle.marchSpeed + particle.marchPhase) * (Math.PI / 8);

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Legs (marching)
    ctx.strokeStyle = '#C0C0C0'; // Silver armor
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, size * 0.5);
    ctx.lineTo(-size * 0.2, size * 1.2 + Math.sin(marchPhase) * size * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.15, size * 0.5);
    ctx.lineTo(size * 0.2, size * 1.2 + Math.sin(marchPhase + Math.PI) * size * 0.15);
    ctx.stroke();

    // Boots
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(-size * 0.25, size * 1.15, size * 0.2, size * 0.2);
    ctx.fillRect(size * 0.05, size * 1.15, size * 0.2, size * 0.2);

    // Body (chainmail/armor)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(-size * 0.4, 0, size * 0.8, size * 0.6);

    // Surcoat (white with red cross)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-size * 0.35, size * 0.05, size * 0.7, size * 0.5);

    // Red cross on surcoat
    ctx.fillStyle = '#C8102E';
    ctx.fillRect(-size * 0.1, size * 0.05, size * 0.2, size * 0.5); // Vertical
    ctx.fillRect(-size * 0.35, size * 0.2, size * 0.7, size * 0.2); // Horizontal

    // Shield (left side)
    ctx.save();
    ctx.translate(-size * 0.5, size * 0.3);
    ctx.rotate(-Math.PI / 6);

    // Shield shape
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.4);
    ctx.lineTo(size * 0.25, -size * 0.3);
    ctx.lineTo(size * 0.25, size * 0.2);
    ctx.lineTo(0, size * 0.4);
    ctx.lineTo(-size * 0.25, size * 0.2);
    ctx.lineTo(-size * 0.25, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Red cross on shield
    ctx.fillStyle = '#C8102E';
    ctx.fillRect(-size * 0.05, -size * 0.3, size * 0.1, size * 0.6);
    ctx.fillRect(-size * 0.2, -size * 0.05, size * 0.4, size * 0.1);

    ctx.restore();

    // Sword (right side, raised)
    ctx.strokeStyle = '#708090';
    ctx.lineWidth = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(size * 0.4, -size * 0.2);
    ctx.lineTo(size * 0.6, -size * 0.8);
    ctx.stroke();

    // Sword crossguard
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size * 0.5, -size * 0.3);
    ctx.stroke();

    // Sword pommel
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.15, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Helmet
    ctx.fillStyle = '#708090';
    ctx.beginPath();
    ctx.arc(0, -size * 0.3, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Visor slot
    ctx.fillStyle = '#000000';
    ctx.fillRect(-size * 0.25, -size * 0.35, size * 0.5, size * 0.1);

    // Plume (red)
    ctx.fillStyle = '#C8102E';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.65);
    ctx.bezierCurveTo(
      -size * 0.15, -size * 0.85,
      -size * 0.1, -size * 1.0,
      0, -size * 0.95
    );
    ctx.bezierCurveTo(
      size * 0.1, -size * 1.0,
      size * 0.15, -size * 0.85,
      0, -size * 0.65
    );
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw dragon (medieval European style)
   */
  drawDragon(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const dir = particle.vx > 0 ? 1 : -1;
    const wingAngle = Math.sin(time * particle.wingSpeed + particle.wingPhase) * (Math.PI / 3);

    ctx.save();
    ctx.translate(x, y);
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // Wings (bat-like, dark green)
    ctx.fillStyle = '#2F4F2F';
    ctx.strokeStyle = '#1C3020';
    ctx.lineWidth = 2;

    // Left wing
    ctx.save();
    ctx.translate(-size * 0.3, -size * 0.2);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size * 0.4, -size * 0.3,
      -size * 0.6, -size * 0.2,
      -size * 0.7, 0
    );
    ctx.bezierCurveTo(
      -size * 0.6, size * 0.1,
      -size * 0.4, size * 0.05,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.translate(size * 0.3, -size * 0.2);
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      size * 0.4, -size * 0.3,
      size * 0.6, -size * 0.2,
      size * 0.7, 0
    );
    ctx.bezierCurveTo(
      size * 0.6, size * 0.1,
      size * 0.4, size * 0.05,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Body (serpentine, dark green)
    ctx.fillStyle = '#556B2F';
    ctx.strokeStyle = '#2F4F2F';
    ctx.lineWidth = 2;

    // Main body (oval)
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail (curved)
    ctx.strokeStyle = '#556B2F';
    ctx.lineWidth = size * 0.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, 0);
    ctx.quadraticCurveTo(
      -size * 0.8, size * 0.2,
      -size * 1.2, 0
    );
    ctx.stroke();

    // Tail spikes
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const tx = -size * 0.6 - i * size * 0.2;
      const ty = size * 0.1;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx, ty - size * 0.15);
      ctx.stroke();
    }

    // Neck
    ctx.fillStyle = '#556B2F';
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.1);
    ctx.lineTo(size * 0.5, -size * 0.4);
    ctx.lineTo(size * 0.5, -size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Head (reptilian)
    ctx.fillStyle = '#6B8E23';
    ctx.beginPath();
    ctx.ellipse(size * 0.65, -size * 0.35, size * 0.25, size * 0.2, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Snout
    ctx.beginPath();
    ctx.moveTo(size * 0.75, -size * 0.35);
    ctx.lineTo(size * 0.95, -size * 0.35);
    ctx.lineTo(size * 0.85, -size * 0.25);
    ctx.closePath();
    ctx.fill();

    // Horns
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    [size * 0.55, size * 0.65].forEach(hx => {
      ctx.beginPath();
      ctx.moveTo(hx, -size * 0.5);
      ctx.lineTo(hx, -size * 0.7);
      ctx.stroke();
    });

    // Eye (red, glowing)
    ctx.fillStyle = '#FF0000';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#FF0000';
    ctx.beginPath();
    ctx.arc(size * 0.7, -size * 0.4, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Fire breath (occasional)
    if (Math.sin(time * 0.005 + particle.breatheFirePhase) > 0.7) {
      const fireGradient = ctx.createLinearGradient(size * 0.95, -size * 0.35, size * 1.5, -size * 0.35);
      fireGradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
      fireGradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.5)');
      fireGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

      ctx.fillStyle = fireGradient;
      ctx.beginPath();
      ctx.moveTo(size * 0.95, -size * 0.35);
      ctx.lineTo(size * 1.5, -size * 0.45);
      ctx.lineTo(size * 1.5, -size * 0.25);
      ctx.closePath();
      ctx.fill();

      // Fire particles
      for (let i = 0; i < 5; i++) {
        const fx = size * 1.0 + Math.random() * size * 0.5;
        const fy = -size * 0.35 + (Math.random() - 0.5) * size * 0.3;
        ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, ${Math.random() * 0.8})`;
        ctx.beginPath();
        ctx.arc(fx, fy, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Belly scales
    ctx.fillStyle = '#9ACD32';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-size * 0.2 + i * size * 0.2, size * 0.1, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw shield with St George's Cross
   */
  drawShield(ctx, particle, time) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const glint = (Math.sin(time * 0.003 + particle.glintPhase) + 1) * 0.5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Shield outline (kite shield shape)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(size * 0.5, -size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.3);
    ctx.lineTo(0, size * 0.7);
    ctx.lineTo(-size * 0.5, size * 0.3);
    ctx.lineTo(-size * 0.5, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // St George's Cross
    ctx.fillStyle = '#C8102E';
    // Vertical bar
    ctx.fillRect(-size * 0.1, -size * 0.6, size * 0.2, size * 1.2);
    // Horizontal bar
    ctx.fillRect(-size * 0.45, -size * 0.1, size * 0.9, size * 0.2);

    // Metallic edge highlights
    ctx.strokeStyle = `rgba(255, 215, 0, ${glint * 0.8})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(size * 0.5, -size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.3);
    ctx.stroke();

    // Central boss (decorative)
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glint on boss
    ctx.fillStyle = `rgba(255, 255, 255, ${glint * 0.6})`;
    ctx.beginPath();
    ctx.arc(-size * 0.05, -size * 0.05, size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  /**
   * Draw English medieval castle (redesigned for visual impact)
   */
  drawCastle(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);

    // Define stone colors
    const stoneBase = '#9a958f';
    const stoneDark = '#6a655f';
    const stoneShadow = '#4a4540';
    const stoneHighlight = '#b5b0aa';

    // ===== MAIN KEEP (central rectangular tower) =====
    const keepWidth = size * 1.4;
    const keepHeight = size * 1.0;

    // Keep shadow (depth)
    ctx.fillStyle = stoneShadow;
    ctx.fillRect(-keepWidth / 2 + size * 0.05, -keepHeight + size * 0.05, keepWidth, keepHeight);

    // Keep base
    const keepGradient = ctx.createLinearGradient(-keepWidth / 2, -keepHeight, keepWidth / 2, -keepHeight);
    keepGradient.addColorStop(0, stoneDark);
    keepGradient.addColorStop(0.5, stoneBase);
    keepGradient.addColorStop(1, stoneDark);
    ctx.fillStyle = keepGradient;
    ctx.fillRect(-keepWidth / 2, -keepHeight, keepWidth, keepHeight);

    // Keep outline
    ctx.strokeStyle = stoneShadow;
    ctx.lineWidth = 2;
    ctx.strokeRect(-keepWidth / 2, -keepHeight, keepWidth, keepHeight);

    // Detailed stone blocks on keep
    ctx.strokeStyle = 'rgba(74, 69, 64, 0.4)';
    ctx.lineWidth = 1;
    const blockHeight = size * 0.12;
    const blockWidth = size * 0.18;
    for (let row = 0; row < 8; row++) {
      const yPos = -keepHeight + row * blockHeight;
      const offset = (row % 2) * (blockWidth / 2); // Staggered bricks
      for (let col = 0; col < 8; col++) {
        const xPos = -keepWidth / 2 + col * blockWidth + offset;
        ctx.strokeRect(xPos, yPos, blockWidth, blockHeight);
      }
    }

    // Keep battlements (larger, more detailed)
    ctx.fillStyle = stoneBase;
    const battlementWidth = size * 0.15;
    const battlementHeight = size * 0.12;
    for (let i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        const xPos = -keepWidth / 2 + i * (keepWidth / 8);
        // Merlon (raised part)
        ctx.fillRect(xPos, -keepHeight - battlementHeight, battlementWidth, battlementHeight);
        ctx.strokeRect(xPos, -keepHeight - battlementHeight, battlementWidth, battlementHeight);
        // Arrow slit in merlon
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(xPos + battlementWidth / 2 - size * 0.015, -keepHeight - battlementHeight + size * 0.02, size * 0.03, battlementHeight - size * 0.04);
        ctx.fillStyle = stoneBase;
      }
    }

    // ===== LEFT TOWER (round, larger) =====
    const towerRadius = size * 0.22;
    const towerHeight = size * 1.2;
    const leftTowerX = -size * 0.85;
    const leftTowerY = -towerHeight / 2;

    // Tower shadow
    ctx.fillStyle = stoneShadow;
    ctx.beginPath();
    ctx.ellipse(leftTowerX + size * 0.03, leftTowerY + size * 0.03, towerRadius, towerHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tower body with gradient
    const leftTowerGradient = ctx.createRadialGradient(leftTowerX - towerRadius * 0.3, leftTowerY, 0, leftTowerX, leftTowerY, towerRadius);
    leftTowerGradient.addColorStop(0, stoneHighlight);
    leftTowerGradient.addColorStop(0.5, stoneBase);
    leftTowerGradient.addColorStop(1, stoneDark);
    ctx.fillStyle = leftTowerGradient;
    ctx.beginPath();
    ctx.ellipse(leftTowerX, leftTowerY, towerRadius, towerHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = stoneShadow;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tower battlements (conical top)
    ctx.fillStyle = stoneBase;
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        const angle = (i / 6) * Math.PI;
        const xOffset = Math.cos(angle) * towerRadius;
        ctx.fillRect(leftTowerX + xOffset - size * 0.06, -towerHeight - size * 0.1, size * 0.12, size * 0.1);
        ctx.strokeRect(leftTowerX + xOffset - size * 0.06, -towerHeight - size * 0.1, size * 0.12, size * 0.1);
      }
    }

    // Tower windows (arrow slits)
    ctx.fillStyle = '#1a1510';
    for (let i = 0; i < 3; i++) {
      const yWin = leftTowerY - towerHeight * 0.2 + i * towerHeight * 0.25;
      ctx.fillRect(leftTowerX - size * 0.02, yWin, size * 0.04, size * 0.15);
      // Splay at bottom (wider inside)
      ctx.beginPath();
      ctx.moveTo(leftTowerX - size * 0.02, yWin + size * 0.15);
      ctx.lineTo(leftTowerX - size * 0.06, yWin + size * 0.18);
      ctx.lineTo(leftTowerX + size * 0.06, yWin + size * 0.18);
      ctx.lineTo(leftTowerX + size * 0.02, yWin + size * 0.15);
      ctx.fill();
    }

    // ===== RIGHT TOWER (round, larger) =====
    const rightTowerX = size * 0.85;

    // Tower shadow
    ctx.fillStyle = stoneShadow;
    ctx.beginPath();
    ctx.ellipse(rightTowerX + size * 0.03, leftTowerY + size * 0.03, towerRadius, towerHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tower body with gradient
    const rightTowerGradient = ctx.createRadialGradient(rightTowerX + towerRadius * 0.3, leftTowerY, 0, rightTowerX, leftTowerY, towerRadius);
    rightTowerGradient.addColorStop(0, stoneHighlight);
    rightTowerGradient.addColorStop(0.5, stoneBase);
    rightTowerGradient.addColorStop(1, stoneDark);
    ctx.fillStyle = rightTowerGradient;
    ctx.beginPath();
    ctx.ellipse(rightTowerX, leftTowerY, towerRadius, towerHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = stoneShadow;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tower battlements
    ctx.fillStyle = stoneBase;
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        const angle = (i / 6) * Math.PI;
        const xOffset = Math.cos(angle) * towerRadius;
        ctx.fillRect(rightTowerX + xOffset - size * 0.06, -towerHeight - size * 0.1, size * 0.12, size * 0.1);
        ctx.strokeRect(rightTowerX + xOffset - size * 0.06, -towerHeight - size * 0.1, size * 0.12, size * 0.1);
      }
    }

    // Tower windows
    ctx.fillStyle = '#1a1510';
    for (let i = 0; i < 3; i++) {
      const yWin = leftTowerY - towerHeight * 0.2 + i * towerHeight * 0.25;
      ctx.fillRect(rightTowerX - size * 0.02, yWin, size * 0.04, size * 0.15);
      ctx.beginPath();
      ctx.moveTo(rightTowerX - size * 0.02, yWin + size * 0.15);
      ctx.lineTo(rightTowerX - size * 0.06, yWin + size * 0.18);
      ctx.lineTo(rightTowerX + size * 0.06, yWin + size * 0.18);
      ctx.lineTo(rightTowerX + size * 0.02, yWin + size * 0.15);
      ctx.fill();
    }

    // ===== GATEWAY (impressive arched entrance) =====
    const gateWidth = size * 0.35;
    const gateHeight = size * 0.5;

    // Gateway arch recess (depth)
    ctx.fillStyle = stoneShadow;
    ctx.beginPath();
    ctx.moveTo(-gateWidth, -size * 0.05);
    ctx.lineTo(-gateWidth, -gateHeight);
    ctx.arc(0, -gateHeight, gateWidth, Math.PI, 0, false);
    ctx.lineTo(gateWidth, -size * 0.05);
    ctx.closePath();
    ctx.fill();

    // Gateway arch surround (stonework)
    ctx.strokeStyle = stoneDark;
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.arc(0, -gateHeight, gateWidth - size * 0.03, Math.PI, 0, false);
    ctx.stroke();

    // Decorative voussoirs (arch stones)
    ctx.strokeStyle = 'rgba(74, 69, 64, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const angle = Math.PI + (i / 8) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(0, -gateHeight);
      ctx.lineTo(Math.cos(angle) * gateWidth, -gateHeight + Math.sin(angle) * gateWidth);
      ctx.stroke();
    }

    // Gateway opening (dark)
    ctx.fillStyle = '#0a0a08';
    ctx.beginPath();
    ctx.moveTo(-gateWidth + size * 0.1, -size * 0.05);
    ctx.lineTo(-gateWidth + size * 0.1, -gateHeight + size * 0.05);
    ctx.arc(0, -gateHeight + size * 0.05, gateWidth - size * 0.1, Math.PI, 0, false);
    ctx.lineTo(gateWidth - size * 0.1, -size * 0.05);
    ctx.closePath();
    ctx.fill();

    // Portcullis (heavy iron bars)
    ctx.strokeStyle = '#2a2520';
    ctx.lineWidth = 4;
    const barCount = 7;
    for (let i = 0; i < barCount; i++) {
      const xBar = -gateWidth + size * 0.15 + (i / (barCount - 1)) * (gateWidth * 2 - size * 0.3);
      ctx.beginPath();
      ctx.moveTo(xBar, -size * 0.05);
      ctx.lineTo(xBar, -gateHeight + size * 0.15);
      ctx.stroke();
    }
    // Horizontal bars
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const yBar = -size * 0.1 - i * size * 0.12;
      ctx.beginPath();
      ctx.moveTo(-gateWidth + size * 0.15, yBar);
      ctx.lineTo(gateWidth - size * 0.15, yBar);
      ctx.stroke();
    }

    // ===== BUTTRESSES (structural supports) =====
    ctx.fillStyle = stoneDark;
    // Left buttress
    ctx.beginPath();
    ctx.moveTo(-keepWidth / 2, 0);
    ctx.lineTo(-keepWidth / 2 - size * 0.08, 0);
    ctx.lineTo(-keepWidth / 2 - size * 0.05, -keepHeight * 0.6);
    ctx.lineTo(-keepWidth / 2, -keepHeight * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = stoneShadow;
    ctx.stroke();

    // Right buttress
    ctx.beginPath();
    ctx.moveTo(keepWidth / 2, 0);
    ctx.lineTo(keepWidth / 2 + size * 0.08, 0);
    ctx.lineTo(keepWidth / 2 + size * 0.05, -keepHeight * 0.6);
    ctx.lineTo(keepWidth / 2, -keepHeight * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // ===== ST GEORGE'S CROSS FLAG =====
    ctx.save();
    ctx.translate(0, -towerHeight - size * 0.15);

    // Flagpole (wooden)
    const poleGradient = ctx.createLinearGradient(-size * 0.02, 0, size * 0.02, 0);
    poleGradient.addColorStop(0, '#5a4a3a');
    poleGradient.addColorStop(0.5, '#8b7355');
    poleGradient.addColorStop(1, '#5a4a3a');
    ctx.fillStyle = poleGradient;
    ctx.fillRect(-size * 0.02, 0, size * 0.04, -size * 0.45);
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 1;
    ctx.strokeRect(-size * 0.02, 0, size * 0.04, -size * 0.45);

    // Gold finial (decorative top)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -size * 0.45, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.stroke();

    // Flag (white with red St George's cross)
    const flagWidth = size * 0.4;
    const flagHeight = size * 0.25;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, -size * 0.42, flagWidth, flagHeight);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.strokeRect(0, -size * 0.42, flagWidth, flagHeight);

    // Red cross (St George)
    ctx.fillStyle = '#C8102E';
    // Vertical bar
    ctx.fillRect(flagWidth * 0.4, -size * 0.42, flagWidth * 0.2, flagHeight);
    // Horizontal bar
    ctx.fillRect(0, -size * 0.42 + flagHeight * 0.4, flagWidth, flagHeight * 0.2);

    ctx.restore();

    ctx.restore();
  },

  /**
   * Draw Tudor Rose (iconic English rose with 5 petals, red outer/white inner)
   */
  drawTudorRose(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Outer petals (red) - 5 petals
    ctx.fillStyle = '#C8102E';
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = size * 0.05;

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.rotate(angle);

      // Heart-shaped petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.4, -size * 0.6, -size * 0.8, 0, -size * 1.2);
      ctx.bezierCurveTo(size * 0.6, -size * 0.8, size * 0.5, -size * 0.4, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Inner petals (white) - 5 petals, offset
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E0E0E0';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2 + Math.PI / 5;
      ctx.save();
      ctx.rotate(angle);

      // Smaller heart-shaped petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size * 0.3, -size * 0.25, -size * 0.35, -size * 0.5, 0, -size * 0.7);
      ctx.bezierCurveTo(size * 0.35, -size * 0.5, size * 0.3, -size * 0.25, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Golden center
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Stamens
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dist = size * 0.12;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  /**
   * Draw Oak Leaf (lobed English oak leaf)
   */
  drawOakLeaf(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Leaf color
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = particle.color === '#8b4513' ? '#654321' : '#1a3a0a';
    ctx.lineWidth = size * 0.08;

    // Oak leaf shape (characteristic lobes)
    ctx.beginPath();
    ctx.moveTo(0, size * 1.5); // Stem end

    // Right side lobes (3 lobes)
    ctx.bezierCurveTo(size * 0.3, size * 1.2, size * 0.4, size * 1.0, size * 0.5, size * 0.8);
    ctx.bezierCurveTo(size * 0.7, size * 0.7, size * 0.8, size * 0.5, size * 0.6, size * 0.3);
    ctx.bezierCurveTo(size * 0.8, size * 0.2, size * 0.9, 0, size * 0.7, -size * 0.3);
    ctx.bezierCurveTo(size * 0.85, -size * 0.5, size * 0.8, -size * 0.8, size * 0.5, -size * 1.0);

    // Tip
    ctx.bezierCurveTo(size * 0.3, -size * 1.2, 0, -size * 1.3, -size * 0.3, -size * 1.2);

    // Left side lobes (3 lobes, mirror)
    ctx.bezierCurveTo(-size * 0.8, -size * 0.8, -size * 0.85, -size * 0.5, -size * 0.7, -size * 0.3);
    ctx.bezierCurveTo(-size * 0.9, 0, -size * 0.8, size * 0.2, -size * 0.6, size * 0.3);
    ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.7, size * 0.7, -size * 0.5, size * 0.8);
    ctx.bezierCurveTo(-size * 0.4, size * 1.0, -size * 0.3, size * 1.2, 0, size * 1.5);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central vein
    ctx.strokeStyle = particle.color === '#8b4513' ? '#654321' : '#0a2505';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(0, size * 1.4);
    ctx.lineTo(0, -size * 1.15);
    ctx.stroke();

    // Side veins (branching)
    ctx.lineWidth = size * 0.03;
    for (let i = 0; i < 4; i++) {
      const yPos = size * 0.8 - i * size * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(size * 0.4, yPos - size * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(-size * 0.4, yPos - size * 0.15);
      ctx.stroke();
    }

    ctx.restore();
  },

  /**
   * Draw Royal Crown (St Edward's Crown style)
   */
  drawCrown(ctx, particle) {
    const x = particle.x;
    const y = particle.y;
    const size = particle.size;
    const glint = (Math.sin(particle.glint) + 1) * 0.5;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(x, y);
    ctx.rotate(particle.rotation);

    // Crown base (golden)
    const crownGradient = ctx.createLinearGradient(-size, 0, size, 0);
    crownGradient.addColorStop(0, '#B8860B');
    crownGradient.addColorStop(0.5, '#FFD700');
    crownGradient.addColorStop(1, '#B8860B');
    ctx.fillStyle = crownGradient;
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = size * 0.05;

    // Crown band (base)
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 0.8, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lower band detail (jewels band)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 0.7, size * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crown arches (5 points)
    ctx.fillStyle = crownGradient;
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = size * 0.05;

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const baseX = Math.cos(angle) * size * 0.7;
      const baseY = size * 0.3 + Math.sin(angle) * size * 0.2;

      // Fleur-de-lis point
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.rotate(angle + Math.PI / 2);

      ctx.beginPath();
      // Center spike
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(-size * 0.12, -size * 0.3);
      ctx.lineTo(size * 0.12, -size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Side curves
      ctx.beginPath();
      ctx.moveTo(-size * 0.12, -size * 0.3);
      ctx.bezierCurveTo(-size * 0.25, -size * 0.5, -size * 0.28, -size * 0.65, -size * 0.2, -size * 0.75);
      ctx.lineTo(-size * 0.15, -size * 0.65);
      ctx.bezierCurveTo(-size * 0.18, -size * 0.55, -size * 0.15, -size * 0.4, -size * 0.08, -size * 0.32);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(size * 0.12, -size * 0.3);
      ctx.bezierCurveTo(size * 0.25, -size * 0.5, size * 0.28, -size * 0.65, size * 0.2, -size * 0.75);
      ctx.lineTo(size * 0.15, -size * 0.65);
      ctx.bezierCurveTo(size * 0.18, -size * 0.55, size * 0.15, -size * 0.4, size * 0.08, -size * 0.32);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Cross on top (St Edward's Crown has a cross)
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = size * 0.04;
    ctx.beginPath();
    // Vertical bar
    ctx.fillRect(-size * 0.05, -size * 0.9, size * 0.1, size * 0.25);
    ctx.strokeRect(-size * 0.05, -size * 0.9, size * 0.1, size * 0.25);
    // Horizontal bar
    ctx.fillRect(-size * 0.15, -size * 0.82, size * 0.3, size * 0.08);
    ctx.strokeRect(-size * 0.15, -size * 0.82, size * 0.3, size * 0.08);

    // Jewels (red rubies, blue sapphires)
    const jewels = [
      { x: 0, y: size * 0.3, color: '#DC143C', size: 0.12 }, // Center ruby
      { x: size * 0.4, y: size * 0.3, color: '#0000CD', size: 0.08 }, // Right sapphire
      { x: -size * 0.4, y: size * 0.3, color: '#0000CD', size: 0.08 }, // Left sapphire
    ];

    for (const jewel of jewels) {
      ctx.fillStyle = jewel.color;
      ctx.beginPath();
      ctx.arc(jewel.x, jewel.y, size * jewel.size, 0, Math.PI * 2);
      ctx.fill();

      // Glint effect
      ctx.fillStyle = `rgba(255, 255, 255, ${glint * 0.7})`;
      ctx.beginPath();
      ctx.arc(jewel.x - size * jewel.size * 0.3, jewel.y - size * jewel.size * 0.3, size * jewel.size * 0.4, 0, Math.PI * 2);
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

    const twinkleIntensity = 0.5 + Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;

    const starColor = `rgba(255, 220, 220, ${twinkleIntensity})`;
    const glowColor = `rgba(255, 180, 180, ${twinkleIntensity * 0.4})`;

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
