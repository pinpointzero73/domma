/**
 * Whether an element can carry the smooth caret: an enabled, writable textarea, a text-like
 * input (text, search, url, tel) or a contenteditable element.
 * @param {Element|null|undefined} element
 * @returns {boolean}
 */
export function supportsSmoothCaret(element: Element | null | undefined): boolean;
/**
 * The stored caret preference ('auto' when none or unreadable).
 * @param {Window} [win]
 * @returns {CaretPreference}
 */
export function getCaretPreference(win?: Window): CaretPreference;
/**
 * Store the caret preference (anything else is stored as 'auto') and tell every attached caret.
 * @param {CaretPreference} value
 * @param {Window} [win]
 * @returns {void}
 */
export function setCaretPreference(value: CaretPreference, win?: Window): void;
/**
 * Attach a smooth caret to one control. Attaching twice returns the same handle; an element
 * that cannot carry one gets a handle that does nothing.
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLElement} textarea
 * @returns {SmoothCaretHandle}
 */
export function attachSmoothCaret(textarea: HTMLInputElement | HTMLTextAreaElement | HTMLElement): SmoothCaretHandle;
/**
 * Enhance controls on focus, including controls rendered later by a wizard,
 * dialog or Web Component. Only the focused automatic instance is retained.
 * Explicitly attached editor instances keep their owner's lifecycle.
 * @param {Document|HTMLElement|ShadowRoot} [root=document]
 * @returns {{destroy(): void}}
 */
export function installSmoothCarets(root?: Document | HTMLElement | ShadowRoot): {
    destroy(): void;
};
export namespace smoothCaret {
    export { attachSmoothCaret as attach };
    export { installSmoothCarets as install };
    export { getCaretPreference as getPreference };
    export { setCaretPreference as setPreference };
}
/**
 * Caret preference kept in localStorage: 'auto' follows prefers-reduced-motion.
 */
export type CaretPreference = "auto" | "smooth" | "native";
/**
 * What `attach()` returns.
 */
export type SmoothCaretHandle = {
    /**
     * Re-measure and redraw the caret now
     */
    refresh: () => void;
    /**
     * Remove the caret and every listener, restoring the control
     */
    destroy: () => void;
};
export type SmoothCaret = typeof smoothCaret;
