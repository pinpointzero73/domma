/**
 * Admin Contact Forms Dashboard JavaScript
 * Manages contact form submissions and email communications
 */

import AdminSidebar from '../shared/admin-sidebar.js';
import AdminAuth from '../shared/admin-auth.js';

$(() => {
    // ============================================
    // 1. Initialise Authentication & Sidebar
    // ============================================
    const apiUrl = AdminAuth.getApiUrl();
    if (!AdminAuth.init(apiUrl)) {
        return; // Auth failed, user redirected
    }

    // Initialise sidebar with current section
    AdminSidebar.init('contact-forms', apiUrl);

    // ============================================
    // 2. Initialise Collapsible Cards
    // ============================================
    function initCollapsibleCards() {
        const cards = document.querySelectorAll('[data-collapsible="true"]');
        cards.forEach(card => {
            Domma.elements.card(card, { collapsible: true });
        });
    }

    initCollapsibleCards();

    // ============================================
    // 3. Email Management
    // ============================================
    let emailsTable = null;
    let emailSearchQuery = '';
    let emailStatusFilter = '';
    let emailTypeFilter = '';
    let emailDateFilter = '';

    async function loadEmailStats() {
        try {
            const response = await Domma.http.get(`${apiUrl}/emails/stats`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                const { stats } = response.data;
                let totalEmails = 0;
                let contactEmails = 0;
                let sentEmails = 0;
                let failedEmails = 0;
                let pendingEmails = 0;

                stats.forEach(stat => {
                    totalEmails += stat.total;
                    if (stat._id === 'contact') {
                        contactEmails = stat.total;
                    }
                    stat.stats.forEach(statusStat => {
                        if (statusStat.status === 'sent') sentEmails += statusStat.count;
                        if (statusStat.status === 'failed') failedEmails += statusStat.count;
                        if (statusStat.status === 'pending') pendingEmails += statusStat.count;
                    });
                });

                $('#stat-total-emails').text(totalEmails);
                $('#stat-contact-emails').text(contactEmails);
                $('#stat-pending-emails').text(pendingEmails);
                $('#stat-sent-emails').text(`${sentEmails} sent`);
                $('#stat-failed-emails').text(`${failedEmails} failed`);

                $('#stat-status-summary').html(`
                    <strong>${sentEmails}</strong> Sent<br>
                    <strong>${pendingEmails}</strong> Pending<br>
                    <strong>${failedEmails}</strong> Failed
                `);
            }
        } catch (error) {
            console.error('[Admin] Failed to load email stats:', error);
        }
    }

    async function loadEmails() {
        try {
            const params = new URLSearchParams({
                limit: 25,
                type: emailTypeFilter || 'contact'
            });

            if (emailSearchQuery) params.append('search', emailSearchQuery);
            if (emailStatusFilter) params.append('status', emailStatusFilter);
            if (emailDateFilter) params.append('startDate', emailDateFilter);

            const response = await Domma.http.get(`${apiUrl}/emails?${params}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                const emailData = response.data || [];

                // Transform data for table
                const tableData = emailData.map(email => {
                    const contactInfo = {
                        name: email.metadata?.contactName || email.from?.name || 'Unknown',
                        email: email.metadata?.contactEmail || email.from?.email || '',
                        company: email.metadata?.contactCompany || '',
                        phone: email.metadata?.contactPhone || ''
                    };

                    const projectType = email.metadata?.projectType ?
                        formatProjectType(email.metadata.projectType) : 'N/A';

                    const statusText = email.status || 'pending';
                    const submitted = Domma.dates(email.createdAt).format('DD MMM YYYY HH:mm');

                    return {
                        name: contactInfo.name,
                        email: contactInfo.email,
                        phone: contactInfo.phone || 'N/A',
                        company: contactInfo.company || 'N/A',
                        projectType: projectType,
                        status: statusText,
                        submitted: submitted,
                        emailId: email._id
                    };
                });

                if (!emailsTable) {
                    // Create table
                    emailsTable = Domma.tables.create('#emails-table', {
                        data: tableData,
                        columns: [
                            { key: 'name', title: 'Name', sortable: true },
                            { key: 'email', title: 'Email', sortable: true },
                            { key: 'phone', title: 'Phone' },
                            { key: 'company', title: 'Company', sortable: true },
                            { key: 'projectType', title: 'Project Type', sortable: true },
                            {
                                key: 'status',
                                title: 'Status',
                                sortable: true,
                                render: (value) => {
                                    const statusMap = {
                                        pending: '<span class="badge badge-warning">Pending</span>',
                                        sent: '<span class="badge badge-success">Sent</span>',
                                        failed: '<span class="badge badge-danger">Failed</span>',
                                        delivered: '<span class="badge badge-success">Delivered</span>',
                                        read: '<span class="badge badge-info">Read</span>'
                                    };
                                    return statusMap[value] || `<span class="badge badge-secondary">${_.capitalize(value)}</span>`;
                                }
                            },
                            { key: 'submitted', title: 'Submitted', sortable: true },
                            {
                                key: 'emailId',
                                title: 'Actions',
                                sortable: false,
                                render: (emailId) => `
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-primary view-email-btn" data-email-id="${emailId}">
                                            <span data-icon="eye" data-icon-size="16"></span>
                                            View
                                        </button>
                                        <button class="btn btn-warning edit-email-btn" data-email-id="${emailId}">
                                            <span data-icon="edit" data-icon-size="16"></span>
                                            Edit
                                        </button>
                                        <button class="btn btn-danger delete-email-btn" data-email-id="${emailId}">
                                            <span data-icon="trash" data-icon-size="16"></span>
                                            Delete
                                        </button>
                                    </div>
                                `
                            }
                        ],
                        pagination: true,
                        pageSize: 25,
                        striped: true,
                        responsive: true,
                        exportPanel: true,
                        exportOptions: ['text', 'csv', 'excel', 'json'],
                        columnToggle: true,
                        regexSearch: true
                    });

                    // Attach event handlers ONCE via delegation
                    $('body').on('click', '.view-email-btn', function () {
                        viewEmailDetails($(this).attr('data-email-id'));
                    });

                    $('body').on('click', '.edit-email-btn', function () {
                        editEmail($(this).attr('data-email-id'));
                    });

                    $('body').on('click', '.delete-email-btn', function () {
                        deleteEmail($(this).attr('data-email-id'));
                    });
                } else {
                    emailsTable.setData(tableData);
                }
            }
        } catch (error) {
            console.error('[Admin] Failed to load emails:', error);
            Domma.elements.toast('Failed to load emails', { type: 'error' });
        }
    }

    function formatProjectType(type) {
        const types = {
            'legacy-modernisation': 'Legacy Modernisation',
            'greenfield': 'Greenfield Development',
            'consulting': 'Technical Consulting',
            'fractional-cto': 'Fractional CTO',
            'other': 'Other'
        };
        return types[type] || _.capitalize(type);
    }

    // Email Actions
    async function viewEmailDetails(emailId) {
        try {
            const response = await Domma.http.get(`${apiUrl}/emails/${emailId}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                const email = response.data;
                const details = `
**Subject:** ${email.subject}

**From:** ${email.from.email}
**To:** ${email.to[0].email}
**Status:** ${_.capitalize(email.status)}
**Created:** ${Domma.dates(email.createdAt).format('DD MMM YYYY HH:mm')}

**Project Details:**
${email.metadata?.details || 'No details available'}
                `.trim();

                await Domma.elements.alert(details, {
                    title: 'Email Details',
                    size: 'large'
                });
            }
        } catch (error) {
            console.error('[Admin] Failed to load email details:', error);
            Domma.elements.toast('Failed to load email details', { type: 'error' });
        }
    }

    async function editEmail(emailId) {
        try {
            const response = await Domma.http.get(`${apiUrl}/emails/${emailId}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load email');
            }

            const email = response.data;
            const contactEmail = email.metadata?.contactEmail || email.from?.email || 'Unknown';

            // Email edit schema
            const emailSchema = {
                status: {
                    type: 'select',
                    label: 'Email Status',
                    required: true,
                    options: [
                        { value: 'pending', label: 'Pending' },
                        { value: 'sent', label: 'Sent' },
                        { value: 'failed', label: 'Failed' },
                        { value: 'delivered', label: 'Delivered' },
                        { value: 'read', label: 'Read' }
                    ],
                    formConfig: {
                        helperText: 'Update the email delivery status'
                    }
                }
            };

            const initialData = {
                status: email.status
            };

            // Create modal with custom retry button if status is failed
            const modalConfig = {
                title: `Edit Email: ${contactEmail}`,
                size: 'medium',
                saveText: 'Update Email',
                layout: 'stacked',
                sections: [
                    {
                        title: 'Email Status',
                        fields: ['status']
                    }
                ],
                onSave: async (formData) => {
                    const updateResponse = await Domma.http.patch(
                        `${apiUrl}/emails/${emailId}`,
                        formData,
                        { headers: AdminAuth.getAuthHeaders() }
                    );

                    if (!updateResponse.success) {
                        throw new Error(updateResponse.message || 'Failed to update email');
                    }

                    Domma.elements.toast('Email updated successfully', { type: 'success' });
                    loadEmails();
                    loadEmailStats();
                },
                onError: (error) => {
                    console.error('[Admin] Failed to update email:', error);
                    Domma.elements.toast('Error: ' + error.message, { type: 'error' });
                }
            };

            // Add custom footer if email is failed
            if (email.status === 'failed') {
                modalConfig.customFooter = (modal) => {
                    return `
                        <div class="modal-footer">
                            <button type="button" class="btn btn-warning" id="retry-failed-email">
                                <span data-icon="refresh-cw" data-icon-size="16"></span>
                                Retry Failed Email
                            </button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Update Email</button>
                        </div>
                    `;
                };
            }

            const modal = Domma.forms.modal(emailSchema, initialData, modalConfig);
            modal.open();

            // Attach retry handler if failed
            if (email.status === 'failed') {
                $('#retry-failed-email').on('click', async () => {
                    const confirmed = await Domma.elements.confirm('Retry sending this failed email?');
                    if (!confirmed) return;

                    try {
                        const retryResponse = await Domma.http.post(
                            `${apiUrl}/emails/${emailId}/retry`,
                            {},
                            { headers: AdminAuth.getAuthHeaders() }
                        );

                        if (retryResponse.success) {
                            Domma.elements.toast('Email queued for retry', { type: 'success' });
                            modal.close();
                            loadEmails();
                            loadEmailStats();
                        }
                    } catch (error) {
                        console.error('[Admin] Failed to retry email:', error);
                        Domma.elements.toast('Failed to retry email', { type: 'error' });
                    }
                });
            }

        } catch (error) {
            console.error('[Admin] Failed to edit email:', error);
            Domma.elements.toast('Failed to load email for editing', { type: 'error' });
        }
    }

    async function deleteEmail(emailId) {
        const confirmed = await Domma.elements.confirm('Are you sure you want to delete this email?\n\nThis action cannot be undone.');
        if (!confirmed) return;

        try {
            const response = await Domma.http.delete(`${apiUrl}/emails/${emailId}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                Domma.elements.toast('Email deleted successfully', { type: 'success' });
                loadEmails();
                loadEmailStats();
            }
        } catch (error) {
            console.error('[Admin] Failed to delete email:', error);
            Domma.elements.toast('Failed to delete email', { type: 'error' });
        }
    }

    // Email Search and Filters
    const emailSearchDebounced = _.debounce(() => {
        emailSearchQuery = $('#email-search').val().trim();
        loadEmails();
    }, 500);

    $('#email-search').on('input', emailSearchDebounced);

    $('#email-status-filter').on('change', () => {
        emailStatusFilter = $('#email-status-filter').val();
        loadEmails();
    });

    $('#email-type-filter').on('change', () => {
        emailTypeFilter = $('#email-type-filter').val();
        loadEmails();
    });

    $('#email-date-filter').on('change', () => {
        emailDateFilter = $('#email-date-filter').val();
        loadEmails();
    });

    $('#refresh-emails').on('click', () => {
        loadEmails();
        loadEmailStats();
    });

    // ============================================
    // 4. Initialise
    // ============================================
    loadEmailStats();
    loadEmails();
});
