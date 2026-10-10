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
    const tutorialLg = E.listGroup(root.querySelector('#tutorial-settings-nav'), {
          selectable: true,
          onChange: (selected) => {
            if (!selected.length) return;
            const index = tutorialLg.getItems().indexOf(selected[0]);
            const p = settingsPanels[index];
            if (p) {
              $(root).find('#tutorial-settings-panel').html(
                `<h4 class="font-semibold mb-2">${_.escape(p.title)}</h4><p class="text-muted">${_.escape(p.body)}</p>`
              );
            }
          }
        });
        // Pre-select General on load
    tutorialLg.select(0);
}
