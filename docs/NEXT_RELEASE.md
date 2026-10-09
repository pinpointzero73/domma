# Your own classes on context menu items

**A context menu item can carry its own CSS classes.** Give an item `className` - a string of names or an array - and they are added to its button beside `dm-context-menu-item`, so one item can be styled from your own CSS. The menu-level `className` option already did the same for the whole panel.

- `{label: 'Upgrade', className: 'menu-cta'}` styles a single item.
- Domma CMS uses it for the class box on each context menu item.

<!-- website -->

Context menu items take their own CSS classes through a new `className` option.
