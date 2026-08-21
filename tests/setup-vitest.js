// tests/setup-vitest.js
import {JSDOM} from 'jsdom';
import createDOMPurify from 'dompurify';
import {readFileSync} from 'fs';
import {execSync} from 'child_process';
import {afterEach, beforeAll, beforeEach} from 'vitest';

// Read version from package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Get git commit hash
const getGitCommit = () => {
  try {
    return execSync('git rev-parse --short HEAD', {cwd: '.'}).toString().trim();
  } catch {
    return 'unknown';
  }
};

// Format date as dd/mm/YYYY hh:mm
const formatDate = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Define global variables for testing environment
global.__BUILD_VERSION__ = pkg.version;
global.__BUILD_DATE__ = formatDate(new Date());
global.__BUILD_COMMIT__ = getGitCommit();


let domInstance;
let localStorageStore = {}; // For localStorage mock

const FIXTURE_HTML = `
    <div id="test"></div>
    <div id="test-container">
        <div id="parent">
            <div id="child1" class="child"></div>
            <div id="child2" class="child">
                <span id="grandchild"></span>
            </div>
            <div id="child3" class="child"></div>
        </div>
    </div>
`;

/**
 * Reset the DOM to the fixture state.
 *
 * This deliberately reuses the jsdom window supplied by Vitest's `environment:
 * 'jsdom'` rather than constructing a second JSDOM instance. Two windows meant
 * two `customElements` registries and two `HTMLElement` constructors, so any
 * class defined at module-import time extended a different HTMLElement than the
 * document being rendered into - custom elements could never upgrade.
 */
const setupJSDOM = () => {
  domInstance = globalThis.window;

  // Expose window internals as bare globals, as the suite expects.
  global.window = globalThis.window;
  global.document = globalThis.window.document;
  global.HTMLElement = globalThis.window.HTMLElement;
  global.NodeList = globalThis.window.NodeList;
  global.HTMLCollection = globalThis.window.HTMLCollection;
  global.Event = globalThis.window.Event;
  global.CustomEvent = globalThis.window.CustomEvent;
  global.MouseEvent = globalThis.window.MouseEvent;
  global.KeyboardEvent = globalThis.window.KeyboardEvent; // Added for keyboard tests
  global.customElements = globalThis.window.customElements;

  // Domma's sanitiser ESCAPES THE ENTIRE STRING when DOMPurify is absent
  // (see sanitize.js). Without it, .html() and every other sanitised write
  // silently degrades, so tests would assert the fallback rather than the
  // behaviour Domma actually ships - every documented page loads DOMPurify.
  if (!globalThis.window.DOMPurify) {
    globalThis.window.DOMPurify = createDOMPurify(globalThis.window);
  }

  document.body.replaceChildren();
  const fixture = document.createRange().createContextualFragment(FIXTURE_HTML);
  document.body.appendChild(fixture);

  global.localStorage = createLocalStorageMock();
};

const createLocalStorageMock = () => {
  return {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, value) => {
      localStorageStore[key] = value.toString();
    },
    removeItem: (key) => {
      delete localStorageStore[key];
    },
    clear: () => {
      localStorageStore = {};
    },
    key: (i) => Object.keys(localStorageStore)[i] || null,
    get length() {
      return Object.keys(localStorageStore).length;
    }
  };
};

// Mock fetch API
global.fetch = async (url, options) => {
  if (url === '/api/data' && options.method === 'GET') {
    return {
      ok: true,
      status: 200,
      json: async () => ({message: 'Success'})
    };
  }
  if (url === '/api/post' && options.method === 'POST') {
    const body = JSON.parse(options.body);
    if (body.test === 'data') {
      return {
        ok: true,
        status: 200,
        json: async () => ({received: body})
      };
    }
  }
  if (url === '/api/error') {
    return {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({error: 'Not Found'})
    };
  }
  // Server supplies a `message` - it takes precedence over `error`
  if (url === '/api/error-message') {
    return {
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
      json: async () => ({message: 'Validation failed', error: 'should be ignored'})
    };
  }
  // Non-JSON error body - http.js falls back to status + statusText
  if (url === '/api/error-plain') {
    return {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => { throw new SyntaxError('Unexpected token < in JSON'); }
    };
  }
  // Mock external requests as well, for example to public/dist for bundle-builder tests
  if (url.startsWith('/public/dist/')) {
    const filePath = './' + url;
    try {
      const content = readFileSync(filePath, 'utf-8');
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(content), // Assume JSON for metadata/build-info
        text: async () => content,
        headers: new Map([['Content-Type', 'application/javascript']]) // Or appropriate type
      };
    } catch (e) {
      if (e.code === 'ENOENT') {
        return {
          ok: false,
          status: 404,
          json: async () => ({error: 'Not Found'})
        };
      }
      throw e;
    }
  }

  throw new Error(`Unhandled fetch request: ${options.method || 'GET'} ${url}`);
};


// Vitest lifecycle hooks
beforeAll(() => {
  setupJSDOM(); // Initial setup
});

beforeEach(() => {
  // Re-initialize JSDOM to get a fresh DOM state before each test
  setupJSDOM();
  // Clear localStorage mock
  localStorageStore = {};
});

afterEach(() => {
  // Clean up any dynamically added elements in the DOM
  document.body.innerHTML = '';
});

// If you need to teardown JSDOM after all tests (e.g., if running in a real browser context which is not the case for JSDOM)
// afterAll(() => {
//   if (domInstance) {
//     domInstance.window.close();
//   }
// });

// Expose a global utility to reset the environment for specific test cases if needed,
// though beforeEach should cover most needs.
global.resetTestEnvironment = () => {
  setupJSDOM();
  localStorageStore = {};
};
