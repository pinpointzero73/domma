/**
 * Physics Utilities
 * Handles wind, gravity, movement, and physics simulation
 */

export class PhysicsEngine {
  constructor(options = {}) {
    this.windGust = 0; // Current wind strength
    this.windGustTarget = 0; // Target wind strength
    this.lastGustTime = 0;
    this.gustInterval = options.gustInterval || [5000, 15000]; // Min/max ms between gusts
    this.gustStrength = options.gustStrength || [-2, 2]; // Min/max wind force
  }

  /**
   * Update wind physics
   * @param {number} currentTime - Current timestamp
   */
  updateWind(currentTime) {
    // Generate new wind gust periodically
    const [minInterval, maxInterval] = this.gustInterval;
    if (currentTime - this.lastGustTime > minInterval + Math.random() * (maxInterval - minInterval)) {
      const [minStrength, maxStrength] = this.gustStrength;
      this.windGustTarget = minStrength + Math.random() * (maxStrength - minStrength);
      this.lastGustTime = currentTime;
    }

    // Smooth wind transition
    this.windGust += (this.windGustTarget - this.windGust) * 0.02;
  }

  /**
   * Get current wind force
   * @returns {number} Current wind force
   */
  getWindForce() {
    return this.windGust;
  }

  /**
   * Reset wind to calm
   */
  resetWind() {
    this.windGust = 0;
    this.windGustTarget = 0;
  }
}

/**
 * Update particle position with gravity and wind
 * @param {Object} particle - Particle to update
 * @param {number} deltaTime - Time since last frame
 * @param {number} windForce - Current wind force
 */
export function updateParticlePhysics(particle, deltaTime, windForce = 0) {
  const normalizedDelta = deltaTime / (1000 / 60); // Normalize to 60fps

  // Apply gravity (downward movement) - support both speed and vy
  const verticalSpeed = particle.vy || particle.speed || 0;
  particle.y += verticalSpeed * normalizedDelta;

  // Apply horizontal velocity if present
  if (particle.vx) {
    particle.x += particle.vx * normalizedDelta;
  }

  // Apply wind drift + wind gust
  if (particle.windOffset !== undefined && particle.windSpeed !== undefined) {
    particle.windOffset += particle.windSpeed * normalizedDelta;
    const baseWind = Math.sin(particle.windOffset) * 0.5;
    particle.x += (baseWind + windForce) * normalizedDelta;
  }

  // Apply rotation
  if (particle.rotationSpeed) {
    particle.rotation += particle.rotationSpeed * normalizedDelta;
  }
}

/**
 * Update moving particle with sine wave motion
 * @param {Object} particle - Moving particle to update
 * @param {number} deltaTime - Time since last frame
 * @param {number} currentTime - Current timestamp
 */
export function updateMovingParticle(particle, deltaTime, currentTime) {
  const normalizedDelta = deltaTime / (1000 / 60);

  // Update horizontal position
  particle.x += particle.vx * normalizedDelta;

  // Apply sine wave vertical motion if configured
  if (particle.waveAmplitude && particle.waveFrequency) {
    const waveProgress = (currentTime * particle.waveFrequency) / 1000;
    particle.y = particle.baseY + Math.sin(waveProgress + particle.waveOffset) * particle.waveAmplitude;
  } else {
    particle.y += particle.vy * normalizedDelta;
  }

  // Apply rotation
  if (particle.rotationSpeed) {
    particle.rotation += particle.rotationSpeed * normalizedDelta;
  }
}

/**
 * Apply gravity to particle
 * @param {Object} particle - Particle to affect
 * @param {number} deltaTime - Time since last frame
 * @param {number} gravity - Gravity force (default 0.5)
 */
export function applyGravity(particle, deltaTime, gravity = 0.5) {
  const normalizedDelta = deltaTime / (1000 / 60);
  particle.vy += gravity * normalizedDelta;
  particle.y += particle.vy * normalizedDelta;
}

/**
 * Apply bounce physics when particle hits ground
 * @param {Object} particle - Particle to bounce
 * @param {number} groundY - Y position of ground
 * @param {number} restitution - Bounce factor (0-1, default 0.6)
 */
export function applyBounce(particle, groundY, restitution = 0.6) {
  if (particle.y >= groundY && particle.vy > 0) {
    particle.y = groundY;
    particle.vy *= -restitution;

    // Stop bouncing if velocity is too low
    if (Math.abs(particle.vy) < 0.5) {
      particle.vy = 0;
    }
  }
}

/**
 * Calculate normalized delta time for consistent animation
 * @param {number} deltaTime - Time since last frame in ms
 * @param {number} targetFPS - Target framerate (default 60)
 * @returns {number} Normalized delta
 */
export function normalizeDelta(deltaTime, targetFPS = 60) {
  return deltaTime / (1000 / targetFPS);
}

/**
 * Interpolate between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
