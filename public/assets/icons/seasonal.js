/**
 * Domma Seasonal Icons
 * Festive and holiday icons: Christmas, winter themes
 */

/** @type {Record<string, import('../../../src/icons.js').IconDefinition>} */
export const seasonal = {
    // Christmas tree with star
    'tree': {
        viewBox: '0 0 24 24',
        path: 'M12 2l2 4h-1l2 4h-1.5l2.5 5h-2l3 6H7l3-6H8l2.5-5H9l2-4h-1l2-4zm-1 19h2v3h-2v-3z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Five-pointed star
    'star-decoration': {
        viewBox: '0 0 24 24',
        path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Six-pointed snowflake
    'snowflake': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 2v20M2 12h20',
            'M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07',
            'M12 6l-2 2 2 2 2-2-2-2zM12 14l-2 2 2 2 2-2-2-2z',
            'M6 12l2-2-2-2-2 2 2 2zM14 12l2 2 2-2-2-2-2 2z'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Wrapped gift with bow
    'gift': {
        viewBox: '0 0 24 24',
        paths: [
            'M20 12v10H4V12',
            'M22 7H2v5h20V7z',
            'M12 22V7',
            'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
            'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Candy cane
    'candy-cane': {
        viewBox: '0 0 24 24',
        path: 'M14.5 3a4.5 4.5 0 0 0-4.5 4.5v13a.5.5 0 0 0 1 0V7.5a3.5 3.5 0 1 1 7 0v1a2.5 2.5 0 0 1-5 0v-.5',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas bauble/ornament
    'bauble': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
            'M12 6V3',
            'M9 3h6',
            'M12 6a1 1 0 0 0 1-1V4a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1z'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Jingle bells
    'bells': {
        viewBox: '0 0 24 24',
        paths: [
            'M9 18a5 5 0 0 1-5-5c0-2.76 2.24-5 5-5s5 2.24 5 5a5 5 0 0 1-5 5z',
            'M15 18a5 5 0 0 1-5-5c0-2.76 2.24-5 5-5s5 2.24 5 5a5 5 0 0 1-5 5z',
            'M7 8L5 4M17 8l2-4M9 8V5M15 8V5',
            'M11 5h2'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Holly with berries
    'holly': {
        viewBox: '0 0 24 24',
        paths: [
            'M8 4c-2 2-3 5-1 8 1 2 3 3 5 3s4-1 5-3c2-3 1-6-1-8',
            'M16 4c2 2 3 5 1 8-1 2-3 3-5 3s-4-1-5-3c-2-3-1-6 1-8',
            'M10 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
            'M14 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
            'M12 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Snowman
    'snowman': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
            'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
            'M9 9h.01M15 9h.01',
            'M10 10.5s.5 1 2 1 2-1 2-1',
            'M7 2l3 3M17 2l-3 3M12 2v3',
            'M5 15h2M17 15h2'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Reindeer head
    'reindeer': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 22c-3 0-5-2-5-5 0-2 1-4 3-5l2-1 2 1c2 1 3 3 3 5 0 3-2 5-5 5z',
            'M7 12c-2-1-3-3-3-5 0-1 .5-2 1-2s1 .5 1.5 1c.5.5 1 1.5 1.5 2',
            'M17 12c2-1 3-3 3-5 0-1-.5-2-1-2s-1 .5-1.5 1c-.5.5-1 1.5-1.5 2',
            'M4 5l1 2M3 7l2 1M20 5l-1 2M21 7l-2 1',
            'M10 17h.01M14 17h.01',
            'M12 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Santa's sleigh
    'sleigh': {
        viewBox: '0 0 24 24',
        paths: [
            'M4 15h14c1 0 2 1 2 2v1H4v-3z',
            'M6 15V8c0-1 1-2 2-2h8c1 0 2 1 2 2v7',
            'M2 20c0-1 2-2 4-2h12c2 0 4 1 4 2',
            'M3 18h1M20 18h1'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas wreath
    'wreath': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
            'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
            'M12 2v2M12 20v2M2 12h2M20 12h2',
            'M10 3l1 2M13 3l-1 2',
            'M10 3h4'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Party popper / ticker-tape parade
    'party-popper': {
        viewBox: '0 0 24 24',
        paths: [
            'M5.8 11.3 2 22l10.7-3.79',
            'M4 3h.01',
            'M22 8h.01',
            'M15 2h.01',
            'M22 20h.01',
            'M22 2 19.79 7.3 16 8l3.79.79L22 14',
            'M9.6 14.4 14 10',
            'M22 13c-1.93 1.93-5.07 1.93-7 0',
            'M11 8c1.93-1.93 1.93-5.07 0-7',
            'M2 13c1.93 1.93 5.07 1.93 7 0'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas quiz - a bauble with a question mark
    'christmas-quiz': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
            'M10 8V6h4v2',
            'M12 6V4.5',
            'M10.75 3.5a1.25 1.25 0 1 1 2.5 0',
            'M10 13a2 2 0 1 1 3 1.73c-.6.35-1 .77-1 1.27v.5',
            'M12 18.5h.01'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas crossword - a grid with a sprig of holly
    'christmas-crossword': {
        viewBox: '0 0 24 24',
        paths: [
            'M2 9h13v13H2z',
            'M6.33 9v13M10.67 9v13M2 13.33h13M2 17.67h13',
            'M3.5 10.5h1.33v1.33H3.5zM12.17 19.17h1.33v1.33h-1.33z',
            'M17 8c-2.4.4-4.4-.6-5.4-2.8 2.4-.5 4.4.5 5.4 2.8z',
            'M17 8c.4-2.4 2-3.9 4.5-4.2-.2 2.5-1.8 4-4.5 4.2z',
            'M18.5 10.5h.01M20.5 9h.01M17 11.5h.01'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas cracker
    'cracker': {
        viewBox: '0 0 24 24',
        paths: [
            'M8 9h8v6H8z',
            'M8 9L3.5 6.5v11L8 15',
            'M16 9l4.5-2.5v11L16 15',
            'M10.5 9l1.5 1.5L13.5 9M10.5 15l1.5-1.5 1.5 1.5'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas stocking
    'stocking': {
        viewBox: '0 0 24 24',
        paths: [
            'M8 2.5h8v4H8z',
            'M9 6.5v7l-3.6 3.2a2.6 2.6 0 0 0 3.4 3.9l5.6-4.4c.9-.7 1.6-1.8 1.6-3V6.5',
            'M9 16l2 2'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Santa's hat with its bobble
    'santa-hat': {
        viewBox: '0 0 24 24',
        paths: [
            'M3.5 18h14a1.5 1.5 0 0 1 0 3h-14a1.5 1.5 0 0 1 0-3z',
            'M5 18c.5-6 3.5-10.5 8.5-11.5 3-.6 5 .8 6 3.8',
            'M16.5 18c0-2.5-.4-4.6-1-6.3',
            'M19.5 14.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Christmas pudding with custard and holly
    'christmas-pudding': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 22a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z',
            'M5 12c1.2.9 2 .1 2.8 1.2.8 1.1 1.6-.4 2.6-.4s1.6 1.6 2.6.7c.9-.8 1.6-.8 2.6-.2 1 .6 1.6-.2 2.4-.8',
            'M12 5.5c-1.2-1.4-3-1.6-4.5-.7 1.2 1.4 3 1.6 4.5.7z',
            'M12 5.5c1.2-1.4 3-1.6 4.5-.7-1.2 1.4-3 1.6-4.5.7z',
            'M12 7h.01',
            'M9.5 17h.01M14.5 17.5h.01M12 19.5h.01'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Gingerbread man
    'gingerbread-man': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
            'M10 8.5H6.5a1.75 1.75 0 0 0 0 3.5H9v2.5l-2.2 4.6a1.75 1.75 0 0 0 3.2 1.4L12 17l2 3.5a1.75 1.75 0 0 0 3.2-1.4L15 14.5V12h2.5a1.75 1.75 0 0 0 0-3.5H14',
            'M11 4.5h.01M13 4.5h.01',
            'M12 11h.01M12 13.5h.01'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Advent calendar with one door open
    'advent-calendar': {
        viewBox: '0 0 24 24',
        paths: [
            'M4 5h16v16H4z',
            'M8 3v4M16 3v4',
            'M4 9h16',
            'M6.5 11.5H10v3.5H6.5zM6.5 17H10v2H6.5zM14 17h3.5v2H14z',
            'M14 11.5h3.5V15H14z',
            'M14 11.5l-1.8 1.2v3.5L14 15'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Candle
    'candle': {
        viewBox: '0 0 24 24',
        paths: [
            'M9 10h6v10H9z',
            'M12 3c1.4 1.8 2 2.9 2 3.8a2 2 0 0 1-4 0c0-.9.6-2 2-3.8z',
            'M12 8.8V10',
            'M6 21h12',
            'M9 13.5c1 .6 2 .6 3 0'
        ],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }
};
