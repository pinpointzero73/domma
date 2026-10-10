/**
 * Dynamic content - a tab's content loads the first time it is opened, with a
 * skeleton while it does. Pending loads are cancelled on teardown.
 */
export function mount(root) {
    const timers = new Set();

    E.tabs(root.querySelector('#dynamic-tabs'), {
        onChange: (index, panel) => {
            if (panel.dataset.loaded) return;
            panel.dataset.loaded = 'loading';
            $(panel).html('<div class="skeleton-lines" aria-busy="true"><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div></div>');
            const timer = setTimeout(() => {
                timers.delete(timer);
                $(panel).html(`<p>Content for tab ${index + 1}, loaded when you opened it.</p>
                    <p class="text-sm text-muted">Loaded at ${D().format('HH:mm:ss')}</p>`);
                panel.dataset.loaded = 'true';
            }, 800);
            timers.add(timer);
        }
    });

    return () => timers.forEach(clearTimeout);
}
