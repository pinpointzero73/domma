/**
 * Nexus Contact Manager - Storage Abstraction Layer
 * Handles online/offline storage with sync capability
 *
 * Architecture:
 * - Vault: Backend API storage (primary)
 * - Cache: localStorage storage (backup/offline)
 * - Sync: Automatic synchronisation between Vault and Cache
 */

class NexusStorage {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'http://localhost:3000/api';
    this.token = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.eventHandlers = {};

    // Storage keys
    this.STORAGE_KEYS = {
      contacts: 'nexus_contacts',
      groups: 'nexus_groups',
      sync_queue: 'nexus_sync_queue',
      last_sync: 'nexus_last_sync'
    };

    // Initialize online/offline monitoring
    this.initOnlineMonitoring();

    // Load sync queue from storage
    this.loadSyncQueue();
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Initialize online/offline monitoring
   */
  initOnlineMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
    });
  }

  /**
   * Event handling
   */
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(data));
    }
  }

  // ============================================================================
  // CONTACTS STORAGE
  // ============================================================================

  /**
   * Get all contacts
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Contacts array
   */
  async getContacts(filters = {}) {
    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest('/contacts', {
          method: 'GET',
          params: filters
        });

        if (response.success) {
          // Update Cache with fresh data
          this.cacheStore(this.STORAGE_KEYS.contacts, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, using Cache:', error.message);
    }

    // Fallback to Cache
    return this.cacheGet(this.STORAGE_KEYS.contacts) || [];
  }

  /**
   * Create new contact
   * @param {Object} contactData - Contact data
   * @returns {Promise<Object>} Created contact
   */
  async createContact(contactData) {
    const tempId = `temp_${Date.now()}`;
    const contact = {
      ...contactData,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest('/contacts', {
          method: 'POST',
          body: contactData
        });

        if (response.success) {
          // Update Cache with server data
          this.addToCache(this.STORAGE_KEYS.contacts, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, queuing for sync:', error.message);
    }

    // Store in Cache and queue for sync
    this.addToCache(this.STORAGE_KEYS.contacts, contact);
    this.queueForSync('contacts', 'create', contact);

    return contact;
  }

  /**
   * Update contact
   * @param {string} id - Contact ID
   * @param {Object} updates - Updated data
   * @returns {Promise<Object>} Updated contact
   */
  async updateContact(id, updates) {
    const updatedContact = {
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest(`/contacts/${id}`, {
          method: 'PUT',
          body: updates
        });

        if (response.success) {
          // Update Cache with server data
          this.updateInCache(this.STORAGE_KEYS.contacts, id, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, queuing for sync:', error.message);
    }

    // Update Cache and queue for sync
    this.updateInCache(this.STORAGE_KEYS.contacts, id, updatedContact);
    this.queueForSync('contacts', 'update', updatedContact);

    return updatedContact;
  }

  /**
   * Delete contact
   * @param {string} id - Contact ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteContact(id) {
    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest(`/contacts/${id}`, {
          method: 'DELETE'
        });

        if (response.success) {
          // Remove from Cache
          this.removeFromCache(this.STORAGE_KEYS.contacts, id);
          return true;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, queuing for sync:', error.message);
    }

    // Mark as deleted in Cache and queue for sync
    this.removeFromCache(this.STORAGE_KEYS.contacts, id);
    this.queueForSync('contacts', 'delete', {id});

    return true;
  }

  // ============================================================================
  // CONTACT GROUPS STORAGE
  // ============================================================================

  /**
   * Get all contact groups
   * @returns {Promise<Array>} Groups array
   */
  async getGroups() {
    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest('/contacts/groups');

        if (response.success) {
          // Update Cache with fresh data
          this.cacheStore(this.STORAGE_KEYS.groups, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, using Cache:', error.message);
    }

    // Fallback to Cache
    return this.cacheGet(this.STORAGE_KEYS.groups) || [];
  }

  /**
   * Create new contact group
   * @param {Object} groupData - Group data
   * @returns {Promise<Object>} Created group
   */
  async createGroup(groupData) {
    const tempId = `temp_${Date.now()}`;
    const group = {
      ...groupData,
      id: tempId,
      contactCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest('/contacts/groups', {
          method: 'POST',
          body: groupData
        });

        if (response.success) {
          // Update Cache with server data
          this.addToCache(this.STORAGE_KEYS.groups, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, queuing for sync:', error.message);
    }

    // Store in Cache and queue for sync
    this.addToCache(this.STORAGE_KEYS.groups, group);
    this.queueForSync('groups', 'create', group);

    return group;
  }

  /**
   * Update contact group
   * @param {string} id - Group ID
   * @param {Object} updates - Updated data
   * @returns {Promise<Object>} Updated group
   */
  async updateGroup(id, updates) {
    const updatedGroup = {
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest(`/contacts/groups/${id}`, {
          method: 'PUT',
          body: updates
        });

        if (response.success) {
          // Update Cache with server data
          this.updateInCache(this.STORAGE_KEYS.groups, id, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, queuing for sync:', error.message);
    }

    // Update Cache and queue for sync
    this.updateInCache(this.STORAGE_KEYS.groups, id, updatedGroup);
    this.queueForSync('groups', 'update', updatedGroup);

    return updatedGroup;
  }

  /**
   * Delete contact group
   * @param {string} id - Group ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGroup(id) {
    try {
      if (this.isOnline && this.token) {
        // Try Vault first
        const response = await this.vaultRequest(`/contacts/groups/${id}`, {
          method: 'DELETE'
        });

        if (response.success) {
          // Remove from Cache
          this.removeFromCache(this.STORAGE_KEYS.groups, id);
          return true;
        }
      }
    } catch (error) {
      console.warn('Vault access failed, queuing for sync:', error.message);
    }

    // Mark as deleted in Cache and queue for sync
    this.removeFromCache(this.STORAGE_KEYS.groups, id);
    this.queueForSync('groups', 'delete', {id});

    return true;
  }

  // ============================================================================
  // VAULT (BACKEND API) OPERATIONS
  // ============================================================================

  /**
   * Make request to Vault (backend API)
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async vaultRequest(endpoint, options = {}) {
    const url = new URL(`${this.apiUrl}${endpoint}`);

    // Add query parameters
    if (options.params) {
      Object.keys(options.params).forEach(key => {
        if (options.params[key] !== undefined) {
          url.searchParams.append(key, options.params[key]);
        }
      });
    }

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && {'Authorization': `Bearer ${this.token}`})
      }
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Vault request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // CACHE (LOCALSTORAGE) OPERATIONS
  // ============================================================================

  /**
   * Store data in cache
   */
  cacheStore(key, data) {
    try {
      S.set(key, data);
    } catch (error) {
      console.error('Cache store failed:', error);
    }
  }

  /**
   * Get data from cache
   */
  cacheGet(key) {
    try {
      return S.get(key);
    } catch (error) {
      console.error('Cache get failed:', error);
      return null;
    }
  }

  /**
   * Add item to cache array
   */
  addToCache(key, item) {
    const items = this.cacheGet(key) || [];
    items.push(item);
    this.cacheStore(key, items);
  }

  /**
   * Update item in cache array
   */
  updateInCache(key, id, updates) {
    const items = this.cacheGet(key) || [];
    const index = items.findIndex(item => item.id === id || item._id === id);

    if (index !== -1) {
      items[index] = {...items[index], ...updates};
      this.cacheStore(key, items);
    }
  }

  /**
   * Remove item from cache array
   */
  removeFromCache(key, id) {
    const items = this.cacheGet(key) || [];
    const filtered = items.filter(item => item.id !== id && item._id !== id);
    this.cacheStore(key, filtered);
  }

  // ============================================================================
  // SYNC OPERATIONS
  // ============================================================================

  /**
   * Queue operation for sync
   */
  queueForSync(type, operation, data) {
    const syncItem = {
      id: `sync_${Date.now()}_${Math.random()}`,
      type,
      operation,
      data,
      timestamp: Date.now()
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();
    this.emit('sync-queued', syncItem);
  }

  /**
   * Load sync queue from storage
   */
  loadSyncQueue() {
    this.syncQueue = S.get(this.STORAGE_KEYS.sync_queue) || [];
  }

  /**
   * Save sync queue to storage
   */
  saveSyncQueue() {
    S.set(this.STORAGE_KEYS.sync_queue, this.syncQueue);
  }

  /**
   * Process sync queue
   */
  async processSyncQueue() {
    if (!this.isOnline || !this.token || this.syncQueue.length === 0) {
      return;
    }

    this.emit('sync-start', {items: this.syncQueue.length});

    const processed = [];
    const failed = [];

    for (const item of this.syncQueue) {
      try {
        await this.processSyncItem(item);
        processed.push(item);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        failed.push({item, error: error.message});
      }
    }

    // Remove processed items from queue
    this.syncQueue = this.syncQueue.filter(item =>
      !processed.find(p => p.id === item.id)
    );
    this.saveSyncQueue();

    this.emit('sync-complete', {
      processed: processed.length,
      failed: failed.length,
      errors: failed
    });
  }

  /**
   * Process individual sync item
   */
  async processSyncItem(item) {
    const {type, operation, data} = item;

    let endpoint = '';
    let method = '';
    let body = null;

    switch (type) {
      case 'contacts':
        endpoint = '/contacts';
        break;
      case 'groups':
        endpoint = '/contacts/groups';
        break;
    }

    switch (operation) {
      case 'create':
        method = 'POST';
        body = data;
        break;
      case 'update':
        endpoint += `/${data.id}`;
        method = 'PUT';
        body = data;
        break;
      case 'delete':
        endpoint += `/${data.id}`;
        method = 'DELETE';
        break;
    }

    const response = await this.vaultRequest(endpoint, {method, body});

    if (!response.success) {
      throw new Error(response.message || 'Sync operation failed');
    }

    // Update local cache with server response for create/update operations
    if (operation === 'create' || operation === 'update') {
      const cacheKey = type === 'contacts' ? this.STORAGE_KEYS.contacts : this.STORAGE_KEYS.groups;

      if (operation === 'create') {
        // Replace temporary item with server item
        this.removeFromCache(cacheKey, data.id);
        this.addToCache(cacheKey, response.data);
      } else {
        // Update with server data
        this.updateInCache(cacheKey, data.id, response.data);
      }
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      queueSize: this.syncQueue.length,
      lastSync: S.get(this.STORAGE_KEYS.last_sync)
    };
  }

  /**
   * Force sync now
   */
  async forceSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    await this.processSyncQueue();

    // Update last sync timestamp
    S.set(this.STORAGE_KEYS.last_sync, Date.now());
  }

  /**
   * Clear all data (factory reset)
   */
  clearAll() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      S.remove(key);
    });
    this.syncQueue = [];
    this.emit('data-cleared');
  }

  /**
   * Import data from external source
   */
  async importData(data) {
    const {contacts = [], groups = []} = data;

    try {
      if (this.isOnline && this.token) {
        // Try bulk import via Vault
        const response = await this.vaultRequest('/contacts/import', {
          method: 'POST',
          body: {contacts}
        });

        if (response.success) {
          // Refresh local cache
          await this.getContacts();
          await this.getGroups();
          return response.data;
        }
      }
    } catch (error) {
      console.warn('Vault import failed, importing to Cache:', error.message);
    }

    // Fallback: import to cache and queue for sync
    contacts.forEach(contact => this.queueForSync('contacts', 'create', contact));
    groups.forEach(group => this.queueForSync('groups', 'create', group));

    return {
      imported: contacts.length,
      queued: contacts.length + groups.length
    };
  }
}

// Export storage instance
export default NexusStorage;