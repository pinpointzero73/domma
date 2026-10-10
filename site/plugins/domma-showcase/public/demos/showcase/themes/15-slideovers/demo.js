/**
 * 15. Slideovers - from public/showcase/themes.
 */
export function mount(root) {
    function openSlideover(position) {
        const id = 'audit-slideover-' + position;
        let host = $('#' + id)[0];
        if (!host) {
          host = document.createElement('div');
          host.id = id;
          document.body.appendChild(host);
        }
        E.slideover('#' + id, {
          position,
          title: 'Slideover - ' + position,
          content: 'This is the slideover panel. Inspect heading colour, body text and the close-button contrast.',
          backdrop: true,
          backdropClose: true
        }).open();
      }
    $(root).find('#slideover-left').on('click', () => openSlideover('left'));
    $(root).find('#slideover-right').on('click', () => openSlideover('right'));
    $(root).find('#slideover-top').on('click', () => openSlideover('top'));
    $(root).find('#slideover-bottom').on('click', () => openSlideover('bottom'));
}
