/**
 * Domma Skeleton loaders
 *
 * Shimmering placeholders shaped like the content that is on its way - a card,
 * a list, a table - so the page keeps its layout while data loads. They
 * complement the Loader (spinner / dots / pulse / bars), which says "busy" but
 * not "what".
 *
 * The shapes are plain CSS (`.skeleton`, `.skeleton-text`, `.skeleton-card`,
 * ...) and work in hand-written HTML. `E.skeleton()` writes that markup into a
 * container, marks it busy for assistive technology and hands back a handle:
 *
 *   const sk = E.skeleton('#users', {type: 'list', count: 4});
 *   const users = await H.get('/api/users');
 *   sk.replace(renderUsers(users));
 *
 *   const posts = await E.skeleton.while('#posts', H.get('/api/posts'), {type: 'card', count: 3});
 *
 * The container's existing children are moved aside, not copied, so `remove()`
 * puts back the very same nodes - listeners and state intact.
 */

const ANNOUNCE_DELAY = 100;

const TYPES = new Set(['text', 'card', 'list', 'table', 'custom']);

const DEFAULTS = {
    type: 'text',
    lines: null,        // text: 3, card: 3
    count: null,        // text: 1, card: 1, list: 3
    rows: 5,            // table
    columns: 4,         // table
    header: true,       // table: a header row
    avatar: true,       // list: a circle at the start of each item
    image: true,        // card: an image block above the heading
    animate: true,      // false = static tint, no sweep
    template: null,     // custom: HTML string, or function(options) returning one
    label: 'Loading...' // the visually hidden status text
};

/** Live handles by container, so a second call or E.skeleton.remove() finds them. */
const active = new WeakMap();

function resolveTarget(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    if (target.nodeType === 1) return target;
    // A Domma / jQuery-style collection
    if (typeof target.length === 'number' && target[0] && target[0].nodeType === 1) return target[0];
    return null;
}

function positiveInt(value, fallback) {
    const n = parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : fallback;
}

function repeat(n, fn) {
    let out = '';
    for (let i = 0; i < n; i++) out += fn(i);
    return out;
}

function textLines(n, extraClass = '') {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `<div class="skeleton-lines">${repeat(n, () => `<div class="skeleton skeleton-text${cls}"></div>`)}</div>`;
}

/**
 * Placeholder markup for one type. Exported for tests and for hosts (such as
 * the DataTable) that want the shapes without the container handling.
 */
export function skeletonMarkup(options = {}) {
    const o = {...DEFAULTS, ...options};
    const type = TYPES.has(o.type) ? o.type : 'text';

    switch (type) {
        case 'card': {
            const lines = positiveInt(o.lines, 3);
            return repeat(positiveInt(o.count, 1), () =>
                '<div class="skeleton-card">' +
                (o.image ? '<div class="skeleton skeleton-image"></div>' : '') +
                '<div class="skeleton-card-body">' +
                '<div class="skeleton skeleton-heading"></div>' +
                textLines(lines) +
                '</div></div>');
        }
        case 'list': {
            const lines = positiveInt(o.lines, 2);
            return '<div class="skeleton-list">' + repeat(positiveInt(o.count, 3), () =>
                '<div class="skeleton-list-item">' +
                (o.avatar ? '<div class="skeleton skeleton-circle"></div>' : '') +
                '<div class="skeleton-list-item-content">' +
                '<div class="skeleton skeleton-text skeleton-w-50"></div>' +
                repeat(lines - 1, () => '<div class="skeleton skeleton-text skeleton-text-sm skeleton-w-75"></div>') +
                '</div></div>') + '</div>';
        }
        case 'table': {
            const columns = positiveInt(o.columns, 4);
            const cells = (cls) => repeat(columns, () => `<div class="skeleton skeleton-text${cls}"></div>`);
            return `<div class="skeleton-table" style="--dm-skeleton-columns: ${columns}">` +
                (o.header ? `<div class="skeleton-table-row skeleton-table-head">${cells(' skeleton-w-50')}</div>` : '') +
                repeat(positiveInt(o.rows, 5), () => `<div class="skeleton-table-row">${cells('')}</div>`) +
                '</div>';
        }
        case 'custom': {
            const html = typeof o.template === 'function' ? o.template(o) : o.template;
            return html == null ? '' : String(html);
        }
        default:
            return repeat(positiveInt(o.count, 1), () => textLines(positiveInt(o.lines, 3)));
    }
}

/** Options declared on the element: data-skeleton="card" data-skeleton-count="3" ... */
function optionsFromData(el) {
    const d = el.dataset || {};
    const out = {};
    if (d.skeleton && TYPES.has(d.skeleton)) out.type = d.skeleton;
    for (const key of ['lines', 'count', 'rows', 'columns']) {
        const v = d[`skeleton${key[0].toUpperCase()}${key.slice(1)}`];
        if (v != null && v !== '') out[key] = v;
    }
    for (const key of ['avatar', 'image', 'animate', 'header']) {
        const v = d[`skeleton${key[0].toUpperCase()}${key.slice(1)}`];
        if (v != null) out[key] = v !== 'false';
    }
    if (d.skeletonLabel) out.label = d.skeletonLabel;
    return out;
}

/**
 * Fill a container with placeholders.
 *
 * @param {string|Element|Object} target - selector, element or Domma collection
 * @param {Object} [options]
 * @returns {{element: Element, active: boolean, remove: Function, replace: Function, destroy: Function}|null}
 */
export function skeleton(target, options = {}) {
    const el = resolveTarget(target);
    if (!el) return null;

    // A second call on the same container starts again from the original content.
    const existing = active.get(el);
    if (existing) existing.remove();

    const o = {...DEFAULTS, ...optionsFromData(el), ...options};

    // Move the current children aside - the same nodes come back on remove().
    const saved = document.createDocumentFragment();
    while (el.firstChild) saved.appendChild(el.firstChild);

    const tpl = document.createElement('template');
    tpl.innerHTML = skeletonMarkup(o);
    const parts = Array.from(tpl.content.childNodes);
    for (const node of parts) {
        if (node.nodeType === 1) {
            node.setAttribute('aria-hidden', 'true');
            if (!o.animate) node.classList.add('skeleton-static');
        }
    }

    const status = document.createElement('span');
    status.className = 'skeleton-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    el.appendChild(tpl.content);
    el.appendChild(status);
    // Filled after insertion: a live region that arrives already filled is
    // often not announced.
    setTimeout(() => { if (status.parentNode === el) status.textContent = o.label; }, ANNOUNCE_DELAY);
    el.setAttribute('aria-busy', 'true');
    el.classList.add('is-skeleton-loading');

    let live = true;

    const clear = () => {
        for (const node of parts) node.parentNode === el && el.removeChild(node);
        if (status.parentNode === el) el.removeChild(status);
        el.setAttribute('aria-busy', 'false');
        el.classList.remove('is-skeleton-loading');
        // A declared container has had its turn: a later scan() must not cover the real content
        if (el.hasAttribute('data-skeleton')) el.setAttribute('data-skeleton-done', '');
        if (active.get(el) === handle) active.delete(el);
        live = false;
    };

    const handle = {
        element: el,
        options: o,
        get active() { return live; },

        /** Take the placeholders away and put back whatever was there before. */
        remove() {
            if (!live) return el;
            clear();
            el.appendChild(saved);
            return el;
        },

        /**
         * Take the placeholders away and show new content instead of the old.
         * A string is set as HTML (like $.html()); a node or fragment is appended.
         */
        replace(content) {
            // A newer skeleton owns the container now: leave it alone
            const current = active.get(el);
            if (!live && current && current !== handle) return el;
            if (live) clear();
            el.textContent = '';
            if (content == null) return el;
            if (typeof content === 'string') {
                el.innerHTML = content;
            } else if (content.nodeType) {
                el.appendChild(content);
            } else if (typeof content.length === 'number') {
                Array.from(content).forEach((n) => n && n.nodeType && el.appendChild(n));
            }
            return el;
        },

        destroy() { return handle.remove(); }
    };

    active.set(el, handle);
    return handle;
}

/**
 * Show a skeleton until a promise settles. Resolves with the promise's value
 * once the skeleton is gone, so the caller renders into a clean container;
 * rejects with the promise's error, also with the skeleton gone.
 * `promise` may be a function returning one.
 */
skeleton.while = async function (target, promise, options = {}) {
    const handle = skeleton(target, options);
    try {
        const value = await (typeof promise === 'function' ? promise() : promise);
        handle && handle.remove();
        return value;
    } catch (err) {
        handle && handle.remove();
        throw err;
    }
};

/** The live handle on a container, if any. */
skeleton.get = function (target) {
    const el = resolveTarget(target);
    return (el && active.get(el)) || null;
};

/** Remove the skeleton from a container, restoring its content. */
skeleton.remove = function (target) {
    const handle = skeleton.get(target);
    return handle ? handle.remove() : null;
};

/**
 * Fill every `[data-skeleton]` container under `root` that has no skeleton
 * yet and has not had one removed (`data-skeleton-done`). Options come from
 * `data-skeleton-*` attributes. Returns the handles.
 */
skeleton.scan = function (root = document) {
    const scope = resolveTarget(root) || document;
    return Array.from(scope.querySelectorAll('[data-skeleton]'))
        .filter((el) => !active.has(el) && !el.hasAttribute('data-skeleton-done'))
        .map((el) => skeleton(el));
};

skeleton.markup = skeletonMarkup;

export default skeleton;
