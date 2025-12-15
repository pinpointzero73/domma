/**
 * Domma Print-to-PDF Tool
 * Minimal, zero-dependency print-to-PDF tool using browser native window.print() API
 * Part of the Domma Tools bundle
 */

import Component from './component.js';

class PrintToPDF extends Component {
    constructor(selector, options = {}) {
        const defaults = {
            // Page setup
            pageSize: 'A4',              // 'A4', 'Letter', 'Legal', or {width, height} in mm
            orientation: 'portrait',      // 'portrait' or 'landscape'
            margins: 'normal',            // 'none', 'narrow', 'normal', 'wide', or {top, right, bottom, left} in mm

            // Content options
            title: null,                  // Document title for print
            removeBackgrounds: false,     // Strip background colors/images
            optimizeImages: true,         // Ensure images fit page width

            // Headers/Footers
            header: null,                 // String or function returning HTML
            footer: null,                 // String or function returning HTML
            showPageNumbers: false,       // Add page numbers to footer

            // Behavior
            preview: false,               // Show preview before print (default false for simplicity)
            hideElements: [],             // Array of selectors of elements to hide
            pageBreaks: 'auto',           // 'auto', 'avoid', or custom rules

            // Callbacks
            onBeforePrint: null,          // Called before print dialog
            onAfterPrint: null,           // Called after print/cancel
            onPreview: null               // Called when preview shown
        };

        super(selector, {...defaults, ...options});

        // Internal state
        this._styleElement = null;
        this._boundBeforePrint = null;
        this._boundAfterPrint = null;
        this._hiddenElements = [];

        this._init();
    }

    /**
     * Initialise the print tool
     */
    _init() {
        if (!this.element) {
            console.error('PrintToPDF: Element not found');
            return;
        }

        // Setup print event listeners
        this._boundBeforePrint = this._handleBeforePrint.bind(this);
        this._boundAfterPrint = this._handleAfterPrint.bind(this);
    }

    /**
     * Generate print CSS based on options
     * @returns {string} CSS string
     */
    _generatePrintCSS() {
        const {pageSize, orientation, margins, removeBackgrounds, optimizeImages, pageBreaks} = this.options;

        // Page size dimensions in mm
        const pageSizes = {
            'A4': {width: 210, height: 297},
            'Letter': {width: 215.9, height: 279.4},
            'Legal': {width: 215.9, height: 355.6}
        };

        // Margin presets in mm
        const marginPresets = {
            'none': 0,
            'narrow': 12.7,
            'normal': 20,
            'wide': 25.4
        };

        // Get page size
        let size = '';
        if (typeof pageSize === 'string' && pageSizes[pageSize]) {
            const dims = pageSizes[pageSize];
            size = `${dims.width}mm ${dims.height}mm`;
        } else if (typeof pageSize === 'object' && pageSize.width && pageSize.height) {
            size = `${pageSize.width}mm ${pageSize.height}mm`;
        } else {
            size = 'A4'; // Default
        }

        // Get margins
        let margin = '';
        if (typeof margins === 'string' && marginPresets[margins] !== undefined) {
            margin = `${marginPresets[margins]}mm`;
        } else if (typeof margins === 'object') {
            margin = `${margins.top || 20}mm ${margins.right || 20}mm ${margins.bottom || 20}mm ${margins.left || 20}mm`;
        } else {
            margin = '20mm'; // Default
        }

        // Build CSS
        let css = `
@media print {
    @page {
        size: ${size} ${orientation};
        margin: ${margin};
    }

    /* Hide non-printable elements */
    .no-print,
    .dm-modal,
    .dm-toast-container,
    .dm-loader-overlay {
        display: none !important;
    }

    /* Optimize body */
    body {
        ${removeBackgrounds ? 'background: white !important;' : ''}
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    /* Table optimizations */
    table {
        page-break-inside: ${pageBreaks === 'avoid' ? 'avoid' : 'auto'};
        border-collapse: collapse;
    }

    thead {
        display: table-header-group;
    }

    tfoot {
        display: table-footer-group;
    }

    tr {
        page-break-inside: avoid;
    }

    /* Image optimizations */
    ${optimizeImages ? `
    img {
        max-width: 100% !important;
        page-break-inside: avoid;
    }
    ` : ''}

    /* Page break helpers */
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
    }

    .page-break-before {
        page-break-before: always;
    }

    .page-break-after {
        page-break-after: always;
    }

    .page-break-avoid {
        page-break-inside: avoid;
    }

    /* Code blocks */
    pre, code {
        page-break-inside: avoid;
    }

    /* Remove backgrounds if requested */
    ${removeBackgrounds ? `
    * {
        background: transparent !important;
        background-image: none !important;
    }

    body {
        background: white !important;
    }
    ` : ''}
}
`;

        return css;
    }

    /**
     * Inject print styles into document
     */
    _injectPrintStyles() {
        if (this._styleElement) {
            return; // Already injected
        }

        const css = this._generatePrintCSS();
        this._styleElement = document.createElement('style');
        this._styleElement.setAttribute('data-domma-print-styles', 'true');
        this._styleElement.textContent = css;
        document.head.appendChild(this._styleElement);
    }

    /**
     * Remove injected print styles
     */
    _removePrintStyles() {
        if (this._styleElement && this._styleElement.parentNode) {
            this._styleElement.parentNode.removeChild(this._styleElement);
            this._styleElement = null;
        }
    }

    /**
     * Hide elements specified in hideElements option
     */
    _hideElements() {
        const {hideElements} = this.options;
        if (!hideElements || hideElements.length === 0) return;

        hideElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    this._hiddenElements.push({
                        element: el,
                        originalDisplay: el.style.display
                    });
                    el.style.display = 'none';
                }
            });
        });
    }

    /**
     * Restore hidden elements
     */
    _restoreElements() {
        this._hiddenElements.forEach(({element, originalDisplay}) => {
            element.style.display = originalDisplay;
        });
        this._hiddenElements = [];
    }

    /**
     * Handle beforeprint event
     */
    _handleBeforePrint() {
        // Hide specified elements
        this._hideElements();

        // Call user callback
        if (typeof this.options.onBeforePrint === 'function') {
            this.options.onBeforePrint();
        }
    }

    /**
     * Handle afterprint event
     */
    _handleAfterPrint() {
        // Restore hidden elements
        this._restoreElements();

        // Remove print styles
        this._removePrintStyles();

        // Remove event listeners
        window.removeEventListener('beforeprint', this._boundBeforePrint);
        window.removeEventListener('afterprint', this._boundAfterPrint);

        // Call user callback
        if (typeof this.options.onAfterPrint === 'function') {
            this.options.onAfterPrint();
        }
    }


    /**
     * Show print preview modal
     * Note: Preview feature removed due to modal interaction complexity.
     * Users can configure options when creating the instance, then call print().
     */
    preview() {
      console.warn('PrintToPDF: preview() is not implemented. Configure options and call print() directly.');
      // Fallback to direct print
        this.print();
    }

    /**
     * Trigger print dialog
     */
    print() {
        if (!this.element) {
            console.error('PrintToPDF: No element to print');
            return;
        }

        // Set document title if provided
        const originalTitle = document.title;
        if (this.options.title) {
            document.title = this.options.title;
        }

        // Inject print styles
        this._injectPrintStyles();

        // Add event listeners
        window.addEventListener('beforeprint', this._boundBeforePrint);
        window.addEventListener('afterprint', this._boundAfterPrint);

        // Trigger print
        window.print();

        // Restore title
        if (this.options.title) {
            document.title = originalTitle;
        }
    }

    /**
     * Cleanup and destroy instance
     */
    destroy() {
        this._removePrintStyles();
        this._restoreElements();

        if (this._previewContainer && this._previewContainer.parentNode) {
            this._previewContainer.parentNode.removeChild(this._previewContainer);
            this._previewContainer = null;
        }

        // Remove event listeners if still attached
        if (this._boundBeforePrint) {
            window.removeEventListener('beforeprint', this._boundBeforePrint);
        }
        if (this._boundAfterPrint) {
            window.removeEventListener('afterprint', this._boundAfterPrint);
        }

        super.destroy();
    }
}

export default PrintToPDF;
