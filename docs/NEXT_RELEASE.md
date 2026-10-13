# Attribute values in reactive lists read as typed

Bundles domma-reactive 1.3.1: a placeholder inside an ordinary attribute of a `data-each` row (`title="{{name}}"`, `aria-label="Actions for {{title}}"`, `data-*`) is no longer escaped twice, so a name with `&`, `<` or quotes shows as typed in tooltips, screen-reader labels and data attributes.

<!-- website -->
<p>Bundles domma-reactive 1.3.1: names with <code>&amp;</code>, <code>&lt;</code> or quotes now read correctly in the tooltips and screen-reader labels of reactive list rows.</p>
