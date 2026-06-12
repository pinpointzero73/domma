/**
 * Domma Flags
 * Aggregates nation-flag descriptors into a single registry, keyed by
 * ISO 3166-1 alpha-2 code, grouped by region.
 *
 * This is a curated starter set covering the major footballing and world
 * nations. It is easily extended at runtime with FL.register(code, def).
 */

import {europe} from './europe.js';
import {americas} from './americas.js';
import {africa} from './africa.js';
import {asia} from './asia.js';
import {oceania} from './oceania.js';

// Merge all regions into a single registry
export const flags = {
    ...europe,
    ...americas,
    ...africa,
    ...asia,
    ...oceania
};

// Export region groups for selective imports
export {europe, americas, africa, asia, oceania};

// Region metadata for the flag gallery
export const regions = {
    europe: {name: 'Europe', description: 'European nations', codes: Object.keys(europe)},
    americas: {name: 'Americas', description: 'North, Central & South America', codes: Object.keys(americas)},
    africa: {name: 'Africa', description: 'African nations', codes: Object.keys(africa)},
    asia: {name: 'Asia & Middle East', description: 'Asian and Middle Eastern nations', codes: Object.keys(asia)},
    oceania: {name: 'Oceania', description: 'Australia, New Zealand & the Pacific', codes: Object.keys(oceania)}
};

export default flags;
