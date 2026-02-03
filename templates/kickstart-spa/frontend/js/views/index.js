/**
 * View Registry
 * Import and export all application views
 */
import {homeView} from './home.js';
import {aboutView} from './about.js';
import {contactView} from './contact.js';
import {notFoundView} from './404.js';

export const views = {
    home: homeView,
    about: aboutView,
    contact: contactView,
    '404': notFoundView
};
