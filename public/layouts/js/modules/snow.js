export class SnowEffect {
  constructor(options = {}) {
    this.intensity = options.intensity || 'medium';
    this.enabled = options.enabled !== undefined ? options.enabled : false;
    this.seasonCheck = options.seasonCheck || null;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.specialParticles = [];
    this.animationId = null;
    this.lastTime = 0;
    this.isPaused = false;
    this.resizeTimeout = null;
    this.windGust = 0;
    this.windGustTarget = 0;
    this.lastGustTime = 0;
    this.twinkleTime = 0;

    this._animate = this._animate.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._handleVisibility = this._handleVisibility.bind(this);
  }

  shouldDisplay() {
    if (typeof this.seasonCheck === 'function') {
      return this.seasonCheck();
    }
    return true;
  }

  init() {
    if (this.canvas) return;
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
    this._createParticles();
  }

  _createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'festive-snow-canvas';
    this.canvas.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: 999;
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
    const config = {
      light: {count: 50, speedRange: [0.5, 1.5], sizeRange: [1, 3], trees: 3, wreaths: 2},
      medium: {count: 150, speedRange: [0.8, 2.5], sizeRange: [1, 4], trees: 6, wreaths: 3},
      heavy: {count: 300, speedRange: [1.0, 3.5], sizeRange: [1, 5], trees: 10, wreaths: 4}
    }[this.intensity];

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(config.count / 2) : config.count;

    this.particles = Array.from({length: count}, () => this._createParticle(config));
    this.specialParticles = [
      ...Array.from({length: isMobile ? Math.floor(config.trees / 2) : config.trees}, () => this._createStaticTree()),
      ...Array.from({length: isMobile ? Math.floor(config.wreaths / 2) : config.wreaths}, () => this._createStaticWreath())
    ];
  }

  _createParticle(config) {
    const depth = Math.random();
    let size, speed, opacity, windSpeed;
    if (depth < 0.33) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 1.5;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 1.3;
      opacity = 0.8 + Math.random() * 0.2;
      windSpeed = 0.01 + Math.random() * 0.02;
    } else if (depth < 0.66) {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      opacity = 0.5 + Math.random() * 0.2;
      windSpeed = 0.02 + Math.random() * 0.03;
    } else {
      size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]) * 0.7;
      speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]) * 0.7;
      opacity = 0.3 + Math.random() * 0.2;
      windSpeed = 0.03 + Math.random() * 0.04;
    }
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      size,
      speed,
      opacity,
      windOffset: Math.random() * Math.PI * 2,
      windSpeed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
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
      snowLevel: 0
    };
  }

  _createStaticWreath() {
    const wreathShape = [];
    for (let i = 0; i < 20; i++) {
      wreathShape.push({
        angle: (i / 20) * Math.PI * 2,
        radius: 0.9 + Math.random() * 0.2,
        thickness: 0.2 + Math.random() * 0.15,
        color: i % 2 === 0 ? '#1a6b1a' : '#228B22'
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
      shape: wreathShape,
      snowLevel: 0
    };
  }

  _animate(currentTime) {
    if (this.isPaused || !this.canvas) return;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.twinkleTime = currentTime;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (currentTime - this.lastGustTime > 5000 + Math.random() * 10000) {
      this.windGustTarget = (Math.random() - 0.5) * 4;
      this.lastGustTime = currentTime;
    }
    this.windGust += (this.windGustTarget - this.windGust) * 0.02;
    this._spawnSpecialParticle();
    this.particles.forEach(p => {
      this._updateParticle(p, deltaTime);
      this._drawSnowflake(p);
    });
    this.specialParticles = this.specialParticles.filter(p => {
      this._updateSpecialParticle(p, deltaTime);
      this._drawSpecialParticle(p);
      return p.active;
    });
    this.animationId = requestAnimationFrame(this._animate);
  }

  _updateParticle(particle, deltaTime) {
    const normDelta = deltaTime / (16.67);
    particle.y += particle.speed * normDelta;
    particle.windOffset += particle.windSpeed * normDelta;
    particle.x += (Math.sin(particle.windOffset) * 0.5 + this.windGust) * normDelta;
    particle.rotation += particle.rotationSpeed * normDelta;
    if (particle.y > this.canvas.height + 10) {
      particle.y = -10;
      particle.x = Math.random() * this.canvas.width;
    }
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
    }
  }

  _updateSpecialParticle(particle, deltaTime) {
    if (particle.static) {
      if (Math.random() < 0.0005) {
        particle.snowLevel = Math.min(particle.snowLevel + Math.random() * 0.2, particle.size * 0.3);
      }
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
    }
  }

  _drawSpecialParticle(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.opacity;
    if (p.type === 'sleigh') this._drawSleigh(p);
    else if (p.type === 'tree') this._drawTree(p);
    else if (p.type === 'wreath') this._drawWreath(p);
    else if (p.type === 'elf') this._drawElf(p);
    this.ctx.restore();
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
        ctx.arc(nX, nY, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
        const g = ctx.createRadialGradient(nX, nY, 0, nX, nY, size * 0.15);
        g.addColorStop(0, 'rgba(255,0,0,0.7)');
        g.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nX, nY, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.fillStyle = '#c00';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sT = y - size * 0.7, sF = x + dir * size * 1.5, sB = x - dir * size * 0.3, sBot = y + size * 0.3;
    ctx.moveTo(sF, sT);
    ctx.quadraticCurveTo(x + dir * size * 1.2, y - size * 0.3, sF, sBot);
    ctx.lineTo(sB, sBot);
    ctx.quadraticCurveTo(x - dir * size * 0.5, y, sB, sT);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const sackX = x - dir * size * 0.05;
    ctx.fillStyle = '#5c4033';
    ctx.beginPath();
    ctx.ellipse(sackX, y - size * 0.2, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
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
    if (particle.snowLevel > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 3; i++) {
        const lY = i * size * 0.4, lS = size * (1.2 - i * 0.2), sH = particle.snowLevel * (1 - i * 0.2);
        if (sH > 0.5) {
          ctx.beginPath();
          ctx.moveTo(-lS, size * 0.3 - lY);
          ctx.quadraticCurveTo(0, size * 0.3 - lY - sH, lS, size * 0.3 - lY);
          ctx.closePath();
          ctx.fill();
        }
      }
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
    if (particle.snowLevel > 0.1) {
      ctx.beginPath();
      ctx.arc(0, -size, size * 0.8, 0, Math.PI, true);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

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