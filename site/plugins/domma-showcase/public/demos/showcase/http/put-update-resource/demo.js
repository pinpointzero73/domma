/**
 * PUT Update Resource - from public/showcase/http.
 */
export function mount(root) {
      // Helper to format JSON
    function formatJson(obj) {
        return JSON.stringify(obj, null, 2);
      }
      // PUT Demo
    $(root).find('#demo-put').on('click', async () => {
        const output = $(root).find('#put-response');
        output.addClass('loading').text('Updating...');

        try {
          const result = await Domma.http.put('/api/plugins/domma-showcase/examples/posts/1', {
            id: 1,
            title: 'Updated Title',
            body: 'This post has been updated.',
            userId: 1
          });
          output.removeClass('loading error').text(formatJson(result));
          E.toast('Post updated successfully!', {type: 'success'});
        } catch (err) {
          output.removeClass('loading').addClass('error').text('Error: ' + err.message);
        }
      });
}
