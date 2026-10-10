/**
 * Conditionals - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── Conditionals ──────────────────────────────────────────────────────
    Domma.component('bind-if', {
            template: `
                <div class="flex gap-2 mb-3">
                    <button class="btn btn-sm btn-primary" data-on-click="addOne">Add an item</button>
                    <button class="btn btn-sm btn-outline" data-on-click="clear">Clear</button>
                </div>
                <p class="mb-0" data-if="isEmpty">Nothing yet.</p>
                <p class="mb-0" data-bind-hidden="isEmpty"><b data-bind-text="count"></b> item(s)</p>`,
            data() { return {count: 0}; },
            computed: {
                isEmpty() { return this.data.count === 0; }
            },
            methods: {
                addOne() { this.set({count: this.data.count + 1}); },
                clear() { this.set({count: 0}); }
            }
        });
    $(root).find('#if-host').append(document.createElement('bind-if'));
}
