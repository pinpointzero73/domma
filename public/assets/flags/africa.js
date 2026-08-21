/**
 * Domma Flags - Africa
 * Canvas 60×40 (3:2). Complex emblems simplified for icon-scale clarity.
 */

export const africa = {
    za: {
        name: 'South Africa',
        svg:
            '<rect width="60" height="40" fill="#fff"/>' +
            '<path d="M0,0 H22 L40,20 L22,40 H0 Z" fill="#002395"/>' +
            '<path d="M0,0 L26,20 L0,40 Z" fill="#000"/>' +
            '<rect x="0" y="0" width="60" height="13.3" fill="#DE3831"/>' +
            '<rect x="0" y="26.7" width="60" height="13.3" fill="#002395"/>' +
            '<path d="M0,0 L26,20 L0,40" fill="none" stroke="#FFB915" stroke-width="3"/>' +
            '<path d="M0,3 L21,20 L0,37" fill="none" stroke="#007749" stroke-width="6"/>' +
            '<path d="M-1,13.3 H60 M-1,26.7 H60" stroke="#fff" stroke-width="0"/>' +
            '<rect x="26" y="14.8" width="34" height="10.4" fill="#007749"/>' +
            '<path d="M0,6 L18,20 L0,34" fill="none" stroke="#fff" stroke-width="1.5"/>'
    },
    ng: {name: 'Nigeria', stripes: {dir: 'v', colors: ['#008751', '#FFFFFF', '#008751']}},
    gh: {
        name: 'Ghana',
        stripes: {dir: 'h', colors: ['#CE1126', '#FCD116', '#006B3F']},
        overlays: [{type: 'star', cx: 30, cy: 20, r: 5, fill: '#000'}]
    },
    eg: {
        name: 'Egypt',
        stripes: {dir: 'h', colors: ['#CE1126', '#FFFFFF', '#000000']},
        overlays: [{type: 'path', d: 'M30,17 l1.2,2.6 2.8-0.4-2,2 0.7,2.8-2.7-1.4-2.7,1.4 0.7-2.8-2-2 2.8,0.4z', fill: '#C09300'}]
    },
    ma: {
        name: 'Morocco',
        bg: '#C1272D',
        overlays: [{type: 'star', cx: 30, cy: 20, r: 8, fill: 'none', stroke: '#006233', strokeWidth: 1.6}]
    },
    sn: {
        name: 'Senegal',
        stripes: {dir: 'v', colors: ['#00853F', '#FDEF42', '#E31B23']},
        overlays: [{type: 'star', cx: 30, cy: 20, r: 4.5, fill: '#00853F'}]
    },
    ci: {name: 'Ivory Coast', stripes: {dir: 'v', colors: ['#F77F00', '#FFFFFF', '#009E60']}},
    cm: {
        name: 'Cameroon',
        stripes: {dir: 'v', colors: ['#007A5E', '#CE1126', '#FCD116']},
        overlays: [{type: 'star', cx: 30, cy: 20, r: 4, fill: '#FCD116'}]
    },
    dz: {
        name: 'Algeria',
        overlays: [
            {type: 'rect', x: 0, y: 0, w: 30, h: 40, fill: '#006233'},
            {type: 'rect', x: 30, y: 0, w: 30, h: 40, fill: '#fff'},
            {type: 'crescent', cx: 28, cy: 20, r: 7, off: 3, fill: '#D21034'},
            {type: 'star', cx: 36, cy: 20, r: 4, fill: '#D21034'}
        ]
    },
    tn: {
        name: 'Tunisia',
        bg: '#E70013',
        overlays: [
            {type: 'circle', cx: 30, cy: 20, r: 9, fill: '#fff'},
            {type: 'crescent', cx: 31, cy: 20, r: 5.5, off: 2.6, fill: '#E70013'},
            {type: 'star', cx: 33, cy: 20, r: 3, fill: '#E70013'}
        ]
    },
    ke: {
        name: 'Kenya',
        stripes: {
            dir: 'h',
            colors: ['#000000', '#fff', '#BB0000', '#fff', '#006600'],
            weights: [12, 1, 12, 1, 12]
        },
        overlays: [
            {type: 'line', x1: 24, y1: 8, x2: 36, y2: 32, stroke: '#000', strokeWidth: 1},
            {type: 'line', x1: 36, y1: 8, x2: 24, y2: 32, stroke: '#000', strokeWidth: 1},
            {type: 'ellipse', cx: 30, cy: 20, rx: 4, ry: 8, fill: '#fff'},
            {type: 'ellipse', cx: 30, cy: 20, rx: 2.6, ry: 6.4, fill: '#BB0000'}
        ]
    }
};
