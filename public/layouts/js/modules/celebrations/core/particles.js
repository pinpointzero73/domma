/**
 * Particle System Base
 * Handles particle creation, depth layers, and lifecycle management
 */

/**
 * Create a base particle with depth layering
 * @param {Object} config - Configuration for particle creation
 * @param {number} canvasWidth - Canvas width for positioning
 * @param {number} canvasHeight - Canvas height for positioning
 * @returns {Object} Particle object
 */
export function createParticle(config, canvasWidth, canvasHeight) {
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
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight - canvasHeight, // Start above viewport
    size: size,
    speed: speed,
    opacity: opacity,
    windOffset: Math.random() * Math.PI * 2,
    windSpeed: windSpeed,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    depth: depth
  };
}

/**
 * Create a static decoration (tree, house, etc.)
 * @param {string} type - Type of decoration
 * @param {number} canvasWidth - Canvas width for positioning
 * @param {number} canvasHeight - Canvas height for positioning
 * @param {Object} options - Additional options
 * @returns {Object} Static particle object
 */
export function createStaticDecoration(type, canvasWidth, canvasHeight, options = {}) {
  return {
    type: type,
    x: options.x !== undefined ? options.x : Math.random() * canvasWidth,
    y: options.y !== undefined ? options.y : Math.random() * canvasHeight,
    vx: 0,
    vy: 0,
    size: options.size || (20 + Math.random() * 15),
    opacity: options.opacity || (0.6 + Math.random() * 0.3),
    rotation: options.rotation || 0,
    rotationSpeed: 0,
    active: true,
    static: true,
    ...options
  };
}

/**
 * Create a moving special particle (sleigh, bird, etc.)
 * @param {string} type - Type of special particle
 * @param {number} canvasWidth - Canvas width for positioning
 * @param {number} canvasHeight - Canvas height for positioning
 * @param {Object} options - Movement and appearance options
 * @returns {Object} Moving particle object
 */
export function createMovingParticle(type, canvasWidth, canvasHeight, options = {}) {
  const startX = options.startX !== undefined ? options.startX : -100;
  const startY = options.startY !== undefined ? options.startY : canvasHeight * 0.3;

  return {
    type: type,
    x: startX,
    y: startY,
    vx: options.vx || 1.5,
    vy: options.vy || 0,
    size: options.size || 40,
    opacity: options.opacity || 1,
    rotation: options.rotation || 0,
    rotationSpeed: options.rotationSpeed || 0,
    active: true,
    static: false,
    // Sine wave motion
    waveAmplitude: options.waveAmplitude || 0,
    waveFrequency: options.waveFrequency || 0,
    waveOffset: options.waveOffset || 0,
    ...options
  };
}

/**
 * Recycle particle to top/side of canvas
 * @param {Object} particle - Particle to recycle
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 */
export function recycleParticle(particle, canvasWidth, canvasHeight) {
  if (particle.y > canvasHeight + 10) {
    particle.y = -10;
    particle.x = Math.random() * canvasWidth;
  }

  // Wrap horizontally
  if (particle.x < -10) {
    particle.x = canvasWidth + 10;
  } else if (particle.x > canvasWidth + 10) {
    particle.x = -10;
  }
}

/**
 * Check if particle is off-screen and should be removed
 * @param {Object} particle - Particle to check
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @param {number} buffer - Extra buffer space (default 100)
 * @returns {boolean} True if particle is off-screen
 */
export function isOffScreen(particle, canvasWidth, canvasHeight, buffer = 100) {
  return (
    particle.x < -buffer ||
    particle.x > canvasWidth + buffer ||
    particle.y < -buffer ||
    particle.y > canvasHeight + buffer
  );
}
