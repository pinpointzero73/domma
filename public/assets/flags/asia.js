/**
 * Domma Flags — Asia & Middle East
 * Canvas 60×40 (3:2). Complex emblems simplified for icon-scale clarity.
 */

export const asia = {
    jp: {
        name: 'Japan',
        bg: '#FFFFFF',
        overlays: [{type: 'circle', cx: 30, cy: 20, r: 10, fill: '#BC002D'}]
    },
    cn: {
        name: 'China',
        bg: '#DE2910',
        overlays: [
            {type: 'star', cx: 12, cy: 11, r: 6, fill: '#FFDE00'},
            {type: 'star', cx: 22, cy: 5, r: 2, fill: '#FFDE00'},
            {type: 'star', cx: 26, cy: 9, r: 2, fill: '#FFDE00'},
            {type: 'star', cx: 26, cy: 15, r: 2, fill: '#FFDE00'},
            {type: 'star', cx: 22, cy: 19, r: 2, fill: '#FFDE00'}
        ]
    },
    kr: {
        name: 'South Korea',
        bg: '#FFFFFF',
        overlays: [
            {type: 'path', d: 'M30,13 a7,7 0 0 1 0,14 a3.5,3.5 0 0 1 0,-7 a3.5,3.5 0 0 0 0,-7 Z', fill: '#CD2E3A'},
            {type: 'path', d: 'M30,13 a7,7 0 0 0 0,14 a3.5,3.5 0 0 0 0,-7 a3.5,3.5 0 0 1 0,-7 Z', fill: '#0047A0'},
            {type: 'circle', cx: 30, cy: 16.5, r: 3.5, fill: '#CD2E3A'},
            {type: 'circle', cx: 30, cy: 23.5, r: 3.5, fill: '#0047A0'},
            {type: 'group', children: [
                {type: 'rect', x: 9, y: 8, w: 7, h: 1.3, fill: '#000'},
                {type: 'rect', x: 9, y: 10.4, w: 7, h: 1.3, fill: '#000'},
                {type: 'rect', x: 9, y: 12.8, w: 7, h: 1.3, fill: '#000'}
            ]},
            {type: 'group', children: [
                {type: 'rect', x: 44, y: 8, w: 7, h: 1.3, fill: '#000'},
                {type: 'rect', x: 44, y: 10.4, w: 7, h: 1.3, fill: '#000'},
                {type: 'rect', x: 44, y: 12.8, w: 7, h: 1.3, fill: '#000'}
            ]}
        ]
    },
    in: {
        name: 'India',
        stripes: {dir: 'h', colors: ['#FF9933', '#FFFFFF', '#138808']},
        overlays: [
            {type: 'circle', cx: 30, cy: 20, r: 5, fill: 'none', stroke: '#000080', strokeWidth: 0.8},
            {type: 'circle', cx: 30, cy: 20, r: 1, fill: '#000080'},
            {type: 'path', d: 'M30,15 V25 M25,20 H35 M26.5,16.5 L33.5,23.5 M33.5,16.5 L26.5,23.5', stroke: '#000080', strokeWidth: 0.5}
        ]
    },
    sa: {
        name: 'Saudi Arabia',
        bg: '#006C35',
        overlays: [
            {type: 'rect', x: 10, y: 26, w: 40, h: 1.6, fill: '#fff'},
            {type: 'path', d: 'M10,26.8 l4,-2 v4 z', fill: '#fff'},
            {type: 'rect', x: 14, y: 14, w: 32, h: 5, fill: 'none'}
        ]
    },
    ae: {
        name: 'United Arab Emirates',
        overlays: [
            {type: 'rect', x: 0, y: 0, w: 60, h: 13.33, fill: '#00732F'},
            {type: 'rect', x: 0, y: 13.33, w: 60, h: 13.33, fill: '#fff'},
            {type: 'rect', x: 0, y: 26.66, w: 60, h: 13.34, fill: '#000'},
            {type: 'rect', x: 0, y: 0, w: 15, h: 40, fill: '#FF0000'}
        ]
    },
    qa: {
        name: 'Qatar',
        bg: '#FFFFFF',
        overlays: [
            {type: 'path', d: 'M22,0 H60 V40 H22 L27,36 L22,32 L27,28 L22,24 L27,20 L22,16 L27,12 L22,8 L27,4 Z', fill: '#8A1538'}
        ]
    },
    id: {name: 'Indonesia', stripes: {dir: 'h', colors: ['#FF0000', '#FFFFFF']}},
    th: {
        name: 'Thailand',
        stripes: {
            dir: 'h',
            colors: ['#A51931', '#F4F5F8', '#2D2A4A', '#F4F5F8', '#A51931'],
            weights: [1, 1, 2, 1, 1]
        }
    },
    vn: {
        name: 'Vietnam',
        bg: '#DA251D',
        overlays: [{type: 'star', cx: 30, cy: 20, r: 9, fill: '#FFFF00'}]
    },
    tr: {
        name: 'Turkey',
        bg: '#E30A17',
        overlays: [
            {type: 'crescent', cx: 24, cy: 20, r: 8, off: 3.2, fill: '#fff'},
            {type: 'star', cx: 35, cy: 20, r: 4, rotation: -54, fill: '#fff'}
        ]
    },
    il: {
        name: 'Israel',
        bg: '#FFFFFF',
        overlays: [
            {type: 'rect', x: 0, y: 4, w: 60, h: 4, fill: '#0038B8'},
            {type: 'rect', x: 0, y: 32, w: 60, h: 4, fill: '#0038B8'},
            {type: 'path', d: 'M30,13 L33.5,19 H26.5 Z', fill: 'none', stroke: '#0038B8', strokeWidth: 1},
            {type: 'path', d: 'M30,27 L33.5,21 H26.5 Z', fill: 'none', stroke: '#0038B8', strokeWidth: 1}
        ]
    }
};
