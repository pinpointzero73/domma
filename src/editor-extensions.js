/**
 * Domma Editor Extensions
 * Optional enhancements for the Domma editor
 * Apps can opt-in to individual extensions or use them all
 */

const EditorExtensions = {
  /**
   * Available extensions
   */
  registry: {},

  /**
   * Register an extension
   */
  register(name, extension) {
    this.registry[name] = extension;
  },

  /**
   * Apply extensions to an editor instance
   */
  apply(editor, extensionNames = []) {
    if (!editor || !editor._editorEl) {
      console.error('Invalid editor instance');
      return;
    }

    const toolbar = editor._toolbarEl;
    if (!toolbar) {
      console.error('Toolbar not found');
      return;
    }

    extensionNames.forEach(name => {
      const extension = this.registry[name];
      if (extension && typeof extension.install === 'function') {
        try {
          extension.install(editor, toolbar);
          console.log(`Extension "${name}" installed`);
        } catch (err) {
          console.error(`Failed to install extension "${name}":`, err);
        }
      } else {
        console.warn(`Extension "${name}" not found`);
      }
    });
  }
};

/**
 * Color Picker Extension
 * Adds text color and highlight color buttons
 */
EditorExtensions.register('colorPicker', {
  install(editor, toolbar) {
    const group = document.createElement('div');
    group.className = 'dm-editor-toolbar-group';

    // Text color
    const textColorBtn = this.createColorButton('Text Color', '#000000', (color) => {
      document.execCommand('foreColor', false, color);
      editor._editorEl.focus();
    });

    // Highlight color
    const highlightBtn = this.createColorButton('Highlight', '#ffff00', (color) => {
      document.execCommand('hiliteColor', false, color);
      editor._editorEl.focus();
    });

    group.appendChild(textColorBtn);
    group.appendChild(highlightBtn);
    toolbar.appendChild(group);
  },

  createColorButton(label, defaultColor, onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dm-editor-color-picker';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dm-editor-toolbar-btn';
    button.setAttribute('data-tooltip', label);
    button.innerHTML = `
            <span data-icon="palette" data-icon-size="16"></span>
            <span class="dm-editor-color-dot" style="background:${defaultColor};"></span>
        `;

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'dm-editor-color-input';
    input.value = defaultColor;

    button.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
      const color = e.target.value;
      const colorDot = button.querySelectorAll('span')[1];
      if (colorDot) colorDot.style.background = color;
      onChange(color);
    });

    wrapper.appendChild(button);
    wrapper.appendChild(input);
    return wrapper;
  }
});

/**
 * Headings Dropdown Extension
 * Adds H1, H2, H3 dropdown menu
 */
EditorExtensions.register('headings', {
  install(editor, toolbar) {
    const group = document.createElement('div');
    group.className = 'dm-editor-toolbar-group dm-editor-dropdown-group';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dm-editor-toolbar-btn';
    btn.setAttribute('data-tooltip', 'Headings');
    btn.innerHTML = '<span data-icon="type" data-icon-size="16"></span>';

    const dropdown = this.createDropdown(editor, [
      {cmd: 'formatBlock', value: '<h1>', label: 'Heading 1', icon: 'type'},
      {cmd: 'formatBlock', value: '<h2>', label: 'Heading 2', icon: 'type'},
      {cmd: 'formatBlock', value: '<h3>', label: 'Heading 3', icon: 'type'}
    ]);

    let hideTimeout;

    const showDropdown = () => {
      clearTimeout(hideTimeout);
      dropdown.classList.add('show');
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        dropdown.classList.remove('show');
      }, 200);
    };

    group.addEventListener('mouseenter', showDropdown);
    group.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    dropdown.addEventListener('mouseleave', hideDropdown);

    group.appendChild(btn);
    group.appendChild(dropdown);
    toolbar.appendChild(group);
  },

  createDropdown(editor, items) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dm-editor-dropdown';

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dm-editor-dropdown-item';
      btn.innerHTML = `<span data-icon="${item.icon}" data-icon-size="14"></span>${item.label}`;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.execCommand(item.cmd, false, item.value);
        editor._editorEl.focus();
        dropdown.classList.remove('show');
      });

      dropdown.appendChild(btn);
    });

    return dropdown;
  }
});

/**
 * Lists Dropdown Extension
 * Adds bullet and numbered list dropdown
 */
EditorExtensions.register('lists', {
  install(editor, toolbar) {
    const group = document.createElement('div');
    group.className = 'dm-editor-toolbar-group dm-editor-dropdown-group';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dm-editor-toolbar-btn';
    btn.setAttribute('data-tooltip', 'Lists');
    btn.innerHTML = '<span data-icon="list" data-icon-size="16"></span>';

    const dropdown = EditorExtensions.registry.headings.createDropdown(editor, [
      {cmd: 'insertUnorderedList', value: null, label: 'Bullet List', icon: 'list-bullet'},
      {cmd: 'insertOrderedList', value: null, label: 'Numbered List', icon: 'list-numbered'}
    ]);

    let hideTimeout;

    const showDropdown = () => {
      clearTimeout(hideTimeout);
      dropdown.classList.add('show');
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        dropdown.classList.remove('show');
      }, 200);
    };

    group.addEventListener('mouseenter', showDropdown);
    group.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    dropdown.addEventListener('mouseleave', hideDropdown);

    group.appendChild(btn);
    group.appendChild(dropdown);
    toolbar.appendChild(group);
  }
});

/**
 * Alignment Dropdown Extension
 * Adds text alignment options
 */
EditorExtensions.register('alignment', {
  install(editor, toolbar) {
    const group = document.createElement('div');
    group.className = 'dm-editor-toolbar-group dm-editor-dropdown-group';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dm-editor-toolbar-btn';
    btn.setAttribute('data-tooltip', 'Text Alignment');
    btn.innerHTML = '<span data-icon="text-left" data-icon-size="16"></span>';

    const dropdown = EditorExtensions.registry.headings.createDropdown(editor, [
      {cmd: 'justifyLeft', value: null, label: 'Align Left', icon: 'text-left'},
      {cmd: 'justifyCenter', value: null, label: 'Align Centre', icon: 'text-center'},
      {cmd: 'justifyRight', value: null, label: 'Align Right', icon: 'text-right'},
      {cmd: 'justifyFull', value: null, label: 'Justify', icon: 'list'}
    ]);

    let hideTimeout;

    const showDropdown = () => {
      clearTimeout(hideTimeout);
      dropdown.classList.add('show');
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        dropdown.classList.remove('show');
      }, 200);
    };

    group.addEventListener('mouseenter', showDropdown);
    group.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    dropdown.addEventListener('mouseleave', hideDropdown);

    group.appendChild(btn);
    group.appendChild(dropdown);
    toolbar.appendChild(group);
  }
});

/**
 * Table Extension
 * Adds table insertion button
 */
EditorExtensions.register('table', {
  install(editor, toolbar) {
    const group = document.createElement('div');
    group.className = 'dm-editor-toolbar-group';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dm-editor-toolbar-btn';
    btn.setAttribute('data-tooltip', 'Insert Table');
    btn.innerHTML = '<span data-icon="grid" data-icon-size="16"></span>';

    btn.addEventListener('click', () => {
      const rows = prompt('Number of rows:', '3');
      const cols = prompt('Number of columns:', '3');

      if (rows && cols) {
        const table = this.createTable(parseInt(rows), parseInt(cols));
        document.execCommand('insertHTML', false, table);
        editor._editorEl.focus();
      }
    });

    group.appendChild(btn);
    toolbar.appendChild(group);
  },

  createTable(rows, cols) {
    let html = '<table border="1" style="border-collapse:collapse;width:100%;margin:1rem 0;"><tbody>';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html += '<td style="border:1px solid #ddd;padding:8px;min-width:100px;">&nbsp;</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }
});

/**
 * Divider Extension
 * Adds horizontal rule insertion
 */
EditorExtensions.register('divider', {
  install(editor, toolbar) {
    const group = document.createElement('div');
    group.className = 'dm-editor-toolbar-group';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dm-editor-toolbar-btn';
    btn.setAttribute('data-tooltip', 'Insert Divider');
    btn.innerHTML = '<span data-icon="minus" data-icon-size="16"></span>';

    btn.addEventListener('click', () => {
      document.execCommand('insertHTML', false, '<hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">');
      editor._editorEl.focus();
    });

    group.appendChild(btn);
    toolbar.appendChild(group);
  }
});

/**
 * Context Menu Extension
 * Adds right-click context menu
 */
EditorExtensions.register('contextMenu', {
  install(editor, toolbar) {
    const editorEl = editor._editorEl;
    if (!editorEl) {
      console.error('contextMenu: No editorEl found');
      return;
    }

    let savedSelection = null;

    // Save current selection
    const saveSelection = () => {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        savedSelection = sel.getRangeAt(0).cloneRange();
      }
    };

    // Restore saved selection
    const restoreSelection = () => {
      if (savedSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    };

    const menu = document.createElement('div');
    menu.className = 'dm-editor-context-menu';

    const menuItems = [
      {
        label: 'Cut',
        action: async () => {
          document.execCommand('cut');
        },
        icon: 'copy'
      },
      {
        label: 'Copy',
        action: async () => {
          document.execCommand('copy');
        },
        icon: 'copy'
      },
      {
        label: 'Paste',
        action: async () => {
          try {
            const text = await navigator.clipboard.readText();
            document.execCommand('insertText', false, text);
          } catch (err) {
            // Fallback to execCommand
            document.execCommand('paste');
          }
        },
        icon: 'clipboard'
      },
      {type: 'separator'},
      {label: 'Bold', cmd: 'bold', icon: 'bold'},
      {label: 'Italic', cmd: 'italic', icon: 'italic'},
      {label: 'Underline', cmd: 'underline', icon: 'underline'},
      {type: 'separator'},
      {
        label: 'Insert Link',
        action: () => {
          const url = prompt('Enter URL:');
          if (url) {
            document.execCommand('createLink', false, url);
          }
        },
        icon: 'link-add'
      },
      {
        label: 'Insert Image',
        action: () => {
          const url = prompt('Enter image URL:');
          if (url) {
            document.execCommand('insertImage', false, url);
          }
        },
        icon: 'image-add'
      },
      {
        label: 'Insert Divider',
        action: () => {
          document.execCommand('insertHTML', false, '<hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">');
        },
        icon: 'minus'
      }
    ];

    menuItems.forEach(item => {
      if (item.type === 'separator') {
        const sep = document.createElement('div');
        sep.className = 'dm-editor-context-separator';
        menu.appendChild(sep);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'dm-editor-context-item';
        menuItem.innerHTML = `<span class="dm-editor-context-icon" data-icon="${item.icon}" data-icon-size="16"></span><span>${item.label}</span>`;
        menuItem.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          try {
            // Restore selection before executing command
            restoreSelection();
            editorEl.focus();

            // Execute command
            if (item.cmd) {
              document.execCommand(item.cmd, false, null);

              // Trigger input event to update editor state
              const inputEvent = new Event('input', {bubbles: true, cancelable: true});
              editorEl.dispatchEvent(inputEvent);
            } else if (item.action) {
              await item.action();

              // Trigger input event to update editor state
              const inputEvent = new Event('input', {bubbles: true, cancelable: true});
              editorEl.dispatchEvent(inputEvent);
            }

            // Focus editor and hide menu AFTER execution
            editorEl.focus();
            menu.classList.remove('show');
          } catch (err) {
            console.error('Context menu action failed:', err);
            alert('Action failed: ' + err.message);
            menu.classList.remove('show');
          }
        });

        menu.appendChild(menuItem);
      }
    });

    document.body.appendChild(menu);

    editorEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      // Save the current selection before showing menu
      saveSelection();

      menu.style.left = e.pageX + 'px';
      menu.style.top = e.pageY + 'px';
      menu.classList.add('show');
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  }
});

/**
 * Image Resize Extension
 * Adds click-to-resize for pasted images
 */
EditorExtensions.register('imageResize', {
  install(editor, toolbar) {
    const editorEl = editor._editorEl;
    if (!editorEl) return;

    const observer = new MutationObserver(() => {
      this.makeImagesResizable(editorEl);
    });

    observer.observe(editorEl, {
      childList: true,
      subtree: true
    });

    this.makeImagesResizable(editorEl);
  },

  makeImagesResizable(container) {
    const images = container.querySelectorAll('img:not([data-resizable])');
    images.forEach(img => {
      img.setAttribute('data-resizable', 'true');
      img.style.maxWidth = '100%';
      img.style.cursor = 'pointer';

      img.addEventListener('click', (e) => {
        e.preventDefault();
        const newWidth = prompt('Enter image width (in pixels or %):', img.width);
        if (newWidth) {
          img.style.width = newWidth.includes('%') ? newWidth : parseInt(newWidth) + 'px';
          img.style.height = 'auto';
        }
      });
    });
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EditorExtensions;
}

// Global export
if (typeof window !== 'undefined') {
  window.Domma = window.Domma || {};
  window.Domma.EditorExtensions = EditorExtensions;
}
