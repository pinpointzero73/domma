/**
 * Text, classes and attributes - from public/showcase/models/bindings.
 */
export function mount(root) {
    Domma.component('bind-oneway', {
            template: `
                <div class="mb-3">
                    <label class="form-label">Label</label>
                    <input class="form-input" data-model="label" placeholder="type something…">
                </div>
                <label class="mb-3 block">
                    <input type="checkbox" data-on-change="toggleUrgent"> Urgent
                </label>
                <p class="mb-2">Text: <b data-bind-text="label"></b></p>
                <p class="mb-2">
                    Class: <span class="badge" data-bind-class="urgent && 'badge-danger'">badge</span>
                </p>
                <p class="mb-0">
                    Property: <button class="btn btn-sm btn-primary" data-bind-disabled="!label">Send</button>
                </p>`,
            data() { return {label: 'Ada', urgent: false}; },
            methods: {
                toggleUrgent() { this.set({urgent: !this.data.urgent}); }
            }
        });
    $(root).find('#oneway-host').append(document.createElement('bind-oneway'));
}
