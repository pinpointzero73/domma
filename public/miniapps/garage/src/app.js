/**
 * My Garage - Domma MiniApp
 * Vehicle management with DVLA integration, caching, and saved vehicles
 */

// Detect environment at runtime
const isLocal = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

const GarageApp = {
  apiUrl: isLocal ? 'http://localhost:3000/api' : '/api',
  currentVehicle: null,
  garageVehicles: [], // Store all garage vehicles for filtering
  rateLimiter: {
    requests: [],
    limit: 10,
    window: 60000, // 1 minute

    canMakeRequest() {
      const now = Date.now();
      this.requests = this.requests.filter(time => now - time < this.window);
      return this.requests.length < this.limit;
    },

    recordRequest() {
      this.requests.push(Date.now());
    },

    getTimeUntilNext() {
      if (this.canMakeRequest()) return 0;
      const oldestRequest = Math.min(...this.requests);
      return this.window - (Date.now() - oldestRequest);
    }
  },

  /**
   * Initialize the application
   */
  async init() {
    // Initialize Domma.auth module
    Domma.auth.init({
      apiUrl: this.apiUrl
    });

    // Listen to auth events
    Domma.auth.on('login', () => {
      this.showApp();
    });

    Domma.auth.on('register', () => {
      this.showApp();
    });

    Domma.auth.on('logout', () => {
      this.showAuth();
      this.currentVehicle = null;
      this.garageVehicles = [];
    });

    Domma.auth.on('tokenExpired', () => {
      this.showAuth();
      this.showAlert('Session expired. Please login again.', 'error');
    });

    Domma.auth.on('error', (message) => {
      this.showAlert(message, 'error');
    });

    // Check if already authenticated
    if (Domma.auth.isAuthenticated()) {
      this.showApp();
    } else {
      this.showAuth();
    }

    // Setup event listeners
    this.setupEventListeners();

    // Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Show authentication screen
   */
  showAuth() {
    $('#authSection').css('display', 'block');
    $('#appSection').css('display', 'none');
  },

  /**
   * Show main app
   */
  async showApp() {
    $('#authSection').css('display', 'none');
    $('#appSection').css('display', 'block');

    // Load user's vehicles
    await this.loadHistory();
    await this.loadGarage();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Logout is now handled by the navbar in layout.js

    // Search form
    const $searchForm = $('#searchForm');
    if ($searchForm.length > 0) {
      $searchForm.on('submit', (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    // Tab switching (Results/My Garage/History)
    $('.tab-pill').each(function () {
      $(this).on('click', function () {
        const tabName = $(this).attr('data-tab');
        GarageApp.switchTab(tabName);
      });
    });

    // Input formatting
    const $regInput = $('#regInput');
    if ($regInput.length > 0) {
      $regInput.on('input', (e) => {
        $(e.target).val($(e.target).val().toUpperCase().replace(/\s/g, ''));
      });
    }

    // Event delegation for save/remove vehicle buttons
    $(document).on('click', '.save-vehicle-btn, .remove-vehicle-btn', function (e) {
      e.preventDefault();
      const $btn = $(this);
      const vehicleId = $btn.attr('data-vehicle-id'); // MongoDB ObjectId is a string, not an integer
      const currentlySaved = $btn.attr('data-is-saved') === 'true';
      // Toggle the save state
      GarageApp.toggleSaveVehicle(vehicleId, !currentlySaved);
    });
  },


  /**
   * Handle vehicle search
   */
  async handleSearch() {
    const registration = $('#regInput').val().trim().toUpperCase().replace(/\s/g, '');

    if (!registration) {
      this.showAlert('Please enter a registration number', 'error');
      return;
    }

    // Check rate limit
    if (!this.rateLimiter.canMakeRequest()) {
      const waitTime = Math.ceil(this.rateLimiter.getTimeUntilNext() / 1000);
      this.showAlert(`Rate limit reached. Please wait ${waitTime} seconds.`, 'error');
      return;
    }

    // Get search button
    const $searchBtn = $('#searchBtn');

    // Store original state before any changes
    const originalBtnHtml = '<span data-icon="search" data-icon-size="20"></span> Search';

    try {
      // Disable button and show spinner
      $searchBtn.prop('disabled', true);
      $searchBtn.html('<span data-icon="loader" data-icon-size="20" class="spinning"></span> Searching...');

      // Scan icons for the new loader
      if (Domma.icons) {
        Domma.icons.scan();
      }

      // Show loading state in results
      this.showLoading();

      // Make API request
      const vehicleData = await this.lookupVehicle(registration);

      // Record request for rate limiting
      this.rateLimiter.recordRequest();

      // Display vehicle
      this.displayVehicle(vehicleData);

      // Refresh history and garage (backend saved it automatically)
      await this.loadHistory();
      await this.loadGarage();

      // Switch to results tab
      this.switchTab('results');

    } catch (error) {
      // Check if it's a 404 (vehicle not found) vs actual error
      if (error.status === 404) {
        // Not an error - just no results found
        this.showNotFound(registration);
      } else {
        // Genuine error - log it
        console.error('Search error:', error);
        this.showError(error.message || 'Failed to lookup vehicle');
      }
    } finally {
      // Always re-enable button and restore text
      $searchBtn.prop('disabled', false);
      $searchBtn.html(originalBtnHtml);

      // Rescan icons to restore search icon
      if (Domma.icons) {
        Domma.icons.scan();
      }
    }
  },

  /**
   * Lookup vehicle via backend API (with caching)
   */
  async lookupVehicle(registration) {
    const response = await fetch(`${this.apiUrl}/dvla/vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Domma.auth.getHeaders()
      },
      body: JSON.stringify({registration})
    });

    if (!response.ok) {
      const data = await response.json();
      const error = new Error(data.message || 'Failed to lookup vehicle');
      error.status = response.status; // Include status code
      throw error;
    }

    const data = await response.json();

    // Return vehicle data with cache info
    return {
      ...data.vehicle,
      id: data.id,
      is_saved: data.is_saved,
      cached: data.cached || false,
      last_lookup: data.last_lookup
    };
  },

  /**
   * Load and display history from backend
   */
  async loadHistory() {
    if (!Domma.auth.isAuthenticated()) return;

    const $historyList = $('#historyList');

    try {
      const response = await fetch(`${this.apiUrl}/dvla/vehicles`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to load history');
      }

      const data = await response.json();
      const history = data.vehicles || [];

      if (history.length === 0) {
        $historyList.html(`
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <h3>No history yet</h3>
                        <p>Vehicles you search will appear here</p>
                    </div>
                `);
        return;
      }

      // Render history
      const html = history.map(vehicle => {
        const v = vehicle.data;
        const taxStatus = v.taxStatus === 'Taxed' ? 'success' :
          v.taxStatus === 'SORN' ? 'warning' : 'danger';
        const motStatus = v.motStatus === 'Valid' ? 'success' : 'danger';

        return `
                    <div class="history-item" data-id="${vehicle.id}" style="cursor: pointer; background: white; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; border: 2px solid #e5e7eb; transition: all 0.2s;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div>
                                <div class="history-item-reg" style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">${vehicle.vrn}</div>
                                <div class="history-item-make" style="font-size: 1rem; color: #4b5563; margin-top: 0.25rem;">
                                    ${v.make} ${v.colour || ''}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.875rem; color: #6b7280;">
                                    ${v.yearOfManufacture || 'N/A'}
                                </div>
                                <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">
                                    ${v.fuelType || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span class="badge badge-${taxStatus}" style="font-size: 0.75rem;">
                                Tax: ${v.taxStatus || 'Unknown'}
                            </span>
                            <span class="badge badge-${motStatus}" style="font-size: 0.75rem;">
                                MOT: ${v.motStatus || 'Unknown'}
                            </span>
                        </div>

                        <div class="history-item-date" style="font-size: 0.75rem; color: #9ca3af;">
                            <span data-icon="clock" data-icon-size="12" style="opacity: 0.7;"></span>
                            Searched ${this.formatRelativeDate(vehicle.searchedAt)}
                        </div>
                    </div>
                `;
      }).join('');

      $historyList.html(html);

      // Attach click handlers
      $('.history-item').each(function () {
        $(this).on('click', function () {
          const id = $(this).attr('data-id');
          const vehicle = history.find(v => v.id == id);
          if (vehicle) {
            GarageApp.displayVehicle({
              ...vehicle.data,
              id: vehicle.id,
              is_saved: vehicle.is_saved,
              cached: false
            });
            GarageApp.switchTab('results');
          }
        });
      });

      // Scan icons in history items
      if (Domma.icons) {
        Domma.icons.scan();
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  },

  /**
   * Load saved vehicles for "My Garage" tab
   */
  async loadGarage() {
    if (!Domma.auth.isAuthenticated()) {
      return;
    }

    const $garageList = $('#garageList');

    try {
      const response = await fetch(`${this.apiUrl}/dvla/vehicles/saved`, {
        headers: Domma.auth.getHeaders()
      });

      if (!response.ok) {
        console.error('Failed to load garage, status:', response.status);
        throw new Error('Failed to load garage');
      }

      const data = await response.json();
      this.garageVehicles = data.vehicles || [];

      // Set up search listener (only once)
      const $searchInput = $('#garageSearch');
      if ($searchInput.length > 0 && !$searchInput.data('listenerAttached')) {
        $searchInput.on('input', () => {
          this.filterGarage();
        });
        $searchInput.data('listenerAttached', true);
      }

      // Render all vehicles initially
      this.renderGarage(this.garageVehicles);
    } catch (error) {
      console.error('Failed to load garage:', error);
    }
  },

  /**
   * Filter garage vehicles based on search input
   */
  filterGarage() {
    const query = $('#garageSearch').val().toLowerCase().trim();

    if (!query) {
      // No search query, show all vehicles
      this.renderGarage(this.garageVehicles);
      $('#garageSearchCount').text('');
      return;
    }

    // Filter vehicles
    const filtered = this.garageVehicles.filter(vehicle => {
      const v = vehicle.data;
      const searchableText = [
        vehicle.vrn,
        v.make,
        v.colour,
        v.yearOfManufacture,
        v.fuelType,
        v.taxStatus,
        v.motStatus
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });

    // Update count
    const count = filtered.length;
    const total = this.garageVehicles.length;
    $('#garageSearchCount').text(
      count === total
        ? `Showing all ${total} vehicle${total !== 1 ? 's' : ''}`
        : `Found ${count} of ${total} vehicle${total !== 1 ? 's' : ''}`
    );

    // Render filtered results
    this.renderGarage(filtered);
  },

  /**
   * Render garage vehicles
   */
  renderGarage(vehicles) {
    const $garageList = $('#garageList');

    if (vehicles.length === 0) {
      const hasSearch = $('#garageSearch').val().trim();
      $garageList.html(`
                <div class="empty-state">
                    <div class="empty-state-icon">${hasSearch ? '🔍' : '🚗'}</div>
                    <h3>${hasSearch ? 'No vehicles found' : 'No saved vehicles'}</h3>
                    <p>${hasSearch ? 'Try a different search term' : 'Search for vehicles and save them to your garage'}</p>
                </div>
            `);
      return;
    }

    // Render saved vehicles with details
    const html = vehicles.map(vehicle => {
      const v = vehicle.data;
      const taxStatus = v.taxStatus === 'Taxed' ? 'success' :
        v.taxStatus === 'SORN' ? 'warning' : 'danger';
      const motStatus = v.motStatus === 'Valid' ? 'success' : 'danger';

      return `
                    <div class="vehicle-card" style="background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <div style="flex: 1;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">${vehicle.vrn}</div>
                                <div style="font-size: 1.125rem; color: #4b5563; font-weight: 600;">${v.make}</div>
                            </div>
                            <button class="btn-sm remove-vehicle-btn" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; white-space: nowrap;"
                                    data-vehicle-id="${vehicle.id}" data-is-saved="true">
                                <span data-icon="trash" data-icon-size="16"></span> Remove
                            </button>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
                            <div style="background: #f9fafb; padding: 0.75rem; border-radius: 6px;">
                                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; margin-bottom: 0.25rem;">COLOUR</div>
                                <div style="font-size: 0.875rem; color: #1f2937; font-weight: 600;">${v.colour || 'N/A'}</div>
                            </div>
                            <div style="background: #f9fafb; padding: 0.75rem; border-radius: 6px;">
                                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; margin-bottom: 0.25rem;">YEAR</div>
                                <div style="font-size: 0.875rem; color: #1f2937; font-weight: 600;">${v.yearOfManufacture || 'N/A'}</div>
                            </div>
                            <div style="background: #f9fafb; padding: 0.75rem; border-radius: 6px;">
                                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; margin-bottom: 0.25rem;">FUEL</div>
                                <div style="font-size: 0.875rem; color: #1f2937; font-weight: 600;">${v.fuelType || 'N/A'}</div>
                            </div>
                            <div style="background: #f9fafb; padding: 0.75rem; border-radius: 6px;">
                                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; margin-bottom: 0.25rem;">ENGINE</div>
                                <div style="font-size: 0.875rem; color: #1f2937; font-weight: 600;">${v.engineCapacity ? v.engineCapacity + 'cc' : 'N/A'}</div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <span class="status-badge ${taxStatus}" style="padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">
                                <span data-icon="${taxStatus === 'success' ? 'check' : 'alert-circle'}" data-icon-size="14"></span>
                                Tax: ${v.taxStatus || 'Unknown'}
                                ${v.taxDueDate ? `<br><span style="font-size: 0.7rem; opacity: 0.8;">Due: ${this.formatDate(v.taxDueDate)}</span>` : ''}
                            </span>
                            <span class="status-badge ${motStatus}" style="padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">
                                <span data-icon="${motStatus === 'success' ? 'check' : 'alert-circle'}" data-icon-size="14"></span>
                                MOT: ${v.motStatus || 'Unknown'}
                                ${v.motExpiryDate ? `<br><span style="font-size: 0.7rem; opacity: 0.8;">Expires: ${this.formatDate(v.motExpiryDate)}</span>` : ''}
                            </span>
                            ${v.co2Emissions ? `<span class="status-badge" style="background: #e0e7ff; color: #3730a3; padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">CO2: ${v.co2Emissions}g/km</span>` : ''}
                        </div>
                    </div>
                `;
    }).join('');

    $garageList.html(html);

    // Rescan icons after DOM update
    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Attach click handlers to vehicle items
    $('.garage-vehicle-item').each(function () {
      $(this).on('click', function () {
        const id = $(this).attr('data-id');
        const vehicle = vehicles.find(v => v.id == id);
        if (vehicle) {
          GarageApp.displayVehicle({
            ...vehicle.data,
            id: vehicle.id,
            is_saved: true,
            cached: false
          });
          GarageApp.switchTab('results');
        }
      });
    });
  },

  /**
   * Toggle vehicle saved status
   */
  async toggleSaveVehicle(vehicleId, isSaved) {
    try {
      const response = await fetch(`${this.apiUrl}/dvla/vehicles/${vehicleId}/save`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...Domma.auth.getHeaders()
        },
        body: JSON.stringify({is_saved: isSaved})
      });

      if (!response.ok) {
        throw new Error('Failed to update vehicle');
      }

      // Reload both tabs
      await this.loadGarage();
      await this.loadHistory();

      // Update current vehicle display if it's the same one
      if (this.currentVehicle && this.currentVehicle.id == vehicleId) {
        this.currentVehicle.is_saved = isSaved;
        this.displayVehicle(this.currentVehicle);
      }

      this.showAlert(
        isSaved ? 'Vehicle saved to garage' : 'Vehicle removed from garage',
        'success'
      );
    } catch (error) {
      this.showAlert('Failed to update vehicle', 'error');
    }
  },

  /**
   * Display vehicle details
   */
  displayVehicle(vehicle) {
    this.currentVehicle = vehicle;

    const $resultsTab = $('#resultsTab');

    // Determine status badges
    const motStatus = this.getMotStatus(vehicle);
    const taxStatus = this.getTaxStatus(vehicle);

    // Cache badge
    const cacheBadge = vehicle.cached
      ? `<span class="badge" style="background: #dbeafe; color: #1e40af; padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                 <span data-icon="clock" data-icon-size="14"></span> Cached Data
               </span>`
      : '';

    // Save/Remove button
    const saveButton = vehicle.is_saved
      ? `<button class="btn remove-vehicle-btn" style="background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;"
                       data-vehicle-id="${vehicle.id}" data-is-saved="true">
                 <span data-icon="trash" data-icon-size="18"></span> Remove from Garage
               </button>`
      : `<button class="btn save-vehicle-btn" style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;"
                       data-vehicle-id="${vehicle.id}" data-is-saved="false">
                 <span data-icon="bookmark" data-icon-size="18"></span> Save to Garage
               </button>`;

    $resultsTab.html(`
            <div class="vehicle-card">
                <div class="vehicle-header">
                    <div>
                        <div class="vehicle-reg">${vehicle.registrationNumber}</div>
                        <div class="vehicle-make-model">${vehicle.make}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                        ${cacheBadge}
                        <div class="status-badges">
                            ${motStatus}
                            ${taxStatus}
                        </div>
                        ${saveButton}
                    </div>
                </div>

                <div class="vehicle-details">
                    <div class="detail-item">
                        <div class="detail-label">Make</div>
                        <div class="detail-value">${vehicle.make}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Colour</div>
                        <div class="detail-value">${vehicle.colour || 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Year</div>
                        <div class="detail-value">${vehicle.yearOfManufacture}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Fuel Type</div>
                        <div class="detail-value">${vehicle.fuelType}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Engine Size</div>
                        <div class="detail-value">${vehicle.engineCapacity}cc</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">CO2 Emissions</div>
                        <div class="detail-value">${vehicle.co2Emissions}g/km</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">MOT Status</div>
                        <div class="detail-value">${vehicle.motStatus}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">MOT Expiry</div>
                        <div class="detail-value">${this.formatDate(vehicle.motExpiryDate)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Tax Status</div>
                        <div class="detail-value">${vehicle.taxStatus}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Tax Due</div>
                        <div class="detail-value">${this.formatDate(vehicle.taxDueDate)}</div>
                    </div>
                </div>
            </div>
        `);

    // Rescan icons after DOM update
    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Get MOT status badge
   */
  getMotStatus(vehicle) {
    if (!vehicle.motStatus) return '';

    const status = vehicle.motStatus.toLowerCase();
    let badgeClass = 'success';

    if (status.includes('not') || status.includes('no')) {
      badgeClass = 'danger';
    } else if (status.includes('due')) {
      badgeClass = 'warning';
    }

    return `<span class="status-badge ${badgeClass}">MOT: ${vehicle.motStatus}</span>`;
  },

  /**
   * Get tax status badge
   */
  getTaxStatus(vehicle) {
    if (!vehicle.taxStatus) return '';

    const status = vehicle.taxStatus.toLowerCase();
    let badgeClass = 'success';

    if (status.includes('sorn') || status.includes('untaxed')) {
      badgeClass = 'warning';
    }

    return `<span class="status-badge ${badgeClass}">Tax: ${vehicle.taxStatus}</span>`;
  },

  /**
   * Switch between tabs
   */
  async switchTab(tabName) {
    // Update tab buttons
    $('.tab-pill').each(function () {
      const $this = $(this);
      if ($this.attr('data-tab') === tabName) {
        $this.addClass('active');
      } else {
        $this.removeClass('active');
      }
    });

    // Update tab content
    $('.tab-content').each(function () {
      const $this = $(this);
      const contentId = $this.attr('id');

      if (contentId === `${tabName}Tab`) {
        $this.addClass('active');
      } else {
        $this.removeClass('active');
      }
    });

    // Reload data when switching to specific tabs
    if (tabName === 'garage') {
      await this.loadGarage();
    } else if (tabName === 'history') {
      await this.loadHistory();
    }
  },

  /**
   * Show loading state
   */
  showLoading() {
    const $resultsTab = $('#resultsTab');
    $resultsTab.html(`
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `);
  },

  /**
   * Show error message
   */
  showError(message) {
    const $resultsTab = $('#resultsTab');
    $resultsTab.html(`
            <div class="alert alert-error">
                <span data-icon="alert-circle" data-icon-size="20"></span>
                <strong>Error:</strong> ${message}
            </div>
        `);

    // Rescan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Show vehicle not found message
   */
  showNotFound(registration) {
    const $resultsTab = $('#resultsTab');
    $resultsTab.html(`
            <div class="not-found-container">
                <div class="not-found-icon">
                    <span data-icon="search" data-icon-size="64" style="color: #3b82f6;"></span>
                </div>
                <h3 style="color: #1f2937; margin-top: 1.5rem; margin-bottom: 0.5rem;">Vehicle Not Found</h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">
                    We couldn't find any information for registration <strong>${registration}</strong>
                </p>
                <div class="alert alert-info" style="text-align: left; margin-top: 1rem;">
                    <span data-icon="info" data-icon-size="20"></span>
                    <div>
                        <strong>Please check:</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
                            <li>The registration is entered correctly</li>
                            <li>The vehicle is registered in the UK</li>
                            <li>There are no spaces or special characters</li>
                        </ul>
                    </div>
                </div>
            </div>
        `);

    // Rescan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  },

  /**
   * Show alert message
   */
  showAlert(message, type = 'info') {
    const $alertContainer = $('#alertContainer');

    const alertClass = type === 'error' ? 'alert-error' : 'alert-info';
    const icon = type === 'error' ? 'alert-circle' : 'check-circle';

    $alertContainer.html(`
            <div class="alert ${alertClass}">
                <span data-icon="${icon}" data-icon-size="20"></span>
                ${message}
            </div>
        `);

    // Rescan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }

    // Clear after 5 seconds
    setTimeout(() => {
      $alertContainer.html('');
    }, 5000);
  },

  /**
   * Format date using Domma dates
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';

    // Use Domma dates if available, otherwise fallback
    if (typeof D !== 'undefined') {
      return D(dateString).format('D MMM YYYY');
    }

    // Fallback to native Date
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Format relative date
   */
  formatRelativeDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return this.formatDate(dateString);
  }
};

// Initialize app when DOM is ready
window.GarageApp = GarageApp;

// Since scripts use defer, DOM is ready - init now
document.addEventListener('DOMContentLoaded', () => {
  GarageApp.init();
});
