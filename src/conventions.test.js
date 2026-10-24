// src/conventions.test.js - the shared API conventions (docs/Components.md, "Conventions")
// applied across the components: events, overlay verbs and aliases, beforeclose,
// factory returns and E.get.
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;

/**
 * Build a component with an onX spy, add a .on() listener and a DOM listener for
 * dm:<name>:<event>, run `act`, and check all three heard it with the same arguments.
 */
async function expectEvent({make, option, event, dom, act}) {
    const viaOption = vi.fn();
    const instance = make({[option]: viaOption});
    const viaOn = vi.fn();
    const viaDom = vi.fn();
    instance.on(event, viaOn);
    const target = instance.element;
    target.addEventListener(dom, viaDom);
    await act(instance);
    expect(viaOption, `${option}`).toHaveBeenCalled();
    expect(viaOn, `.on('${event}')`).toHaveBeenCalled();
    expect(viaOn.mock.calls[0]).toEqual(viaOption.mock.calls[0]);
    expect(viaDom, dom).toHaveBeenCalled();
    expect(viaDom.mock.calls[0][0].detail.instance).toBe(instance);
    target.removeEventListener(dom, viaDom);
    return instance;
}

const made = [];
const keep = (x) => { made.push(x); return x; };

beforeEach(() => {
    window.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    window.cancelAnimationFrame = (id) => clearTimeout(id);
});

afterEach(async () => {
    // Let queued animation frames run before teardown pulls their nodes away.
    await new Promise((r) => setTimeout(r, 5));
    while (made.length) {
        try { made.pop().destroy(); } catch { /* already gone */ }
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('events: every onX option has a .on() name and a dm:<component>:<event>', () => {
    it('tabs: change', async () => {
        document.body.innerHTML = `<div id="t"><div class="tab-list"><button class="tab-item">A</button><button class="tab-item">B</button></div>
            <div class="tab-panel">a</div><div class="tab-panel">b</div></div>`;
        await expectEvent({
            make: (o) => keep(E.tabs('#t', o)), option: 'onChange', event: 'change', dom: 'dm:tabs:change',
            act: (t) => t.activate(1)
        });
    });

    it('accordion: change', async () => {
        document.body.innerHTML = `<div id="a"><div class="accordion-item"><div class="accordion-header">H</div>
            <div class="accordion-body">B</div></div></div>`;
        await expectEvent({
            make: (o) => keep(E.accordion('#a', o)), option: 'onChange', event: 'change', dom: 'dm:accordion:change',
            act: (a) => a.toggle(0)
        });
    });

    it('list group: select', async () => {
        document.body.innerHTML = `<ul id="lg" class="list-group"><li class="list-group-item">A</li><li class="list-group-item">B</li></ul>`;
        await expectEvent({
            make: (o) => keep(E.listGroup('#lg', {selectable: true, ...o})), option: 'onSelect', event: 'select',
            dom: 'dm:list-group:select', act: (lg) => lg.select(1)
        });
    });

    it('dropdown: open', async () => {
        document.body.innerHTML = '<button id="dd">Menu</button>';
        await expectEvent({
            make: (o) => keep(E.dropdown('#dd', {items: [{label: 'One', value: 1}], animation: false, ...o})),
            option: 'onOpen', event: 'open', dom: 'dm:dropdown:open', act: (d) => d.open()
        });
    });

    it('timer: start', async () => {
        document.body.innerHTML = '<div id="tm"></div>';
        await expectEvent({
            make: (o) => keep(E.timer('#tm', {duration: 5000, ...o})), option: 'onStart', event: 'start',
            dom: 'dm:timer:start', act: (t) => t.start()
        });
    });

    it('carousel: change', async () => {
        document.body.innerHTML = `<div id="c"><div class="carousel-track"><div class="carousel-slide">1</div>
            <div class="carousel-slide">2</div></div></div>`;
        await expectEvent({
            make: (o) => keep(E.carousel('#c', {animation: 'fade', animationDuration: 0, ...o})), option: 'onChange',
            event: 'change', dom: 'dm:carousel:change', act: (c) => c.goTo(1)
        });
    });

    it('cookie consent: accept, and show beside the onShow that runs with this = instance', async () => {
        let seen;
        const cc = await expectEvent({
            make: (o) => keep((E._instances.delete('cookieConsent'), E.cookieConsent({autoShow: false, animation: false, storageKey: 'conv-test', ...o}))),
            option: 'onAccept', event: 'accept', dom: 'dm:cookie-consent:accept', act: (c) => c.accept()
        });
        cc.options.onShow = function () { seen = this; };
        const viaOn = vi.fn();
        cc.on('show', viaOn);
        cc.open();
        expect(seen).toBe(cc);
        expect(viaOn).toHaveBeenCalledTimes(1);
        Domma.storage.remove('conv-test');
    });

    it('button group: change', async () => {
        document.body.innerHTML = `<div id="bg" class="btn-group"><button class="btn">A</button><button class="btn">B</button></div>`;
        await expectEvent({
            make: (o) => keep(E.buttonGroup('#bg', o)), option: 'onChange', event: 'change', dom: 'dm:button-group:change',
            act: () => document.querySelectorAll('#bg .btn')[1].click()
        });
    });

    it('breadcrumbs: change', async () => {
        document.body.innerHTML = '<nav id="bc"></nav>';
        await expectEvent({
            make: (o) => keep(E.breadcrumbs('#bc', {items: [{text: 'Home', url: '/'}, {text: 'Here'}], ...o})),
            option: 'onChange', event: 'change', dom: 'dm:breadcrumbs:change',
            act: () => document.querySelector('#bc .dm-breadcrumbs-link').click()
        });
    });

    it('navbar: itemclick', async () => {
        document.body.innerHTML = '<nav id="nb"></nav>';
        await expectEvent({
            make: (o) => keep(E.navbar('#nb', {items: [{text: 'One', url: '#one'}], ...o})),
            option: 'onItemClick', event: 'itemclick', dom: 'dm:navbar:itemclick',
            act: () => document.querySelector('#nb a.navbar-link').click()
        });
    });

    it('sidebar: toggle', async () => {
        document.body.innerHTML = '<aside id="sb"></aside>';
        await expectEvent({
            make: (o) => keep(E.sidebar('#sb', {items: [{text: 'One', url: '#one'}], ...o})),
            option: 'onToggle', event: 'toggle', dom: 'dm:sidebar:toggle', act: (s) => s.open()
        });
    });

    it('autocomplete: open', async () => {
        document.body.innerHTML = '<input id="ac">';
        await expectEvent({
            make: (o) => keep(E.autocomplete('#ac', {data: ['apple'], ...o})), option: 'onOpen', event: 'open',
            dom: 'dm:autocomplete:open', act: (a) => a.open()
        });
    });

    it('pillbox: add', async () => {
        document.body.innerHTML = '<input id="pb">';
        await expectEvent({
            make: (o) => keep(E.pillbox('#pb', {data: [{value: 'a', label: 'A'}], ...o})), option: 'onAdd', event: 'add',
            dom: 'dm:pillbox:add', act: (p) => p.addPill('a', 'A')
        });
    });

    it('slideover: open', async () => {
        await expectEvent({
            make: (o) => keep(E.slideover({title: 'S', content: '<p>x</p>', animationDuration: 0, ...o})), option: 'onOpen',
            event: 'open', dom: 'dm:slideover:open',
            act: async (s) => { s.open(); await new Promise((r) => setTimeout(r, 5)); }
        });
    });

    it('progression: statuschange', async () => {
        document.body.innerHTML = '<div id="pr"></div>';
        await expectEvent({
            make: (o) => keep(E.progression('#pr', {mode: 'roadmap', items: [{id: 'a', title: 'A', status: 'planned'}], ...o})),
            option: 'onStatusChange', event: 'statuschange', dom: 'dm:progression:statuschange',
            act: (p) => p.setStatus(0, 'completed')
        });
    });

    it('signature: clear', async () => {
        const ctx = new Proxy({}, {get: (t, k) => (k in t ? t[k] : () => {}), set: (t, k, v) => { t[k] = v; return true; }});
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
        document.body.innerHTML = '<div id="sig"></div>';
        await expectEvent({
            make: (o) => keep(E.signature('#sig', o)), option: 'onClear', event: 'clear', dom: 'dm:signature:clear',
            act: (s) => s.clear()
        });
    });

    it('date picker: change', async () => {
        document.body.innerHTML = '<input id="dp">';
        await expectEvent({
            make: (o) => keep(E.datePicker('#dp', o)), option: 'onChange', event: 'change', dom: 'dm:date-picker:change',
            act: (d) => d.setValue('2026-01-02')
        });
    });

    it('context menu: open and select', async () => {
        document.body.innerHTML = '<div id="cm">area</div>';
        const cm = await expectEvent({
            make: (o) => keep(E.contextMenu('#cm', {items: [{label: 'One', action() {}}], animation: false, ...o})),
            option: 'onOpen', event: 'open', dom: 'dm:context-menu:open', act: (m) => m.open(5, 5)
        });
        expect(cm.isOpen()).toBe(true);
    });

    it('tree view: select', async () => {
        document.body.innerHTML = '<div id="tv"></div>';
        await expectEvent({
            make: (o) => keep(E.treeView('#tv', {data: [{id: 1, label: 'One'}], ...o})), option: 'onSelect', event: 'select',
            dom: 'dm:tree-view:select', act: (t) => t.select(1)
        });
    });

    it('sortable: drop reaches .on() and dm:sortable:drop as well as onDrop and sortable:drop', async () => {
        const ROW = 40;
        const root = document.createElement('ul');
        root.id = 'so';
        root.innerHTML = ['a', 'b', 'c'].map((k) => `<li data-id="${k}">${k}</li>`).join('');
        document.body.appendChild(root);
        const rows = () => [...root.querySelectorAll('[data-id]')].filter((el) => !el.classList.contains('dm-sortable-ghost'));
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
            const i = rows().indexOf(this);
            if (this.matches?.('[data-id]') && i !== -1) return {left: 0, top: i * ROW, right: 300, bottom: i * ROW + ROW, width: 300, height: ROW, x: 0, y: i * ROW};
            return {left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
        });
        document.elementFromPoint = (x, y) => rows()[Math.floor(y / ROW)] || null;
        const pointer = (type, target, y) => {
            const evt = new MouseEvent(type, {bubbles: true, cancelable: true, clientX: 10, clientY: y, button: 0, buttons: type === 'pointerup' ? 0 : 1});
            Object.defineProperty(evt, 'pointerId', {value: 1});
            Object.defineProperty(evt, 'pointerType', {value: 'mouse'});
            target.dispatchEvent(evt);
        };
        const legacy = vi.fn();
        root.addEventListener('sortable:drop', legacy);
        await expectEvent({
            make: (o) => keep(E.sortable('#so', {nest: true, animation: 0, ...o})), option: 'onDrop', event: 'drop',
            dom: 'dm:sortable:drop', act: () => {
                pointer('pointerdown', root.querySelector('[data-id=a]'), 20);
                for (let i = 1; i <= 6; i++) pointer('pointermove', document, 20 + (98 * i) / 6);
                pointer('pointerup', document, 118);
            }
        });
        expect(legacy).toHaveBeenCalledTimes(1);
    });

    it('the option keeps its return value: autocomplete onFilter still replaces the results', async () => {
        document.body.innerHTML = '<input id="acf">';
        const ac = keep(E.autocomplete('#acf', {data: ['apple', 'apricot'], debounce: 0, onFilter: (r) => r.slice(0, 1)}));
        const heard = vi.fn();
        ac.on('filter', heard);
        ac.element.value = 'ap';
        ac.element.dispatchEvent(new Event('input', {bubbles: true}));
        await new Promise((r) => setTimeout(r, 10));
        expect(heard).toHaveBeenCalled();
        expect(document.querySelectorAll('.dm-autocomplete-item, [role="option"]').length).toBe(1);
    });
});

describe('overlay verbs: open/close canonical, show/hide/isVisible delegate by name', () => {
    const overlays = {
        dropdown: () => { document.body.innerHTML = '<button id="o">x</button>'; return E.dropdown('#o', {items: [{label: 'a'}], animation: false}); },
        sidebar: () => { document.body.innerHTML = '<aside id="o"></aside>'; return E.sidebar('#o', {items: []}); },
        autocomplete: () => { document.body.innerHTML = '<input id="o">'; return E.autocomplete('#o', {data: ['a']}); },
        pillbox: () => { document.body.innerHTML = '<input id="o">'; return E.pillbox('#o', {data: [{value: 'a', label: 'A'}]}); },
        slideover: () => E.slideover({title: 'S', content: 'x', animationDuration: 0}),
        datePicker: () => { document.body.innerHTML = '<input id="o">'; return E.datePicker('#o'); },
        contextMenu: () => { document.body.innerHTML = '<div id="o">x</div>'; return E.contextMenu('#o', {items: [{label: 'a'}], animation: false}); },
        cookieConsent: () => (E._instances.delete('cookieConsent'), E.cookieConsent({autoShow: false, animation: false, storageKey: 'conv-verbs'})),
        popover: () => { document.body.innerHTML = '<button id="o">x</button>'; return E.popover('#o', {content: 'hi', animation: false}); }
    };

    for (const [name, make] of Object.entries(overlays)) {
        it(`${name}: open/close/toggle/isOpen, and the aliases call the patched method`, async () => {
            const o = keep(make());
            expect(typeof o.open).toBe('function');
            expect(typeof o.close).toBe('function');
            expect(typeof o.toggle).toBe('function');
            expect(o.isOpen()).toBe(false);
            o.show();
            expect(o.isOpen()).toBe(true);
            expect(o.isVisible()).toBe(true);

            // A popover's own names are show/hide, so there open/close are the aliases.
            const [shut, shutAlias, op, opAlias] = name === 'popover'
                ? ['hide', 'close', 'show', 'open'] : ['close', 'hide', 'open', 'show'];
            const realClose = o[shut];
            const patched = vi.fn(function (...args) { return realClose.apply(this, args); });
            o[shut] = patched;
            o[shutAlias]();
            expect(patched).toHaveBeenCalledTimes(1);

            const realOpen = o[op];
            const patchedOpen = vi.fn(function (...args) { return realOpen.apply(this, args); });
            o[op] = patchedOpen;
            o[opAlias]();
            expect(patchedOpen).toHaveBeenCalledTimes(1);
            Domma.storage.remove('conv-verbs');
        });
    }

    describe('slideover: the X button, the backdrop and Escape call the patched close', () => {
        let so;
        let guard;
        beforeEach(() => {
            so = keep(E.slideover({title: 'S', content: 'x', animationDuration: 0}));
            so.open();
            const realClose = so.close;
            guard = vi.fn(function (...args) { return realClose.apply(this, args); });
            so.close = guard;
        });

        it('X button', async () => {
            so.element.querySelector('.dm-slideover-close').click();
            expect(guard).toHaveBeenCalledTimes(1);
        });

        it('backdrop', async () => {
            so._backdrop.click();
            expect(guard).toHaveBeenCalledTimes(1);
        });

        it('Escape', async () => {
            document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
            expect(guard).toHaveBeenCalledTimes(1);
        });
    });
});

describe('beforeclose / beforeopen cancel', () => {
    const cases = {
        slideover: () => E.slideover({title: 'S', content: 'x', animationDuration: 0}),
        dropdown: () => { document.body.innerHTML = '<button id="o">x</button>'; return E.dropdown('#o', {items: [{label: 'a'}], animation: false}); },
        sidebar: () => { document.body.innerHTML = '<aside id="o"></aside>'; return E.sidebar('#o', {items: []}); },
        datePicker: () => { document.body.innerHTML = '<input id="o">'; return E.datePicker('#o'); },
        autocomplete: () => { document.body.innerHTML = '<input id="o">'; return E.autocomplete('#o', {data: ['a']}); },
        pillbox: () => { document.body.innerHTML = '<input id="o">'; return E.pillbox('#o', {data: [{value: 'a', label: 'A'}]}); },
        contextMenu: () => { document.body.innerHTML = '<div id="o">x</div>'; return E.contextMenu('#o', {items: [{label: 'a'}], animation: false}); }
    };

    for (const [name, make] of Object.entries(cases)) {
        it(`${name}: onBeforeClose / .on('beforeclose') / preventDefault keep it open; destroy still closes`, () => {
            const o = keep(make());
            o.open();
            expect(o.isOpen()).toBe(true);

            o.options.onBeforeClose = () => false;
            o.close();
            expect(o.isOpen()).toBe(true);
            o.options.onBeforeClose = null;

            const no = () => false;
            o.on('beforeclose', no);
            o.close();
            expect(o.isOpen()).toBe(true);
            o.off('beforeclose', no);

            const prevent = (e) => e.preventDefault();
            o.element.addEventListener(`dm:${o.constructor.componentName}:beforeclose`, prevent);
            o.close();
            expect(o.isOpen()).toBe(true);
            o.element.removeEventListener(`dm:${o.constructor.componentName}:beforeclose`, prevent);

            o.close();
            if (name !== 'slideover') expect(o.isOpen()).toBe(false);

            o.on('beforeopen', () => false);
            if (name === 'slideover') o._isOpen = false;
            o.open();
            expect(o.isOpen()).toBe(false);
        });
    }

    it('destroy() closes even when beforeclose says no', async () => {
        const so = E.slideover({title: 'S', content: 'x', animationDuration: 0, onBeforeClose: () => false});
        const onClose = vi.fn();
        so.on('close', onClose);
        so.open();
        so.destroy();
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('factory returns', () => {
    beforeEach(() => {
        document.body.innerHTML = [1, 2, 3].map((i) => `<div class="bg btn-group" id="bg${i}"><button class="btn">A</button></div>`).join('')
            + [1, 2].map((i) => `<ul class="lg list-group"><li class="list-group-item">${i}</li></ul>`).join('');
        window.DommaOptions = {deprecationWarnings: true};
    });

    it('buttonGroup: several matches return the first instance, with all()', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const g = E.buttonGroup('.bg');
        expect(Array.isArray(g)).toBe(false);
        expect(g.element.id).toBe('bg1');
        expect(g.all().map((x) => x.element.id)).toEqual(['bg1', 'bg2', 'bg3']);
        expect(Object.keys(g)).not.toContain('all');
        expect(Object.keys(g)).not.toContain('0');
        expect(warn).not.toHaveBeenCalled();

        expect(g[1].element.id).toBe('bg2');
        expect(g[2].element.id).toBe('bg3');
        const indexWarnings = warn.mock.calls.filter((c) => String(c[0]).includes('[index]'));
        expect(indexWarnings.length).toBe(1);
        expect(g.length).toBe(3);
        expect(g.map((x) => x.element.id)).toEqual(['bg1', 'bg2', 'bg3']);
        expect([...g].length).toBe(3);
        expect(warn.mock.calls.every((c) => String(c[0]).includes('E.buttonGroup()'))).toBe(true);
    });

    it('buttonGroup.all / listGroup.all return arrays; a single match has all() too', async () => {
        expect(E.buttonGroup.all('.bg').length).toBe(3);
        expect(E.listGroup.all('.lg').length).toBe(2);
        const one = E.buttonGroup('#bg1');
        expect(one.all()).toEqual([one]);
        const lg = E.listGroup('.lg');
        expect(Array.isArray(lg)).toBe(false);
        expect(lg.all().length).toBe(2);
    });

    it('chooser: a missing host gives an inert chooser, not null', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const c = E.chooser('#nope', {options: []});
        expect(c).not.toBeNull();
        expect(c.element).toBeNull();
        expect(() => { c.setValue('x'); c.disable(); c.enable(); c.destroy(); }).not.toThrow();
        expect(c.getValue()).toBeNull();
        expect(warn).toHaveBeenCalledTimes(1);
    });

    it('notify accepts an options object first', async () => {
        const spy = vi.spyOn(Domma.elements.notification({}).constructor, 'notify').mockReturnValue('n');
        E.notify({title: 'Hi', body: 'There'});
        expect(spy).toHaveBeenCalledWith('Hi', {title: 'Hi', body: 'There'});
        E.notify('Hi', {body: 'There'});
        expect(spy).toHaveBeenLastCalledWith('Hi', {body: 'There'});
    });
});

describe('E.get finds factory-made instances', () => {
    it('slideover, popover, skeleton, avatar, avatar group and chooser', async () => {
        const so = keep(E.slideover({title: 'S', content: 'x'}));
        expect(E.get(so.element)).toBe(so);

        document.body.innerHTML = `<button id="pop">x</button><div id="sk"><p>c</p></div><span id="av"></span>
            <div id="ag"></div><div id="ch"></div>`;
        const pop = keep(E.popover('#pop', {content: 'x'}));
        expect(E.popover.getInstance('#pop')).toBe(pop);
        expect(E.get('#pop', 'popover')).toBe(pop);

        const sk = E.skeleton('#sk');
        expect(E.get('#sk')).toBe(sk);
        expect(E.skeleton.get('#sk')).toBe(sk);
        sk.remove();
        expect(E.get('#sk', 'skeleton')).toBeUndefined();
        expect(E.skeleton.get('#sk')).toBeNull();

        const av = E.avatar('#av', {name: 'Jane Doe'});
        expect(E.get('#av', 'avatar')).toBe(av);
        expect(E.avatar.get('#av')).toBe(av);
        av.destroy();
        expect(E.avatar.get('#av')).toBeNull();

        const ag = E.avatarGroup('#ag', {people: [{name: 'A B'}], popover: false});
        expect(E.get('#ag', 'avatar-group')).toBe(ag);
        expect(E.get(ag.element, 'avatar-group')).toBe(ag);
        expect(E.avatarGroup.get(ag.element)).toBe(ag);
        ag.destroy();
        expect(E.avatarGroup.get('#ag')).toBeNull();

        const ch = E.chooser('#ch', {options: [{value: 'a', label: 'A'}]});
        expect(E.get('#ch', 'chooser')).toBe(ch);
        expect(ch.element).toBe(ch._root);
    });

    it('buttonGroup instances from a multi-match are each found', async () => {
        document.body.innerHTML = '<div class="g"><button class="btn">a</button></div><div class="g"><button class="btn">b</button></div>';
        const all = E.buttonGroup.all('.g');
        const els = document.querySelectorAll('.g');
        expect(E.get(els[1])).toBe(all[1]);
        expect(E.get(els[0], 'button-group')).toBe(all[0]);
    });
});

describe('Alarm.removeAlarm', () => {
    it('removeAlarm is the name; remove(id) is an alias looked up by name', async () => {
        const alarm = E.alarm({storageKey: 'conv-alarms'});
        const a = alarm.add({time: '23:59', label: 'x'});
        const spy = vi.spyOn(alarm, 'removeAlarm');
        expect(alarm.remove(a.id)).toBe(true);
        expect(spy).toHaveBeenCalledWith(a.id);
        alarm.clearAll?.();
        Domma.storage.remove('conv-alarms');
    });
});

