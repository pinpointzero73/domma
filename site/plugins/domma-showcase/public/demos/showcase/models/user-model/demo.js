/**
 * Reactive model - a blueprint with validation.
 *
 * Each input feeds a draft; the demo then tries user.set(field, value). A value
 * the blueprint does not allow makes set() throw, and the message shows under
 * its field - so the model only ever holds valid data, and says why when it
 * refuses. "Model state" reads the model through its tracked() view, so it
 * shows what the model accepted, not what was typed. onChange keeps a log.
 */
export function mount(root) {
    const user = M.create({
        name: {type: 'string', required: true},
        email: {type: 'string', required: true, validate: v => !v || v.includes('@') || 'Must contain @'},
        age: {type: 'number', min: 0, max: 150},
        role: {type: 'string', enum: ['admin', 'user', 'guest'], default: 'user'}
    });
    const draft = {name: M.observable(''), email: M.observable(''), age: M.observable(''), role: M.observable('user')};
    const errors = M.observable({});
    const log = M.observable([]);
    let seq = 0;
    const add = (text, tone = '') => {
        log.value = [{id: ++seq, time: `[${D().format('HH:mm:ss')}]`, text, tone}, ...log.value].slice(0, 30);
    };
    const setError = (field, message) => { errors.value = {...errors.value, [field]: message}; };

    // Try each draft on the model as it changes (not on mount: an empty form is not an error yet).
    const stops = Object.entries(draft).map(([field, obs]) => {
        let first = true;
        return M.effect(() => {
            const raw = obs.value;
            if (first) { first = false; return; }
            const value = field === 'age' ? (raw === '' ? undefined : Number(raw)) : raw;
            M.untracked(() => {
                try {
                    user.set(field, value);
                    setError(field, '');
                } catch (err) {
                    setError(field, String(err.message).replace(/^Validation failed for \w+:\s*/, ''));
                }
            });
        });
    });
    const stopLog = user.onChange(({field, newValue, oldValue}) => add(`${field}: "${oldValue ?? ''}" → "${newValue ?? ''}"`));

    const handle = M.applyBindings({draft, errors, log, state: user.tracked()}, root, {
        methods: {
            validate() {
                const result = user.validate();
                if (result.valid) add('Validation passed - the model holds valid data.', 'text-success');
                else add(`Validation failed: ${Object.entries(result.errors).map(([f, m]) => `${f} (${m})`).join(', ')}`, 'text-danger');
            }
        }
    });

    return () => {
        stops.forEach(stop => stop?.());
        if (typeof stopLog === 'function') stopLog();
        handle.dispose();
    };
}
