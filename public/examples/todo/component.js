/**
 * DommaCom: domma-todo
 *
 * A feature-rich to-do list Web Component built with Domma.component().
 * Demonstrates: reactive data, Shadow DOM event delegation, storage
 * persistence, and Domma UI feedback (toast, confirm, prompt).
 *
 * Usage:
 *   <domma-todo></domma-todo>
 *   <domma-todo storage-key="my-todos"></domma-todo>
 *
 * Requires DOMPurify to be loaded before this script.
 */

// Item template used by _.render() inside _renderList().
// All user-supplied values are escaped with _.escape() before being
// substituted into this template, and the final HTML is additionally
// sanitised with DOMPurify before being written to the DOM.
const TODO_ITEM_TPL = `{{#each todos}}
<li class="todo-item {{#if isCompleted}}completed{{/if}}" data-id="{{id}}">
    <input type="checkbox" class="todo-checkbox" data-id="{{id}}" {{#if isCompleted}}checked{{/if}}>
    <div class="todo-content">
        <span class="todo-text">{{text}}</span>
        <div class="todo-meta">
            <div class="todo-badges">
                <span class="badge badge-{{status}}">{{statusLabel}}</span>
                <span class="badge badge-{{priority}}">{{priorityLabel}}</span>
            </div>
            <select class="todo-select status-select" data-id="{{id}}">
                <option value="not-started" {{#if isNotStarted}}selected{{/if}}>Not Started</option>
                <option value="in-progress" {{#if isInProgress}}selected{{/if}}>In Progress</option>
                <option value="completed"   {{#if isCompleted}}selected{{/if}}>Completed</option>
            </select>
            <select class="todo-select priority-select" data-id="{{id}}">
                <option value="highest" {{#if isHighest}}selected{{/if}}>Highest</option>
                <option value="high"    {{#if isHigh}}selected{{/if}}>High</option>
                <option value="medium"  {{#if isMedium}}selected{{/if}}>Medium</option>
                <option value="low"     {{#if isLow}}selected{{/if}}>Low</option>
                <option value="lowest"  {{#if isLowest}}selected{{/if}}>Lowest</option>
            </select>
        </div>
    </div>
    <div class="todo-actions">
        <button class="btn btn-sm btn-secondary" data-action="edit" data-id="{{id}}">
            <span data-icon="edit" data-icon-size="14"></span>
        </button>
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="{{id}}">
            <span data-icon="trash" data-icon-size="14"></span>
        </button>
    </div>
</li>
{{/each}}`;

/** Sanitise an HTML string via DOMPurify (loaded on the host page). */
function safeHtml(html) {
    return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
}

Domma.component('domma-todo', {
    templateUrl: 'template.html',

    props: {
        storageKey: { type: 'string', default: 'domma-example-todos' }
    },

    data() {
        return { todos: [] };
    },

    methods: {
        // ── Formatting helpers ──────────────────────────────────────────

        _fmtStatus(s) {
            return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        },

        _fmtPriority(p) {
            return p.charAt(0).toUpperCase() + p.slice(1);
        },

        /** Annotate a todo with boolean flags the item template needs. */
        _annotate(t) {
            return {
                ...t,
                // _.escape() ensures user text cannot inject markup
                text:          _.escape(t.text),
                statusLabel:   this._fmtStatus(t.status),
                priorityLabel: this._fmtPriority(t.priority),
                isCompleted:   t.status === 'completed',
                isNotStarted:  t.status === 'not-started',
                isInProgress:  t.status === 'in-progress',
                isHighest:     t.priority === 'highest',
                isHigh:        t.priority === 'high',
                isMedium:      t.priority === 'medium',
                isLow:         t.priority === 'low',
                isLowest:      t.priority === 'lowest'
            };
        },

        // ── Rendering ───────────────────────────────────────────────────

        /** Re-render the task list without disturbing the add-task form above it. */
        _renderList() {
            const list  = this.root.querySelector('.todo-list');
            const empty = this.root.querySelector('.todo-empty');
            if (!list) return;
            const todos = this.data.todos;
            if (todos.length === 0) {
                list.textContent = '';
                if (empty) empty.style.display = 'block';
            } else {
                if (empty) empty.style.display = 'none';
                const rendered = _.render(TODO_ITEM_TPL, {
                    todos: todos.map(t => this._annotate(t))
                });
                list.innerHTML = safeHtml(rendered);
            }
        },

        // ── CRUD operations ─────────────────────────────────────────────

        addTodo() {
            const input       = this.root.querySelector('.new-todo-input');
            const statusSel   = this.root.querySelector('.new-status-select');
            const prioritySel = this.root.querySelector('.new-priority-select');
            const text = input ? input.value.trim() : '';

            if (!text) {
                E.toast('Please enter a task', { type: 'warning' });
                return;
            }

            const newTodo = {
                id:        Date.now().toString(),
                text,
                status:    statusSel   ? statusSel.value   : 'not-started',
                priority:  prioritySel ? prioritySel.value : 'medium',
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            const todos = [...this.data.todos, newTodo];
            S.set(this.props.storageKey, todos);
            this.set({ todos });

            // Reset the form to defaults
            if (input)       { input.value = ''; input.focus(); }
            if (statusSel)   statusSel.value   = 'not-started';
            if (prioritySel) prioritySel.value = 'medium';

            E.toast('Task added!', { type: 'success' });
        },

        toggleTodo(id) {
            const todos = this.data.todos.map(t =>
                t.id === id
                    ? { ...t, status: t.status === 'completed' ? 'not-started' : 'completed', updatedAt: Date.now() }
                    : t
            );
            S.set(this.props.storageKey, todos);
            this.set({ todos });
            const todo = todos.find(t => t.id === id);
            E.toast(todo && todo.status === 'completed' ? 'Task completed!' : 'Task reopened', { type: 'info' });
        },

        async editTodo(id) {
            const todo = this.data.todos.find(t => t.id === id);
            if (!todo) return;
            try {
                const newText = await E.prompt('Edit your task:', {
                    title:            'Edit Task',
                    inputValue:       todo.text,
                    inputPlaceholder: 'Task description',
                    confirmText:      'Save',
                    cancelText:       'Cancel'
                });
                if (newText && newText.trim()) {
                    const todos = this.data.todos.map(t =>
                        t.id === id ? { ...t, text: newText.trim(), updatedAt: Date.now() } : t
                    );
                    S.set(this.props.storageKey, todos);
                    this.set({ todos });
                    E.toast('Task updated!', { type: 'success' });
                }
            } catch (e) { /* user cancelled prompt */ }
        },

        async deleteTodo(id) {
            try {
                const confirmed = await E.confirm('Delete this task?', {
                    title:       'Confirm Delete',
                    confirmText: 'Delete',
                    cancelText:  'Cancel'
                });
                if (confirmed) {
                    const todos = this.data.todos.filter(t => t.id !== id);
                    S.set(this.props.storageKey, todos);
                    this.set({ todos });
                    E.toast('Task deleted', { type: 'success' });
                }
            } catch (e) { /* user cancelled confirm */ }
        },

        updateStatus(id, status) {
            const todos = this.data.todos.map(t =>
                t.id === id ? { ...t, status, updatedAt: Date.now() } : t
            );
            S.set(this.props.storageKey, todos);
            this.set({ todos });
            E.toast('Status updated to ' + this._fmtStatus(status), { type: 'success' });
        },

        updatePriority(id, priority) {
            const todos = this.data.todos.map(t =>
                t.id === id ? { ...t, priority, updatedAt: Date.now() } : t
            );
            S.set(this.props.storageKey, todos);
            this.set({ todos });
            E.toast('Priority set to ' + this._fmtPriority(priority), { type: 'success' });
        }
    },

    onMount() {
        // Migrate old boolean .completed → .status and load from storage
        const saved = S.get(this.props.storageKey, []).map(todo => {
            const t = { ...todo };
            if (!t.status)   t.status   = todo.completed ? 'completed' : 'not-started';
            if (!t.priority) t.priority = 'medium';
            delete t.completed;
            return t;
        });
        this.set({ todos: saved });

        // Delegated click handler — attached to shadow root so it survives _renderList() calls
        this.root.addEventListener('click', (e) => {
            if (e.target.closest('.add-todo-btn')) {
                this.addTodo();
                return;
            }
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const { action, id } = actionBtn.dataset;
                if (action === 'edit')   this.editTodo(id);
                if (action === 'delete') this.deleteTodo(id);
            }
        });

        this.root.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('new-todo-input')) {
                this.addTodo();
            }
        });

        this.root.addEventListener('change', (e) => {
            const statusSel = e.target.closest('.status-select');
            if (statusSel && statusSel.dataset.id) {
                this.updateStatus(statusSel.dataset.id, statusSel.value);
                return;
            }
            const prioritySel = e.target.closest('.priority-select');
            if (prioritySel && prioritySel.dataset.id) {
                this.updatePriority(prioritySel.dataset.id, prioritySel.value);
                return;
            }
            const checkbox = e.target.closest('.todo-checkbox');
            if (checkbox && checkbox.dataset.id) {
                this.toggleTodo(checkbox.dataset.id);
            }
        });

        this._renderList();
        I.scan(this.root);
    },

    onUpdated() {
        this._renderList();
        I.scan(this.root);
    },

    style: `
        :host { display: block; }

        .todo-wrapper { max-width: 1200px; margin: 0 auto; }

        /* ── Add task row ─────────────────────────────────────────── */
        .todo-input-container {
            display: grid;
            grid-template-columns: 1fr auto auto auto;
            gap: 0.75rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-radius: 12px;
            box-shadow: var(--dm-shadow-sm);
        }

        @media (max-width: 768px) {
            .todo-input-container { grid-template-columns: 1fr; }
            .todo-item            { grid-template-columns: 1fr; }
        }

        .new-todo-input {
            padding: 0.875rem 1rem;
            border: 2px solid var(--dm-border);
            border-radius: 8px;
            font-size: 1rem;
            font-family: inherit;
            background: var(--dm-surface);
            color: var(--dm-text);
            transition: border-color 0.2s;
        }
        .new-todo-input:focus { outline: none; border-color: var(--dm-primary); box-shadow: 0 0 0 3px var(--dm-focus-ring); }
        .new-todo-input::placeholder { color: var(--dm-gray-400); }

        /* ── Selects ──────────────────────────────────────────────── */
        .create-select, .todo-select {
            padding: 0.5rem 0.875rem;
            border: 1px solid var(--dm-border);
            border-radius: 6px;
            background: var(--dm-surface);
            color: var(--dm-text);
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }
        .create-select:hover, .todo-select:hover { border-color: var(--dm-primary); background: var(--dm-hover-bg); }
        .create-select:focus, .todo-select:focus  { outline: none; border-color: var(--dm-primary); box-shadow: 0 0 0 3px var(--dm-focus-ring); }

        /* ── List ─────────────────────────────────────────────────── */
        .todo-list { list-style: none; padding: 0; margin: 0; }

        .todo-item {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: start;
            gap: 1rem;
            padding: 1.25rem 1.5rem;
            background: var(--dm-card-bg);
            border: 1px solid var(--dm-border);
            border-radius: 12px;
            margin-bottom: 0.75rem;
            transition: all 0.2s;
        }
        .todo-item:hover { box-shadow: var(--dm-shadow-md); border-color: var(--dm-primary-light, #93c5fd); }
        .todo-item.completed .todo-text { text-decoration: line-through; opacity: 0.5; }

        .todo-checkbox { width: 22px; height: 22px; cursor: pointer; accent-color: var(--dm-primary); margin-top: 2px; }

        .todo-content  { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; min-width: 0; }
        .todo-text     { font-size: 1rem; color: var(--dm-text); word-break: break-word; }
        .todo-meta     { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .todo-badges   { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }
        .todo-actions  { display: flex; gap: 0.5rem; flex-shrink: 0; }

        /* ── Empty state ──────────────────────────────────────────── */
        .todo-empty { text-align: center; padding: 4rem 2rem; color: var(--dm-gray-500); }
        .todo-empty h3 { margin: 1rem 0 0.5rem; color: var(--dm-gray-600); font-size: 1.25rem; }
        .todo-empty p  { margin: 0; }

        /* ── Badges ───────────────────────────────────────────────── */
        .badge {
            padding: 0.25rem 0.625rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            white-space: nowrap;
        }
        .badge-not-started { background: var(--dm-gray-200);              color: var(--dm-gray-700); }
        .badge-in-progress { background: var(--dm-info-light,    #e0f2fe); color: var(--dm-info-dark,    #075985); }
        .badge-completed   { background: var(--dm-success-light, #dcfce7); color: var(--dm-success-dark, #15803d); }
        .badge-highest     { background: var(--dm-danger);                 color: var(--dm-white); }
        .badge-high        { background: var(--dm-warning);                color: var(--dm-white); }
        .badge-medium      { background: var(--dm-warning);                color: var(--dm-black, #000); }
        .badge-low         { background: var(--dm-info);                   color: var(--dm-white); }
        .badge-lowest      { background: var(--dm-gray-400);               color: var(--dm-white); }

        /* ── Buttons (Shadow DOM copies of Domma element styles) ──── */
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
        .btn-sm        { padding: 0.375rem 0.75rem; font-size: 0.875rem; border-radius: 6px; }
        .btn-primary   { background: var(--dm-primary); color: var(--dm-white); border-color: var(--dm-primary); }
        .btn-primary:hover   { filter: brightness(0.88); }
        .btn-secondary { background: var(--dm-surface);  color: var(--dm-text);  border-color: var(--dm-border); }
        .btn-secondary:hover { background: var(--dm-hover-bg); }
        .btn-danger    { background: var(--dm-danger);   color: var(--dm-white); border-color: var(--dm-danger); }
        .btn-danger:hover    { filter: brightness(0.88); }
    `
});
