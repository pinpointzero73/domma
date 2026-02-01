/**
 * User Preferences Manager
 * Handles localStorage + backend sync for Address Lookup preferences
 */

import config from '../../shared/config.js';

const STORAGE_KEY = 'address-lookup-preferences';
const SYNC_DEBOUNCE_MS = 5000; // Sync 5 seconds after last change

class PreferencesManager {
  constructor() {
    this.preferences = this.loadLocal();
    this._syncTimeout = null;
    this._syncing = false;
  }

  /**
   * Load preferences from localStorage
   */
  loadLocal() {
    const stored = S.get(STORAGE_KEY);
    return stored || {
      globalPreferences: {
        defaultTier: 'free',
        defaultSaveMode: 'normal'
      },
      postcodePreferences: {},
      syncVersion: 0,
      lastLocalUpdate: null
    };
  }

  /**
   * Save to localStorage and schedule backend sync
   */
  saveLocal(triggerSync = true) {
    this.preferences.lastLocalUpdate = Date.now();
    S.set(STORAGE_KEY, this.preferences);

    if (triggerSync) {
      this.scheduleSync();
    }
  }

  /**
   * Get global preference
   */
  getGlobal(key) {
    return this.preferences.globalPreferences[key];
  }

  /**
   * Set global preference
   */
  setGlobal(key, value) {
    this.preferences.globalPreferences[key] = value;
    this.saveLocal();
  }

  /**
   * Get preference for a specific postcode
   * Falls back to global default if not set
   */
  getForPostcode(postcode, key) {
    const normalised = postcode.toUpperCase().replace(/\s/g, '');
    const postcodePrefs = this.preferences.postcodePreferences[normalised];

    if (postcodePrefs && postcodePrefs[key] !== null && postcodePrefs[key] !== undefined) {
      return postcodePrefs[key];
    }

    // Fall back to global
    const globalMap = {
      preferredTier: 'defaultTier',
      saveMode: 'defaultSaveMode'
    };

    return this.preferences.globalPreferences[globalMap[key] || key];
  }

  /**
   * Set preference for a specific postcode
   */
  setForPostcode(postcode, key, value) {
    const normalised = postcode.toUpperCase().replace(/\s/g, '');

    if (!this.preferences.postcodePreferences[normalised]) {
      this.preferences.postcodePreferences[normalised] = {};
    }

    this.preferences.postcodePreferences[normalised][key] = value;
    this.preferences.postcodePreferences[normalised].lastUpdated = Date.now();
    this.saveLocal();
  }

  /**
   * Schedule background sync to backend
   */
  scheduleSync() {
    if (this._syncTimeout) {
      clearTimeout(this._syncTimeout);
    }

    this._syncTimeout = setTimeout(() => {
      this.syncToBackend();
    }, SYNC_DEBOUNCE_MS);
  }

  /**
   * Sync to backend
   */
  async syncToBackend() {
    if (this._syncing) return;
    this._syncing = true;

    try {
      const response = await fetch(`${config.apiUrl}/address/preferences/sync`, {
        method: 'POST',
        headers: {
          ...Domma.auth.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          globalPreferences: this.preferences.globalPreferences,
          postcodePreferences: this.preferences.postcodePreferences,
          clientSyncVersion: this.preferences.syncVersion
        })
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const data = await response.json();

      if (data.conflict) {
        // Server has newer data - merge
        this.mergeFromServer(data.serverPreferences);
      } else {
        this.preferences.syncVersion = data.syncVersion;
        this.saveLocal(false); // Don't trigger another sync
      }

    } catch (error) {
      console.warn('[Preferences] Sync failed, will retry:', error.message);
    } finally {
      this._syncing = false;
    }
  }

  /**
   * Load from backend (on app init)
   */
  async loadFromBackend() {
    try {
      const response = await fetch(`${config.apiUrl}/address/preferences`, {
        headers: Domma.auth.getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          this.mergeFromServer(data.preferences);
        }
      }
    } catch (error) {
      console.warn('[Preferences] Failed to load from backend:', error.message);
    }
  }

  /**
   * Merge server preferences with local
   * Server wins for conflicts, but preserves any local-only data
   */
  mergeFromServer(serverPrefs) {
    if (serverPrefs.syncVersion > this.preferences.syncVersion) {
      this.preferences.globalPreferences = {
        ...this.preferences.globalPreferences,
        ...serverPrefs.globalPreferences
      };

      // Merge postcode preferences
      const serverPostcodes = serverPrefs.postcodePreferences || {};
      for (const [postcode, settings] of Object.entries(serverPostcodes)) {
        const localSettings = this.preferences.postcodePreferences[postcode] || {};
        const serverTime = new Date(settings.lastUpdated || 0).getTime();
        const localTime = localSettings.lastUpdated || 0;

        if (serverTime >= localTime) {
          this.preferences.postcodePreferences[postcode] = settings;
        }
      }

      this.preferences.syncVersion = serverPrefs.syncVersion;
      this.saveLocal(false);
    }
  }
}

export default new PreferencesManager();
