/** The showcase's appearance picker. Theme persistence belongs to Domma.theme. */
export function mountThemePicker(host, themes, themeManager) {
    if (!themes.length || !themeManager || host.dataset.appearanceMounted) return;
    host.dataset.appearanceMounted = 'true';
    const control = document.createElement('div');
    control.className = 'djs-appearance';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'djs-appearance-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span data-icon="palette" aria-hidden="true"></span><span>Theme</span>';

    const dialog = document.createElement('dialog');
    dialog.className = 'djs-appearance-panel';
    const titleId = `djs-appearance-title-${document.querySelectorAll('.djs-appearance-panel').length}`;
    dialog.setAttribute('aria-labelledby', titleId);
    dialog.innerHTML = `
        <header class="djs-appearance-header">
            <div><p class="djs-appearance-eyebrow">A little more you</p><h2 id="${titleId}">Choose your look</h2></div>
            <button class="djs-appearance-close" type="button" aria-label="Close theme picker"><span data-icon="x" aria-hidden="true"></span></button>
        </header>
        <p class="djs-appearance-intro">A fresh palette for every page. Pick one to try it.</p>
        <div class="djs-appearance-modes" role="group" aria-label="Theme appearance">
            <button type="button" data-mode="light"><span data-icon="sun" aria-hidden="true"></span>Light</button>
            <button type="button" data-mode="dark"><span data-icon="moon" aria-hidden="true"></span>Dark</button>
            <button type="button" data-mode="all">All</button>
        </div>
        <div class="djs-appearance-grid" role="group" aria-label="Colour palettes"></div>
        <footer class="djs-appearance-footer"><span class="djs-appearance-current" role="status" aria-live="polite"></span><span>Saved for your next visit</span></footer>`;
    const grid = dialog.querySelector('.djs-appearance-grid');
    const status = dialog.querySelector('.djs-appearance-current');
    const saveNote = dialog.querySelector('.djs-appearance-footer > span:last-child');
    const modes = [...dialog.querySelectorAll('[data-mode]')];
    const modeOf = id => id.endsWith('-light') ? 'light' : id.endsWith('-dark') ? 'dark' : 'all';
    let mode = modeOf(themeManager.get());

    const cards = themes.map(theme => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'djs-appearance-card';
        button.dataset.theme = theme.id;
        button.setAttribute('aria-label', theme.label);
        button.style.setProperty('--djs-swatch-from', theme.from || '#64748b');
        button.style.setProperty('--djs-swatch-to', theme.to || theme.from || '#64748b');
        button.dataset.tone = modeOf(theme.id) === 'light' ? 'light' : 'dark';
        button.innerHTML = '<span class="djs-appearance-preview" aria-hidden="true"><span class="djs-appearance-preview-nav"></span><span class="djs-appearance-preview-content"><i></i><i></i><i></i></span><span class="djs-appearance-check"><span data-icon="check"></span></span></span><span class="djs-appearance-name"></span>';
        button.querySelector('.djs-appearance-name').textContent = theme.label;
        button.addEventListener('click', () => apply(theme.id));
        grid.appendChild(button);
        return button;
    });

    function update() {
        const current = themeManager.get();
        const selected = themes.find(theme => theme.id === current);
        trigger.setAttribute('aria-label', `Choose theme. Current: ${selected?.label || current}`);
        status.textContent = `${selected?.label || current} applied`;
        modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
        cards.forEach(button => {
            button.hidden = mode !== 'all' && modeOf(button.dataset.theme) !== mode;
            button.setAttribute('aria-pressed', String(button.dataset.theme === current));
        });
    }

    function apply(id) {
        themeManager.set(id);
        // Match the CMS switcher when leaving a site's custom theme override.
        [...document.body.classList].filter(name => name.startsWith('dm-custom-')).forEach(name => document.body.classList.remove(name));
        try {
            localStorage.setItem('dommajs.appearance', id);
            saveNote.textContent = 'Saved for your next visit';
        } catch {
            saveNote.textContent = 'Applied to this page';
        }
        update();
    }

    modes.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        const current = themeManager.get();
        const paired = current.replace(/-(light|dark)$/, `-${mode}`);
        if (mode !== 'all' && modeOf(current) !== 'all' && themes.some(theme => theme.id === paired)) apply(paired);
        else update();
        grid.scrollTop = 0;
    }));

    function position() {
        if (!dialog.open) return;
        const rect = trigger.getBoundingClientRect();
        const small = window.matchMedia('(max-width: 600px)').matches;
        dialog.style.top = small ? 'auto' : `${Math.max(12, Math.min(rect.bottom + 12, innerHeight - dialog.offsetHeight - 12))}px`;
        dialog.style.left = small ? '12px' : `${Math.max(12, Math.min(rect.right - dialog.offsetWidth, innerWidth - dialog.offsetWidth - 12))}px`;
    }

    trigger.addEventListener('click', () => {
        mode = modeOf(themeManager.get());
        update();
        dialog.showModal();
        trigger.setAttribute('aria-expanded', 'true');
        position();
        const selected = cards.find(button => button.getAttribute('aria-pressed') === 'true' && !button.hidden);
        if (selected) {
            selected.focus({preventScroll: true});
            grid.scrollTop = Math.max(0, selected.offsetTop - grid.offsetTop - 12);
        }
    });
    dialog.querySelector('.djs-appearance-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus({preventScroll: true});
    });
    window.addEventListener('resize', position);
    themeManager.onChange(update);
    control.appendChild(trigger);
    host.replaceWith(control);
    document.body.appendChild(dialog);
    window.Domma?.icons?.scan(control);
    window.Domma?.icons?.scan(dialog);
    // The CMS initialises its theme without persistence, so keep this site's
    // visitor preference separately from the site's configured default.
    try {
        const saved = localStorage.getItem('dommajs.appearance');
        if (themes.some(theme => theme.id === saved)) {
            mode = modeOf(saved);
            apply(saved);
        }
    } catch { saveNote.textContent = 'Applied to this page'; }
    update();
    return {trigger, dialog};
}

function enhance() {
    const themes = window.__CMS_THEME_SWITCHER__?.themes;
    if (!themes?.length || !window.Domma?.theme) return;
    document.querySelectorAll('.dm-menu-theme-switcher .dm-theme-switcher').forEach(host => {
        const available = new Set([...host.querySelectorAll('[data-theme]')].map(button => button.dataset.theme));
        mountThemePicker(host, themes.filter(theme => available.has(theme.id)), window.Domma.theme);
    });
}

// The CMS builds its navigation after the page has been parsed.
enhance();
const observer = new MutationObserver(enhance);
observer.observe(document.querySelector('#site-navbar') || document.body, {childList: true, subtree: true});
