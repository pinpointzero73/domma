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
    'columns': {
        viewBox: '0 0 24 24',
        path: 'M12 3v18M3 3h18v18H3V3z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'layout': {
        viewBox: '0 0 24 24',
        path: 'M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zM9 21V9m12-6H3',
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
    'plus-circle': {
        viewBox: '0 0 24 24',
        path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v8M8 12h8',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'minus-circle': {
        viewBox: '0 0 24 24',
        path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 12h8',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'plus-square': {
        viewBox: '0 0 24 24',
        path: 'M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM12 8v8M8 12h8',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'minus-square': {
        viewBox: '0 0 24 24',
        path: 'M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM8 12h8',
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
    'edit-2': {
        viewBox: '0 0 24 24',
        path: 'M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'edit-3': {
        viewBox: '0 0 24 24',
        path: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z',
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
  'tool': {
    viewBox: '0 0 24 24',
    path: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
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
    },
    'feather': {
        viewBox: '0 0 24 24',
        path: 'M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'palette': {
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.93 0 1.68-.75 1.68-1.68 0-.43-.16-.84-.44-1.13-.27-.29-.43-.7-.43-1.13 0-.93.76-1.69 1.69-1.69h1.98c3.03 0 5.52-2.49 5.52-5.52C22 6.48 17.52 2 12 2zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
        fill: 'currentColor'
    },
    'type': {
        viewBox: '0 0 24 24',
        path: 'M4 7V4h16v3M9 20h6M12 4v16',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'square': {
        viewBox: '0 0 24 24',
        path: 'M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'mouse-pointer': {
        viewBox: '0 0 24 24',
        path: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z M13 13l6 6',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'refresh-cw': {
        viewBox: '0 0 24 24',
        path: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
        stroke: 'currentColor',
      fill: 'none',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
  'sync': {
    viewBox: '0 0 24 24',
    path: 'M1 4v6h6m16 10v-6h-6M2 20l6-6M22 4l-6 6M9 12l2 2 4-4',
    stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'gauge': {
        viewBox: '0 0 24 24',
        path: 'M12 2a10 10 0 0110 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z M8 12l4 4 4-4M12 16V8',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'map-pin': {
        viewBox: '0 0 24 24',
        path: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z',
      stroke: 'currentColor',
      fill: 'none',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
  'help-circle': {
    viewBox: '0 0 24 24',
    path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'sliders': {
        viewBox: '0 0 24 24',
        path: 'M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'user-check': {
        viewBox: '0 0 24 24',
        path: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-13l2 2 4-4M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // 3D box / component icon
    'component': {
        viewBox: '0 0 24 24',
        path: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    // ── Contact icons ────────────────────────────────────────────────────
    'phone': {
        viewBox: '0 0 24 24',
        path: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'mail': {
        viewBox: '0 0 24 24',
        path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'briefcase': {
        viewBox: '0 0 24 24',
        path: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'building': {
        viewBox: '0 0 24 24',
        path: 'M3 21h18 M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16 M9 9h2 M9 13h2 M9 17h2 M13 9h2 M13 13h2 M13 17h2',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'link-2': {
        viewBox: '0 0 24 24',
        path: 'M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3 M8 12h8',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'at-sign': {
        viewBox: '0 0 24 24',
        path: 'M16 12a4 4 0 11-8 0 4 4 0 018 0z M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'heart': {
        viewBox: '0 0 24 24',
        path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'heart-filled': {
        viewBox: '0 0 24 24',
        path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
        stroke: 'currentColor',
        fill: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'cake': {
        viewBox: '0 0 24 24',
        path: 'M20 21H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2z M8 13V9 M12 13V9 M16 13V9 M8 9a1 1 0 010-2 1 1 0 010 2z M12 9a1 1 0 010-2 1 1 0 010 2z M16 9a1 1 0 010-2 1 1 0 010 2z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'sidebar': {
        viewBox: '0 0 24 24',
        path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z M9 3v18',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'window': {
        viewBox: '0 0 24 24',
        path: 'M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z M2 9h20 M5.5 6.5h.01 M8 6.5h.01',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }};

export default ui;
