/**
 * fade-animations - from public/showcase/effects/animations.
 */
export function mount(root) {
        // Make non-infinite animations retriggerable by clicking
    $('.demo-box').not('.animate-infinite').on('click', function () {
          const $box = $(this);
          const classes = $box.attr('class');

          // Remove and re-add animation classes to retrigger
          $box.attr('class', 'demo-box');

          // Use setTimeout to ensure CSS registers the change
          setTimeout(() => {
            $box.attr('class', classes);
          }, 10);
        });
}
