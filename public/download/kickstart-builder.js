/**
 * Kickstart Builder — browser-side project scaffolder.
 *
 * Renders into #kickstart-builder.  Requires:
 *   - JSZip  (window.JSZip)
 *   - FileSaver.js (window.saveAs)
 *   - DOMPurify (window.DOMPurify) — already loaded on the download page
 *   - Domma ($, Domma) already loaded on the page
 */

(function () {
  'use strict';

  const THEMES = [
    'charcoal-dark', 'ocean-dark', 'forest-dark', 'sunset-dark',
    'royal-dark', 'silver-light', 'ocean-light', 'forest-light',
    'sunset-light', 'lemon-light',
    'unicorn-light', 'unicorn-dark', 'dreamy-light', 'dreamy-dark',
    'grayve-light', 'grayve-dark',
    'mint-light', 'mint-dark',
    'wedding-light', 'wedding-dark',
  ];

  const DEFAULT_THEME   = 'charcoal-dark';
  const DEFAULT_PROJECT = 'my-app';
  const MANIFEST_URL    = 'kickstart-manifest.json';

  // Human-readable labels for page/view groups
  const PAGE_LABELS = {
    home:    'Home',
    about:   'About',
    contact: 'Contact',
    blog:    'Blog',
    docs:    'Docs',
    privacy: 'Privacy Policy',
    terms:   'Terms of Service',
    cookies: 'Cookie Policy',
    '404':   '404 Page',
  };

  // Groups that are always included (cannot be deselected)
  const REQUIRED_GROUPS = new Set(['home', '404', 'core', 'config', 'dist']);

  // Sanitise HTML before inserting via innerHTML
  const purify = (html) =>
    typeof DOMPurify !== 'undefined'
      ? DOMPurify.sanitize(html, { ADD_ATTR: ['data-icon', 'data-icon-size', 'data-group'] })
      : html;

  let manifest = null;

  // ─── State ─────────────────────────────────────────────────────────────────

  const state = {
    mode:                 'spa',
    projectName:          DEFAULT_PROJECT,
    theme:                DEFAULT_THEME,
    includeAi:            true,
    includeThemeSelector: false,
    selectedGroups:       new Set(),
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  function render(mf) {
    const container = document.getElementById('kickstart-builder');
    if (!container) return;

    const mode  = state.mode;
    const files = mf[mode] || [];

    // Collect optional page/view groups for current mode
    const optionalGroups = [];
    const seenGroups     = new Set();
    for (const f of files) {
      const skip = f.group === 'ai' || f.group === 'core' || f.group === 'config' || f.group === 'dist';
      if (skip || f.required || seenGroups.has(f.group)) continue;
      seenGroups.add(f.group);
      optionalGroups.push({ group: f.group, label: PAGE_LABELS[f.group] || f.label || f.group });
    }

    // Collect required non-core groups (home, 404) for display
    const requiredGroups = [];
    const seenRequired   = new Set();
    for (const f of files) {
      const isCoreGroup = f.group === 'core' || f.group === 'config' || f.group === 'dist';
      if (f.required && !isCoreGroup && !seenRequired.has(f.group)) {
        seenRequired.add(f.group);
        requiredGroups.push({ group: f.group, label: PAGE_LABELS[f.group] || f.label || f.group });
      }
    }

    const themeOptions = THEMES.map(t =>
      `<option value="${t}" ${t === state.theme ? 'selected' : ''}>${t}</option>`
    ).join('');

    const requiredCheckboxes = requiredGroups.map(g =>
      `<label class="d-flex align-items-center gap-2" style="opacity:0.7;" title="Always included">
        <input type="checkbox" checked disabled>
        <span>${escapeHtml(g.label)} <small class="text-muted">(required)</small></span>
      </label>`
    ).join('');

    const optionalCheckboxes = optionalGroups.map(g =>
      `<label class="d-flex align-items-center gap-2 cursor-pointer">
        <input type="checkbox" class="kb-page-check" data-group="${escapeAttr(g.group)}" checked>
        <span>${escapeHtml(g.label)}</span>
      </label>`
    ).join('');

    const html = `
      <div class="card mt-4" style="border: 1px solid var(--dm-border);">
        <div class="card-header d-flex align-items-center gap-2">
          <span data-icon="settings" data-icon-size="20" style="color: var(--dm-primary);"></span>
          <h3 class="mb-0" style="font-size: 1.1rem;">Kickstart Builder</h3>
          <span class="badge badge-primary ms-auto" style="font-size: 0.7rem;">Browser-side — no server needed</span>
        </div>
        <div class="card-body">
          <div class="row g-4">

            <!-- Architecture -->
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold mb-2">Architecture</label>
              <div class="d-flex gap-3">
                <label class="d-flex align-items-center gap-2 cursor-pointer">
                  <input type="radio" name="kb-mode" value="spa" ${mode === 'spa' ? 'checked' : ''}>
                  <span><strong>SPA</strong> <span class="badge badge-success" style="font-size:0.65rem;">Default</span></span>
                </label>
                <label class="d-flex align-items-center gap-2 cursor-pointer">
                  <input type="radio" name="kb-mode" value="mpa" ${mode === 'mpa' ? 'checked' : ''}>
                  <span><strong>MPA</strong></span>
                </label>
              </div>
            </div>

            <!-- Project name -->
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold mb-2" for="kb-project-name">Project Name</label>
              <input type="text" id="kb-project-name" class="form-control"
                     value="${escapeAttr(state.projectName)}"
                     placeholder="my-app" maxlength="64">
              <small class="text-muted">Lowercase letters, numbers, hyphens</small>
            </div>

            <!-- Theme -->
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold mb-2" for="kb-theme">Theme</label>
              <select id="kb-theme" class="form-control">${themeOptions}</select>
            </div>

            <!-- Options -->
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold mb-2">Options</label>
              <div class="d-flex flex-column gap-2">
                <label class="d-flex align-items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="kb-include-ai" ${state.includeAi ? 'checked' : ''}>
                  <span>Include AI files <small class="text-muted">(CLAUDE.md, blueprints/)</small></span>
                </label>
                <label class="d-flex align-items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="kb-theme-selector" ${state.includeThemeSelector ? 'checked' : ''}>
                  <span>Include theme selector widget</span>
                </label>
              </div>
            </div>

            <!-- Pages / Views -->
            <div class="col-12">
              <label class="form-label fw-semibold mb-2">
                ${mode === 'spa' ? 'Views' : 'Pages'}
              </label>
              <div class="d-flex flex-wrap gap-3">
                ${requiredCheckboxes}
                ${optionalCheckboxes}
              </div>
            </div>

          </div>

          <!-- Download -->
          <div class="d-flex align-items-center gap-3 mt-4 pt-4" style="border-top: 1px solid var(--dm-border);">
            <button id="kb-download-btn" class="btn btn-primary btn-lg d-flex align-items-center gap-2">
              <span data-icon="download" data-icon-size="20"></span>
              Download .zip
            </button>
            <span id="kb-status" class="text-muted" style="font-size: 0.9rem;"></span>
          </div>
        </div>
      </div>`;

    container.innerHTML = purify(html);

    // Mark all optional groups as selected (default: all on)
    for (const g of optionalGroups) {
      state.selectedGroups.add(g.group);
    }

    bindEvents(mf);

    if (typeof Domma !== 'undefined' && Domma.icons) {
      Domma.icons.scan(container);
    }
  }

  // ─── Event binding ──────────────────────────────────────────────────────────

  function bindEvents(mf) {
    document.querySelectorAll('input[name="kb-mode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          state.mode = radio.value;
          state.selectedGroups.clear();
          render(mf);
        }
      });
    });

    const nameInput = document.getElementById('kb-project-name');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        state.projectName = nameInput.value.trim() || DEFAULT_PROJECT;
      });
    }

    const themeSelect = document.getElementById('kb-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', () => { state.theme = themeSelect.value; });
    }

    const aiCheck = document.getElementById('kb-include-ai');
    if (aiCheck) {
      aiCheck.addEventListener('change', () => { state.includeAi = aiCheck.checked; });
    }

    const selectorCheck = document.getElementById('kb-theme-selector');
    if (selectorCheck) {
      selectorCheck.addEventListener('change', () => { state.includeThemeSelector = selectorCheck.checked; });
    }

    document.querySelectorAll('.kb-page-check').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          state.selectedGroups.add(cb.dataset.group);
        } else {
          state.selectedGroups.delete(cb.dataset.group);
        }
      });
    });

    const dlBtn = document.getElementById('kb-download-btn');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => buildAndDownload(mf));
    }
  }

  // ─── Build & download ───────────────────────────────────────────────────────

  async function buildAndDownload(mf) {
    const btn    = document.getElementById('kb-download-btn');
    const status = document.getElementById('kb-status');

    btn.disabled       = true;
    status.textContent = 'Fetching files…';

    try {
      const projectName = sanitiseName(state.projectName);
      const mode        = state.mode;

      const templateFiles = (mf[mode] || []).filter(f => shouldInclude(f));
      const distFiles     = (mf.dist || []);
      const allFiles      = [...templateFiles, ...distFiles];

      status.textContent = `Fetching ${allFiles.length} files…`;

      // Fetch all files in parallel
      const fetched = await Promise.all(
        allFiles.map(async f => {
          const res = await fetch(f.source);
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${f.source}`);
          const binary  = isBinaryPath(f.path);
          const content = binary ? await res.arrayBuffer() : await res.text();
          return { file: f, content, binary };
        })
      );

      status.textContent = 'Building zip…';

      const zip  = new JSZip();
      const vars = buildVars(projectName);

      for (const { file, content, binary } of fetched) {
        const zipPath = `${projectName}/${file.path}`;
        zip.file(zipPath, binary ? content : applySubstitutions(content, vars));
      }

      status.textContent = 'Generating…';

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      saveAs(blob, `${projectName}.zip`);
      status.textContent = `Downloaded ${projectName}.zip`;
    } catch (err) {
      console.error('Kickstart build failed:', err);
      status.textContent = `Error: ${err.message}`;
    } finally {
      btn.disabled = false;
    }
  }

  // ─── Pure helpers ───────────────────────────────────────────────────────────

  function shouldInclude(file) {
    if (file.category === 'ai') return state.includeAi;
    if (file.required || REQUIRED_GROUPS.has(file.group)) return true;
    return state.selectedGroups.has(file.group);
  }

  function buildVars(projectName) {
    return {
      '{{projectName}}':          projectName,
      '{{year}}':                 String(new Date().getFullYear()),
      '{{theme}}':                state.theme,
      '{{includeThemeSelector}}': String(state.includeThemeSelector),
    };
  }

  function applySubstitutions(text, vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.split(k).join(v);
    }
    return text;
  }

  function sanitiseName(name) {
    return (name || DEFAULT_PROJECT)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-') || DEFAULT_PROJECT;
  }

  function isBinaryPath(path) {
    const ext = path.split('.').pop().toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot'].includes(ext);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  // ─── Init ───────────────────────────────────────────────────────────────────

  function init() {
    const container = document.getElementById('kickstart-builder');
    if (!container) return;

    const loadingHtml = purify(`
      <div class="card mt-4 text-center py-5" style="border: 1px solid var(--dm-border);">
        <span data-icon="loader" data-icon-size="32" style="color: var(--dm-muted);"></span>
        <p class="text-muted mt-3 mb-0">Loading Kickstart Builder…</p>
      </div>`);

    container.innerHTML = loadingHtml;

    if (typeof Domma !== 'undefined' && Domma.icons) {
      Domma.icons.scan(container);
    }

    fetch(MANIFEST_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        manifest = data;
        render(manifest);
      })
      .catch(err => {
        const errHtml = purify(`
          <div class="alert alert-warning mt-4">
            <span data-icon="alert-triangle" data-icon-size="16"></span>
            Kickstart Builder unavailable — run <code>npm run build</code> to generate template files.
            <small class="d-block mt-1 text-muted">${escapeHtml(err.message)}</small>
          </div>`);
        container.innerHTML = errHtml;
        if (typeof Domma !== 'undefined' && Domma.icons) {
          Domma.icons.scan(container);
        }
      });
  }

  if (typeof $ !== 'undefined') {
    $(() => init());
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
