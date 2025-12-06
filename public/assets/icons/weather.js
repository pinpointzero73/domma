/**
 * Domma Weather Icons
 * Weather conditions and meteorological symbols
 */

export const weather = {
    // Sun variants
    'sun': {
        viewBox: '0 0 24 24',
        path: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'sunrise': {
        viewBox: '0 0 24 24',
        path: 'M17 18a5 5 0 1 0-10 0M12 2v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M8 6l4-4 4 4',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'sunset': {
        viewBox: '0 0 24 24',
        path: 'M17 18a5 5 0 1 0-10 0M12 9v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M16 5l-4 4-4-4',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Cloud variants
    'cloud': {
        viewBox: '0 0 24 24',
        path: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'cloud-sun': {
        viewBox: '0 0 24 24',
        path: 'M12 2v2M4.93 4.93l1.41 1.41M2 12h2M19 12a4 4 0 0 0-4-4h-.35A5.5 5.5 0 0 0 4 11a5 5 0 0 0 0 10h11a4 4 0 0 0 4-5v-4z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'cloud-off': {
        viewBox: '0 0 24 24',
        path: 'M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3M1 1l22 22',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Rain
    'rain': {
        viewBox: '0 0 24 24',
        path: 'M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'cloud-rain': {
        viewBox: '0 0 24 24',
        path: 'M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'cloud-drizzle': {
        viewBox: '0 0 24 24',
        path: 'M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Snow
    'snow': {
        viewBox: '0 0 24 24',
        path: 'M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'snowflake': {
        viewBox: '0 0 24 24',
        path: 'M12 2v20M17.66 7l-11.32 10M20.54 12H3.46M17.66 17L6.34 7M12 2l3 3M12 2l-3 3M12 22l3-3M12 22l-3-3M2 12l3 3M2 12l3-3M22 12l-3 3M22 12l-3-3',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Wind
    'wind': {
        viewBox: '0 0 24 24',
        path: 'M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Storm
    'cloud-lightning': {
        viewBox: '0 0 24 24',
        path: 'M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9M13 11l-4 6h6l-4 6',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'lightning': {
        viewBox: '0 0 24 24',
        path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Fog
    'fog': {
        viewBox: '0 0 24 24',
        path: 'M20 15h2M2 15h8M6 19h14M4 11h16M8 7h12',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'haze': {
        viewBox: '0 0 24 24',
        path: 'M12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M17.7 17.7l.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Temperature
    'thermometer': {
        viewBox: '0 0 24 24',
        path: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'thermometer-sun': {
        viewBox: '0 0 24 24',
        path: 'M12 9a4 4 0 0 0-2 7.5M12 3v2M5.6 5.6l1.4 1.4M3 12h2M5.6 18.4l1.4-1.4M12 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 10V3M16 14.76V8a2 2 0 0 0-4 0v6.76',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Moon
    'moon': {
        viewBox: '0 0 24 24',
        path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'moon-star': {
        viewBox: '0 0 24 24',
        path: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9zM19 3v4M17 5h4',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Umbrella
    'umbrella': {
        viewBox: '0 0 24 24',
        path: 'M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Droplet
    'droplet': {
        viewBox: '0 0 24 24',
        path: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    'droplets': {
        viewBox: '0 0 24 24',
        path: 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05zM12.56 14.94c1.47 0 2.67-1.25 2.67-2.77 0-.8-.38-1.55-1.14-2.18-.76-.64-1.17-1.32-1.38-2.29-.21.97-.62 1.65-1.38 2.29-.76.63-1.14 1.38-1.14 2.18 0 1.52 1.19 2.77 2.67 2.77zM19.5 17.35c1.1 0 2-.93 2-2.08 0-.6-.29-1.17-.86-1.64-.57-.48-.88-1-.57-1.73-.31.73-.62 1.25-1.19 1.73-.57.47-.86 1.04-.86 1.64 0 1.15.9 2.08 2 2.08z',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },
    // Rainbow
    'rainbow': {
        viewBox: '0 0 24 24',
        path: 'M22 17a10 10 0 0 0-20 0M18 17a6 6 0 0 0-12 0M14 17a2 2 0 0 0-4 0',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    }
};
