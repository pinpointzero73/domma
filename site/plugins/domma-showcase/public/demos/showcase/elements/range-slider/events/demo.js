/** Events - beforechange refuses anything above 80; change is logged from the DOM event. */
export function mount(root) {
    const list = $(root).find('#demo-log');
    const log = (message) => {
        list.find('.sx-rs-empty').remove();
        list.prepend($('<li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 8).remove();
    };

    const capped = E.rangeSlider($(root).find('#demo-capped'), {
        labels: (v) => v + ' / 100',
        onBeforeChange: (next) => next <= 80
    });

    // Every event also bubbles as dm:range-slider:<event>, with {instance, args} in detail
    const onChange = (e) => log('change: ' + JSON.stringify(e.detail.args[0]));
    $(root).on('dm:range-slider:change', onChange);

    const disable = $(root).find('#demo-capped-disable');
    const set = $(root).find('#demo-capped-set');
    const flip = () => {
        if (capped.isDisabled()) capped.enable();
        else capped.disable();
        disable.text(capped.isDisabled() ? 'Enable' : 'Disable');
    };
    const setTo25 = () => capped.setValue(25);
    disable.on('click', flip);
    set.on('click', setTo25);

    return () => {
        $(root).off('dm:range-slider:change', onChange);
        disable.off('click', flip);
        set.off('click', setTo25);
        capped.destroy();
    };
}
