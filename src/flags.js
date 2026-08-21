/**
 * Domma Flags Registry
 *
 * Renders nation flags as inline SVG. Flags are stored as compact descriptors
 * (stripe/cross/overlay specs or raw SVG) and expanded to SVG markup lazily on
 * first render, then memoised - nothing touches the DOM until a flag is actually
 * requested. Keyed by ISO 3166-1 alpha-2 code (e.g. 'gb', 'us', 'fr').
 *
 * Opt-in module: ships as a separate bundle (domma-flags) and is NOT part of the
 * core domma bundle. Attaches to Domma.flags / window.FL when loaded.
 */

import {flags as defaultFlags, regions} from '../public/assets/flags/index.js';

const NAMESPACE = 'http://www.w3.org/2000/svg';
const VIEWBOX = '0 0 60 40';      // canonical 3:2 flag canvas
const SQUARE_VIEWBOX = '10 0 40 40'; // centre-cropped 1:1 slice

let _clipSeq = 0;

/* -------------------------------------------------------------------------- */
/* Geometry helpers (shared by descriptor expansion)                          */
/* -------------------------------------------------------------------------- */

/**
 * Generate an n-pointed star path.
 * @param {number} cx - Centre x
 * @param {number} cy - Centre y
 * @param {number} outerR - Outer radius
 * @param {number} [points=5] - Number of points
 * @param {number} [innerRatio=0.382] - Inner radius as a fraction of outer
 * @param {number} [rotation=-90] - Rotation in degrees (-90 points up)
 * @returns {string} SVG path data
 */
export function starPath(cx, cy, outerR, points = 5, innerRatio = 0.382, rotation = -90) {
    const innerR = outerR * innerRatio;
    const step = Math.PI / points;
    const start = (rotation * Math.PI) / 180;
    let d = '';
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = start + i * step;
        const x = (cx + r * Math.cos(a)).toFixed(2);
        const y = (cy + r * Math.sin(a)).toFixed(2);
        d += (i === 0 ? 'M' : 'L') + x + ',' + y;
    }
    return d + 'Z';
}

/**
 * Generate a crescent path (a lune) opening towards the fly (right).
 * The inner arc passes through the top and bottom of the outer circle.
 * @param {number} cx - Outer circle centre x
 * @param {number} cy - Outer circle centre y
 * @param {number} r - Outer radius
 * @param {number} [off=r*0.45] - Horizontal offset of the carving circle
 * @returns {string} SVG path data
 */
export function crescentPath(cx, cy, r, off = r * 0.45) {
    const ri = Math.sqrt(off * off + r * r);
    const top = (cy - r).toFixed(2);
    const bot = (cy + r).toFixed(2);
    const x = cx.toFixed(2);
    return `M${x},${top} A${r},${r} 0 1 0 ${x},${bot} A${ri.toFixed(2)},${ri.toFixed(2)} 0 0 1 ${x},${top}Z`;
}

/* -------------------------------------------------------------------------- */
/* Descriptor → SVG markup expansion                                          */
/* -------------------------------------------------------------------------- */

function esc(v) {
    return String(v).replace(/"/g, '&quot;');
}

function buildStripes({dir = 'h', colors = [], weights = null}) {
    const total = weights ? weights.reduce((a, b) => a + b, 0) : colors.length;
    let offset = 0;
    let out = '';
    colors.forEach((colour, i) => {
        const w = weights ? weights[i] : 1;
        if (dir === 'v') {
            const x = (60 * offset) / total;
            const width = (60 * w) / total;
            out += `<rect x="${x.toFixed(3)}" y="0" width="${width.toFixed(3)}" height="40" fill="${esc(colour)}"/>`;
        } else {
            const y = (40 * offset) / total;
            const height = (40 * w) / total;
            out += `<rect x="0" y="${y.toFixed(3)}" width="60" height="${height.toFixed(3)}" fill="${esc(colour)}"/>`;
        }
        offset += w;
    });
    return out;
}

/**
 * Nordic (offset) cross - vertical bar sits towards the hoist.
 */
function buildCross({bg, colour, border = null, thickness = 8}) {
    const t = thickness;
    const vx = 16;                 // vertical bar left edge (hoist-offset)
    const hy = 20 - t / 2;         // horizontal bar top edge (centred)
    let out = `<rect x="0" y="0" width="60" height="40" fill="${esc(bg)}"/>`;
    if (border) {
        const b = 2;
        out += `<rect x="${vx - b}" y="0" width="${t + b * 2}" height="40" fill="${esc(border)}"/>`;
        out += `<rect x="0" y="${hy - b}" width="60" height="${t + b * 2}" fill="${esc(border)}"/>`;
    }
    out += `<rect x="${vx}" y="0" width="${t}" height="40" fill="${esc(colour)}"/>`;
    out += `<rect x="0" y="${hy}" width="60" height="${t}" fill="${esc(colour)}"/>`;
    return out;
}

function buildOverlay(o) {
    const fill = o.fill !== undefined ? ` fill="${esc(o.fill)}"` : '';
    const stroke = o.stroke ? ` stroke="${esc(o.stroke)}"` : '';
    const sw = o.strokeWidth !== undefined ? ` stroke-width="${o.strokeWidth}"` : '';
    const extra = stroke + sw + (stroke && !o.fill ? ' fill="none"' : '');
    switch (o.type) {
        case 'rect':
            return `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}"${o.rx ? ` rx="${o.rx}"` : ''}${fill}${extra}/>`;
        case 'circle':
            return `<circle cx="${o.cx}" cy="${o.cy}" r="${o.r}"${fill}${extra}/>`;
        case 'ellipse':
            return `<ellipse cx="${o.cx}" cy="${o.cy}" rx="${o.rx}" ry="${o.ry}"${fill}${extra}/>`;
        case 'line':
            return `<line x1="${o.x1}" y1="${o.y1}" x2="${o.x2}" y2="${o.y2}"${stroke}${sw}/>`;
        case 'path':
            return `<path d="${o.d}"${fill}${extra}/>`;
        case 'star':
            return `<path d="${starPath(o.cx, o.cy, o.r, o.points || 5, o.innerRatio || 0.382, o.rotation === undefined ? -90 : o.rotation)}"${fill || ' fill="#fff"'}${extra}/>`;
        case 'crescent':
            return `<path d="${crescentPath(o.cx, o.cy, o.r, o.off)}"${fill || ' fill="#fff"'}${extra}/>`;
        case 'group':
            return `<g${o.transform ? ` transform="${esc(o.transform)}"` : ''}>${(o.children || []).map(buildOverlay).join('')}</g>`;
        default:
            return '';
    }
}

function expandFlag(def) {
    if (def.svg) {
        return def.svg;
    }
    let out = '';
    if (def.stripes) {
        out += buildStripes(def.stripes);
    }
    if (def.cross) {
        out += buildCross(def.cross);
    }
    if (def.bg && !def.stripes && !def.cross) {
        out = `<rect x="0" y="0" width="60" height="40" fill="${esc(def.bg)}"/>` + out;
    }
    if (def.overlays) {
        out += def.overlays.map(buildOverlay).join('');
    }
    return out;
}

/* -------------------------------------------------------------------------- */
/* Registry                                                                   */
/* -------------------------------------------------------------------------- */

class FlagRegistry {
    constructor() {
        this._flags = {...defaultFlags};
        this._regions = {...regions};
        this._cache = {};
    }

    _markup(code) {
        if (this._cache[code] !== undefined) {
            return this._cache[code];
        }
        const def = this._flags[code];
        const markup = def ? expandFlag(def) : null;
        this._cache[code] = markup;
        return markup;
    }

    /**
     * Render a flag as an SVG element.
     * @param {string} code - ISO 3166-1 alpha-2 code (case-insensitive)
     * @param {Object} [options]
     * @param {number} [options.size=24] - Height in px (width follows aspect)
     * @param {number} [options.width] - Explicit width override
     * @param {number} [options.height] - Explicit height override
     * @param {string} [options.shape='rect'] - 'rect' | 'square' | 'circle' | 'rounded'
     * @param {boolean|string} [options.border=false] - Add a hairline border (or colour)
     * @param {string} [options.class] - Extra CSS classes
     * @param {string} [options.title] - Accessible title (defaults to country name)
     * @param {Object} [options.attrs] - Additional attributes
     * @returns {SVGElement|null}
     */
    render(code, options = {}) {
        code = String(code || '').toLowerCase();
        const def = this._flags[code];
        if (!def) {
            console.warn(`Flag "${code}" not found`);
            return null;
        }

        const {
            size = 24,
            width = null,
            height = null,
            shape = 'rect',
            border = false,
            class: className = '',
            title = null,
            attrs = {}
        } = options;

        const isSquareShape = shape === 'square' || shape === 'circle';
        const h = height || size;
        const w = width || (isSquareShape ? h : h * 1.5);

        const svg = document.createElementNS(NAMESPACE, 'svg');
        svg.setAttribute('viewBox', isSquareShape ? SQUARE_VIEWBOX : VIEWBOX);
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
        svg.setAttribute('role', 'img');

        const label = title || def.name || code.toUpperCase();
        svg.setAttribute('aria-label', label);

        const classes = ['dm-flag', `dm-flag-${shape}`];
        if (className) {
            classes.push(className);
        }
        svg.setAttribute('class', classes.join(' '));

        Object.entries(attrs).forEach(([k, v]) => svg.setAttribute(k, v));

        const clipId = `dm-flag-clip-${++_clipSeq}`;
        let inner = `<title>${esc(label)}</title>`;
        const body = this._markup(code) || '';

        if (shape === 'circle') {
            inner += `<defs><clipPath id="${clipId}"><circle cx="30" cy="20" r="20"/></clipPath></defs>`;
            inner += `<g clip-path="url(#${clipId})">${body}</g>`;
            if (border) {
                const bc = typeof border === 'string' ? border : 'rgba(0,0,0,0.15)';
                inner += `<circle cx="30" cy="20" r="19.25" fill="none" stroke="${esc(bc)}" stroke-width="1.5"/>`;
            }
        } else if (shape === 'rounded') {
            inner += `<defs><clipPath id="${clipId}"><rect x="0" y="0" width="60" height="40" rx="6"/></clipPath></defs>`;
            inner += `<g clip-path="url(#${clipId})">${body}</g>`;
            if (border) {
                const bc = typeof border === 'string' ? border : 'rgba(0,0,0,0.15)';
                inner += `<rect x="0.75" y="0.75" width="58.5" height="38.5" rx="5.25" fill="none" stroke="${esc(bc)}" stroke-width="1.5"/>`;
            }
        } else {
            inner += body;
            if (border) {
                const bc = typeof border === 'string' ? border : 'rgba(0,0,0,0.15)';
                const vb = isSquareShape ? {x: 10.5, y: 0.5, w: 39, h: 39} : {x: 0.5, y: 0.5, w: 59, h: 39};
                inner += `<rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="none" stroke="${esc(bc)}" stroke-width="1"/>`;
            }
        }

        svg.innerHTML = inner;
        return svg;
    }

    /**
     * Get a flag as an HTML string.
     * @param {string} code
     * @param {Object} [options] - Same as render()
     * @returns {string}
     */
    html(code, options = {}) {
        const svg = this.render(code, options);
        if (!svg) {
            return '';
        }
        const container = document.createElement('div');
        container.appendChild(svg);
        return container.innerHTML;
    }

    /**
     * Inject a flag into an element.
     * @param {string|HTMLElement} target
     * @param {string} code
     * @param {Object} [options] - Same as render(), plus position
     * @param {string} [options.position='prepend'] - 'prepend' | 'append' | 'replace'
     * @returns {SVGElement|null}
     */
    inject(target, code, options = {}) {
        const {position = 'prepend', ...renderOptions} = options;
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) {
            console.warn(`Target element not found: ${target}`);
            return null;
        }
        const svg = this.render(code, renderOptions);
        if (!svg) {
            return null;
        }
        if (position === 'append') {
            element.appendChild(svg);
        } else if (position === 'replace') {
            element.innerHTML = '';
            element.appendChild(svg);
        } else {
            element.insertBefore(svg, element.firstChild);
        }
        return svg;
    }

    /**
     * Scan a container for [data-flag] elements and replace them with SVGs.
     * Supported attributes: data-flag, data-flag-size, data-flag-shape,
     * data-flag-class, data-flag-border, data-flag-title.
     * @param {HTMLElement|string} [container=document]
     * @returns {number} Number of flags replaced
     */
    scan(container = document) {
        const root = typeof container === 'string' ? document.querySelector(container) : container;
        if (!root) {
            return 0;
        }
        const elements = root.querySelectorAll('[data-flag]:not([data-flag-processed])');
        let count = 0;
        elements.forEach(el => {
            if (el.tagName.toLowerCase() === 'svg' || el.querySelector('svg')) {
                return;
            }
            const code = el.dataset.flag;
            const size = parseInt(el.dataset.flagSize, 10) || 24;
            const shape = el.dataset.flagShape || 'rect';
            const className = el.dataset.flagClass || '';
            const border = el.dataset.flagBorder !== undefined
                ? (el.dataset.flagBorder === '' || el.dataset.flagBorder === 'true' ? true : el.dataset.flagBorder)
                : false;
            const title = el.dataset.flagTitle || null;

            const svg = this.render(code, {size, shape, class: className, border, title});
            if (svg) {
                if (el.className) {
                    svg.classList.add(...el.className.split(' ').filter(Boolean));
                }
                svg.setAttribute('data-flag', code);
                svg.setAttribute('data-flag-processed', 'true');
                el.replaceWith(svg);
                count++;
            } else {
                el.setAttribute('data-flag-processed', 'true');
            }
        });
        return count;
    }

    /**
     * Register a custom flag (or override an existing one).
     * @param {string} code - ISO alpha-2 code
     * @param {Object} definition - { name, region?, svg? | stripes?/cross?/bg?/overlays? }
     * @returns {FlagRegistry}
     */
    register(code, definition) {
        if (!code || !definition) {
            console.warn('Invalid flag registration: code and definition required');
            return this;
        }
        code = String(code).toLowerCase();
        this._flags[code] = definition;
        delete this._cache[code];

        const region = definition.region || 'custom';
        if (!this._regions[region]) {
            this._regions[region] = {name: region.charAt(0).toUpperCase() + region.slice(1), codes: []};
        }
        if (!this._regions[region].codes.includes(code)) {
            this._regions[region].codes.push(code);
        }
        return this;
    }

    /**
     * Remove a registered flag.
     * @param {string} code
     * @returns {boolean}
     */
    unregister(code) {
        code = String(code || '').toLowerCase();
        if (this._flags[code]) {
            delete this._flags[code];
            delete this._cache[code];
            Object.values(this._regions).forEach(r => {
                const i = r.codes.indexOf(code);
                if (i > -1) {
                    r.codes.splice(i, 1);
                }
            });
            return true;
        }
        return false;
    }

    /**
     * Check whether a flag exists.
     * @param {string} code
     * @returns {boolean}
     */
    has(code) {
        return !!this._flags[String(code || '').toLowerCase()];
    }

    /**
     * Get a flag definition.
     * @param {string} code
     * @returns {Object|null}
     */
    get(code) {
        return this._flags[String(code || '').toLowerCase()] || null;
    }

    /**
     * Get the country name for a code.
     * @param {string} code
     * @returns {string|null}
     */
    name(code) {
        const def = this.get(code);
        return def ? def.name : null;
    }

    /**
     * List flag codes, optionally filtered by region.
     * @param {string} [region]
     * @returns {string[]}
     */
    list(region = null) {
        if (region && this._regions[region]) {
            return [...this._regions[region].codes];
        }
        return Object.keys(this._flags);
    }

    /**
     * List all regions with metadata.
     * @returns {Object}
     */
    listRegions() {
        return {...this._regions};
    }

    /**
     * Total number of flags.
     * @returns {number}
     */
    count() {
        return Object.keys(this._flags).length;
    }

    /**
     * Search flags by code or country name.
     * @param {string} query
     * @returns {string[]} Matching codes
     */
    search(query) {
        const q = String(query || '').toLowerCase().trim();
        if (!q) {
            return [];
        }
        return Object.keys(this._flags).filter(code =>
            code.includes(q) || (this._flags[code].name || '').toLowerCase().includes(q)
        );
    }
}

const flags = new FlagRegistry();

export {flags, FlagRegistry};
export default flags;
