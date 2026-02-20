/**
 * DommaCom: domma-notes
 *
 * A rich note-taking Web Component built with Domma.component().
 * Demonstrates: Shadow DOM encapsulation, storage persistence, search/filter,
 * inline editor overlay, formatting helpers, and onUpdated-driven rendering.
 *
 * Usage:
 *   <domma-notes></domma-notes>
 *   <domma-notes storage-key="my-notes"></domma-notes>
 *
 * Requires DOMPurify to be loaded before this script.
 */

// Note card template — rendered via _.render() for each note.
// All user values are escaped with _.escape() before substitution;
// the final HTML string is additionally sanitised with DOMPurify.
const NOTE_CARD_TPL = `
<div class="note-card" data-note-id="{{id}}">
    <div class="note-header">
        <h3>{{title}}</h3>
        <div class="note-actions">
            <button class="icon-btn" data-action="edit"   data-id="{{id}}">
                <span data-icon="edit"  data-icon-size="16"></span>
            </button>
            <button class="icon-btn" data-action="delete" data-id="{{id}}">
                <span data-icon="trash" data-icon-size="16"></span>
            </button>
        </div>
    </div>
    <div class="note-preview">{{preview}}</div>
    <div class="note-footer">
        <div class="note-categories">{{#each categories}}<span class="category-tag">{{name}}</span>{{/each}}</div>
        <span class="note-date">{{dateStr}}</span>
    </div>
</div>`;

/** Sanitise HTML via DOMPurify (loaded on host page). */
function safeHtml(html) {
    return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
}

Domma.component('domma-notes', {
    templateUrl: 'template.html',

    props: {
        storageKey: { type: 'string', default: 'domma-example-notes' }
    },

    data() {
        return {
            notes: [],
            searchQuery: ''
        };
    },

    methods: {
        // ── Rendering ───────────────────────────────────────────────────

        /** Build annotated data object for a single note card. */
        _annotateNote(note) {
            return {
                id:         note.id,
                title:      _.escape(note.title) || 'Untitled',
                preview:    _.escape(_.truncate(note.content, { length: 150, omission: '\u2026' })),
                dateStr:    D(note.updated).format('D MMM YYYY'),
                categories: note.categories.map(c => ({ name: _.escape(c) }))
            };
        },

        /** Re-render only the notes grid; the editor overlay is never touched. */
        _renderGrid() {
            const query    = this.data.searchQuery.toLowerCase();
            const filtered = query
                ? this.data.notes.filter(n =>
                    n.title.toLowerCase().includes(query) ||
                    n.content.toLowerCase().includes(query) ||
                    n.categories.some(c => c.toLowerCase().includes(query))
                  )
                : this.data.notes;

            const grid  = this.root.querySelector('.notes-grid');
            const empty = this.root.querySelector('.empty-state');
            if (!grid) return;

            if (filtered.length === 0) {
                grid.style.display = 'none';
                if (empty) empty.style.display = 'block';
            } else {
                if (empty) empty.style.display = 'none';
                grid.style.display = 'grid';
                // Each card is rendered via _.render() with escaped data, then the
                // whole batch is sanitised with DOMPurify before writing to the DOM.
                const raw = filtered.map(n => _.render(NOTE_CARD_TPL, this._annotateNote(n))).join('');
                grid.innerHTML = safeHtml(raw);
            }
        },

        // ── Editor lifecycle ─────────────────────────────────────────────

        openEditor(id) {
            this._currentEditId = id || null;
            const overlay = this.root.querySelector('.note-editor-overlay');
            if (overlay) overlay.style.display = 'flex';

            const note       = id ? this.data.notes.find(n => n.id === id) : null;
            const titleInput = this.root.querySelector('.note-title-input');
            const contentTA  = this.root.querySelector('.note-content-input');
            const catsInput  = this.root.querySelector('.note-categories-input');

            if (titleInput) titleInput.value = note ? note.title   : '';
            if (contentTA)  contentTA.value  = note ? note.content : '';
            if (catsInput)  catsInput.value  = note ? note.categories.join(', ') : '';
            if (titleInput) titleInput.focus();
        },

        closeEditor() {
            this._currentEditId = null;
            const overlay = this.root.querySelector('.note-editor-overlay');
            if (overlay) overlay.style.display = 'none';
        },

        saveNote() {
            const titleInput = this.root.querySelector('.note-title-input');
            const contentTA  = this.root.querySelector('.note-content-input');
            const catsInput  = this.root.querySelector('.note-categories-input');

            const title      = titleInput ? titleInput.value.trim() : '';
            const content    = contentTA  ? contentTA.value.trim()  : '';
            const categories = catsInput && catsInput.value.trim()
                ? catsInput.value.trim().split(',').map(c => c.trim()).filter(Boolean)
                : [];

            if (!title && !content) {
                E.toast('Please add a title or content', { type: 'warning' });
                return;
            }

            const notes      = [...this.data.notes];
            const now        = Date.now();
            const wasEditing = !!this._currentEditId;

            if (this._currentEditId) {
                const idx = _.findIndex(notes, n => n.id === this._currentEditId);
                if (idx !== -1) {
                    notes[idx] = { ...notes[idx], title, content, categories, updated: now };
                }
            } else {
                notes.unshift({
                    id: 'note-' + now, title, content, categories,
                    created: now, updated: now
                });
            }

            this.closeEditor();
            S.set(this.props.storageKey, notes);
            this.set({ notes });
            E.toast(wasEditing ? 'Note updated' : 'Note created', { type: 'success' });
        },

        async deleteNote(id) {
            try {
                const confirmed = await E.confirm('Delete this note?', {
                    title: 'Delete Note', confirmText: 'Delete', cancelText: 'Cancel'
                });
                if (confirmed) {
                    const notes = this.data.notes.filter(n => n.id !== id);
                    S.set(this.props.storageKey, notes);
                    this.set({ notes });
                    E.toast('Note deleted', { type: 'success' });
                }
            } catch (e) { /* user cancelled */ }
        },

        // ── Editor toolbar formatting ────────────────────────────────────

        _insertFormat(format) {
            const ta = this.root.querySelector('.note-content-input');
            if (!ta) return;
            const start = ta.selectionStart;
            const end   = ta.selectionEnd;
            const text  = ta.value;
            const sel   = text.substring(start, end);
            let before = '', after = '', replacement = '';

            switch (format) {
                case 'bold':      before = '**'; after = '**'; replacement = sel || 'bold text';       break;
                case 'italic':    before = '*';  after = '*';  replacement = sel || 'italic text';     break;
                case 'underline': before = '__'; after = '__'; replacement = sel || 'underlined text'; break;
                case 'h1':        before = '# '; after = '';   replacement = sel || 'Heading 1';        break;
                case 'ul':        before = '- '; after = '';   replacement = sel || 'List item';         break;
                default: return;
            }

            const newText = text.substring(0, start) + before + replacement + after + text.substring(end);
            ta.value = newText;
            ta.focus();
            ta.setSelectionRange(start + before.length, start + before.length + replacement.length);
        }
    },

    onMount() {
        // Non-reactive instance state for editor tracking
        this._currentEditId = null;

        // Load saved notes
        this.set({ notes: S.get(this.props.storageKey, []) });

        // ── Delegated event listeners (shadow root level) ────────────────
        this.root.addEventListener('click', (e) => {
            if (e.target.closest('.new-note-btn'))     { this.openEditor(null); return; }
            if (e.target.closest('.close-editor-btn')) { this.closeEditor();   return; }
            if (e.target.closest('.save-note-btn'))    { this.saveNote();       return; }

            // Backdrop click
            if (e.target.classList.contains('note-editor-overlay')) {
                this.closeEditor();
                return;
            }

            // Formatting toolbar buttons
            const fmtBtn = e.target.closest('.fmt-btn');
            if (fmtBtn) { this._insertFormat(fmtBtn.dataset.format); return; }

            // Note card action buttons
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                e.stopPropagation();
                const { action, id } = actionBtn.dataset;
                if (action === 'edit')   this.openEditor(id);
                if (action === 'delete') this.deleteNote(id);
                return;
            }

            // Click card body to open editor
            const card = e.target.closest('.note-card');
            if (card && card.dataset.noteId) this.openEditor(card.dataset.noteId);
        });

        // Live search
        this.root.addEventListener('input', (e) => {
            if (e.target.classList.contains('search-input')) {
                this.set({ searchQuery: e.target.value.trim() });
            }
        });

        // Keyboard shortcuts
        this.root.addEventListener('keydown', (e) => {
            const overlay = this.root.querySelector('.note-editor-overlay');
            const open    = overlay && overlay.style.display !== 'none';
            if (e.key === 'Escape' && open)               this.closeEditor();
            if (e.ctrlKey && e.key === 'Enter' && open)   this.saveNote();
        });

        this._renderGrid();
        I.scan(this.root);
    },

    onUpdated() {
        this._renderGrid();
        I.scan(this.root);
    },

    style: `
        :host { display: block; }

        .notes-wrapper { max-width: 100%; }

        /* ── Toolbar ──────────────────────────────────────────────── */
        .notes-toolbar {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            align-items: center;
        }
        .search-input {
            flex: 1;
            min-width: 200px;
            padding: 0.625rem 1rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 0.9375rem;
            transition: border-color 0.2s;
        }
        .search-input:focus { outline: none; border-color: var(--dm-primary); box-shadow: 0 0 0 3px var(--dm-focus-ring); }
        .search-input::placeholder { color: var(--dm-gray-400); }

        /* ── Notes grid ───────────────────────────────────────────── */
        .notes-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        @media (max-width: 900px) { .notes-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .notes-grid { grid-template-columns: 1fr; } }

        /* ── Note card ────────────────────────────────────────────── */
        .note-card {
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: var(--dm-shadow-sm);
            transition: box-shadow 0.2s;
            cursor: pointer;
        }
        .note-card:hover { box-shadow: var(--dm-shadow-md); }

        .note-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        .note-header h3 { margin: 0; font-size: 1.125rem; color: var(--dm-text); flex: 1; min-width: 0; word-break: break-word; }
        .note-actions   { display: flex; gap: 0.5rem; flex-shrink: 0; margin-left: 0.5rem; }

        .icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            color: var(--dm-text-muted);
            transition: color 0.2s;
            border-radius: 4px;
        }
        .icon-btn:hover { color: var(--dm-primary); background: var(--dm-hover-bg); }

        .note-preview { color: var(--dm-text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem; }

        .note-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            color: var(--dm-text-muted);
        }
        .note-categories { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .category-tag {
            background: var(--dm-primary-light, #dbeafe);
            color: var(--dm-primary);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        /* ── Empty state ──────────────────────────────────────────── */
        .empty-state { text-align: center; padding: 4rem 2rem; color: var(--dm-text-muted); }
        .empty-state h3 { font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--dm-text); }
        .empty-state p  { margin: 0; }

        /* ── Editor overlay ───────────────────────────────────────── */
        .note-editor-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .note-editor-content {
            background: var(--dm-card-bg);
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--dm-shadow-xl);
            display: flex;
            flex-direction: column;
        }

        .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--dm-border);
            gap: 1rem;
        }
        .note-title-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 1.125rem;
            font-weight: 600;
            transition: border-color 0.2s;
        }
        .note-title-input:focus { outline: none; border-color: var(--dm-primary); box-shadow: 0 0 0 3px var(--dm-focus-ring); }

        .editor-toolbar {
            display: flex;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--dm-border);
            background: var(--dm-surface);
        }
        .fmt-btn {
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-family: inherit;
            transition: background 0.2s;
            color: var(--dm-text);
        }
        .fmt-btn:hover { background: var(--dm-hover-bg); }

        .note-content-input {
            width: 100%;
            min-height: 300px;
            padding: 1.5rem;
            border: none;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 1rem;
            line-height: 1.6;
            resize: vertical;
            box-sizing: border-box;
        }
        .note-content-input:focus { outline: none; }

        .editor-footer {
            display: flex;
            gap: 1rem;
            padding: 1.5rem;
            border-top: 1px solid var(--dm-border);
        }
        .note-categories-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid var(--dm-border);
            border-radius: 8px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-family: inherit;
            font-size: 0.9375rem;
        }
        .note-categories-input:focus { outline: none; border-color: var(--dm-primary); box-shadow: 0 0 0 3px var(--dm-focus-ring); }
        .note-categories-input::placeholder { color: var(--dm-gray-400); }

        /* ── Buttons ──────────────────────────────────────────────── */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.625rem 1.25rem;
            border: 1px solid transparent;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            line-height: 1;
            white-space: nowrap;
        }
        .btn-sm        { padding: 0.375rem 0.75rem; font-size: 0.875rem; border-radius: 6px; }
        .btn-primary   { background: var(--dm-primary); color: var(--dm-white); border-color: var(--dm-primary); }
        .btn-primary:hover   { filter: brightness(0.88); }
        .btn-secondary { background: var(--dm-surface);  color: var(--dm-text);  border-color: var(--dm-border); }
        .btn-secondary:hover { background: var(--dm-hover-bg); }
    `
});
