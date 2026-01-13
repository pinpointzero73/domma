/**
 * Blog Post Editor
 * Create and edit blog posts with Domma Editor
 */

import AdminSidebar from '../shared/admin-sidebar.js';
import AdminAuth from '../shared/admin-auth.js';

let apiUrl;
let editor = null;
let pillbox = null;
let currentPostId = null;
let isEditMode = false;
let autosaveTimer = null;
let originalSlug = null; // Store original slug to prevent changes during edit

/**
 * Generate slug from title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-');     // Remove duplicate hyphens
}

/**
 * Update character counter
 */
function updateCharCounter(inputId, counterId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    const length = input.value.length;

    counter.textContent = `${length} / ${maxLength}`;

    // Add warning/danger classes
    counter.classList.remove('warning', 'danger');
    if (length > maxLength * 0.9) {
        counter.classList.add('warning');
    }
    if (length >= maxLength) {
        counter.classList.add('danger');
    }
}

/**
 * Initialise Domma Editor
 */
function initEditor() {
    if (!DommaTools || !DommaTools.editor) {
        console.error('Domma Editor not available. Make sure domma-tools.min.js is loaded.');
        Domma.elements.toast('Editor not available', 'error');
        return;
    }

    editor = DommaTools.editor('#post-content', {
        mode: 'rich',
        placeholder: 'Write your blog post content here...',
        minHeight: 400,
        autosave: true,
        autosaveInterval: 30000, // 30 seconds
        storage: `blog-draft-${currentPostId || 'new'}`,
        imagePaste: true,
        toolbar: [
            ['bold', 'italic', 'underline', 'strikethrough'],
            ['h1', 'h2', 'h3'],
            ['ul', 'ol', 'blockquote'],
            ['link', 'image', 'code', 'codeblock'],
            ['undo', 'redo', 'clear']
        ],
        onChange: () => {
            // Trigger autosave on content change
            scheduleAutosave();
        }
    });
}

/**
 * Initialise tags pillbox
 */
function initPillbox() {
    pillbox = Domma.elements.pillbox('#post-tags', {
        placeholder: 'Press Enter to add tags',
        validation: {
            maxTags: 10,
            pattern: /^[a-zA-Z0-9\s-]+$/,
            errorMessage: 'Tags can only contain letters, numbers, spaces, and hyphens'
        }
    });
}

/**
 * Schedule autosave
 */
function scheduleAutosave() {
    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
    }

    autosaveTimer = setTimeout(async () => {
        if (isEditMode && currentPostId) {
            await autosavePost();
        }
    }, 5000); // Autosave after 5 seconds of no changes
}

/**
 * Autosave post
 */
async function autosavePost() {
    try {
        const formData = getFormData();

        // Use original slug for autosave
        const response = await fetch(`${apiUrl}/posts/${originalSlug}`, {
            method: 'PUT',
            headers: AdminAuth.getAuthHeaders(),
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log('Post autosaved');
        }
    } catch (error) {
        console.error('Autosave failed:', error);
    }
}

/**
 * Get form data
 */
function getFormData() {
    return {
        title: document.getElementById('post-title').value.trim(),
        slug: document.getElementById('post-slug').value.trim(),
        excerpt: document.getElementById('post-excerpt').value.trim(),
        content: editor ? editor.getValue() : '',
        metaDescription: document.getElementById('post-meta-desc').value.trim(),
        tags: pillbox ? pillbox.getValue() : [],
        featuredImage: document.getElementById('post-image').value.trim() || null,
        status: document.getElementById('post-status').value,
        readTime: document.getElementById('post-read-time').value.trim(),
        date: document.getElementById('post-date').value
            ? new Date(document.getElementById('post-date').value).toISOString()
            : new Date().toISOString()
    };
}

/**
 * Load post data for editing
 */
async function loadPost(postId) {
    try {
        const response = await fetch(`${apiUrl}/posts/admin/${postId}`, {
            headers: AdminAuth.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to load post');
        }

        const data = await response.json();

        if (data.success && data.data) {
            const post = data.data;

            // Store original slug to prevent changes during edit
            originalSlug = post.slug;

            // Populate form
            document.getElementById('post-title').value = post.title || '';
            document.getElementById('post-slug').value = post.slug || '';
            document.getElementById('post-slug').readOnly = true; // Prevent slug changes in edit mode
            document.getElementById('post-excerpt').value = post.excerpt || '';
            document.getElementById('post-meta-desc').value = post.metaDescription || '';
            document.getElementById('post-image').value = post.featuredImage || '';
            document.getElementById('post-status').value = post.status || 'draft';
            document.getElementById('post-read-time').value = post.readTime || '5 min read';

            // Set date if available
            if (post.date) {
                const date = new Date(post.date);
                const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
                document.getElementById('post-date').value = localDateTime;
            }

            // Set editor content
            if (editor && post.content) {
                editor.setValue(post.content);
            }

            // Set tags
            if (pillbox && post.tags && post.tags.length > 0) {
                post.tags.forEach(tag => pillbox.addPill(tag));
            }

            // Update character counters
            updateCharCounter('post-title', 'title-counter', 200);
            updateCharCounter('post-excerpt', 'excerpt-counter', 500);
            updateCharCounter('post-meta-desc', 'meta-counter', 160);

            // Update page title
            document.getElementById('page-title').textContent = 'Edit Blog Post';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        Domma.elements.toast('Failed to load post', 'error');
    }
}

/**
 * Save post
 */
async function savePost(event) {
    event.preventDefault();

    try {
        const formData = getFormData();

        // Validate required fields
        if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
            Domma.elements.toast('Please fill in all required fields', 'error');
            return;
        }

        let response;

        if (isEditMode && currentPostId) {
            // Update existing post - use original slug, not the form's slug
            response = await fetch(`${apiUrl}/posts/${originalSlug}`, {
                method: 'PUT',
                headers: AdminAuth.getAuthHeaders(),
                body: JSON.stringify(formData)
            });
        } else {
            // Create new post
            response = await fetch(`${apiUrl}/posts`, {
                method: 'POST',
                headers: AdminAuth.getAuthHeaders(),
                body: JSON.stringify(formData)
            });
        }

        const data = await response.json();

        if (response.ok && data.success) {
            Domma.elements.toast(data.message || 'Post saved successfully', 'success');

            // Clear autosave storage
            const storageKey = `domma:editor:blog-draft-${currentPostId || 'new'}`;
            localStorage.removeItem(storageKey);

            // Redirect to posts list
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            throw new Error(data.message || 'Failed to save post');
        }
    } catch (error) {
        console.error('Error saving post:', error);
        Domma.elements.toast(error.message || 'Failed to save post', 'error');
    }
}

/**
 * Preview post
 */
function previewPost() {
    // Open blog page in new tab
    window.open('/blog/index.html', '_blank');
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

    // Initialise sidebar with badge counts
    AdminSidebar.init('blog', apiUrl);

    // Scan for icons
    Domma.icons.scan();

    // Check if editing existing post
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');
    isEditMode = !!currentPostId;

    // Initialise editor and pillbox
    initEditor();
    initPillbox();

    // Load post if editing
    if (isEditMode && currentPostId) {
        await loadPost(currentPostId);
    }

    // Auto-generate slug from title (only for new posts)
    document.getElementById('post-title').addEventListener('input', (e) => {
        const title = e.target.value;
        const slugInput = document.getElementById('post-slug');

        // Only auto-generate for new posts (not when editing)
        if (!isEditMode && !slugInput.dataset.manuallyEdited) {
            slugInput.value = generateSlug(title);
        }

        updateCharCounter('post-title', 'title-counter', 200);
    });

    // Mark slug as manually edited when user changes it
    document.getElementById('post-slug').addEventListener('input', (e) => {
        e.target.dataset.manuallyEdited = 'true';
    });

    // Character counters
    document.getElementById('post-excerpt').addEventListener('input', () => {
        updateCharCounter('post-excerpt', 'excerpt-counter', 500);
    });

    document.getElementById('post-meta-desc').addEventListener('input', () => {
        updateCharCounter('post-meta-desc', 'meta-counter', 160);
    });

    // Form submission
    document.getElementById('post-form').addEventListener('submit', savePost);

    // Preview button
    document.getElementById('btn-preview').addEventListener('click', previewPost);

    // Warn on unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (editor && editor.isDirty && editor.isDirty()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Initialise on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
