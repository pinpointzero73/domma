/**
 * Showcase "Try it" panes — editable code with live output.
 *
 * A showcase should let the reader change something and watch what happens,
 * not just read a snippet. Mark any block up as:
 *
 *   <div class="try-it" data-try-it>
 *       <textarea class="try-it-editor" rows="8">
 *           const count = M.observable(0);
 *           log('count is', count.value);
 *       </textarea>
 *   </div>
 *
 * The header, buttons and output pane are generated, so a page author writes
 * only the code. Inside a pane, `log(...)` prints to the output area and every
 * Domma alias ($, _, M, D, S, H, E, I, T) is in scope.
 *
 * Runs once on load so the reader sees a result before touching anything —
 * demonstrate first, explain after.
 *
 * ── On evaluating code ───────────────────────────────────────────────────────
 * This module compiles a string with `new Function`, which is normally a red
 * flag. Here it is the entire feature: the pane is a REPL, and running what the
 * reader typed is the point — the same trust boundary as their browser console.
 *
 * What matters is where the string comes from, so keep both of these true:
 *   1. The initial code is read only from the page's own markup (first-party
 *      HTML authored in this repo). It is never read from the URL, query
 *      string, hash, storage, postMessage, or any network response — any of
 *      which would turn this into a self-XSS vector for a shared link.
 *   2. Panes appear only on showcase pages, never on a page handling real user
 *      data or credentials.
 *
 * Nothing here is sanitised on purpose: sanitising a REPL's input would stop it
 * doing its job. The safety comes from the input being first-party and the
 * output being scoped to the reader's own tab.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
    'use strict';

    /** Aliases handed to every snippet, so page code reads like app code. */
    const ALIASES = ['$', '_', 'M', 'D', 'S', 'H', 'E', 'I', 'T'];

    /** Strip the leading indentation an HTML author necessarily writes. */
    function dedent(text) {
        const lines = text.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
        const indents = lines
            .filter(line => line.trim())
            .map(line => line.match(/^\s*/)[0].length);
        const pad = indents.length ? Math.min(...indents) : 0;
        return lines.map(line => line.slice(pad)).join('\n');
    }

    function build(pane) {
        const editor = pane.querySelector('.try-it-editor');
        if (!editor) return;

        const original = dedent(editor.value || editor.textContent);
        editor.value = original;

        const header = document.createElement('div');
        header.className = 'try-it-header';

        const label = document.createElement('span');
        label.className = 'try-it-label';
        label.textContent = pane.dataset.tryIt || 'Try it';

        const hint = document.createElement('span');
        hint.className = 'try-it-hint';
        hint.textContent = 'edit the code, then Run';

        const actions = document.createElement('div');
        actions.className = 'try-it-actions';

        const run = document.createElement('button');
        run.type = 'button';
        run.className = 'btn btn-primary btn-sm';
        run.textContent = 'Run';

        const reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'btn btn-outline btn-sm';
        reset.textContent = 'Reset';

        actions.append(run, reset);
        header.append(label, hint, actions);

        const output = document.createElement('div');
        output.className = 'try-it-output';
        output.setAttribute('aria-live', 'polite');

        pane.insertBefore(header, editor);
        pane.appendChild(output);

        /** Print a line to the output pane. Objects are JSON-formatted. */
        function print(args, isError) {
            const line = document.createElement('div');
            line.className = 'try-it-line';
            if (isError) line.classList.add('is-error');
            // textContent, never innerHTML: whatever the snippet produces is
            // shown as text, so a string containing markup cannot inject.
            line.textContent = args
                .map(a => {
                    if (typeof a === 'string') return a;
                    try { return JSON.stringify(a); } catch { return String(a); }
                })
                .join(' ');
            output.appendChild(line);
        }

        function execute() {
            output.textContent = '';
            output.classList.remove('has-error');

            const log = (...args) => print(args, false);

            try {
                const compiled = new Function(...ALIASES, 'log', editor.value);
                compiled(...ALIASES.map(name => window[name]), log);
                if (!output.childElementCount) {
                    log('(ran without printing anything — add a log(...) call)');
                }
            } catch (err) {
                output.classList.add('has-error');
                print([err.name + ': ' + err.message], true);
            }
        }

        $(run).on('click', execute);
        $(reset).on('click', () => {
            editor.value = original;
            execute();
        });
        $(editor).on('keydown', e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                execute();
            }
        });

        execute();
    }

    function init(root) {
        (root || document).querySelectorAll('[data-try-it]').forEach(build);
    }

    if (document.readyState === 'loading') {
        $(() => init());
    } else {
        init();
    }

    window.TryIt = {init};
})();
