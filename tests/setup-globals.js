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
const dom = new JSDOM(`<!DOCTYPE html>
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
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.NodeList = dom.window.NodeList;
global.HTMLCollection = dom.window.HTMLCollection;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;

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
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        },
        key: function (i) {
            return Object.keys(store)[i] || null;
        },
        get length() {
            return Object.keys(store).length;
        }
    };
})();

global.localStorage = localStorageMock;
