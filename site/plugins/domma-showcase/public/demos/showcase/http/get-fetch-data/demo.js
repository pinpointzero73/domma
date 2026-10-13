/**
 * GET Fetch Data - from public/showcase/http.
 */
export function mount(root) {
      // Helper to format JSON
    function formatJson(obj) {
        return JSON.stringify(obj, null, 2);
      }
      // GET Demo
    $(root).find('#demo-get').on('click', async () => {
        const output = $(root).find('#get-response');
        output.addClass('loading').text('Loading...');

        try {
          const posts = await Domma.http.get('/api/plugins/domma-showcase/examples/posts?_limit=3');
          output.removeClass('loading error').text(formatJson(posts));
        } catch (err) {
          output.removeClass('loading').addClass('error').text('Error: ' + err.message);
        }
      });
}
