/**
 * A whole small app - from public/showcase/models/bindings.
 */
export function mount(root) {
        // ── A whole small app ─────────────────────────────────────────────────
    Domma.component('bind-todo', {
            template: `
                <div class="flex gap-2 mb-3">
                    <input class="form-input" data-model="draft" data-on-keyup="onKey"
                           placeholder="What needs doing?">
                    <button class="btn btn-sm btn-primary" data-on-click="add">Add</button>
                </div>
                <div>
                    {{#each todos key=id}}
                    <div class="bind-row">
                        <input type="checkbox" data-on-change="$parent.toggle($data)">
                        <span data-bind-class="done && 'bind-struck'">{{title}}</span>
                        <button class="btn btn-sm btn-outline" data-on-click="$parent.remove($data)">×</button>
                    </div>
                    {{/each}}
                </div>
                <p class="mt-3 mb-0" data-if="isEmpty">Nothing to do.</p>
                <p class="mt-3 mb-0" data-bind-hidden="isEmpty" data-bind-text="summary"></p>`,
            data() {
                return {nextId: 1, draft: '', todos: []};
            },
            computed: {
                isEmpty() { return this.data.todos.length === 0; },
                summary() {
                    const all = this.data.todos;
                    return `${all.filter((t) => !t.done).length} of ${all.length} left`;
                }
            },
            methods: {
                onKey(event) {
                    if (event.key === 'Enter') this.add();
                },
                add() {
                    const title = (this.data.draft || '').trim();
                    if (!title) return;
                    const id = this.data.nextId;
                    this.set({
                        nextId: id + 1,
                        draft: '',
                        todos: [...this.data.todos, {id, title, done: false}]
                    });
                },
                toggle(item) {
                    this.set({
                        todos: this.data.todos.map(
                            (t) => (t.id === item.id ? {...t, done: !t.done} : t)
                        )
                    });
                },
                remove(item) {
                    this.set({todos: this.data.todos.filter((t) => t.id !== item.id)});
                }
            }
        });
    $(root).find('#todo-host').append(document.createElement('bind-todo'));
}
