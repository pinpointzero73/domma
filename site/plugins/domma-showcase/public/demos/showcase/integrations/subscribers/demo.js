/**
 * Subscribers - from public/showcase/integrations.
 */
export function mount(root) {
        // Event Bridge Demo
    let cartCount = 0;
    const cartBadge = $(root).find('#cart-badge');
    const addToCartBtn = $(root).find('#add-to-cart-btn');
    const notificationsContainer = $(root).find('#event-notifications');
    M.subscribe('cart:updated', (data) => {
            cartBadge.text(data.count);

            // Show notification
            const notification = $('<div class="alert alert-success mb-2"></div>')
                .text(`Item added! Cart has ${data.count} item${data.count !== 1 ? 's' : ''}.`)
                .hide()
                .appendTo(notificationsContainer)
                .fadeIn();

            setTimeout(() => {
                notification.fadeOut(() => notification.remove());
            }, 3000);
        });
    addToCartBtn.on('click', () => {
            cartCount++;
            M.publish('cart:updated', { count: cartCount });
        });
}
