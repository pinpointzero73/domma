/**
 * Bundle Builder Interactive Component
 * Handles module selection, dependency resolution, and bundle generation
 * REFACTORED: Now uses Domma APIs throughout
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

        // Find tier containers using Domma
        const tierContainers = $('.module-tier .grid');
        tiers[1].container = tierContainers.get(0);
        tiers[2].container = tierContainers.get(1);
        tiers[3].container = tierContainers.get(2);

        // Group modules by tier using Domma utils
        _.forEach(this.metadata.modules, (module, key) => {
            tiers[module.tier].modules.push({key, module});
        });

        // Render each tier using Domma utils
        _.forEach(tiers, tier => {
            if (!tier.container) return;

            tier.modules.forEach(({key, module}) => {
                const checkbox = this.createModuleCheckbox(key, module);
                $(tier.container).append(checkbox);
            });
        });
    }

    createModuleCheckbox(key, module) {
        const hasAlias = module.aliases && module.aliases.length > 0;
        const aliasText = hasAlias ? ` (${module.aliases.join(', ')})` : '';

        const html = `
            <div class="module-checkbox${module.dependencies.length > 0 ? ' has-dependencies' : ''}" data-module="${key}">
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
            </div>
        `;

        const $div = $(html);
        $div.find('input').on('change', () => this.handleModuleToggle(key));

        return $div.get(0);
    }

    attachEventListeners() {
        // Preset buttons using Domma
        $('.preset-btn').on('click', (e) => {
            const $btn = $(e.currentTarget);
            const preset = $btn.attr('data-preset');
            this.applyPreset(preset);

            // Visual feedback
            $('.preset-btn').removeClass('active');
            $btn.addClass('active');
        });

        // Reset button using Domma
        $('#reset-selection').on('click', () => {
            this.resetSelection();
        });

        // Download button using Domma
        $('#download-bundle').on('click', () => {
            this.downloadBundle();
        });

        // Instructions toggle using Domma
        $('#view-instructions').on('click', () => {
            this.toggleInstructions();
        });

        // Accordion functionality using Domma
        $('.accordion-header').on('click', (e) => {
            $(e.currentTarget).closest('.accordion-item').toggleClass('active');
        });

        // Copy buttons using Domma
        $('[data-copy]').on('click', async (e) => {
            const targetId = $(e.currentTarget).attr('data-copy');
            const code = $(`#${targetId}`).text();
            if (code) {
                await this.copyToClipboard(code);
            }
        });
    }

    handleModuleToggle(moduleKey) {
        const $checkbox = $(`#module-${moduleKey}`);

        if ($checkbox.prop('checked')) {
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

            const $depCheckbox = $(`#module-${dep}`);
            if ($depCheckbox.length) {
                $depCheckbox.prop('checked', true)
                    .prop('disabled', true)
                    .closest('.module-checkbox').addClass('required');
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
            const $checkbox = $(`#module-${moduleKey}`);
            if ($checkbox.length) {
                $checkbox.prop('disabled', false)
                    .closest('.module-checkbox').removeClass('required');
            }
        }
    }

    applyPreset(presetKey) {
        this.resetSelection();

        const preset = this.metadata.presets[presetKey];
        if (!preset) return;

        preset.modules.forEach(moduleKey => {
            const $checkbox = $(`#module-${moduleKey}`);
            if ($checkbox.length) {
                $checkbox.prop('checked', true);
                this.selectModule(moduleKey);
            }
        });

        this.updateUI();
    }

    resetSelection() {
        this.selectedModules.clear();
        this.requiredModules.clear();

        // Reset all checkboxes using Domma
        $('[id^="module-"]').each(function () {
            $(this).prop('checked', false)
                .prop('disabled', false)
                .closest('.module-checkbox').removeClass('required');
        });

        $('.preset-btn').removeClass('active');

        this.updateUI();
    }

    updateUI() {
        // Update count using Domma
        const count = this.selectedModules.size;
        $('#selected-count').text(`${count} module${count !== 1 ? 's' : ''} selected`);

        // Calculate size using Domma utils
        const totalSize = _.sumBy(Array.from(this.selectedModules), key =>
            this.metadata.modules[key]?.size || 0
        );

        $('#bundle-size').text(`${totalSize} KB`);

        // Enable/disable download button using Domma
        $('#download-bundle').prop('disabled', count === 0);

        // Check if selection matches a preset
        this.checkPresetMatch();
    }

    checkPresetMatch() {
        const selectedArray = Array.from(this.selectedModules).sort();

        _.forEach(this.metadata.presets, (preset, key) => {
            const presetArray = preset.modules.slice().sort();
            const matches = JSON.stringify(selectedArray) === JSON.stringify(presetArray);

            const $btn = $(`[data-preset="${key}"]`);
            if ($btn.length && matches) {
                $btn.addClass('active');
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

        // Show toast notification using Domma
        if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast.info('Custom bundle requires manual build. See instructions below.', {
                position: 'bottom-center',
                duration: 4000
            });
        }
    }

    toggleInstructions(forceShow = false) {
        const $instructions = $('#build-instructions');
        if (!$instructions.length) return;

        if (forceShow) {
            $instructions.show();
        } else {
            $instructions.toggle();
        }

        if ($instructions.is(':visible')) {
            this.generateBuildCode();
            $instructions.get(0).scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }
    }

    generateBuildCode() {
        // Generate entry point code
        const entryPointCode = this.generateEntryPointCode();
        $('#entry-point-code').text(entryPointCode);

        // Generate Rollup config code
        const rollupCode = this.generateRollupCode();
        $('#rollup-config-code').text(rollupCode);
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
            // Use Domma utility if available
            if (typeof Domma !== 'undefined' && Domma.utils && Domma.utils.copyToClipboard) {
                await Domma.utils.copyToClipboard(text);
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                // Fallback to modern clipboard API
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

            // Show success feedback using Domma
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

// Initialize when DOM is ready using Domma
$(() => {
    new BundleBuilder();
});
