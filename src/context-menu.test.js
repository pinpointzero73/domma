// src/context-menu.test.js
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;

function rightClick(el, x = 50, y = 50) {
    const evt = new window.MouseEvent('contextmenu', {
        bubbles: true, cancelable: true, clientX: x, clientY: y, button: 2
    });
    el.dispatchEvent(evt);
    return evt;
}

function openMenu() {
    return document.querySelector('.dm-context-menu:not(.dm-context-menu-sub)');
}

function labels() {
    return Array.from(document.querySelectorAll('.dm-context-menu-label')).map((n) => n.textContent);
}

describe('Domma.elements.contextMenu', () => {
    let root;
    const made = [];

    const make = (selector, options) => {
        const m = E.contextMenu(selector, options);
        made.push(m);
        return m;
    };

    beforeEach(() => {
        root = document.createElement('div');
        root.id = 'page';
        document.body.appendChild(root);
    });

    afterEach(() => {
        while (made.length) made.pop().destroy();
        document.body.innerHTML = '';
    });

    describe('binding and delegation', () => {
        it('opens on right-click inside the bound container', () => {
            root.innerHTML = '<p id="para">text</p>';
            make('#page', {items: [{label: 'Page action'}], animation: false});

            const evt = rightClick(document.getElementById('para'));

            expect(evt.defaultPrevented).toBe(true);
            expect(openMenu()).not.toBeNull();
            expect(labels()).toEqual(['Page action']);
        });

        it('does not open outside the bound container', () => {
            const outside = document.createElement('div');
            document.body.appendChild(outside);
            make('#page', {items: [{label: 'Page action'}], animation: false});

            const evt = rightClick(outside);

            expect(evt.defaultPrevented).toBe(false);
            expect(openMenu()).toBeNull();
        });

        it('binds every element matching the selector, including later ones', () => {
            make('.collection', {items: [{label: 'Collection'}], animation: false});

            // Rendered after the menu was declared, as a CMS collection would be.
            root.innerHTML = '<div class="collection"><span id="late">entry</span></div>';
            rightClick(document.getElementById('late'));

            expect(labels()).toEqual(['Collection']);
        });

        it('passes the delegated target to the items resolver', () => {
            root.innerHTML = '<div class="grid"><div data-entry-id="7"><b id="deep">x</b></div></div>';
            const seen = [];
            make('.grid', {
                match: '[data-entry-id]',
                items: (target) => { seen.push(target.dataset.entryId); return [{label: 'Edit'}]; },
                animation: false
            });

            rightClick(document.getElementById('deep'));

            expect(seen).toEqual(['7']);
        });
    });

    describe('cascade', () => {
        beforeEach(() => {
            root.innerHTML = '<div class="collection"><span id="entry">entry</span></div>';
        });

        it('lets the innermost menu win regardless of registration order', () => {
            // Outer registered FIRST - the order that would win under per-instance
            // document listeners.
            make('#page', {items: [{label: 'Page'}], inherit: false, animation: false});
            make('.collection', {items: [{label: 'Collection'}], inherit: false, animation: false});

            rightClick(document.getElementById('entry'));

            expect(labels()).toEqual(['Collection']);
        });

        it('still lets the innermost win when registered LAST', () => {
            make('.collection', {items: [{label: 'Collection'}], inherit: false, animation: false});
            make('#page', {items: [{label: 'Page'}], inherit: false, animation: false});

            rightClick(document.getElementById('entry'));

            expect(labels()).toEqual(['Collection']);
        });

        it('appends ancestor items beneath its own by default', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {items: [{label: 'Collection'}], animation: false});

            rightClick(document.getElementById('entry'));

            expect(labels()).toEqual(['Collection', 'Page']);
            expect(document.querySelectorAll('.dm-context-menu-divider').length).toBe(1);
        });

        it('prepends when inherit is "prepend"', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {items: [{label: 'Collection'}], inherit: 'prepend', animation: false});

            rightClick(document.getElementById('entry'));

            expect(labels()).toEqual(['Page', 'Collection']);
        });

        it('falls through outward when the inner menu declines on match', () => {
            root.innerHTML = '<div class="collection"><span id="gap">padding</span></div>';
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {
                match: '[data-entry-id]',       // nothing here matches
                items: [{label: 'Collection'}],
                animation: false
            });

            rightClick(document.getElementById('gap'));

            expect(labels()).toEqual(['Page']);
        });

        it('falls through outward when the inner menu is disabled', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {items: [{label: 'Collection'}], enabled: false, animation: false});

            rightClick(document.getElementById('entry'));

            expect(labels()).toEqual(['Page']);
        });

        it('falls through outward when onBeforeOpen returns false', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {
                items: [{label: 'Collection'}],
                onBeforeOpen: () => false,
                animation: false
            });

            rightClick(document.getElementById('entry'));

            expect(labels()).toEqual(['Page']);
        });

        it('honours exclude, falling through to the ancestor', () => {
            root.innerHTML = '<div class="collection"><a id="link" href="#">link</a></div>';
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {exclude: 'a', items: [{label: 'Collection'}], animation: false});

            rightClick(document.getElementById('link'));

            expect(labels()).toEqual(['Page']);
        });

        it('leaves the native menu alone when nothing claims the click', () => {
            root.innerHTML = '<div class="collection"><a id="link" href="#">link</a></div>';
            make('.collection', {exclude: 'a', items: [{label: 'Collection'}], animation: false});

            const evt = rightClick(document.getElementById('link'));

            expect(evt.defaultPrevented).toBe(false);
            expect(openMenu()).toBeNull();
        });

        it('reports the resolution chain innermost-first', () => {
            const page = make('#page', {items: [{label: 'Page'}], animation: false});
            const coll = make('.collection', {items: [{label: 'Collection'}], animation: false});

            const chain = E.contextMenu.registry(document.getElementById('entry'));

            expect(chain).toEqual([coll, page]);
        });
    });

    describe('native escape hatch', () => {
        it('passes through to the browser on shift+right-click', () => {
            root.innerHTML = '<p id="para">text</p>';
            make('#page', {items: [{label: 'Page'}], animation: false});

            const evt = new window.MouseEvent('contextmenu', {
                bubbles: true, cancelable: true, clientX: 10, clientY: 10, shiftKey: true
            });
            document.getElementById('para').dispatchEvent(evt);

            expect(evt.defaultPrevented).toBe(false);
            expect(openMenu()).toBeNull();
        });

        it('keeps the custom menu on shift when nativeOnShift is off', () => {
            root.innerHTML = '<p id="para">text</p>';
            make('#page', {items: [{label: 'Page'}], nativeOnShift: false, animation: false});

            const evt = new window.MouseEvent('contextmenu', {
                bubbles: true, cancelable: true, clientX: 10, clientY: 10, shiftKey: true
            });
            document.getElementById('para').dispatchEvent(evt);

            expect(openMenu()).not.toBeNull();
        });
    });

    describe('items', () => {
        beforeEach(() => { root.innerHTML = '<p id="para">text</p>'; });

        it('omits invisible items and renders disabled ones', () => {
            make('#page', {
                items: [
                    {label: 'Shown'},
                    {label: 'Hidden', visible: false},
                    {label: 'Locked', disabled: true}
                ],
                animation: false
            });

            rightClick(document.getElementById('para'));

            expect(labels()).toEqual(['Shown', 'Locked']);
            expect(document.querySelectorAll('.dm-context-menu-item.is-disabled').length).toBe(1);
        });

        it('collapses dividers stranded by hidden items', () => {
            make('#page', {
                items: [
                    {label: 'A'},
                    {type: 'divider'},
                    {label: 'B', visible: false},
                    {type: 'divider'},
                    {label: 'C'}
                ],
                animation: false
            });

            rightClick(document.getElementById('para'));

            expect(labels()).toEqual(['A', 'C']);
            expect(document.querySelectorAll('.dm-context-menu-divider').length).toBe(1);
        });

        it('does not open when every item resolves away', () => {
            make('#page', {items: [{label: 'Nope', visible: false}], animation: false});

            const evt = rightClick(document.getElementById('para'));

            expect(evt.defaultPrevented).toBe(false);
            expect(openMenu()).toBeNull();
        });

        it('runs the action with the delegated target', () => {
            root.innerHTML = '<div data-entry-id="3" id="row">row</div>';
            const action = vi.fn();
            make('#page', {match: '[data-entry-id]', items: [{label: 'Go', action}], animation: false});

            rightClick(document.getElementById('row'));
            document.querySelector('.dm-context-menu-item').click();

            expect(action).toHaveBeenCalledTimes(1);
            expect(action.mock.calls[0][0]).toBe(document.getElementById('row'));
        });

        it('renders a header and a shortcut hint', () => {
            make('#page', {
                items: [{type: 'header', label: 'Actions'}, {label: 'Copy', shortcut: 'Ctrl+C'}],
                animation: false
            });

            rightClick(document.getElementById('para'));

            expect(document.querySelector('.dm-context-menu-header').textContent).toBe('Actions');
            expect(document.querySelector('.dm-context-menu-shortcut').textContent).toBe('Ctrl+C');
        });
    });

    describe('open state', () => {
        beforeEach(() => { root.innerHTML = '<p id="para">text</p>'; });

        it('keeps only one menu on screen', () => {
            root.innerHTML = '<p id="a">a</p><div class="other"><p id="b">b</p></div>';
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.other', {items: [{label: 'Other'}], inherit: false, animation: false});

            rightClick(document.getElementById('a'));
            rightClick(document.getElementById('b'));

            expect(document.querySelectorAll('.dm-context-menu').length).toBe(1);
            expect(labels()).toEqual(['Other']);
        });

        it('closes on Escape', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            rightClick(document.getElementById('para'));

            document.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));

            expect(openMenu()).toBeNull();
        });

        it('closes on outside mousedown', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            rightClick(document.getElementById('para'));

            document.body.dispatchEvent(new window.MouseEvent('mousedown', {bubbles: true}));

            expect(openMenu()).toBeNull();
        });

        it('closes after a selection', () => {
            make('#page', {items: [{label: 'Page', action() {}}], animation: false});
            rightClick(document.getElementById('para'));

            document.querySelector('.dm-context-menu-item').click();

            expect(openMenu()).toBeNull();
        });

        it('stays open when closeOnSelect is false', () => {
            make('#page', {items: [{label: 'Page', action() {}}], closeOnSelect: false, animation: false});
            rightClick(document.getElementById('para'));

            document.querySelector('.dm-context-menu-item').click();

            expect(openMenu()).not.toBeNull();
        });
    });

    describe('keyboard', () => {
        beforeEach(() => { root.innerHTML = '<button id="btn">row</button>'; });

        it('opens on Shift+F10 against the focused element', () => {
            make('#page', {items: [{label: 'One'}, {label: 'Two'}], animation: false});
            document.getElementById('btn').focus();

            document.dispatchEvent(new window.KeyboardEvent('keydown', {
                key: 'F10', shiftKey: true, bubbles: true
            }));

            expect(openMenu()).not.toBeNull();
        });

        it('opens on the ContextMenu key', () => {
            make('#page', {items: [{label: 'One'}], animation: false});
            document.getElementById('btn').focus();

            document.dispatchEvent(new window.KeyboardEvent('keydown', {
                key: 'ContextMenu', bubbles: true
            }));

            expect(openMenu()).not.toBeNull();
        });

        it('moves focus with the arrow keys and wraps', () => {
            make('#page', {items: [{label: 'One'}, {label: 'Two'}], animation: false});
            rightClick(document.getElementById('btn'));

            const press = (key) => document.dispatchEvent(
                new window.KeyboardEvent('keydown', {key, bubbles: true})
            );

            press('ArrowDown');
            expect(document.activeElement.textContent).toContain('One');
            press('ArrowDown');
            expect(document.activeElement.textContent).toContain('Two');
            press('ArrowDown');
            expect(document.activeElement.textContent).toContain('One');
            press('ArrowUp');
            expect(document.activeElement.textContent).toContain('Two');
        });

        it('skips disabled items when moving focus', () => {
            make('#page', {
                items: [{label: 'One'}, {label: 'Skip', disabled: true}, {label: 'Three'}],
                animation: false
            });
            rightClick(document.getElementById('btn'));

            document.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
            document.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));

            expect(document.activeElement.textContent).toContain('Three');
        });

        it('marks the menu up as a menu', () => {
            make('#page', {items: [{label: 'One'}], ariaLabel: 'Row actions', animation: false});
            rightClick(document.getElementById('btn'));

            const menu = openMenu();
            expect(menu.getAttribute('role')).toBe('menu');
            expect(menu.getAttribute('aria-label')).toBe('Row actions');
            expect(document.querySelector('.dm-context-menu-item').getAttribute('role')).toBe('menuitem');
        });
    });

    describe('submenus', () => {
        it('opens a submenu on click and marks it expanded', () => {
            root.innerHTML = '<p id="para">text</p>';
            make('#page', {
                items: [{label: 'Export', submenu: [{label: 'CSV'}, {label: 'JSON'}]}],
                animation: false
            });
            rightClick(document.getElementById('para'));

            const parent = document.querySelector('.dm-context-menu-item.has-submenu');
            expect(parent.getAttribute('aria-haspopup')).toBe('true');
            parent.click();

            const sub = document.querySelector('.dm-context-menu-sub');
            expect(sub).not.toBeNull();
            expect(parent.getAttribute('aria-expanded')).toBe('true');
            expect(Array.from(sub.querySelectorAll('.dm-context-menu-label')).map((n) => n.textContent))
                .toEqual(['CSV', 'JSON']);
        });

        it('resolves a function submenu against the target', () => {
            root.innerHTML = '<div data-entry-id="9" id="row">row</div>';
            make('#page', {
                match: '[data-entry-id]',
                items: [{label: 'More', submenu: (t) => [{label: `Entry ${t.dataset.entryId}`}]}],
                animation: false
            });
            rightClick(document.getElementById('row'));
            document.querySelector('.has-submenu').click();

            expect(document.querySelector('.dm-context-menu-sub .dm-context-menu-label').textContent)
                .toBe('Entry 9');
        });
    });

    describe('render escape hatch', () => {
        it('claims the gesture and hands off to a caller-owned panel', () => {
            root.innerHTML = '<p id="para">text</p>';
            const render = vi.fn(() => undefined);
            make('#page', {render, animation: false});

            const evt = rightClick(document.getElementById('para'), 30, 40);

            expect(evt.defaultPrevented).toBe(true);
            expect(render).toHaveBeenCalledTimes(1);
            expect(render.mock.calls[0][0].x).toBe(30);
            expect(openMenu()).toBeNull();          // nothing of Domma's on screen
        });

        it('adopts and dismisses a returned panel', () => {
            root.innerHTML = '<p id="para">text</p>';
            const panel = document.createElement('div');
            panel.className = 'dm-context-menu custom-panel';
            const menu = make('#page', {render: () => panel, animation: false});

            rightClick(document.getElementById('para'));
            expect(panel.parentNode).toBe(document.body);
            expect(menu.isOpen()).toBe(true);

            document.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
            expect(menu.isOpen()).toBe(false);
        });

        it('still goes through cascade arbitration', () => {
            root.innerHTML = '<div class="collection"><span id="entry">e</span></div>';
            const render = vi.fn();
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.collection', {
                match: '[data-entry-id]',       // nothing matches - must decline
                render,
                animation: false
            });

            rightClick(document.getElementById('entry'));

            expect(render).not.toHaveBeenCalled();
            expect(labels()).toEqual(['Page']);
        });

        it('receives the delegated target', () => {
            root.innerHTML = '<div data-entry-id="4" id="row">row</div>';
            const render = vi.fn();
            make('#page', {match: '[data-entry-id]', render, animation: false});

            rightClick(document.getElementById('row'));

            expect(render.mock.calls[0][0].target).toBe(document.getElementById('row'));
        });

        it('opens with no items at all', () => {
            root.innerHTML = '<p id="para">text</p>';
            const render = vi.fn();
            make('#page', {items: [], render, animation: false});

            expect(rightClick(document.getElementById('para')).defaultPrevented).toBe(true);
            expect(render).toHaveBeenCalledTimes(1);
        });
    });

    describe('hardened panels', () => {
        /*
         * A `render` panel is opaque in BOTH directions, which is the accepted
         * contract rather than an oversight: it merges no ancestor items into
         * itself, and it contributes none upward either. The second half is the
         * one with teeth - an inner menu bound inside a hardened panel replaces
         * it outright for that region, so the panel is only reachable outside
         * whatever the inner menu claims.
         */
        it('contributes no items to an inner menu, and does not run', () => {
            root.innerHTML = '<div class="ctx"><div data-entry-id="1" id="e">e</div></div>';
            const panel = vi.fn();
            make('.ctx', {render: panel, animation: false});
            make('[data-entry-id]', {items: [{label: 'Author'}], animation: false});

            rightClick(document.getElementById('e'));

            expect(labels()).toEqual(['Author']);
            expect(panel).not.toHaveBeenCalled();
        });

        it('still answers outside whatever the inner menu claims', () => {
            root.innerHTML = '<div class="ctx"><span id="gap">gap</span><div data-entry-id="1">e</div></div>';
            const panel = vi.fn();
            make('.ctx', {render: panel, animation: false});
            make('[data-entry-id]', {items: [{label: 'Author'}], animation: false});

            rightClick(document.getElementById('gap'));

            expect(panel).toHaveBeenCalledTimes(1);
            expect(labels()).toEqual([]);
        });
    });

    describe('exclusive regions', () => {
        beforeEach(() => {
            root.innerHTML = '<div class="ctx"><div data-entry-id="1" id="e">e</div>'
                + '<span id="gap">gap</span></div>';
        });

        it('pre-empts a menu bound deeper inside it', () => {
            const panel = vi.fn();
            make('.ctx', {exclusive: true, render: panel, animation: false});
            make('[data-entry-id]', {items: [{label: 'Author'}], animation: false});

            rightClick(document.getElementById('e'));

            expect(panel).toHaveBeenCalledTimes(1);
            expect(labels()).toEqual([]);
        });

        it('does not run the pre-empted menu\'s onBeforeOpen', () => {
            const onBeforeOpen = vi.fn(() => true);
            make('.ctx', {exclusive: true, render: () => {}, animation: false});
            make('[data-entry-id]', {items: [{label: 'Author'}], onBeforeOpen, animation: false});

            rightClick(document.getElementById('e'));

            expect(onBeforeOpen).not.toHaveBeenCalled();
        });

        it('steps aside completely when it declines', () => {
            const panel = vi.fn();
            make('.ctx', {exclusive: true, enabled: false, render: panel, animation: false});
            make('[data-entry-id]', {items: [{label: 'Author'}], animation: false});

            rightClick(document.getElementById('e'));

            expect(panel).not.toHaveBeenCalled();
            expect(labels()).toEqual(['Author']);
        });

        it('declines on a match miss, leaving the inner menu to answer', () => {
            const panel = vi.fn();
            make('.ctx', {exclusive: true, match: '.nothing-here', render: panel, animation: false});
            make('[data-entry-id]', {items: [{label: 'Author'}], animation: false});

            rightClick(document.getElementById('e'));

            expect(panel).not.toHaveBeenCalled();
            expect(labels()).toEqual(['Author']);
        });

        it('does not shadow menus OUTSIDE it', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.ctx', {exclusive: true, items: [{label: 'Collection'}], animation: false});

            rightClick(document.getElementById('gap'));

            // Outer items still inherit normally - exclusivity is about depth,
            // not about standing alone. That is what `inherit: false` is for.
            expect(labels()).toEqual(['Collection', 'Page']);
        });

        it('leaves clicks outside its region alone', () => {
            make('#page', {items: [{label: 'Page'}], animation: false});
            make('.ctx', {exclusive: true, render: () => {}, animation: false});
            root.insertAdjacentHTML('beforeend', '<p id="outside">outside</p>');

            rightClick(document.getElementById('outside'));

            expect(labels()).toEqual(['Page']);
        });
    });

    describe('lifecycle', () => {
        it('destroy deregisters the menu', () => {
            root.innerHTML = '<p id="para">text</p>';
            const menu = E.contextMenu('#page', {items: [{label: 'Page'}], animation: false});
            menu.destroy();

            const evt = rightClick(document.getElementById('para'));

            expect(evt.defaultPrevented).toBe(false);
            expect(openMenu()).toBeNull();
        });

        it('setItems replaces the items', () => {
            root.innerHTML = '<p id="para">text</p>';
            const menu = make('#page', {items: [{label: 'Old'}], animation: false});
            menu.setItems([{label: 'New'}]);

            rightClick(document.getElementById('para'));

            expect(labels()).toEqual(['New']);
        });

        it('disable suppresses the menu and enable restores it', () => {
            root.innerHTML = '<p id="para">text</p>';
            const menu = make('#page', {items: [{label: 'Page'}], animation: false});

            menu.disable();
            expect(rightClick(document.getElementById('para')).defaultPrevented).toBe(false);

            menu.enable();
            rightClick(document.getElementById('para'));
            expect(openMenu()).not.toBeNull();
        });

        it('closeAll closes the open menu', () => {
            root.innerHTML = '<p id="para">text</p>';
            make('#page', {items: [{label: 'Page'}], animation: false});
            rightClick(document.getElementById('para'));

            E.contextMenu.closeAll();

            expect(openMenu()).toBeNull();
            expect(E.contextMenu.active()).toBeNull();
        });
    });
});
