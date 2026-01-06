/**
 * Domma Dates Module - TypeScript Declarations
 * Moment.js-style chainable date manipulation
 */

export type DateInput = Date | string | number | DommaDate | null | undefined;
export type DateUnit =
    'year'
    | 'years'
    | 'month'
    | 'months'
    | 'week'
    | 'weeks'
    | 'day'
    | 'days'
    | 'date'
    | 'hour'
    | 'hours'
    | 'minute'
    | 'minutes'
    | 'second'
    | 'seconds'
    | 'millisecond'
    | 'milliseconds';
export type DiffUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
export type Inclusivity = '()' | '[]' | '[)' | '(]';

/**
 * Chainable date wrapper class
 */
export declare class DommaDate {
    constructor(value?: DateInput);

    // ============================================
    // Manipulation Methods (chainable)
    // ============================================

    /** Add time to the date */
    add(amount: number, unit: DateUnit): DommaDate;

    /** Subtract time from the date */
    subtract(amount: number, unit: DateUnit): DommaDate;

    /** Set to start of unit of time */
    startOf(unit: DateUnit): DommaDate;

    /** Set to end of unit of time */
    endOf(unit: DateUnit): DommaDate;

    /** Set a unit of time */
    set(unit: DateUnit, value: number): DommaDate;

    // ============================================
    // Getter Methods
    // ============================================

    /** Get unit value or underlying Date */
    get(): Date;
    get(unit: DateUnit): number;

    /** Get the year */
    year(): number;

    /** Get the month (0-11) */
    month(): number;

    /** Get the date of month (1-31) */
    date(): number;

    /** Get the day of week (0-6, Sunday=0) */
    day(): number;

    /** Get the hour (0-23) */
    hour(): number;

    /** Get the minute (0-59) */
    minute(): number;

    /** Get the second (0-59) */
    second(): number;

    /** Get the millisecond (0-999) */
    millisecond(): number;

    /** Get the day of year (1-366) */
    dayOfYear(): number;

    /** Get the week of year */
    week(): number;

    /** Get the quarter (1-4) */
    quarter(): number;

    /** Get Unix timestamp (seconds) */
    unix(): number;

    /** Get milliseconds since epoch */
    valueOf(): number;

    // ============================================
    // Formatting
    // ============================================

    /** Format the date using tokens */
    format(formatStr?: string): string;

    /** Get ISO 8601 string */
    toISOString(): string;

    /** Get native Date object */
    toDate(): Date;

    /** Get string representation */
    toString(): string;

    /** Get relative time from now */
    fromNow(relativeTo?: DateInput): string;

    /** Get relative time to another date */
    to(date: DateInput): string;

    // ============================================
    // Comparison Methods
    // ============================================

    /** Check if date is before another */
    isBefore(other: DateInput, unit?: DateUnit): boolean;

    /** Check if date is after another */
    isAfter(other: DateInput, unit?: DateUnit): boolean;

    /** Check if date is same as another */
    isSame(other: DateInput, unit?: DateUnit): boolean;

    /** Check if date is between two dates */
    isBetween(start: DateInput, end: DateInput, unit?: DateUnit, inclusivity?: Inclusivity): boolean;

    /** Get difference between dates */
    diff(other: DateInput, unit?: DiffUnit, precise?: boolean): number;

    // ============================================
    // Query Methods
    // ============================================

    /** Check if date is valid */
    isValid(): boolean;

    /** Check if year is a leap year */
    isLeapYear(): boolean;

    /** Get number of days in month */
    daysInMonth(): number;

    // ============================================
    // Clone
    // ============================================

    /** Create a copy of this date */
    clone(): DommaDate;
}

export interface FormatTokens {
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
}

export interface Dates {
    /** Create a DommaDate from a value */
    (value?: DateInput): DommaDate;

    /** Get current timestamp in milliseconds */
    now(): number;

    /** Parse a date string with optional format */
    parse(dateString: string, format?: string): DommaDate;

    /** Check if a value is a valid date */
    isValid(value: DateInput): boolean;

    /** Get the minimum date from a list */
    min(...dates: DateInput[]): DommaDate;

    /** Get the maximum date from a list */
    max(...dates: DateInput[]): DommaDate;

    /** Format tokens reference */
    tokens: FormatTokens;
}

export declare const dates: Dates;
