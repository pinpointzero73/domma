/**
 * Duration Options - from public/showcase/elements/toast.
 */
export function mount(root) {
        // Duration
    $(root).find('#dur-short').on('click', () => {
            E.toast('Short duration (1 second)', {duration: 1000});
        });
    $(root).find('#dur-medium').on('click', () => {
            E.toast('Medium duration (3 seconds)', {duration: 3000});
        });
    $(root).find('#dur-long').on('click', () => {
            E.toast('Long duration (5 seconds)', {duration: 5000});
        });
    $(root).find('#dur-persist').on('click', () => {
            E.toast('Persistent toast - click X to close', {
                duration: 0,
                type: 'warning'
            });
        });
}
