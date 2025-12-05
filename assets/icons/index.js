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
    ...seasonal
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
    seasonal
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
    }
};

export default icons;
