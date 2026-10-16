# Keep the email caret in its editor

- Fix smooth carets attached before an editor is mounted, including the email compose body. Resolve the caret layer's positioning parent when the focused editor is ready to draw, so the caret stays beside the text instead of at the top of the compose window.
- Preserve native selection, formatting and scrolling, and restore the parent's original positioning when the caret is removed.

<!-- website -->
<p>Fix the disappearing email-body caret when a rich editor is assembled before its compose window opens.</p>
