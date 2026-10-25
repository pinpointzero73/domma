/** In an F.create blueprint - a dropzone field whose value is the array of files. */
export function mount(root) {
    const output = $(root).find('#demo-blueprint-output');

    const form = F.create({
        subject: {type: 'string', label: 'Subject', required: true},
        evidence: {
            type: 'dropzone',
            label: 'Evidence',
            required: true,
            formConfig: {accept: 'image/*,.pdf', maxFiles: 3, maxSize: 2 * 1024 * 1024}
        }
    }, {}, {
        submitText: 'Send report',
        onSubmit: (data) => {
            const files = (data.evidence || []).map(f => f.name).join(', ');
            output.text('subject = ' + data.subject + '\nevidence = [' + files + ']');
        }
    });
    const target = $(root).find('#demo-blueprint');
    form.renderTo(target.get(0));

    return () => {
        form.destroy();
        target.empty();
    };
}
