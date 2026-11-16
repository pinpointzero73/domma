# Table and form text is shown as text

- Sortable table column titles, and the values and labels of select, multiselect, radio and checkbox-group options, are now written as text, so markup in them can no longer run or change the page. Form attribute values (placeholder, pattern, min, max, step, autocomplete, id, name, file accept) are escaped once. CSV export doubles quotes in headers.
- A column title or option label that contains markup or entities now shows them literally. An option with a null value renders `value=""` instead of `"null"`, a missing option label shows its value, and null options are skipped.

<!-- website -->

Table column titles and form option labels are shown as plain text.
