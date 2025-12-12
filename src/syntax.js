/**
 * Domma Syntax Highlighter
 * Lightweight code syntax highlighting for JavaScript, HTML, and CSS
 * Zero dependencies, regex-based tokenization
 */

// Token definitions for supported languages
const LANGUAGES = {
    javascript: [
        {type: 'comment', pattern: /\/\*[\s\S]*?\*\//g},
        {type: 'comment', pattern: /\/\/.*/g},
        {type: 'template-string', pattern: /`(?:\\.|[^`\\])*`/g},
        {type: 'string', pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g},
        {
            type: 'keyword',
            pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|async|await|class|extends|static|new|this|super|import|export|from|as|default|yield|typeof|instanceof|in|of|delete|void)\b/g
        },
        {type: 'boolean', pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g},
        {type: 'number', pattern: /\b\d+\.?\d*([eE][+-]?\d+)?\b/g},
        {type: 'function', pattern: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g},
        {type: 'class-name', pattern: /\b[A-Z][\w$]*\b/g},
        {type: 'operator', pattern: /[+\-*/%=<>!&|^~?:]+|===|!==|==|!=|<=|>=|&&|\|\||<<|>>|>>>/g},
        {type: 'punctuation', pattern: /[{}[\]();,.]/g}
    ],
    html: [
        {type: 'comment', pattern: /<!--[\s\S]*?-->/g},
        {type: 'doctype', pattern: /<!DOCTYPE[^>]*>/gi},
        {type: 'tag-open', pattern: /<\/?[a-zA-Z][\w-]*/g},
        {type: 'tag-close', pattern: /\/?>/g},
        {type: 'attr-name', pattern: /\s+[a-zA-Z:@][\w:.-]*(?=\s*=)/g},
        {type: 'attr-value', pattern: /=\s*"[^"]*"|=\s*'[^']*'/g},
        {type: 'entity', pattern: /&[#\w]+;/g}
    ],
    css: [
        {type: 'comment', pattern: /\/\*[\s\S]*?\*\//g},
        {type: 'at-rule', pattern: /@[\w-]+/g},
        {type: 'selector', pattern: /[.#]?[a-zA-Z][\w-]*(?=\s*[{,])/g},
        {type: 'property', pattern: /\b[\w-]+(?=\s*:)/g},
        {type: 'string', pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g},
        {type: 'function', pattern: /\b[\w-]+(?=\()/g},
        {type: 'important', pattern: /!important\b/g},
        {type: 'number', pattern: /\b\d+\.?\d*(px|em|rem|%|vh|vw|pt|cm|mm|in|pc|ex|ch|vmin|vmax|fr)?\b/g},
        {type: 'color', pattern: /#[\da-fA-F]{3,8}\b/g},
        {type: 'punctuation', pattern: /[{}:;,()]/g}
    ]
};

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

/**
 * Tokenize code using sequential replacement with placeholders
 * @param {string} code - Code to tokenize
 * @param {string} language - Language identifier
 * @returns {string} HTML with highlighted tokens
 */
function tokenize(code, language) {
    const tokens = LANGUAGES[language];
    if (!tokens) {
        return escapeHtml(code);
    }

    // IMPORTANT: Always tokenize RAW code first, then escape within tokens
    // This prevents operators like < > from being escaped before pattern matching
    let html = code;  // Don't escape yet
    const placeholders = [];
    let index = 0;

    // Sequential replacement: match tokens and replace with placeholders
    for (const {type, pattern} of tokens) {
        // Skip entity highlighting for HTML (entities come from escaping, not source)
        if (language === 'html' && type === 'entity') {
            continue;
        }

        html = html.replace(pattern, (match) => {
            const placeholder = `__TOKEN_${index}__`;
            const escapedMatch = escapeHtml(match);  // Always escape the token
            placeholders.push({
                placeholder,
                html: `<span class="syntax-${type}">${escapedMatch}</span>`
            });
            index++;
            return placeholder;
        });
    }

    // Escape remaining non-tokenized content
    html = escapeHtml(html);

    // Replace all placeholders with actual HTML
    for (const {placeholder, html: tokenHtml} of placeholders) {
        html = html.replace(new RegExp(placeholder, 'g'), tokenHtml);
    }

    return html;
}

/**
 * Syntax Highlighter Class
 */
class SyntaxHighlighter {
    constructor() {
        this.config = {
            autoDetect: true,
            preserveOriginal: true,
            selector: '.code-block',
            showLanguageBadge: false,
            languagePrefix: 'language-'
        };
    }

    /**
     * Highlight a single element
     * @param {HTMLElement|string} element - Element or selector to highlight
     * @param {string|null} language - Language to use (null = auto-detect)
     * @returns {boolean} Success status
     */
    highlight(element, language = null) {
        // Get element
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el || el.hasAttribute('data-syntax-highlighted')) {
            return false;
        }

        // Detect language
        if (!language && this.config.autoDetect) {
            const classList = Array.from(el.classList);
            const langClass = classList.find(cls => cls.startsWith(this.config.languagePrefix));
            if (langClass) {
                language = langClass.substring(this.config.languagePrefix.length);
            }
        }

        // Validate language
        if (!language || !LANGUAGES[language]) {
            return false;
        }

        // Get original code
        const code = el.textContent || '';

        // Store original if configured
        if (this.config.preserveOriginal) {
            el.setAttribute('data-original-code', code);
        }

        // Tokenize and highlight
        const highlighted = tokenize(code, language);
        el.innerHTML = highlighted;

        // Mark as highlighted
        el.setAttribute('data-syntax-highlighted', 'true');
        el.setAttribute('data-language', language);

        // Add language badge if configured
        if (this.config.showLanguageBadge) {
            this.addLanguageBadge(el, language);
        }

        return true;
    }

    /**
     * Scan and highlight all code blocks
     * @param {Object} options - Scan options
     * @returns {number} Number of elements highlighted
     */
    scan(options = {}) {
        const selector = options.selector || this.config.selector;
        const elements = document.querySelectorAll(selector);
        let count = 0;

        elements.forEach(el => {
            if (this.highlight(el, options.language || null)) {
                // Add copy button after highlighting
                this.addCopyButton(el);
                count++;
            }
        });

        return count;
    }

    /**
     * Register a custom language
     * @param {string} name - Language name
     * @param {Array} tokens - Token definitions
     */
    register(name, tokens) {
        if (!name || !Array.isArray(tokens)) {
            console.error('SyntaxHighlighter: Invalid language registration');
            return;
        }
        LANGUAGES[name] = tokens;
    }

    /**
     * Configure highlighter
     * @param {Object} options - Configuration options
     * @returns {Object} Current configuration (if no options provided)
     */
    configure(options) {
        if (!options) {
            return {...this.config};
        }
        Object.assign(this.config, options);
        return this.config;
    }

    /**
     * Add language badge to element
     * @param {HTMLElement} element - Target element
     * @param {string} language - Language name
     */
    addLanguageBadge(element, language) {
        // Check if badge already exists
        if (element.querySelector('.syntax-language-badge')) {
            return;
        }

        const badge = document.createElement('div');
        badge.className = 'syntax-language-badge';
        badge.textContent = language.toUpperCase();
        element.style.position = 'relative';
        element.insertBefore(badge, element.firstChild);
    }

    /**
     * Get list of supported languages
     * @returns {string[]} Array of language names
     */
    getLanguages() {
        return Object.keys(LANGUAGES);
    }

    /**
     * Check if language is supported
     * @param {string} language - Language name
     * @returns {boolean} Whether language is supported
     */
    isLanguageSupported(language) {
        return language in LANGUAGES;
    }

    /**
     * Add copy button to code block
     * @param {HTMLElement} element - Code block element
     */
    addCopyButton(element) {
        // Check if already wrapped
        if (element.parentElement && element.parentElement.classList.contains('code-block-wrapper')) {
            return;
        }

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // Create copy button
        const button = document.createElement('button');
        button.className = 'code-block-copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

        // Copy handler
        button.addEventListener('click', async () => {
            const code = element.getAttribute('data-original-code') || element.textContent;

            try {
                // Try modern clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(code);
                } else {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = code;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                // Visual feedback
                button.classList.add('copied');
                button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';

                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        });

        // Wrap element and add button
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        wrapper.appendChild(button);
    }
}

// Create singleton instance
const syntax = new SyntaxHighlighter();

// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            syntax.scan();
        });
    } else {
        // DOM already loaded
        setTimeout(() => syntax.scan(), 0);
    }
}

// Export to Domma namespace if available
if (typeof window !== 'undefined') {
    if (window.Domma) {
        window.Domma.syntax = syntax;
    }
    window.DommaSyntax = syntax;
}

// ES6 export
export default syntax;
export {syntax, SyntaxHighlighter, LANGUAGES};
