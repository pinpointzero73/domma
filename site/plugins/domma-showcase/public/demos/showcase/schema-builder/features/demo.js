/**
 * Features - from public/showcase/schema-builder.
 */
export function mount(root) {
        // Apply stagger animation to feature cards
    $('.page-roller-feature-card').each((index, card) => {
            $(card).css('animation-delay', `${index * 0.1}s`);
        });
}
