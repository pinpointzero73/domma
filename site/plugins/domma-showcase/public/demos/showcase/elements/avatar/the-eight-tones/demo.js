/**
 * The eight tones - from public/showcase/elements/avatar.
 */
export function mount(root) {
        // ---- Tones -------------------------------------------------------------
    const TONE_NAMES = ['Red', 'Orange', 'Amber', 'Green', 'Teal', 'Sky', 'Blue', 'Violet'];
    TONE_NAMES.forEach((label, tone) => {
            const $cell = $('<div class="sx-av-tone"></div>');
            $cell.append(E.avatar({name: label + ' Tone', tone, decorative: true}).element);
            $cell.append($('<span></span>').text(`${tone} - ${label}`));
            $(root).find('#demo-tones').append($cell);
        });
}
