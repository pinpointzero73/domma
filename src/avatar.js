/**
 * Domma Avatars
 *
 * A person's picture, their initials, or an icon, in a circle (or a rounded or
 * square tile), with an optional presence dot and ring. `E.avatarGroup()`
 * stacks several with an overlap and folds the rest into a "+N" bubble that
 * lists who is hidden.
 *
 * The look is plain CSS (`.avatar`, `.avatar-lg`, `.avatar-status-online`,
 * `.avatar-group`...) and works in hand-written HTML. The JavaScript adds the
 * parts that need thought:
 *
 *   - Initials from a name: first and last word, a single letter for a single
 *     name, the local part of an email address, any script (the first letter
 *     of each word, combining marks kept with it).
 *   - A tone from the name: a stable hash picks one of eight theme-mixed tints
 *     (`.avatar-tone-0` ... `-7`), so "Jane Smith" is the same colour on every
 *     page and every visit, and the initials stay AA on every theme.
 *   - An image that fails to load falls back to the initials (or the icon).
 *   - An accessible name: role="img" with aria-label (name and status), or
 *     aria-hidden when the avatar is decorative. Images inside carry alt="".
 *
 *   E.avatar('#me', {name: 'Jane Smith', src: '/img/jane.jpg', status: 'online'});
 *   E.avatarGroup('#team', {people, max: 4, size: 'sm'});
 *   <span data-avatar="Jane Smith" data-avatar-size="lg"></span>  +  E.avatar.scan()
 */

import Popover from './popover.js';

export const AVATAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
export const AVATAR_SHAPES = ['circle', 'rounded', 'square'];
export const AVATAR_STATUSES = ['online', 'away', 'busy', 'offline'];
/** How many `.avatar-tone-*` classes elements.css defines. */
export const AVATAR_TONES = 8;

const OVERLAP = {none: 0, sm: 0.15, md: 0.3, lg: 0.45};
const ICON_NAME = /^[a-z0-9-]+$/i;

const DEFAULTS = {
    name: null,          // the person; initials, tone and accessible name come from it
    src: null,           // picture URL; falls back to initials / icon if it fails
    alt: null,           // accessible name when it should differ from `name`
    size: 'md',          // xs | sm | md | lg | xl
    shape: 'circle',     // circle | rounded | square
    status: null,        // online | away | busy | offline
    statusLabels: null,  // {online: 'En ligne', ...} - words used in the accessible name
    icon: null,          // icon name shown instead of initials (default 'user' when there is no name)
    title: null,         // hover text; true = the accessible name
    ring: false,         // a primary-coloured ring
    tone: null,          // 0-7 to pick the tint yourself; default = hash of the name
    decorative: false    // true = aria-hidden (the name is already written next to it)
};

const STATUS_WORDS = {online: 'online', away: 'away', busy: 'busy', offline: 'offline'};

/** Handles by element, so a second call or E.avatar.get() finds them. */
const avatars = new WeakMap();
const groups = new WeakMap();

function isNode(x) {
    return !!x && typeof x === 'object' && x.nodeType === 1;
}

function resolveTarget(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    if (isNode(target)) return target;
    if (typeof target.get === 'function' && isNode(target.get(0))) return target.get(0);
    if (typeof target.length === 'number' && isNode(target[0])) return target[0];
    return null;
}

function iconSystem() {
    return (typeof window !== 'undefined' && (window.Domma?.icons || window.I)) || null;
}

// ---------------------------------------------------------------------------
// Initials and tone
// ---------------------------------------------------------------------------

/** First letter of a word with any combining marks that belong to it (é written as e + ´). */
function firstLetter(word) {
    const m = word.match(/^\P{M}\p{M}*/u);
    return m ? m[0] : '';
}

/**
 * Initials for a name.
 *
 *   'Jane Smith'             -> 'JS'   first and last word
 *   'Jane Q. Public'         -> 'JP'
 *   'Madonna'                -> 'M'    one word, one letter
 *   'jane.smith@example.com' -> 'JS'   the part before the @, split on . _ - +
 *   'Jean-Luc Picard'        -> 'JP'
 *   'Łukasz Żuk'             -> 'ŁŻ'
 *   '王小明'                  -> '王'
 *   '', null, '  !! '        -> ''     nothing to go on: callers show an icon
 *
 * Words are split on spaces, dots, underscores, hyphens and plus signs;
 * anything that is not a letter or digit at the start of a word (quotes,
 * brackets, emoji) is skipped, and bracketed notes like "(Admin)" are dropped.
 */
export function avatarInitials(name) {
    if (name == null) return '';
    let s = String(name).trim();
    if (!s) return '';
    const at = s.indexOf('@');
    if (at > 0 && !/\s/.test(s)) s = s.slice(0, at);
    s = s.replace(/\([^)]*\)|\[[^\]]*\]/g, ' ');

    const words = s.split(/[\s._+\-]+/u)
        .map((w) => w.replace(/^[^\p{L}\p{N}]+/u, ''))
        .filter(Boolean);
    if (!words.length) return '';

    const first = firstLetter(words[0]);
    const last = words.length > 1 ? firstLetter(words[words.length - 1]) : '';
    return (first + last).toUpperCase();
}

/**
 * The tone (0-7) for a name: FNV-1a over the trimmed, lower-cased, single-spaced
 * name. Stable across pages, sessions and machines; case and spacing do not
 * change it, so 'jane smith' and 'Jane  Smith' match.
 */
export function avatarTone(key) {
    const s = String(key ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
    let h = 0x811c9dc5;
    for (const ch of s) {
        h ^= ch.codePointAt(0);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0) % AVATAR_TONES;
}

// ---------------------------------------------------------------------------
// One avatar
// ---------------------------------------------------------------------------

function pick(list, value, fallback) {
    return list.includes(value) ? value : fallback;
}

function toneFor(o) {
    const n = parseInt(o.tone, 10);
    if (Number.isFinite(n)) return ((n % AVATAR_TONES) + AVATAR_TONES) % AVATAR_TONES;
    const key = o.name || o.alt || o.src;
    return key ? avatarTone(key) : null;
}

/** The accessible name: "Jane Smith (online)", or '' for none. */
function labelFor(o) {
    const base = String(o.alt ?? o.name ?? '').trim();
    const status = pick(AVATAR_STATUSES, o.status, null);
    if (!status) return base;
    const word = (o.statusLabels && o.statusLabels[status]) || STATUS_WORDS[status];
    return base ? `${base} (${word})` : word;
}

/** Classes this module may put on an avatar element, so re-renders and destroy() can take them off. */
function ownClasses(el) {
    return Array.from(el.classList).filter((c) => c === 'avatar' || /^avatar-(xs|sm|md|lg|xl|rounded|square|ring|tone-\d+)$/.test(c));
}

function fallbackContent(o, initials) {
    if (initials && !o.icon) {
        const span = document.createElement('span');
        span.className = 'avatar-initials';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = initials;
        return span;
    }
    const icon = document.createElement('span');
    icon.className = 'avatar-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('data-icon', o.icon && ICON_NAME.test(o.icon) ? o.icon : 'user');
    return icon;
}

function drawIcons(el) {
    if (el.querySelector('.avatar-icon[data-icon]')) iconSystem()?.scan?.(el);
}

/**
 * Write the avatar into `el`: classes, content, status dot, ARIA. Returns the
 * facts a handle reports. `el` is emptied first - callers keep what was there.
 */
function paint(el, o) {
    const size = pick(AVATAR_SIZES, o.size, 'md');
    const shape = pick(AVATAR_SHAPES, o.shape, 'circle');
    const initials = avatarInitials(o.name || (o.alt && !o.src ? o.alt : ''));
    const tone = toneFor(o);

    el.classList.remove(...ownClasses(el));
    el.classList.add('avatar', `avatar-${size}`);
    if (shape !== 'circle') el.classList.add(`avatar-${shape}`);
    if (tone != null) el.classList.add(`avatar-tone-${tone}`);
    if (o.ring) el.classList.add('avatar-ring');
    el.textContent = '';

    if (o.src) {
        const img = document.createElement('img');
        img.className = 'avatar-img';
        img.alt = '';                 // the avatar element carries the name
        img.decoding = 'async';
        img.addEventListener('error', () => {
            if (img.parentNode !== el) return;
            el.replaceChild(fallbackContent(o, initials), img);
            el.classList.add('avatar-img-failed');
            drawIcons(el);
        }, {once: true});
        img.src = String(o.src);
        el.appendChild(img);
    } else {
        el.appendChild(fallbackContent(o, initials));
    }
    el.classList.remove('avatar-img-failed');

    const status = pick(AVATAR_STATUSES, o.status, null);
    if (status) {
        const dot = document.createElement('span');
        dot.className = `avatar-status avatar-status-${status}`;
        dot.setAttribute('aria-hidden', 'true');
        el.appendChild(dot);
    }

    // Accessible name. A link or button keeps its own role and is named by
    // aria-label; anything else becomes an image of the person.
    const label = labelFor(o);
    const interactive = /^(A|BUTTON)$/.test(el.tagName);
    el.removeAttribute('role');
    el.removeAttribute('aria-label');
    el.removeAttribute('aria-hidden');
    if (o.decorative && !interactive) {
        el.setAttribute('aria-hidden', 'true');
    } else if (label) {
        if (!interactive) el.setAttribute('role', 'img');
        el.setAttribute('aria-label', label);
    } else if (!interactive) {
        el.setAttribute('aria-hidden', 'true');
    }

    const title = o.title === true ? label : o.title;
    if (title) el.setAttribute('title', String(title));
    else el.removeAttribute('title');

    drawIcons(el);
    return {initials, tone, label, size, shape};
}

/** Options declared on the element: data-avatar="Jane Smith" data-avatar-size="lg" ... */
function optionsFromData(el) {
    const d = el.dataset || {};
    const out = {};
    if (d.avatar) out.name = d.avatar;
    const keys = ['src', 'alt', 'size', 'shape', 'status', 'icon', 'title', 'tone'];
    for (const key of keys) {
        const v = d[`avatar${key[0].toUpperCase()}${key.slice(1)}`];
        if (v != null && v !== '') out[key] = v;
    }
    for (const key of ['ring', 'decorative']) {
        const v = d[`avatar${key[0].toUpperCase()}${key.slice(1)}`];
        if (v != null) out[key] = v !== 'false';
    }
    return out;
}

const ATTRS = ['role', 'aria-label', 'aria-hidden', 'title'];

/**
 * Render one avatar.
 *
 * @param {string|Element|Object|null} target - selector, element or Domma
 *   collection that becomes the avatar; null (or an options object in its
 *   place) creates a detached <span> for you to insert.
 * @param {Object} [options] - see DEFAULTS
 * @returns {{element: Element, options: Object, initials: string, tone: number|null,
 *   label: string, update: Function, destroy: Function}|null}
 */
export function avatar(target, options = {}) {
    // E.avatar({name: 'Jane'}) - no target, just options
    if (target && typeof target === 'object' && !isNode(target) && typeof target.length !== 'number' &&
        typeof target.get !== 'function') {
        options = target;
        target = null;
    }

    let el;
    if (target == null) {
        el = document.createElement('span');
    } else {
        el = resolveTarget(target);
        if (!el) return null;
    }

    const previous = avatars.get(el);
    if (previous) previous.destroy();

    // What was there before, to put back on destroy().
    const saved = {
        children: document.createDocumentFragment(),
        classes: new Set(el.classList),
        attrs: Object.fromEntries(ATTRS.map((a) => [a, el.getAttribute(a)]))
    };
    while (el.firstChild) saved.children.appendChild(el.firstChild);

    let o = {...DEFAULTS, ...optionsFromData(el), ...options};
    let facts = paint(el, o);

    const handle = {
        element: el,
        get options() { return o; },
        get initials() { return facts.initials; },
        get tone() { return facts.tone; },
        get label() { return facts.label; },

        /** Merge new options and redraw. */
        update(changes = {}) {
            o = {...o, ...changes};
            facts = paint(el, o);
            return handle;
        },

        /** Take the avatar off and restore what the element had before. */
        destroy() {
            if (avatars.get(el) !== handle) return el;
            avatars.delete(el);
            el.textContent = '';
            el.appendChild(saved.children);
            for (const c of Array.from(el.classList)) if (!saved.classes.has(c)) el.classList.remove(c);
            for (const [a, v] of Object.entries(saved.attrs)) {
                if (v == null) el.removeAttribute(a);
                else el.setAttribute(a, v);
            }
            if (el.hasAttribute('data-avatar')) el.setAttribute('data-avatar-done', '');
            return el;
        }
    };

    avatars.set(el, handle);
    return handle;
}

avatar.initials = avatarInitials;
avatar.tone = avatarTone;

/** The live handle on an element, if any. */
avatar.get = function (target) {
    const el = resolveTarget(target);
    return (el && avatars.get(el)) || null;
};

/**
 * Turn every `[data-avatar]` under `root` (and `root` itself) into an avatar,
 * once. Options come from `data-avatar-*`. Returns the new handles.
 */
avatar.scan = function (root = document) {
    const scope = resolveTarget(root) || document;
    if (typeof scope.querySelectorAll !== 'function') return [];
    const nodes = Array.from(scope.querySelectorAll('[data-avatar]'));
    if (typeof scope.matches === 'function' && scope.matches('[data-avatar]')) nodes.unshift(scope);
    return nodes
        .filter((el) => !avatars.has(el) && !el.hasAttribute('data-avatar-done'))
        .map((el) => avatar(el));
};

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

const GROUP_DEFAULTS = {
    people: [],          // [{name, src, status, href, alt, icon, tone, title}] or plain name strings
    max: null,           // show this many, then "+N"; null = everyone
    size: 'md',
    shape: 'circle',
    overlap: null,       // 'none' | 'sm' | 'md' | 'lg', a number (px) or any CSS length; null = the stylesheet's (md)
    label: null,         // accessible name for the list, e.g. 'Project team'
    statusLabels: null,
    onMore: null,        // function(hiddenPeople, event) - replaces the built-in popover
    popover: true,       // the "+N" opens a popover listing the hidden names
    moreLabel: null      // function(count, names) => accessible name for the "+N" button
};

function normalisePerson(p) {
    if (p == null) return null;
    if (typeof p === 'string') return {name: p};
    return typeof p === 'object' ? p : null;
}

function listNames(names) {
    if (names.length <= 1) return names.join('');
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function overlapValue(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'number' && Number.isFinite(v)) return `${v}px`;
    if (Object.prototype.hasOwnProperty.call(OVERLAP, v)) {
        return `calc(var(--dm-avatar-size, 2.5rem) * ${OVERLAP[v]})`;
    }
    return String(v);
}

function personAvatar(person, o, extra = {}) {
    const el = document.createElement(person.href ? 'a' : 'span');
    if (person.href) el.setAttribute('href', String(person.href));
    const handle = avatar(el, {
        name: person.name,
        src: person.src,
        alt: person.alt,
        status: person.status,
        icon: person.icon,
        tone: person.tone,
        title: person.title ?? true,
        size: o.size,
        shape: o.shape,
        statusLabels: o.statusLabels,
        ...extra
    });
    return handle.element;
}

/** The popover body: every hidden person, a small avatar and their name. */
function hiddenList(hidden, o) {
    const ul = document.createElement('ul');
    ul.className = 'avatar-more-list';
    for (const person of hidden) {
        const li = document.createElement('li');
        const row = document.createElement(person.href ? 'a' : 'span');
        row.className = 'avatar-more-person';
        if (person.href) row.setAttribute('href', String(person.href));
        const pic = document.createElement('span');
        avatar(pic, {
            name: person.name, src: person.src, icon: person.icon, tone: person.tone,
            size: 'xs', shape: o.shape, decorative: true
        });
        const name = document.createElement('span');
        name.className = 'avatar-more-name';
        name.textContent = person.name || person.alt || '';
        row.append(pic, name);
        li.appendChild(row);
        ul.appendChild(li);
    }
    return ul;
}

/**
 * Render a stack of avatars with a "+N" overflow bubble.
 *
 * @param {string|Element|Object} target - a <ul>/<ol> to fill, or any element
 *   to put a new <ul> into (its content comes back on destroy())
 * @param {Object} [options] - see GROUP_DEFAULTS
 * @returns {{element: HTMLUListElement, people: Object[], shown: Object[], hidden: Object[],
 *   more: HTMLButtonElement|null, popover: Object|null, update: Function,
 *   setPeople: Function, destroy: Function}|null}
 */
export function avatarGroup(target, options = {}) {
    const host = resolveTarget(target);
    if (!host) return null;

    const previous = groups.get(host);
    if (previous) previous.destroy();

    const ownList = /^(UL|OL)$/.test(host.tagName);
    const saved = document.createDocumentFragment();
    const savedClasses = new Set(host.classList);
    const savedLabel = host.getAttribute('aria-label');
    const savedOverlap = host.style.getPropertyValue('--dm-avatar-overlap');
    while (host.firstChild) saved.appendChild(host.firstChild);

    const list = ownList ? host : document.createElement('ul');
    if (!ownList) host.appendChild(list);

    let o = {...GROUP_DEFAULTS, ...options};
    const state = {people: [], shown: [], hidden: [], more: null, popover: null};

    const teardownMore = () => {
        if (state.popover) state.popover.destroy();
        state.popover = null;
        state.more = null;
    };

    const draw = () => {
        teardownMore();
        const people = (Array.isArray(o.people) ? o.people : []).map(normalisePerson).filter(Boolean);
        const size = pick(AVATAR_SIZES, o.size, 'md');
        const max = parseInt(o.max, 10);
        const limit = Number.isFinite(max) && max >= 0 && max < people.length ? max : people.length;

        state.people = people;
        state.shown = people.slice(0, limit);
        state.hidden = people.slice(limit);

        list.textContent = '';
        for (const c of Array.from(list.classList)) if (/^avatar-group-(xs|sm|md|lg|xl)$/.test(c)) list.classList.remove(c);
        list.classList.add('avatar-group', `avatar-group-${size}`);
        if (o.label) list.setAttribute('aria-label', String(o.label));
        else if (!ownList || savedLabel == null) list.removeAttribute('aria-label');
        const overlap = overlapValue(o.overlap);
        if (overlap != null) list.style.setProperty('--dm-avatar-overlap', overlap);
        else list.style.removeProperty('--dm-avatar-overlap');

        for (const person of state.shown) {
            const li = document.createElement('li');
            li.className = 'avatar-group-item';
            li.appendChild(personAvatar(person, {...o, size}));
            list.appendChild(li);
        }

        if (state.hidden.length) {
            const count = state.hidden.length;
            const names = state.hidden.map((p) => p.name || p.alt || '').filter(Boolean);
            const li = document.createElement('li');
            li.className = 'avatar-group-item';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `avatar avatar-more avatar-${size}`;
            if (o.shape === 'rounded' || o.shape === 'square') btn.classList.add(`avatar-${o.shape}`);
            btn.textContent = `+${count}`;
            const label = typeof o.moreLabel === 'function'
                ? o.moreLabel(count, names)
                : `${count} more${names.length ? `: ${listNames(names)}` : ''}`;
            btn.setAttribute('aria-label', String(label));
            li.appendChild(btn);
            list.appendChild(li);
            state.more = btn;

            const hidden = state.hidden;
            if (typeof o.onMore === 'function') {
                btn.addEventListener('click', (e) => o.onMore(hidden.slice(), e));
            } else if (o.popover !== false) {
                state.popover = new Popover(btn, {
                    title: `${count} more`,
                    content: () => hiddenList(hidden, o),
                    placement: 'bottom',
                    className: 'avatar-more-popover',
                    maxWidth: '18rem'
                });
            } else if (names.length) {
                btn.title = names.join(', ');
            }
        }
    };

    draw();

    const handle = {
        element: list,
        get options() { return o; },
        get people() { return state.people; },
        get shown() { return state.shown; },
        get hidden() { return state.hidden; },
        get more() { return state.more; },
        get popover() { return state.popover; },

        update(changes = {}) {
            o = {...o, ...changes};
            draw();
            return handle;
        },

        setPeople(people) {
            return handle.update({people});
        },

        destroy() {
            if (groups.get(host) !== handle) return host;
            groups.delete(host);
            teardownMore();
            if (ownList) {
                list.textContent = '';
                for (const c of Array.from(list.classList)) if (!savedClasses.has(c)) list.classList.remove(c);
                if (savedLabel == null) list.removeAttribute('aria-label');
                else list.setAttribute('aria-label', savedLabel);
                if (savedOverlap) list.style.setProperty('--dm-avatar-overlap', savedOverlap);
                else list.style.removeProperty('--dm-avatar-overlap');
            } else {
                host.textContent = '';
            }
            host.appendChild(saved);
            return host;
        }
    };

    groups.set(host, handle);
    return handle;
}

/** The live group handle on a host element, if any. */
avatarGroup.get = function (target) {
    const el = resolveTarget(target);
    return (el && groups.get(el)) || null;
};

export default avatar;
