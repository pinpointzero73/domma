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
                limit: 25
            });

            if (emailSearchQuery) params.append('search', emailSearchQuery);

            const response = await Domma.http.get(`${apiUrl}/admin/contact-submissions?${params}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                const submissions = response.data || [];

                // Transform data for table
                const tableData = submissions.map(submission => {
                    const projectType = submission.projectType ?
                        formatProjectType(submission.projectType) : 'N/A';

                    const submitted = Domma.dates(submission.submittedAt || submission.createdAt).format('DD MMM YYYY HH:mm');

                    return {
                        name: submission.name,
                        email: submission.email,
                        phone: submission.phone || 'N/A',
                        company: submission.company || 'N/A',
                        projectType: projectType,
                        subject: submission.subject || 'N/A',
                        submitted: submitted,
                        submissionId: submission._id
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
                            { key: 'subject', title: 'Subject', sortable: true },
                            { key: 'projectType', title: 'Project Type', sortable: true },
                            { key: 'submitted', title: 'Submitted', sortable: true },
                            {
                                key: 'submissionId',
                                title: 'Actions',
                                sortable: false,
                                render: (submissionId) => `
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-primary view-submission-btn" data-submission-id="${submissionId}">
                                            <span data-icon="eye" data-icon-size="16"></span>
                                            View
                                        </button>
                                        <button class="btn btn-danger delete-submission-btn" data-submission-id="${submissionId}">
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
                    $('body').on('click', '.view-submission-btn', function () {
                        viewSubmissionDetails($(this).attr('data-submission-id'));
                    });

                    $('body').on('click', '.delete-submission-btn', function () {
                        deleteSubmission($(this).attr('data-submission-id'));
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

    // Submission Actions
    async function viewSubmissionDetails(submissionId) {
        try {
            const response = await Domma.http.get(`${apiUrl}/admin/contact-submissions/${submissionId}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                const submission = response.data;
                const details = `
**Name:** ${submission.name}
**Email:** ${submission.email}
**Phone:** ${submission.phone || 'Not provided'}
**Company:** ${submission.company || 'Not provided'}

**Subject:** ${submission.subject || 'No subject'}
**Project Type:** ${formatProjectType(submission.projectType)}

**Message:**
${submission.message || 'No message'}

**Budget:** ${submission.budget || 'Not specified'}
**Timeline:** ${submission.timeline || 'Not specified'}

**Submitted:** ${Domma.dates(submission.submittedAt || submission.createdAt).format('DD MMM YYYY HH:mm')}
                `.trim();

                await Domma.elements.alert(details, {
                    title: 'Contact Submission Details',
                    size: 'large'
                });
            }
        } catch (error) {
            console.error('[Admin] Failed to load submission details:', error);
            Domma.elements.toast('Failed to load submission details', { type: 'error' });
        }
    }

    async function deleteSubmission(submissionId) {
        const confirmed = await Domma.elements.confirm('Are you sure you want to delete this contact submission?\n\nThis action cannot be undone.');
        if (!confirmed) return;

        try {
            const response = await Domma.http.delete(`${apiUrl}/admin/contact-submissions/${submissionId}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                Domma.elements.toast('Contact submission deleted successfully', { type: 'success' });
                loadEmails();
                loadEmailStats();
            }
        } catch (error) {
            console.error('[Admin] Failed to delete submission:', error);
            Domma.elements.toast('Failed to delete submission', { type: 'error' });
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
