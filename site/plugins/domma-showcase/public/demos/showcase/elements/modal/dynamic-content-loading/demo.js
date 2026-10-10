/**
 * Example 4: Dynamic Content Loading - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Dynamic content loading
    $(root).find('#demo-factory-dynamic').on('click', async () => {
          const modal = E.createModal({
            title: 'User Profile',
            content: '<div class="text-center"><p>Loading user data...</p></div>',
            size: 'large'
          });

          modal.open();

          // Simulate async data fetch
          await new Promise(resolve => setTimeout(resolve, 1000));

          const userData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Administrator',
            lastLogin: D().format('DD/MM/YYYY')
          };

          // Update modal content
          const content = `
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <p class="mb-0">${userData.name}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <p class="mb-0">${userData.email}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <p class="mb-0">${userData.role}</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last Login</label>
                        <p class="mb-0">${userData.lastLogin}</p>
                    </div>
                </div>
            `;

          $(modal.element).find('.dm-dialog-body').html(content);
        });
}
