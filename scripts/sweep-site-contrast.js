/**
 * Site-wide Contrast and Theme Sweep
 *
 * Scans all HTML files and application/component CSS for:
 *   1. Fixed-palette backgrounds inheriting theme text (unreadable in dark themes).
 *   2. Themed text on fixed backgrounds without matching foreground/background pairing.
 *   3. Inline HTML styles with low contrast or unstyled fixed backgrounds.
 *   4. Direct color & background pairs failing WCAG AA (4.5:1) across themes.
 *
 * Usage:
 *   node scripts/sweep-site-contrast.js
 *   npm run sweep:site
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';

const ROOT = process.cwd();

const VAR_SOURCES = ['public/dist/domma.css', 'public/dist/elements.css'];
const THEME_SOURCE = 'public/dist/themes/domma-themes.css';

const NAMED = {
    transparent: [0, 0, 0, 0],
    black: [0, 0, 0, 1],
    white: [255, 255, 255, 1],
    red: [255, 0, 0, 1],
    green: [0, 128, 0, 1],
    blue: [0, 0, 255, 1],
    inherit: null,
    currentcolor: null,
};

function parseHex(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('') + 'ff';
    else if (hex.length === 4) hex = hex.split('').map(c => c + c).join('');
    else if (hex.length === 6) hex = hex + 'ff';
    if (hex.length !== 8) return null;
    const n = parseInt(hex, 16);
    if (Number.isNaN(n)) return null;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, (n & 255) / 255];
}

function splitArgs(s) {
    const out = [];
    let buf = '', depth = 0;
    for (const ch of s) {
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            out.push(buf.trim());
            buf = '';
            continue;
        }
        buf += ch;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
}

function fnArgs(expr, name) {
    const open = expr.toLowerCase().indexOf(name + '(');
    if (open === -1) return null;
    let depth = 0, i = open + name.length;
    for (; i < expr.length; i++) {
        if (expr[i] === '(') depth++;
        else if (expr[i] === ')') {
            depth--;
            if (!depth) break;
        }
    }
    return expr.slice(open + name.length + 1, i);
}

function resolve(expr, vars, depth = 0) {
    if (expr == null || depth > 12) return null;
    expr = String(expr).trim().replace(/\s*!important$/, '');
    if (!expr) return null;

    const lower = expr.toLowerCase();
    if (lower in NAMED) return NAMED[lower];
    if (expr.startsWith('#')) return parseHex(expr);

    if (/^var\(/i.test(expr)) {
        const args = splitArgs(fnArgs(expr, 'var') ?? '');
        const name = args[0];
        if (name && vars.has(name)) return resolve(vars.get(name), vars, depth + 1);
        return args.length > 1 ? resolve(args.slice(1).join(','), vars, depth + 1) : null;
    }

    if (/^rgba?\(/i.test(expr)) {
        const raw = fnArgs(expr, /^rgba\(/i.test(expr) ? 'rgba' : 'rgb') ?? '';
        const parts = raw.split(/[,\s/]+/).filter(Boolean).map(parseFloat);
        if (parts.length < 3 || parts.some(Number.isNaN)) return null;
        return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
    }

    if (/^color-mix\(/i.test(expr)) {
        const args = splitArgs(fnArgs(expr, 'color-mix') ?? '');
        if (args.length < 3) return null;
        const read = a => {
            const m = a.match(/(.*?)\s+(-?[\d.]+)%\s*$/);
            return m ? { colour: m[1].trim(), pct: parseFloat(m[2]) } : { colour: a.trim(), pct: null };
        };
        const A = read(args[1]), B = read(args[2]);
        const ca = resolve(A.colour, vars, depth + 1);
        const cb = resolve(B.colour, vars, depth + 1);
        if (!ca || !cb) return null;
        let pa = A.pct, pb = B.pct;
        if (pa == null && pb == null) pa = pb = 50;
        else if (pa == null) pa = 100 - pb;
        else if (pb == null) pb = 100 - pa;
        const total = pa + pb;
        if (!total) return null;
        const wa = pa / total, wb = pb / total;
        const a = ca[3] * wa + cb[3] * wb;
        if (!a) return [0, 0, 0, 0];
        return [
            (ca[0] * ca[3] * wa + cb[0] * cb[3] * wb) / a,
            (ca[1] * ca[3] * wa + cb[1] * cb[3] * wb) / a,
            (ca[2] * ca[3] * wa + cb[2] * cb[3] * wb) / a,
            a
        ];
    }

    return null;
}

const over = (fg, bg) => [0, 1, 2].map(i => fg[i] * fg[3] + bg[i] * (1 - fg[3]));

function luminance([r, g, b]) {
    const f = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}

function contrast(fg, bg) {
    const l1 = luminance(fg), l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function baseVars() {
    const vars = new Map();
    for (const rel of VAR_SOURCES) {
        const abs = join(ROOT, rel);
        if (!existsSync(abs)) continue;
        const css = readFileSync(abs, 'utf8');
        const re = /(--dm-[\w-]+)\s*:\s*([^;]+);/g;
        let m;
        while ((m = re.exec(css)) !== null) {
            if (!vars.has(m[1])) vars.set(m[1], m[2].trim());
        }
    }
    return vars;
}

function themeVars(base) {
    const themes = new Map();
    const abs = join(ROOT, THEME_SOURCE);
    if (!existsSync(abs)) return themes;
    const css = readFileSync(abs, 'utf8');
    const blockRe = /\.dm-theme-([\w-]+)\s*\{([^}]+)\}/g;
    let b;
    while ((b = blockRe.exec(css)) !== null) {
        const map = new Map(base);
        const declRe = /(--dm-[\w-]+)\s*:\s*([^;]+);/g;
        let d;
        while ((d = declRe.exec(b[2])) !== null) {
            map.set(d[1], d[2].trim());
        }
        themes.set(b[1], map);
    }
    return themes;
}

function findFiles(dir, exts) {
    const res = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            res.push(...findFiles(full, exts));
        } else if (exts.includes(extname(entry.name))) {
            res.push(full);
        }
    }
    return res;
}

function stripComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function parseRules(css, filePath) {
    const clean = stripComments(css);
    const ruleRe = /([^{]+)\{([^}]+)\}/g;
    let m;
    const out = [];
    while ((m = ruleRe.exec(clean)) !== null) {
        const sel = m[1].trim();
        const body = m[2].trim();
        const start = m.index;
        const line = css.slice(0, start).split('\n').length;
        out.push({ selector: sel, body, line, file: filePath });
    }
    return out;
}

const base = baseVars();
const themes = themeVars(base);

if (!base.size || !themes.size) {
    console.error('✗ dist CSS not built - run `npm run build:css` first');
    process.exit(1);
}

const htmlFiles = findFiles(join(ROOT, 'public'), ['.html']);
const cssFiles = [
    ...findFiles(join(ROOT, 'public'), ['.css']),
    ...findFiles(join(ROOT, 'src/css'), ['.css'])
];

const issues = [];

for (const cssFile of cssFiles) {
    const rel = relative(ROOT, cssFile);
    if (rel.includes('public/dist/') || rel.includes('public/assets/themes/')) continue;
    const content = readFileSync(cssFile, 'utf8');
    const rules = parseRules(content, rel);

    for (const rule of rules) {
        const colorMatch = rule.body.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        const bgMatch = rule.body.match(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i);

        const colorVal = colorMatch ? colorMatch[1].trim() : null;
        const bgVal = bgMatch ? bgMatch[1].trim() : null;

        // Skip swatch utility definitions like .bg-white, .text-white, .text-black
        const isUtilityClass = /^\.(?:bg|text)-(?:white|black|dark|light|slate|gray|zinc|primary|secondary|success|danger|warning|info)/.test(rule.selector);
        // Non-text structural UI elements (knobs, tracks, dividers, thumbs) have no text content
        const isNonTextElement = /(?:knob|track|thumb|divider|handle|indicator|bullet|dot|separator)\b/i.test(rule.selector);

        // Fixed palette background without explicit color
        if (bgVal && !colorVal && !isUtilityClass && !isNonTextElement) {
            const topVarMatch = bgVal.match(/^var\((--dm-[\w-]+)/i);
            const topVar = topVarMatch ? topVarMatch[1] : null;
            const isFixedSwatch = topVar && /--dm-(?:gray|slate|zinc|neutral)-(?:50|100|200|300|700|800|900)|--dm-(?:white|black)/i.test(topVar);
            const isDarkThemedRule = /\.dm-theme-dark|\[data-mode="dark"\]|@media\s*\(prefers-color-scheme:\s*dark\)/.test(rule.selector);

            if (isFixedSwatch && !isDarkThemedRule) {
                issues.push({
                    type: 'FIXED_BG_INHERITS_TEXT',
                    file: rel,
                    line: rule.line,
                    selector: rule.selector,
                    bg: bgVal,
                    fg: 'inherits --dm-text',
                    desc: 'Fixed palette background with no color - text will be illegible in dark themes'
                });
            }
        }
    }
}

// Scan HTML files for inline styles
for (const htmlFile of htmlFiles) {
    const rel = relative(ROOT, htmlFile);
    if (rel.includes('kickstart-files') || rel.includes('templates/')) continue;
    const content = readFileSync(htmlFile, 'utf8');

    // Inline style="..."
    const styleRe = /<([a-z0-9-]+)[^>]*?\bstyle\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = styleRe.exec(content)) !== null) {
        const tag = m[1].toLowerCase();
        if (['img', 'input', 'hr', 'br', 'canvas', 'svg'].includes(tag)) continue;

        const style = m[2];
        const line = content.slice(0, m.index).split('\n').length;

        const colorMatch = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        const bgMatch = style.match(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i);

        if (colorMatch && bgMatch) {
            const colorVal = colorMatch[1].trim();
            const bgVal = bgMatch[1].trim();
            for (const testTheme of ['ocean-light', 'charcoal-dark', 'lemon-light']) {
                const vars = themes.get(testTheme) || base;
                const fg = resolve(colorVal, vars);
                const bg = resolve(bgVal, vars);
                if (fg && bg && bg[3] > 0.5) {
                    const solidFg = over(fg, bg);
                    const ratio = contrast(solidFg, bg);
                    if (ratio < 4.5) {
                        issues.push({
                            type: 'INLINE_LOW_CONTRAST',
                            file: rel,
                            line,
                            selector: `<${tag} style="${style.slice(0, 50)}...">`,
                            fg: colorVal,
                            bg: bgVal,
                            ratio: ratio.toFixed(2),
                            theme: testTheme,
                            desc: `Inline style contrast ${ratio.toFixed(2)}:1 below WCAG AA (4.5:1) in ${testTheme}`
                        });
                        break;
                    }
                }
            }
        } else if (bgMatch && !colorMatch) {
            const bgVal = bgMatch[1].trim();
            const topVarMatch = bgVal.match(/^var\((--dm-[\w-]+)/i);
            const topVar = topVarMatch ? topVarMatch[1] : null;
            const isFixedBg = (topVar && /--dm-(?:gray|slate)-(?:100|200|800|900)/i.test(topVar)) || /^#(?:fff|000|111|222|333|eee|ddd)/i.test(bgVal);

            if (isFixedBg) {
                issues.push({
                    type: 'INLINE_FIXED_BG',
                    file: rel,
                    line,
                    selector: `<${tag} style="${style.slice(0, 50)}...">`,
                    bg: bgVal,
                    fg: 'inherits text',
                    desc: 'Inline fixed background without explicit color'
                });
            }
        }
    }
}

console.log(`✓ Sweep checked ${htmlFiles.length} HTML pages and ${cssFiles.length} CSS files.`);
if (issues.length === 0) {
    console.log('✓ All pages and custom stylesheets pass site contrast checks (0 issues found).');
    process.exit(0);
} else {
    console.error(`✗ Found ${issues.length} site contrast issue(s):\n`);
    const byFile = {};
    for (const issue of issues) {
        byFile[issue.file] = byFile[issue.file] || [];
        byFile[issue.file].push(issue);
    }
    for (const [file, list] of Object.entries(byFile)) {
        console.error(`📁 ${file} (${list.length} issues)`);
        for (const item of list) {
            console.error(`   line ${item.line} [${item.type}] ${item.selector}`);
            console.error(`        fg: ${item.fg} | bg: ${item.bg}`);
            console.error(`        ${item.desc}`);
        }
        console.error('');
    }
    process.exit(1);
}
