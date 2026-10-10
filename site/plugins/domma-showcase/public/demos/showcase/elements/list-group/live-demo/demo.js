/**
 * Step 3: Live Demo - from public/showcase/elements/list-group.
 */
export function mount(root) {
        // --------------------------
        // Section 9: Tutorial - Settings Panel
        // --------------------------
    const settingsPanels = [
          { title: 'General',       body: 'Manage your language, timezone, and display preferences.' },
          { title: 'Security',      body: 'Update your password and configure two-factor authentication.' },
          { title: 'Notifications', body: 'Choose how and when you receive email, SMS, and push alerts.' },
          { title: 'Privacy',       body: 'Control data sharing, visibility settings, and download your data.' },
        ];
    // The panel shows whichever entry this observable holds (data-bind-text in demo.html)
    const panel = M.observable(settingsPanels[0]);
    const handle = M.applyBindings({panel}, root.querySelector('#tutorial-settings-panel'));
    const tutorialLg = E.listGroup(root.querySelector('#tutorial-settings-nav'), {
          selectable: true,
          onChange: (selected) => {
            if (!selected.length) return;
            const index = tutorialLg.getItems().indexOf(selected[0]);
            const p = settingsPanels[index];
            if (p) panel.value = p;
          }
        });
        // Pre-select General on load
    tutorialLg.select(0);
    return () => {
        handle.dispose();
        tutorialLg?.destroy?.();
    };
}
