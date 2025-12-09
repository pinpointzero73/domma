(function () {
    'use strict';

    // ========================================
    // Constants and Configuration
    // ========================================

    const STORAGE_KEY = 'domma-example-todos';

    // Aliases for Domma APIs
    const $ = Domma;
    const _ = Domma.utils;
    const S = Domma.storage;

    // Status options
    const STATUS = {
        NOT_STARTED: 'not-started',
        IN_PROGRESS: 'in-progress',
        COMPLETED: 'completed'
    };

    // Priority options
    const PRIORITY = {
        HIGHEST: 'highest',
        HIGH: 'high',
        MEDIUM: 'medium',
        LOW: 'low',
        LOWEST: 'lowest'
    };

    // ========================================
    // Storage Helper Functions
    // ========================================

    function loadTodos() {
        const todos = S.get(STORAGE_KEY, []);

        // Migrate old todos to new format
        return todos.map(todo => {
            const newTodo = {...todo};
            if (!newTodo.status) {
                newTodo.status = todo.completed ? STATUS.COMPLETED : STATUS.NOT_STARTED;
            }
            if (!newTodo.priority) {
                newTodo.priority = PRIORITY.MEDIUM;
            }
            delete newTodo.completed;
            return newTodo;
        });
    }

    function saveTodos(todos) {
        S.set(STORAGE_KEY, todos);
    }

    function generateId() {
        return Date.now().toString();
    }

    // ========================================
    // Render Functions
    // ========================================

    function renderTodos() {
        const todos = loadTodos();
        const $list = $('#todo-list');
        const $empty = $('#empty-state');

        if (todos.length === 0) {
            $list.empty();
            $empty.show();
            return;
        }

        $empty.hide();

        // Use Domma's template system
        const template = `
            {{#each todos}}
            <li class="todo-item {{#if isCompleted}}completed{{/if}}" data-id="{{id}}">
                <input type="checkbox"
                       class="todo-checkbox"
                       {{#if isCompleted}}checked{{/if}}>

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
                            <option value="completed" {{#if isCompleted}}selected{{/if}}>Completed</option>
                        </select>
                        <select class="todo-select priority-select" data-id="{{id}}">
                            <option value="highest" {{#if isHighest}}selected{{/if}}>Highest</option>
                            <option value="high" {{#if isHigh}}selected{{/if}}>High</option>
                            <option value="medium" {{#if isMedium}}selected{{/if}}>Medium</option>
                            <option value="low" {{#if isLow}}selected{{/if}}>Low</option>
                            <option value="lowest" {{#if isLowest}}selected{{/if}}>Lowest</option>
                        </select>
                    </div>
                </div>

                <div class="todo-actions">
                    <button class="btn btn-sm btn-secondary edit-todo">
                        <span data-icon="edit" data-icon-size="14"></span>
                    </button>
                    <button class="btn btn-sm btn-danger delete-todo">
                        <span data-icon="trash" data-icon-size="14"></span>
                    </button>
                </div>
            </li>
            {{/each}}
        `;

        // Prepare data with helper flags for template
        const templateData = {
            todos: todos.map(todo => ({
                ...todo,
                text: _.escape(todo.text),
                statusLabel: formatStatus(todo.status),
                priorityLabel: formatPriority(todo.priority),
                isCompleted: todo.status === STATUS.COMPLETED,
                isNotStarted: todo.status === STATUS.NOT_STARTED,
                isInProgress: todo.status === STATUS.IN_PROGRESS,
                isHighest: todo.priority === PRIORITY.HIGHEST,
                isHigh: todo.priority === PRIORITY.HIGH,
                isMedium: todo.priority === PRIORITY.MEDIUM,
                isLow: todo.priority === PRIORITY.LOW,
                isLowest: todo.priority === PRIORITY.LOWEST
            }))
        };

        // Render using Domma's template system
        const html = _.render(template, templateData);
        $list.html(html);
        Domma.icons.scan($list[0]);
    }

    function formatStatus(status) {
        return status.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function formatPriority(priority) {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    }

    // ========================================
    // Todo Operations
    // ========================================

    function addTodo() {
        const $input = $('#todo-input');
        const text = $input.val().trim();
        const status = $('#status-input').val();
        const priority = $('#priority-input').val();

        if (!text) {
            Domma.elements.toast('warning', 'Please enter a task', {
                position: 'top-center',
                duration: 3000
            });
            return;
        }

        const todos = loadTodos();
        const newTodo = {
            id: generateId(),
            text: text,
            status: status,
            priority: priority,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        todos.push(newTodo);
        saveTodos(todos);
        renderTodos();

        $input.val('').focus();
        $('#status-input').val(STATUS.NOT_STARTED);
        $('#priority-input').val(PRIORITY.MEDIUM);

        Domma.elements.toast('success', 'Task added successfully!', {
            position: 'top-center',
            duration: 2000
        });
    }

    function toggleTodo(id) {
        const todos = loadTodos();
        const todo = _.find(todos, t => t.id === id);

        if (todo) {
            todo.status = todo.status === STATUS.COMPLETED ? STATUS.NOT_STARTED : STATUS.COMPLETED;
            todo.updatedAt = Date.now();
            saveTodos(todos);
            renderTodos();

            Domma.elements.toast('info',
                todo.status === STATUS.COMPLETED ? 'Task completed!' : 'Task reopened',
                {position: 'top-center', duration: 2000}
            );
        }
    }

    async function editTodo(id) {
        const todos = loadTodos();
        const todo = _.find(todos, t => t.id === id);

        if (!todo) return;

        try {
            const newText = await Domma.elements.prompt('Edit your task:', {
                title: 'Edit Task',
                inputValue: todo.text,
                inputPlaceholder: 'Task description',
                confirmText: 'Save',
                cancelText: 'Cancel'
            });

            if (newText && newText.trim()) {
                todo.text = newText.trim();
                todo.updatedAt = Date.now();
                saveTodos(todos);
                renderTodos();

                Domma.elements.toast('success', 'Task updated!', {
                    position: 'top-center',
                    duration: 2000
                });
            }
        } catch (error) {
            // User cancelled
            console.log('Edit cancelled');
        }
    }

    async function deleteTodo(id) {
        try {
            const confirmed = await Domma.elements.confirm('Are you sure you want to delete this task?', {
                title: 'Confirm Delete',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            });

            if (confirmed) {
                const $item = $(`.todo-item[data-id="${id}"]`);
                $item.fadeOut(300, function () {
                    const todos = loadTodos();
                    const filtered = _.filter(todos, t => t.id !== id);
                    saveTodos(filtered);
                    renderTodos();
                });

                Domma.elements.toast('success', 'Task deleted', {
                    position: 'top-center',
                    duration: 2000
                });
            }
        } catch (error) {
            // User cancelled
        }
    }

    function updateStatus(id, status) {
        const todos = loadTodos();
        const todo = _.find(todos, t => t.id === id);

        if (todo) {
            todo.status = status;
            todo.updatedAt = Date.now();
            saveTodos(todos);
            renderTodos();

            Domma.elements.toast('info', `Status updated to ${formatStatus(status)}`, {
                position: 'top-center',
                duration: 2000
            });
        }
    }

    function updatePriority(id, priority) {
        const todos = loadTodos();
        const todo = _.find(todos, t => t.id === id);

        if (todo) {
            todo.priority = priority;
            todo.updatedAt = Date.now();
            saveTodos(todos);
            renderTodos();

            Domma.elements.toast('info', `Priority set to ${formatPriority(priority)}`, {
                position: 'top-center',
                duration: 2000
            });
        }
    }

    // ========================================
    // Code Display
    // ========================================

    async function displaySourceCode() {
        try {
            // Fetch both HTML and JavaScript files
            const [htmlResponse, jsResponse] = await Promise.all([
                fetch(window.location.href),
                fetch('index.js')
            ]);

            const htmlSource = await htmlResponse.text();
            const jsSource = await jsResponse.text();

            // Combine both sources with clear separation
            const combinedSource = `<!-- ============================================ -->
<!-- index.html -->
<!-- ============================================ -->

${htmlSource}

<!-- ============================================ -->
<!-- index.js -->
<!-- ============================================ -->

${jsSource}`;

            const $code = $('#source-code');
            $code.get(0).removeAttribute('data-syntax-highlighted');
            $code.removeClass('syntax-highlighted');
            $code.text(combinedSource);

            if (Domma.syntax) {
                Domma.syntax.highlight($code.get(0), 'html');
            }
        } catch (error) {
            console.error('[Todo] Error loading source code:', error);
            $('#source-code').text('Error: ' + error.message);
        }
    }

    // ========================================
    // Event Handlers
    // ========================================

    function initEventHandlers() {
        $('#add-todo-btn').on('click', addTodo);

        $('#todo-input').on('keypress', function (e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        $('#todo-list')
            .on('change', '.todo-checkbox', function () {
                const id = $(this).closest('.todo-item').data('id');
                toggleTodo(id);
            })
            .on('change', '.status-select', function () {
                const id = $(this).data('id');
                const status = $(this).val();
                updateStatus(id, status);
            })
            .on('change', '.priority-select', function () {
                const id = $(this).data('id');
                const priority = $(this).val();
                updatePriority(id, priority);
            })
            .on('click', '.edit-todo', function () {
                const id = $(this).closest('.todo-item').data('id');
                editTodo(id);
            })
            .on('click', '.delete-todo', function () {
                const id = $(this).closest('.todo-item').data('id');
                deleteTodo(id);
            });
    }

    // ========================================
    // Initialization
    // ========================================

    function init() {
        renderTodos();
        initEventHandlers();

        Domma.elements.tabs('#todo-tabs', {
            onChange: (index) => {
                if (index === 1) {
                    displaySourceCode();
                }
            }
        });

        Domma.icons.scan();
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
