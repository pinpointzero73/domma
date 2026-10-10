/**
 * Quick Integration Reference - from public/showcase/integrations.
 *
 * The tab markup is static, so it lives in demo.html; E.tabs() only wires it up.
 */
export function mount(root) {
    const tabs = E.tabs($(root).find('#reference-tabs .tabs')[0]);
    return () => tabs?.destroy?.();
}
