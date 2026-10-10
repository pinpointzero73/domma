/**
 * CRUD Operations (Mock Data) - from public/showcase/forms.
 */
export function mount(root) {
            // Common blueprints for examples
    const userBlueprint = {
              name: {
                type: 'string',
                label: 'Full Name',
                required: true,
                minLength: 2,
                formConfig: {
                  placeholder: 'Enter your full name'
                }
              },
              email: {
                type: 'email',
                label: 'Email Address',
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                formConfig: {
                  placeholder: 'user@example.com'
                }
              },
              age: {
                type: 'number',
                label: 'Age',
                min: 18,
                max: 120,
                formConfig: {
                  helperText: 'Must be between 18 and 120'
                }
              },
              role: {
                type: 'select',
                label: 'Role',
                options: [
                  {value: 'user', label: 'User'},
                  {value: 'moderator', label: 'Moderator'},
                  {value: 'admin', label: 'Administrator'}
                ],
                default: 'user'
              },
              newsletter: {
                type: 'boolean',
                label: 'Subscribe to Newsletter',
                default: false
              }
            };
            // Log function for outputs
    function logToOutput(selector, message) {
              const output = $(selector);
              if (output.length === 0) {
                console.warn('Output element not found:', selector);
                return;
              }
              const timestamp = D().format('HH:mm:ss');
              output.text(output.text() + `[${timestamp}] ${message}\n`);
              if (output[0]) {
                output.scrollTop(output[0].scrollHeight);
              }
            }
            // Mock CRUD Data
    let mockUsers = [
              {id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', age: 28},
              {id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', age: 34},
              {id: 3, name: 'Carol White', email: 'carol@example.com', role: 'moderator', age: 29}
            ];
    let nextId = 4;
            // Mock CRUD Helper (simplified version)
    let crudTable = null;
    function initMockCrud() {
              // Create table
              const columns = [
                {key: 'id', title: 'ID', sortable: true, width: '60px'},
                {key: 'name', title: 'Name', sortable: true},
                {key: 'email', title: 'Email', sortable: true},
                {key: 'role', title: 'Role', sortable: true},
                {key: 'age', title: 'Age', sortable: true},
                {
                  key: 'actions',
                  title: 'Actions',
                  sortable: false,
                  render: (value, row) => `
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary crud-edit-btn" data-id="${row.id}">
                                <span data-icon="edit" data-icon-size="16"></span>
                                Edit
                            </button>
                            <button class="btn btn-outline-danger crud-delete-btn" data-id="${row.id}">
                                <span data-icon="trash" data-icon-size="16"></span>
                                Delete
                            </button>
                        </div>
                    `
                }
              ];

              crudTable = Domma.tables.create('#crud-users-table', {
                data: mockUsers,
                columns,
                pagination: true,
                pageSize: 10,
                striped: true,
                exportPanel: true
              });

              logToOutput('#crud-output', 'CRUD table initialized with ' + mockUsers.length + ' users');
            }
            // CRUD Event Handlers
    $('.crud-add-btn').on('click', () => {
              try {
                const modal = Domma.forms.modal(userBlueprint, {}, {
                  title: 'Add New User',
                  saveText: 'Add User',
                  onSave: async (formData) => {
                    const newUser = {...formData, id: nextId++};
                    mockUsers.push(newUser);
                    if (crudTable) {
                      crudTable.setData([...mockUsers]);
                    }
                    logToOutput('#crud-output', 'User added: ' + JSON.stringify(newUser));
                  }
                });
                modal.open();
              } catch (error) {
                logToOutput('#crud-output', 'Add user error: ' + error.message);
              }
            });
    $('.crud-refresh-btn').on('click', () => {
              if (crudTable) {
                crudTable.setData([...mockUsers]);
                logToOutput('#crud-output', 'Table refreshed');
              }
            });
            // Event delegation for edit/delete buttons
    $(document).on('click', '.crud-edit-btn', function () {
              const userId = parseInt($(this).attr('data-id'));
              const user = mockUsers.find(u => u.id === userId);
              if (user) {
                try {
                  const modal = Domma.forms.modal(userBlueprint, user, {
                    title: `Edit User: ${user.name}`,
                    saveText: 'Update User',
                    onSave: async (formData) => {
                      const index = mockUsers.findIndex(u => u.id === userId);
                      if (index !== -1) {
                        mockUsers[index] = {...mockUsers[index], ...formData};
                        if (crudTable) {
                          crudTable.setData([...mockUsers]);
                        }
                        logToOutput('#crud-output', 'User updated: ' + JSON.stringify(mockUsers[index]));
                      }
                    }
                  });
                  modal.open();
                } catch (error) {
                  logToOutput('#crud-output', 'Edit user error: ' + error.message);
                }
              }
            });
    $(document).on('click', '.crud-delete-btn', async function () {
              const userId = parseInt($(this).attr('data-id'));
              const user = mockUsers.find(u => u.id === userId);
              if (user) {
                const confirmed = await E.confirm(
                  `Delete user "${user.name}"?\n\nThis action cannot be undone.`,
                  {title: 'Confirm Delete', confirmText: 'Delete'}
                );

                if (confirmed) {
                  const index = mockUsers.findIndex(u => u.id === userId);
                  if (index !== -1) {
                    mockUsers.splice(index, 1);
                    if (crudTable) {
                      crudTable.setData([...mockUsers]);
                    }
                    logToOutput('#crud-output', 'User deleted: ' + user.name);
                  }
                }
              }
            });
            // Initialize CRUD on page load
    initMockCrud();
}
