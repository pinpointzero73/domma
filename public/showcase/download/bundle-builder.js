/**
 * Bundle Builder Interactive Component
 * Handles module selection, dependency resolution, and bundle generation
 */

class BundleBuilder {
    constructor() {
        this.metadata = null;
        this.selectedModules = new Set();
        this.requiredModules = new Set();
        this.init();
    }

    async init() {
        // Load bundle metadata
        await this.loadMetadata();

        // Render module checkboxes
        this.renderModules();

        // Attach event listeners
        this.attachEventListeners();

        // Initialize icons if available
        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan();
        }
    }

    async loadMetadata() {
        try {
            const response = await fetch('../../dist/bundle-metadata.json');
            this.metadata = await response.json();
        } catch (error) {
            console.error('Failed to load bundle metadata:', error);
            // Fallback to hardcoded metadata if needed
            this.metadata = {modules: {}, presets: {}};
        }
    }

    renderModules() {
        // Group modules by tier
        const tiers = {
            1: {
                title: 'Core Utilities (No Dependencies)',
                container: null,
                modules: []
            },
            2: {
                title: 'Intermediate Features',
                container: null,
                modules: []
            },
            3: {
                title: 'Advanced Features',
                container: null,
                modules: []
            }
        };

        // Find tier containers
        const tierContainers = document.querySelectorAll('.module-tier .grid');
        tiers[1].container = tierContainers[0];
        tiers[2].container = tierContainers[1];
        tiers[3].container = tierContainers[2];

        // Group modules by tier
        Object.entries(this.metadata.modules).forEach(([key, module]) => {
            tiers[module.tier].modules.push({key, module});
        });

        // Render each tier
        Object.values(tiers).forEach(tier => {
            if (!tier.container) return;

            tier.modules.forEach(({key, module}) => {
                const checkbox = this.createModuleCheckbox(key, module);
                tier.container.appendChild(checkbox);
            });
        });
    }

    createModuleCheckbox(key, module) {
        const div = document.createElement('div');
        div.className = 'module-checkbox';
        div.dataset.module = key;

        if (module.dependencies.length > 0) {
            div.classList.add('has-dependencies');
        }

        const hasAlias = module.aliases && module.aliases.length > 0;
        const aliasText = hasAlias ? ` (${module.aliases.join(', ')})` : '';

        div.innerHTML = `
            <input type="checkbox" id="module-${key}" value="${key}">
            <div class="module-info">
                <div class="module-name">
                    ${module.name}${hasAlias ? `<span class="module-alias">${aliasText}</span>` : ''}
                </div>
                <div class="module-description">${module.description}</div>
                <div class="module-meta">
                    <span class="module-size">~${module.size}KB</span>
                    ${module.dependencies.length > 0
            ? `<span class="module-dependencies">Requires: ${module.dependencies.join(', ')}</span>`
            : '<span class="module-dependencies">No dependencies</span>'}
                </div>
            </div>
        `;

        const checkbox = div.querySelector('input');
        checkbox.addEventListener('change', () => this.handleModuleToggle(key));

        return div;
    }

    attachEventListeners() {
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                this.applyPreset(preset);

                // Visual feedback
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Reset button
        const resetBtn = document.getElementById('reset-selection');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSelection();
            });
        }

        // Download button
        const downloadBtn = document.getElementById('download-bundle');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadBundle();
            });
        }

        // Instructions toggle
        const instructionsBtn = document.getElementById('view-instructions');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => {
                this.toggleInstructions();
            });
        }

        // Accordion functionality
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                item.classList.toggle('active');
            });
        });

        // Copy buttons
        document.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.copy;
                const code = document.getElementById(targetId)?.textContent;
                if (code) {
                    this.copyToClipboard(code);
                }
            });
        });
    }

    handleModuleToggle(moduleKey) {
        const checkbox = document.getElementById(`module-${moduleKey}`);

        if (checkbox.checked) {
            this.selectModule(moduleKey);
        } else {
            this.deselectModule(moduleKey);
        }

        this.updateUI();
    }

    selectModule(moduleKey) {
        this.selectedModules.add(moduleKey);

        // Auto-select dependencies
        const dependencies = this.metadata.modules[moduleKey].dependencies || [];
        dependencies.forEach(dep => {
            this.requiredModules.add(dep);
            this.selectedModules.add(dep);

            const depCheckbox = document.getElementById(`module-${dep}`);
            if (depCheckbox) {
                depCheckbox.checked = true;
                depCheckbox.disabled = true;
                depCheckbox.closest('.module-checkbox').classList.add('required');
            }
        });
    }

    deselectModule(moduleKey) {
        this.selectedModules.delete(moduleKey);

        // Check if this module is required by others
        const stillRequired = Array.from(this.selectedModules).some(selectedKey => {
            return this.metadata.modules[selectedKey].dependencies.includes(moduleKey);
        });

        if (!stillRequired) {
            this.requiredModules.delete(moduleKey);
            const checkbox = document.getElementById(`module-${moduleKey}`);
            if (checkbox) {
                checkbox.disabled = false;
                checkbox.closest('.module-checkbox').classList.remove('required');
            }
        }
    }

    applyPreset(presetKey) {
        this.resetSelection();

        const preset = this.metadata.presets[presetKey];
        if (!preset) return;

        preset.modules.forEach(moduleKey => {
            const checkbox = document.getElementById(`module-${moduleKey}`);
            if (checkbox) {
                checkbox.checked = true;
                this.selectModule(moduleKey);
            }
        });

        this.updateUI();
    }

    resetSelection() {
        this.selectedModules.clear();
        this.requiredModules.clear();

        document.querySelectorAll('[id^="module-"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
            checkbox.closest('.module-checkbox')?.classList.remove('required');
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.updateUI();
    }

    updateUI() {
        // Update count
        const count = this.selectedModules.size;
        const countEl = document.getElementById('selected-count');
        if (countEl) {
            countEl.textContent = `${count} module${count !== 1 ? 's' : ''} selected`;
        }

        // Calculate size
        const totalSize = Array.from(this.selectedModules).reduce((sum, key) => {
            return sum + (this.metadata.modules[key]?.size || 0);
        }, 0);

        const sizeEl = document.getElementById('bundle-size');
        if (sizeEl) {
            sizeEl.textContent = `${totalSize} KB`;
        }

        // Enable/disable download button
        const downloadBtn = document.getElementById('download-bundle');
        if (downloadBtn) {
            downloadBtn.disabled = count === 0;
        }

        // Check if selection matches a preset
        this.checkPresetMatch();
    }

    checkPresetMatch() {
        const selectedArray = Array.from(this.selectedModules).sort();

        Object.entries(this.metadata.presets).forEach(([key, preset]) => {
            const presetArray = preset.modules.slice().sort();
            const matches = JSON.stringify(selectedArray) === JSON.stringify(presetArray);

            const btn = document.querySelector(`[data-preset="${key}"]`);
            if (btn) {
                if (matches) {
                    btn.classList.add('active');
                }
            }
        });
    }

    downloadBundle() {
        // Check if selection matches a preset
        const matchingPreset = this.findMatchingPreset();

        if (matchingPreset) {
            // Download pre-built bundle
            // Note: "full" preset uses the main domma.min.js (not domma-full.min.js)
            const filename = matchingPreset === 'full' ? 'domma.min.js' : `domma-${matchingPreset}.min.js`;
            window.location.href = `../../dist/${filename}`;
        } else {
            // Show build instructions for custom bundle
            this.showCustomBuildInstructions();
        }
    }

    findMatchingPreset() {
        const selectedArray = Array.from(this.selectedModules).sort();

        for (const [key, preset] of Object.entries(this.metadata.presets)) {
            const presetArray = preset.modules.slice().sort();
            if (JSON.stringify(selectedArray) === JSON.stringify(presetArray)) {
                return key;
            }
        }

        return null;
    }

    showCustomBuildInstructions() {
        this.toggleInstructions(true);
        this.generateBuildCode();

        // Show toast notification
        if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast.info('Custom bundle requires manual build. See instructions below.', {
                position: 'bottom-center',
                duration: 4000
            });
        }
    }

    toggleInstructions(forceShow = false) {
        const instructions = document.getElementById('build-instructions');
        if (!instructions) return;

        if (forceShow) {
            instructions.style.display = 'block';
        } else {
            instructions.style.display =
                instructions.style.display === 'none' ? 'block' : 'none';
        }

        if (instructions.style.display === 'block') {
            this.generateBuildCode();
            instructions.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }
    }

    generateBuildCode() {
        // Generate entry point code
        const entryPointCode = this.generateEntryPointCode();
        const entryPointEl = document.getElementById('entry-point-code');
        if (entryPointEl) {
            entryPointEl.textContent = entryPointCode;
        }

        // Generate Rollup config code
        const rollupCode = this.generateRollupCode();
        const rollupEl = document.getElementById('rollup-config-code');
        if (rollupEl) {
            rollupEl.textContent = rollupCode;
        }
    }

    generateEntryPointCode() {
        const imports = [];
        const attachments = [];
        const aliases = [];
        const windowExports = [];
        const aliasNames = [];

        // Module name mapping (same as generate-bundles.js)
        const moduleNameMap = {
            'config': 'configEngine'
        };

        Array.from(this.selectedModules).sort().forEach(key => {
            const module = this.metadata.modules[key];
            const exportName = moduleNameMap[key] || key;

            // Import statement
            if (exportName === key) {
                imports.push(`import {${key}} from '../${key}.js';`);
            } else {
                imports.push(`import {${exportName} as ${key}} from '../${key}.js';`);
            }

            // Attachment to Domma
            attachments.push(`Domma.${key} = ${key};`);

            // Aliases
            if (module.aliases && module.aliases.length > 0) {
                module.aliases.forEach(alias => {
                    aliases.push(`const ${alias} = ${key};`);
                    aliasNames.push(alias);
                    attachments.push(`Domma.${alias} = ${alias};`);
                    windowExports.push(`    window.${alias} = ${alias};`);
                });
            }
        });

        const hasDom = this.selectedModules.has('dom');

        return `// Custom Domma Bundle
${imports.join('\n')}

const Domma = (selector) => ${hasDom ? 'dom(selector)' : 'null'};

Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: 'custom'
};

${attachments.join('\n')}

${aliases.length > 0 ? '\n// Aliases\n' + aliases.join('\n') : ''}

if (typeof window !== 'undefined') {
    window.Domma = Domma;
${windowExports.join('\n')}
}

export default Domma;
export {Domma${aliasNames.length > 0 ? ', ' + aliasNames.join(', ') : ''}};
`;
    }

    generateRollupCode() {
        return `// Add to your rollup.config.js exports array
{
    input: 'src/bundles/custom.js',
    output: [
        {
            file: 'public/dist/domma-custom.min.js',
            format: 'umd',
            name: 'Domma',
            sourcemap: false,
            banner
        },
        {
            file: 'public/dist/domma-custom.esm.js',
            format: 'es',
            sourcemap: false,
            banner
        }
    ],
    plugins: commonPlugins
}`;
    }

    async copyToClipboard(text) {
        try {
            // Try modern clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            // Show success feedback
            if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.toast) {
                Domma.elements.toast.success('Code copied to clipboard!', {
                    position: 'bottom-center',
                    duration: 2000
                });
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.toast) {
                Domma.elements.toast.error('Failed to copy code', {
                    position: 'bottom-center',
                    duration: 2000
                });
            }
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BundleBuilder());
} else {
    new BundleBuilder();
}
