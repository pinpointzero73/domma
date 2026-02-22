/**
 * DommaCom: domma-contacts
 *
 * A full-featured Contact Management Web Component built with Domma.component().
 * Demonstrates: Shadow DOM encapsulation, storage persistence, search/filter,
 * group management, favourites, DOB/age calculation, and an inline editor overlay.
 *
 * Domma APIs exercised:
 *   S.get / S.set       — storage persistence
 *   E.toast             — notifications
 *   E.confirm           — delete confirmations
 *   E.prompt            — group name input
 *   I.scan              — icon injection into shadow root
 *   _.render            — Mustache card template rendering
 *   _.escape            — XSS-safe text output
 *   _.debounce          — search input debouncing
 *   _.filter / _.find / _.findIndex  — data querying
 *   D()                 — DOB formatting, relative timestamps
 *   D().fromNow()       — "2 days ago" relative dates
 *   D().diff()          — age calculation from DOB
 *   M.types.*           — prop type validation
 *
 * Usage:
 *   <domma-contacts></domma-contacts>
 *   <domma-contacts storage-key="my-contacts"></domma-contacts>
 *
 * All user content is escaped with _.escape() and sanitised with DOMPurify
 * before being written to the DOM — XSS is prevented at both levels.
 */

// ── Avatar colour palette ────────────────────────────────────────────────────
const AVATAR_COLOURS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#06b6d4'
];

// ── Contact card Mustache template ───────────────────────────────────────────
// Values are escaped before substitution; the batch is sanitised with DOMPurify.
const CONTACT_CARD_TPL = `
<div class="contact-card{{favouriteCls}}" data-contact-id="{{id}}">
    <div class="card-top">
        <div class="avatar" style="background:{{avatarColour}}">{{initials}}</div>
        <div class="card-info">
            <div class="contact-name">{{name}}</div>
            <div class="contact-meta">{{titleCompany}}</div>
        </div>
        <button class="icon-btn fav-btn" data-action="favourite" data-id="{{id}}" title="{{favTitle}}">
            <span data-icon="{{favIcon}}" data-icon-size="18"></span>
        </button>
    </div>
    <div class="card-details">
        {{#if email}}<div class="detail-row"><span data-icon="mail" data-icon-size="13"></span><span class="detail-text">{{email}}</span></div>{{/if}}
        {{#if mobile}}<div class="detail-row"><span data-icon="phone" data-icon-size="13"></span><span class="detail-text">{{mobile}}</span></div>{{/if}}
        {{#if dobStr}}<div class="detail-row"><span data-icon="cake" data-icon-size="13"></span><span class="detail-text">{{dobStr}}{{ageSuffix}}</span></div>{{/if}}
    </div>
    <div class="card-groups">
        {{#each groups}}<span class="group-badge">{{name}}</span>{{/each}}
    </div>
    <div class="card-footer">
        <span class="created-date">{{createdStr}}</span>
        <div class="card-actions">
            <button class="icon-btn" data-action="edit"   data-id="{{id}}" title="Edit contact">
                <span data-icon="edit"  data-icon-size="15"></span>
            </button>
            <button class="icon-btn danger" data-action="delete" data-id="{{id}}" title="Delete contact">
                <span data-icon="trash" data-icon-size="15"></span>
            </button>
        </div>
    </div>
</div>`;

// ── Group pill template (for groups-panel) ───────────────────────────────────
const GROUP_PILL_TPL = `
<span class="mgmt-pill">
    <span class="mgmt-name" data-group-action="rename" data-group-name="{{name}}" title="Rename">{{name}}</span>
    <button class="mgmt-del" data-group-action="delete" data-group-name="{{name}}" title="Delete group" aria-label="Delete {{name}}">x</button>
</span>`;

/**
 * Sanitise HTML via DOMPurify (loaded on host page).
 * All content rendered into the DOM goes through this function —
 * it is the final line of defence after _.escape() per-value escaping.
 */
function safeHtml(html) {
    return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
}

// ── Component registration ───────────────────────────────────────────────────
Domma.component('domma-contacts', {

    templateUrl: 'template.html',

    props: {
        storageKey: { type: M.types.string, default: 'domma-contacts-app' }
    },

    data() {
        return {
            contacts:           [],
            groups:             [],
            searchQuery:        '',
            groupFilter:        '',
            showFavouritesOnly: false,
            editorOpen:         false,
            editingId:          null
        };
    },

    methods: {

        // ── Storage ──────────────────────────────────────────────────────

        _loadFromStorage() {
            const stored = S.get(this.props.storageKey, { contacts: [], groups: [] });
            return {
                contacts: stored.contacts || [],
                groups:   stored.groups   || []
            };
        },

        _saveToStorage() {
            S.set(this.props.storageKey, {
                contacts: this.data.contacts,
                groups:   this.data.groups
            });
        },

        // ── Avatar helpers ───────────────────────────────────────────────

        _getInitials(name) {
            if (!name) return '?';
            const parts = name.trim().split(/\s+/);
            if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        },

        _getAvatarColour(id) {
            let hash = 0;
            for (let i = 0; i < id.length; i++) {
                hash = (hash << 5) - hash + id.charCodeAt(i);
                hash |= 0;
            }
            return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
        },

        // ── Data annotation ──────────────────────────────────────────────

        _annotateContact(c) {
            const isFav   = !!c.favourite;
            const dobStr  = c.dob ? D(c.dob).format('D MMM YYYY') : '';
            const age     = c.dob ? D().diff(D(c.dob), 'years') : null;
            const parts   = [c.title, c.company].filter(Boolean);
            return {
                id:           c.id,
                name:         _.escape(c.name),
                email:        _.escape(c.email || ''),
                mobile:       _.escape(c.mobile || ''),
                titleCompany: _.escape(parts.join(' · ')),
                dobStr,
                ageSuffix:    age !== null ? ` · age ${age}` : '',
                initials:     this._getInitials(c.name),
                avatarColour: this._getAvatarColour(c.id),
                favouriteCls: isFav ? ' is-favourite' : '',
                favIcon:      isFav ? 'heart-filled' : 'heart',
                favTitle:     isFav ? 'Remove from favourites' : 'Add to favourites',
                createdStr:   D(c.createdAt).fromNow(),
                groups:       (c.groups || []).map(g => ({ name: _.escape(g) }))
            };
        },

        // ── Rendering ────────────────────────────────────────────────────

        _filteredContacts() {
            let list = [...this.data.contacts];
            const q  = this.data.searchQuery.toLowerCase();

            if (q) {
                list = _.filter(list, c =>
                    c.name.toLowerCase().includes(q) ||
                    (c.email   && c.email.toLowerCase().includes(q))   ||
                    (c.company && c.company.toLowerCase().includes(q)) ||
                    (c.title   && c.title.toLowerCase().includes(q))
                );
            }

            if (this.data.groupFilter) {
                list = _.filter(list, c => (c.groups || []).includes(this.data.groupFilter));
            }

            if (this.data.showFavouritesOnly) {
                list = _.filter(list, c => !!c.favourite);
            }

            return list;
        },

        _renderStats() {
            const stats = this.root.querySelector('.contacts-stats');
            if (!stats) return;
            const total  = this.data.contacts.length;
            const groups = this.data.groups.length;
            const favs   = _.filter(this.data.contacts, c => !!c.favourite).length;
            // safeHtml applied — numeric counts are trusted, labels are static strings
            stats.innerHTML = safeHtml(
                `<span>${total} contact${total !== 1 ? 's' : ''}</span>` +
                `<span class="stat-sep">·</span>` +
                `<span>${groups} group${groups !== 1 ? 's' : ''}</span>` +
                `<span class="stat-sep">·</span>` +
                `<span>${favs} favourite${favs !== 1 ? 's' : ''}</span>`
            );
        },

        _renderGroupFilter() {
            const sel = this.root.querySelector('.group-filter');
            if (!sel) return;
            const current = this.data.groupFilter;
            // Groups are _.escape()'d — safeHtml as final pass
            sel.innerHTML = safeHtml(
                '<option value="">All groups</option>' +
                this.data.groups.map(g =>
                    `<option value="${_.escape(g)}"${g === current ? ' selected' : ''}>${_.escape(g)}</option>`
                ).join('')
            );
        },

        _renderGroupsPanel() {
            const panel = this.root.querySelector('.groups-panel');
            if (!panel) return;
            if (this.data.groups.length === 0) {
                panel.innerHTML = '';
                return;
            }
            const pills = this.data.groups
                .map(g => _.render(GROUP_PILL_TPL, { name: _.escape(g) }))
                .join('');
            // User group names are _.escape()'d before _.render(), then safeHtml as final pass
            panel.innerHTML = safeHtml(
                `<div class="mgmt-row"><span class="mgmt-label">Groups:</span>${pills}</div>`
            );
        },

        _renderFavBtn() {
            const btn = this.root.querySelector('.fav-toggle-btn');
            if (!btn) return;
            btn.classList.toggle('active', this.data.showFavouritesOnly);
            btn.setAttribute('aria-pressed', String(this.data.showFavouritesOnly));
        },

        /** Re-render the card grid; never touches the editor overlay. */
        _renderGrid() {
            const grid  = this.root.querySelector('.contacts-grid');
            const empty = this.root.querySelector('.empty-state');
            if (!grid) return;

            const filtered = this._filteredContacts();

            if (filtered.length === 0) {
                grid.style.display = 'none';
                if (empty) empty.style.display = 'block';
            } else {
                if (empty) empty.style.display = 'none';
                grid.style.display = 'grid';
                // Each card rendered via _.render() with _.escape()'d data, then sanitised
                const raw = filtered
                    .map(c => _.render(CONTACT_CARD_TPL, this._annotateContact(c)))
                    .join('');
                grid.innerHTML = safeHtml(raw);
            }

            this._renderStats();
            this._renderGroupFilter();
            this._renderGroupsPanel();
            this._renderFavBtn();
        },

        // ── Editor lifecycle ─────────────────────────────────────────────

        _getFormValues() {
            const q = s => this.root.querySelector(s);
            return {
                name:     q('.f-name')?.value.trim()     || '',
                email:    q('.f-email')?.value.trim()    || '',
                title:    q('.f-title')?.value.trim()    || '',
                company:  q('.f-company')?.value.trim()  || '',
                mobile:   q('.f-mobile')?.value.trim()   || '',
                phone:    q('.f-phone')?.value.trim()    || '',
                dob:      q('.f-dob')?.value             || '',
                website:  q('.f-website')?.value.trim()  || '',
                linkedin: q('.f-linkedin')?.value.trim() || '',
                twitter:  q('.f-twitter')?.value.trim()  || '',
                notes:    q('.f-notes')?.value.trim()    || '',
                groups:   (q('.f-groups')?.value || '')
                    .split(',').map(g => g.trim()).filter(Boolean)
            };
        },

        _populateForm(c) {
            const set = (sel, val) => {
                const el = this.root.querySelector(sel);
                if (el) el.value = val || '';
            };
            set('.f-name',     c.name);
            set('.f-email',    c.email);
            set('.f-title',    c.title);
            set('.f-company',  c.company);
            set('.f-mobile',   c.mobile);
            set('.f-phone',    c.phone);
            set('.f-dob',      c.dob);
            set('.f-website',  c.website);
            set('.f-linkedin', c.linkedin);
            set('.f-twitter',  c.twitter);
            set('.f-notes',    c.notes);
            set('.f-groups',   (c.groups || []).join(', '));
        },

        _clearForm() {
            ['.f-name', '.f-email', '.f-title', '.f-company', '.f-mobile',
             '.f-phone', '.f-dob', '.f-website', '.f-linkedin', '.f-twitter',
             '.f-notes', '.f-groups'].forEach(sel => {
                const el = this.root.querySelector(sel);
                if (el) el.value = '';
            });
        },

        openEditor(id) {
            const overlay = this.root.querySelector('.editor-overlay');
            const heading = this.root.querySelector('.editor-heading');
            if (overlay) overlay.style.display = 'flex';
            this.set({ editorOpen: true, editingId: id || null });

            if (id) {
                const c = _.find(this.data.contacts, c => c.id === id);
                if (c) this._populateForm(c);
                if (heading) heading.textContent = 'Edit Contact';
            } else {
                this._clearForm();
                if (heading) heading.textContent = 'Add Contact';
                const nameInput = this.root.querySelector('.f-name');
                if (nameInput) setTimeout(() => nameInput.focus(), 50);
            }
            I.scan(this.root);
        },

        closeEditor() {
            const overlay = this.root.querySelector('.editor-overlay');
            if (overlay) overlay.style.display = 'none';
            this.set({ editorOpen: false, editingId: null });
        },

        saveContact() {
            const values = this._getFormValues();

            if (!values.name) {
                E.toast('Name is required', { type: 'warning' });
                this.root.querySelector('.f-name')?.focus();
                return;
            }
            if (!values.email) {
                E.toast('Email is required', { type: 'warning' });
                this.root.querySelector('.f-email')?.focus();
                return;
            }

            const contacts   = [...this.data.contacts];
            const now        = new Date().toISOString();
            const wasEditing = !!this.data.editingId;

            if (wasEditing) {
                const idx = _.findIndex(contacts, c => c.id === this.data.editingId);
                if (idx !== -1) {
                    contacts[idx] = { ...contacts[idx], ...values };
                }
            } else {
                contacts.unshift({
                    id:        `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    ...values,
                    favourite: false,
                    createdAt: now
                });
            }

            this.closeEditor();
            this.set({ contacts });
            this._saveToStorage();
            E.toast(wasEditing ? 'Contact updated' : 'Contact added', { type: 'success' });
        },

        async deleteContact(id) {
            const c    = _.find(this.data.contacts, c => c.id === id);
            const name = c ? c.name : 'this contact';
            try {
                const confirmed = await E.confirm(`Delete "${name}"?`, {
                    title:       'Delete Contact',
                    confirmText: 'Delete',
                    cancelText:  'Cancel'
                });
                if (confirmed) {
                    const contacts = _.filter(this.data.contacts, c => c.id !== id);
                    this.set({ contacts });
                    this._saveToStorage();
                    E.toast('Contact deleted', { type: 'success' });
                }
            } catch (e) { /* user cancelled */ }
        },

        toggleFavourite(id) {
            const contacts = this.data.contacts.map(c =>
                c.id === id ? { ...c, favourite: !c.favourite } : c
            );
            this.set({ contacts });
            this._saveToStorage();
        },

        // ── Group management ─────────────────────────────────────────────

        async addGroup() {
            try {
                const name = await E.prompt('Enter a name for the new group:', {
                    title:       'Add Group',
                    placeholder: 'e.g. Work, Family, Friends…'
                });
                if (!name || !name.trim()) return;
                const trimmed = name.trim();
                if (this.data.groups.includes(trimmed)) {
                    E.toast(`"${trimmed}" already exists`, { type: 'warning' });
                    return;
                }
                const groups = [...this.data.groups, trimmed];
                this.set({ groups });
                this._saveToStorage();
                E.toast(`Group "${trimmed}" added`, { type: 'success' });
            } catch (e) { /* cancelled */ }
        },

        async renameGroup(oldName) {
            try {
                const newName = await E.prompt('Rename group:', {
                    title:       'Rename Group',
                    placeholder: oldName,
                    value:       oldName
                });
                if (!newName || !newName.trim() || newName.trim() === oldName) return;
                const trimmed  = newName.trim();
                const groups   = this.data.groups.map(g => g === oldName ? trimmed : g);
                const contacts = this.data.contacts.map(c => ({
                    ...c,
                    groups: (c.groups || []).map(g => g === oldName ? trimmed : g)
                }));
                this.set({ groups, contacts });
                this._saveToStorage();
                E.toast(`Group renamed to "${trimmed}"`, { type: 'success' });
            } catch (e) { /* cancelled */ }
        },

        async deleteGroup(name) {
            try {
                const confirmed = await E.confirm(
                    `Delete group "${name}"? Contacts in this group will not be deleted.`,
                    { title: 'Delete Group', confirmText: 'Delete', cancelText: 'Cancel' }
                );
                if (!confirmed) return;
                const groups   = _.filter(this.data.groups, g => g !== name);
                const contacts = this.data.contacts.map(c => ({
                    ...c,
                    groups: (c.groups || []).filter(g => g !== name)
                }));
                const newState = { groups, contacts };
                if (this.data.groupFilter === name) newState.groupFilter = '';
                this.set(newState);
                this._saveToStorage();
                E.toast(`Group "${name}" deleted`, { type: 'success' });
            } catch (e) { /* cancelled */ }
        }
    },

    onMount() {
        // ── Load persisted data ──────────────────────────────────────────
        const stored = this._loadFromStorage();
        this.set({ contacts: stored.contacts, groups: stored.groups });

        // ── Debounced search (250 ms) ────────────────────────────────────
        this._debouncedSearch = _.debounce(q => {
            this.set({ searchQuery: q });
        }, 250);

        // ── Delegated click events ───────────────────────────────────────
        this.root.addEventListener('click', async e => {

            if (e.target.closest('.add-contact-btn'))  { this.openEditor(null); return; }
            if (e.target.closest('.save-contact-btn')) { this.saveContact();    return; }
            if (e.target.closest('.add-group-btn'))    { await this.addGroup(); return; }

            if (e.target.closest('.close-editor-btn')) {
                this.closeEditor();
                return;
            }

            if (e.target.closest('.fav-toggle-btn')) {
                this.set({ showFavouritesOnly: !this.data.showFavouritesOnly });
                return;
            }

            // Backdrop click closes editor
            if (e.target.classList.contains('editor-overlay')) {
                this.closeEditor();
                return;
            }

            // Card action buttons (edit / delete / favourite)
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                e.stopPropagation();
                const { action, id } = actionBtn.dataset;
                if (action === 'edit')      this.openEditor(id);
                if (action === 'delete')    await this.deleteContact(id);
                if (action === 'favourite') this.toggleFavourite(id);
                return;
            }

            // Groups panel — rename (click pill name) / delete (click ×)
            const groupBtn = e.target.closest('[data-group-action]');
            if (groupBtn) {
                const { groupAction, groupName } = groupBtn.dataset;
                if (groupAction === 'rename') await this.renameGroup(groupName);
                if (groupAction === 'delete') await this.deleteGroup(groupName);
            }
        });

        // ── Search input ─────────────────────────────────────────────────
        this.root.addEventListener('input', e => {
            if (e.target.classList.contains('search-input')) {
                this._debouncedSearch(e.target.value.trim());
            }
        });

        // ── Group filter dropdown ────────────────────────────────────────
        this.root.addEventListener('change', e => {
            if (e.target.classList.contains('group-filter')) {
                this.set({ groupFilter: e.target.value });
            }
        });

        // ── Keyboard shortcuts ───────────────────────────────────────────
        this.root.addEventListener('keydown', e => {
            const overlay = this.root.querySelector('.editor-overlay');
            const open    = overlay && overlay.style.display !== 'none';
            if (e.key === 'Escape' && open)             this.closeEditor();
            if (e.ctrlKey && e.key === 'Enter' && open) this.saveContact();
        });

        this._renderGrid();
        I.scan(this.root);
    },

    onUpdated() {
        this._renderGrid();
        I.scan(this.root);
    },

    // ── Scoped CSS ───────────────────────────────────────────────────────────
    style: `
        :host { display: block; }

        /* ── Toolbar ────────────────────────────────────────────────── */
        .contacts-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            align-items: center;
            margin-bottom: 1rem;
        }

        .search-input {
            flex: 1;
            min-width: 200px;
            padding: 0.5rem 0.875rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 0.9375rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
            outline: none;
            border-color: var(--dm-primary);
            box-shadow: 0 0 0 3px var(--dm-focus-ring);
        }
        .search-input::placeholder { color: var(--dm-gray-400); }

        .group-filter {
            padding: 0.5rem 0.75rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 0.875rem;
            cursor: pointer;
        }
        .group-filter:focus { outline: none; border-color: var(--dm-primary); }

        .toolbar-spacer { flex: 1; }

        .btn-tool {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.5rem 0.875rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-surface);
            color: var(--dm-text-muted);
            font-family: inherit;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .btn-tool:hover { border-color: var(--dm-primary); color: var(--dm-primary); }
        .btn-tool.active { background: var(--dm-primary); color: #fff; border-color: var(--dm-primary); }

        .btn-primary-action {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.5rem 1rem;
            background: var(--dm-primary);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            font-size: 0.9375rem;
            font-weight: 500;
            cursor: pointer;
            white-space: nowrap;
            transition: opacity 0.2s;
        }
        .btn-primary-action:hover { opacity: 0.9; }

        /* ── Stats bar ──────────────────────────────────────────────── */
        .contacts-stats {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            font-size: 0.875rem;
            color: var(--dm-text-muted);
            margin-bottom: 0.75rem;
        }
        .stat-sep { opacity: 0.4; }

        /* ── Groups management panel ────────────────────────────────── */
        .groups-panel { margin-bottom: 1rem; }

        .mgmt-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
        }
        .mgmt-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--dm-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .mgmt-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            background: var(--dm-hover-bg);
            border: 1px solid var(--dm-border);
            border-radius: 20px;
            padding: 0.2rem 0.5rem 0.2rem 0.625rem;
            font-size: 0.8rem;
        }
        .mgmt-name {
            cursor: pointer;
            color: var(--dm-text);
            transition: color 0.15s;
        }
        .mgmt-name:hover { color: var(--dm-primary); }
        .mgmt-del {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--dm-text-muted);
            font-size: 1rem;
            line-height: 1;
            padding: 0 0.1rem;
            transition: color 0.15s;
        }
        .mgmt-del:hover { color: var(--dm-danger, #ef4444); }

        /* ── Card grid ──────────────────────────────────────────────── */
        .contacts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
        }
        @media (max-width: 600px) { .contacts-grid { grid-template-columns: 1fr; } }

        /* ── Contact card ───────────────────────────────────────────── */
        .contact-card {
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-radius: 10px;
            padding: 1.125rem;
            box-shadow: var(--dm-shadow-sm);
            transition: box-shadow 0.2s, border-color 0.2s;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .contact-card:hover { box-shadow: var(--dm-shadow-md); }
        .contact-card.is-favourite { border-color: #eab30844; }

        /* Card top row */
        .card-top {
            display: flex;
            align-items: flex-start;
            gap: 0.875rem;
        }

        /* Avatar circle */
        .avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: 700;
            color: #fff;
            flex-shrink: 0;
            letter-spacing: 0.02em;
        }

        .card-info { flex: 1; min-width: 0; }
        .contact-name {
            font-weight: 600;
            font-size: 1rem;
            color: var(--dm-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .contact-meta {
            font-size: 0.8125rem;
            color: var(--dm-text-muted);
            margin-top: 0.125rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Favourite button */
        .fav-btn {
            flex-shrink: 0;
            color: var(--dm-text-muted);
            transition: color 0.2s, transform 0.15s;
        }
        .is-favourite .fav-btn { color: #eab308; }
        .fav-btn:hover { transform: scale(1.2); }

        /* Detail rows */
        .card-details { display: flex; flex-direction: column; gap: 0.35rem; }
        .detail-row {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.8rem;
            color: var(--dm-text-muted);
        }
        .detail-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Group badges */
        .card-groups { display: flex; flex-wrap: wrap; gap: 0.375rem; min-height: 0; }
        .group-badge {
            background: var(--dm-primary-light, #dbeafe);
            color: var(--dm-primary);
            padding: 0.2rem 0.625rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        /* Card footer */
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 0.5rem;
            border-top: 1px solid var(--dm-border);
            font-size: 0.75rem;
            color: var(--dm-text-muted);
        }
        .card-actions { display: flex; gap: 0.25rem; }

        /* Icon button */
        .icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.3rem;
            color: var(--dm-text-muted);
            border-radius: 6px;
            transition: color 0.2s, background 0.2s;
            display: flex;
            align-items: center;
        }
        .icon-btn:hover { color: var(--dm-primary); background: var(--dm-hover-bg); }
        .icon-btn.danger:hover { color: var(--dm-danger, #ef4444); }

        /* ── Empty state ────────────────────────────────────────────── */
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--dm-text-muted);
        }
        .empty-state h3 { margin: 1rem 0 0.5rem; font-size: 1.25rem; color: var(--dm-text); }
        .empty-state p  { font-size: 0.9rem; }

        /* ── Editor overlay ─────────────────────────────────────────── */
        .editor-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 1rem;
        }

        .editor-panel {
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-radius: 12px;
            width: 100%;
            max-width: 700px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--dm-border);
            flex-shrink: 0;
        }
        .editor-heading {
            margin: 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--dm-text);
        }

        .editor-body {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
        }

        /* Two-column form grid */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        @media (max-width: 540px) { .form-grid { grid-template-columns: 1fr; } }

        .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
        .form-field-full { grid-column: 1 / -1; }

        .field-label {
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--dm-text-muted);
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        .required { color: var(--dm-danger, #ef4444); }
        .field-hint { font-weight: 400; opacity: 0.7; }

        .field-input {
            padding: 0.5rem 0.75rem;
            border: 1px solid var(--dm-border);
            border-radius: 6px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 0.9rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
            outline: none;
            border-color: var(--dm-primary);
            box-shadow: 0 0 0 3px var(--dm-focus-ring);
        }
        .field-input::placeholder { color: var(--dm-gray-400); }
        .field-textarea { resize: vertical; min-height: 80px; }

        .editor-footer {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            padding: 1.125rem 1.5rem;
            border-top: 1px solid var(--dm-border);
            flex-shrink: 0;
        }

        .btn-cancel {
            padding: 0.5rem 1.25rem;
            background: var(--dm-surface);
            border: 1px solid var(--dm-border);
            border-radius: 7px;
            color: var(--dm-text);
            font-family: inherit;
            font-size: 0.9375rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-cancel:hover { background: var(--dm-hover-bg); }

        .btn-save {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.5rem 1.25rem;
            background: var(--dm-primary);
            color: #fff;
            border: none;
            border-radius: 7px;
            font-family: inherit;
            font-size: 0.9375rem;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .btn-save:hover { opacity: 0.9; }
    `

});
