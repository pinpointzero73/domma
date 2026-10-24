# 

<!-- website -->

### Dropzone

`E.dropzone(target, options)` turns an element into a place to drop, browse for or paste files. A real
`<input type="file">` (yours, or one it adds) carries them, so inside a `<form>` the files submit with it - the
input's file list is kept in step with what the area shows. Rules: `accept`, `maxSize`, `minSize`, `maxFiles` and
a cancelable `onBeforeAdd`; refusals fire `reject(entry, 'type' | 'size' | 'count')` and are announced to screen
readers. Images get thumbnails. With `upload: {url, field, headers, data, concurrency}` each file is sent on its own
with a progress bar, automatic `retry`, a Retry button and `cancel()`. A file dropped just outside the area no
longer navigates away from the page while a drag is under way. `F.create` takes `type: 'dropzone'`.

```javascript
E.dropzone('#attachments', {accept: 'image/*,.pdf', maxSize: 5 * 1024 * 1024, maxFiles: 4});
```

### Range slider

`E.rangeSlider(target, options)` (alias `E.slider`) - one value or a `[low, high]` range between two thumbs, with
ticks, labelled marks, a tooltip, vertical orientation and right-to-left support. Full keyboard (arrows, Page Up /
Page Down, Home / End), ARIA sliders with `aria-valuetext` from the `labels` formatter, and pointer dragging with a
touch-sized hit area. Real `<input type="range">` elements carry the value and fire native `input` / `change`, so
forms, `FormData` and model bindings see it. `F.create` takes `type: 'slider'`.

```javascript
E.rangeSlider('#price', {range: true, min: 0, max: 1000, step: 10, value: [100, 600], labels: v => '£' + v});
```

