/**
 * Anything a date can be made from. `null`/`undefined` mean now.
 * @typedef {Date|string|number|DommaDate|null|undefined} DateInput
 */
/**
 * A unit of time - singular or plural, any case. `date` is the day of the month; `day` is the
 * day of the week for `get()` and a calendar day elsewhere.
 * @typedef {'year'|'years'|'month'|'months'|'week'|'weeks'|'day'|'days'|'date'|'hour'|'hours'|'minute'|'minutes'|'second'|'seconds'|'millisecond'|'milliseconds'} DateUnit
 */
/**
 * A unit for `diff()` - singular or plural.
 * @typedef {'milliseconds'|'seconds'|'minutes'|'hours'|'days'|'weeks'|'months'|'years'|'millisecond'|'second'|'minute'|'hour'|'day'|'week'|'month'|'year'} DiffUnit
 */
/**
 * Bounds for `isBetween()`: `(` / `)` exclusive, `[` / `]` inclusive.
 * @typedef {'()'|'[]'|'[)'|'(]'} Inclusivity
 */
/**
 * Chainable date wrapper class
 */
export class DommaDate {
    /**
     * @param {DateInput} [value] The date; now when omitted
     */
    constructor(value?: DateInput);
    /**
     * @type {Date}
     * @private
     */
    private _date;
    /**
     * Add time to the date (mutates and returns this date)
     * @param {number} amount
     * @param {DateUnit} unit
     * @returns {this}
     */
    add(amount: number, unit: DateUnit): this;
    /**
     * Subtract time from the date (mutates and returns this date)
     * @param {number} amount
     * @param {DateUnit} unit
     * @returns {this}
     */
    subtract(amount: number, unit: DateUnit): this;
    /**
     * Set to the start of a unit of time (weeks start on Sunday)
     * @param {DateUnit} unit
     * @returns {this}
     */
    startOf(unit: DateUnit): this;
    /**
     * Set to the end of a unit of time
     * @param {DateUnit} unit
     * @returns {this}
     */
    endOf(unit: DateUnit): this;
    /**
     * Set a unit of time (`month` is 0-11; `day` and `date` both set the day of the month)
     * @param {DateUnit} unit
     * @param {number} value
     * @returns {this}
     */
    set(unit: DateUnit, value: number): this;
    /**
     * @overload
     * @returns {Date} The underlying Date (not a copy)
     */
    get(): Date;
    /**
     * @overload
     * @param {Exclude<DateUnit, 'week'|'weeks'>} unit
     * @returns {number} The unit's value (`day` is the day of the week, `date` the day of the month)
     */
    get(unit: Exclude<DateUnit, "week" | "weeks">): number;
    /**
     * Get the year
     * @returns {number}
     */
    year(): number;
    /**
     * Get the month (0-11)
     * @returns {number}
     */
    month(): number;
    /**
     * Get the date of month (1-31)
     * @returns {number}
     */
    date(): number;
    /**
     * Get the day of week (0-6, Sunday=0)
     * @returns {number}
     */
    day(): number;
    /**
     * Get the hour (0-23)
     * @returns {number}
     */
    hour(): number;
    /**
     * Get the minute (0-59)
     * @returns {number}
     */
    minute(): number;
    /**
     * Get the second (0-59)
     * @returns {number}
     */
    second(): number;
    /**
     * Get the millisecond (0-999)
     * @returns {number}
     */
    millisecond(): number;
    /**
     * Get the day of year (1-366)
     * @returns {number}
     */
    dayOfYear(): number;
    /**
     * Get the week of year
     * @returns {number}
     */
    week(): number;
    /**
     * Get the quarter (1-4)
     * @returns {number}
     */
    quarter(): number;
    /**
     * Get Unix timestamp (seconds)
     * @returns {number}
     */
    unix(): number;
    /**
     * Get milliseconds since epoch
     * @returns {number}
     */
    valueOf(): number;
    /**
     * Format the date using tokens (see `D.tokens`)
     * @param {string} [formatStr='YYYY-MM-DD HH:mm:ss']
     * @returns {string}
     */
    format(formatStr?: string): string;
    /**
     * Get ISO 8601 string
     * @returns {string}
     */
    toISOString(): string;
    /**
     * Get a copy of the native Date
     * @returns {Date}
     */
    toDate(): Date;
    /**
     * Get string representation
     * @returns {string}
     */
    toString(): string;
    /**
     * Relative time from now (or from `relativeTo`), e.g. `3 days ago`, `in 2 hours`, `just now`
     * @param {DateInput} [relativeTo]
     * @returns {string}
     */
    fromNow(relativeTo?: DateInput): string;
    /**
     * Relative time from this date to another
     * @param {DateInput} date
     * @returns {string}
     */
    to(date: DateInput): string;
    /**
     * Check if date is before another (at the granularity of `unit` when given)
     * @param {DateInput} other
     * @param {DateUnit} [unit]
     * @returns {boolean}
     */
    isBefore(other: DateInput, unit?: DateUnit): boolean;
    /**
     * Check if date is after another (at the granularity of `unit` when given)
     * @param {DateInput} other
     * @param {DateUnit} [unit]
     * @returns {boolean}
     */
    isAfter(other: DateInput, unit?: DateUnit): boolean;
    /**
     * Check if date is the same as another (within the same `unit` when given)
     * @param {DateInput} other
     * @param {DateUnit} [unit]
     * @returns {boolean}
     */
    isSame(other: DateInput, unit?: DateUnit): boolean;
    /**
     * Check if date is between two dates
     * @param {DateInput} start
     * @param {DateInput} end
     * @param {DateUnit|null} [unit]
     * @param {Inclusivity} [inclusivity='()']
     * @returns {boolean}
     */
    isBetween(start: DateInput, end: DateInput, unit?: DateUnit | null, inclusivity?: Inclusivity): boolean;
    /**
     * Difference between this date and another (positive when this one is later), floored unless `precise`
     * @param {DateInput} other
     * @param {DiffUnit} [unit='milliseconds']
     * @param {boolean} [precise=false]
     * @returns {number}
     */
    diff(other: DateInput, unit?: DiffUnit, precise?: boolean): number;
    /**
     * @param {DommaDate} other
     * @returns {number}
     * @private
     */
    private _monthDiff;
    /**
     * Check if date is valid
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Check if year is a leap year
     * @returns {boolean}
     */
    isLeapYear(): boolean;
    /**
     * Get number of days in month
     * @returns {number}
     */
    daysInMonth(): number;
    /**
     * Create a copy of this date
     * @returns {DommaDate}
     */
    clone(): DommaDate;
    /**
     * @param {string} unit
     * @returns {string}
     * @private
     */
    private _normalizeUnit;
}
/**
 * Anything a date can be made from. `null`/`undefined` mean now.
 */
export type DateInput = Date | string | number | DommaDate | null | undefined;
/**
 * A unit of time - singular or plural, any case. `date` is the day of the month; `day` is the
 * day of the week for `get()` and a calendar day elsewhere.
 */
export type DateUnit = "year" | "years" | "month" | "months" | "week" | "weeks" | "day" | "days" | "date" | "hour" | "hours" | "minute" | "minutes" | "second" | "seconds" | "millisecond" | "milliseconds";
/**
 * A unit for `diff()` - singular or plural.
 */
export type DiffUnit = "milliseconds" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years" | "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
/**
 * Bounds for `isBetween()`: `(` / `)` exclusive, `[` / `]` inclusive.
 */
export type Inclusivity = "()" | "[]" | "[)" | "(]";
/**
 * Descriptions of the `format()` tokens, keyed by token.
 */
export type FormatTokens = {
    YYYY: string;
    YY: string;
    MM: string;
    M: string;
    DD: string;
    D: string;
    HH: string;
    H: string;
    hh: string;
    h: string;
    mm: string;
    m: string;
    ss: string;
    s: string;
    SSS: string;
    A: string;
    a: string;
    ddd: string;
    dddd: string;
    MMM: string;
    MMMM: string;
};
/**
 * The statics on the date factory.
 */
export type DatesStatics = {
    /**
     * Get current timestamp in milliseconds
     */
    now: () => number;
    /**
     * Parse a date string, optionally with a
     * format of YYYY YY MM M DD D HH H mm m ss s tokens; an unmatched string gives an invalid date
     */
    parse: (dateString: string, format?: string) => DommaDate;
    /**
     * Check if a value is a valid date
     */
    isValid: (value: DateInput) => boolean;
    /**
     * The earliest of the dates (arrays are flattened)
     */
    min: (...dates: Array<DateInput | DateInput[]>) => DommaDate;
    /**
     * The latest of the dates (arrays are flattened)
     */
    max: (...dates: Array<DateInput | DateInput[]>) => DommaDate;
    /**
     * Format tokens reference
     */
    tokens: FormatTokens;
};
/**
 * The date factory (`D`): `D(value?)` wraps a date in a chainable {@link DommaDate};
 * the statics (`D.now()`, `D.parse()`, ...) do the rest.
 */
export type Dates = ((value?: DateInput) => DommaDate) & DatesStatics;
/**
 * Descriptions of the `format()` tokens, keyed by token.
 * @typedef {object} FormatTokens
 * @property {string} YYYY
 * @property {string} YY
 * @property {string} MM
 * @property {string} M
 * @property {string} DD
 * @property {string} D
 * @property {string} HH
 * @property {string} H
 * @property {string} hh
 * @property {string} h
 * @property {string} mm
 * @property {string} m
 * @property {string} ss
 * @property {string} s
 * @property {string} SSS
 * @property {string} A
 * @property {string} a
 * @property {string} ddd
 * @property {string} dddd
 * @property {string} MMM
 * @property {string} MMMM
 */
/**
 * The statics on the date factory.
 * @typedef {object} DatesStatics
 * @property {() => number} now Get current timestamp in milliseconds
 * @property {(dateString: string, format?: string) => DommaDate} parse Parse a date string, optionally with a
 *   format of YYYY YY MM M DD D HH H mm m ss s tokens; an unmatched string gives an invalid date
 * @property {(value: DateInput) => boolean} isValid Check if a value is a valid date
 * @property {(...dates: Array<DateInput|DateInput[]>) => DommaDate} min The earliest of the dates (arrays are flattened)
 * @property {(...dates: Array<DateInput|DateInput[]>) => DommaDate} max The latest of the dates (arrays are flattened)
 * @property {FormatTokens} tokens Format tokens reference
 */
/**
 * The date factory (`D`): `D(value?)` wraps a date in a chainable {@link DommaDate};
 * the statics (`D.now()`, `D.parse()`, ...) do the rest.
 * @typedef {((value?: DateInput) => DommaDate) & DatesStatics} Dates
 */
/**
 * Main date factory function
 * @type {Dates}
 */
export const dates: Dates;
