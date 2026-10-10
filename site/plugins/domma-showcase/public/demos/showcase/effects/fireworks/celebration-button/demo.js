/**
 * Celebration Button - from public/showcase/effects/fireworks.
 */
export function mount(root) {
    function launchFirework(containerId, theme = 'celebration', position = 50, particleCount = 200) {
        const container = $('#' + containerId)[0];
        if (!container) return;

        // DON'T clear container - allow multiple fireworks
        // Create individual container for this firework
        const fireworkContainer = document.createElement('div');
        fireworkContainer.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: ${position}%;
                    width: 10px;
                    height: 100%;
                    transform: translateX(-50%);
                `;
        container.appendChild(fireworkContainer);

        // Create rocket trail going up
        const rocket = document.createElement('div');
        rocket.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 3px;
                    height: 10px;
                    background: linear-gradient(to top, transparent, #ffa500, #fff);
                    box-shadow: 0 0 10px #ffa500;
                    animation: rocket-launch 1s ease-out forwards;
                    z-index: 100;
                `;
        fireworkContainer.appendChild(rocket);

        // After rocket reaches top, create explosion
        setTimeout(() => {
          rocket.remove();
          createExplosion(fireworkContainer, theme, particleCount);
          // Clean up the entire firework container after animation completes
          // Shorter cleanup for multiple fireworks to improve performance
          const containerCleanup = particleCount > 100 ? 3000 : 2500;
          setTimeout(() => {
            fireworkContainer.remove();
          }, containerCleanup);
        }, 1000);
      }
    function createExplosion(container, theme = 'celebration', particleCount = 200) {
        // Dynamic particle count based on context

        // Themed color palettes
        const themes = {
          celebration: ['#ffd700', '#ffed4e', '#fff59d', '#ffecb3'], // Gold/yellow
          special: ['#ffd700', '#ffed4e', '#c0c0c0', '#e0e0e0', '#ffffff'], // Gold & silver
          birthday: ['#ff1744', '#ff5252', '#2196f3', '#64b5f6', '#ffffff'], // Red, blue, white
          romance: ['#ff1744', '#ff69b4', '#ff8a95', '#ffc1cc', '#ffffff'], // Reds & pinks
          success: ['#4caf50', '#8bc34a', '#ffd700', '#ffeb3b'], // Green & gold
          winter: ['#2196f3', '#64b5f6', '#bbdefb', '#ffffff', '#e1f5fe'], // Blues & white
          christmas: ['#ff1744', '#f44336', '#4caf50', '#66bb6a', '#ffd700'], // Red, green, gold
          newyear: ['#ffd700', '#ffed4e', '#ffffff', '#c0c0c0', '#e0e0e0'], // Gold, silver, white
          patriotic: ['#ff1744', '#ffffff', '#2196f3', '#1976d2'], // Red, white, blue
          sunset: ['#ff6b35', '#ff8c42', '#ffd23f', '#ffaa00', '#ff7043'], // Orange/yellow
          ocean: ['#006994', '#2196f3', '#40e0d0', '#00bcd4', '#ffffff'], // Ocean blues
          purple: ['#9c27b0', '#ba68c8', '#ce93d8', '#e1bee7', '#ffffff'] // Purple monochrome
        };

        const colors = themes[theme] || themes.celebration;

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          // Random angle for more natural distribution
          const angle = Math.random() * Math.PI * 2;
          const velocity = 80 + Math.random() * 150; // Increased explosion speeds
          const color = colors[Math.floor(Math.random() * colors.length)];
          const particleSize = 3 + Math.random() * 4; // Larger particles

          particle.style.cssText = `
                        position: absolute;
                        top: 20%;
                        left: 50%;
                        transform: translateX(-50%);
                        width: ${particleSize}px;
                        height: ${particleSize}px;
                        background: ${color};
                        border-radius: 50%;
                        box-shadow: 0 0 ${particleSize * 3}px ${color}, 0 0 ${particleSize * 6}px ${color};
                        pointer-events: none;
                        z-index: 50;
                    `;

          // Simple explosion outward - no complex falling
          const endX = Math.cos(angle) * velocity;
          const endY = Math.sin(angle) * velocity;

          particle.animate([
            {
              transform: 'translate(-50%, 0) scale(0)',
              opacity: 0
            },
            {
              // Quick burst
              transform: 'translate(-50%, 0) scale(1)',
              opacity: 1,
              offset: 0.1
            },
            {
              // Explode outward
              transform: `translate(calc(-50% + ${endX}px), ${endY}px) scale(1.2)`,
              opacity: 1,
              offset: 0.3
            },
            {
              // Continue outward and start fading
              transform: `translate(calc(-50% + ${endX * 1.5}px), ${endY * 1.5}px) scale(1)`,
              opacity: 0.8,
              offset: 0.5
            },
            {
              // Fade out in place
              transform: `translate(calc(-50% + ${endX * 1.8}px), ${endY * 1.8}px) scale(0.8)`,
              opacity: 0.4,
              offset: 0.7
            },
            {
              // Almost gone
              transform: `translate(calc(-50% + ${endX * 2}px), ${endY * 2}px) scale(0.5)`,
              opacity: 0.1,
              offset: 0.9
            },
            {
              // Gone
              transform: `translate(calc(-50% + ${endX * 2}px), ${endY * 2}px) scale(0.3)`,
              opacity: 0
            }
          ], {
            duration: particleCount > 100 ? 2500 : 2000, // Shorter duration for multiple fireworks
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
            fill: 'forwards'
          });

          container.appendChild(particle);

          // Remove particle after animation - shorter cleanup for multiple fireworks
          const cleanupDelay = particleCount > 100 ? 2500 : 2000;
          setTimeout(() => particle.remove(), cleanupDelay);
        }

        // Add sparkle trails - scale with particle count
        const sparkleCount = Math.max(5, Math.floor(particleCount / 20));
        for (let i = 0; i < sparkleCount; i++) {
          setTimeout(() => {
            const sparkle = document.createElement('div');
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;

            sparkle.style.cssText = `
                            position: absolute;
                            top: 20%;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 2px;
                            height: 2px;
                            background: #fff;
                            border-radius: 50%;
                            box-shadow: 0 0 4px #fff;
                            pointer-events: none;
                            z-index: 50;
                        `;

            sparkle.animate([
              {
                transform: 'translate(-50%, 0) scale(1)',
                opacity: 1
              },
              {
                transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
              }
            ], {
              duration: particleCount > 100 ? 1000 : 800,
              easing: 'ease-out',
              fill: 'forwards'
            });

            container.appendChild(sparkle);
            const sparkleCleanup = particleCount > 100 ? 1000 : 800;
            setTimeout(() => sparkle.remove(), sparkleCleanup);
          }, i * 50);
        }
      }
      // Launch multiple fireworks function
    function launchMultipleFireworks(containerId = 'firework-demo-3', theme = 'mixed', count = 5) {
        const container = $('#' + containerId)[0];
        if (!container) return;

        // Clear any existing fireworks for a fresh display
        container.innerHTML = '';

        // Calculate optimal particle count based on total fireworks
        // Formula: More fireworks = fewer particles each for better performance
        const particleCount = Math.max(50, Math.min(200, Math.floor(300 / count)));

        // If mixed theme, use random themes
        const themes = ['celebration', 'special', 'birthday', 'newyear', 'christmas', 'valentine', 'ocean', 'purple', 'patriotic', 'sunset', 'romance', 'success', 'winter'];

        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const currentTheme = theme === 'mixed' ? themes[Math.floor(Math.random() * themes.length)] : theme;
            const position = 20 + Math.random() * 60; // Random position between 20% and 80%
            launchFirework(containerId, currentTheme, position, particleCount);
          }, i * 300 + Math.random() * 200);
        }
      }
        // Celebrate button example
    const $celebrate = $(root).find('#celebrate-btn');
    if ($celebrate.length) {
          $celebrate.on('click', () => {
            // Launch multiple celebration fireworks
            launchMultipleFireworks('celebrate-demo', 'celebration', 5);

            // Change button text temporarily
            const originalText = $celebrate.text();
            $celebrate.text('🎉 Purchase Complete!').prop('disabled', true);

            setTimeout(() => {
              $celebrate.text(originalText).prop('disabled', false);
            }, 3000);
          });
        }
}
