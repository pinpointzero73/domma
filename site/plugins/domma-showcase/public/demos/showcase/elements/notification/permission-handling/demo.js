/**
 * Permission Handling - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Request Permission
    $(root).find('#request-permission').on('click', async () => {
            const permission = await Domma.DesktopNotification.requestPermission();
          $(root).find('#permission-status').text(`Permission: ${permission}`);
          $(root).find('#permission-status').attr('class',
            `mt-2 ${permission === 'granted' ? 'text-success' : 'text-danger'}`);
        });
}
