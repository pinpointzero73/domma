/**
 * Represents the data structure for storing contacts and their associated groups.
 *
 * @typedef {Object} ContactsData
 * @property {Array<Object>} contacts - An array of contact objects, each representing a contact entry.
 * @property {Array<Object>} groups - An array of group objects, each representing a group that can contain multiple contacts.
 */
const contactsData = M.create({
    contacts: {
        type: M.types.array,
        default: []
    },
    groups: {
        type: M.types.array,
        default: []
    }
}, {
    contacts: [],
    groups: []
}, {
    persist: 'domma-contacts-app'
});

let contactsTable = null;
let groupsDropdown = null;
let selectedGroups = [];
let currentEditId = null;

// Initialise the application
/**
 * Initializes the application by loading persisted data, scanning for icons,
 * setting up tooltips, initializing groups and contacts tables, and updating statistics.
 *
 * @return {void}
 */
function initApp() {
    // Load persisted data
    contactsData.load();

    // Scan for icons
    Domma.icons.scan();

    // Setup tooltips for all elements with data-tooltip
    $('[data-tooltip]').each(function () {
        Domma.elements.tooltip(this, {
            content: $(this).attr('data-tooltip'),
            position: 'top'
        });
    });

    // Initialise groups dropdown
    initGroupsDropdown();
    renderGroupsList();

    // Initialise contacts table
    initTable();

    // Setup event listeners using Config Engine
    $.setup({
        '#add-contact-btn': {
            events: {
                click: () => {
                    currentEditId = null;
                    $('#form-title').text('Add Contact');
                    $('#save-btn-text').text('Save Contact');
                    resetForm();
                }
            }
        },
        '#save-contact-btn': {
            events: {
                click: saveContact
            }
        },
        '#cancel-btn': {
            events: {
                click: resetForm
            }
        },
        '#delete-selected-btn': {
            events: {
                click: deleteSelected
            }
        },
        '#export-btn': {
            events: {
                click: exportContacts
            }
        },
        '#add-group-btn': {
            events: {
                click: addGroup
            }
        },
        '#group-name-input': {
            events: {
                keypress: (e) => {
                    if (e.key === 'Enter') {
                        addGroup();
                    }
                }
            }
        },
        '#search-input': {
            events: {
                input: _.debounce(function () {
                    const query = $(this).val().toLowerCase();
                    filterContacts(query);
                }, 300)
            }
        },
        '#contact-name, #contact-email': {
            events: {
                'blur input': function () {
                    validateField($(this));
                    updateSaveButtonState();
                }
            }
        }
    });

    // Update stats
    updateStats();
}

/**
 * Initialises the groups dropdown menu.
 *
 * This function retrieves group data from `contactsData`, maps it to a format suitable for the dropdown,
 * destroys any existing groups dropdown, creates a new one using Domma's dropdown functionality, and updates
 * the display of selected groups.
 *
 * @return {void}
 */
function initGroupsDropdown() {
    const groups = contactsData.get('groups');
    const items = groups.map(group => ({
        text: group,
        value: group,
        class: selectedGroups.includes(group) ? 'dm-selected' : ''
    }));

    if (groupsDropdown) {
        groupsDropdown.destroy();
    }

    groupsDropdown = Domma.elements.dropdown('#contact-groups-btn', {
        items: items,
        trigger: 'click',
        position: 'bottom-start',
        onSelect: (item) => {
            toggleGroupSelection(item.value);
        }
    });

    updateGroupsDisplay();
}

/**
 * Toggles the selection of a group.
 *
 * @param {string} group - The name of the group to toggle.
 * @return {void}
 */
function toggleGroupSelection(group) {
    const index = selectedGroups.indexOf(group);
    if (index === -1) {
        selectedGroups.push(group);
    } else {
        selectedGroups.splice(index, 1);
    }
    updateGroupsDisplay();
    $('#contact-groups').val(selectedGroups.join(','));
}

/**
 * Updates the display of selected groups.
 *
 * This function checks if there are any selected groups. If none are selected,
 * it sets the text of the element with the ID 'contact-groups-display' to 'Select groups...'.
 * Otherwise, it updates the HTML content of the same element to show each selected group
 * as a badge within a span tag.
 *
 * @return {void}
 */
function updateGroupsDisplay() {
    const $display = $('#contact-groups-display');
    if (selectedGroups.length === 0) {
        $display.text('Select groups...');
    } else {
        $display.html(selectedGroups.map(g => `<span class="group-badge">${g}</span>`).join(' '));
    }
}

/**
 * Initialises the contacts table with data and event handling.
 *
 * @return {void} This method does not return any value.
 */
function initTable() {
    const contacts = contactsData.get('contacts');

    contactsTable = Domma.tables.create('#contacts-table-container', {
        data: contacts,
        columns: [
            {
                key: 'name',
                title: 'Name',
                sortable: true
            },
            {
                key: 'email',
                title: 'Email',
                sortable: true
            },
            {
                key: 'phone',
                title: 'Phone',
                sortable: true,
                render: (value) => value || '-'
            },
            {
                key: 'groups',
                title: 'Groups',
                sortable: false,
                render: (value) => {
                    if (!value || value.length === 0) return '-';
                    return value.map(g => `<span class="group-badge">${g}</span>`).join(' ');
                }
            },
            {
                key: 'createdAt',
                title: 'Created',
                sortable: true,
                render: (value) => {
                    return D(value).format('MMM DD, YYYY HH:mm');
                }
            },
            {
                key: 'actions',
                title: 'Actions',
                sortable: false,
                render: (value, row) => {
                    return `
                        <div class="contact-actions">
                            <button class="btn btn-sm btn-outline edit-contact" data-icon="edit" ${row.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-contact" data-id="${row.id}">Delete</button>
                        </div>
                    `;
                }
            }
        ],
        selectable: true,
        selectionMode: 'multiple',
        pagination: true,
        pageSize: 10,
        evenRowColor: 'none',
        oddRowColor: 'lighter',
        hoverColor: 'light'
    });

    // Handle table events
    contactsTable.on('selectionChange', (selectedRows) => {
        const count = selectedRows.length;
        $('#selected-count').text(count);
        $('#delete-selected-btn').prop('disabled', count === 0);
    });

    // Bind edit/delete buttons
    $('#contacts-table-container').on('click', '.edit-contact', function () {
        const id = $(this).attr('data-id');
        editContact(id);
    });

    $('#contacts-table-container').on('click', '.delete-contact', function () {
        const id = $(this).attr('data-id');
        deleteContact(id);
    });
}

/**
 * Sets up event listeners for various buttons and inputs in the application.
 *
 * This method attaches click event listeners to buttons for adding contacts,
 * saving contacts, canceling operations, deleting selected items, exporting
 * contacts, and adding groups. It also sets up an input event listener with
 * debounce for search functionality and blur/input event listeners for form
 * validation.
 *
 * @return {void}
 */

/**
 * Updates the state of the save button based on the validity of the contact name and email inputs.
 *
 * @return {void} This function does not return a value. It updates the disabled property of the save button element.
 */
function updateSaveButtonState() {
    const nameValid = $('#contact-name').val().trim().length >= 2;
    const emailValid = $('#contact-email').val().trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    $('#save-contact-btn').prop('disabled', !(nameValid && emailValid));
}

/**
 * Validates the input field based on its id and updates the form group's classes and error messages accordingly.
 *
 * @param {Domma} $field - The jQuery object representing the input field to validate.
 * @return {boolean} Returns true if the field is valid, false otherwise.
 */
function validateField($field) {
    const id = $field.attr('id');
    const value = $field.val().trim();
    const $group = $field.closest('.form-group');
    const $error = $group.find('.form-text');

    $group.removeClass('has-error has-success');
    $error.text('');

    if (id === 'contact-name') {
        if (value.length < 2) {
            $group.addClass('has-error');
            $error.text('Name must be at least 2 characters');
            return false;
        }
        $group.addClass('has-success');
        return true;
    }

    if (id === 'contact-email') {
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            $group.addClass('has-error');
            $error.text('Please enter a valid email address');
            return false;
        }
        $group.addClass('has-success');
        return true;
    }

    return true;
}

/**
 * Saves a contact to the contacts list.
 * Validates required fields before saving. Shows a loader during the save operation.
 * Updates the existing contact if currentEditId is set, otherwise adds a new contact.
 * Notifies user of success or validation errors via toast messages.
 *
 * @return {void}
 */
function saveContact() {
    // Validate required fields
    const $name = $('#contact-name');
    const $email = $('#contact-email');

    const nameValid = validateField($name);
    const emailValid = validateField($email);

    if (!nameValid || !emailValid) {
        Domma.elements.toast('Please fix validation errors', {type: 'error'});
        return;
    }

    // Show loader
    const loader = Domma.elements.loader('.card-body', {
        type: 'spinner',
        overlay: true,
        text: 'Saving contact...'
    });
    loader.show();

    // Simulate async save (in real app, this would be an API call)
    setTimeout(() => {
        const contacts = contactsData.get('contacts');

        const contactData = {
            id: currentEditId || 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: $name.val().trim(),
            email: $email.val().trim(),
            phone: $('#contact-phone').val().trim(),
            groups: selectedGroups,
            notes: $('#contact-notes').val().trim(),
            createdAt: currentEditId ?
                _.find(contacts, c => c.id === currentEditId).createdAt :
                new Date().toISOString()
        };

        if (currentEditId) {
            // Update existing contact
            const index = _.findIndex(contacts, c => c.id === currentEditId);
            contacts[index] = contactData;
            Domma.elements.toast('Contact updated successfully!', {type: 'success'});
        } else {
            // Add new contact
            contacts.push(contactData);
            Domma.elements.toast('Contact added successfully!', {type: 'success'});
        }

        contactsData.set('contacts', contacts);
        contactsData.save();

        // Update table
        contactsTable.setData(contacts);

        // Update stats
        updateStats();

        loader.hide();
        resetForm();
    }, 800);
}

/**
 * Edits the contact with the specified ID.
 * Populates the form with the contact's details and sets up the UI for editing.
 *
 * @param {number} id - The ID of the contact to be edited.
 *
 * @return {void} This function does not return any value.
 */
function editContact(id) {
    const contacts = contactsData.get('contacts');
    const contact = _.find(contacts, c => c.id === id);

    if (!contact) return;

    currentEditId = id;
    $('#form-title').text('Edit Contact');
    $('#save-btn-text').text('Update Contact');

    // Populate form
    $('#contact-id').val(contact.id);
    $('#contact-name').val(contact.name);
    $('#contact-email').val(contact.email);
    $('#contact-phone').val(contact.phone || '');
    $('#contact-notes').val(contact.notes || '');

    // Set selected groups
    selectedGroups = contact.groups || [];
    updateGroupsDisplay();
    $('#contact-groups').val(selectedGroups.join(','));

    // Enable save button
    updateSaveButtonState();

    // Scroll to form
    document.getElementById('contact-form').scrollIntoView({behavior: 'smooth', block: 'start'});
}

/**
 * Deletes a contact by its ID.
 *
 * @param {number} id - The unique identifier of the contact to delete.
 *
 * @return {void}
 */
async function deleteContact(id) {
    const contacts = contactsData.get('contacts');
    const contact = _.find(contacts, c => c.id === id);

    if (!contact) return;

    const confirmed = await Domma.elements.confirm(
        `Are you sure you want to delete "${contact.name}"?`,
        {title: 'Delete Contact'}
    );

    if (confirmed) {
        // Show loader
        const loader = Domma.elements.fullscreenLoader('Deleting contact...');

        setTimeout(() => {
            const updatedContacts = _.filter(contacts, c => c.id !== id);
            contactsData.set('contacts', updatedContacts);
            contactsData.save();
            contactsTable.setData(updatedContacts);
            updateStats();

            loader.destroy();
            Domma.elements.toast('Contact deleted', {type: 'info'});
        }, 500);
    }
}

/**
 * Deletes the selected contacts from the contacts table.
 *
 * This function retrieves the currently selected contacts,
 * prompts the user for confirmation, and if confirmed,
 * removes the selected contacts from the data storage,
 * updates the contacts table, deselects all items,
 * and updates the statistics.
 *
 * @return {void}
 */
async function deleteSelected() {
    const selected = contactsTable.getSelected();

    if (selected.length === 0) return;

    const confirmed = await Domma.elements.confirm(
        `Delete ${selected.length} selected contact(s)?`,
        {title: 'Delete Multiple Contacts'}
    );

    if (confirmed) {
        const loader = Domma.elements.fullscreenLoader('Deleting contacts...');

        setTimeout(() => {
            const contacts = contactsData.get('contacts');
            const selectedIds = selected.map(c => c.id);
            const updatedContacts = _.filter(contacts, c => !selectedIds.includes(c.id));

            contactsData.set('contacts', updatedContacts);
            contactsData.save();
            contactsTable.setData(updatedContacts);
            contactsTable.deselectAll();
            updateStats();

            loader.destroy();
            Domma.elements.toast(`${selected.length} contact(s) deleted`, {type: 'info'});
        }, 500);
    }
}

/**
 * Exports the current list of contacts as a CSV file.
 *
 * This function triggers a fullscreen loading indicator while preparing the export,
 * then downloads the contacts data in CSV format, and finally displays a success toast notification.
 *
 * @return {void}
 */
function exportContacts() {
    const loader = Domma.elements.fullscreenLoader('Preparing export...');

    setTimeout(() => {
        contactsTable.download('contacts.csv', 'csv');
        loader.destroy();
        Domma.elements.toast('Contacts exported successfully!', {type: 'success'});
    }, 500);
}

/**
 * Filters the list of contacts based on a search query.
 *
 * @param {string} query - The search query string to filter contacts by. If empty, all contacts are displayed.
 *
 * @return {void} This function does not return any value. It updates the contacts table with filtered results directly.
 */
function filterContacts(query) {
    const contacts = contactsData.get('contacts');

    if (!query) {
        contactsTable.setData(contacts);
        return;
    }

    const filtered = _.filter(contacts, contact => {
        return contact.name.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            (contact.phone && contact.phone.includes(query)) ||
            (contact.groups && contact.groups.some(g => g.toLowerCase().includes(query)));
    });

    contactsTable.setData(filtered);
}

/**
 * Resets the contact form to its initial state.
 *
 * This function clears all input fields, removes validation states,
 * resets group selections, and updates the form title and button text.
 * It also disables the save button until the form is valid again.
 *
 * @return {void} - The function does not return any value.
 */
function resetForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }
    $('.form-group').removeClass('has-error has-success');
    $('.form-text').text('');

    // Clear groups selection
    selectedGroups = [];
    updateGroupsDisplay();
    $('#contact-groups').val('');

    currentEditId = null;

    // Reset form title and button text
    $('#form-title').text('Add Contact');
    $('#save-btn-text').text('Save Contact');

    // Disable save button until form is valid
    $('#save-contact-btn').prop('disabled', true);
}

/**
 * Adds a new group to the contacts data.
 *
 * This function retrieves the group name from an input field, checks if it already exists,
 * and if not, adds it to the list of groups in the contacts data. It then clears the input field,
 * updates the groups list display, refreshes statistics, and shows a success toast message.
 * If the group name is empty or already exists, it displays an error toast message.
 *
 * @return {void}
 */
function addGroup() {
    const groupName = $('#group-name-input').val().trim();
    if (!groupName) return;

    const groups = contactsData.get('groups');
    if (groups.includes(groupName)) {
        Domma.elements.toast('Group already exists', {type: 'error'});
        return;
    }

    groups.push(groupName);
    contactsData.set('groups', groups);
    contactsData.save();
    $('#group-name-input').val('');
    renderGroupsList();
    updateStats();
    Domma.elements.toast('Group added successfully!', {type: 'success'});
}

/**
 * Deletes a group and removes it from all associated contacts.
 *
 * @param {string} groupName - The name of the group to be deleted.
 *
 * @return {void}
 */
function deleteGroup(groupName) {
    const groups = contactsData.get('groups');
    const updatedGroups = _.filter(groups, g => g !== groupName);
    contactsData.set('groups', updatedGroups);
    contactsData.save();

    // Remove group from all contacts
    const contacts = contactsData.get('contacts');
    contacts.forEach(contact => {
        if (contact.groups && contact.groups.includes(groupName)) {
            contact.groups = _.filter(contact.groups, g => g !== groupName);
        }
    });
    contactsData.set('contacts', contacts);
    contactsData.save();

    renderGroupsList();
    updateStats();
    contactsTable.setData(contacts);
    Domma.elements.toast('Group deleted', {type: 'info'});
}

/**
 * Renders the list of groups in the UI.
 *
 * @return {void}
 */
function renderGroupsList() {
    const groups = contactsData.get('groups');
    const $list = $('#groups-list');

    if (groups.length === 0) {
        $list.html('<p class="text-muted">No groups yet. Add one above.</p>');
        return;
    }

    const html = groups.map(group => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid var(--dm-border); border-radius: var(--dm-radius); margin-bottom: 0.5rem;">
            <span class="group-badge">${group}</span>
            <button class="btn btn-sm btn-danger delete-group-btn" data-group="${group}">
                <span data-icon="trash" data-icon-size="24"></span>
                Delete
            </button>
        </div>
    `).join('');

    $list.html(html);

    // Scan for icons in the newly added content
    Domma.icons.scan();

    // Bind delete buttons
    $('.delete-group-btn').on('click', async function () {
        const groupName = $(this).attr('data-group');
        const confirmed = await Domma.elements.confirm(
            `Delete
            group "${groupName}"? This will remove it from all contacts.`,
            {title: 'Delete Group'}
        );
        if (confirmed) {
            deleteGroup(groupName);
        }
    });
}

/**
 * Updates the statistics displayed on the UI, including the total number of contacts,
 * total number of groups, and storage size used by the application.
 *
 * This function retrieves the list of contacts and groups from the `contactsData` object,
 * updates the corresponding UI elements with these counts, calculates the storage size
 * used by the 'domma-contacts-app' in kilobytes, and re-initialises the groups dropdown menu.
 *
 * @return {void}
 */
function updateStats() {
    const contacts = contactsData.get('contacts');
    const groups = contactsData.get('groups');

    $('#total-contacts').text(contacts.length);
    $('#total-groups').text(groups.length);
    $('#groups-count').text(groups.length);

    // Calculate storage size
    const storageSize = S.size('domma-contacts-app');
    $('#storage-size').text((storageSize / 1024).toFixed(2) + ' KB');

    // Reinitialise groups dropdown with updated groups
    initGroupsDropdown();
}

// Listen for model changes
contactsData.onChange('contacts', () => {
    updateStats();
});

contactsData.onChange('groups', () => {
    updateStats();
});

// Initialise app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
