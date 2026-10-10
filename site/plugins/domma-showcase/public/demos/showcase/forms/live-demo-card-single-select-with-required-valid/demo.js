/**
 * Live demo - card single-select with required validation - from public/showcase/forms.
 */
export function mount(root) {
            // ===== Chooser Field =====
    let chooserFormInstance = null;
    const chooserOutput = $(root).find('#chooser-output')[0];
    const chooserContainer = $(root).find('#chooser-form-container')[0];
    const cardChooserBlueprint = {
              plan: {
                type: 'chooser',
                variant: 'card',
                columns: 3,
                required: true,
                label: 'Choose your plan',
                options: [
                  { value: 'starter', label: 'Starter', icon: 'rocket',
                    description: 'For solo builders.' },
                  { value: 'pro',     label: 'Pro',     icon: 'zap',
                    description: 'Teams up to 10.', recommended: true,
                    badge: { text: 'POPULAR', type: 'success' } },
                  { value: 'ent',     label: 'Enterprise', icon: 'briefcase',
                    description: 'Custom limits + SSO.' }
                ]
              }
            };
    const chipChooserBlueprint = {
              tags: {
                type: 'chooser',
                variant: 'chip',
                multiple: true,
                label: 'Pick your tags',
                options: [
                  { value: 'js',   label: 'JavaScript', icon: 'code' },
                  { value: 'css',  label: 'CSS',        icon: 'palette' },
                  { value: 'a11y', label: 'A11y',       icon: 'eye' },
                  { value: 'perf', label: 'Performance', icon: 'zap' },
                  { value: 'wasm', label: 'WASM',       icon: 'cpu', disabled: true }
                ]
              }
            };
    const visualChooserBlueprint = {
              plan: {
                type: 'chooser',
                variant: 'card',
                columns: 3,
                required: true,
                label: 'Glow + accent demo',
                accent: '#ec4899',
                accentStyle: 'glow',
                glow: true,
                glowColour: '#ec4899',
                shadow: 'lg',
                options: [
                  { value: 'starter', label: 'Starter', icon: 'rocket',  description: 'For solo builders.' },
                  { value: 'pro',     label: 'Pro',     icon: 'zap',     description: 'Teams up to 10.',
                    recommended: true, badge: { text: 'POPULAR', type: 'success' } },
                  { value: 'ent',     label: 'Enterprise', icon: 'briefcase', description: 'Custom limits + SSO.' }
                ]
              }
            };
    const renderChooser = (blueprint) => {
              chooserContainer.replaceChildren();
              chooserFormInstance = Domma.forms.create(blueprint);
              chooserFormInstance.renderTo('#chooser-form-container');
              chooserOutput.textContent = 'Form rendered. Pick an option, then click "Validate" or "Get values".';
            };
    $(root).find('#chooser-card-generate').on('click', () => renderChooser(cardChooserBlueprint));
    $(root).find('#chooser-chip-generate').on('click', () => renderChooser(chipChooserBlueprint));
    $(root).find('#chooser-visual-generate').on('click', () => renderChooser(visualChooserBlueprint));
    $(root).find('#chooser-validate').on('click', () => {
              if (!chooserFormInstance) {
                chooserOutput.textContent = 'Generate a chooser first.';
                return;
              }
              const ok = chooserFormInstance.validate();
              chooserOutput.textContent = ok
                ? 'Validation passed.'
                : 'Validation failed: ' + JSON.stringify(chooserFormInstance.errors, null, 2);
            });
    $(root).find('#chooser-submit').on('click', () => {
              if (!chooserFormInstance) {
                chooserOutput.textContent = 'Generate a chooser first.';
                return;
              }
              chooserOutput.textContent = JSON.stringify(chooserFormInstance.getData(), null, 2);
            });
    $(root).find('#chooser-clear').on('click', () => {
              chooserContainer.replaceChildren();
              chooserFormInstance = null;
              chooserOutput.textContent = 'Submit or validate to see captured values';
            });
}
