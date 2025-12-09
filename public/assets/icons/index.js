/**
 * Domma Icons
 * Aggregates all icon categories into a single registry
 */

import {ui} from './ui.js';
import {communication} from './communication.js';
import {media} from './media.js';
import {files} from './files.js';
import {social} from './social.js';
import {commerce} from './commerce.js';
import {status} from './status.js';
import {navigation} from './navigation.js';
import {seasonal} from './seasonal.js';
import {weather} from './weather.js';
import {devices} from './devices.js';
import {finance} from './finance.js';
import {health} from './health.js';
import {sport} from './sport.js';
import {buildings} from './buildings.js';
import {emojis} from './emojis.js';
import code from './code.js';

// Merge all icon categories
export const icons = {
    ...ui,
    ...communication,
    ...media,
    ...files,
    ...social,
    ...commerce,
    ...status,
    ...navigation,
    ...seasonal,
    ...weather,
    ...devices,
    ...finance,
    ...health,
    ...sport,
    ...buildings,
    ...emojis,
    ...code
};

// Export categories for selective imports
export {
    ui,
    communication,
    media,
    files,
    social,
    commerce,
    status,
    navigation,
    seasonal,
    weather,
    devices,
    finance,
    health,
    sport,
    buildings,
    emojis,
    code
};

// Category metadata for icon gallery
export const categories = {
    ui: {
        name: 'UI',
        description: 'Core user interface icons',
        icons: Object.keys(ui)
    },
    communication: {
        name: 'Communication',
        description: 'Messaging and notifications',
        icons: Object.keys(communication)
    },
    media: {
        name: 'Media',
        description: 'Audio, video, and images',
        icons: Object.keys(media)
    },
    files: {
        name: 'Files',
        description: 'Documents and file operations',
        icons: Object.keys(files)
    },
    social: {
        name: 'Social',
        description: 'Social interactions and sharing',
        icons: Object.keys(social)
    },
    commerce: {
        name: 'Commerce',
        description: 'Shopping and payments',
        icons: Object.keys(commerce)
    },
    status: {
        name: 'Status',
        description: 'Indicators and alerts',
        icons: Object.keys(status)
    },
    navigation: {
        name: 'Navigation',
        description: 'Directional and navigation',
        icons: Object.keys(navigation)
    },
    seasonal: {
        name: 'Seasonal',
        description: 'Festive and holiday icons',
        icons: Object.keys(seasonal)
    },
    weather: {
        name: 'Weather',
        description: 'Weather conditions and meteorology',
        icons: Object.keys(weather)
    },
    devices: {
        name: 'Devices',
        description: 'Electronic devices and hardware',
        icons: Object.keys(devices)
    },
    finance: {
        name: 'Finance',
        description: 'Financial and charts',
        icons: Object.keys(finance)
    },
    health: {
        name: 'Health',
        description: 'Medical and wellness',
        icons: Object.keys(health)
    },
    sport: {
        name: 'Sport',
        description: 'Sports and fitness',
        icons: Object.keys(sport)
    },
    buildings: {
        name: 'Buildings',
        description: 'Architecture and structures',
        icons: Object.keys(buildings)
    },
    emojis: {
        name: 'Emojis',
        description: 'Emoji expressions and faces',
        icons: Object.keys(emojis)
    },
    code: {
        name: 'Code & Editor',
        description: 'Text editing, formatting, and code icons',
        icons: Object.keys(code)
    }
};

export default icons;
