/**
 * Domma Analytics Tracker
 * Records page views and sends them to the backend API
 * IP addresses are automatically captured by the backend from request headers
 */

(function () {
  'use strict';

  // Configuration
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiUrl = isLocal ? 'http://localhost:3000/api' : '/api';

  // Check if user has given consent
  function hasConsent() {
    const consent = localStorage.getItem('domma:cookie-consent-accepted');
    if (!consent) return false;

    try {
      const data = JSON.parse(consent);
      return data.accepted === true;
    } catch {
      return false;
    }
  }

  // Get page information
  function getPageData() {
    return {
      path: window.location.pathname,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    };
  }

  // Send page view to backend
  async function trackPageView() {
    // Only track if consent given
    if (!hasConsent()) {
      console.log('[Analytics] Consent not given, skipping page view tracking');
      return;
    }

    try {
      const pageData = getPageData();

      // Send to backend API
      // Backend will automatically capture IP address from request headers
      const response = await fetch(`${apiUrl}/analytics/pageview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        console.error('[Analytics] Failed to record page view:', response.status);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking page view:', error);
    }
  }

  // Track page view on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }

  // Expose tracking function globally for manual tracking
  window.DommaAnalytics = {
    trackPageView,
    trackEvent: function (eventName, eventData = {}) {
      // Can be extended for custom event tracking
    }
  };

})();
