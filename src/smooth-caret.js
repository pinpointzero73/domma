/**
 * A visual caret for text inputs, textareas and rich-text editors. Text entry, selection, undo and IME
 * remain native. Measure at most once per animation frame; animate only the
 * small overlay, never the input or its text.
 */
const TEXT_STYLES = [
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant',
    'fontStretch', 'fontFeatureSettings', 'fontKerning', 'fontVariationSettings',
    'lineHeight', 'letterSpacing', 'wordSpacing', 'textIndent', 'textAlign',
    'textTransform', 'direction', 'tabSize', 'paddingTop', 'paddingRight',
    'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
    'borderBottomWidth', 'borderLeftWidth'
];

/**
 * Caret preference kept in localStorage: 'auto' follows prefers-reduced-motion.
 * @typedef {'auto'|'smooth'|'native'} CaretPreference
 */

/**
 * What `attach()` returns.
 * @typedef {object} SmoothCaretHandle
 * @property {() => void} refresh Re-measure and redraw the caret now
 * @property {() => void} destroy Remove the caret and every listener, restoring the control
 */

/** @typedef {typeof smoothCaret} SmoothCaret */

const instances = new WeakMap();
const installations = new WeakMap();
const INPUT_TYPES = new Set(['text', 'search', 'url', 'tel']);

/**
 * Whether an element can carry the smooth caret: an enabled, writable textarea, a text-like
 * input (text, search, url, tel) or a contenteditable element.
 * @param {Element|null|undefined} element
 * @returns {boolean}
 */
export function supportsSmoothCaret(element) {
    return !!element && !element.disabled && !element.readOnly && (element.tagName === 'TEXTAREA'
        || (element.tagName === 'INPUT' && INPUT_TYPES.has(element.type))
        || element.getAttribute?.('contenteditable') === 'true'
        || element.getAttribute?.('contenteditable') === '');
}

const PREFERENCE_KEY = 'domma:editor-caret';
const PREFERENCE_EVENT = 'dm-editor-caret-preference';

/**
 * The stored caret preference ('auto' when none or unreadable).
 * @param {Window} [win]
 * @returns {CaretPreference}
 */
export function getCaretPreference(win = globalThis.window) {
    try {
        const value = win.localStorage.getItem(PREFERENCE_KEY);
        return ['smooth', 'native'].includes(value) ? value : 'auto';
    } catch { return 'auto'; }
}

/**
 * Store the caret preference (anything else is stored as 'auto') and tell every attached caret.
 * @param {CaretPreference} value
 * @param {Window} [win]
 * @returns {void}
 */
export function setCaretPreference(value, win = globalThis.window) {
    const preference = ['smooth', 'native'].includes(value) ? value : 'auto';
    try { win.localStorage.setItem(PREFERENCE_KEY, preference); } catch { /* private browser */ }
    win.dispatchEvent(new win.CustomEvent(PREFERENCE_EVENT, {detail: preference}));
}

/**
 * Attach a smooth caret to one control. Attaching twice returns the same handle; an element
 * that cannot carry one gets a handle that does nothing.
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLElement} textarea
 * @returns {SmoothCaretHandle}
 */
export function attachSmoothCaret(textarea) {
    if (!supportsSmoothCaret(textarea)) return {refresh() {}, destroy() {}};
    const existing = instances.get(textarea);
    if (existing) return existing;
    const doc = textarea.ownerDocument;
    const win = doc.defaultView;
    const parent = textarea.parentElement;
    const rich = textarea.tagName !== 'INPUT' && textarea.tagName !== 'TEXTAREA';
    const singleLine = textarea.tagName === 'INPUT';
    const isFocused = () => textarea.getRootNode().activeElement === textarea;
    if (!parent || !win?.ResizeObserver || !win.matchMedia) return {refresh() {}, destroy() {}};

    const motion = win.matchMedia('(prefers-reduced-motion: reduce)');
    const contrast = win.matchMedia('(forced-colors: active)');
    let oldPosition = '';
    let positioned = false;

    const mirror = doc.createElement('div');
    mirror.setAttribute('aria-hidden', 'true');
    mirror.style.cssText = 'position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none;box-sizing:border-box;height:auto;min-height:0;border-style:solid;';
    const prefix = doc.createTextNode('');
    const marker = doc.createElement('span');
    mirror.append(prefix, marker);
    if (!rich) doc.body.appendChild(mirror);

    const layer = doc.createElement('div');
    layer.className = 'dm-smooth-caret-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:absolute;overflow:hidden;pointer-events:none;z-index:3;display:none;';
    const caret = doc.createElement('span');
    caret.className = 'dm-smooth-caret';
    caret.style.cssText = 'position:absolute;top:0;left:0;width:2px;pointer-events:none;will-change:transform;';
    layer.appendChild(caret);
    parent.appendChild(layer);

    let frame = null;
    let blink = null;
    let animation = null;
    let composing = false;
    let dragging = false;
    let destroyed = false;
    let previous = null;
    let snap = true;
    let nativeCaret = null;
    let preference = getCaretPreference(win);
    const listeners = [];
    function listen(target, event, handler, options) {
        target.addEventListener(event, handler, options);
        listeners.push(() => target.removeEventListener(event, handler, options));
    }
    function hide() {
        layer.style.display = 'none';
        previous = null;
        clearTimeout(blink);
        animation?.cancel();
        if (nativeCaret) {
            if (nativeCaret.value) textarea.style.setProperty('caret-color', nativeCaret.value, nativeCaret.priority);
            else textarea.style.removeProperty('caret-color');
            nativeCaret = null;
        }
    }
    function draw() {
        frame = null;
        if (destroyed) return;
        const selection = rich ? doc.getSelection() : null;
        const selected = rich ? !selection?.isCollapsed || !textarea.contains(selection?.anchorNode)
            : textarea.selectionStart !== textarea.selectionEnd;
        const disabled = preference === 'native' || (preference === 'auto' && motion.matches);
        textarea.dataset.caretMode = contrast.matches ? 'forced-colors' : disabled ? (preference === 'native' ? 'native' : 'system-reduced-motion') : 'smooth';
        if (!isFocused() || !supportsSmoothCaret(textarea) || composing || dragging || disabled || contrast.matches
            || selected || !textarea.getClientRects().length) {
            hide();
            return;
        }
        // Editors can attach the caret while their form is still detached.
        // Computed styles are unavailable then, so establish the containing
        // block only when the mounted, focused editor is ready to draw.
        if (!positioned && win.getComputedStyle(parent).position === 'static') {
            oldPosition = parent.style.position;
            parent.style.position = 'relative';
            positioned = true;
        }
        const style = win.getComputedStyle(textarea);
        const rect = textarea.getBoundingClientRect();
        const box = parent.getBoundingClientRect();
        let x, y, height, line;
        if (rich) {
            const range = selection.getRangeAt(0).cloneRange();
            let node = range.startContainer;
            let emptyBlock = node.nodeType === 1 ? node : node.parentElement;
            // Selections restored by a toolbar often point BETWEEN blocks,
            // rather than into a text node. Resolve that boundary to its text
            // so paragraph margins and inline formatting stay in the geometry.
            if (node.nodeType === 1) {
                const next = node.childNodes[range.startOffset];
                const previousNode = node.childNodes[range.startOffset - 1];
                const child = next || previousNode;
                if (child) {
                    const walker = doc.createTreeWalker(child, win.NodeFilter.SHOW_TEXT);
                    const texts = [];
                    if (child.nodeType === 3 && child.length) texts.push(child);
                    else { let text; while ((text = walker.nextNode())) if (text.length) texts.push(text); }
                    const text = next ? texts[0] : texts[texts.length - 1];
                    if (text) {
                        range.setStart(text, next ? 0 : text.length);
                        range.collapse(true);
                        node = text;
                    } else if (child.nodeType === 1 && child.tagName !== 'BR') emptyBlock = child;
                }
            }
            let point = range.getClientRects()[0];
            let trailing = false;
            if ((!point || !point.height) && node.nodeType === 3 && node.length) {
                const offset = range.startOffset;
                range.setStart(node, offset > 0 ? offset - 1 : 0);
                range.setEnd(node, offset > 0 ? offset : 1);
                point = range.getClientRects()[0];
                trailing = offset > 0;
            }
            const element = node.nodeType === 1 ? emptyBlock : node.parentElement;
            const textStyle = win.getComputedStyle(element || textarea);
            line = parseFloat(textStyle.lineHeight) || parseFloat(textStyle.fontSize) * 1.2;
            height = point?.height || parseFloat(textStyle.fontSize) * 1.2;
            if (point?.height) {
                x = (trailing ? point.right : point.left) - rect.left;
                y = point.top - rect.top;
            } else {
                // Empty editable blocks have no text rectangle. Use their
                // content edge without inserting nodes into the user's HTML.
                const block = (element || textarea).getBoundingClientRect();
                x = block.left - rect.left + parseFloat(textStyle.paddingLeft);
                y = block.top - rect.top + parseFloat(textStyle.paddingTop);
            }
        } else {
            for (const name of TEXT_STYLES) mirror.style[name] = style[name];
            mirror.style.width = (textarea.clientWidth + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)) + 'px';
            mirror.style.whiteSpace = singleLine || textarea.wrap === 'off' ? 'pre' : 'pre-wrap';
            mirror.style.overflowWrap = singleLine || textarea.wrap === 'off' ? 'normal' : 'break-word';
            prefix.data = textarea.value.slice(0, textarea.selectionStart);
            marker.textContent = textarea.value.slice(textarea.selectionStart) || '\u200b';
            const point = marker.getClientRects()[0];
            if (!point) { hide(); return; }
            const mirrorRect = mirror.getBoundingClientRect();
            x = point.left - mirrorRect.left - textarea.scrollLeft;
            line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
            height = Math.min(line, parseFloat(style.fontSize) * 1.2);
            y = singleLine ? textarea.clientTop + (textarea.clientHeight - height) / 2 : point.top - mirrorRect.top - textarea.scrollTop;
        }
        if (x < textarea.clientLeft || x > textarea.clientLeft + textarea.clientWidth
            || y + height < textarea.clientTop || y >= textarea.clientTop + textarea.clientHeight) {
            hide(); return;
        }
        const color = nativeCaret ? nativeCaret.color : style.caretColor;
        layer.style.left = (rect.left - box.left + parent.scrollLeft - parent.clientLeft) + 'px';
        layer.style.top = (rect.top - box.top + parent.scrollTop - parent.clientTop) + 'px';
        layer.style.width = rect.width + 'px';
        layer.style.height = rect.height + 'px';
        caret.style.height = height + 'px';
        caret.style.background = color === 'auto' || color === 'transparent' ? style.color : color;
        caret.style.transition = !snap && previous && Math.abs(y - previous.y) < line * 1.5
            ? 'transform 100ms cubic-bezier(.2,.7,.3,1)' : 'none';
        caret.style.transform = `translate(${x}px, ${y}px)`;
        layer.style.display = 'block';
        if (!nativeCaret) {
            nativeCaret = {value: textarea.style.getPropertyValue('caret-color'), priority: textarea.style.getPropertyPriority('caret-color'), color};
            textarea.style.setProperty('caret-color', 'transparent', 'important');
        }
        animation?.cancel();
        caret.style.opacity = '1';
        clearTimeout(blink);
        blink = setTimeout(() => {
            if (!destroyed && layer.style.display !== 'none' && caret.animate) {
                animation = caret.animate([{opacity: 1}, {opacity: 0}], {duration: 1000, iterations: Infinity, easing: 'steps(2, jump-none)'});
            }
        }, 500);
        previous = {x, y};
        snap = false;
    }
    function schedule(immediate = false) {
        if (destroyed) return;
        snap ||= immediate;
        if (frame === null) frame = win.requestAnimationFrame(draw);
    }
    for (const event of ['input', 'keyup', 'select', 'selectionchange']) listen(textarea, event, () => schedule());
    listen(doc, 'selectionchange', () => { if (isFocused()) schedule(); });
    listen(textarea, 'focus', () => schedule(true));
    listen(textarea, 'blur', hide);
    listen(win, 'blur', hide);
    listen(win, 'focus', () => schedule(true));
    listen(textarea, 'scroll', () => schedule(true), {passive: true});
    listen(textarea, 'pointerdown', () => { dragging = true; hide(); });
    listen(doc, 'pointerup', () => { if (dragging) { dragging = false; schedule(true); } });
    listen(textarea, 'compositionstart', () => { composing = true; hide(); });
    listen(textarea, 'compositionend', () => { composing = false; schedule(true); });
    const updatePreference = event => {
        preference = event.type === PREFERENCE_EVENT ? event.detail : getCaretPreference(win);
        schedule(true);
    };
    listen(win, PREFERENCE_EVENT, updatePreference);
    listen(win, 'storage', updatePreference);
    listen(doc, 'pointercancel', () => { dragging = false; schedule(true); });
    listen(motion, 'change', () => schedule(true));
    listen(contrast, 'change', () => schedule(true));
    const resize = new win.ResizeObserver(() => schedule(true));
    resize.observe(textarea);
    schedule(true);
    const api = {
        refresh() { schedule(true); },
        destroy() {
            if (destroyed) return;
            destroyed = true;
            instances.delete(textarea);
            hide();
            if (frame !== null) win.cancelAnimationFrame(frame);
            resize.disconnect();
            for (const remove of listeners) remove();
            delete textarea.dataset.caretMode;
            mirror.remove();
            layer.remove();
            if (positioned) parent.style.position = oldPosition;
        }
    };
    instances.set(textarea, api);
    return api;
}


/**
 * Enhance controls on focus, including controls rendered later by a wizard,
 * dialog or Web Component. Only the focused automatic instance is retained.
 * Explicitly attached editor instances keep their owner's lifecycle.
 * @param {Document|HTMLElement|ShadowRoot} [root=document]
 * @returns {{destroy(): void}}
 */
export function installSmoothCarets(root = globalThis.document) {
    if (!root?.addEventListener) return {destroy() {}};
    const existing = installations.get(root);
    if (existing) return existing;
    const doc = root.ownerDocument || root;
    let active = null;
    const release = () => {
        active?.api.destroy();
        active = null;
        observer?.disconnect();
    };
    const observer = doc.defaultView?.MutationObserver ? new doc.defaultView.MutationObserver(() => {
        if (active && !active.element.isConnected) release();
    }) : null;
    const focus = event => {
        const path = event.composedPath?.() || [event.target];
        const element = path.find(supportsSmoothCaret);
        if (!element || active?.element === element) return;
        release();
        if (instances.has(element)) return;
        active = {element, api: attachSmoothCaret(element)};
        observer?.observe(doc, {childList: true, subtree: true});
    };
    const blur = event => {
        if (active && (event.composedPath?.() || [event.target]).includes(active.element)) release();
    };
    // Capture also observes fields inside shadow roots and surfaces whose
    // handlers stop bubbling focus events.
    root.addEventListener('focusin', focus, true);
    root.addEventListener('focusout', blur, true);
    const focused = doc.activeElement;
    if (focused) focus({target: focused, composedPath: () => [focused]});
    const api = {destroy() {
        release();
        root.removeEventListener('focusin', focus, true);
        root.removeEventListener('focusout', blur, true);
        installations.delete(root);
    }};
    installations.set(root, api);
    return api;
}

export const smoothCaret = {
    attach: attachSmoothCaret,
    install: installSmoothCarets,
    getPreference: getCaretPreference,
    setPreference: setCaretPreference
};
