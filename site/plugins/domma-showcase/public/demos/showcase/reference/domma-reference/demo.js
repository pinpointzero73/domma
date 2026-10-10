/**
 * Domma Reference - from public/showcase/reference.
 */
export function mount(root) {
    $('.copy-btn').on('click', function (e) {
        e.preventDefault();
        const text = $(this).data('copy');

        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(this);
          });
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showCopyFeedback(this);
        }
      });
    function showCopyFeedback(button) {
        const $btn = $(button);
        const originalIcon = $btn.find('.icon').attr('data-icon');

        // Change to check icon
        $btn.find('.icon').attr('data-icon', 'check');
        $btn.css('color', 'var(--dm-color-success)');

        // Reset after 2 seconds
        setTimeout(() => {
          $btn.find('.icon').attr('data-icon', originalIcon);
          $btn.css('color', '');
        }, 2000);
      }
      // Enhance hover effects
    $('.reference-card').on('mouseenter', function () {
        $(this).addClass('shadow-lg');
      }).on('mouseleave', function () {
        $(this).removeClass('shadow-lg');
      });
}
