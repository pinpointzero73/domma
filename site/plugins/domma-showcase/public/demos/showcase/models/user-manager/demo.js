/**
 * User manager - add, edit and remove, all as bindings.
 *
 * One model holds the form fields, the list, the errors and which user is being
 * edited; the bindings read and write it through its tracked() view. The heading and the save button follow the
 * editing field; each row's Edit and Remove call the methods with the row.
 * Names and emails are shown with text bindings, so nothing typed is ever
 * parsed as HTML.
 */
export function mount(root) {
    const model = M.create({
        name: {type: 'string', default: ''},
        email: {type: 'string', default: ''},
        role: {type: 'string', default: 'user'},
        status: {type: 'string', default: 'active'},
        users: {type: 'array', default: []},
        errors: {type: 'object', default: {}},
        editing: {type: 'any', default: null}      // the uid being edited, or null
    });
    const FORM = {name: '', email: '', role: 'user', status: 'active'};
    let seq = 0;

    const resetForm = () => {
        Object.entries(FORM).forEach(([k, v]) => model.set(k, v));
        model.set('errors', {});
        model.set('editing', null);
    };

    // The bindings' data: the model's tracked view (reads tracked, writes through set()),
    // and the handlers - on the data itself, so a list row reaches them as $root.edit.
    const handle = M.applyBindings({
        state: model.tracked(),
        save() {
            const data = {name: model.get('name').trim(), email: model.get('email').trim(), role: model.get('role'), status: model.get('status')};
            const e = {};
            if (!data.name) e.name = 'A name is needed.';
            if (!data.email) e.email = 'An email is needed.';
            else if (!data.email.includes('@')) e.email = 'That is not an email address.';
            model.set('errors', e);
            if (Object.keys(e).length) return false;
            const editing = model.get('editing');
            model.set('users', editing === null
                ? [...model.get('users'), {...data, uid: ++seq}]
                : model.get('users').map(u => (u.uid === editing ? {...data, uid: u.uid} : u)));
            resetForm();
            return false;                      // no page submit
        },
        edit(user) {
            Object.keys(FORM).forEach(k => model.set(k, user[k]));
            model.set('errors', {});
            model.set('editing', user.uid);
        },
        remove(user) {
            model.set('users', model.get('users').filter(u => u.uid !== user.uid));
            if (model.get('editing') === user.uid) resetForm();
        },
        cancel: resetForm,
        async copy() {
            try {
                await _.copyToClipboard(JSON.stringify(model.get('users').map(({uid, ...u}) => u), null, 2));
                E.toast('Users copied as JSON.', {type: 'success'});
            } catch {
                E.toast('Could not copy to the clipboard.', {type: 'error'});
            }
        }
    }, root);

    return () => handle.dispose();
}
