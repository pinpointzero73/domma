# Modal footer follows the theme

The `<domma-modal>` footer used `--dm-surface-subtle`, a token no theme defines, so it fell back to white and showed a white bar in dark themes. It now uses `--dm-surface-secondary`, which every theme sets.

<!-- website -->
<p>The modal footer now follows the theme, so dark themes no longer show a white bar at the bottom of dialogs.</p>
