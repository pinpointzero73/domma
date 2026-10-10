/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // Traversal demo
    $('[data-traverse]').on('click', function () {
            const method = $(this).data('traverse');
            const $target = $(root).find('#traverse-target');
            let $result;
            let description = '';

            switch (method) {
                case 'parent':
                    $result = $target.parent();
                    description = 'parent() - the container div';
                    break;
                case 'siblings':
                    $result = $target.siblings();
                    description = `siblings() - found ${$result.length} siblings`;
                    break;
                case 'next':
                    $result = $target.next();
                    description = 'next() - the next sibling';
                    break;
                case 'prev':
                    $result = $target.prev();
                    description = 'prev() - no previous sibling (target is first)';
                    break;
                case 'first':
                    $result = $('#traverse-container .demo-item').first();
                    description = 'first() - the first .demo-item';
                    break;
                case 'last':
                    $result = $('#traverse-container .demo-item').last();
                    description = 'last() - the last .demo-item';
                    break;
            }

            // Reset colors
            $('#traverse-container .demo-item').addClass('bg-primary').removeClass('bg-warning');
            $(root).find('#traverse-target').addClass('bg-success').removeClass('bg-primary');

            // Highlight result
            if ($result && $result.length) {
                $result.addClass('bg-warning');
            }
            $(root).find('#traverse-result').text(description);
        });
    const colors = ['var(--dm-primary)', 'var(--dm-success)', 'var(--dm-danger)', 'var(--dm-warning)'];
}
