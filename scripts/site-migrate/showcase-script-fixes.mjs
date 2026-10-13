import * as acorn from 'acorn';

/** The showcase uses the framework's callable toast API, with a type option. */
export function normaliseToastCalls(source) {
    const changes = [];
    const ast = acorn.parse(source, {ecmaVersion: 'latest', sourceType: 'module', allowReturnOutsideFunction: true});
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        const target = node.type === 'CallExpression' ? node.callee : null;
        if (target?.type === 'MemberExpression' && ['success','error','warning','info'].includes(target.property?.name)
            && target.object?.type === 'MemberExpression' && target.object.object?.name === 'E' && target.object.property?.name === 'toast') {
            const [message, options] = node.arguments;
            if (message) changes.push({start: node.start, end: node.end,
                text: `E.toast(${source.slice(message.start, message.end)}, {${options ? `...(${source.slice(options.start, options.end)}), ` : ''}type: '${target.property.name}'})`});
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
        }
    }
    visit(ast);
    for (const change of changes.sort((a,b) => b.start - a.start)) source = source.slice(0, change.start) + change.text + source.slice(change.end);
    return source;
}
