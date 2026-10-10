/**
 * Keyed lists keep the DOM you were using - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── Keyed lists ───────────────────────────────────────────────────────
    Domma.component('bind-keyed', {
            template: `
                <div class="flex gap-2 flex-wrap mb-3">
                    <button class="btn btn-sm btn-primary" data-on-click="prepend">Prepend</button>
                    <button class="btn btn-sm btn-outline" data-on-click="shuffle">Reverse</button>
                    <button class="btn btn-sm btn-outline" data-on-click="dropFirst">Remove first</button>
                </div>
                <div id="keyed-rows">
                    {{#each rows key=id}}
                    <div class="bind-row">
                        <span class="bind-tag">{{id}}</span>
                        <input class="form-input" data-model="note" placeholder="type here, then Prepend…">
                        <span>{{name}}</span>
                    </div>
                    {{/each}}
                </div>
                <p class="bind-stamp mt-3 mb-0" data-bind-text="identity"></p>`,
            data() {
                return {
                    nextId: 4,
                    identity: 'no change yet',
                    rows: [
                        {id: 1, name: 'first', note: ''},
                        {id: 2, name: 'second', note: ''},
                        {id: 3, name: 'third', note: ''}
                    ]
                };
            },
            methods: {
                // Measured rather than claimed: hold the actual node objects, make
                // the change, then count how many are still the identical object.
                _snapshot() {
                    return Array.from(this.root.querySelectorAll('.bind-row'));
                },
                _report(before) {
                    const after = this._snapshot();
                    const kept = before.filter((node) => after.includes(node)).length;
                    this.set({
                        identity: `${kept} of ${before.length} original row element(s) survived - same objects, not rebuilt`
                    });
                },
                prepend() {
                    const before = this._snapshot();
                    const id = this.data.nextId;
                    this.set({
                        nextId: id + 1,
                        rows: [{id, name: 'new', note: ''}, ...this.data.rows]
                    });
                    setTimeout(() => this._report(before), 0);
                },
                shuffle() {
                    const before = this._snapshot();
                    this.set({rows: [...this.data.rows].reverse()});
                    setTimeout(() => this._report(before), 0);
                },
                dropFirst() {
                    const before = this._snapshot();
                    this.set({rows: this.data.rows.slice(1)});
                    setTimeout(() => this._report(before), 0);
                }
            }
        });
    $(root).find('#keyed-host').append(document.createElement('bind-keyed'));
}
