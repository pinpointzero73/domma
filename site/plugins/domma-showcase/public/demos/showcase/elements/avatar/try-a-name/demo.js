/**
 * Try a name - from public/showcase/elements/avatar.
 */
export function mount(root) {
        // ---- Try a name --------------------------------------------------------
    const me = E.avatar(root.querySelector('#demo-try-avatar'), {name: 'Jane Smith', size: 'xl'});
    const showTry = () => {
            $(root).find('#demo-try-initials').text(me.initials || '(icon)');
            $(root).find('#demo-try-tone').text(me.tone == null ? '-' : String(me.tone));
        };
    $(root).find('#demo-try-input').on('input', (e) => { me.update({name: e.target.value}); showTry(); });
    showTry();
    ['Madonna', 'jane.smith@example.com', 'Jean-Luc Picard', 'Łukasz Żuk', 'Анна Каренина', '王小明', 'محمد علي']
            .forEach((name) => $(root).find('#demo-try-examples').append(E.avatar({name, title: true}).element));
}
