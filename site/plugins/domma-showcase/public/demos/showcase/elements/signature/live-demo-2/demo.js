/**
 * Step 3: Live Demo - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 10: Tutorial ─────────────────────────────────────────
    const tutSig = E.signature(root.querySelector('#tutorial-sig'), {
          label: 'Your Signature',
          name: 'signature',
          typeFallback: true,
          onChange: () => {
            $(root).find('#tutorial-submit-btn').prop('disabled', tutSig.isEmpty());
          }
        });
    $(root).find('#tutorial-contract-form').on('submit', async (e) => {
          e.preventDefault();
          if (tutSig.isEmpty()) {
            E.toast('Please add your signature before submitting.', { type: 'warning' });
            return;
          }
          const agreed = $(root).find('#tutorial-agreed').prop('checked');
          if (!agreed) {
            E.toast('You must agree to the terms.', { type: 'warning' });
            return;
          }
          const fullName = e.target.querySelector('[name="fullName"]').value.trim();
          const confirmed = await E.confirm('Submit this signed contract?');
          if (!confirmed) return;

          const b64 = tutSig.toBase64('png');
          const output = `
            <strong>Submitted!</strong><br>
            Name: ${_.escapeHtml ? _.escapeHtml(fullName) : fullName}<br>
            Agreed: ${agreed}<br>
            Signature: <img src="${b64}" style="height:40px;vertical-align:middle;background:#fff;color:var(--dm-gray-900);border-radius:4px;padding:2px;margin-left:4px;">
          `;
          $(root).find('#tutorial-output').html(output).show();
          E.toast('Contract signed successfully!', { type: 'success' });
        });
}
