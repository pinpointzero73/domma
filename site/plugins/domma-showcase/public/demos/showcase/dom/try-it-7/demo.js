/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // DOM manipulation demo
    let itemCount = 2;
    const originalHTML = '<span class="demo-item-style">Original 1</span><span class="demo-item-style">Original 2</span>';
    $(root).find('#dom-append').on('click', function () {
            itemCount++;
            $(root).find('#dom-container').append(`<span class="demo-item-style">Appended ${itemCount}</span>`);
        });
    $(root).find('#dom-prepend').on('click', function () {
            itemCount++;
            $(root).find('#dom-container').prepend(`<span class="demo-item-style">Prepended ${itemCount}</span>`);
        });
    $(root).find('#dom-remove').on('click', function () {
            $('#dom-container .demo-item').last().remove();
        });
    $(root).find('#dom-empty').on('click', function () {
            $(root).find('#dom-container').empty();
        });
    $(root).find('#dom-reset').on('click', function () {
            itemCount = 2;
            $(root).find('#dom-container').html(originalHTML);
        });
}
