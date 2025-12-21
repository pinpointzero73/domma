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
    wrapper.style.cssText = 'position: relative; display: inline-block;';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dm-editor-toolbar-btn';
    button.setAttribute('data-tooltip', label);
    button.style.position = 'relative';
    button.innerHTML = `
            <span data-icon="palette" data-icon-size="16"></span>
            <span style="position:absolute;bottom:2px;right:2px;width:8px;height:8px;border:1px solid #fff;background:${defaultColor};border-radius:50%;"></span>
        `;

    const input = document.createElement('input');
    input.type = 'color';
    input.value = defaultColor;
    input.style.cssText = 'position:absolute;opacity:0;width:0;height:0;';

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
    group.className = 'dm-editor-toolbar-group';
    group.style.position = 'relative';

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
      dropdown.style.display = 'block';
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        dropdown.style.display = 'none';
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
    dropdown.style.cssText = `
            display: none;
            position: absolute;
            top: calc(100% - 2px);
            left: 0;
            background: white;
            border: 1px solid var(--dm-border-color, #ddd);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            padding-top: 6px;
            min-width: 120px;
        `;

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                padding: 8px 12px;
                border: none;
                background: white;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
            `;
      btn.innerHTML = `<span data-icon="${item.icon}" data-icon-size="14"></span>${item.label}`;

      btn.addEventListener('mouseenter', () => btn.style.background = '#f0f0f0');
      btn.addEventListener('mouseleave', () => btn.style.background = 'white');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.execCommand(item.cmd, false, item.value);
        editor._editorEl.focus();
        dropdown.style.display = 'none';
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
    group.className = 'dm-editor-toolbar-group';
    group.style.position = 'relative';

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
      dropdown.style.display = 'block';
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        dropdown.style.display = 'none';
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
    group.className = 'dm-editor-toolbar-group';
    group.style.position = 'relative';

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
      dropdown.style.display = 'block';
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        dropdown.style.display = 'none';
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
    menu.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 4px 0;
            z-index: 10000;
            display: none;
            min-width: 180px;
        `;

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
        sep.style.cssText = 'height: 1px; background: #e0e0e0; margin: 4px 0;';
        menu.appendChild(sep);
      } else {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = `
                    padding: 8px 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;
        menuItem.innerHTML = `<span data-icon="${item.icon}" data-icon-size="16" style="width:20px;display:inline-flex;align-items:center"></span><span>${item.label}</span>`;

        menuItem.addEventListener('mouseenter', () => menuItem.style.background = '#f0f0f0');
        menuItem.addEventListener('mouseleave', () => menuItem.style.background = 'white');
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
            menu.style.display = 'none';
          } catch (err) {
            console.error('Context menu action failed:', err);
            alert('Action failed: ' + err.message);
            menu.style.display = 'none';
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
      menu.style.display = 'block';
      if (window.Domma && window.Domma.icons) window.Domma.icons.scan();
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        menu.style.display = 'none';
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
