/**
 * Admin Theme Builder - from public/showcase/themes.
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
      // ── Contrast checker (WCAG AA) ────────────────────────────────────────
    let auditEnabled = false;
    const $toggleBtn = $(root).find('#audit-toggle');
    const $toggleText = $(root).find('#audit-toggle-text');
    const $summary = $(root).find('#audit-summary');
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
    $toggleBtn.on('click', () => {
        auditEnabled = !auditEnabled;
        $toggleBtn.toggleClass('active', auditEnabled);
        $toggleText.text(auditEnabled ? 'Hide contrast issues' : 'Highlight contrast issues');
        if (auditEnabled) {
          runAudit();
        } else {
          clearAuditMarks();
          $summary.removeClass('has-issues clean').addClass('idle').text('Audit off');
        }
      });
      // ── Dump failures ─────────────────────────────────────────────────────
      // Collects every failing element with its CSS-path-style selector and
      // copies a structured report to the clipboard for sharing.
    function describeElement(el) {
        const parts = [];
        let cur = el;
        while (cur && cur !== document.body && parts.length < 5) {
          let s = cur.tagName.toLowerCase();
          if (cur.id) s += `#${cur.id}`;
          else if (cur.className && typeof cur.className === 'string') {
            const classes = cur.className.trim().split(/\s+/).slice(0, 4).join('.');
            if (classes) s += `.${classes}`;
          }
          parts.unshift(s);
          cur = cur.parentElement;
        }
        return parts.join(' > ');
      }
    $(root).find('#audit-dump').on('click', async () => {
        let report = '';
        try {
          const allThemes = (Domma.theme && Domma.theme.listThemes) ? Domma.theme.listThemes() : [];
          const originalTheme = (Domma.theme && Domma.theme.get) ? Domma.theme.get() : null;
          const wasEnabled = auditEnabled;

          report = `# Contrast failure dump - generated ${D().toISOString()}\n`;
          report += `Themes scanned: ${allThemes.length}\n\n`;

          const summary = [];

          for (const theme of allThemes) {
            // Apply theme and let CSS settle before measuring
            if (Domma.theme && Domma.theme.set) Domma.theme.set(theme);
            // Two RAFs + a settle delay so style/layout recalculation finishes
            // before the audit reads computed values; otherwise dumps occasionally
            // capture transitional state (e.g. half-applied theme classes).
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            await new Promise(r => setTimeout(r, 200));

            clearAuditMarks();
            runAudit();

            const fails = [];
            $('.audit-fail').each((i, el) => {
              try {
                const styles = getComputedStyle(el);
                const fg = parseRgb(styles.color);
                const bg = effectiveBg(el);
                fails.push({
                  ratio: parseFloat(el.getAttribute('data-audit-ratio')) || 0,
                  path: describeElement(el),
                  text: (el.textContent || '').trim().slice(0, 60).replace(/\s+/g, ' '),
                  fg: fg ? `rgb(${fg.r},${fg.g},${fg.b})` : (styles.color || 'unknown'),
                  bg: bg ? `rgb(${bg.r},${bg.g},${bg.b})` : 'unknown',
                  fontSize: parseFloat(styles.fontSize) || 0,
                  fontWeight: parseInt(styles.fontWeight) || 400
                });
              } catch (innerErr) {
                fails.push({ ratio: 0, path: '(error)', text: String(innerErr.message || innerErr), fg: '?', bg: '?', fontSize: 0, fontWeight: 0 });
              }
            });
            fails.sort((a, b) => a.ratio - b.ratio);
            summary.push({ theme, count: fails.length });

            report += `\n══════════════════════════════════════════════\n`;
            report += `THEME: ${theme}  -  ${fails.length} failures\n`;
            report += `══════════════════════════════════════════════\n`;
            // Limit to 30 worst per theme to keep report manageable
            const sample = fails.slice(0, 30);
            sample.forEach((f, i) => {
              report += `${i + 1}. [${f.ratio.toFixed(2)}:1] ${f.path}\n`;
              report += `   text: "${f.text}"\n   fg=${f.fg}  bg=${f.bg}  ${f.fontSize}px/${f.fontWeight}\n`;
            });
            if (fails.length > sample.length) {
              report += `... and ${fails.length - sample.length} more (truncated)\n`;
            }
          }

          // Restore original theme
          if (originalTheme && Domma.theme && Domma.theme.set) Domma.theme.set(originalTheme);

          if (!wasEnabled) {
            clearAuditMarks();
            summaryEl.classList.remove('has-issues', 'clean');
            summaryEl.classList.add('idle');
            summaryEl.textContent = 'Audit off';
          } else {
            runAudit();
          }

          const totalReport = '# SUMMARY\n' + summary.map(s => `  ${s.theme.padEnd(20)} ${s.count}`).join('\n') + '\n\n' + report;
          report = totalReport;
          console.log(report);
        } catch (err) {
          report = '# DUMP ERROR\n' + (err && err.stack ? err.stack : String(err));
          console.error(report);
        }

        // Show a modal-style textarea with the report so the user can copy it
        // regardless of clipboard API availability.
        // .remove() on an empty collection is a no-op, so no guard is needed.
        $(root).find('#audit-dump-modal').remove();

        const overlay = document.createElement('div');
        overlay.id = 'audit-dump-modal';
        Object.assign(overlay.style, {
          position: 'fixed', inset: '0',
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: '99999', padding: '2rem'
        });

        const panel = document.createElement('div');
        Object.assign(panel.style, {
          background: '#fff', color: '#000',
          borderRadius: '8px',
          maxWidth: '800px', maxHeight: '80vh', width: '100%',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
        });

        const header = document.createElement('div');
        header.style.cssText = 'padding: 0.75rem 1rem; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;';
        const title = document.createElement('strong');
        title.textContent = 'Contrast failure dump (Ctrl+A then Ctrl+C to copy)';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'background: none; border: none; font-size: 1.5rem; cursor: pointer; line-height: 1; color: #000;';
        $(closeBtn).on('click', () => overlay.remove());
        header.appendChild(title);
        header.appendChild(closeBtn);

        const ta = document.createElement('textarea');
        ta.value = report;
        ta.readOnly = true;
        Object.assign(ta.style, {
          flex: '1', width: '100%', border: 'none',
          padding: '1rem', fontFamily: 'monospace', fontSize: '12px',
          resize: 'none', outline: 'none', background: '#f8f9fa', color: '#000'
        });

        panel.appendChild(header);
        panel.appendChild(ta);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        $(overlay).on('click', (e) => { if (e.target === overlay) overlay.remove(); });
        setTimeout(() => { ta.focus(); ta.select(); }, 50);

        // Best-effort attempt at modern clipboard, but never block the modal.
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(report).catch(() => {});
        }
      });
}
