# Field names with quotes validate

- A form field whose name holds a quote, backslash or line break now validates; its error and value selectors are quoted properly.
- The CRUD delete prompt shows a record's name as typed again (1.2.2 showed `&lt;` and `&amp;` literally when DOMPurify was not loaded).

<!-- website -->

Form fields with quotes in their names validate, and the CRUD delete prompt shows names as typed.
