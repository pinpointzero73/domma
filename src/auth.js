/**
 * Domma Authentication Module
 * Reusable authentication with JWT tokens, event system, and UI components
 */

import Component from './component.js';
import {storage} from './storage.js';
import {http} from './http.js';

/**
 * Options for `A.init()`.
 * @typedef {object} AuthOptions
 * @property {string} [apiUrl] - Backend API URL (default: `http://<host>:3000/api` on localhost, else `<origin>/api`)
 * @property {string} [storageKey='auth_token'] - Storage key for the token
 * @property {string} [userStorageKey='auth_user'] - Storage key for the user object
 * @property {boolean} [autoCheck=true] - Verify a stored token with `GET <apiUrl>/auth/me` on init
 */

/**
 * The signed-in user, as the backend returned it (`response.user` from login, register or
 * `/auth/me`). Domma reads `email` and `role`; anything else is the backend's.
 * @typedef {{email?: string, name?: string, role?: string, [key: string]: any}} AuthUser
 */

/**
 * Events `A.on()` can listen for: `login` / `register` (data: the user), `logout` (null),
 * `error` (the message string) and `tokenExpired` (null - a stored token the server refused on init).
 * @typedef {'login'|'register'|'logout'|'error'|'tokenExpired'} AuthEventName
 */

/**
 * An auth event handler. Gets the event's data (see AuthEventName).
 * @callback AuthEventHandler
 * @param {any} data
 * @returns {void}
 */

/**
 * The auth module (`A`, `Domma.auth`).
 * @typedef {object} Auth
 * @property {string|null} apiUrl - Backend API URL (set by init)
 * @property {string|null} token - Current JWT, or null
 * @property {AuthUser|null} user - Current user, or null
 * @property {AuthOptions} config - Resolved configuration (set by init)
 * @property {Record<string, AuthEventHandler[]>} eventHandlers - Registered handlers by event name
 * @property {boolean} initialized - Whether init() has run
 * @property {(config?: AuthOptions) => void} init - Initialise the module: load the stored token and user, and (autoCheck) verify the token
 * @property {(email: string, password: string) => Promise<AuthUser>} login - Log in (`POST <apiUrl>/auth/login`); stores the token and user and emits `login`. Rejects on failure (and emits `error`)
 * @property {(email: string, password: string, name: string) => Promise<AuthUser>} register - Register (`POST <apiUrl>/auth/register`); stores the token and user and emits `register`. Rejects on failure (and emits `error`)
 * @property {() => void} logout - Clear the token and user and emit `logout`
 * @property {() => AuthUser|null} getUser - Current user or null
 * @property {() => boolean} isAuthenticated - True when there is both a token and a user
 * @property {() => {Authorization?: string}} getHeaders - `{Authorization: 'Bearer <token>'}`, or `{}` without a token
 * @property {() => string|null} getApiUrl - The backend API URL
 * @property {() => string|null} getRole - Current user's role ('admin', 'subscriber', 'guest') or null
 * @property {(role: string) => boolean} hasRole - Whether the user has this role
 * @property {(roles: string[]) => boolean} hasAnyRole - Whether the user has any of these roles
 * @property {() => boolean} isAdmin - Role is 'admin'
 * @property {() => boolean} isSubscriber - Role is 'subscriber'
 * @property {() => boolean} isGuest - Role is 'guest'
 * @property {(event: AuthEventName|(string & {}), callback: AuthEventHandler) => void} on - Subscribe to an event
 * @property {(event: AuthEventName|(string & {}), callback?: AuthEventHandler) => void} off - Unsubscribe one handler, or every handler of the event when none is given
 * @property {typeof LoginForm} LoginForm - Login form component class
 * @property {typeof RegisterForm} RegisterForm - Registration form component class
 * @property {typeof AuthTabs} AuthTabs - Login/Register tab switcher component class
 * @property {typeof UserInfo} UserInfo - Signed-in user display with a logout button
 * @property {(selector: string|HTMLElement, options?: LoginFormOptions) => LoginForm} createLoginForm - Create a LoginForm
 * @property {(selector: string|HTMLElement, options?: RegisterFormOptions) => RegisterForm} createRegisterForm - Create a RegisterForm
 * @property {(selector: string|HTMLElement, options?: AuthTabsOptions) => AuthTabs} createAuthTabs - Create an AuthTabs
 * @property {(selector: string|HTMLElement, options?: UserInfoOptions) => UserInfo} createUserInfo - Create a UserInfo
 */

/**
 * Options for `A.createLoginForm()` / `new A.LoginForm()`.
 * @typedef {object} LoginFormOptions
 * @property {string} [emailPlaceholder='your@email.com']
 * @property {string} [passwordPlaceholder='Enter your password']
 * @property {string} [buttonText='Login']
 * @property {boolean} [showLabels=true]
 * @property {((email: string, password: string) => void)|null} [onSubmit] - Called before the login request
 * @property {((user: AuthUser|null) => void)|null} [onSuccess] - Called after a successful login
 * @property {((error: Error) => void)|null} [onError] - Called when the login fails
 */

/**
 * Options for `A.createRegisterForm()` / `new A.RegisterForm()`.
 * @typedef {object} RegisterFormOptions
 * @property {string} [namePlaceholder='Your name']
 * @property {string} [emailPlaceholder='your@email.com']
 * @property {string} [passwordPlaceholder='Create a password']
 * @property {string} [buttonText='Register']
 * @property {number} [minPasswordLength=6]
 * @property {boolean} [showLabels=true]
 * @property {((email: string, password: string, name: string) => void)|null} [onSubmit] - Called before the register request
 * @property {((user: AuthUser|null) => void)|null} [onSuccess] - Called after a successful registration
 * @property {((error: Error) => void)|null} [onError] - Called when registration fails (also for mismatched passwords)
 */

/**
 * Options for `A.createAuthTabs()` / `new A.AuthTabs()`.
 * @typedef {object} AuthTabsOptions
 * @property {'login'|'register'} [activeTab='login']
 * @property {string} [loginText='Login']
 * @property {string} [registerText='Register']
 * @property {((tab: string) => void)|null} [onChange] - Called with the tab switched to
 */

/**
 * Options for `A.createUserInfo()` / `new A.UserInfo()`.
 * @typedef {object} UserInfoOptions
 * @property {boolean} [showIcon=true]
 * @property {boolean} [showRole=true]
 * @property {string} [logoutText='Logout']
 * @property {(() => void)|null} [onLogout] - Called after the logout button logs out
 */

/** @type {Auth} */
export const auth = {
  // State
  apiUrl: null,
  token: null,
  user: null,
  config: {},
  eventHandlers: {},
  initialized: false,

  /**
   * Initialize auth module
   * @param {Object} config - Configuration object
   * @param {string} config.apiUrl - Backend API URL
   * @param {string} [config.storageKey='auth_token'] - localStorage key for token
   * @param {boolean} [config.autoCheck=true] - Auto-verify token on init
   */
  init(config = {}) {
    this.config = {
      apiUrl: config.apiUrl || (() => {
        if (typeof window === 'undefined') return 'http://localhost:3000/api';
        const { hostname, origin } = window.location;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        return isLocalhost ? `http://${hostname}:3000/api` : `${origin}/api`;
      })(),
      storageKey: config.storageKey || 'auth_token',
      userStorageKey: config.userStorageKey || 'auth_user',
      autoCheck: config.autoCheck !== false
    };

    this.apiUrl = this.config.apiUrl;

    // Load stored token and user
    this.token = storage.get(this.config.storageKey);
    this.user = storage.get(this.config.userStorageKey);

    // Auto-verify token if present
    if (this.config.autoCheck && this.token) {
      this._verifyToken().catch((error) => {
        // _verifyToken has already cleared a refused token; an outage keeps it.
        if (this._isTokenRejection(error)) this.emit('tokenExpired', null);
      });
    }

    this.initialized = true;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object
   */
  async login(email, password) {
    if (!this.initialized) {
      throw new Error('Auth module not initialized. Call auth.init() first.');
    }

    try {
      const response = await http.post(`${this.apiUrl}/auth/login`, {
        email,
        password
      });

      if (!response.success || !response.token) {
        throw new Error(response.message || 'Login failed');
      }

      // Store token and user
      this.token = response.token;
      this.user = response.user;
      this._storeToken(this.token);
      this._storeUser(this.user);

      // Emit login event
      this.emit('login', this.user);

      return this.user;
    } catch (error) {
      this.emit('error', error.message || 'Login failed');
      throw error;
    }
  },

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise<Object>} User object
   */
  async register(email, password, name) {
    if (!this.initialized) {
      throw new Error('Auth module not initialized. Call auth.init() first.');
    }

    try {
      const response = await http.post(`${this.apiUrl}/auth/register`, {
        email,
        password,
        name
      });

      if (!response.success || !response.token) {
        throw new Error(response.message || 'Registration failed');
      }

      // Store token and user
      this.token = response.token;
      this.user = response.user;
      this._storeToken(this.token);
      this._storeUser(this.user);

      // Emit register event
      this.emit('register', this.user);

      return this.user;
    } catch (error) {
      this.emit('error', error.message || 'Registration failed');
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    this.token = null;
    this.user = null;
    this._clearToken();
    this._clearUser();

    // Emit logout event
    this.emit('logout', null);
  },

  /**
   * Get current user
   * @returns {Object|null} User object or null
   */
  getUser() {
    return this.user;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.token && !!this.user;
  },

  /**
   * Get authorization headers for API requests
   * @returns {Object} Headers object with Authorization
   */
  getHeaders() {
    if (!this.token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${this.token}`
    };
  },

  getApiUrl() {
    return this.apiUrl;
  },

  /**
   * Get current user role
   * @returns {string|null} Role ('admin', 'subscriber', 'guest') or null
   */
  getRole() {
    return this.user?.role || null;
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(role) {
    return this.user?.role === role;
  },

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Roles to check
   * @returns {boolean}
   */
  hasAnyRole(roles) {
    return roles.includes(this.user?.role);
  },

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.user?.role === 'admin';
  },

  /**
   * Check if user is subscriber
   * @returns {boolean}
   */
  isSubscriber() {
    return this.user?.role === 'subscriber';
  },

  /**
   * Check if user is guest
   * @returns {boolean}
   */
  isGuest() {
    return this.user?.role === 'guest';
  },

  /**
   * Verify token with backend
   * @returns {Promise<Object>} User object
   * @private
   */
  async _verifyToken() {
    if (!this.token) {
      throw new Error('No token to verify');
    }

    try {
      const response = await http.get(`${this.apiUrl}/auth/me`, {
        headers: this.getHeaders(),
        silent: true  // Don't log 401 errors - expected when user not logged in
      });

      if (!response || !response.success || !response.user) {
        const refused = new Error('Token verification failed');
        refused.tokenRejected = true;
        throw refused;
      }

      this.user = response.user;
      this._storeUser(this.user);

      return this.user;
    } catch (error) {
      // Only the server refusing the token ends the session. A network error or
      // a 5xx says nothing about the token, so it is kept for the next check.
      if (this._isTokenRejection(error)) {
        error.tokenRejected = true;
        this._clearToken();
        this._clearUser();
      }
      throw error;
    }
  },

  /**
   * Whether a verification error means the server refused the token
   * (401/403, or an answer saying it is not valid) - not an outage.
   * @param {Error} error
   * @returns {boolean}
   * @private
   */
  _isTokenRejection(error) {
    return !!error && (error.tokenRejected === true || error.status === 401 || error.status === 403);
  },

  /**
   * Store token in localStorage
   * @param {string} token - JWT token
   * @private
   */
  _storeToken(token) {
    storage.set(this.config.storageKey, token);
  },

  /**
   * Store user in localStorage
   * @param {Object} user - User object
   * @private
   */
  _storeUser(user) {
    storage.set(this.config.userStorageKey, user);
  },

  /**
   * Clear token from localStorage
   * @private
   */
  _clearToken() {
    storage.remove(this.config.storageKey);
    this.token = null;
  },

  /**
   * Clear user from localStorage
   * @private
   */
  _clearUser() {
    storage.remove(this.config.userStorageKey);
    this.user = null;
  },

  // ============================================
  // Event System
  // ============================================

  /**
   * Subscribe to event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  },

  /**
   * Unsubscribe from event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.eventHandlers[event]) return;

    if (callback) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        handler => handler !== callback
      );
    } else {
      // Remove all handlers for this event
      this.eventHandlers[event] = [];
    }
  },

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Data to pass to handlers
   * @private
   */
  emit(event, data) {
    if (!this.eventHandlers[event]) return;

    this.eventHandlers[event].forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in auth event handler for '${event}':`, error);
      }
    });
  }
};

// ============================================
// UI Components
// ============================================

/**
 * LoginForm Component
 */
export class LoginForm extends Component {
    static componentName = 'login-form';

  static defaults = {
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'Enter your password',
    buttonText: 'Login',
    showLabels: true,
    onSubmit: null,
    onSuccess: null,
    onError: null
  };

  /**
   * @param {string|HTMLElement} selector - Container element or selector
   * @param {LoginFormOptions} [options]
   */
  constructor(selector, options = {}) {
    super(selector, options);
    this._init();
  }

  _init() {
    if (!this.element) return;

    // Render form
    this.render();

    // Attach submit handler
    const form = this.element.querySelector('form');
    if (form) {
      this._addEventListener(form, 'submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }
  }

  render() {
    const opts = this.options;
    const html = `
            <form class="auth-login-form">
                <div class="form-group">
                    ${opts.showLabels ? '<label class="form-label">Email</label>' : ''}
                    <input
                        type="email"
                        class="form-input"
                        name="email"
                        placeholder="${opts.emailPlaceholder}"
                        required>
                </div>
                <div class="form-group">
                    ${opts.showLabels ? '<label class="form-label">Password</label>' : ''}
                    <input
                        type="password"
                        class="form-input"
                        name="password"
                        placeholder="${opts.passwordPlaceholder}"
                        required>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">${opts.buttonText}</button>
            </form>
        `;
    this.element.innerHTML = html;
  }

  async handleSubmit() {
    const form = this.element.querySelector('form');
    const email = form.querySelector('[name="email"]').value;
    const password = form.querySelector('[name="password"]').value;

    if (this.options.onSubmit) {
      this.options.onSubmit(email, password);
    }

    try {
      await auth.login(email, password);
      if (this.options.onSuccess) {
        this.options.onSuccess(auth.getUser());
      }
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
    }
  }
}

/**
 * RegisterForm Component
 */
export class RegisterForm extends Component {
    static componentName = 'register-form';

  static defaults = {
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'Create a password',
    buttonText: 'Register',
    minPasswordLength: 6,
    showLabels: true,
    onSubmit: null,
    onSuccess: null,
    onError: null
  };

  /**
   * @param {string|HTMLElement} selector - Container element or selector
   * @param {RegisterFormOptions} [options]
   */
  constructor(selector, options = {}) {
    super(selector, options);
    this._init();
  }

  _init() {
    if (!this.element) return;

    // Render form
    this.render();

    // Attach submit handler
    const form = this.element.querySelector('form');
    if (form) {
      this._addEventListener(form, 'submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }
  }

  render() {
    const opts = this.options;
    const html = `
            <form class="auth-register-form">
                <div class="form-group">
                    ${opts.showLabels ? '<label class="form-label">Name</label>' : ''}
                    <input
                        type="text"
                        class="form-input"
                        name="name"
                        placeholder="${opts.namePlaceholder}"
                        required>
                </div>
                <div class="form-group">
                    ${opts.showLabels ? '<label class="form-label">Email</label>' : ''}
                    <input
                        type="email"
                        class="form-input"
                        name="email"
                        placeholder="${opts.emailPlaceholder}"
                        required>
                </div>
                <div class="form-group">
                    ${opts.showLabels ? '<label class="form-label">Password</label>' : ''}
                    <input
                        type="password"
                        class="form-input"
                        name="password"
                        placeholder="${opts.passwordPlaceholder}"
                        minlength="${opts.minPasswordLength}"
                        required>
                </div>
                <div class="form-group">
                    ${opts.showLabels ? '<label class="form-label">Confirm Password</label>' : ''}
                    <input
                        type="password"
                        class="form-input"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        minlength="${opts.minPasswordLength}"
                        required>
                </div>
                <!-- Honeypot field - hidden from users, bots will fill it -->
                <div class="form-group" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
                    <label for="website">Website</label>
                    <input
                        type="text"
                        class="form-input"
                        name="website"
                        id="website"
                        tabindex="-1"
                        autocomplete="off">
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">${opts.buttonText}</button>
            </form>
        `;
    this.element.innerHTML = html;
  }

  async handleSubmit() {
    const form = this.element.querySelector('form');
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const password = form.querySelector('[name="password"]').value;
    const confirmPassword = form.querySelector('[name="confirmPassword"]').value;
    const website = form.querySelector('[name="website"]').value;

    // Honeypot check - if website field is filled, it's likely a bot
    if (website) {
      console.warn('[Auth] Honeypot triggered - possible bot detected');
      // Silently fail or show generic error to not alert the bot
      if (this.options.onError) {
        this.options.onError(new Error('Registration failed. Please try again.'));
      }
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      if (this.options.onError) {
        this.options.onError(new Error('Passwords do not match. Please try again.'));
      }
      return;
    }

    if (this.options.onSubmit) {
      this.options.onSubmit(email, password, name);
    }

    try {
      await auth.register(email, password, name);
      if (this.options.onSuccess) {
        this.options.onSuccess(auth.getUser());
      }
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
    }
  }
}

/**
 * AuthTabs Component
 */
export class AuthTabs extends Component {
    static componentName = 'auth-tabs';

  static defaults = {
    activeTab: 'login',
    loginText: 'Login',
    registerText: 'Register',
    onChange: null
  };

  /**
   * @param {string|HTMLElement} selector - Container element or selector
   * @param {AuthTabsOptions} [options]
   */
  constructor(selector, options = {}) {
    super(selector, options);
    this._init();
  }

  _init() {
    if (!this.element) return;

    // Render tabs
    this.render();

    // Attach click handlers
    const tabs = this.element.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
      this._addEventListener(tab, 'click', () => {
        this.switchTab(tab.getAttribute('data-tab'));
      });
    });
  }

  render() {
    const opts = this.options;
    const html = `
            <div class="btn-group btn-group-block" style="margin-bottom: 1.5rem;">
                <button class="btn ${opts.activeTab === 'login' ? 'active' : ''}" data-tab="login">
                    ${opts.loginText}
                </button>
                <button class="btn ${opts.activeTab === 'register' ? 'active' : ''}" data-tab="register">
                    ${opts.registerText}
                </button>
            </div>
        `;
    this.element.innerHTML = html;
  }

  /**
   * @param {string} tab - 'login' or 'register'
   */
  switchTab(tab) {
    this.options.activeTab = tab;

    // Update active states
    const tabs = this.element.querySelectorAll('[data-tab]');
    tabs.forEach(t => {
      if (t.getAttribute('data-tab') === tab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Trigger callback
    if (this.options.onChange) {
      this.options.onChange(tab);
    }
  }
}

/**
 * UserInfo Component
 */
export class UserInfo extends Component {
    static componentName = 'user-info';

  static defaults = {
    showIcon: true,
    showRole: true,
    logoutText: 'Logout',
    onLogout: null
  };

  _init() {
    if (!this.element) return;

    // Render user info
    this.render();

    // Attach logout handler
    const logoutBtn = this.element.querySelector('.auth-logout-btn');
    if (logoutBtn) {
      this._addEventListener(logoutBtn, 'click', () => {
        this.handleLogout();
      });
    }

    // Listen for auth changes
    auth.on('login', () => this.render());
    auth.on('logout', () => this.render());
  }

  render() {
    const opts = this.options;
    const user = auth.getUser();

    if (!user) {
      this.element.innerHTML = '';
      return;
    }

    // Clear existing content
    this.element.innerHTML = '';

    // Create container
    const container = document.createElement('div');
    container.className = 'auth-user-info';

    // Create email span
    const emailSpan = document.createElement('span');
    emailSpan.className = 'auth-user-email';

    // Add icon if enabled
    if (opts.showIcon) {
      const iconSpan = document.createElement('span');
      iconSpan.setAttribute('data-icon', 'user');
      iconSpan.setAttribute('data-icon-size', '18');
      emailSpan.appendChild(iconSpan);
    }

    // Add email text (safely)
    const emailText = document.createTextNode(user.email);
    emailSpan.appendChild(emailText);

    // Add role badge if enabled and role exists
    if (opts.showRole !== false && user.role) {
      const roleBadgeClass = {
        admin: 'badge-danger',
        subscriber: 'badge-primary',
        guest: 'badge-secondary'
      }[user.role] || 'badge-secondary';

      const badge = document.createElement('span');
      badge.className = `badge ${roleBadgeClass}`;
      badge.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      emailSpan.appendChild(badge);
    }

    // Create logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'auth-logout-btn';
    logoutBtn.textContent = opts.logoutText;

    // Assemble
    container.appendChild(emailSpan);
    container.appendChild(logoutBtn);
    this.element.appendChild(container);
  }

  handleLogout() {
    auth.logout();
    if (this.options.onLogout) {
      this.options.onLogout();
    }
  }
}

// Export components on auth object
auth.LoginForm = LoginForm;
auth.RegisterForm = RegisterForm;
auth.AuthTabs = AuthTabs;
auth.UserInfo = UserInfo;

// Convenience factory methods
auth.createLoginForm = (selector, options) => new LoginForm(selector, options);
auth.createRegisterForm = (selector, options) => new RegisterForm(selector, options);
auth.createAuthTabs = (selector, options) => new AuthTabs(selector, options);
auth.createUserInfo = (selector, options) => new UserInfo(selector, options);
