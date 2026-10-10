/**
 * Already on in your components - from public/showcase/models/reactivity.
 */
export function mount(root) {
    // The log is a bound list (data-each in demo.html): newest first, so prepend.
    // peek() reads it without tracking - logTo runs inside effects, and a tracked
    // read of the log there would make the effect depend on its own output.
    const log = M.observable([]);
    let seq = 0;
    function logTo(entry) {
            const row = {id: ++seq, time: `[${D().format('HH:mm:ss')}]`, ...entry};
            log.value = [row, ...log.peek()];
        }
    const handle = M.applyBindings({log}, root);
        // ══════════════════════════════════════════════════════════════════════
        // 1. Tracked Computeds
        // ══════════════════════════════════════════════════════════════════════
    const order = M.create(
            {price: {}, qty: {}, note: {}},
            {price: 10, qty: 3, note: ''}
        );
        // ══════════════════════════════════════════════════════════════════════
        // 5. Components
        // ══════════════════════════════════════════════════════════════════════
    let labelEvals = 0;
    Domma.component('rx-order-summary', {
            // Styling hooks are data-attributes rather than classes: these live in
            // the component's Shadow DOM, where the page stylesheet cannot reach
            // them, so a class here would look like an undefined page class to any
            // audit of the document's CSS.
            template: `
                <div data-rx-summary-box>
                    <p data-rx-summary-label>{{label}}</p>
                    {{#if freeDelivery}}<em>Free delivery applies</em>{{/if}}
                </div>
            `,

            // Theme variables are injected into every component's Shadow DOM, so
            // var(--dm-*) resolves here and follows the light/dark variant. A
            // literal colour would not.
            style: `
                [data-rx-summary-box] {
                    padding: 1rem;
                    border: 1px solid var(--dm-border);
                    border-radius: 0.5rem;
                    background: var(--dm-surface, transparent);
                    color: var(--dm-text);
                }

                [data-rx-summary-label] {
                    margin: 0 0 0.5rem;
                }
            `,

            data() {
                return {items: 1, unitPrice: 25, discount: false, note: ''};
            },

            computed: {
                label() {
                    labelEvals++;
                    const gross = this.data.items * this.data.unitPrice;
                    const net = this.data.discount ? gross * 0.9 : gross;
                    return `${this.data.items} item(s) - £${net.toFixed(2)}`;
                },
                freeDelivery() {
                    return this.data.items * this.data.unitPrice > 50;
                }
            },

            // Controls live outside the component, so bind them here where the
            // component context (and its reactive set()) is in scope.
            onMount() {
                $(root).find('#rx-add').on('click', () => {
                    this.set({items: this.data.items + 1});
                });

                $(root).find('#rx-discount').on('click', () => {
                    this.set({discount: !this.data.discount});
                });

                $(root).find('#rx-touch').on('click', () => {
                    this.set({note: `touched at ${D().format('HH:mm:ss')}`});
                    logTo({kind: 'touch', evals: labelEvals});
                });
            },

            onUpdated() {
                logTo({kind: 'render', evals: labelEvals});
            }
        });
    $(root).find('#rx-component-host').append(document.createElement('rx-order-summary'));
    return () => handle.dispose();
}
