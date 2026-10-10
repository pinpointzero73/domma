/**
 * Events - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── Events ────────────────────────────────────────────────────────────
    Domma.component('bind-events', {
            template: `
                <p class="mb-3">Count: <b data-bind-text="count"></b></p>
                <div class="flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-primary" data-on-click="bump">+1</button>
                    <button class="btn btn-sm btn-outline" data-on-click="add(5)">+5</button>
                    <button class="btn btn-sm btn-outline" data-on-click="reset">Reset</button>
                </div>
                <p class="bind-stamp mt-3 mb-0" data-bind-text="last"></p>`,
            data() { return {count: 0, last: 'nothing yet'}; },
            methods: {
                bump(event) { this.add(1, event); },
                add(n, event) {
                    this.set({
                        count: this.data.count + n,
                        last: `${event ? event.type : 'call'} → +${n} at ${D().format('HH:mm:ss')}`
                    });
                },
                reset() { this.set({count: 0, last: 'reset'}); }
            }
        });
    $(root).find('#events-host').append(document.createElement('bind-events'));
}
