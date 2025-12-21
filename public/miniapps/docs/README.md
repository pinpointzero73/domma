# Domma Docs - Document Editor MiniApp

A fully-featured document editor miniapp built with the Domma framework. Create, edit, and manage multiple documents
with rich text formatting, auto-save, and export capabilities.

## Features

### Core Functionality

- ✅ **Multiple Document Management** - Create, view, edit, and delete documents
- ✅ **Rich Text Editor** - WYSIWYG editing with formatting toolbar
- ✅ **Auto-Save** - Dual persistence (localStorage + backend)
- ✅ **Draft Recovery** - Restore unsaved changes after crashes
- ✅ **Export** - PDF (print), HTML (download), Markdown (download)
- ✅ **Search & Filter** - Find documents by title or content
- ✅ **Authentication** - JWT-based login/register system

### User Experience

- ✅ **Responsive Design** - Mobile, tablet, and desktop optimised
- ✅ **Dark Theme Support** - Follows system/user preferences
- ✅ **Keyboard Shortcuts** - Ctrl+S (save), Ctrl+E (export)
- ✅ **Real-time Stats** - Word and character count
- ✅ **Save Indicator** - Visual feedback (typing, saving, saved, error)
- ✅ **Offline Cache** - Works without network (localStorage fallback)

## File Structure

```
/public/miniapps/docs/
├── index.html          # Main HTML with inline CSS (660 lines)
├── src/
│   └── app.js          # Application logic (~1000 lines)
├── dist/
│   └── app.min.js      # Built bundle (15KB, generated)
└── README.md           # This file
```

## Build

### Development Build

```bash
npm run build:miniapps
# or
node scripts/build-miniapp.js
```

**Output:**

- `/public/miniapps/docs/dist/app.min.js` (15KB minified)
- API URL: `http://localhost:3000/api`

### Production Build

```bash
NODE_ENV=production npm run build:miniapps
```

**Output:**

- Same file, but API URL: `/api` (relative)
- Console logs stripped (`console.log`, `console.debug`)

## Architecture

### Three-Tier State Management

1. **In-Memory State** (Runtime)
    - Current document ID
    - Document list array
    - Editor instance
    - UI state

2. **LocalStorage** (Offline Persistence)
    - `domma-docs:draft:{docId}` - Draft content with timestamp
    - `domma-docs:list-cache` - Cached document list
    - Auto-cleared when successfully saved to backend

3. **Backend API** (Source of Truth)
    - MySQL database
    - JWT authentication
    - RESTful endpoints (see below)

### Auto-Save Strategy

```
User types → Typing indicator
         ↓
    2s debounce → Save to localStorage (instant)
         ↓
    5s debounce → Save to backend API
         ↓
    Success → Clear draft, update indicator
```

**Conflict Resolution:**

- Compare localStorage timestamp vs backend `updated_at`
- If localStorage is newer: show "Restore draft?" modal
- User chooses to restore or discard

### Component Hierarchy

```
DocsApp (window.DocsApp)
├── AuthSection
│   ├── Login Form (email, password)
│   └── Register Form (name, email, password)
└── AppSection
    ├── DocumentListView
    │   ├── Header (New Doc button, user info, logout)
    │   ├── Search Bar (filters documents client-side)
    │   └── Document Grid (card-based list)
    └── EditorView
        ├── Editor Header (Back button, title editor, actions menu)
        ├── Editor Toolbar (Domma.elements.editor built-in)
        ├── Editor Content (contentEditable area)
        └── Editor Footer (save indicator, word/char count)
```

## Backend API

All endpoints require `Authorization: Bearer <token>` header (except auth endpoints).

### Authentication

- `POST /api/auth/register` - Create account (email, password, name)
- `POST /api/auth/login` - Get JWT token (email, password)

### Documents

- `GET /api/documents` - List user's documents
- `GET /api/documents/:id` - Get single document
- `POST /api/documents` - Create document (title, content)
- `PUT /api/documents/:id` - Update document (title, content)
- `DELETE /api/documents/:id` - Delete document

**Response Format:**

```json
{
  "success": true,
  "document": {
    "id": 123,
    "user_id": 456,
    "title": "My Document",
    "content": "<p>Rich HTML content</p>",
    "created_at": "2025-12-19T10:00:00.000Z",
    "updated_at": "2025-12-19T10:30:00.000Z"
  }
}
```

## Testing Checklist

### 1. Authentication ⏳ In Progress

- [ ] Register new account
    - Navigate to `http://localhost/miniapps/docs/`
    - Click "Register" tab
    - Fill in name, email, password
    - Submit form
    - Should see document list view
- [ ] Login with existing account
    - Click "Login" tab
    - Enter email and password
    - Should redirect to document list
- [ ] Logout
    - Click logout button in header
    - Should return to auth screen
    - Should clear localStorage
- [ ] Token expiry handling
    - Wait for token to expire (or manually clear in dev tools)
    - Make any action (e.g., create document)
    - Should show "Session expired" message
    - Should return to login screen
- [ ] Session persistence
    - Login successfully
    - Refresh page
    - Should remain logged in

### 2. Document List ⏳ Pending

- [ ] Load documents from backend
    - Should show list of user's documents
    - Should cache to localStorage
- [ ] Empty state
    - Delete all documents
    - Should show "No documents yet" message
- [ ] Create new document
    - Click "New Document" button
    - Enter title in prompt
    - Should create and open document
    - Should appear in list
- [ ] Search documents
    - Type in search bar
    - Should filter by title and content
    - Should show "No results" if not found
- [ ] Document cards
    - Should show title, preview, timestamp
    - Timestamp should be relative (e.g., "5 minutes ago")
    - Should have delete button

### 3. Editor ⏳ Pending

- [ ] Open document
    - Click on document card
    - Should load content in editor
    - Should show title in header
- [ ] Edit content
    - Type in editor
    - Should show "Typing..." indicator
    - After 2s: should show "Saving..."
    - After 5s: should show "Saved X seconds ago"
- [ ] Edit title
    - Click title field
    - Change title
    - Should auto-save after 2s
- [ ] Draft recovery
    - Start editing document
    - Close browser before auto-save completes
    - Reopen same document
    - Should show "Restore draft?" modal
    - Click "Yes" - should restore content
    - Click "No" - should load backend version
- [ ] Formatting toolbar
    - Bold, italic, underline, strikethrough
    - Headings (H1, H2, H3)
    - Lists (ordered, unordered)
    - Blockquote, link, image, code
    - Undo, redo
- [ ] Word/character count
    - Type in editor
    - Should update in real-time
    - Should count correctly

### 4. Export ⏳ Pending

- [ ] Export as PDF
    - Click actions button
    - Type "pdf" in prompt
    - Should open print dialog
    - Should include document title and content
- [ ] Export as HTML
    - Click actions button
    - Type "html" in prompt
    - Should download HTML file
    - Open in browser - should render correctly
- [ ] Export as Markdown
    - Click actions button
    - Type "markdown" or "md" in prompt
    - Should download .md file
    - Open in text editor - should have proper Markdown syntax

### 5. Delete & Navigation ⏳ Pending

- [ ] Delete from list
    - Click delete button on card
    - Should show confirmation modal
    - Click "Yes" - should remove from list and backend
    - Click "No" - should cancel
- [ ] Delete from editor
    - Open document
    - Click actions → type "delete"
    - Should confirm and return to list
- [ ] Back button
    - Open document
    - Click back button
    - If unsaved changes: should show warning
    - Should return to document list
- [ ] Browser back button
    - Open document
    - Edit content (don't save)
    - Click browser back button
    - Should show "You have unsaved changes" warning

### 6. Keyboard Shortcuts ⏳ Pending

- [ ] Ctrl+S (Save)
    - Edit document
    - Press Ctrl+S (Cmd+S on Mac)
    - Should immediately save to backend
- [ ] Ctrl+E (Export)
    - Open document
    - Press Ctrl+E (Cmd+E on Mac)
    - Should open export menu

### 7. Edge Cases ⏳ Pending

- [ ] Network failure during save
    - Disconnect network
    - Edit document
    - Should show "Save failed - retry" message
    - Reconnect network
    - Click retry - should save successfully
- [ ] Large document (10,000+ characters)
    - Create/paste large content
    - Should handle without performance issues
- [ ] Concurrent editing (multiple tabs)
    - Open same document in 2 tabs
    - Edit in tab 1, save
    - Edit in tab 2, save
    - Last save should win (eventual consistency)
- [ ] Session expiry during editing
    - Start editing document
    - Wait for token to expire
    - Try to save
    - Should save draft to localStorage
    - Should show login modal
    - After re-login, should restore from draft
- [ ] Empty title/content
    - Create document with empty title
    - Should use "Untitled Document"
    - Create document with no content
    - Should show placeholder "Start writing..."

### 8. Responsive Design ⏳ Pending

- [ ] Desktop (1920x1080)
    - 3-column document grid
    - Full toolbar visible
- [ ] Tablet (768x1024)
    - 2-column document grid
    - Full toolbar visible
- [ ] Mobile (375x667)
    - 1-column document grid
    - Compact toolbar (may wrap)

### 9. Accessibility ⏳ Pending

- [ ] Keyboard navigation
    - Tab through form fields
    - Tab through document cards
    - Tab through toolbar buttons
- [ ] Screen reader support
    - ARIA labels on buttons
    - Announcements for save status
- [ ] Focus management
    - Focus trapped in modals
    - Focus restored after modal close

### 10. Performance ⏳ Pending

- [ ] Initial load time
    - Should load < 2 seconds
- [ ] Document list rendering
    - 100+ documents should render smoothly
- [ ] Editor performance
    - Typing should feel instant
    - No lag during formatting

## Technology Stack

**Frontend:**

- **Framework:** Domma v0.8.0+ (zero dependencies)
- **Editor:** `Domma.elements.editor()` (built-in WYSIWYG)
- **Auth:** `Domma.auth` (JWT-based)
- **Storage:** `Domma.storage` (S) - localStorage wrapper
- **DOM:** `Domma` ($) - jQuery-compatible
- **Utilities:** `Domma.utils` (_) - Lodash-compatible
- **Dates:** `Domma.dates` (D) - Moment-style

**Backend:**

- **Framework:** Fastify (Node.js)
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **API:** RESTful endpoints

**Build:**

- **Bundler:** Rollup
- **Format:** IIFE (Immediately Invoked Function Expression)
- **Minification:** Terser
- **Environment:** Build-time variable replacement

## Development Tips

### Debugging

```javascript
// Check auth state
Domma.auth.isAuthenticated()
Domma.auth.getUser()
Domma.auth.getToken()

// Check app state
DocsApp.documents  // Document list
DocsApp.currentDocId  // Currently open document
DocsApp.editor  // Editor instance

// Check localStorage
S.get('domma-docs:list-cache')  // Cached documents
S.get('domma-docs:draft:123')  // Draft for document 123
```

### Common Issues

**"Domma not defined"**

- Ensure `domma.min.js` loads before `app.min.js`
- Check browser console for 404 errors

**"Failed to load documents"**

- Check backend server is running on port 3000
- Check browser console for CORS errors
- Verify API_URL in built bundle

**"Auto-save not working"**

- Check browser console for errors
- Verify token is valid (not expired)
- Check network tab for 401/403 errors

**"Draft not recovering"**

- Check localStorage in dev tools
- Verify timestamp comparison logic
- Check if draft exists before backend fetch

## Future Enhancements

### Planned Features

- [ ] Real-time collaboration (multiple users)
- [ ] Version history (track changes)
- [ ] Document sharing (public links)
- [ ] Folders/tags (organisation)
- [ ] Templates (starter documents)
- [ ] Image uploads (to backend)
- [ ] Spell checker (browser API)
- [ ] Document encryption (client-side)

### Potential Improvements

- [ ] Offline mode (Service Worker)
- [ ] Conflict resolution UI (merge changes)
- [ ] Document locking (prevent concurrent edits)
- [ ] Activity log (audit trail)
- [ ] Keyboard shortcut customisation
- [ ] Custom themes
- [ ] Document comments/annotations

## License

Part of the Domma framework project.
© 2025 Darryl Waterhouse & DCBW-IT

## Support

For issues or questions:

- Check browser console for errors
- Verify backend server is running
- Check network tab for API errors
- Review this README for common issues

---

**Status:** ✅ Foundation Complete | ⏳ Testing in Progress
**Version:** 1.0.0
**Last Updated:** 2025-12-19
