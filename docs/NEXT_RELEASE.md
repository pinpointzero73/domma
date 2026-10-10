# Factory modals show their content and buttons

**`E.createModal()` and `E.showModal()` work again.** Since the modal factory moved onto the `<domma-modal>` component, a modal made from options printed its HTML `content` as text and drew no buttons, so `showModal()`'s promise could never settle from a button. Content now goes in as markup (sanitised when DOMPurify is loaded) and the buttons are drawn.

- `content` is HTML again, shown through the component's body slot - in the page, so your styles and lookups reach it.
- `buttons` are drawn, `onButtonClick` fires, and `showModal()` resolves with the button's id.
- Any Domma web component now keeps options set on it before it is added to the page, rather than replacing them with its defaults.
- The modal container is made again if something removed it from the page.

<!-- website -->

Modals made with `createModal()` / `showModal()` show their HTML content and buttons again.
