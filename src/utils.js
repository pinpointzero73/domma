export const utils = {
    merge(target, ...sources) {
        sources.forEach(source => {
            if (source && typeof source === 'object') {
                Object.keys(source).forEach(key => {
                    if (source[key] && typeof source[key] === 'object') {
                        if (!target[key]) target[key] = {};
                        this.merge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                });
            }
        });
        return target;
    },

    each(collection, iteratee) {
        if (Array.isArray(collection)) {
            collection.forEach((item, index) => iteratee(item, index));
        } else if (typeof collection === 'object') {
            Object.keys(collection).forEach(key => iteratee(collection[key], key));
        }
    },

    clone(value) {
        return JSON.parse(JSON.stringify(value));
    }
};
