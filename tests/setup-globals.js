import {JSDOM} from 'jsdom';
import {readFileSync} from 'fs';
import {execSync} from 'child_process';

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

// Setup JSDOM environment
let domInstance;
let localStorageStore = {};

function setupJSDOM() {
  domInstance = new JSDOM(`<!DOCTYPE html>
    <body>
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
    </body>
`);
  global.window = domInstance.window;
  global.document = domInstance.window.document;
  global.HTMLElement = domInstance.window.HTMLElement;
  global.NodeList = domInstance.window.NodeList;
  global.HTMLCollection = domInstance.window.HTMLCollection;
  global.Event = domInstance.window.Event;
  global.CustomEvent = domInstance.window.CustomEvent;
  global.MouseEvent = domInstance.window.MouseEvent; // Ensure MouseEvent is defined globally
}

// Initial setup
setupJSDOM();

// Mock fetch API
global.fetch = async (url, options) => {
    // Basic mock implementation
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
            json: async () => ({error: 'Not Found'})
        };
    }
    throw new Error(`Unhandled fetch request: ${options.method} ${url}`);
};


// Mock localStorage
const localStorageMock = (function () {
    return {
        getItem: function (key) {
          return localStorageStore[key] || null;
        },
        setItem: function (key, value) {
          localStorageStore[key] = value.toString();
        },
        removeItem: function (key) {
          delete localStorageStore[key];
        },
        clear: function () {
          localStorageStore = {};
        },
        key: function (i) {
          return Object.keys(localStorageStore)[i] || null;
        },
        get length() {
          return Object.keys(localStorageStore).length;
        }
    };
})();

global.localStorage = localStorageMock;

// Function to reset DOM and localStorage before each test
global.resetTestEnvironment = () => {
  // Re-initialize JSDOM to get a fresh DOM state
  setupJSDOM();
  // Clear localStorage mock
  localStorageMock.clear();
};
