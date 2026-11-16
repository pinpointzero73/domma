/**
 * A form's own wording (helper line, checkbox label, wizard step text, modal
 * title) may hold a few inline tags and nothing else.
 */
import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';
import {cleanInline} from './inline-html.js';

const F = Domma.forms;
let host;

beforeEach(() => {
    document.body.replaceChildren();
    host = document.createElement('div');
    document.body.appendChild(host);
});

describe('cleanInline', () => {
    it('keeps plain text as typed', () => {
        expect(cleanInline('Fish and chips')).toBe('Fish and chips');
        expect(cleanInline('a "quoted" word')).toBe('a &quot;quoted&quot; word');
        expect(cleanInline(null)).toBe('');
        expect(cleanInline(5)).toBe('5');
    });

    it('keeps the inline tags and reads entities once', () => {
        expect(cleanInline('I agree to the <a href="/terms" target="_blank" class="x" onclick="x()">terms</a> &amp; <strong>rules</strong><br>')).toBe(
            'I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">terms</a> &amp; <strong>rules</strong><br>');
        expect(cleanInline('Fish & chips <em>today</em>')).toBe('Fish &amp; chips <em>today</em>');
        expect(cleanInline('<abbr title="a &quot;b&quot;">x</abbr>')).toBe('<abbr title="a &quot;b&quot;">x</abbr>');
    });

    it('gives another element way to its text, and drops script-like ones whole', () => {
        expect(cleanInline('<p>One</p><div><b>Two</b></div><h1>Three</h1>')).toBe('One<b>Two</b>Three');
        expect(cleanInline('a<script>alert(1)</script><style>x{}</style><iframe srcdoc="<b>x</b>"></iframe><svg><a href="/x">y</a></svg>b')).toBe('ab');
        expect(cleanInline('<img src=x onerror=alert(1)>ok<!-- c -->')).toBe('ok');
    });

    it('refuses a link that would run something', () => {
        for (const href of ['javascript:alert(1)', 'java\tscript:alert(1)', ' JaVaScRiPt:alert(1)', 'data:text/html,<script>1</script>', 'vbscript:x', 'blob:x']) {
            const out = cleanInline(`<a href="${href.replace(/"/g, '&quot;')}">x</a>`);
            expect(out, href).toBe('<a>x</a>');
        }
        expect(cleanInline('<a href="mailto:a@example.com">m</a><a href="#top">t</a><a href="https://example.com/?a=1&amp;b=2">h</a>'))
            .toBe('<a href="mailto:a@example.com">m</a><a href="#top">t</a><a href="https://example.com/?a=1&amp;b=2">h</a>');
    });

    it('lets nothing through that a second parse would read differently', () => {
        const tricky = [
            '<a title="</a><img src=x onerror=1>">x</a>',
            '<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;img src=1 onerror=alert(1)&gt;">',
            '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
            '<svg></p><style><a id="</style><img src=1 onerror=alert(1)>">',
            '<form><math><mtext></form><form><mglyph><style></math><img src onerror=alert(1)>',
            '<b <script>alert(1)</script>>x</b>',
            '<<b>script>alert(1)<</b>/script>',
            '&lt;img src=x onerror=alert(1)&gt;',
            '<a href="/x" title=\'"><img src=x onerror=1>\'>t</a>'
        ];
        for (const input of tricky) {
            const once = cleanInline(input);
            const probe = document.createElement('div');
            probe.innerHTML = once;
            expect(probe.querySelector('img, script, style, svg, math, iframe, form, [onerror], [onclick]'), input).toBeNull();
            expect(cleanInline(once), input).toBe(once);
        }
    });

    it('drops a form whole, so a control cannot stand in for the form\'s own properties', () => {
        for (const name of ['childNodes', 'nodeType', 'localName', 'namespaceURI']) {
            expect(cleanInline(`a<form><input name=${name}><input name=${name}><img name=${name}>x</form>b`)).toBe('ab');
            expect(cleanInline(`a<form><input name=${name}>x<b>y</b><script>S</script></form>b`), name).toBe('ab');
            expect(cleanInline(`a<form><object name=${name}></object><output name=${name}></output><fieldset name=${name}>F</fieldset>T</form>b`), name).toBe('ab');
        }
    });

    it('shows very long input as typed rather than parsing it, and survives an odd value', () => {
        const long = '<div>'.repeat(5000) + '<img src=x onerror=1>T';
        const out = cleanInline(long);
        expect(out).not.toContain('<');
        expect(out).toContain('&lt;img');
        expect(cleanInline(Object.create(null))).toBe('');
    });

    it('does not bring back dropped content past the depth limit', () => {
        expect(cleanInline('<b>'.repeat(40) + 'deep<script>S</script><style>T</style>')).not.toMatch(/[ST]/);
    });

    it('keeps the words of markup nested too deep to follow', () => {
        const deep = '<b>'.repeat(200) + 'deep' + '</b>'.repeat(200);
        const out = cleanInline(deep);
        expect(out).toContain('deep');
        expect((out.match(/<b>/g) || []).length).toBeLessThanOrEqual(40);
    });
});

describe('remaining attributes', () => {
    const BRK = 'x"><img src=x onerror="window.__hit=1" x="';

    it('a dropzone name, textarea rows and class-name options cannot add markup', () => {
        F.render(host, {
            [BRK]: {type: 'dropzone'},
            t: {type: 'textarea', formConfig: {rows: '3"></textarea><img src=x onerror=1><textarea x="', helperText: 'h', hint: 'i'}}
        }, {}, {sections: [{title: 'S', layout: 'grid', columns: '2"><img src=x onerror=1>', fields: ['t']}], helperClassName: BRK, hintClassName: BRK, fieldClassName: BRK, labelClassName: BRK, errorClassName: BRK, className: BRK});
        expect(host.querySelector('img, [onerror]')).toBeNull();
        expect(host.querySelectorAll('textarea').length).toBe(1);
    });
});

describe('form wording', () => {
    const EVIL = '<img src=x onerror="window.__hit=1"><script>window.__hit=2</script>';

    it('a checkbox label, its hint and a helper line keep a link and lose the rest', () => {
        F.render(host, {
            ok: {type: 'boolean', label: `I agree to the <a href="/terms">terms</a>${EVIL}`, required: true, formConfig: {hint: `<em>needed</em>${EVIL}`}},
            n: {type: 'string', label: 'Name', formConfig: {helperText: `As on your <strong>passport</strong>${EVIL}`}}
        }, {}, {});
        expect(host.querySelector('img, script, [onerror]')).toBeNull();
        expect(host.querySelector('.form-check-label a').getAttribute('href')).toBe('/terms');
        expect(host.querySelector('.form-check-label .text-danger')).not.toBeNull();
        expect(host.querySelector('.form-check em').textContent).toBe('needed');
        expect(host.querySelector('[data-field="n"] strong').textContent).toBe('passport');
    });

    it('a wizard step title, description and button texts are cleaned', () => {
        F.wizard(host, {schema: {steps: [
            {title: `One <em>of two</em>${EVIL}`, description: `See <a href="javascript:alert(1)">this</a>, <a href="/help">help</a>${EVIL}`, fields: {a: {type: 'string'}}},
            {title: 'Two', fields: {b: {type: 'string'}}}
        ]}, nextText: `Next <b>step</b>${EVIL}`, prevText: EVIL, finishText: EVIL});
        expect(host.querySelector('img, script, [onerror]')).toBeNull();
        expect(host.querySelector('.wizard-step-title em').textContent).toBe('of two');
        const links = [...host.querySelectorAll('.wizard-step-description a')];
        expect(links.map(a => a.getAttribute('href'))).toEqual([null, '/help']);
        expect(host.querySelector('.wizard-next b').textContent).toBe('step');
    });
});
