/**
 * Single Select - from public/showcase/elements/list-group.
 */
export function mount(root) {
        // --------------------------
        // Section 7: Single Select
        // --------------------------
    const singleLg = E.listGroup(root.querySelector('#single-select-list'), {
          selectable: true,
          onChange: (selected) => {
            const label = selected[0]
              ? selected[0].querySelector('.list-group-item-heading').textContent
              : 'None selected';
            $(root).find('#single-select-output').text(label);
          }
        });
    $(root).find('#single-select-btn').on('click', () => {
          singleLg.select(1); // Select "Analytics" (index 1)
          const sel = singleLg.getSelected();
          const label = sel[0]
            ? sel[0].querySelector('.list-group-item-heading').textContent
            : 'None selected';
          $(root).find('#single-select-output').text(label);
        });
    $(root).find('#single-deselect-btn').on('click', () => {
          singleLg.deselectAll();
          $(root).find('#single-select-output').text('None selected');
        });
}
