#!/usr/bin/env node
/** Build the showcase's page and method descriptions from maintained source. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as acorn from 'acorn';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PAGES = path.join(ROOT, 'scripts/site-migrate/pages/showcase');
const OUT = path.join(ROOT, 'site/plugins/domma-showcase/public/reference-catalogue.js');
const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const pages = {};
for (const file of walk(PAGES).filter(p => p.endsWith('.md'))) {
    const content = fs.readFileSync(file, 'utf8');
    const value = key => (new RegExp(`^${key}: (.*)$`, 'm').exec(content)?.[1] || '').replace(/^['"]|['"]$/g, '');
    const id = path.relative(PAGES, file).replace(/\.md$/, '').replace(/\/index$/, '').replace(/^index$/, '');
    pages[id] = {title: value('title'), description: value('description')};
}

const methods = {};
const available = {};
for (const module of ['utils', 'dom', 'storage', 'dates', 'models', 'tables', 'icons', 'http']) {
    const file = path.join(ROOT, 'src', `${module}.js`);
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    const comments = [];
    const ast = acorn.parse(source, {ecmaVersion: 'latest', sourceType: 'module', onComment: comments});
    const descriptions = {};
    const names = new Set();
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if ((node.type === 'Property' && (node.method || /Function/.test(node.value?.type))) || node.type === 'MethodDefinition') {
            const name = node.key.name || node.key.value;
            if (name && !String(name).startsWith('_')) names.add(name);
            const comment = comments.filter(c => c.type === 'Block' && c.end < node.start && !source.slice(c.end, node.start).trim()).at(-1);
            if (name && !String(name).startsWith('_') && comment) {
                const text = comment.value.split('\n').map(l => l.replace(/^\s*\*\s?/, '').trim()).filter(l => l && !l.startsWith('@')).join(' ');
                const sentence = text.split(/(?<=\.)\s+(?=[A-Z])/)[0].replace(/`/g, '');
                if (sentence) descriptions[name] = sentence;
            }
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
        }
    }
    visit(ast);
    methods[module] = descriptions;
    available[module] = [...names];
}
// Date's chainable methods have no per-method doc comments; these follow dates.js.
Object.assign(methods.dates, {
    add: 'Move a date forward by a number of days, months or other units.',
    subtract: 'Move a date back by a number of days, months or other units.',
    startOf: 'Move to the beginning of a day, week, month or year.',
    endOf: 'Move to the end of a day, week, month or year.',
    set: 'Change one part of a date, such as its month or year.',
    clone: 'Create an independent copy of a date.',
    format: 'Turn a date into text using formatting tokens.',
    isBefore: 'Check whether this date comes before another date.',
    isAfter: 'Check whether this date comes after another date.',
    isSame: 'Compare dates, optionally at the precision of a chosen unit.',
    isBetween: 'Check whether a date falls between two other dates.',
    diff: 'Measure the difference between dates in a chosen unit.',
    isValid: 'Check that a value represents a valid date.',
    toDate: 'Return a native JavaScript Date.',
    toISOString: 'Return a date in the standard ISO timestamp format.',
    unix: 'Return the number of seconds since the Unix epoch.',
    valueOf: 'Return the timestamp in milliseconds.',
    year: 'Read or change the year.', month: 'Read or change the zero-based month.',
    date: 'Read or change the day of the month.', day: 'Read or change the day of the week.',
    hour: 'Read or change the hour.', minute: 'Read or change the minute.',
    second: 'Read or change the second.', millisecond: 'Read or change the millisecond.',
    fromNow: 'Describe how far a date is from the current time.',
    from: 'Describe how far a date is from another date.',
    daysInMonth: 'Count the days in the month containing this date.',
    isLeapYear: 'Check whether the year has an extra day in February.'
});
Object.assign(methods.dates, {
    dayOfYear: 'Read the date’s position within its year.',
    week: 'Read the week number within the year.',
    quarter: 'Read which quarter of the year contains this date.',
    to: 'Describe the relative time from this date to another date.',
    min: 'Choose the earliest date from a collection.', max: 'Choose the latest date from a collection.',
    now: 'Read the current timestamp in milliseconds.', parse: 'Create a date from a string, timestamp or native Date.'
});
Object.assign(methods.utils, {uniqueId: 'Create a unique identifier with an optional prefix.'});
available.utils.push('uniqueId');
for (const event of ['click','dblclick','mouseenter','mouseleave','mouseover','mouseout','mousemove','mousedown','mouseup','focus','blur','change','submit','keydown','keyup','keypress','scroll','resize','load']) methods.dom[event] = `Attach a handler for the ${event} event, or trigger it without a handler.`;
Object.assign(methods.dom, {map: 'Transform each selected element into a new value.', slice: 'Select a portion of the current collection.'});
methods.dom.length = 'Read how many elements are in the selected collection.';
Object.assign(methods.models, {
    subscribe: 'Listen for an event published by another part of the page.',
    on: 'Attach a handler to a named event.',
    unsubscribe: 'Stop listening for a named event.',
    off: 'Remove an event handler.',
    publish: 'Send data to listeners of a named event.',
    emit: 'Publish a named event to its listeners.',
    once: 'Handle an event once, then stop listening.'
});
Object.assign(methods.tables, {
    setData: 'Replace the table’s records and refresh its view.', getData: 'Read the records on the current page.',
    addRow: 'Append a record to the table.', addRows: 'Append several records to the table.',
    updateRow: 'Change the values in an existing record.', removeRow: 'Remove one record from the table.',
    removeRows: 'Remove several records from the table.', clear: 'Remove every record from the table.', refresh: 'Render the table again.',
    sort: 'Sort the table by a column.', sortMultiple: 'Sort by several columns in priority order.', clearSort: 'Remove the active sorting.',
    search: 'Search records across the table.', filter: 'Keep records matching a condition.', filterBy: 'Filter records by a field value.', clearFilters: 'Show records without the active filters.',
    page: 'Move to a numbered page.', pageSize: 'Change how many records appear on a page.', nextPage: 'Move to the next page.', prevPage: 'Move to the previous page.', firstPage: 'Move to the first page.', lastPage: 'Move to the last page.',
    select: 'Select a record.', deselect: 'Clear the selection of a record.', selectAll: 'Select every available record.', deselectAll: 'Clear all selected records.', toggleSelect: 'Switch a record between selected and unselected.', getSelected: 'Read the selected records.', getSelectedIndices: 'Read the positions of selected records.',
    showColumn: 'Make a hidden column visible.', hideColumn: 'Hide a column.', toggleColumn: 'Switch a column’s visibility.', getColumns: 'Read the table’s column definitions.', getVisibleColumns: 'Read the visible columns.', getHiddenColumns: 'Read the hidden columns.',
    toCSV: 'Export records as comma-separated values.', toJSON: 'Export records as JSON.', toExcel: 'Export records for use in a spreadsheet.', download: 'Download the exported table data.', copyToClipboard: 'Copy the table data to the clipboard.',
    on: 'Listen for a table event.', off: 'Remove a table event handler.', once: 'Listen for a table event once.'
});
Object.assign(methods.tables, {pageInfo: 'Read the current page, page size and record counts.'});
methods['models/reactivity'] = {
    computed: 'Keep a derived value in sync with the values it reads.',
    observable: 'Store a value that notifies its dependants when it changes.',
    observableArray: 'Track changes to a collection of values.',
    effect: 'Run a function again when the values it reads change.',
    untracked: 'Read a value without recording a dependency.',
    flushSync: 'Apply pending reactive updates immediately.',
    applyBindings: 'Connect reactive values to the elements on a page.',
    get: 'Read a reactive value and track the dependency.',
    peek: 'Read a reactive value without tracking the dependency.',
    dispose: 'Release subscriptions when a computation or effect is no longer needed.',
    value: 'Read or change the value of an observable.', length: 'Read how many items are in a collection.',
    remove: 'Remove matching items from an observable collection.', removeAll: 'Clear items from an observable collection.',
    flush: 'Apply pending reactive updates.', tracked: 'Read model fields while recording which fields are used.'
};
methods['elements/timeline'] = {
    setItems: 'Replace the timeline’s items.', addItem: 'Append an item to the timeline.',
    getItems: 'Read a copy of the current items.', setLayout: 'Choose a vertical or horizontal timeline.',
    refresh: 'Render the timeline again.'
};
fs.writeFileSync(OUT, `// Generated by scripts/site-migrate/showcase-catalogue.mjs from page metadata and source comments.\nexport const pages = ${JSON.stringify(pages, null, 4)};\nexport const methods = ${JSON.stringify(methods, null, 4)};\nexport const available = ${JSON.stringify(available, null, 4)};\n`);
console.log(`Showcase catalogue: ${Object.keys(pages).length} pages, ${Object.values(methods).reduce((n, m) => n + Object.keys(m).length, 0)} method descriptions.`);
