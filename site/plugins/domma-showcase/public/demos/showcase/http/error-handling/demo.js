/**
 * Error Handling - from public/showcase/http.
 */
export function mount(root) {
      // Error Demo
    $(root).find('#demo-error').on('click', async () => {
        const output = $(root).find('#error-response');
        output.addClass('loading').text('Requesting invalid resource...');

        try {
          await Domma.http.get('https://jsonplaceholder.typicode.com/posts/99999');
          output.removeClass('loading').text('Unexpected success');
        } catch (err) {
          output.removeClass('loading').addClass('error').text('Caught error:\n' + err.message);
          E.toast('Request failed: ' + err.message, {type: 'error'});
        }
      });
}
