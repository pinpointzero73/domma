/**
 * DommaCom: domma-markdown-editor
 *
 * A split-pane Markdown editor Web Component built with Domma.component().
 * Demonstrates: lifecycle hooks, Shadow DOM with zero structural bindings,
 * storage persistence, debounced auto-save, keyboard shortcuts, and
 * onUpdated-driven DOM updates.
 *
 * Usage:
 *   <domma-markdown-editor></domma-markdown-editor>
 *   <domma-markdown-editor storage-key="my-doc" auto-save-delay="500"></domma-markdown-editor>
 *
 * Requires DOMPurify to be loaded before this script (for preview sanitisation).
 */

Domma.component('domma-markdown-editor', {
    templateUrl: 'template.html',

    props: {
        storageKey:    { type: 'string',  default: 'markdown-content' },
        autoSave:      { type: 'boolean', default: true  },
        autoSaveDelay: { type: 'number',  default: 300   }
    },

    data() {
        return { content: '' };
    },

    methods: {
        // ── Security helper ─────────────────────────────────────────────

        /** All preview content goes through DOMPurify before touching the DOM. */
        _safe(html) {
            return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
        },

        // ── Markdown parser ─────────────────────────────────────────────

        _parseMarkdown(markdown) {
            if (!markdown) return '';
            let html = markdown;

            // Headers (processed before other formatting)
            html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
            html = html.replace(/^## (.*$)/gim,  '<h2>$1</h2>');
            html = html.replace(/^# (.*$)/gim,   '<h1>$1</h1>');

            // Horizontal rule
            html = html.replace(/^---$/gim, '<hr>');

            // Code blocks (before inline code)
            html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

            // Inline code
            html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

            // Bold + italic combined, then bold, then italic
            html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
            html = html.replace(/\*\*([^*]+)\*\*/g,     '<strong>$1</strong>');
            html = html.replace(/\*([^*]+)\*/g,          '<em>$1</em>');

            // Blockquotes
            html = html.replace(/^> (.+)/gim, '<blockquote>$1</blockquote>');

            // Links and images
            html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2">$1</a>');

            // Unordered / ordered lists (line-by-line state machine)
            const lines = html.split('\n');
            let inList = false;
            const result = [];
            for (const line of lines) {
                if (line.match(/^- (.+)/)) {
                    if (!inList)         { result.push('<ul>'); inList = 'ul'; }
                    result.push('<li>' + line.replace(/^- /, '') + '</li>');
                } else if (line.match(/^\d+\. (.+)/)) {
                    if (inList !== 'ol') { if (inList) result.push('</' + inList + '>'); result.push('<ol>'); inList = 'ol'; }
                    result.push('<li>' + line.replace(/^\d+\. /, '') + '</li>');
                } else {
                    if (inList) { result.push('</' + inList + '>'); inList = false; }
                    result.push(line);
                }
            }
            if (inList) result.push('</' + inList + '>');
            html = result.join('\n');

            // Paragraphs
            html = html.replace(/\n\n+/g, '</p><p>');
            html = '<p>' + html + '</p>';

            // Remove paragraph wrappers around block-level elements
            html = html.replace(/<p><\/p>/g, '');
            ['h1', 'h2', 'h3', 'ul', 'ol', 'blockquote', 'pre'].forEach(tag => {
                html = html.replace(new RegExp('<p>(<' + tag + '[^>]*>)', 'g'),  '$1');
                html = html.replace(new RegExp('(</' + tag + '>)<\\/p>', 'g'),   '$1');
            });
            html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

            // Single newlines → <br>
            html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');
            return html;
        },

        // ── Preview & stats ─────────────────────────────────────────────

        _updatePreview() {
            const preview = this.root.querySelector('.preview-pane-content');
            if (!preview) return;
            const content = this.data.content;
            if (!content) {
                // Static placeholder — still run through _safe() for consistency
                preview.innerHTML = this._safe('<p class="preview-placeholder">Start typing to see the preview\u2026</p>');
                return;
            }
            // User-generated HTML must always be sanitised
            preview.innerHTML = this._safe(this._parseMarkdown(content));
        },

        _updateStats() {
            const content = this.data.content;
            const words   = content.trim().length > 0
                ? content.trim().split(/\s+/).filter(w => w.length > 0).length
                : 0;
            const wc = this.root.querySelector('.stat-word-count');
            const cc = this.root.querySelector('.stat-char-count');
            if (wc) wc.textContent = words;
            if (cc) cc.textContent = content.length;
        },

        _saveContent() {
            S.set(this.props.storageKey, this.data.content);
            const now = Date.now();
            S.set(this.props.storageKey + '-last-saved', now);
            const el = this.root.querySelector('.stat-last-saved');
            if (el) el.textContent = D(now).fromNow();
        },

        // ── Toolbar formatting ───────────────────────────────────────────

        _insertFormatting(action) {
            const ta = this.root.querySelector('.markdown-input');
            if (!ta) return;
            const start  = ta.selectionStart;
            const end    = ta.selectionEnd;
            const sel    = ta.value.substring(start, end);
            const before = ta.value.substring(0, start);
            const after  = ta.value.substring(end);
            let newText  = ta.value;
            let cursor   = start;

            switch (action) {
                case 'bold':
                    newText = before + '**' + (sel || 'bold text') + '**' + after;
                    cursor  = start + 2;
                    break;
                case 'italic':
                    newText = before + '*' + (sel || 'italic text') + '*' + after;
                    cursor  = start + 1;
                    break;
                case 'heading':
                    newText = before + '## ' + (sel || 'Heading') + after;
                    cursor  = start + 3;
                    break;
                case 'quote':
                    newText = before + '> ' + (sel || 'Quote') + after;
                    cursor  = start + 2;
                    break;
                case 'list':
                    newText = before + '- ' + (sel || 'List item') + after;
                    cursor  = start + 2;
                    break;
                case 'link': {
                    const lt = sel || 'link text';
                    newText = before + '[' + lt + '](url)' + after;
                    cursor  = start + lt.length + 3;
                    break;
                }
                case 'image':
                    newText = before + '![alt text](image-url)' + after;
                    cursor  = start + 2;
                    break;
                case 'code':
                    if (sel.includes('\n')) {
                        newText = before + '```\n' + sel + '\n```' + after;
                        cursor  = start + 4;
                    } else {
                        newText = before + '`' + (sel || 'code') + '`' + after;
                        cursor  = start + 1;
                    }
                    break;
                default:
                    return;
            }

            ta.value = newText;
            ta.setSelectionRange(cursor, cursor);
            ta.focus();
            this.set({ content: newText });
        }
    },

    onMount() {
        // Restore saved content
        const saved     = S.get(this.props.storageKey, '');
        const lastSaved = S.get(this.props.storageKey + '-last-saved', null);
        if (saved) {
            const ta = this.root.querySelector('.markdown-input');
            if (ta) ta.value = saved;
            this.set({ content: saved });
        }
        if (lastSaved) {
            const el = this.root.querySelector('.stat-last-saved');
            if (el) el.textContent = D(lastSaved).fromNow();
        }

        // Debounced auto-save using Domma's _.debounce()
        this._debouncedSave = _.debounce(() => this._saveContent(), this.props.autoSaveDelay);

        // Track content on every keystroke (triggers onUpdated → preview + stats)
        this.root.addEventListener('input', (e) => {
            if (e.target.classList.contains('markdown-input')) {
                this.set({ content: e.target.value });
                if (this.props.autoSave) this._debouncedSave();
            }
        });

        // Keyboard shortcuts inside the textarea (Ctrl+B, Ctrl+I)
        this.root.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('markdown-input')) return;
            if (e.ctrlKey && e.key === 'b') { e.preventDefault(); this._insertFormatting('bold');   }
            if (e.ctrlKey && e.key === 'i') { e.preventDefault(); this._insertFormatting('italic'); }
        });

        // Delegated click handler for toolbar and save button
        this.root.addEventListener('click', async (e) => {
            // Formatting toolbar
            const btn = e.target.closest('.toolbar-btn');
            if (btn) {
                const action = btn.dataset.action;
                if (action === 'clear') {
                    const ok = await E.confirm('Clear all content? This cannot be undone.', {
                        title: 'Clear Editor', confirmText: 'Clear', cancelText: 'Cancel'
                    });
                    if (!ok) return;
                    const ta = this.root.querySelector('.markdown-input');
                    if (ta) ta.value = '';
                    this.set({ content: '' });
                    this._saveContent();
                } else {
                    this._insertFormatting(action);
                    if (this.props.autoSave) this._debouncedSave();
                }
                return;
            }
            // Save button — use a toast for visual feedback rather than DOM mutation
            if (e.target.closest('.save-btn')) {
                this._saveContent();
                E.toast('Content saved', { type: 'success' });
            }
        });

        I.scan(this.root);
        this._updatePreview();
        this._updateStats();
    },

    onUnmount() {
        // Flush any pending debounced save before teardown
        if (this.props.autoSave) this._saveContent();
    },

    onUpdated() {
        this._updatePreview();
        this._updateStats();
        I.scan(this.root);
    },

    style: `
        :host { display: block; }

        .editor-wrapper { max-width: 100%; }

        /* ── Stats bar ────────────────────────────────────────────── */
        .stats-bar {
            display: flex;
            gap: 1.5rem;
            padding: 1rem;
            background: var(--dm-gray-100, #f3f4f6);
            border-radius: 8px;
            margin-bottom: 2rem;
            font-size: 0.875rem;
            color: var(--dm-text-muted);
            flex-wrap: wrap;
            align-items: center;
        }
        .stat-item  { display: flex; align-items: center; gap: 0.5rem; }
        .stat-value { font-weight: 600; color: var(--dm-text); }

        /* ── Toolbar ──────────────────────────────────────────────── */
        .editor-toolbar {
            display: flex;
            gap: 0.5rem;
            padding: 1rem;
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-bottom: none;
            border-radius: 8px 8px 0 0;
            flex-wrap: wrap;
            align-items: center;
        }
        .toolbar-group {
            display: flex;
            gap: 0.25rem;
            padding-right: 0.5rem;
            border-right: 1px solid var(--dm-border);
        }
        .toolbar-group:last-child { border-right: none; }
        .toolbar-btn {
            padding: 0.5rem;
            border: none;
            background: transparent;
            cursor: pointer;
            border-radius: 4px;
            transition: background 0.2s;
            color: var(--dm-text);
        }
        .toolbar-btn:hover { background: var(--dm-hover-bg); }

        /* ── Split pane ───────────────────────────────────────────── */
        .split-pane {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            min-height: 500px;
        }
        @media (max-width: 768px) { .split-pane { grid-template-columns: 1fr; } }

        .pane {
            border: 1px solid var(--dm-border);
            border-radius: 0 0 8px 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .pane-header {
            padding: 0.75rem 1rem;
            background: var(--dm-gray-100, #f3f4f6);
            border-bottom: 1px solid var(--dm-border);
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .pane-hint { font-size: 0.75rem; font-weight: normal; color: var(--dm-text-muted); }

        .pane-content {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            background: var(--dm-card-bg);
        }

        .markdown-input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            resize: none;
            font-family: 'Courier New', monospace;
            font-size: 0.9375rem;
            line-height: 1.6;
            background: transparent;
            color: var(--dm-text);
            padding: 0;
        }

        .preview-placeholder { color: var(--dm-text-muted); text-align: center; padding: 3rem 0; margin: 0; }

        /* ── Preview element styles ───────────────────────────────── */
        .preview-pane-content h1 { font-size: 2rem;    margin: 0 0 1rem; border-bottom: 2px solid var(--dm-border); padding-bottom: 0.5rem; }
        .preview-pane-content h2 { font-size: 1.5rem;  margin: 1.5rem 0 1rem; }
        .preview-pane-content h3 { font-size: 1.25rem; margin: 1.25rem 0 0.75rem; }
        .preview-pane-content p  { margin: 0 0 1rem; line-height: 1.7; }
        .preview-pane-content ul,
        .preview-pane-content ol { margin: 0 0 1rem; padding-left: 2rem; }
        .preview-pane-content li { margin-bottom: 0.5rem; }
        .preview-pane-content code {
            background: var(--dm-gray-100, #f3f4f6);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
        }
        .preview-pane-content pre {
            background: var(--dm-gray-900, #111827);
            color: var(--dm-gray-100, #f3f4f6);
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 0 0 1rem;
        }
        .preview-pane-content pre code { background: transparent; padding: 0; color: inherit; }
        .preview-pane-content blockquote {
            border-left: 4px solid var(--dm-primary);
            padding-left: 1rem;
            margin: 0 0 1rem;
            color: var(--dm-text-muted);
            font-style: italic;
        }
        .preview-pane-content a       { color: var(--dm-primary); text-decoration: none; }
        .preview-pane-content a:hover { text-decoration: underline; }
        .preview-pane-content img     { max-width: 100%; height: auto; border-radius: 4px; margin: 1rem 0; }
        .preview-pane-content hr      { border: none; border-top: 2px solid var(--dm-border); margin: 2rem 0; }

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
        }
        .btn-sm      { padding: 0.375rem 0.75rem; font-size: 0.875rem; border-radius: 6px; }
        .btn-primary { background: var(--dm-primary); color: var(--dm-white); border-color: var(--dm-primary); }
        .btn-primary:hover { filter: brightness(0.88); }
    `
});
