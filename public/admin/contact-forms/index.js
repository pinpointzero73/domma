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
    AdminSidebar.init('contact-forms');

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
    let emailData = [];
    let filteredEmailData = [];
    let currentEmailPage = 1;
    const emailsPerPage = 20;
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
                limit: 100,
                offset: 0,
                type: emailTypeFilter || 'contact'
            });

            if (emailStatusFilter) params.append('status', emailStatusFilter);
            if (emailDateFilter) params.append('startDate', emailDateFilter);

            const response = await Domma.http.get(`${apiUrl}/emails?${params}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                emailData = response.data || [];
                applyEmailFilters();
                renderEmailsTable();
                updateEmailPagination();
            }
        } catch (error) {
            console.error('[Admin] Failed to load emails:', error);
            Domma.elements.toast('Failed to load emails', { type: 'error' });
        }
    }

    function applyEmailFilters() {
        filteredEmailData = emailData.filter(email => {
            const searchMatch = !emailSearchQuery ||
                email.metadata?.contactName?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
                email.metadata?.contactEmail?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
                email.metadata?.contactCompany?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
                email.from?.email?.toLowerCase().includes(emailSearchQuery.toLowerCase());

            return searchMatch;
        });
    }

    function renderEmailsTable() {
        const startIndex = (currentEmailPage - 1) * emailsPerPage;
        const endIndex = startIndex + emailsPerPage;
        const pageEmails = filteredEmailData.slice(startIndex, endIndex);

        const tableData = pageEmails.map(email => {
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

        // Destroy existing table if it exists
        const existingTable = Domma.tables.get('#emails-table');
        if (existingTable) {
            Domma.tables.destroy('#emails-table');
        }

        Domma.tables.create('#emails-table', {
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
                            <button class="btn btn-outline-primary view-email-btn" data-email-id="${emailId}">
                                View
                            </button>
                            <button class="btn btn-outline-warning retry-email-btn" data-email-id="${emailId}">
                                Retry
                            </button>
                            <button class="btn btn-outline-secondary archive-email-btn" data-email-id="${emailId}">
                                Archive
                            </button>
                        </div>
                    `
                }
            ],
            pagination: false,
            striped: true,
            responsive: true,
            exportPanel: true,
            exportOptions: ['text', 'csv', 'excel', 'json'],
            columnToggle: true,
            regexSearch: true
        });

        // Attach event handlers
        $('.view-email-btn').on('click', function () {
            viewEmailDetails($(this).attr('data-email-id'));
        });

        $('.retry-email-btn').on('click', function () {
            retryEmail($(this).attr('data-email-id'));
        });

        $('.archive-email-btn').on('click', function () {
            archiveEmail($(this).attr('data-email-id'));
        });
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

    function updateEmailPagination() {
        const totalEmails = filteredEmailData.length;
        const totalPages = Math.ceil(totalEmails / emailsPerPage);
        const startIndex = (currentEmailPage - 1) * emailsPerPage;
        const endIndex = Math.min(startIndex + emailsPerPage, totalEmails);

        $('#emails-info').text(`Showing ${startIndex + 1}-${endIndex} of ${totalEmails} emails`);

        $('#emails-prev').prop('disabled', currentEmailPage <= 1);
        $('#emails-next').prop('disabled', currentEmailPage >= totalPages);
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

    async function retryEmail(emailId) {
        const confirmed = await Domma.elements.confirm('Retry sending this email?');
        if (!confirmed) return;

        try {
            const response = await Domma.http.post(`${apiUrl}/emails/${emailId}/retry`, {}, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (response.success) {
                Domma.elements.toast('Email queued for retry', { type: 'success' });
                loadEmails();
                loadEmailStats();
            }
        } catch (error) {
            console.error('[Admin] Failed to retry email:', error);
            Domma.elements.toast('Failed to retry email', { type: 'error' });
        }
    }

    async function archiveEmail(emailId) {
        const confirmed = await Domma.elements.confirm('Archive this email?');
        if (!confirmed) return;

        try {
            const response = await Domma.http.patch(`${apiUrl}/emails/${emailId}/archive`,
                { archived: true },
                { headers: AdminAuth.getAuthHeaders() }
            );

            if (response.success) {
                Domma.elements.toast('Email archived successfully', { type: 'success' });
                loadEmails();
                loadEmailStats();
            }
        } catch (error) {
            console.error('[Admin] Failed to archive email:', error);
            Domma.elements.toast('Failed to archive email', { type: 'error' });
        }
    }

    // Email Search and Filters
    const emailSearchDebounced = _.debounce(() => {
        emailSearchQuery = $('#email-search').val().trim();
        currentEmailPage = 1;
        applyEmailFilters();
        renderEmailsTable();
        updateEmailPagination();
    }, 500);

    $('#email-search').on('input', emailSearchDebounced);

    $('#email-status-filter').on('change', () => {
        emailStatusFilter = $('#email-status-filter').val();
        currentEmailPage = 1;
        loadEmails();
    });

    $('#email-type-filter').on('change', () => {
        emailTypeFilter = $('#email-type-filter').val();
        currentEmailPage = 1;
        loadEmails();
    });

    $('#email-date-filter').on('change', () => {
        emailDateFilter = $('#email-date-filter').val();
        currentEmailPage = 1;
        loadEmails();
    });

    $('#refresh-emails').on('click', () => {
        loadEmails();
        loadEmailStats();
    });

    // Email Pagination
    $('#emails-prev').on('click', () => {
        if (currentEmailPage > 1) {
            currentEmailPage--;
            renderEmailsTable();
            updateEmailPagination();
        }
    });

    $('#emails-next').on('click', () => {
        const totalPages = Math.ceil(filteredEmailData.length / emailsPerPage);
        if (currentEmailPage < totalPages) {
            currentEmailPage++;
            renderEmailsTable();
            updateEmailPagination();
        }
    });

    // ============================================
    // 4. Initialise
    // ============================================
    loadEmailStats();
    loadEmails();
});
