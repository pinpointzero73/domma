/**
 * Supported 16. alarm - from public/showcase/config/all-components.
 */
export function mount(root) {
    // Update current time for alarm demo
    const showTime = () => $(root).find('#current-time').text(D().format('HH:mm'));
    showTime();
    const clock = setInterval(showTime, 1000);

    return () => clearInterval(clock);
}
