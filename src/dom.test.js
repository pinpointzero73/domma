// src/dom.test.js
import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';

describe('Domma - Core DOM Functionality', () => {
  let testContainer;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test"></div>
      <div id="test-container">
          <div id="parent">
              <div id="child1" class="child test-class"></div>
              <div id="child2" class="child">
                  <span id="grandchild"></span>
              </div>
              <div id="child3" class="child"></div>
          </div>
          <div id="test-elem" class="test-class">Test Element</div>
          <button id="test-btn">Test Button</button>
      </div>
    `;
    testContainer = document.getElementById('test-container');
  });

  it('Domma selection should select one element by ID', () => {
    const el = Domma('#test-elem');
    expect(el.elements.length).toBe(1);
    expect(el.get(0).id).toBe('test-elem');
  });

  it('Domma selection should select multiple elements by class', () => {
    const el = Domma('.child');
    expect(el.elements.length).toBe(3);
  });

  it('Domma selection should create an element from an HTML string', () => {
    const el = Domma('<div>');
    expect(el.elements.length).toBe(1);
    expect(el.get(0).tagName).toBe('DIV');
  });

  it('Domma text() should set and get text content', () => {
    const el = Domma('#test-elem');
    expect(el.text()).toBe('Test Element');
    el.text('Modified');
    expect(el.text()).toBe('Modified');
  });

  it('Domma html() should set and get HTML content', () => {
    const el = Domma('#test-elem');
    el.html('<strong>Bold</strong>');
    expect(el.html()).toContain('<strong>Bold</strong>');
  });

  it('Domma css() should set single and multiple CSS properties', () => {
    const el = Domma('#test-elem');
    el.css('color', 'red');
    expect(el.get(0).style.color).toBe('red');
    el.css({fontSize: '20px', fontWeight: 'bold'});
    expect(el.get(0).style.fontSize).toBe('20px');
    expect(el.get(0).style.fontWeight).toBe('bold');
  });

  it('addClass(), removeClass(), toggleClass(), hasClass() work correctly', () => {
    const el = Domma('#test-elem');
    el.addClass('new-class');
    expect(el.hasClass('new-class')).toBe(true);
    el.removeClass('new-class');
    expect(el.hasClass('new-class')).toBe(false);
    el.toggleClass('toggled');
    expect(el.hasClass('toggled')).toBe(true);
    el.toggleClass('toggled');
    expect(el.hasClass('toggled')).toBe(false);
  });
});

describe('Domma - Context and Traversal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-container">
        <div id="parent">
          <div id="child1" class="child test-class">Child 1</div>
          <div id="child2" class="child">
            <span id="grandchild">Grandchild</span>
          </div>
          <div id="child3" class="child">Child 3</div>
        </div>
      </div>
      <div class="target">Outside</div>
    `;
  });

  it('should find element within a given DOM element context', () => {
    const container = document.getElementById('parent');
    const result = Domma('.child', container);
    expect(result.elements.length).toBe(3);
  });

  it('should limit scope with context parameter', () => {
    const ctx1 = Domma('#parent').get(0);
    const result = Domma('.target', ctx1); // Should not find the one outside
    expect(result.elements.length).toBe(0);
  });

  it('find() should find descendant elements', () => {
    const found = Domma('#parent').find('.child');
    expect(found.elements.length).toBe(3);
    expect(found.get(1).id).toBe('child2');
  });

  it('parent() should get the parent element', () => {
    const parent = Domma('#child1').parent();
    expect(parent.get(0).id).toBe('parent');
  });

  it('children() should get immediate children', () => {
    const children = Domma('#parent').children();
    expect(children.elements.length).toBe(3);
    const filtered = Domma('#parent').children('.child:nth-child(2)');
    expect(filtered.get(0).id).toBe('child2');
  });

  it('first() and last() should get the first and last elements in a collection', () => {
    const children = Domma('.child');
    expect(children.first().text()).toBe('Child 1');
    expect(children.last().text()).toBe('Child 3');
  });

  it('eq() should get the element at a specific index', () => {
    const second = Domma('.child').eq(1);
    expect(second.get(0).id).toBe('child2');
  });
});

describe('Domma - Attributes and Properties', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-elem" data-test="initial"></div>
      <button id="test-btn"></button>
    `;
  });

  it('attr() should set and get attributes', () => {
    const el = Domma('#test-elem');
    expect(el.attr('data-test')).toBe('initial');
    el.attr('data-test', 'new-value');
    expect(el.attr('data-test')).toBe('new-value');
    el.removeAttr('data-test');
    expect(el.attr('data-test')).toBe(null);
  });

  it('data() should set and get data attributes', () => {
    const el = Domma('#test-elem');
    el.data('key', 'dataValue');
    expect(el.data('key')).toBe('dataValue');
  });

  it('prop() should set and get properties', () => {
    const btn = Domma('#test-btn');
    btn.prop('disabled', true);
    expect(btn.prop('disabled')).toBe(true);
    btn.prop('disabled', false);
    expect(btn.prop('disabled')).toBe(false);
  });

  it.skip('width() and height() should get dimensions', () => {
    // SKIPPED: JSDOM does not compute layout. This should be an E2E test.
    const el = Domma('#test-elem');
    el.get(0).style.width = '100px';
    el.get(0).style.height = '50px';
    expect(el.width()).toBe(100);
    expect(el.height()).toBe(50);
  });
});

describe('Domma - Manipulation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="manip-container"><span>Middle</span></div>
    `;
  });

  it('append() and prepend() should add content', () => {
    const container = Domma('#manip-container');
    container.prepend('<span>First</span>');
    container.append('<span>Last</span>');
    const children = container.get(0).children;
    expect(children[0].textContent).toBe('First');
    expect(children[1].textContent).toBe('Middle');
    expect(children[2].textContent).toBe('Last');
  });

  it('empty() should remove all children', () => {
    const container = Domma('#manip-container');
    container.empty();
    expect(container.get(0).innerHTML).toBe('');
  });

  it('clone() should clone an element', () => {
    const el = Domma('#manip-container');
    const cloned = el.clone();
    cloned.attr('id', 'cloned-container');
    document.body.appendChild(cloned.get(0));
    expect(cloned.get(0)).not.toBe(el.get(0));
    expect(document.getElementById('cloned-container')).not.toBeNull();
  });

  it('show() and hide() should toggle display style', () => {
    const el = Domma('#manip-container');
    el.hide();
    expect(el.get(0).style.display).toBe('none');
    el.show();
    expect(el.get(0).style.display).not.toBe('none');
  });
});
// ── Array-like index access ───────────────────────────────────────────────────
//
// `$('#el')[0]` is one of the most-typed things in jQuery, and Domma's own DOM
// showcase documents it - `$('.items')[0]  // Same as get(0)`. It was not the
// same: DommaCollection exposed `.elements` and `.get(i)` but no numeric
// properties, so `[0]` was `undefined` and the failure was silent until
// something dereferenced it.
//
// It surfaced as `TypeError: Cannot read properties of undefined (reading
// 'tagName')` on the dot-notation showcase, which did `$(selector)[0]` and
// handed the result to `M.bind()`. 65 call sites across the repository use this
// form.
//
// Indices are assigned in the constructor, which is the only place
// `this.elements` is ever set - no method mutates it in place, so they cannot
// drift out of step.

describe('Domma - Array-like index access', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="solo"></div>
            <ul><li class="row" id="r1"></li><li class="row" id="r2"></li></ul>`;
    });

    it('[0] is the element, and agrees with get(0)', () => {
        const $el = Domma('#solo');
        expect($el[0]).toBe(document.getElementById('solo'));
        expect($el[0]).toBe($el.get(0));
    });

    it('indexes every element in a multi-element collection', () => {
        const $rows = Domma('.row');
        expect($rows.length).toBe(2);
        expect($rows[0].id).toBe('r1');
        expect($rows[1].id).toBe('r2');
        expect($rows[2]).toBeUndefined();
    });

    it('an empty collection has no indices', () => {
        const $none = Domma('.nothing-here');
        expect($none.length).toBe(0);
        expect($none[0]).toBeUndefined();
    });

    it('is array-like, so Array.from works', () => {
        // Array-LIKE (length + indices), not iterable: there is no
        // Symbol.iterator, so spread and for...of still do not work. jQuery 3
        // added one; doing the same here is a separate decision, and claiming
        // it without implementing it would be the more expensive mistake.
        expect(Array.from(Domma('.row')).map(el => el.id)).toEqual(['r1', 'r2']);
        expect(Array.prototype.map.call(Domma('.row'), el => el.id)).toEqual(['r1', 'r2']);
    });

    it('indexes a collection built from a node, a list and another collection', () => {
        const node = document.getElementById('solo');
        expect(Domma(node)[0]).toBe(node);
        expect(Domma(document.querySelectorAll('.row'))[0].id).toBe('r1');
        expect(Domma(Domma('.row'))[1].id).toBe('r2');
    });

    it('a derived collection is indexed too', () => {
        expect(Domma('ul').find('.row')[1].id).toBe('r2');
        expect(Domma('.row').first()[0].id).toBe('r1');
    });
});
