/**
 * Features Module
 * Initializes optional page features
 */
export const FeaturesModule = {
    /**
     * Initialize features
     * @param {Array<string>} features - Feature names to enable
     */
    init(features) {
        if (!features || !Array.isArray(features)) return;

        features.forEach(feature => {
            const handler = this.featureHandlers[feature];
            if (handler) {
                try {
                    handler();
                } catch (error) {
                    console.warn(`Feature '${feature}' failed to initialize:`, error);
                }
            }
        });
    },

    featureHandlers: {
        'back-to-top': () => {
            if (typeof Domma !== 'undefined' && Domma.elements?.backToTop) {
                Domma.elements.backToTop(null, {
                    duration: 300,
                    showAfter: window.innerHeight
                });
            }
        },

        'code-copy': () => {
            FeaturesModule.setupCodeCopy();
        },

        'icon-scan': () => {
            if (typeof Domma !== 'undefined' && Domma.icons?.scan) {
                Domma.icons.scan();
            }
        },

        'scroll-spy': () => {
            // Handled by sidebar module
        },

        'build-info': () => {
            FeaturesModule.loadBuildInfo();
        }
    },

    /**
     * Setup code block copy functionality
     */
    setupCodeCopy() {
        const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`;

        const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;

        // Use $ if available, otherwise use document.querySelectorAll
        const $ = typeof window.$ !== 'undefined' ? window.$ :
            (sel) => {
                const els = document.querySelectorAll(sel);
                return {
                    each: (fn) => els.forEach((el, i) => fn.call(el, i)),
                    length: els.length
                };
            };

        // Wrap code blocks
        $('.code-block').each(function () {
            const codeBlock = this;
            if (codeBlock.parentElement?.classList.contains('code-block-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            codeBlock.parentNode.insertBefore(wrapper, codeBlock);
            wrapper.appendChild(codeBlock);

            const btn = document.createElement('button');
            btn.className = 'code-block-copy';
            btn.innerHTML = copyIcon;
            btn.dataset.codeBlock = 'true';
            wrapper.appendChild(btn);
        });

        // Handle copy clicks
        document.addEventListener('click', async function (e) {
            const btn = e.target.closest('.code-block-copy');
            if (!btn) return;

            const wrapper = btn.closest('.code-block-wrapper');
            const codeBlock = wrapper?.querySelector('.code-block');
            if (!codeBlock) return;

            const text = codeBlock.getAttribute('data-original-code') || codeBlock.textContent;

            try {
                // Use Domma's copyToClipboard if available
                if (typeof Domma !== 'undefined' && Domma.utils?.copyToClipboard) {
                    await Domma.utils.copyToClipboard(text);
                } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(text);
                } else {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                btn.classList.add('copied');
                btn.innerHTML = checkIcon;

                // Show toast if available
                if (typeof Domma !== 'undefined' && Domma.elements?.toast) {
                    Domma.elements.toast.success('Code copied!', {
                        position: 'bottom-center',
                        duration: 2000
                    });
                }

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = copyIcon;
                }, 2000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });
    },

    /**
     * Load and display build info
     */
    async loadBuildInfo() {
        try {
            // Detect path depth to find dist/build-info.json
            const path = window.location.pathname;
            const depth = path.split('/').filter(p => p && p !== 'index.html' && p !== 'public').length;
            const distPath = '../'.repeat(depth) + 'dist/build-info.json';

            const response = await fetch(distPath);
            const info = await response.json();

            const els = document.querySelectorAll('[data-build-size]');
            els.forEach(el => {
                el.textContent = info.size || '~250KB';
            });
        } catch (error) {
            // Silently fail in development
        }
    }
};
