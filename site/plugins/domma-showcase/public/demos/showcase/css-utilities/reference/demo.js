/**
 * Reference - from public/showcase/css-utilities.
 */
export function mount(root) {
        /* ── Reference table ─────────────────────────────── */
    const rows = [
            { cls: 'opacity-0',   type: 'Opacity',     value: '0',    note: 'Fully invisible' },
            { cls: 'opacity-10',  type: 'Opacity',     value: '0.1',  note: '' },
            { cls: 'opacity-20',  type: 'Opacity',     value: '0.2',  note: '' },
            { cls: 'opacity-25',  type: 'Opacity',     value: '0.25', note: 'Quarter opacity' },
            { cls: 'opacity-30',  type: 'Opacity',     value: '0.3',  note: '' },
            { cls: 'opacity-40',  type: 'Opacity',     value: '0.4',  note: '' },
            { cls: 'opacity-50',  type: 'Opacity',     value: '0.5',  note: 'Half opacity' },
            { cls: 'opacity-60',  type: 'Opacity',     value: '0.6',  note: '' },
            { cls: 'opacity-70',  type: 'Opacity',     value: '0.7',  note: '' },
            { cls: 'opacity-75',  type: 'Opacity',     value: '0.75', note: 'Three-quarter opacity' },
            { cls: 'opacity-80',  type: 'Opacity',     value: '0.8',  note: '' },
            { cls: 'opacity-90',  type: 'Opacity',     value: '0.9',  note: '' },
            { cls: 'opacity-100', type: 'Opacity',     value: '1',    note: 'Fully visible' },
            { cls: 'translucent-light',       type: 'Translucent', value: 'var(--dm-translucent-light) = 0.85',  note: 'Subtle - watermarks, overlays' },
            { cls: 'translucent',             type: 'Translucent', value: 'var(--dm-translucent) = 0.7',        note: 'Standard translucency' },
            { cls: 'translucent-heavy',       type: 'Translucent', value: 'var(--dm-translucent-heavy) = 0.5',  note: 'Strong - ghost elements' },
            { cls: 'translucent-glass',       type: 'Glass',       value: 'rgba(255,255,255,0.75) + blur(8px)', note: 'Frosted glass effect' },
            { cls: 'translucent-light-hover', type: 'Hover',       value: '0.85 on :hover',  note: 'Smooth transition included' },
            { cls: 'translucent-hover',       type: 'Hover',       value: '0.7 on :hover',   note: 'Smooth transition included' },
            { cls: 'translucent-heavy-hover', type: 'Hover',       value: '0.5 on :hover',   note: 'Smooth transition included' },
        ];
    T.create('#reference-table', {
            data: rows,
            columns: [
                { key: 'cls',   label: 'Class',       render: v => `<code>${v}</code>` },
                { key: 'type',  label: 'Type' },
                { key: 'value', label: 'Value' },
                { key: 'note',  label: 'Notes' },
            ],
            pagination: false,
        });
}
