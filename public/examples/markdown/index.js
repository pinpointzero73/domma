/**
 * Markdown Editor Example
 * Demonstrates: Templates, Storage, Utils, DOM manipulation
 */

// State
let lastSaved = null;
let content = '';

// Load saved content on startup
const savedContent = S.get('markdown-content', '');
if (savedContent) {
    $('#markdown-input').val(savedContent);
    content = savedContent;
    lastSaved = S.get('markdown-last-saved', null);
    if (lastSaved) {
        $('#last-saved').text(formatLastSaved(lastSaved));
    }
    renderPreview(content);
}

// Simple markdown parser
function parseMarkdown(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // Headers (must be processed before other formatting)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Horizontal rule
    html = html.replace(/^\-\-\-$/gim, '<hr>');

    // Code blocks (before inline code)
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold (before italic to handle ***)
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^\> (.+)/gim, '<blockquote>$1</blockquote>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Unordered lists (process line by line)
    const lines = html.split('\n');
    let inList = false;
    let result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Unordered list
        if (line.match(/^\- (.+)/)) {
            if (!inList) {
                result.push('<ul>');
                inList = 'ul';
            }
            result.push('<li>' + line.replace(/^\- /, '') + '</li>');
        }
        // Ordered list
        else if (line.match(/^\d+\. (.+)/)) {
            if (inList !== 'ol') {
                if (inList) result.push('</' + inList + '>');
                result.push('<ol>');
                inList = 'ol';
            }
            result.push('<li>' + line.replace(/^\d+\. /, '') + '</li>');
        } else {
            if (inList) {
                result.push('</' + inList + '>');
                inList = false;
            }
            result.push(line);
        }
    }

    if (inList) {
        result.push('</' + inList + '>');
    }

    html = result.join('\n');

    // Paragraphs (convert double newlines to paragraph breaks)
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[123]>)/g, '$1');
    html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ol>)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

    // Single newlines to <br> (except in special blocks)
    html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

    return html;
}

// Render preview
function renderPreview(markdown) {
    const html = parseMarkdown(markdown);

    if (!html || html === '<p></p>') {
        $('#preview-content').html('<p style="color: var(--dm-text-muted); text-align: center; padding: 3rem 0;">Start typing to see the preview...</p>');
    } else {
        $('#preview-content').html(html);
    }
}

// Update stats
function updateStats(text) {
    // Character count
    const charCount = text.length;
    $('#char-count').text(charCount);

    // Word count (split by whitespace, filter empty)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = text.trim().length > 0 ? words.length : 0;
    $('#word-count').text(wordCount);
}

// Format last saved time
function formatLastSaved(timestamp) {
    if (!timestamp) return 'Never';

    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return minutes + ' minute' + (minutes !== 1 ? 's' : '') + ' ago';
    if (hours < 24) return hours + ' hour' + (hours !== 1 ? 's' : '') + ' ago';

    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Save content
function saveContent() {
    S.set('markdown-content', content);
    lastSaved = Date.now();
    S.set('markdown-last-saved', lastSaved);
    $('#last-saved').text(formatLastSaved(lastSaved));
}

// Markdown input handler
$('#markdown-input').on('input', _.debounce(function () {
    content = $(this).val();
    renderPreview(content);
    updateStats(content);
    saveContent();
}, 300));

// Initial stats update
updateStats(content);

// Toolbar actions
$('.toolbar-btn').on('click', function () {
    const action = $(this).attr('data-action');
    const textarea = document.getElementById('markdown-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText = '';
    let newCursorPos = start;

    switch (action) {
        case 'bold':
            newText = beforeText + '**' + (selectedText || 'bold text') + '**' + afterText;
            newCursorPos = start + 2;
            break;
        case 'italic':
            newText = beforeText + '*' + (selectedText || 'italic text') + '*' + afterText;
            newCursorPos = start + 1;
            break;
        case 'heading':
            newText = beforeText + '## ' + (selectedText || 'Heading') + afterText;
            newCursorPos = start + 3;
            break;
        case 'quote':
            newText = beforeText + '> ' + (selectedText || 'Quote') + afterText;
            newCursorPos = start + 2;
            break;
        case 'list':
            newText = beforeText + '- ' + (selectedText || 'List item') + afterText;
            newCursorPos = start + 2;
            break;
        case 'link':
            const linkText = selectedText || 'link text';
            newText = beforeText + '[' + linkText + '](url)' + afterText;
            newCursorPos = start + linkText.length + 3;
            break;
        case 'image':
            newText = beforeText + '![alt text](image-url)' + afterText;
            newCursorPos = start + 2;
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                // Multi-line: code block
                newText = beforeText + '```\n' + selectedText + '\n```' + afterText;
                newCursorPos = start + 4;
            } else {
                // Single-line: inline code
                newText = beforeText + '`' + (selectedText || 'code') + '`' + afterText;
                newCursorPos = start + 1;
            }
            break;
        case 'clear':
            if (confirm('Clear all content? This cannot be undone.')) {
                newText = '';
                newCursorPos = 0;
            } else {
                return;
            }
            break;
        default:
            return;
    }

    content = newText;
    $('#markdown-input').val(newText);
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();

    renderPreview(content);
    updateStats(content);
    saveContent();
});

// Keyboard shortcuts
$('#markdown-input').on('keydown', function (e) {
    // Ctrl+B - Bold
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        $('.toolbar-btn[data-action="bold"]').trigger('click');
    }
    // Ctrl+I - Italic
    else if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        $('.toolbar-btn[data-action="italic"]').trigger('click');
    }
});

// Save button
$('#save-btn').on('click', function () {
    saveContent();

    // Visual feedback
    const $btn = $(this);
    const originalHtml = $btn.html();
    $btn.html('<span data-icon="check" data-icon-size="16"></span> Saved!');
    Domma.icons.scan();

    setTimeout(() => {
        $btn.html(originalHtml);
        Domma.icons.scan();
    }, 2000);
});

// Scan icons on load
Domma.icons.scan();

console.log('Markdown Editor initialized');
