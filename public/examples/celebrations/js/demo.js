/**
 * Domma Celebrations Demo Page
 * Testing interface for celebrations system
 *
 * The celebrations live in their own package, `domma-celebrate`, so that a site
 * with no Domma in it can use the same eight themes. `npm run copy:celebrate`
 * puts its build under `public/dist/celebrate/`.
 */

import { Celebrations } from '../../../dist/celebrate/domma-celebrate.esm.js';

// Global state
let celebrationsEffect = null;
let currentTheme = 'auto';
let currentIntensity = 'medium';
let isEnabled = false;

// Trait choices survive a theme change: the names are theme-specific, so a
// Christmas key is simply never consulted at Halloween.
let currentTraits = {};

/**
 * Get theme display name
 */
function getThemeDisplayName(theme) {
  const themes = Celebrations.getThemes();
  return themes[theme] ? `${themes[theme].emoji} ${themes[theme].displayName}` : theme;
}

/**
 * Update info panel
 */
function updateInfoPanel() {
  // Current date
  const now = new Date();
  $('#current-date').text(now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  // Active theme
  let activeTheme = currentTheme;
  if (currentTheme === 'auto') {
    activeTheme = Celebrations.getCurrentTheme();
  }

  $('#active-theme').text(activeTheme ? getThemeDisplayName(activeTheme) : 'None');

  // Status
  $('#status').text(isEnabled ? 'Running' : 'Disabled')
    .removeClass('text-success text-danger')
    .addClass(isEnabled ? 'text-success' : 'text-danger');

  // Particle count
  if (celebrationsEffect && celebrationsEffect.particles) {
    $('#particle-count').text(celebrationsEffect.particles.length + celebrationsEffect.specialParticles.length);
  } else {
    $('#particle-count').text('0');
  }
}

/**
 * Initialize celebrations effect
 */
async function initCelebrations() {
  if (celebrationsEffect) {
    celebrationsEffect.destroy();
  }

  celebrationsEffect = new Celebrations({
    theme: currentTheme,
    intensity: currentIntensity,
    enabled: false,          // We'll start manually
    traits: currentTraits,
    // This page exists to show the effect, and the visitor arrived by choosing
    // to. The reduced-motion default is right for a site that decorates itself
    // uninvited; here it would leave the demo blank with no explanation.
    respectMotionPreference: false
  });

  await celebrationsEffect.init();

  if (isEnabled) {
    celebrationsEffect.start();
  }

  renderTraits();
  updateInfoPanel();
}

/**
 * Build the trait checkboxes from whatever the loaded theme publishes.
 *
 * Rebuilt on every theme change rather than filtered, because the traits belong
 * to the theme: Christmas offers a steam train and Halloween offers witches,
 * and a stale list would show switches that control nothing.
 */
function renderTraits() {
  const $grid = $('#traits-grid');
  if (!$grid.length) return;

  const traits = celebrationsEffect ? celebrationsEffect.getTraits() : {};
  const names = Object.keys(traits);

  $grid.empty();

  if (!names.length) {
    $grid.append($('<p>').addClass('text-muted').text('No theme loaded yet.'));
    return;
  }

  names.forEach(name => {
    const trait = traits[name];

    // No handler is bound here. renderTraits() runs again on every theme
    // change, so a per-checkbox listener would be built and thrown away with
    // each rebuild; the grid below outlives all of them.
    const $checkbox = $('<input>')
      .attr('type', 'checkbox')
      .attr('data-trait', name);

    if (trait.enabled) $checkbox.attr('checked', 'checked');

    $grid.append(
      $('<label>')
        .addClass('flex items-center gap-2 cursor-pointer')
        .append($checkbox)
        .append($('<span>').text(trait.label))
    );
  });
}

/**
 * Turn every trait of the current theme on or off at once.
 *
 * Batched through setTraits rather than looped through setTrait: each change
 * reseeds the canvas, so fourteen separate calls would visibly stutter.
 */
function setAllTraits(enabled) {
  if (!celebrationsEffect) return;

  const settings = {};
  Object.keys(celebrationsEffect.getTraits()).forEach(name => {
    settings[name] = enabled;
  });

  currentTraits = {...currentTraits, ...settings};
  celebrationsEffect.setTraits(settings);
  renderTraits();
  updateInfoPanel();
}

/**
 * Toggle enable/disable
 */
function toggleEffect() {
  if (!celebrationsEffect) {
    console.error('[Demo] Celebrations effect not initialized');
    return;
  }

  isEnabled = !isEnabled;

  const $btn = $('#toggle-btn');

  if (isEnabled) {
    $btn.removeClass('btn-success').addClass('btn-danger');
    $btn.empty()
      .append($('<span>').attr('data-icon', 'pause').attr('data-icon-size', '16'))
      .append(' Disable');
    celebrationsEffect.start();
  } else {
    $btn.removeClass('btn-danger').addClass('btn-success');
    $btn.empty()
      .append($('<span>').attr('data-icon', 'play').attr('data-icon-size', '16'))
      .append(' Enable');
    celebrationsEffect.pause();

    // Clear the canvas when disabling
    if (celebrationsEffect.canvasManager) {
      celebrationsEffect.canvasManager.clear();
    }
  }

  Domma.icons.scan(); // Re-scan for new icons
  updateInfoPanel();
}

/**
 * Change intensity
 */
function setIntensity(intensity) {
  currentIntensity = intensity;

  // Update button states
  $('.intensity-btn').removeClass('btn-primary active').addClass('btn-secondary');
  $(`.intensity-btn[data-intensity="${intensity}"]`).removeClass('btn-secondary').addClass('btn-primary active');

  // Update intensity
  if (celebrationsEffect) {
    celebrationsEffect.setIntensity(intensity);
  }

  updateInfoPanel();
}

/**
 * Change theme
 */
async function setTheme(theme) {
  currentTheme = theme;

  // Update select
  $('#theme-select').val(theme);

  // Update theme
  if (celebrationsEffect) {
    await celebrationsEffect.setTheme(theme);
    renderTraits();
  } else {
    await initCelebrations();
  }

  updateInfoPanel();
}

/**
 * Initialize demo page
 */
$(() => {
  console.log('[Celebrations Demo] Initializing...');

  // Scan icons
  Domma.icons.scan();

  // Initialize breathing effect on stat cards
  Domma.effects.breathe('.stat-card', {
    amplitude: 6,
    duration: 3000,
    stagger: 200,
    pauseOnHover: true
  });

  // Initialize tooltips on celebration cards
  $('.celebration-card').each(function() {
    const $card = $(this);
    const tooltipContent = $card.attr('data-tooltip');

    if (tooltipContent) {
      Domma.elements.tooltip(this, {
        content: tooltipContent,
        position: 'top',
        trigger: 'hover',
        delay: 200
      });
    }
  });

  // Initialize collapsible usage card
  Domma.elements.card('#usage-card', {
    collapsible: true,
    collapsed: true
  });

  // Initialize effect
  initCelebrations();

  // Update info panel every second
  setInterval(updateInfoPanel, 1000);

  // Event listeners
  $('#toggle-btn').on('click', toggleEffect);

  $('.intensity-btn').on('click', function() {
    const intensity = $(this).data('intensity');
    setIntensity(intensity);
  });

  $('#theme-select').on('change', function() {
    const theme = $(this).val();
    setTheme(theme);
  });

  $('#traits-all-on').on('click', () => setAllTraits(true));
  $('#traits-all-off').on('click', () => setAllTraits(false));

  // Delegated from #traits-grid, which is in the page markup and is never
  // re-created, so one binding covers every checkbox renderTraits() builds.
  $('#traits-grid').on('change', 'input[data-trait]', function () {
    const name = this.dataset.trait;
    currentTraits[name] = this.checked;
    celebrationsEffect.setTrait(name, this.checked);
    updateInfoPanel();
  });

  $('#theme-variant-select').on('change', function() {
    const variant = $(this).val();
    if (Domma.theme) {
      Domma.theme.setVariant(variant);
    }
  });

  // Celebration card click handlers
  $('.celebration-card').on('click', async function() {
    const card = $(this);
    const themeName = card.attr('data-theme');

    console.log(`[Demo] Switching to theme: ${themeName}`);
    await setTheme(themeName);

    // Enable if not already enabled
    if (!isEnabled) {
      toggleEffect();
    }
  });

  // Set initial theme based on auto-detect
  const detectedTheme = Celebrations.getCurrentTheme();
  if (detectedTheme) {
    console.log(`[Celebrations Demo] Auto-detected theme: ${detectedTheme}`);
  } else {
    console.log('[Celebrations Demo] No active celebration detected');
  }

  updateInfoPanel();
  console.log('[Celebrations Demo] Ready!');
});
