/**
 * Programmatic API - from public/showcase/elements/number-badge.
 */
export function mount(root) {
      // The web-component demo buttons. One delegated handler rather than five
      // inline onclick attributes, which are the thing .on() exists to replace.
    $('body').on('click', '[data-wc-action]', function () {
        const el = $(root).find('#wc-demo')[0];
        if (!el) return;
        // attr() rather than data(): the hook IS the attribute, and reading it
        // directly avoids depending on kebab-to-camel key conversion.
        const action = $(this).attr('data-wc-action');
        const arg = $(this).attr('data-arg');
        if (arg === undefined || arg === null) el[action]();
        else el[action](action === 'setCount' ? Number(arg) : arg);
      });
}
