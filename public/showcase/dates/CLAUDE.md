# CLAUDE.md - Dates Module Showcase

This file provides guidance for working with Dates module showcase examples.

## Dates Module Overview

Accessed via `Domma.dates` or `D()` - provides Moment.js-style date manipulation.

## Date Operations

### Creating Dates

```javascript
D();                    // Current date/time
D('2025-12-25');        // Parse ISO string
D(1609459200000);       // From timestamp
D([2025, 11, 25]);      // From array [year, month, day]
```

### Manipulating Dates

```javascript
// Adding/subtracting time
D().add(7, 'days');
D().add(1, 'month');
D().subtract(2, 'hours');

// Start/end of periods
D().startOf('day');        // Midnight
D().startOf('month');      // First day of month
D().endOf('week');         // End of week

// Setting values
D().set('year', 2026);
D().set('month', 11);      // December (0-indexed)
D().set({hour: 14, minute: 30});
```

### Formatting Dates

```javascript
// Common formats
D().format();              // ISO 8601: '2025-12-10T10:30:00Z'
D().format('YYYY-MM-DD');  // '2025-12-10'
D().format('DD/MM/YYYY');  // '10/12/2025'
D().format('MMM DD, YYYY'); // 'Dec 10, 2025'
D().format('HH:mm:ss');    // '10:30:00'

// Timestamps
D().unix();                // Unix timestamp
D().toISOString();         // ISO string
```

### Getters

```javascript
D().year();       // 2025
D().month();      // 11 (December, 0-indexed)
D().date();       // 10
D().day();        // 3 (Wednesday, 0=Sunday)
D().hour();       // 10
D().minute();     // 30
D().second();     // 0
```

### Comparing Dates

```javascript
D('2025-12-25').isBefore('2026-01-01');  // true
D('2025-12-25').isAfter('2025-01-01');   // true
D('2025-12-25').isSame('2025-12-25');    // true
D('2025-12-25').isBetween('2025-01-01', '2026-01-01'); // true

// Difference between dates
D('2025-12-25').diff('2025-12-20', 'days'); // 5
D('2025-12-25').diff('2025-11-25', 'months'); // 1
```

### Relative Time

```javascript
D('2025-12-25').fromNow();      // 'in 15 days'
D('2025-11-01').fromNow();      // '39 days ago'
D('2025-12-25').from('2025-12-20'); // 'in 5 days'
D('2025-12-25').toNow();        // '15 days'
D('2025-12-25').to('2025-12-30'); // '5 days'
```

### Static Methods

```javascript
Domma.dates.now();              // Current timestamp
Domma.dates.parse('2025-12-25'); // Parse date string
Domma.dates.isValid('2025-12-25'); // true
Domma.dates.min(D('2025-01-01'), D('2025-12-31')); // Earlier date
Domma.dates.max(D('2025-01-01'), D('2025-12-31')); // Later date
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dates Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Dates Module Showcase</h1>

        <div class="demo-section">
            <h2>Date Manipulation</h2>
            <button id="demo-btn" class="btn">Show Date Operations</button>
            <div id="output"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        // Always use D() alias for dates
        $('#demo-btn').on('click', function() {
            const now = D();
            const future = D().add(7, 'days');
            const formatted = future.format('DD/MM/YYYY');

            $('#output').html(`
                <p>Now: ${now.format()}</p>
                <p>In 7 days: ${formatted}</p>
                <p>From now: ${future.fromNow()}</p>
            `);
        });
    </script>
</body>
</html>
```

## Common Use Cases

### Countdown Timer

```javascript
const target = D('2025-12-25');
const updateCountdown = () => {
    const now = D();
    const days = target.diff(now, 'days');
    const hours = target.diff(now, 'hours') % 24;

    $('#countdown').text(`${days} days, ${hours} hours`);
};

setInterval(updateCountdown, 1000);
```

### Date Range Picker

```javascript
const start = D().startOf('month');
const end = D().endOf('month');

$('#daterange').html(`
    ${start.format('MMM DD')} - ${end.format('MMM DD, YYYY')}
`);
```

### Relative Time Display

```javascript
const posts = [
    {title: 'Post 1', date: D().subtract(2, 'hours')},
    {title: 'Post 2', date: D().subtract(1, 'day')},
    {title: 'Post 3', date: D().subtract(7, 'days')}
];

posts.forEach(post => {
    console.log(`${post.title}: ${post.date.fromNow()}`);
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
