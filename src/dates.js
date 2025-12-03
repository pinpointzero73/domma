/**
 * Domma Dates Module
 * Moment.js-style chainable date manipulation
 */

const UNITS = {
    year: 'FullYear',
    month: 'Month',
    date: 'Date',
    day: 'Day',
    hour: 'Hours',
    minute: 'Minutes',
    second: 'Seconds',
    millisecond: 'Milliseconds'
};

const UNIT_MS = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Chainable date wrapper class
 */
class DommaDate {
    constructor(value) {
        if (value instanceof DommaDate) {
            this._date = new Date(value._date);
        } else if (value instanceof Date) {
            this._date = new Date(value);
        } else if (typeof value === 'string') {
            this._date = new Date(value);
        } else if (typeof value === 'number') {
            this._date = new Date(value);
        } else if (value === undefined || value === null) {
            this._date = new Date();
        } else {
            this._date = new Date(value);
        }
    }

    // ============================================
    // Manipulation Methods (return this for chaining)
    // ============================================

    add(amount, unit) {
        const u = this._normalizeUnit(unit);
        const d = this._date;

        if (u === 'years') {
            d.setFullYear(d.getFullYear() + amount);
        } else if (u === 'months') {
            d.setMonth(d.getMonth() + amount);
        } else if (u === 'weeks') {
            d.setDate(d.getDate() + amount * 7);
        } else if (u === 'days') {
            d.setDate(d.getDate() + amount);
        } else if (u === 'hours') {
            d.setHours(d.getHours() + amount);
        } else if (u === 'minutes') {
            d.setMinutes(d.getMinutes() + amount);
        } else if (u === 'seconds') {
            d.setSeconds(d.getSeconds() + amount);
        } else if (u === 'milliseconds') {
            d.setMilliseconds(d.getMilliseconds() + amount);
        }

        return this;
    }

    subtract(amount, unit) {
        return this.add(-amount, unit);
    }

    startOf(unit) {
        const u = this._normalizeUnit(unit);
        const d = this._date;

        if (u === 'years' || u === 'year') {
            d.setMonth(0, 1);
            d.setHours(0, 0, 0, 0);
        } else if (u === 'months' || u === 'month') {
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
        } else if (u === 'weeks' || u === 'week') {
            d.setDate(d.getDate() - d.getDay());
            d.setHours(0, 0, 0, 0);
        } else if (u === 'days' || u === 'day') {
            d.setHours(0, 0, 0, 0);
        } else if (u === 'hours' || u === 'hour') {
            d.setMinutes(0, 0, 0);
        } else if (u === 'minutes' || u === 'minute') {
            d.setSeconds(0, 0);
        } else if (u === 'seconds' || u === 'second') {
            d.setMilliseconds(0);
        }

        return this;
    }

    endOf(unit) {
        const u = this._normalizeUnit(unit);
        const d = this._date;

        if (u === 'years' || u === 'year') {
            d.setMonth(11, 31);
            d.setHours(23, 59, 59, 999);
        } else if (u === 'months' || u === 'month') {
            d.setMonth(d.getMonth() + 1, 0);
            d.setHours(23, 59, 59, 999);
        } else if (u === 'weeks' || u === 'week') {
            d.setDate(d.getDate() + (6 - d.getDay()));
            d.setHours(23, 59, 59, 999);
        } else if (u === 'days' || u === 'day') {
            d.setHours(23, 59, 59, 999);
        } else if (u === 'hours' || u === 'hour') {
            d.setMinutes(59, 59, 999);
        } else if (u === 'minutes' || u === 'minute') {
            d.setSeconds(59, 999);
        } else if (u === 'seconds' || u === 'second') {
            d.setMilliseconds(999);
        }

        return this;
    }

    set(unit, value) {
        const u = this._normalizeUnit(unit);
        const d = this._date;

        if (u === 'years' || u === 'year') {
            d.setFullYear(value);
        } else if (u === 'months' || u === 'month') {
            d.setMonth(value);
        } else if (u === 'days' || u === 'day' || u === 'date') {
            d.setDate(value);
        } else if (u === 'hours' || u === 'hour') {
            d.setHours(value);
        } else if (u === 'minutes' || u === 'minute') {
            d.setMinutes(value);
        } else if (u === 'seconds' || u === 'second') {
            d.setSeconds(value);
        } else if (u === 'milliseconds' || u === 'millisecond') {
            d.setMilliseconds(value);
        }

        return this;
    }

    // ============================================
    // Getter Methods
    // ============================================

    get(unit) {
        if (!unit) return this._date;

        const u = this._normalizeUnit(unit);
        const d = this._date;

        if (u === 'years' || u === 'year') return d.getFullYear();
        if (u === 'months' || u === 'month') return d.getMonth();
        if (u === 'days' || u === 'day') return d.getDay();
        if (u === 'date') return d.getDate();
        if (u === 'hours' || u === 'hour') return d.getHours();
        if (u === 'minutes' || u === 'minute') return d.getMinutes();
        if (u === 'seconds' || u === 'second') return d.getSeconds();
        if (u === 'milliseconds' || u === 'millisecond') return d.getMilliseconds();

        return this._date;
    }

    year() {
        return this._date.getFullYear();
    }

    month() {
        return this._date.getMonth();
    }

    date() {
        return this._date.getDate();
    }

    day() {
        return this._date.getDay();
    }

    hour() {
        return this._date.getHours();
    }

    minute() {
        return this._date.getMinutes();
    }

    second() {
        return this._date.getSeconds();
    }

    millisecond() {
        return this._date.getMilliseconds();
    }

    dayOfYear() {
        const start = new Date(this._date.getFullYear(), 0, 0);
        const diff = this._date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    week() {
        const start = new Date(this._date.getFullYear(), 0, 1);
        const diff = this._date - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.ceil((diff / oneWeek) + start.getDay() / 7);
    }

    quarter() {
        return Math.floor(this._date.getMonth() / 3) + 1;
    }

    unix() {
        return Math.floor(this._date.getTime() / 1000);
    }

    valueOf() {
        return this._date.getTime();
    }

    // ============================================
    // Formatting
    // ============================================

    format(formatStr = 'YYYY-MM-DD HH:mm:ss') {
        const d = this._date;
        const year = d.getFullYear();
        const month = d.getMonth();
        const date = d.getDate();
        const day = d.getDay();
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();
        const ms = d.getMilliseconds();
        const hours12 = hours % 12 || 12;

        const pad = (n, len = 2) => String(n).padStart(len, '0');

        const tokens = {
            'YYYY': year,
            'YY': String(year).slice(-2),
            'MMMM': MONTH_NAMES[month],
            'MMM': MONTH_NAMES_SHORT[month],
            'MM': pad(month + 1),
            'M': month + 1,
            'dddd': DAY_NAMES[day],
            'ddd': DAY_NAMES_SHORT[day],
            'DD': pad(date),
            'D': date,
            'HH': pad(hours),
            'H': hours,
            'hh': pad(hours12),
            'h': hours12,
            'mm': pad(minutes),
            'm': minutes,
            'ss': pad(seconds),
            's': seconds,
            'SSS': pad(ms, 3),
            'A': hours < 12 ? 'AM' : 'PM',
            'a': hours < 12 ? 'am' : 'pm'
        };

        // Build regex pattern - sort by length descending to match longer tokens first
        const tokenKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);
        const pattern = new RegExp(tokenKeys.join('|'), 'g');

        // Single-pass replacement to avoid replacing characters in already-substituted text
        return formatStr.replace(pattern, (match) => tokens[match]);
    }

    toISOString() {
        return this._date.toISOString();
    }

    toDate() {
        return new Date(this._date);
    }

    toString() {
        return this._date.toString();
    }

    fromNow(relativeTo) {
        const now = relativeTo ? new DommaDate(relativeTo)._date : new Date();
        const diffMs = this._date.getTime() - now.getTime();
        const absDiff = Math.abs(diffMs);
        const isPast = diffMs < 0;

        let value, unit;

        if (absDiff < UNIT_MS.minutes) {
            return 'just now';
        } else if (absDiff < UNIT_MS.hours) {
            value = Math.floor(absDiff / UNIT_MS.minutes);
            unit = value === 1 ? 'minute' : 'minutes';
        } else if (absDiff < UNIT_MS.days) {
            value = Math.floor(absDiff / UNIT_MS.hours);
            unit = value === 1 ? 'hour' : 'hours';
        } else if (absDiff < UNIT_MS.weeks) {
            value = Math.floor(absDiff / UNIT_MS.days);
            unit = value === 1 ? 'day' : 'days';
        } else if (absDiff < UNIT_MS.days * 30) {
            value = Math.floor(absDiff / UNIT_MS.weeks);
            unit = value === 1 ? 'week' : 'weeks';
        } else if (absDiff < UNIT_MS.days * 365) {
            value = Math.floor(absDiff / (UNIT_MS.days * 30));
            unit = value === 1 ? 'month' : 'months';
        } else {
            value = Math.floor(absDiff / (UNIT_MS.days * 365));
            unit = value === 1 ? 'year' : 'years';
        }

        return isPast ? `${value} ${unit} ago` : `in ${value} ${unit}`;
    }

    to(date) {
        const other = new DommaDate(date);
        const diffMs = other._date.getTime() - this._date.getTime();
        const absDiff = Math.abs(diffMs);
        const isFuture = diffMs > 0;

        let value, unit;

        if (absDiff < UNIT_MS.minutes) {
            return 'just now';
        } else if (absDiff < UNIT_MS.hours) {
            value = Math.floor(absDiff / UNIT_MS.minutes);
            unit = value === 1 ? 'minute' : 'minutes';
        } else if (absDiff < UNIT_MS.days) {
            value = Math.floor(absDiff / UNIT_MS.hours);
            unit = value === 1 ? 'hour' : 'hours';
        } else if (absDiff < UNIT_MS.weeks) {
            value = Math.floor(absDiff / UNIT_MS.days);
            unit = value === 1 ? 'day' : 'days';
        } else if (absDiff < UNIT_MS.days * 30) {
            value = Math.floor(absDiff / UNIT_MS.weeks);
            unit = value === 1 ? 'week' : 'weeks';
        } else if (absDiff < UNIT_MS.days * 365) {
            value = Math.floor(absDiff / (UNIT_MS.days * 30));
            unit = value === 1 ? 'month' : 'months';
        } else {
            value = Math.floor(absDiff / (UNIT_MS.days * 365));
            unit = value === 1 ? 'year' : 'years';
        }

        return isFuture ? `in ${value} ${unit}` : `${value} ${unit} ago`;
    }

    // ============================================
    // Comparison Methods
    // ============================================

    isBefore(other, unit) {
        const otherDate = new DommaDate(other);
        if (!unit) {
            return this._date.getTime() < otherDate._date.getTime();
        }
        return this.clone().endOf(unit).valueOf() < otherDate.clone().startOf(unit).valueOf();
    }

    isAfter(other, unit) {
        const otherDate = new DommaDate(other);
        if (!unit) {
            return this._date.getTime() > otherDate._date.getTime();
        }
        return this.clone().startOf(unit).valueOf() > otherDate.clone().endOf(unit).valueOf();
    }

    isSame(other, unit) {
        const otherDate = new DommaDate(other);
        if (!unit) {
            return this._date.getTime() === otherDate._date.getTime();
        }
        const start = this.clone().startOf(unit).valueOf();
        const end = this.clone().endOf(unit).valueOf();
        const otherVal = otherDate.valueOf();
        return otherVal >= start && otherVal <= end;
    }

    isBetween(start, end, unit, inclusivity = '()') {
        const startDate = new DommaDate(start);
        const endDate = new DommaDate(end);

        let startVal, endVal, thisVal;

        if (unit) {
            startVal = startDate.clone().startOf(unit).valueOf();
            endVal = endDate.clone().endOf(unit).valueOf();
            thisVal = this.clone().startOf(unit).valueOf();
        } else {
            startVal = startDate.valueOf();
            endVal = endDate.valueOf();
            thisVal = this.valueOf();
        }

        const leftInc = inclusivity[0] === '[';
        const rightInc = inclusivity[1] === ']';

        const leftOk = leftInc ? thisVal >= startVal : thisVal > startVal;
        const rightOk = rightInc ? thisVal <= endVal : thisVal < endVal;

        return leftOk && rightOk;
    }

    diff(other, unit = 'milliseconds', precise = false) {
        const otherDate = new DommaDate(other);
        const diffMs = this._date.getTime() - otherDate._date.getTime();
        const u = this._normalizeUnit(unit);

        let result;

        if (u === 'milliseconds') {
            result = diffMs;
        } else if (u === 'seconds') {
            result = diffMs / UNIT_MS.seconds;
        } else if (u === 'minutes') {
            result = diffMs / UNIT_MS.minutes;
        } else if (u === 'hours') {
            result = diffMs / UNIT_MS.hours;
        } else if (u === 'days') {
            result = diffMs / UNIT_MS.days;
        } else if (u === 'weeks') {
            result = diffMs / UNIT_MS.weeks;
        } else if (u === 'months') {
            result = this._monthDiff(otherDate);
        } else if (u === 'years') {
            result = this._monthDiff(otherDate) / 12;
        } else {
            result = diffMs;
        }

        return precise ? result : Math.floor(result);
    }

    _monthDiff(other) {
        const d1 = this._date;
        const d2 = other._date;
        return (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
    }

    // ============================================
    // Query Methods
    // ============================================

    isValid() {
        return !isNaN(this._date.getTime());
    }

    isLeapYear() {
        const year = this._date.getFullYear();
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    daysInMonth() {
        return new Date(this._date.getFullYear(), this._date.getMonth() + 1, 0).getDate();
    }

    // ============================================
    // Clone
    // ============================================

    clone() {
        return new DommaDate(this._date);
    }

    // ============================================
    // Helpers
    // ============================================

    _normalizeUnit(unit) {
        if (!unit) return unit;
        const u = String(unit).toLowerCase().trim();
        // Normalize singular to plural
        if (u === 'year') return 'years';
        if (u === 'month') return 'months';
        if (u === 'week') return 'weeks';
        if (u === 'day') return 'days';
        if (u === 'hour') return 'hours';
        if (u === 'minute') return 'minutes';
        if (u === 'second') return 'seconds';
        if (u === 'millisecond') return 'milliseconds';
        return u;
    }
}

/**
 * Main date factory function
 */
const dates = function (value) {
    return new DommaDate(value);
};

// Attach static utilities
Object.assign(dates, {
    now() {
        return Date.now();
    },

    parse(dateString, format) {
        // Simple parsing - for complex formats, use native Date
        // This handles common formats like 'YYYY-MM-DD' and 'DD/MM/YYYY'
        if (!format) {
            return new DommaDate(dateString);
        }

        const tokens = {
            'YYYY': {regex: '(\\d{4})', setter: 'year'},
            'YY': {regex: '(\\d{2})', setter: 'year', transform: v => 2000 + parseInt(v)},
            'MM': {regex: '(\\d{2})', setter: 'month', transform: v => parseInt(v) - 1},
            'M': {regex: '(\\d{1,2})', setter: 'month', transform: v => parseInt(v) - 1},
            'DD': {regex: '(\\d{2})', setter: 'date'},
            'D': {regex: '(\\d{1,2})', setter: 'date'},
            'HH': {regex: '(\\d{2})', setter: 'hour'},
            'H': {regex: '(\\d{1,2})', setter: 'hour'},
            'mm': {regex: '(\\d{2})', setter: 'minute'},
            'm': {regex: '(\\d{1,2})', setter: 'minute'},
            'ss': {regex: '(\\d{2})', setter: 'second'},
            's': {regex: '(\\d{1,2})', setter: 'second'}
        };

        let regexStr = format;
        const order = [];

        // Sort by length descending to match longer tokens first
        const tokenKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);

        for (const token of tokenKeys) {
            if (format.includes(token)) {
                const idx = regexStr.indexOf(token);
                if (idx !== -1) {
                    regexStr = regexStr.replace(token, tokens[token].regex);
                    order.push({token, ...tokens[token]});
                }
            }
        }

        // Escape special regex chars except our groups
        regexStr = regexStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, (m) => {
            return m === '(' || m === ')' ? m : '\\' + m;
        });

        try {
            const regex = new RegExp('^' + regexStr + '$');
            const match = dateString.match(regex);

            if (!match) {
                return new DommaDate(NaN);
            }

            const d = new DommaDate();
            d.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);

            for (let i = 0; i < order.length; i++) {
                let val = parseInt(match[i + 1]);
                if (order[i].transform) {
                    val = order[i].transform(match[i + 1]);
                }
                d.set(order[i].setter, val);
            }

            return d;
        } catch (e) {
            return new DommaDate(NaN);
        }
    },

    isValid(value) {
        return new DommaDate(value).isValid();
    },

    min(...args) {
        const dates = args.flat().map(d => new DommaDate(d));
        let min = dates[0];
        for (let i = 1; i < dates.length; i++) {
            if (dates[i].valueOf() < min.valueOf()) {
                min = dates[i];
            }
        }
        return min;
    },

    max(...args) {
        const dates = args.flat().map(d => new DommaDate(d));
        let max = dates[0];
        for (let i = 1; i < dates.length; i++) {
            if (dates[i].valueOf() > max.valueOf()) {
                max = dates[i];
            }
        }
        return max;
    },

    // Format tokens reference
    tokens: {
        YYYY: 'Full year (2025)',
        YY: 'Short year (25)',
        MM: 'Month 01-12',
        M: 'Month 1-12',
        DD: 'Day 01-31',
        D: 'Day 1-31',
        HH: 'Hour 00-23',
        H: 'Hour 0-23',
        hh: 'Hour 01-12',
        h: 'Hour 1-12',
        mm: 'Minute 00-59',
        m: 'Minute 0-59',
        ss: 'Second 00-59',
        s: 'Second 0-59',
        SSS: 'Milliseconds',
        A: 'AM/PM',
        a: 'am/pm',
        ddd: 'Day name short (Mon)',
        dddd: 'Day name full (Monday)',
        MMM: 'Month name short (Jan)',
        MMMM: 'Month name full (January)'
    }
});

export {dates};
