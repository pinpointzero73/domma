/**
 * Find and Replace Module
 * Provides search and replace functionality for the document editor
 */

export class FindReplace {
  /**
   * Create a new FindReplace instance
   * @param {Object} editor - ProseMirror editor instance
   */
  constructor(editor) {
    this.editor = editor;
    this.panel = null;
    this.matches = [];
    this.currentMatchIndex = -1;
    this.originalHTML = '';
    this.searchTerm = '';
    this.replaceTerm = '';
    this.caseSensitive = false;
    this.wholeWord = false;
    this.useRegex = false;
    this.isVisible = false;
  }

  /**
   * Show the find/replace panel
   */
  show() {
    if (this.isVisible) {
      this.focusSearchInput();
      return;
    }

    // Store original content
    this.originalHTML = this.editor.getHTML();

    // Create panel HTML
    const panelHTML = `
            <div class="find-replace-panel">
                <div class="find-replace-header">
                    <h3>Find and Replace</h3>
                    <button class="btn-close-find" data-tooltip="Close (Esc)">
                        <span data-icon="x" data-icon-size="16"></span>
                    </button>
                </div>

                <div class="find-replace-body">
                    <!-- Find Row -->
                    <div class="find-replace-row">
                        <label>Find:</label>
                        <input type="text" class="find-input" placeholder="Search..." autocomplete="off">
                        <div class="find-controls">
                            <button class="btn-find-prev" data-tooltip="Previous (Shift+Enter)" disabled>
                                <span data-icon="chevron-up" data-icon-size="16"></span>
                            </button>
                            <button class="btn-find-next" data-tooltip="Next (Enter)" disabled>
                                <span data-icon="chevron-down" data-icon-size="16"></span>
                            </button>
                            <span class="match-count">0 of 0</span>
                        </div>
                    </div>

                    <!-- Replace Row -->
                    <div class="find-replace-row">
                        <label>Replace:</label>
                        <input type="text" class="replace-input" placeholder="Replace with..." autocomplete="off">
                        <div class="replace-controls">
                            <button class="btn-replace" data-tooltip="Replace" disabled>Replace</button>
                            <button class="btn-replace-all" data-tooltip="Replace All" disabled>Replace All</button>
                        </div>
                    </div>

                    <!-- Options Row -->
                    <div class="find-replace-row find-options">
                        <label class="option-checkbox">
                            <input type="checkbox" class="option-case-sensitive">
                            <span>Case sensitive</span>
                        </label>
                        <label class="option-checkbox">
                            <input type="checkbox" class="option-whole-word">
                            <span>Whole word</span>
                        </label>
                        <label class="option-checkbox">
                            <input type="checkbox" class="option-regex">
                            <span>Use regex</span>
                        </label>
                    </div>
                </div>
            </div>
        `;

    // Insert panel above editor
    const editorContainer = document.querySelector('.editor-container');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = panelHTML;
    this.panel = tempDiv.firstElementChild;
    editorContainer.insertBefore(this.panel, editorContainer.firstChild);

    // Initialize Domma icons
    if (window.Domma && window.Domma.icons) {
      window.Domma.icons.scan();
    }

    this.isVisible = true;
    this.setupEventListeners();
    this.focusSearchInput();
  }

  /**
   * Hide the find/replace panel
   */
  hide() {
    if (!this.isVisible) return;

    // Clear highlights
    this.clearHighlights();

    // Remove panel
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }

    // Reset state
    this.matches = [];
    this.currentMatchIndex = -1;
    this.searchTerm = '';
    this.isVisible = false;

    // Return focus to editor
    this.editor.commands.focus();
  }

  /**
   * Setup event listeners for the panel
   */
  setupEventListeners() {
    if (!this.panel) return;

    const findInput = this.panel.querySelector('.find-input');
    const replaceInput = this.panel.querySelector('.replace-input');
    const btnClose = this.panel.querySelector('.btn-close-find');
    const btnPrev = this.panel.querySelector('.btn-find-prev');
    const btnNext = this.panel.querySelector('.btn-find-next');
    const btnReplace = this.panel.querySelector('.btn-replace');
    const btnReplaceAll = this.panel.querySelector('.btn-replace-all');
    const optionCase = this.panel.querySelector('.option-case-sensitive');
    const optionWord = this.panel.querySelector('.option-whole-word');
    const optionRegex = this.panel.querySelector('.option-regex');

    // Find input
    findInput.addEventListener('input', () => {
      this.searchTerm = findInput.value;
      this.find();
    });

    findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.prev();
        } else {
          this.next();
        }
      } else if (e.key === 'Escape') {
        this.hide();
      }
    });

    // Replace input
    replaceInput.addEventListener('input', () => {
      this.replaceTerm = replaceInput.value;
    });

    replaceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.replace();
      } else if (e.key === 'Escape') {
        this.hide();
      }
    });

    // Buttons
    btnClose.addEventListener('click', () => this.hide());
    btnPrev.addEventListener('click', () => this.prev());
    btnNext.addEventListener('click', () => this.next());
    btnReplace.addEventListener('click', () => this.replace());
    btnReplaceAll.addEventListener('click', () => this.replaceAll());

    // Options
    optionCase.addEventListener('change', (e) => {
      this.caseSensitive = e.target.checked;
      this.find();
    });

    optionWord.addEventListener('change', (e) => {
      this.wholeWord = e.target.checked;
      this.find();
    });

    optionRegex.addEventListener('change', (e) => {
      this.useRegex = e.target.checked;
      this.find();
    });
  }

  /**
   * Focus the search input
   */
  focusSearchInput() {
    if (this.panel) {
      const findInput = this.panel.querySelector('.find-input');
      if (findInput) {
        findInput.focus();
        findInput.select();
      }
    }
  }

  /**
   * Find all matches in the document
   */
  find() {
    this.clearHighlights();
    this.matches = [];
    this.currentMatchIndex = -1;

    if (!this.searchTerm) {
      this.updateMatchCount();
      this.updateButtonStates();
      return;
    }

    try {
      const regex = this.buildRegex();
      if (!regex) {
        this.updateMatchCount();
        this.updateButtonStates();
        return;
      }

      // Search in editor content
      const content = this.editor.getHTML();
      const matches = this.findMatches(content, regex);

      if (matches.length > 0) {
        this.matches = matches;
        this.currentMatchIndex = 0;
        this.highlightMatches();
      }

      this.updateMatchCount();
      this.updateButtonStates();
    } catch (error) {
      console.error('Find error:', error);
      this.updateMatchCount();
      this.updateButtonStates();
    }
  }

  /**
   * Build regex pattern based on options
   * @returns {RegExp|null}
   */
  buildRegex() {
    if (!this.searchTerm) return null;

    try {
      let pattern = this.searchTerm;

      if (this.useRegex) {
        // User provided regex
        const flags = this.caseSensitive ? 'g' : 'gi';
        return new RegExp(pattern, flags);
      } else {
        // Escape special regex characters
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Whole word option
        if (this.wholeWord) {
          pattern = `\\b${pattern}\\b`;
        }

        const flags = this.caseSensitive ? 'g' : 'gi';
        return new RegExp(pattern, flags);
      }
    } catch (error) {
      console.error('Regex build error:', error);
      return null;
    }
  }

  /**
   * Find all matches in content
   * @param {string} content - HTML content to search
   * @param {RegExp} regex - Search pattern
   * @returns {Array} Array of match objects
   */
  findMatches(content, regex) {
    const matches = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Get text content from editor
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent;
      let match;
      regex.lastIndex = 0; // Reset regex

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          node: node,
          startOffset: match.index,
          endOffset: match.index + match[0].length,
          text: match[0]
        });
      }
    }

    return matches;
  }

  /**
   * Highlight all matches in the editor
   */
  highlightMatches() {
    if (this.matches.length === 0) return;

    // Get current editor content
    const content = this.editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Highlight each match
    this.matches.forEach((match, index) => {
      const isActive = index === this.currentMatchIndex;
      const highlightClass = isActive ? 'find-highlight-active' : 'find-highlight';

      // Create mark element
      const mark = document.createElement('mark');
      mark.className = highlightClass;
      mark.setAttribute('data-find-index', index);

      // Extract text and wrap in mark
      const textNode = match.node;
      const text = textNode.textContent;
      const before = text.substring(0, match.startOffset);
      const matchText = text.substring(match.startOffset, match.endOffset);
      const after = text.substring(match.endOffset);

      mark.textContent = matchText;

      // Replace text node with highlighted version
      const fragment = document.createDocumentFragment();
      if (before) fragment.appendChild(document.createTextNode(before));
      fragment.appendChild(mark);
      if (after) fragment.appendChild(document.createTextNode(after));

      textNode.parentNode.replaceChild(fragment, textNode);
    });

    // Update editor with highlighted content
    this.editor.commands.setContent(tempDiv.innerHTML, false);

    // Scroll active match into view
    this.scrollToActiveMatch();
  }

  /**
   * Clear all highlights from the editor
   */
  clearHighlights() {
    const content = this.editor.getHTML();
    if (!content.includes('find-highlight')) return;

    // Remove all mark elements
    const cleanedContent = content.replace(
      /<mark[^>]*class="find-highlight[^"]*"[^>]*>(.*?)<\/mark>/gi,
      '$1'
    );

    this.editor.commands.setContent(cleanedContent, false);
  }

  /**
   * Go to previous match
   */
  prev() {
    if (this.matches.length === 0) return;

    this.currentMatchIndex--;
    if (this.currentMatchIndex < 0) {
      this.currentMatchIndex = this.matches.length - 1;
    }

    this.highlightMatches();
    this.updateMatchCount();
  }

  /**
   * Go to next match
   */
  next() {
    if (this.matches.length === 0) return;

    this.currentMatchIndex++;
    if (this.currentMatchIndex >= this.matches.length) {
      this.currentMatchIndex = 0;
    }

    this.highlightMatches();
    this.updateMatchCount();
  }

  /**
   * Replace current match
   */
  replace() {
    if (this.matches.length === 0 || this.currentMatchIndex < 0) return;

    const content = this.editor.getHTML();
    const regex = this.buildRegex();
    if (!regex) return;

    // Replace active match only
    let replaced = false;
    let newContent = content.replace(
      /<mark[^>]*class="find-highlight-active"[^>]*>(.*?)<\/mark>/i,
      (match, text) => {
        replaced = true;
        return this.replaceTerm;
      }
    );

    if (replaced) {
      // Clear highlights and update content
      newContent = newContent.replace(
        /<mark[^>]*class="find-highlight[^"]*"[^>]*>(.*?)<\/mark>/gi,
        '$1'
      );

      this.editor.commands.setContent(newContent, false);

      // Re-run find to update matches
      this.find();

      // Move to next match if available
      if (this.matches.length > 0) {
        if (this.currentMatchIndex >= this.matches.length) {
          this.currentMatchIndex = 0;
        }
        this.highlightMatches();
      }
    }
  }

  /**
   * Replace all matches (with confirmation)
   */
  async replaceAll() {
    if (this.matches.length === 0) return;

    const count = this.matches.length;
    const confirmed = await this.confirmReplaceAll(count);

    if (!confirmed) return;

    const content = this.editor.getHTML();
    const regex = this.buildRegex();
    if (!regex) return;

    // Remove all highlights first
    let newContent = content.replace(
      /<mark[^>]*class="find-highlight[^"]*"[^>]*>(.*?)<\/mark>/gi,
      '$1'
    );

    // Replace all matches in plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newContent;

    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const nodesToReplace = [];
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent;
      if (regex.test(text)) {
        regex.lastIndex = 0;
        nodesToReplace.push({
          node: node,
          newText: text.replace(regex, this.replaceTerm)
        });
      }
    }

    // Apply replacements
    nodesToReplace.forEach(item => {
      item.node.textContent = item.newText;
    });

    // Update editor
    this.editor.commands.setContent(tempDiv.innerHTML, false);

    // Clear state
    this.matches = [];
    this.currentMatchIndex = -1;
    this.updateMatchCount();
    this.updateButtonStates();

    // Show success message
    this.showReplaceAllSuccess(count);
  }

  /**
   * Confirm replace all operation
   * @param {number} count - Number of matches
   * @returns {Promise<boolean>}
   */
  async confirmReplaceAll(count) {
    if (window.Domma && window.Domma.elements && window.Domma.elements.confirm) {
      return await window.Domma.elements.confirm(
        `Replace all ${count} occurrence${count !== 1 ? 's' : ''} of "${this.searchTerm}" with "${this.replaceTerm}"?`,
        {title: 'Replace All'}
      );
    }
    return window.confirm(
      `Replace all ${count} occurrence${count !== 1 ? 's' : ''} of "${this.searchTerm}" with "${this.replaceTerm}"?`
    );
  }

  /**
   * Show replace all success message
   * @param {number} count - Number of replacements made
   */
  async showReplaceAllSuccess(count) {
    if (window.Domma && window.Domma.elements && window.Domma.elements.alert) {
      await window.Domma.elements.alert(
        `Replaced ${count} occurrence${count !== 1 ? 's' : ''}.`,
        {title: 'Replace All Complete'}
      );
    }
  }

  /**
   * Update match count display
   */
  updateMatchCount() {
    if (!this.panel) return;

    const matchCount = this.panel.querySelector('.match-count');
    if (matchCount) {
      const total = this.matches.length;
      const current = total > 0 ? this.currentMatchIndex + 1 : 0;
      matchCount.textContent = `${current} of ${total}`;
    }
  }

  /**
   * Update button enabled/disabled states
   */
  updateButtonStates() {
    if (!this.panel) return;

    const hasMatches = this.matches.length > 0;
    const btnPrev = this.panel.querySelector('.btn-find-prev');
    const btnNext = this.panel.querySelector('.btn-find-next');
    const btnReplace = this.panel.querySelector('.btn-replace');
    const btnReplaceAll = this.panel.querySelector('.btn-replace-all');

    if (btnPrev) btnPrev.disabled = !hasMatches;
    if (btnNext) btnNext.disabled = !hasMatches;
    if (btnReplace) btnReplace.disabled = !hasMatches;
    if (btnReplaceAll) btnReplaceAll.disabled = !hasMatches;
  }

  /**
   * Scroll the active match into view
   */
  scrollToActiveMatch() {
    // Find the active highlight mark in the actual DOM
    setTimeout(() => {
      const editorElement = document.querySelector('.ProseMirror');
      if (!editorElement) return;

      const activeMark = editorElement.querySelector('.find-highlight-active');
      if (activeMark) {
        activeMark.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }
}
