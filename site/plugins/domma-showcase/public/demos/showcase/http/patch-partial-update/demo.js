/**
 * PATCH Partial Update - from public/showcase/http.
 */
export function mount(root) {
      // Helper to format JSON
    function formatJson(obj) {
        return JSON.stringify(obj, null, 2);
      }
      // PATCH Demo
    $(root).find('#demo-patch').on('click', async () => {
        const output = $(root).find('#patch-response');
        const title = $(root).find('#patch-title').val();
        output.addClass('loading').text('Patching...');

        try {
          const result = await Domma.http.patch('https://jsonplaceholder.typicode.com/posts/1', {
            title: title
          });
          output.removeClass('loading error').text(formatJson(result));
          E.toast.success('Post patched successfully! Only title field was updated.');
        } catch (err) {
          output.removeClass('loading').addClass('error').text('Error: ' + err.message);
        }
      });
}
