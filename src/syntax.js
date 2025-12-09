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

    let html = escapeHtml(code);
    const placeholders = [];
    let index = 0;

    // Sequential replacement: match tokens and replace with placeholders
    for (const {type, pattern} of tokens) {
        html = html.replace(pattern, (match) => {
            const placeholder = `__TOKEN_${index}__`;
            placeholders.push({
                placeholder,
                html: `<span class="syntax-${type}">${match}</span>`
            });
            index++;
            return placeholder;
        });
    }

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
