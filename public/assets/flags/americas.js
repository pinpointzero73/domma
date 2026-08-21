/**
 * Domma Flags - Americas
 * Canvas 60×40 (3:2). Complex emblems simplified for icon-scale clarity.
 */

export const americas = {
    us: {
        name: 'United States',
        svg:
            '<rect width="60" height="40" fill="#fff"/>' +
            '<g fill="#B22234">' +
            '<rect y="0" width="60" height="3.08"/><rect y="6.15" width="60" height="3.08"/>' +
            '<rect y="12.31" width="60" height="3.08"/><rect y="18.46" width="60" height="3.08"/>' +
            '<rect y="24.62" width="60" height="3.08"/><rect y="30.77" width="60" height="3.08"/>' +
            '<rect y="36.92" width="60" height="3.08"/></g>' +
            '<rect width="24" height="21.54" fill="#3C3B6E"/>' +
            '<g fill="#fff">' +
            '<circle cx="3" cy="3" r="0.9"/><circle cx="7" cy="3" r="0.9"/><circle cx="11" cy="3" r="0.9"/>' +
            '<circle cx="15" cy="3" r="0.9"/><circle cx="19" cy="3" r="0.9"/>' +
            '<circle cx="5" cy="6" r="0.9"/><circle cx="9" cy="6" r="0.9"/><circle cx="13" cy="6" r="0.9"/>' +
            '<circle cx="17" cy="6" r="0.9"/><circle cx="21" cy="6" r="0.9"/>' +
            '<circle cx="3" cy="9" r="0.9"/><circle cx="7" cy="9" r="0.9"/><circle cx="11" cy="9" r="0.9"/>' +
            '<circle cx="15" cy="9" r="0.9"/><circle cx="19" cy="9" r="0.9"/>' +
            '<circle cx="5" cy="12" r="0.9"/><circle cx="9" cy="12" r="0.9"/><circle cx="13" cy="12" r="0.9"/>' +
            '<circle cx="17" cy="12" r="0.9"/><circle cx="21" cy="12" r="0.9"/>' +
            '<circle cx="3" cy="15" r="0.9"/><circle cx="7" cy="15" r="0.9"/><circle cx="11" cy="15" r="0.9"/>' +
            '<circle cx="15" cy="15" r="0.9"/><circle cx="19" cy="15" r="0.9"/>' +
            '<circle cx="5" cy="18" r="0.9"/><circle cx="9" cy="18" r="0.9"/><circle cx="13" cy="18" r="0.9"/>' +
            '<circle cx="17" cy="18" r="0.9"/><circle cx="21" cy="18" r="0.9"/></g>'
    },
    ca: {
        name: 'Canada',
        stripes: {dir: 'v', colors: ['#FF0000', '#FFFFFF', '#FF0000'], weights: [1, 2, 1]},
        overlays: [
            {
                type: 'path',
                fill: '#FF0000',
                d: 'M30 8 l1.6 3.4 3.6-0.8-1.2 2.6 2.4 1-2 1.8 3.4 1-3.4 1 0.5 1.2-3.1-0.4 0.4 4-1.6-2.4-1.6 2.4 0.4-4-3.1 0.4 0.5-1.2-3.4-1 3.4-1-2-1.8 2.4-1-1.2-2.6 3.6 0.8z'
            }
        ]
    },
    br: {
        name: 'Brazil',
        bg: '#009C3B',
        overlays: [
            {type: 'path', d: 'M30,5 L53,20 L30,35 L7,20 Z', fill: '#FFDF00'},
            {type: 'circle', cx: 30, cy: 20, r: 9, fill: '#002776'},
            {type: 'path', d: 'M21.5,17.5 A12,12 0 0 1 38.5,21', fill: 'none', stroke: '#fff', strokeWidth: 1.6},
            {type: 'star', cx: 27, cy: 18, r: 1.1, fill: '#fff'},
            {type: 'star', cx: 33, cy: 17, r: 1.1, fill: '#fff'},
            {type: 'star', cx: 30, cy: 23, r: 1.1, fill: '#fff'},
            {type: 'star', cx: 35, cy: 22, r: 1.1, fill: '#fff'},
            {type: 'star', cx: 25, cy: 22, r: 1.1, fill: '#fff'}
        ]
    },
    ar: {
        name: 'Argentina',
        stripes: {dir: 'h', colors: ['#74ACDF', '#FFFFFF', '#74ACDF']},
        overlays: [{type: 'circle', cx: 30, cy: 20, r: 3.4, fill: '#F6B40E', stroke: '#85340A', strokeWidth: 0.4}]
    },
    mx: {
        name: 'Mexico',
        stripes: {dir: 'v', colors: ['#006847', '#FFFFFF', '#CE1126']},
        overlays: [{type: 'circle', cx: 30, cy: 20, r: 3.2, fill: '#8C9A5B'}]
    },
    cl: {
        name: 'Chile',
        overlays: [
            {type: 'rect', x: 0, y: 0, w: 60, h: 20, fill: '#fff'},
            {type: 'rect', x: 0, y: 20, w: 60, h: 20, fill: '#D52B1E'},
            {type: 'rect', x: 0, y: 0, w: 20, h: 20, fill: '#0039A6'},
            {type: 'star', cx: 10, cy: 10, r: 6, fill: '#fff'}
        ]
    },
    co: {
        name: 'Colombia',
        stripes: {dir: 'h', colors: ['#FCD116', '#003893', '#CE1126'], weights: [2, 1, 1]}
    },
    pe: {name: 'Peru', stripes: {dir: 'v', colors: ['#D91023', '#FFFFFF', '#D91023']}},
    uy: {
        name: 'Uruguay',
        stripes: {
            dir: 'h',
            colors: ['#fff', '#0038A8', '#fff', '#0038A8', '#fff', '#0038A8', '#fff', '#0038A8', '#fff']
        },
        overlays: [
            {type: 'rect', x: 0, y: 0, w: 20, h: 17.78, fill: '#fff'},
            {type: 'circle', cx: 10, cy: 8.9, r: 4.5, fill: '#FCD116', stroke: '#7B3F00', strokeWidth: 0.5}
        ]
    }
};
