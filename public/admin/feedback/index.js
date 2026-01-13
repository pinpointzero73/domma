/**
 * Admin Feedback Dashboard JavaScript
 * Manages user feedback submissions
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
    AdminSidebar.init('feedback', apiUrl);

    // ============================================
    // 2. Initialise Collapsible Cards
    // ============================================
    function initCollapsibleCards() {
        const cards = document.querySelectorAll('[data-collapsible="true"]');
        cards.forEach(card => {
            Domma.elements.card(card, { collapsible: true });
        });
        console.log(`[Admin] Initialised ${cards.length} collapsible cards`);
    }

    initCollapsibleCards();

    // ============================================
    // 3. Load Statistics
    // ============================================
    async function loadStats() {
        try {
            const response = await Domma.http.get(`${apiUrl}/admin/feedback/stats`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load stats');
            }

            const stats = response.data;
            renderStats(stats);
        } catch (error) {
            console.error('[Admin] Failed to load feedback stats:', error);
            Domma.elements.toast('Error loading statistics: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 4. Render Statistics
    // ============================================
    function renderStats(stats) {
        // Total feedback
        const total = stats.total && stats.total[0] ? stats.total[0].count : 0;
        $('#stat-total').text(total);

        // Status breakdown
        const statusMap = _.keyBy(stats.byStatus || [], '_id');
        $('#stat-new').text(statusMap.new ? statusMap.new.count : 0);

        // Average rating
        if (stats.averageRating && stats.averageRating[0]) {
            const avgRating = stats.averageRating[0].avg.toFixed(1);
            const ratingCount = stats.averageRating[0].count;
            $('#stat-rating').text(`${avgRating} ⭐`);
            $('#stat-rating-count').text(ratingCount);
        } else {
            $('#stat-rating').text('N/A');
            $('#stat-rating-count').text('0');
        }

        // Category breakdown
        if (stats.byCategory && stats.byCategory.length > 0) {
            const topCategory = _.maxBy(stats.byCategory, 'count');
            const categoryLabels = {
                'bug-report': 'Bug Reports',
                'feature-request': 'Feature Requests',
                'documentation': 'Documentation',
                'general': 'General',
                'praise': 'Praise',
                'other': 'Other'
            };

            $('#stat-top-category').html(`<strong>${categoryLabels[topCategory._id]}</strong>`);

            const summary = stats.byCategory
                .map(c => `${c.count} ${categoryLabels[c._id] || c._id}`)
                .join(', ');
            $('#stat-categories-summary').text(summary);
        }
    }

    // ============================================
    // 5. Feedback Table
    // ============================================
    let feedbackTable = null;
    let currentPage = 1;
    let searchQuery = '';
    let statusFilter = '';
    let categoryFilter = '';

    async function loadFeedback() {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 25,
                sort: 'submittedAt:desc'
            });

            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter) params.append('status', statusFilter);
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await Domma.http.get(`${apiUrl}/admin/feedback?${params}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load feedback');
            }

            // Transform data for table
            const tableData = response.data.feedback.map(item => {
                return {
                    id: item._id,
                    name: item.name,
                    email: item.email,
                    category: item.category,
                    subject: item.subject,
                    rating: item.rating || 'N/A',
                    status: item.status,
                    submitted: Domma.dates(item.submittedAt).format('DD MMM YYYY HH:mm'),
                    actions: item._id
                };
            });

            if (!feedbackTable) {
                // Create table
                feedbackTable = Domma.tables.create('#feedback-table', {
                    data: tableData,
                    columns: [
                        { key: 'name', title: 'Name', sortable: true },
                        { key: 'email', title: 'Email', sortable: true },
                        {
                            key: 'category',
                            title: 'Category',
                            sortable: true,
                            render: (value) => {
                                const labels = {
                                    'bug-report': 'Bug Report',
                                    'feature-request': 'Feature Request',
                                    'documentation': 'Documentation',
                                    'general': 'General',
                                    'praise': 'Praise',
                                    'other': 'Other'
                                };
                                return labels[value] || value;
                            }
                        },
                        { key: 'subject', title: 'Subject', sortable: true },
                        {
                            key: 'rating',
                            title: 'Rating',
                            sortable: true,
                            render: (value) => value !== 'N/A' ? `${value} ⭐` : 'N/A'
                        },
                        {
                            key: 'status',
                            title: 'Status',
                            sortable: true,
                            render: (value) => {
                                const statusMap = {
                                    new: '<span class="badge badge-primary">New</span>',
                                    reviewed: '<span class="badge badge-info">Reviewed</span>',
                                    'in-progress': '<span class="badge badge-warning">In Progress</span>',
                                    resolved: '<span class="badge badge-success">Resolved</span>',
                                    archived: '<span class="badge badge-secondary">Archived</span>'
                                };
                                return statusMap[value] || value;
                            }
                        },
                        { key: 'submitted', title: 'Submitted', sortable: true },
                        {
                            key: 'actions',
                            title: 'Actions',
                            sortable: false,
                            render: (id) => `
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-primary view-feedback-btn" data-id="${id}">
                                        <span data-icon="eye" data-icon-size="16"></span>
                                        View
                                    </button>
                                    <button class="btn btn-warning edit-feedback-btn" data-id="${id}">
                                        <span data-icon="edit" data-icon-size="16"></span>
                                        Edit
                                    </button>
                                    <button class="btn btn-danger delete-feedback-btn" data-id="${id}">
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
                    selectable: true,
                    selectionMode: 'multiple',
                    exportPanel: true,
                    exportOptions: ['text', 'csv', 'excel', 'json'],
                    columnToggle: true,
                    regexSearch: true
                });

                // Handle action buttons
                $('body').on('click', '.view-feedback-btn', function () {
                    const id = $(this).attr('data-id');
                    viewFeedback(id);
                });

                $('body').on('click', '.edit-feedback-btn', function () {
                    const id = $(this).attr('data-id');
                    editFeedback(id);
                });

                $('body').on('click', '.delete-feedback-btn', function () {
                    const id = $(this).attr('data-id');
                    deleteFeedback(id);
                });
            } else {
                feedbackTable.setData(tableData);
            }
        } catch (error) {
            console.error('[Admin] Failed to load feedback:', error);
            Domma.elements.toast('Error loading feedback: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 6. View Feedback
    // ============================================
    async function viewFeedback(id) {
        try {
            const response = await Domma.http.get(`${apiUrl}/admin/feedback/${id}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load feedback');
            }

            const feedback = response.data;

            const details = `
**From:** ${feedback.name} (${feedback.email})
**Category:** ${feedback.formattedCategory || feedback.category}
**Subject:** ${feedback.subject}
**Rating:** ${feedback.rating ? `${feedback.rating} ⭐` : 'Not provided'}
**Features Used:** ${feedback.featuresUsed && feedback.featuresUsed.length > 0 ? feedback.featuresUsed.join(', ') : 'Not specified'}
**Status:** ${_.capitalize(feedback.status)}
**Submitted:** ${Domma.dates(feedback.submittedAt).format('DD MMM YYYY HH:mm')}

**Message:**
${feedback.message}

${feedback.adminNotes ? `\n**Admin Notes:**\n${feedback.adminNotes}` : ''}
            `.trim();

            await Domma.elements.alert(details, {
                title: 'Feedback Details',
                size: 'large'
            });
        } catch (error) {
            console.error('[Admin] Failed to load feedback details:', error);
            Domma.elements.toast('Error: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 7. Edit Feedback (Status & Notes)
    // ============================================
    async function editFeedback(id) {
        try {
            // Load current feedback
            const response = await Domma.http.get(`${apiUrl}/admin/feedback/${id}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load feedback');
            }

            const feedback = response.data;

            // Schema for editing
            const editSchema = {
                status: {
                    type: 'select',
                    label: 'Status',
                    required: true,
                    options: [
                        { value: 'new', label: 'New' },
                        { value: 'reviewed', label: 'Reviewed' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'resolved', label: 'Resolved' },
                        { value: 'archived', label: 'Archived' }
                    ]
                },
                adminNotes: {
                    type: 'textarea',
                    label: 'Admin Notes',
                    required: false,
                    maxLength: 2000,
                    formConfig: {
                        placeholder: 'Internal notes about this feedback...',
                        rows: 4
                    }
                }
            };

            const initialData = {
                status: feedback.status,
                adminNotes: feedback.adminNotes || ''
            };

            // Create modal form
            const modal = Domma.forms.modal(editSchema, initialData, {
                title: `Edit Feedback: ${feedback.subject}`,
                size: 'medium',
                saveText: 'Update Feedback',
                layout: 'stacked',
                onSave: async (formData) => {
                    const updateResponse = await Domma.http.patch(
                        `${apiUrl}/admin/feedback/${id}`,
                        formData,
                        { headers: AdminAuth.getAuthHeaders() }
                    );

                    if (!updateResponse.success) {
                        throw new Error(updateResponse.message || 'Failed to update feedback');
                    }

                    Domma.elements.toast('Feedback updated successfully!', { type: 'success' });
                    loadFeedback();
                    loadStats();
                },
                onError: (error) => {
                    console.error('[Admin] Failed to update feedback:', error);
                    Domma.elements.toast('Error: ' + error.message, { type: 'error' });
                }
            });

            modal.open();
        } catch (error) {
            console.error('[Admin] Failed to load feedback for editing:', error);
            Domma.elements.toast('Error: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 8. Delete Feedback
    // ============================================
    async function deleteFeedback(id) {
        try {
            // Load feedback details for confirmation
            const response = await Domma.http.get(`${apiUrl}/admin/feedback/${id}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to load feedback');
            }

            const feedback = response.data;

            const confirmed = await Domma.elements.confirm(
                `Are you sure you want to delete this feedback?\n\nFrom: ${feedback.name}\nSubject: ${feedback.subject}\n\nThis action cannot be undone.`,
                {
                    title: 'Confirm Deletion',
                    confirmText: 'Yes, Delete',
                    cancelText: 'Cancel',
                    type: 'warning'
                }
            );

            if (!confirmed) return;

            const deleteResponse = await Domma.http.delete(`${apiUrl}/admin/feedback/${id}`, {
                headers: AdminAuth.getAuthHeaders()
            });

            if (!deleteResponse.success) {
                throw new Error(deleteResponse.message || 'Failed to delete feedback');
            }

            Domma.elements.toast('Feedback deleted successfully', { type: 'success' });
            loadFeedback();
            loadStats();
        } catch (error) {
            console.error('[Admin] Failed to delete feedback:', error);
            Domma.elements.toast('Error: ' + error.message, { type: 'error' });
        }
    }

    // ============================================
    // 9. Search and Filters
    // ============================================
    const searchDebounced = _.debounce(() => {
        searchQuery = $('#feedback-search').val().trim();
        currentPage = 1;
        loadFeedback();
    }, 500);

    $('#feedback-search').on('input', searchDebounced);

    $('#status-filter').on('change', () => {
        statusFilter = $('#status-filter').val();
        currentPage = 1;
        loadFeedback();
    });

    $('#category-filter').on('change', () => {
        categoryFilter = $('#category-filter').val();
        currentPage = 1;
        loadFeedback();
    });

    $('#refresh-feedback').on('click', () => {
        loadFeedback();
        loadStats();
    });

    // ============================================
    // 10. Initialise
    // ============================================
    loadStats();
    loadFeedback();
});
