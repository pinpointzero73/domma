---
title: Dates
description: "Moment.js-style chainable date manipulation without the bloat."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Dates" tagline="Moment.js-style chainable date manipulation without the bloat." align="center"][/hero]

## Creating Dates

Create DommaDate instances from various inputs.

```javascript
// Current date/time
D()
D(new Date())

// From string
D('2025-12-25')
D('2025-12-25T10:30:00')
D('December 25, 2025')

// From timestamp
D(1735084800000)

// From Date object
D(new Date(2025, 11, 25))

// Parse with static method
Domma.dates.parse('2025-12-25')

// Get current timestamp
Domma.dates.now()  // Returns timestamp number
```

[showcase-demo id="showcase/dates/try-it" title="Try It" /]

## Formatting

Format dates using tokens similar to Moment.js.

### Format Tokens

[showcase-demo id="showcase/dates/format-tokens" title="Format Tokens" /]

```javascript
D().format('YYYY-MM-DD')           // '2025-12-03'
D().format('MMMM D, YYYY')          // 'December 3, 2025'
D().format('dddd, MMMM Do YYYY')    // 'Wednesday, December 3rd 2025'
D().format('h:mm A')                // '2:30 PM'
D().format('HH:mm:ss')              // '14:30:45'
D().format('MMM D, YYYY h:mm A')    // 'Dec 3, 2025 2:30 PM'

// ISO format
D().toISOString()                   // '2025-12-03T14:30:45.000Z'

// Unix timestamp
D().unix()                          // 1733236245
```

[showcase-demo id="showcase/dates/try-it-2" title="Try It" /]

## Manipulation

Add, subtract, and modify dates with a chainable API.

add()

subtract()

startOf()

endOf()

set()

clone()

```javascript
// Add time
D().add(7, 'days').format('MMM D')
D().add(1, 'month').format('MMM D')
D().add(2, 'hours').format('h:mm A')

// Subtract time
D().subtract(1, 'week').format('MMM D')
D().subtract(3, 'months').format('MMM YYYY')

// Units: years, months, weeks, days, hours, minutes, seconds

// Start/end of period
D().startOf('day')     // 00:00:00.000
D().startOf('month')   // First day of month
D().startOf('year')    // January 1st
D().endOf('day')       // 23:59:59.999
D().endOf('month')     // Last day of month

// Set specific values
D().set('year', 2030)
D().set('month', 0)    // January (0-indexed)
D().set('date', 15)

// Chain operations
D()
    .add(1, 'month')
    .startOf('month')
    .format('MMMM D, YYYY')

// Clone to avoid mutation
const date = D('2025-06-15');
const nextMonth = date.clone().add(1, 'month');
```

[showcase-demo id="showcase/dates/try-it-3" title="Try It" /]

## Getters & Setters

Get and set individual date/time components.

year()

month()

date()

day()

hour()

minute()

second()

millisecond()

dayOfYear()

week()

quarter()

```javascript
const d = D('2025-12-25T14:30:45');

// Getters (no argument)
d.year()        // 2025
d.month()       // 11 (December, 0-indexed)
d.date()        // 25
d.day()         // 4 (Thursday, 0=Sunday)
d.hour()        // 14
d.minute()      // 30
d.second()      // 45
d.dayOfYear()   // 359
d.week()        // 52
d.quarter()     // 4

// Setters (with argument)
d.year(2030)
d.month(5)      // June
d.date(1)
d.hour(9)

// Get native Date object
d.toDate()      // Returns Date instance

// Read selected date parts
const parts = { year: d.year(), month: d.month(), date: d.date() };
```

[showcase-demo id="showcase/dates/current-date-components" title="Current Date Components" /]

## Relative Time

Display human-readable relative time strings.

fromNow()

to()

```javascript
// Time from now
D().subtract(5, 'minutes').fromNow()  // 'a few minutes ago'
D().subtract(2, 'hours').fromNow()    // '2 hours ago'
D().subtract(3, 'days').fromNow()     // '3 days ago'
D().add(1, 'week').fromNow()          // 'in 7 days'

// Time from another date
const past = D('2025-01-01');
const future = D('2025-12-31');
past.fromNow(future)                      // '12 months ago'
future.fromNow(past)                      // 'in 12 months'

// Time to now/another date
D().add(2, 'weeks').fromNow()            // 'in 2 weeks'
past.to(future)                        // 'in 12 months'
```

[showcase-demo id="showcase/dates/try-it-4" title="Try It" /]

## Comparison & Difference

Compare dates and calculate differences.

isBefore()

isAfter()

isSame()

isBetween()

diff()

```javascript
const jan = D('2025-01-15');
const dec = D('2025-12-25');

// Comparison
jan.isBefore(dec)                    // true
dec.isAfter(jan)                     // true
jan.isSame(jan.clone())              // true

// Compare by unit
D('2025-01-15').isSame('2025-01-20', 'month')  // true
D('2025-01-15').isSame('2025-02-15', 'year')   // true

// Range check
const mid = D('2025-06-15');
mid.isBetween(jan, dec)              // true
mid.isBetween(jan, dec, 'month')     // true

// Difference
dec.diff(jan, 'days')                // 344
dec.diff(jan, 'months')              // 11
dec.diff(jan, 'weeks')               // 49

// Float difference
dec.diff(jan, 'months', true)        // 11.33...
```

[showcase-demo id="showcase/dates/date-difference" title="Date Difference" /]

## Validation & Utilities

Validate dates and use helpful static methods.

isValid()

isLeapYear()

daysInMonth()

dates.isValid()

dates.min()

dates.max()

```javascript
// Instance validation
D('2025-12-25').isValid()            // true
D('invalid').isValid()               // false

// Static validation
Domma.dates.isValid('2025-02-30')    // false (Feb 30 doesn't exist)
Domma.dates.isValid('2025-12-25')    // true

// Leap year check
D('2024-01-01').isLeapYear()         // true
D('2025-01-01').isLeapYear()         // false

// Days in month
D('2025-02-01').daysInMonth()        // 28
D('2024-02-01').daysInMonth()        // 29 (leap year)
D('2025-12-01').daysInMonth()        // 31

// Min/Max of dates
const dates = [D('2025-03-15'), D('2025-01-01'), D('2025-06-20')];
Domma.dates.min(dates).format('MMM D')  // 'Jan 1'
Domma.dates.max(dates).format('MMM D')  // 'Jun 20'
```

[showcase-demo id="showcase/dates/try-it-5" title="Try It" /]

## Complete Method Reference

### Instance Methods

format()

toISOString()

toDate()

unix()

valueOf()

clone()

add()

subtract()

startOf()

endOf()

set()

year()

month()

date()

day()

hour()

minute()

second()

millisecond()

dayOfYear()

week()

quarter()

daysInMonth()

isLeapYear()

isValid()

isBefore()

isAfter()

isSame()

isBetween()

diff()

fromNow()

to()

### Static Methods

dates.now()

dates.parse()

dates.isValid()

dates.min()

dates.max()
