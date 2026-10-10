/**
 * Standalone Components - from public/showcase/components.
 */
export function mount(root) {
        // ── Lifecycle log helper ────────────────────────────────────────────────
    function makeLogger($log) {
            return function log(msg, type = 'update') {
                const time = D().format('HH:mm:ss');
                // Remove placeholder text on first log
                if ($log.find('.text-muted').length) $log.text('');
                $log.append(
                    `<p><span class="log-time">${time}</span><span class="log-${type}">${msg}</span></p>`
                );
                $log.scrollTop($log[0].scrollHeight);
            };
        }
    const counterLog = makeLogger($(root).find('#counter-log'));
        // ── Example 1: Counter ──────────────────────────────────────────────────
    Domma.component('counter-demo', {
            template: `
                <div class="counter-wrap">
                    <p class="count">Count: <span class="num">{{count}}</span></p>
                    <p class="doubled">Doubled: {{doubled}}</p>
                    {{#if high}}
                    <div class="badge-high">🔥 High! (≥10)</div>
                    {{/if}}
                    <div class="actions">
                        <button class="btn-dec">−</button>
                        <button class="btn-inc">+</button>
                        <button class="btn-rst">Reset</button>
                    </div>
                </div>
            `,

            data() { return { count: 0 }; },

            computed: {
                doubled() { return this.data.count * 2; },
                high()    { return this.data.count >= 10; }
            },

            methods: {
                increment() { this.set({ count: this.data.count + 1 }); },
                decrement() { this.set({ count: this.data.count - 1 }); },
                reset()     { this.set({ count: 0 }); }
            },

            onBeforeMount() { counterLog('onBeforeMount fired', 'mount'); },

            onMount() {
                counterLog('onMount - component ready', 'mount');
                // $ can't pierce Shadow DOM - wrap root.querySelector() in $() to use Domma events
                $(this.root.querySelector('.btn-inc')).on('click', () => this.increment());
                $(this.root.querySelector('.btn-dec')).on('click', () => this.decrement());
                $(this.root.querySelector('.btn-rst')).on('click', () => this.reset());
            },

            onUpdated() {
                counterLog(`onUpdated - count=${this.data.count}, doubled=${this.data.count * 2}`, 'update');
            },

            onUnmount() { counterLog('onUnmount fired', 'unmount'); },

            style: `
                .counter-wrap {
                    text-align: center;
                    padding: 1.5rem 2rem;
                    font-family: system-ui, sans-serif;
                }
                .count {
                    font-size: 1.6rem;
                    font-weight: 700;
                    margin: 0 0 0.25rem;
                }
                .num { color: var(--dm-primary, #6495ED); }
                .doubled {
                    color: #6b7280;
                    font-size: 0.9rem;
                    margin: 0 0 0.75rem;
                }
                .badge-high {
                    display: inline-block;
                    background: #dc2626;
                    color: #fff;
                    padding: .2em .75em;
                    border-radius: 9999px;
                    font-size: .8rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                }
                .actions {
                    display: flex;
                    gap: .5rem;
                    justify-content: center;
                }
                button {
                    padding: .5rem 1.25rem;
                    border: none;
                    border-radius: 8px;
                    background: var(--dm-primary, #6495ED);
                    color: #fff;
                    cursor: pointer;
                    font-size: 1.1rem;
                    font-weight: 600;
                    transition: opacity .15s;
                }
                button:hover { opacity: 0.85; }
                .btn-dec { background: var(--dm-danger, #dc2626); }
                .btn-rst { background: #6b7280; font-size: 0.85rem; }
            `
        });
        // ── User Card controls ──────────────────────────────────────────────────
    const userCardEl = $('user-card-demo')[0];
    let avatarVisible = true;
    $(root).find('#btn-user-42').on('click', () => {
            userCardEl.setAttribute('user-id', '42');
        });
    $(root).find('#btn-user-7').on('click', () => {
            userCardEl.setAttribute('user-id', '7');
        });
    $(root).find('#btn-toggle-avatar').on('click', () => {
            avatarVisible = !avatarVisible;
            if (avatarVisible) {
                userCardEl.setAttribute('show-avatar', '');
            } else {
                userCardEl.removeAttribute('show-avatar');
            }
        });
}
