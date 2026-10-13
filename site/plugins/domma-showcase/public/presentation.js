import {pages, methods} from './reference-catalogue.js?v=14f48b3d70ef';

const METHOD = /^\.?[A-Za-z_$][\w.$]*(?:\([^\n]*\))?$/;
const nameOf = text => text.replace(/^\./, '').split('(')[0].split('.').at(-1);
const iconFor = title => /reference|method|api|token|option/i.test(title) ? 'code' : /demo|try|example|preview/i.test(title) ? 'play' : /getting|start|setup|usage/i.test(title) ? 'settings' : 'layers';

function referenceCard(label, description) {
    const card = $('<li class="sx-reference-item"></li>');
    card.append($('<code class="sx-reference-name"></code>').text(label).get(0));
    if (description) card.append($('<p class="sx-reference-description"></p>').text(description).get(0));
    else card.addClass('sx-reference-pill');
    return card.get(0);
}

function decorateLists(body, descriptions) {
    // The migration turned styled method grids into consecutive paragraphs.
    const nodes = $(body).children().get();
    for (let i = 0; i < nodes.length; i++) {
        const run = [];
        while (i < nodes.length && nodes[i].tagName === 'P' && METHOD.test(nodes[i].textContent.trim()) && nodes[i].textContent.trim().length < 64) run.push(nodes[i++]);
        if (run.length) i--;
        if (run.length < 2) continue;
        const hasDescriptions = run.some(p => descriptions[nameOf(p.textContent.trim())]);
        const list = $(`<ul class="${hasDescriptions ? 'sx-reference-grid' : 'sx-pill-list'}"></ul>`);
        $(run[0]).before(list.get(0));
        for (const p of run) {
            const label = p.textContent.trim();
            list.append(referenceCard(label, descriptions[nameOf(label)]));
            $(p).remove();
        }
    }
    $(body).children('ul').each((_, list) => {
        if (/\bsx-/.test(list.className) || $(list).find('ul,ol,pre').length) return;
        const entries = $(list).children('li').get();
        if (entries.length < 2) return;
        if (entries.every(li => li.firstElementChild?.tagName === 'STRONG')) {
            $(list).addClass('sx-feature-grid');
            for (const li of entries) {
                $(li.firstElementChild).addClass('sx-feature-name');
                $(li).contents().get().filter(node => node.nodeType === 3).forEach(node => $(node).text(node.textContent.replace(/^\s*[-–—:]\s+/, '')));
            }
        } else if (entries.every(li => $(li).find('a').length === 1 && li.textContent.trim().length < 100)) {
            $(list).addClass('sx-link-grid');
            for (const li of entries) {
                const link = $(li).find('a').get(0);
                const key = link.getAttribute('href')?.replace(/^\/showcase\/?/, '').replace(/#.*$/, '');
                if (pages[key]?.description && li.textContent.trim() === link.textContent.trim()) $(li).append($('<p class="sx-reference-description"></p>').text(pages[key].description).get(0));
            }
        } else if (entries.every(li => li.textContent.trim().length < 70)) $(list).addClass('sx-check-list');
    });
}

/** Give every showcase page a common structure, while keeping its headings and examples. */
export function presentPage(host) {
    if (!/^\/showcase(?:\/|$)/.test(location.pathname) || !host || host.classList.contains('sx-showcase')) return;
    $(host).addClass('sx-showcase');
    const pageId = location.pathname.replace(/^\/showcase\/?/, '').replace(/\/$/, '');
    const module = pageId.split('/')[0];
    const descriptions = methods[pageId] || methods[module] || {};
    const original = $(host).children().get();
    let current = null;
    let count = 0;
    for (const node of original) {
        if (node.tagName === 'H2') {
            count++;
            const title = node.textContent.trim();
            if (!node.id) $(node).attr('id', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
            const section = $('<section class="card sx-section"></section>');
            const header = $('<div class="card-header sx-section-header"></div>');
            const icon = $(`<span class="sx-section-icon" data-icon="${iconFor(title)}"></span>`);
            header.append(icon.get(0)).append(node);
            const body = $('<div class="card-body sx-section-body"></div>');
            section.append(header.get(0)).append(body.get(0));
            $(host).append(section.get(0));
            current = body.get(0);
        } else if (current && !['STYLE','LINK','SCRIPT'].includes(node.tagName)) $(current).append(node);
    }
    $(host).find('.sx-section-body').each((_, body) => {
        decorateLists(body, descriptions);
        $(body).children('blockquote').addClass('sx-callout');
        $(body).children('h3').addClass('sx-subheading');
        $(body).children('p').each((_, p) => {
            if (/^(usage|example|output|result|syntax|supported|not supported|basic usage)$/i.test(p.textContent.trim())) $(p).addClass('sx-caption');
        });
        const heading = $(body.parentElement).find('.sx-section-header h2').get(0);
        $(body).children('figure.showcase-demo').each((_, fig) => {
            const caption = $(fig).children('.showcase-demo-title').get(0);
            if (caption && caption.textContent.trim() === heading?.textContent.trim()) {
                $(caption).addClass('sr-only');
                $(fig).attr('aria-labelledby', heading.id);
            }
        });
    });
    const figures = $(host).find('figure.showcase-demo[data-demo]').length;
    const samples = $(host).find('pre').length;
    if (count || figures || samples) {
        const summary = $('<div class="sx-page-summary" aria-label="Page contents"></div>');
        for (const [number, label, icon] of [[count, 'Topics', 'layers'], [figures, 'Live demos', 'play'], [samples, 'Code samples', 'code']]) {
            if (!number) continue;
            const item = $(`<span class="sx-summary-item"><span data-icon="${icon}"></span></span>`);
            item.append($('<strong></strong>').text(number).get(0)).append($('<span></span>').text(label).get(0));
            summary.append(item.get(0));
        }
        const first = $(host).children().get().find(node => !node.matches('.hero,link,style,script'));
        if (first) $(first).before(summary.get(0));
    }
    I.scan(host);
}

export function codeLanguage(code) {
    const explicit = [...code.classList].find(name => name.startsWith('language-'))?.slice(9);
    if (explicit) return ({js:'javascript', ts:'typescript', xml:'html', sh:'bash', shell:'bash'})[explicit] || explicit;
    const text = code.textContent.trim();
    if (/^\s*(?:<!--|<!doctype|<\/?[a-z][\w-]*[\s>])/i.test(text)) return 'html';
    if (/^\s*(?:npm|npx|node|git|make|curl|cd)\s/.test(text)) return 'bash';
    if (/^\[[a-z][\w-]*(?:\s|\])/i.test(text)) return 'markdown';
    if (/^\s*[.#][\w-]+[^{]*\{/.test(text) || /^\s*@(?:media|keyframes|import)/.test(text)) return 'css';
    if (/^[\[{]/.test(text)) { try { JSON.parse(text); return 'json'; } catch { return 'javascript'; } }
    if (/\b(const|let|function|return|class|await|import)\b|(?:\$|_\.|D\(|M\.|F\.|E\.|H\.|S\.)|\b[\w$]+\.[\w$]+\s*\(/.test(text)) return 'javascript';
    return 'text';
}

const LANGUAGE_NAMES = {javascript:'JavaScript', typescript:'TypeScript', html:'HTML', css:'CSS', json:'JSON', bash:'Shell', text:'Code', markdown:'Markdown'};
const copyButtons = new WeakSet();

export function codeText(pre) {
    const code = $(pre).children('code').get(0) || pre;
    return code.textContent ?? '';
}

export function enhanceCode(host, syntax, copy) {
    $(host).find('.code-block:not(pre)').each((_, block) => {
        if ($(block).closest('[contenteditable="true"],.CodeMirror,.monaco-editor').length) return;
        if ($(block).find('pre').length) return;
        const pre = $('<pre></pre>').attr('class', block.className);
        if (block.id) pre.attr('id', block.id);
        const code = $('<code></code>').text(block.textContent);
        const language = [...block.classList].find(name => name.startsWith('language-'));
        if (language) code.addClass(language);
        pre.append(code.get(0));
        $(block).replaceWith(pre.get(0));
    });
    $(host).find('pre').each((_, pre) => {
        if ($(pre).closest('[contenteditable="true"],.CodeMirror,.monaco-editor').length) return;
        $(pre).attr('tabindex', '0');
        let code = $(pre).children('code').get(0);
        if (!code && pre.classList.contains('code-block')) {
            code = $('<code></code>').text(pre.textContent).get(0);
            $(pre).empty().append(code);
        }
        code ||= pre;
        const language = codeLanguage(code);
        if (!pre.parentElement.classList.contains('sx-code')) {
            const frame = $('<div class="sx-code"></div>');
            const toolbar = $('<div class="sx-code-toolbar"></div>');
            toolbar.append($('<span class="sx-code-language"></span>').text(LANGUAGE_NAMES[language] || language).get(0));
            const button = $('<button type="button" class="btn btn-sm btn-outline sx-copy-code" aria-label="Copy code to clipboard"><span data-icon="copy"></span><span>Copy</span></button>');
            toolbar.append(button.get(0));
            $(pre).before(frame.get(0));
            frame.append(toolbar.get(0)).append(pre);
        }
        const button = $(pre.parentElement).find('.sx-copy-code').first().get(0);
        if (button && !copyButtons.has(button)) {
            copyButtons.add(button);
            $(button).on('click', async () => {
                if (await copy(codeText(pre), 'Code')) {
                    $(button).find('span').last().text('Copied');
                    setTimeout(() => $(button).find('span').last().text('Copy'), 1800);
                }
            });
        }
        // Bindings and demos can replace a result's text after the first scan.
        if (code.hasAttribute('data-syntax-highlighted') && code.textContent !== code.getAttribute('data-original-code')) {
            $(code).removeAttr('data-syntax-highlighted').removeAttr('data-original-code');
        }
        $(code).addClass('sx-code-source');
        if (syntax.isLanguageSupported(language)) syntax.highlight(code, language);
    });
    I.scan(host);
}
