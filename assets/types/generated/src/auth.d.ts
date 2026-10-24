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
export const auth: Auth;
/**
 * LoginForm Component
 */
export class LoginForm extends Component {
    static defaults: {
        emailPlaceholder: string;
        passwordPlaceholder: string;
        buttonText: string;
        showLabels: boolean;
        onSubmit: any;
        onSuccess: any;
        onError: any;
    };
    /**
     * @param {string|HTMLElement} selector - Container element or selector
     * @param {LoginFormOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: LoginFormOptions);
    _init(): void;
    render(): void;
    handleSubmit(): Promise<void>;
}
/**
 * RegisterForm Component
 */
export class RegisterForm extends Component {
    static defaults: {
        namePlaceholder: string;
        emailPlaceholder: string;
        passwordPlaceholder: string;
        buttonText: string;
        minPasswordLength: number;
        showLabels: boolean;
        onSubmit: any;
        onSuccess: any;
        onError: any;
    };
    /**
     * @param {string|HTMLElement} selector - Container element or selector
     * @param {RegisterFormOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: RegisterFormOptions);
    _init(): void;
    render(): void;
    handleSubmit(): Promise<void>;
}
/**
 * AuthTabs Component
 */
export class AuthTabs extends Component {
    static defaults: {
        activeTab: string;
        loginText: string;
        registerText: string;
        onChange: any;
    };
    /**
     * @param {string|HTMLElement} selector - Container element or selector
     * @param {AuthTabsOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: AuthTabsOptions);
    _init(): void;
    render(): void;
    /**
     * @param {string} tab - 'login' or 'register'
     */
    switchTab(tab: string): void;
}
/**
 * UserInfo Component
 */
export class UserInfo extends Component {
    static defaults: {
        showIcon: boolean;
        showRole: boolean;
        logoutText: string;
        onLogout: any;
    };
    /**
     * @param {string|HTMLElement} selector
     * @param {Object} [options]
     */
    constructor(selector: string | HTMLElement, options?: any);
    _init(): void;
    _onAuthChange: () => void;
    render(): void;
    handleLogout(): void;
}
/**
 * Options for `A.init()`.
 */
export type AuthOptions = {
    /**
     * - Backend API URL (default: `http://<host>:3000/api` on localhost, else `<origin>/api`)
     */
    apiUrl?: string;
    /**
     * - Storage key for the token
     */
    storageKey?: string;
    /**
     * - Storage key for the user object
     */
    userStorageKey?: string;
    /**
     * - Verify a stored token with `GET <apiUrl>/auth/me` on init
     */
    autoCheck?: boolean;
};
/**
 * The signed-in user, as the backend returned it (`response.user` from login, register or
 * `/auth/me`). Domma reads `email` and `role`; anything else is the backend's.
 */
export type AuthUser = {
    email?: string;
    name?: string;
    role?: string;
    [key: string]: any;
};
/**
 * Events `A.on()` can listen for: `login` / `register` (data: the user), `logout` (null),
 * `error` (the message string) and `tokenExpired` (null - a stored token the server refused on init).
 */
export type AuthEventName = "login" | "register" | "logout" | "error" | "tokenExpired";
/**
 * An auth event handler. Gets the event's data (see AuthEventName).
 */
export type AuthEventHandler = (data: any) => void;
/**
 * The auth module (`A`, `Domma.auth`).
 */
export type Auth = {
    /**
     * - Backend API URL (set by init)
     */
    apiUrl: string | null;
    /**
     * - Current JWT, or null
     */
    token: string | null;
    /**
     * - Current user, or null
     */
    user: AuthUser | null;
    /**
     * - Resolved configuration (set by init)
     */
    config: AuthOptions;
    /**
     * - Registered handlers by event name
     */
    eventHandlers: Record<string, AuthEventHandler[]>;
    /**
     * - Whether init() has run
     */
    initialized: boolean;
    /**
     * - Initialise the module: load the stored token and user, and (autoCheck) verify the token
     */
    init: (config?: AuthOptions) => void;
    /**
     * - Log in (`POST <apiUrl>/auth/login`); stores the token and user and emits `login`. Rejects on failure (and emits `error`)
     */
    login: (email: string, password: string) => Promise<AuthUser>;
    /**
     * - Register (`POST <apiUrl>/auth/register`); stores the token and user and emits `register`. Rejects on failure (and emits `error`)
     */
    register: (email: string, password: string, name: string) => Promise<AuthUser>;
    /**
     * - Clear the token and user and emit `logout`
     */
    logout: () => void;
    /**
     * - Current user or null
     */
    getUser: () => AuthUser | null;
    /**
     * - True when there is both a token and a user
     */
    isAuthenticated: () => boolean;
    /**
     * - `{Authorization: 'Bearer <token>'}`, or `{}` without a token
     */
    getHeaders: () => {
        Authorization?: string;
    };
    /**
     * - The backend API URL
     */
    getApiUrl: () => string | null;
    /**
     * - Current user's role ('admin', 'subscriber', 'guest') or null
     */
    getRole: () => string | null;
    /**
     * - Whether the user has this role
     */
    hasRole: (role: string) => boolean;
    /**
     * - Whether the user has any of these roles
     */
    hasAnyRole: (roles: string[]) => boolean;
    /**
     * - Role is 'admin'
     */
    isAdmin: () => boolean;
    /**
     * - Role is 'subscriber'
     */
    isSubscriber: () => boolean;
    /**
     * - Role is 'guest'
     */
    isGuest: () => boolean;
    /**
     * - Subscribe to an event
     */
    on: (event: AuthEventName | (string & {}), callback: AuthEventHandler) => void;
    /**
     * - Unsubscribe one handler, or every handler of the event when none is given
     */
    off: (event: AuthEventName | (string & {}), callback?: AuthEventHandler) => void;
    /**
     * - Login form component class
     */
    LoginForm: typeof LoginForm;
    /**
     * - Registration form component class
     */
    RegisterForm: typeof RegisterForm;
    /**
     * - Login/Register tab switcher component class
     */
    AuthTabs: typeof AuthTabs;
    /**
     * - Signed-in user display with a logout button
     */
    UserInfo: typeof UserInfo;
    /**
     * - Create a LoginForm
     */
    createLoginForm: (selector: string | HTMLElement, options?: LoginFormOptions) => LoginForm;
    /**
     * - Create a RegisterForm
     */
    createRegisterForm: (selector: string | HTMLElement, options?: RegisterFormOptions) => RegisterForm;
    /**
     * - Create an AuthTabs
     */
    createAuthTabs: (selector: string | HTMLElement, options?: AuthTabsOptions) => AuthTabs;
    /**
     * - Create a UserInfo
     */
    createUserInfo: (selector: string | HTMLElement, options?: UserInfoOptions) => UserInfo;
};
/**
 * Options for `A.createLoginForm()` / `new A.LoginForm()`.
 */
export type LoginFormOptions = {
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    buttonText?: string;
    showLabels?: boolean;
    /**
     * - Called before the login request
     */
    onSubmit?: ((email: string, password: string) => void) | null;
    /**
     * - Called after a successful login
     */
    onSuccess?: ((user: AuthUser | null) => void) | null;
    /**
     * - Called when the login fails
     */
    onError?: ((error: Error) => void) | null;
};
/**
 * Options for `A.createRegisterForm()` / `new A.RegisterForm()`.
 */
export type RegisterFormOptions = {
    namePlaceholder?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    buttonText?: string;
    minPasswordLength?: number;
    showLabels?: boolean;
    /**
     * - Called before the register request
     */
    onSubmit?: ((email: string, password: string, name: string) => void) | null;
    /**
     * - Called after a successful registration
     */
    onSuccess?: ((user: AuthUser | null) => void) | null;
    /**
     * - Called when registration fails (also for mismatched passwords)
     */
    onError?: ((error: Error) => void) | null;
};
/**
 * Options for `A.createAuthTabs()` / `new A.AuthTabs()`.
 */
export type AuthTabsOptions = {
    activeTab?: "login" | "register";
    loginText?: string;
    registerText?: string;
    /**
     * - Called with the tab switched to
     */
    onChange?: ((tab: string) => void) | null;
};
/**
 * Options for `A.createUserInfo()` / `new A.UserInfo()`.
 */
export type UserInfoOptions = {
    showIcon?: boolean;
    showRole?: boolean;
    logoutText?: string;
    /**
     * - Called after the logout button logs out
     */
    onLogout?: (() => void) | null;
};
import Component from './component.js';
