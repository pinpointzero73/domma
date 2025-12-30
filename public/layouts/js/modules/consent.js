/**
 * ConsentModule - Cookie and localStorage consent banner
 *
 * Displays a fixed-position banner informing users about data collection
 * and requests consent before enabling analytics tracking.
 *
 * Features:
 * - Uses Domma's storage wrapper (S) for consent persistence
 * - Auto-hides after acceptance
 * - Links to Privacy Policy page
 * - Blocks analytics until consent given
 * - Responsive design
 *
 * @license MIT
 */

export const ConsentModule = {
  banner: null,

  /**
   * Initialize consent banner
   */
  init() {
    // Check if Domma.storage is available
    if (typeof Domma === 'undefined' || !Domma.storage) {
      console.warn('[Consent] Domma.storage not available, consent module disabled');
      return;
    }

    const S = Domma.storage;

    // Check if consent already given
    const consent = S.get('cookie-consent-accepted');
    if (consent && consent.accepted === true) {
      console.log('[Consent] Consent already given');
      return; // Already accepted, no banner needed
    }

    // Create and show banner
    this.createBanner();
    this.attachHandlers();

    console.log('[Consent] Banner displayed');
  },

  /**
   * Create consent banner HTML and inject into page
   */
  createBanner() {
    // Calculate relative path to privacy policy based on current depth
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const levelsUp = pathParts.length;
    const privacyUrl = levelsUp > 0
      ? '../'.repeat(levelsUp) + 'privacy-policy/index.html'
      : 'privacy-policy/index.html';

    const bannerHtml = `
      <div id="consent-banner" class="consent-banner">
        <div class="consent-content">
          <div class="consent-message">
            <strong>Cookie & Privacy Notice</strong>
            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">
              We use localStorage to save your preferences and collect anonymous analytics
              (page views, browser info, IP address) to improve our service.
              <a href="${privacyUrl}" style="color: var(--dm-primary); text-decoration: underline;">
                View our Privacy Policy
              </a>
            </p>
          </div>
          <div class="consent-actions">
            <button id="consent-accept-btn" class="btn btn-primary">
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHtml);
    this.banner = document.getElementById('consent-banner');
  },

  /**
   * Attach event handlers
   */
  attachHandlers() {
    const acceptBtn = document.getElementById('consent-accept-btn');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.accept());
    }
  },

  /**
   * Handle consent acceptance
   */
  accept() {
    const S = Domma.storage;

    // Store consent with metadata
    S.set('cookie-consent-accepted', {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0' // Privacy policy version
    });

    console.log('[Consent] User accepted consent');

    // Remove banner from DOM with fade-out animation
    if (this.banner) {
      this.banner.style.animation = 'slideDown 0.3s ease';
      this.banner.style.opacity = '0';

      setTimeout(() => {
        if (this.banner && this.banner.parentNode) {
          this.banner.parentNode.removeChild(this.banner);
        }
        this.banner = null;

        // Reload page to start analytics (optional)
        // Uncomment if you want immediate analytics tracking
        // window.location.reload();
      }, 300);
    }
  },

  /**
   * Check if user has given consent
   * @returns {boolean}
   */
  hasConsent() {
    if (typeof Domma === 'undefined' || !Domma.storage) return false;

    const consent = Domma.storage.get('cookie-consent-accepted');
    return consent && consent.accepted === true;
  }
};
