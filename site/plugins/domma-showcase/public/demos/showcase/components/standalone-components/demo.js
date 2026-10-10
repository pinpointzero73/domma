/**
 * Standalone Components - from public/showcase/components.
 */
export function mount(root) {
        // ── Collapsible example cards ────────────────────────────────────────────
    ['card-counter', 'card-user-card', 'card-router', 'card-sfc', 'card-api'].forEach(id => {
            E.card(root.querySelector(`#${id}`), { collapsible: true });
        });
        // ── Lifecycle log (bound list) ──────────────────────────────────────────
    // Each entry is a row in an observable list; #counter-log renders it with
    // data-each, so the log is data rather than appended HTML strings.
    const $log = $(root).find('#counter-log');
    const entries = M.observable([]);
    let seq = 0;
    let scrollFrame = 0;
    const logHandle = M.applyBindings({entries}, $log[0]);
    function counterLog(msg, type = 'update') {
            entries.value = [...entries.value, {id: ++seq, time: D().format('HH:mm:ss'), msg, type}];
            // Keep the newest entry in view once the list has rendered
            cancelAnimationFrame(scrollFrame);
            scrollFrame = requestAnimationFrame(() => $log.scrollTop($log[0].scrollHeight));
        }
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
        // ── Example 2: User Card ────────────────────────────────────────────────
    Domma.component('user-card-demo', {
            props: {
                userId:     { type: 'number',  required: true },
                showAvatar: { type: 'boolean', default: true  }
            },

            data() {
                return { name: '', role: '', department: '', loading: true };
            },

            computed: {
                initials() {
                    if (!this.data.name) return '?';
                    return this.data.name.split(' ')
                        .map(n => n[0] || '')
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
                }
            },

            methods: {
                async fetchUser() {
                    this.set({ loading: true });

                    // Simulated API call - replace with H.get('/api/users/' + this.props.userId)
                    await new Promise(r => setTimeout(r, 700));

                    const db = {
                        42: { name: 'Alice Nguyen',   role: 'Senior Engineer',    department: 'Platform' },
                         7: { name: 'Bob Okafor',     role: 'Product Manager',    department: 'Product'  },
                        99: { name: 'Carol Lindström', role: 'Design Lead',        department: 'UX'       }
                    };

                    const user = db[this.props.userId] ?? { name: 'Unknown User', role: '-', department: '-' };
                    this.set({ name: user.name, role: user.role, department: user.department, loading: false });
                }
            },

            onMount() { this.fetchUser(); },

            onPropsChanged(name) {
                if (name === 'userId') this.fetchUser();
            },

            template: `
                <div class="uc">
                    {{#if loading}}
                    <div class="skeleton-wrap">
                        <div class="sk sk-avatar"></div>
                        <div class="flex-fill">
                            <div class="sk sk-line"></div>
                            <div class="sk sk-line sk-short"></div>
                        </div>
                    </div>
                    {{/if}}
                    {{#unless loading}}
                    <div class="user-row">
                        {{#if showAvatar}}
                        <div class="avatar">{{initials}}</div>
                        {{/if}}
                        <div class="user-info">
                            <p class="name">{{name}}</p>
                            <p class="role">{{role}}</p>
                            <p class="dept">{{department}}</p>
                        </div>
                    </div>
                    {{/unless}}
                </div>
            `,

            style: `
                .uc {
                    font-family: system-ui, sans-serif;
                    padding: 1.5rem;
                    min-width: 220px;
                }
                .user-row { display: flex; align-items: center; gap: 1rem; }
                .avatar {
                    width: 3.5rem; height: 3.5rem;
                    border-radius: 50%;
                    background: var(--dm-primary, #6495ED);
                    color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem; font-weight: 700;
                    flex-shrink: 0;
                }
                .name  { font-weight: 700; font-size: 1.05rem; margin: 0 0 .2rem; }
                .role  { color: #6b7280; font-size: .85rem; margin: 0 0 .15rem; }
                .dept  { font-size: .75rem; color: #9ca3af; margin: 0;
                         text-transform: uppercase; letter-spacing: .05em; }

                /* Skeleton loader */
                .skeleton-wrap { display: flex; align-items: center; gap: 1rem; }
                .sk {
                    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                }
                .sk-avatar { width: 3.5rem; height: 3.5rem; border-radius: 50%; flex-shrink: 0; }
                .sk-line   { height: 14px; margin-bottom: 8px; width: 120px; }
                .sk-short  { width: 80px; margin-bottom: 0; }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `
        });
        // ── User Card controls ──────────────────────────────────────────────────
    const userCardEl = root.querySelector('user-card-demo');
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
    return () => {
        cancelAnimationFrame(scrollFrame);
        logHandle.dispose();
    };
}
