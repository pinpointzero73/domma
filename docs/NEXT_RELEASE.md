# Form wording keeps only simple inline formatting

- Form wording that may hold markup (helper text, checkbox labels and hints, wizard step titles, descriptions and button texts, and form modal titles) is now cleaned to a short list of inline tags: links, bold, italic, code, line breaks and similar. Anything else is reduced to its text, and links keep only safe addresses.
- Also escaped: the dropzone input id, textarea rows, class-name options, section grid columns, the F.crud row id, edit title and delete prompt.

<!-- website -->

Form helper text and labels keep links and simple formatting, and nothing else.
