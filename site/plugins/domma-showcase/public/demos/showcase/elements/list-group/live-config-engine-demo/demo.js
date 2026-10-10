/**
 * Live Config Engine Demo - from public/showcase/elements/list-group.
 */
export function mount(root) {
        // --------------------------
        // Section 13: Config Engine
        // --------------------------
    $.setup({
          '#config-engine-list': {
            component: 'listGroup',
            options: {
              selectable: true,
              onChange: (selected) => {
                const label = selected[0]
                  ? selected[0].textContent.trim()
                  : 'No selection';
                $(root).find('#config-engine-output').text(label);
              }
            }
          }
        });
}
