/**
 * Multi-Select - from public/showcase/elements/list-group.
 */
export function mount(root) {
        // --------------------------
        // Section 8: Multi-Select
        // --------------------------
    const updateMultiOutput = (selected) => {
          const labels = selected.map(el =>
            el.querySelector('.list-group-item-heading').textContent
          );
          $(root).find('#multi-select-output').text(
            labels.length ? labels.join(', ') : 'None selected'
          );
        };
    const multiLg = E.listGroup(root.querySelector('#multi-select-list'), {
          selectable: true,
          multiSelect: true,
          onChange: updateMultiOutput
        });
    $(root).find('#multi-select-all-btn').on('click', () => {
          multiLg.selectAll();
          updateMultiOutput(multiLg.getSelected());
        });
    $(root).find('#multi-deselect-all-btn').on('click', () => {
          multiLg.deselectAll();
          updateMultiOutput(multiLg.getSelected());
        });
}
