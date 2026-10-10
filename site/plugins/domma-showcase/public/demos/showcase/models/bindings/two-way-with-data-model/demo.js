/**
 * Two-way with data-model - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── Two-way ───────────────────────────────────────────────────────────
    Domma.component('bind-model', {
            template: `
                <div class="mb-3">
                    <label class="form-label">Search</label>
                    <input class="form-input" data-model="query" placeholder="type to search…">
                </div>
                <p class="mb-0">
                    Searching for <b data-bind-text="query || '(nothing)'"></b>
                    - <span data-bind-text="query.length"></span> character(s)
                </p>`,
            data() { return {query: ''}; }
        });
    $(root).find('#model-host').append(document.createElement('bind-model'));
}
