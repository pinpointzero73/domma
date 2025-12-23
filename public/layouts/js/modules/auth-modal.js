/**
 * Auth Modal Module
 * Handles navbar authentication UI (login/logout modal)
 */

export const AuthModal = {
  modal: null,

  /**
   * Initialize auth modal in navbar
   */
  init() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'authModal';
    modalContainer.className = 'modal';

    // Build modal structure using DOM methods for security
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h3');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Account';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('data-dismiss', 'modal');
    closeBtn.textContent = '×';

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);

    // Body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    // Logged In View
    const loggedInView = this.createLoggedInView();

    // Logged Out View
    const loggedOutView = this.createLoggedOutView();

    modalBody.appendChild(loggedInView);
    modalBody.appendChild(loggedOutView);

    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modalContainer.appendChild(modalDialog);

    // Inject into page
    document.body.appendChild(modalContainer);

    // Initialize Domma modal
    if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.modal) {
      this.modal = Domma.elements.modal('#authModal', {
        backdrop: true,
        backdropClose: true,
        keyboard: true
      });
    }

    // Initialize auth forms after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.initForms();

      // Listen to auth events
      this.bindAuthEvents();

      // Set initial state
      this.updateUI();
    }, 100);
  },

  /**
   * Create logged in view using safe DOM methods
   */
  createLoggedInView() {
    const loggedInView = document.createElement('div');
    loggedInView.id = 'authModalLoggedIn';
    loggedInView.style.display = 'none';

    // User display container
    const userDisplay = document.createElement('div');
    userDisplay.className = 'auth-user-display';

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'auth-user-avatar';
    const avatarIcon = document.createElement('span');
    avatarIcon.setAttribute('data-icon', 'user');
    avatarIcon.setAttribute('data-icon-size', '48');
    avatar.appendChild(avatarIcon);

    // User details
    const userDetails = document.createElement('div');
    userDetails.className = 'auth-user-details';

    const userName = document.createElement('div');
    userName.className = 'auth-user-name';
    userName.id = 'authModalUserName';

    const userEmail = document.createElement('div');
    userEmail.className = 'auth-user-email';
    userEmail.id = 'authModalUserEmail';

    const roleContainer = document.createElement('div');
    roleContainer.className = 'auth-user-role';
    const roleBadge = document.createElement('span');
    roleBadge.className = 'badge';
    roleBadge.id = 'authModalUserRole';
    roleContainer.appendChild(roleBadge);

    userDetails.appendChild(userName);
    userDetails.appendChild(userEmail);
    userDetails.appendChild(roleContainer);

    userDisplay.appendChild(avatar);
    userDisplay.appendChild(userDetails);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'auth-actions';
    actions.style.marginTop = '1.5rem';

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-danger btn-block';
    logoutBtn.id = 'authModalLogout';
    logoutBtn.textContent = 'Logout';

    actions.appendChild(logoutBtn);

    loggedInView.appendChild(userDisplay);
    loggedInView.appendChild(actions);

    return loggedInView;
  },

  /**
   * Create logged out view using safe DOM methods
   */
  createLoggedOutView() {
    const loggedOutView = document.createElement('div');
    loggedOutView.id = 'authModalLoggedOut';
    loggedOutView.style.display = 'none';

    const tabsContainer = document.createElement('div');
    tabsContainer.id = 'authModalTabs';

    const loginFormContainer = document.createElement('div');
    loginFormContainer.id = 'authModalLoginForm';

    const registerFormContainer = document.createElement('div');
    registerFormContainer.id = 'authModalRegisterForm';

    loggedOutView.appendChild(tabsContainer);
    loggedOutView.appendChild(loginFormContainer);
    loggedOutView.appendChild(registerFormContainer);

    return loggedOutView;
  },

  /**
   * Initialize auth forms
   */
  initForms() {
    console.log('[AuthModal] initForms() called');
    console.log('[AuthModal] Domma available?', typeof Domma !== 'undefined');
    console.log('[AuthModal] Domma.auth available?', typeof Domma !== 'undefined' && !!Domma.auth);
    console.log('[AuthModal] Domma.auth.initialized?', typeof Domma !== 'undefined' && Domma.auth && Domma.auth.initialized);

    if (typeof Domma === 'undefined' || !Domma.auth) {
      console.error('[AuthModal] ERROR: Domma.auth not available');
      // Show error message in modal
      const modalBody = document.querySelector('#authModal .modal-body');
      if (modalBody) {
        modalBody.innerHTML = '<div class="alert alert-danger">Authentication system not loaded. Please refresh the page.</div>';
      }
      return;
    }

    if (!Domma.auth.initialized) {
      console.error('[AuthModal] ERROR: Domma.auth not initialized');
      const modalBody = document.querySelector('#authModal .modal-body');
      if (modalBody) {
        modalBody.innerHTML = '<div class="alert alert-danger">Authentication system not initialized. Please refresh the page.</div>';
      }
      return;
    }

    console.log('[AuthModal] Creating auth tabs...');
    try {
      // Create tabs
      const tabsInstance = Domma.auth.createAuthTabs('#authModalTabs', {
        activeTab: 'login',
        onChange: (tab) => {
          // Show/hide forms based on active tab
          const loginForm = document.getElementById('authModalLoginForm');
          const registerForm = document.getElementById('authModalRegisterForm');

          if (loginForm && registerForm) {
            loginForm.style.display = tab === 'login' ? 'block' : 'none';
            registerForm.style.display = tab === 'register' ? 'block' : 'none';
          }
        }
      });
      console.log('[AuthModal] Auth tabs created successfully', tabsInstance);
      console.log('[AuthModal] Tabs content:', document.getElementById('authModalTabs').innerHTML);
    } catch (error) {
      console.error('[AuthModal] ERROR creating auth tabs:', error);
    }

    console.log('[AuthModal] Creating login form...');
    try {
      // Create login form
      const loginFormInstance = Domma.auth.createLoginForm('#authModalLoginForm', {
        showLabels: true,
        onSuccess: () => {
          if (this.modal) {
            this.modal.close();
          }
          if (Domma.elements && Domma.elements.toast) {
            Domma.elements.toast('Login successful!', {type: 'success'});
          }
        },
        onError: (error) => {
          if (Domma.elements && Domma.elements.toast) {
            Domma.elements.toast(error.message || 'Login failed', {type: 'error'});
          }
        }
      });
      console.log('[AuthModal] Login form created successfully', loginFormInstance);

      // Check if form was actually rendered
      setTimeout(() => {
        const formContent = document.getElementById('authModalLoginForm').innerHTML;
        console.log('[AuthModal] Login form content after 50ms:', formContent);
      }, 50);
    } catch (error) {
      console.error('[AuthModal] ERROR creating login form:', error);
    }

    console.log('[AuthModal] Creating register form...');
    try {
      // Create register form
      const registerFormInstance = Domma.auth.createRegisterForm('#authModalRegisterForm', {
        showLabels: true,
        onSuccess: () => {
          if (this.modal) {
            this.modal.close();
          }
          if (Domma.elements && Domma.elements.toast) {
            Domma.elements.toast('Registration successful!', {type: 'success'});
          }
        },
        onError: (error) => {
          if (Domma.elements && Domma.elements.toast) {
            Domma.elements.toast(error.message || 'Registration failed', {type: 'error'});
          }
        }
      });
      console.log('[AuthModal] Register form created successfully', registerFormInstance);

      // Check if form was actually rendered
      setTimeout(() => {
        const formContent = document.getElementById('authModalRegisterForm').innerHTML;
        console.log('[AuthModal] Register form content after 50ms:', formContent);
      }, 50);
    } catch (error) {
      console.error('[AuthModal] ERROR creating register form:', error);
    }

    // Set initial form visibility (login form visible, register form hidden)
    const loginForm = document.getElementById('authModalLoginForm');
    const registerForm = document.getElementById('authModalRegisterForm');
    console.log('[AuthModal] Login form element:', loginForm);
    console.log('[AuthModal] Register form element:', registerForm);

    if (loginForm) {
      loginForm.style.display = 'block';
      console.log('[AuthModal] Set login form to visible');
    }
    if (registerForm) {
      registerForm.style.display = 'none';
      console.log('[AuthModal] Set register form to hidden');
    }

    console.log('[AuthModal] initForms() completed');
  },

  /**
   * Bind auth event listeners
   */
  bindAuthEvents() {
    // Logout button
    const logoutBtn = document.getElementById('authModalLogout');
    if (logoutBtn && typeof Domma !== 'undefined' && Domma.auth) {
      logoutBtn.addEventListener('click', () => {
        Domma.auth.logout();
        if (this.modal) {
          this.modal.close();
        }
        if (Domma.elements && Domma.elements.toast) {
          Domma.elements.toast('Logged out successfully', {type: 'info'});
        }
      });
    }

    // Auth state changes
    if (typeof Domma !== 'undefined' && Domma.auth) {
      Domma.auth.on('login', () => this.updateUI());
      Domma.auth.on('register', () => this.updateUI());
      Domma.auth.on('logout', () => this.updateUI());
    }
  },

  /**
   * Update UI based on auth state
   */
  updateUI() {
    if (typeof Domma === 'undefined' || !Domma.auth) return;

    const user = Domma.auth.getUser();
    const loggedInView = document.getElementById('authModalLoggedIn');
    const loggedOutView = document.getElementById('authModalLoggedOut');

    if (!loggedInView || !loggedOutView) return;

    if (user) {
      // Show logged in view
      loggedInView.style.display = 'block';
      loggedOutView.style.display = 'none';

      // Populate user info using textContent for security
      const userName = document.getElementById('authModalUserName');
      const userEmail = document.getElementById('authModalUserEmail');
      const userRole = document.getElementById('authModalUserRole');

      if (userName) {
        userName.textContent = user.name || 'User';
      }

      if (userEmail) {
        userEmail.textContent = user.email;
      }

      // Set role badge
      if (userRole && user.role) {
        const roleClass = {
          admin: 'badge-danger',
          subscriber: 'badge-primary',
          guest: 'badge-secondary'
        }[user.role] || 'badge-secondary';

        userRole.className = `badge ${roleClass}`;
        userRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      }

    } else {
      // Show logged out view
      loggedInView.style.display = 'none';
      loggedOutView.style.display = 'block';
    }
  },

  /**
   * Open modal
   */
  open() {
    this.updateUI();
    if (this.modal) {
      this.modal.open();
    }
  }
};
