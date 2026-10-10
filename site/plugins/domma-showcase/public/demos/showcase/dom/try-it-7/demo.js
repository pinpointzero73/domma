/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // DOM manipulation demo
    let itemCount = 2;
    // Every item has the same look, so remove() and Reset treat added items like the originals.
    const item = (text) => `<span class="demo-item badge badge-secondary">${text}</span>`;
    const originalHTML = item('Original 1') + item('Original 2');
    $(root).find('#dom-append').on('click', function () {
            itemCount++;
            $(root).find('#dom-container').append(item(`Appended ${itemCount}`));
        });
    $(root).find('#dom-prepend').on('click', function () {
            itemCount++;
            $(root).find('#dom-container').prepend(item(`Prepended ${itemCount}`));
        });
    $(root).find('#dom-remove').on('click', function () {
            $(root).find('#dom-container .demo-item').last().remove();
        });
    $(root).find('#dom-empty').on('click', function () {
            $(root).find('#dom-container').empty();
        });
    $(root).find('#dom-reset').on('click', function () {
            itemCount = 2;
            $(root).find('#dom-container').html(originalHTML);
        });
}
