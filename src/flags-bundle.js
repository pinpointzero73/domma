/**
 * Domma Flags Bundle
 * Nation flags as inline SVG - an opt-in module, separate from the core bundle.
 *
 * Load after domma.min.js:
 * <script src="domma.min.js"></script>
 * <script src="domma-flags.min.js"></script>
 *
 * Exposes window.FL and Domma.flags / Domma.FL.
 */

import {flags, FlagRegistry} from './flags.js';

// Attach to Domma when present
if (typeof window !== 'undefined' && window.Domma) {
    window.Domma.flags = flags;
    window.Domma.FL = flags;
}

// Expose the FL alias globally
if (typeof window !== 'undefined') {
    window.FL = flags;
}

export {flags, FlagRegistry};
export default flags;
