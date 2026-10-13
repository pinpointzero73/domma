/**
 * DELETE Delete Resource - from public/showcase/http.
 */
export function mount(root) {
      // Helper to format JSON
    function formatJson(obj) {
        return JSON.stringify(obj, null, 2);
      }
      // DELETE Demo
    $(root).find('#demo-delete').on('click', async () => {
        const output = $(root).find('#delete-response');
        output.addClass('loading').text('Deleting...');

        try {
          const result = await Domma.http.delete('/api/plugins/domma-showcase/examples/posts/1');
          output.removeClass('loading error').text(formatJson(result) + '\n\n// Post deleted successfully');
          E.toast('Post deleted successfully!', {type: 'success'});
        } catch (err) {
          output.removeClass('loading').addClass('error').text('Error: ' + err.message);
        }
      });
}
