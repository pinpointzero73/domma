/**
 * Blog Posts Admin Page
 * Manage blog posts with CRUD operations
 */

import AdminSidebar from '../shared/admin-sidebar.js';
import AdminAuth from '../shared/admin-auth.js';

let apiUrl;
let allPosts = [];
let filteredPosts = [];
let postsTable = null;
let currentUser = null;

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
    const badgeClass = `badge badge-${status}`;
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="${badgeClass}">${statusText}</span>`;
}

/**
 * Fetch all posts
 */
async function fetchPosts() {
    try {
        const response = await fetch(`${apiUrl}/posts/admin`, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('domma_auth_token');
                localStorage.removeItem('domma_auth_user');
                window.location.href = '/admin/login.html';
                return;
            }
            throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        if (data.success) {
            allPosts = data.data;
            filteredPosts = [...allPosts];
            renderStats();
            renderTable();
        } else {
            throw new Error('Failed to load posts');
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        Domma.elements.toast('Failed to load posts', 'error');
    }
}

/**
 * Render statistics cards
 */
function renderStats() {
    const total = allPosts.length;
    const published = allPosts.filter(p => p.status === 'published').length;
    const drafts = allPosts.filter(p => p.status === 'draft').length;
    const archived = allPosts.filter(p => p.status === 'archived').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-published').textContent = published;
    document.getElementById('stat-drafts').textContent = drafts;
    document.getElementById('stat-archived').textContent = archived;
}

/**
 * Render posts table
 */
function renderTable() {
    const tableData = filteredPosts.map(post => ({
        id: post._id,
        title: DOMPurify.sanitize(post.title),
        slug: post.slug,
        status: post.status,
        author: post.authorId ? DOMPurify.sanitize(post.authorId.email || 'Unknown') : 'System',
        authorId: post.authorId?._id || post.authorId,
        date: formatDate(post.date),
        updatedAt: formatDate(post.updatedAt),
        views: post.views || 0
    }));

    // Destroy existing table if it exists
    if (postsTable) {
        postsTable.destroy();
    }

    // Create table
    postsTable = Domma.tables.create('#posts-table', {
        data: tableData,
        columns: [
            { header: 'Title', key: 'title', sortable: true },
            { header: 'Slug', key: 'slug', sortable: true },
            {
                header: 'Status',
                key: 'status',
                sortable: true,
                render: (value) => getStatusBadge(value)
            },
            { header: 'Author', key: 'author', sortable: true },
            { header: 'Published', key: 'date', sortable: true },
            { header: 'Updated', key: 'updatedAt', sortable: true },
            { header: 'Views', key: 'views', sortable: true },
            {
                header: 'Actions',
                key: 'id',
                render: (id, row) => {
                    // Check if current user can delete this post (admin only)
                    const canDelete = currentUser && currentUser.role === 'admin';

                    return `
                        <div class="actions-cell">
                            <button class="btn btn-sm btn-primary btn-table-action"
                                    data-action="edit"
                                    data-id="${id}">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-secondary btn-table-action"
                                    data-action="view"
                                    data-slug="${row.slug}">
                                View
                            </button>
                            <button class="btn btn-sm btn-warning btn-table-action"
                                    data-action="toggle"
                                    data-id="${id}"
                                    data-slug="${row.slug}"
                                    data-status="${row.status}">
                                ${row.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            ${canDelete ? `
                            <button class="btn btn-sm btn-danger btn-table-action"
                                    data-action="delete"
                                    data-id="${id}"
                                    data-slug="${row.slug}">
                                Delete
                            </button>
                            ` : ''}
                        </div>
                    `;
                }
            }
        ],
        pagination: true,
        pageSize: 10,
        striped: true,
        hover: true,
        responsive: true
    });

    // Bind action buttons
    bindActionButtons();
}

/**
 * Bind action button events
 */
function bindActionButtons() {
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', async (e) => {
            const action = e.target.dataset.action;
            const id = e.target.dataset.id;
            const slug = e.target.dataset.slug;
            const status = e.target.dataset.status;

            switch (action) {
                case 'edit':
                    window.location.href = `edit.html?id=${id}`;
                    break;
                case 'view':
                    window.open(`/blog/index.html`, '_blank');
                    break;
                case 'toggle':
                    await togglePostStatus(slug, status);
                    break;
                case 'delete':
                    await deletePost(slug);
                    break;
            }
        });
    });
}

/**
 * Toggle post status (publish/unpublish)
 */
async function togglePostStatus(slug, currentStatus) {
    const newAction = currentStatus === 'published' ? 'unpublish' : 'publish';
    const confirmMessage = currentStatus === 'published'
        ? 'Are you sure you want to unpublish this post? It will no longer be visible on the blog.'
        : 'Are you sure you want to publish this post? It will be visible on the blog.';

    const confirmed = await Domma.elements.confirm(confirmMessage);
    if (!confirmed) return;

    try {
        const response = await fetch(`${apiUrl}/posts/${slug}/${newAction}`, {
            method: 'POST',
            headers: AdminAuth.getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok && data.success) {
            Domma.elements.toast(data.message, 'success');
            await fetchPosts(); // Refresh the list
        } else {
            throw new Error(data.message || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error toggling status:', error);
        Domma.elements.toast(error.message || 'Failed to update post status', 'error');
    }
}

/**
 * Delete post
 */
async function deletePost(slug) {
    const confirmed = await Domma.elements.confirm(
        'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
        const response = await fetch(`${apiUrl}/posts/${slug}`, {
            method: 'DELETE',
            headers: AdminAuth.getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok && data.success) {
            Domma.elements.toast('Post deleted successfully', 'success');
            await fetchPosts(); // Refresh the list
        } else {
            throw new Error(data.message || 'Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        Domma.elements.toast(error.message || 'Failed to delete post', 'error');
    }
}

/**
 * Apply filters
 */
function applyFilters() {
    const searchTerm = document.getElementById('post-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    filteredPosts = allPosts.filter(post => {
        // Search filter
        const matchesSearch = !searchTerm ||
            post.title.toLowerCase().includes(searchTerm) ||
            post.slug.toLowerCase().includes(searchTerm);

        // Status filter
        const matchesStatus = !statusFilter || post.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    renderTable();
}

/**
 * Initialise page
 */
async function init() {
    // Initialise authentication (allow both admin and editor roles)
    apiUrl = AdminAuth.getApiUrl();
    if (!AdminAuth.init(apiUrl, ['admin', 'editor'])) {
        return; // Auth failed, user redirected
    }

    // Get current user for permissions
    currentUser = AdminAuth.getUser();

    // Initialise sidebar
    AdminSidebar.init('blog');

    // Scan for icons
    Domma.icons.scan();

    // Fetch posts
    await fetchPosts();

    // Bind event listeners
    document.getElementById('post-search').addEventListener('input', applyFilters);
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    document.getElementById('refresh-posts').addEventListener('click', fetchPosts);
}

// Initialise on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
