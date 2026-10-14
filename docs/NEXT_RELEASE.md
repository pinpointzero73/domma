# Required selects start empty

A required select in a Forma form with no value now opens on a "-- Select --" placeholder that cannot be picked again. Before, the browser showed the first option as chosen while the form's value stayed empty, so anyone who wanted that first option left the select alone and the form was refused as incomplete. A select given a value, an optional select and a multiple select are unchanged.

<!-- website -->
<p>Required dropdowns in generated forms start on a placeholder, so the first option is never shown as picked when nothing has been chosen.</p>
