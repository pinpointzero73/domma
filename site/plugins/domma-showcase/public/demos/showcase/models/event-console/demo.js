/**
 * Event console - publish/subscribe with M.on / M.emit / M.off.
 *
 * The log is a list in the data, rendered by data-each with text bindings, so
 * whatever you type is shown as text - never parsed as HTML. Every subscription
 * the demo makes is removed on teardown, so Reset starts clean.
 */
export function mount(root) {
    const eventName = M.observable('my:event');
    const eventData = M.observable('{"message": "Hello!"}');
    const log = M.observable([]);
    const handlers = new Map();          // event name -> handler
    const subscribed = M.observable([]);
    let seq = 0;

    const add = (text, tone = '') => {
        log.value = [{id: ++seq, time: `[${D().format('HH:mm:ss')}]`, text, tone}, ...log.value].slice(0, 50);
    };
    const name = () => eventName.value.trim();
    const parsed = () => { try { return JSON.parse(eventData.value); } catch { return eventData.value; } };

    const handle = M.applyBindings({
        eventName, eventData, log,
        subscribedText: M.computed(() => (subscribed.value.length ? subscribed.value.join(', ') : 'nothing yet'))
    }, root, {
        methods: {
            subscribe() {
                const n = name();
                if (!n) return add('Give the event a name first.', 'text-warning');
                if (handlers.has(n)) return add(`Already subscribed to "${n}".`, 'text-warning');
                const handler = (data) => add(`"${n}" received ${JSON.stringify(data)}`, 'models-event-log-event-name');
                handlers.set(n, handler);
                M.on(n, handler);
                subscribed.value = [...handlers.keys()];
                add(`Subscribed to "${n}".`, 'text-success');
            },
            publish() {
                const n = name();
                if (!n) return add('Give the event a name first.', 'text-warning');
                M.emit(n, parsed());
                add(`Published "${n}".`, 'text-info');
            },
            unsubscribe() {
                const n = name();
                if (!handlers.has(n)) return add(`Not subscribed to "${n}".`, 'text-warning');
                M.off(n, handlers.get(n));
                handlers.delete(n);
                subscribed.value = [...handlers.keys()];
                add(`Unsubscribed from "${n}".`, 'text-danger');
            },
            clear() { log.value = []; }
        }
    });

    return () => {
        for (const [n, h] of handlers) M.off(n, h);
        handlers.clear();
        handle.dispose();
    };
}
