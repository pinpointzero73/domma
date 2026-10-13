import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import path from 'node:path';
const css = readFileSync(path.resolve('src/css/domma.css'), 'utf8');
describe('CSS fireworks', () => {
    it('references existing keyframes for every firework variant', () => {
        const definitions = new Set([...css.matchAll(/@keyframes\s+(dm-(?:fw|firework)-[\w-]+)/g)].map(m => m[1]));
        const references = [...css.matchAll(/animation:\s+(dm-(?:fw|firework)-[\w-]+)/g)].map(m => m[1]);
        expect(references.length).toBeGreaterThan(4);
        expect(references.filter(name => !definitions.has(name))).toEqual([]);
    });
    it('lets hover fireworks receive pointer events', () => {
        const rule = css.match(/\.firework-on-hover\s*\{([^}]+)\}/)[1];
        expect(rule).toContain('pointer-events: auto');
    });
});
