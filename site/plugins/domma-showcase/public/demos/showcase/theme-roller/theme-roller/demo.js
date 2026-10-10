/**
 * Theme Roller - from public/showcase/theme-roller.
 */
export function mount(root) {
      // Create Theme Roller
    const roller = E.themeRoller(root.querySelector('#theme-roller-container'), {
        baseTheme: 'charcoal-light',
        baseVariant: null,
        showPresets: true,
        showPreviewPanel: true,
        livePreview: true,
        onChange: (variable, value) => {
          console.log(`Changed: ${variable} = ${value}`);
        }
      });
}
