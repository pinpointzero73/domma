---
title: Dropzone
description: "Drop, browse or paste files onto an area - checked, previewed and either submitted with the form or uploaded with progress"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Dropzone" tagline="Drop, browse or paste files onto an area - checked, previewed and either submitted with the form or uploaded with progress" align="center"][/hero]

## Overview

`E.dropzone()` turns an element into a place to put files. Drag them onto it, click it (or press Enter / Space) to open the file picker, or paste copied files into it. Each file is checked against the rules you give, shown in a list with a thumbnail for images, and either kept for the form or uploaded on its own with a progress bar.

Underneath there is always a real `<input type="file">` - one you wrote, or one the component adds - so the area works inside an ordinary `<form>`. The input's file list is kept in step with what the area shows, so the form submits exactly those files.

### Key Features

- **Three ways in** - drag and drop, the file picker, and paste
- **Rules** - `accept`, `maxSize`, `minSize`, `maxFiles` and a per-file `onBeforeAdd`
- **Forms** - the files submit with the form; no upload code needed
- **Uploads** - one request per file with progress, concurrency, retry and cancel
- **Accessible** - a real button, keyboard operable, adds and refusals announced
- **Safe** - file names are always text, previews are released when files go

### Basic Usage

```
E.dropzone('#attachments', {
    accept: 'image/*,.pdf',
    maxSize: 5 * 1024 * 1024,      // 5 MB
    maxFiles: 4,
    name: 'attachments'
});
```

## Drop, browse or paste

Drop a few files here, or tab to the area and press Enter. Images get a thumbnail; the × on a row removes it. Copy an image and paste it while the area has focus.

[showcase-demo id="showcase/elements/dropzone/drop-browse-or-paste" title="Drop, browse or paste" /]

```
const dz = E.dropzone('#demo-basic');
dz.on('change', (files) => $('#demo-basic-count').text(files.length + ' files'));
```

## Accept, size and count

This one takes up to three images or PDFs of at most 1 MB each. Anything else is refused with a reason - `'type'`, `'size'` or `'count'` - through `onReject`, and the refusal is read out to screen readers. The hint under the prompt is written from the rules unless you give `labels.hint`.

[showcase-demo id="showcase/elements/dropzone/accept-size-and-count" title="Accept, size and count" /]

```
E.dropzone('#demo-rules', {
    accept: ['image/*', '.pdf'],
    maxSize: 1024 * 1024,
    maxFiles: 3,
    onReject: (entry, reason) => console.log(entry.name, reason),
    // Return false to refuse one file for your own reasons
    onBeforeAdd: (entry) => !entry.name.startsWith('~')
});
```

`accept` reads like the input attribute: extensions (`.pdf`), wildcards (`image/*`) and exact types (`application/json`), as a comma list or an array. Without `multiple` the area holds one file, and a new one replaces it.

## Inside a form

Without `upload`, the files travel with the form. Wrap (or sit next to) your own `<input type="file">` and the component uses it - its `name`, `accept` and `multiple` become the defaults. Add files and press Show to see what `new FormData(form)` holds.

[showcase-demo id="showcase/elements/dropzone/inside-a-form" title="Inside a form" /]

```
<form action="/albums" method="post" enctype="multipart/form-data">
    <div id="photos">
        <input type="file" name="photos" accept="image/*" multiple>
    </div>
    <button>Save</button>
</form>

<script>
    E.dropzone('#photos');
</script>
```

The input's `FileList` is rewritten with a `DataTransfer` after each add and remove (every current browser). Where that is missing, the form's `formdata` event adds the files instead, which covers a normal submit and `new FormData(form)`; code that builds its own request some other way should read `dz.getFiles()`. A form reset empties the list.

## Uploading with progress

Give `upload` and each file is sent on its own as `multipart/form-data`, two at a time by default, with a progress bar. A failed file can be retried; the × on a file that is still sending cancels it. This page has no server, so the demo passes a pretend request through `upload.xhr` - files whose name contains "fail" fail.

[showcase-demo id="showcase/elements/dropzone/uploading-with-progress" title="Uploading with progress" /]

```
E.dropzone('#demo-upload', {
    upload: {
        url: '/api/files',
        field: 'file',                       // the FormData field name
        headers: {'X-CSRF-Token': token},    // or (entry) => ({...})
        data: (entry) => ({folder: 'inbox'}),
        concurrency: 2,
        withCredentials: false
    },
    autoUpload: true,                        // false: call dz.upload() yourself
    retry: 1,                                // automatic retries per file
    onProgress: (entry, percent) => {},
    onSuccess: (entry, response) => {},      // JSON is parsed for you
    onError: (entry, error) => {},           // {status, message, response}
    onComplete: (entries) => {}
});
```

Uploads use `XMLHttpRequest` rather than `H`: `H` is built on `fetch()`, which reports no upload progress. With `upload` set, the input is kept empty so a surrounding form does not send the files a second time.

## Your own content and a list elsewhere

Anything already in the element is kept in place of the default prompt. `list` sends the file list to another element; `disable()` / `enable()` switch it off and on.

[showcase-demo id="showcase/elements/dropzone/your-own-content-and-a-list-elsewhere" title="Your own content and a list elsewhere" /]

```
const avatar = E.dropzone('#demo-custom', {
    accept: 'image/*',
    multiple: false,
    list: '#demo-custom-list',
    labels: {added: 'Picture chosen: {name}'}
});
avatar.disable();
```

## In an F.create blueprint

`type: 'dropzone'` gives a form field whose value is the array of files. `formConfig` takes the dropzone's options, and `required` means at least one file.

[showcase-demo id="showcase/elements/dropzone/in-an-f-create-blueprint" title="In an F.create blueprint" /]

```
const form = F.create({
    subject: {type: 'string', label: 'Subject', required: true},
    evidence: {
        type: 'dropzone',
        label: 'Evidence',
        required: true,
        formConfig: {accept: 'image/*,.pdf', maxFiles: 3, maxSize: 2 * 1024 * 1024}
    }
}, {}, {onSubmit: (data) => console.log(data.evidence)});   // [File, ...]
form.renderTo('#demo-blueprint');

form.destroy();     // removes the dropzone with the form
```

## API

### Methods

- `getFiles()` - the File objects shown; `getEntries()` - with status, progress and response
- `addFiles(fileList)`, `removeFile(id | entry | file)`, `clear()`
- `browse()` - open the file picker
- `upload()`, `retry(id?)`, `cancel(id?)`
- `enable()`, `disable()`, `isDisabled()`, `destroy()`

### Events

Each is an `onX` option, an `.on('x')` listener and a bubbling `dm:dropzone:x` DOM event. They get the file's entry `{id, file, name, size, type, status, progress, response, error}`.

- `beforeadd(entry)` - return `false` to refuse it
- `add(entry)`, `remove(entry)`, `reject(entry, 'type' | 'size' | 'count')`
- `change(files)` - after any add or remove
- `uploadstart(entry)`, `progress(entry, percent)`, `success(entry, response)`, `error(entry, error)`, `complete(entries)`

This one takes images only; it logs its own add, remove and change events, and a refusal through the DOM event.

[showcase-demo id="showcase/elements/dropzone/events" title="Events" /]

```
const dz = E.dropzone('#demo-events', {accept: 'image/*'});
dz.on('add', (entry) => log('add: ' + entry.name));
dz.on('change', (files) => log('change: ' + files.length + ' file(s)'));

// detail = {instance, args}
$('#demo-events').on('dm:dropzone:reject', (e) => {
    const [entry, reason] = e.detail.args;
    log(entry.name + ' refused (' + reason + ')');
});
```
