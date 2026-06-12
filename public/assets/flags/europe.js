/**
 * Domma Flags — Europe
 *
 * Compact flag descriptors expanded to SVG at render time. Canvas is 60×40 (3:2).
 * Complex emblems (coats of arms, etc.) are simplified for icon-scale clarity;
 * override any flag with FL.register(code, def) for a precise rendering.
 */

export const europe = {
    gb: {
        name: 'United Kingdom',
        svg:
            '<rect width="60" height="40" fill="#012169"/>' +
            '<path d="M0,0 60,40 M60,0 0,40" stroke="#fff" stroke-width="8"/>' +
            '<path d="M0,0 60,40 M60,0 0,40" stroke="#C8102E" stroke-width="4"/>' +
            '<path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="13"/>' +
            '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="8"/>'
    },
    fr: {name: 'France', stripes: {dir: 'v', colors: ['#0055A4', '#FFFFFF', '#EF4135']}},
    de: {name: 'Germany', stripes: {dir: 'h', colors: ['#000000', '#DD0000', '#FFCE00']}},
    it: {name: 'Italy', stripes: {dir: 'v', colors: ['#009246', '#FFFFFF', '#CE2B37']}},
    es: {
        name: 'Spain',
        stripes: {dir: 'h', colors: ['#AA151B', '#F1BF00', '#AA151B'], weights: [1, 2, 1]}
    },
    pt: {
        name: 'Portugal',
        stripes: {dir: 'v', colors: ['#006600', '#FF0000'], weights: [2, 3]},
        overlays: [
            {type: 'circle', cx: 24, cy: 20, r: 5, fill: '#FFE936', stroke: '#006600', strokeWidth: 1},
            {type: 'circle', cx: 24, cy: 20, r: 2.4, fill: '#FF0000'}
        ]
    },
    nl: {name: 'Netherlands', stripes: {dir: 'h', colors: ['#AE1C28', '#FFFFFF', '#21468B']}},
    be: {name: 'Belgium', stripes: {dir: 'v', colors: ['#000000', '#FAE042', '#ED2939']}},
    ie: {name: 'Ireland', stripes: {dir: 'v', colors: ['#169B62', '#FFFFFF', '#FF883E']}},
    ch: {
        name: 'Switzerland',
        bg: '#FF0000',
        overlays: [
            {type: 'rect', x: 27, y: 11, w: 6, h: 18, fill: '#fff'},
            {type: 'rect', x: 21, y: 17, w: 18, h: 6, fill: '#fff'}
        ]
    },
    at: {name: 'Austria', stripes: {dir: 'h', colors: ['#ED2939', '#FFFFFF', '#ED2939']}},
    se: {name: 'Sweden', cross: {bg: '#006AA7', colour: '#FECC00'}},
    no: {name: 'Norway', cross: {bg: '#BA0C2F', border: '#FFFFFF', colour: '#00205B'}},
    dk: {name: 'Denmark', cross: {bg: '#C60C30', colour: '#FFFFFF'}},
    fi: {name: 'Finland', cross: {bg: '#FFFFFF', colour: '#003580'}},
    is: {name: 'Iceland', cross: {bg: '#02529C', border: '#FFFFFF', colour: '#DC1E35'}},
    pl: {name: 'Poland', stripes: {dir: 'h', colors: ['#FFFFFF', '#DC143C']}},
    ua: {name: 'Ukraine', stripes: {dir: 'h', colors: ['#0057B7', '#FFD700']}},
    gr: {
        name: 'Greece',
        stripes: {
            dir: 'h',
            colors: ['#0D5EAF', '#fff', '#0D5EAF', '#fff', '#0D5EAF', '#fff', '#0D5EAF', '#fff', '#0D5EAF']
        },
        overlays: [
            {type: 'rect', x: 0, y: 0, w: 22.22, h: 22.22, fill: '#0D5EAF'},
            {type: 'rect', x: 8.9, y: 0, w: 4.44, h: 22.22, fill: '#fff'},
            {type: 'rect', x: 0, y: 8.9, w: 22.22, h: 4.44, fill: '#fff'}
        ]
    },
    hr: {name: 'Croatia', stripes: {dir: 'h', colors: ['#FF0000', '#FFFFFF', '#171796']}},
    ru: {name: 'Russia', stripes: {dir: 'h', colors: ['#FFFFFF', '#0039A6', '#D52B1E']}},
    cz: {
        name: 'Czechia',
        stripes: {dir: 'h', colors: ['#FFFFFF', '#D7141A']},
        overlays: [{type: 'path', d: 'M0,0 L30,20 L0,40 Z', fill: '#11457E'}]
    }
};
