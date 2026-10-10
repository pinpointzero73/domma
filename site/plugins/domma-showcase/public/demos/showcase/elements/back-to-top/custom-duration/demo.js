/**
 * Custom Duration - from public/showcase/elements/back-to-top.
 */
export function mount(root) {
        // Duration example
    const durationBtn = E.backToTop(root.querySelector('#duration-btn'), {
            showAfter: 200,
            duration: 600,
            target: '#duration-demo'
        });

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        durationBtn.scroll(200);
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        durationBtn.scroll(1000);
    });
}
