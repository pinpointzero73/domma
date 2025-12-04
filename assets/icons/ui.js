/**
 * Domma UI Icons
 * Core user interface icons: arrows, menu, close, search, settings, etc.
 */

export const ui = {
    // Arrows
    'arrow-up': {
        viewBox: '0 0 24 24',
        path: 'M12 19V5M5 12l7-7 7 7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-down': {
        viewBox: '0 0 24 24',
        path: 'M12 5v14M19 12l-7 7-7-7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-left': {
        viewBox: '0 0 24 24',
        path: 'M19 12H5M12 19l-7-7 7-7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-right': {
        viewBox: '0 0 24 24',
        path: 'M5 12h14M12 5l7 7-7 7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-up-left': {
        viewBox: '0 0 24 24',
        path: 'M17 17L7 7M7 17V7h10',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-up-right': {
        viewBox: '0 0 24 24',
        path: 'M7 17L17 7M7 7h10v10',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-down-left': {
        viewBox: '0 0 24 24',
        path: 'M17 7L7 17M17 17H7V7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'arrow-down-right': {
        viewBox: '0 0 24 24',
        path: 'M7 7l10 10M17 7v10H7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Menu & Navigation
    'menu': {
        viewBox: '0 0 24 24',
        paths: ['M3 6h18', 'M3 12h18', 'M3 18h18'],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round'
    },
    'menu-alt': {
        viewBox: '0 0 24 24',
        paths: ['M3 6h18', 'M3 12h12', 'M3 18h18'],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round'
    },
    'dots-horizontal': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            'M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            'M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'
        ],
        fill: 'currentColor'
    },
    'dots-vertical': {
        viewBox: '0 0 24 24',
        paths: [
            'M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            'M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            'M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'
        ],
        fill: 'currentColor'
    },
    'grid': {
        viewBox: '0 0 24 24',
        path: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'list': {
        viewBox: '0 0 24 24',
        paths: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Actions
    'close': {
        viewBox: '0 0 24 24',
        path: 'M18 6L6 18M6 6l12 12',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'plus': {
        viewBox: '0 0 24 24',
        path: 'M12 5v14M5 12h14',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'minus': {
        viewBox: '0 0 24 24',
        path: 'M5 12h14',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'search': {
        viewBox: '0 0 24 24',
        path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'refresh': {
        viewBox: '0 0 24 24',
        path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'edit': {
        viewBox: '0 0 24 24',
        path: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'trash': {
        viewBox: '0 0 24 24',
        path: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'filter': {
        viewBox: '0 0 24 24',
        path: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'sort': {
        viewBox: '0 0 24 24',
        paths: ['M3 6h7', 'M3 12h5', 'M3 18h3', 'M16 6l4 4-4 4', 'M20 10H10'],
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // Common UI
    'home': {
        viewBox: '0 0 24 24',
        path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'user': {
        viewBox: '0 0 24 24',
        path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'users': {
        viewBox: '0 0 24 24',
        path: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'settings': {
        viewBox: '0 0 24 24',
        path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'cog': {
        viewBox: '0 0 24 24',
        path: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'eye': {
        viewBox: '0 0 24 24',
        path: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'eye-off': {
        viewBox: '0 0 24 24',
        path: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'lock': {
        viewBox: '0 0 24 24',
        path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'unlock': {
        viewBox: '0 0 24 24',
        path: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'clock': {
        viewBox: '0 0 24 24',
        path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'calendar': {
        viewBox: '0 0 24 24',
        path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'star': {
        viewBox: '0 0 24 24',
        path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'star-filled': {
        viewBox: '0 0 24 24',
        path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
        fill: 'currentColor'
    },
    'sun': {
        viewBox: '0 0 24 24',
        path: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'moon': {
        viewBox: '0 0 24 24',
        path: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'globe': {
        viewBox: '0 0 24 24',
        path: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'map': {
        viewBox: '0 0 24 24',
        path: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'pin': {
        viewBox: '0 0 24 24',
        path: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }
};

export default ui;
