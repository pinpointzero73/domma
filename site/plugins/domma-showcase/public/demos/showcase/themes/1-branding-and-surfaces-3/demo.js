/**
 * 1. Branding & Surfaces - from public/showcase/themes.
 */
export function mount(root) {
    const colours = [
          {name: 'Primary',    var: '--dm-primary'},
          {name: 'Secondary',  var: '--dm-secondary'},
          {name: 'Success',    var: '--dm-success'},
          {name: 'Danger',     var: '--dm-danger'},
          {name: 'Warning',    var: '--dm-warning'},
          {name: 'Info',       var: '--dm-info'},
          {name: 'Background', var: '--dm-background'},
          {name: 'Surface',    var: '--dm-surface'},
          {name: 'Text',       var: '--dm-text'},
          {name: 'Border',     var: '--dm-border'}
      ];
    function renderPalette() {
        const $host = $(root).find('#colour-palette');
        if (!$host.length) return;
        const host = $host.empty()[0];
        colours.forEach(c => {
          const swatch = document.createElement('div');
          swatch.className = 'themes-colour-swatch';
          const circle = document.createElement('div');
          circle.className = 'themes-colour-circle';
          circle.style.background = `var(${c.var})`;
          const label = document.createElement('div');
          label.className = 'themes-colour-label';
          label.textContent = c.name;
          swatch.appendChild(circle);
          swatch.appendChild(label);
          host.appendChild(swatch);
        });
      }
    function updateActiveStates() {
        const current = Domma.theme.get();
        $('.theme-card').removeClass('active');
        $(`.theme-card[data-theme="${current}"]`).addClass('active');
      }
    renderPalette();
    Domma.theme.onChange(() => {
        updateActiveStates();
        setTimeout(() => {
          renderPalette();
          if (auditEnabled) runAudit();
        }, 80);
      });
      // ── Contrast checker (WCAG AA) ────────────────────────────────────────
    let auditEnabled = false;
    function parseRgb(str) {
        if (!str) return null;
        const m = str.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const parts = m[1].split(',').map(p => parseFloat(p.trim()));
        if (parts.length < 3) return null;
        const a = parts[3] === undefined ? 1 : parts[3];
        return { r: parts[0], g: parts[1], b: parts[2], a };
      }
    function relLuminance(c) {
        const norm = v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * norm(c.r) + 0.7152 * norm(c.g) + 0.0722 * norm(c.b);
      }
    function contrastRatio(fg, bg) {
        const l1 = relLuminance(fg);
        const l2 = relLuminance(bg);
        const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
        return (light + 0.05) / (dark + 0.05);
      }
      // Alpha-composite "src" over "dst" using standard "over" operator.
      // Returns an opaque colour (a=1) approximating the rendered result.
    function composite(src, dst) {
        if (!src) return dst;
        if (src.a >= 0.999) return { r: src.r, g: src.g, b: src.b, a: 1 };
        const a = src.a + dst.a * (1 - src.a);
        const r = (src.r * src.a + dst.r * dst.a * (1 - src.a)) / (a || 1);
        const g = (src.g * src.a + dst.g * dst.a * (1 - src.a)) / (a || 1);
        const b = (src.b * src.a + dst.b * dst.a * (1 - src.a)) / (a || 1);
        return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: 1 };
      }
    function effectiveBg(el) {
        // Walk up the ancestor chain collecting every translucent layer, then
        // composite them top-down so a `rgba(brand, 0.15)` over a dark surface
        // resolves to its real visual colour rather than the brand colour itself.
        const layers = [];
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = parseRgb(getComputedStyle(cur).backgroundColor);
          if (bg && bg.a > 0) {
            layers.push(bg);
            if (bg.a >= 0.999) break;
          }
          cur = cur.parentElement;
        }
        let base = parseRgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
        if (!base.a || base.a < 0.999) base = { r: base.r || 255, g: base.g || 255, b: base.b || 255, a: 1 };
        // layers[0] is the element itself, layers[N] is closest opaque ancestor; composite from back to front
        for (let i = layers.length - 1; i >= 0; i--) base = composite(layers[i], base);
        return base;
      }
    function hasOwnText(el) {
        return Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      }
    function clearAuditMarks() {
        $('.audit-fail').removeClass('audit-fail').removeAttr('data-audit-ratio');
      }
      // Web-component hosts present known false-positives for background detection
      // (their Shadow DOM slots reparent children for layout while keeping them in
      // light DOM, which confuses ancestor-walk-based bg detection). Skip elements
      // inside these wrappers; the underlying button colours are tested elsewhere.
    function isInsideUnauditedHost(el) {
        let cur = el;
        while (cur && cur !== document.body) {
          const tag = cur.tagName ? cur.tagName.toLowerCase() : '';
          if (tag === 'domma-tooltip' || tag === 'domma-number-badge') return true;
          cur = cur.parentElement;
        }
        return false;
      }
    function runAudit() {
        clearAuditMarks();
        let failures = 0;
        $('.audit-section *').each((i, el) => {
          if (!hasOwnText(el)) return;
          if (isInsideUnauditedHost(el)) return;
          const styles = getComputedStyle(el);
          if (styles.visibility === 'hidden' || styles.display === 'none') return;
          const fg = parseRgb(styles.color);
          const bg = effectiveBg(el);
          if (!fg || !bg || fg.a < 0.1) return;

          const ratio = contrastRatio(fg, bg);
          const fontSize = parseFloat(styles.fontSize);
          const fontWeight = parseInt(styles.fontWeight) || 400;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
          const threshold = isLarge ? 3 : 4.5;

          if (ratio < threshold) {
            el.classList.add('audit-fail');
            el.setAttribute('data-audit-ratio', ratio.toFixed(2));
            failures++;
          }
        });

        $summary.removeClass('idle has-issues clean');
        if (failures === 0) {
          $summary.text('No issues found').addClass('clean');
        } else {
          $summary.text(`${failures} contrast issue${failures === 1 ? '' : 's'}`).addClass('has-issues');
        }
      }
}
