/**
 * POST Create Resource - from public/showcase/http.
 */
export function mount(root) {
      // Helper to format JSON
    function formatJson(obj) {
        return JSON.stringify(obj, null, 2);
      }
      // POST Demo
    $(root).find('#demo-post').on('click', async () => {
        const output = $(root).find('#post-response');
        const title = $(root).find('#post-title').val();
        const body = $(root).find('#post-body').val();

        output.addClass('loading').text('Creating...');

        try {
          const result = await Domma.http.post('https://jsonplaceholder.typicode.com/posts', {
            title: title,
            body: body,
            userId: 1
          });
          output.removeClass('loading error').text(formatJson(result));
          E.toast('Post created successfully!', {type: 'success'});
        } catch (err) {
          output.removeClass('loading').addClass('error').text('Error: ' + err.message);
        }
      });
}
