/** Uploading with progress - against a pretend server, as this page has none. */

// Stands in for XMLHttpRequest: reports progress over about two seconds, then answers.
// A file whose name contains "fail" gets a 500.
class PretendUpload {
    constructor(entry) {
        this.entry = entry;
        this.listeners = {};
        this.upload = {listeners: [], addEventListener: (type, fn) => this.upload.listeners.push(fn)};
        this.status = 0;
        this.statusText = '';
        this.responseText = '';
    }

    addEventListener(type, fn) {
        (this.listeners[type] ||= []).push(fn);
    }

    open() {}

    setRequestHeader() {}

    send() {
        const total = this.entry.size || 1;
        let loaded = 0;
        this.timer = setInterval(() => {
            loaded = Math.min(total, loaded + total / 10);
            this.upload.listeners.forEach(fn => fn({lengthComputable: true, loaded, total}));
            if (loaded < total) return;
            clearInterval(this.timer);
            const fails = /fail/i.test(this.entry.name);
            this.status = fails ? 500 : 200;
            this.statusText = fails ? 'Server error' : 'OK';
            this.responseText = JSON.stringify({id: this.entry.id, name: this.entry.name});
            (this.listeners.load || []).forEach(fn => fn());
        }, 200);
    }

    abort() {
        clearInterval(this.timer);
        (this.listeners.abort || []).forEach(fn => fn());
    }
}

export function mount(root) {
    const list = $(root).find('#demo-upload-log');
    const log = (message) => {
        list.find('.sx-dz-empty').remove();
        list.prepend($('<li>').text(D().format('HH:mm:ss') + ' - ' + message));
        list.find('li').filter((i) => i >= 6).remove();
    };

    const uploader = E.dropzone($(root).find('#demo-upload'), {
        upload: {url: '/api/files', xhr: (entry) => new PretendUpload(entry)},
        onSuccess: (entry) => log('Uploaded ' + entry.name),
        onError: (entry, error) => log('Failed ' + entry.name + ': ' + error.message),
        onComplete: (entries) => log('Batch finished (' + entries.length + ' files)')
    });

    const cancel = $(root).find('#demo-upload-cancel');
    const clear = $(root).find('#demo-upload-clear');
    const cancelAll = () => uploader.cancel();
    const clearAll = () => uploader.clear();
    cancel.on('click', cancelAll);
    clear.on('click', clearAll);

    return () => {
        cancel.off('click', cancelAll);
        clear.off('click', clearAll);
        uploader.destroy();     // aborts uploads still running
    };
}
