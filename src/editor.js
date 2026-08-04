/**
 * Domma Editor
 * Universal content editor with text, rich, and code modes
 */

import Component from './component.js';

class Editor extends Component {
    constructor(selector, options = {}) {
        super(selector, options);

        // Mode: 'text', 'rich', 'code'
        this.mode = options.mode || 'text';

        // Model integration
        this.model = options.model || null;
        this.modelKey = options.modelKey || null;

        // Autosave
        this.autosave = options.autosave !== undefined ? options.autosave : false;
        this.autosaveInterval = options.autosaveInterval || 3000;
        this.storageKey = options.storage || null;

        // Toolbar configuration
        this.toolbar = options.toolbar || this._getDefaultToolbar();
        this.showToolbar = options.showToolbar !== false;

        // Image handling
        this.imagePaste = options.imagePaste !== false;
        this.imageMode = options.imageMode || 'base64'; // 'base64' or 'upload'
        this.imageUpload = options.imageUpload || null; // Custom upload function

        // Code mode options
        this.language = options.language || 'javascript';
        this.lineNumbers = options.lineNumbers !== false;
        this.theme = options.theme || 'light';

        // General options
        this.placeholder = options.placeholder || '';
        this.minHeight = options.minHeight || 200;
        this.maxHeight = options.maxHeight || null;
        this.characterCount = options.characterCount || false;
        this.wordCount = options.wordCount || false;

        // Callbacks
        this.onChange = options.onChange || null;
        this.onSave = options.onSave || null;
        this.onImagePaste = options.onImagePaste || null;

        // Internal state
        this._content = '';
        this._history = [];
        this._historyIndex = -1;
        this._maxHistory = 50;
        this._autosaveTimer = null;
        this._container = null;
        this._editorEl = null;
        this._toolbarEl = null;
        this._counterEl = null;

        this._init();
    }

    _init() {
        if (!this.element) return;

        // Hide original element
        this.element.style.display = 'none';

        // Create editor container
        this._createContainer();

        // Create toolbar (if enabled and in rich/code mode)
        if (this.showToolbar && (this.mode === 'rich' || this.mode === 'code')) {
            this._createToolbar();
        }

        // Create editor based on mode
        this._createEditor();

        // Create counter (if enabled)
        if (this.characterCount || this.wordCount) {
            this._createCounter();
        }

        // Load from storage if available
        if (this.storageKey) {
            this._loadFromStorage();
        }

        // Load initial content
        const initialContent = this.element.value || this.element.textContent || '';
        if (initialContent) {
            this.setValue(initialContent);
        }

        // Setup autosave
        if (this.autosave) {
            this._setupAutosave();
        }

        // Model integration.
        // onFieldChange fires only for modelKey and passes the value
        // positionally; onChange passes a single {field, newValue} object.
        const onFieldValue = (newVal) => {
            if (newVal !== this.getValue()) this.setValue(newVal);
        };

        if (this.model && typeof this.model.onFieldChange === 'function') {
            this._modelUnsubscribe = this.model.onFieldChange(this.modelKey, onFieldValue);
        } else if (this.model && typeof this.model.onChange === 'function') {
            this._modelUnsubscribe = this.model.onChange(({field, newValue}) => {
                if (field === this.modelKey) onFieldValue(newValue);
            });
        }
    }

    _getDefaultToolbar() {
        if (this.mode === 'rich') {
            return [
                ['bold', 'italic', 'underline', 'strikethrough'],
                ['h1', 'h2', 'h3'],
                ['ul', 'ol', 'blockquote'],
                ['link', 'image', 'code'],
                ['codeblock', 'embed'],
                ['undo', 'redo', 'clear']
            ];
        } else if (this.mode === 'code') {
            return [
                ['undo', 'redo'],
                ['format', 'clear']
            ];
        }
        return [];
    }

    _createContainer() {
        this._container = document.createElement('div');
        this._container.className = `dm-editor dm-editor-${this.mode} dm-theme-${this.theme}`;
        this._container.style.minHeight = `${this.minHeight}px`;
        if (this.maxHeight) {
            this._container.style.maxHeight = `${this.maxHeight}px`;
        }
        this.element.parentNode.insertBefore(this._container, this.element.nextSibling);
    }

    _createToolbar() {
        this._toolbarEl = document.createElement('div');
        this._toolbarEl.className = 'dm-editor-toolbar';

        this.toolbar.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'dm-editor-toolbar-group';

            group.forEach(action => {
                const button = this._createToolbarButton(action);
                if (button) {
                    groupEl.appendChild(button);
                }
            });

            this._toolbarEl.appendChild(groupEl);
        });

        this._container.appendChild(this._toolbarEl);
    }

    _createToolbarButton(action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `dm-editor-toolbar-btn dm-editor-btn-${action}`;
        button.title = this._getButtonTitle(action);
        button.setAttribute('data-action', action);

        // Use Domma icon system if available
        const iconName = this._getIconName(action);
        if (iconName && window.Domma && window.Domma.icons) {
            const icon = window.Domma.icons.render(iconName, {size: 16});
            if (icon) {
                button.appendChild(icon);
            } else {
                button.innerHTML = this._getFallbackIcon(action);
            }
        } else {
            button.innerHTML = this._getFallbackIcon(action);
        }

        button.addEventListener('click', (e) => {
            e.preventDefault();
            this._executeCommand(action);
        });

        return button;
    }

    _getButtonTitle(action) {
        const titles = {
            bold: 'Bold (Ctrl+B)', italic: 'Italic (Ctrl+I)', underline: 'Underline (Ctrl+U)',
            strikethrough: 'Strikethrough', h1: 'Heading 1', h2: 'Heading 2', h3: 'Heading 3',
            ul: 'Bullet List', ol: 'Numbered List', blockquote: 'Quote',
            link: 'Insert Link', image: 'Insert Image', code: 'Inline Code',
            codeblock: 'Code Block', embed: 'Embed Media', undo: 'Undo (Ctrl+Z)',
            redo: 'Redo (Ctrl+Y)', clear: 'Clear Formatting', format: 'Auto Format'
        };
        return titles[action] || action;
    }

    _getIconName(action) {
        const iconMap = {
            bold: 'bold', italic: 'italic', underline: 'underline',
            strikethrough: 'strikethrough', h1: 'heading-1', h2: 'heading-2', h3: 'heading-3',
            ul: 'list-bullet', ol: 'list-numbered', blockquote: 'quote',
            link: 'link-add', image: 'image-add', code: 'code-inline',
            codeblock: 'code-block', embed: 'embed', undo: 'undo',
            redo: 'redo', clear: 'clear-format', format: 'clear-format'
        };
        return iconMap[action];
    }

    _getFallbackIcon(action) {
        const fallbacks = {
            bold: '<strong>B</strong>', italic: '<em>I</em>', underline: '<u>U</u>',
            strikethrough: '<s>S</s>', h1: 'H1', h2: 'H2', h3: 'H3',
            ul: '•', ol: '1.', blockquote: '"',
            link: '⚓', image: '🖼', code: '</>',
            codeblock: '{ }', embed: '▶', undo: '↶', redo: '↷',
            clear: '✕', format: '✨'
        };
        return fallbacks[action] || action;
    }

    _createEditor() {
        if (this.mode === 'text') {
            this._createTextEditor();
        } else if (this.mode === 'rich') {
            this._createRichEditor();
        } else if (this.mode === 'code') {
            this._createCodeEditor();
        }
    }

    _createTextEditor() {
        const body = document.createElement('div');
        body.className = 'dm-editor-body';

        this._editorEl = document.createElement('textarea');
        this._editorEl.className = 'dm-editor-textarea';
        this._editorEl.placeholder = this.placeholder;

        // Auto-resize
        this._editorEl.style.minHeight = `${this.minHeight}px`;
        this._editorEl.addEventListener('input', () => {
            this._autoResize();
            this._handleChange();
        });

        body.appendChild(this._editorEl);
        this._container.appendChild(body);
    }

    _createRichEditor() {
        const body = document.createElement('div');
        body.className = 'dm-editor-body';

        this._editorEl = document.createElement('div');
        this._editorEl.className = 'dm-editor-content';
        this._editorEl.contentEditable = 'true';
        this._editorEl.setAttribute('data-placeholder', this.placeholder);

        // Handle input
        this._editorEl.addEventListener('input', () => this._handleChange());
        this._editorEl.addEventListener('keydown', (e) => this._handleKeydown(e));

        // Image paste
        if (this.imagePaste) {
            this._editorEl.addEventListener('paste', (e) => this._handlePaste(e));
        }

        body.appendChild(this._editorEl);
        this._container.appendChild(body);
    }

    _createCodeEditor() {
        const wrapper = document.createElement('div');
        wrapper.className = 'dm-editor-code-wrapper';

        // Line numbers
        if (this.lineNumbers) {
            this._lineNumbersEl = document.createElement('div');
            this._lineNumbersEl.className = 'dm-editor-line-numbers';
            wrapper.appendChild(this._lineNumbersEl);
        }

        // Code content
        this._editorEl = document.createElement('textarea');
        this._editorEl.className = 'dm-editor-code-textarea';
        this._editorEl.placeholder = this.placeholder;
        this._editorEl.spellcheck = false;
        this._editorEl.setAttribute('data-language', this.language);

        this._editorEl.addEventListener('input', () => {
            this._updateLineNumbers();
            this._highlightSyntax();
            this._handleChange();
        });

        this._editorEl.addEventListener('scroll', () => {
            if (this._lineNumbersEl) {
                this._lineNumbersEl.scrollTop = this._editorEl.scrollTop;
            }
        });

        this._editorEl.addEventListener('keydown', (e) => this._handleCodeKeydown(e));

        wrapper.appendChild(this._editorEl);
        this._container.appendChild(wrapper);
    }

    _createCounter() {
        // Create footer
        const footer = document.createElement('div');
        footer.className = 'dm-editor-footer';

        // Left side - status info
        const status = document.createElement('div');
        status.className = 'dm-editor-status';

        // Character/word count
        if (this.characterCount || this.wordCount) {
            this._counterEl = document.createElement('div');
            this._counterEl.className = 'dm-editor-count';
            status.appendChild(this._counterEl);
        }

        // Autosave indicator
        if (this.autosave) {
            this._autosaveIndicator = document.createElement('div');
            this._autosaveIndicator.className = 'dm-editor-autosave';
            this._autosaveIndicator.textContent = 'Auto-save enabled';
            status.appendChild(this._autosaveIndicator);
        }

        footer.appendChild(status);

        // Right side - history controls
        const history = document.createElement('div');
        history.className = 'dm-editor-history';

        const undoBtn = document.createElement('button');
        undoBtn.type = 'button';
        undoBtn.className = 'dm-editor-history-btn';
        undoBtn.textContent = 'Undo';
        undoBtn.disabled = true;
        undoBtn.onclick = () => this.undo();
        this._undoBtn = undoBtn;

        const redoBtn = document.createElement('button');
        redoBtn.type = 'button';
        redoBtn.className = 'dm-editor-history-btn';
        redoBtn.textContent = 'Redo';
        redoBtn.disabled = true;
        redoBtn.onclick = () => this.redo();
        this._redoBtn = redoBtn;

        history.appendChild(undoBtn);
        history.appendChild(redoBtn);
        footer.appendChild(history);

        this._container.appendChild(footer);
        this._updateCounter();
    }

    _autoResize() {
        if (this.mode !== 'text') return;
        this._editorEl.style.height = 'auto';
        this._editorEl.style.height = this._editorEl.scrollHeight + 'px';
    }

    _updateLineNumbers() {
        if (!this._lineNumbersEl) return;
        const lines = this._editorEl.value.split('\n').length;
        const lineNumbers = Array.from({length: lines}, (_, i) => i + 1).join('\n');
        this._lineNumbersEl.textContent = lineNumbers;
    }

    _highlightSyntax() {
        // Basic syntax highlighting - could be enhanced
        // For now, just mark it for potential CSS styling
        this._editorEl.setAttribute('data-language', this.language);
    }

    _updateCounter() {
        if (!this._counterEl) return;

        const content = this.getValue();
        const chars = content.length;
        const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;

        let text = '';
        if (this.characterCount) text += `${chars} characters`;
        if (this.characterCount && this.wordCount) text += ' • ';
        if (this.wordCount) text += `${words} words`;

        this._counterEl.textContent = text;
    }

    _handleChange() {
        const content = this.getValue();

        // Update counter
        if (this._counterEl) {
            this._updateCounter();
        }

        // Sync to model
        if (this.model && this.modelKey) {
            this.model.set(this.modelKey, content);
        }

        // Trigger onChange callback
        if (this.onChange) {
            this.onChange(content);
        }

        // Add to history
        this._addToHistory(content);

        // Autosave
        if (this.autosave) {
            this._triggerAutosave();
        }
    }

    _handleKeydown(e) {
        // Handle keyboard shortcuts for rich editor
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    this._executeCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this._executeCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this._executeCommand('underline');
                    break;
                case 'z':
                    e.preventDefault();
                    this.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
            }
        }
    }

    _handleCodeKeydown(e) {
        // Handle Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this._editorEl.selectionStart;
            const end = this._editorEl.selectionEnd;
            const value = this._editorEl.value;

            // Insert 4 spaces
            this._editorEl.value = value.substring(0, start) + '    ' + value.substring(end);
            this._editorEl.selectionStart = this._editorEl.selectionEnd = start + 4;

            this._handleChange();
        }
    }

    _handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        // Check for images
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                this._insertImage(file);
                return;
            }
        }
    }

    async _insertImage(file) {
        let url;

        if (this.imageUpload && typeof this.imageUpload === 'function') {
            // Custom upload handler
            url = await this.imageUpload(file);
        } else if (this.imageMode === 'base64') {
            // Convert to base64
            url = await this._fileToBase64(file);
        } else {
            console.warn('No image upload handler provided');
            return;
        }

        if (url) {
            document.execCommand('insertImage', false, url);

            if (this.onImagePaste) {
                this.onImagePaste(url, file);
            }
        }
    }

    _fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    _executeCommand(action) {
        if (this.mode !== 'rich') return;

        switch (action) {
            case 'bold':
            case 'italic':
            case 'underline':
            case 'strikethrough':
                document.execCommand(action);
                break;
            case 'h1':
            case 'h2':
            case 'h3':
                document.execCommand('formatBlock', false, action);
                break;
            case 'ul':
                document.execCommand('insertUnorderedList');
                break;
            case 'ol':
                document.execCommand('insertOrderedList');
                break;
            case 'blockquote':
                document.execCommand('formatBlock', false, 'blockquote');
                break;
            case 'link':
                this._insertLink();
                break;
            case 'image':
                this._promptImage();
                break;
            case 'code':
                document.execCommand('insertHTML', false, '<code></code>');
                break;
            case 'codeblock':
                this._insertCodeBlock();
                break;
            case 'embed':
                this._insertEmbed();
                break;
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'clear':
                this.clear();
                break;
        }

        this._editorEl.focus();
    }

    _insertLink() {
        const url = prompt('Enter URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    _promptImage() {
        const url = prompt('Enter image URL:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    _insertCodeBlock() {
        const code = prompt('Enter code:');
        if (code) {
            const pre = `<pre><code>${this._escapeHtml(code)}</code></pre>`;
            document.execCommand('insertHTML', false, pre);
        }
    }

    _insertEmbed() {
        const url = prompt('Enter embed URL (YouTube, Twitter, etc.):');
        if (!url) return;

        const embed = this._createEmbed(url);
        if (embed) {
            document.execCommand('insertHTML', false, embed);
        }
    }

    _createEmbed(url) {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (youtubeMatch) {
            return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeMatch[1]}" frameborder="0" allowfullscreen></iframe>`;
        }

        // Twitter
        const twitterMatch = url.match(/twitter\.com\/\w+\/status\/(\d+)/);
        if (twitterMatch) {
            return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`;
        }

        // CodePen
        const codepenMatch = url.match(/codepen\.io\/([^\/]+)\/pen\/([^\/]+)/);
        if (codepenMatch) {
            return `<iframe height="400" style="width: 100%;" src="https://codepen.io/${codepenMatch[1]}/embed/${codepenMatch[2]}" frameborder="0"></iframe>`;
        }

        return `<a href="${url}" target="_blank">${url}</a>`;
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _addToHistory(content) {
        // Remove future history if we're not at the end
        if (this._historyIndex < this._history.length - 1) {
            this._history = this._history.slice(0, this._historyIndex + 1);
        }

        // Add to history
        this._history.push(content);

        // Limit history size
        if (this._history.length > this._maxHistory) {
            this._history.shift();
        } else {
            this._historyIndex++;
        }

        // Update history buttons
        this._updateHistoryButtons();
    }

    _setupAutosave() {
        // Autosave is triggered by _triggerAutosave via debounce
    }

    _triggerAutosave() {
        if (this._autosaveTimer) {
            clearTimeout(this._autosaveTimer);
        }

        // Show saving indicator
        if (this._autosaveIndicator) {
            this._autosaveIndicator.textContent = 'Saving...';
            this._autosaveIndicator.className = 'dm-editor-autosave saving';
        }

        this._autosaveTimer = setTimeout(() => {
            this._saveToStorage();
            if (this.onSave) {
                this.onSave(this.getValue());
            }

            // Show saved indicator
            if (this._autosaveIndicator) {
                this._autosaveIndicator.textContent = 'Saved';
                this._autosaveIndicator.className = 'dm-editor-autosave saved';

                // Reset after 2 seconds
                setTimeout(() => {
                    if (this._autosaveIndicator) {
                        this._autosaveIndicator.textContent = 'Auto-save enabled';
                        this._autosaveIndicator.className = 'dm-editor-autosave';
                    }
                }, 2000);
            }
        }, this.autosaveInterval);
    }

    _saveToStorage() {
        if (!this.storageKey) return;

        const content = this.getValue();
        localStorage.setItem(`domma:editor:${this.storageKey}`, content);
    }

    _loadFromStorage() {
        if (!this.storageKey) return;

        const content = localStorage.getItem(`domma:editor:${this.storageKey}`);
        if (content) {
            this.setValue(content);
        }
    }

    // Public API

    getValue() {
        if (this.mode === 'rich') {
            return this._editorEl.innerHTML;
        } else {
            return this._editorEl.value;
        }
    }

    setValue(content) {
        if (this.mode === 'rich') {
            this._editorEl.innerHTML = content;
        } else {
            this._editorEl.value = content;
        }

        if (this.mode === 'code') {
            this._updateLineNumbers();
            this._highlightSyntax();
        }

        if (this.mode === 'text') {
            this._autoResize();
        }

        this._updateCounter();
        return this;
    }

    getText() {
        if (this.mode === 'rich') {
            return this._editorEl.textContent;
        } else {
            return this._editorEl.value;
        }
    }

    clear() {
        this.setValue('');
        this._history = [];
        this._historyIndex = -1;
        return this;
    }

    focus() {
        this._editorEl.focus();
        return this;
    }

    blur() {
        this._editorEl.blur();
        return this;
    }

    undo() {
        if (this._historyIndex > 0) {
            this._historyIndex--;
            this.setValue(this._history[this._historyIndex]);
            this._updateHistoryButtons();
        }
        return this;
    }

    redo() {
        if (this._historyIndex < this._history.length - 1) {
            this._historyIndex++;
            this.setValue(this._history[this._historyIndex]);
            this._updateHistoryButtons();
        }
        return this;
    }

    _updateHistoryButtons() {
        if (this._undoBtn) {
            this._undoBtn.disabled = this._historyIndex <= 0;
        }
        if (this._redoBtn) {
            this._redoBtn.disabled = this._historyIndex >= this._history.length - 1;
        }
    }

    save() {
        this._saveToStorage();
        if (this.onSave) {
            this.onSave(this.getValue());
        }
        return this;
    }

    setMode(mode) {
        if (mode === this.mode) return this;

        const content = this.getText();
        this.mode = mode;

        // Rebuild editor
        this._container.innerHTML = '';
        this._container.className = `dm-editor dm-editor-${this.mode} dm-theme-${this.theme}`;

        if (this.showToolbar && (this.mode === 'rich' || this.mode === 'code')) {
            this.toolbar = this._getDefaultToolbar();
            this._createToolbar();
        }

        this._createEditor();

        if (this.characterCount || this.wordCount) {
            this._createCounter();
        }

        this.setValue(content);

        return this;
    }

    getMode() {
        return this.mode;
    }

    destroy() {
        if (this._autosaveTimer) {
            clearTimeout(this._autosaveTimer);
        }

        if (this._modelUnsubscribe) {
            this._modelUnsubscribe();
        }

        if (this._container && this._container.parentNode) {
            this._container.parentNode.removeChild(this._container);
        }

        this.element.style.display = '';

        super.destroy();
    }
}

export default Editor;
