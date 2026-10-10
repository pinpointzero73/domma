/**
 * Example 2: Size Variants - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Size variants
    $(root).find('#demo-factory-small').on('click', () => {
          E.createModal({
            title: 'Small Modal',
            content: '<p>This is a small modal (400px max-width).</p>',
            size: 'small'
          }).open();
        });
    $(root).find('#demo-factory-medium').on('click', () => {
          E.createModal({
            title: 'Medium Modal',
            content: '<p>This is a medium modal (600px max-width).</p>',
            size: 'medium'
          }).open();
        });
    $(root).find('#demo-factory-large').on('click', () => {
          E.createModal({
            title: 'Large Modal',
            content: '<p>This is a large modal (800px max-width).</p>',
            size: 'large'
          }).open();
        });
    $(root).find('#demo-factory-xl').on('click', () => {
          E.createModal({
            title: 'Extra Large Modal',
            content: '<p>This is an extra large modal (1000px max-width).</p>',
            size: 'xl'
          }).open();
        });
}
