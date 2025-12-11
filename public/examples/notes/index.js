(function () {
    'use strict';

    // ========================================
    // Constants
    // ========================================

    const STORAGE_KEY = 'domma-example-notes';

    // Aliases
    const $ = Domma;
    const _ = Domma.utils;
    const S = Domma.storage;

    // ========================================
    // State
    // ========================================

    let currentEditId = null;

    // ========================================
    // Storage Helper Functions
    // ========================================

    function loadNotes() {
        return S.get(STORAGE_KEY, []);
    }

    function saveNotes(notes) {
        S.set(STORAGE_KEY, notes);
    }

    // ========================================
    // Render Functions
    // ========================================

    function renderNotes(filter = '') {
        const notes = loadNotes();
        const filtered = filter
            ? notes.filter(note =>
                note.title.toLowerCase().includes(filter.toLowerCase()) ||
                note.content.toLowerCase().includes(filter.toLowerCase()) ||
                note.categories.some(cat => cat.toLowerCase().includes(filter.toLowerCase()))
            )
            : notes;

        const grid = $('#notes-grid');
        const emptyState = $('#empty-state');

        if (filtered.length === 0) {
            grid.hide();
            emptyState.show();
        } else {
            grid.show();
            emptyState.hide();
            grid.html(filtered.map(renderNoteCard).join(''));
        }
    }

    function renderNoteCard(note) {
        const preview = _.truncate(note.content, {length: 150, omission: '...'});
        const dateStr = new Date(note.updated).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const categoriesHtml = note.categories
            .map(cat => `<span class="category-tag">${_.escape(cat)}</span>`)
            .join('');

        return `
            <div class="note-card" data-note-id="${note.id}">
                <div class="note-header">
                    <h3>${_.escape(note.title) || 'Untitled'}</h3>
                    <div class="note-actions">
                        <button class="icon-btn" data-action="edit" data-id="${note.id}">
                            <span data-icon="edit" data-icon-size="16"></span>
                        </button>
                        <button class="icon-btn" data-action="delete" data-id="${note.id}">
                            <span data-icon="trash" data-icon-size="16"></span>
                        </button>
                    </div>
                </div>
                <div class="note-preview">${_.escape(preview)}</div>
                <div class="note-footer">
                    <div class="note-categories">${categoriesHtml}</div>
                    <span class="note-date">${dateStr}</span>
                </div>
            </div>
        `;
    }

    // ========================================
    // Note Operations
    // ========================================

    function createNote() {
        currentEditId = null;
        $('#note-title').val('');
        $('#note-content').val('');
        $('#note-categories').val('');
        openEditor();
    }

    function editNote(id) {
        const notes = loadNotes();
        const note = _.find(notes, n => n.id === id);

        if (!note) return;

        currentEditId = id;
        $('#note-title').val(note.title);
        $('#note-content').val(note.content);
        $('#note-categories').val(note.categories.join(', '));
        openEditor();
    }

    function saveNote() {
        const title = $('#note-title').val().trim();
        const content = $('#note-content').val().trim();
        const categoriesStr = $('#note-categories').val().trim();
        const categories = categoriesStr
            ? categoriesStr.split(',').map(c => c.trim()).filter(c => c)
            : [];

        if (!title && !content) {
            Domma.elements.toast('warning', 'Please add a title or content', {
                duration: 3000
            });
            return;
        }

        const notes = loadNotes();
        const now = Date.now();

        if (currentEditId) {
            // Update existing note
            const index = _.findIndex(notes, n => n.id === currentEditId);
            if (index !== -1) {
                notes[index] = {
                    ...notes[index],
                    title,
                    content,
                    categories,
                    updated: now
                };
            }
        } else {
            // Create new note
            notes.unshift({
                id: `note-${now}`,
                title,
                content,
                categories,
                created: now,
                updated: now
            });
        }

        saveNotes(notes);
        closeEditor();
        renderNotes();
        Domma.icons.scan();
        Domma.elements.toast('success', currentEditId ? 'Note updated' : 'Note created', {
            duration: 3000
        });
    }

    function deleteNote(id) {
        Domma.elements.confirm('Are you sure you want to delete this note?', {
            title: 'Delete Note',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        }).then(confirmed => {
            if (confirmed) {
                const notes = loadNotes();
                const filtered = notes.filter(note => note.id !== id);
                saveNotes(filtered);
                renderNotes();
                Domma.elements.toast('success', 'Note deleted', {
                    duration: 3000
                });
            }
        });
    }

    function searchNotes(query) {
        renderNotes(query);
        Domma.icons.scan();
    }

    // ========================================
    // Editor Functions
    // ========================================

    function openEditor() {
        $('#note-editor').show();
        $('#note-title').focus();
    }

    function closeEditor() {
        $('#note-editor').hide();
        currentEditId = null;
    }

    function insertFormat(format) {
        const textarea = document.getElementById('note-content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        let before = '', after = '', replacement = '';

        switch (format) {
            case 'bold':
                before = '**';
                after = '**';
                replacement = selectedText || 'bold text';
                break;
            case 'italic':
                before = '*';
                after = '*';
                replacement = selectedText || 'italic text';
                break;
            case 'underline':
                before = '__';
                after = '__';
                replacement = selectedText || 'underlined text';
                break;
            case 'h1':
                before = '# ';
                after = '';
                replacement = selectedText || 'Heading 1';
                break;
            case 'ul':
                before = '- ';
                after = '';
                replacement = selectedText || 'List item';
                break;
        }

        const newText = text.substring(0, start) + before + replacement + after + text.substring(end);
        textarea.value = newText;
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + replacement.length);
    }

    // ========================================
    // Event Handlers
    // ========================================

    function initEventHandlers() {
        // New note button
        $('#new-note-btn').on('click', createNote);

        // Search input
        $('#search-input').on('input', function () {
            searchNotes($(this).val().trim());
        });

        // Close editor
        $('#close-editor').on('click', closeEditor);

        // Save note
        $('#save-note').on('click', saveNote);

        // Note card actions (event delegation)
        $('#notes-grid').on('click', '[data-action="edit"]', function (e) {
            e.stopPropagation();
            const id = $(this).data('id');
            editNote(id);
        });

        $('#notes-grid').on('click', '[data-action="delete"]', function (e) {
            e.stopPropagation();
            const id = $(this).data('id');
            deleteNote(id);
        });

        // Click note card to edit
        $('#notes-grid').on('click', '.note-card', function () {
            const id = $(this).data('note-id');
            editNote(id);
        });

        // Formatting toolbar
        $('[data-format]').on('click', function () {
            const format = $(this).data('format');
            insertFormat(format);
        });

        // Close editor on Escape
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $('#note-editor').is(':visible')) {
                closeEditor();
            }
        });

        // Save on Ctrl+Enter
        $('#note-content, #note-title').on('keydown', function (e) {
            if (e.ctrlKey && e.key === 'Enter') {
                saveNote();
            }
        });

        // Close modal when clicking backdrop
        $('#note-editor').on('click', function (e) {
            if (e.target === this) {
                closeEditor();
            }
        });
    }

    // ========================================
    // Initialization
    // ========================================

    function init() {
        renderNotes();
        initEventHandlers();
        Domma.icons.scan();
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();